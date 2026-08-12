import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Treasury MS - Gestion de TrÃ©sorerie',
  description: 'SystÃ¨me intÃ©grÃ© de gestion de trÃ©sorerie d\'entreprise',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
