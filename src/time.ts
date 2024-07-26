import { date, DateFormat } from "./date";

export function time(value: Date, format: "L"): boolean;
export function time(value: Date, format: DateFormat): string;
export function time(value: Date, format: undefined): string;
export function time(value: Date, format: string): string;
export function time(
  value: Date,
  format: DateFormat | string = date.defaultFormats.time
): string | null | boolean {
  return date(value, format);
}
