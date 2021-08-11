<template lang="pug">
.row.bg-grey-10.q-mt-sm.q-ml-sm
  .col-12
    .row
      .col-12.col-sm-6.q-pr-sm
        q-btn-toggle(v-model="playstate" :options="playstates" outline)
        q-icon.on-right(name="help_outline" size="sm" color="grey-8")
          q-tooltip When using Zoom, you need to share you Computer Audio (under advanced sharing)
      .col-12.col-sm-6.q-pr-sm.text-right
        q-chip(:key="track.url" :color="trackColor(index)"  clickable @click="playTrack(index)" outline v-for="(track,index) in bedtracks")
          span(v-if="!errors[index]") {{index+1}}
          q-icon(v-if="errors[index]" name="warning" color="yellow")
          q-tooltip {{track.name || 'Track '+(index+1)}} 

  .col-12
    .row.q-mt-sm
      .col-auto
        q-icon(name="volume_up" size="lg" :color="(!isPlaying)?'white':'red'")
      .col.q-mr-md
        q-media-player(ref="theplayer" @error="error" @ready="checkPlay()" @paused="isPlaying=false" @playing="isPlaying=true" hide-volume-btn hide-play-btn hide-volume-slider hide-settings-btn background-color="grey-10" dense disabled-seek loop no-video type="audio" :source="currentsrc" :volume="volume")
</template>
<script>
// https://github.com/vueuse/sound

import { filter } from "lodash";
import { db } from "../lib/db";
const alldisplays = db.ref("displays");

export default {
  name: "AudioPlayer",
  props: ["id", "uid"],
  mounted() {
    window.addEventListener("beforeunload", (event) => {
      if (!this.isPlaying) return;
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "Audio is playing, really refresh?";
    });
  },
  data: () => {
    return {
      audio: [],
      volume: 80,
      currentsrc: "",
      currentindex: 0,
      playstate: 0,
      isPlaying: false,
      errors: {},
      playstates: [
        { label: "Stopped", value: 0 },
        { label: "Bed Track", value: 1 },
        // { label: "Bed Track (Ducked)", value: 2 },
        { label: "Primary", value: 3 },
      ],
    };
  },
  methods: {
    nextTrack() {
      if (this.currentindex < this.bedtracks.length - 1) this.currentindex++;
      else this.currentindex = 0;

      this.currentsrc = this.bedtracks[this.currentindex].url;
    },
    playTrack(index) {
      this.currentindex = index;
      this.currentsrc = this.bedtracks[this.currentindex].url;
    },
    trackColor(index) {
      if (this.currentindex == index && this.isPlaying) return "red";
      if (this.currentindex == index) return "primary";
      else return "white";
    },
    checkPlay() {
      // console.log("canplay");
      if (this.playstate > 0) this.$refs.theplayer.play();
    },
    error(err) {
      try {
        this.$set(this.errors, this.currentindex, err.message);
        // this.errors[this.currentindex] = err.message;
        // console.log(err.message);
      } catch (e) {
        console.log(e);
      }
    },
  },
  watch: {
    audio: {
      handler() {
        this.errors = {};
      },
    },
    playstate: {
      handler() {
        switch (this.playstate) {
          case 0:
            this.$refs.theplayer.pause();
            break;

          case 1:
            this.$refs.theplayer.play();
            this.volume = 30;
            break;

          case 2:
            this.volume = 30;
            this.$refs.theplayer.play();
            break;

          case 3:
            this.volume = 80;
            this.$refs.theplayer.play();
            break;
        }
      },
    },
    id: {
      immediate: true,
      async handler() {
        await this.$rtdbBind(
          "audio",
          alldisplays
            .child(this.uid)
            .child(this.id)
            .child("draft")
            .child("audio")
        );

        try {
          this.currentindex = 0;
          this.currentsrc = this.bedtracks[this.currentindex].url;
        } catch (e) {
          // console.log(e);
          //dont do anything
        }
      },
    },
  },
  computed: {
    bedtracks() {
      return filter(this.audio, { bed: true });
    },
  },
};
</script>
<style lang="scss">
.q-media__controls {
  background-color: transparent !important;
}
</style>
