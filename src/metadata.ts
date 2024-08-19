import type { AnyEnumObject, AnyEnumValue, EnumKey, EnumObject } from "./types";

interface EnumMetadata<V extends AnyEnumValue, T extends EnumObject<T, V>> {
  keys?: ReadonlyArray<EnumKey<T>>;
  keysByValue?: ReadonlyMap<V, EnumKey<T>>;
  valuesByKey?: ReadonlyMap<EnumKey<T>, V>;
}

const metadataCache = /*#__PURE__*/ new WeakMap<AnyEnumObject, EnumMetadata<any, any>>();

function getMetadata<V extends AnyEnumValue, T extends EnumObject<T, V>>(
  enumObj: T,
): EnumMetadata<V, T> {
  let metadata = metadataCache.get(enumObj);
  if (!metadata) {
    metadata = {};
    metadataCache.set(enumObj, metadata);
  }
  return metadata;
}

export function getKeys<T extends AnyEnumObject>(enumObj: T): ReadonlyArray<EnumKey<T>> {
  const metadata = getMetadata(enumObj);
  if (!metadata.keys) {
    metadata.keys = <EnumKey<T>[]>(
      Object.getOwnPropertyNames(enumObj).filter(
        (key) => isNaN(Number(key)) && {}.propertyIsEnumerable.call(enumObj, key),
      )
    );
  }
  return metadata.keys;
}

export function getKeysByValue<V extends AnyEnumValue, T extends EnumObject<T, V>>(
  enumObj: T,
): ReadonlyMap<V, EnumKey<T>> {
  const metadata = getMetadata<V, T>(enumObj);
  if (!metadata.keysByValue) {
    metadata.keysByValue = new Map(getKeys(enumObj).map((key) => [enumObj[key], key]));
  }
  return metadata.keysByValue;
}

export function getValuesByKey<V extends AnyEnumValue, T extends EnumObject<T, V>>(
  enumObj: T,
): ReadonlyMap<EnumKey<T>, V> {
  const metadata = getMetadata<V, T>(enumObj);
  if (!metadata.valuesByKey) {
    metadata.valuesByKey = new Map(getKeys(enumObj).map((key) => [key, enumObj[key]]));
  }
  return metadata.valuesByKey;
}
