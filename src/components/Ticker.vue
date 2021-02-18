<template lang="pug">
.t_wrap
  .lefter
    .fader
    .ticker-wrap
      .ticker.animateme(ref="ticker")
        transition(name="fade-in" mode="out-in")
          .ticker__item(:key="currentmessage") {{currentmessage}}
  Time
</template>

<script>
import Time from './Time';

export default {
  name: 'Ticker',
  components:{Time},
  props: {
    data: Object,
    config: Object
  },
  watch:{
    currentmessage(){
        //reset css
        console.log('reset css');
        // .ticker translate3d to 0,0,0;

        // this.$refs.ticker.classList.remove('animateme');
        // this.$refs.ticker.style.transform = "translate3d(0%, 0, 0)";

        // this.$refs.ticker.classList.add('animateme');


    }
  },
  computed:{
    currentmessage(){
      return this.data.message
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

$duration: 15s;
$width: 1070px;

.t_wrap {
  // box-shadow: 0px 0px 10px #00000077;
  position: absolute;
  top:675px;
  // background: var(--main-background);  
  //
  left:15px;
  width:1250px;
  font-family: Titillium Web;
  // border-left:5px var(--primary) solid;
  overflow: hidden;
}


* { box-sizing: border-box; }

// @-webkit-keyframes ticker {
//   0% {
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//     visibility: visible;
//   }

//   100% {
//     -webkit-transform: translate3d(-100%, 0, 0);
//     transform: translate3d(-100%, 0, 0);
//   }
// }

@keyframes ticker {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }

  100% {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}

.lefter {
  width:$width;
  position:relative;
}

.fader {
  background-image: -webkit-linear-gradient(left , black 0%, transparent 2%, transparent 98%, black 100%);
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  z-index: 2;
}

.animateme {
 // -webkit-animation-itercation-count: infinite; 
            animation-iteration-count: infinite;
    // -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  //  -webkit-animation-name: ticker;
           animation-name: ticker;
    // -webkit-animation-duration: $duration;
            animation-duration: $duration;
}

.ticker-wrap {
  overflow: hidden;
  height: 30px;
  padding-left: 100%;
  box-sizing: content-box;
  position:relative;
  width: $width;
   background:black;
  
  // background: red;

  .ticker {
    // width:1100px;
    display: inline-block;
    
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    padding-right: 100%;
    box-sizing: content-box;

    &__item {

      display: inline-block;

      padding: 0 2rem;
      font-size: 1.2rem;
      color: white;   

    }

  }

}

</style>
