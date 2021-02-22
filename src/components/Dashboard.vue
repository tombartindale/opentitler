<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-primary.text-white(elevated height-hint="98")
    q-toolbar
      q-toolbar-title
        q-avatar
          q-icon(name="web")
        | Dashboard for {{userid.email}}
      q-btn(flat right @click="logout") Logout

  q-page-container
    q-page(padding)
      .text-body1.q-mb-md Each of the following is an independently controllable titles environment.
      .row.q-col-gutter-md
        .col-md-3.col-sm-4.col-xs-12(v-for="(display,index) in displays" outlined)
          q-card
            q-card-section.text-center
              q-btn(flat :to="'/control/'+index" size="xl" stack)
                q-tooltip Control Output
                q-icon(name="tune")
                .text-h6 {{display.name}}
            q-separator
            q-card-actions
              q-input.col(readonly dense outlined type="text" :value="geturl(index)")
              q-btn.col-2(flat :to="'/display/'+userid.uid+'/'+index" icon="monitor")
                q-tooltip Display output

        .col-md-3.col-sm-4.col-xs-12(outlined)
          q-card
            q-card-section.text-center
              q-btn(flat @click="add" size="xl" stack)
                q-icon(name="add")
                .text-h6 Add New Display
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
      return document.location.origin + '/#/display/'+this.userid.uid+'/'+id;
    },
    async logout(){
      await firebase.auth().signOut();
      this.$router.push('login');
    },
    async add() {
      var index = await this.$firebaseRefs.displays.push({
        name:"New Display"
      });

      this.$router.push('/control/'+index.getKey());
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
