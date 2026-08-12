import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';

@ApiTags('Groupes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupsController {
  constructor(private gService: GroupsService) {}

  @Post() create(@Body() data: any) { return this.gService.create(data); }
  @Get() findAll() { return this.gService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.gService.findById(id); }
  @Put(':id') update(@Param('id') id: string, @Body() data: any) { return this.gService.update(id, data); }
}
