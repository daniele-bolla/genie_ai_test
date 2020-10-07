<template>
  <button
    :type="type"
    :class="`btn btn--${size} btn--${skin}`"
    @click="$emit('click')"
  >
    <span v-if="text" class="btn__text">{{ text }}</span>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
enum size {
  "small",
  "medium",
  "large",
  "full"
}
enum skin {
  "secondary",
  "primary",
  "default",
  "transparent"
}
enum type {
  "button",
  "submit",
  "reset"
}
@Component
export default class BaseInput extends Vue {
  @Prop({ default: "" }) readonly text!: string;
  @Prop({ default: "medium" }) readonly size!: size;
  @Prop({ default: "primary" }) readonly skin!: skin;
  @Prop({ default: "button" }) readonly type!: type;
}
</script>

<style lang="scss">
@import "@/assets/button.scss";
</style>
