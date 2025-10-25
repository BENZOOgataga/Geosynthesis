import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Geosynthesis - Simulation de stratégie mondiale',
  description: 'Gérez votre nation dans une simulation mondiale dynamique',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
