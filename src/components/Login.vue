<template>
<button @click="socialLogin" class="social-button">
        <img alt="Google Logo" src="../assets/google-logo.png">
      </button>
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
