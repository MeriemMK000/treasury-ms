import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommitmentsService } from './commitments.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CommitmentStatus } from '../common/enums';

@ApiTags('Engagements')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('commitments')
export class CommitmentsController {
  constructor(private cService: CommitmentsService) {}

  @Post('lines')
  createLine(@Body() data: any, @Req() req: any) {
    return this.cService.createLine({ ...data, groupId: req.tenantGroupId });
  }

  @Get('lines')
  findAllLines(@Req() req: any, @Query('businessUnitId') buId?: string, @Query('bankId') bankId?: string,
    @Query('type') type?: string, @Query('status') status?: CommitmentStatus) {
    return this.cService.findAllLines(req.tenantGroupId, { businessUnitId: buId, bankId, type, status });
  }

  @Get('lines/summary')
  linesSummary(@Req() req: any) { return this.cService.getLinesSummary(req.tenantGroupId); }

  @Get('lines/expiring')
  expiringLines(@Req() req: any, @Query('days') days?: number) {
    return this.cService.getExpiringLines(req.tenantGroupId, days);
  }

  @Get('lines/:id')
  findLine(@Param('id') id: string) { return this.cService.findLineById(id); }

  @Put('lines/:id/usage')
  updateUsage(@Param('id') id: string, @Body() body: { usedAmount: number }) {
    return this.cService.updateLineUsage(id, body.usedAmount);
  }

  @Post('maturities')
  createMaturity(@Body() data: any, @Req() req: any) {
    return this.cService.createMaturity({ ...data, groupId: req.tenantGroupId });
  }

  @Get('maturities/upcoming')
  upcomingMaturities(@Req() req: any, @Query('days') days?: number) {
    return this.cService.getUpcomingMaturities(req.tenantGroupId, days);
  }

  @Post('maturities/:id/pay')
  payMaturity(@Param('id') id: string) { return this.cService.markMaturityPaid(id); }

  @Post('unpaid')
  createUnpaid(@Body() data: any, @Req() req: any) {
    return this.cService.createUnpaid({ ...data, groupId: req.tenantGroupId });
  }

  @Get('unpaid')
  findUnpaid(@Req() req: any) { return this.cService.findAllUnpaid(req.tenantGroupId); }

  @Post('unpaid/:id/resolve')
  resolveUnpaid(@Param('id') id: string, @Body() body: { note: string }) {
    return this.cService.resolveUnpaid(id, body.note);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Tableau d\'alertes engagements' })
  getAlerts(@Req() req: any) { return this.cService.getAlerts(req.tenantGroupId); }
}
