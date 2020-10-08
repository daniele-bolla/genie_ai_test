import { Fragment } from "vue-fragment";
import { Component, Prop, Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue";
import { isEmptyObj, switchCase, stringifyObject } from "@/utils";

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

const getTag = (type: string) => {
  const typeCases = {
    paragraph: () => "p",
    text: () => Fragment
  };
  return switchCase(typeCases, type, type);
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
export default class DocCompiler extends Vue {
  @Prop() private readonly content!: Array<Content>;
  render(createElement: CreateElement): VNode {
    const parseContent = ({ content, type, text, attrs }: Content): VNode => {
      const tag = getTag(type);
      const textCaptureSpace = text == " " || !text ? "\u00A0" : text;
      const innerHtml = (): VNode[] | string => {
        return content && content.length
          ? content.map(parseContent)
          : textCaptureSpace;
      };
      return createElement(tag, { ...formattedAttrs(attrs) }, innerHtml());
    };
    const parsedContent = this.content.map(parseContent);
    return createElement("div", parsedContent);
  }
}
