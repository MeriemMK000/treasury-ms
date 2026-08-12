import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findByGroup(groupId: string) {
    return this.userRepo.find({ where: { groupId }, select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'lastLogin', 'businessUnitIds'], order: { lastName: 'ASC' } });
  }
  async findById(id: string) {
    const u = await this.userRepo.findOne({ where: { id }, select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'lastLogin', 'businessUnitIds', 'groupId'] });
    if (!u) throw new NotFoundException('Utilisateur non trouvé');
    return u;
  }
  async update(id: string, data: Partial<User>) { await this.userRepo.update(id, data); return this.findById(id); }
}
