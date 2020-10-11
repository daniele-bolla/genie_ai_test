export const escapeRegex = (str: string) => {
  const escapedStr = str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  return escapedStr;
};
export const convertHTML = (entity: string) => {
  interface HTMLEntities {
    [x: string]: string;
  }
  const htmlEntities: HTMLEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  };
  const htmlEncoded = htmlEntities[entity as keyof HTMLEntities] || entity;
  return htmlEncoded;
};
export const isEmptyObj = (obj: object) => {
  return obj && Object.keys(obj).length == 0;
};
export const switchCase = (
  cases: Record<string, Function>,
  key: keyof typeof cases,
  def: unknown
) => (key in cases ? cases[key]() : def);

type objToStringify = Record<string, string>;
export const stringifyObject = (obj: objToStringify): string => {
  return Object.keys(obj).reduce((acc, attr: keyof objToStringify) => {
    const value = obj[attr];
    acc += `${attr}:"${value}";`;
    return acc;
  }, "");
};
