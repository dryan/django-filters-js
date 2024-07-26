import {
  translations,
  TranslationStringsKey,
  TranslationsGroup,
  TranslatedLanguage,
} from "./translations";

/* istanbul ignore next */
export const inspect = (obj: unknown) => JSON.stringify(obj, null, 2);

export const avoidWrapping = (value: string) => value.replace(/ /g, "\xa0");

export const padStart = (
  obj: unknown,
  len: number,
  pad: number | string
): string => {
  obj = obj.toString();
  pad = pad.toString();
  return (obj as string).padStart(len, pad);
};

export const padEnd = (
  obj: unknown,
  len: number,
  pad: number | string
): string => {
  obj = obj.toString();
  pad = pad.toString();
  return (obj as string).padEnd(len, pad);
};

export type ParseDateInput = Date | number | string;

export const parseDate = (value: ParseDateInput): Date | null => {
  if (value instanceof Date) {
    return value;
  } else if (typeof value === "number") {
    return new Date(value);
  }
  value = String(value); // not using toString here to handle null, undefined, etc.
  const date = new Date(value.replace(/-/g, "/").replace(/T/g, " "));
  if (date.toString().toLowerCase() === "invalid date") {
    if (console && console.warn) {
      console.warn(`${value} was not parsed as a Date`);
    }
    return null;
  }
  return date;
};

export const getLanguageCode = (): string => {
  return (navigator && navigator.language ? navigator.language : "en-US")
    .toLowerCase()
    .replace("_", "-");
};

type TranslationGroupReturnsArray = "timeunits";

type TranslationGroupWithoutTime = Exclude<
  TranslationsGroup,
  TranslationGroupReturnsArray
>;

export function translate(
  group: "timeunits",
  id: TranslationStringsKey,
  languageCode?: string
): string[] | undefined;
export function translate(
  group: TranslationGroupWithoutTime,
  id: TranslationStringsKey,
  languageCode?: string
): string | undefined;
export function translate(
  group: TranslationsGroup,
  id: TranslationStringsKey,
  languageCode?: string
): string | string[] | undefined {
  languageCode = languageCode || getLanguageCode().toLowerCase();
  let lang: TranslatedLanguage;
  if (translations[languageCode]) {
    lang = translations[languageCode];
  } else if (translations[languageCode.split("-")[0]]) {
    lang = translations[languageCode.split("-")[0]];
  } else {
    lang = translations["en-us"];
  }
  if (lang && lang[group]) {
    return lang[group][id];
  }
  return undefined;
}
translate.translations = translations;

export const urlquote = (value: string, safe: string = "/"): string => {
  value = value.toString();
  safe = safe
    .split("")
    .map((chr) => `\\${chr}`)
    .join("|");
  const notSafe = new RegExp(`[^${safe}]`, "g");
  return value.replace(notSafe, encodeURIComponent);
};
