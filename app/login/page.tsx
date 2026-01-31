import { Metadata } from 'next';

import { LoginForm } from '@/feature/Login';

export const metadata: Metadata = {
  title: 'Вход | Teamly',
  description: 'Войдите в Teamly и найдите команду для игры',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
