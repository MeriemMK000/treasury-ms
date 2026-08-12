import { Controller, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('users')
export class UsersController {
  constructor(private uService: UsersService) {}

  @Get() findAll(@Req() req: any) { return this.uService.findByGroup(req.tenantGroupId); }
  @Get('me') me(@Req() req: any) { return this.uService.findById(req.user.id); }
  @Get(':id') findOne(@Param('id') id: string) { return this.uService.findById(id); }
  @Put(':id') update(@Param('id') id: string, @Body() data: any) { return this.uService.update(id, data); }
}
