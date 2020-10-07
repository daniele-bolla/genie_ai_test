<template>
  <div>
    <slot
      v-bind:nav="{ count, currentFocused, prev, next, replace }"
      name="nav"
    ></slot>
    <div ref="doc">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { convertHTML, escapeRegex, delay } from "@/utils";
const createSearchRegex = (query: string) => {
  const escapeStringInTags = "(?<!<[^>]*)";
  const includeTagsAsSpace = "((?:\\s*(?:<\\/?\\w[^<>]*>)?\\s*)*)";
  const formattedQuery = query
    .split("")
    .map(convertHTML)
    .map(escapeRegex)
    .join(`)${includeTagsAsSpace}(`);
  const search = `${escapeStringInTags}(${formattedQuery})`;
  return new RegExp(`${search}`, "gmi");
};
const isWithTags = (str: string) => {
  return str.match(new RegExp(`<*?>`, "g"));
};
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component
export default class WithHighlight extends Vue {
  private count = 0;
  private currentFocused = 0;
  private contentWrapper!: HTMLElement;
  private originalContent!: string;
  @Prop() private readonly query!: string;
  @Prop() private readonly replacement!: string;

  @Watch("query") async onMatchChanged() {
    await delay(200);
    if (!this.query || this.query == "") {
      this.resetContent();
      return;
    } else {
      const searchRegex = createSearchRegex(this.query);
      const isMatching = this.originalContent.match(searchRegex);
      if (isMatching) {
        this.resetCount();
        const highlightedContent = this.highlightContent(searchRegex);
        this.contentWrapper.innerHTML = highlightedContent;
      } else {
        this.resetContent();
      }
    }
  }
  private resetCount() {
    this.count = 0;
    this.currentFocused = 0;
  }
  private resetContent() {
    this.resetCount();
    this.contentWrapper.innerHTML = this.originalContent;
  }
  private prev() {
    if (this.currentFocused > 1) {
      this.currentFocused--;
      this.goToMatch(this.currentFocused);
    }
  }
  private next() {
    if (this.currentFocused < this.count) {
      this.currentFocused++;
      this.goToMatch(this.currentFocused);
    }
  }
  private increaseCount() {
    this.count++;
  }
  private goToMatch(index: number) {
    this.contentWrapper
      .querySelectorAll(`.highlightText--focused`)
      .forEach(mark => mark?.classList.remove("highlightText--focused"));
    this.contentWrapper
      .querySelector(`.highlightText_${index}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    this.contentWrapper
      .querySelectorAll(`.highlightText_${index}`)
      .forEach(mark => mark?.classList.add("highlightText--focused"));
  }
  private highlightContent(searchRegex: RegExp) {
    return this.originalContent.replace(
      searchRegex,
      (match: string, ...args: Array<string>) => {
        const [, , ...groups] = args.reverse();
        this.increaseCount();
        const openMarkTag = `<span class="highlightText highlightText_${this.count}">`;
        const closMarkTag = `</span>`;
        return groups.reverse().reduce((acc: string, group: string) => {
          acc +=
            group && !isWithTags(group)
              ? `${openMarkTag}${group}${closMarkTag}`
              : isWithTags(group)
              ? group.replace(new RegExp(`(?<!<[^>]*)`, "g"), matchTags => {
                  return matchTags == " "
                    ? `${openMarkTag}${matchTags}${closMarkTag}`
                    : matchTags;
                })
              : "";
          return acc;
        }, "");
      }
    );
  }
  private replace() {
    const searchRegex = createSearchRegex(this.query);
    const isMatching = this.originalContent.match(searchRegex);
    if (!isMatching || this.query === this.replacement) return false;
    const htmlReplaced = this.originalContent.replace(
      searchRegex,
      (match: string, ...args: Array<string>) => {
        const [, , ...groups] = args.reverse();
        const contentMatched = groups.reverse().filter(g => g);
        const tail =
          this.replacement.slice(
            contentMatched.length,
            this.replacement.length
          ) || "";
        return (
          contentMatched.reduce((acc: string, group: string, index: number) => {
            const currentReplaceStr = convertHTML(this.replacement[index]);
            acc +=
              isWithTags(group) && currentReplaceStr
                ? this.replacement[index - 1] == " "
                  ? group + currentReplaceStr
                  : currentReplaceStr + group
                : isWithTags(group) && !currentReplaceStr
                ? ""
                : currentReplaceStr || "";
            return acc;
          }, "") + tail
        );
      }
    );
    this.contentWrapper.innerHTML = htmlReplaced;
    this.originalContent = htmlReplaced;
  }
  clearContent(html: HTMLElement) {
    const clearedInnerHtml = html.innerHTML
      .replace(/<!--.*?-->/g, "")
      .replace(/ fragment=".*?"/g, "")
      .replace(/&nbsp;/g, " ");
    html.innerHTML = clearedInnerHtml;
    return html;
  }
  mounted() {
    this.contentWrapper = this.clearContent(this.$refs.doc as HTMLElement);
    this.originalContent = this.contentWrapper.innerHTML;
  }
}
</script>

<style>
.highlightText {
  background-color: #76c3f05d;
  border-bottom: solid 0.2px #196ff1;
  transition: all 0.4s ease-in-out;
  color: #196ff1;
  margin: 0;
}
.highlightText--focused {
  background-color: #f1e7acb0;
  border-bottom: solid 0.2px #f15619;
  color: #f15619;
}
</style>
