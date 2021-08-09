<template lang="pug">
.content_wrapper
  .content(v-if="data" :class="content.itemtype" v-for="(content,index) in data" v-bind:style="{top: offset + (index-current)*720+'px'}")
    .column.justify-center.full-height.items-end
      .col-auto(v-if="content.itemtype=='image'")
        .imagec
          //- .column
            //- .col
          img(:src="content.image" basic cover)
            //- .col
          .caption(v-if="content.caption") {{content.caption}}

      .col-auto(v-if="content.itemtype=='message'")
        .text()
          .message {{content.message}}
          .caption {{content.caption}}
</template>

<script>
export default {
  name: "Content",
  data() {
    return {
      offset: 0,
    };
  },
  props: {
    data: Array,
    current: Number,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap");
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.content {
  position: absolute;
  height: 720px;
  // background: green;
  width: 480px;
  // height: 100%;
  z-index: -3;
  right: 20px;
  font-size: 30px;
  line-height: 60px;

  transition: top 2s;
  // background: red;

  // transform: perspective(1500px) rotateY(-15deg);
  transform: perspective(1500px) rotateY(-15deg);
}

// .persona {
//   border-radius: 20px;
//   background: white;
//   padding: 20px;
//   min-height: 190px;
//   font-family: Titillium Web;

//   .p_img {
//     width: 150px;
//     border-radius: 50%;
//     height: 150px;
//     float: right;
//   }

//   .p_text {
//     line-height: 40px;
//     color: darkslategray;
//     word-wrap: break-word;
//   }

//   .p_caption {
//     color: var(--primary);
//   }
// }

.message {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text {
  .message {
    max-width: 550px;
    min-width: 200px;
    border-left: 1px solid white;
    border-right: 1px solid white;
    padding: 20px;
    // margin-top: auto;
    // margin-bottom: auto;
    color: white;
    text-align: center;
    font-size: 0.9em;
    line-height: 1.3em;
    word-wrap: break-word;
    display: inline-block;
    background: rgba(0, 0, 0, 0.2);
  }

  .caption {
    text-align: center;
    font-size: 0.5em;
    margin-top: -20px;
  }
}

.imagec {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // margin-top: 20%;
  // margin-bottom: 60px;
  text-align: center;
  border: 5px solid white;
  box-shadow: 0px 0px 20px #00000077;
  background: white;
  border-radius: 1px;
  background: white;
  // max-height: 500px;
  // max-height: 400px;
  // max-height: 200px;
  max-width: 320px;
  line-height: 0px;

  img {
    // max-height: 420px;
    // max-width: 400px;
    width: 100%;
    // max-height: 390px;
  }

  .caption {
    background: white;
    color: black;
    // padding-top:10px;
    // min-height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    // margin-top: -10px;
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
