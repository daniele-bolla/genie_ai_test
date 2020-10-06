<template>
  <div>
    <slot v-bind:nav="{ count, currentFocused, prev, next }" name="nav"></slot>
    <div ref="doc">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

const delay = (time: number) => {
  let timer;
  clearTimeout(timer);
  return new Promise(resolve => {
    timer = setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const escapeRegex = (str: string) => {
  const escapedStr = str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  return escapedStr;
};
const convertHTML = (entity: string) => {
  interface HTMLEntities {
    [x: string]: string;
  }
  const htmlEntities: HTMLEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  };
  const htmlEncoded = htmlEntities[entity as keyof HTMLEntities] || entity;
  return htmlEncoded;
};

@Component
export default class WithHiglight extends Vue {
  private count = 0;
  private currentFocused = 0;
  private contentWrapper!: HTMLElement;
  @Prop() private readonly query!: string;
  get clearedContent() {
    return this.contentWrapper.innerHTML
      .replace(/<!--.*?-->/g, "")
      .replace(/ fragment=".*?"/g, "")
      .replace(/&nbsp;/g, " ");
  }
  @Watch("query") async onMatchChanged() {
    await delay(300);
    if (!this.query || this.query == "") {
      this.count = 0;
      this.currentFocused = 0;
      this.contentWrapper.innerHTML = this.clearedContent;
      return;
    } else {
      const escapeStringInTags = "(?<!<[^>]*)";
      const includeTagsAsSpace = "((?:\\s*(?:<\\/?\\w[^<>]*>)?\\s*)*)";
      const formattedQuery = this.query
        .split("")
        .map(convertHTML)
        .map(escapeRegex)
        .join(`)${includeTagsAsSpace}(`);
      const search = `${escapeStringInTags}(${formattedQuery})`;
      const searchRegex = new RegExp(`${search}`, "gmi");
      const isMatching = this.clearedContent.match(searchRegex);
      if (isMatching) {
        this.count = 0;
        this.currentFocused = 0;
        const html = this.clearedContent.replace(
          searchRegex,
          (match: string, ...args: Array<string>) => {
            const [, , ...groups] = args.reverse();
            this.count++;
            return groups.reverse().reduce((acc: string, group: string) => {
              acc +=
                group && !group.match(new RegExp(`<*?>`, "gmi"))
                  ? `<mark class="highlightText highlightText_${this.count}">${group}</mark>`
                  : group.match(new RegExp(`<*?>`, "gmi"))
                  ? group.replace(
                      new RegExp(`(?<!<[^>]*)`, "gmi"),
                      matchTags => {
                        return matchTags === " "
                          ? `<mark class="highlightText highlightText_${this.count}">${matchTags}</mark>`
                          : matchTags;
                      }
                    )
                  : "";
              return acc;
            }, "");
          }
        );
        this.contentWrapper.innerHTML = html;
      }
    }
  }
  prev() {
    if (this.currentFocused > 1) {
      this.currentFocused--;
      this.goToMatch(this.currentFocused);
    }
  }
  next() {
    if (this.currentFocused < this.count) {
      this.currentFocused++;
      this.goToMatch(this.currentFocused);
    }
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
  mounted() {
    this.contentWrapper = this.$refs.doc as HTMLElement;
    this.$nextTick(() => {
      this.contentWrapper.innerHTML = this.clearedContent;
    });
  }
}
</script>

<style>
.nav {
  position: sticky;
  top: 0;
  width: 100%;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.6);
}
.nav__right {
  margin-left: 3rem;
}
.nav__left {
  display: flex;
  flex-direction: column;
}
.highlightText {
  background: yellow;
  transition: all 0.6s ease-in-out;
}
.highlightText--focused {
  background: red;
  transform: scale(1.1);
}
</style>
