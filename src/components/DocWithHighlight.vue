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
                  :disabled="!count"
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
}
</script>
<style lang="scss">
.nav {
  display: flex;
  width: 100%;
}
.nav {
  position: fixed;
  border-top: solid 2px $primary;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  padding: 1rem 15vw;
  display: flex;
  align-items: flex-start;
  background: $body-bg;
  z-index: 1;
}
.nav__right {
  margin-left: 3rem;
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
  padding: 1.8rem 2rem 40vh;
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
</style>
