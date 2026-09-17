import { redirect } from 'next/navigation';

export default function ResearchRedirect(): never {
  redirect('/dashboard?tab=research');
}
