<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue";

interface HTMLEntities {
  [x: string]: string;
}
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
  const htmlEntities: HTMLEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  };
  console.log("entity", entity);
  const htmlEncoded = htmlEntities[entity as keyof HTMLEntities] || entity;
  console.log(htmlEncoded);

  return htmlEncoded;
};
const escapeCharacter = (str: string) => {
  const replaceChar = [
    { reg: "&", replace: "&amp;" },
    { reg: '"', replace: "&quot;" },
    { reg: "£", replace: "&pound;" },
    { reg: "€", replace: "&euro;" },
    { reg: "é", replace: "&eacute;" },
    { reg: "–", replace: "&ndash;" },
    { reg: "®", replace: "&reg;" },
    { reg: "™", replace: "&trade;" },
    { reg: "‘", replace: "&lsquo;" },
    { reg: "’", replace: "&rsquo;" },
    { reg: "“", replace: "&ldquo;" },
    { reg: "”", replace: "&rdquo;" },
    { reg: "#", replace: "&#35;" },
    { reg: "©", replace: "&copy;" },
    { reg: "@", replace: "&commat;" },
    { reg: "$", replace: "&dollar;" },
    { reg: "\\(", replace: "&#40;" },
    { reg: "\\)", replace: "&#41;" },
    { reg: "<", replace: "&lt;" },
    { reg: ">", replace: "&gt;" },
    { reg: "…", replace: "&hellip;" },
    { reg: "-", replace: "&#45;" },
    { reg: "'", replace: "&#39;" },
    { reg: "\\*", replace: "&#42;" },
    { reg: ",", replace: "&sbquo;" }
  ];
  let newString;
  replaceChar.forEach(function(obj) {
    const regEx = new RegExp(obj.reg + "(?!([^<]+)?>)", "g");
    newString = str.replace(regEx, obj.replace);
  });

  return newString;
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
      const search =
        "(?<!<[^>]*)(" +
        this.query
          .split("")
          .map(convertHTML)
          .map(escapeRegex)
          .join(")((?:\\s*(?:<\\/?\\w[^<>]*>)?\\s*)*)(") +
        ")";
      const regex = new RegExp(`${search}`, "gmi");
      const isMatching = this.orignal.match(regex);
      if (isMatching) {
        this.count = 0;
        const html = this.orignal.replaceAll(
          regex,
          (match: string, ...args: Array<string>) => {
            const [, , ...groups] = args.reverse();
            this.count++;
            return groups.reverse().reduce((acc: string, group: string) => {
              // if (group) {
              //   console.log("group", group);
              //   console.log("last in group:", group[group.length - 1]);
              // }

              // console.log("span", group.match(new RegExp(`span`, "gmi")));

              acc +=
                group && !group.match(new RegExp(`<*?>`, "gmi"))
                  ? `<mark class="highlightText highlightText_${this.count}">${group}</mark>`
                  : group.match(new RegExp(`<*?>`, "gmi"))
                  ? group.replace(
                      new RegExp(`(?<!<[^>]*)`, "gmi"),
                      `<mark class="highlightText highlightText_${this.count}">$&</mark>`
                    )
                  : "";
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
