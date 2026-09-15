'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'ru' | 'en';

export const DICTIONARY = {
  ru: {
    brand: 'Auto Industry Tycoon',
    subtitle: 'Экономическая стратегия развития автомобилестроения (1900–2025)',
    brandCompany: 'Ваша компания',

    // Nav
    nav: {
      dashboard: 'Кабинет директора',
      production: 'Заводы и производство',
      vehicleDesign: 'Конструктор авто',
      research: 'НИОКР и технологии',
      markets: 'Рынки и сбыт',
      bank: 'Банк и займы',
      reports: 'Ежемесячные отчеты',
    },

    // Materials
    materials: {
      steel: 'Сталь и чугун',
      wood: 'Конструкционная древесина',
      rubber: 'Натуральный каучук',
      leather: 'Кожа и отделка',
      aluminum: 'Алюминий',
      plastic: 'Пластик и полимеры',
      units: {
        steel: 'кг',
        wood: 'ед.',
        rubber: 'кг',
        leather: 'м²',
        aluminum: 'кг',
        plastic: 'кг',
      },
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
      availableCashHint: 'Доступно на счетах',
      capacityHint: 'Лимит сборочных цехов',
      reputationHint: 'Престиж марки на рынках',
      researchHint: 'Проектов в лаборатории',
      createModel: '+ Создать новую модель →',
      unitCostLabel: 'Себестоимость',
      priceLabel: 'Цена',
    },

    // Vehicle Design
    design: {
      title: 'Конструкторское бюро',
      subtitle: 'Проектирование новых моделей, подбор агрегатов и расчет себестоимости.',
      step1: '1. Название и целевой класс',
      modelName: 'Название модели',
      modelNamePlaceholder: 'Например: Model T Runabout',
      segment: 'Класс автомобиля',
      segments: {
        economy: {
          name: 'Эконом (Стандарт)',
          tag: 'Ранэбаут',
          description: 'Доступная и простая самоходная повозка для широких слоев населения.',
        },
        family: {
          name: 'Семейный',
          tag: 'Турер',
          description: 'Вместительный экипаж со сбалансированным комфортом и надежностью.',
        },
        luxury: {
          name: 'Люкс',
          tag: 'Лимузин',
          description: 'Эксклюзивный представительский экипаж высшего класса для престижа.',
        },
        utility: {
          name: 'Грузовой',
          tag: 'Фургон',
          description: 'Тяговитое прочное шасси для коммерческих перевозок и торговли.',
        },
      },
      step2: '2. Выбор узлов и агрегатов',
      requiresTech: 'Требуется технология',
      step3: '3. Производственная квота и запуск',
      initialQuotaLabel: 'План выпуска новой модели в месяц',
      initialQuotaHint: 'Укажите, сколько машин этой модели фабрика будет собирать каждый месяц (квоту можно менять в разделе «Заводы и производство»).',
      availableCapacity: 'Доступная мощность завода',
      unitsMonth: 'авто/мес',
      submitBtn: 'Утвердить и запустить модель в производство',
      savingBtn: 'Сохранение модели и постановка на конвейер...',
      successMsg: 'Модель успешно спроектирована и поставлена на сборочную линию!',
      specsTitle: 'Характеристики автомобиля',
      financeTitle: 'Экономика единицы',
      productionCost: 'Себестоимость производства',
      salePrice: 'Отпускная цена продажи ($)',
      unitProfit: 'Прибыль с машины (маржа)',
      marketAppeal: 'Привлекательность по рынкам',
      marketAppealHint: 'Базовое соответствие ожиданиям покупателей в различных регионах мира:',
      factoryCapacityHint: 'мощность цехов завода',
      materialConsumptionHint: 'Расход сырья на сборку одной машины данной модели на конвейере:',
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

    // Production & Logistics
    production: {
      title: 'Производство и цепочки поставок',
      subtitle: 'Управление мануфактурами, распределение линий сборки и снабжение материалами.',
      factoryTitle: 'Текущий автозавод',
      level: 'Уровень цеха',
      capacity: 'Месячная мощность',
      capacityUsed: 'Загрузка линий',
      overheadMonthly: 'Содержание завода',
      expandBtn: 'Расширить завод (+60 авто/мес)',
      upgradeCost: 'Стоимость расширения',
      insufficientFunds: 'Недостаточно капитала для расширения завода!',
      plantExpanded: 'Завод успешно расширен! Мощность увеличена.',
      linesTitle: 'Распределение производственных линий',
      noModels: 'Нет спроектированных автомобилей. Сначала создайте модель в Конструкторе авто.',
      plannedUnits: 'План выпуска (авто/мес)',
      savePlanBtn: 'Сохранить план производства',
      planSaved: 'План производства успешно утвержден!',
      costPerUnit: 'Себестоимость сборки',
      totalCost: 'Суммарные затраты на выпуск',
      materialsRequiredPerUnit: 'Расход сырья на 1 авто',
      warehouseTitle: 'Склад сырья и биржа материалов',
      autoProcurement: 'Автоматическое снабжение сырьем под план (Just-In-Time)',
      autoProcurementHint: 'При нехватке материалов завод автоматически докупит недостающее сырье с биржи перед выпуском.',
      inStock: 'В наличии на складе',
      marketPrice: 'Цена закупки',
      needNextMonth: 'Потребность под план',
      buyBatchBtn: 'Купить партию',
      shortageAlert: 'Внимание! На складе недостаточно материалов для выполнения плана. Выпуск будет ограничен, если не включить автозакупку или не докупить сырье!',
      shortageHint: 'Для стабильного выпуска рекомендуется включить автоматическое снабжение Just-In-Time на складе ниже.',
      overCapacityWarning: 'Суммарный план выпуска превышает лимит цехов завода! Выпуск будет урезан до максимума мощности.',
      historicalPlantSubtitle: 'Историческая мануфактура сборки экипажей и безлошадных повозок',
      planSubtitle: 'Назначение месячных объемов производства для моделей на сборочных постах',
      warehouseSubtitle: 'Запасы сырья на складе мануфактуры и закупки на сырьевой бирже',
      insufficientFundsBatch: 'Недостаточно средств для покупки партии!',
      materialBought: 'Материалы успешно закуплены и поступили на склад!',
      autoProcurementUpdated: 'Режим автозакупки обновлен!',
      yearAvailable: 'Доступно с года',
      unitsShort: 'шт.',
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
      marketShare: 'Доля рынка',
      preferencesTitle: 'Предпочтения покупателей региона:',
      size: 'Емкость рынка',
      priceSensitivity: 'Чувствительность к цене',
      prestigeSensitivity: 'Чувствительность к престижу',
      units: 'авто',
    },

    // Regions
    regions: {
      'north-america': 'Северная Америка',
      europe: 'Европа',
      'middle-east': 'Ближний Восток',
    },

    // Research
    research: {
      title: 'Научно-исследовательский центр (НИОКР)',
      subtitle: 'Изобретение передовых узлов, материалов и методов сборки.',
      startBtn: 'Начать разработку',
      starting: 'Запуск разработки...',
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
      salesByRegion: 'Продажи по регионам:',
    },

    // Technologies
    technologies: {
      'standardized-steering-wheel': {
        name: 'Стандартизированное рулевое колесо',
        description: 'Повышает управляемость и уверенность водителя.',
      },
      'mechanical-brake-upgrade': {
        name: 'Модернизация механических тормозов',
        description: 'Более надежная и долговечная механическая тормозная система.',
      },
      'carburetor-improvement': {
        name: 'Улучшение карбюратора',
        description: 'Стабилизирует сгорание смеси и снижает расход топлива.',
      },
      'interchangeable-parts': {
        name: 'Взаимозаменяемые детали',
        description: 'Позволяет стандартизировать компоненты при массовом выпуске.',
      },
      'basic-brand-advertising': {
        name: 'Базовая реклама бренда',
        description: 'Публикации в газетах повышают узнаваемость марки.',
      },
      'electric-starter': {
        name: 'Электрический стартер',
        description: 'Избавляет от необходимости заводить двигатель вручную рукояткой.',
      },
      'basic-assembly-line': {
        name: 'Ранний сборочный конвейер',
        description: 'Последовательные посты сборки значительно увеличивают выпуск.',
      },
      'improved-suspension': {
        name: 'Улучшенная рессорная подвеска',
        description: 'Повышает плавность хода и комфорт на неровных дорогах.',
      },
      'windshield-wipers': {
        name: 'Стеклоочистители (дворники)',
        description: 'Улучшают обзор и безопасность в дождливую погоду.',
      },
      'sales-dealer-network': {
        name: 'Дилерская сеть продаж',
        description: 'Разветвленные торговые точки расширяют региональный охват.',
      },
      'hydraulic-braking-concepts': {
        name: 'Концепция гидравлических тормозов',
        description: 'Ранние гидравлические принципы ускоряют тормозной отклик.',
      },
      'managerial-accounting-ledgers': {
        name: 'Управленческий бухгалтерский учет',
        description: 'Точный учет издержек снижает финансовые потери предприятия.',
      },
    } as Record<string, { name: string; description: string }>,

    // Vehicle Components
    components: {
      'ladder-frame': 'Лестничная рама (базовая)',
      'touring-frame': 'Туринговая лонжеронная рама',
      'reinforced-suspension-frame': 'Рама с усиленной рессорной подвеской',
      'single-cylinder': 'Одноцилиндровый двигатель (6 л.с.)',
      'inline-four': 'Рядный четырехцилиндровый мотор (20 л.с.)',
      'electric-start-v4': 'Мотор V4 с электростартером (35 л.с.)',
      'band-brakes': 'Механические ленточные тормоза',
      'drum-brakes': 'Усиленные барабанные тормоза',
      'hydraulic-prototype-brakes': 'Прототип гидравлических тормозов',
      'open-runabout': 'Открытый кузов «Ранэбаут»',
      'basic-cabin': 'Деревянная каретная кабина',
      'enclosed-limousine-cabin': 'Закрытый кузов «Лимузин»',
      'package-none': 'Базовая комплектация (без пакета)',
      'weather-package': 'Всепогодный пакет (дворники и тент)',
      'touring-rally-kit': 'Туристический комплект надежности',
    } as Record<string, string>,

    // Bank Loans
    loans: {
      'micro-credit': {
        name: 'Краткосрочный овердрафт',
        description: 'Небольшой заем для экстренного покрытия кассового разрыва.',
      },
      'commercial-expansion': {
        name: 'Коммерческий заем на развитие',
        description: 'Среднесрочный кредит на закупку оборудования и наем инженеров.',
      },
      'industrial-bond': {
        name: 'Индустриальная облигация',
        description: 'Крупный заем для масштабного строительства и экспансии на рынки.',
      },
    } as Record<string, { name: string; description: string }>,
  },

  en: {
    brand: 'Auto Industry Tycoon',
    subtitle: 'Economic Strategy Simulator of the Automobile Industry (1900–2025)',
    brandCompany: 'Your Company',

    // Nav
    nav: {
      dashboard: 'Executive Office',
      production: 'Factory & Production',
      vehicleDesign: 'Vehicle Design',
      research: 'R&D & Technology',
      markets: 'Markets & Sales',
      bank: 'Bank & Financing',
      reports: 'Monthly Reports',
    },

    // Materials
    materials: {
      steel: 'Steel & Iron',
      wood: 'Hardwood Timber',
      rubber: 'Natural Caoutchouc',
      leather: 'Leather & Upholstery',
      aluminum: 'Aluminum',
      plastic: 'Plastics & Polymers',
      units: {
        steel: 'kg',
        wood: 'units',
        rubber: 'kg',
        leather: 'sq.m',
        aluminum: 'kg',
        plastic: 'kg',
      },
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
      availableCashHint: 'Available in treasury',
      capacityHint: 'Assembly line ceiling',
      reputationHint: 'Brand prestige across markets',
      researchHint: 'Active R&D projects',
      createModel: '+ Create New Model →',
      unitCostLabel: 'Cost',
      priceLabel: 'Price',
    },

    // Vehicle Design
    design: {
      title: 'Vehicle Design Bureau',
      subtitle: 'Design new models, choose components and calculate unit manufacturing costs.',
      step1: '1. Model Name & Target Class',
      modelName: 'Model Name',
      modelNamePlaceholder: 'e.g.: Model T Runabout',
      segment: 'Vehicle Class',
      segments: {
        economy: {
          name: 'Economy (Standard)',
          tag: 'Runabout',
          description: 'Affordable, simple personal transport for working families.',
        },
        family: {
          name: 'Family',
          tag: 'Tourer',
          description: 'Spacious carriage with balanced comfort and reliability.',
        },
        luxury: {
          name: 'Luxury',
          tag: 'Town Car',
          description: 'Exclusive hand-crafted vehicle for high-society prestige.',
        },
        utility: {
          name: 'Utility',
          tag: 'Work Truck',
          description: 'Heavy-duty transport for trade, cargo, and rural commerce.',
        },
      },
      step2: '2. Component Selection',
      requiresTech: 'Requires technology',
      step3: '3. Production Quota & Launch',
      initialQuotaLabel: 'Initial Monthly Production Quota',
      initialQuotaHint: 'Specify how many cars of this model your factory should assemble monthly (can be changed anytime in Factory & Production).',
      availableCapacity: 'Available Factory Capacity',
      unitsMonth: 'cars/mo',
      submitBtn: 'Approve & Put Into Production',
      savingBtn: 'Saving Model & Queuing Production...',
      successMsg: 'Model successfully designed and added to production line!',
      specsTitle: 'Vehicle Specifications',
      financeTitle: 'Unit Economics',
      productionCost: 'Unit Production Cost',
      salePrice: 'Retail Sale Price ($)',
      unitProfit: 'Margin per Unit',
      marketAppeal: 'Regional Market Appeal',
      marketAppealHint: 'Customer satisfaction baseline across global regions:',
      factoryCapacityHint: 'factory assembly capacity',
      materialConsumptionHint: 'Raw material requirements to assemble one vehicle of this model:',
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

    // Production & Logistics
    production: {
      title: 'Factory & Supply Chain Operations',
      subtitle: 'Manage manufacturing plants, allocate assembly lines, and procure raw materials.',
      factoryTitle: 'Current Automobile Plant',
      level: 'Plant Level',
      capacity: 'Monthly Capacity',
      capacityUsed: 'Capacity Utilization',
      overheadMonthly: 'Plant Overhead',
      expandBtn: 'Expand Factory (+60 cars/mo)',
      upgradeCost: 'Expansion Cost',
      insufficientFunds: 'Insufficient corporate capital for factory expansion!',
      plantExpanded: 'Plant expanded! Production capacity increased.',
      linesTitle: 'Assembly Line Quota Allocation',
      noModels: 'No designed models available. First create a model in the Vehicle Designer.',
      plannedUnits: 'Production Quota (cars/mo)',
      savePlanBtn: 'Save Production Plan',
      planSaved: 'Production plan updated successfully!',
      costPerUnit: 'Unit Assembly Cost',
      totalCost: 'Total Production Budget',
      materialsRequiredPerUnit: 'Materials per 1 Car',
      warehouseTitle: 'Raw Materials Warehouse & Commodity Market',
      autoProcurement: 'Automatic Material Procurement (Just-In-Time)',
      autoProcurementHint: 'Automatically purchases required raw materials from the market right before production begins.',
      inStock: 'In Warehouse Stock',
      marketPrice: 'Procurement Price',
      needNextMonth: 'Demand for Next Month',
      buyBatchBtn: 'Buy Batch',
      shortageAlert: 'Warning! Warehouse does not have sufficient materials to meet the production quota. Production will be throttled unless auto-procurement is enabled or materials are bought!',
      shortageHint: 'For uninterrupted assembly, enable Just-In-Time automated procurement below.',
      overCapacityWarning: 'Total planned production exceeds factory assembly capacity! Production will be throttled to plant ceiling.',
      historicalPlantSubtitle: 'Historical carriage manufacture and horseless carriage assembly plant',
      planSubtitle: 'Assign monthly output quotas for models on assembly lines',
      warehouseSubtitle: 'Raw material stockpiles and procurement on the commodity exchange',
      insufficientFundsBatch: 'Insufficient company funds to purchase this batch!',
      materialBought: 'Materials purchased and added to warehouse inventory!',
      autoProcurementUpdated: 'Auto-procurement setting updated!',
      yearAvailable: 'Available from Year',
      unitsShort: 'pcs.',
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
      marketShare: 'Market Share',
      preferencesTitle: 'Regional Consumer Preferences:',
      size: 'Market Size',
      priceSensitivity: 'Price Sensitivity',
      prestigeSensitivity: 'Prestige Sensitivity',
      units: 'cars',
    },

    // Regions
    regions: {
      'north-america': 'North America',
      europe: 'Europe',
      'middle-east': 'Middle East',
    },

    // Research
    research: {
      title: 'Research & Development Center (R&D)',
      subtitle: 'Innovate cutting-edge components, metallurgy and assembly techniques.',
      startBtn: 'Begin Research',
      starting: 'Starting research...',
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
      salesByRegion: 'Sales by Region:',
    },

    // Technologies
    technologies: {
      'standardized-steering-wheel': {
        name: 'Standardized Steering Wheel',
        description: 'Improves handling consistency and driver confidence.',
      },
      'mechanical-brake-upgrade': {
        name: 'Mechanical Brake Upgrade',
        description: 'Safer and more durable mechanical braking system.',
      },
      'carburetor-improvement': {
        name: 'Carburetor Improvement',
        description: 'Stabilizes combustion and reduces fuel waste.',
      },
      'interchangeable-parts': {
        name: 'Interchangeable Parts',
        description: 'Allows component standardization in production.',
      },
      'basic-brand-advertising': {
        name: 'Basic Brand Advertising',
        description: 'Newspaper presence increases brand recognition.',
      },
      'electric-starter': {
        name: 'Electric Starter',
        description: 'Removes manual crank start requirement.',
      },
      'basic-assembly-line': {
        name: 'Basic Assembly Line',
        description: 'Sequential assembly stations improve throughput.',
      },
      'improved-suspension': {
        name: 'Improved Suspension',
        description: 'Improves ride comfort on rough roads.',
      },
      'windshield-wipers': {
        name: 'Windshield Wipers',
        description: 'Improves usability in bad weather.',
      },
      'sales-dealer-network': {
        name: 'Sales Dealer Network',
        description: 'Distributed sales points improve regional reach.',
      },
      'hydraulic-braking-concepts': {
        name: 'Hydraulic Braking Concepts',
        description: 'Early hydraulic principles improve braking response.',
      },
      'managerial-accounting-ledgers': {
        name: 'Managerial Accounting Ledgers',
        description: 'Improved cost tracking reduces financial waste.',
      },
    } as Record<string, { name: string; description: string }>,

    // Vehicle Components
    components: {
      'ladder-frame': 'Ladder Frame (Standard)',
      'touring-frame': 'Touring Channel-Section Frame',
      'reinforced-suspension-frame': 'Reinforced Leaf-Spring Chassis',
      'single-cylinder': 'Single-Cylinder Engine (6 hp)',
      'inline-four': 'Inline-Four Engine (20 hp)',
      'electric-start-v4': 'Electric-Start V4 Engine (35 hp)',
      'band-brakes': 'Mechanical Band Brakes',
      'drum-brakes': 'Reinforced Drum Brakes',
      'hydraulic-prototype-brakes': 'Prototype Hydraulic Brakes',
      'open-runabout': 'Open Runabout Body',
      'basic-cabin': 'Wooden Carriage Cabin',
      'enclosed-limousine-cabin': 'Enclosed Limousine Cabin',
      'package-none': 'Standard Configuration (No Package)',
      'weather-package': 'All-Weather Package (Wipers & Soft Top)',
      'touring-rally-kit': 'Touring Reliability Kit',
    } as Record<string, string>,

    // Bank Loans
    loans: {
      'micro-credit': {
        name: 'Short-term Overdraft',
        description: 'Small loan for emergency cash flow coverage.',
      },
      'commercial-expansion': {
        name: 'Commercial Expansion Loan',
        description: 'Medium-term loan for equipment purchase and engineer hiring.',
      },
      'industrial-bond': {
        name: 'Industrial Bond',
        description: 'Large-scale loan for plant expansion and market penetration.',
      },
    } as Record<string, { name: string; description: string }>,
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
