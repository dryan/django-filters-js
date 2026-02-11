export const striptags = (value) => {
  value = value.toString();
  // Apply replacement repeatedly to prevent tag re-injection
  // and limit ReDoS by ensuring we stop when no more matches
  let previous;
  do {
    previous = value;
    value = value.replace(/<[^>]*>/g, "");
  } while (value !== previous);
  return value;
};
export const stripTags = striptags;
//# sourceMappingURL=striptags.js.map
