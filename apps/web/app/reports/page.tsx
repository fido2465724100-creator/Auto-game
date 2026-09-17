import { redirect } from 'next/navigation';

export default function ReportsRedirect(): never {
  redirect('/dashboard?tab=reports');
}
