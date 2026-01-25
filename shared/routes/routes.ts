export const routes = {
  root: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  editProfile: (id: string) => `/users/edit/${id}`,
} as const;
