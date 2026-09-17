import { redirect } from 'next/navigation';

export default function VehicleDesignRedirect(): never {
  redirect('/dashboard?tab=design');
}
