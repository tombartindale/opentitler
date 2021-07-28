<template lang="pug">
q-dialog(ref="dialog" @hide="onDialogHide")
  q-card(style="width: 700px; max-width: 80vw;")
    q-card-section
      .text-h6 How to setup titles on your computer
    q-separator
    q-card-section.q-pt-none
      q-carousel(transition-prev="slide-right" transition-next="slide-left" control-type="outline" navigation arrows color="secondary" v-model="slide" swipeable animated height="600px" padding).text-white
        q-carousel-slide(name="1").column.no-wrap.flex-center.text-center
          .text-h4 Download and Install OBS
          p Firstly, you need to install the free OBS software to the computer that you want to stream from (when using something like Zoom or Skype).
          q-btn(type="a" href="https://obsproject.com/" color="primary") Get OBS Now

        q-carousel-slide(name="2").column.no-wrap.flex-center.text-center
          .text-h4 Start OBS
          p Select Virtual Camera Settings. Use the default settings for 'Virtual Camera'.
          q-img(src="/img/obs1.png" contain)

        q-carousel-slide(name="4").column.no-wrap.flex-center.text-center
          .text-h4 Setup Open Titler Display
          p Create a new Display in Open Titler, and copy 'Connect' link for that display to the clipboard. You will use this later.
          q-btn(outline disabled size="xl" stack icon="link") Connect

        q-carousel-slide(name="3" ).column.no-wrap.flex-center.text-center
          .text-h4 Add Camera Source
          p Add a 'Video Capture Device' by selecting the + button under 'Sources'.
          q-img(src="/img/obs3.png" contain)
        
        q-carousel-slide(name="3.5" ).column.no-wrap.flex-center.text-center
          .text-h4 Select Your Camera
          p Select the camera you would normally use from the drop-down list.
          p Press OK.
          q-img(src="/img/obs4.png" contain)

        q-carousel-slide(name="5").column.no-wrap.flex-center.text-center
          .text-h4 Add Browser Source
          p Add a 'Browser' source by selecting the + button under 'Sources'.
          q-img(src="/img/obs5.png" contain)

        q-carousel-slide(name="5.1").column.no-wrap.flex-center.text-center
          .text-h4 Paste Open Titler URL
          p Paste the URL you copied earlier into the URL input box.
          p Enter 1280 and 720 into the Width and Height inputs.
          p Press OK.
          q-img(src="/img/obs6.png" contain)
        
        q-carousel-slide(name="5.2").column.no-wrap.flex-center.text-center
          .text-h4 Set Browser Source Size
          p Right click on the Browser Source in the Sources list and select Transform -&gt; Stretch to Screen.
          q-img(src="/img/obs7.png" contain)

        

        q-carousel-slide(name="6").column.no-wrap.flex-center.text-center
          .text-h4 Start the Virtual Camera
          p Press 'Start Virtual Camera' button.
          q-img(src="/img/obs8.png" contain)

        q-carousel-slide(name="7").column.no-wrap.flex-center.text-center
          .text-h4 Configure Streaming Software
          p In Zoom, Skype or whatever you use for streaming, select the 'OBS Virtual Camera' as your video camera.
          q-img(src="/img/obs9.png" contain)
        
        q-carousel-slide(name="8").column.no-wrap.flex-center.text-center
          .text-h4 Control Your Titles
          p Using this dashboard, control your titles in real-time.
          q-btn(size="xl" disabled stack icon="tune" outline) Controls
    q-separator
    q-card-actions.text-teal(align='right')
      q-btn(flat label='CLOSE' v-close-popup)
</template>

<script>
export default {
  data() {
    return {
      slide: "1",
    };
  },
  emits: [
    // REQUIRED
    "ok",
    "hide",
  ],
  methods: {
    hide() {
      this.$refs.dialog.hide();
    },
    show() {
      this.$refs.dialog.show();
    },
    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },
  },
};
</script>
