import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ForecastingService } from './forecasting.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Prévisionnel')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('forecasting')
export class ForecastingController {
  constructor(private fService: ForecastingService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    return this.fService.createForecast({ ...data, groupId: req.tenantGroupId });
  }

  @Get()
  findAll(@Req() req: any, @Query('businessUnitId') buId?: string, @Query('period') period?: string) {
    return this.fService.findAll(req.tenantGroupId, { businessUnitId: buId, period });
  }

  @Get('critical')
  critical(@Req() req: any) { return this.fService.getCriticalSituations(req.tenantGroupId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.fService.findById(id); }

  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() data: any) { return this.fService.addItem(id, data); }

  @Post(':id/recalculate')
  recalculate(@Param('id') id: string) { return this.fService.recalculateForecast(id); }

  @Get(':id/deficit-solutions')
  @ApiOperation({ summary: 'Solutions au déficit de trésorerie' })
  deficitSolutions(@Param('id') id: string) { return this.fService.suggestDeficitSolutions(id); }

  @Post('consolidated')
  @ApiOperation({ summary: 'Prévisionnel consolidé multi-BU' })
  consolidated(@Req() req: any, @Body() body: { buIds: string[]; startDate: string; endDate: string }) {
    return this.fService.generateConsolidatedForecast(req.tenantGroupId, body.buIds, body.startDate, body.endDate);
  }
}
