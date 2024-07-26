import { translate } from "./_utils";

export const ordinal = (value: number): string | null => {
  const num = parseInt(value.toString().replace(/[^\d]+/g, ""), 10);
  if (isNaN(num) || num >= Number.MAX_SAFE_INTEGER) {
    return null;
  }

  if ([11, 12, 13].indexOf(num % 100) > -1) {
    return [value, translate("ordinals", "11-13")].join("");
  }
  return [value, translate("ordinals", num % 10)].join("");
};
