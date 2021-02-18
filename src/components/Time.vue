<template lang="pug">
.time {{ nowTime | moment('h:mm a') }}
</template>

<script>
export default {
  name: 'Time',
  data() {
    return{
      nowTime:""
    }
  },
  created() {
    this.nowTimes();
  },
  methods:{
    nowTimes(){
      this.timeFormate(Date.now());
      setTimeout(this.nowTimes,1*1000);
    },
    timeFormate(timeStamp) {
      this.nowTime = timeStamp;
    },
  },
  mounted(){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.time {
  position: absolute;
  right:0px;
  bottom:0px;
  text-align: center;
  color:white;
  font-size: 1.2rem;
  line-height:30px;
  background: black;
  width:180px;

  /* box-shadow: 0px 0px 10px #00000077; */
}
</style>
