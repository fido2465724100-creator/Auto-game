import { redirect } from 'next/navigation';

export default function MarketsRedirect(): never {
  redirect('/dashboard?tab=markets');
}
