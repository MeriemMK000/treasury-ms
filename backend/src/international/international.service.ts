import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PpiItem } from './entities/ppi-item.entity';
import { ImportOperation } from './entities/import-operation.entity';
import { ImportDocument } from './entities/import-document.entity';
import { ImportOperationStatus } from '../common/enums';

@Injectable()
export class InternationalService {
  constructor(
    @InjectRepository(PpiItem) private ppiRepo: Repository<PpiItem>,
    @InjectRepository(ImportOperation) private impOpRepo: Repository<ImportOperation>,
    @InjectRepository(ImportDocument) private docRepo: Repository<ImportDocument>,
  ) {}

  // === PPI ===
  async createPpiItem(data: Partial<PpiItem>) {
    return this.ppiRepo.save(this.ppiRepo.create(data));
  }

  async findAllPpi(groupId: string, filters?: { year?: number; isUsed?: boolean; businessUnitId?: string }) {
    const qb = this.ppiRepo.createQueryBuilder('p').where('p.groupId = :groupId', { groupId });
    if (filters?.year) qb.andWhere('p.ppiYear = :year', { year: filters.year });
    if (filters?.isUsed !== undefined) qb.andWhere('p.isUsed = :used', { used: filters.isUsed });
    if (filters?.businessUnitId) qb.andWhere('p.businessUnitId = :buId', { buId: filters.businessUnitId });
    return qb.orderBy('p.createdAt', 'DESC').getMany();
  }

  async validatePpi(id: string) {
    const ppi = await this.ppiRepo.findOne({ where: { id } });
    if (!ppi) throw new NotFoundException('Item PPI non trouvé');
    ppi.isValidated = true;
    ppi.validationDate = new Date();
    return this.ppiRepo.save(ppi);
  }

  async usePpiPosition(ppiId: string, operationId: string) {
    const ppi = await this.ppiRepo.findOne({ where: { id: ppiId } });
    if (!ppi) throw new NotFoundException('Item PPI non trouvé');
    if (!ppi.isValidated) throw new BadRequestException('Item PPI non validé');
    if (ppi.isUsed) throw new BadRequestException('Position PPI déjà utilisée - Risque de double utilisation');
    ppi.isUsed = true;
    ppi.usedByOperationId = operationId;
    return this.ppiRepo.save(ppi);
  }

  // === Import Operations ===
  async createImportOperation(data: Partial<ImportOperation>) {
    const ref = `IMP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
    return this.impOpRepo.save(this.impOpRepo.create({ ...data, reference: ref }));
  }

  async findAllImportOps(groupId: string, filters?: { status?: ImportOperationStatus; businessUnitId?: string }) {
    const qb = this.impOpRepo.createQueryBuilder('io')
      .leftJoinAndSelect('io.documents', 'd')
      .where('io.groupId = :groupId', { groupId });
    if (filters?.status) qb.andWhere('io.status = :status', { status: filters.status });
    if (filters?.businessUnitId) qb.andWhere('io.businessUnitId = :buId', { buId: filters.businessUnitId });
    return qb.orderBy('io.createdAt', 'DESC').getMany();
  }

  async findImportOpById(id: string) {
    const op = await this.impOpRepo.findOne({ where: { id }, relations: ['documents'] });
    if (!op) throw new NotFoundException('Opération d\'import non trouvée');
    return op;
  }

  async advanceStatus(id: string, newStatus: ImportOperationStatus, additionalData?: Partial<ImportOperation>) {
    const op = await this.findImportOpById(id);
    const statusFlow: ImportOperationStatus[] = [
      ImportOperationStatus.PPI_ENREGISTRE, ImportOperationStatus.PPI_VALIDE,
      ImportOperationStatus.PREDOMICILIATION, ImportOperationStatus.PREDOM_OBTENUE,
      ImportOperationStatus.DOMICILIATION, ImportOperationStatus.DOMICILIATION_OBTENUE,
      ImportOperationStatus.LC_DEMANDEE, ImportOperationStatus.LC_OUVERTE,
      ImportOperationStatus.EXPEDITION, ImportOperationStatus.DOCUMENTS_RECUS,
      ImportOperationStatus.PAIEMENT, ImportOperationStatus.CLOTURE,
    ];

    const currentIdx = statusFlow.indexOf(op.status);
    const newIdx = statusFlow.indexOf(newStatus);
    if (newIdx <= currentIdx) throw new BadRequestException(`Transition de ${op.status} vers ${newStatus} non autorisée`);

    Object.assign(op, { status: newStatus, ...additionalData });
    return this.impOpRepo.save(op);
  }

  async launchPredomiciliation(id: string, data: { predomRef: string; predomDate: Date; predomBankId: string }) {
    return this.advanceStatus(id, ImportOperationStatus.PREDOMICILIATION, data);
  }

  async confirmPredomiciliation(id: string) {
    return this.advanceStatus(id, ImportOperationStatus.PREDOM_OBTENUE);
  }

  async launchDomiciliation(id: string, data: { domRef: string; domDate: Date; domBankId: string }) {
    return this.advanceStatus(id, ImportOperationStatus.DOMICILIATION, data);
  }

  async confirmDomiciliation(id: string) {
    return this.advanceStatus(id, ImportOperationStatus.DOMICILIATION_OBTENUE);
  }

  async openLC(id: string, data: { lcRef: string; lcType: string; lcOpeningDate: Date; lcExpiryDate: Date; lcAmount: number }) {
    return this.advanceStatus(id, ImportOperationStatus.LC_OUVERTE, data);
  }

  async addCIL(id: string, data: { cilRef: string; cilAmount: number; cilMaturityDate: Date }) {
    const op = await this.findImportOpById(id);
    Object.assign(op, data);
    return this.impOpRepo.save(op);
  }

  async addFee(id: string, fee: { type: string; amount: number; description: string }) {
    const op = await this.findImportOpById(id);
    const fees = op.feesDetail || [];
    fees.push({ ...fee, date: new Date() });
    op.feesDetail = fees;
    op.totalFees = fees.reduce((sum, f) => sum + Number(f.amount), 0);
    return this.impOpRepo.save(op);
  }

  // === Documents ===
  async addDocument(data: Partial<ImportDocument>) {
    return this.docRepo.save(this.docRepo.create(data));
  }

  async verifyDocument(id: string, notes: string) {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document non trouvé');
    doc.isVerified = true;
    doc.verificationNotes = notes;
    return this.docRepo.save(doc);
  }

  // === Maturity tracking ===
  async getUpcomingMaturities(groupId: string, days: number = 30) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.impOpRepo.createQueryBuilder('io')
      .where('io.groupId = :groupId', { groupId })
      .andWhere('io.status NOT IN (:...closed)', { closed: [ImportOperationStatus.CLOTURE] })
      .andWhere('(io.lcExpiryDate <= :end OR io.cilMaturityDate <= :end OR io.docCollectionDueDate <= :end)', { end: endDate })
      .orderBy('LEAST(COALESCE(io.lcExpiryDate, \'9999-12-31\'), COALESCE(io.cilMaturityDate, \'9999-12-31\'), COALESCE(io.docCollectionDueDate, \'9999-12-31\'))', 'ASC')
      .getMany();
  }

  async getLCExposure(groupId: string) {
    return this.impOpRepo.createQueryBuilder('io')
      .select('SUM(io.lcAmount)', 'totalLC')
      .addSelect('SUM(io.cilAmount)', 'totalCIL')
      .addSelect('COUNT(*)', 'count')
      .where('io.groupId = :groupId', { groupId })
      .andWhere('io.status NOT IN (:...closed)', { closed: [ImportOperationStatus.CLOTURE] })
      .andWhere('io.lcAmount IS NOT NULL')
      .getRawOne();
  }
}
