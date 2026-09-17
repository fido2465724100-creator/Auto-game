'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../lib/i18n';

type GuideChapterId =
  | 'overview'
  | 'design'
  | 'production'
  | 'research'
  | 'markets'
  | 'finance'
  | 'tips'
  | 'eras';

interface GuideChapter {
  id: GuideChapterId;
  icon: string;
  titleRu: string;
  titleEn: string;
  badge?: string;
}

const CHAPTERS: GuideChapter[] = [
  { id: 'overview', icon: '🎯', titleRu: '1. Цель и основы игры', titleEn: '1. Goals & Basics' },
  { id: 'design', icon: '🚗', titleRu: '2. Конструктор и Сегменты', titleEn: '2. Design & Segments' },
  { id: 'production', icon: '🏭', titleRu: '3. Завод и Склад сырья', titleEn: '3. Factory & Warehouse' },
  { id: 'research', icon: '🔬', titleRu: '4. НИОКР и Технологии', titleEn: '4. R&D & Tech Tree' },
  { id: 'markets', icon: '🌐', titleRu: '5. Рынки и Конкуренты', titleEn: '5. Markets & Rivals' },
  { id: 'finance', icon: '🏦', titleRu: '6. Финансы, Прибыль и Займы', titleEn: '6. Finance & Loans' },
  { id: 'tips', icon: '💡', titleRu: '7. Советы новичку (1900 г.)', titleEn: '7. Beginner Tips' },
  { id: 'eras', icon: '🎨', titleRu: '8. Эпохи и Стиль (1900–2026)', titleEn: '8. Eras & Materials' },
];

interface Props {
  isModal?: boolean;
}

export default function GameGuideView({ isModal = false }: Props): React.JSX.Element {
  const { lang } = useLanguage();
  const [activeChapter, setActiveChapter] = useState<GuideChapterId>('overview');

  return (
    <div className="space-y-4">
      {/* HEADER BANNER (ONLY IN STANDALONE TAB) */}
      {!isModal && (
        <div className="rounded-xl border border-amber-900/30 bg-[var(--paper)] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <h2 className="font-serif text-2xl font-bold text-amber-950">
                  {lang === 'en' ? 'Industrialist Handbook & Game Guide' : 'Справочник промышленника и Руководство по игре'}
                </h2>
              </div>
              <p className="text-xs text-stone-600 font-serif">
                {lang === 'en'
                  ? 'Comprehensive manual for managing an automobile concern from 1900 to 2026'
                  : 'Полный свод правил, формул и механик для успешного руководства автомобильным концерном (1900–2026 гг.)'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-amber-100/70 border border-amber-800/20 px-3 py-1.5 rounded-lg text-amber-900 self-start md:self-auto">
              <span>⏳ 504 хода</span>
              <span>•</span>
              <span>4 кв./год</span>
              <span>•</span>
              <span>126 лет эпохи</span>
            </div>
          </div>
        </div>
      )}

      {/* TWO COLUMNS: NAVIGATION (LEFT) & CONTENT (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* CHAPTERS MENU */}
        <aside className="md:col-span-4 rounded-xl border border-stone-300 bg-[var(--paper)] p-3 shadow-xs space-y-1 md:sticky md:top-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 py-1.5 block">
            {lang === 'en' ? 'Chapters' : 'Разделы справочника'}
          </span>
          {CHAPTERS.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapter(ch.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-serif font-bold text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base">{ch.icon}</span>
                  <span className="truncate">{lang === 'en' ? ch.titleEn : ch.titleRu}</span>
                </div>
                {isActive && <span className="text-amber-200 text-xs font-bold">→</span>}
              </button>
            );
          })}
        </aside>

        {/* CHAPTER CONTENT */}
        <main className="md:col-span-8 rounded-xl border border-stone-300 bg-[var(--paper)] p-6 shadow-sm leading-relaxed space-y-5">
          {activeChapter === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>🎯</span>
                <span>Цель и основы управления (1900–2026)</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <p>
                  Вы начинаете в <strong>1900 году</strong> в роли смелого инженера-фабриканта в эпоху зарождения
                  мирового автопрома. В вашем распоряжении — кустарная мануфактура со скромным выпуском в 
                  <strong> 2–4 автомобиля в квартал</strong> (10–16 машин в год) и начальный капитал <strong>$14 000</strong>.
                </p>

                <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-3 space-y-1.5 text-amber-950">
                  <span className="font-bold block">Ключевой временной темп: Поквартальный ход (Q1–Q4)</span>
                  <p className="text-[11px] text-stone-700">
                    Один клик кнопки <strong>«Завершить квартал»</strong> переводит время ровно на 3 месяца вперед. В году 4 квартала. 
                    Всего в игре <strong>504 хода</strong> (1900–2026 гг.). Такой темп идеально совпадает с финансовой отчетностью P&L, 
                    поставками сырья и сезонными колебаниями спроса.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded border border-emerald-300 bg-emerald-50/50 p-3">
                    <span className="font-bold text-emerald-900 block mb-1">🏆 Условия триумфа:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-700">
                      <li>Превратить кустарную мануфактуру в глобальный транснациональный концерн.</li>
                      <li>Завоевать лидирующие доли на рынках США, Европы и Востока.</li>
                      <li>Обогнать исторических гигантов (<em>Fort, Mercer-Benz, Renard</em>).</li>
                      <li>Сохранить безупречную репутацию бренда и высокую капитализацию к 2026 году.</li>
                    </ul>
                  </div>

                  <div className="rounded border border-red-300 bg-red-50/50 p-3">
                    <span className="font-bold text-red-900 block mb-1">⚠️ Условия банкротства:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-700">
                      <li>Кассовый разрыв, когда долги превышают все кредитные лимиты банков.</li>
                      <li>Длительный выпуск нерентабельных моделей с отрицательной маржой.</li>
                      <li>Остановка сборочных линий из-за дефицита базового сырья.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'design' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>🚗</span>
                <span>Конструктор и Сегменты автомобилей</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <p>
                  В разделе <strong>«Конструктор моделей»</strong> вы создаете чертежи экипажей, комбинируя 5 категорий узлов: 
                  <strong> Шасси, Двигатель, Тормозная система, Кузов/Салон и Оснащение</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="rounded border border-stone-300 bg-stone-50/60 p-2.5">
                    <span className="font-bold text-amber-950 block">🚲 Эконом (Runabout)</span>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Массовый спрос, чувствителен к цене. Базовая цена ~$900. Главное — доступность и простота сборки.
                    </p>
                  </div>
                  <div className="rounded border border-stone-300 bg-stone-50/60 p-2.5">
                    <span className="font-bold text-amber-950 block">👨‍👩‍👧 Семейный (Tourer / Турер)</span>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Вместительный открытый или закрытый экипаж для среднего класса. Важен баланс комфорта и надежности.
                    </p>
                  </div>
                  <div className="rounded border border-stone-300 bg-stone-50/60 p-2.5">
                    <span className="font-bold text-amber-950 block">👑 Представительский (Люкс)</span>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Аристократы и богачи требуют отделку кожей, дерево благородных пород и престиж. Базовая цена $2 500+.
                    </p>
                  </div>
                  <div className="rounded border border-stone-300 bg-stone-50/60 p-2.5">
                    <span className="font-bold text-amber-950 block">🚚 Коммерческий (Фургон)</span>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Торговцы и почтовые службы ценят грузоподъемность и безотказность. Низкая требовательность к престижу.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-3 space-y-2">
                  <span className="font-bold text-amber-950 block">Три противоборствующие силовые установки:</span>
                  <div className="space-y-1.5 text-[11px] text-stone-700">
                    <div>
                      <strong>💨 Паровые котлы (Steam):</strong> Мощная тяга с малых оборотов, дешевые детали, всеядность. Но котел тяжелый, требует воды и сложен в управлении.
                    </div>
                    <div>
                      <strong>⚡ Электромоторы (Electric):</strong> Бесшумный, чистый ход, мгновенный старт без ручки! Но свинцовые батареи 1900 года тяжелые и дорогие. В 2020-х электротяга вернет трон.
                    </div>
                    <div>
                      <strong>⛽ ДВС (Бензин):</strong> Лучший компромисс по весу и запасу хода. Будущее отрасли!
                    </div>
                  </div>
                </div>

                <div className="rounded border border-amber-300 bg-amber-50/60 p-2.5 text-[11px] text-amber-900">
                  <strong>⚠️ Исторический штраф «Кривого стартера» (до 1912 года):</strong> Бензиновые двигатели 
                  требуют физической силы для запуска рукояткой (риск перелома запястья при обратной отдаче). До открытия 
                  <em>«Электрического стартера»</em> бензиновые машины теряют часть спроса среди женщин и врачей.
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'production' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>🏭</span>
                <span>Завод, Квоты сборки и Склад сырья</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <p>
                  Каждое производство ограничено <strong>мощностью цеха (Capacity)</strong>. В 1900 году это 4 автомобиля в квартал. 
                  На вкладке «Кабинет» или «Завод» вы задаете квоты сборки для каждой спроектированной модели.
                </p>

                <div className="rounded border border-stone-300 bg-stone-50 p-3 space-y-1.5">
                  <span className="font-bold text-amber-950 block">6 базовых материалов производства:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <strong>⚙️ Сталь и чугун</strong> ($25/кг)
                      <span className="text-[10px] text-stone-500 block">Блоки моторов, рамы, оси</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <strong>🪵 Древесина</strong> ($15/ед.)
                      <span className="text-[10px] text-stone-500 block">Каретные кузова, спицы колес</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <strong>🛞 Каучук</strong> ($45/ед.)
                      <span className="text-[10px] text-stone-500 block">Пневматические шины</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <strong>🛋️ Кожа</strong> ($60/ед.)
                      <span className="text-[10px] text-stone-500 block">Диваны, тенты кабриолетов</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <strong>✈️ Алюминий</strong> ($80/ед.)
                      <span className="text-[10px] text-stone-500 block">Облегченные поршни и картеры</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <strong>🧪 Пластик</strong> ($35/ед.)
                      <span className="text-[10px] text-stone-500 block">Бакелит, смолы, панели</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-950 space-y-1">
                  <span className="font-bold block">💡 Переключатель «Автозакупка сырья»:</span>
                  <p className="text-[11px] text-stone-700">
                    Рекомендуется держать включенным! Перед началом квартала система автоматически подсчитает расход 
                    деталей под ваши квоты и докупит недостающие материалы по рыночной цене, предотвращая простой сборочных линий.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'research' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>🔬</span>
                <span>Лаборатория НИОКР и Технологическое древо</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <p>
                  Технологии определяют, какие узлы доступны в Конструкторе и насколько эффективен ваш завод. 
                  Инженеры ведут исследования поквартально с настраиваемым бюджетом (по умолчанию <strong>$300 / квартал</strong> или $100 / месяц).
                </p>

                <div className="space-y-2">
                  <span className="font-bold text-stone-900 block">Исторические прорывы 1900–1930 гг.:</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <span><strong>Стандартное рулевое колесо</strong> (1900)</span>
                      <span className="text-stone-500">Заменяет рычаг-румпель</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <span><strong>Электрический стартер</strong> (1912)</span>
                      <span className="text-stone-500">Снимает штраф кривого стартера</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <span><strong>Движущийся конвейер Форда</strong> (1916)</span>
                      <span className="text-stone-500">Снижает себестоимость сборки на 40%</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <span><strong>Цельнометаллический кузов</strong> (1920)</span>
                      <span className="text-stone-500">Отказ от гниющего деревянного каркаса</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <span><strong>Гидравлические тормоза на 4 колеса</strong> (1924)</span>
                      <span className="text-stone-500">Резко повышает безопасность и комфорт</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <span><strong>Безопасное стекло Триплекс</strong> (1926)</span>
                      <span className="text-stone-500">Защита пассажиров от осколков</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 flex justify-between items-center">
                      <span><strong>Двигатель V8 высокой мощности</strong> (1928)</span>
                      <span className="text-stone-500">Мощь и плавность для люксовых экипажей</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'markets' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>🌐</span>
                <span>Рынки сбыта, Дилеры и Конкуренты</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <p>
                  В игре смоделированы три макрорегиона со своими дорожными условиями и вкусами:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="rounded border border-stone-300 bg-stone-50 p-2.5">
                    <strong>🇺🇸 Северная Америка</strong>
                    <p className="text-stone-600 mt-1">Огромные расстояния, грунтовые тракты. Высокий спрос на надежность и мощность.</p>
                  </div>
                  <div className="rounded border border-stone-300 bg-stone-50 p-2.5">
                    <strong>🇪🇺 Европа</strong>
                    <p className="text-stone-600 mt-1">Узкие мощеные улочки городов, высокие пошлины на бензин. Ценятся компактность и экономия.</p>
                  </div>
                  <div className="rounded border border-stone-300 bg-stone-50 p-2.5">
                    <strong>🌍 Ближний Восток</strong>
                    <p className="text-stone-600 mt-1">Жара, песок, отсутствие мощеных дорог. Экстремальные требования к охлаждению и подвеске.</p>
                  </div>
                </div>

                <div className="rounded-lg bg-stone-100 border border-stone-300 p-3 space-y-1 text-stone-800">
                  <span className="font-bold block text-amber-950">Исторические ориентиры-конкуренты:</span>
                  <p className="text-[11px] text-stone-600">
                    Вы соревнуетесь не с безымянными ботами, а с пародийными легендами: <em>Fort Motor Co.</em>, 
                    <em>Mercer-Benz</em>, <em>Renard</em>, <em>Morris-Austin</em>, <em>Toyoda</em>. 
                    Например, появление <strong>Fort Model T в 1908 году</strong> сбивает среднюю рыночную цену вдвое. 
                    Готовьтесь отвечать конвейерной сборкой или уходом в престижные ниши!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'finance' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>🏦</span>
                <span>Финансы, Расчет прибыли и Кредиты</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-3 font-mono text-[11px] space-y-1">
                  <span className="font-bold text-amber-950 block font-serif text-xs">Формула квартальной прибыли (P&L):</span>
                  <div className="text-stone-800 font-bold">
                    Прибыль = Выручка от продаж − Себестоимость сборки − Накладные цеха и конторы ($270/кв.) − НИОКР ($300/кв.) − Кредиты
                  </div>
                </div>

                <div className="space-y-2 text-[11px] text-stone-700">
                  <div className="p-2.5 rounded bg-emerald-50/80 border border-emerald-300 text-emerald-950 space-y-1">
                    <span className="font-bold block font-serif text-xs">🟢 Как стабильно выходить в плюс:</span>
                    <ul className="list-disc list-inside space-y-1 text-stone-700">
                      <li>
                        <strong>Наценка на модель (+40–50% к себестоимости):</strong> Если автомобиль обходится заводу в $500, ставьте отпускную цену $750–$850. Чистая маржа с одной машины составит $250–$350.
                      </li>
                      <li>
                        <strong>Загрузка мастерской (3–4 авто в квартал):</strong> При выпуске 3 авто валовая маржа составит ~$900, что полностью окупает содержание цеха ($270/кв.) и лабораторию ($300/кв.), принося <strong>+$330 чистой прибыли</strong>. При выпуске 4 авто чистая прибыль превысит <strong>+$600 за квартал</strong>!
                      </li>
                      <li>
                        <strong>Не раздувайте бюджет лаборатории на старте:</strong> Оставляйте стандартные $100/мес. ($300/кв.), пока обороты не вырастут.
                      </li>
                    </ul>
                  </div>

                  <p>
                    <strong>Почему в первый ход баланс может оказаться с минусом?</strong><br />
                    Если завод выпустил 3 машины, но рынок временно выкупил только 1–2, выручка поступит только за проданные. 
                    Непроданные машины <strong>не пропадают</strong> — они остаются на складе готовой продукции и будут проданы в следующем квартале! 
                  </p>

                  <p>
                    <strong>Банковский овердрафт при дефиците:</strong><br />
                    Вам больше не нужно бояться случайного минуса! Если касса уходит в минус из-за закупки сырья, 
                    банк автоматически предоставит <em>Кредитную линию овердрафта</em> с посильными ежемесячными взносами, 
                    позволяя без остановки продолжить развитие концерна.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'tips' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>💡</span>
                <span>Пошаговые советы новичку (Первые 10 лет: 1900–1910)</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <ol className="list-decimal list-inside space-y-2 text-[11px]">
                  <li className="p-2 rounded bg-amber-50/60 border border-amber-200/80">
                    <strong>Шаг 1: Не завышайте квоты выпуска выше лимита!</strong><br />
                    В начале цех вмещает 4 авто в квартал. Установите квоту для <em>Model A Runabout</em> на 2–3 авто. Это исключит штрафы за перегруз.
                  </li>
                  <li className="p-2 rounded bg-amber-50/60 border border-amber-200/80">
                    <strong>Шаг 2: Держите автозакупку сырья включенной.</strong><br />
                    Если на складе не хватит даже 5 единиц кожи или 12 единиц каучука, сборка встанет. Снабженец сделает это за вас.
                  </li>
                  <li className="p-2 rounded bg-amber-50/60 border border-amber-200/80">
                    <strong>Шаг 3: Начните первое исследование.</strong><br />
                    Откройте Лабораторию и запустите <em>«Механический тормоз»</em> или <em>«Улучшенный карбюратор»</em>.
                  </li>
                  <li className="p-2 rounded bg-amber-50/60 border border-amber-200/80">
                    <strong>Шаг 4: Нажмите «Завершить квартал».</strong><br />
                    Прочтите «Промышленный Вестник», оцените продажи и прибыль. При стабильном сбыте спроектируйте вторую модель — семейный <em>Tourer</em> или <em>Фургон</em>!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeChapter === 'eras' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-amber-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span>🎨</span>
                <span>Эпохи и Материалы оформления (1900–2026)</span>
              </h3>

              <div className="space-y-3 text-xs text-stone-800">
                <p>
                  Интерфейс игры динамически эволюционирует вместе с промышленной историей. Каждые 10–20 лет меняются материалы отделки:
                </p>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded border border-amber-900/20 bg-amber-50/70 flex items-center justify-between">
                    <span><strong>1900–1919: Эпоха пара и первопроходцев</strong></span>
                    <span className="text-stone-600">🪵 Мореный дуб, чеканная латунь, пергамент</span>
                  </div>
                  <div className="p-2 rounded border border-slate-400 bg-slate-100/70 flex items-center justify-between">
                    <span><strong>1920–1939: Ревущие двадцатые и Ар-деко</strong></span>
                    <span className="text-stone-600">⚙️ Полированная сталь, хром, черный лак</span>
                  </div>
                  <div className="p-2 rounded border border-stone-300 bg-stone-100/80 flex items-center justify-between">
                    <span><strong>1940–1959: Послевоенный бум и Аэростиль</strong></span>
                    <span className="text-stone-600">🚀 Бакелит, слоновая кость, массивный хром</span>
                  </div>
                  <div className="p-2 rounded border border-amber-500/30 bg-neutral-900/10 flex items-center justify-between">
                    <span><strong>1960–1979: Мускул-кары и винил</strong></span>
                    <span className="text-stone-600">🏎️ Перфорированный винил, алюминий, янтарный свет</span>
                  </div>
                  <div className="p-2 rounded border border-emerald-500/30 bg-neutral-900/20 flex items-center justify-between">
                    <span><strong>1980–1999: Цифровой век и полимеры</strong></span>
                    <span className="text-stone-600">📟 Формованный ABS-пластик, зеленые VFD-индикаторы</span>
                  </div>
                  <div className="p-2 rounded border border-blue-400/30 bg-slate-50 flex items-center justify-between">
                    <span><strong>2000–2019: Миллениум и стекломорфизм</strong></span>
                    <span className="text-stone-600">💎 Анодированный алюминий, матовое стекло, синий металл</span>
                  </div>
                  <div className="p-2 rounded border border-cyan-400/30 bg-neutral-950/20 flex items-center justify-between">
                    <span><strong>2020+: Карбон, Неон и Электротяга</strong></span>
                    <span className="text-stone-600">⚡ Углеволокно (карбон), глубокий OLED, неоновый циан</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
