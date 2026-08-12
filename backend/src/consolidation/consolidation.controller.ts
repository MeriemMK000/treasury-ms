import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ConsolidationService } from './consolidation.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Consolidation')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('consolidation')
export class ConsolidationController {
  constructor(private cService: ConsolidationService) {}

  @Post('models')
  create(@Body() data: any, @Req() req: any) { return this.cService.createModel({ ...data, groupId: req.tenantGroupId }); }

  @Get('models')
  findAll(@Req() req: any) { return this.cService.findAllModels(req.tenantGroupId); }

  @Get('models/:id')
  findOne(@Param('id') id: string) { return this.cService.findModelById(id); }

  @Put('models/:id')
  update(@Param('id') id: string, @Body() data: any) { return this.cService.updateModel(id, data); }

  @Post('models/:id/execute')
  @ApiOperation({ summary: 'Exécuter la consolidation' })
  execute(@Param('id') id: string) { return this.cService.executeConsolidation(id); }
}
