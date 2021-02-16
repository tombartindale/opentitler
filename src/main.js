import Vue from 'vue'
import App from './App.vue'

import firebase from 'firebase';
import { rtdbPlugin } from 'vuefire'
import VueRouter from 'vue-router'


Vue.use(rtdbPlugin)
Vue.use(require("vue-moment"));
Vue.use(VueRouter);

import Display from './components/Display'
import Control from './components/Control'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

import './quasar'



const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  { path: '/display/:userid/:id', component: Display, props: true ,meta: {
    requiresAuth: false
  }},
  { path: '/control/:id', component: Control, props: true,meta: {
    requiresAuth: true
  } },
  { path: '/dashboard', component: Dashboard, props: true,meta: {
    requiresAuth: true
  }}
]

const router = new VueRouter({
  routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;

  // console.log(currentUser)

  console.log(to);

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser && !to.path.startsWith('/display')) next('dashboard');
  else next();
});

let app = '';

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({router,render: h => h(App)}).$mount('#app');
  }
});
