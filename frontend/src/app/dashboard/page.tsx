'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownCircle, ArrowUpCircle, Landmark, AlertTriangle,
  TrendingUp, TrendingDown, Globe2, Shield, Clock
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { reportsApi, commitmentsApi, paymentApi } from '@/lib/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#1e5aeb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [dashData, setDashData] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, pending] = await Promise.all([
          reportsApi.dashboard(),
          paymentApi.pendingCount(),
        ]);
        setDashData(dash.data);
        setPendingPayments(typeof pending.data === 'number' ? pending.data : 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Demo data for charts when API has no data yet
  const cashEvolutionData = [
    { date: 'Jan', encaissements: 12000000, decaissements: 9500000 },
    { date: 'FÃ©v', encaissements: 15000000, decaissements: 11000000 },
    { date: 'Mar', encaissements: 10500000, decaissements: 13000000 },
    { date: 'Avr', encaissements: 18000000, decaissements: 14000000 },
    { date: 'Mai', encaissements: 16000000, decaissements: 12500000 },
    { date: 'Jun', encaissements: 21000000, decaissements: 15000000 },
  ];

  const balances = dashData?.balances || [];
  const totalBalance = balances.reduce?.((s: number, b: any) => s + Number(b.totalBalance || 0), 0) || 45000000;
  const totalAvailable = balances.reduce?.((s: number, b: any) => s + Number(b.totalAvailable || 0), 0) || 42000000;
  const alertCount = dashData?.commitmentAlerts?.totalAlerts || 0;

  const statCards = [
    { label: 'Solde total', value: formatCurrency(totalBalance), icon: Landmark, color: 'from-primary to-primary-700', change: '+3.2%', up: true },
    { label: 'Cash disponible', value: formatCurrency(totalAvailable), icon: TrendingUp, color: 'from-green-500 to-green-700', change: '+1.8%', up: true },
    { label: 'Paiements en attente', value: formatNumber(pendingPayments), icon: Clock, color: 'from-amber-500 to-amber-700', change: '', up: false },
    { label: 'Alertes actives', value: formatNumber(alertCount), icon: AlertTriangle, color: 'from-red-500 to-red-700', change: '', up: false },
  ];

  const operationsByNature = [
    { name: 'Virements', value: 45 }, { name: 'ChÃ¨ques', value: 20 },
    { name: 'Effets', value: 15 }, { name: 'LC', value: 12 }, { name: 'Autres', value: 8 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-3 border-primary-200 border-t-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div {...fadeUp}>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de la trÃ©sorerie</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }}
            className="stat-card group cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                {stat.change && (
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cash evolution chart */}
        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="glass-card p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ãvolution de la trÃ©sorerie</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={cashEvolutionData}>
              <defs>
                <linearGradient id="colorEnc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="encaissements" stroke="#22c55e" fillOpacity={1} fill="url(#colorEnc)" strokeWidth={2} name="Encaissements" />
              <Area type="monotone" dataKey="decaissements" stroke="#ef4444" fillOpacity={1} fill="url(#colorDec)" strokeWidth={2} name="DÃ©caissements" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Operations by nature */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">OpÃ©rations par nature</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={operationsByNature} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {operationsByNature.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Alerts */}
        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Alertes rÃ©centes
          </h3>
          <div className="space-y-3">
            {[
              { text: 'Ligne de crÃ©dit BNA expire dans 15 jours', type: 'warning' },
              { text: 'ÃchÃ©ance LC #LC-2024-045 dans 7 jours', type: 'danger' },
              { text: 'Anomalie frais dÃ©tectÃ©e : Ã©cart de 12 500 DZD', type: 'danger' },
              { text: '3 paiements en attente de validation', type: 'warning' },
            ].map((alert, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${alert.type === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
                <div className={`w-2 h-2 rounded-full ${alert.type === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <span className="text-sm text-gray-700">{alert.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nouvel encaissement', icon: ArrowDownCircle, color: 'text-green-600 bg-green-50 hover:bg-green-100', href: '/operations?new=enc' },
              { label: 'Nouveau dÃ©caissement', icon: ArrowUpCircle, color: 'text-red-600 bg-red-50 hover:bg-red-100', href: '/operations?new=dec' },
              { label: 'Demande de paiement', icon: Clock, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100', href: '/paiements' },
              { label: 'Import relevÃ©', icon: Landmark, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', href: '/banques' },
              { label: 'OpÃ©ration import', icon: Globe2, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100', href: '/international' },
              { label: 'PrÃ©visionnel', icon: TrendingUp, color: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100', href: '/previsionnel' },
            ].map((action) => (
              <a key={action.label} href={action.href}
                className={`flex items-center gap-3 p-3 rounded-xl ${action.color} transition-all duration-200 cursor-pointer`}>
                <action.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
