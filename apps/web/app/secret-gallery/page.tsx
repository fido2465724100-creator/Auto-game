'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { VehicleSegment } from '@ait/shared-types';
import { getDecadeName } from '../../components/CarVisualThumbnail';

interface CarItem {
  segment: VehicleSegment;
  decade: number;
  decadeName: string;
  yearRange: string;
  title: string;
  description: string;
  fileName: string;
}

const DECADES = [
  { decade: 0, yearRange: '1900–1909', era: '1900s • Horseless Carriage', desc: 'Первые безлошадные самоходные экипажи, открытые коляски, массивные колеса со спицами и латунная оптика.' },
  { decade: 1, yearRange: '1910–1919', era: '1910s • Brass Torpedo', desc: 'Латунная эра, появление закрытых кабин, электрических фар и торпедообразных обтекаемых капотов.' },
  { decade: 2, yearRange: '1920–1929', era: '1920s • Roaring Twenties', desc: 'Бурные двадцатые: классические ступенчатые крылья, длинные капоты с вертикальными радиаторами и роскошные спицованные диски.' },
  { decade: 3, yearRange: '1930–1939', era: '1930s • Art Deco Streamline', desc: 'Эпоха Арт-Деко: каплевидные крылья, хромированные решетки-водопады, обтекаемые фары-пули и кузова фастбэк.' },
  { decade: 4, yearRange: '1940–1949', era: '1940s • Post-War Ponton', desc: 'Послевоенный понтонный дизайн: крылья сливаются с боковинами кузова, монолитные формы и надежные бамперы.' },
  { decade: 5, yearRange: '1950–1959', era: '1950s • Jet-Age Tailfins', desc: 'Аэрокосмический стиль: хвостовые плавники-кили, обильный хром, панорамные ветровые стекла и белые полосы на шинах.' },
  { decade: 6, yearRange: '1960–1969', era: '1960s • Muscle & Coke-Bottle', desc: 'Стиль бутылки Кока-Колы: динамичные мускулистые изгибы задних крыльев, хромированные молдинги и спортивный силуэт.' },
  { decade: 7, yearRange: '1970–1979', era: '1970s • Malaise & Impact Bumpers', desc: 'Эпоха массивных энергопоглощающих бамперов, виниловых крыш, угловатых линий и аутентичных микроавтобусов.' },
  { decade: 8, yearRange: '1980–1989', era: '1980s • Wedge & Turbo Origami', desc: 'Клиновидный техно-дизайн: квадратные фары, аэродинамические колпаки, строгие грани и первые семейные минивэны.' },
  { decade: 9, yearRange: '1990–1999', era: '1990s • Biodesign Fluidity', desc: 'Биодизайн: плавные органические линии, округлая оптика, обтекаемые каплевидные формы и тихие комфортные салоны.' },
  { decade: 10, yearRange: '2000–2009', era: '2000s • New Edge & Clear Optics', desc: 'Грани New Edge: пересечение резких линий и плавных дуг, прозрачная оптика под гладким поликарбонатом.' },
  { decade: 11, yearRange: '2010–2019', era: '2010s • Kinetic Sculpting & LED', desc: 'Кинетический дизайн: рельефные выштамповки, хищные светодиодные фары DRL и сложные решетки радиатора.' },
  { decade: 12, yearRange: '2020–2026+', era: '2020s • Electric Cyber Horizon', desc: 'Эпоха электромобилей: цельные светодиодные полосы во всю ширину, скрытые ручки, ультра-минимализм и футуризм.' },
];

const SEGMENTS: { key: VehicleSegment; nameRu: string; icon: string; role: string; color: string }[] = [
  { key: 'economy', nameRu: 'Економічний (Компакт)', icon: '👥', role: 'Малолитражки, городские хэтчбеки и компактные купе', color: 'from-amber-600/30 to-red-600/30 border-red-500/50' },
  { key: 'family', nameRu: 'Сімейний (Мікроавтобус / Мінівен)', icon: '🏠', role: 'Вместительные пассажирские микроавтобусы и MPV на 6–8 мест', color: 'from-blue-600/30 to-cyan-600/30 border-cyan-500/50' },
  { key: 'luxury', nameRu: 'Люкс (Представницький)', icon: '👑', role: 'Престижные флагманские седаны и роскошные гран-туризмо', color: 'from-purple-600/30 to-indigo-600/30 border-purple-500/50' },
  { key: 'utility', nameRu: 'Вантажний (Пікап / Трак)', icon: '🚚', role: 'Надежные коммерческие пикапы, бортовые грузовики и рабочие шасси', color: 'from-amber-700/30 to-yellow-600/30 border-amber-600/50' },
];

export default function SecretGalleryPage(): React.JSX.Element {
  const [selectedSegment, setSelectedSegment] = useState<VehicleSegment | 'all'>('all');
  const [selectedDecade, setSelectedDecade] = useState<number | 'all'>('all');
  const [lightboxCar, setLightboxCar] = useState<CarItem | null>(null);

  const base =
    process.env.NEXT_PUBLIC_BASE_PATH ||
    (process.env.GITHUB_PAGES === 'true' ? '/Auto-game' : '') ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/Auto-game') ? '/Auto-game' : '');

  // Generate 52 cars list
  const allCars: CarItem[] = [];
  for (const dec of DECADES) {
    for (const seg of SEGMENTS) {
      allCars.push({
        segment: seg.key,
        decade: dec.decade,
        decadeName: dec.era,
        yearRange: dec.yearRange,
        title: `${seg.nameRu} • ${dec.yearRange}`,
        description: `${dec.desc} ${seg.role}.`,
        fileName: `${seg.key}-d${dec.decade}.jpg`,
      });
    }
  }

  const filteredCars = allCars.filter((car) => {
    if (selectedSegment !== 'all' && car.segment !== selectedSegment) return false;
    if (selectedDecade !== 'all' && car.decade !== selectedDecade) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Banner & Navigation */}
      <header className="max-w-7xl mx-auto border-b border-stone-800 pb-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                🔒 SECRET SHOWROOM
              </span>
              <span className="text-xs text-stone-400 font-mono">
                52 / 52 модели • 13 десятилетий (1900–2026+)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-100 tracking-tight font-serif flex items-center gap-3">
              <span>🏛️</span>
              <span className="bg-gradient-to-r from-amber-200 via-stone-100 to-amber-300 bg-clip-text text-transparent">
                Секретная галерея всех моделей авто
              </span>
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-3xl">
              Полный каталог всех 52 уникальных автомобилей игры в едином мраморном шоуруме. 
              Отсортированы по эпохам и классам. Нажмите на любое авто для детального просмотра.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>←</span>
              <span>В игру</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 space-y-3">
          {/* Segment Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono mr-1">
              Класс:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSegment('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                selectedSegment === 'all'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-extrabold'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              Все классы (52)
            </button>
            {SEGMENTS.map((seg) => {
              const isSelected = selectedSegment === seg.key;
              return (
                <button
                  type="button"
                  key={seg.key}
                  onClick={() => setSelectedSegment(seg.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-extrabold'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <span>{seg.icon}</span>
                  <span>{seg.nameRu.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Decade Filter Quick Jump */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono mr-1">
              Эпоха:
            </span>
            <button
              type="button"
              onClick={() => setSelectedDecade('all')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer border ${
                selectedDecade === 'all'
                  ? 'bg-stone-100 text-stone-950 border-white font-bold'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              Все (1900–2026)
            </button>
            {DECADES.map((d) => {
              const isSelected = selectedDecade === d.decade;
              return (
                <button
                  type="button"
                  key={d.decade}
                  onClick={() => setSelectedDecade(d.decade)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer border ${
                    isSelected
                      ? 'bg-stone-100 text-stone-950 border-white font-bold'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  {d.yearRange.split('–')[0]}s
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content: Grouped by Decade */}
      <main className="max-w-7xl mx-auto space-y-12">
        {DECADES.filter((d) => selectedDecade === 'all' || selectedDecade === d.decade).map((dec) => {
          const carsInDecade = filteredCars.filter((c) => c.decade === dec.decade);
          if (carsInDecade.length === 0) return null;

          return (
            <section key={dec.decade} className="space-y-4">
              {/* Decade Header */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-800 pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                    {dec.yearRange}
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="text-base sm:text-lg font-bold text-stone-200 font-serif">
                    {dec.era}
                  </span>
                </div>
                <span className="text-xs text-stone-400 max-w-xl text-right hidden md:block italic">
                  {dec.desc}
                </span>
              </div>

              {/* 4 Cards Grid for this Decade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {carsInDecade.map((car) => {
                  const segInfo = SEGMENTS.find((s) => s.key === car.segment);
                  const photoUrl = `${base}/cars/${car.fileName}`;

                  return (
                    <div
                      key={car.fileName}
                      onClick={() => setLightboxCar(car)}
                      className="group rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden hover:border-amber-500/70 transition-all duration-300 shadow-xl hover:shadow-amber-500/10 flex flex-col cursor-pointer"
                    >
                      {/* Photo Container */}
                      <div className="relative w-full h-48 bg-stone-950 overflow-hidden flex items-center justify-center">
                        {/* Vignette */}
                        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 z-1 pointer-events-none" />

                        {/* Top Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-mono font-bold">
                          <span>{segInfo?.icon}</span>
                          <span className="text-amber-400">{car.segment.toUpperCase()}</span>
                          <span className="text-stone-500">•</span>
                          <span className="text-stone-300">{car.yearRange}</span>
                        </div>

                        {/* File Name Tag */}
                        <div className="absolute bottom-2 right-2 z-10 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-stone-400 border border-white/5 opacity-0 group-hover:opacity-100 transition">
                          {car.fileName}
                        </div>

                        {/* Car Image */}
                        <img
                          src={photoUrl}
                          alt={car.title}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Content Card Body */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-sm text-stone-100 group-hover:text-amber-300 transition flex items-center gap-1.5">
                              <span>{segInfo?.icon}</span>
                              <span>{segInfo?.nameRu.split(' ')[0]}</span>
                            </h3>
                            <span className="text-[10px] font-mono text-stone-500">
                              d{car.decade}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                            {segInfo?.role}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-stone-400">
                          <span className="text-stone-500">{car.yearRange}</span>
                          <span className="text-amber-400/90 group-hover:underline">Увеличить 🔍</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Lightbox Modal */}
      {lightboxCar && (
        <div
          onClick={() => setLightboxCar(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxCar(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-stone-200 border border-white/20 flex items-center justify-center text-lg font-bold cursor-pointer transition"
            >
              ✕
            </button>

            {/* High-res Image */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] bg-stone-950 flex items-center justify-center overflow-hidden">
              <img
                src={`${base}/cars/${lightboxCar.fileName}`}
                alt={lightboxCar.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Lightbox Footer Details */}
            <div className="p-6 bg-stone-900 border-t border-stone-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {SEGMENTS.find((s) => s.key === lightboxCar.segment)?.icon}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100 font-serif">
                      {lightboxCar.title}
                    </h2>
                  </div>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    {lightboxCar.decadeName} • Файл: <span className="text-stone-200">/cars/{lightboxCar.fileName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold era-badge-accent font-mono">
                    {lightboxCar.segment.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed">
                {lightboxCar.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
