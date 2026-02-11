export const striptags = (value: string) => {
  value = value.toString();
  value = value.replace(/<[^>]*>/g, "");
  return value;
};

export const stripTags = striptags;
