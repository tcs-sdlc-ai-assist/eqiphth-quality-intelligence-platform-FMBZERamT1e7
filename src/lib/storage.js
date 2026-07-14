import { STORAGE_KEYS, DATA_VERSION } from '@/lib/constants';

/**
 * Safely parses a JSON string, returning undefined on failure.
 *
 * @param {string} value - The JSON string to parse
 * @returns {*} Parsed value, or undefined if parsing fails
 */
function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

/**
 * Checks whether localStorage is available in the current environment.
 *
 * @returns {boolean} True if localStorage is accessible
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__eqip_storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads a value from localStorage by key.
 * Automatically deserializes JSON. Returns the provided default value
 * if the key does not exist, the stored value cannot be parsed, or
 * localStorage is unavailable.
 *
 * @param {string} key - The storage key to read
 * @param {*} [defaultValue=null] - Value to return if key is missing or unreadable
 * @returns {*} The deserialized value, or defaultValue
 */
export function load(key, defaultValue = null) {
  if (!key || typeof key !== 'string') {
    return defaultValue;
  }

  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }

    const parsed = safeParse(raw);
    return parsed !== undefined ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Saves a value to localStorage under the given key.
 * Automatically serializes the value as JSON.
 * Detects and reports quota exceeded errors.
 *
 * @param {string} key - The storage key to write
 * @param {*} value - The value to serialize and store
 * @returns {boolean} True if the value was saved successfully, false otherwise
 */
export function save(key, value) {
  if (!key || typeof key !== 'string') {
    return false;
  }

  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (isQuotaError(error)) {
      console.error(
        `[storage] Quota exceeded when saving key "${key}". Consider clearing unused data.`
      );
    } else {
      console.error(`[storage] Failed to save key "${key}":`, error);
    }
    return false;
  }
}

/**
 * Removes a single key from localStorage.
 *
 * @param {string} key - The storage key to remove
 * @returns {boolean} True if the key was removed successfully, false otherwise
 */
export function remove(key) {
  if (!key || typeof key !== 'string') {
    return false;
  }

  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears all EQIP-related keys from localStorage.
 * Only removes keys that are defined in STORAGE_KEYS to avoid
 * interfering with other applications sharing the same origin.
 *
 * @returns {boolean} True if all keys were cleared successfully, false otherwise
 */
export function clear() {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const keys = Object.values(STORAGE_KEYS);
    for (const key of keys) {
      window.localStorage.removeItem(key);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the stored data version identifier.
 * This is used for cache busting and data compatibility checks.
 *
 * @returns {string} The stored data version, or the default DATA_VERSION constant
 */
export function getDataVersion() {
  return load(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
}

/**
 * Stores the data version identifier.
 *
 * @param {string} [version] - The version string to store (defaults to DATA_VERSION constant)
 * @returns {boolean} True if the version was saved successfully
 */
export function setDataVersion(version) {
  const versionToSave = version || DATA_VERSION;
  return save(STORAGE_KEYS.DATA_VERSION, versionToSave);
}

/**
 * Determines whether an error is a storage quota exceeded error.
 *
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error indicates a quota exceeded condition
 */
function isQuotaError(error) {
  if (!error) {
    return false;
  }

  return (
    error.code === 22 ||
    error.code === 1014 ||
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );
}