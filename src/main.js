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


const routes = [
  { path: '/display/:user/:id', component: Display, props: true },
  { path: '/control/:user/:id', component: Control, props: true },
  { path: '/:id', component: Dashboard, props: true}
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

import "./styles/quasar.sass";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import Quasar from "quasar";

Vue.use(Quasar, {
  config: {
    brand: {
      primary: "#4082AD",
      secondary: "#358462",
    }
  },
  extras: ["material-icons"]
});

Vue.config.productionTip = false

new Vue({router,render: h => h(App)}).$mount('#app')
