import { describe, expect, expectTypeOf, it } from "vitest";

import { entries, forEach, isKey, isValue, key, keys, size, value, values } from "../src";
import { getKeys, getKeysByValue, getValuesByKey } from "../src/metadata";
import type {
  EnumIteratee,
  EnumObject,
  EnumValueBase,
  NoInfer,
  Nullable,
  Optional,
} from "../src/types";

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
    expect(value(HetEnum, "A")).toBe(0);
    expect(value(HetEnum, "B")).toBe("B");
    expect(value(HetEnum, "C")).toBe(0.1);
    expect(value(HetEnum, "D")).toBe("E");

    expect(value(HetEnum, "E")).toBeUndefined();
    expect(value(HetEnum, null)).toBeUndefined();
    expect(value(HetEnum, undefined)).toBeUndefined();

    expectTypeOf(value(HetEnum, "A")).toEqualTypeOf<Optional<HetEnum>>();
  });

  it("should get key", () => {
    expect(key(HetEnum, 0)).toBe("A");
    expect(key(HetEnum, "B")).toBe("B");
    expect(key(HetEnum, 0.1)).toBe("C");
    expect(key(HetEnum, "E")).toBe("D");

    expect(key(HetEnum, "F")).toBeUndefined();
    expect(key(HetEnum, null)).toBeUndefined();
    expect(key(HetEnum, undefined)).toBeUndefined();

    expectTypeOf(key(HetEnum, 0)).toEqualTypeOf<Optional<keyof typeof HetEnum>>();
  });

  it("should type check value argument", () => {
    expect(key(NumberEnum, 1)).toBe("A");
    // @ts-expect-error: Argument of type '"A"' is not assignable to parameter of type 'Nullable<number>'
    expect(key(NumberEnum, "A")).toBeUndefined();

    expect(key(StringEnum, "A")).toBe("A");
    // @ts-expect-error: Argument of type '0' is not assignable to parameter of type 'Nullable<string>'
    expect(key(StringEnum, 0)).toBeUndefined();

    expect(key(HetEnum, 0)).toBe("A");
    expect(key(HetEnum, "B")).toBe("B");
    // @ts-expect-error: Argument of type 'true' is not assignable to parameter of type 'Nullable<string | number>'
    expect(key(HetEnum, true)).toBeUndefined();
  });

  describe("Curried", () => {
    it("should get value", () => {
      const getEnumValue = value(HetEnum);

      expect(getEnumValue("A")).toBe(0);
      expect(getEnumValue("B")).toBe("B");
      expect(getEnumValue("C")).toBe(0.1);
      expect(getEnumValue("D")).toBe("E");

      expect(getEnumValue("E")).toBeUndefined();
      expect(getEnumValue(null)).toBeUndefined();
      expect(getEnumValue(undefined)).toBeUndefined();

      expectTypeOf(getEnumValue).parameters.toEqualTypeOf<[Nullable<string>]>();
      expectTypeOf(getEnumValue).returns.toEqualTypeOf<Optional<HetEnum>>();
    });

    it("should get key", () => {
      const getEnumKey = key(HetEnum);

      expect(getEnumKey(0)).toBe("A");
      expect(getEnumKey("B")).toBe("B");
      expect(getEnumKey(0.1)).toBe("C");
      expect(getEnumKey("E")).toBe("D");

      expect(getEnumKey("F")).toBeUndefined();
      expect(getEnumKey(null)).toBeUndefined();
      expect(getEnumKey(undefined)).toBeUndefined();

      expectTypeOf(getEnumKey).parameters.toEqualTypeOf<[Nullable<number | string>]>();
      expectTypeOf(getEnumKey).returns.toEqualTypeOf<Optional<keyof typeof HetEnum>>();
    });

    it("should type check value argument", () => {
      expectTypeOf(key(NumberEnum)).parameters.toEqualTypeOf<[Nullable<number>]>();
      expectTypeOf(key(NumberEnum)).returns.toEqualTypeOf<Optional<keyof typeof NumberEnum>>();

      expectTypeOf(key(StringEnum)).parameters.toEqualTypeOf<[Nullable<string>]>();
      expectTypeOf(key(StringEnum)).returns.toEqualTypeOf<Optional<keyof typeof StringEnum>>();

      expectTypeOf(key(HetEnum)).parameters.toEqualTypeOf<[Nullable<number | string>]>();
      expectTypeOf(key(HetEnum)).returns.toEqualTypeOf<Optional<keyof typeof HetEnum>>();
    });
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

  describe("Curried", () => {
    it("should check key", () => {
      const isEnumKey = isKey(HetEnum);

      expect(isEnumKey("A")).toBe(true);
      expect(isEnumKey("0")).toBe(false);

      expect(isEnumKey("B")).toBe(true);

      expect(isEnumKey("C")).toBe(true);
      expect(isEnumKey("0.1")).toBe(false);

      expect(isEnumKey("D")).toBe(true);
      expect(isEnumKey("E")).toBe(false);
    });

    it("should check value", () => {
      const isEnumValue = isValue(HetEnum);

      expect(isEnumValue("A")).toBe(false);
      expect(isEnumValue(0)).toBe(true);

      expect(isEnumValue("B")).toBe(true);

      expect(isEnumValue("C")).toBe(false);
      expect(isEnumValue(0.1)).toBe(true);

      expect(isEnumValue("D")).toBe(false);
      expect(isEnumValue("E")).toBe(true);
    });

    it("should type check value", () => {
      expectTypeOf(isValue(NumberEnum)).parameters.toEqualTypeOf<[Nullable<number>]>();
      expectTypeOf(isValue(NumberEnum)).returns.toEqualTypeOf<boolean>();

      expectTypeOf(isValue(StringEnum)).parameters.toEqualTypeOf<[Nullable<string>]>();
      expectTypeOf(isValue(StringEnum)).returns.toEqualTypeOf<boolean>();

      expectTypeOf(isValue(HetEnum)).parameters.toEqualTypeOf<[Nullable<number | string>]>();
      expectTypeOf(isValue(HetEnum)).returns.toEqualTypeOf<boolean>();
    });
  });
});

describe("Iteration", () => {
  it("should iterate over entries", () => {
    const entries: [string, number | string][] = [];

    forEach(HetEnum, (value, key, enumObj) => {
      expectTypeOf(value).toEqualTypeOf<HetEnum>();
      expectTypeOf(key).toEqualTypeOf<keyof typeof HetEnum>();
      expectTypeOf(enumObj).toEqualTypeOf<typeof HetEnum>();

      entries.push([key, value]);
    });

    expect(entries).toEqual([
      ["A", 0],
      ["B", "B"],
      ["C", 0.1],
      ["D", "E"],
    ]);
  });

  describe("Curried with iteratee last", () => {
    it("should iterate over entries", () => {
      const forEachEnum = forEach(HetEnum);
      expectTypeOf(forEachEnum).parameters.toEqualTypeOf<[EnumIteratee<typeof HetEnum>]>();

      const entries: [string, number | string][] = [];

      forEachEnum((value, key, enumObj) => {
        expectTypeOf(value).toEqualTypeOf<HetEnum>();
        expectTypeOf(key).toEqualTypeOf<keyof typeof HetEnum>();
        expectTypeOf(enumObj).toEqualTypeOf<typeof HetEnum>();

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

  describe("Curried with iteratee first", () => {
    it("should iterate over entries", () => {
      const entries: [string, number | string][] = [];

      const pushEntries = forEach<typeof HetEnum>((value, key, enumObj) => {
        expectTypeOf(value).toEqualTypeOf<HetEnum>();
        expectTypeOf(key).toEqualTypeOf<keyof typeof HetEnum>();
        expectTypeOf(enumObj).toEqualTypeOf<typeof HetEnum>();

        entries.push([key, value]);
      });
      expectTypeOf(pushEntries).parameters.toEqualTypeOf<[typeof HetEnum]>();

      pushEntries(HetEnum);

      expect(entries).toEqual([
        ["A", 0],
        ["B", "B"],
        ["C", 0.1],
        ["D", "E"],
      ]);
    });
  });
});

declare function inferValueBaseType<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value: Nullable<NoInfer<V>>,
): V;

describe("Inference", () => {
  it("should infer value base type", () => {
    expectTypeOf(() => inferValueBaseType(NumberEnum, 0.1)).returns.toEqualTypeOf<number>();
    expectTypeOf(() => inferValueBaseType(StringEnum, "A")).returns.toEqualTypeOf<string>();
    expectTypeOf(() => inferValueBaseType(HetEnum, 0)).returns.toEqualTypeOf<number | string>();
  });
});
