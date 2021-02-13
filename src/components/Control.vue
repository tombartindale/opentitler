<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-primary.text-white(elevated height-hint="98")
    q-toolbar
      q-toolbar-title
        q-avatar
          img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
        | Control of {{display.name}} 

    q-tabs(align="left" v-model="tab")
      q-tab(name="page1" label="Display Controls")
      q-tab(name="page2" label="Content Editing")
      
            
  q-page-container            
    q-tab-panels(v-model="tab" animated)
      q-tab-panel(name="page1" v-if="display.control")
        q-btn-toggle(v-model="control.content" push glossy toggle-color="primary" :options="[{label: 'On', value: true},  {label: 'Off', value: false} ]")

      q-tab-panel(name="page2")
      
      
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
      control:Object,
      tab:'page1'
    }
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      handler(id) {
        this.$rtdbBind('control', alldisplays.child(this.user).child(id).child('control')),
        this.$rtdbBind('display', alldisplays.child(this.user).child(id))
      },
    },
    control:{
      // call it upon creation too
      immediate: false,
      deep:true,
      handler(control) {
        // console.log(control);
        this.$firebaseRefs.control.set(control);
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
