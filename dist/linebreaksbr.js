import { escape } from "./escape";
export const linebreaksbr = (value, autoescape = true) => {
    value = value.toString();
    value = value.replace(/\r\n|\r/g, "\n");
    if (autoescape) {
        value = escape(value);
    }
    value = value.replace(/\n/g, "<br>");
    return value;
};
export const linebreaksBr = linebreaksbr;
//# sourceMappingURL=linebreaksbr.js.map