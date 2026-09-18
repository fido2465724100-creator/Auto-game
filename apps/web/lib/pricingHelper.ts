export type PriceEvaluationStatus = 'loss' | 'bargain' | 'optimal' | 'high' | 'prohibitive';

export interface PriceEvaluation {
  status: PriceEvaluationStatus;
  shortLabel: string;
  detail: string;
  badgeClass: string;
  priceRatio: number;
}

export function evaluateVehiclePrice(
  salePrice: number,
  productionCost: number,
  recommendedPrice: number,
  lang: string = 'ru'
): PriceEvaluation {
  const safeSalePrice = Number(salePrice) || 0;
  const safeCost = Number(productionCost) || 0;
  const safeRecPrice = Number(recommendedPrice) || Math.max(1, safeCost * 1.3);

  // Check if below cost (loss)
  if (safeSalePrice < safeCost) {
    const lossAmount = safeCost - safeSalePrice;
    return {
      status: 'loss',
      shortLabel:
        lang === 'en'
          ? '⛔ Loss-making'
          : lang === 'uk'
          ? '⛔ Збиткова ціна'
          : lang === 'de'
          ? '⛔ Verlustpreis'
          : '⛔ Ниже себестоимости',
      detail:
        lang === 'en'
          ? `Direct loss -$${lossAmount.toLocaleString()} per unit! Below production cost ($${safeCost.toLocaleString()}).`
          : lang === 'uk'
          ? `Прямий збиток -$${lossAmount.toLocaleString()} з кожного авто! Нижче собівартості ($${safeCost.toLocaleString()}).`
          : lang === 'de'
          ? `Direkter Verlust -$${lossAmount.toLocaleString()} pro Fahrzeug! Unter Selbstkosten ($${safeCost.toLocaleString()}).`
          : `Прямой убыток -$${lossAmount.toLocaleString()} с каждого авто! Ниже себестоимости ($${safeCost.toLocaleString()}).`,
      badgeClass: 'bg-rose-950/60 text-rose-300 border border-rose-600/70',
      priceRatio: safeSalePrice / (safeRecPrice || 1),
    };
  }

  const ratio = safeSalePrice / (safeRecPrice || 1);

  if (ratio <= 0.88) {
    return {
      status: 'bargain',
      shortLabel:
        lang === 'en'
          ? '🟢 Bargain Deal'
          : lang === 'uk'
          ? '🟢 Вигідна знижка'
          : lang === 'de'
          ? '🟢 Schnäppchen'
          : '🟢 Выгодная цена',
      detail:
        lang === 'en'
          ? 'High market demand (+15–35% sales boost), but lower profit margin per car.'
          : lang === 'uk'
          ? 'Підвищений попит (+15–35% продажів), але менший прибуток з одного авто.'
          : lang === 'de'
          ? 'Hohe Nachfrage (+15–35% Absatz), aber geringere Marge pro Fahrzeug.'
          : 'Высокий спрос (+15–35% к продажам), но пониженная прибыль с одного авто.',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/70',
      priceRatio: ratio,
    };
  }

  if (ratio <= 1.15) {
    return {
      status: 'optimal',
      shortLabel:
        lang === 'en'
          ? '🟢 Optimal Price'
          : lang === 'uk'
          ? '🟢 Оптимальна ціна'
          : lang === 'de'
          ? '🟢 Optimaler Preis'
          : '🟢 Оптимальная цена',
      detail:
        lang === 'en'
          ? 'Healthy market demand and solid profit margins.'
          : lang === 'uk'
          ? 'Здоровий баланс ринкового попиту та солідної маржі.'
          : lang === 'de'
          ? 'Ausgewogene Nachfrage und solide Gewinnspanne.'
          : 'Идеальный баланс рыночного спроса и высокой прибыли.',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/70',
      priceRatio: ratio,
    };
  }

  if (ratio <= 1.45) {
    return {
      status: 'high',
      shortLabel:
        lang === 'en'
          ? '🟡 High Price'
          : lang === 'uk'
          ? '🟡 Висока ціна'
          : lang === 'de'
          ? '🟡 Hoher Preis'
          : '🟡 Высокая цена',
      detail:
        lang === 'en'
          ? `Demand will drop by 20–45% compared to rec. price ($${safeRecPrice.toLocaleString()}).`
          : lang === 'uk'
          ? `Попит впаде на 20–45% у порівнянні з рек. ціною ($${safeRecPrice.toLocaleString()}).`
          : lang === 'de'
          ? `Nachfrage sinkt um 20–45% im Vergleich zum empf. Preis ($${safeRecPrice.toLocaleString()}).`
          : `Спрос покупателей упадет на 20–45% относительно рек. цены ($${safeRecPrice.toLocaleString()}).`,
      badgeClass: 'bg-amber-950/60 text-amber-300 border border-amber-600/70',
      priceRatio: ratio,
    };
  }

  return {
    status: 'prohibitive',
    shortLabel:
      lang === 'en'
        ? '🔴 Overpriced!'
        : lang === 'uk'
        ? '🔴 Завищена ціна!'
        : lang === 'de'
        ? '🔴 Stark überteuert!'
        : '🔴 Сильно завышена!',
    detail:
      lang === 'en'
        ? `Buyers will reject this price ($${safeSalePrice.toLocaleString()} vs rec. $${safeRecPrice.toLocaleString()})! Demand drops near zero, cars will sit unsold.`
        : lang === 'uk'
        ? `Покупці відмовляться купувати ($${safeSalePrice.toLocaleString()} проти рек. $${safeRecPrice.toLocaleString()})! Попит впаде майже до нуля, авто зависнуть на складі.`
        : lang === 'de'
        ? `Kunden verweigern den Kauf ($${safeSalePrice.toLocaleString()} ggü. empf. $${safeRecPrice.toLocaleString()})! Nachfrage bricht ein, Lager füllt sich.`
        : `Покупатели откажутся покупать ($${safeSalePrice.toLocaleString()} против рек. $${safeRecPrice.toLocaleString()})! Спрос упадет почти до 0, машины останутся на складе.`,
    badgeClass: 'bg-rose-950/70 text-rose-200 border border-rose-600/80 font-bold',
    priceRatio: ratio,
  };
}
