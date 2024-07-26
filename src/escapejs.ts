const translations = {
  "\\\\": "\\u005C",
  "'": "\\u0027",
  '"': "\\u0022",
  ">": "\\u003E",
  "<": "\\u003C",
  "&": "\\u0026",
  "=": "\\u003D",
  "-": "\\u002D",
  ";": "\\u003B",
  "`": "\\u0060",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
  "\u0000": "\\u0000",
  "\u0001": "\\u0001",
  "\u0002": "\\u0002",
  "\u0003": "\\u0003",
  "\u0004": "\\u0004",
  "\u0005": "\\u0005",
  "\u0006": "\\u0006",
  "\u0007": "\\u0007",
  "\b": "\\u0008",
  "\t": "\\u0009",
  "\n": "\\u000A",
  "\u000b": "\\u000B",
  "\f": "\\u000C",
  "\r": "\\u000D",
  "\u000e": "\\u000E",
  "\u000f": "\\u000F",
  "\u0010": "\\u0010",
  "\u0011": "\\u0011",
  "\u0012": "\\u0012",
  "\u0013": "\\u0013",
  "\u0014": "\\u0014",
  "\u0015": "\\u0015",
  "\u0016": "\\u0016",
  "\u0017": "\\u0017",
  "\u0018": "\\u0018",
  "\u0019": "\\u0019",
  "\u001a": "\\u001A",
  "\u001b": "\\u001B",
  "\u001c": "\\u001C",
  "\u001d": "\\u001D",
  "\u001e": "\\u001E",
  "\u001f": "\\u001F",
};

export const escapejs = (value: string): string => {
  value = value.toString();

  Object.entries(translations).forEach((entry) => {
    const find = new RegExp(entry[0], "g");
    const replace = entry[1];
    value = value.replace(find, replace);
  });

  return value;
};

export const escapeJs = escapejs;
