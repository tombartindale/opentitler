<template lang="pug">
q-layout(view="hHh lpR fFf")
  video.fixed-right.fixed-left.vid(autoplay, loop, muted)
    source(src="/vids/vid2.mp4", type="video/mp4")
  q-page-container.fullscreen
    q-page(padding)
      .q-pa-lg
        .animate__animated.animate__slideInLeft.animate__slow
          .title2 For your live video productions
          .title1
            transition(
              enter-active-class="animate__animated animate__fadeIn",
              leave-active-class="animate__animated animate__fadeOut",
              mode="out-in"
            )
              div(:key="title") {{ alltitles[title] }}
        .row
          .text-h5.q-mt-xl Key Features
            ul
              li Can be used nativly in OBS without additional software
              li Native browser rendered overlay
              li Remote production control (overlay can be controlled by remote user)
              li Fully customisable styles and graphics
              li Integrated with ZoomSense for live Zoom chat display.
        .text-center.q-mt-lg
          q-btn(@click="socialLogin", color="primary", size="lg") Login with Google
</template>

<style src="animate.css/animate.css">
/* global styles */
</style>

<script>
import firebase from "firebase";
export default {
  name: "Login",
  data() {
    return {
      alltitles: [
        "Dynamic on-screen titles...",
        "Dynamic content...",
        "Remote Controlled...",
        "Multiple operators...",
      ],
      title: 0,
    };
  },
  mounted() {
    var self = this;
    setInterval(function () {
      self.title = (self.title + 1) % self.alltitles.length;
    }, 3000);
  },
  methods: {
    socialLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.$q.localStorage.remove("anon");
          this.$router.replace("dashboard");
        })
        .catch((err) => {
          alert("Oops. " + err.message);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vid {
  opacity: 0.4;
  width: 103%;
  min-width: 1200px;
}

.title1 {
  background: white;
  padding: 0.3em;
  color: black;
  font-size: 2.5em;
  border-left: #00838f 3px solid;
}

.title2 {
  background: #00838f;
  display: inline-block;
  padding: 0.3em;
  padding-left: 0.9em;
  padding-right: 0.9em;
  font-size: 1.3em;
}
</style>
