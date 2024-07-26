export const capfirst = (value: string): string => {
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1, value.length);
};

export const capFirst = capfirst;
