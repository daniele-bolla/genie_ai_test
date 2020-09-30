<script lang="ts">
import { Fragment } from "vue-fragment";
import { Component, Prop, Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue";

interface Attributes {
  textCSS: object;
  blockCSS: object;
  font: string;
  alignment: string;
  bold: string;
  italic: string;
  underline: {};
  match: [];
}
interface ReducedAttributes {
  font?: string;
  alignment?: string;
  bold?: string;
  italic?: string;
  underline?: {};
  match?: [];
}
interface AttributesAsString {
  textCSS: object;
  blockCSS: object;
  font: string;
  alignment: string;
  bold: string;
  italic: string;
  underline: string;
  marks: string;
}
interface Content {
  attrs: Attributes;
  content: Array<Content>;
  type: string;
  text: string;
}

const isEmptyObj = (obj: object) => {
  return obj && Object.keys(obj).length == 0;
};
const switchCase = (
  cases: Record<string, Function>,
  key: keyof typeof cases,
  def: unknown
) => (key in cases ? cases[key]() : def);

const getTag = (type: string) => {
  const typeCases = {
    paragraph: () => "p",
    text: () => Fragment
  };
  return switchCase(typeCases, type, type);
};
const stringifyObject = (obj: { [x: string]: unknown }): string => {
  return Object.keys(obj).reduce((acc, attr) => {
    const value = obj[attr];
    acc += `${attr}:"${value}";`;
    return acc;
  }, "");
};

const formattedAttrs = (attributes: Attributes) => {
  const { blockCSS, textCSS, ...attrs } = attributes || {};

  const stringifyAttrs = attrs => {
    return Object.keys(attrs).reduce((acc, attr) => {
      const value = attrs[attr];
      acc[attr] = typeof value === "object" ? stringifyObject(value) : value;
      return acc;
    }, {});
  };
  const style = textCSS && !isEmptyObj(textCSS) ? textCSS : blockCSS;
  return { attrs: stringifyAttrs(attrs), style };
};

@Component
export default class SimpleEditor extends Vue {
  @Prop() private content!: Array<Content>;
  render(createElement: CreateElement): VNode {
    const parseContent = ({ content, type, text, attrs }: Content): VNode => {
      const tag = getTag(type);
      const innerHtml = (): VNode[] | string => {
        return content ? content.map(parseContent) : text;
      };
      return createElement(tag, { ...formattedAttrs(attrs) }, innerHtml());
    };
    const parsedContent = this.content.map(parseContent);
    return createElement("article", parsedContent);
  }
}
</script>
