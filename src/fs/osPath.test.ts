import os from "os";
import { getOsPath } from "./osPath";

describe("getOsPath", () => {
  it("should return the same path if not windows", () => {
    jest.spyOn(os, "platform").mockReturnValue("darwin");
    const path = "/some/path";
    const result = getOsPath(path);
    expect(result).toEqual(path);
  });
  it("should return a windows path if windows", () => {
    jest.spyOn(os, "platform").mockReturnValue("win32");
    const path = "/some/path";
    const windowsPath = "\\some\\path";
    const result = getOsPath(path);
    expect(result).toEqual(windowsPath);
  });
});
