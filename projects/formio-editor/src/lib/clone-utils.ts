/*
  This is heavily inspired by https://github.com/schnittstabil/merge-options
*/
const { hasOwnProperty, toString } = Object.prototype;
const { propertyIsEnumerable } = Object;
const globalThis = this;
const defaultMergeOpts = { ignoreUndefined: false };

type propertyKey = string | number | symbol;

const isPlainObject = (value: any) => {
  if (toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
};

const defineProperty = (obj: object, name: propertyKey, value: any) => {
  Object.defineProperty(obj, name, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
};

const getEnumerableOwnPropertyKeys = (value: object) => {
  const keys: propertyKey[] = [];

  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      keys.push(key);
    }
  }

  if (Object.getOwnPropertySymbols) {
    const symbols = Object.getOwnPropertySymbols(value);

    for (const symbol of symbols) {
      if (propertyIsEnumerable.call(value, symbol)) {
        keys.push(symbol);
      }
    }
  }

  return keys;
};

export const clone = (value: any) => {
  if (Array.isArray(value)) {
    return cloneArray(value);
  }

  if (isPlainObject(value)) {
    return clonePlainObject(value);
  }

  return value;
};

const cloneArray = (array: any[]) => {
  const result = array.slice(0, 0);

  getEnumerableOwnPropertyKeys(array).forEach(key => {
    defineProperty(result, key, clone(array[key]));
  });

  return result;
};

const clonePlainObject = (obj: object) => {
  const result: object = Object.getPrototypeOf(obj) === null ? Object.create(null) : {};

  getEnumerableOwnPropertyKeys(obj).forEach(key => {
    defineProperty(result, key, clone(obj[key]));
  });

  return result;
};

const mergeKeys = (merged, source, keys: propertyKey[], config) => {
  keys.forEach(key => {
    if (typeof source[key] === 'undefined' && config.ignoreUndefined) {
      return;
    }

    // Do not recurse into prototype chain of merged
    if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
      defineProperty(merged, key, _merge(merged[key], source[key], config));
    } else {
      defineProperty(merged, key, clone(source[key]));
    }
  });

  return merged;
};

// tslint:disable-next-line:variable-name
const _merge = (merged, source, config) => {
  if (!isPlainObject(source) || !isPlainObject(merged)) {
    return clone(source);
  }

  return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
};

export const merge = (...options: any[]) => {
  const config = _merge(clone(defaultMergeOpts), (this !== globalThis && this) || {}, defaultMergeOpts);
  let merged = { _: {} };

  for (const option of options) {
    if (option === undefined) {
      continue;
    }

    if (!isPlainObject(option)) {
      throw new TypeError('`' + option + '` is not a plain Object');
    }

    merged = _merge(merged, { _: option }, config);
  }

  return merged._;
};
