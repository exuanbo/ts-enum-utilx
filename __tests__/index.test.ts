import { describe, expect, expectTypeOf, it } from "vitest";

import * as E from "../src";
import { getEntries, getKeys, getValueKeyMap } from "../src/metadata";
import type {
  AnyEnumObject,
  AnyEnumValue,
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

  it("should get entries", () => {
    expect(getEntries(HetEnum)).toEqual([
      ["A", 0],
      ["B", "B"],
      ["C", 0.1],
      ["D", "E"],
    ]);
  });

  it("should get keys by value", () => {
    expect([...getValueKeyMap(HetEnum).entries()]).toEqual([
      [0, "A"],
      ["B", "B"],
      [0.1, "C"],
      ["E", "D"],
    ]);
  });
});

describe("Size", () => {
  it("should get size", () => {
    expect(E.size(HetEnum)).toBe(4);
  });
});

describe("Iterators", () => {
  it("should get keys", () => {
    expect([...E.keys(HetEnum)]).toEqual(["A", "B", "C", "D"]);
  });

  it("should get values", () => {
    expect([...E.values(HetEnum)]).toEqual([0, "B", 0.1, "E"]);
  });

  it("should get entries", () => {
    expect([...E.entries(HetEnum)]).toEqual([
      ["A", 0],
      ["B", "B"],
      ["C", 0.1],
      ["D", "E"],
    ]);
  });
});

describe("Getters", () => {
  it("should get value", () => {
    expect(E.value(HetEnum, "A")).toBe(0);
    expect(E.value(HetEnum, "B")).toBe("B");
    expect(E.value(HetEnum, "C")).toBe(0.1);
    expect(E.value(HetEnum, "D")).toBe("E");

    expect(E.value(HetEnum, "E")).toBeUndefined();
    expect(E.value(HetEnum, null)).toBeUndefined();
    expect(E.value(HetEnum, undefined)).toBeUndefined();

    expectTypeOf(E.value(HetEnum, "A")).toEqualTypeOf<Optional<HetEnum>>();
  });

  it("should get key", () => {
    expect(E.key(HetEnum, 0)).toBe("A");
    expect(E.key(HetEnum, "B")).toBe("B");
    expect(E.key(HetEnum, 0.1)).toBe("C");
    expect(E.key(HetEnum, "E")).toBe("D");

    expect(E.key(HetEnum, "F")).toBeUndefined();
    expect(E.key(HetEnum, null)).toBeUndefined();
    expect(E.key(HetEnum, undefined)).toBeUndefined();

    expectTypeOf(E.key(HetEnum, 0)).toEqualTypeOf<Optional<keyof typeof HetEnum>>();
  });

  it("should type check value argument", () => {
    expect(E.key(NumberEnum, 1)).toBe("A");
    // @ts-expect-error: Argument of type '"A"' is not assignable to parameter of type 'Nullable<number>'.
    expect(E.key(NumberEnum, "A")).toBeUndefined();

    expect(E.key(StringEnum, "A")).toBe("A");
    // @ts-expect-error: Argument of type '0' is not assignable to parameter of type 'Nullable<string>'.
    expect(E.key(StringEnum, 0)).toBeUndefined();

    expect(E.key(HetEnum, 0)).toBe("A");
    expect(E.key(HetEnum, "B")).toBe("B");
    // @ts-expect-error: Argument of type 'true' is not assignable to parameter of type 'Nullable<string | number>'.
    expect(E.key(HetEnum, true)).toBeUndefined();
  });

  describe("Curried", () => {
    it("should get value", () => {
      const getEnumValue = E.value(HetEnum);

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
      const getEnumKey = E.key(HetEnum);

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
      expectTypeOf(E.key(NumberEnum)).parameters.toEqualTypeOf<[Nullable<number>]>();
      expectTypeOf(E.key(NumberEnum)).returns.toEqualTypeOf<Optional<keyof typeof NumberEnum>>();

      expectTypeOf(E.key(StringEnum)).parameters.toEqualTypeOf<[Nullable<string>]>();
      expectTypeOf(E.key(StringEnum)).returns.toEqualTypeOf<Optional<keyof typeof StringEnum>>();

      expectTypeOf(E.key(HetEnum)).parameters.toEqualTypeOf<[Nullable<number | string>]>();
      expectTypeOf(E.key(HetEnum)).returns.toEqualTypeOf<Optional<keyof typeof HetEnum>>();
    });
  });
});

describe("Predicates", () => {
  it("should check key", () => {
    expect(E.isKey(HetEnum, "A")).toBe(true);
    expect(E.isKey(HetEnum, "0")).toBe(false);

    expect(E.isKey(HetEnum, "B")).toBe(true);

    expect(E.isKey(HetEnum, "C")).toBe(true);
    expect(E.isKey(HetEnum, "0.1")).toBe(false);

    expect(E.isKey(HetEnum, "D")).toBe(true);
    expect(E.isKey(HetEnum, "E")).toBe(false);
  });

  it("should check value", () => {
    expect(E.isValue(HetEnum, "A")).toBe(false);
    expect(E.isValue(HetEnum, 0)).toBe(true);

    expect(E.isValue(HetEnum, "B")).toBe(true);

    expect(E.isValue(HetEnum, "C")).toBe(false);
    expect(E.isValue(HetEnum, 0.1)).toBe(true);

    expect(E.isValue(HetEnum, "D")).toBe(false);
    expect(E.isValue(HetEnum, "E")).toBe(true);
  });

  it("should type check value", () => {
    expect(E.isValue(NumberEnum, 1)).toBe(true);
    // @ts-expect-error: Argument of type '"A"' is not assignable to parameter of type 'Nullable<number>'.
    expect(E.isValue(NumberEnum, "A")).toBe(false);

    expect(E.isValue(StringEnum, "A")).toBe(true);
    // @ts-expect-error: Argument of type '0' is not assignable to parameter of type 'Nullable<string>'.
    expect(E.isValue(StringEnum, 0)).toBe(false);

    expect(E.isValue(HetEnum, 0)).toBe(true);
    expect(E.isValue(HetEnum, "B")).toBe(true);
    // @ts-expect-error: Argument of type 'true' is not assignable to parameter of type 'Nullable<string | number>'.
    expect(E.isValue(HetEnum, true)).toBe(false);
  });

  describe("Curried", () => {
    it("should check key", () => {
      const isEnumKey = E.isKey(HetEnum);

      expect(isEnumKey("A")).toBe(true);
      expect(isEnumKey("0")).toBe(false);

      expect(isEnumKey("B")).toBe(true);

      expect(isEnumKey("C")).toBe(true);
      expect(isEnumKey("0.1")).toBe(false);

      expect(isEnumKey("D")).toBe(true);
      expect(isEnumKey("E")).toBe(false);
    });

    it("should check value", () => {
      const isEnumValue = E.isValue(HetEnum);

      expect(isEnumValue("A")).toBe(false);
      expect(isEnumValue(0)).toBe(true);

      expect(isEnumValue("B")).toBe(true);

      expect(isEnumValue("C")).toBe(false);
      expect(isEnumValue(0.1)).toBe(true);

      expect(isEnumValue("D")).toBe(false);
      expect(isEnumValue("E")).toBe(true);
    });

    it("should type check value", () => {
      expectTypeOf(E.isValue(NumberEnum)).parameters.toEqualTypeOf<[Nullable<number>]>();
      expectTypeOf(E.isValue(NumberEnum)).returns.toEqualTypeOf<boolean>();

      expectTypeOf(E.isValue(StringEnum)).parameters.toEqualTypeOf<[Nullable<string>]>();
      expectTypeOf(E.isValue(StringEnum)).returns.toEqualTypeOf<boolean>();

      expectTypeOf(E.isValue(HetEnum)).parameters.toEqualTypeOf<[Nullable<number | string>]>();
      expectTypeOf(E.isValue(HetEnum)).returns.toEqualTypeOf<boolean>();
    });
  });
});

describe("Iteration", () => {
  it("should iterate over entries", () => {
    const entries: [string, number | string][] = [];

    E.forEach(HetEnum, (value, key, enumObj) => {
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
      const forEachEnum = E.forEach(HetEnum);
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

      const pushEntries = E.forEach((value, key, enumObj) => {
        expectTypeOf(value).toEqualTypeOf<AnyEnumValue>();
        expectTypeOf(key).toEqualTypeOf<string>();
        expectTypeOf(enumObj).toEqualTypeOf<AnyEnumObject>();

        entries.push([key, value]);
      });
      expectTypeOf(pushEntries).parameters.toEqualTypeOf<[AnyEnumObject]>();

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
