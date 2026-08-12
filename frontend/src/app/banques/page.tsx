'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building2, CreditCard, Upload, TrendingUp, TrendingDown } from 'lucide-react';
import { banksApi, bankStatementsApi } from '@/lib/api';
import { Bank, BankAccount } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

export default function BanquesPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [consolidated, setConsolidated] = useState<any[]>([]);
  const [tab, setTab] = useState<'banks' | 'accounts' | 'statements'>('accounts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, a, c] = await Promise.all([banksApi.list(), banksApi.listAccounts(), banksApi.getConsolidated()]);
        setBanks(b.data || []);
        setAccounts(a.data || []);
        setConsolidated(c.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + Number(a.currentBalance), 0);
  const totalAvailable = accounts.reduce((s, a) => s + Number(a.availableBalance), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banques & Comptes</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion multi-banques et multi-agences</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" /> Importer relevé</button>
          <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter banque</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <p className="text-sm text-gray-500">Solde total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBalance)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <p className="text-sm text-gray-500">Cash disponible</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalAvailable)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <p className="text-sm text-gray-500">Opérations en transit</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(totalBalance - totalAvailable)}</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit">
        {[
          { key: 'accounts', label: 'Comptes', icon: CreditCard },
          { key: 'banks', label: 'Banques', icon: Building2 },
          { key: 'statements', label: 'Relevés', icon: Upload },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((acc, i) => (
            <motion.div key={acc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:shadow-glow transition-all duration-300 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{acc.label}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{acc.accountNumber}</p>
                </div>
                <span className="badge-info">{acc.currency}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Solde</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(acc.currentBalance, acc.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Disponible</span>
                  <span className="font-semibold text-green-600">{formatCurrency(acc.availableBalance, acc.currency)}</span>
                </div>
                {acc.agency && (
                  <div className="pt-2 border-t border-surface-100 text-xs text-gray-400">
                    {acc.agency.bank?.name} — {acc.agency.name}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {accounts.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-gray-400">Aucun compte bancaire configuré</div>
          )}
        </div>
      )}

      {tab === 'banks' && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                {['Banque', 'Code', 'SWIFT', 'Agences', 'Comptes', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {banks.map((bank) => (
                <tr key={bank.id} className="hover:bg-surface-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900 text-sm">{bank.name}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{bank.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{bank.swiftCode || '—'}</td>
                  <td className="px-4 py-3 text-sm">{bank.agencies?.length || 0}</td>
                  <td className="px-4 py-3 text-sm">{bank.agencies?.reduce((s, a) => s + (a.accounts?.length || 0), 0) || 0}</td>
                  <td className="px-4 py-3"><button className="text-primary text-sm hover:underline">Détails</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'statements' && (
        <div className="glass-card p-8 text-center">
          <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700">Import de relevés bancaires</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            Importez vos journaux bancaires pour un traitement et saisie automatique contrôlée. 
            Formats supportés : CSV, Excel, MT940.
          </p>
          <button className="btn-primary mt-4">Importer un relevé</button>
        </div>
      )}
    </div>
  );
}
