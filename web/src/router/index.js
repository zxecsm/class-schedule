import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { _getData } from '../utils/common';
import NProgress from '../config/nprogress'


const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  let t = _getData('id');
  if (t) {
    if (to.name == 'login') {
      router.replace('/');
    } else {
      next()
    }
  } else {
    if (to.name == 'login') {
      next();
    } else {
      router.replace('/login');
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});

router.onError((error) => {
  NProgress.done();
});

export default router;
