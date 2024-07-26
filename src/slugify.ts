export const slugify = (value: string, allowUnicode: boolean = false) => {
  value = value.toString();
  if (allowUnicode) {
    value = value.normalize("NFKC");
  } else {
    value = value.normalize("NFKD").replace(/[^\u0020-\u007F]/g, "");
  }
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]/gu,
      "-"
    )
    .replace(/[-\s]+/gu, "-")
    .replace(/^-|-$/gu, "");
};
