import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { ImportOperation } from './import-operation.entity';

@Entity('import_documents')
export class ImportDocument extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column({ unique: true })
  reference: string;

  @Column({ name: 'file_path', nullable: true })
  filePath: string;

  @Column({ name: 'file_size', nullable: true })
  fileSize: number;

  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ name: 'scan_date', type: 'date', nullable: true })
  scanDate: Date;

  @Column({ type: 'jsonb', name: 'extracted_data', nullable: true })
  extractedData: Record<string, any>;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verification_notes', nullable: true })
  verificationNotes: string;

  @Column({ name: 'import_operation_id' })
  importOperationId: string;

  @ManyToOne(() => ImportOperation, (io) => io.documents)
  @JoinColumn({ name: 'import_operation_id' })
  importOperation: ImportOperation;

  @Column({ name: 'group_id' })
  groupId: string;
}
