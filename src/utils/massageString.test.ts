import { massageString } from "./massageString";

describe("massageString", () => {
  it("should massage a string", () => {
    const example = `    hello
        this
        work`;
    const expected = `hello
    this
    work`;

    expect(massageString(example)).toEqual(expected);
  });
  it("should massage a slightly more complex string", () => {
    const example = `   hello
        this
       work`;
    const expected = `hello
     this
    work`;

    expect(massageString(example)).toEqual(expected);
  });
  it("should keep string if no changes needed", () => {
    const example = `hello
       this
       work`;
    const expected = `hello
       this
       work`;

    expect(massageString(example)).toEqual(expected);
  });
});
