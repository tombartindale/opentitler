<template lang="pug">
q-layout(view="hHh lpR fFf")
  //- q - next title
  //- Keypress(key-event="keyup" :preventDefault="true" :modifiers="['altKey','ctrlKey']" :key-code="81" @success="prevTitle")
  //- //- w - prev title
  //- Keypress(key-event="keyup" :preventDefault="true" :modifiers="['altKey','ctrlKey']" :key-code="87" @success="nextTitle")
  //- //- a - prev content
  //- Keypress(key-event="keyup" :preventDefault="true" :modifiers="['altKey','ctrlKey']" :key-code="65" @success="control.currentcontent--;control.content=true;")
  //- //- s - next content
  //- Keypress(key-event="keyup" :preventDefault="true" :modifiers="['altKey','ctrlKey']" :key-code="83" @success="control.currentcontent++;control.content=true;")
  //- //- z - hide content
  //- Keypress(key-event="keyup" :preventDefault="true" :modifiers="['altKey','ctrlKey']" :key-code="90" @success="control.content=false;")
  //- //- x - show content
  //- Keypress(key-event="keyup" :preventDefault="true" :modifiers="['altKey','ctrlKey']" :key-code="88" @success="control.content=true;")
  //- //- ctrl + num - person
  //- Keypress(key-event="keydown" :preventDefault="true" :modifiers="['altKey','ctrlKey']" @success="setPersonKey")

  //- q-header.bg-primary.text-white(elevated height-hint="98")
    //- q-toolbar
      
      //- q-toolbar-title {{display.name}}
  
  q-drawer(v-if="livepeople.length>0" v-model="chatopen" :width="300" side="right" overlay :content-style="{'background-color':'#00000000'}")
    chat(v-on:new:message="onChatMsg" :id="id" :uid="uid")
    q-btn(v-show="chatopen" @click="chatopen=false;" dense round :icon="(chatopen)?'keyboard_arrow_right':'chat'" color="primary" style="bottom:8px;left:-40px;").absolute
  
  q-page-container
    q-page
        .col-auto
          q-tabs(align="left" v-model="tab"  outside-arrows mobile-arrows active-color="primary")
            q-tab(icon="tune" name="control" label="LIVE" )
            q-separator(vertical)
            q-tab(icon="img:/img/title.svg" name="titles" label="Titles")
            q-tab(icon="img:/img/card.svg" name="content" label="Cards")
            q-tab(icon="img:/img/person.svg" name="people" label="People")
            q-tab(icon="img:/img/ticker.svg" name="ticker" label="Ticker")
            q-tab(icon="img:/img/watermark.svg" name="watermark" label="Watermark")
            q-tab(icon="volume_up" name="audio" label="Audio")
            q-tab(icon="group_work" name="plugins" label="Plugins")
            q-tab(icon="style" name="style" label="Settings")
            //- q-tab(icon="help" name="help" label="Help")
            q-space
            q-route-tab(icon="home" to="/dashboard" v-if="!isAnon")

        q-tab-panels.fixed.fixed-left.fixed-right.fixed-bottom(v-model="tab" v-if="loaded" padding style="top:72px;padding-bottom:94px;" keep-alive)
          
          q-tab-panel(name="control")
            .column.fit
              .col
                .column.full-height.q-col-gutter-sm
                  .col-12.col-md-6.colmin
                    div.full-height.roundbox
                      q-list(separator v-if="display")
                        q-item
                          q-item-section(side)
                            q-icon(name="img:/img/title.svg" size="lg")
                          q-item-section(side)
                            q-btn(@click="tab='titles'" dense flat) Manage Titles
                          q-item-section
                          q-item-section(side)
                            q-btn-toggle(v-model="control.title" :options="displayoptions" outline)
                            
                        q-separator
                      q-scroll-area.pad-bottom.full-height(v-if="display.draft && display.draft.titles")
                        div(v-for="(title,index) in display.draft.titles" :key="index")
                          q-item.border-off(:class="{'border-on': control.title && display.title.title == title.title && display.title.subtitle == title.subtitle}" clickable v-ripple  @click="updatetitle(title)")
                            q-item-section(side)
                              q-icon(color="red" :name="(display.title.title == title.title && display.title.subtitle == title.subtitle)?'monitor':''")
                            q-item-section
                              q-item-label {{title.title}}
                              q-item-label(caption) {{title.subtitle}}
                            q-item-section(side)
                              flag(:item="title" :route="`draft/titles/${index}`" :fbref="$firebaseRefs.display")
                          q-separator

                  .col-12.col-md-6.colmin
                    div.full-height.roundbox
                      q-list(separator v-if="display")
                        q-item
                          q-item-section(side)
                            q-icon(name="img:/img/person.svg" size="lg")
                          q-item-section(side)
                            q-btn(@click="tab='people'" dense flat) Manage People
                          q-item-section
                          q-item-section(side)
                            q-btn-toggle(v-model="control.people" :options="displayoptions" outline)
                        q-separator
                        q-item(dense v-if="control.zoomsense_autotitles").bg-accent
                          q-item-section
                            q-item-label Automatically triggered by Zoom
                      q-scroll-area.pad-bottom.full-height(v-if="display.draft && display.draft.people")
                        div(:key="index" v-for="(people,index) in display.draft.people" )
                          q-item.relative.border-off(:class="{'border-on': control.people && display.people.name == people.name && display.people.affiliation == people.affiliation}" @click="fireperson(people)" clickable ripple)
                            q-linear-progress.z-bottom.absolute-left.full-height(style="opacity:0.3" v-show="peopletimer>0 && display.people.name == people.name && display.people.affiliation == people.affiliation" :value="1-(peopletimer/100)")
                            q-item-section(side)
                              q-icon(color="red" name="monitor"  v-if="display.people" v-show="display.people.name == people.name && display.people.affiliation == people.affiliation")
                              q-icon(name="blank" v-show="!(display.people.name == people.name && display.people.affiliation == people.affiliation)")
                            q-item-section
                              q-item-label {{people.name}}
                              q-item-label(caption) {{people.affiliation}}
                            q-item-section(side v-if="people.audio")
                              q-icon(name="audiotrack")
                            q-item-section(side)
                              div
                                q-btn(flat dense icon="monitor" @click.capture.stop="updateperson(people)" color="primary")
                          q-separator

                  .col-12.col-md-6.colmin(v-if="control.zoomsense_titles")
                    div.full-height.roundbox
                      ZoomSense.col(v-on:gotoconfig="tab='plugins'" :control="control" :token="control.zoomsense_token" v-on:update:token="savetoken" v-on:new:message="addmsg" v-on:new:title="addtitle" v-on:update:person="zoomperson" showcontent="true")

                  .col-12.col-md-6.colmin
                    div.full-height.roundbox
                      q-list(separator)
                        q-item
                          q-item-section(side)
                            q-icon(name="img:/img/card.svg" size="lg")
                          q-item-section(side)
                            q-btn(@click="tab='content'" dense flat) Manage Cards
                          q-item-section
                          q-item-section(side)
                            q-btn-toggle( v-model="control.content" :options="displayoptions" outline)
                        q-separator
                      q-list(separator)
                        q-item
                          q-btn-group(spread style="width:100%;")
                            q-btn(dense color="primary" outline @click="prevContent")
                              q-icon(name="expand_less")
                            q-btn(dense disabled outline color="primary") {{control.currentcontent+1}}
                            q-btn(dense color="primary" outline @click="nextContent")
                              q-icon(name="expand_more")

                      q-scroll-area.full-height.pad-bottomxl
                        div(:key="index" v-for="(content,index) in display.content")
                          q-item.border-off(:class="{'border-on': control.content && index == control.currentcontent}"  clickable v-ripple  @click="control.currentcontent = index")
                            q-item-section(side)
                              q-icon(color="red" :name="(index == control.currentcontent)?'monitor':''") 
                            q-item-section(side)
                              q-badge(outline) {{index+1}}
                            q-item-section(side v-if="content.image")
                              q-avatar(square)
                                q-img( :src="content.image" style="border-radius:2px;")
                            q-item-section
                              q-item-label.overflow-hidden {{content.message}}
                              q-item-label {{content.caption}}
                            q-item-section(side)
                              flag(:item="content" :route="`content/${index}`" :fbref="$firebaseRefs.display")
                          q-separator

          q-tab-panel(name="people")
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Introduce specific people using temporary appearing titles.

                q-list(separator)
                  q-item.bg-grey-10
                    q-item-section
                      q-input.q-mb-xs(label="Name" v-model="newperson.name" dense outlined)
                      q-input(label="Affiliation" v-model="newperson.affiliation" dense outlined)
                    q-item-section(side)
                      q-btn(round flat @click="person_add()" icon="add")
                  q-separator
                  div(v-if="display.draft && display.draft.people")
                    draggable(v-model="display.draft.people" group="people" @end="updatepeople" )
                      div.bg-grey-10(:key="index" v-for="(person,index) in display.draft.people")
                        q-item
                          q-item-section(side)
                            q-icon(name="drag_indicator")
                          q-item-section(side)
                            q-btn(round dense flat icon="audiotrack" :color="(person.audio)?'white':'grey-9'" @click="")
                              q-menu(auto-close)
                                q-list(style="min-width: 100px")
                                  q-item(clickable @click="addTriggerAudio(person,null)")
                                    q-item-section No Audio
                                  q-item(clickable @click="addTriggerAudio(person,aud)" :key="index" v-for="(aud,index) in display.draft.audio")
                                    q-item-section {{aud.name || 'Track '+(index+1)}}
                          q-item-section
                            q-item-label {{person.name}}
                            q-item-label(caption) {{person.affiliation}}
                          q-item-section(side)
                            q-btn(round flat @click="person_remove(index)" icon="delete")
                        q-separator
          
          q-tab-panel(name="audio")
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Create a library of audio to play in the background or when triggered.

                q-list(separator)
                  q-item.bg-grey-10
                    q-item-section
                      q-input.q-mb-xs(label="URL" v-model="newaudio.url" dense outlined)
                      q-input.q-mb-xs(label="Name (optional)" v-model="newaudio.name" dense outlined)
                    q-item-section(side)
                      q-btn(round flat @click="audio_add()" icon="add")
                  q-separator
                  div(v-if="display.draft && display.draft.audio")
                    draggable(v-model="display.draft.audio" group="audio" @end="updateaudio" )
                      div.bg-grey-10(:key="index" v-for="(aud,index) in display.draft.audio")
                        q-item
                          q-item-section(side)
                            q-icon(name="drag_indicator")
                          q-item-section(side)
                            q-badge(outline) {{index+1}}
                          q-item-section(side)
                            q-btn(round dense flat :icon="(aud.bed)?'bed':'audiotrack'" @click="toggleBed(aud)")
                              q-tooltip Use as a Bed Track or Sound FX
                          q-item-section
                            q-item-label {{aud.name || 'Track '+(index+1)}}
                            q-item-label(caption) {{aud.url}}
                          q-item-section(side)
                            q-btn(round flat @click="audio_remove(index)" icon="delete")
                        q-separator


          q-tab-panel(name="content")
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Cards are larger media items that are displayed over 50% of the screen.

            .row
              .col-12.col-md-6.offset-md-3
                q-card(flat bordered).bg-grey-10
                  q-card-section
                    q-option-group(inline :options="contenttypes" v-model="newcontent.itemtype")
                    q-input(label="Message" type="text" v-model="newcontent.message" v-if="newcontent.itemtype=='message'")
                    q-input(label="Image URL" type="text" v-model="newcontent.image" v-if="newcontent.itemtype=='image'" hint="Accepts any public URL or Google Drive shared link (Anyone with Link)")
                    q-input(label="Caption" type="text" v-model="newcontent.caption" v-if="newcontent.itemtype=='image'")
                  q-separator
                  q-card-actions(align="right")
                    q-btn(flat @click="content_add()") Add New

                div.q-mt-md(v-if="display.content && display.content" v-for="(content,index) in display.content")
                  q-card.bg-grey-10.full-height.relative(flat bordered)
                    q-chip.absolute-right.z-max(color="secondary" size="md" rounded) {{content.itemtype}}
                    q-img(v-if="content.image" contain :src="content.image")
                      .absolute-bottom.text-subtitle1.text-center {{content.caption}}
                    q-card-section(v-if="content.message").col-auto
                      p {{content.message}}
                    q-separator
                    q-card-actions.col-auto(align="right")
                      q-btn(flat @click="content_remove(index)") Remove
          
          q-tab-panel(name="titles")
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Titles are short form text that is kept displayed on the screen.
                q-list(separator)
                  q-item.bg-grey-10
                    q-item-section
                      q-input.q-mb-xs(label="Title" v-model="newtitle.title" dense outlined)
                      q-input(label="Subtitle" v-model="newtitle.subtitle" dense outlined)
                    q-item-section(side)
                      q-btn(round flat @click="title_add()" icon="add")
                  q-separator
                  div(v-if="display.draft && display.draft.titles")
                    draggable(v-model="display.draft.titles" group="titles" @end="updatetitles" )
                      div.bg-grey-10(:key="index" v-for="(title,index) in display.draft.titles")
                        q-item
                          q-item-section(side)
                            q-icon(name="drag_indicator")
                          q-item-section
                            q-item-label {{title.title}}
                            q-item-label(caption) {{title.subtitle}}
                          q-item-section(side)
                            q-btn(round flat @click="title_remove(index)" icon="delete")
                        q-separator
                

          q-tab-panel(name="ticker")
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Long-form rolling text continuously on the display.
            
                q-timeline
                  q-timeline-entry(subtitle="Display")
                    q-toggle(v-model="control.ticker" val="true"  toggle-color="primary" label="Display ticker")
                  q-timeline-entry(subtitle="Current Display")
                    q-input(disable v-model="display.ticker.message" autogrow outlined dense)
                  q-timeline-entry(subtitle="Edit Content")
                    q-list(separator)
                      q-item.bg-grey-10
                        q-item-section
                          q-input.q-mb-xs(label="New ticker text" v-model="newticker.message" dense outlined)
                        q-item-section(side)
                          q-btn(round flat @click="ticker_add()" icon="add")
                      q-separator
                      div(v-if="display.draft && display.draft.ticker")
                        draggable(v-model="display.draft.ticker" group="ticker" @end="updateticker" )
                          div.bg-grey-10(:key="index" v-for="(ticker,index) in display.draft.ticker")
                            q-item
                              q-item-section(side)
                                q-icon(name="drag_indicator")
                              q-item-section(side)
                                q-checkbox(v-model="ticker.selected" @input="updateticker")
                              q-item-section
                                q-item-label {{ticker.message}}
                              q-item-section(side)
                                q-btn(round flat @click="ticker_remove(index)" icon="delete")
                            q-separator



          q-tab-panel(name="watermark" )
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Semi-transparent overlay in the corner of the display.
                q-timeline
                  q-timeline-entry(subtitle="Display")
                    q-toggle(v-model="control.watermark" val="true" toggle-color="primary" label="Display watermark")
                    q-toggle(v-model="control.watermarktext" val="true" toggle-color="primary" label="Display Live Indicator")
                  q-timeline-entry(subtitle="Live Indicator")
                    q-input(v-model="dirty.watermarktext" label="Live Text" v-on:keyup.enter="updatelive" outlined)
                      template(v-slot:append v-if="dirty.watermarktext != display.watermarktext" )
                        q-avatar
                          q-icon(name="create")

                  q-timeline-entry(subtitle="Update Image")
                    .row.q-my-md
                      q-file.col(
                        v-model="watermarkImg"
                        outlined
                        label="Select an Image"
                        accept=".jpg, image/*")
                      .col-auto
                        .q-mx-lg
                          h5.text-grey OR
                      q-input.col(outlined v-model="dirty.watermark.src" clearable label="Paste a URL" v-on:keyup.enter="updatewatermark" placeholder="paste url or data:url here")
                        template(v-slot:append v-if="dirty.watermark.src != display.watermark.src")
                          q-avatar
                            q-icon(name="create")
                  q-timeline-entry(subtitle="Preview")
                    q-toggle(v-model="showExample" val="true" toggle-color="primary" label="Show Example")
                    .imgdark(:class="{noimg:!showExample}")
                        q-img.watermark(:src="dirty.watermark.src")


          q-tab-panel(name="help")
            .q-px-md.text-center
              q-btn(@click="tab='control'" size="lg" color="primary") Get Started

          q-tab-panel(name="plugins")
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Integration with external tools.
                q-timeline
                  q-timeline-entry( subtitle="ZoomSense")
                    ZoomSense(:token="control.zoomsense_token" :control="control" v-on:update:token="savetoken" settings="false")

          q-tab-panel(name="style")
            .row
              .col-12.col-md-6.offset-md-3
                q-banner(rounded).q-my-md.bg-grey-9
                  template(v-slot:avatar)
                    q-icon(name="o_info" size="lg")
                  .text-body1 Change advanced settings such as branding and style.

              .col-12.col-md-6.offset-md-3(v-if="display.config")
                q-timeline
                  q-timeline-entry(subtitle="Settings")
                    q-input(v-model="dirty.name" label="Display Name" v-on:keyup.enter="updatename" outlined)
                      template(v-slot:append v-if="dirty.name != display.name" )
                        q-avatar
                          q-icon(name="create")

                  q-timeline-entry(subtitle="Adjust Style")
                    .row
                      .col-4(v-for="style of stylevars")
                        div(v-if="style.type=='color'")
                          q-input.on-left(outlined v-model="display.config.stylevars[style.name]" :rules="['anyColor']" :label="style.display")
                            template(v-slot:before)
                              q-avatar(:style="{'background-color':display.config.stylevars[style.name]}" style="border:1px solid silver;" size="xl")
                            template(v-slot:append)
                              q-icon(name="colorize" class="cursor-pointer")
                                q-popup-proxy(transition-show="scale" transition-hide="scale")
                                  q-color(v-model="display.config.stylevars[style.name]" format-model="hex" @input="updatestyle()")

                        div(v-if="style.type=='font'")
                          q-input.on-left(outlined v-model="display.config.stylevars[style.name]" :label="style.display" @input="updatestyle()")

                        div(v-if="style.type=='numeric'")
                          q-input.on-left(outlined v-model.number="display.config.stylevars[style.name]" type="number" suffix="px" :label="style.display" @input="updatestyle()")

                  q-timeline-entry(subtitle="Advanced Formatting")
                    q-input(type="textarea" v-model="display.config.style" outlined label="Style CSS")
                    q-btn(label="Save" @click="savestyle()" outline)

                  q-timeline-entry(subtitle="Display Class Names")
                    q-btn-toggle(v-model="control.debug" :options="displayoptions" outline)

        q-page-sticky(position="bottom-right" :offset="[10,10]" v-if="livepeople.length>0" v-show="!chatopen")
          q-avatar(round icon="person" size="sm").bg-grey-8.q-ml-xs
            q-tooltip {{'Me'}}
          q-avatar(v-for="(person,key) of livepeople" :key="key" round icon="person" size="sm").bg-grey-8.q-ml-xs
            q-tooltip {{'Producer'}}
          q-btn.on-right( :class="{'ring':hasmessages}"   @click="chatopen=true;clearChatMsg();" dense round :icon="(chatopen)?'keyboard_arrow_right':'chat'" color="primary")

        .roundbox.fixed-bottom.q-ma-md
          AudioPlayer(:id="id" :uid="uid")
    
    q-inner-loading(:showing="!loaded")
</template>

<script>
import { db } from "../lib/db";
import firebase from "firebase";
const alldisplays = db.ref("displays");
import draggable from "vuedraggable";
import ZoomSense from "./ZoomSense";
import Keypress from "vue-keypress";
import { DateTime } from "luxon";
import { filter, includes, map } from "lodash";
import Flag from "./Flag.vue";
import StyleVars from "./../mixins/StyleVars";
import Chat from "./Chat.vue";
import AudioPlayer from "./AudioPlayer.vue";
import { Howl } from "howler";
// import * as Tone from 'tone';
// const meter = new Tone.Meter();
// const mic = new Tone.UserMedia();
// mic.open();
// // connect mic to the meter
// mic.connect(meter);
// // the current level of the mic
// setInterval(() => console.log(meter.getValue()), 100);

var timeout;

export default {
  name: "Control",
  components: {
    draggable,
    ZoomSense,
    Keypress,
    Flag,
    Chat,
    AudioPlayer,
  },
  mixins: [StyleVars],
  props: ["id"],
  timers: {
    activeUser: { time: 5000, autostart: true, repeat: true },
  },
  created() {
    this.$q.dark.set(true);
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      chatopen: false,
      zoomsense: {},
      watermarkImg: null,
      showExample: true,
      contenttypes: [
        {
          label: "Message",
          value: "message",
        },
        {
          label: "Image",
          value: "image",
        },
        {
          label: "Video",
          value: "video",
        },
      ],
      displayoptions: [
        { label: "Display", value: true },
        { label: "Hide", value: false },
      ],
      // splitter:5,
      display: {},
      control: {},
      tab: "control",
      peopletimer: 0,
      coutdowntimer: -1,
      dirty: {
        watermark: "",
      },
      newaudio: { url: "" },
      newperson: {
        name: "",
        affiliation: "",
      },
      newtitle: {
        title: "",
        subtitle: "",
      },
      newticker: {
        message: "",
        selected: false,
      },
      newcontent: {
        itemtype: "message",
        message: "",
        image: "",
        caption: "",
      },
      loaded: false,
      hasmessages: false,
      uid: null,
    };
  },
  methods: {
    activeUser() {
      // console.log("save");
      this.$firebaseRefs.display
        .child("activeUsers")
        .child(this.userid.uid)
        .set(DateTime.now().toSeconds());
    },
    onResize() {
      this.colheight = window.innerHeight - 190;
      // console.log(window.innerHeight);
    },
    setPersonKey(key) {
      try {
        let index = key.event.keyCode - 49;
        let person = this.display.draft.people[index];
        if (person) {
          this.fireperson(person);
        }
      } catch {
        //do nothing
      }
    },
    getCurrentTitle() {
      for (let title in this.display.draft.titles) {
        let tt = this.display.draft.titles[title];
        if (
          tt.title == this.display.title.title &&
          tt.subtitle == this.display.title.subtitle
        )
          return parseInt(title);
      }
    },
    prevTitle() {
      let title = this.display.draft.titles[this.getCurrentTitle() - 1];

      if (title) {
        this.$firebaseRefs.display.child("title").set(title);
        this.$firebaseRefs.control.child("title").set(true);
      }
    },
    nextTitle() {
      let title = this.display.draft.titles[this.getCurrentTitle() + 1];

      if (title) {
        this.$firebaseRefs.display.child("title").set(title);
        this.$firebaseRefs.control.child("title").set(true);
      }
    },
    prevContent() {
      if (this.control.currentcontent > 0) this.control.currentcontent--;
    },
    nextContent() {
      if (this.control.currentcontent < this.display.content.length - 1)
        this.control.currentcontent++;
    },
    addmsg(msg, display) {
      this.display.content.push(msg);
      this.$firebaseRefs.display.child("content").set(this.display.content);
      // console.log(Object.keys(this.display.content));
      // console.log(display);
      if (display) {
        // console.log(this.control.currentcontent)
        this.control.currentcontent =
          Object.keys(this.display.content).length - 1;
        this.control.content = true;
      }
    },
    addtitle(title, display) {
      this.display.draft.titles.push(title);
      this.$firebaseRefs.display
        .child("draft")
        .child("titles")
        .set(this.display.draft.titles);
      // console.log(Object.keys(this.display.content));
      // console.log(display);
      if (display) {
        // console.log(this.control.currentcontent)
        this.$firebaseRefs.display.child("title").set(title);
        this.$firebaseRefs.control.child("title").set(true);
      }
    },
    savetoken(val) {
      // console.log('save token',val);
      this.$firebaseRefs.control.child("zoomsense_token").set(val);
    },
    updatetitles() {
      this.$firebaseRefs.display
        .child("draft")
        .child("titles")
        .set(this.display.draft.titles);
    },
    updateaudio() {
      this.$firebaseRefs.display
        .child("draft")
        .child("audio")
        .set(this.display.draft.audio);
    },
    addTriggerAudio(person, audio) {
      // console.log(person);
      // console.log(audio);
      if (audio != null) person.audio = audio.url;
      else person.audio = null;
      this.updatepeople();
    },
    toggleBed(aud) {
      aud.bed = !aud.bed;
      this.updateaudio();
    },
    updatepeople() {
      this.$firebaseRefs.display
        .child("draft")
        .child("people")
        .set(this.display.draft.people);
    },
    updatecontent() {
      this.$firebaseRefs.display.child("content").set(this.display.content);
    },
    updatestyle() {
      this.$firebaseRefs.display
        .child("config")
        .child("stylevars")
        .set(this.display.config.stylevars);
    },
    savestyle() {
      this.$firebaseRefs.display
        .child("config")
        .child("style")
        .set(this.display.config.style);
    },
    content_add() {
      if (!this.display.content) this.display.content = [];

      //google drive share fix:
      //https://drive.google.com/file/d/1n9CixwDn1wDoTsKccpv9b7clPqHJb1jS/view?usp=sharing

      //https://drive.google.com/open?id=DRIVE_FILE_ID
      //https://drive.google.com/uc?id=1n9CixwDn1wDoTsKccpv9b7clPqHJb1jS
      if (includes(this.newcontent.image, "https://drive.google.com/file/d/")) {
        let id = this.newcontent.image
          .replace("https://drive.google.com/file/d/", "")
          .split("/view")[0];
        this.newcontent.image = `https://drive.google.com/uc?id=${id}`;
      }

      this.display.content.push(this.newcontent);
      this.newcontent = {
        itemtype: "message",
        message: "",
        image: "",
        caption: "",
      };
      this.$firebaseRefs.display.child("content").set(this.display.content);
    },
    content_remove(index) {
      // console.log(this.display.draft);
      this.display.content.splice(index, 1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display.child("content").set(this.display.content);
    },
    ticker_add() {
      if (!this.display.draft) this.display.draft = {};

      if (!this.display.draft.ticker) this.display.draft.ticker = [];
      if (this.newticker.message != "") {
        this.display.draft.ticker.push(this.newticker);
        this.newticker = {
          message: "",
          selected: false,
        };
        this.$firebaseRefs.display
          .child("draft")
          .child("ticker")
          .set(this.display.draft.ticker);
      }
    },
    ticker_remove(index) {
      // console.log(this.display.draft);
      this.display.draft.ticker.splice(index, 1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display
        .child("draft")
        .child("ticker")
        .set(this.display.draft.ticker);

      this.updateticker();
    },
    title_add() {
      if (!this.display.draft) this.display.draft = {};

      if (!this.display.draft.titles) this.display.draft.titles = [];
      if (this.newtitle.title != "") {
        this.display.draft.titles.push(this.newtitle);
        this.newtitle = {
          title: "",
          subtitle: "",
        };
        this.$firebaseRefs.display
          .child("draft")
          .child("titles")
          .set(this.display.draft.titles);
      }
    },
    audio_add() {
      if (!this.display.draft) this.display.draft = {};

      if (!this.display.draft.audio) this.display.draft.audio = [];
      if (this.newaudio.url != "") {
        if (includes(this.newaudio.url, "https://drive.google.com/file/d/")) {
          let id = this.newaudio.url
            .replace("https://drive.google.com/file/d/", "")
            .split("/view")[0];
          this.newaudio.url = `https://drive.google.com/uc?id=${id}`;
        }

        this.newaudio.bed = true;

        this.display.draft.audio.push(this.newaudio);
        this.newaudio = {
          url: "",
          name: "",
        };
        this.$firebaseRefs.display
          .child("draft")
          .child("audio")
          .set(this.display.draft.audio);
      }
    },
    audio_remove(index) {
      // console.log(this.display.draft);
      this.display.draft.audio.splice(index, 1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display
        .child("draft")
        .child("audio")
        .set(this.display.draft.audio);
    },
    title_remove(index) {
      // console.log(this.display.draft);
      this.display.draft.titles.splice(index, 1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display
        .child("draft")
        .child("titles")
        .set(this.display.draft.titles);
    },
    person_add() {
      if (!this.display.draft) this.display.draft = {};

      if (!this.display.draft.people) this.display.draft.people = [];

      if (this.newperson.name != "") {
        this.display.draft.people.push(this.newperson);
        this.newperson = {
          name: "",
          affiliation: "",
        };
        this.$firebaseRefs.display
          .child("draft")
          .child("people")
          .set(this.display.draft.people);
      }
    },
    person_remove(index) {
      // console.log(this.display.draft);
      this.display.draft.people.splice(index, 1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display
        .child("draft")
        .child("people")
        .set(this.display.draft.people);
    },
    updateticker() {
      //save the draft ticker (order etc might have changed)
      if (this.display.draft.ticker) {
        this.$firebaseRefs.display
          .child("draft")
          .child("ticker")
          .set(this.display.draft.ticker);
      }

      //for each ticker in order
      //if selected, concat
      let result = filter(this.display.draft.ticker, "selected");
      result = map(result, "message");
      result = result.join(" · ");
      this.display.ticker.message = result;

      this.$firebaseRefs.display.child("ticker").set(this.display.ticker);
    },
    updatename() {
      // console.log(val);
      this.$firebaseRefs.display.child("name").set(this.dirty.name);
    },
    updatelive() {
      // console.log(val);
      this.$firebaseRefs.display
        .child("watermarktext")
        .set(this.dirty.watermarktext);
    },
    updatewatermark() {
      // console.log(val);
      this.$firebaseRefs.display.child("watermark").set(this.dirty.watermark);
    },
    updateperson(person) {
      this.$firebaseRefs.display.child("people").set(person);
      this.peopletimer = 0;
      clearTimeout(timeout);
      clearTimeout(this.coutdowntimer);
      this.$firebaseRefs.control.child("people").set(true);
    },
    updatetitle(title) {
      this.$firebaseRefs.display.child("title").set(title);
      this.$firebaseRefs.control.child("title").set(true);
    },
    cancelperson() {
      this.$firebaseRefs.control.child("people").set(false);
      this.peopletimer = 0;
      try {
        this.currentsound.fade(1.0, 0, 1000);
      } catch (e) {
        //no sound
        console.log(e);
      }
    },
    zoomperson(person) {
      //only fire if this is the master account:
      if (!this.isAnon) {
        //find person affiliation:
        let found = false;
        for (let p of this.display.draft.people) {
          if (p.name == person.name) {
            found = true;
            person.affiliation = p.affiliation;
          }
        }

        if (!found) {
          this.newperson.name = person.name;
          this.person_add();
        }

        this.fireperson(person);
      }
    },
    fireperson(person) {
      if (person.audio) {
        var sound = new Howl({
          html5: true,
          src: [person.audio],
        });

        sound.play();

        this.currentsound = sound;
        sound.on("fade", () => {
          sound.unload();
        });
      }

      this.updateperson(person);
      this.peopletimer = 100;
      clearTimeout(this.coutdowntimer);
      this.countDown();
      //set timer:
      timeout = setTimeout(this.cancelperson, 5000);
    },
    countDown() {
      if (this.peopletimer > 0) {
        this.coutdowntimer = setTimeout(() => {
          this.peopletimer -= 20;
          this.countDown();
        }, 1000);
      }
    },
    onChatMsg() {
      if (!this.chatopen) this.hasmessages = true;
    },
    clearChatMsg() {
      this.hasmessages = false;
    },
  },
  computed: {
    livepeople() {
      return filter(this.display.activeUsers, (dd, key) => {
        // console.log(key);
        return (
          key != this.uid &&
          dd >
            DateTime.now()
              .minus({ minute: 1 })
              .toSeconds()
        );
      });
    },
    isAnon() {
      let anon = this.$q.localStorage.getItem("anon");
      return !!anon;
    },
    getAnon() {
      return this.$q.localStorage.getItem("anon");
    },
    // splitterModel() {
    //   return typeof this.control.zoomsense_token == "undefined" ||
    //     this.control.zoomsense_token == ""
    //     ? 100
    //     : 50;
    // },
    // colStyle() {
    //   return {
    //     height: this.colheight + "px",
    //   };
    // },
    // splitStyle() {
    //   return {
    //     height: this.colheight - 48 + "px",
    //   };
    // },
    userid() {
      // console.log(firebase.auth().currentUser);

      return firebase.auth().currentUser;
    },
    allstyles() {
      let returns = {};
      this.stylevars.forEach((el) => {
        returns[`${el.name}`] = el.default;
      });

      return returns;
    },
  },
  watch: {
    id: {
      // call it upon creation too
      immediate: true,
      async handler(id) {
        let userid = this.userid.uid;
        if (this.isAnon) userid = this.getAnon.userid;
        this.uid = userid;

        // console.log(userid);
        // console.log(id);

        await Promise.all([
          this.$rtdbBind(
            "control",
            alldisplays
              .child(userid)
              .child(id)
              .child("control")
          ),
          this.$rtdbBind("display", alldisplays.child(userid).child(id)),
        ]);

        this.display = Object.assign(
          {
            config: {
              style: "",
              stylevars: { ...this.allstyles },
            },

            content: [],

            watermarktext: "LIVE",

            people: {},

            watermark: {
              src: "",
            },

            ticker: {
              message: "",
            },

            title: {
              title: "",
              subtitle: "",
            },

            draft: {
              titles: [],
              people: [],
            },
          },
          this.display
        );

        // if (!this.display.draft.titles) this.display.draft.titles = [];
        // if (!this.display.draft.people) this.display.draft.people = [];

        // console.log(this.display);

        //retrofit style:
        if (this.display.config && this.display.config.colors) {
          this.display.config.stylevars = this.allstyles;
          this.display.config.stylevars[
            "main-background"
          ] = this.display.config.colors.bgcolor;
          this.display.config.stylevars[
            "primary"
          ] = this.display.config.colors.primary;
        }

        this.display.config.colors = null;

        // console.log(this.display.config);

        await this.$firebaseRefs.display.set(this.display);

        // console.log("********");
        // console.log(this.display);

        this.dirty = Object.assign(
          {
            ticker: {},
            watermark: {},
          },
          { ...this.display }
        );

        this.loaded = true;
      },
    },
    control: {
      // call it upon creation too
      immediate: false,
      deep: true,
      handler(control) {
        if (!control.currentcontent) control.currentcontent = 0;
        this.$firebaseRefs.control.set(control);
      },
    },
    watermarkImg: {
      handler(img) {
        console.log(img);
        const reader = new FileReader();
        const insidethis = this;
        reader.addEventListener(
          "load",
          function() {
            // convert image file to base64 string
            insidethis.dirty.watermark.src = reader.result;
            insidethis.updatewatermark();
          },
          false
        );

        if (img) {
          reader.readAsDataURL(img);
        }
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.imgdark {
  margin-top: 1em;
  border-radius: 10px;
  border-width: 20px;
  border-color: #444;
  border-style: solid;
  width: 100%;
  position: relative;
  padding-top: 56.25%;
  background: url("/img/example1.jpg");
  background-size: cover;

  .watermark {
    position: absolute;
    left: 10px;
    top: 10px;
    max-width: 10%;
    opacity: 0.4;
  }
}

.noimg {
  background: #333;
}

.flip-list-move {
  transition: transform 1s;
}

.nopadding {
  padding: 0 !important;
}

.roundbox {
  border-radius: 0.8em;
  background: #222;
  overflow: hidden;
}

.colmin {
  min-width: 400px;
}

.border-off {
  border: 1px dashed transparent;
}

.border-on {
  border-color: rgb(186, 29, 29);
}

.pad-bottom {
  padding-bottom: 4em;
}

.pad-bottomxl {
  padding-bottom: 8em;
}

.ring {
  outline: orange solid 3px !important;
}
</style>
<style lang="scss">
.q-drawer {
  background-color: #00000011 !important;
}
</style>
