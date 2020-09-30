<script>
import { Fragment } from "vue-fragment";
import { content } from "@/data/Q1-sample-text.json";

const isEmptyObj = obj => {
  return obj && Object.keys(obj).length == 0;
};
const switchCase = (cases, key, def) => (key in cases ? cases[key]() : def);
const getTag = type => {
  const typeCases = {
    paragraph: () => "p",
    text: () => Fragment
  };
  return switchCase(typeCases, type, type);
};
const formattedAttrs = attributes => {
  const { blockCSS, textCSS, ...attrs } = attributes || {};
  const style = textCSS && !isEmptyObj(textCSS) ? textCSS : blockCSS;
  return { attrs, style };
};

export default {
  name: "SimpleEditor",
  render(createElement) {
    const parseContent = ({ content, type, text, attrs }) => {
      const tag = getTag(type);
      const innerHtml = content ? content.map(parseContent) : text;
      return createElement(tag, { ...formattedAttrs(attrs) }, innerHtml);
    };
    const parsedContent = content.map(parseContent);
    return createElement("article", parsedContent);
  }
};
</script>
