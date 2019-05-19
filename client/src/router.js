import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: window.location.host.includes('arweave') ? 'hash' : 'history',
  // base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
  routes: [
    // pages
    { path: '/', name: 'home', component: require('./pages/home').default },
    { path: '/about', name: 'about', component: require('./pages/about').default },
    { path: '/create', name: 'create', component: require('./pages/create-company').default },
    {
      path: '/company/:companyAddress',
      name: 'company',
      component: require('./pages/company').default,
      props: true,
    },
    { path: '/temp', name: 'temp', component: require('./pages/temp').default },
    { path: '*', name: 'not-found', component: require('./pages/404').default },
  ],
});
