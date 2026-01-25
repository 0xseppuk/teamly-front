'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';

import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from './validation.schema';

import { useForgotPassword } from '@/shared';

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => {
      setIsSubmitted(true);
      addToast({
        title: 'Письмо отправлено',
        description: 'Проверьте почту для сброса пароля',
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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (!executeRecaptcha) {
      addToast({
        title: 'Ошибка',
        description: 'reCAPTCHA не готова. Попробуйте обновить страницу.',
        color: 'danger',
      });

      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('forgot_password');

      forgotPassword({ data, recaptchaToken });
    } catch {
      addToast({
        title: 'Ошибка',
        description: 'Не удалось пройти проверку reCAPTCHA',
        color: 'danger',
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                <svg
                  className="h-8 w-8 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-bold">Проверьте почту</h2>
            <p className="mb-6 text-default-500">
              Если аккаунт с указанным email существует, мы отправили ссылку для
              сброса пароля.
            </p>

            <Link
              className="font-medium text-secondary hover:text-secondary-400 transition-colors"
              href="/login"
            >
              Вернуться ко входу
            </Link>
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
          <p className="mt-2 text-default-500">Восстановление пароля</p>
        </div>

        <p className="mb-6 text-sm text-default-400">
          Введите email, указанный при регистрации. Мы отправим ссылку для
          сброса пароля.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email')}
            classNames={{
              inputWrapper:
                'bg-white/5 border-white/10 hover:bg-white/10 group-data-[focus=true]:bg-white/10',
            }}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            label="Email"
            placeholder="your@email.com"
            size="lg"
            type="email"
            variant="bordered"
          />

          <Button
            className="w-full font-semibold"
            color="secondary"
            isLoading={isPending}
            size="lg"
            type="submit"
          >
            Отправить ссылку
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

        <p className="mt-4 text-center text-xs text-default-400">
          Защищено reCAPTCHA
        </p>
      </div>
    </div>
  );
}

function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'recaptcha failed': 'Проверка reCAPTCHA не пройдена',
    'recaptcha token missing': 'Ошибка reCAPTCHA. Обновите страницу.',
    'Слишком много попыток. Подождите минуту.':
      'Слишком много запросов. Подождите минуту.',
  };

  return errorMap[error] || error;
}
