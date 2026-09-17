import type { Language } from './i18n';

export type EraId =
  | 'era-1900' // 1900–1919: Дерево, медь, латунь, пергамент, заклепки
  | 'era-1920' // 1920–1939: Ар-деко, полированный лак, хром, геометрия
  | 'era-1940' // 1940–1959: Бакелит, слоновая кость, пастель, аэростиль
  | 'era-1960' // 1960–1979: Мускул-кары, винил, матовый алюминий, янтарь
  | 'era-1980' // 1980–1999: Черный текстурированный пластик (ABS), зеленые VFD/LED дисплеи
  | 'era-2000' // 2000–2019: Анодированный алюминий, стекломорфизм, сталь
  | 'era-2020'; // 2020+: Углеволокно (карбон), глубокий OLED, неоновый циан

export interface EraThemeConfig {
  id: EraId;
  nameRu: string;
  nameEn: string;
  nameUk: string;
  nameDe: string;
  materialRu: string;
  materialEn: string;
  materialUk: string;
  materialDe: string;
  icon: string;
  yearStart: number;
  yearEnd: number;
  bgClass: string;
  cardClass: string;
  borderClass: string;
  accentClass: string;
  accentTextClass: string;
  badgeBg: string;
  badgeText: string;
  headerStyle: string;
  advisorTitles: {
    engineerRu: string;
    engineerEn: string;
    engineerUk: string;
    engineerDe: string;
    financeRu: string;
    financeEn: string;
    financeUk: string;
    financeDe: string;
    plantRu: string;
    plantEn: string;
    plantUk: string;
    plantDe: string;
  };
}

export const ERA_THEMES: Record<EraId, EraThemeConfig> = {
  'era-1900': {
    id: 'era-1900',
    nameRu: 'Эпоха пара и первопроходцев',
    nameEn: 'Pioneer & Steam Era',
    nameUk: 'Епоха пари та першопрохідців',
    nameDe: 'Ära des Dampfes & Pioniere',
    materialRu: 'Мореный дуб, латунь и пергамент',
    materialEn: 'Bog Oak, Brass & Parchment',
    materialUk: 'Морений дуб, латунь та пергамент',
    materialDe: 'Mooreiche, Messing & Pergament',
    icon: '🪵',
    yearStart: 1900,
    yearEnd: 1919,
    bgClass: 'bg-[#f4efe4] text-stone-900',
    cardClass: 'bg-[#faf6ee] border-amber-900/20 shadow-xs',
    borderClass: 'border-amber-900/30',
    accentClass: 'bg-amber-900 text-amber-50 hover:bg-amber-950',
    accentTextClass: 'text-amber-950',
    badgeBg: 'bg-amber-100 border border-amber-900/20',
    badgeText: 'text-amber-950',
    headerStyle: 'font-serif tracking-tight',
    advisorTitles: {
      engineerRu: 'Главный механик',
      engineerEn: 'Chief Mechanic',
      engineerUk: 'Головний механік',
      engineerDe: 'Chefmechaniker',
      financeRu: 'Управляющий казначейством',
      financeEn: 'Treasury Steward',
      financeUk: 'Керуючий скарбницею',
      financeDe: 'Schatzmeister',
      plantRu: 'Смотритель мануфактуры',
      plantEn: 'Workshop Foreman',
      plantUk: 'Доглядач мануфактури',
      plantDe: 'Manufakturleiter',
    },
  },
  'era-1920': {
    id: 'era-1920',
    nameRu: 'Ревущие двадцатые и Ар-деко',
    nameEn: 'Roaring Twenties & Art Deco',
    nameUk: 'Ревучі двадцяті та Ар-деко',
    nameDe: 'Goldene Zwanziger & Art déco',
    materialRu: 'Полированная сталь, хром и черный лак',
    materialEn: 'Polished Steel, Chrome & Black Lacquer',
    materialUk: 'Полірована сталь, хром та чорний лак',
    materialDe: 'Polierter Stahl, Chrom & Schwarzlack',
    icon: '⚙️',
    yearStart: 1920,
    yearEnd: 1939,
    bgClass: 'bg-[#0f172a] text-slate-100',
    cardClass: 'bg-[#1e293b] border-amber-400/30 shadow-md',
    borderClass: 'border-amber-400/40',
    accentClass: 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold',
    accentTextClass: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 border border-amber-400/40',
    badgeText: 'text-amber-300',
    headerStyle: 'font-sans uppercase tracking-widest font-black',
    advisorTitles: {
      engineerRu: 'Инженер-конструктор',
      engineerEn: 'Chief Design Engineer',
      engineerUk: 'Інженер-конструктор',
      engineerDe: 'Konstruktionsingenieur',
      financeRu: 'Финансовый директор',
      financeEn: 'Comptroller',
      financeUk: 'Фінансовий директор',
      financeDe: 'Finanzdirektor',
      plantRu: 'Начальник конвейера',
      plantEn: 'Assembly Superintendent',
      plantUk: 'Начальник конвеєра',
      plantDe: 'Montageleiter',
    },
  },
  'era-1940': {
    id: 'era-1940',
    nameRu: 'Послевоенный бум и Аэростиль',
    nameEn: 'Post-War Boom & Tailfins',
    nameUk: 'Післявоєнний бум та Аеростиль',
    nameDe: 'Nachkriegsboom & Stromlinien-Ära',
    materialRu: 'Бакелит, слоновая кость и массивный хром',
    materialEn: 'Bakelite, Ivory & Mirror Chrome',
    materialUk: 'Бакеліт, слонова кістка та масивний хром',
    materialDe: 'Bakelit, Elfenbein & Spiegelchrom',
    icon: '🚀',
    yearStart: 1940,
    yearEnd: 1959,
    bgClass: 'bg-[#f0f9ff] text-slate-800',
    cardClass: 'bg-white border-sky-300/60 shadow-md ring-1 ring-sky-100',
    borderClass: 'border-sky-300',
    accentClass: 'bg-cyan-700 text-white hover:bg-cyan-800',
    accentTextClass: 'text-cyan-900',
    badgeBg: 'bg-sky-100 border border-sky-300',
    badgeText: 'text-sky-900',
    headerStyle: 'font-sans font-bold tracking-normal',
    advisorTitles: {
      engineerRu: 'Директор по развитию',
      engineerEn: 'VP of Engineering',
      engineerUk: 'Директор з розвитку',
      engineerDe: 'Entwicklungschef',
      financeRu: 'Вице-президент по финансам',
      financeEn: 'VP of Finance',
      financeUk: 'Віцепрезидент з фінансів',
      financeDe: 'Finanzvorstand (CFO)',
      plantRu: 'Директор завода',
      plantEn: 'Plant Manager',
      plantUk: 'Директор заводу',
      plantDe: 'Werksleiter',
    },
  },
  'era-1960': {
    id: 'era-1960',
    nameRu: 'Эра мускул-каров и винила',
    nameEn: 'Muscle Car & Vinyl Era',
    nameUk: 'Ера маслкарів та вінілу',
    nameDe: 'Muscle-Car- & Vinyl-Ära',
    materialRu: 'Перфорированный винил и матовый алюминий',
    materialEn: 'Perforated Vinyl & Brushed Aluminum',
    materialUk: 'Перфорований вініл та матовий алюміній',
    materialDe: 'Gelochtes Vinyl & Gebürstetes Aluminium',
    icon: '🏎️',
    yearStart: 1960,
    yearEnd: 1979,
    bgClass: 'bg-[#18181b] text-zinc-100',
    cardClass: 'bg-[#27272a] border-amber-600/40 shadow-lg',
    borderClass: 'border-amber-600/50',
    accentClass: 'bg-orange-600 text-white hover:bg-orange-500 font-bold',
    accentTextClass: 'text-orange-400',
    badgeBg: 'bg-orange-950/70 border border-orange-500/40',
    badgeText: 'text-orange-300',
    headerStyle: 'font-sans font-black italic tracking-wide uppercase',
    advisorTitles: {
      engineerRu: 'Главный моторист',
      engineerEn: 'Head of Powertrain',
      engineerUk: 'Головний моторист',
      engineerDe: 'Leiter Motorenentwicklung',
      financeRu: 'Финансовый аналитик',
      financeEn: 'Lead Financial Officer',
      financeUk: 'Фінансовий аналітик',
      financeDe: 'Leitender Finanzanalyst',
      plantRu: 'Управляющий производством',
      plantEn: 'Operations Director',
      plantUk: 'Керуючий виробництвом',
      plantDe: 'Betriebsleiter',
    },
  },
  'era-1980': {
    id: 'era-1980',
    nameRu: 'Цифровой век и полимеры',
    nameEn: 'Digital Revolution & Polymers',
    nameUk: 'Цифровий вік та полімери',
    nameDe: 'Digitale Revolution & Polymere',
    materialRu: 'Формованный ABS-пластик и зеленые VFD-дисплеи',
    materialEn: 'Molded ABS Plastic & Green VFDs',
    materialUk: 'Формований ABS-пластик та зелені VFD-дисплеї',
    materialDe: 'Gepresster ABS-Kunststoff & Grüne VFDs',
    icon: '📟',
    yearStart: 1980,
    yearEnd: 1999,
    bgClass: 'bg-[#09090b] text-emerald-400',
    cardClass: 'bg-[#18181b] border-emerald-500/40 shadow-emerald-950/20 shadow-lg',
    borderClass: 'border-emerald-600/50',
    accentClass: 'bg-emerald-600 text-black hover:bg-emerald-500 font-mono font-bold',
    accentTextClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-950 border border-emerald-500/50',
    badgeText: 'text-emerald-300 font-mono',
    headerStyle: 'font-mono font-bold tracking-tight',
    advisorTitles: {
      engineerRu: 'Руководитель R&D',
      engineerEn: 'Head of R&D Systems',
      engineerUk: 'Керівник R&D',
      engineerDe: 'Leiter F&E-Systeme',
      financeRu: 'Главный казначей (CFO)',
      financeEn: 'Chief Financial Officer',
      financeUk: 'Головний скарбник (CFO)',
      financeDe: 'Finanzchef (CFO)',
      plantRu: 'Технический директор',
      plantEn: 'Chief Operating Officer',
      plantUk: 'Технічний директор',
      plantDe: 'Technischer Direktor (COO)',
    },
  },
  'era-2000': {
    id: 'era-2000',
    nameRu: 'Миллениум и стекломорфизм',
    nameEn: 'Millennium & Aero-Glass',
    nameUk: 'Міленіум та скломорфізм',
    nameDe: 'Millennium & Aero-Glas',
    materialRu: 'Шлифованный алюминий, стекло и софт-тач',
    materialEn: 'Brushed Aluminum, Glass & Soft-Touch',
    materialUk: 'Шліфований алюміній, скло та софт-тач',
    materialDe: 'Gebürstetes Aluminium, Glas & Soft-Touch',
    icon: '💎',
    yearStart: 2000,
    yearEnd: 2019,
    bgClass: 'bg-slate-100 text-slate-800',
    cardClass: 'bg-white/80 backdrop-blur-md border-slate-300/80 shadow-md',
    borderClass: 'border-slate-300',
    accentClass: 'bg-blue-600 text-white hover:bg-blue-700 font-medium',
    accentTextClass: 'text-blue-600',
    badgeBg: 'bg-blue-50 border border-blue-200',
    badgeText: 'text-blue-800',
    headerStyle: 'font-sans font-semibold tracking-tight',
    advisorTitles: {
      engineerRu: 'Главный инженер платформ',
      engineerEn: 'Platform Chief Architect',
      engineerUk: 'Головний інженер платформ',
      engineerDe: 'Plattform-Chefarchitekt',
      financeRu: 'CFO концерна',
      financeEn: 'Group CFO',
      financeUk: 'CFO концерну',
      financeDe: 'Konzern-CFO',
      plantRu: 'Директор глобальных цепей',
      plantEn: 'Supply Chain VP',
      plantUk: 'Директор глобальних ланцюгів',
      plantDe: 'Leiter Globale Lieferketten',
    },
  },
  'era-2020': {
    id: 'era-2020',
    nameRu: 'Карбон, Неон и Электротяга',
    nameEn: 'Carbon Fiber & Electric Hyper-Age',
    nameUk: 'Карбон, Неон та Електротяга',
    nameDe: 'Carbon & Elektro-Hyperzeitalter',
    materialRu: 'Углеволокно, титан и неоновый OLED',
    materialEn: 'Carbon Fiber, Titanium & Neon OLED',
    materialUk: 'Вуглеволокно, титан та неоновий OLED',
    materialDe: 'Carbonfaser, Titan & Neon-OLED',
    icon: '⚡',
    yearStart: 2020,
    yearEnd: 2030,
    bgClass: 'bg-[#030712] text-zinc-100',
    cardClass: 'bg-[#111827]/90 backdrop-blur-lg border-cyan-500/40 shadow-cyan-950/30 shadow-xl ring-1 ring-cyan-500/20',
    borderClass: 'border-cyan-500/40',
    accentClass: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold shadow-cyan-500/20 shadow-lg',
    accentTextClass: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/80 border border-cyan-500/50',
    badgeText: 'text-cyan-300 font-mono',
    headerStyle: 'font-sans font-black tracking-wider uppercase',
    advisorTitles: {
      engineerRu: 'Директор AI и EV технологий',
      engineerEn: 'Chief EV & Software Architect',
      engineerUk: 'Директор AI та EV технологій',
      engineerDe: 'Chefarchitekt E-Mobilität & KI',
      financeRu: 'Инвестиционный директор',
      financeEn: 'Chief Investment Officer',
      financeUk: 'Інвестиційний директор',
      financeDe: 'Investmentdirektor',
      plantRu: 'Управляющий Гигафабрикой',
      plantEn: 'Gigafactory General Manager',
      plantUk: 'Керуючий Гігафабрикою',
      plantDe: 'Gigafactory-Leiter',
    },
  },
};

export function getEraTheme(year: number): EraThemeConfig {
  if (year < 1920) return ERA_THEMES['era-1900'];
  if (year < 1940) return ERA_THEMES['era-1920'];
  if (year < 1960) return ERA_THEMES['era-1940'];
  if (year < 1980) return ERA_THEMES['era-1960'];
  if (year < 2000) return ERA_THEMES['era-1980'];
  if (year < 2020) return ERA_THEMES['era-2000'];
  return ERA_THEMES['era-2020'];
}

export function getEraId(year: number): EraId {
  return getEraTheme(year).id;
}

export function getEraName(theme: EraThemeConfig, lang: Language): string {
  if (lang === 'en') return theme.nameEn;
  if (lang === 'uk') return theme.nameUk;
  if (lang === 'de') return theme.nameDe;
  return theme.nameRu;
}

export function getEraMaterial(theme: EraThemeConfig, lang: Language): string {
  if (lang === 'en') return theme.materialEn;
  if (lang === 'uk') return theme.materialUk;
  if (lang === 'de') return theme.materialDe;
  return theme.materialRu;
}

export function getAdvisorTitle(
  advisor: 'engineer' | 'finance' | 'plant',
  theme: EraThemeConfig,
  lang: Language
): string {
  const titles = theme.advisorTitles;
  if (advisor === 'engineer') {
    if (lang === 'en') return titles.engineerEn;
    if (lang === 'uk') return titles.engineerUk;
    if (lang === 'de') return titles.engineerDe;
    return titles.engineerRu;
  }
  if (advisor === 'finance') {
    if (lang === 'en') return titles.financeEn;
    if (lang === 'uk') return titles.financeUk;
    if (lang === 'de') return titles.financeDe;
    return titles.financeRu;
  }
  if (lang === 'en') return titles.plantEn;
  if (lang === 'uk') return titles.plantUk;
  if (lang === 'de') return titles.plantDe;
  return titles.plantRu;
}
