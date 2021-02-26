<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-primary.text-white(elevated height-hint="98")
    q-toolbar
      q-btn(flat round dense to="/dashboard")
        q-icon(name="arrow_back")
      q-toolbar-title {{display.name}}

  q-page-container()
    q-page.column()
          .col-auto
            q-tabs(align="left" v-model="tab" dense  outside-arrows mobile-arrows)
              q-tab(icon="tune" name="control" label="LIVE")
              q-tab(icon="ballot" name="content" label="Content")
              q-tab(icon="person" name="people" label="People")
              q-tab(icon="title" name="titles" label="Titles")
              q-tab(icon="subtitles" name="ticker" label="Ticker")
              q-tab(icon="branding_watermark" name="watermark" label="Watermark")
              q-tab(icon="style" name="style" label="Settings")
          q-tab-panels.col(v-model="tab" v-if="loaded" padding)
            q-tab-panel(name="control")
              .row
                .col-12.col-md.q-mr-md                  
                  q-list(separator v-if="display && draft && draft.titles && display.title" )
                    q-item
                      q-item-section
                        q-item-label.text-uppercase Available Titles
                      q-item-section(side)
                        q-btn-toggle(v-model="control.title" :options="displayoptions" outline)
                    q-separator
                    .scrollable(style="overflow-y:scroll;height:400px;")
                      q-item(clickable v-ripple v-for="(title,index) in draft.titles" @click="updatetitle(title)")
                        q-item-section
                          q-item-label {{title.title}} ({{title.subtitle}})
                        q-item-section(side)
                          q-icon(name="monitor" v-show="display.title.title == title.title && display.title.subtitle == title.subtitle")
                    
                    q-item(v-if="!draft.titles.length")
                      q-item-label Empty
                          
                .col-12.col-md.q-mr-md
                  q-list(separator)
                    q-item
                      q-item-section
                        q-item-label.text-uppercase Available Content
                      q-item-section(side)
                        q-btn-toggle(v-model="control.content" :options="displayoptions" outline)
                    q-item
                      q-btn-group(spread style="width:100%;")
                        q-btn(dense color="primary" outline @click="control.currentcontent--")
                          q-icon(name="expand_less")
                        q-btn(dense disabled outline color="primary") {{control.currentcontent+1}}
                        q-btn(dense color="primary" outline @click="control.currentcontent++")
                          q-icon(name="expand_more")
                    .scrollable(style="overflow-y:scroll;height:400px;")
                      q-item(clickable v-ripple v-for="(content,index) in display.content" @click="control.currentcontent = index")
                        q-item-section(side)
                          q-badge(outline) {{index+1}}
                        q-item-section(side)
                          q-avatar(square)
                            q-img( :src="content.image")
                        q-item-section
                          q-item-label {{content.caption || content.message}}
                        q-item-section(side)
                          q-icon(name="monitor" v-show="index == control.currentcontent")
                        
                    q-item(v-if="!display.content.length")
                      q-item-label Empty
                
                .col-12.col-md
                  q-list(separator v-if="display && draft && draft.people")
                    q-item
                      q-item-section
                        q-item-label.text-uppercase Available People
                      q-item-section(side)
                        q-btn-toggle(v-model="control.people" :options="displayoptions" outline)
                    .column
                      .scrollable(style="overflow-y:scroll;height:400px;")
                        q-item(v-for="(people,index) in draft.people")
                          q-item-section(side)
                            q-icon(name="monitor"  v-if="display.people" v-show="display.people.name == people.name && display.people.affiliation == people.affiliation")
                            q-icon(name="blank" v-show="!(display.people.name == people.name && display.people.affiliation == people.affiliation)")
                          q-item-section
                            q-item-label {{people.name}} ({{people.affiliation}})
                          q-item-section(side)
                            div
                              q-circular-progress(v-if="display.people" v-show="display.people.name == people.name && display.people.affiliation == people.affiliation" :value="peopletimer")
                              q-btn(flat dense icon="monitor" @click="updateperson(people)" color="primary")
                              q-btn(flat dense icon="bolt" @click="fireperson(people)" color="primary")
                    q-item(v-if="!draft.people.length")
                      q-item-label Empty
                

            q-tab-panel(name="people")
              .q-pa-xs
                div.row.q-col-gutter-sm
                  .col-md-4.col-xs-12
                    q-card(flat bordered)
                      q-card-section
                        q-input.col-6(label="name" v-model="newperson.name")
                        q-input.col-6(label="affiliation" v-model="newperson.affiliation")
                      q-separator
                      q-card-actions(align="right")
                        q-btn(flat @click="person_add()") Add

                  .col-md-4.col-xs-12(v-if="draft && draft.people" v-for="(people,index) in draft.people")
                    q-card.column.full-height(flat bordered)
                      q-card-section.col
                        .text-h6 {{people.name}}
                        .text-subtitle2 {{people.affiliation}}
                      q-separator
                      q-card-actions.col-auto(align="right")
                        q-btn(flat @click="person_remove(index)") Remove
                  
            q-tab-panel(name="content")
              .q-pa-xs
                div.row.q-col-gutter-sm
                  .col-md-4.col-xs-12
                    q-card.full-height(flat bordered)
                      q-card-section
                        q-option-group(inline :options="contenttypes" v-model="newcontent.itemtype")
                        q-input(label="Message" type="text" v-model="newcontent.message")
                        q-input(label="Image URL" type="text" v-model="newcontent.image")
                        q-input(label="Caption" type="text" v-model="newcontent.caption")
                      q-separator
                      q-card-actions(align="right")
                        q-btn(flat @click="content_add()") Add New

                  .col-md-4.col-xs-12(v-if="display.content && display.content" v-for="(content,index) in display.content")
                    q-card.column.full-height(flat bordered )
                      q-card-section.col
                        q-badge(floating transparent) {{content.itemtype}}
                        p {{content.message}}
                        q-img(v-if="content.image" contain :src="content.image" style="height:100%;")
                          .absolute-bottom.text-subtitle1.text-center {{content.caption}}
                      q-separator
                      q-card-actions.col-auto(align="right")
                        q-btn(flat @click="content_remove(index)") Remove
            
            q-tab-panel(name="titles")
              .q-pa-xs
                div.row.q-col-gutter-sm
                  .col-md-4.col-xs-12
                    q-card(flat bordered)
                      q-card-section
                        q-input.col-6(label="title" v-model="newtitle.title")
                        q-input.col-6(label="subtitle" v-model="newtitle.subtitle")
                      q-separator
                      q-card-actions(align="right")
                        q-btn(flat @click="title_add()") Add

                  .col-md-4(v-if="draft && draft.titles" v-for="(title,index) in draft.titles")
                    q-card.column.full-height(flat bordered)
                      q-card-section.col
                        .text-h6 {{title.title}}
                        .text-subtitle2 {{title.subtitle}}
                      q-separator
                      q-card-actions.col-auto(align="right")
                        q-btn(flat @click="title_remove(index)") Remove
                  

            q-tab-panel(name="ticker")
              .q-pa-xs
                q-toggle(v-model="control.ticker" val="true"  toggle-color="primary" label="Display ticker")
                q-input(v-model="dirty.ticker.message" clearable label="Ticker text" v-on:keyup.enter="updateticker")
                  template(v-slot:append v-if="dirty.ticker.message != display.ticker.message")
                    q-avatar
                      q-icon(name="create")



            q-tab-panel(name="watermark" )
              .q-pa-xs
                q-toggle(v-model="control.watermark" val="true" toggle-color="primary" label="Display watermark")
                q-input.q-my-md(v-model="dirty.watermark.src" clearable label="Watermark" v-on:keyup.enter="updatewatermark" placeholder="paste url or data:url here")
                  template(v-slot:append v-if="dirty.watermark.src != display.watermark.src")
                    q-avatar
                      q-icon(name="create")
                .imgdark
                    q-img.watermark(:src="dirty.watermark.src")
            

            q-tab-panel(name="style")
              .q-pa-xs(v-if="display.config")

                p Brand colors
                .row.q-gutter-xs
                  
                  q-avatar(:style="{'background-color':display.config.colors.bgcolor}")
                  q-input.col-3( filled v-model="display.config.colors.bgcolor"  :rules="['anyColor']" label="Background Color")
                    template(v-slot:append)
                      q-icon(name="colorize" class="cursor-pointer")
                        q-popup-proxy(transition-show="scale" transition-hide="scale")
                          q-color(v-model="display.config.colors.bgcolor" format-model="hex" @input="updatecolor")
                  
                  q-avatar(:style="{'background-color':display.config.colors.primary}")
                  q-input.col-3(filled v-model="display.config.colors.primary" :rules="['anyColor']" label="Primary Color")
                    template(v-slot:append)
                      q-icon(name="colorize" class="cursor-pointer")
                        q-popup-proxy(transition-show="scale" transition-hide="scale")
                          q-color(v-model="display.config.colors.primary" format-model="hex" @input="updatecolor")

                p Insert additional CSS here
                q-input(type="textarea" v-model="display.config.style" outlined label="Style CSS")
                q-btn(label="Save" @click="savestyle()" outline)

                p Show CSS Classes
                q-btn-toggle(v-model="control.debug" :options="displayoptions" outline)

                q-input(v-model="dirty.name" label="Display Name" v-on:keyup.enter="updatename")
                  template(v-slot:append v-if="dirty.name != display.name" )
                    q-avatar
                      q-icon(name="create")
</template>

<script>
import {db} from '../lib/db';
import firebase from 'firebase';
const alldisplays = db.ref('displays');

var timeout;

export default {
  name: 'Control',
  props:['id'],
  created () {
    this.$q.dark.set(true)
  },
  data() {
    return {
      contenttypes:[
        {
          label:"Message",
          value: "message"
        },
        {
          label:"Image",
          value:"image"
        },
        {
          label:"Profile",
          value:"profile"
        }
      ],
      displayoptions:[
        {label:'Display',value:true},
        {label:'Hide',value:false}
        ],
      splitter:5,
      display: {},
      control:{},
      tab:'control',
      peopletimer:0,
      dirty:{
        watermark:''
      },
      newperson:{
        name:"",
        affiliation:""  
      },
      newtitle:{
        title:"",
        subtitle:""  
      },
      newcontent:{
        itemtype:"message",
        message:"",
        image:"",
        caption:""
      },
      loaded:false
    }
  },
  methods:{
    updatecolor(){
      this.$firebaseRefs.display.child('config').child('colors').set(this.display.config.colors);
    },
    savestyle(){
      this.$firebaseRefs.display.child('config').child('style').set(this.display.config.style);
    },
    content_add(){
      if (!this.display.content)
        this.display.content = [];

      this.display.content.push(this.newcontent);
      this.newcontent={
        itemtype:"message",
        message:"",
        image:"",
        caption:""
      }
      this.$firebaseRefs.display.child('content').set(this.display.content);
    },
    content_remove(index){
      // console.log(this.display.draft);
      this.display.content.splice(index,1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display.child('content').set(this.display.content);

    },
    title_add(){
      this.draft.titles.push(this.newtitle);
      this.newtitle = {
        title:"",
        subtitle:""  
      }
      this.$firebaseRefs.display.child('draft').child('titles').set(this.draft.titles);
    },
    title_remove(index){
      // console.log(this.display.draft);
      this.display.draft.titles.splice(index,1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display.child('draft').child('titles').set(this.display.draft.titles);

    },
    person_add(){
      this.draft.people.push(this.newperson);
      this.newperson = {
        name:"",
        affiliation:""
      }
      this.$firebaseRefs.display.child('draft').child('people').set(this.draft.people);
    },
    person_remove(index){
      // console.log(this.display.draft);
      this.display.draft.people.splice(index,1);
      // console.log(this.display.draft.people);
      this.$firebaseRefs.display.child('draft').child('people').set(this.display.draft.people);
    },
    updateticker(){
      // console.log(val);
      this.$firebaseRefs.display.child('ticker').set(this.dirty.ticker);
    },
    updatename(){
      // console.log(val);
      this.$firebaseRefs.display.child('name').set(this.dirty.name);
    },
    updatewatermark(){
      // console.log(val);
      this.$firebaseRefs.display.child('watermark').set(this.dirty.watermark);
    },
    updateperson(person){
      this.$firebaseRefs.display.child('people').set(person);
      this.peopletimer = 0;
      clearTimeout(timeout);
      this.$firebaseRefs.control.child('people').set(true);
    },
    updatetitle(title){
      this.$firebaseRefs.display.child('title').set(title);
      this.$firebaseRefs.control.child('title').set(true);
    },
    cancelperson(){
      this.$firebaseRefs.control.child('people').set(false);
      this.peopletimer = 0;
    },
    fireperson(person){
      this.updateperson(person);
      this.peopletimer = 100;
      this.countDown();
      //set timer:
      timeout = setTimeout(this.cancelperson,5000);
    },
    countDown(){
      if (this.peopletimer > 0)
      {
        setTimeout(()=>{
          this.peopletimer -= 20;
          this.countDown();
        },1000);
      }
    }

  },
  computed:{
    userid(){
      return firebase.auth().currentUser;
    },
    draft(){
      return Object.assign({
        people:[],
        titles:[]
      },this.display.draft);
    }
  },
  watch: {
    display:{
      deep:true,
      immediate: true,
      handler(){
        // if (!display.draft){
        //   display.draft = {
        //     people:[],
        //     titles:[]
        //   }
        // }
      }
    },
    id: {
      // call it upon creation too
      immediate: true,
      async handler(id) {
        await Promise.all([this.$rtdbBind('control', alldisplays.child(this.userid.uid).child(id).child('control')),
        this.$rtdbBind('display', alldisplays.child(this.userid.uid).child(id))]);

        this.display = Object.assign({
          
          config:{
            style:"",
            colors:{
              bgcolor:"",
              primary:""
            }
          },

          watermark:{
            src:""
          },
          
          ticker:{
            message:""
          },

          title:{
            title:"",
            subtitle:""
          }
        },this.display);

        // console.log(this.display);

        await this.$firebaseRefs.display.set(this.display);

        // console.log(this.display);

        this.dirty = Object.assign({
          ticker:{},
          watermark:{}
        },JSON.parse(JSON.stringify(this.display)));

        this.loaded = true;
      },
    },
    control:{
      // call it upon creation too
      immediate: false,
      deep:true,
      handler(control) {
        // console.log(control);
        if (!control.currentcontent)
          control.currentcontent = 0;
        this.$firebaseRefs.control.set(control);
        // console.log(this.control);
        // console.log(this.display);
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
body {
  // background:white;
}

.imgdark {
  // max-width:300px;
  width: 100%;
  position:relative;
  padding-top:56.25%;
  background:gray;

  .watermark
  {
    position:absolute;
    left:10px;
    top:10px;
    max-width:10%;
    opacity: 0.4;
  }
}

</style>
