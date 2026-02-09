-- Referral System (ClickSurvivor)
-- User referral/invite system with fraud prevention
-- Run this once in Supabase SQL Editor (dev/prod separately).

-- Create referral_codes table
-- Each user gets one unique referral code per game
create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  referral_code text not null,  -- 8-character unique code (e.g., 'AB12CD34')
  created_at timestamptz not null default now(),
  -- Global unique constraint: referral_code per game_slug
  unique (game_slug, referral_code),
  -- One code per user per game
  unique (game_slug, user_id)
);

-- Create referral_relationships table
-- Tracks who referred whom
create table if not exists public.referral_relationships (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null,
  referrer_id uuid not null references auth.users(id) on delete cascade,  -- Person who invited
  referee_id uuid not null references auth.users(id) on delete cascade,   -- Person who was invited
  referral_code text not null,  -- Code used for referral
  created_at timestamptz not null default now(),
  -- One referrer per referee per game (can't be referred twice)
  unique (game_slug, referee_id),
  -- Prevent self-referral: CHECK constraint
  constraint no_self_referral check (referrer_id != referee_id)
);

-- Create referral_milestones table
-- Tracks milestone achievements for referrers (e.g., referee reached tower_count=1)
create table if not exists public.referral_milestones (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null,
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referee_id uuid not null references auth.users(id) on delete cascade,
  milestone_type text not null,  -- e.g., 'tower_1', 'tower_5', 'playtime_1h'
  milestone_value bigint not null,  -- e.g., 1, 5, 3600000
  achieved_at timestamptz not null default now(),
  -- One milestone per referrer-referee-type per game
  unique (game_slug, referrer_id, referee_id, milestone_type)
);

-- Indexes for efficient queries

-- Referral codes: lookup by code
create index if not exists idx_referral_codes_game_slug_code
  on public.referral_codes(game_slug, referral_code);

-- Referral codes: lookup by user_id
create index if not exists idx_referral_codes_user_id
  on public.referral_codes(user_id);

-- Referral relationships: lookup referrer's referees
create index if not exists idx_referral_relationships_referrer
  on public.referral_relationships(game_slug, referrer_id);

-- Referral relationships: lookup referee's referrer
create index if not exists idx_referral_relationships_referee
  on public.referral_relationships(game_slug, referee_id);

-- Referral milestones: lookup by referrer
create index if not exists idx_referral_milestones_referrer
  on public.referral_milestones(game_slug, referrer_id);

-- Referral milestones: lookup by referee (for checking achievement)
create index if not exists idx_referral_milestones_referee
  on public.referral_milestones(game_slug, referee_id, milestone_type);

-- Enable Row Level Security

alter table public.referral_codes enable row level security;
alter table public.referral_relationships enable row level security;
alter table public.referral_milestones enable row level security;

-- Policies: referral_codes

drop policy if exists "referral_codes_select_all" on public.referral_codes;
create policy "referral_codes_select_all"
on public.referral_codes
for select
to authenticated, anon
using (true);

drop policy if exists "referral_codes_insert_own" on public.referral_codes;
create policy "referral_codes_insert_own"
on public.referral_codes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "referral_codes_update_own" on public.referral_codes;
create policy "referral_codes_update_own"
on public.referral_codes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "referral_codes_delete_own" on public.referral_codes;
create policy "referral_codes_delete_own"
on public.referral_codes
for delete
to authenticated
using (auth.uid() = user_id);

-- Policies: referral_relationships

drop policy if exists "referral_relationships_select_own" on public.referral_relationships;
create policy "referral_relationships_select_own"
on public.referral_relationships
for select
to authenticated
using (auth.uid() = referrer_id OR auth.uid() = referee_id);

drop policy if exists "referral_relationships_insert_own" on public.referral_relationships;
create policy "referral_relationships_insert_own"
on public.referral_relationships
for insert
to authenticated
with check (auth.uid() = referee_id);  -- Only referee can create relationship

-- No update/delete allowed (immutable once created)

-- Policies: referral_milestones

drop policy if exists "referral_milestones_select_own" on public.referral_milestones;
create policy "referral_milestones_select_own"
on public.referral_milestones
for select
to authenticated
using (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- Insert/Update/Delete only via RPC functions (no direct access)

-- RPC Function: Generate referral code
-- Generates a unique 8-character referral code for the user
DROP FUNCTION IF EXISTS public.generate_referral_code(text, uuid);

CREATE OR REPLACE FUNCTION public.generate_referral_code(
  p_game_slug text,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code text;
  v_exists boolean;
  v_attempts integer := 0;
  v_max_attempts integer := 10;
BEGIN
  -- Check if user already has a code
  SELECT EXISTS (
    SELECT 1 FROM public.referral_codes
    WHERE game_slug = p_game_slug
      AND user_id = p_user_id
  ) INTO v_exists;

  IF v_exists THEN
    -- Return existing code
    SELECT referral_code INTO v_code
    FROM public.referral_codes
    WHERE game_slug = p_game_slug
      AND user_id = p_user_id
    LIMIT 1;

    RETURN jsonb_build_object(
      'success', true,
      'code', v_code,
      'message', 'Existing code returned'
    );
  END IF;

  -- Generate new unique code (retry up to max_attempts)
  LOOP
    -- Generate 8-character alphanumeric code (uppercase + numbers)
    v_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));

    -- Check if code already exists
    SELECT EXISTS (
      SELECT 1 FROM public.referral_codes
      WHERE game_slug = p_game_slug
        AND referral_code = v_code
    ) INTO v_exists;

    EXIT WHEN NOT v_exists OR v_attempts >= v_max_attempts;

    v_attempts := v_attempts + 1;
  END LOOP;

  -- If we couldn't find a unique code, fail
  IF v_exists THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'generation_failed',
      'message', 'Failed to generate unique code'
    );
  END IF;

  -- Insert new code
  INSERT INTO public.referral_codes (
    game_slug,
    user_id,
    referral_code
  )
  VALUES (
    p_game_slug,
    p_user_id,
    v_code
  );

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'message', 'New code generated'
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'already_exists',
      'message', 'User already has a referral code'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown',
      'message', SQLERRM
    );
END;
$$;

-- RPC Function: Apply referral code
-- Referee uses referrer's code to create relationship
DROP FUNCTION IF EXISTS public.apply_referral_code(text, text, uuid);

CREATE OR REPLACE FUNCTION public.apply_referral_code(
  p_game_slug text,
  p_referral_code text,
  p_referee_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_id uuid;
  v_already_referred boolean;
BEGIN
  -- Check if referee already has a referrer
  SELECT EXISTS (
    SELECT 1 FROM public.referral_relationships
    WHERE game_slug = p_game_slug
      AND referee_id = p_referee_id
  ) INTO v_already_referred;

  IF v_already_referred THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'already_referred',
      'message', 'You have already been referred by someone'
    );
  END IF;

  -- Find referrer by code
  SELECT user_id INTO v_referrer_id
  FROM public.referral_codes
  WHERE game_slug = p_game_slug
    AND referral_code = p_referral_code
  LIMIT 1;

  IF v_referrer_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'invalid_code',
      'message', 'Invalid referral code'
    );
  END IF;

  -- Prevent self-referral (double-check, also enforced by CHECK constraint)
  IF v_referrer_id = p_referee_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'self_referral',
      'message', 'You cannot use your own referral code'
    );
  END IF;

  -- Create referral relationship
  INSERT INTO public.referral_relationships (
    game_slug,
    referrer_id,
    referee_id,
    referral_code
  )
  VALUES (
    p_game_slug,
    v_referrer_id,
    p_referee_id,
    p_referral_code
  );

  RETURN jsonb_build_object(
    'success', true,
    'referrer_id', v_referrer_id,
    'message', 'Referral code applied successfully'
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'already_referred',
      'message', 'You have already been referred by someone'
    );
  WHEN check_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'self_referral',
      'message', 'You cannot use your own referral code (check constraint)'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown',
      'message', SQLERRM
    );
END;
$$;

-- RPC Function: Record referral milestone
-- Called when referee achieves a milestone (e.g., first prestige)
DROP FUNCTION IF EXISTS public.record_referral_milestone(text, uuid, uuid, text, bigint);

CREATE OR REPLACE FUNCTION public.record_referral_milestone(
  p_game_slug text,
  p_referrer_id uuid,
  p_referee_id uuid,
  p_milestone_type text,
  p_milestone_value bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_already_achieved boolean;
BEGIN
  -- Check if milestone already achieved
  SELECT EXISTS (
    SELECT 1 FROM public.referral_milestones
    WHERE game_slug = p_game_slug
      AND referrer_id = p_referrer_id
      AND referee_id = p_referee_id
      AND milestone_type = p_milestone_type
  ) INTO v_already_achieved;

  IF v_already_achieved THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'already_achieved',
      'message', 'Milestone already achieved'
    );
  END IF;

  -- Insert milestone
  INSERT INTO public.referral_milestones (
    game_slug,
    referrer_id,
    referee_id,
    milestone_type,
    milestone_value
  )
  VALUES (
    p_game_slug,
    p_referrer_id,
    p_referee_id,
    p_milestone_type,
    p_milestone_value
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Milestone recorded'
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'already_achieved',
      'message', 'Milestone already achieved (race condition)'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown',
      'message', SQLERRM
    );
END;
$$;

-- RPC Function: Get my referral stats
-- Returns referrer's code, referee count, and milestone count
DROP FUNCTION IF EXISTS public.get_referral_stats(text, uuid);

CREATE OR REPLACE FUNCTION public.get_referral_stats(
  p_game_slug text,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code text;
  v_referee_count integer;
  v_milestone_count integer;
BEGIN
  -- Get referral code
  SELECT referral_code INTO v_code
  FROM public.referral_codes
  WHERE game_slug = p_game_slug
    AND user_id = p_user_id
  LIMIT 1;

  -- Count referees
  SELECT COUNT(*) INTO v_referee_count
  FROM public.referral_relationships
  WHERE game_slug = p_game_slug
    AND referrer_id = p_user_id;

  -- Count milestones
  SELECT COUNT(*) INTO v_milestone_count
  FROM public.referral_milestones
  WHERE game_slug = p_game_slug
    AND referrer_id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'referee_count', COALESCE(v_referee_count, 0),
    'milestone_count', COALESCE(v_milestone_count, 0)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown',
      'message', SQLERRM
    );
END;
$$;

-- RPC Function: Get referee milestones (for referrer's dashboard)
-- Returns list of milestones achieved by referrer's referees
DROP FUNCTION IF EXISTS public.get_referee_milestones(text, uuid);

CREATE OR REPLACE FUNCTION public.get_referee_milestones(
  p_game_slug text,
  p_referrer_id uuid
)
RETURNS TABLE (
  referee_id uuid,
  milestone_type text,
  milestone_value bigint,
  achieved_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rm.referee_id,
    rm.milestone_type,
    rm.milestone_value,
    rm.achieved_at
  FROM public.referral_milestones rm
  WHERE rm.game_slug = p_game_slug
    AND rm.referrer_id = p_referrer_id
  ORDER BY rm.achieved_at DESC;
END;
$$;
