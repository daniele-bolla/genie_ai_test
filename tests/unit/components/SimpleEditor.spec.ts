import { mount, Wrapper } from "@vue/test-utils";
import SimpleEditor from "@/components/SimpleEditor.vue";
import { content } from "@/data/Q1-test-text.json";

describe("SimpleEditor", () => {
  let wrapper: Wrapper<Vue>;
  beforeEach(() => {
    wrapper = mount(SimpleEditor, { propsData: { content } });
  });
  it("renders all elements correctly", () => {
    const paragraphs = wrapper.findAll("p");
    const spans = wrapper.findAll("span");

    expect(paragraphs.length).toBe(2);
    expect(spans.length).toBe(1);
  });
  it("renders all spaces correctly", () => {
    const paragraphs = wrapper.findAll("p");
    const spans = wrapper.findAll("span");

    expect(paragraphs.length).toBe(2);
    expect(spans.length).toBe(1);
  });
  it("renders all attributes correctly", () => {
    const span = wrapper.find("span");

    expect(Object.keys(span.attributes()).length).toBe(4);
    expect(span.attributes().bold).toBe("true");
    expect(span.attributes().font).toBe("Times New Roman");
    expect(span.attributes().style).toBe(
      "font-family: Times New Roman; font-weight: bold; text-decoration: underline; text-decoration-style: solid;"
    );
    expect(span.attributes().underline).toBe('val:"single";color:"null";');
  });
  it("renders the style correctly", () => {
    const title = wrapper.find("p[id=title]");
    const { style } = title.attributes();

    expect(style).toMatch("text-align: center");
  });
});
