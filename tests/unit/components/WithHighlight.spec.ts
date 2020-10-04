import { mount } from "@vue/test-utils";
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

describe("WithHiglight", () => {
  const query = "Search Text";

  // it("highlights query text", async done => {
  //   const wrapper = mount(WithHiglight, {
  //     slots: {
  //       default: "<p>Lorem Ipsum Search Text</p>"
  //     }
  //   });
  //   wrapper.setProps({ query });
  //   await Vue.nextTick();
  //   await delay(300);
  //   const matches = wrapper.findAll(".highlightText");
  //   console.log(wrapper.vm);
  //   expect(matches.length).toBe(1);
  //   done();
  // });

  it("escapes html tags", async () => {
    const wrapper = mount(WithHiglight, {
      slots: {
        default: "<p>Lorem Ipsum <i>Search</i> Text</p>"
      }
    });
    wrapper.setProps({ query });
    await Vue.nextTick();
    await delay(300);
    console.log(wrapper.html());
    const matches = wrapper.findAll(".highlightText");

    expect(matches.length).toBe(1);
  });
  it("escapes specail regex chars", async () => {
    const wrapper = mount(WithHiglight, {
      slots: {
        default: "<p>Lorem Ipsum <i>Search</i> Text</p>"
      }
    });
    wrapper.setProps({ query });
    await Vue.nextTick();
    await delay(300);
    console.log(wrapper.html());
    const matches = wrapper.findAll(".highlightText");

    expect(matches.length).toBe(1);
  });
});
