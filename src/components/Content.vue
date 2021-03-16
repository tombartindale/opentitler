<template lang="pug">
.content_wrapper
  .content(v-if="data" :class="content.itemtype" v-for="(content,index) in data" v-bind:style="{top: offset + (index-current)*700+'px'}")
    .imagec(v-if="content.itemtype=='image'")
      img(:src="content.image")
      .caption {{content.caption}}

    .text(v-if="content.itemtype=='message'")
      .message {{content.message}}
      .caption {{content.caption}}

    .persona(v-if="content.itemtype=='profile'") {{content.text}}
      img.p_img(:src="content.image")
      .p_caption {{content.caption}}
      .p_text {{content.message}}
</template>

<script>
export default {
  name: 'Content',
  data(){
    return {
      offset:60
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
  
  // color:white;
  font-size: 30px;
  line-height:60px;
  // display: block;
  
  
  transition: top 2s;
  // background: red;

  transform: perspective(1500px) rotateY(-20deg);
  // transform: perspective(1500px) rotateY(-15deg);
}

.persona {

  border-radius: 20px;
  background:white;
  padding:20px;
  min-height: 190px;
  font-family: Titillium Web;

  .p_img {
    width:150px;
    border-radius: 50%;
    height:150px;
    float:right;
  }

  .p_text {
    line-height: 40px;
    color:darkslategray;
    word-wrap: break-word;
  }

  .p_caption {
    color:var(--primary);
  }
}

.message {
  height:70%;
  // background: green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text {
  

  .message {
  // width:400px;
    max-width:450px;
    min-width: 200px;
    border-left: 1px solid white;
    border-right: 1px solid white;
    padding: 20px;
    margin-top:auto;
    margin-bottom:auto;
    color:white;
    text-align: center;
    font-size: 1em;
    line-height: 1.3em;
  }

  .caption {
    text-align:right;
    font-size: 0.5em;
    margin-top:-20px;
  }

  background:rgba(0,0,0,0.2);
}

.imagec {
  border: 10px solid white;
  box-shadow: 0px 0px 20px #00000077;
  background: white;
  border-radius: 1px;
  background: white;

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
