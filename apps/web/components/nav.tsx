import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/research', label: 'Research' },
  { href: '/vehicle-design', label: 'Vehicle Design' },
  { href: '/markets', label: 'Markets' },
  { href: '/reports', label: 'Reports' },
];

export function Navigation(): JSX.Element {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded border border-amber-700/40 bg-[var(--paper)] px-3 py-2 text-sm hover:bg-amber-100"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
