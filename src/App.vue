<template>
  <div id="app">
    <SimpleEditor :content="content" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { content } from "@/data/Q1-sample-text.json";

import SimpleEditor from "./components/SimpleEditor.vue";

@Component({
  components: {
    SimpleEditor
  }
})
export default class App extends Vue {
  private content = content;
}
</script>
