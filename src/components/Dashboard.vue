<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-primary.text-white(elevated height-hint="98")
    q-toolbar
      q-toolbar-title
        q-avatar
          q-icon(name="web")
        | Displays for {{userid.email}}
      q-btn(flat right @click="logout") Logout

  q-page-container
    q-page(padding)
      
      q-banner.bg-primary.text-white.q-mb-lg
        .text-body1.q-mb-md Each of the following is an independently controllable titles environment. These can be used easily to augment an existing live streaming session such as Zoom or Skype.
        template(v-slot:action)
          q-btn(outline @click="showInstructions = true" ) Find Out How
      
      q-dialog(v-model="showInstructions" full-width)
        q-card
          q-card-section
            .text-h6 How to Use Titles
          q-card-section.q-pt-none
            q-timeline(color="secondary").timeline
              q-timeline-entry(title="Install OBS")
                p Firstly, you need to install the free OBS software to the computer that you want to stream from (using something like Zoom or Skype).
                q-btn(type="a" href="https://obsproject.com/") Get OBS Now

              q-timeline-entry(title="Setup Open Titler")
                p Create a new display on this screen, and copy the link on the tile for that display to the clipboard.

              q-timeline-entry(title="Select Virtual Camera Settings")
                p Use the default settings for 'Virtual Camera'
                img(src="/img/obs1.png")

              q-timeline-entry(title="Add Camera Source")
                p Add your camera (that you would normally use) as a source.
                img(src="/img/obs3.png")
                p Select your camera
                img(src="/img/obs4.png")


              q-timeline-entry(title="Add Browser Source")
                p Add a Browser Source
                img(src="/img/obs5.png")
                p Paste the URL copied from this dashboard into the URL input
                img(src="/img/obs6.png")
                p If needed, match the browser source size to the output.
                img(src="/img/obs7.png")

              q-timeline-entry(title="Start Virtual Camera")
                p Start the Virtual Camera
                img(src="/img/obs8.png")

              q-timeline-entry(title="Select Camera in Streaming Software")
                p In Zoom, Skype etc, select the OBS Virtual Camera as your video input
                img(src="/img/obs9.png")
            
          q-card-actions.text-teal(align='right')
            q-btn(flat label='OK' v-close-popup).
        
        
      
      .row.q-col-gutter-md
        .col-md-3.col-sm-4.col-xs-12(v-for="(display,index) in displays" outlined v-if="display.name") 
          q-card
            q-card-section.text-center
              q-btn(flat :to="'/control/'+index" size="xl" stack)
                q-tooltip Control Output
                q-icon(name="tune")
                .text-h6 {{display.name}}
            q-separator
            q-card-actions
              q-input.col(readonly dense outlined type="text" :value="geturl(index)")
              //- q-btn.col-2(flat  icon="monitor")
              //-   q-tooltip Display output
              q-btn(icon="more_horiz")
                q-menu
                  q-item(clickable v-close-popup :to="'/display/'+userid.uid+'/'+index") View
                  q-item(clickable v-close-popup @click="remove(index)") Remove
                  q-item(clickable v-close-popup @click="copy(index)") Copy

        .col-md-3.col-sm-4.col-xs-12(outlined)
          q-card
            q-card-section.text-center
              q-btn(flat @click="add" size="xl" stack)
                q-icon(name="add")
                .text-h6 Add New Display
</template>

<script>
import { db } from "../lib/db";
import firebase from "firebase";
const alldisplays = db.ref("displays");

export default {
  name: "Dashboard",
  props: ["id"],
  created() {
    this.$q.dark.set(true);
  },
  data() {
    return {
      displays: Object,
      showInstructions: false,
    };
  },
  computed: {
    userid() {
      return firebase.auth().currentUser;
    },
  },
  methods: {
    remove(index) {
      this.$firebaseRefs.displays.child(index).remove();
    },
    copy(index) {
      let tmp = this.displays[index];
      tmp.name = tmp.name + " Copy";
      this.$firebaseRefs.displays.push(tmp);
    },
    geturl(id) {
      return (
        document.location.origin + "/#/display/" + this.userid.uid + "/" + id
      );
    },
    async logout() {
      await firebase.auth().signOut();
      this.$router.push("login");
    },
    async add() {
      var index = await this.$firebaseRefs.displays.push({
        name: "New Display",
      });

      this.$router.push("/control/" + index.getKey());
    },
  },
  mounted() {
    // console.log(this.userid);
    this.$rtdbBind("displays", alldisplays.child(this.userid.uid));
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.timeline {
  img {
    max-width: 50%;
    height: auto;
  }
}
</style>
