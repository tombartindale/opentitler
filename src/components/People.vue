<template lang="pug">
.people
  .name {{currentmessage.name}}
  .attribution {{currentmessage.affiliation}}
  //- Title1(:data="data")
</template>

<script>
import Title1 from './animations/Title1';

export default {
  name: 'People',
  components:{
    Title1
  },
  props: {
    data: Object
  },
  computed:{
    currentmessage(){
      return this.data
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.people {
  position: absolute;
  left:15px;
  bottom:180px;
  color:white;
  font-family: Titillium Web;
  /* box-shadow: 0px 0px 10px #00000077; */
  /* filter: drop-shadow(0 0 10px #00000077); */
  font-size: 1.2rem;
}

.name {
  background: darkcyan;
  padding:10px;
  text-transform: uppercase;
  display:block;
}

.attribution {
  padding:10px;
  background: #616161;
  display:inline-block;
}

</style>
