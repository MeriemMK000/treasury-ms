import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { BankAgency } from './bank-agency.entity';

@Entity('banks')
export class Bank extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'swift_code', nullable: true })
  swiftCode: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'contact_name', nullable: true })
  contactName: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'group_id' })
  groupId: string;

  @OneToMany(() => BankAgency, (a) => a.bank)
  agencies: BankAgency[];
}
