<template lang="pug">
.t_wrap
  .lefter
    .fader
    .ticker-wrap
      .ticker
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

.t_wrap {
  box-shadow: 0px 0px 10px #00000077;
  position: absolute;
  top:660px;
  background: var(--main-background);  
  left:0;
  width:1280px;
  font-family: Titillium Web;
}


* { box-sizing: border-box; }

@-webkit-keyframes ticker {
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
  width:1100px;
  position:relative;
}

.fader {
  background-image: -webkit-linear-gradient(left , var(--main-background) 0%, transparent 5%, transparent 95%, var(--main-background) 100%);
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  z-index: 2;
}

.ticker-wrap {
  overflow: hidden;
  height: 60px;
  padding-left: 100%;
  box-sizing: content-box;
  position:relative;
  width: 1100px;
  // background: red;

  .ticker {
    // width:1100px;
    display: inline-block;
    height: 60px;
    line-height: 60px;
    white-space: nowrap;
    padding-right: 100%;
    box-sizing: content-box;

    -webkit-animation-iteration-count: infinite; 
            animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
   -webkit-animation-name: ticker;
           animation-name: ticker;
    -webkit-animation-duration: $duration;
            animation-duration: $duration;

    &__item {

      display: inline-block;

      padding: 0 2rem;
      font-size: 2rem;
      color: white;   

    }

  }

}

</style>
