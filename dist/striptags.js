export const striptags = (value) => {
  value = value.toString();
  // Use character-by-character state machine to avoid ReDoS
  // This is O(n) with no backtracking, unlike regex approaches
  let result = "";
  let insideTag = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === "<") {
      insideTag = true;
    } else if (char === ">" && insideTag) {
      // Only treat > as closing tag if we're inside a tag
      insideTag = false;
    } else if (!insideTag) {
      result += char;
    }
  }
  return result;
};
export const stripTags = striptags;
//# sourceMappingURL=striptags.js.map
