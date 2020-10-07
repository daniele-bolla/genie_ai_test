<template>
  <div id="app">
    <DocWithHighlight />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DocWithHighlight from "@/components/DocWithHighlight.vue";

@Component({
  components: {
    DocWithHighlight
  }
})
export default class App extends Vue {}
</script>
<style lang="scss">
@import "./assets/reset.css";
@import "@/assets/typo.scss";
@import "@/assets/form.scss";

body {
  background-color: $body-bg;
  color: $text-color;
}
</style>
