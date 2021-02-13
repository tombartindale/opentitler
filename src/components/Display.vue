<template lang="pug">
div(v-if="display.config" v-bind:style="{'--main-background':display.config.colors.bgcolor}")
  .widescreen
    transition(enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" mode="out-in")
      Tweets(:config="display.config" :data="display.messages" v-if="display.control.messages")

    transition(mode="out-in" enter-active-class="animate__animated animate__slideInLeft" leave-active-class="animate__animated animate__slideOutLeft" )
      People(:config="display.config" :key="display.people.message" :data="display.people" v-if="display.control.people")

    transition(enter-active-class="animation slide-in-up" leave-active-class="animation slide-out-down" mode="out-in")
      Ticker(:config="display.config" :data="display.ticker" v-if="display.control.ticker")

    transition(enter-active-class="animation fade-in" leave-active-class="animation fade-out")
    Content(:config="display.config" :data="display.content" v-if="display.control.content" :current="display.control.currentcontent")

    Watermark(:config="display.config" v-if="display.control.watermark" :data="display.watermark")
</div>

</template>

<script>

/*

Voting / polling data (yes/no) animated results

Displaying content (winners / losers) (winners on content)

Displaying messages?

Control Panel

*/



import {db} from '../lib/db';
import Tweets from './Tweets';
import Ticker from './Ticker';
import People from './People';
import Time from './Time';
import Watermark from './Watermark';
import Content from './Content';

const alldisplays = db.ref('displays');

export default {
  name: 'Display',
  props:['user','id'],
  data() {
    return {
      display: Object,
    }
  },
  components: {
    Tweets,
    Ticker,
    People,
    Time,
    Watermark,
    Content
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      handler(id) {
        this.$rtdbBind('display', alldisplays.child(this.user).child(id))
      },
    },
  },
  // firebase: {
  //   messages: db.ref('messages'),
  //   ticker: db.ref('ticker'),
  //   people: db.ref('people'),
  //   control: db.ref('control'),
  //   watermark: db.ref('watermark'),
  //   content: db.ref('content'),
  //   config: db.ref('config')
  // }
}
</script>

<style src="animate.css/animate.css">
    /* global styles */
</style> 

<style src="motion-css-animation/motion.css">
    /* global styles */
</style> 

<style>
@import url('https://fonts.googleapis.com/css2?family=Hammersmith+One&family=Titillium+Web&display=swap');
</style> 

<style>
.widescreen {
  width:1280px;
  height:720px;
  overflow: hidden;
  position:relative;
  /* background:#00ff00; */
  /* background:transparent; */
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin:0;
  padding:0;
  background:gray;
}

.fade-in-enter-active {
  transition: opacity 300ms cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fade-in-leave-active {
  transition: opacity 225ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-in-enter,
.fade-in-leave-to {
  opacity: 0;
}
</style>

