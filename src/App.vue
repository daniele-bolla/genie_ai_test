<template>
  <div id="app">
    <div class="container">
      <with-higlight :query="query">
        <template v-slot:nav="nav">
          <nav class="nav">
            <div class="nav__left">
              <input type="text" v-model="query" /> Match {{ nav.nav.count }}
            </div>
            <div v-if="nav.nav.count" class="nav__right">
              <button
                :disabled="!(nav.nav.currentFocused > 1)"
                @click="nav.nav.prev"
              >
                Prev
              </button>
              <button
                :disabled="!(nav.nav.currentFocused < nav.nav.count)"
                @click="nav.nav.next"
              >
                Next
              </button>
            </div>
          </nav>
        </template>
        <template v-slot:content>
          <simple-editor :content="content"></simple-editor>
        </template>
      </with-higlight>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SimpleEditor from "@/components/SimpleEditor";
import WithHiglight from "@/components/WithHiglight.vue";
import { content } from "@/data/Q1-sample-text.json";

@Component({
  components: {
    WithHiglight,
    SimpleEditor
  }
})
export default class App extends Vue {
  content = content;
  query = "";
}
</script>
<style>
html {
  box-sizing: border-box;
  font-size: 16px;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ol,
ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol,
ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.8rem 2rem 1.6rem;
}
</style>
