<template lang="pug">
div.fit
  .fit.column.justify-end
    q-scroll-area(ref="scrollArea").col
      div.q-px-md
      
        q-chat-message(text-color="white" :bg-color="(message.from==user)?'grey-8':'grey-9'" v-for="(message,id) in chat" :key="id" size="10" :text="[message.text]" :name="(message.from==user)?'me':'them'" :stamp="timeDiff(message.sent)" :sent="message.from!=user")

    .col-auto.q-pa-xs
      q-input(autogrow outlined placeholder="new message..." dense v-model="newmsg" v-on:keydown.meta.enter="sendmsg" v-on:keydown.ctrl.enter="sendmsg")
        template(v-slot:append)
        q-btn(icon="send" flat dense @click="sendmsg")
  
  //- q-page-sticky(position="bottom-right" :offset="[18, 18]")
  //- q-btn(fab icon="chat" color="secondary" @click="sendmsg").absolute-left-bottom.z-max
</template>

<script>
import firebase from "firebase";
import { DateTime } from "luxon";
import { db } from "../lib/db";
// import { filter } from "lodash";
const alldisplays = db.ref("displays");

export default {
  name: "Chat",
  props: ["id", "uid"],
  data: () => {
    return {
      newmsg: "",
      chat: null,
    };
  },
  methods: {
    async sendmsg() {
      if (this.newmsg) {
        let msg = {
          text: this.newmsg,
          sent: DateTime.now().toSeconds(),
          from: this.user,
        };
        this.newmsg = "";

        await this.$firebaseRefs.chat.push(msg);
        this.animateScroll();
      }
    },
    timeDiff(tt) {
      return DateTime.fromSeconds(tt).toRelative();
    },
    animateScroll() {
      this.$refs.scrollArea.setScrollPercentage(1.2, 500);
    },
  },
  mounted() {
    if (!this.chat) this.chat = [];
  },
  watch: {
    id: {
      immediate: true,
      async handler() {
        await this.$rtdbBind(
          "chat",
          alldisplays
            .child(this.uid)
            .child(this.id)
            .child("chat")
        );

        this.chat.forEach((element) => {
          element.read = true;
        });
        this.animateScroll();
      },
    },
    chat: {
      deep: true,
      handler() {
        this.$emit("new:message");
        this.animateScroll();
      },
    },
  },
  computed: {
    user() {
      return firebase.auth().currentUser.uid;
    },
  },
};
</script>

<style lang="scss">
.q-message-text-content {
  white-space: pre-line;
}
</style>
