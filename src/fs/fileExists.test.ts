import fs from "fs";
import { join } from "path";
import { fileExists } from "./fileExists";

jest.mock("fs");

describe("fileExists", () => {
  const directory = "/path/to/directory";
  const fileName = "testFile";
  const extension = "md";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when file exists", () => {
    jest.spyOn(fs, "accessSync").mockReturnValue();
    const result = fileExists(directory, fileName, extension);

    expect(result).toBe(true);
    expect(fs.accessSync).toHaveBeenCalledWith(
      `${join(directory, fileName)}.${extension}`
    );
  });

  it("should return false when file does not exist", () => {
    jest.spyOn(fs, "accessSync").mockImplementation(() => {
      throw new Error("File not found");
    });

    const result = fileExists(directory, fileName, extension);

    expect(result).toBe(false);
    expect(fs.accessSync).toHaveBeenCalledWith(
      `${join(directory, fileName)}.${extension}`
    );
  });
});
