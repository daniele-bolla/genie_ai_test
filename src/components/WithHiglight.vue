<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue";

@Component
export default class WithHiglight extends Vue {
  @Prop() private query!: string;
  count = 0;
  get orignal() {
    return JSON.parse(JSON.stringify(this.$el.innerHTML));
  }
  @Watch("query") onMatchChanged() {
    this.count = 1;
    const regex = new RegExp(`(?<!<[^>]*)${this.query}`, "gi");
    //const count = this.orignal.match(regex).length;
    const html = this.orignal.replace(regex, (match: string) => {
      const index = this.count++;
      return (
        '<span id="matchText_' +
        index +
        '" class="highlightText">' +
        match +
        "</span>"
      );
    });
    setTimeout(() => {
      this.$el.innerHTML = html;
    }, 400);
  }
  render(createElement: CreateElement): VNode {
    return createElement("div", this.$slots.default);
  }
}
</script>

<style>
.highlightText {
  background: yellow;
}
.highlightText--focused {
  background: orange;
}
</style>
