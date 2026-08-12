'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { hydrate } = useAuthStore();
  const router = useRouter();
  useEffect(() => { hydrate(); const t = localStorage.getItem('treasury_token'); if (!t) router.push('/login'); }, []);
  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <TopBar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
