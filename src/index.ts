import { getEntries, getKeys, getValueKeyMap } from "./metadata";
import type {
  AnyEnumObject,
  EnumEntry,
  EnumIteratee,
  EnumKey,
  EnumObject,
  EnumValue,
  EnumValueBase,
  NoInfer,
  Nullable,
  Optional,
} from "./types";

export type * from "./types";

/*#__NO_SIDE_EFFECTS__*/
export function size(enumObj: AnyEnumObject): number {
  return getKeys(enumObj).length;
}

/*#__NO_SIDE_EFFECTS__*/
export function keys<T extends AnyEnumObject>(enumObj: T): IterableIterator<EnumKey<T>> {
  return getKeys(enumObj).values();
}

/*#__NO_SIDE_EFFECTS__*/
export function values<T extends AnyEnumObject>(enumObj: T): IterableIterator<EnumValue<T>> {
  return getValueKeyMap<EnumValue<T>, T>(enumObj).keys();
}

/*#__NO_SIDE_EFFECTS__*/
export function entries<T extends AnyEnumObject>(enumObj: T): IterableIterator<EnumEntry<T>> {
  return getEntries<EnumValue<T>, T>(enumObj).values();
}

export function value<T extends AnyEnumObject>(
  enumObj: T,
  key: string | null | undefined,
): EnumValue<T> | undefined;

export function value<T extends AnyEnumObject>(
  enumObj: T,
): (key: string | null | undefined) => EnumValue<T> | undefined;

/*#__NO_SIDE_EFFECTS__*/
export function value<T extends AnyEnumObject>(
  enumObj: T,
  key?: Nullable<string>,
): Optional<EnumValue<T>> | ((key: Nullable<string>) => Optional<EnumValue<T>>) {
  if (arguments.length === 1) {
    return (_key) => value(enumObj, _key);
  }
  if (isKey(enumObj, key)) {
    return enumObj[key];
  }
}

export function key<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value: NoInfer<V> | null | undefined,
): EnumKey<T> | undefined;

export function key<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
): (value: V | null | undefined) => EnumKey<T> | undefined;

/*#__NO_SIDE_EFFECTS__*/
export function key<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value?: Nullable<NoInfer<V>>,
): Optional<EnumKey<T>> | ((value: Nullable<V>) => Optional<EnumKey<T>>) {
  if (arguments.length === 1) {
    return (_value) => key(enumObj, _value);
  }
  if (value != null) {
    return getValueKeyMap<V, T>(enumObj).get(value);
  }
}

export function isKey<T extends AnyEnumObject>(
  enumObj: T,
  key: string | null | undefined,
): key is EnumKey<T>;

export function isKey<T extends AnyEnumObject>(
  enumObj: T,
): (key: string | null | undefined) => key is EnumKey<T>;

/*#__NO_SIDE_EFFECTS__*/
export function isKey<T extends AnyEnumObject>(
  enumObj: T,
  key?: Nullable<string>,
): boolean | ((key: Nullable<string>) => boolean) {
  if (arguments.length === 1) {
    return (_key) => isKey(enumObj, _key);
  }
  return key != null && isNaN(Number(key)) && {}.hasOwnProperty.call(enumObj, key);
}

export function isValue<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value: NoInfer<V> | null | undefined,
): value is EnumValue<T>;

export function isValue<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
): (value: V | null | undefined) => value is EnumValue<T>;

/*#__NO_SIDE_EFFECTS__*/
export function isValue<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value?: Nullable<NoInfer<V>>,
): boolean | ((value: Nullable<V>) => boolean) {
  if (arguments.length === 1) {
    return (_value) => isValue(enumObj, _value);
  }
  return value != null && getValueKeyMap<V, T>(enumObj).has(value);
}

export function forEach<T extends AnyEnumObject>(enumObj: T, iteratee: EnumIteratee<T>): void;

export function forEach<T extends AnyEnumObject>(enumObj: T): (iteratee: EnumIteratee<T>) => void;

export function forEach<T extends AnyEnumObject>(iteratee: EnumIteratee<T>): (enumObj: T) => void;

export function forEach<T extends AnyEnumObject>(
  enumObj: T | EnumIteratee<T>,
  iteratee?: EnumIteratee<T>,
) {
  if (typeof enumObj === "function") {
    const _iteratee = enumObj;
    return (_enumObj: T) => forEach(_enumObj, _iteratee);
  }
  if (!iteratee) {
    return (_iteratee: EnumIteratee<T>) => forEach(enumObj, _iteratee);
  }
  getKeys(enumObj).forEach((key) => iteratee(enumObj[key], key, enumObj));
}
