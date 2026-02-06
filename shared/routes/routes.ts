export const routes = {
  root: '/',
  games: '/games',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  editProfile: (id: string) => `/users/edit/${id}`,
};
