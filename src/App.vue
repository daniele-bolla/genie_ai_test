<template>
  <div id="app">
    <input type="text" v-model="query" />
    <with-higlight :query="query">
      <SimpleEditor ref="doc" :content="content" />
    </with-higlight>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { content } from "@/data/Q1-sample-text.json";

import SimpleEditor from "@/components/SimpleEditor.vue";
import WithHiglight from "@/components/WithHiglight.vue";

@Component({
  components: {
    WithHiglight,
    SimpleEditor
  }
})
export default class App extends Vue {
  private content = content;
  private query = "";
}
</script>
