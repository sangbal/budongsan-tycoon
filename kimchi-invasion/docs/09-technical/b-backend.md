# 9-B. 백엔드 구성 - Supabase (Backend Configuration)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.4

[← 이전: Tech Stack](./09-a-tech-stack.md) | [다음: Performance →](./09-c-performance.md)

---

## 9.4. 백엔드 구성 (Supabase)

### 9.4.1. Supabase 서비스 활용 상세

```javascript
const SUPABASE_SERVICES = {
  // 인증
  auth: {
    providers: ['google', 'anonymous'],
    session_duration: 7 * 24 * 60 * 60, // 7일
    features: {
      auto_refresh: true,
      persist_session: true,
      email_confirmation: false, // 소셜 로그인만
    },
    policies: {
      max_sessions_per_user: 5,
      lockout_after_failures: 5,
      lockout_duration: 15 * 60, // 15분
    },
  },

  // 데이터베이스
  database: {
    tables: ['profiles', 'game_saves', 'leaderboard', 'achievements', 'blueprints'],
    features: {
      row_level_security: true,
      realtime: ['leaderboard'],
      triggers: ['updated_at_trigger'],
      indexes: ['leaderboard_score_idx', 'game_saves_user_idx'],
    },
  },

  // 실시간
  realtime: {
    channels: {
      leaderboard: {
        event: 'postgres_changes',
        table: 'leaderboard',
        filter: 'game_id=eq.kimchi-invasion',
      },
    },
    max_subscriptions_per_client: 5,
  },

  // 스토리지
  storage: {
    buckets: {
      avatars: { public: true, max_size: '500KB' },
      blueprints: { public: true, max_size: '50KB' },
      screenshots: { public: false, max_size: '2MB' },
    },
  },

  // Edge Functions
  edge_functions: {
    'validate-score': {
      purpose: '리더보드 점수 검증',
      triggers: ['leaderboard_insert', 'leaderboard_update'],
    },
    'prestige-reward': {
      purpose: '프레스티지 보상 계산',
      triggers: ['manual_call'],
    },
    'cheat-detection': {
      purpose: '치팅 탐지',
      triggers: ['periodic', 'score_anomaly'],
    },
  },
}
```

### 9.4.2. 데이터베이스 스키마 (전체)

```sql
-- ==============================================
-- 1. 확장 및 헬퍼 함수
-- ==============================================

-- UUID 생성 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 업데이트 타임스탬프 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 2. 핵심 테이블
-- ==============================================

-- 사용자 프로필
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT UNIQUE,
  nickname_lower TEXT GENERATED ALWAYS AS (LOWER(nickname)) STORED,
  avatar_url TEXT,
  title TEXT DEFAULT '신입 이주민',
  country_code CHAR(2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT nickname_length CHECK (char_length(nickname) BETWEEN 2 AND 20),
  CONSTRAINT nickname_format CHECK (nickname ~ '^[a-zA-Z0-9가-힣_]+$')
);

CREATE INDEX profiles_nickname_lower_idx ON profiles(nickname_lower);

-- 게임 저장 데이터
CREATE TABLE game_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL DEFAULT 'kimchi-invasion',
  slot_number INT NOT NULL DEFAULT 0,

  -- 저장 데이터 (JSONB)
  save_data JSONB NOT NULL,

  -- 검색용 인덱스 컬럼
  prestige_count INT DEFAULT 0,
  milestone INT DEFAULT 0,
  playtime_seconds INT DEFAULT 0,
  total_kimchi_produced BIGINT DEFAULT 0,

  -- 버전 및 무결성
  save_version TEXT NOT NULL,
  checksum TEXT NOT NULL,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, game_id, slot_number)
);

CREATE INDEX game_saves_user_game_idx ON game_saves(user_id, game_id);
CREATE INDEX game_saves_updated_idx ON game_saves(updated_at DESC);

-- 리더보드
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL DEFAULT 'kimchi-invasion',

  -- 점수 정보
  score_type TEXT NOT NULL DEFAULT 'total_kimchi',
  score BIGINT NOT NULL,

  -- 추가 정보
  prestige_count INT DEFAULT 0,
  fastest_prestige_seconds INT,
  max_spm INT,

  -- 검증
  is_verified BOOLEAN DEFAULT FALSE,
  verification_data JSONB,

  -- 타임스탬프
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, game_id, score_type)
);

CREATE INDEX leaderboard_score_idx ON leaderboard(game_id, score_type, score DESC);
CREATE INDEX leaderboard_prestige_idx ON leaderboard(game_id, prestige_count DESC);

-- 업적
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL DEFAULT 'kimchi-invasion',
  achievement_id TEXT NOT NULL,

  -- 진행 상태
  progress INT DEFAULT 0,
  target INT DEFAULT 1,

  -- 달성 정보
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, game_id, achievement_id)
);

CREATE INDEX achievements_user_game_idx ON achievements(user_id, game_id);
CREATE INDEX achievements_unlocked_idx ON achievements(game_id, achievement_id, unlocked);

-- 블루프린트 공유
CREATE TABLE blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL DEFAULT 'kimchi-invasion',

  -- 블루프린트 정보
  name TEXT NOT NULL,
  description TEXT,
  blueprint_data JSONB NOT NULL,
  thumbnail_url TEXT,

  -- 태그 및 검색
  tags TEXT[] DEFAULT '{}',
  category TEXT,

  -- 통계
  downloads INT DEFAULT 0,
  likes INT DEFAULT 0,

  -- 공개 설정
  is_public BOOLEAN DEFAULT TRUE,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX blueprints_public_idx ON blueprints(game_id, is_public, downloads DESC);
CREATE INDEX blueprints_tags_idx ON blueprints USING GIN(tags);

-- ==============================================
-- 3. 트리거 설정
-- ==============================================

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER game_saves_updated_at
  BEFORE UPDATE ON game_saves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leaderboard_updated_at
  BEFORE UPDATE ON leaderboard
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blueprints_updated_at
  BEFORE UPDATE ON blueprints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==============================================
-- 4. Row Level Security (RLS)
-- ==============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Game Saves
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saves"
  ON game_saves FOR ALL USING (auth.uid() = user_id);

-- Leaderboard
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard FOR SELECT USING (true);

CREATE POLICY "Users can manage own scores"
  ON leaderboard FOR ALL USING (auth.uid() = user_id);

-- Achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements"
  ON achievements FOR ALL USING (auth.uid() = user_id);

-- Blueprints
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public blueprints are viewable by everyone"
  ON blueprints FOR SELECT USING (is_public OR auth.uid() = user_id);

CREATE POLICY "Users can manage own blueprints"
  ON blueprints FOR ALL USING (auth.uid() = user_id);

-- ==============================================
-- 5. 뷰 및 함수
-- ==============================================

-- 리더보드 순위 뷰
CREATE OR REPLACE VIEW leaderboard_ranked AS
SELECT
  l.*,
  p.nickname,
  p.avatar_url,
  p.title,
  p.country_code,
  RANK() OVER (PARTITION BY l.game_id, l.score_type ORDER BY l.score DESC) as rank
FROM leaderboard l
JOIN profiles p ON l.user_id = p.id;

-- 전역 업적 달성률 함수
CREATE OR REPLACE FUNCTION get_achievement_stats(p_game_id TEXT)
RETURNS TABLE(
  achievement_id TEXT,
  total_unlocked BIGINT,
  total_players BIGINT,
  unlock_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.achievement_id,
    COUNT(*) FILTER (WHERE a.unlocked) as total_unlocked,
    COUNT(*) as total_players,
    ROUND(COUNT(*) FILTER (WHERE a.unlocked)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as unlock_rate
  FROM achievements a
  WHERE a.game_id = p_game_id
  GROUP BY a.achievement_id;
END;
$$ LANGUAGE plpgsql;
```

---

[← 이전: Tech Stack](./09-a-tech-stack.md) | [다음: Performance →](./09-c-performance.md)
