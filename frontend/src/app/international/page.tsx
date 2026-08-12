'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Plus, FileCheck, ArrowRight, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { internationalApi } from '@/lib/api';
import { ImportOperation, PpiItem } from '@/types';
import { formatCurrency, formatDate, getStatusLabel, getStatusClass, cn } from '@/lib/utils';

const IMPORT_FLOW = [
  { key: 'ppi_enregistre', label: 'PPI', short: 'PPI' },
  { key: 'ppi_valide', label: 'PPI ValidÃ©', short: 'Valid.' },
  { key: 'predomiciliation', label: 'PrÃ©dom.', short: 'PrÃ©dom' },
  { key: 'predom_obtenue', label: 'PrÃ©dom OK', short: 'OK' },
  { key: 'domiciliation', label: 'Dom.', short: 'Dom' },
  { key: 'dom_obtenue', label: 'Dom OK', short: 'OK' },
  { key: 'lc_ouverte', label: 'LC', short: 'LC' },
  { key: 'expedition', label: 'ExpÃ©dition', short: 'Exp.' },
  { key: 'documents_recus', label: 'Docs', short: 'Docs' },
  { key: 'paiement', label: 'Paiement', short: 'Paie.' },
  { key: 'cloture', label: 'ClÃ´ture', short: 'Fin' },
];

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  const currentIdx = IMPORT_FLOW.findIndex(s => s.key === currentStatus);
  return (
    <div className="flex items-center gap-0.5">
      {IMPORT_FLOW.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className={cn('w-2 h-2 rounded-full transition-all',
            i <= currentIdx ? 'bg-primary' : i === currentIdx + 1 ? 'bg-amber-400' : 'bg-gray-200'
          )} title={step.label} />
          {i < IMPORT_FLOW.length - 1 && <div className={cn('w-3 h-0.5', i < currentIdx ? 'bg-primary' : 'bg-gray-200')} />}
        </div>
      ))}
    </div>
  );
}

export default function InternationalPage() {
  const [tab, setTab] = useState<'operations' | 'ppi' | 'maturities'>('operations');
  const [operations, setOperations] = useState<ImportOperation[]>([]);
  const [ppiItems, setPpiItems] = useState<PpiItem[]>([]);
  const [maturities, setMaturities] = useState<any[]>([]);
  const [lcExposure, setLcExposure] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ops, ppi, mat, lc] = await Promise.all([
          internationalApi.listOps(),
          internationalApi.listPpi(),
          internationalApi.maturities(60),
          internationalApi.lcExposure(),
        ]);
        setOperations(ops.data || []);
        setPpiItems(ppi.data || []);
        setMaturities(mat.data || []);
        setLcExposure(lc.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OpÃ©rations Internationales</h1>
          <p className="text-sm text-gray-500 mt-1">Import, LC, CIL, domiciliations</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nouvelle opÃ©ration</button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-gray-500">OpÃ©rations actives</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{operations.filter(o => o.status !== 'cloture').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Encours LC</p>
          <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(Number(lcExposure?.totalLC || 0), 'USD')}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Encours CIL</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(Number(lcExposure?.totalCIL || 0), 'USD')}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">ÃchÃ©ances Ã  venir</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{maturities.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit">
        {[
          { key: 'operations', label: 'OpÃ©rations', icon: Globe2 },
          { key: 'ppi', label: 'PPI', icon: ShieldCheck },
          { key: 'maturities', label: 'ÃchÃ©ances', icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Operations */}
      {tab === 'operations' && (
        <div className="space-y-3">
          {operations.map((op, i) => (
            <motion.div key={op.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">{op.reference}</span>
                    <span className={getStatusClass(op.status)}>{getStatusLabel(op.status)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{op.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{op.supplierName} â {op.supplierCountry}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(op.amount, op.currency)}</p>
                  {op.lcRef && <p className="text-xs text-gray-400">LC: {op.lcRef}</p>}
                </div>
              </div>
              <StatusStepper currentStatus={op.status} />
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                {op.predomRef && <span>PrÃ©dom: {op.predomRef}</span>}
                {op.domRef && <span>Dom: {op.domRef}</span>}
                {op.lcAmount && <span>LC: {formatCurrency(op.lcAmount, op.currency)}</span>}
                {op.cilAmount && <span>CIL: {formatCurrency(op.cilAmount, op.currency)}</span>}
                {op.totalFees > 0 && <span className="text-amber-600">Frais: {formatCurrency(op.totalFees, op.currency)}</span>}
                <span>{op.documents?.length || 0} documents</span>
              </div>
            </motion.div>
          ))}
          {operations.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400 glass-card">Aucune opÃ©ration d'import</div>
          )}
        </div>
      )}

      {/* PPI */}
      {tab === 'ppi' && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                {['RÃ©fÃ©rence', 'Description', 'Fournisseur', 'Montant', 'AnnÃ©e', 'ValidÃ©', 'UtilisÃ©', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {ppiItems.map((ppi) => (
                <tr key={ppi.id} className="hover:bg-surface-50/50">
                  <td className="px-4 py-3 text-sm font-mono">{ppi.reference}</td>
                  <td className="px-4 py-3 text-sm">{ppi.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ppi.supplierName}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(ppi.amount, ppi.currency)}</td>
                  <td className="px-4 py-3 text-sm">{ppi.ppiYear}</td>
                  <td className="px-4 py-3">{ppi.isValidated ? <span className="badge-success">Oui</span> : <span className="badge-warning">Non</span>}</td>
                  <td className="px-4 py-3">{ppi.isUsed ? <span className="badge-danger">UtilisÃ©</span> : <span className="badge-success">Disponible</span>}</td>
                  <td className="px-4 py-3">
                    {!ppi.isValidated && <button className="text-xs text-primary hover:underline">Valider</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Maturities */}
      {tab === 'maturities' && (
        <div className="space-y-3">
          {maturities.length === 0 ? (
            <div className="text-center py-12 text-gray-400 glass-card">Aucune Ã©chÃ©ance Ã  venir</div>
          ) : maturities.map((m: any, i: number) => (
            <div key={i} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{m.reference}</p>
                <p className="text-sm text-gray-500">{m.supplierName}</p>
              </div>
              <div className="flex items-center gap-4">
                {m.lcExpiryDate && <div className="text-right"><p className="text-xs text-gray-400">ÃchÃ©ance LC</p><p className="text-sm font-medium">{formatDate(m.lcExpiryDate)}</p></div>}
                {m.cilMaturityDate && <div className="text-right"><p className="text-xs text-gray-400">ÃchÃ©ance CIL</p><p className="text-sm font-medium">{formatDate(m.cilMaturityDate)}</p></div>}
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
