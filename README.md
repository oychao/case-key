# case-key

Convert object keys from camelCase to snake_case or vice versa

This lib is originated from [sindresorhus/camelcase-keys](https://github.com/sindresorhus/camelcase-keys) and [bendrucker/snakecase-keys](https://github.com/bendrucker/snakecase-keys), for `exclude` option in camelcase-keys and snakecase-keys does not stop recursion in nested objects.

## Usage

```typescript
interface KeyCaseOptions {
  deep?: boolean; // default true
  exclude?: Array<RegExp>; // default []
  strictKey?: boolean; // default true
}

camelcase(target: object, option: KeyCaseOptions);

snakecase(target: object, option: KeyCaseOptions);
```

## Demo Code

```typescript
import { camelcase, snakecase } from 'case-key';

camelcase({
  hello_world: {
    camel_case: {
      some_key: 123
    }
  }
}, {
  exclude: /case/
});

/*
{
  helloWorld: {
    camel_case: {
      some_key: 123
    }
  }
}
*/

camelcase({ 'hello.world': 'case' }, { strictKey: true }); // output hello.world

camelcase({ 'hello.world': 'case' }, { strictKey: false }); // output helloWorld
```
