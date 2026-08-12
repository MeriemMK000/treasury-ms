import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OperationsService } from './operations.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { OperationType, OperationStatus } from '../common/enums';

@ApiTags('Opérations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('operations')
export class OperationsController {
  constructor(private opsService: OperationsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une opération' })
  create(@Body() data: any, @Req() req: any) {
    return this.opsService.create({ ...data, groupId: req.tenantGroupId, createdBy: req.user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Liste des opérations' })
  findAll(@Req() req: any,
    @Query('type') type?: OperationType, @Query('status') status?: OperationStatus,
    @Query('businessUnitId') buId?: string, @Query('bankAccountId') accId?: string,
    @Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string,
    @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number,
  ) {
    return this.opsService.findAll(req.tenantGroupId, { type, status, businessUnitId: buId, bankAccountId: accId, dateFrom, dateTo, search, page, limit });
  }

  @Get('cash-position')
  @ApiOperation({ summary: 'Position de trésorerie' })
  cashPosition(@Req() req: any, @Query('businessUnitId') buId?: string) {
    return this.opsService.getCashPosition(req.tenantGroupId, buId);
  }

  @Get('by-period')
  byPeriod(@Req() req: any, @Query('start') start: string, @Query('end') end: string, @Query('type') type?: OperationType) {
    return this.opsService.getOperationsByPeriod(req.tenantGroupId, start, end, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.opsService.findById(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.opsService.update(id, data); }

  @Post(':id/position')
  @ApiOperation({ summary: 'Positionner une opération' })
  position(@Param('id') id: string) { return this.opsService.positionOperation(id); }

  @Post('fees')
  createFee(@Body() data: any, @Req() req: any) {
    return this.opsService.createFee({ ...data, groupId: req.tenantGroupId });
  }

  @Get('fees/all')
  getFees(@Req() req: any, @Query('hasAnomaly') anomaly?: boolean) {
    return this.opsService.getFees(req.tenantGroupId, { hasAnomaly: anomaly });
  }

  @Get('fees/summary')
  feesSummary(@Req() req: any) { return this.opsService.getFeesSummary(req.tenantGroupId); }
}
