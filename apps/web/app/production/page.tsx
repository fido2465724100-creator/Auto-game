import { redirect } from 'next/navigation';

export default function ProductionRedirect(): never {
  redirect('/dashboard?tab=production');
}
