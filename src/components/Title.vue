<template lang="pug">
.box
  transition(mode="out-in" enter-active-class="animate__animated animate__slideInUp" leave-active-class="animate__animated animate__slideOutDown" )
    .titles(v-if="control.title" :key="control.title")
      transition(name="fade-in" mode="out-in")
        .subtitle(:key="data.subtitle") {{data.subtitle}}
      .title
        transition(name="fade-in" mode="out-in")
          span(:key="data.title") {{data.title}}
</template>

<script>

export default {
  name: 'Title',
  props: {
    data: Object,
    control: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.box
{
  position: absolute;
  left:15px;
  bottom:45px;
  overflow:hidden;
}

.titles
{
  
}

.title {
  
  padding: 5px;
  width:1250px;
  color:black;
  z-index: 2;
  text-transform: uppercase;
  font-weight: bold;
  font-family: Titillium Web;
  border-left: var(--primary) solid 5px;
  /* box-shadow: 0px 0px 10px #00000077; */
  /* filter: drop-shadow(0 0 10px #00000077); */
  font-size: 2rem;
  
  background:white;

  
}
.subtitle
{
  
  background: var(--primary);
  padding: 5px;
  padding-left:10px;
  padding-right:10px;
  color:white;
  display:inline-block;

  font-size: 1.4rem;
  text-transform: uppercase;
}

</style>
