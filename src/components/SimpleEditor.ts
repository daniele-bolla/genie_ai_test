import { Fragment } from "vue-fragment";
import { Component, Prop, Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue";

interface Attributes {
  textCSS: Record<string, string>;
  blockCSS: Record<string, string>;
  font: string;
  alignment: string;
  bold: string;
  italic: string;
  underline: Record<string, string>;
}
interface ReducedAttributes {
  font: string;
  alignment: string;
  bold: string;
  italic: string;
  underline: Record<string, string>;
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
type objToStringify = Record<string, string>;
const getTag = (type: string) => {
  const typeCases = {
    paragraph: () => "p",
    text: () => Fragment
  };
  return switchCase(typeCases, type, type);
};
const stringifyObject = (obj: objToStringify): string => {
  return Object.keys(obj).reduce((acc, attr: keyof objToStringify) => {
    const value = obj[attr];
    acc += `${attr}:"${value}";`;
    return acc;
  }, "");
};
const formattedAttrs = (attributes: Attributes) => {
  const { blockCSS, textCSS, ...attrs } = attributes || {};
  const stringifyAttrs = (attrs: ReducedAttributes) => {
    return Object.keys(attrs).reduce((acc: Record<string, string>, attr) => {
      const value = attrs[attr as keyof ReducedAttributes];
      acc[attr as keyof ReducedAttributes] =
        value && typeof value === "object" ? stringifyObject(value) : value;
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
    return createElement("div", parsedContent);
  }
}
