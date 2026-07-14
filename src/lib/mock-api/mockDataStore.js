import { STORAGE_KEYS, DATA_VERSION } from '@/lib/constants';
import { generateId } from '@/lib/utils';

import applications from '@/data/applications.js';
import demands from '@/data/demands.js';
import testCases from '@/data/testCases.js';
import testExecutions from '@/data/testExecutions.js';
import testData from '@/data/testData.js';
import schedules from '@/data/schedules.js';
import qualityGates from '@/data/qualityGates.js';
import environments from '@/data/environments.js';
import segments from '@/data/segments.js';
import governance from '@/data/governance.js';
import notifications from '@/data/notifications.js';
import auditLogs from '@/data/auditLogs.js';
import personas from '@/data/personas.js';
import users from '@/data/users.js';
import agents from '@/data/agents.js';
import aiInsights from '@/data/aiInsights.js';
import automationIntelligence from '@/data/automationIntelligence.js';
import dashboardMetrics from '@/data/dashboardMetrics.js';
import integrations from '@/data/integrations.js';
import knowledgeGraph from '@/data/knowledgeGraph.js';
import postDeployment from '@/data/postDeployment.js';
import reports from '@/data/reports.js';
import adoption from '@/data/adoption.js';

/**
 * Storage key prefix for mock data store entities.
 * @type {string}
 */
const STORE_PREFIX = 'eqip_store_';

/**
 * Storage key for the mock data store version.
 * @type {string}
 */
const STORE_VERSION_KEY = 'eqip_store_version';

/**
 * Map of entity type keys to their default fixture data.
 * @type {Object<string, *>}
 */
const FIXTURE_MAP = Object.freeze({
  applications,
  demands,
  testCases,
  testExecutions,
  testData,
  schedules,
  qualityGates,
  environments,
  segments,
  governance,
  notifications,
  auditLogs,
  personas,
  users,
  agents,
  aiInsights,
  automationIntelligence,
  dashboardMetrics,
  integrations,
  knowledgeGraph,
  postDeployment,
  reports,
  adoption,
});

/**
 * Checks whether localStorage is available in the current environment.
 *
 * @returns {boolean} True if localStorage is accessible
 */
function isStorageAvailable() {
  try {
    const testKey = '__eqip_store_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds the localStorage key for a given entity type.
 *
 * @param {string} entityType - The entity type identifier
 * @returns {string} The full localStorage key
 */
function buildKey(entityType) {
  return `${STORE_PREFIX}${entityType}`;
}

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
 * @typedef {Object} MockDataStoreInstance
 * @property {function(string): *} load - Load entity data by type
 * @property {function(string, *): boolean} save - Save entity data by type
 * @property {function(string, string, Object): *} update - Update a single entity record by id
 * @property {function(string, string): boolean} remove - Remove a single entity record by id
 * @property {function(string, *): *} add - Add a new entity record
 * @property {function(): void} initialize - Initialize the store from fixtures
 * @property {function(): void} reset - Reset all data to original fixtures
 * @property {function(): void} clear - Clear all stored data
 * @property {function(): string[]} getEntityTypes - Get all available entity types
 * @property {function(): string} getVersion - Get the current store version
 */

/**
 * In-memory cache for entity data.
 * @type {Object<string, *>}
 */
const cache = {};

/**
 * Whether the store has been initialized.
 * @type {boolean}
 */
let initialized = false;

/**
 * Reads raw data from localStorage for a given entity type.
 *
 * @param {string} entityType - The entity type identifier
 * @returns {*} The parsed data, or undefined if not found
 */
function readFromStorage(entityType) {
  if (!isStorageAvailable()) {
    return undefined;
  }
  try {
    const raw = window.localStorage.getItem(buildKey(entityType));
    if (raw === null) {
      return undefined;
    }
    return safeParse(raw);
  } catch {
    return undefined;
  }
}

/**
 * Writes data to localStorage for a given entity type.
 *
 * @param {string} entityType - The entity type identifier
 * @param {*} data - The data to store
 * @returns {boolean} True if saved successfully
 */
function writeToStorage(entityType, data) {
  if (!isStorageAvailable()) {
    return false;
  }
  try {
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(buildKey(entityType), serialized);
    return true;
  } catch (error) {
    if (
      error &&
      (error.code === 22 ||
        error.code === 1014 ||
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.error(
        `[MockDataStore] Quota exceeded when saving entity type "${entityType}". Consider clearing unused data.`
      );
    }
    return false;
  }
}

/**
 * Removes data from localStorage for a given entity type.
 *
 * @param {string} entityType - The entity type identifier
 * @returns {boolean} True if removed successfully
 */
function removeFromStorage(entityType) {
  if (!isStorageAvailable()) {
    return false;
  }
  try {
    window.localStorage.removeItem(buildKey(entityType));
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the stored data version.
 *
 * @returns {string|null} The stored version, or null if not set
 */
function getStoredVersion() {
  if (!isStorageAvailable()) {
    return null;
  }
  try {
    return window.localStorage.getItem(STORE_VERSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Sets the stored data version.
 *
 * @param {string} version - The version string to store
 */
function setStoredVersion(version) {
  if (!isStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.setItem(STORE_VERSION_KEY, version);
  } catch {
    // Silently fail
  }
}

/**
 * Deep clones a value using JSON serialization.
 *
 * @param {*} value - The value to clone
 * @returns {*} A deep clone of the value
 */
function deepClone(value) {
  if (value === null || value === undefined) {
    return value;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

/**
 * Gets the default fixture data for a given entity type.
 *
 * @param {string} entityType - The entity type identifier
 * @returns {*} The fixture data, or null if not found
 */
function getFixtureData(entityType) {
  if (!entityType || typeof entityType !== 'string') {
    return null;
  }
  const fixture = FIXTURE_MAP[entityType];
  if (fixture === undefined) {
    return null;
  }
  return deepClone(fixture);
}

/**
 * Checks if the stored version matches the current data version
 * and resets data if there is a mismatch.
 */
function checkVersionAndReset() {
  const storedVersion = getStoredVersion();
  if (storedVersion !== DATA_VERSION) {
    clearAllStorage();
    setStoredVersion(DATA_VERSION);
  }
}

/**
 * Clears all mock data store entries from localStorage.
 */
function clearAllStorage() {
  if (!isStorageAvailable()) {
    return;
  }
  const entityTypes = Object.keys(FIXTURE_MAP);
  for (const entityType of entityTypes) {
    removeFromStorage(entityType);
  }
}

/**
 * Initializes the store by loading data from localStorage or fixtures.
 * Checks data version and resets if needed.
 */
function initializeStore() {
  if (initialized) {
    return;
  }

  checkVersionAndReset();

  const entityTypes = Object.keys(FIXTURE_MAP);
  for (const entityType of entityTypes) {
    const stored = readFromStorage(entityType);
    if (stored !== undefined) {
      cache[entityType] = stored;
    } else {
      const fixture = getFixtureData(entityType);
      if (fixture !== null) {
        cache[entityType] = fixture;
        writeToStorage(entityType, fixture);
      }
    }
  }

  initialized = true;
}

/**
 * Ensures the store is initialized before any operation.
 */
function ensureInitialized() {
  if (!initialized) {
    initializeStore();
  }
}

/**
 * Finds the index of a record by id within an array.
 *
 * @param {Array} dataArray - The array to search
 * @param {string} id - The id to find
 * @returns {number} The index, or -1 if not found
 */
function findIndexById(dataArray, id) {
  if (!Array.isArray(dataArray)) {
    return -1;
  }
  return dataArray.findIndex((item) => item && item.id === id);
}

/**
 * Central mock data store singleton.
 * Provides load/save/update/delete operations backed by localStorage
 * with in-memory caching and data versioning.
 *
 * @type {MockDataStoreInstance}
 */
const MockDataStore = {
  /**
   * Initializes the store from fixtures and localStorage.
   * Safe to call multiple times; only initializes once.
   */
  initialize() {
    initializeStore();
  },

  /**
   * Loads entity data by type.
   * Returns a deep clone to prevent external mutation of the cache.
   *
   * @param {string} entityType - The entity type identifier (e.g. 'applications', 'demands')
   * @returns {*} The entity data (array or object), or null if not found
   */
  load(entityType) {
    if (!entityType || typeof entityType !== 'string') {
      return null;
    }
    ensureInitialized();

    if (cache[entityType] !== undefined) {
      return deepClone(cache[entityType]);
    }

    const stored = readFromStorage(entityType);
    if (stored !== undefined) {
      cache[entityType] = stored;
      return deepClone(stored);
    }

    const fixture = getFixtureData(entityType);
    if (fixture !== null) {
      cache[entityType] = fixture;
      writeToStorage(entityType, fixture);
      return deepClone(fixture);
    }

    return null;
  },

  /**
   * Saves entity data by type, replacing the entire dataset.
   *
   * @param {string} entityType - The entity type identifier
   * @param {*} data - The data to save
   * @returns {boolean} True if saved successfully
   */
  save(entityType, data) {
    if (!entityType || typeof entityType !== 'string') {
      return false;
    }
    ensureInitialized();

    const cloned = deepClone(data);
    cache[entityType] = cloned;
    return writeToStorage(entityType, cloned);
  },

  /**
   * Updates a single entity record by id within an array-type entity.
   * Merges the updates into the existing record.
   *
   * @param {string} entityType - The entity type identifier
   * @param {string} id - The record id to update
   * @param {Object} updates - The fields to merge into the record
   * @returns {*} The updated record, or null if not found
   */
  update(entityType, id, updates) {
    if (!entityType || typeof entityType !== 'string') {
      return null;
    }
    if (!id || typeof id !== 'string') {
      return null;
    }
    if (!updates || typeof updates !== 'object') {
      return null;
    }
    ensureInitialized();

    const data = cache[entityType];
    if (!Array.isArray(data)) {
      return null;
    }

    const index = findIndexById(data, id);
    if (index === -1) {
      return null;
    }

    const updatedRecord = { ...data[index], ...updates, id };
    data[index] = updatedRecord;
    cache[entityType] = data;
    writeToStorage(entityType, data);

    return deepClone(updatedRecord);
  },

  /**
   * Removes a single entity record by id from an array-type entity.
   *
   * @param {string} entityType - The entity type identifier
   * @param {string} id - The record id to remove
   * @returns {boolean} True if the record was found and removed
   */
  remove(entityType, id) {
    if (!entityType || typeof entityType !== 'string') {
      return false;
    }
    if (!id || typeof id !== 'string') {
      return false;
    }
    ensureInitialized();

    const data = cache[entityType];
    if (!Array.isArray(data)) {
      return false;
    }

    const index = findIndexById(data, id);
    if (index === -1) {
      return false;
    }

    data.splice(index, 1);
    cache[entityType] = data;
    writeToStorage(entityType, data);

    return true;
  },

  /**
   * Adds a new entity record to an array-type entity.
   * Automatically generates an id if not provided.
   *
   * @param {string} entityType - The entity type identifier
   * @param {Object} record - The record to add
   * @returns {*} The added record with id, or null on failure
   */
  add(entityType, record) {
    if (!entityType || typeof entityType !== 'string') {
      return null;
    }
    if (!record || typeof record !== 'object') {
      return null;
    }
    ensureInitialized();

    let data = cache[entityType];
    if (!Array.isArray(data)) {
      data = [];
      cache[entityType] = data;
    }

    const newRecord = deepClone(record);
    if (!newRecord.id) {
      newRecord.id = generateId(entityType);
    }

    data.push(newRecord);
    cache[entityType] = data;
    writeToStorage(entityType, data);

    return deepClone(newRecord);
  },

  /**
   * Resets all entity data to the original fixture values.
   * Clears localStorage and in-memory cache, then re-initializes.
   */
  reset() {
    clearAllStorage();

    const entityTypes = Object.keys(FIXTURE_MAP);
    for (const entityType of entityTypes) {
      const fixture = getFixtureData(entityType);
      if (fixture !== null) {
        cache[entityType] = fixture;
        writeToStorage(entityType, fixture);
      } else {
        delete cache[entityType];
      }
    }

    setStoredVersion(DATA_VERSION);
    initialized = true;
  },

  /**
   * Clears all stored data from localStorage and in-memory cache.
   * After calling clear, the store will re-initialize from fixtures on next access.
   */
  clear() {
    clearAllStorage();

    const entityTypes = Object.keys(FIXTURE_MAP);
    for (const entityType of entityTypes) {
      delete cache[entityType];
    }

    if (isStorageAvailable()) {
      try {
        window.localStorage.removeItem(STORE_VERSION_KEY);
      } catch {
        // Silently fail
      }
    }

    initialized = false;
  },

  /**
   * Returns all available entity type identifiers.
   *
   * @returns {string[]} Array of entity type keys
   */
  getEntityTypes() {
    return Object.keys(FIXTURE_MAP);
  },

  /**
   * Returns the current data version.
   *
   * @returns {string} The data version string
   */
  getVersion() {
    return DATA_VERSION;
  },

  /**
   * Returns the stored data version from localStorage.
   *
   * @returns {string|null} The stored version, or null if not set
   */
  getStoredVersion() {
    return getStoredVersion();
  },

  /**
   * Checks if the store has been initialized.
   *
   * @returns {boolean} True if initialized
   */
  isInitialized() {
    return initialized;
  },

  /**
   * Finds a single record by id within an array-type entity.
   *
   * @param {string} entityType - The entity type identifier
   * @param {string} id - The record id to find
   * @returns {*} The matching record (deep cloned), or null if not found
   */
  findById(entityType, id) {
    if (!entityType || typeof entityType !== 'string') {
      return null;
    }
    if (!id || typeof id !== 'string') {
      return null;
    }
    ensureInitialized();

    const data = cache[entityType];
    if (!Array.isArray(data)) {
      return null;
    }

    const record = data.find((item) => item && item.id === id);
    if (!record) {
      return null;
    }

    return deepClone(record);
  },

  /**
   * Filters records within an array-type entity using a predicate function.
   *
   * @param {string} entityType - The entity type identifier
   * @param {function(*): boolean} predicate - The filter function
   * @returns {Array} Array of matching records (deep cloned), or empty array
   */
  filter(entityType, predicate) {
    if (!entityType || typeof entityType !== 'string') {
      return [];
    }
    if (typeof predicate !== 'function') {
      return [];
    }
    ensureInitialized();

    const data = cache[entityType];
    if (!Array.isArray(data)) {
      return [];
    }

    const results = data.filter(predicate);
    return deepClone(results);
  },

  /**
   * Returns the count of records in an array-type entity.
   *
   * @param {string} entityType - The entity type identifier
   * @returns {number} The number of records, or 0 if not an array
   */
  count(entityType) {
    if (!entityType || typeof entityType !== 'string') {
      return 0;
    }
    ensureInitialized();

    const data = cache[entityType];
    if (!Array.isArray(data)) {
      return 0;
    }

    return data.length;
  },
};

export default MockDataStore;