import { padEnd } from "./_utils";

export const ljust = (value: string, width: number = 0) =>
  padEnd(value, width, " ");
