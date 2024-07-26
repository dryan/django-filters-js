export const title = (value: string) => {
  value = value.toString();
  value = value.replace(
    /[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]*/gu,
    (txt) =>
      [
        txt.charAt(0).toUpperCase(),
        txt.slice(1, txt.length).toLowerCase(),
      ].join("")
  );
  // fix things like I'D
  value = value.replace(
    /([a-zA-Z])'([A-Z])/g,
    (_, g1, g2) => `${g1}'${g2.toLowerCase()}`
  );
  return value;
};
