import { urlquote } from "./_utils";
export const iriencode = (value) => {
    value = value.toString();
    return urlquote(value, "/#%[]=:;$&()+,!?*@'~");
};
export const iriEncode = iriencode;
//# sourceMappingURL=iriencode.js.map