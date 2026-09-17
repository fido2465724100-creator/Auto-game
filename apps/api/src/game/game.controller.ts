import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import type { VehicleModel, MaterialType } from '@ait/shared-types';
import { GameService } from './game.service';
import { StartResearchDto, UpdateProductionDto, VehicleModelDto, SetupCompanyDto } from './dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('state')
  getState() {
    return this.gameService.getGameState();
  }

  @Get('regions')
  getRegions() {
    return this.gameService.getRegions();
  }

  @Get('technologies')
  getTechnologies() {
    return this.gameService.getTechnologies();
  }

  @Get('components')
  getComponents() {
    return this.gameService.getVehicleComponents();
  }

  @Get('bank/templates')
  getLoanTemplates() {
    return this.gameService.getLoanTemplates();
  }

  @Post('bank/loan')
  takeLoan(@Body() body: { templateId: string }) {
    return this.gameService.takeLoan(body.templateId);
  }

  @Post('bank/repay')
  repayLoan(@Body() body: { loanId: string }) {
    return this.gameService.repayLoan(body.loanId);
  }

  @Post('research/start')
  startResearch(@Body() dto: StartResearchDto) {
    return this.gameService.startResearch(dto.technologyId, dto.allocatedBudget);
  }

  @Post('vehicles')
  saveVehicleModel(@Body() dto: VehicleModelDto) {
    return this.gameService.saveVehicleModel(dto as VehicleModel);
  }

  @Post('vehicles/:id/decommission')
  decommissionVehicle(@Param('id') id: string) {
    return this.gameService.decommissionVehicleModel(id);
  }

  @Post('vehicles/:id/activate')
  activateVehicle(@Param('id') id: string) {
    return this.gameService.activateVehicleModel(id);
  }

  @Delete('vehicles/:id')
  deleteVehicle(@Param('id') id: string) {
    return this.gameService.deleteVehicleModel(id);
  }

  @Patch('production')
  updateProduction(@Body() dto: UpdateProductionDto) {
    return this.gameService.updateProductionPlan(dto.productionPlan);
  }

  @Get('materials/market')
  getMaterialsMarket() {
    return this.gameService.getMaterialsMarket();
  }

  @Post('materials/buy')
  buyMaterial(@Body() body: { materialId: MaterialType; amount: number }) {
    return this.gameService.buyMaterial(body.materialId, body.amount);
  }

  @Post('materials/auto-procurement')
  setAutoProcurement(@Body() body: { enabled: boolean }) {
    return this.gameService.toggleAutoProcurement(body.enabled);
  }

  @Post('factory/expand')
  expandFactory() {
    return this.gameService.expandFactory();
  }

  @Post('company/setup')
  setupCompany(@Body() dto: SetupCompanyDto) {
    return this.gameService.setupCompany(dto);
  }

  @Get('competitors')
  getCompetitors() {
    return this.gameService.getCompetitors();
  }

  @Post('reset')
  resetGame(@Body() dto?: Partial<SetupCompanyDto>) {
    return this.gameService.resetGame(dto);
  }

  @Post('end-turn')
  endTurn() {
    return this.gameService.endTurn();
  }
}
