export const routes = {
  root: '/',
  login: '/login',
  editProfile: (id: string) => `/users/edit/${id}`,
} as const;
