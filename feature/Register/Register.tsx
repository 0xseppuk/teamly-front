'use client';

import { Button } from '@heroui/button';
import { Card, CardFooter, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm } from 'react-hook-form';

import { RegisterFormData, registerSchema } from './validation.schema';

import { ApiError, routes, useRegister } from '@/shared/';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps = {}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerUser } = useRegister({
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem('auth_token', data.token);
      window.location.href = routes.root;
    },
    onError: (error: ApiError) => {
      setError('email', {
        message: error.message,
        type: 'value',
      });
    },
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: RegisterFormData) => {
    if (!executeRecaptcha) {
      setError('email', { message: 'Recaptcha not ready', type: 'manual' });

      return;
    }
    try {
      const recaptchaToken = await executeRecaptcha('register');

      console.log();
      registerUser({ data, recaptchaToken });
    } catch (error) {
      setError('email', { message: 'Recaptcha failed', type: 'manual' });
    }
  };

  return (
    <Card className="p-6 bg-content1 shadow-medium">
      <CardHeader className="text-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center">Teamly</h1>
          <p className="text-sm text-default-500 mt-2">Создайте аккаунт</p>
        </div>
      </CardHeader>
      <Form className="gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('email')}
          isRequired
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          label="Email"
          placeholder="your@email.com"
          type="email"
          variant="bordered"
        />

        <Input
          {...register('nickname')}
          isRequired
          errorMessage={errors.nickname?.message}
          isInvalid={!!errors.nickname}
          label="Никнейм"
          placeholder="Введите никнейм"
          type="text"
          variant="bordered"
        />

        <Input
          {...register('password')}
          isRequired
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          label="Пароль"
          placeholder="Введите пароль"
          type="password"
          variant="bordered"
        />

        <Input
          {...register('passwordRepeat')}
          isRequired
          errorMessage={errors.passwordRepeat?.message}
          isInvalid={!!errors.passwordRepeat}
          label="Повторите пароль"
          placeholder="Повторите пароль"
          type="password"
          variant="bordered"
        />

        <Input
          {...register('discord')}
          errorMessage={errors.discord?.message}
          isInvalid={!!errors.discord}
          label="Discord (необязательно)"
          placeholder="username#0000"
          type="text"
          variant="bordered"
        />

        <Input
          {...register('telegram')}
          errorMessage={errors.telegram?.message}
          isInvalid={!!errors.telegram}
          label="Telegram (необязательно)"
          placeholder="@username"
          type="text"
          variant="bordered"
        />

        <Button className="w-full" color="secondary" size="lg" type="submit">
          {'Зарегистрироваться'}
        </Button>
      </Form>
      <CardFooter>
        <div className="text-center text-sm w-full">
          <span className="">Уже есть аккаунт? </span>
          {onSwitchToLogin ? (
            <button
              className="text-primary hover:underline"
              type="button"
              onClick={onSwitchToLogin}
            >
              Войти
            </button>
          ) : (
            <a className="text-primary hover:underline" href="/login">
              Войти
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
