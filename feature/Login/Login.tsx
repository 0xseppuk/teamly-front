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
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Teamly</h1>
          <p className="mt-2 text-default-500">Войдите в аккаунт</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email')}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            label="Email"
            placeholder="your@email.com"
            size="lg"
            type="email"
            variant="flat"
          />

          <div>
            <Input
              {...register('password')}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              label="Пароль"
              placeholder="Введите пароль"
              size="lg"
              type="password"
              variant="flat"
            />
            <div className="mt-1.5 text-right">
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
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-default-500">Нет аккаунта? </span>
        <Link
          className="font-medium text-secondary hover:text-secondary-400 transition-colors"
          href="/register"
        >
          Зарегистрироваться
        </Link>
      </div>

      <p className="mt-3 text-center text-xs text-default-400">
        Защищено reCAPTCHA
      </p>
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
