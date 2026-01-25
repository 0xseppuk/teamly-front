'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';

import { LoginFormData, loginSchema } from './validation.schema';

import { useLogin } from '@/shared';

export function LoginForm() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      // Cookie устанавливается сервером автоматически (HTTP-only)
      addToast({
        title: 'Добро пожаловать!',
        description: 'Вы успешно вошли в аккаунт',
        color: 'success',
      });
      router.push('/');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Ошибка входа';

      addToast({
        title: 'Ошибка входа',
        description: getErrorMessage(errorMessage),
        color: 'danger',
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!executeRecaptcha) {
      addToast({
        title: 'Ошибка',
        description: 'reCAPTCHA не готова. Попробуйте обновить страницу.',
        color: 'danger',
      });

      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('login');

      login({ data, recaptchaToken });
    } catch {
      addToast({
        title: 'Ошибка',
        description: 'Не удалось пройти проверку reCAPTCHA',
        color: 'danger',
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Glass card */}
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {/* Gradient accent */}
        <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Teamly</h1>
          <p className="mt-2 text-default-500">Войдите в аккаунт</p>
        </div>

        {/* Form */}
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

          <div>
            <Input
              {...register('password')}
              classNames={{
                inputWrapper:
                  'bg-white/5 border-white/10 hover:bg-white/10 group-data-[focus=true]:bg-white/10',
              }}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              label="Пароль"
              placeholder="Введите пароль"
              size="lg"
              type="password"
              variant="bordered"
            />
            <div className="mt-2 text-right">
              <Link
                className="text-sm text-default-400 hover:text-secondary transition-colors"
                href="/forgot-password"
              >
                Забыли пароль?
              </Link>
            </div>
          </div>

          <Button
            className="w-full font-semibold"
            color="secondary"
            isLoading={isPending}
            size="lg"
            type="submit"
          >
            Войти
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <span className="text-default-500">Нет аккаунта? </span>
          <Link
            className="font-medium text-secondary hover:text-secondary-400 transition-colors"
            href="/register"
          >
            Зарегистрироваться
          </Link>
        </div>

        {/* reCAPTCHA notice */}
        <p className="mt-4 text-center text-xs text-default-400">
          Защищено reCAPTCHA
        </p>
      </div>
    </div>
  );
}

function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'Email not found': 'Пользователь с таким email не найден',
    'Incorrect password': 'Неверный пароль',
    'recaptcha failed': 'Проверка reCAPTCHA не пройдена',
    'recaptcha token missing': 'Ошибка reCAPTCHA. Обновите страницу.',
    'Слишком много попыток. Подождите минуту.':
      'Слишком много попыток входа. Подождите минуту и попробуйте снова.',
  };

  return errorMap[error] || error;
}
