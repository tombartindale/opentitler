<template lang="pug">
div
  ZoomSenseData(:token="token" v-on:zoomsense:loading="loadingchanged" v-on:zoomsense:loaded="loaded" v-on:zoomsense:tokenerror="tokenerror" v-on:zoomsense:error="error")
  div(v-show="settings")
    p #[a(href="https://zoomsense.io") ZoomSense] integration requires you to set up ZoomSense for broadcast prior to the event starting.
    p Paste the &ldquo;Anonymous access token&rdquo; generated when sharing your meeting in ZoomSense.
    q-input(v-model="mytoken" label="ZoomSense Token" clearable)
    .text-danger {{tokenerrormsg}}
  div(v-show="showcontent")
    q-list.col
      q-item
        q-item-section
          q-item-label.text-uppercase Zoom Messages for {{meetinginfo.topic}}
      .text-center(v-show="loading")
        q-spinner-dots(size="3em")
      q-separator
      q-item(clickable v-ripple v-for="(content,index) of ordered" @click="addmessage(content,false)" :key="JSON.stringify(content)")
        q-item-section
          q-item-label.overflow-hidden {{content.msg}}
          q-item-label(caption) {{content.msgSenderName}} - {{ts(content.timestamp).format('h:mma')}}
        q-item-section(side)
          q-btn(flat icon="monitor" @click.capture.stop="addmessage(content,true)")
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
          loading: true,
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
    // data: Object
    'token',
    'settings',
    'showcontent'
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
      ts(time){
        return moment(time);
      }
    //   async signInAnonymously() {
    //   if (!this.token) {
    //     console.log("Missing Token...");
    //     return;
    //   }

    //     console.log('logging in')

    //   let curMeetingid;
    //   let curHostuid;
    //   auth
    //     .signInAnonymously()
    //     .then(async (loginData) => {
    //       this.user = loginData.user;
    //     //   this.$cookies.set("user", loginData.user, "1d");

    //       // Read result of the decryptToken Function
    //       const result = await decryptToken({ token: this.token });
    //       const { meetingid, hostuid } = result.data;
    //       curMeetingid = meetingid;
    //       curHostuid = hostuid;
    //       const anonymousSession = {
    //         hostuid: curHostuid,
    //         meetingid: curMeetingid,
    //       };
    //       this.meetinginfo = anonymousSession;
    //     //   console.log(anonymousSession);
    //     //   this.$cookies.set("anonymous", anonymousSession, "1d");
    //       return loginData.user.getIdToken();
    //     })
    //     .then(async () => {

    //         // console.log(idToken);
    //     //   this.$cookies.set("session", idToken, "1d");
    //       await zs
    //         .ref(`/anonymous/users/${this.user.uid}/hosts/${curHostuid}`)
    //         .set({ createdAt: new Date().getTime() });
    //       await zs
    //         .ref(`/anonymous/users/${this.user.uid}/meetings/${curMeetingid}`)
    //         .set({ createdAt: new Date().getTime() });
    //     //   EventBus.$emit("logged-in");

    //         await this.$rtdbBind('zoomsense', zsense.child('chats').child(this.meetinginfo.meetingid).child('ZoomSensor_1'));
    //         this.loading = false;

    //     //   this.$router.push("/" + curMeetingid);

    //     })
    //     .catch((error) => {
    //       console.log("Error " + error.code + ": " + error.message);
    //     //   return this.$router.push("/");
    //     });
    // }
  }
}
</script>

<style scoped>
a {
    color:white;
}
</style>
