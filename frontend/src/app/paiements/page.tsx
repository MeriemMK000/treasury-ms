'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, XCircle, Clock, ArrowRight, Send, Printer, X } from 'lucide-react';
import { paymentApi, banksApi } from '@/lib/api';
import { PaymentRequest, BankAccount } from '@/types';
import { formatCurrency, formatDate, getStatusLabel, getStatusClass } from '@/lib/utils';

export default function PaiementsPage() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [r, a] = await Promise.all([
        paymentApi.list({ status: filter || undefined }),
        banksApi.listAccounts(),
      ]);
      setRequests(r.data || []);
      setAccounts(a.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSubmit = async (id: string) => { await paymentApi.submit(id); load(); };
  const handleApprove = async (id: string) => { await paymentApi.approve(id, { action: 'approuve' }); load(); };
  const handleReject = async (id: string) => { await paymentApi.approve(id, { action: 'rejete', comment: 'RejetÃ©' }); load(); };
  const handleExecute = async (id: string) => { await paymentApi.execute(id); load(); };

  const statusCounts = {
    all: requests.length,
    soumis: requests.filter(r => r.status === 'soumis' || r.status === 'en_validation').length,
    valide: requests.filter(r => r.status === 'valide').length,
    execute: requests.filter(r => r.status === 'execute').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Paiements</h1>
          <p className="text-sm text-gray-500 mt-1">Demandes et validations de paiements</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle demande
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', count: statusCounts.all, color: 'bg-gray-100 text-gray-700', filter: '' },
          { label: 'En attente', count: statusCounts.soumis, color: 'bg-amber-50 text-amber-700', filter: 'soumis' },
          { label: 'ValidÃ©es', count: statusCounts.valide, color: 'bg-green-50 text-green-700', filter: 'valide' },
          { label: 'ExÃ©cutÃ©es', count: statusCounts.execute, color: 'bg-blue-50 text-blue-700', filter: 'execute' },
        ].map((s) => (
          <button key={s.label} onClick={() => setFilter(s.filter)}
            className={`p-4 rounded-xl text-left transition-all ${s.color} ${filter === s.filter ? 'ring-2 ring-primary' : ''}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {requests.map((pr, i) => (
          <motion.div key={pr.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm font-medium text-gray-900">{pr.reference}</span>
                <span className={getStatusClass(pr.status)}>{getStatusLabel(pr.status)}</span>
              </div>
              <p className="text-sm text-gray-600">{pr.beneficiaryName} â {pr.motif || 'Sans motif'}</p>
              <p className="text-xs text-gray-400 mt-1">DemandÃ© le {formatDate(pr.requestedDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600">{formatCurrency(pr.amount, pr.currency)}</p>
              <p className="text-xs text-gray-400">{getStatusLabel(pr.paymentMethod)}</p>
            </div>
            <div className="flex items-center gap-2">
              {pr.status === 'brouillon' && (
                <button onClick={() => handleSubmit(pr.id)} className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100" title="Soumettre">
                  <Send className="w-4 h-4" />
                </button>
              )}
              {(pr.status === 'soumis' || pr.status === 'en_validation') && (
                <>
                  <button onClick={() => handleApprove(pr.id)} className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100" title="Approuver">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleReject(pr.id)} className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100" title="Rejeter">
                    <XCircle className="w-4 h-4" />
                  </button>
                </>
              )}
              {pr.status === 'valide' && (
                <>
                  <button onClick={() => handleExecute(pr.id)} className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100" title="ExÃ©cuter">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100" title="Imprimer">
                    <Printer className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
        {requests.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400 glass-card">Aucune demande de paiement</div>
        )}
      </div>
    </div>
  );
}
