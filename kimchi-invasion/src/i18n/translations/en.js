/**
 * KIMCHI INVASION - English Translations
 */

export default {
  // Game Title
  title: 'KIMCHI INVASION',
  subtitle: 'The Red Planet Protocol',

  // Loading Screen
  loading: {
    state: 'Initializing game state...',
    save: 'Loading saved game...',
    renderer: 'Initializing renderer...',
    systems: 'Loading game systems...',
    ui: 'Setting up interface...',
    input: 'Configuring controls...',
    complete: 'Ready!',
  },

  // Common UI
  ui: {
    buttons: {
      start: 'Start',
      continue: 'Continue',
      newGame: 'New Game',
      settings: 'Settings',
      save: 'Save',
      load: 'Load',
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel',
      back: 'Back',
      build: 'Build',
      research: 'Research',
      export: 'Export',
    },
    tabs: {
      production: 'Production',
      logistics: 'Logistics',
      research: 'Research',
      export: 'Export',
      stats: 'Stats',
    },
  },

  // Resources
  resources: {
    categories: {
      utility: 'Utility',
      raw: 'Raw Materials',
      crop: 'Crops',
      processed: 'Processed',
      research: 'Research Resources',
    },

    // Utility
    dollars: {
      name: 'Dollars',
      desc: 'Basic currency of Mars economy. Earned through exports to Earth.',
    },
    energy: {
      name: 'Energy',
      desc: 'Power. Required for most building operations.',
    },
    oxygen: {
      name: 'Oxygen',
      desc: 'Life support. Auto-replenished.',
    },

    // Raw Materials
    iron: {
      name: 'Iron Ore',
      desc: 'Basic mineral of Mars. Essential for construction and crafting.',
    },
    water: {
      name: 'Water',
      desc: 'Source of life. Essential for agriculture and processing.',
    },
    salt: {
      name: 'Salt',
      desc: 'Key ingredient for kimchi brining. Extracted from water.',
    },
    ice: {
      name: 'Ice',
      desc: 'Ice from Mars poles. Melts into water.',
    },
    regolith: {
      name: 'Regolith',
      desc: 'Mars surface soil. Used in agriculture.',
    },
    sand: {
      name: 'Sand',
      desc: 'Used for glass production and construction.',
    },

    // Crops
    cabbage: {
      name: 'Cabbage',
      desc: 'Main ingredient of kimchi. Grown in greenhouse.',
    },
    radish: {
      name: 'Radish',
      desc: 'Main ingredient of kkakdugi. Grows quickly.',
    },
    garlic: {
      name: 'Garlic',
      desc: 'Essential kimchi seasoning ingredient.',
    },
    ginger: {
      name: 'Ginger',
      desc: 'Kimchi seasoning. Adds unique aroma.',
    },
    scallion: {
      name: 'Scallion',
      desc: 'Main ingredient for pa-kimchi. Quick production.',
    },
    cucumber: {
      name: 'Cucumber',
      desc: 'Main ingredient for oi-sobagi. For premium kimchi.',
    },
    chilliPowder: {
      name: 'Chilli Powder',
      desc: 'Creates the spicy taste and red color of kimchi.',
    },

    // Processed (Kimchi)
    kimchi: {
      name: 'Kimchi',
      desc: 'Basic kimchi. Optimized for mass production.',
    },
    kkakdugi: {
      name: 'Kkakdugi',
      desc: 'Radish kimchi. Fast production possible.',
    },
    paKimchi: {
      name: 'Pa-Kimchi',
      desc: 'Scallion kimchi. Ultra-fast production.',
    },
    oiSobagi: {
      name: 'Oi-Sobagi',
      desc: 'Premium kimchi. Exported at highest price.',
    },
    premiumKimchi: {
      name: 'Aged Kimchi',
      desc: 'Long-fermented kimchi. High value.',
    },
    omegaKimchi: {
      name: 'Omega Kimchi',
      desc: 'Premium kimchi fermented with Omega starter. Endgame content.',
    },

    // Research Resources
    lactobacillusData: {
      name: 'Lactobacillus Data',
      desc: 'Required for Tier 1-2 research. Obtained from kimchi analysis.',
    },
    fermentCulture: {
      name: 'Ferment Culture',
      desc: 'Required for Tier 3-4 research. Extracted from aged kimchi.',
    },
    omegaStarter: {
      name: 'Omega Starter',
      desc: 'Required for Tier 5 research. Rare resources needed.',
    },
  },

  // Buildings
  buildings: {
    categories: {
      mining: 'Mining',
      agriculture: 'Agriculture',
      processing: 'Processing',
      storage: 'Storage',
      power: 'Power',
      logistics: 'Logistics',
    },
    names: {
      miner: 'Miner',
      iceExtractor: 'Ice Extractor',
      greenhouse: 'Greenhouse',
      fermentationTank: 'Fermentation Tank',
      warehouse: 'Warehouse',
      solarPanel: 'Solar Panel',
      conveyor: 'Conveyor',
    },
  },

  // Research
  research: {
    title: 'Research',
    tier: 'Tier {tier}',
    status: {
      locked: 'Locked',
      available: 'Available',
      researching: 'Researching',
      completed: 'Completed',
    },
    actions: {
      start: 'Start Research',
      cancel: 'Cancel',
    },
    cost: 'Cost',
    time: 'Research Time',
    effects: 'Effects',
    prerequisites: 'Prerequisites',
    progress: 'Progress',
    remaining: 'Remaining',
    categories: {
      production: 'Production Tech',
      efficiency: 'Efficiency',
      automation: 'Automation',
      quality: 'Quality',
    },
  },

  // Technologies
  technologies: {
    efficientDrills: {
      name: 'Efficient Drills',
      desc: 'Mining equipment optimization increases mining speed by 20%.',
    },
    improvedFarming: {
      name: 'Improved Farming',
      desc: 'Agricultural technology advancement increases crop growth by 20%.',
    },
    advancedFermentation: {
      name: 'Advanced Fermentation',
      desc: 'Fermentation process optimization increases fermentation speed by 30%.',
    },
    solarPanels: {
      name: 'Solar Panels',
      desc: 'Unlocks solar panel construction.',
    },
    waterRecycling: {
      name: 'Water Recycling',
      desc: 'Reduces water consumption by 25%.',
    },
    conveyorSpeed: {
      name: 'Conveyor Speed',
      desc: 'Increases conveyor speed by 50%.',
    },
    automatedHarvest: {
      name: 'Automated Harvest',
      desc: 'Enables automated harvesting and increases farming efficiency by 30%.',
    },
    batteryStorage: {
      name: 'Battery Storage',
      desc: 'Doubles energy storage capacity.',
    },
    premiumFermentation: {
      name: 'Premium Fermentation',
      desc: 'Unlocks premium kimchi (aged kimchi) production.',
    },
    quantumStorage: {
      name: 'Quantum Storage',
      desc: 'Triples storage capacity.',
    },
    efficientPower: {
      name: 'Efficient Power',
      desc: 'Reduces power consumption by 40%.',
    },
    omegaKimchi: {
      name: 'Omega Kimchi',
      desc: 'Unlocks omega kimchi production.',
    },
    massProduction: {
      name: 'Mass Production',
      desc: 'Increases all production by 100%.',
    },
    spaceLogistics: {
      name: 'Space Logistics',
      desc: 'Increases export efficiency by 200%.',
    },
    basicAutomation: {
      name: 'Basic Automation',
      desc: 'Increases processing speed by 25%.',
    },
  },

  // Prestige
  prestige: {
    title: 'Interstellar Migration',
    subtitle: 'Travel to a new planet',
    loadout: 'Select Loadout',
    slots: '{count} slots',
    planet: {
      preview: 'Planet Preview',
      regenerate: 'Regenerate',
      depart: 'Depart!',
    },
    stats: {
      iron: 'Iron',
      ice: 'Ice',
      fertility: 'Fertility',
      rare: 'Rare Resources',
      terrain: 'Terrain',
    },
    levels: {
      scarce: 'Scarce',
      low: 'Low',
      normal: 'Normal',
      abundant: 'Abundant',
      rich: 'Very Rich',
    },
  },

  // Achievements
  achievements: {
    title: 'Achievements',
    unlocked: 'Unlocked!',
  },

  // Settings
  settings: {
    title: 'Settings',
    language: 'Language',
    sound: 'Sound Effects',
    music: 'Background Music',
    notifications: 'Notifications',
    autoSave: 'Auto Save',
    reset: 'Reset Game',
    resetConfirm: 'Are you sure you want to delete all progress?',
    graphics: 'Graphics',
    pixelEffect: 'Pixel Effect',
    particles: 'Particles',
    volume: 'Volume',
    master: 'Master',
    sfx: 'SFX',
    bgm: 'BGM',
    tutorialReplay: 'Replay Tutorial',
  },

  // Tutorial
  tutorial: {
    skip: 'Skip',
    skip_confirm: 'Are you sure you want to skip the tutorial?',
    continue: 'Continue',
    start_game: 'Start Game',
    rewards: 'Rewards',

    // Prologue
    prologue: {
      title: 'KIMCHI INVASION',
      text1: '2087, Year 2 of human Mars settlement.',
      text2: 'You are a bio-engineer from Korea Biotechnology Research Institute.',
      text3:
        "To solve the crew's declining immunity, you must build Mars' first kimchi production facility.",
      text4:
        'Survive the harsh Martian environment and eventually export kimchi back to Earth - that is your mission.',
    },

    // Epilogue
    epilogue: {
      title: 'Tutorial Complete!',
      text1: 'Congratulations! You have successfully produced your first kimchi on Mars.',
      text2: 'Now freely expand your production lines and build your Mars Kimchi Empire!',
    },

    // Step 1: Manual Resource Collection
    step1: {
      title: 'Manual Resource Collection',
      desc: 'Click the screen to collect 5 Ice and 5 Regolith.',
    },

    // Step 2: First Building Placement
    step2: {
      title: 'First Building Placement',
      desc: 'Place 1 Miner and 1 Ice Melter each.',
    },

    // Step 3: First Crop Cultivation
    step3: {
      title: 'First Crop Cultivation',
      desc: 'Place a Greenhouse and grow 5 Cabbage.',
    },

    // Step 4: Logistics System
    step4: {
      title: 'Logistics System',
      desc: 'Connect buildings with Conveyor Belts.',
    },

    // Step 5: First Kimchi Production
    step5: {
      title: 'First Kimchi Production!',
      desc: 'Connect Cabbage -> Brining Station -> Fermentation Tank to produce kimchi.',
    },

    // Legacy tips
    welcome: 'Welcome to Mars, Engineer!',
    firstMiner: 'Place a miner to collect iron ore.',
    firstGreenhouse: 'Build a greenhouse to grow cabbage.',
    firstKimchi: 'You produced your first kimchi!',
    firstExport: 'Start your first export to Earth.',
  },

  // Errors
  errors: {
    saveFailed: 'Failed to save.',
    loadFailed: 'Failed to load.',
    unsupportedBrowser: 'Please use a modern browser to play this game.',
    notEnoughResources: 'Not enough resources.',
    cannotBuildHere: 'Cannot build here.',
  },

  // Notifications
  notifications: {
    saved: 'Game saved.',
    achieved: 'Achievement unlocked: {name}',
    levelUp: 'Level Up!',
  },
}
