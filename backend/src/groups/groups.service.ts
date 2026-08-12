import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(@InjectRepository(Group) private groupRepo: Repository<Group>) {}

  async create(data: Partial<Group>) { return this.groupRepo.save(this.groupRepo.create(data)); }
  async findAll() { return this.groupRepo.find({ relations: ['businessUnits'], order: { name: 'ASC' } }); }
  async findById(id: string) {
    const g = await this.groupRepo.findOne({ where: { id }, relations: ['businessUnits', 'users'] });
    if (!g) throw new NotFoundException('Groupe non trouvé');
    return g;
  }
  async update(id: string, data: Partial<Group>) { await this.groupRepo.update(id, data); return this.findById(id); }
}
