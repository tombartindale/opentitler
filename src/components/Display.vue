<template lang="pug">
.widescreen(v-if="display.config" :class="{ showclassname:display.control.debug}" :style="allstyles")
  v-style {{display.config.style}}

  transition(mode="out-in" enter-active-class="animate__animated animate__slideInLeft" leave-active-class="animate__animated animate__slideOutLeft" )
    People(v-cname :key="display.people.name" :data="display.people" v-if="display.control.people")

  Title(v-cname :data="display.title" :control="display.control")

  Ticker(v-cname  :data="display.ticker" :control="display.control")

  transition(:key="display.control.content" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__fast")
    Content(v-cname :data="display.content" v-if="display.control.content" :current="display.control.currentcontent")

  Watermark(v-cname v-if="display.control.watermark" :data="display.watermark")

  .live()
    div LIVE
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

<style lang="scss">
.widescreen {
  width:1280px;
  height:720px;
  overflow: hidden;
  position:relative;
  // background:#00ff00;
  outline: solid white 5px;
  z-index:-1;
  // background:green;
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

.live {
  
  color:white;
  position: absolute;
  left:10px;
  top:15px;
  
  border:solid 1px var(--primary);
  padding-left:115px;
  div {
    display:inline-block;
    background: var(--primary);
    padding:5px;
    padding-left:10px;
    padding-right:10px;
  }
}

.classlabel {
  position:absolute;
  left:0;
  top:0;
  z-index: 1000;
  display: none;
  background: red;
  padding-left:2px;
  padding-right:2px;
  font-size: 8pt;
  line-height: 15px;
  // height:20px;
  opacity: 0.2;
}


.showclassname {
  .classlabel {
    display: block !important;
  }
  .classborder {
   // box-shadow: 0px 3px 0px red inset; 
    outline:2px solid red;
    outline-offset: -2px;
    
    &:hover {
      cursor: pointer;
      .classlabel {
        opacity: 1;
        
      }
    }

    // &:hover {
      // opacity: 1;
      // }
  }
}
</style>

