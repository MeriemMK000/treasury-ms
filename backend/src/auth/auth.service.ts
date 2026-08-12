import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';
import { UserRole } from '../common/enums';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BootstrapDto } from './dto/bootstrap.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: ['group'],
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    user.lastLogin = new Date();
    await this.userRepo.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
      businessUnitIds: user.businessUnitIds,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        groupId: user.groupId,
        groupName: user.group?.name,
        businessUnitIds: user.businessUnitIds,
      },
    };
  }

  async bootstrap(dto: BootstrapDto) {
    const anyUser = await this.userRepo.findOne({ where: {} });
    if (anyUser) throw new ForbiddenException('Un utilisateur existe déjà, le bootstrap est désactivé');

    const group = this.groupRepo.create({ name: 'Groupe Principal' });
    const savedGroup = await this.groupRepo.save(group);

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      email: dto.email,
      password: hashed,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: UserRole.SUPER_ADMIN,
      groupId: savedGroup.id,
      businessUnitIds: [],
    });
    const saved = await this.userRepo.save(user);

    const { password, ...result } = saved;
    return result;
  }

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Cet email est déjà utilisé');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({ ...dto, password: hashed });
    const saved = await this.userRepo.save(user);

    const { password, ...result } = saved;
    return result;
  }
}
