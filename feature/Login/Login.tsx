'use client';

import { Button } from '@heroui/button';
import { Card, CardFooter, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { LoginFormData, loginSchema } from './validation.schema';

import {
  ApiError,
  ErrorResponseTypes,
  getLoginErrorResponseType,
  routes,
  useLogin,
} from '@/shared';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps = {}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      window.location.href = routes.root;
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response || error.message || 'Ошибка входа';

      const loginErrorResponseType = getLoginErrorResponseType(
        errorMessage as ErrorResponseTypes,
      );

      // If field type is determined, set field error; otherwise set general error
      if (loginErrorResponseType) {
        setError(loginErrorResponseType as 'email' | 'password', {
          message: errorMessage,
          type: 'manual',
        });
      } else {
        // Set error on password field as fallback
        setError('password', {
          message: errorMessage,
          type: 'manual',
        });
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Card className="p-6 bg-content1 shadow-medium">
      <CardHeader className="">
        <div className="">
          <h1 className="text-3xl font-bold">Teamly</h1>
          <p className="text-sm text-default-500 mt-2">Войдите в аккаунт</p>
        </div>
      </CardHeader>
      <Form className="gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('email')}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          label="Email"
          placeholder="your@email.com"
          type="email"
          variant="bordered"
        />

        <Input
          {...register('password')}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          label="Пароль"
          placeholder="Введите пароль"
          type="password"
          variant="bordered"
        />

        <Button
          className="w-full"
          color="secondary"
          isLoading={isPending}
          size="lg"
          type="submit"
        >
          Войти
        </Button>
      </Form>
      <CardFooter>
        <div className="text-center text-sm w-full">
          <span className="">Нет аккаунта? </span>
          {onSwitchToRegister ? (
            <button
              className="text-primary hover:underline"
              type="button"
              onClick={onSwitchToRegister}
            >
              Зарегистрироваться
            </button>
          ) : (
            <a className="text-primary hover:underline" href="/register">
              Зарегистрироваться
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
