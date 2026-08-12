import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Group } from '../../groups/entities/group.entity';
import { UserRole } from '../../common/enums';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => Group, (g) => g.users)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column('uuid', { name: 'business_unit_ids', array: true, default: '{}' })
  businessUnitIds: string[];

  @Column({ name: 'last_login', nullable: true })
  lastLogin: Date;
}
