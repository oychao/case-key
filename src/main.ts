import camelCase from 'camelcase';
import snakeCase from 'to-snake-case';

interface KeyCaseOptions {
  deep?: boolean;
  exclude?: Array<RegExp>;
  strictKey?: boolean;
}

interface InternalKeyCaseOptions extends KeyCaseOptions {
  target?: object;
}

type Mapper = (key: string, val: object, object?: object) => [string, object, boolean];

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

// Customized for this use-case
const isObjectCustom = (value: unknown) =>
  isObject(value) && !(value instanceof RegExp) && !(value instanceof Error) && !(value instanceof Date);

const mapObject = (object: object, mapper: Mapper, options: InternalKeyCaseOptions, isSeen = new WeakMap()) => {
  const internalOptions: InternalKeyCaseOptions = {
    deep: false,
    target: {},
    ...options,
  };

  if (isSeen.has(object)) {
    return isSeen.get(object);
  }

  isSeen.set(object, internalOptions.target);

  const { target } = internalOptions;
  delete internalOptions.target;

  const mapArray = (array: Array<object>) =>
    array.map(element => (isObjectCustom(element) ? mapObject(element, mapper, internalOptions, isSeen) : element));
  if (Array.isArray(object)) {
    return mapArray(object);
  }

  for (const [key, value] of Object.entries(object)) {
    const mapRet = mapper(key, value, object);
    const [newKey, , shouldSkip] = mapRet;
    let newValue = mapRet[1];

    if (options.deep && isObjectCustom(newValue) && !shouldSkip) {
      newValue = Array.isArray(newValue) ? mapArray(newValue) : mapObject(newValue, mapper, options, isSeen);
    }

    target[newKey] = newValue;
  }

  return target;
};

function mapObj(object: object, mapper: Mapper, options: KeyCaseOptions) {
  if (!isObject(object)) {
    throw new TypeError(`Expected an object, got \`${object}\` (${typeof object})`);
  }

  return mapObject(object, mapper, options);
}

function matches(patterns: Array<RegExp>, value: string) {
  return patterns.some(pat => pat.test(value));
}

function keyCaseFac(trans: (val: string) => string) {
  return function (obj: object, rawOptions?: KeyCaseOptions) {
    const options = Object.assign({ deep: true, exclude: [], strictKey: true }, rawOptions);

    return mapObj(
      obj,
      function (key, val) {
        const shouldSkip = matches(options.exclude, key);
        const shouldKeep = options.strictKey && (key.includes('.') || key.includes('/'));
        return [shouldKeep || shouldSkip ? key : trans(key), val, shouldSkip];
      },
      options
    );
  };
}

export const camelcase = keyCaseFac(camelCase);
export const snakecase = keyCaseFac(snakeCase);
