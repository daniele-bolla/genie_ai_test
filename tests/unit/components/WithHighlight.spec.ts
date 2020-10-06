import { shallowMount, Wrapper } from "@vue/test-utils";
import WithHiglight from "@/components/WithHiglight.vue";
import Vue from "vue";

const delay = (time: number) => {
  let timer;
  clearTimeout(timer);
  return new Promise(resolve => {
    timer = setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const getSelectedText = (wrappers: Array<Wrapper<Vue>>) => {
  return wrappers.reduce((acc, mark) => {
    acc += mark.text() || " ";
    return acc;
  }, "");
};
jest.setTimeout(30000);
describe("WithHiglight", () => {
  it("highlights all matches", async () => {
    const query = "Text";
    const wrapper = shallowMount(WithHiglight, {
      slots: {
        content: "<p>Lorem Ipsum Search Text, text</p>"
      }
    });
    wrapper.setProps({ query });
    await Vue.nextTick();
    await delay(300);
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);

    expect(count).toBe(2);
    expect(selectedText).toBe(query);
  });
  it("escapes html tags", async () => {
    const query = "Search Text";
    const wrapper = shallowMount(WithHiglight, {
      slots: {
        content: "<p>Lorem Ipsum <i>Search</i> Text</p>"
      }
    });
    wrapper.setProps({ query });
    await Vue.nextTick();
    await delay(300);
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);

    expect(count).toBe(1);
    expect(selectedText).toBe(query);
  });
  it("highlights special regex chars", async () => {
    const query = "Search( Text, []|).";
    const wrapper = shallowMount(WithHiglight, {
      slots: {
        content: "<p>Lorem Ipsum <i>Search(</i> Text, []|)<span>.</span></p>"
      }
    });
    wrapper.setProps({ query });
    await Vue.nextTick();
    await delay(300);
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);

    expect(count).toBe(1);
    expect(selectedText).toBe(query);
  });
  it("highlights special html entities", async () => {
    const query = "Search & Text";
    const wrapper = shallowMount(WithHiglight, {
      slots: {
        content: "<p>Lorem Ipsum Search &amp; Text</p>"
      }
    });
    wrapper.setProps({ query });
    await Vue.nextTick();
    await delay(300);
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);

    expect(count).toBe(1);
    expect(selectedText).toBe(query);
  });
});
