import './globals.css';
import { Navigation } from '../components/nav';

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8">
          <h1 className="mb-1 text-3xl font-bold">Auto Industry Tycoon</h1>
          <p className="mb-5 text-sm text-stone-700">MVP Foundation - Phase 1 Vertical Slice</p>
          <Navigation />
          {children}
        </main>
      </body>
    </html>
  );
}
