/**
 * Deletes the leading whitespace from a string. If multiline, it will delete the
 * leading whitespace from each line as calculated from the lowest whitespace.
 *
 * @example
 * const input = ```
 *    def add(a, b):
 *        return a+b
 * ```
 * massageString(input)
 * returns ```
 * def add(a, b):
 *     return a+b
 * ```
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
    if (!line.trim()) return acc;
    return Math.min(acc, line.search(/\S/));
  }, Infinity);
