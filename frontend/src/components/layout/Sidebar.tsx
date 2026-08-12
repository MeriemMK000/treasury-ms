'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Building2, Globe2,
  Shield, TrendingUp, FileBarChart, Settings, ChevronLeft, ChevronRight,
  Landmark, ClipboardCheck, Layers, LogOut, Menu
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/operations', label: 'OpÃ©rations', icon: ArrowDownCircle,
    children: [
      { href: '/operations?type=encaissement', label: 'Encaissements' },
      { href: '/operations?type=decaissement', label: 'DÃ©caissements' },
    ]
  },
  { href: '/paiements', label: 'Workflow Paiements', icon: ClipboardCheck },
  { href: '/banques', label: 'Banques & Comptes', icon: Landmark },
  { href: '/international', label: 'OpÃ©rations Import', icon: Globe2 },
  { href: '/engagements', label: 'Engagements', icon: Shield },
  { href: '/previsionnel', label: 'PrÃ©visionnel', icon: TrendingUp },
  { href: '/rapports', label: 'Rapports', icon: FileBarChart },
  { href: '/parametres', label: 'ParamÃ¨tres', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-surface-200 z-50 flex flex-col shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-surface-100">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-700 rounded-xl flex items-center justify-center shadow-glow">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-tight">Treasury MS</h1>
                <p className="text-[10px] text-gray-400 font-medium">Gestion de TrÃ©sorerie</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors text-gray-400">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary shadow-sm'
                  : 'text-gray-500 hover:bg-surface-50 hover:text-gray-700'
              )}>
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-gray-400')} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    className="truncate">{item.label}</motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-surface-100">
        <div className={cn('flex items-center gap-3 px-3 py-2', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
