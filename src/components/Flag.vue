<template lang="pug">
div
  q-btn(flat size="sm" icon="circle" @click.capture.stop="flag()" :color="(isMine)?'yellow':'grey-9'" round)
  .absolute-right.q-mr-sm.q-mt-sm
    .indic(v-for="(fl,index) in notMine" :key="index")
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { includes, pull, without } from "lodash";

export default {
  name: "Flag",
  props: ["route", "item", "fbref"],
  data() {
    return {};
  },
  methods: {
    async flag() {
      if (!this.item.flags) this.item.flags = [];

      if (this.isMine) pull(this.item.flags, firebase.auth().currentUser.uid);
      else this.item.flags.push(firebase.auth().currentUser.uid);
      await this.fbref.child(this.route).set(this.item);
    },
  },
  computed: {
    isMine() {
      return includes(this.item.flags, firebase.auth().currentUser.uid);
    },
    notMine() {
      return without(this.item.flags, firebase.auth().currentUser.uid);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.indic {
  background: orange;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  margin-bottom: 2px;
}
</style>
