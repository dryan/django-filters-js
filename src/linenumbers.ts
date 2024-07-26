import { padStart } from "./_utils";
import { escape } from "./escape";

export const linenumbers = (value: string, autoescape: boolean = true) => {
  value = value.toString();
  let lines = value.split("\n");
  const width = lines.length.toString().length;
  lines = lines.map((line, index) => {
    const lineNumber = padStart((index + 1).toString(), width, "0");
    if (autoescape) {
      line = escape(line);
    }
    return `${lineNumber}. ${line}`;
  });
  return lines.join("\n");
};

export const lineNumbers = linenumbers;
