<template lang="pug">
div
  ZoomSenseData(:token="token" v-on:zoomsense:loading="loadingchanged" v-on:zoomsense:loaded="loaded" v-on:zoomsense:tokenerror="tokenerror" v-on:zoomsense:error="error")
  div(v-show="settings")
    p #[a(href="https://zoomsense.io") ZoomSense] integration requires you to set up ZoomSense for broadcast prior to the event starting.
    p Paste the &ldquo;Anonymous access token&rdquo; generated when sharing your meeting in ZoomSense.
    q-input(v-model="mytoken" label="ZoomSense Token" clearable)
    .text-negative {{tokenerrormsg}}
  div(v-show="showcontent")
    q-list.col
      q-item
        q-item-section
          q-item-label.text-uppercase Zoom Messages for {{meetinginfo.topic}}
        q-item-section(side)
          q-btn-toggle(v-model="control.zoomsense_autodisplay" :options="displayoptions" outline)
      q-separator          
      .text-center(v-show="loading")
        q-spinner-dots(size="3em")
      q-item(clickable v-ripple v-for="(content,index) of ordered" :key="JSON.stringify(content)")
        q-item-section
          q-item-label.overflow-hidden {{content.msg}}
          q-item-label(caption) {{content.msgSenderName}} - {{ts(content.timestamp).format('h:mma')}}
        q-item-section(side)
          q-btn(flat icon="ballot" @click.capture.stop="addmessage(content,control.zoomsense_autodisplay)")
        q-item-section(side)
          q-btn(flat icon="title" @click.capture.stop="addtitle(content,control.zoomsense_autodisplay)")


</template>

<script>
import moment from 'moment';

export default {
  name: 'ZoomSense',
  data(){
      return {
          zoomsense:{},
          meetinginfo:{},
          mytoken: this.token,
          loading:true,
           displayoptions:[
            {label:'Display',value:true},
            {label:'Add',value:false}
            ],
          tokenerrormsg:''
      }
  },
  created(){
      
  },
  computed: {
      tok(){
          return this.token;
      },
      ordered(){
          return Object.values(this.zoomsense).sort((a, b) => a.timestamp - b.timestamp);
      }
  },
  props: [
    'token',
    'settings',
    'showcontent',
    'control'
  ],
  watch:{
      mytoken(val){
          this.$emit('update:token',val);
      }
  },
  methods:{
      tokenerror(error){
          this.tokenerrormsg = error;
      },
      error(error){
          console.log(error);
      },
      loadingchanged(isloading){
          this.loading = isloading;
      },
      loaded(data){
          this.tokenerrormsg = '';
          this.meetinginfo = data.meeting;
          this.$rtdbBind('zoomsense', data.fbpath);
      },
      addmessage(msg,display){
        this.$emit('new:message',{
            itemtype:'message',
            message: msg.msg,
            caption: msg.msgSenderName
        },display);
      },
      addtitle(msg,display)
      {
          this.$emit('new:title',{
            title: msg.msg + '. From ' + msg.msgSenderName,
            subtitle: 'Zoom Message'
        },display);
      },
      ts(time){
        return moment(time);
      }
  }
}
</script>

<style scoped>
a {
    color:white;
}
</style>
