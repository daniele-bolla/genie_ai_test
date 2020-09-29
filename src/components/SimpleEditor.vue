<script>
const isEmptyObj = (obj) => {
  return Object.keys(obj).length == 0
}

const switchCase = (cases, key, def) => (key in cases ? cases[key]() : def);

const switchTagType = (type)=>{
  const typeCases = {
    paragraph :()=> 'p',
    text:() => Fragment
  }
  return switchCase(typeCases, type, type)
}
import { Fragment } from 'vue-fragment'
import { content } from '@/data/Q1-sample-text.json'
export default {
  name: 'SimpleEditor',
  render(h) {
    const parseContentDoc = ({content, type, text, attrs: {blockCSS, textCSS} = { blockCSS:null, textCss:null}}) => {
      const style = textCSS && !isEmptyObj(textCSS) ? textCSS : blockCSS;
      const tag = switchTagType(type)
      const innerHtml = content ? content.map(parseContentDoc) : text
      return h(tag, {style}, innerHtml)
    }
    const parsedDoc = content.map(parseContentDoc);
   return h('article', parsedDoc)
  }
}
</script>
