import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Rapports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('reports')
export class ReportsController {
  constructor(private rService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Données tableau de bord' })
  dashboard(@Req() req: any) { return this.rService.getDashboardData(req.tenantGroupId); }

  @Get('cash-evolution')
  cashEvolution(@Req() req: any, @Query('start') start: string, @Query('end') end: string) {
    return this.rService.getCashEvolution(req.tenantGroupId, start, end);
  }

  @Get('by-entity')
  byEntity(@Req() req: any, @Query('start') start?: string, @Query('end') end?: string) {
    return this.rService.getOperationsByEntity(req.tenantGroupId, start, end);
  }

  @Get('top-payments')
  topPayments(@Req() req: any, @Query('limit') limit?: number) {
    return this.rService.getTopPayments(req.tenantGroupId, limit);
  }

  @Get('by-nature')
  byNature(@Req() req: any) { return this.rService.getOperationsByNature(req.tenantGroupId); }
}
