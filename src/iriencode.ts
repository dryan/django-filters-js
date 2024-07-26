import { urlquote } from "./_utils";

export const iriencode = (value: string): string => {
  value = value.toString();
  return urlquote(value, "/#%[]=:;$&()+,!?*@'~");
};

export const iriEncode = iriencode;
