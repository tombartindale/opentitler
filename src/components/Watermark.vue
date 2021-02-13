<template lang="pug">
.watermark
  img(:src="data.src")
</template>

<script>
export default {
  name: 'Watermark',
  props:{
    data:Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.watermark {
  position: absolute;
  left:20px;
  top:20px;
  width:100px;
  height:100px;
  overflow: hidden;
  opacity: 0.4;
  /* box-shadow: 0px 0px 10px #00000077; */
  img {
    width:100%;
  }
}
</style>
