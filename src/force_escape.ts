import { escape } from "./escape";

export const force_escape = (value: string) => {
  return escape(value);
};

export const forceEscape = force_escape;
