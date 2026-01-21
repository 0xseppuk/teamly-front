export const routes = {
  root: '/',
  login: '/login',
  register: '/register',
  editProfile: (id: string) => `/users/edit/${id}`,
} as const;
