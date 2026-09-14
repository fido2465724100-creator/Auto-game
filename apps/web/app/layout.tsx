import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { TopTimelineBar } from '../components/layout/TopTimelineBar';
import { LanguageProvider } from '../lib/i18n';
import { GameProvider } from '../context/GameContext';

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col md:flex-row bg-[var(--bg)] text-[var(--ink)]">
        <LanguageProvider>
          <GameProvider>
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* TOP TIMELINE & CONTROLS */}
              <TopTimelineBar />

              {/* PAGE CONTENT */}
              <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
                {children}
              </main>
            </div>
          </GameProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
