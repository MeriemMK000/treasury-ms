import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BanksService } from './banks.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Banques')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('banks')
export class BanksController {
  constructor(private banksService: BanksService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une banque' })
  createBank(@Body() data: any, @Req() req: any) {
    return this.banksService.createBank({ ...data, groupId: req.tenantGroupId });
  }

  @Get()
  @ApiOperation({ summary: 'Liste des banques' })
  findAll(@Req() req: any) {
    return this.banksService.findAllBanks(req.tenantGroupId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.banksService.findBankById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.banksService.updateBank(id, data);
  }

  @Post('agencies')
  createAgency(@Body() data: any) {
    return this.banksService.createAgency(data);
  }

  @Get(':bankId/agencies')
  findAgencies(@Param('bankId') bankId: string) {
    return this.banksService.findAgenciesByBank(bankId);
  }

  @Post('accounts')
  createAccount(@Body() data: any, @Req() req: any) {
    return this.banksService.createAccount({ ...data, groupId: req.tenantGroupId });
  }

  @Get('accounts/all')
  findAllAccounts(@Req() req: any, @Query('businessUnitId') buId?: string, @Query('bankId') bankId?: string) {
    return this.banksService.findAllAccounts(req.tenantGroupId, { businessUnitId: buId, bankId });
  }

  @Get('accounts/:id')
  findAccount(@Param('id') id: string) {
    return this.banksService.findAccountById(id);
  }

  @Get('consolidated/balance')
  @ApiOperation({ summary: 'Solde consolidé' })
  getConsolidated(@Req() req: any) {
    return this.banksService.getConsolidatedBalance(req.tenantGroupId);
  }
}
