/** @internal */
export type NoInfer<T> = [T][T extends any ? 0 : never];

/** @internal */
export type Nullable<T> = T | null | undefined;

/** @internal */
export type Optional<T> = T | undefined;

export type StringKeyOf<T> = Extract<keyof T, string>;

export type AnyEnumValue = number | string;
export type AnyEnumObject = Record<string, AnyEnumValue>;

export type EnumKey<T extends AnyEnumObject> = StringKeyOf<T>;
export type EnumValue<T extends AnyEnumObject> = T[EnumKey<T>];
export type EnumEntry<T extends AnyEnumObject> = [EnumKey<T>, EnumValue<T>];
export type EnumObject<T extends AnyEnumObject, V extends AnyEnumValue> = Record<EnumKey<T>, V>;

export type EnumValueBase<T extends AnyEnumObject> =
  T extends EnumObject<T, infer V> ?
    V extends number ? number
    : V extends string ? string
    : V
  : never;

export type EnumIteratee<T extends AnyEnumObject> = (
  value: EnumValue<T>,
  key: EnumKey<T>,
  enumObj: T,
) => void;
