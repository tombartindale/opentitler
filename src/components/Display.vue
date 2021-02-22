<template lang="pug">
div(v-if="display.config" :style="allstyles")
  v-style {{display.config.style}}
  .widescreen
    //- transition(enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" mode="out-in")
      //- Tweets(:data="display.messages" v-if="display.control.messages")

    transition(mode="out-in" enter-active-class="animate__animated animate__slideInLeft" leave-active-class="animate__animated animate__slideOutLeft" )
      People(:key="display.people.message" :data="display.people" v-if="display.control.people")

    Title(:data="display.title" :control="display.control")

    transition(enter-active-class="animation slide-in-up" leave-active-class="animation slide-out-down" mode="out-in")
      Ticker( :data="display.ticker" v-if="display.control.ticker")

    transition(:key="display.control.content" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__fast")
      Content(:data="display.content" v-if="display.control.content" :current="display.control.currentcontent")

    Watermark(v-if="display.control.watermark" :data="display.watermark")
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
// import firebase from 'firebase';
import Tweets from './Tweets';
import Ticker from './Ticker';
import People from './People';
import Time from './Time';
import Watermark from './Watermark';
import Content from './Content';
import Title from './Title';

const alldisplays = db.ref('displays');

export default {
  name: 'Display',
  props:['id','userid' ],
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
    Content,
    Title
  },
  computed:{
    allstyles(){
      let local = {
        '--main-background':this.colors.bgcolor,
        '--primary':this.colors.primary
      };
      return local;
    },
    colors(){
      if (this.display.config && this.display.config.colors)
      {
        return this.display.config.colors;
      }
      else
      {
        return {
          bgcolor:'green',
          primary:'red'
        }
      }
    }
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      async handler(id) {
        await this.$rtdbBind('display', alldisplays.child(this.userid).child(id));
        // console.log(this.display); 
      },
    },
  }
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

<style scoped>
.widescreen {
  width:1280px;
  height:720px;
  overflow: hidden;
  position:relative;
  background:#00ff00;
  outline: solid white 5px;
  z-index:-1;
  /* background:transparent; */
}

body {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin:0;
  padding:0; */
  /* background:rgb(0,255,0); */
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

