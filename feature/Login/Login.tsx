'use client';

import {
  ApiError,
  ErrorResponseTypes,
  getLoginErrorResponseType,
  routes,
  useLogin,
} from '@/shared';
import { Button } from '@heroui/button';
import { Card, CardFooter, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from './validation.schema';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps = {}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login } = useLogin({
    onSuccess: () => {
      router.push(routes.root);
    },
    onError: (error: ApiError) => {
      const loginErrorResponseType = getLoginErrorResponseType(
        error.message as ErrorResponseTypes,
      );
      errors[loginErrorResponseType as 'email' | 'password'] = {
        message: error.message,
        type: 'value',
      };
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Card className="p-6 bg-content1 shadow-medium">
      <CardHeader className="text-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center">Teamly</h1>
          <p className="text-sm text-default-500 mt-2">Войдите в аккаунт</p>
        </div>
      </CardHeader>
      <Form onSubmit={handleSubmit(onSubmit)} className="gap-4">
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

        <Button className="w-full" color="secondary" size="lg" type="submit">
          {'Войти'}
        </Button>
      </Form>
      <CardFooter>
        <div className="text-center text-sm w-full">
          <span className="">Нет аккаунта? </span>
          {onSwitchToRegister ? (
            <button
              className="text-primary hover:underline"
              onClick={onSwitchToRegister}
              type="button"
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
