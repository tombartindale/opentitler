<template lang="pug">
.title_box
  transition(mode="out-in" enter-active-class="animate__animated animate__slideInUp" leave-active-class="animate__animated animate__slideOutDown" )
    .titles(v-if="control.title" :key="control.title")
      transition(name="fade-in" mode="out-in")
        .subtitle(v-cname :key="data.subtitle") {{data.subtitle}}
      .title(v-cname :style="style")
        transition(name="fade-in" mode="out-in" v-on:after-leave="afterenter")
          span(:key="data.title") {{data.title}}
</template>

<script>
export default {
  name: "Title",
  props: {
    data: Object,
    control: Object,
  },
  data() {
    return {
      style: {
        "font-size": `30px`,
      },
    };
  },
  methods: {
    afterenter() {
      // console.log('changefont')
      // console.log(this.data);

      //now set font
      this.style = this.calcfont();
    },
    calcfont() {
      let fontsize = 30;

      let charcount = this.data.title.length;
      // console.log('chars',charcount)

      if (charcount > 100) fontsize = 20;

      if (charcount > 400) fontsize = 17;

      return {
        "font-size": `${fontsize}px`,
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.title_box {
  position: absolute;
  left: 15px;
  bottom: 45px;
  overflow: hidden;
  filter: drop-shadow(0 0 var(--shadow-depth) var(--shadow-color));
  font-family: var(--font);
}

.title {
  padding: 5px;
  width: 1250px;
  color: var(--textlight);
  z-index: 2;
  text-transform: uppercase;
  font-weight: bold;
  text-align: right;
  border-right: var(--primary) solid 5px;
  /* box-shadow: 0px 0px 10px #00000077; */

  // font-size: 2rem;

  background: var(--background);

  border-radius: var(--corners) 0 0 0;
}
.subtitle {
  background: var(--primary);
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  color: var(--textdark);
  display: inline-block;
  font-size: 1.4rem;
  text-transform: uppercase;
  vertical-align: bottom;
  border-radius: var(--corners) var(--corners) 0 0;
}

.titles {
  text-align: right;
}
</style>
