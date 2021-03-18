import Vue from 'vue'
import App from './App.vue'

import firebase from 'firebase';
import { rtdbPlugin } from 'vuefire'
import VueRouter from 'vue-router'


Vue.use(rtdbPlugin)
Vue.use(require("vue-moment"));
Vue.use(VueRouter);
Vue.use(require('./components/plugins/ZoomSense'));

import Display from './components/Display'
import Control from './components/Control'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

import './quasar'
// import { QBadge } from 'quasar';


Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default)
  }
});

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

  // console.log(to);

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // console.log('requires auth: ' + requiresAuth);
  // console.log(currentUser)

  

  // console.log(to.path.startsWith('/login'))



  if (!requiresAuth)
    return next();
  
  if (currentUser && to.path.startsWith('/login'))
  {
    // console.log('sending to dash')
    return next('dashboard');
  }

  if (requiresAuth && !currentUser){
    // console.log('sending to login')
    next('login')
  }
  else if (currentUser && requiresAuth)
  {
    // console.log('sending to dash 2')
    next();
  }
  else next();
});

let app = '';

Vue.config.productionTip = false;

Vue.directive('cname', {
  bind: function (el) {
    // console.log(binding.value)
    // console.log(el.className);
    var node = document.createElement("div");
    var text = document.createTextNode(el.className);
    node.appendChild(text);
    node.className = "classlabel";
    el.appendChild(node);
    el.className += " classborder";
  }
})



firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({router,render: h => h(App)}).$mount('#app');
  }
});
