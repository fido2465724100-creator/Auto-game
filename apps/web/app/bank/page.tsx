import { redirect } from 'next/navigation';

export default function BankRedirect(): never {
  redirect('/dashboard?tab=bank');
}
