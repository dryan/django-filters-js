export const cut = (value: string, toCut: string): string => {
  const regex = new RegExp(toCut, "g");
  return value.toString().replace(regex, "");
};
