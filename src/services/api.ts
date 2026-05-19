export const ApiRoute = {
  // Auth
  SIGNUP:  '/auth/signup',
  LOGIN:   '/auth/login',
  LOGOUT:  '/auth/logout',
  ME:      '/auth/me',
  REFRESH: '/auth/refresh',

  // Location
  STATES: '/location/states',
  EXAMS:  '/exams',
} as const;

export type ApiRoute = typeof ApiRoute[keyof typeof ApiRoute];

export const ApiRouteParam = {
  districts: (stateId: string) => `/location/states/${stateId}/districts`,
};
