import Vue from "vue";

import "./styles/quasar.sass";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons/material-icons.css";
import { Quasar, Dialog, Notify } from "quasar";

Vue.use(Quasar, {
  config: {},
  plugins: { Dialog, Notify },
});
