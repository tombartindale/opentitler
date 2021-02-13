import Vue from 'vue'
import App from './App.vue'

import { rtdbPlugin } from 'vuefire'
import VueRouter from 'vue-router'


Vue.use(rtdbPlugin)
Vue.use(require("vue-moment"));
Vue.use(VueRouter);

import Display from './components/Display'
import Control from './components/Control'
import Dashboard from './components/Dashboard'
import './quasar'


const routes = [
  { path: '/display/:user/:id', component: Display, props: true },
  { path: '/control/:user/:id/:page?', component: Control, props: true },
  { path: '/:id', component: Dashboard, props: true}
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

Vue.config.productionTip = false

new Vue({router,render: h => h(App)}).$mount('#app')
