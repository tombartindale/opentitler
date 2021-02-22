<template lang="pug">
q-layout(view="hHh lpR fFf")
  //- q-header.bg-primary.text-white(elevated height-hint="98")
  //-   q-toolbar
  //-     q-toolbar-title
  //-       q-avatar
  //-         q-icon(name="web")
  //-       | Open Titler

  q-page-container
    q-page(padding)
      .q-pa-lg
        .text-h2 Dynamic on-screen titles for your live video productions.
        .row
          .text-h5.text-weight-light.q-mt-xl Key Features
            ul
              li Can be used nativly in OBS without additional software
              li Native browser rendered overlay
              li Remote production control (overlay can be controlled by remote user)
              li Fully customisable styles and graphics
        .text-center.q-mt-lg
          q-btn(@click="socialLogin" color="primary") Login with Google
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'Login',
  methods:{
    socialLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
          console.log(result);
          this.$router.replace('dashboard');
        }).catch((err) => {
          alert('Oops. ' + err.message)
        });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
