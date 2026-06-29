import { timeuntil } from "../dist/timesince.js";
import { timedelta } from "./helpers.js";

describe("timeuntil", () => {
  test("since now", () => {
    expect(
      timeuntil(
        new Date(new Date().getTime() + timedelta({ days: 1, seconds: 1 }))
      )
    ).toBe("1\xa0day");
  });

  test("no argument", () => {
    const originalWarn = console.warn;
    console.warn = vi.fn();
    expect(timeuntil(null)).toBe("");
    console.warn = originalWarn;
  });

  test("explicit date", () => {
    expect(timeuntil(new Date(2005, 11, 30), new Date(2005, 11, 29))).toBe(
      "1\xa0day"
    );
  });
});
