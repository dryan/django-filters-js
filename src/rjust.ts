import { padStart } from "./_utils";

export const rjust = (value: string, width: number = 0) =>
  padStart(value, width || 0, " ");
