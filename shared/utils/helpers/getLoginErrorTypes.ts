import { ErrorResponseTypes } from '@/shared/types/baseTypes';

export function getLoginErrorResponseType(message: ErrorResponseTypes) {
  const ErrorResponseType = {
    'Incorrect password': 'password',
    'Email not found': 'email',
  };

  return ErrorResponseType[message];
}
