<template>
  <div class="container">
    <with-highlight :query="query" :replacement="replacement">
      <template
        v-slot:nav="{
          nav: { count, currentFocused, prev, next, replace }
        }"
      >
        <nav class="nav">
          <div class="nav__left">
            <base-input v-model="query" placeholder="Find" />
            <div class="nav__left__bottom">
              <h6>{{ currentFocused }} of {{ count }}</h6>
              <div>
                <base-button
                  :disabled="!(currentFocused > 1)"
                  @click="prev"
                  text="Prev"
                />
                <base-button
                  class="ml-4"
                  :disabled="!(currentFocused < count)"
                  @click="next"
                  text="Next"
                />
              </div>
            </div>
          </div>
          <div class="nav__right">
            <base-input v-model="replacement" placeholder="Replace">
              <template v-slot:postaddon>
                <base-button
                  :disabled="!count || query == replacement"
                  @click="replace"
                  text="replace"
                  #postaddon
                />
              </template>
            </base-input>
          </div>
        </nav>
      </template>
      <template v-slot:content>
        <doc-compiler :content="content"></doc-compiler>
      </template>
    </with-highlight>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import DocCompiler from "@/components/DocCompiler";
import WithHighlight from "@/components/WithHighlight.vue";
import { content } from "@/data/Q1-sample-text.json";
import Stickyfill from "stickyfilljs";

@Component({
  components: {
    WithHighlight,
    DocCompiler,
    BaseButton,
    BaseInput
  }
})
export default class DocWithHighlight extends Vue {
  content = content;
  query = "";
  replacement = "";
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav: any = document.querySelector(".nav");
    if (nav) {
      Stickyfill.add(nav);
    }
  }
}
</script>
<style lang="scss">
.nav {
  display: flex;
  width: 100%;
}
.nav {
  position: sticky;
  flex-flow: row wrap;
  top: 0;
  padding: 1rem 0;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;
  align-items: flex-start;
  background: $body-bg;
  z-index: 1;
}
.nav__right {
  margin-left: 3rem;
  flex: 1;
}
.nav__left {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.container {
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.8rem 2rem 1.6rem;
}
.nav__left__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.ml-4 {
  margin-left: 1rem;
}
@media (max-width: 1024px) {
  .nav {
    flex-direction: column;
  }
  .nav__right {
    margin: 1rem 0 0 0;
    width: 100%;
  }
  .nav__left {
    width: 100%;
  }
}
</style>
