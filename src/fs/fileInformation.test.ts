import fs from "fs";
import { getFileLoc } from "./fileInformation";

describe("fileInformation", () => {
  it("should return loc", () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue("some text\nSome more text");
    expect(getFileLoc("PATH")).toEqual(2);
  });
});
