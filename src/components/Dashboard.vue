<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-primary.text-white(elevated height-hint="98")
    q-toolbar
      q-toolbar-title
        q-avatar
          q-icon(name="web")
        | Displays for {{userid.email}}
      div {{version}}
      q-btn(flat right @click="logout" icon="logout")

  q-page-container
    q-page(padding)
      .row.justify-center
        .col-xs-12.col-lg-10.col-xl-8
          q-banner(bordered rounded).text-white.q-mb-lg.q-pa-md.text-center
            .text-body1.bigtext.q-mb-md.text-secondary Each Display is an independently controllable titles environment. These can be used easily to augment an existing live streaming session such as Zoom or Skype.
            //- template(v-slot:action)
            .text-center
              q-btn(outline @click="showInstructions" size="lg") How to Setup
            
          .row.q-my-sm
            .col.text-center
              .text-h5.q-mb-md My Displays

              q-spinner-dots(color="primary" size="3em" v-if="loading")
          .row.q-col-gutter-md(v-if="!loading").justify-center
            .col-xs-12(v-for="(display,index) in displays" outlined v-if="display.name") 
              q-card(bordered flat)
                q-card-section(horizontal)
                  //- q-card-section
                  //-   q-icon(name="o_call_to_action" size="100px")
                  q-card-section.col.self-center
                    .text-h4 {{display.name}}
                    .text-subtitle.text-grey-7 {{timeFrom(display.lastTouched) || 'Never'}}
                  q-separator(inset vertical)
                  q-card-section.text-center.self-center
                    q-btn(flat size="xl" stack icon="link" @click="currentindex=index;showConnect=true") Connect
                    q-dialog(v-model="showConnect")
                      q-card(style="width: 700px; max-width: 80vw;")
                        q-card-section
                          .text-h6 Link for Browser Source in OBS
                        q-separator
                        q-card-section.text-center
                          p Copy the following link and paste it into the URL input box in the 'Browser Source' settings in OBS. 
                            q-btn(dense flat @click="showConnect=false;showInstructions()") Help setting up OBS.
                          q-input.col.q-mb-lg(readonly outlined type="text" :value="geturl(currentindex)" size="xl")
                            q-tooltip Copy this link and paste into an OBS Browser Source.
                            template(v-slot:prepend)
                              q-icon(name="link")
                            template(v-slot:append)
                              q-btn(color="primary" @click="copyLink(geturl(index))" icon="content_copy")
                            
                          q-img(src="/img/obs6.png" contain)
                        q-separator
                        q-card-actions.text-teal(align='right')
                          q-btn(flat v-close-popup) OK
                  q-separator(vertical inset)
                  q-card-section.text-center.self-center
                    q-btn(flat :to="'/control/'+index" size="xl" stack icon="tune") Controls

                  q-separator(vertical)
                  q-card-actions(vertical)
                    //- q-btn(icon="more_horiz" flat)
                    q-btn(clickable flat :to="'/display/'+userid.uid+'/'+index" icon="computer")
                      q-tooltip View Live Display
                    q-btn(clickable flat icon="person_add" @click="getShareLink(index)"
          :disable="getLinkLoading",)
                      q-tooltip Share Control
                    q-btn(clickable flat @click="copy(index)" icon="content_copy")
                      q-tooltip Copy
                    q-btn(clickable flat @click="remove(index)" icon="o_delete")
                      q-tooltip Delete

            .col-auto
              q-btn(flat @click="add" size="xl" stack)
                q-icon(name="add")
                .text-h6 Add New Display
  q-dialog(v-model="shareCard")
    q-card
      q-card-section.col.items-center
        .text-h6 {{ tokenSuccess ? 'Successfully Copied Share Link' : 'Copy and Share the Following Link' }}
      q-separator
      q-card-section
        p Share this link with someone to give them access to control this display.
        q-input(readonly, :value="token" outlined)
      q-separator
      q-card-actions(align="right")
        q-btn(flat, label="OK", color="primary", v-close-popup)
      q-inner-loading.darker(:showing="getLinkLoading")
  </template>

<script>
import { db } from "../lib/db";
import firebase from "firebase/app";
import HowTo from "./HowTo.vue";
import { DateTime } from "luxon";
import { sortBy } from "lodash";
import { copyToClipboard } from "quasar";
const generateLink = firebase.functions().httpsCallable("generateLink");
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
      showConnect: false,
      loading: true,
      token: "",
      shareCard: false,
      tokenSuccess: false,
      getLinkLoading: false,
      currentindex: 0,
    };
  },
  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    },
    userid() {
      return firebase.auth().currentUser;
    },
    alldisplays() {
      return sortBy(this.displays, "lastTouched.seconds");
    },
  },
  methods: {
    async getShareLink(id) {
      try {
        this.token = "";
        this.shareCard = true;
        this.getLinkLoading = true;
        // Read result of the generateLink Function
        const result = await generateLink({
          displayid: id,
          userid: this.userid.uid,
        });
        this.token = `${process.env.VUE_APP_REDIRECT}/#/anon?token=${result.data}`;
        copyToClipboard(this.token).then(
          () => {
            // Copy successful
            this.tokenSuccess = true;
          },
          () => {
            // Copy failed
            this.tokenSuccess = false;
          }
        );
        this.getLinkLoading = false;
      } catch (error) {
        console.log("Error " + error.code + ": " + error.message);
        return this.$router.push("/");
      }
    },
    async copyLink(link) {
      await copyToClipboard(link);
      this.$q.notify("Linked copied to clipboard!");
    },
    timeFrom(now) {
      if (now && now.seconds)
        return DateTime.fromSeconds(now.seconds).toRelative();
      else return null;
    },
    showInstructions() {
      this.$q.dialog({
        component: HowTo,
      });
    },
    remove(index) {
      console.log(index);
      this.$q
        .dialog({
          title: "Confirm",
          message: "Really delete this Display?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$firebaseRefs.displays.child(index).remove();
        });
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
        lastTouched: firebase.firestore.Timestamp.fromDate(new Date()),
      });

      this.$router.push("/control/" + index.getKey());
    },
  },
  async mounted() {
    // console.log(this.userid);
    await this.$rtdbBind(
      "displays",
      alldisplays.child(this.userid.uid).orderByChild("lastTouched")
    );
    this.loading = false;
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

.bigtext {
  font-size: 1.6em;
}
</style>
