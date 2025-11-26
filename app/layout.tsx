import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FRED Economic Dashboard',
  description: 'Federal Reserve Economic Data Dashboard',
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
