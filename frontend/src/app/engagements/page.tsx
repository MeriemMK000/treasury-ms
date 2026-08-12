'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, AlertTriangle, Clock, TrendingDown, CheckCircle } from 'lucide-react';
import { commitmentsApi } from '@/lib/api';
import { BankingLine, CommitmentMaturity, UnpaidItem } from '@/types';
import { formatCurrency, formatDate, getStatusLabel, getStatusClass, cn } from '@/lib/utils';

export default function EngagementsPage() {
  const [tab, setTab] = useState<'lines' | 'maturities' | 'unpaid' | 'alerts'>('lines');
  const [lines, setLines] = useState<BankingLine[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [maturities, setMaturities] = useState<CommitmentMaturity[]>([]);
  const [unpaid, setUnpaid] = useState<UnpaidItem[]>([]);
  const [alerts, setAlerts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [l, s, m, u, a] = await Promise.all([
          commitmentsApi.listLines(), commitmentsApi.linesSummary(),
          commitmentsApi.upcomingMaturities(60), commitmentsApi.listUnpaid(),
          commitmentsApi.alerts(),
        ]);
        setLines(l.data || []); setSummary(s.data || []);
        setMaturities(m.data || []); setUnpaid(u.data || []);
        setAlerts(a.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalAuth = summary.reduce((s: number, i: any) => s + Number(i.totalAuthorized || 0), 0);
  const totalUsed = summary.reduce((s: number, i: any) => s + Number(i.totalUsed || 0), 0);
  const totalAvail = summary.reduce((s: number, i: any) => s + Number(i.totalAvailable || 0), 0);
  const usagePct = totalAuth > 0 ? Math.round((totalUsed / totalAuth) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagements</h1>
          <p className="text-sm text-gray-500 mt-1">Lignes bancaires, Ã©chÃ©ances, impayÃ©s</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nouvelle ligne</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-gray-500">Autorisations totales</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalAuth)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">UtilisÃ©</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(totalUsed)}</p>
          <div className="mt-2 h-2 bg-surface-100 rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all', usagePct > 80 ? 'bg-red-500' : usagePct > 60 ? 'bg-amber-500' : 'bg-green-500')}
              style={{ width: `${usagePct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{usagePct}% utilisÃ©</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Disponible</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalAvail)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Alertes</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{alerts?.totalAlerts || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit">
        {[
          { key: 'lines', label: 'Lignes bancaires', icon: Shield },
          { key: 'maturities', label: 'ÃchÃ©ances', icon: Clock },
          { key: 'unpaid', label: 'ImpayÃ©s', icon: AlertTriangle },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'lines' && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                {['RÃ©f.', 'Type', 'LibellÃ©', 'AutorisÃ©', 'UtilisÃ©', 'Disponible', 'Taux', 'Expiration', 'Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {lines.map((line) => {
                const pct = Number(line.authorizedAmount) > 0 ? (Number(line.usedAmount) / Number(line.authorizedAmount)) * 100 : 0;
                return (
                  <tr key={line.id} className="hover:bg-surface-50/50">
                    <td className="px-4 py-3 text-sm font-mono">{line.reference}</td>
                    <td className="px-4 py-3 text-sm">{getStatusLabel(line.type)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{line.label}</td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(line.authorizedAmount, line.currency)}</td>
                    <td className="px-4 py-3 text-sm text-amber-600">{formatCurrency(line.usedAmount, line.currency)}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{formatCurrency(line.availableAmount, line.currency)}</td>
                    <td className="px-4 py-3 text-sm">{line.interestRate ? `${line.interestRate}%` : 'â'}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(line.expiryDate)}</td>
                    <td className="px-4 py-3"><span className={getStatusClass(line.status)}>{getStatusLabel(line.status)}</span></td>
                  </tr>
                );
              })}
              {lines.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400">Aucune ligne bancaire</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'maturities' && (
        <div className="space-y-3">
          {maturities.map((m: any, i) => (
            <motion.div key={m.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className={cn('glass-card p-4 flex items-center justify-between', m.isOverdue && 'border-l-4 border-red-500')}>
              <div>
                <p className="font-medium text-gray-900">{formatCurrency(Number(m.amount) + Number(m.interestAmount), m.currency)}</p>
                <p className="text-sm text-gray-500">ÃchÃ©ance : {formatDate(m.dueDate)}</p>
                {m.bankingLine && <p className="text-xs text-gray-400 mt-0.5">{m.bankingLine.label}</p>}
              </div>
              <div className="flex items-center gap-3">
                {m.isOverdue && <span className="badge-danger">ImpayÃ© {m.daysOverdue}j</span>}
                {!m.isPaid && !m.isOverdue && <span className="badge-warning">Ã payer</span>}
                {m.isPaid && <span className="badge-success">PayÃ©</span>}
              </div>
            </motion.div>
          ))}
          {maturities.length === 0 && <div className="text-center py-12 text-gray-400 glass-card">Aucune Ã©chÃ©ance Ã  venir</div>}
        </div>
      )}

      {tab === 'unpaid' && (
        <div className="space-y-3">
          {unpaid.map((item, i) => (
            <div key={item.id} className="glass-card p-4 border-l-4 border-red-500 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.counterpartyName}</p>
                <p className="text-sm text-red-600 font-semibold">{formatCurrency(item.amount, item.currency)}</p>
                <p className="text-xs text-gray-400">ÃchÃ©ance initiale : {formatDate(item.originalDueDate)} â {item.daysOverdue} jours de retard</p>
              </div>
              <button className="btn-secondary text-sm">RÃ©soudre</button>
            </div>
          ))}
          {unpaid.length === 0 && <div className="text-center py-12 text-gray-400 glass-card">Aucun impayÃ©</div>}
        </div>
      )}
    </div>
  );
}
