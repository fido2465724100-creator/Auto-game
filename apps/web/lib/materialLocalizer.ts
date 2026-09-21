import type { MaterialType } from '@ait/shared-types';
import type { TranslationSchema } from './locales/ru';

/**
 * Returns the era-appropriate localized name for a given raw material.
 * - rubber evolves from Natural Caoutchouc to Synthetic Rubber & Tires around 1940 (WWII breakthrough)
 * - wood transitions from Structural Wood to Decorative Wood & Veneer around 1935 (unibody / steel stamping)
 * - steel evolves from Cast Iron/Steel to Automotive Sheet Steel around 1930
 */
export function getMaterialDisplayName(
  mat: MaterialType,
  year: number,
  t: TranslationSchema
): string {
  if (mat === 'rubber') {
    return year >= 1940 ? t.materials.rubberModern : t.materials.rubber;
  }
  if (mat === 'wood') {
    return year >= 1935 ? t.materials.woodModern : t.materials.wood;
  }
  if (mat === 'steel') {
    return year >= 1930 ? t.materials.steelModern : t.materials.steel;
  }
  return (t.materials as unknown as Record<string, string>)[mat] ?? mat;
}

/**
 * Returns the era-appropriate description explaining the industrial role of each material.
 */
export function getMaterialDescription(
  mat: MaterialType,
  year: number,
  t: TranslationSchema,
  fallback?: string
): string {
  const desc = t.materials.descriptions;
  if (mat === 'rubber') {
    return year >= 1940 ? desc.rubberModern : desc.rubberEarly;
  }
  if (mat === 'wood') {
    return year >= 1935 ? desc.woodModern : desc.woodEarly;
  }
  if (mat === 'steel') {
    return year >= 1930 ? desc.steelModern : desc.steelEarly;
  }
  if (mat === 'leather') {
    return desc.leather;
  }
  if (mat === 'aluminum') {
    return desc.aluminum;
  }
  if (mat === 'plastic') {
    return desc.plastic;
  }
  return fallback ?? '';
}
