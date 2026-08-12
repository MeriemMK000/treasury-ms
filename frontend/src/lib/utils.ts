import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatCurrency(amount: number, currency: string = 'DZD'): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export const STATUS_COLORS: Record<string, string> = {
  brouillon: 'badge-neutral', en_attente: 'badge-warning', valide: 'badge-success',
  positionne: 'badge-info', encaisse: 'badge-success', rejete: 'badge-danger', annule: 'badge-danger',
  soumis: 'badge-warning', en_validation: 'badge-warning', execute: 'badge-success',
  actif: 'badge-success', expire: 'badge-danger', suspendu: 'badge-warning', cloture: 'badge-neutral',
  ppi_enregistre: 'badge-neutral', ppi_valide: 'badge-info', predomiciliation: 'badge-warning',
  predom_obtenue: 'badge-info', domiciliation: 'badge-warning', dom_obtenue: 'badge-info',
  lc_demandee: 'badge-warning', lc_ouverte: 'badge-success', expedition: 'badge-info',
  documents_recus: 'badge-info', paiement: 'badge-success',
};

export const STATUS_LABELS: Record<string, string> = {
  brouillon: 'Brouillon', en_attente: 'En attente', valide: 'ValidÃ©',
  positionne: 'PositionnÃ©', encaisse: 'EncaissÃ©', rejete: 'RejetÃ©', annule: 'AnnulÃ©',
  soumis: 'Soumis', en_validation: 'En validation', execute: 'ExÃ©cutÃ©',
  actif: 'Actif', expire: 'ExpirÃ©', suspendu: 'Suspendu', cloture: 'ClÃ´turÃ©',
  ppi_enregistre: 'PPI EnregistrÃ©', ppi_valide: 'PPI ValidÃ©',
  predomiciliation: 'PrÃ©domicliation', predom_obtenue: 'PrÃ©dom. obtenue',
  domiciliation: 'Domiciliation', dom_obtenue: 'Dom. obtenue',
  lc_demandee: 'LC DemandÃ©e', lc_ouverte: 'LC Ouverte',
  expedition: 'ExpÃ©dition', documents_recus: 'Documents reÃ§us', paiement: 'Paiement',
  encaissement: 'Encaissement', decaissement: 'DÃ©caissement',
  virement: 'Virement', cheque: 'ChÃ¨que', effet: 'Effet', especes: 'EspÃ¨ces',
  prelevement: 'PrÃ©lÃ¨vement', carte: 'Carte', lc_payment: 'Paiement LC',
  cil_payment: 'Paiement CIL', remise_documentaire: 'Remise doc.', autre: 'Autre',
};

export function getStatusLabel(status: string): string { return STATUS_LABELS[status] || status; }
export function getStatusClass(status: string): string { return STATUS_COLORS[status] || 'badge-neutral'; }
