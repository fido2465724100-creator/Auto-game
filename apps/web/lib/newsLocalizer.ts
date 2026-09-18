import type { Language } from './i18n';
import type { TranslationSchema } from './locales/ru';
import { ru } from './locales/ru';
import { en } from './locales/en';
import { uk } from './locales/uk';
import { de } from './locales/de';

/**
 * Dynamically localizes report event notes (world rank, overdraft loans, active historical events).
 */
export function localizeEventNote(note: string, t: TranslationSchema, lang: Language): string {
  if (!note) return '';

  // 1. World Rank Dispatch
  // Pattern: 🌐 Мировой рейтинг: #1 место (50 авто)
  const rankMatch = note.match(/🌐\s*[^:#]+:\s*#(\d+)[^(\d]*\(([\d\s,]+)\s*[^)]+\)/);
  if (rankMatch && rankMatch[1] && rankMatch[2]) {
    const rank = rankMatch[1];
    const units = rankMatch[2].trim();
    if (lang === 'en') return `🌐 World Rank: #${rank} (${units} cars)`;
    if (lang === 'uk') return `🌐 Світовий рейтинг: #${rank} місце (${units} авто)`;
    if (lang === 'de') return `🌐 Weltrangliste: #${rank} (${units} Fz.)`;
    return `🌐 Мировой рейтинг: #${rank} место (${units} авто)`;
  }

  // 2. Bank Overdraft Loan Notification
  // Pattern: ⚠️ Дефицит капитала ($1,500): банк предоставил кредитную линию на $2,000
  const overdraftMatch = note.match(/⚠️\s*[^($]*\(\$([\d\s,]+)\)[^$]*(\$[\d\s,]+)/);
  if (overdraftMatch && overdraftMatch[1] && overdraftMatch[2]) {
    const deficit = overdraftMatch[1].trim();
    const credit = overdraftMatch[2].trim();
    if (lang === 'en') return `⚠️ Capital Deficit ($${deficit}): bank provided credit line for ${credit}`;
    if (lang === 'uk') return `⚠️ Дефіцит капіталу ($${deficit}): банк надав кредитну лінію на ${credit}`;
    if (lang === 'de') return `⚠️ Liquiditätsdefizit ($${deficit}): Bank gewährt Kreditlinie über ${credit}`;
    return `⚠️ Дефицит капитала ($${deficit}): банк предоставил кредитную линию на ${credit}`;
  }

  // 3. Historical Events
  // Match note against known event names across all locales
  for (const [key, eventData] of Object.entries(ru.events ?? {})) {
    const names = [
      eventData.name,
      en.events?.[key]?.name,
      uk.events?.[key]?.name,
      de.events?.[key]?.name,
    ].filter(Boolean);

    if (names.some((n) => n && (note === n || note.includes(n)))) {
      const localized = t.events?.[key];
      if (localized) {
        return localized.name;
      }
    }
  }

  return note;
}

/**
 * Dynamically localizes competitor milestone intelligence dispatches.
 */
export function localizeCompetitorNews(news: string, t: TranslationSchema, lang: Language): string {
  if (!news) return '';

  // Milestone matching
  if (news.includes('Mercer-Benz') || news.includes('35 PS')) {
    const ms = t.milestones?.['mercer-benz-1901'];
    if (ms) return `${ms.title}: ${ms.description}`;
  }

  if (news.includes('Renard') || news.includes('вуатюреток') || news.includes('Voiturette')) {
    const ms = t.milestones?.['renard-1902'];
    if (ms) return `${ms.title}: ${ms.description}`;
  }

  if (
    (news.includes('Model T') || news.includes('Fort')) &&
    (news.includes('825') || news.includes('Жестяная') || news.includes('Tin Lizzie') || news.includes('Бляшана'))
  ) {
    const ms = t.milestones?.['fort-1908'];
    if (ms) return `${ms.title}: ${ms.description}`;
  }

  if (
    (news.includes('Model T') || news.includes('Fort')) &&
    (news.includes('$5') || news.includes('5$') || news.includes('конвейер') || news.includes('конвеєр') || news.includes('Fließband') || news.includes('Assembly Line'))
  ) {
    const ms = t.milestones?.['fort-1914'];
    if (ms) return `${ms.title}: ${ms.description}`;
  }

  return news;
}
