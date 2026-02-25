import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BeanLog - コーヒー豆ログ公開サービス',
  description:
    'あなたのコーヒー体験を記録・共有。飲んだコーヒー豆のログを残して、公開URLで誰とでもシェアしよう。',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.variable}>
        <Header />
        <main className="main">{children}</main>
        <footer className="footer">
          <div className="footer-inner">
            <p>☕ BeanLog — あなたのコーヒー体験を記録・共有</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
