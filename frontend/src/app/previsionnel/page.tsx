'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Plus, Lightbulb, BarChart3 } from 'lucide-react';
import { forecastingApi } from '@/lib/api';
import { CashForecast } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function PrevisionnelPage() {
  const [forecasts, setForecasts] = useState<CashForecast[]>([]);
  const [critical, setCritical] = useState<CashForecast[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<CashForecast | null>(null);
  const [solutions, setSolutions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, c] = await Promise.all([forecastingApi.list(), forecastingApi.critical()]);
        setForecasts(f.data || []);
        setCritical(c.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const loadSolutions = async (id: string) => {
    try {
      const res = await forecastingApi.deficitSolutions(id);
      setSolutions(res.data);
    } catch (e) { console.error(e); }
  };

  // Demo chart data
  const chartData = [
    { period: 'S1', inflows: 25000000, outflows: -22000000, net: 3000000 },
    { period: 'S2', inflows: 18000000, outflows: -28000000, net: -10000000 },
    { period: 'S3', inflows: 30000000, outflows: -24000000, net: 6000000 },
    { period: 'S4', inflows: 22000000, outflows: -20000000, net: 2000000 },
    { period: 'S5', inflows: 15000000, outflows: -25000000, net: -10000000 },
    { period: 'S6', inflows: 35000000, outflows: -19000000, net: 16000000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PrÃ©visionnel de TrÃ©sorerie</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion prÃ©visionnelle du cash et des situations critiques</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Consolidation</button>
          <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nouveau prÃ©visionnel</button>
        </div>
      </div>

      {/* Critical alerts */}
      {critical.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Situations critiques dÃ©tectÃ©es</h3>
          </div>
          <div className="space-y-2">
            {critical.map((f) => (
              <div key={f.id} className="flex items-center justify-between bg-white/60 rounded-xl p-3">
                <div>
                  <p className="font-medium text-red-800">{f.label}</p>
                  <p className="text-xs text-red-600">{formatDate(f.startDate)} â {formatDate(f.endDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-700">{formatCurrency(f.closingCash)}</p>
                  <button onClick={() => loadSolutions(f.id)} className="text-xs text-primary hover:underline mt-1">Voir solutions</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Projection cash (6 prochaines semaines)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(v: number) => formatCurrency(Math.abs(v))} />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar dataKey="inflows" fill="#22c55e" radius={[4, 4, 0, 0]} name="Encaissements" />
            <Bar dataKey="outflows" fill="#ef4444" radius={[4, 4, 0, 0]} name="DÃ©caissements" />
            <Bar dataKey="net" fill="#1e5aeb" radius={[4, 4, 0, 0]} name="Solde net" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Solutions panel */}
      {solutions && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-900">Solutions proposÃ©es pour le dÃ©ficit de {formatCurrency(solutions.deficit)}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {solutions.solutions?.map((sol: any, i: number) => (
              <div key={i} className={cn('p-4 rounded-xl border-l-4',
                sol.priority === 'haute' ? 'border-red-500 bg-red-50' :
                sol.priority === 'moyenne' ? 'border-amber-500 bg-amber-50' : 'border-blue-500 bg-blue-50')}>
                <p className="font-medium text-gray-900">{sol.label}</p>
                <p className="text-sm text-gray-600 mt-1">{sol.description}</p>
                <span className={cn('text-xs font-medium mt-2 inline-block',
                  sol.priority === 'haute' ? 'text-red-600' : sol.priority === 'moyenne' ? 'text-amber-600' : 'text-blue-600')}>
                  PrioritÃ© {sol.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Forecasts list */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100">
          <h3 className="font-semibold text-gray-900">PrÃ©visionnels enregistrÃ©s</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-100">
              {['LibellÃ©', 'PÃ©riode', 'Cash initial', 'Encaissements', 'DÃ©caissements', 'Cash final', 'Statut'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {forecasts.map((f) => (
              <tr key={f.id} className="hover:bg-surface-50/50 cursor-pointer" onClick={() => setSelectedForecast(f)}>
                <td className="px-4 py-3 text-sm font-medium">{f.label}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(f.startDate)} â {formatDate(f.endDate)}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(f.openingCash)}</td>
                <td className="px-4 py-3 text-sm text-green-600">+{formatCurrency(f.totalInflows)}</td>
                <td className="px-4 py-3 text-sm text-red-600">-{formatCurrency(f.totalOutflows)}</td>
                <td className={cn('px-4 py-3 text-sm font-semibold', f.closingCash < 0 ? 'text-red-600' : 'text-green-600')}>
                  {formatCurrency(f.closingCash)}
                </td>
                <td className="px-4 py-3">
                  {f.isCritical ? <span className="badge-danger">Critique</span> :
                   f.isSurplus ? <span className="badge-info">ExcÃ©dent</span> :
                   <span className="badge-success">Normal</span>}
                </td>
              </tr>
            ))}
            {forecasts.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-gray-400">Aucun prÃ©visionnel</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
