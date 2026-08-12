import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InternationalService } from './international.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { ImportOperationStatus } from '../common/enums';

@ApiTags('Opérations Internationales')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('international')
export class InternationalController {
  constructor(private intlService: InternationalService) {}

  // PPI
  @Post('ppi')
  @ApiOperation({ summary: 'Créer un item PPI' })
  createPpi(@Body() data: any, @Req() req: any) {
    return this.intlService.createPpiItem({ ...data, groupId: req.tenantGroupId });
  }

  @Get('ppi')
  findAllPpi(@Req() req: any, @Query('year') year?: number, @Query('isUsed') isUsed?: boolean) {
    return this.intlService.findAllPpi(req.tenantGroupId, { year, isUsed });
  }

  @Post('ppi/:id/validate')
  validatePpi(@Param('id') id: string) { return this.intlService.validatePpi(id); }

  @Post('ppi/:id/use')
  usePpi(@Param('id') id: string, @Body() body: { operationId: string }) {
    return this.intlService.usePpiPosition(id, body.operationId);
  }

  // Import Operations
  @Post('operations')
  createOp(@Body() data: any, @Req() req: any) {
    return this.intlService.createImportOperation({ ...data, groupId: req.tenantGroupId });
  }

  @Get('operations')
  findAllOps(@Req() req: any, @Query('status') status?: ImportOperationStatus, @Query('businessUnitId') buId?: string) {
    return this.intlService.findAllImportOps(req.tenantGroupId, { status, businessUnitId: buId });
  }

  @Get('operations/:id')
  findOp(@Param('id') id: string) { return this.intlService.findImportOpById(id); }

  @Post('operations/:id/predom')
  launchPredom(@Param('id') id: string, @Body() data: any) { return this.intlService.launchPredomiciliation(id, data); }

  @Post('operations/:id/predom/confirm')
  confirmPredom(@Param('id') id: string) { return this.intlService.confirmPredomiciliation(id); }

  @Post('operations/:id/dom')
  launchDom(@Param('id') id: string, @Body() data: any) { return this.intlService.launchDomiciliation(id, data); }

  @Post('operations/:id/dom/confirm')
  confirmDom(@Param('id') id: string) { return this.intlService.confirmDomiciliation(id); }

  @Post('operations/:id/lc')
  openLC(@Param('id') id: string, @Body() data: any) { return this.intlService.openLC(id, data); }

  @Post('operations/:id/cil')
  addCIL(@Param('id') id: string, @Body() data: any) { return this.intlService.addCIL(id, data); }

  @Post('operations/:id/fee')
  addFee(@Param('id') id: string, @Body() data: any) { return this.intlService.addFee(id, data); }

  @Post('operations/:id/advance')
  advanceStatus(@Param('id') id: string, @Body() body: { status: ImportOperationStatus; data?: any }) {
    return this.intlService.advanceStatus(id, body.status, body.data);
  }

  // Documents
  @Post('documents')
  addDoc(@Body() data: any, @Req() req: any) {
    return this.intlService.addDocument({ ...data, groupId: req.tenantGroupId });
  }

  @Post('documents/:id/verify')
  verifyDoc(@Param('id') id: string, @Body() body: { notes: string }) {
    return this.intlService.verifyDocument(id, body.notes);
  }

  // Analytics
  @Get('maturities')
  @ApiOperation({ summary: 'Tombées d\'échéance à venir' })
  maturities(@Req() req: any, @Query('days') days?: number) {
    return this.intlService.getUpcomingMaturities(req.tenantGroupId, days);
  }

  @Get('lc-exposure')
  @ApiOperation({ summary: 'Exposition LC/CIL' })
  lcExposure(@Req() req: any) { return this.intlService.getLCExposure(req.tenantGroupId); }
}
