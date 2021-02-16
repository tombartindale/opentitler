<template lang="pug">
.wrapper
  .content(v-if="data" :style="" v-for="(content,index) in data" v-bind:style="{top: offset + (index-current)*700+'px'}")
    .image(v-if="content.image")
      img(:src="content.image")
      .caption {{content.caption}}
    .text(v-if="content.text") {{content.text}}
</template>

<script>
export default {
  name: 'Content',
  data(){
    return {
      offset:80
    }
  },
  props:{
    data:Array,
    current:Number
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
</style> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.wrapper {
  
}

.content {
  position: absolute;
  // height:100%;
  z-index: -3;
  right:20px;
  
  color:white;
  font-size: 30px;
  line-height:60px;
  // display: block;
  
  background: white;
  transition: top 2s;
  background: red;

  transform: perspective(1500px) rotateY(-15deg);
  // transform: perspective(1500px) rotateY(-15deg);
}

.image {
  border: 10px solid white;
  box-shadow: 0px 0px 20px #00000077;
  background: white;
  border-radius: 1px;

  img {
    max-height:450px;
    max-width:450px;
  }

  .caption {
    background: white;
    color:black;
    // padding-top:10px;
    padding-left:10px;
    padding-right:10px;
    margin-top:-10px;
    font-family: Indie Flower;
    line-height: 30px;
  }
}

.flipper {
      -webkit-animation-iteration-count: infinite; 
            animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
   -webkit-animation-name: flipperan;
           animation-name: flipperan;
    -webkit-animation-duration: 5s;
            animation-duration: 5s;
}

.flipperout {
      -webkit-animation-iteration-count: infinite; 
            animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
   -webkit-animation-name: flipperou;
           animation-name: flipperou;
    -webkit-animation-duration: 5s;
            animation-duration: 5s;
}

@-webkit-keyframes flipperan {
  0% {
    // -webkit-transform: translate3d(0, 0, 0);
    transform: perspective(1500px) rotateY(180deg);
  }

  100% {
    // -webkit-transform: translate3d(-180deg, 0, 0);
    transform: perspective(1500px) rotateY(0deg);
  }
}

@-webkit-keyframes flipperou {
  0% {
    // -webkit-transform: translate3d(0, 0, 0);
    transform: perspective(1500px) rotateY(0deg);
  }

  100% {
    // -webkit-transform: translate3d(-180deg, 0, 0);
    transform: perspective(1500px) rotateY(-180deg);
  }
}
</style>
