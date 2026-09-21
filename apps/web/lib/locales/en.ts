import type { TranslationSchema } from './ru';

export const en: TranslationSchema = {
  brand: 'Auto Industry Tycoon',
  subtitle: 'Economic Strategy Simulator of the Automobile Industry (1900–2026)',
  brandCompany: 'Your Company',

  // Nav
  nav: {
    dashboard: 'Executive Office',
    production: 'Factory & Production',
    vehicleDesign: 'Vehicle Design',
    research: 'R&D & Technology',
    markets: 'Markets & Sales',
    bank: 'Bank & Financing',
    reports: 'Quarterly Reports',
  },

  // Materials
  materials: {
    steel: 'Steel & Iron',
    steelModern: 'Automotive Sheet Steel',
    wood: 'Hardwood Timber',
    woodModern: 'Decorative Wood & Veneer',
    rubber: 'Natural Caoutchouc',
    rubberModern: 'Synthetic Rubber & Tires',
    leather: 'Leather & Upholstery',
    aluminum: 'Aluminum',
    plastic: 'Plastics & Polymers',
    descriptions: {
      steelEarly: 'Primary metal for engine blocks, chassis ladder frames, leaf springs, and solid axles.',
      steelModern: 'High-tensile stamped sheet steel for unitized unibody bodies and assemblies.',
      woodEarly: 'Crucial 1900–1920s carriage material: wooden frames, wheel spokes, and firewall dash.',
      woodModern: 'Decorative fine veneers and dashboard trim for upscale executive saloons.',
      rubberEarly: 'Colonial plantation latex for early solid and pneumatic tires, seals, and drive belts.',
      rubberModern: 'Synthetic styrene-butadiene elastomers (Buna/GR-S) and modern vulcanized tire compounds.',
      leather: 'Upholstery material for open carriage benches and folding convertible roofs.',
      aluminum: 'Lightweight alloy that reduces vehicular weight and improves performance.',
      plastic: '1950s polymer revolution: cost-effective interior panels replacing heavy timber.',
    },
    units: {
      steel: 'kg',
      wood: 'units',
      rubber: 'kg',
      leather: 'sq.m',
      aluminum: 'kg',
      plastic: 'kg',
    },
  },

  // Timeline & Topbar
  topbar: {
    year: 'Year',
    quarter: 'Quarter',
    quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
    month: 'Month',
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    eraPioneers: 'Pioneering Era (1900–1914)',
    eraMassProduction: 'Assembly Line Era (1915–1929)',
    eraModern: 'Modern Era',
    cash: 'Capital',
    lastProfit: 'Annual Profit',
    reputation: 'Reputation',
    worldRank: 'World Ranking',
    worldRankLabel: 'World Rank',
    endTurn: 'End Year',
    simulating: 'Simulating Year...',
    turnProgress: 'Turn {turn} of 127 (1900–2026)',
    setupCompanyBtn: 'Brand Passport',
    unitsQuarter: 'cars/yr',
    latestGazette: 'Latest Gazette',
    worldRankingBtn: 'Sales Ranking',
  },

  // Countries
  countries: {
    usa: { name: 'USA', flag: '🇺🇸', description: 'Vast rapidly expanding domestic market, focus on practicality, interchangeable parts, and mass production.' },
    germany: { name: 'Germany', flag: '🇩🇪', description: 'Birthplace of the automobile (Benz & Daimler), precision mechanical engineering, and prestige heritage.' },
    france: { name: 'France', flag: '🇫🇷', description: 'Early motor racing capital of the world, bespoke coachwork ateliers, and bold design innovation.' },
    uk: { name: 'United Kingdom', flag: '🇬🇧', description: 'Metropole of the British Empire, storied coachbuilding tradition, and rugged leaf-spring chassis.' },
  },

  // Founder Perks
  founderPerks: {
    mechanic: {
      name: 'Master Mechanic',
      badge: '🔧 Engineering',
      description: '+15% base reliability on all engineered cars; +1 month speed bonus on engine and chassis R&D projects.',
    },
    merchant: {
      name: 'Resourceful Merchant',
      badge: '💰 Commerce',
      description: '-15% wholesale discount on all market materials; +10% trading profit margin on car sales revenue.',
    },
    coachbuilder: {
      name: 'Hereditary Coachbuilder',
      badge: '👑 Prestige',
      description: '+15% comfort and prestige bonus on vehicle bodies; -25% savings on wood and leather materials.',
    },
  },

  // Powertrains & Fuels
  powertrains: {
    all: 'All Powertrains',
    ice: 'ICE (Gas / Ethanol)',
    steam: 'Steam Engine 💨',
    electric: 'Electric Traction ⚡',
  },
  fuels: {
    gasoline: 'Gasoline',
    ethanol_blend: 'Ethanol Blend (Alcohol)',
    steam_fuel: 'Coal & Water (Steam)',
    electricity: 'Storage Battery (EV)',
  },
  crankWarning: '⚠️ Manual hand-crank start: hazard of severe kickback injury, -10 comfort penalty (until Kettering electric starter in 1912)',

  // Company Setup
  companySetup: {
    title: 'Founding Your Motor Company (Year 1900)',
    subtitle: 'Forge your automotive legacy at the turn of the 20th century: select your nation, heraldic emblem, and founder specialization.',
    nameLabel: 'Company / Marque Name',
    namePlaceholder: 'e.g., Detroit Motor Carriage Works',
    countryLabel: 'Founding Nation & Home Factory',
    perkLabel: 'Founder Background & Specialization',
    badgeLabel: 'Heraldic Badge & Crest',
    badgeColor: 'Emblem Color',
    badgeShape: 'Shield Shape',
    badgeIcon: 'Heraldic Icon',
    submitBtn: 'Incorporate & Begin Era (1900 Q1)',
    reconfigureBtn: 'Brand Crest & Passport',
  },

  // Competitors
  competitors: {
    title: 'Global Automakers & Benchmarks',
    subtitle: 'Historic industrial rivals, market shares, signature vehicles, and disruptive historical turning points.',
    marketShare: 'Regional Market Share',
    activeModels: 'Competitor Lineup',
    milestonesTitle: 'Historical Milestones & Disruption',
    speedBenchmark: 'Segment Benchmark',
    price: 'Price',
    appeal: 'Appeal',
  },

  // Dashboard
  dashboard: {
    title: 'Executive Director Office',
    companyStats: 'Company Key Metrics',
    capacity: 'Factory Capacity',
    unitsMonth: 'cars/qtr',
    activeResearchCount: 'Active Research',
    latestReport: 'Previous Quarter Financial Summary',
    revenue: 'Revenue',
    expenses: 'Expenses',
    profit: 'Net Profit',
    carsSold: 'Cars Sold',
    noReport: 'First quarter is not finished yet. Click "End Quarter" above.',
    activeModelsSummary: 'Production Line Models',
    quickNav: 'Quick Navigation',
    availableCashHint: 'Available in treasury',
    capacityHint: 'Assembly line ceiling',
    reputationHint: 'Brand prestige across markets',
    researchHint: 'Active R&D projects',
    createModel: '+ Create New Model →',
    unitCostLabel: 'Cost',
    priceLabel: 'Price',
  },

  // Vehicle Design
  design: {
    title: 'Vehicle Design Bureau',
    subtitle: 'Design new models, choose components and calculate unit manufacturing costs.',
    step1: '1. Model Name & Target Class',
    modelName: 'Model Name',
    modelNamePlaceholder: 'e.g.: Model T Runabout',
    segment: 'Vehicle Class',
    segments: {
      economy: {
        name: 'Economy (Standard)',
        tag: 'Runabout',
        description: 'Affordable, simple personal transport for working families.',
      },
      family: {
        name: 'Family',
        tag: 'Tourer',
        description: 'Spacious carriage with balanced comfort and reliability.',
      },
      luxury: {
        name: 'Luxury',
        tag: 'Town Car',
        description: 'Exclusive hand-crafted vehicle for high-society prestige.',
      },
      utility: {
        name: 'Utility',
        tag: 'Work Truck',
        description: 'Heavy-duty transport for trade, cargo, and rural commerce.',
      },
    },
    step2: '2. Component Selection',
    requiresTech: 'Requires technology',
    step3: '3. Production Quota & Launch',
    initialQuotaLabel: 'Initial Annual Production Quota',
    initialQuotaHint: 'Specify how many cars of this model your workshop should assemble annually (can be changed anytime in Factory & Production).',
    availableCapacity: 'Available Factory Capacity',
    unitsMonth: 'cars/yr',
    submitBtn: 'Approve & Put Into Production',
    savingBtn: 'Saving Model & Queuing Production...',
    successMsg: 'Model successfully designed and added to production line!',
    specsTitle: 'Vehicle Specifications',
    financeTitle: 'Unit Economics',
    productionCost: 'Unit Production Cost',
    salePrice: 'Retail Sale Price ($)',
    unitProfit: 'Margin per Unit',
    marketAppeal: 'Regional Market Appeal',
    marketAppealHint: 'Customer satisfaction baseline across global regions:',
    factoryCapacityHint: 'factory assembly capacity',
    materialConsumptionHint: 'Raw material requirements to assemble one vehicle of this model:',
    existingModels: 'Active Company Models',
    discontinuedModels: 'Discontinued Models (Archive)',
    noModels: 'Your company has not designed any models yet.',
    decommissionBtn: 'Discontinue Model',
    activateBtn: 'Resume Production',
    deleteModelBtn: 'Delete Blueprint',
    discontinuedBadge: 'Discontinued',
    confirmDecommission: 'Discontinue this vehicle model? Production quota will be cleared and factory capacity freed.',
    confirmDelete: 'Are you sure you want to permanently delete this model blueprint?',
    categories: {
      chassis: 'Chassis & Frame',
      engine: 'Engine',
      brakes: 'Brake System',
      comfort: 'Body & Cabin',
      package: 'Equipment Package',
    },
    stats: {
      reliability: 'Reliability',
      comfort: 'Comfort',
      performance: 'Power / Performance',
      efficiency: 'Efficiency',
      prestige: 'Prestige',
      complexity: 'Assembly Complexity',
    },
  },

  // Production & Logistics
  production: {
    title: 'Factory & Supply Chain Operations',
    subtitle: 'Manage manufacturing plants, allocate assembly lines, and procure raw materials.',
    factoryTitle: 'Current Automobile Plant',
    level: 'Plant Level',
    capacity: 'Annual Capacity',
    capacityUsed: 'Capacity Utilization',
    overheadMonthly: 'Plant Overhead per Year',
    premisesRent: 'Premises & Land Rent',
    premisesRentHint: 'Workshop & land rent grows from $100 in 1900 to $100,000 by 2020',
    modelAgeBadge: {
      fresh: 'Fresh',
      mature: 'Mature',
      aging: 'Aging',
      obsolete: 'Obsolete',
    },
    expandBtn: 'Expand Workshop (+16 cars/yr)',
    upgradeCost: 'Expansion Cost',
    insufficientFunds: 'Insufficient corporate capital for factory expansion!',
    plantExpanded: 'Plant expanded! Production capacity increased.',
    linesTitle: 'Assembly Line Quota Allocation',
    noModels: 'No designed models available. First create a model in the Vehicle Designer.',
    plannedUnits: 'Production Quota (cars/yr)',
    savePlanBtn: 'Save Production Plan',
    planSaved: 'Production plan updated successfully!',
    distributeByDemand: 'By Demand',
    distributeByDemandHint: 'Distribute factory quotas proportionally to market demand for each model',
    planDistributedByDemand: 'Model quotas successfully distributed in accordance with market demand!',
    costPerUnit: 'Unit Assembly Cost',
    totalCost: 'Total Production Budget',
    materialsRequiredPerUnit: 'Materials per 1 Car',
    warehouseTitle: 'Raw Materials Warehouse & Commodity Market',
    autoProcurement: 'Automatic Material Procurement (Just-In-Time)',
    autoProcurementHint: 'Automatically purchases required raw materials from the market right before production begins.',
    inStock: 'In Warehouse Stock',
    marketPrice: 'Procurement Price',
    needNextMonth: 'Demand for Next Year',
    buyBatchBtn: 'Buy Batch',
    shortageAlert: 'Warning! Warehouse does not have sufficient materials to meet the production quota. Production will be throttled unless auto-procurement is enabled or materials are bought!',
    shortageHint: 'For uninterrupted assembly, enable Just-In-Time automated procurement below.',
    overCapacityWarning: 'Total planned production exceeds factory assembly capacity! Production will be throttled to plant ceiling.',
    historicalPlantSubtitle: 'Historical carriage manufacture and horseless carriage assembly plant',
    planSubtitle: 'Assign annual output quotas for models on assembly lines',
    warehouseSubtitle: 'Raw material stockpiles and procurement on the commodity exchange',
    insufficientFundsBatch: 'Insufficient company funds to purchase this batch!',
    materialBought: 'Materials purchased and added to warehouse inventory!',
    autoProcurementUpdated: 'Auto-procurement setting updated!',
    yearAvailable: 'Available from Year',
    unitsShort: 'pcs.',
  },

  // Bank
  bank: {
    title: 'Commercial Automotive Bank',
    subtitle: 'Credit facilities, investment loans, and corporate debt management.',
    offersTitle: 'Available Credit Facilities',
    activeTitle: 'Active Debt Obligations',
    noLoans: 'Your company has no outstanding debts.',
    takeLoan: 'Take Loan',
    repayLoan: 'Repay in Full',
    amount: 'Loan Amount',
    term: 'Term',
    months: 'mo.',
    monthlyRate: 'Monthly Interest',
    monthlyPayment: 'Monthly Payment',
    remaining: 'Remaining Principal',
    remainingMonths: 'Months Remaining',
    insufficientFunds: 'Insufficient company funds for full repayment!',
    loanTaken: 'Loan proceeds deposited into company treasury!',
    loanRepaid: 'Loan obligation settled completely!',
    warning: 'Loan payments are deducted automatically at the end of each month as part of company expenses.',
  },

  // Markets
  markets: {
    title: 'Global Markets & Demand',
    subtitle: 'Regional consumer demographics and purchasing preferences.',
    marketShare: 'Market Share',
    preferencesTitle: 'Regional Consumer Preferences:',
    size: 'Market Size',
    priceSensitivity: 'Price Sensitivity',
    prestigeSensitivity: 'Prestige Sensitivity',
    units: 'cars',
  },

  // Regions
  regions: {
    'north-america': 'North America',
    europe: 'Europe',
    'middle-east': 'Middle East',
  },

  // Research
  research: {
    title: 'Research & Development Center (R&D)',
    subtitle: 'Innovate cutting-edge components, metallurgy and assembly techniques.',
    startBtn: 'Begin Research',
    starting: 'Starting research...',
    year: 'Available Year',
    status: 'Status',
    statuses: {
      locked: 'Locked',
      available: 'Available',
      researching: 'Researching',
      completed: 'Completed',
    },
    budgetMonth: 'Monthly Budget',
  },

  // Reports
  reports: {
    title: 'Quarterly Performance Archive',
    subtitle: 'Historical ledger of corporate financials, sales and factory output.',
    noReports: 'No quarterly reports on file. Advance past the first quarter.',
    produced: 'Produced',
    sold: 'Sold',
    revenue: 'Revenue',
    expenses: 'Expenses',
    profit: 'Net Profit',
    loansPaid: 'Debt Service',
    salesByRegion: 'Sales by Region:',
    competitorNews: 'Competitor & Market Dispatches:',
  },

  // Technologies
  technologies: {
    'standardized-steering-wheel': {
      name: 'Standardized Steering Wheel',
      description: 'Improves handling consistency and driver confidence.',
    },
    'steam-condenser': {
      name: 'Closed-Loop Steam Condenser',
      description: 'Recycles boiler steam, drastically extending range without refilling water.',
    },
    'ethanol-carburetor': {
      name: 'Dual-Fuel Ethanol Carburetor',
      description: 'Enables rural motorists to fuel up on farm alcohol/ethanol before Prohibition.',
    },
    'edison-nickel-iron-battery': {
      name: 'Edison Nickel-Iron Battery',
      description: 'Durable alkaline cells offering cleaner, silent operation for early electric cars.',
    },
    'mechanical-brake-upgrade': {
      name: 'Mechanical Brake Upgrade',
      description: 'Safer and more durable mechanical braking system.',
    },
    'carburetor-improvement': {
      name: 'Carburetor Improvement',
      description: 'Stabilizes combustion and reduces fuel waste.',
    },
    'interchangeable-parts': {
      name: 'Interchangeable Parts',
      description: 'Allows component standardization in production.',
    },
    'basic-brand-advertising': {
      name: 'Basic Brand Advertising',
      description: 'Newspaper presence increases brand recognition.',
    },
    'electric-starter': {
      name: 'Kettering Electric Starter (1912)',
      description: 'Historic milestone: push-button starting, eliminating hazardous hand crank and deciding the ICE victory.',
    },
    'basic-assembly-line': {
      name: 'Basic Assembly Line',
      description: 'Sequential assembly stations improve throughput.',
    },
    'improved-suspension': {
      name: 'Improved Suspension',
      description: 'Improves ride comfort on rough roads.',
    },
    'windshield-wipers': {
      name: 'Windshield Wipers',
      description: 'Improves usability in bad weather.',
    },
    'sales-dealer-network': {
      name: 'Sales Dealer Network',
      description: 'Distributed sales points improve regional reach.',
    },
    'hydraulic-braking-concepts': {
      name: 'Hydraulic Braking Concepts',
      description: 'Early hydraulic principles improve braking response.',
    },
    'managerial-accounting-ledgers': {
      name: 'Managerial Accounting Ledgers',
      description: 'Improved cost tracking reduces financial waste.',
    },
    'ford-moving-assembly-line': {
      name: 'Ford Moving Assembly Line',
      description: 'Moving conveyor assembly cuts chassis build time from 12 hours to 93 minutes.',
    },
    'all-steel-closed-body': {
      name: 'All-Steel Closed Body',
      description: 'Pressed steel body eliminates structural wood decay and withstands rollovers.',
    },
    'inline-4-monobloc-engine': {
      name: 'Inline-4 Monobloc Engine',
      description: 'Cylinders cast in a single iron block improve rigidity and lower machining costs.',
    },
    'four-wheel-hydraulic-brakes': {
      name: 'Four-Wheel Hydraulic Brakes',
      description: 'Hydraulic fluid pressure delivers equal stopping power to all four wheels.',
    },
    'safety-laminated-glass': {
      name: 'Safety Laminated Glass',
      description: 'Celluloid interlayer prevents windshield shattering into dangerous shards.',
    },
    'luxury-v8-overhead-valve': {
      name: 'Luxury V8 Overhead Valve Engine',
      description: 'Smooth and whisper-quiet V8 power defines the golden age of luxury automobiles.',
    },
    'unibody-monocoque': {
      name: 'Monocoque Steel Unibody',
      description: 'Unitized structural body eliminates separate heavy frame, reducing weight and lowering center of gravity.',
    },
    'passenger-diesel-engine': {
      name: 'Passenger Diesel Engine',
      description: 'Compression-ignition diesel engine offers unmatched fuel economy and exceptional commercial torque.',
    },
    'synthetic-rubber': {
      name: 'Synthetic Rubber & Elastomers',
      description: 'Industrial synthesis of styrene-butadiene rubber (Buna-S/GR-S). Overcomes reliance on colonial latex imports and cuts tire costs.',
    },
    'automatic-transmission': {
      name: 'Hydramatic Automatic Transmission',
      description: 'Eliminates clutch pedal with planetary gears and fluid coupling, revolutionizing driving ease.',
    },
    'power-steering': {
      name: 'Hydraulic Power Steering',
      description: 'Hydraulic assistance makes parking and high-speed maneuvers effortless on large luxury saloons.',
    },
    'crumple-zones': {
      name: 'Safety Crumple Zones',
      description: 'Deformable front and rear sections absorb impact energy to shield passenger cabin.',
    },
    'disc-brakes': {
      name: 'Ventilated Disc Brakes',
      description: 'Caliper pads clamped onto spinning discs resist thermal fade during repeated high-speed braking.',
    },
    'three-point-seatbelt': {
      name: 'Three-Point Safety Seatbelt',
      description: 'Nils Bohlin design restrains both chest and pelvis, cutting severe collision injuries in half.',
    },
    'turbocharger-powertrain': {
      name: 'Exhaust Gas Turbocharging',
      description: 'Turbine driven by hot exhaust gases forces compressed air into cylinders for explosive horsepower gains.',
    },
    'catalytic-converter': {
      name: 'Catalytic Exhaust Converter',
      description: 'Noble metal substrate neutralizes harmful carbon monoxide and unburnt hydrocarbons.',
    },
    'electronic-fuel-injection': {
      name: 'Electronic Multi-Point Fuel Injection',
      description: 'Micro-solenoids squirt precise fuel shots directly into intake ports, obsoleting carburetors forever.',
    },
    'antilock-brakes-abs': {
      name: 'Anti-Lock Braking System (ABS)',
      description: 'Computerized hydraulic valves pulse pressure 15 times per second to prevent tire lockup on ice.',
    },
    'digital-ecu-dashboard': {
      name: 'Microprocessor ECU & Digital Cluster',
      description: 'Central computer orchestrates engine timing while vacuum-fluorescent displays show real-time diagnostics.',
    },
    'dual-front-airbags': {
      name: 'Dual Front SRS Airbags',
      description: 'Explosive pyrotechnic propellant inflates nylon cushions in 30 milliseconds upon front impact.',
    },
    'electronic-stability-control': {
      name: 'Electronic Stability Program (ESP)',
      description: 'Yaw sensors brake individual wheels to pull vehicle back in line during sudden evasive swerves.',
    },
    'hybrid-synergy-drive': {
      name: 'Dual Hybrid Synergy Powertrain',
      description: 'Atkinson-cycle gasoline engine paired with high-torque electric motor and regenerative braking.',
    },
    'satellite-gps-navigation': {
      name: 'In-Dash Satellite GPS Navigation',
      description: 'Orbital satellite constellation plots turn-by-turn route guidance on central color LCD screen.',
    },
    'li-ion-high-density-battery': {
      name: 'High-Density Li-Ion Traction Battery',
      description: 'Thousands of cylindrical lithium cells in skateboard floor pack provide 500+ km zero-emission range.',
    },
    'autopilot-level2-adas': {
      name: 'Level 2 ADAS Highway Autopilot',
      description: 'Camera and radar fusion manages lane centering and adaptive stop-and-go cruise control.',
    },
    'carbon-fiber-monocoque': {
      name: 'Carbon Fiber Composite Monocoque',
      description: 'Autoclave-baked carbon composite tub provides Formula-1 stiffness at fraction of steel weight.',
    },
    'solid-state-battery': {
      name: 'Solid-State Fast-Charge Battery',
      description: 'Non-flammable solid ceramic electrolyte enables 10-minute full charge and 800+ km range.',
    },
    'neural-autonomy-level4': {
      name: 'Full Neural Self-Driving Autonomy',
      description: 'End-to-end vision neural network operates vehicle without human driver intervention.',
    },
  },

  // Historical Events
  events: {
    'post-horse-transition': {
      name: 'Urban Shift From Horse Carriages',
      description: 'Cities become more open to automotive transport.',
    },
    ww1: {
      name: 'World War I',
      description: 'Civilian demand drops and logistics become unstable.',
    },
    'great-depression': {
      name: 'The Great Wall Street Depression',
      description: 'Mass unemployment and bank panics cause consumer vehicle sales to collapse by 35%.',
    },
    ww2: {
      name: 'World War II',
      description: 'Rationing of steel and rubber halts civilian production while military contracts surge.',
    },
    'post-war-boom': {
      name: 'Post-War Suburban & Highway Boom',
      description: 'Interstate highway construction and suburban expansion drive two-car family culture.',
    },
    'oil-shock-1973': {
      name: '1973 Global Oil Embargo & Energy Crisis',
      description: 'Gasoline prices quadruple overnight, sparking panic buyers toward compact fuel-sippers.',
    },
    'globalization-boom': {
      name: 'Fall of the Iron Curtain & Globalization',
      description: 'Newly opened borders and free trade agreements create hundreds of millions of new motorists.',
    },
    'gfc-2008': {
      name: 'Global Financial Crisis',
      description: 'Subprime mortgage collapse freezes automotive credit and dealer floorplans.',
    },
    'green-electrification-era': {
      name: 'Carbon Neutrality & EV Revolution',
      description: 'Zero-emission mandates and clean energy tax credits create explosive demand for electric drive.',
    },
  },

  // Competitor Descriptions
  competitorDescriptions: {
    fort: 'American industrial giant from Detroit. Focuses on relentless standardization, interchangeable parts, and mass affordability.',
    'mercer-benz': 'German bastion of cutting-edge mechanical engineering. Premium materials, unmatched reliability and prestige for European elites.',
    renard: 'Parisian trendsetter. French coachbuilding elegance, nimble lightweight carriages, and renowned city taxicabs.',
    'austin-morris': 'British industrial combine from the banks of the Thames. Rugged leaf-spring chassis tailored for the roads of the British Empire.',
  },

  // Competitor Milestones
  milestones: {
    'mercer-benz-1901': {
      title: 'Launch of Mercer-Benz 35 PS in Germany',
      description: 'A German engineering masterpiece sets a new global benchmark for speed and reliability in the luxury class.',
    },
    'renard-1902': {
      title: 'Triumph of Parisian Renard Voiturettes',
      description: 'French lightweight Renard runabouts fill the boulevards of Paris and London, putting pressure on artisanal workshops.',
    },
    'fort-1908': {
      title: 'Historic Milestone: Fort Model T Launch ("Tin Lizzie")',
      description: 'Henry Fort announces an affordable universal motor car for only $825, disrupting the entire Economy market.',
    },
    'fort-1914': {
      title: 'Fort Moving Assembly Line & $5 Workday',
      description: 'Assembly costs plummet. Model T price drops under $500, setting an unprecedented pace for global automotive industry.',
    },
  },

  // Vehicle Components
  components: {
    'ladder-frame': 'Ladder Frame (Standard)',
    'touring-frame': 'Touring Channel-Section Frame',
    'reinforced-suspension-frame': 'Reinforced Leaf-Spring Chassis',
    'reinforced-suspension': 'Reinforced Elliptical Suspension',
    'single-cylinder': 'Single-Cylinder ICE (6 hp, Hand-Crank)',
    'steam-compound-twin': 'Twin Compound Steam Engine (15 hp)',
    'electric-traction-dc': 'DC Traction Electric Motor (10 hp)',
    'ethanol-dual-engine': 'Dual-Fuel ICE (Ethanol/Gas, 8 hp)',
    'inline-four': 'Inline-Four Engine (20 hp)',
    'electric-start-v4': 'Electric-Start V4 Engine (35 hp)',
    'band-brakes': 'Mechanical Band Brakes',
    'drum-brakes': 'Reinforced Drum Brakes',
    'hydraulic-prototype-brakes': 'Prototype Hydraulic Brakes',
    'open-runabout': 'Open Runabout Body',
    'basic-cabin': 'Artisan Carriage Cabin',
    'wooden-cabin': 'Fine Hardwood Coach Cabin',
    'luxury-cabin': 'Luxury Bespoke Upholstered Cabin',
    'enclosed-limousine-cabin': 'Enclosed Limousine Cabin',
    'package-none': 'Standard Configuration (No Package)',
    'weather-package': 'All-Weather Package (Wipers & Soft Top)',
    'touring-rally-kit': 'Touring Reliability Kit',
    'all-steel-body': 'Pressed Steel Closed Body',
    'inline-4-monobloc': 'Inline-4 Monobloc Engine (24 hp)',
    'luxury-v8-ohv': 'Luxury V8 Overhead Valve Engine (65 hp)',
    'four-wheel-hydraulic': 'Four-Wheel Hydraulic Brakes',
    'triplex-safety-package': 'Safety Laminated Glass Package',
  },

  // Bank Loans
  loans: {
    'micro-credit': {
      name: 'Short-term Overdraft',
      description: 'Small loan for emergency cash flow coverage.',
    },
    'commercial-expansion': {
      name: 'Commercial Expansion Loan',
      description: 'Medium-term loan for equipment purchase and engineer hiring.',
    },
    'industrial-bond': {
      name: 'Industrial Bond',
      description: 'Large-scale loan for plant expansion and market penetration.',
    },
  },
};
