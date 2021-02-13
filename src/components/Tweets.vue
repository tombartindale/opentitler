<template lang="pug">
.tweets
  transition-group(appear name="fade-in" mode="out-in" tag="div" v-bind:css="false" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave")
    .tweet(v-for="(message, index) in currentmessage" :key="message.message" v-bind:data-index="index")
      .box3.sb13 {{message.message}}
</template>

<script>
// import Velocity from 'velocity';

export default {
  name: 'Tweets',
  props: {
    data: Array
  },
  computed:{
    currentmessage(){
      return this.data
    }
  },
  // methods: {
  //   beforeEnter: function (el) {
  //     el.style.opacity = 0
  //     el.style.height = 0
  //   },
  //   enter: function (el, done) {
  //     var delay = el.dataset.index * 500
  //     setTimeout(function () {
  //       Velocity(
  //         el,
  //         { opacity: 1, height: '1.6em' },
  //         { complete: done }
  //       )
  //     }, delay)
  //   },
  //   leave: function (el, done) {
  //     var delay = el.dataset.index * 500
  //     setTimeout(function () {
  //       Velocity(
  //         el,
  //         { opacity: 0, height: 0 },
  //         { complete: done }
  //       )
  //     }, delay)
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tweets {
  position: absolute;
  right:30px;
  filter: drop-shadow(0 0 10px #00000077);
}

* {
  margin: 0px;
  padding: 0px;
}

.box3 {
  width: 500px;
  margin: 50px auto;
  border-radius: 15px;
  background: #00bfb6;
  color: #fff;
  padding: 20px;
  text-align: center;
  font-weight: 900;
  font-family: arial;
  position: relative;
}


/* speech bubble 13 */

.sb13:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 15px solid #00bfb6;
  border-right: 15px solid transparent;
  border-top: 15px solid #00bfb6;
  border-bottom: 15px solid transparent;
  right: -16px;
  top: 0px;
}

</style>
