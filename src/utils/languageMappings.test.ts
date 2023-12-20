import { getLanguageFromAlias } from "./languageMappings";

describe("languageMappings", () => {
  it("Should use fileName if valid fileName", () => {
    expect(getLanguageFromAlias("Dockerfile")).toEqual("dockerfile");
  });
  it("Should use fileName if valid fileName, even with extension", () => {
    expect(getLanguageFromAlias("sources.list", ".list")).toEqual(
      "sourceslist"
    );
  });
  it("Should use extension if no valid fileName", () => {
    expect(getLanguageFromAlias("test.js", ".js")).toEqual("js");
  });
  it("Should return empty if not valid fileName", () => {
    expect(getLanguageFromAlias("test.js")).toEqual("");
  });
  it("Should return empty if not valid fileName and not valid extension", () => {
    expect(getLanguageFromAlias("test.liam", ".liam")).toEqual("");
  });
});
