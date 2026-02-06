'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';

import { RegisterFormData, registerSchema } from './validation.schema';

import { routes, useRegister } from '@/shared';

export function RegisterForm() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerUser, isPending } = useRegister({
    onSuccess: () => {
      addToast({
        title: 'Добро пожаловать!',
        description: 'Аккаунт успешно создан',
        color: 'success',
      });
      router.push(routes.root);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Ошибка регистрации';

      addToast({
        title: 'Ошибка регистрации',
        description: getErrorMessage(errorMessage),
        color: 'danger',
      });
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!executeRecaptcha) {
      addToast({
        title: 'Ошибка',
        description: 'reCAPTCHA не готова. Попробуйте обновить страницу.',
        color: 'danger',
      });

      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('register');

      registerUser({ data, recaptchaToken });
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
          <p className="mt-2 text-default-500">Создайте аккаунт</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email')}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            label="Email"
            placeholder="your@email.com"
            type="email"
            variant="flat"
          />

          <Input
            {...register('nickname')}
            errorMessage={errors.nickname?.message}
            isInvalid={!!errors.nickname}
            label="Никнейм"
            placeholder="Введите никнейм"
            type="text"
            variant="flat"
          />

          <Input
            {...register('password')}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            label="Пароль"
            placeholder="Минимум 6 символов"
            type="password"
            variant="flat"
          />

          <Input
            {...register('passwordRepeat')}
            errorMessage={errors.passwordRepeat?.message}
            isInvalid={!!errors.passwordRepeat}
            label="Повторите пароль"
            placeholder="Повторите пароль"
            type="password"
            variant="flat"
          />

          <div className="pt-1">
            <p className="mb-2 text-xs text-default-400">Необязательные поля</p>
            <div className="space-y-3">
              <Input
                {...register('discord')}
                errorMessage={errors.discord?.message}
                isInvalid={!!errors.discord}
                label="Discord"
                placeholder="username"
                type="text"
                variant="flat"
              />

              <Input
                {...register('telegram')}
                errorMessage={errors.telegram?.message}
                isInvalid={!!errors.telegram}
                label="Telegram"
                placeholder="@username"
                type="text"
                variant="flat"
              />
            </div>
          </div>

          <Button
            className="w-full font-semibold mt-1"
            color="secondary"
            isLoading={isPending}
            size="lg"
            type="submit"
          >
            Зарегистрироваться
          </Button>
        </form>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-default-500">Уже есть аккаунт? </span>
        <Link
          className="font-medium text-secondary hover:text-secondary-400 transition-colors"
          href="/login"
        >
          Войти
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
    'Email already registered': 'Email уже зарегистрирован',
    'Nickname already taken': 'Никнейм уже занят',
    'recaptcha failed': 'Проверка reCAPTCHA не пройдена',
    'recaptcha token missing': 'Ошибка reCAPTCHA. Обновите страницу.',
    'Слишком много попыток. Подождите минуту.':
      'Слишком много попыток регистрации. Подождите минуту и попробуйте снова.',
  };

  return errorMap[error] || error;
}
