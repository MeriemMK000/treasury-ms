import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessUnit } from './entities/business-unit.entity';

@Injectable()
export class BusinessUnitsService {
  constructor(@InjectRepository(BusinessUnit) private buRepo: Repository<BusinessUnit>) {}

  async create(data: Partial<BusinessUnit>) { return this.buRepo.save(this.buRepo.create(data)); }
  async findByGroup(groupId: string) { return this.buRepo.find({ where: { groupId, isActive: true }, order: { name: 'ASC' } }); }
  async findById(id: string) {
    const bu = await this.buRepo.findOne({ where: { id } });
    if (!bu) throw new NotFoundException('Business Unit non trouvée');
    return bu;
  }
  async update(id: string, data: Partial<BusinessUnit>) { await this.buRepo.update(id, data); return this.findById(id); }
}
