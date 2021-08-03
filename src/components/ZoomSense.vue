<template lang="pug">
div.full-height
  ZoomSenseConnection(
    :token="token",
    v-on:zoomsense:loading="loadingchanged",
    v-on:zoomsense:loaded="loaded",
    v-on:zoomsense:tokenerror="tokenerror",
    v-on:zoomsense:error="error"
  )
  div(v-show="settings")
    p #[a(href="https://zoomsense.io") ZoomSense] integration requires you to set up ZoomSense for broadcast prior to the event starting.
    p Paste the &ldquo;Anonymous access token&rdquo; generated when sharing your meeting in ZoomSense.
    q-input(v-model="mytoken", label="ZoomSense Token", clearable outlined)
    .text-negative {{ tokenerrormsg }}
    .q-mt-lg
      q-toggle.on-right(
        label="Automatic Person Titles from Zoom"
        v-model="control.zoomsense_autotitles",
      )
      br
      q-toggle.on-right(
        label="Messages as Titles or Content"
        v-model="control.zoomsense_titles",
      )
  div.relative.full-height(v-show="showcontent && control.zoomsense_titles")
    
    q-item
      q-item-section(side)
        q-icon(name="img:/img/zoom.svg" size="lg")
      q-item-section(side)
        q-item-label.text-uppercase {{ meetinginfo.topic }}
      q-item-section
      q-item-section(side)
        q-toggle(
          v-model="control.zoomsense_autodisplay",
          outline
          label="Immediate Display"
          left-label
        )
    q-separator 

    .text-center(v-show="loading && mytoken")
      q-spinner-dots(size="3em")

    .text-center(v-if="!mytoken").q-pt-lg
      q-btn(@click="$emit('gotoconfig')" color="primary") Configure ZoomSense
    q-scroll-area.full-height.q-pb-xl
      div(v-for="(content,index) of ordered",
        :key="JSON.stringify(content)")
        q-item(

        )
          q-item-section
            q-item-label.overflow-hidden {{ content.msg }}
            q-item-label(caption) {{ content.msgSenderName }} - {{ ts(content.timestamp).format('h:mma') }}
              //- q-item-section(side top)
          q-item-section(side)
            q-btn.tinted(
              flat,
              icon="img:/img/card.svg",
              @click.capture.stop="addmessage(content, control.zoomsense_autodisplay)"
            )
              q-tooltip Add as Card
            q-btn(
              flat,
              icon="img:/img/title.svg",
              @click.capture.stop="addtitle(content, control.zoomsense_autodisplay)"
            )
              q-tooltip Add as Title
        q-separator
</template>

<script>
import moment from "moment";

export default {
  name: "ZoomSense",
  data() {
    return {
      zoomsense: {},
      meetinginfo: {},
      mytoken: this.token,
      activity: {},
      loading: true,
      users: {},
      displayoptions: [
        { label: "Display", value: true },
        { label: "Add", value: false },
      ],
      titleoptions: [
        { label: "On", value: true },
        { label: "Off", value: false },
      ],
      tokenerrormsg: "",
    };
  },
  created() {},
  computed: {
    tok() {
      return this.token;
    },
    ordered() {
      return Object.values(this.zoomsense).sort(
        (a, b) => a.timestamp - b.timestamp
      );
    },
  },
  props: ["token", "settings", "showcontent", "control"],
  watch: {
    mytoken(val) {
      this.$emit("update:token", val);
    },
    activity: {
      deep: true,
      handler() {
        if (this.control.zoomsense_autotitles) {
          //last person talking (and have been talking for more than xx seconds)
          let key = Object.keys(this.activity)[0];
          let obj = this.activity[key];
          if (obj && obj.zoomid) {
            //get first person:
            let uid = obj.zoomid[0];
            if (this.users[uid]) {
              let username = this.users[uid].username;
              this.$emit("update:person", { name: username });
            }
            //AND

            //did not change the notification really recently

            ///xxx seconds of silence -- reset?
          }
        }
      },
    },
  },
  methods: {
    tokenerror(error) {
      this.tokenerrormsg = error;
    },
    error(error) {
      console.log(error);
    },
    loadingchanged(isloading) {
      this.loading = isloading;
    },
    loaded(data) {
      this.tokenerrormsg = "";
      this.meetinginfo = data.meeting;

      this.$rtdbBind(
        "zoomsense",
        data.data
          .child("chats")
          .child(this.meetinginfo.meetingid)
          .child("ZoomSensor_1")
      );
      this.$rtdbBind(
        "activity",
        data.data
          .child("activeSpeakers")
          .child(this.meetinginfo.meetingid)
          .child("ZoomSensor_1/current/activeHistory")
          .limitToLast(1)
      );
      this.$rtdbBind(
        "users",
        data.data
          .child("activeSpeakers")
          .child(this.meetinginfo.meetingid)
          .child("ZoomSensor_1/current/userList")
      );
    },
    addmessage(msg, display) {
      this.$emit(
        "new:message",
        {
          itemtype: "message",
          message: msg.msg,
          caption: msg.msgSenderName,
        },
        display
      );
    },
    addtitle(msg, display) {
      this.$emit(
        "new:title",
        {
          title: msg.msg + ". From " + msg.msgSenderName,
          subtitle: "Zoom Message",
        },
        display
      );
    },
    ts(time) {
      return moment(time);
    },
  },
};
</script>

<style scoped>
a {
  color: white;
}
</style>
