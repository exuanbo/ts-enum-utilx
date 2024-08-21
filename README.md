# ts-enum-utilx

[![npm](https://img.shields.io/npm/v/ts-enum-utilx.svg)](https://www.npmjs.com/package/ts-enum-utilx)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ts-enum-utilx.svg?label=bundle%20size)](https://bundlephobia.com/package/ts-enum-utilx)
[![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/exuanbo/ts-enum-utilx/test.yml.svg?branch=main)](https://github.com/exuanbo/ts-enum-utilx/actions)
[![Codecov (with branch)](https://img.shields.io/codecov/c/gh/exuanbo/ts-enum-utilx/main.svg?token=AlXLkYCvrA)](https://app.codecov.io/gh/exuanbo/ts-enum-utilx/tree/main/src)

Strictly typed utilities for working with TypeScript enums inspired by [`ts-enum-util`](https://github.com/UselessPickles/ts-enum-util).

## Install

```sh
# npm
npm install ts-enum-utilx

# Yarn
yarn add ts-enum-utilx

# pnpm
pnpm add ts-enum-utilx
```

## Differences from ts-enum-util

- **Smaller Bundle Size**: `ts-enum-utilx` has a much smaller bundle size and is fully tree-shakable.
- **Functional Programming Approach**: Supports currying and functional programming paradigms.
- **Streamlined API**: Provides a set of essential functions without a wrapper class, making it more intuitive and easier to use. Additional functionalities can be easily achieved using modern JavaScript features or simple invariant libraries like [`tiny-invariant`](https://github.com/alexreardon/tiny-invariant).

## Usage

### Basic setup

Namespace import is recommended for better tree-shaking:

```ts
import * as E from "ts-enum-utilx";

enum Answer {
  No = 0,
  Yes = "YES",
}
```

### size

Get the number of keys in the enum:

```ts
E.size(Answer);
// => 2
```

### keys

Get an iterable of the enum keys:

```ts
const iter = E.keys(Answer);
//    ^? IterableIterator<"No" | "Yes">

[...E.keys(Answer)];
// => ["No", "Yes"]
```

### values

Get an iterable of the enum values:

```ts
const iter = E.values(Answer);
//    ^? IterableIterator<Answer>

[...E.values(Answer)];
// => [0, "YES"]
```

### entries

Get an iterable of key-value pairs:

```ts
const iter = E.entries(Answer);
//    ^? IterableIterator<[("No" | "Yes"), Answer]>

[...E.entries(Answer)];
// => [["No", 0], ["Yes", "YES"]]
```

### value

Get the value associated with a key:

```ts
E.value(Answer, "No");
// => 0

E.value(Answer, "Unknown");
// => undefined

const getValue = E.value(Answer);
//    ^? (key: Nullable<string>) => Answer | undefined

getValue("Yes");
// => "YES"
```

### key

Get the key associated with a value:

```ts
E.key(Answer, 0);
// => "No"

E.key(Answer, "Unknown");
// => undefined

const getKey = E.key(Answer);
//    ^? (value: Nullable<string | number>) => "No" | "Yes" | undefined

getKey("YES");
// => "Yes"
```

The `key` function is type-safe and will only accept values that are assignable to the enum values.

<details>
<summary><strong>E.key</strong> type inference</summary>

```ts
enum NumberEnum {
  One = 1,
}

// @ts-expect-error: Argument of type '"A"' is not assignable to parameter of type 'Nullable<number>'
E.key(NumberEnum, "A");

enum StringEnum {
  A = "A",
}

// @ts-expect-error: Argument of type '1' is not assignable to parameter of type 'Nullable<string>'
E.key(StringEnum, 1);

enum HetEnum {
  A = 1,
  B = "B",
}

// @ts-expect-error: Argument of type 'true' is not assignable to parameter of type 'Nullable<string | number>'
E.key(HetEnum, true);
```

</details>

### isKey

Check if a string is a key in the enum:

```ts
E.isKey(Answer, "No");
// => true

const key: string = "No";

if (E.isKey(Answer, key)) {
  console.log(key);
  //          ^? "No" | "Yes"
}

const isKey = E.isKey(Answer);
//    ^? (key: Nullable<string>) => key is "No" | "Yes"

isKey("Yes");
// => true
```

### isValue

Check if a value is in the enum:

```ts
E.isValue(Answer, 0);
// => true

const value: string | number = 0;

if (E.isValue(Answer, value)) {
  console.log(value);
  //          ^? Answer
}

const isValue = E.isValue(Answer);
//    ^? (value: Nullable<string | number>) => value is Answer

isValue("YES");
// => true
```

The `isValue` function is type-safe and will only accept values that are assignable to the enum values.

<details>
<summary><strong>E.isValue</strong> type inference</summary>

```ts
enum NumberEnum {
  One = 1,
}

// @ts-expect-error: Argument of type '"A"' is not assignable to parameter of type 'Nullable<number>'.
E.isValue(NumberEnum, "A");

enum StringEnum {
  A = "A",
}

// @ts-expect-error: Argument of type '0' is not assignable to parameter of type 'Nullable<string>'.
E.isValue(StringEnum, 1);

enum HetEnum {
  A = 1,
  B = "B",
}

// @ts-expect-error: Argument of type 'true' is not assignable to parameter of type 'Nullable<string | number>'.
E.isValue(HetEnum, true);
```

</details>

### forEach

Iterate over the enum:

```ts
E.forEach(Answer, (value, key, enumObj) => {
  console.log(value);
  //          ^? Answer
  console.log(key);
  //          ^? "No" | "Yes"
  console.log(enumObj);
  //          ^? typeof Answer
});

const forEachAnswer = E.forEach(Answer);
//    ^? (iteratee: (value: Answer, key: "No" | "Yes", enumObj: typeof Answer) => void) => void

const logEntries = E.forEach((value, key) => console.log([key, value]));
//    ^? (enumObj: Record<string, string | number>) => void

logEntries(Answer);
// => [ "No", 0 ]
// => [ "Yes", "YES" ]
```

## API

See the [API documentation](https://exuanbo.xyz/ts-enum-utilx/) for more details.

## License

[MIT License](https://github.com/exuanbo/ts-enum-utilx/blob/main/LICENSE) @ 2024-Present [Xuanbo Cheng](https://github.com/exuanbo)
