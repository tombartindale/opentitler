<template lang="pug">
.people
  .name {{currentmessage.name}}
  .attribution {{currentmessage.affiliation}}
  //- Title1(:data="data")
</template>

<script>
import Title1 from "./animations/Title1";

export default {
  name: "People",
  components: {
    Title1,
  },
  props: {
    data: Object,
  },
  computed: {
    currentmessage() {
      return this.data;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.people {
  position: absolute;
  right: 15px;
  top: 50px;
  color: white;
  font-family: var(--font);
  /* box-shadow: 0px 0px 10px #ff010177; */
  filter: drop-shadow(0 0 var(--shadow-depth) var(--shadow-color));
  font-size: 1.3rem;
  text-align: right;
}

.name {
  background: var(--primary);
  padding: 10px;
  text-transform: uppercase;
  display: block;
  border-right: white 5px solid;
}

.attribution {
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 10px;
  background: white;
  display: inline-block;
  font-size: 15px;
  vertical-align: top;
  color: var(--primary);
}
</style>
