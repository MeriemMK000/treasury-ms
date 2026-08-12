import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentWorkflowService } from './payment-workflow.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { PaymentRequestStatus, ApprovalAction } from '../common/enums';

@ApiTags('Workflow Paiements')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('payment-requests')
export class PaymentWorkflowController {
  constructor(private pwService: PaymentWorkflowService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    return this.pwService.create({ ...data, groupId: req.tenantGroupId, requestedBy: req.user.id });
  }

  @Get()
  findAll(@Req() req: any, @Query('status') status?: PaymentRequestStatus, @Query('businessUnitId') buId?: string) {
    return this.pwService.findAll(req.tenantGroupId, { status, businessUnitId: buId });
  }

  @Get('pending/count')
  pendingCount(@Req() req: any) { return this.pwService.getPendingCount(req.tenantGroupId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.pwService.findById(id); }

  @Post(':id/submit')
  submit(@Param('id') id: string) { return this.pwService.submit(id); }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() body: { action: ApprovalAction; comment?: string }, @Req() req: any) {
    return this.pwService.approve(id, req.user.id, `${req.user.firstName} ${req.user.lastName}`, body.action, body.comment);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Exécuter le paiement validé' })
  execute(@Param('id') id: string, @Req() req: any) {
    return this.pwService.execute(id, req.user.id);
  }
}
