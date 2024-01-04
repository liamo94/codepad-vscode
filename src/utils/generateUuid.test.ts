import { generateUID } from "./generateUuid";

describe("generateUuid", () => {
  it("should generate a UUID", () => {
    const uuid = generateUID();
    expect(uuid).toHaveLength(3);
  });
});
