import { getKeys, getKeysByValue, getValuesByKey } from "./metadata";
import type {
  AnyEnumObject,
  EnumEntry,
  EnumKey,
  EnumObject,
  EnumValue,
  EnumValueBase,
  NoInfer,
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

export function getValue<T extends AnyEnumObject>(
  enumObj: T,
  key: string | null | undefined,
): EnumValue<T> | undefined {
  if (isKey(enumObj, key)) {
    return enumObj[key];
  }
}

export function getKey<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value: NoInfer<V> | null | undefined,
): EnumKey<T> | undefined {
  if (value != null) {
    return getKeysByValue<V, T>(enumObj).get(value);
  }
}

export function isKey<T extends AnyEnumObject>(
  enumObj: T,
  key: string | null | undefined,
): key is EnumKey<T> {
  return key != null && isNaN(Number(key)) && {}.hasOwnProperty.call(enumObj, key);
}

export function isValue<V extends EnumValueBase<T>, T extends EnumObject<T, V>>(
  enumObj: T,
  value: NoInfer<V> | null | undefined,
): value is EnumValue<T> {
  return value != null && getKeysByValue<V, T>(enumObj).has(value);
}

export function forEach<T extends AnyEnumObject>(
  enumObj: T,
  callback: (value: EnumValue<T>, key: EnumKey<T>, enumObj: T) => void,
): void {
  getKeys(enumObj).forEach((key) => callback(enumObj[key], key, enumObj));
}
