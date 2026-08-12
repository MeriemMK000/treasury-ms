'use client';
import { Bell, Search, Building2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function TopBar() {
  const { user } = useAuthStore();
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-surface-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-80 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Building2 className="w-4 h-4" />
          <span>{user?.groupName || 'Groupe'}</span>
        </div>
        <button className="relative p-2 rounded-xl hover:bg-surface-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
      </div>
    </header>
  );
}
