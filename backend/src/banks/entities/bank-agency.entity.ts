import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Bank } from './bank.entity';
import { BankAccount } from './bank-account.entity';

@Entity('bank_agencies')
export class BankAgency extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'contact_name', nullable: true })
  contactName: string;

  @Column({ name: 'bank_id' })
  bankId: string;

  @ManyToOne(() => Bank, (b) => b.agencies)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @OneToMany(() => BankAccount, (a) => a.agency)
  accounts: BankAccount[];
}
