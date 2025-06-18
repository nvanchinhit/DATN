// app/doctor/page.tsx
import { redirect } from 'next/navigation';

export default function DoctorPage() {
  redirect('/doctor/dashboard');
}
