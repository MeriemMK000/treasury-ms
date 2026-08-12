export interface User {
  id: string; email: string; firstName: string; lastName: string;
  role: string; groupId: string; groupName?: string; businessUnitIds: string[];
}

export interface Group { id: string; name: string; description?: string; legalName?: string; businessUnits: BusinessUnit[]; }
export interface BusinessUnit { id: string; name: string; code: string; description?: string; groupId: string; isActive: boolean; }

export interface Bank { id: string; name: string; code: string; swiftCode?: string; agencies: BankAgency[]; }
export interface BankAgency { id: string; name: string; code: string; bankId: string; accounts?: BankAccount[]; }
export interface BankAccount {
  id: string; accountNumber: string; rib?: string; iban?: string; label: string;
  currency: string; currentBalance: number; availableBalance: number; forecastedBalance: number;
  businessUnitId: string; agencyId: string; agency?: BankAgency & { bank?: Bank };
}

export interface Operation {
  id: string; reference: string; type: 'encaissement' | 'decaissement';
  nature: string; status: string; amount: number; currency: string;
  operationDate: string; valueDate?: string; positioningDate?: string;
  description?: string; counterpartyName?: string; counterpartyId?: string;
  paymentRef?: string; bankAccountId: string; bankAccount?: BankAccount;
  businessUnitId: string; projectCode?: string; affairRef?: string;
  isPositioned: boolean; isCleared: boolean;
  createdAt: string; fees?: BankFee[];
}

export interface BankFee {
  id: string; type: string; amount: number; currency: string; date: string;
  description?: string; operationId?: string; bankAccountId: string;
  isExpected: boolean; expectedAmount?: number; hasAnomaly: boolean; anomalyNote?: string;
}

export interface PaymentRequest {
  id: string; reference: string; status: string; amount: number; currency: string;
  paymentMethod: string; beneficiaryName: string; beneficiaryAccount?: string;
  beneficiaryBank?: string; motif?: string; requestedDate: string; dueDate?: string;
  bankAccountId: string; businessUnitId: string; projectCode?: string;
  requestedBy: string; currentApprovalLevel: number; maxApprovalLevel: number;
  linkedOperationId?: string; approvals?: PaymentApproval[];
}

export interface PaymentApproval {
  id: string; approvalLevel: number; action: string; approverId: string;
  approverName: string; comment?: string; createdAt: string;
}

export interface ImportOperation {
  id: string; reference: string; status: string; description: string;
  supplierName: string; supplierCountry: string; amount: number; currency: string;
  ppiItemId?: string; proformaRef?: string; predomRef?: string; domRef?: string;
  lcRef?: string; lcType?: string; lcOpeningDate?: string; lcExpiryDate?: string; lcAmount?: number;
  cilRef?: string; cilAmount?: number; cilMaturityDate?: string;
  docCollectionType?: string; docCollectionDueDate?: string;
  totalFees: number; documents?: ImportDocument[];
}

export interface ImportDocument {
  id: string; name: string; documentType: string; reference: string;
  isVerified: boolean; extractedData?: Record<string, any>;
}

export interface PpiItem {
  id: string; reference: string; description: string; supplierName: string;
  amount: number; currency: string; ppiYear: number;
  isValidated: boolean; isUsed: boolean; usedByOperationId?: string;
}

export interface BankingLine {
  id: string; reference: string; type: string; status: string; label: string;
  authorizedAmount: number; usedAmount: number; availableAmount: number;
  currency: string; startDate: string; expiryDate: string; interestRate?: number;
  bankId: string; businessUnitId: string; maturities?: CommitmentMaturity[];
}

export interface CommitmentMaturity {
  id: string; dueDate: string; amount: number; interestAmount: number;
  currency: string; isPaid: boolean; paidDate?: string; isOverdue: boolean; daysOverdue: number;
}

export interface UnpaidItem {
  id: string; reference: string; amount: number; currency: string;
  originalDueDate: string; counterpartyName: string; daysOverdue: number; isResolved: boolean;
}

export interface CashForecast {
  id: string; label: string; period: string; startDate: string; endDate: string;
  openingCash: number; totalInflows: number; totalOutflows: number; closingCash: number;
  isCritical: boolean; isSurplus: boolean; items?: ForecastItem[];
}

export interface ForecastItem {
  id: string; label: string; category: string; direction: 'inflow' | 'outflow';
  amount: number; expectedDate: string; isRecurring: boolean; isConfirmed: boolean;
  probabilityPct: number; source?: string;
}

export interface PaginatedResult<T> {
  data: T[]; total: number; page: number; limit: number; totalPages: number;
}
