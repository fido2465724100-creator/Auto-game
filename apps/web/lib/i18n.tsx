'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'ru' | 'en';

export const DICTIONARY = {
  ru: {
    brand: 'Auto Industry Tycoon',
    subtitle: 'Экономическая стратегия развития автомобилестроения (1900–2025)',
    
    // Nav
    nav: {
      dashboard: 'Кабинет директора',
      research: 'НИОКР и технологии',
      vehicleDesign: 'Конструктор авто',
      markets: 'Рынки и сбыт',
      bank: 'Банк и займы',
      reports: 'Ежемесячные отчеты',
    },

    // Timeline & Topbar
    topbar: {
      year: 'Год',
      month: 'Месяц',
      months: [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ],
      eraPioneers: 'Эра первопроходцев (1900–1914)',
      eraMassProduction: 'Эра конвейера (1915–1929)',
      eraModern: 'Современная эра',
      cash: 'Капитал',
      lastProfit: 'Прибыль за месяц',
      reputation: 'Репутация',
      endTurn: 'Завершить месяц',
      simulating: 'Симуляция...',
    },

    // Dashboard
    dashboard: {
      title: 'Кабинет генерального директора',
      companyStats: 'Сводные показатели компании',
      capacity: 'Мощность завода',
      unitsMonth: 'авто/мес',
      activeResearchCount: 'Текущих разработок',
      latestReport: 'Финансовый итог прошлого месяца',
      revenue: 'Выручка',
      expenses: 'Расходы',
      profit: 'Чистая прибыль',
      carsSold: 'Продано автомобилей',
      noReport: 'Первый месяц еще не завершен. Нажмите «Завершить месяц» вверху.',
      activeModelsSummary: 'Автомобили на конвейере',
      quickNav: 'Быстрый переход',
    },

    // Vehicle Design
    design: {
      title: 'Конструкторское бюро',
      subtitle: 'Проектирование новых моделей, подбор агрегатов и расчет себестоимости.',
      step1: '1. Название и целевой класс',
      modelName: 'Название модели',
      modelNamePlaceholder: 'Например: Model T Runabout',
      segment: 'Класс автомобиля',
      step2: '2. Выбор узлов и агрегатов',
      requiresTech: 'Требуется технология',
      submitBtn: 'Утвердить и запустить модель в производство',
      savingBtn: 'Сохранение модели...',
      successMsg: 'Модель успешно спроектирована и готова к производству!',
      specsTitle: 'Характеристики автомобиля',
      financeTitle: 'Экономика единицы',
      productionCost: 'Себестоимость производства',
      salePrice: 'Отпускная цена продажи ($)',
      unitProfit: 'Прибыль с машины (маржа)',
      marketAppeal: 'Привлекательность по рынкам',
      marketAppealHint: 'Базовое соответствие ожиданиям покупателей в различных регионах мира:',
      existingModels: 'Выпускаемые модели компании',
      noModels: 'У компании пока нет спроектированных автомобилей.',
      categories: {
        chassis: 'Шасси и рама',
        engine: 'Двигатель',
        brakes: 'Тормозная система',
        comfort: 'Кузов и кабина',
        package: 'Оснащение / Пакет',
      },
      stats: {
        reliability: 'Надежность',
        comfort: 'Комфорт',
        performance: 'Мощность / Скорость',
        efficiency: 'Экономичность',
        prestige: 'Престиж',
        complexity: 'Сложность сборки',
      },
    },

    // Bank
    bank: {
      title: 'Коммерческий Банк Автопромышленности',
      subtitle: 'Кредитные линии, инвестиционные ссуды и управление задолженностью.',
      offersTitle: 'Доступные кредитные предложения',
      activeTitle: 'Текущие кредитные обязательства',
      noLoans: 'У вашей компании нет открытых кредитов.',
      takeLoan: 'Взять кредит',
      repayLoan: 'Погасить досрочно',
      amount: 'Сумма займа',
      term: 'Срок',
      months: 'мес.',
      monthlyRate: 'Ставка в месяц',
      monthlyPayment: 'Ежемесячный платеж',
      remaining: 'Остаток долга',
      remainingMonths: 'Осталось месяцев',
      insufficientFunds: 'Недостаточно средств для досрочного погашения!',
      loanTaken: 'Кредит успешно зачислен на баланс компании!',
      loanRepaid: 'Кредит полностью закрыт!',
      warning: 'Платежи по кредитам автоматически списываются в конце каждого месяца в блоке расходов.',
    },

    // Markets
    markets: {
      title: 'Мировые рынки сбыта',
      subtitle: 'Характеристики регионов и потребительские предпочтения.',
      size: 'Емкость рынка',
      priceSensitivity: 'Чувствительность к цене',
      prestigeSensitivity: 'Чувствительность к престижу',
      units: 'авто',
    },

    // Research
    research: {
      title: 'Научно-исследовательский центр (НИОКР)',
      subtitle: 'Изобретение передовых узлов, материалов и методов сборки.',
      startBtn: 'Начать разработку',
      year: 'Год появления',
      status: 'Статус',
      statuses: {
        locked: 'Недоступно',
        available: 'Готово к изучению',
        researching: 'В разработке',
        completed: 'Изучено',
      },
      budgetMonth: 'Бюджет в месяц',
    },

    // Reports
    reports: {
      title: 'Архив ежемесячных отчетов',
      subtitle: 'История финансовой динамики и производственных результатов компании.',
      noReports: 'Отчетов пока нет. Завершите первый рабочий месяц.',
      produced: 'Произведено',
      sold: 'Продано',
      revenue: 'Выручка',
      expenses: 'Расходы',
      profit: 'Чистая прибыль',
      loansPaid: 'Выплаты по кредитам',
    },
  },

  en: {
    brand: 'Auto Industry Tycoon',
    subtitle: 'Economic Strategy Simulator of the Automobile Industry (1900–2025)',

    // Nav
    nav: {
      dashboard: 'Executive Office',
      research: 'R&D & Technology',
      vehicleDesign: 'Vehicle Design',
      markets: 'Markets & Sales',
      bank: 'Bank & Financing',
      reports: 'Monthly Reports',
    },

    // Timeline & Topbar
    topbar: {
      year: 'Year',
      month: 'Month',
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      eraPioneers: 'Pioneering Era (1900–1914)',
      eraMassProduction: 'Assembly Line Era (1915–1929)',
      eraModern: 'Modern Era',
      cash: 'Capital',
      lastProfit: 'Monthly Profit',
      reputation: 'Reputation',
      endTurn: 'End Month',
      simulating: 'Simulating...',
    },

    // Dashboard
    dashboard: {
      title: 'Executive Director Office',
      companyStats: 'Company Key Metrics',
      capacity: 'Factory Capacity',
      unitsMonth: 'cars/mo',
      activeResearchCount: 'Active Research',
      latestReport: 'Previous Month Financial Summary',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Net Profit',
      carsSold: 'Cars Sold',
      noReport: 'First month is not finished yet. Click "End Month" above.',
      activeModelsSummary: 'Production Line Models',
      quickNav: 'Quick Navigation',
    },

    // Vehicle Design
    design: {
      title: 'Vehicle Design Bureau',
      subtitle: 'Design new models, choose components and calculate unit manufacturing costs.',
      step1: '1. Model Name & Target Class',
      modelName: 'Model Name',
      modelNamePlaceholder: 'e.g.: Model T Runabout',
      segment: 'Vehicle Class',
      step2: '2. Component Selection',
      requiresTech: 'Requires technology',
      submitBtn: 'Approve & Start Production',
      savingBtn: 'Saving Model...',
      successMsg: 'Model successfully designed and added to production line!',
      specsTitle: 'Vehicle Specifications',
      financeTitle: 'Unit Economics',
      productionCost: 'Unit Production Cost',
      salePrice: 'Retail Sale Price ($)',
      unitProfit: 'Margin per Unit',
      marketAppeal: 'Regional Market Appeal',
      marketAppealHint: 'Customer satisfaction baseline across global regions:',
      existingModels: 'Active Company Models',
      noModels: 'Your company has not designed any models yet.',
      categories: {
        chassis: 'Chassis & Frame',
        engine: 'Engine',
        brakes: 'Brake System',
        comfort: 'Body & Cabin',
        package: 'Equipment Package',
      },
      stats: {
        reliability: 'Reliability',
        comfort: 'Comfort',
        performance: 'Power / Performance',
        efficiency: 'Efficiency',
        prestige: 'Prestige',
        complexity: 'Assembly Complexity',
      },
    },

    // Bank
    bank: {
      title: 'Commercial Automotive Bank',
      subtitle: 'Credit facilities, investment loans, and corporate debt management.',
      offersTitle: 'Available Credit Facilities',
      activeTitle: 'Active Debt Obligations',
      noLoans: 'Your company has no outstanding debts.',
      takeLoan: 'Take Loan',
      repayLoan: 'Repay in Full',
      amount: 'Loan Amount',
      term: 'Term',
      months: 'mo.',
      monthlyRate: 'Monthly Interest',
      monthlyPayment: 'Monthly Payment',
      remaining: 'Remaining Principal',
      remainingMonths: 'Months Remaining',
      insufficientFunds: 'Insufficient company funds for full repayment!',
      loanTaken: 'Loan proceeds deposited into company treasury!',
      loanRepaid: 'Loan obligation settled completely!',
      warning: 'Loan payments are deducted automatically at the end of each month as part of company expenses.',
    },

    // Markets
    markets: {
      title: 'Global Markets & Demand',
      subtitle: 'Regional consumer demographics and purchasing preferences.',
      size: 'Market Size',
      priceSensitivity: 'Price Sensitivity',
      prestigeSensitivity: 'Prestige Sensitivity',
      units: 'cars',
    },

    // Research
    research: {
      title: 'Research & Development Center (R&D)',
      subtitle: 'Innovate cutting-edge components, metallurgy and assembly techniques.',
      startBtn: 'Begin Research',
      year: 'Available Year',
      status: 'Status',
      statuses: {
        locked: 'Locked',
        available: 'Available',
        researching: 'Researching',
        completed: 'Completed',
      },
      budgetMonth: 'Monthly Budget',
    },

    // Reports
    reports: {
      title: 'Monthly Performance Archive',
      subtitle: 'Historical ledger of corporate financials, sales and factory output.',
      noReports: 'No monthly reports on file. Advance past the first month.',
      produced: 'Produced',
      sold: 'Sold',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Net Profit',
      loansPaid: 'Debt Service',
    },
  },
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
    if (saved === 'ru' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language): void => {
    setLangState(newLang);
    localStorage.setItem('ait_lang', newLang);
  };

  const t = DICTIONARY[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}
