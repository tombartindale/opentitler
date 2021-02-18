<template lang="pug">
div
  ul
    //- div {{displays}}
    li(v-for="(display,index) in displays")
      //- div {{display.id}}
      router-link(:to="'/display/'+userid.uid+'/'+index") Display {{display.name}}
      router-link(:to="'/control/'+index") Control {{display.name}}
</template>

<script>

import {db} from '../lib/db';
import firebase from 'firebase';
const alldisplays = db.ref('displays');

export default {
  name: 'Dashboard',
  props:['id'],
  data() {
    return {
      displays: Object,
    }
  },
  computed:{
    userid(){
      return firebase.auth().currentUser;
    }
  },
  mounted(){
    // console.log(this.userid);
    this.$rtdbBind('displays', alldisplays.child(this.userid.uid))
  },
  watch: {
    id: {
      // call it upon creation too
      // immediate: true,
      handler() {
        
      },
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
