<template>
  <div>
    <label :for="name">{{ label }} </label>
    <div
      :class="{
        'input-group': preAddon || postAddon
      }"
    >
      <div v-if="preAddon" class="input-group__prepend">
        <slot name="preaddon"> </slot>
      </div>

      <input
        class="input"
        :class="{
          'input-group__input': preAddon || postAddon
        }"
        :type="type"
        @blur="$emit('blur')"
        @input="$emit('input', $event.target.value)"
        :value="value"
        :id="name"
        :name="name"
        :placeholder="placeholder"
        :aria-described="`describe-${name}`"
      />
      <div v-if="postAddon" class="input-group__append">
        <slot name="postaddon"> </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BaseInput extends Vue {
  @Prop({ required: true }) readonly value!: string;
  @Prop({ default: "text" }) readonly type!: string;
  @Prop({ default: "" }) readonly label!: string;
  @Prop({ default: "" }) readonly placeholder!: string;
  @Prop({ required: true }) readonly name!: string;

  get preAddon() {
    return !!this.$slots.preaddon;
  }

  get postAddon() {
    return !!this.$slots.postaddon;
  }
}
</script>
