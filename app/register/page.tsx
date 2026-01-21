import { Metadata } from 'next';

import { RegisterForm } from '@/feature/Register';

export const metadata: Metadata = {
  title: 'Регистрация | Teamly',
  description: 'Создайте аккаунт в Teamly и найдите команду для игры',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
