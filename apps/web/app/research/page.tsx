'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

type TechnologyWithStatus = Awaited<ReturnType<typeof api.getTechnologies>>[number];

export default function ResearchPage(): JSX.Element {
  const [techs, setTechs] = useState<TechnologyWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = (): void => {
    api.getTechnologies().then(setTechs).catch((e) => setError(String(e)));
  };

  useEffect(load, []);

  const startResearch = async (technologyId: string): Promise<void> => {
    await api.startResearch(technologyId, 2000);
    load();
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Research & Development</h2>
      {error ? <p>{error}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {techs.map((tech) => (
          <article key={tech.id} className="rounded border border-stone-300 bg-[var(--paper)] p-4">
            <h3 className="font-semibold">{tech.name}</h3>
            <p className="text-sm">Year: {tech.yearAvailable}</p>
            <p className="text-sm">Status: {tech.status}</p>
            <p className="my-2 text-sm">{tech.description}</p>
            {tech.status === 'available' ? (
              <button
                type="button"
                onClick={() => void startResearch(tech.id)}
                className="rounded bg-[var(--accent)] px-3 py-2 text-white"
              >
                Start Research
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
