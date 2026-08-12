'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, ArrowDownCircle, ArrowUpCircle, MoreVertical, CheckCircle2, X } from 'lucide-react';
import { operationsApi, banksApi } from '@/lib/api';
import { Operation, BankAccount } from '@/types';
import { formatCurrency, formatDate, getStatusLabel, getStatusClass, cn } from '@/lib/utils';

export default function OperationsPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    type: 'encaissement', nature: 'virement', amount: '', currency: 'DZD',
    operationDate: new Date().toISOString().split('T')[0],
    counterpartyName: '', description: '', bankAccountId: '', businessUnitId: '', paymentRef: '', projectCode: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [ops, accs] = await Promise.all([
        operationsApi.list({ type: typeFilter || undefined, status: statusFilter || undefined, search: search || undefined, page, limit: 20 }),
        banksApi.listAccounts(),
      ]);
      setOperations(ops.data.data || []);
      setTotal(ops.data.total || 0);
      setAccounts(accs.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [page, typeFilter, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await operationsApi.create({ ...formData, amount: parseFloat(formData.amount as string) });
      setShowForm(false);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handlePosition = async (id: string) => {
    try { await operationsApi.position(id); loadData(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OpÃ©rations</h1>
          <p className="text-sm text-gray-500 mt-1">Encaissements et dÃ©caissements</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle opÃ©ration
        </motion.button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher par reference, contrepartie..." value={search}
            onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadData()}
            className="input-field pl-10" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field w-auto">
          <option value="">Tous les types</option>
          <option value="encaissement">Encaissements</option>
          <option value="decaissement">Decaissements</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="valide">Valide</option>
          <option value="positionne">Positionne</option>
          <option value="encaisse">Encaisse</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                {['Reference', 'Type', 'Nature', 'Montant', 'Contrepartie', 'Date', 'Statut', 'Positionne', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {operations.map((op, i) => (
                <motion.tr key={op.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-surface-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{op.reference}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {op.type === 'encaissement' ?
                        <ArrowDownCircle className="w-4 h-4 text-green-500" /> :
                        <ArrowUpCircle className="w-4 h-4 text-red-500" />}
                      <span className="text-sm">{getStatusLabel(op.type)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{getStatusLabel(op.nature)}</td>
                  <td className={cn('px-4 py-3 text-sm font-semibold', op.type === 'encaissement' ? 'text-green-600' : 'text-red-600')}>
                    {op.type === 'encaissement' ? '+' : '-'}{formatCurrency(op.amount, op.currency)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{op.counterpartyName || 'â'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(op.operationDate)}</td>
                  <td className="px-4 py-3"><span className={getStatusClass(op.status)}>{getStatusLabel(op.status)}</span></td>
                  <td className="px-4 py-3">
                    {op.isPositioned ?
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                      <span className="text-xs text-gray-400">Non</span>}
                  </td>
                  <td className="px-4 py-3">
                    {!op.isPositioned && op.status === 'valide' && (
                      <button onClick={() => handlePosition(op.id)} className="text-xs text-primary hover:text-primary-700 font-medium">
                        Positionner
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {operations.length === 0 && !loading && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">Aucune operation trouvee</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-100">
            <span className="text-sm text-gray-500">{total} resultats</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm py-1.5 px-3">Precedent</button>
              <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm py-1.5 px-3">Suivant</button>
            </div>
          </div>
        )}
      </div>

      {/* New operation modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-surface-100">
                <h2 className="text-lg font-semibold">Nouvelle operation</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-surface-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
                      <option value="encaissement">Encaissement</option>
                      <option value="decaissement">Decaissement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nature</label>
                    <select value={formData.nature} onChange={(e) => setFormData({ ...formData, nature: e.target.value })} className="input-field">
                      <option value="virement">Virement</option>
                      <option value="cheque">Cheque</option>
                      <option value="effet">Effet</option>
                      <option value="especes">Especes</option>
                      <option value="prelevement">Prelevement</option>
                      <option value="carte">Carte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                    <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input-field" placeholder="0.00" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date operation</label>
                    <input type="date" value={formData.operationDate} onChange={(e) => setFormData({ ...formData, operationDate: e.target.value })}
                      className="input-field" required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contrepartie</label>
                    <input type="text" value={formData.counterpartyName} onChange={(e) => setFormData({ ...formData, counterpartyName: e.target.value })}
                      className="input-field" placeholder="Nom du client/fournisseur" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compte bancaire</label>
                    <select value={formData.bankAccountId} onChange={(e) => setFormData({ ...formData, bankAccountId: e.target.value })} className="input-field">
                      <option value="">Selectionner un compte</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>{a.label} - {a.accountNumber}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ref. paiement</label>
                    <input type="text" value={formData.paymentRef} onChange={(e) => setFormData({ ...formData, paymentRef: e.target.value })}
                      className="input-field" placeholder="Reference moyen de paiement" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field" rows={2} placeholder="Objet de l'operation" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
                  <button type="submit" className="btn-primary">Creer l'operation</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
