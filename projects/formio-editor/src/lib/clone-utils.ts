/*
  This is heavily inspired by https://github.com/schnittstabil/merge-options
*/
const { hasOwnProperty } = Object.prototype;
const { propertyIsEnumerable } = Object;
const globalThis = this;
const defaultMergeOpts = { ignoreUndefined: false };

type propertyKey = string | number | symbol;

function isOptionObject(value: any) {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function defineProperty(obj: object, name: propertyKey, value: any) {
  Object.defineProperty(obj, name, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}

function getEnumerableOwnPropertyKeys(value: object) {
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
}

export const clone = (value: any) => {
  if (Array.isArray(value)) {
    return cloneArray(value);
  }

  if (isOptionObject(value)) {
    return cloneOptionObject(value);
  }

  return value;
};

function cloneArray(array: any[]) {
  const result = array.slice(0, 0);

  getEnumerableOwnPropertyKeys(array).forEach(key => {
    defineProperty(result, key, clone(array[key]));
  });

  return result;
}

function cloneOptionObject(obj: object) {
  const result = Object.getPrototypeOf(obj) === null ? Object.create(null) : {};

  getEnumerableOwnPropertyKeys(obj).forEach(key => {
    defineProperty(result, key, clone(obj[key]));
  });

  return result as object;
}

function mergeKeys(merged, source, keys: propertyKey[], config) {
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
}

function _merge(merged, source, config) {
  if (!isOptionObject(source) || !isOptionObject(merged)) {
    return clone(source);
  }

  return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
}

export const merge = (...options: any[]) => {
  const config = _merge(clone(defaultMergeOpts), (this !== globalThis && this) || {}, defaultMergeOpts);
  let merged = { _: {} };

  for (const option of options) {
    if (option === undefined) {
      continue;
    }

    if (!isOptionObject(option)) {
      throw new TypeError('`' + option + '` is not an Option Object');
    }

    merged = _merge(merged, { _: option }, config);
  }

  return merged._;
};
