import { ErrorResponseTypes } from '@/shared/';

export function getLoginErrorResponseType(message: ErrorResponseTypes) {
  const ErrorResponseType = {
    'Incorect password': 'password',
    'Email not found': 'email',
  };

  return ErrorResponseType[message];
}
