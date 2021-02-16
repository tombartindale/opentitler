<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-primary.text-white(elevated height-hint="98")
    q-toolbar
      q-toolbar-title
        q-avatar
          q-icon(name="monitor")
        | Control of {{display.name}} by {{userid.email}}

    q-tabs(align="left" v-model="tab")
      q-tab(name="control" label="Display Controls")
      q-tab(name="ticker" label="Ticker")
      q-tab(name="watermark" label="Watermark")
      q-tab(name="people" label="People")
      q-tab(name="content" label="Content")
      q-tab(name="messages" label="Messages")
      
            
  q-page-container
    q-page
      q-tab-panels(v-model="tab" animated)
        q-tab-panel(name="control" v-if="control && display.ticker")
          .row
            q-toggle(v-model="control.ticker" size="100px" val="true"  toggle-color="primary" label="Ticker")
            span {{display.ticker.message}}
          .row
            .col
              q-toggle(v-model="control.content" size="100px" val="true" label="Content")
              br
              div
                q-btn(@click="control.currentcontent--") Prev.
                span {{control.currentcontent+1}}
                q-btn(@click="control.currentcontent++") Next

            .col
              q-toggle(v-model="control.messages" size="100px" val="true" toggle-color="primary" label="Messages")
              div move to next one (list them)
            
            .col
              q-toggle(v-model="control.people" size="100px" val="true" toggle-color="primary" label="People")
              q-list(bordered separator v-if="display && display.draft && display.draft.people")
                q-item(v-for="(people,index) in display.draft.people")
                  q-item-section(side)
                    q-circular-progress(v-show="display.people.name == people.name && display.people.affiliation == people.affiliation" :value="peopletimer")
                  q-item-section
                    q-item-label {{people.name}} ({{people.affiliation}})
                  q-item-section(side)
                    div
                      q-btn(flat icon="monitor" @click="updateperson(people)")
                      q-btn(flat icon="bolt" @click="fireperson(people)") Fire
            

        q-tab-panel(name="ticker" v-if="display.ticker && dirty.ticker")
          q-input(v-model="dirty.ticker.message" clearable label="Ticker text" v-on:keyup.enter="updateticker")
            template(v-slot:append v-if="dirty.ticker.message != display.ticker.message")
              q-avatar
                q-icon(name="create")

        q-tab-panel(name="watermark" v-if="display.watermark")
          q-toggle(v-model="control.watermark" size="100px" val="true" toggle-color="primary" label="Watermark")
          q-input(v-model="dirty.watermark.src" clearable label="Watermark" v-on:keyup.enter="updatewatermark")
            template(v-slot:append v-if="dirty.watermark.src != display.watermark.src")
              q-avatar
                q-icon(name="create")
          .imgdark.row
            .col-4
              q-img(:src="dirty.watermark.src")

        q-tab-panel(name="people" v-if="display.draft")
          q-list(bordered separator)
            q-item(v-if="display.draft && display.draft.people" v-for="(people,index) in display.draft.people")
              q-item-section
                q-item-label {{people.name}} ({{people.affiliation}})
              q-item-section(side)
                q-btn(flat round icon="remove" @click="person_remove(index)")
            
            q-item
              q-item-section
                q-input.col-6(label="name" v-model="newperson.name")
                q-input.col-6(label="affiliation" v-model="newperson.affiliation")
              q-item-section(side)
                q-btn(flat round icon="add" @click="person_add()")
        
        q-tab-panel(name="content" v-if="display.draft")

        q-tab-panel(name="messages" v-if="display.draft")
          q-list(bordered separator)
            q-item(v-if="display.draft && display.draft.messages" v-for="(message,index) in display.draft.message")
              q-item-section
                q-item-label {{message.name}}
              q-item-section(side)
                q-btn(flat round icon="remove" @click="message_remove(index)")
            
            q-item
              q-item-section
                q-input.col-6(label="name" v-model="newperson.name")
                q-input.col-6(label="affiliation" v-model="newperson.affiliation")
              q-item-section(side)
                q-btn(flat round icon="add" @click="person_add()")
</template>

<script>
import {db} from '../lib/db';
import firebase from 'firebase';
const alldisplays = db.ref('displays');

var timeout;

export default {
  name: 'Control',
  props:['id'],
  data() {
    return {
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
      }
    }
  },
  methods:{
    person_add(){
      this.display.draft.people.push(this.newperson);
      this.newperson = {
        name:"",
        affiliation:""
      }
      this.$firebaseRefs.display.child('draft').child('people').set(this.display.draft.people);
    },
    person_remove(index){
      // console.log(this.display.draft);
      this.display.draft.people.splice(index,1);
      console.log(this.display.draft.people);
      this.$firebaseRefs.display.child('draft').child('people').set(this.display.draft.people);
    },
    updateticker(){
      // console.log(val);
      this.$firebaseRefs.display.child('ticker').set(this.dirty.ticker);
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
    }
  },
  watch: {
    display:{
      deep:true,
      handler(display){
        if (!display.draft){
          display.draft = {
            people:[]
          }
        }
      }
    },
    id: {
      // call it upon creation too
      immediate: true,
      async handler(id) {
        this.$rtdbBind('control', alldisplays.child(this.userid.uid).child(id).child('control'));
        await this.$rtdbBind('display', alldisplays.child(this.userid.uid).child(id));
        // console.log('***');
        // console.log(this.display);

        this.dirty = JSON.parse(JSON.stringify(this.display));
      },
    },
    control:{
      // call it upon creation too
      immediate: false,
      deep:true,
      handler(control) {
        // console.log(control);
        this.$firebaseRefs.control.set(control);
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
body {
  background:white;
}

.imgdark {
  background:gray;
  padding:20px;
  div {
    opacity: 0.4;
  }
}

</style>
