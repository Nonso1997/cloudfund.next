import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cloudfund Inc',
  description: 'Modern investment platform rebuilt with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              Cloudfund
            </Link>
            <nav className="main-nav">
              <Link href="#about">About</Link>
              <Link href="/loans">Loans</Link>
              <Link href="#features">Features</Link>
              <Link href="#plans">Plans</Link>
              <Link href="/roadmap">Roadmap</Link>
              <div className="dropdown">
                <button className="dropdown-trigger">Login</button>
                <div className="dropdown-menu">
                  <Link href="/login">User Login</Link>
                  <Link href="/admin/login">Admin Login</Link>
                  <Link href="/register">Register</Link>
                </div>
              </div>
              <Link href="/register" className="button button-outline">Get Started</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
