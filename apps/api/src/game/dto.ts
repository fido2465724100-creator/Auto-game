import { IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Min } from 'class-validator';
import type { RegionId, VehicleSegment, VehicleStats } from '@ait/shared-types';

export class StartResearchDto {
  @IsString()
  @IsNotEmpty()
  technologyId!: string;

  @IsInt()
  @Min(0)
  allocatedBudget!: number;
}

export class VehicleModelDto {
  @IsString()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  targetSegment!: VehicleSegment;

  @IsObject()
  regionSuitability!: Record<RegionId, number>;

  @IsObject()
  components!: {
    chassis: string;
    engine: string;
    brakes: string;
    comfort: string;
    package: string;
  };

  @IsObject()
  stats!: VehicleStats;

  @IsInt()
  @Min(0)
  productionCost!: number;

  @IsInt()
  @Min(1)
  salePrice!: number;

  @IsBoolean()
  active!: boolean;
}

export class UpdateProductionDto {
  @IsObject()
  productionPlan!: Record<string, number>;
}
