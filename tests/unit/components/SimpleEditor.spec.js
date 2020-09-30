import { shallowMount } from "@vue/test-utils";
import SimpleEditor from "@/components/SimpleEditor.vue";

describe("SimpleEditor.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(SimpleEditor);
    expect(wrapper.text()).toMatch(msg);
  });
});
