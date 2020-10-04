<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue";

const delay = (time: number) => {
  let timer;
  clearTimeout(timer);
  return new Promise(resolve => {
    timer = setTimeout(() => {
      resolve(true);
    }, time);
  });
};

@Component
export default class WithHiglight extends Vue {
  @Prop() private query!: string;
  count = 0;
  get orignal() {
    return JSON.parse(JSON.stringify(this.$el.innerHTML))
      .replace(/<!--.*?-->/g, "")
      .replace(/ fragment=".*?"/g, "");
  }
  @Watch("query") async onMatchChanged() {
    await delay(400);

    if (this.query == "" || this.query == " ") {
      this.$el.innerHTML = this.orignal;
      return;
    } else {
      const breakSearch =
        "((?<!<[^>]*)" +
        this.query.replace(new RegExp("[^\\w'-]+", "gm"), ") (") +
        // .split(" ")
        // .join(") (") +
        ")";
      console.log(breakSearch);

      const search = breakSearch.replace(
        /\s/gm,
        "((?:\\s*(?:<\\/?\\w[^<>]*>)?\\s*)*)"
      );

      //((?:\\s*(?:<\\/?\\w[^<>]*>)?\\s*)*)
      const regex = new RegExp(`${search}`, "gmi");
      const isMatching = this.orignal.match(regex);
      if (isMatching) {
        // const tagInMatch = String(isMatching).match(/<.+?>/g);
        this.count = 0;
        const html = this.orignal.replaceAll(
          regex,
          (match: string, ...args: Array<string>) => {
            const [, , ...groups] = args.reverse();
            this.count++;
            return groups.reverse().reduce((acc: string, group: string) => {
              if (group) {
                console.log("group", group);
                console.log("last in group:", group[group.length - 1]);
              }

              console.log("span", group.match(new RegExp(`span`, "gmi")));

              acc +=
                group && !group.match(new RegExp(`<*?>`, "gmi"))
                  ? `<mark class="highlightText highlightText_${this.count}">${group}</mark>`
                  : group.match(new RegExp(`<*?>`, "gmi"))
                  ? group.replace(
                      new RegExp(`(?<!<[^>]*) `, "gmi"),
                      `<mark class="highlightText highlightText_${this.count}"> </mark>`
                    )
                  : "";
              console.log(acc);

              return acc;
            }, "");
          }
        );
        this.$el.innerHTML = html;
      }
    }
  }
  render(createElement: CreateElement): VNode {
    return createElement(
      "div",
      {
        scopedSlots: {
          default: props => createElement("span", props.text)
        }
      },
      this.$slots.default
    );
  }

  private goToMatch(index: number) {
    document
      .querySelector(`.highlightText_${index}`)

      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    document
      .querySelectorAll(`.highlightText_${index}`)
      .forEach(mark => mark?.classList.add("highlightText--focused"));
  }
}
</script>

<style>
.highlightText {
  background: yellow;
  transition: all 1.6s ease-in-out;
}
.highlightText--focused {
  background: orange;
  transform: scale(1.1);
}
</style>
