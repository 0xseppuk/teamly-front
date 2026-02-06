import { Metadata } from 'next';
import { Suspense } from 'react';

import { ResetPasswordForm } from '@/feature/ResetPassword';

export const metadata: Metadata = {
  title: 'Новый пароль | Teamly',
  description: 'Установите новый пароль для аккаунта Teamly',
};

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-default-500">Загрузка...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
