'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Download, Calendar, Filter, TrendingUp, BarChart3, PieChart as PieIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const REPORTS = [
  { id: 'cash-evolution', title: 'Ãvolution du cash', description: 'Suivi des encaissements et dÃ©caissements sur une pÃ©riode', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
  { id: 'by-entity', title: 'Par entitÃ©/BU', description: 'RÃ©partition des opÃ©rations par business unit', icon: Users, color: 'text-green-600 bg-green-50' },
  { id: 'by-nature', title: 'Par nature d\'opÃ©ration', description: 'Classement par virements, chÃ¨ques, effets, LC...', icon: PieIcon, color: 'text-purple-600 bg-purple-50' },
  { id: 'top-payments', title: 'Grands paiements', description: 'Classement des plus gros dÃ©caissements', icon: BarChart3, color: 'text-red-600 bg-red-50' },
  { id: 'bank-fees', title: 'Suivi des frais/agios', description: 'ContrÃ´le des frais prÃ©levÃ©s avec dÃ©tection d\'anomalies', icon: FileBarChart, color: 'text-amber-600 bg-amber-50' },
  { id: 'commitments', title: 'Situation des engagements', description: 'Lignes bancaires, utilisation, Ã©chÃ©ances', icon: BarChart3, color: 'text-cyan-600 bg-cyan-50' },
  { id: 'import-ops', title: 'OpÃ©rations d\'import', description: 'Suivi des opÃ©rations internationales et LC/CIL', icon: FileBarChart, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'consolidated', title: 'Consolidation groupe', description: 'Consolidation multi-BU, multi-banques', icon: Users, color: 'text-teal-600 bg-teal-50' },
];

export default function RapportsPage() {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
        <p className="text-sm text-gray-500 mt-1">Historiques, situations pÃ©riodiques, analyses</p>
      </div>

      {/* Date filter */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4">
        <Calendar className="w-5 h-5 text-gray-400" />
        <div className="flex items-center gap-2">
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="input-field w-auto" />
          <span className="text-gray-400">â</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="input-field w-auto" />
        </div>
        <select className="input-field w-auto">
          <option value="">Toutes les BU</option>
          <option value="bu1">BU Production</option>
          <option value="bu2">BU Commercial</option>
        </select>
        <button className="btn-primary flex items-center gap-2 text-sm"><Filter className="w-4 h-4" /> Filtrer</button>
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {REPORTS.map((report, i) => (
          <motion.div key={report.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedReport(report.id)}
            className={cn('glass-card p-5 cursor-pointer transition-all duration-300 hover:shadow-glow hover:-translate-y-1',
              selectedReport === report.id && 'ring-2 ring-primary')}>
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', report.color)}>
              <report.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{report.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{report.description}</p>
            <button className="mt-3 text-xs text-primary font-medium hover:underline flex items-center gap-1">
              GÃ©nÃ©rer <Download className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for selected report */}
      {selectedReport && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
          <FileBarChart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700">Rapport : {REPORTS.find(r => r.id === selectedReport)?.title}</h3>
          <p className="text-sm text-gray-400 mt-2">SÃ©lectionnez une pÃ©riode et cliquez sur Filtrer pour gÃ©nÃ©rer le rapport.</p>
          <div className="flex justify-center gap-3 mt-4">
            <button className="btn-primary">GÃ©nÃ©rer PDF</button>
            <button className="btn-secondary">Exporter Excel</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
