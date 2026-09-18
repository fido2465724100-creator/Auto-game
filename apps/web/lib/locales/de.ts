import type { TranslationSchema } from './ru';

export const de: TranslationSchema = {
  brand: 'Auto Industry Tycoon',
  subtitle: 'Wirtschaftsstrategie-Simulation der Automobilindustrie (1900–2026)',
  brandCompany: 'Ihr Unternehmen',

  // Nav
  nav: {
    dashboard: 'Direktionsbüro',
    production: 'Werk & Produktion',
    vehicleDesign: 'Fahrzeug-Design',
    research: 'F&E & Technologie',
    markets: 'Märkte & Vertrieb',
    bank: 'Bank & Finanzen',
    reports: 'Quartalsberichte',
  },

  // Materials
  materials: {
    steel: 'Stahl & Gusseisen',
    wood: 'Hartholz & Bauholz',
    rubber: 'Naturkautschuk',
    leather: 'Leder & Polsterung',
    aluminum: 'Aluminium',
    plastic: 'Kunststoffe & Polymere',
    units: {
      steel: 'kg',
      wood: 'Stk.',
      rubber: 'kg',
      leather: 'm²',
      aluminum: 'kg',
      plastic: 'kg',
    },
  },

  // Timeline & Topbar
  topbar: {
    year: 'Jahr',
    quarter: 'Quartal',
    quarters: ['1. Qtr.', '2. Qtr.', '3. Qtr.', '4. Qtr.'],
    month: 'Monat',
    months: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],
    eraPioneers: 'Pionierzeit (1900–1914)',
    eraMassProduction: 'Fließband-Ära (1915–1929)',
    eraModern: 'Moderne Ära',
    cash: 'Kapital',
    lastProfit: 'Jahresgewinn',
    reputation: 'Ansehen',
    worldRank: 'Weltrangliste',
    worldRankLabel: 'Platz weltweit',
    endTurn: 'Jahr abschließen',
    simulating: 'Jahressimulation...',
    turnProgress: 'Zug {turn} von 127 (1900–2026)',
    setupCompanyBtn: 'Markenpass',
    unitsQuarter: 'Fz./Jahr',
    latestGazette: 'Aktuelle Zeitung',
    worldRankingBtn: 'Verkaufsrangliste',
  },

  // Countries
  countries: {
    usa: { name: 'USA', flag: '🇺🇸', description: 'Riesiger Binnenmarkt mit Fokus auf Zweckmäßigkeit, austauschbare Teile und Großserienfertigung.' },
    germany: { name: 'Deutschland', flag: '🇩🇪', description: 'Wiege des Automobils (Benz & Daimler), führender Maschinenbau und höchste Ingenieurskultur.' },
    france: { name: 'Frankreich', flag: '🇫🇷', description: 'Welthauptstadt des frühen Motorsports, elegante Karosserien und kühne technische Innovationen.' },
    uk: { name: 'Großbritannien', flag: '🇬🇧', description: 'Metropole des Empires, jahrhundertealte Handwerkstradition und robuste Blattfeder-Fahrgestelle.' },
  },

  // Founder Perks
  founderPerks: {
    mechanic: {
      name: 'Begabter Mechaniker',
      badge: '🔧 Ingenieurwesen',
      description: '+15% Basiszuverlässigkeit aller Fahrzeuge; +1 Monat Entwicklungsbeschleunigung für Motoren und Fahrgestelle.',
    },
    merchant: {
      name: 'Erfahrener Kaufmann',
      badge: '💰 Handel',
      description: '-15% Rabatt auf Rohstoffeinkäufe an der Warenbörse; +10% Handelsmarge beim Fahrzeugverkauf.',
    },
    coachbuilder: {
      name: 'Traditioneller Stellmacher',
      badge: '👑 Prestige',
      description: '+15% Komfort und Prestige für Karosserien; -25% Einsparung beim Holz- und Lederverbrauch im Werk.',
    },
  },

  // Powertrains & Fuels
  powertrains: {
    all: 'Alle Antriebsarten',
    ice: 'Verbrennungsmotor (Benzin/Ethanol)',
    steam: 'Dampfantrieb 💨',
    electric: 'Elektroantrieb ⚡',
  },
  fuels: {
    gasoline: 'Benzin',
    ethanol_blend: 'Alkoholgemisch (Ethanol)',
    steam_fuel: 'Kohle & Wasser (Dampf)',
    electricity: 'Elektrischer Strom (Akkumulator)',
  },
  crankWarning: '⚠️ Handkurbel: Verletzungsgefahr durch Rückschlag, -10 Komfort (bis zum elektrischen Anlasser 1912)',

  // Company Setup
  companySetup: {
    title: 'Gründung des Automobilunternehmens (Jahr 1900)',
    subtitle: 'Legen Sie das Fundament Ihres Automobilimperiums zu Beginn des 20. Jahrhunderts: Wählen Sie Gründungsland, Wappen und Begabung.',
    nameLabel: 'Markenname / Werk',
    namePlaceholder: 'Z.B.: Detroit Motor Carriage Works',
    countryLabel: 'Gründungsland und Manufaktur',
    perkLabel: 'Spezialisierung des Gründers',
    badgeLabel: 'Markenwappen & Emblem',
    badgeColor: 'Wappenfarbe',
    badgeShape: 'Wappenform',
    badgeIcon: 'Heraldisches Symbol',
    submitBtn: 'Unternehmen gründen & Spiel starten (1900 Q1)',
    reconfigureBtn: 'Markenpass & Heraldik',
  },

  // Competitors
  competitors: {
    title: 'Weltweite Automobilhersteller & Konkurrenten',
    subtitle: 'Historische Konzerne, Marktanteile, Modelle und industrielle Meilensteine.',
    marketShare: 'Marktanteil in der Region',
    activeModels: 'Modellpalette des Rivalen',
    milestonesTitle: 'Historische Meilensteine und Marktumbrüche',
    speedBenchmark: 'Segment-Referenz',
    price: 'Preis',
    appeal: 'Attraktivität',
  },

  // Dashboard
  dashboard: {
    title: 'Büro des Generaldirektors',
    companyStats: 'Unternehmenskennzahlen',
    capacity: 'Werkskapazität',
    unitsMonth: 'Fz./Qtr.',
    activeResearchCount: 'Aktive F&E-Projekte',
    latestReport: 'Finanzergebnis des letzten Quartals',
    revenue: 'Umsatz',
    expenses: 'Aufwendungen',
    profit: 'Nettogewinn',
    carsSold: 'Verkaufte Automobile',
    noReport: 'Das erste Quartal läuft noch. Klicken Sie oben auf «Quartal abschließen».',
    activeModelsSummary: 'Modelle auf den Montagelinien',
    quickNav: 'Schnellnavigation',
    availableCashHint: 'Verfügbare Bankmittel',
    capacityHint: 'Montagelinien-Limit',
    reputationHint: 'Marktprestige',
    researchHint: 'Laborprojekte',
    createModel: '+ Neues Modell konstruieren →',
    unitCostLabel: 'Selbstkosten',
    priceLabel: 'Verkaufspreis',
  },

  // Vehicle Design
  design: {
    title: 'Konstruktionsbüro',
    subtitle: 'Konstruktion neuer Modelle, Aggregatauswahl und Selbstkostenkalkulation.',
    step1: '1. Name & Fahrzeugklasse',
    modelName: 'Modellbezeichnung',
    modelNamePlaceholder: 'Z.B.: Modell 1900 Runabout',
    segment: 'Fahrzeugklasse',
    segments: {
      economy: {
        name: 'Kleinwagen (Standard)',
        tag: 'Runabout',
        description: 'Erschwingliche und robuste Motorkutsche für jedermann.',
      },
      family: {
        name: 'Familienwagen',
        tag: 'Tourer',
        description: 'Geräumige Reisekutsche mit ausgewogenem Komfort und Zuverlässigkeit.',
      },
      luxury: {
        name: 'Oberklasse',
        tag: 'Limousine',
        description: 'Exklusive Repräsentationskarosse höchster Güte für prestigeorientierte Käufer.',
      },
      utility: {
        name: 'Nutzfahrzeug',
        tag: 'Kastenwagen',
        description: 'Zugkräftiges und widerstandsfähiges Fahrgestell für Gewerbe und Warentransport.',
      },
    },
    step2: '2. Baugruppen & Aggregate',
    requiresTech: 'Erfordert Technologie',
    step3: '3. Produktionsquote & Produktionsstart',
    initialQuotaLabel: 'Geplante Jahresproduktion für das neue Modell',
    initialQuotaHint: 'Geben Sie an, wie viele Einheiten pro Jahr montiert werden sollen (jederzeit im Bereich «Werk & Produktion» anpassbar).',
    availableCapacity: 'Verfügbare Werkskapazität',
    unitsMonth: 'Fz./Jahr',
    submitBtn: 'Modell freigeben und Produktion starten',
    savingBtn: 'Modell wird gespeichert und montiert...',
    successMsg: 'Modell erfolgreich konstruiert und auf die Montagelinie gesetzt!',
    specsTitle: 'Fahrzeugdaten',
    financeTitle: 'Stückkostenrechnung',
    productionCost: 'Herstellungskosten (COGS)',
    salePrice: 'Verkaufspreis ($)',
    unitProfit: 'Stückmarge (Gewinn pro Fz.)',
    marketAppeal: 'Marktattraktivität nach Regionen',
    marketAppealHint: 'Grundlegende Eignung für Kundenbedürfnisse weltweit:',
    factoryCapacityHint: 'Gesamtkapazität der Manufaktur',
    materialConsumptionHint: 'Rohstoffbedarf zur Montage eines Fahrzeugs dieses Typs:',
    existingModels: 'Aktuelle Modelle im Programm',
    discontinuedModels: 'Eingestellte Modelle (Archiv)',
    noModels: 'Das Unternehmen führt derzeit noch keine konstruierten Modelle.',
    decommissionBtn: 'Produktion einstellen',
    activateBtn: 'Wiederaufnehmen',
    deleteModelBtn: 'Bauplan löschen',
    discontinuedBadge: 'Eingestellt',
    confirmDecommission: 'Die Produktion dieses Modells einstellen? Die Produktionsquote wird auf null gesetzt und Kapazitäten freigegeben.',
    confirmDelete: 'Möchten Sie diesen Bauplan wirklich dauerhaft löschen?',
    categories: {
      chassis: 'Fahrgestell & Rahmen',
      engine: 'Motor & Kraftquelle',
      brakes: 'Bremsanlage',
      comfort: 'Karosserie & Aufbau',
      package: 'Ausstattungspaket',
    },
    stats: {
      reliability: 'Zuverlässigkeit',
      comfort: 'Komfort',
      performance: 'Leistung / Tempo',
      efficiency: 'Wirtschaftlichkeit',
      prestige: 'Prestige',
      complexity: 'Fertigungskomplexität',
    },
  },

  // Production & Logistics
  production: {
    title: 'Fertigung & Lieferketten',
    subtitle: 'Steuerung der Manufakturen, Kapazitätsplanung und Materialbeschaffung.',
    factoryTitle: 'Aktuelle Automobilmanufaktur',
    level: 'Ausbaustufe',
    capacity: 'Jahreskapazität',
    capacityUsed: 'Kapazitätsauslastung',
    overheadMonthly: 'Betriebskosten pro Jahr',
    premisesRent: 'Miete für Produktionsflächen',
    premisesRentHint: 'Werks- und Grundstücksmiete steigt von 100 $ (1900) auf 100.000 $ (2020)',
    modelAgeBadge: {
      fresh: 'Aktuell',
      mature: 'Reif',
      aging: 'Veraltet',
      obsolete: 'Obsolet',
    },
    expandBtn: 'Werk ausbauen (+16 Fz./Jahr)',
    upgradeCost: 'Ausbaukosten',
    insufficientFunds: 'Unzureichendes Kapital für den Werksausbau!',
    plantExpanded: 'Werk erfolgreich erweitert! Produktionskapazität erhöht.',
    linesTitle: 'Zuweisung der Montagelinien',
    noModels: 'Keine Modelle vorhanden. Konstruieren Sie zuerst ein Modell im Konstruktionsbüro.',
    plannedUnits: 'Produktionsplan (Fz./Jahr)',
    savePlanBtn: 'Produktionsplan speichern',
    planSaved: 'Produktionsplan erfolgreich genehmigt!',
    costPerUnit: 'Montagekosten je Einheit',
    totalCost: 'Gesamte Produktionsaufwendungen',
    materialsRequiredPerUnit: 'Materialbedarf je Fahrzeug',
    warehouseTitle: 'Rohstofflager & Materialbörse',
    autoProcurement: 'Automatische Materialbeschaffung (Just-In-Time)',
    autoProcurementHint: 'Bei Rohstoffmangel kauft das Werk fehlende Materialien vor Produktionsbeginn automatisch an der Börse zu.',
    inStock: 'Lagerbestand',
    marketPrice: 'Einkaufspreis',
    needNextMonth: 'Jahresbedarf',
    buyBatchBtn: 'Charge kaufen',
    shortageAlert: 'Achtung! Unzureichende Rohstoffe auf Lager. Ohne automatische Beschaffung oder Zukauf wird die Montage gedrosselt!',
    shortageHint: 'Aktivieren Sie Just-In-Time-Beschaffung im Lagerbereich unten für eine unterbrechungsfreie Produktion.',
    overCapacityWarning: 'Gesamtplan übersteigt die Werkskapazität! Montage wird auf das Maximum gekürzt.',
    historicalPlantSubtitle: 'Historische Manufaktur für Motorkutschen und Automobile',
    planSubtitle: 'Festlegung der Jahresfertigung für Modelle auf den Montageposten',
    warehouseSubtitle: 'Lagerbestände der Manufaktur und Rohstoffeinkauf an der Warenbörse',
    insufficientFundsBatch: 'Unzureichendes Kapital zum Rohstoffkauf!',
    materialBought: 'Rohstoffe erfolgreich eingekauft und eingelagert!',
    autoProcurementUpdated: 'Beschaffungsmodus aktualisiert!',
    yearAvailable: 'Verfügbar ab Jahr',
    unitsShort: 'Stk.',
  },

  // Bank
  bank: {
    title: 'Automobil-Handelsbank',
    subtitle: 'Kreditlinien, Investitionsdarlehen und Schuldenmanagement.',
    offersTitle: 'Verfügbare Darlehensangebote',
    activeTitle: 'Laufende Kreditverbindlichkeiten',
    noLoans: 'Ihr Unternehmen hat derzeit keine offenen Kredite.',
    takeLoan: 'Kredit aufnehmen',
    repayLoan: 'Vorzeitig tilgen',
    amount: 'Darlehensbetrag',
    term: 'Laufzeit',
    months: 'Monate',
    monthlyRate: 'Monatlicher Zinssatz',
    monthlyPayment: 'Monatliche Rate',
    remaining: 'Restschuld',
    remainingMonths: 'Verbleibende Monate',
    insufficientFunds: 'Unzureichendes Kapital zur vorzeitigen Tilgung!',
    loanTaken: 'Kredit erfolgreich auf dem Firmenkonto gutgeschrieben!',
    loanRepaid: 'Kredit vollständig getilgt!',
    warning: 'Kreditraten werden am Ende jedes Monats automatisch über den Aufwandsposten beglichen.',
  },

  // Markets
  markets: {
    title: 'Globale Absatzmärkte',
    subtitle: 'Regionale Besonderheiten und Kundenpräferenzen.',
    marketShare: 'Marktanteil',
    preferencesTitle: 'Regionale Käuferpräferenzen:',
    size: 'Marktvolumen',
    priceSensitivity: 'Preissensibilität',
    prestigeSensitivity: 'Prestigesensibilität',
    units: 'Fahrzeuge',
  },

  // Regions
  regions: {
    'north-america': 'Nordamerika',
    europe: 'Europa',
    'middle-east': 'Naher Osten',
  },

  // Research
  research: {
    title: 'Forschungs- & Entwicklungszentrum (F&E)',
    subtitle: 'Erfindung fortschrittlicher Baugruppen, Werkstoffe und Fertigungsmethoden.',
    startBtn: 'Entwicklung starten',
    starting: 'Entwicklung beginnt...',
    year: 'Erscheinungsjahr',
    status: 'Status',
    statuses: {
      locked: 'Gesperrt',
      available: 'Bereit zur Erforschung',
      researching: 'In Entwicklung',
      completed: 'Erforscht',
    },
    budgetMonth: 'Monatsbudget',
  },

  // Reports
  reports: {
    title: 'Archiv der Quartalsberichte',
    subtitle: 'Verlauf der Finanzergebnisse und Produktionszahlen des Unternehmens.',
    noReports: 'Noch keine Berichte vorhanden. Schließen Sie das erste Quartal ab.',
    produced: 'Produziert',
    sold: 'Verkauft',
    revenue: 'Umsatzerlöse',
    expenses: 'Gesamtaufwendungen',
    profit: 'Reingewinn / Überschuss',
    loansPaid: 'Kredittilgungen',
    salesByRegion: 'Absatz nach Regionen:',
    competitorNews: 'Nachrichten über Konkurrenten & Marktgeschehen:',
  },

  // Technologies
  technologies: {
    'standardized-steering-wheel': {
      name: 'Standardisiertes Lenkrad',
      description: 'Verbessert Handhabung, Fahrkomfort und Richtungsstabilität.',
    },
    'steam-condenser': {
      name: 'Geschlossener Dampfkondensator',
      description: 'Ermöglicht Wasserwiederverwendung und erhöht die Reichweite von Dampfwagen erheblich.',
    },
    'ethanol-carburetor': {
      name: 'Zweistoff-Alkohol-Vergaser',
      description: 'Ermöglicht den Betrieb mit Agrar-Ethanol in ländlichen Gebieten vor der Prohibition.',
    },
    'edison-nickel-iron-battery': {
      name: 'Edison-Nickel-Eisen-Akkumulator',
      description: 'Langlebige alkalische Speicherzellen für geräuscharme und saubere frühe Elektrofahrzeuge.',
    },
    'mechanical-brake-upgrade': {
      name: 'Modernisierte mechanische Bremsen',
      description: 'Zuverlässigere und standfestere mechanische Bremsanlage.',
    },
    'carburetor-improvement': {
      name: 'Vergaser-Optimierung',
      description: 'Stabilisiert das Kraftstoffgemisch und senkt den Kraftstoffverbrauch.',
    },
    'interchangeable-parts': {
      name: 'Austauschbare Teile (Normteile)',
      description: 'Ermöglicht standardisierte Baugruppen in der Serienfertigung.',
    },
    'basic-brand-advertising': {
      name: 'Grundlegende Markenwerbung',
      description: 'Zeitungsanzeigen steigern die Bekanntheit und das Ansehen der Marke.',
    },
    'electric-starter': {
      name: 'Elektrischer Kettering-Anlasser (1912)',
      description: 'Historischer Durchbruch: Starten per Zündschloss ohne gefährliche Kurbel, der den Siegeszug des Benziners besiegelte.',
    },
    'basic-assembly-line': {
      name: 'Frühe Taktstraßen-Montage',
      description: 'Aufeinanderfolgende Montagestationen steigern den Produktionsausstoß erheblich.',
    },
    'improved-suspension': {
      name: 'Verbesserte Blattfeder-Aufhängung',
      description: 'Erhöht den Fahrkomfort und die Spurtreue auf unbefestigten Straßen.',
    },
    'windshield-wipers': {
      name: 'Scheibenwischer',
      description: 'Verbessert Sicht und Verkehrssicherheit bei Regen und Schlechtwetter.',
    },
    'sales-dealer-network': {
      name: 'Vertragshändlernetz',
      description: 'Verzweigte Verkaufsstellen erweitern die regionale Marktabdeckung.',
    },
    'hydraulic-braking-concepts': {
      name: 'Hydraulische Bremskonzepte',
      description: 'Frühe hydraulische Übertragung verbessert das Bremsansprechverhalten.',
    },
    'managerial-accounting-ledgers': {
      name: 'Betriebliches Rechnungswesen',
      description: 'Präzise Kostenstellenrechnung reduziert Verluste und Gemeinkosten.',
    },
    'ford-moving-assembly-line': {
      name: 'Fließbandfertigung nach Ford',
      description: 'Kontinuierliche Bandmontage senkt die Bauzeit eines Fahrgestells von 12 Stunden auf 93 Minuten.',
    },
    'all-steel-closed-body': {
      name: 'Ganzstahl-Karosserie',
      description: 'Gepresste Stahlblechkarosserie beendet die Fäulnis hölzerner Aufbauten und schützt bei Unfällen.',
    },
    'inline-4-monobloc-engine': {
      name: 'Reihen-Vierzylinder-Monoblockmotor',
      description: 'Aus einem Guss gefertigte Zylinderblöcke erhöhen die Steifigkeit und senken die Gusskosten.',
    },
    'four-wheel-hydraulic-brakes': {
      name: 'Vierrad-Hydraulikbremsen',
      description: 'Gleichmäßiger hydraulischer Druck verteilt die Bremskraft präzise auf alle vier Räder.',
    },
    'safety-laminated-glass': {
      name: 'Verbund-Sicherheitsglas (Triplex)',
      description: 'Celluloid-Zwischenschicht verhindert das Zersplittern der Windschutzscheibe bei Stößen.',
    },
    'luxury-v8-overhead-valve': {
      name: 'Repräsentativer V8-OHV-Motor',
      description: 'Seidenweicher und leiser V8-Motor mit hängenden Ventilen für Luxusfahrzeuge der Spitzenklasse.',
    },
    'unibody-monocoque': {
      name: 'Selbsttragende Karosserie (Monocoque)',
      description: 'Integrierte Struktur ohne schweres separates Chassis senkt Fahrzeuggewicht und Schwerpunkt.',
    },
    'passenger-diesel-engine': {
      name: 'Pkw-Dieselmotor',
      description: 'Selbstzündender Dieselmotor bietet herausragende Kraftstoffeffizienz und hohes Drehmoment.',
    },
    'automatic-transmission': {
      name: 'Hydromechanisches Automatikgetriebe',
      description: 'Planetengetriebe mit Drehmomentwandler machen das Kupplungspedal überflüssig und erleichtern das Fahren.',
    },
    'power-steering': {
      name: 'Hydraulische Servolenkung',
      description: 'Servounterstützung macht Rangiervorgänge schwerer Limousinen leichtgängig und präzise.',
    },
    'crumple-zones': {
      name: 'Knautschzonen',
      description: 'Energieabsorbierende Verformungszonen an Front und Heck dämpfen Aufprallkräfte und schützen die Fahrgastzelle.',
    },
    'disc-brakes': {
      name: 'Belüftete Scheibenbremsen',
      description: 'Bremssättel auf offenen Drehscheiben widerstehen Überhitzung bei starken Bremsungen.',
    },
    'three-point-seatbelt': {
      name: 'Dreipunkt-Sicherheitsgurt',
      description: 'Nils-Bohlin-Konstruktion fixiert Brust und Becken und senkt tödliche Unfallrisiken um 50%.',
    },
    'turbocharger-powertrain': {
      name: 'Abgasturbolader',
      description: 'Abgasturbine presst verdichtete Luft in die Zylinder für spürbaren Leistungszuwachs.',
    },
    'catalytic-converter': {
      name: 'Geregelter Abgaskatalysator',
      description: 'Keramischer Wabenkörper mit Edelmetallen wandelt giftige Abgase und Kohlenwasserstoffe um.',
    },
    'electronic-fuel-injection': {
      name: 'Elektronische Saugrohreinspritzung (EFI)',
      description: 'Elektromagnetische Einspritzventile dosieren Kraftstoff präzise und lösen den Vergaser endgültig ab.',
    },
    'antilock-brakes-abs': {
      name: 'Antiblockiersystem (ABS)',
      description: 'Mikroprozessorgesteuerte Ventile modulieren den Bremsdruck bis zu 15 Mal pro Sekunde, um Blockieren zu verhindern.',
    },
    'digital-ecu-dashboard': {
      name: 'Elektronisches Steuergerät (ECU) & Digitaltacho',
      description: 'Mikroprozessor steuert Zündung und Gemischaufbereitung, Digitale Instrumente zeigen Diagnosewerte an.',
    },
    'dual-front-airbags': {
      name: 'Front-Airbags (SRS)',
      description: 'Pyrotechnische Treibladungen füllen Nylongewebe-Kissen in 30 Millisekunden bei Frontalzusammenstößen.',
    },
    'electronic-stability-control': {
      name: 'Elektronisches Stabilitätsprogramm (ESP)',
      description: 'Giersensoren bremsen gezielt einzelne Räder ab und stabilisieren das Fahrzeug bei Ausrutschern.',
    },
    'hybrid-synergy-drive': {
      name: 'Vollhybrid-Antrieb (Synergy Drive)',
      description: 'Atkinson-Verbrennungsmotor kombiniert mit Elektromotor und Bremsenergierückgewinnung.',
    },
    'satellite-gps-navigation': {
      name: 'Integrierte Satelliten-GPS-Navigation',
      description: 'Satellitengestützte Routenführung mit hochauflösender Kartendarstellung auf Farbdisplay.',
    },
    'li-ion-high-density-battery': {
      name: 'Lithium-Ionen-Traktionsbatterie hoher Dichte',
      description: 'Flaches Skateboard-Batteriepaket bietet über 500 km emissionsfreie Reichweite.',
    },
    'autopilot-level2-adas': {
      name: 'Autobahn-Autopilot (Level 2 ADAS)',
      description: 'Kamera- und Radarsysteme halten Spur und Geschwindigkeit adaptiv im Verkehrsfluss.',
    },
    'carbon-fiber-monocoque': {
      name: 'Kohlefaser-Monocoque (CFK)',
      description: 'Autoklav-gebackenes Kohlefaserchassis garantiert Formel-1-Steifigkeit bei minimalem Eigengewicht.',
    },
    'solid-state-battery': {
      name: 'Feststoffbatterie mit Schnellladung',
      description: 'Nicht brennbarer Festkörperelektrolyt erlaubt Vollladung in 10 Minuten und über 800 km Reichweite.',
    },
    'neural-autonomy-level4': {
      name: 'Neuronale Vollautonomie (Level 4+)',
      description: 'Ende-zu-Ende trainierte neuronale Netze steuern das Fahrzeug vollständig ohne Fahrereingriff.',
    },
  },

  // Historical Events
  events: {
    'post-horse-transition': {
      name: 'Wandel von Pferdekutschen zu Automobilen',
      description: 'Großstädte öffnen ihre Straßen für motorisierte Kutschen.',
    },
    ww1: {
      name: 'Erster Weltkrieg',
      description: 'Zivile Nachfrage bricht ein, Rohstoffe fließen an die Front.',
    },
    'great-depression': {
      name: 'Große Weltwirtschaftskrise',
      description: 'Massenarbeitslosigkeit und Bankencrash senken den Fahrzeugabsatz um 35%.',
    },
    ww2: {
      name: 'Zweiter Weltkrieg',
      description: 'Rationierung von Stahl und Kautschuk stoppt die zivile Pkw-Produktion.',
    },
    'post-war-boom': {
      name: 'Nachkriegsboom & Autobahnbau',
      description: 'Autobahnausbau und Vorortwachstum schaffen die Kultur des Familienautos.',
    },
    'oil-shock-1973': {
      name: 'Ölkrise 1973',
      description: 'Benzinpreise vervierfachen sich, Nachfrage nach sparsamen Kleinwagen schnellt hoch.',
    },
    'globalization-boom': {
      name: 'Fall des Eisernen Vorhangs & Globalisierung',
      description: 'Öffnung der Grenzen und Freihandel bringen hunderte Millionen neue Autofahrer.',
    },
    'gfc-2008': {
      name: 'Weltfinanzkrise 2008',
      description: 'Immobilienkrise friert Autokredite ein und gefährdet Vertragshändler.',
    },
    'green-electrification-era': {
      name: 'Klimaneutralität & Elektro-Revolution',
      description: 'Emissionsgesetze und Subventionen entfachen einen weltweiten Boom für E-Fahrzeuge.',
    },
  },

  // Competitor Descriptions
  competitorDescriptions: {
    fort: 'Amerikanischer Industriegigant aus Detroit. Setzt auf rigorose Standardisierung, austauschbare Teile und Massenerschwinglichkeit.',
    'mercer-benz': 'Deutsche Bastion fortschrittlicher Ingenieurskunst. Hochwertige Materialien, Zuverlässigkeit und Prestige für Europas Elite.',
    renard: 'Pariser Vorreiter. Französische Eleganz, wendige Leichtbaufahrzeuge und berühmte Stadttaxis.',
    'austin-morris': 'Britisches Industriekombinat von den Ufern der Themse. Robuste Blattfeder-Chassis für Straßen des Empires.',
  },

  // Competitor Milestones
  milestones: {
    'mercer-benz-1901': {
      title: 'Debüt des Mercer-Benz 35 PS in Deutschland',
      description: 'Ein deutsches Meisterwerk setzt neue Maßstäbe für Geschwindigkeit und Zuverlässigkeit in der Oberklasse.',
    },
    'renard-1902': {
      title: 'Triumph der Pariser Renard Voiturettes',
      description: 'Französische Renard-Leichtfahrzeuge erobern Paris und London und verdrängen Manufakturbetriebe.',
    },
    'fort-1908': {
      title: 'Historischer Durchbruch: Fort Model T ("Tin Lizzie")',
      description: 'Henry Fort bringt ein Universalauto für nur $825 heraus. Dies revolutioniert den Markt der Einstiegsklasse!',
    },
    'fort-1914': {
      title: 'Fort-Fließbandfertigung & 5-Dollar-Tagelohn',
      description: 'Fertigungskosten sinken dramatisch. Der Model-T-Preis fällt unter $500 und setzt weltweit den Maßstab.',
    },
  },

  // Vehicle Components
  components: {
    'ladder-frame': 'Leiterrahmen (Standard)',
    'touring-frame': 'Touring-Längsträgerrahmen',
    'reinforced-suspension-frame': 'Verstärkter Blattfederrahmen',
    'reinforced-suspension': 'Verstärkte Elliptikfederung',
    'single-cylinder': 'Einzylinder-Verbrennungsmotor (6 PS, Kurbelstart)',
    'steam-compound-twin': 'Zweizylinder-Verbunddampfmaschine (15 PS)',
    'electric-traction-dc': 'Gleichstrom-Traktionselektromotor (10 PS)',
    'ethanol-dual-engine': 'Zweistoffmotor Ethanol/Benzin (8 PS)',
    'inline-four': 'Vierzylinder-Reihenmotor (20 PS)',
    'electric-start-v4': 'V4-Motor mit Elektrostarter (35 PS)',
    'band-brakes': 'Mechanische Bandbremsen',
    'drum-brakes': 'Verstärkte Trommelbremsen',
    'hydraulic-prototype-brakes': 'Hydraulischer Bremsenprototyp',
    'open-runabout': 'Offener Aufbau «Runabout»',
    'basic-cabin': 'Einfache Kutschenkabine',
    'wooden-cabin': 'Hochwertige Hartholz-Kutschenkabine',
    'luxury-cabin': 'Luxuriöser Salon mit Samtpolsterung und Lack',
    'enclosed-limousine-cabin': 'Geschlossener Aufbau «Limousine»',
    'package-none': 'Grundausstattung (ohne Paket)',
    'weather-package': 'Allwetterpaket (Scheibenwischer & Verdeck)',
    'touring-rally-kit': 'Touren-Zuverlässigkeitspaket',
    'all-steel-body': 'Gepresste Ganzstahlkarosserie (geschlossen)',
    'inline-4-monobloc': 'Reihen-4-Zylinder-Monoblockmotor (24 PS)',
    'luxury-v8-ohv': 'Prestige-V8-OHV-Motor mit hängenden Ventilen (65 PS)',
    'four-wheel-hydraulic': 'Vierrad-Hydraulikbremsen',
    'triplex-safety-package': 'Sicherheitspaket (Verbundsicherheitsglas)',
  },

  // Bank Loans
  loans: {
    'micro-credit': {
      name: 'Kurzfristiger Kontokorrentkredit',
      description: 'Kleines Darlehen zur Überbrückung kurzfristiger Liquiditätsengpässe.',
    },
    'commercial-expansion': {
      name: 'Gewerbliches Expansionsdarlehen',
      description: 'Mittelfristiger Kredit zur Anschaffung von Maschinen und Einstellung von Ingenieuren.',
    },
    'industrial-bond': {
      name: 'Industrieanleihe',
      description: 'Großanleihe für umfassenden Werksausbau und Erschließung neuer Märkte.',
    },
  },
};
