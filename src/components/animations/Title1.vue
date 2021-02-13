<template>
<div id="animation-1" class="animation">
<div class="color2">/</div>
<div class="color1 light mask">
  <div>{{line1}}</div>
</div>
<div class="color1 light mask">
  <div>{{line2}}</div>
</div>
</div>
</template>

<script>
export default {
  name: 'Title1',
  computed:{
      line2(){
          return this.data.attribution;
      },
      line1(){
          return this.data.message;
      }
  },
  props: {
    data: Object
  }
}
</script>

<style src="../../assets/css/effects1.css">
    /* global styles */
</style> 