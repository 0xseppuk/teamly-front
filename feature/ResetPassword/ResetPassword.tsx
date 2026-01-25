'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from './validation.schema';

import { useResetPassword } from '@/shared';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: () => {
      setIsSuccess(true);
      addToast({
        title: 'Пароль изменен',
        description: 'Теперь вы можете войти с новым паролем',
        color: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Ошибка';

      addToast({
        title: 'Ошибка',
        description: getErrorMessage(errorMessage),
        color: 'danger',
      });
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      addToast({
        title: 'Ошибка',
        description: 'Токен не найден. Запросите новую ссылку.',
        color: 'danger',
      });

      return;
    }

    resetPassword({ token, newPassword: data.newPassword });
  };

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-danger/50 to-transparent" />

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/20">
                <svg
                  className="h-8 w-8 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-bold">Ссылка недействительна</h2>
            <p className="mb-6 text-default-500">
              Токен для сброса пароля не найден или истек.
            </p>

            <Link
              className="font-medium text-secondary hover:text-secondary-400 transition-colors"
              href="/forgot-password"
            >
              Запросить новую ссылку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-success/50 to-transparent" />

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                <svg
                  className="h-8 w-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-bold">Пароль изменен</h2>
            <p className="mb-6 text-default-500">
              Ваш пароль успешно изменен. Теперь вы можете войти с новым
              паролем.
            </p>

            <Button
              className="font-semibold"
              color="secondary"
              size="lg"
              onPress={() => router.push('/login')}
            >
              Войти в аккаунт
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Teamly</h1>
          <p className="mt-2 text-default-500">Новый пароль</p>
        </div>

        <p className="mb-6 text-sm text-default-400">
          Введите новый пароль для вашего аккаунта.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('newPassword')}
            classNames={{
              inputWrapper:
                'bg-white/5 border-white/10 hover:bg-white/10 group-data-[focus=true]:bg-white/10',
            }}
            errorMessage={errors.newPassword?.message}
            isInvalid={!!errors.newPassword}
            label="Новый пароль"
            placeholder="Минимум 6 символов"
            size="lg"
            type="password"
            variant="bordered"
          />

          <Input
            {...register('confirmPassword')}
            classNames={{
              inputWrapper:
                'bg-white/5 border-white/10 hover:bg-white/10 group-data-[focus=true]:bg-white/10',
            }}
            errorMessage={errors.confirmPassword?.message}
            isInvalid={!!errors.confirmPassword}
            label="Подтвердите пароль"
            placeholder="Повторите пароль"
            size="lg"
            type="password"
            variant="bordered"
          />

          <Button
            className="w-full font-semibold"
            color="secondary"
            isLoading={isPending}
            size="lg"
            type="submit"
          >
            Сохранить пароль
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-default-500">Вспомнили пароль? </span>
          <Link
            className="font-medium text-secondary hover:text-secondary-400 transition-colors"
            href="/login"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'Invalid or expired token': 'Ссылка недействительна или истекла',
    'Token is required': 'Токен не найден',
    'New password is required': 'Введите новый пароль',
    'Password must be at least 6 characters':
      'Пароль должен быть минимум 6 символов',
    'Слишком много попыток. Подождите минуту.':
      'Слишком много попыток. Подождите минуту.',
  };

  return errorMap[error] || error;
}
