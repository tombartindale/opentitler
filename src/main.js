import Vue from "vue";
import App from "./App.vue";

import firebase from "firebase";
import { rtdbPlugin } from "vuefire";
import VueRouter from "vue-router";

import Plugin from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";
import VueTimers from "vue-timers";

Vue.use(Plugin);
Vue.use(rtdbPlugin);
Vue.use(require("vue-moment"));
Vue.use(VueRouter);
Vue.use(VueTimers);

const ZoomSense = require("@zoomsense/vue-zoomsense");
Vue.use(ZoomSense, {
  name: "zoom",
  apiKey: "AIzaSyBQx95IIQivK3c--e4X6W9Ks6xNlaUuhe4",
  authDomain: "zoombot.firebaseapp.com",
  databaseURL: "https://zoombot.firebaseio.com",
  projectId: "zoombot",
  appId: "1:578675125264:web:64b8cfb489ae9dc9b6ee95",
});

import Display from "./components/Display";
import Control from "./components/Control";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Anon from "./components/Anon";

import "./quasar";
// import { QBadge } from 'quasar';

Vue.component("v-style", {
  render: function(createElement) {
    return createElement("style", this.$slots.default);
  },
});

const routes = [
  {
    path: "*",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/anon",
    name: "Anon",
    component: Anon,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/display/:userid/:id",
    component: Display,
    props: true,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/control/:id",
    component: Control,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

import { getCurrentUser } from "./lib/db";
import { LocalStorage } from "quasar";

router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();

  // console.log(currentUser);

  // console.log(to);

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // console.log('requires auth: ' + requiresAuth);
  // console.log(currentUser)

  // console.log(to.path.startsWith('/login'))

  if (!requiresAuth) return next();

  if (currentUser && to.path.startsWith("/login")) {
    return next("dashboard");
  }

  if (LocalStorage.has("anon") && !to.path.startsWith("/control")) {
    // console.log("anon");
    let anon = LocalStorage.getItem("anon").displayid;
    next("/control/" + anon);
  }

  if (requiresAuth && !currentUser) {
    // console.log("sending to login");
    next("login");
  } else if (currentUser && requiresAuth) {
    // console.log("sending to next");
    next();
  } else next();
});

let app = "";

Vue.config.productionTip = false;

Vue.directive("cname", {
  bind: function(el) {
    // console.log(binding.value)
    // console.log(el.className);
    var node = document.createElement("div");
    var text = document.createTextNode(el.className);
    node.appendChild(text);
    node.className = "classlabel";
    el.appendChild(node);
    el.className += " classborder";
  },
});

firebase.auth().onAuthStateChanged(() => {
  // console.log("auth changed");
  if (!app) {
    new Vue({ router, render: (h) => h(App) }).$mount("#app");
  }
});
