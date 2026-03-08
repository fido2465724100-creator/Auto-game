'use client';

import { useState } from 'react';
import type { VehicleModel } from '@ait/shared-types';
import { api } from '../../lib/api';

const draftModel: VehicleModel = {
  id: 'model-b',
  name: 'Model B',
  targetSegment: 'family',
  regionSuitability: {
    'north-america': 0.85,
    europe: 0.75,
    'middle-east': 0.55,
  },
  components: {
    chassis: 'touring-frame',
    engine: 'inline-four',
    brakes: 'drum-brakes',
    comfort: 'basic-cabin',
    package: 'weather-package',
  },
  stats: {
    reliability: 58,
    comfort: 44,
    performance: 46,
    efficiency: 40,
    prestige: 30,
    complexity: 32,
  },
  productionCost: 980,
  salePrice: 1700,
  active: true,
};

export default function VehicleDesignPage(): JSX.Element {
  const [message, setMessage] = useState('');

  const save = async (): Promise<void> => {
    await api.saveVehicleModel(draftModel);
    setMessage('Model B saved to backend state.');
  };

  return (
    <section className="space-y-3 rounded border border-stone-300 bg-[var(--paper)] p-4">
      <h2 className="text-xl font-semibold">Vehicle Design</h2>
      <p>
        Minimal MVP action: save prepared vehicle draft to backend. TODO: add interactive builder from component seed.
      </p>
      <button type="button" onClick={() => void save()} className="rounded bg-[var(--accent)] px-3 py-2 text-white">
        Save Draft Model B
      </button>
      {message ? <p className="text-sm">{message}</p> : null}
    </section>
  );
}
