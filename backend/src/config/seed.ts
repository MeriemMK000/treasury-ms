import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'treasury',
  password: process.env.DB_PASSWORD || 'treasury_secret_2024',
  database: process.env.DB_NAME || 'treasury_ms',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  await ds.initialize();
  console.log('🌱 Seeding database...');

  const groupId = uuid();
  await ds.query(`INSERT INTO groups (id, name, description, legal_name, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
    [groupId, 'Groupe Industriel Alpha', 'Groupe de démonstration', 'GIA SARL']);

  const bu1Id = uuid(), bu2Id = uuid();
  await ds.query(`INSERT INTO business_units (id, name, code, description, group_id, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
    [bu1Id, 'BU Production', 'BU-PROD', 'Unité de production', groupId]);
  await ds.query(`INSERT INTO business_units (id, name, code, description, group_id, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
    [bu2Id, 'BU Commercial', 'BU-COM', 'Unité commerciale', groupId]);

  const pwd = await bcrypt.hash('admin123', 12);
  await ds.query(`INSERT INTO users (id, email, password, first_name, last_name, role, group_id, business_unit_ids, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())`,
    [uuid(), 'admin@treasury.dz', pwd, 'Admin', 'Système', 'admin', groupId, `{${bu1Id},${bu2Id}}`]);
  await ds.query(`INSERT INTO users (id, email, password, first_name, last_name, role, group_id, business_unit_ids, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())`,
    [uuid(), 'tresorier@treasury.dz', pwd, 'Mohamed', 'Benali', 'treasurer', groupId, `{${bu1Id},${bu2Id}}`]);

  const bankId = uuid(), agencyId = uuid();
  await ds.query(`INSERT INTO banks (id, name, code, swift_code, group_id, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
    [bankId, 'Banque Nationale d\'Algérie', 'BNA', 'BNAADZAL', groupId]);
  await ds.query(`INSERT INTO bank_agencies (id, name, code, bank_id, address, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
    [agencyId, 'Agence Centrale Alger', 'BNA-ALG-001', bankId, 'Rue Didouche Mourad, Alger']);

  const acc1Id = uuid();
  await ds.query(`INSERT INTO bank_accounts (id, account_number, rib, label, currency, current_balance, available_balance, business_unit_id, agency_id, group_id, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW(), NOW())`,
    [acc1Id, '00120001234567890', '001200012345678901234', 'Compte Principal BNA', 'DZD', 45000000, 42000000, bu1Id, agencyId, groupId]);

  console.log('✅ Seed complete!');
  console.log('📧 Login: admin@treasury.dz / admin123');
  await ds.destroy();
}

seed().catch(console.error);
