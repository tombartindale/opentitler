<template lang="pug">
div
  ul
    //- div {{displays}}
    li(v-for="(display,index) in displays")
      //- div {{display.id}}
      router-link(:to="'/display/'+id+'/'+index") Display {{display.name}}
      router-link(:to="'/control/'+id+'/'+index") Control {{display.name}}
</template>

<script>

import {db} from '../lib/db';
const alldisplays = db.ref('displays');

export default {
  name: 'Dashboard',
  props:['id'],
  data() {
    return {
      displays: Object,
    }
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      handler(id) {
        this.$rtdbBind('displays', alldisplays.child(id))
      },
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
