import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Geosynthesis - Global Strategy Simulation',
  description: 'Manage your nation in a dynamic global simulation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
