export default [
  {
    path: '/',
    name: 'home',
    component: () => import('../page/home/ScheduleTable/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../page/login'),
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('../page/NotFound.vue'),
  },
];
