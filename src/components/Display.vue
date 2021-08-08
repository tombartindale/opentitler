<template lang="pug">
div
  .rightclear
  .bottomclear
  .widescreen(v-if="display.config" :class="{ showclassname:display.control.debug}" :style="allstyles")
    v-style {{display.config.style}}

    transition(mode="out-in" enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight" )
      People(v-cname :key="display.people.name" :data="display.people" v-if="display.control.people")

    Title(v-cname :data="display.title" :control="display.control")

    Ticker(v-cname  :data="display.ticker" :control="display.control")

    transition(:key="display.control.content" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__fast")
      Content(v-cname :data="display.content" v-if="display.control.content" :current="display.control.currentcontent")

    Watermark(v-cname v-if="display.control.watermark" :data="display.watermark")

    //- iframe(id="myiframe" src="https://docs.google.com/presentation/d/e/2PACX-1vSXznFxQ0laAhrIzglQNo_OGQgiKc27RSVfRCR_CThAduk_DluVznyGcKzb9gqJhA/embed?rm=minimal&start=false&loop=false" frameborder="0" width="960" height="569")

    .live(v-if="display.control.watermarktext")
      div {{display.watermarktext}}
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
import StyleVars from './../mixins/StyleVars';
import {find} from 'lodash';

const alldisplays = db.ref('displays');

export default {
  name: 'Display',
  props:['id','userid' ],
  mixins:[StyleVars],
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
      let returns = {};
      this.stylevars.forEach(el => {
        returns[`--${el.name}`] = `${this.styleconfig(el.name)}${(el.type=='numeric')?'px':''}`;
      });

      console.log(returns);
      return returns;
    },
    
  },
  methods:{
    styleconfig(name){
      if (this.display.config && this.display.config.stylevars && this.display.config.stylevars[name])
      {
        return this.display.config.stylevars[name];
      }
      else
      {
        return find(this.stylevars,{name:name}).default;
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
  outline: solid yellow 5px;
  z-index:-1;
  // background:green;
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
  right:14px;
  top:10px;
  
  // border:solid 1px var(--primary);
  // padding-left:115px;
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

.rightclear {
  background-color: #333;
  position:absolute;
  top:0;
  left:1285px;
  bottom:0;
  right:0;
}
.bottomclear {
  background-color: #333;
  position:absolute;
  top:725px;
  left:0;
  bottom:0;
  right:0;
}
</style>

