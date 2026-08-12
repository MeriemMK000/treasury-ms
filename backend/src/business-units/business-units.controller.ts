import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessUnitsService } from './business-units.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Business Units')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('business-units')
export class BusinessUnitsController {
  constructor(private buService: BusinessUnitsService) {}

  @Post() create(@Body() data: any, @Req() req: any) { return this.buService.create({ ...data, groupId: req.tenantGroupId }); }
  @Get() findAll(@Req() req: any) { return this.buService.findByGroup(req.tenantGroupId); }
  @Get(':id') findOne(@Param('id') id: string) { return this.buService.findById(id); }
  @Put(':id') update(@Param('id') id: string, @Body() data: any) { return this.buService.update(id, data); }
}
