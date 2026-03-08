'use client';

import { useEffect, useState } from 'react';
import type { Region } from '@ait/shared-types';
import { api } from '../../lib/api';

export default function MarketsPage(): JSX.Element {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    api.getRegions().then(setRegions).catch(() => setRegions([]));
  }, []);

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Markets</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {regions.map((region) => (
          <article key={region.id} className="rounded border border-stone-300 bg-[var(--paper)] p-4">
            <h3 className="font-semibold">{region.name}</h3>
            <p className="text-sm">Market size: {region.marketSize}</p>
            <p className="text-sm">Price sensitivity: {region.priceSensitivity}</p>
            <p className="text-sm">Prestige sensitivity: {region.prestigeSensitivity}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
