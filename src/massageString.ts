const getWhiteSpaceToTrim = (str: string[]) =>
  str.reduce((acc, line) => {
    if (!line.trim()) {
      return acc;
    }
    return Math.min(acc, line.search(/\S/));
  }, Infinity);

export const massageString = (str: string) => {
  const strArray = str.split("\n");
  const whiteSpaceToTrim = getWhiteSpaceToTrim(strArray);
  return strArray
    .filter((l) => !!l.trim())
    .map((l) => l.replace(new RegExp("^\\s{" + whiteSpaceToTrim + "}"), ""))
    .join("\n");
};
