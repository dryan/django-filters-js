import { escape } from "./escape";

export const linebreaks = (value: string, autoescape: boolean = true) => {
  value = value.toString();
  value = value.replace(/\r\n|\r/g, "\n");
  let valueAsArray = value.split(/\n{2,}/g);
  if (autoescape) {
    valueAsArray = valueAsArray.map(
      (para) => `<p>${escape(para).replace(/\n/g, "<br>")}</p>`
    );
  } else {
    valueAsArray = valueAsArray.map(
      (para) => `<p>${para.replace(/\n/g, "<br>")}</p>`
    );
  }
  value = valueAsArray.join("\n\n");
  return value;
};
