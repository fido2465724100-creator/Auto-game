export type RegionId = 'north-america' | 'europe' | 'middle-east';
export type CountryId = 'usa' | 'germany' | 'france' | 'uk';
export type FounderPerk = 'mechanic' | 'merchant' | 'coachbuilder';
export type PowertrainType = 'ice' | 'steam' | 'electric';
export type FuelType = 'gasoline' | 'ethanol_blend' | 'steam_fuel' | 'electricity';

export interface BadgeDesign {
  icon: string;
  color: string;
  shape: string;
}

export interface CompetitorModel {
  name: string;
  segment: VehicleSegment;
  price: number;
  appeal: number;
  releaseYear: number;
  releaseQuarter: 1 | 2 | 3 | 4;
}

export interface Competitor {
  id: string;
  name: string;
  country: CountryId;
  reputation: number;
  marketShares: Record<RegionId, number>;
  activeModels: CompetitorModel[];
  description: string;
}

export interface CompetitorMilestone {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  competitorId: string;
  title: string;
  description: string;
  priceDropSegment?: VehicleSegment;
  priceDropAmount?: number;
  marketShareGain?: number;
}

export type TechnologyCategory =
  | 'engine'
  | 'chassis'
  | 'transmission'
  | 'brakes'
  | 'manufacturing'
  | 'comfort'
  | 'marketing'
  | 'office';

export type TechStatus = 'locked' | 'available' | 'researching' | 'completed';
export type VehicleSegment = 'economy' | 'family' | 'luxury' | 'utility';
export type ComponentCategory = 'chassis' | 'engine' | 'brakes' | 'comfort' | 'package';

export interface VehicleComponentOption {
  id: string;
  category: ComponentCategory;
  name: string;
  statModifiers: Partial<VehicleStats>;
  costModifier: number;
  requiredTechnologyId?: string;
  powertrainType?: PowertrainType;
  fuelType?: FuelType;
}

export interface VehicleComponentWithStatus extends VehicleComponentOption {
  isUnlocked: boolean;
}

export interface BankLoan {
  id: string;
  name: string;
  principal: number;
  remainingPrincipal: number;
  interestRate: number;
  monthlyPayment: number;
  remainingMonths: number;
  totalMonths: number;
}

export interface LoanTemplate {
  id: string;
  name: string;
  description: string;
  amount: number;
  durationMonths: number;
  interestRate: number;
  monthlyPayment: number;
}

export type MaterialType = 'steel' | 'wood' | 'rubber' | 'leather' | 'aluminum' | 'plastic';

export interface MaterialMarketItem {
  id: MaterialType;
  name: string;
  basePrice: number;
  unit: string;
  yearAvailable: number;
  description: string;
}

export interface FactoryInfo {
  name: string;
  level: number;
  capacity: number;
  monthlyOverhead: number;
  upgradeCost: number;
}

export interface Company {
  id: string;
  name: string;
  country?: CountryId;
  founderPerk?: FounderPerk;
  badge?: BadgeDesign;
  cash: number;
  reputation: number;
  productionCapacity: number;
  overheadMonthly: number;
  marketPresence: Record<RegionId, number>;
  loans?: BankLoan[];
  inventoryMaterials?: Record<MaterialType, number>;
  autoProcurement?: boolean;
  factory?: FactoryInfo;
  worldRank?: number;
}

export interface GameDate {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  month?: number;
}

export interface TechnologyEffect {
  key:
    | 'costMultiplier'
    | 'reliabilityBonus'
    | 'appealBonus'
    | 'productionEfficiencyBonus'
    | 'prestigeBonus';
  value: number;
}

export interface Technology {
  id: string;
  name: string;
  yearAvailable: number;
  category: TechnologyCategory;
  description: string;
  researchCost: number;
  researchDurationMonths: number;
  prerequisites: string[];
  effects: TechnologyEffect[];
}

export interface ResearchProject {
  id: string;
  technologyId: string;
  allocatedBudget: number;
  progressMonths: number;
  totalMonths: number;
  isCompleted: boolean;
}

export interface VehicleComponents {
  chassis: string;
  engine: string;
  brakes: string;
  comfort: string;
  package: string;
}

export interface VehicleStats {
  reliability: number;
  comfort: number;
  performance: number;
  efficiency: number;
  prestige: number;
  complexity: number;
}

export interface VehicleModel {
  id: string;
  name: string;
  targetSegment: VehicleSegment;
  regionSuitability: Record<RegionId, number>;
  components: VehicleComponents;
  stats: VehicleStats;
  productionCost: number;
  salePrice: number;
  active: boolean;
  materialsRequired?: Partial<Record<MaterialType, number>>;
  designYear?: number;
}

export interface Region {
  id: RegionId;
  name: string;
  marketSize: number;
  incomeLevel: number;
  infrastructureLevel: number;
  priceSensitivity: number;
  prestigeSensitivity: number;
  economySensitivity: number;
  preferenceWeights: {
    comfort: number;
    efficiency: number;
    performance: number;
    prestige: number;
  };
}

export interface HistoricalModifier {
  key: 'demandMultiplier' | 'costMultiplier' | 'prestigeDemandBonus';
  value: number;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  affectedRegions: RegionId[];
  description: string;
  modifiers: HistoricalModifier[];
}

export interface SalesResult {
  modelId: string;
  regionId: RegionId;
  unitsSold: number;
  revenue: number;
}

export interface ModelSalesRecord {
  modelId: string;
  modelName: string;
  segment: VehicleSegment;
  produced: number;
  sold: number;
  unsold: number;
  revenue: number;
  unitPrice: number;
  unitCost: number;
}

export interface MonthlyReport {
  id: string;
  date: GameDate;
  unitsProduced: number;
  unitsSold: number;
  revenue: number;
  expenses: number;
  profit: number;
  researchProgress: Array<{ technologyId: string; progressMonths: number; completed: boolean }>;
  reputationChange: number;
  loanPayments?: number;
  eventNotes: string[];
  competitorNews?: string[];
  salesByRegion: Record<RegionId, number>;
  salesByModel?: Record<string, ModelSalesRecord>;
  materialsConsumed?: Partial<Record<MaterialType, number>>;
  materialExpenses?: number;
  capacityUsed?: number;
  shortageOccurred?: boolean;
  productionCost?: number;
  overheadCost?: number;
  researchCost?: number;
  rentCost?: number;
  globalRank?: number;
  globalRankings?: GlobalManufacturerRanking[];
}

export interface GlobalManufacturerRanking {
  rank: number;
  companyId: string;
  companyName: string;
  country?: CountryId | undefined;
  isPlayer: boolean;
  annualUnitsSold: number;
  annualRevenue: number;
  globalMarketShare: number;
  topModelName?: string | undefined;
}

export type QuarterlyReport = MonthlyReport;

export interface Achievement {
  id: string;
  titleRu: string;
  titleEn: string;
  titleUk?: string;
  titleDe?: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionUk?: string;
  descriptionDe?: string;
  icon: string;
  unlocked: boolean;
  unlockedAtYear?: number;
  unlockedAtQuarter?: 1 | 2 | 3 | 4;
}

export interface GameState {
  id: string;
  company: Company;
  date: GameDate;
  unlockedTechnologyIds: string[];
  activeResearch: ResearchProject[];
  vehicleModels: VehicleModel[];
  productionPlan: Record<string, number>;
  reportHistory: MonthlyReport[];
  competitors?: Competitor[];
  competitorMilestones?: CompetitorMilestone[];
  achievements?: Achievement[];
}

export interface EndTurnInput {
  gameState: GameState;
  regions: Region[];
  technologies: Technology[];
  events: HistoricalEvent[];
  competitors?: Competitor[];
  competitorMilestones?: CompetitorMilestone[];
}

export interface EndTurnOutput {
  gameState: GameState;
  report: MonthlyReport;
}
