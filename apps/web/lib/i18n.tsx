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
      quarter: 'Квартал',
      quarters: ['I кв.', 'II кв.', 'III кв.', 'IV кв.'],
      month: 'Месяц',
      months: [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ],
      eraPioneers: 'Эра первопроходцев (1900–1914)',
      eraMassProduction: 'Эра конвейера (1915–1929)',
      eraModern: 'Современная эра',
      cash: 'Капитал',
      lastProfit: 'Прибыль за квартал',
      reputation: 'Репутация',
      endTurn: 'Завершить квартал',
      simulating: 'Симуляция...',
      turnProgress: 'Ход {turn} из 504 (1900–2026)',
      setupCompanyBtn: 'Паспорт марки',
      unitsQuarter: 'авто/кв.',
    },

    // Countries
    countries: {
      usa: { name: 'США', flag: '🇺🇸', description: 'Гигантский емкий рынок, акцент на практичность, взаимозаменяемые детали и массовый тираж.' },
      germany: { name: 'Германия', flag: '🇩🇪', description: 'Родина автомобиля (Бенц и Даймлер), передовое машиностроение и высокая инженерная культура.' },
      france: { name: 'Франция', flag: '🇫🇷', description: 'Мировая столица ранних автогонок, изящные каретные кузова и смелые технологические инновации.' },
      uk: { name: 'Великобритания', flag: '🇬🇧', description: 'Метрополия Британской империи, вековые традиции мастерства и выносливые рессорные шасси.' },
    },

    // Founder Perks
    founderPerks: {
      mechanic: {
        name: 'Талантливый механик',
        badge: '🔧 Инженерия',
        description: '+15% к базовой надежности всех создаваемых машин; +1 мес. ускорения к разработке двигателей и шасси.',
      },
      merchant: {
        name: 'Опытный купец',
        badge: '💰 Торговля',
        description: '-15% скидка на оптовую закупку сырья на бирже; +10% к торговой маржинальности от розничных продаж авто.',
      },
      coachbuilder: {
        name: 'Потомственный каретник',
        badge: '👑 Престиж',
        description: '+15% к комфорту и престижу создаваемых кузовов; -25% экономия расхода древесины и кожи на фабрике.',
      },
    },

    // Powertrains & Fuels
    powertrains: {
      all: 'Все типы тяги',
      ice: 'ДВС (Бензин / Спирт)',
      steam: 'Паровая тяга 💨',
      electric: 'Электропривод ⚡',
    },
    fuels: {
      gasoline: 'Бензин',
      ethanol_blend: 'Спиртовая смесь (Этанол)',
      steam_fuel: 'Уголь и вода (Пар)',
      electricity: 'Электроэнергия (АКБ)',
    },
    crankWarning: '⚠️ Ручная заводная рукоятка: опасность травмы кисти при отдаче, -10 к комфорту (до электростартера Кеттеринга 1912 г.)',

    // Company Setup
    companySetup: {
      title: 'Основание автомобильной компании (1900 год)',
      subtitle: 'Заложите основы автомобильной империи на заре XX века: выберите страну, геральдический шильдик и стартовое призвание.',
      nameLabel: 'Название марки / завода',
      namePlaceholder: 'Например: Detroit Motor Carriage',
      countryLabel: 'Страна основания и мануфактуры',
      perkLabel: 'Специализация основателя предприятия',
      badgeLabel: 'Шильдик и геральдическая эмблема',
      badgeColor: 'Цвет шильдика',
      badgeShape: 'Форма шильдика',
      badgeIcon: 'Геральдический символ',
      submitBtn: 'Основать компанию и начать игру (1900 Q1)',
      reconfigureBtn: 'Паспорт и геральдика марки',
    },

    // Competitors
    competitors: {
      title: 'Мировые автопроизводители и ориентиры',
      subtitle: 'Исторические концерны, их рыночные доли, модели и поворотные моменты в индустрии.',
      marketShare: 'Доля рынка в регионе',
      activeModels: 'Модельный ряд конкурента',
      milestonesTitle: 'Исторические вехи и потрясения рынка',
      speedBenchmark: 'Эталон сегмента',
      price: 'Цена',
      appeal: 'Привлекательность',
    },

    // Dashboard
    dashboard: {
      title: 'Кабинет генерального директора',
      companyStats: 'Сводные показатели компании',
      capacity: 'Мощность завода',
      unitsMonth: 'авто/кв.',
      activeResearchCount: 'Текущих разработок',
      latestReport: 'Финансовый итог прошлого квартала',
      revenue: 'Выручка',
      expenses: 'Расходы',
      profit: 'Чистая прибыль',
      carsSold: 'Продано автомобилей',
      noReport: 'Первый квартал еще не завершен. Нажмите «Завершить квартал» вверху.',
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
      initialQuotaLabel: 'План выпуска новой модели в квартал',
      initialQuotaHint: 'Укажите, сколько машин этой модели мастерская будет собирать каждый квартал (квоту можно менять в разделе «Заводы и производство»).',
      availableCapacity: 'Доступная мощность завода',
      unitsMonth: 'авто/кв.',
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
      capacity: 'Квартальная мощность',
      capacityUsed: 'Загрузка линий',
      overheadMonthly: 'Содержание завода в квартал',
      expandBtn: 'Расширить завод (+4 авто/кв.)',
      upgradeCost: 'Стоимость расширения',
      insufficientFunds: 'Недостаточно капитала для расширения завода!',
      plantExpanded: 'Завод успешно расширен! Мощность увеличена.',
      linesTitle: 'Распределение производственных линий',
      noModels: 'Нет спроектированных автомобилей. Сначала создайте модель в Конструкторе авто.',
      plannedUnits: 'План выпуска (авто/кв.)',
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
      needNextMonth: 'Потребность на квартал',
      buyBatchBtn: 'Купить партию',
      shortageAlert: 'Внимание! На складе недостаточно материалов для выполнения плана. Выпуск будет ограничен, если не включить автозакупку или не докупить сырье!',
      shortageHint: 'Для стабильного выпуска рекомендуется включить автоматическое снабжение Just-In-Time на складе ниже.',
      overCapacityWarning: 'Суммарный план выпуска превышает лимит цехов завода! Выпуск будет урезан до максимума мощности.',
      historicalPlantSubtitle: 'Историческая мануфактура сборки экипажей и безлошадных повозок',
      planSubtitle: 'Назначение квартальных объемов производства для моделей на сборочных постах',
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
      title: 'Архив ежеквартальных отчетов',
      subtitle: 'История финансовой динамики и производственных результатов компании.',
      noReports: 'Отчетов пока нет. Завершите первый квартал.',
      produced: 'Произведено',
      sold: 'Продано',
      revenue: 'Выручка',
      expenses: 'Расходы',
      profit: 'Чистая прибыль',
      loansPaid: 'Выплаты по кредитам',
      salesByRegion: 'Продажи по регионам:',
      competitorNews: 'Сводки конкурентов и рынка:',
    },

    // Technologies
    technologies: {
      'standardized-steering-wheel': {
        name: 'Стандартизированное рулевое колесо',
        description: 'Повышает управляемость и уверенность водителя.',
      },
      'steam-condenser': {
        name: 'Паровой конденсатор замкнутого цикла',
        description: 'Позволяет повторно использовать воду, увеличивая запас хода паромобиля без частой дозаправки.',
      },
      'ethanol-carburetor': {
        name: 'Двухтопливный спиртовой карбюратор',
        description: 'Позволяет двигателю работать на домашнем спирте/этаноле фермерских регионов до введения Сухого закона.',
      },
      'edison-nickel-iron-battery': {
        name: 'Никель-железный аккумулятор Эдисона',
        description: 'Долговечные щелочные батареи повышенной емкости для тихих и чистых ранних электромобилей.',
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
        name: 'Электрический стартер Кеттеринга (1912)',
        description: 'Исторический прорыв: запуск ключом без опасной рукоятки, окончательно вытеснивший пар и электрокары.',
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
      'ford-moving-assembly-line': {
        name: 'Движущийся сборочный конвейер',
        description: 'Поточная сборка на движущихся лентах сокращает время сборки шасси с 12 часов до 93 минут.',
      },
      'all-steel-closed-body': {
        name: 'Цельнометаллический закрытый кузов',
        description: 'Штампованный стальной кузов устраняет гниение деревянного каркаса и защищает при авариях.',
      },
      'inline-4-monobloc-engine': {
        name: 'Рядный 4-цилиндровый двигатель-моноблок',
        description: 'Отливка цилиндров в едином блоке повышает жесткость и снижает себестоимость мотора.',
      },
      'four-wheel-hydraulic-brakes': {
        name: 'Четырехколесные гидравлические тормоза',
        description: 'Одновременное гидравлическое давление обеспечивает равное тормозное усилие на всех четырех колесах.',
      },
      'safety-laminated-glass': {
        name: 'Безопасное многослойное стекло (Триплекс)',
        description: 'Прослойка целлулоида предотвращает разлет осколков лобового стекла при ударе.',
      },
      'luxury-v8-overhead-valve': {
        name: 'Престижный двигатель V8 с верхними клапанами',
        description: 'Плавная и бесшумная мощь мотора V8 знаменует золотой век представительских автомобилей.',
      },
    } as Record<string, { name: string; description: string }>,

    // Vehicle Components
    components: {
      'ladder-frame': 'Лестничная рама (базовая)',
      'touring-frame': 'Туринговая лонжеронная рама',
      'reinforced-suspension-frame': 'Рама с усиленной рессорной подвеской',
      'reinforced-suspension': 'Усиленная эллиптическая подвеска',
      'single-cylinder': 'Одноцилиндровый ДВС (6 л.с., пуск рукояткой)',
      'steam-compound-twin': 'Двухцилиндровая паровая машина Компаунд (15 л.с.)',
      'electric-traction-dc': 'Тяговый электромотор постоянного тока (10 л.с.)',
      'ethanol-dual-engine': 'Двухтопливный ДВС Спирт/Бензин (8 л.с.)',
      'inline-four': 'Рядный четырехцилиндровый мотор (20 л.с.)',
      'electric-start-v4': 'Мотор V4 с электростартером (35 л.с.)',
      'band-brakes': 'Механические ленточные тормоза',
      'drum-brakes': 'Усиленные барабанные тормоза',
      'hydraulic-prototype-brakes': 'Прототип гидравлических тормозов',
      'open-runabout': 'Открытый кузов «Ранэбаут»',
      'basic-cabin': 'Простая каретная кабина',
      'wooden-cabin': 'Качественная каретная кабина из дерева',
      'luxury-cabin': 'Роскошный каретный салон с велюром и лаком',
      'enclosed-limousine-cabin': 'Закрытый кузов «Лимузин»',
      'package-none': 'Базовая комплектация (без пакета)',
      'weather-package': 'Всепогодный пакет (дворники и тент)',
      'touring-rally-kit': 'Туристический комплект надежности',
      'all-steel-body': 'Штампованный стальной кузов (закрытый)',
      'inline-4-monobloc': 'Рядный 4-цилиндровый двигатель-моноблок (24 л.с.)',
      'luxury-v8-ohv': 'Престижный двигатель V8 с верхними клапанами (65 л.с.)',
      'four-wheel-hydraulic': 'Четырехколесные гидравлические тормоза',
      'triplex-safety-package': 'Пакет безопасности (триплекс-стекло)',
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
      quarter: 'Quarter',
      quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
      month: 'Month',
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      eraPioneers: 'Pioneering Era (1900–1914)',
      eraMassProduction: 'Assembly Line Era (1915–1929)',
      eraModern: 'Modern Era',
      cash: 'Capital',
      lastProfit: 'Quarterly Profit',
      reputation: 'Reputation',
      endTurn: 'End Quarter',
      simulating: 'Simulating...',
      turnProgress: 'Turn {turn} of 504 (1900–2026)',
      setupCompanyBtn: 'Brand Passport',
      unitsQuarter: 'cars/qtr',
    },

    // Countries
    countries: {
      usa: { name: 'USA', flag: '🇺🇸', description: 'Vast rapidly expanding domestic market, focus on practicality, interchangeable parts, and mass production.' },
      germany: { name: 'Germany', flag: '🇩🇪', description: 'Birthplace of the automobile (Benz & Daimler), precision mechanical engineering, and prestige heritage.' },
      france: { name: 'France', flag: '🇫🇷', description: 'Early motor racing capital of the world, bespoke coachwork ateliers, and bold design innovation.' },
      uk: { name: 'United Kingdom', flag: '🇬🇧', description: 'Metropole of the British Empire, storied coachbuilding tradition, and rugged leaf-spring chassis.' },
    },

    // Founder Perks
    founderPerks: {
      mechanic: {
        name: 'Master Mechanic',
        badge: '🔧 Engineering',
        description: '+15% base reliability on all engineered cars; +1 month speed bonus on engine and chassis R&D projects.',
      },
      merchant: {
        name: 'Resourceful Merchant',
        badge: '💰 Commerce',
        description: '-15% wholesale discount on all market materials; +10% trading profit margin on car sales revenue.',
      },
      coachbuilder: {
        name: 'Hereditary Coachbuilder',
        badge: '👑 Prestige',
        description: '+15% comfort and prestige bonus on vehicle bodies; -25% savings on wood and leather materials.',
      },
    },

    // Powertrains & Fuels
    powertrains: {
      all: 'All Powertrains',
      ice: 'ICE (Gas / Ethanol)',
      steam: 'Steam Engine 💨',
      electric: 'Electric Traction ⚡',
    },
    fuels: {
      gasoline: 'Gasoline',
      ethanol_blend: 'Ethanol Blend (Alcohol)',
      steam_fuel: 'Coal & Water (Steam)',
      electricity: 'Storage Battery (EV)',
    },
    crankWarning: '⚠️ Manual hand-crank start: hazard of severe kickback injury, -10 comfort penalty (until Kettering electric starter in 1912)',

    // Company Setup
    companySetup: {
      title: 'Founding Your Motor Company (Year 1900)',
      subtitle: 'Forge your automotive legacy at the turn of the 20th century: select your nation, heraldic emblem, and founder specialization.',
      nameLabel: 'Company / Marque Name',
      namePlaceholder: 'e.g., Detroit Motor Carriage Works',
      countryLabel: 'Founding Nation & Home Factory',
      perkLabel: 'Founder Background & Specialization',
      badgeLabel: 'Heraldic Badge & Crest',
      badgeColor: 'Emblem Color',
      badgeShape: 'Shield Shape',
      badgeIcon: 'Heraldic Icon',
      submitBtn: 'Incorporate & Begin Era (1900 Q1)',
      reconfigureBtn: 'Brand Crest & Passport',
    },

    // Competitors
    competitors: {
      title: 'Global Automakers & Benchmarks',
      subtitle: 'Historic industrial rivals, market shares, signature vehicles, and disruptive historical turning points.',
      marketShare: 'Regional Market Share',
      activeModels: 'Competitor Lineup',
      milestonesTitle: 'Historical Milestones & Disruption',
      speedBenchmark: 'Segment Benchmark',
      price: 'Price',
      appeal: 'Appeal',
    },

    // Dashboard
    dashboard: {
      title: 'Executive Director Office',
      companyStats: 'Company Key Metrics',
      capacity: 'Factory Capacity',
      unitsMonth: 'cars/qtr',
      activeResearchCount: 'Active Research',
      latestReport: 'Previous Quarter Financial Summary',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Net Profit',
      carsSold: 'Cars Sold',
      noReport: 'First quarter is not finished yet. Click "End Quarter" above.',
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
      initialQuotaLabel: 'Initial Quarterly Production Quota',
      initialQuotaHint: 'Specify how many cars of this model your workshop should assemble quarterly (can be changed anytime in Factory & Production).',
      availableCapacity: 'Available Factory Capacity',
      unitsMonth: 'cars/qtr',
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
      capacity: 'Quarterly Capacity',
      capacityUsed: 'Capacity Utilization',
      overheadMonthly: 'Plant Overhead per Quarter',
      expandBtn: 'Expand Workshop (+4 cars/qtr)',
      upgradeCost: 'Expansion Cost',
      insufficientFunds: 'Insufficient corporate capital for factory expansion!',
      plantExpanded: 'Plant expanded! Production capacity increased.',
      linesTitle: 'Assembly Line Quota Allocation',
      noModels: 'No designed models available. First create a model in the Vehicle Designer.',
      plannedUnits: 'Production Quota (cars/qtr)',
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
      needNextMonth: 'Demand for Next Quarter',
      buyBatchBtn: 'Buy Batch',
      shortageAlert: 'Warning! Warehouse does not have sufficient materials to meet the production quota. Production will be throttled unless auto-procurement is enabled or materials are bought!',
      shortageHint: 'For uninterrupted assembly, enable Just-In-Time automated procurement below.',
      overCapacityWarning: 'Total planned production exceeds factory assembly capacity! Production will be throttled to plant ceiling.',
      historicalPlantSubtitle: 'Historical carriage manufacture and horseless carriage assembly plant',
      planSubtitle: 'Assign quarterly output quotas for models on assembly lines',
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
      title: 'Quarterly Performance Archive',
      subtitle: 'Historical ledger of corporate financials, sales and factory output.',
      noReports: 'No quarterly reports on file. Advance past the first quarter.',
      produced: 'Produced',
      sold: 'Sold',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Net Profit',
      loansPaid: 'Debt Service',
      salesByRegion: 'Sales by Region:',
      competitorNews: 'Competitor & Market Dispatches:',
    },

    // Technologies
    technologies: {
      'standardized-steering-wheel': {
        name: 'Standardized Steering Wheel',
        description: 'Improves handling consistency and driver confidence.',
      },
      'steam-condenser': {
        name: 'Closed-Loop Steam Condenser',
        description: 'Recycles boiler steam, drastically extending range without refilling water.',
      },
      'ethanol-carburetor': {
        name: 'Dual-Fuel Ethanol Carburetor',
        description: 'Enables rural motorists to fuel up on farm alcohol/ethanol before Prohibition.',
      },
      'edison-nickel-iron-battery': {
        name: 'Edison Nickel-Iron Battery',
        description: 'Durable alkaline cells offering cleaner, silent operation for early electric cars.',
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
        name: 'Kettering Electric Starter (1912)',
        description: 'Historic milestone: push-button starting, eliminating hazardous hand crank and deciding the ICE victory.',
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
      'ford-moving-assembly-line': {
        name: 'Ford Moving Assembly Line',
        description: 'Moving conveyor assembly cuts chassis build time from 12 hours to 93 minutes.',
      },
      'all-steel-closed-body': {
        name: 'All-Steel Closed Body',
        description: 'Pressed steel body eliminates structural wood decay and withstands rollovers.',
      },
      'inline-4-monobloc-engine': {
        name: 'Inline-4 Monobloc Engine',
        description: 'Cylinders cast in a single iron block improve rigidity and lower machining costs.',
      },
      'four-wheel-hydraulic-brakes': {
        name: 'Four-Wheel Hydraulic Brakes',
        description: 'Hydraulic fluid pressure delivers equal stopping power to all four wheels.',
      },
      'safety-laminated-glass': {
        name: 'Safety Laminated Glass',
        description: 'Celluloid interlayer prevents windshield shattering into dangerous shards.',
      },
      'luxury-v8-overhead-valve': {
        name: 'Luxury V8 Overhead Valve Engine',
        description: 'Smooth and whisper-quiet V8 power defines the golden age of luxury automobiles.',
      },
    } as Record<string, { name: string; description: string }>,

    // Vehicle Components
    components: {
      'ladder-frame': 'Ladder Frame (Standard)',
      'touring-frame': 'Touring Channel-Section Frame',
      'reinforced-suspension-frame': 'Reinforced Leaf-Spring Chassis',
      'reinforced-suspension': 'Reinforced Elliptical Suspension',
      'single-cylinder': 'Single-Cylinder ICE (6 hp, Hand-Crank)',
      'steam-compound-twin': 'Twin Compound Steam Engine (15 hp)',
      'electric-traction-dc': 'DC Traction Electric Motor (10 hp)',
      'ethanol-dual-engine': 'Dual-Fuel ICE (Ethanol/Gas, 8 hp)',
      'inline-four': 'Inline-Four Engine (20 hp)',
      'electric-start-v4': 'Electric-Start V4 Engine (35 hp)',
      'band-brakes': 'Mechanical Band Brakes',
      'drum-brakes': 'Reinforced Drum Brakes',
      'hydraulic-prototype-brakes': 'Prototype Hydraulic Brakes',
      'open-runabout': 'Open Runabout Body',
      'basic-cabin': 'Artisan Carriage Cabin',
      'wooden-cabin': 'Fine Hardwood Coach Cabin',
      'luxury-cabin': 'Luxury Bespoke Upholstered Cabin',
      'enclosed-limousine-cabin': 'Enclosed Limousine Cabin',
      'package-none': 'Standard Configuration (No Package)',
      'weather-package': 'All-Weather Package (Wipers & Soft Top)',
      'touring-rally-kit': 'Touring Reliability Kit',
      'all-steel-body': 'Pressed Steel Closed Body',
      'inline-4-monobloc': 'Inline-4 Monobloc Engine (24 hp)',
      'luxury-v8-ohv': 'Luxury V8 Overhead Valve Engine (65 hp)',
      'four-wheel-hydraulic': 'Four-Wheel Hydraulic Brakes',
      'triplex-safety-package': 'Safety Laminated Glass Package',
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
