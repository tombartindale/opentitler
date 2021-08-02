<template lang="pug">
.absolute-center.text-center
  h4(v-if="!error") Connecting to controller...
  q-spinner(size="lg" v-if="!error")
  q-banner(rounded v-if="error").bg-red
    .text-body1 Your link is invalid. Please contact the display owner to receive another.
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

import { db } from "../lib/db";

const decryptToken = firebase.functions().httpsCallable("decryptToken");

export default {
  name: "Anon",
  data() {
    return {
      token: this.$route.query.token,
      error: false,
    };
  },
  mounted() {
    //when mounted -- do anon firebase login:
    firebase
      .auth()
      .signInAnonymously()
      .then(async (loginData) => {
        //do login:
        const user = loginData.user;
        // Read result of the decryptToken Function
        // console.log(this.token);
        const result = await decryptToken({ token: this.token });
        const { displayid, userid } = result.data;
        // curMeetingid = displayid;
        // curHostuid = userid;
        const anonymousSession = {
          displayid,
          userid,
        };
        this.$q.localStorage.set("anon", anonymousSession);

        //write this user's account access to rtdb:
        await db
          .ref(`/anonymous/users/${user.uid}/control/${userid}/${displayid}`)
          .set({ createdAt: new Date().getTime() });

        this.$router.push("/control/" + displayid);
      })
      .catch((err) => {
        console.error(err);
        this.error = true;
      });
    //if the code is valid, link this account to that display
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
