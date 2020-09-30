<template>
  <div id="app">
    <SimpleEditor :content="content" />
  </div>
</template>

<script>
import SimpleEditor from "./components/SimpleEditor.vue";
import { content } from "@/data/Q1-sample-text.json";

export default {
  name: "App",
  components: {
    SimpleEditor
  },
  data() {
    return {
      content
    };
  }
};
</script>
