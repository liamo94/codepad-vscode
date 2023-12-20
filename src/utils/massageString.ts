/**
 * Deletes the leading whitespace from a string. If multiline, it will delete the
 * leading whitespace from each line as calculated from the lowest whitespace.
 */
export const massageString = (str: string) => {
  const strArray = str.split("\n");
  const whiteSpaceToTrim = getWhiteSpaceToTrim(strArray);
  return strArray
    .filter((l) => !!l.trim())
    .map((l) => l.replace(new RegExp("^\\s{" + whiteSpaceToTrim + "}"), ""))
    .join("\n");
};

const getWhiteSpaceToTrim = (lines: string[]) =>
  lines.reduce((acc, line) => {
    if (!line.trim()) {
      return acc;
    }
    return Math.min(acc, line.search(/\S/));
  }, Infinity);
