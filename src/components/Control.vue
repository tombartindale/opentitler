<template lang="pug">
q-layout(view='hHh lpR fFf')
  q-header.bg-primary.text-white(elevated height-hint='98')
    q-toolbar
      q-toolbar-title
        q-avatar
          img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
        | Title

    q-tabs(align='left')
      q-route-tab(to='/page1' label='Page One')
        q-route-tab(to='/page2' label='Page Two')
          q-route-tab(to='/page3' label='Page Three').
            
            
  q-page-container
    router-view.
      
      
</template>

<script>
import {db} from '../lib/db';
const alldisplays = db.ref('displays');

export default {
  name: 'Control',
  props:['user','id'],
  data() {
    return {
      display: Object,
    }
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      handler(id) {
        this.$rtdbBind('display', alldisplays.child(this.user).child(id))
      },
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
