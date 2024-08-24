import type { AnyEnumObject, AnyEnumValue, EnumEntry, EnumKey, EnumObject } from "./types";

const enum MetadataType {
  Keys,
  Entries,
  ValueKeyMap,
}

interface EnumMetadata<V extends AnyEnumValue, T extends EnumObject<T, V>> {
  [MetadataType.Keys]?: ReadonlyArray<EnumKey<T>>;
  [MetadataType.Entries]?: ReadonlyArray<EnumEntry<T>>;
  [MetadataType.ValueKeyMap]?: ReadonlyMap<V, EnumKey<T>>;
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
  return (getMetadata(enumObj)[MetadataType.Keys] ||= <EnumKey<T>[]>(
    Object.keys(enumObj).filter((key) => isNaN(Number(key)))
  ));
}

export function getEntries<V extends AnyEnumValue, T extends EnumObject<T, V>>(
  enumObj: T,
): ReadonlyArray<EnumEntry<T>> {
  return (getMetadata<V, T>(enumObj)[MetadataType.Entries] ||= <EnumEntry<T>[]>(
    getKeys(enumObj).map((key) => [key, enumObj[key]])
  ));
}

export function getValueKeyMap<V extends AnyEnumValue, T extends EnumObject<T, V>>(
  enumObj: T,
): ReadonlyMap<V, EnumKey<T>> {
  return (getMetadata<V, T>(enumObj)[MetadataType.ValueKeyMap] ||= new Map<V, EnumKey<T>>(
    getKeys(enumObj).map((key) => [enumObj[key], key]),
  ));
}
