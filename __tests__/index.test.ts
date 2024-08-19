import { describe, expect, expectTypeOf, it } from "vitest";

import { entries, forEach, getKey, getValue, isKey, isValue, keys, size, values } from "../src";
import { getKeys, getKeysByValue, getValuesByKey } from "../src/metadata";
import type { EnumObject, EnumValueBase } from "../src/types";

enum NumberEnum {
  A = 1,
}

enum StringEnum {
  A = "A",
}

enum HetEnum {
  A,
  B = "B",
  C = 0.1,
  D = "E",
}

describe("Metadata", () => {
  it("should get keys", () => {
    expect(getKeys(HetEnum)).toEqual(["A", "B", "C", "D"]);
  });

  it("should get keys by value", () => {
    expect([...getKeysByValue(HetEnum).entries()]).toEqual([
      [0, "A"],
      ["B", "B"],
      [0.1, "C"],
      ["E", "D"],
    ]);
  });

  it("should get values by key", () => {
    expect([...getValuesByKey(HetEnum).entries()]).toEqual([
      ["A", 0],
      ["B", "B"],
      ["C", 0.1],
      ["D", "E"],
    ]);
  });
});

describe("Size", () => {
  it("should get size", () => {
    expect(size(HetEnum)).toBe(4);
  });
});

describe("Iterators", () => {
  it("should get keys", () => {
    expect([...keys(HetEnum)]).toEqual(["A", "B", "C", "D"]);
  });

  it("should get values", () => {
    expect([...values(HetEnum)]).toEqual([0, "B", 0.1, "E"]);
  });

  it("should get entries", () => {
    expect([...entries(HetEnum)]).toEqual([
      ["A", 0],
      ["B", "B"],
      ["C", 0.1],
      ["D", "E"],
    ]);
  });
});

describe("Getters", () => {
  it("should get value", () => {
    expect(getValue(HetEnum, "A")).toBe(0);
    expect(getValue(HetEnum, "B")).toBe("B");
    expect(getValue(HetEnum, "C")).toBe(0.1);
    expect(getValue(HetEnum, "D")).toBe("E");
    expect(getValue(HetEnum, "E")).toBeUndefined();
    expect(getValue(HetEnum, null)).toBeUndefined();
  });

  it("should get key", () => {
    expect(getKey(HetEnum, 0)).toBe("A");
    expect(getKey(HetEnum, "B")).toBe("B");
    expect(getKey(HetEnum, 0.1)).toBe("C");
    expect(getKey(HetEnum, "E")).toBe("D");
    expect(getKey(HetEnum, "F")).toBeUndefined();
    expect(getKey(HetEnum, null)).toBeUndefined();
  });

  it("should type check value argument", () => {
    expect(getKey(NumberEnum, 1)).toBe("A");
    // @ts-expect-error: only number values are allowed
    expect(getKey(NumberEnum, "A")).toBeUndefined();

    expect(getKey(StringEnum, "A")).toBe("A");
    // @ts-expect-error: only string values are allowed
    expect(getKey(StringEnum, 0)).toBeUndefined();

    expect(getKey(HetEnum, 0)).toBe("A");
    expect(getKey(HetEnum, "B")).toBe("B");
    // @ts-expect-error: only string or number values are allowed
    expect(getKey(HetEnum, true)).toBeUndefined();
  });
});

describe("Predicates", () => {
  it("should check key", () => {
    expect(isKey(HetEnum, "A")).toBe(true);
    expect(isKey(HetEnum, "0")).toBe(false);

    expect(isKey(HetEnum, "B")).toBe(true);

    expect(isKey(HetEnum, "C")).toBe(true);
    expect(isKey(HetEnum, "0.1")).toBe(false);

    expect(isKey(HetEnum, "D")).toBe(true);
    expect(isKey(HetEnum, "E")).toBe(false);
  });

  it("should check value", () => {
    expect(isValue(HetEnum, "A")).toBe(false);
    expect(isValue(HetEnum, 0)).toBe(true);

    expect(isValue(HetEnum, "B")).toBe(true);

    expect(isValue(HetEnum, "C")).toBe(false);
    expect(isValue(HetEnum, 0.1)).toBe(true);

    expect(isValue(HetEnum, "D")).toBe(false);
    expect(isValue(HetEnum, "E")).toBe(true);
  });

  it("should type check value", () => {
    expect(isValue(NumberEnum, 1)).toBe(true);
    // @ts-expect-error: only number values are allowed
    expect(isValue(NumberEnum, "A")).toBe(false);

    expect(isValue(StringEnum, "A")).toBe(true);
    // @ts-expect-error: only string values are allowed
    expect(isValue(StringEnum, 0)).toBe(false);

    expect(isValue(HetEnum, 0)).toBe(true);
    expect(isValue(HetEnum, "B")).toBe(true);
    // @ts-expect-error: only string or number values are allowed
    expect(isValue(HetEnum, true)).toBe(false);
  });
});

describe("Iteration", () => {
  it("should iterate over entries", () => {
    const entries: [string, number | string][] = [];
    forEach(HetEnum, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<HetEnum>();
      expectTypeOf(key).toEqualTypeOf<keyof typeof HetEnum>();
      entries.push([key, value]);
    });
    expect(entries).toEqual([
      ["A", 0],
      ["B", "B"],
      ["C", 0.1],
      ["D", "E"],
    ]);
  });
});

declare function inferValueBaseType<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value: NoInfer<V> | null | undefined,
): V;

describe("Inference", () => {
  it("should infer value base type", () => {
    expectTypeOf(() => inferValueBaseType(NumberEnum, 0.1)).returns.toEqualTypeOf<number>();
    expectTypeOf(() => inferValueBaseType(StringEnum, "A")).returns.toEqualTypeOf<string>();
    expectTypeOf(() => inferValueBaseType(HetEnum, 0)).returns.toEqualTypeOf<number | string>();
  });
});
