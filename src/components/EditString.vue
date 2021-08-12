<template lang="pug">
.hover {{value}}
  q-popup-edit(v-model="newstring" :validate="val => val.length > 0" @save="save()")
    q-input(v-model="newstring" dense autofocus)
</template>
<script>
export default {
  name: "EditString",
  props: ["value", "path", "fbref"],
  data: () => {
    return {
      newstring: "",
    };
  },
  methods: {
    async save() {
      await this.fbref.child(this.path).set(this.newstring);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.newstring = this.value;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.hover:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
