import { Metadata } from 'next';

import { ForgotPasswordForm } from '@/feature/ForgotPassword';

export const metadata: Metadata = {
  title: 'Восстановление пароля | Teamly',
  description: 'Восстановите доступ к аккаунту Teamly',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}
