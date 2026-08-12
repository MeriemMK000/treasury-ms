import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BankStatementsService } from './bank-statements.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Relevés Bancaires')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('bank-statements')
export class BankStatementsController {
  constructor(private bsService: BankStatementsService) {}

  @Post('import')
  @ApiOperation({ summary: 'Importer un relevé bancaire' })
  importStmt(@Body() data: any, @Req() req: any) {
    return this.bsService.importStatement({ ...data, groupId: req.tenantGroupId });
  }

  @Get()
  findAll(@Req() req: any) { return this.bsService.findAll(req.tenantGroupId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.bsService.findById(id); }

  @Post(':id/auto-match')
  @ApiOperation({ summary: 'Rapprochement automatique' })
  autoMatch(@Param('id') id: string) { return this.bsService.autoMatchLines(id); }

  @Post('lines/:lineId/match')
  matchLine(@Param('lineId') lineId: string, @Body() body: { operationId: string }) {
    return this.bsService.matchLine(lineId, body.operationId);
  }

  @Get(':id/fees')
  @ApiOperation({ summary: 'Détecter les frais dans le relevé' })
  detectFees(@Param('id') id: string) { return this.bsService.detectFees(id); }
}
