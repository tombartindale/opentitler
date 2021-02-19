<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-primary.text-white(elevated height-hint="98")
    q-toolbar
      q-toolbar-title
        q-avatar
          q-icon(name="monitor")
        | Dashboard for {{userid.email}}
      q-btn(flat right @click="logout") Logout

  q-page-container
    q-page(padding)
      .q-pa-md.row.items-start.q-gutter-md
        q-card(v-for="(display,index) in displays" outlined)
          q-card-section.text-center
            q-btn(flat :to="'/control/'+index" size="xl" stack)
              q-icon(name="tune")
              .text-h6 {{display.name}}
          q-separator
          q-card-actions
            q-input(readonly dense outlined type="text" :value="geturl(index)")
            q-btn(flat :to="'/display/'+userid.uid+'/'+index" icon="monitor")

        q-card(outlined)
          q-card-section.text-center
            q-btn(flat @click="add" size="xl" stack)
              q-icon(name="add")
              .text-h6 Add
</template>

<script>

import {db} from '../lib/db';
import firebase from 'firebase';
const alldisplays = db.ref('displays');

export default {
  name: 'Dashboard',
  props:['id'],
  created () {
    this.$q.dark.set(true)
  },
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
  methods:{
    geturl(id){
      return document.location.origin + '/display/'+this.userid.uid+'/'+id;
    },
    async logout(){
      await firebase.auth().signOut();
      this.$router.push('login');
    },
    add() {
      this.$firebaseRefs.displays.push({
        name:"New Display"
      });
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
