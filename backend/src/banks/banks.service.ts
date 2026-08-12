import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';
import { BankAgency } from './entities/bank-agency.entity';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank) private bankRepo: Repository<Bank>,
    @InjectRepository(BankAgency) private agencyRepo: Repository<BankAgency>,
    @InjectRepository(BankAccount) private accountRepo: Repository<BankAccount>,
  ) {}

  // === Banks ===
  async createBank(data: Partial<Bank>) { return this.bankRepo.save(this.bankRepo.create(data)); }

  async findAllBanks(groupId: string) {
    return this.bankRepo.find({ where: { groupId }, relations: ['agencies'], order: { name: 'ASC' } });
  }

  async findBankById(id: string) {
    const bank = await this.bankRepo.findOne({ where: { id }, relations: ['agencies', 'agencies.accounts'] });
    if (!bank) throw new NotFoundException('Banque non trouvée');
    return bank;
  }

  async updateBank(id: string, data: Partial<Bank>) {
    await this.bankRepo.update(id, data);
    return this.findBankById(id);
  }

  // === Agencies ===
  async createAgency(data: Partial<BankAgency>) { return this.agencyRepo.save(this.agencyRepo.create(data)); }

  async findAgenciesByBank(bankId: string) {
    return this.agencyRepo.find({ where: { bankId }, relations: ['accounts'], order: { name: 'ASC' } });
  }

  // === Accounts ===
  async createAccount(data: Partial<BankAccount>) { return this.accountRepo.save(this.accountRepo.create(data)); }

  async findAllAccounts(groupId: string, filters?: { businessUnitId?: string; bankId?: string }) {
    const qb = this.accountRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.agency', 'ag')
      .where('a.groupId = :groupId', { groupId });

    if (filters?.businessUnitId) qb.andWhere('a.businessUnitId = :buId', { buId: filters.businessUnitId });
    if (filters?.bankId) qb.andWhere('ag.bankId = :bankId', { bankId: filters.bankId });

    return qb.orderBy('a.label', 'ASC').getMany();
  }

  async findAccountById(id: string) {
    const account = await this.accountRepo.findOne({ where: { id }, relations: ['agency', 'agency.bank'] });
    if (!account) throw new NotFoundException('Compte non trouvé');
    return account;
  }

  async updateAccountBalance(id: string, balance: number, available?: number) {
    await this.accountRepo.update(id, {
      currentBalance: balance,
      ...(available !== undefined && { availableBalance: available }),
    });
  }

  async getConsolidatedBalance(groupId: string, accountIds?: string[]) {
    const qb = this.accountRepo.createQueryBuilder('a')
      .select('SUM(a.currentBalance)', 'totalBalance')
      .addSelect('SUM(a.availableBalance)', 'totalAvailable')
      .addSelect('a.currency', 'currency')
      .where('a.groupId = :groupId', { groupId })
      .groupBy('a.currency');

    if (accountIds?.length) qb.andWhere('a.id IN (:...ids)', { ids: accountIds });

    return qb.getRawMany();
  }
}
