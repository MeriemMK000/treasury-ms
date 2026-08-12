export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TREASURER = 'treasurer',
  VALIDATOR = 'validator',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export enum OperationType {
  ENCAISSEMENT = 'encaissement',
  DECAISSEMENT = 'decaissement',
}

export enum OperationNature {
  VIREMENT = 'virement',
  CHEQUE = 'cheque',
  EFFET = 'effet',
  ESPECES = 'especes',
  PRELEVEMENT = 'prelevement',
  CARTE = 'carte',
  LC_PAYMENT = 'lc_payment',
  CIL_PAYMENT = 'cil_payment',
  REMISE_DOC = 'remise_documentaire',
  AUTRE = 'autre',
}

export enum OperationStatus {
  BROUILLON = 'brouillon',
  EN_ATTENTE = 'en_attente',
  VALIDE = 'valide',
  POSITIONNE = 'positionne',
  ENCAISSE = 'encaisse',
  REJETE = 'rejete',
  ANNULE = 'annule',
}

export enum PaymentRequestStatus {
  BROUILLON = 'brouillon',
  SOUMIS = 'soumis',
  EN_VALIDATION = 'en_validation',
  VALIDE = 'valide',
  REJETE = 'rejete',
  EXECUTE = 'execute',
  ANNULE = 'annule',
}

export enum ApprovalAction {
  APPROUVE = 'approuve',
  REJETE = 'rejete',
  DEMANDE_INFO = 'demande_info',
}

export enum ImportOperationStatus {
  PPI_ENREGISTRE = 'ppi_enregistre',
  PPI_VALIDE = 'ppi_valide',
  PREDOMICILIATION = 'predomiciliation',
  PREDOM_OBTENUE = 'predom_obtenue',
  DOMICILIATION = 'domiciliation',
  DOMICILIATION_OBTENUE = 'dom_obtenue',
  LC_DEMANDEE = 'lc_demandee',
  LC_OUVERTE = 'lc_ouverte',
  EXPEDITION = 'expedition',
  DOCUMENTS_RECUS = 'documents_recus',
  PAIEMENT = 'paiement',
  CLOTURE = 'cloture',
}

export enum LCType {
  IRREVOCABLE = 'irrevocable',
  CONFIRMEE = 'confirmee',
  STANDBY = 'standby',
  TRANSFERABLE = 'transferable',
}

export enum DocumentaryCollectionType {
  A_VUE = 'a_vue',
  A_TERME = 'a_terme',
}

export enum CommitmentType {
  CREDIT_SPOT = 'credit_spot',
  DECOUVERT = 'decouvert',
  ESCOMPTE = 'escompte',
  LC_LINE = 'lc_line',
  CIL_LINE = 'cil_line',
  CAUTION = 'caution',
  CREDIT_MLT = 'credit_mlt',
  LEASING = 'leasing',
  AUTRE = 'autre',
}

export enum CommitmentStatus {
  ACTIF = 'actif',
  EXPIRE = 'expire',
  SUSPENDU = 'suspendu',
  CLOTURE = 'cloture',
}

export enum ForecastPeriod {
  JOUR = 'jour',
  SEMAINE = 'semaine',
  MOIS = 'mois',
  TRIMESTRE = 'trimestre',
  ANNEE = 'annee',
}

export enum FeeType {
  AGIOS = 'agios',
  COMMISSION = 'commission',
  FRAIS_TENUE = 'frais_tenue',
  FRAIS_VIREMENT = 'frais_virement',
  FRAIS_LC = 'frais_lc',
  FRAIS_DOMICILIATION = 'frais_domiciliation',
  FRAIS_SWIFT = 'frais_swift',
  PENALITE = 'penalite',
  AUTRE = 'autre',
}

export enum Currency {
  DZD = 'DZD',
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  CNY = 'CNY',
  JPY = 'JPY',
}
