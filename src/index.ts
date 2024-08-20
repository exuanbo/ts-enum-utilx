import { getKeys, getKeysByValue, getValuesByKey } from "./metadata";
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

export function size(enumObj: AnyEnumObject): number {
  return getKeys(enumObj).length;
}

export function keys<T extends AnyEnumObject>(enumObj: T): IterableIterator<EnumKey<T>> {
  return getKeys(enumObj).values();
}

export function values<T extends AnyEnumObject>(enumObj: T): IterableIterator<EnumValue<T>> {
  return getKeysByValue<EnumValue<T>, T>(enumObj).keys();
}

export function entries<T extends AnyEnumObject>(enumObj: T): IterableIterator<EnumEntry<T>> {
  return getValuesByKey<EnumValue<T>, T>(enumObj).entries();
}

export function value<T extends AnyEnumObject>(
  enumObj: T,
  key: Nullable<string>,
): Optional<EnumValue<T>>;

export function value<T extends AnyEnumObject>(
  enumObj: T,
): (key: Nullable<string>) => Optional<EnumValue<T>>;

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
  value: Nullable<NoInfer<V>>,
): Optional<EnumKey<T>>;

export function key<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
): (value: Nullable<V>) => Optional<EnumKey<T>>;

export function key<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value?: Nullable<NoInfer<V>>,
): Optional<EnumKey<T>> | ((value: Nullable<V>) => Optional<EnumKey<T>>) {
  if (arguments.length === 1) {
    return (_value) => key(enumObj, _value);
  }
  if (value != null) {
    return getKeysByValue<V, T>(enumObj).get(value);
  }
}

export function isKey<T extends AnyEnumObject>(
  enumObj: T,
  key: Nullable<string>,
): key is EnumKey<T>;

export function isKey<T extends AnyEnumObject>(
  enumObj: T,
): (key: Nullable<string>) => key is EnumKey<T>;

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
  value: Nullable<NoInfer<V>>,
): value is EnumValue<T>;

export function isValue<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
): (value: Nullable<V>) => value is EnumValue<T>;

export function isValue<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value?: Nullable<NoInfer<V>>,
): boolean | ((value: Nullable<V>) => boolean) {
  if (arguments.length === 1) {
    return (_value) => isValue(enumObj, _value);
  }
  return value != null && getKeysByValue<V, T>(enumObj).has(value);
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
