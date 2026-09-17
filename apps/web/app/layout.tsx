import './globals.css';
import { TopTimelineBar } from '../components/layout/TopTimelineBar';
import { CompanySetupModal } from '../components/CompanySetupModal';
import { LanguageProvider } from '../lib/i18n';
import { GameProvider } from '../context/GameContext';

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <LanguageProvider>
          <GameProvider>
            {/* BRAND SETUP & ONBOARDING MODAL */}
            <CompanySetupModal />

            {/* MAIN UNIFIED WINDOW */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* TOP TIMELINE & CONTROLS */}
              <TopTimelineBar />

              {/* UNIFIED WINDOW CONTENT */}
              <main className="flex-1 p-3 md:p-6 max-w-7xl w-full mx-auto">
                {children}
              </main>
            </div>
          </GameProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
