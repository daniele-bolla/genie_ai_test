import { shallowMount, Wrapper } from "@vue/test-utils";
import { delay } from "@/delay";
import WithHighlight from "@/components/WithHighlight.vue";
import Vue from "vue";

const getSelectedText = (wrappers: Array<Wrapper<Vue>>) => {
  return wrappers.reduce((acc, mark) => {
    acc += mark.text() || " ";
    return acc;
  }, "");
};
jest.mock("@/delay", () => ({
  delay: jest.fn(() => {
    return Promise.resolve();
  })
}));

describe("WithHighlight", () => {
  it("highlights all matches", async () => {
    const query = "Text";
    const wrapper = shallowMount(WithHighlight, {
      slots: {
        content: "<p>Lorem Ipsum Search Text, text</p>"
      }
    });
    wrapper.setProps({ query });
    await delay(0);
    await Vue.nextTick();
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);
    expect(count).toBe(2);
    expect(selectedText).toBe(query);
  });
  it("escapes html tags", async () => {
    const query = "Search Text";
    const wrapper: Wrapper<Vue> = shallowMount(WithHighlight, {
      slots: {
        content: "<p>Lorem Ipsum <i>Search</i> Text</p>"
      }
    });
    wrapper.setProps({ query });
    await delay(0);
    await Vue.nextTick();
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);
    expect(count).toBe(1);
    expect(selectedText).toBe(query);
  });
  it("highlights special regex chars", async () => {
    const query = "Search( Text, []|).";
    const wrapper = shallowMount(WithHighlight, {
      slots: {
        content: "<p>Lorem Ipsum <i>Search(</i> Text, []|)<span>.</span></p>"
      }
    });
    wrapper.setProps({ query });
    await delay(0);
    await Vue.nextTick();
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);
    expect(count).toBe(1);
    expect(selectedText).toBe(query);
  });
  it("highlights special html entities", async () => {
    const query = "Search & Text";
    const wrapper = shallowMount(WithHighlight, {
      slots: {
        content: "<p>Lorem Ipsum Search &amp; Text</p>"
      }
    });
    wrapper.setProps({ query });
    await delay(0);
    await Vue.nextTick();
    const { count } = wrapper.vm as any;
    const marks = wrapper.findAll(`.highlightText_1`);
    const selectedText = getSelectedText(marks.wrappers);
    expect(count).toBe(1);
    expect(selectedText).toBe(query);
  });
  it("replces text correctly and highlight after", async () => {
    const query = "Text to replace";
    const replacement = "Text to replace";
    const wrapper = shallowMount(WithHighlight, {
      slots: {
        content: "<p>Lorem Ipsum Search &amp; Text to replace</p>"
      }
    });
    wrapper.setProps({ query, replacement });
    await delay(0);
    await Vue.nextTick();
    const { replace } = wrapper.vm as any;
    expect(replace()).toBeFalsy();
  });
});
