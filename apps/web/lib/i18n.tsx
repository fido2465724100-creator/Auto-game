'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ru } from './locales/ru';
import { en } from './locales/en';
import { uk } from './locales/uk';
import { de } from './locales/de';

export type Language = 'ru' | 'en' | 'uk' | 'de';

export const DICTIONARY = {
  ru,
  en,
  uk,
  de,
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof DICTIONARY)['ru'];
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ru',
  setLang: () => {},
  t: DICTIONARY.ru,
});

export function LanguageProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [lang, setLangState] = useState<Language>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('ait_lang') as Language | null;
    if (saved === 'ru' || saved === 'en' || saved === 'uk' || saved === 'de') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language): void => {
    setLangState(newLang);
    localStorage.setItem('ait_lang', newLang);
  };

  const t = DICTIONARY[lang] ?? DICTIONARY.ru;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}
