import MockDataStore from '@/lib/mock-api/mockDataStore';
import { generateId } from '@/lib/utils';

/**
 * Simulates async delay for mock API calls.
 *
 * @param {number} [ms=100] - Delay in milliseconds
 * @returns {Promise<void>}
 */
function delay(ms = 100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Ensures the MockDataStore is initialized before any operation.
 */
function ensureStore() {
  if (!MockDataStore.isInitialized()) {
    MockDataStore.initialize();
  }
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

/**
 * Fetches all applications with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.segment] - Filter by segment
 * @param {string} [filters.qualityStatus] - Filter by quality status
 * @param {string} [filters.riskLevel] - Filter by risk level
 * @param {string} [filters.owner] - Filter by owner
 * @returns {Promise<import('@/data/applications').Application[]>}
 */
export async function getApplications(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('applications') || [];
  if (filters.segment) {
    data = data.filter((a) => a.segment === filters.segment);
  }
  if (filters.qualityStatus) {
    data = data.filter((a) => a.qualityStatus === filters.qualityStatus);
  }
  if (filters.riskLevel) {
    data = data.filter((a) => a.riskLevel === filters.riskLevel);
  }
  if (filters.owner) {
    data = data.filter((a) => a.owner === filters.owner);
  }
  return data;
}

/**
 * Adds a new application.
 *
 * @param {Object} app - The application data to add
 * @returns {Promise<Object>} The created application with generated id
 */
export async function addApplication(app) {
  await delay();
  ensureStore();
  if (!app || !app.name) {
    throw { error: 'Validation failed: missing name', code: 400 };
  }
  const newApp = MockDataStore.add('applications', {
    ...app,
    id: app.id || generateId('app'),
  });
  return newApp;
}

/**
 * Edits an existing application.
 *
 * @param {string} appId - The application ID to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated application
 */
export async function editApplication(appId, updates) {
  await delay();
  ensureStore();
  if (!appId) {
    throw { error: 'Validation failed: missing appId', code: 400 };
  }
  const updated = MockDataStore.update('applications', appId, updates);
  if (!updated) {
    throw { error: 'Application not found', code: 404 };
  }
  return updated;
}

/**
 * Exports applications as an array (simulated export).
 *
 * @param {Object} [filters={}] - Optional filters
 * @returns {Promise<Object[]>} Array of application objects for export
 */
export async function exportApplications(filters = {}) {
  await delay();
  const apps = await getApplications(filters);
  return apps.map((a) => ({
    id: a.id,
    name: a.name,
    segment: a.segment,
    owner: a.owner,
    riskLevel: a.riskLevel,
    qualityStatus: a.qualityStatus,
    automationCoverage: a.automationCoverage,
    testCaseCount: a.testCaseCount,
    releaseCount: a.releaseCount,
    environment: a.environment,
  }));
}

// ---------------------------------------------------------------------------
// Demands
// ---------------------------------------------------------------------------

/**
 * Fetches the demand pipeline with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.segment] - Filter by segment
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.priority] - Filter by priority
 * @param {string} [filters.type] - Filter by type
 * @param {string} [filters.application] - Filter by application
 * @param {string} [filters.assignee] - Filter by assignee
 * @returns {Promise<import('@/data/demands').Demand[]>}
 */
export async function getDemandPipeline(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('demands') || [];
  if (filters.segment) {
    data = data.filter((d) => d.segment === filters.segment);
  }
  if (filters.status) {
    data = data.filter((d) => d.status === filters.status);
  }
  if (filters.priority) {
    data = data.filter((d) => d.priority === filters.priority);
  }
  if (filters.type) {
    data = data.filter((d) => d.type === filters.type);
  }
  if (filters.application) {
    data = data.filter((d) => d.application === filters.application);
  }
  if (filters.assignee) {
    data = data.filter((d) => d.assignee === filters.assignee);
  }
  return data;
}

/**
 * Intakes a new demand.
 *
 * @param {Object} demand - The demand data
 * @returns {Promise<Object>} The created demand
 */
export async function intakeDemand(demand) {
  await delay();
  ensureStore();
  if (!demand || !demand.title) {
    throw { error: 'Validation failed: missing title', code: 400 };
  }
  const newDemand = MockDataStore.add('demands', {
    ...demand,
    id: demand.id || generateId('dem'),
    status: demand.status || 'intake',
    intakeDate: demand.intakeDate || new Date().toISOString().split('T')[0],
  });
  return newDemand;
}

/**
 * Approves a demand.
 *
 * @param {string} demandId - The demand ID to approve
 * @returns {Promise<Object>} The updated demand
 */
export async function approveDemand(demandId) {
  await delay();
  ensureStore();
  if (!demandId) {
    throw { error: 'Validation failed: missing demandId', code: 400 };
  }
  const updated = MockDataStore.update('demands', demandId, { status: 'approved' });
  if (!updated) {
    throw { error: 'Demand not found', code: 404 };
  }
  return updated;
}

/**
 * Assigns a demand to a person.
 *
 * @param {string} demandId - The demand ID
 * @param {string} assignee - The assignee name
 * @returns {Promise<Object>} The updated demand
 */
export async function assignDemand(demandId, assignee) {
  await delay();
  ensureStore();
  if (!demandId) {
    throw { error: 'Validation failed: missing demandId', code: 400 };
  }
  if (!assignee) {
    throw { error: 'Validation failed: missing assignee', code: 400 };
  }
  const updated = MockDataStore.update('demands', demandId, { assignee });
  if (!updated) {
    throw { error: 'Demand not found', code: 404 };
  }
  return updated;
}

/**
 * Exports demands as an array (simulated export).
 *
 * @param {Object} [filters={}] - Optional filters
 * @returns {Promise<Object[]>} Array of demand objects for export
 */
export async function exportDemand(filters = {}) {
  await delay();
  const demands = await getDemandPipeline(filters);
  return demands.map((d) => ({
    id: d.id,
    title: d.title,
    type: d.type,
    priority: d.priority,
    status: d.status,
    segment: d.segment,
    application: d.application,
    assignee: d.assignee,
    estimatedEffort: d.estimatedEffort,
    targetDate: d.targetDate,
  }));
}

// ---------------------------------------------------------------------------
// Test Cases
// ---------------------------------------------------------------------------

/**
 * Fetches test cases with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.segment] - Filter by segment
 * @param {string} [filters.type] - Filter by type
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.priority] - Filter by priority
 * @param {string} [filters.application] - Filter by application
 * @param {string} [filters.automationStatus] - Filter by automation status
 * @param {string} [filters.approvalStatus] - Filter by approval status
 * @param {string} [filters.createdBy] - Filter by creator
 * @returns {Promise<import('@/data/testCases').TestCase[]>}
 */
export async function getTestCases(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('testCases') || [];
  if (filters.segment) {
    data = data.filter((tc) => tc.segment === filters.segment);
  }
  if (filters.type) {
    data = data.filter((tc) => tc.type === filters.type);
  }
  if (filters.status) {
    data = data.filter((tc) => tc.status === filters.status);
  }
  if (filters.priority) {
    data = data.filter((tc) => tc.priority === filters.priority);
  }
  if (filters.application) {
    data = data.filter((tc) => tc.application === filters.application);
  }
  if (filters.automationStatus) {
    data = data.filter((tc) => tc.automationStatus === filters.automationStatus);
  }
  if (filters.approvalStatus) {
    data = data.filter((tc) => tc.approvalStatus === filters.approvalStatus);
  }
  if (filters.createdBy) {
    data = data.filter((tc) => tc.createdBy === filters.createdBy);
  }
  return data;
}

/**
 * Creates a new test case.
 *
 * @param {Object} testCase - The test case data
 * @returns {Promise<Object>} The created test case
 */
export async function createTestCase(testCase) {
  await delay();
  ensureStore();
  if (!testCase || !testCase.title) {
    throw { error: 'Validation failed: missing title', code: 400 };
  }
  const newTestCase = MockDataStore.add('testCases', {
    ...testCase,
    id: testCase.id || generateId('tc'),
    status: testCase.status || 'not_run',
    approvalStatus: testCase.approvalStatus || 'draft',
    lastModified: new Date().toISOString().split('T')[0],
  });
  return newTestCase;
}

/**
 * Edits an existing test case.
 *
 * @param {string} testCaseId - The test case ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated test case
 */
export async function editTestCase(testCaseId, updates) {
  await delay();
  ensureStore();
  if (!testCaseId) {
    throw { error: 'Validation failed: missing testCaseId', code: 400 };
  }
  const updated = MockDataStore.update('testCases', testCaseId, {
    ...updates,
    lastModified: new Date().toISOString().split('T')[0],
  });
  if (!updated) {
    throw { error: 'Test case not found', code: 404 };
  }
  return updated;
}

/**
 * Approves a test case.
 *
 * @param {string} testCaseId - The test case ID
 * @returns {Promise<Object>} The updated test case
 */
export async function approveTestCase(testCaseId) {
  await delay();
  ensureStore();
  if (!testCaseId) {
    throw { error: 'Validation failed: missing testCaseId', code: 400 };
  }
  const updated = MockDataStore.update('testCases', testCaseId, {
    approvalStatus: 'approved',
    lastModified: new Date().toISOString().split('T')[0],
  });
  if (!updated) {
    throw { error: 'Test case not found', code: 404 };
  }
  return updated;
}

/**
 * Clones a test case.
 *
 * @param {string} testCaseId - The test case ID to clone
 * @returns {Promise<Object>} The cloned test case
 */
export async function cloneTestCase(testCaseId) {
  await delay();
  ensureStore();
  if (!testCaseId) {
    throw { error: 'Validation failed: missing testCaseId', code: 400 };
  }
  const original = MockDataStore.findById('testCases', testCaseId);
  if (!original) {
    throw { error: 'Test case not found', code: 404 };
  }
  const cloned = MockDataStore.add('testCases', {
    ...original,
    id: generateId('tc'),
    title: `${original.title} (Copy)`,
    status: 'not_run',
    approvalStatus: 'draft',
    lastModified: new Date().toISOString().split('T')[0],
  });
  return cloned;
}

/**
 * Retires a test case.
 *
 * @param {string} testCaseId - The test case ID
 * @returns {Promise<Object>} The updated test case
 */
export async function retireTestCase(testCaseId) {
  await delay();
  ensureStore();
  if (!testCaseId) {
    throw { error: 'Validation failed: missing testCaseId', code: 400 };
  }
  const updated = MockDataStore.update('testCases', testCaseId, {
    status: 'skipped',
    approvalStatus: 'rejected',
    lastModified: new Date().toISOString().split('T')[0],
  });
  if (!updated) {
    throw { error: 'Test case not found', code: 404 };
  }
  return updated;
}

/**
 * Imports test cases from an array (simulated file import).
 *
 * @param {Object[]} testCasesArray - Array of test case objects to import
 * @returns {Promise<Object[]>} Array of created test cases
 */
export async function importTestCases(testCasesArray) {
  await delay(200);
  ensureStore();
  if (!Array.isArray(testCasesArray) || testCasesArray.length === 0) {
    throw { error: 'Validation failed: empty import data', code: 400 };
  }
  const imported = [];
  for (const tc of testCasesArray) {
    const newTc = MockDataStore.add('testCases', {
      ...tc,
      id: generateId('tc'),
      status: tc.status || 'not_run',
      approvalStatus: tc.approvalStatus || 'draft',
      lastModified: new Date().toISOString().split('T')[0],
    });
    imported.push(newTc);
  }
  return imported;
}

// ---------------------------------------------------------------------------
// Test Executions
// ---------------------------------------------------------------------------

/**
 * Fetches test executions with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.testCaseId] - Filter by test case ID
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.environment] - Filter by environment
 * @param {string} [filters.suiteName] - Filter by suite name
 * @param {string} [filters.executedBy] - Filter by executor
 * @returns {Promise<import('@/data/testExecutions').TestExecution[]>}
 */
export async function getTestExecutions(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('testExecutions') || [];
  if (filters.testCaseId) {
    data = data.filter((e) => e.testCaseId === filters.testCaseId);
  }
  if (filters.status) {
    data = data.filter((e) => e.status === filters.status);
  }
  if (filters.environment) {
    data = data.filter((e) => e.environment === filters.environment);
  }
  if (filters.suiteName) {
    data = data.filter((e) => e.suiteName === filters.suiteName);
  }
  if (filters.executedBy) {
    data = data.filter((e) => e.executedBy === filters.executedBy);
  }
  return data;
}

/**
 * Schedules a new test execution.
 *
 * @param {Object} execution - The execution data
 * @returns {Promise<Object>} The created execution
 */
export async function scheduleExecution(execution) {
  await delay();
  ensureStore();
  if (!execution || !execution.testCaseId) {
    throw { error: 'Validation failed: missing testCaseId', code: 400 };
  }
  const newExecution = MockDataStore.add('testExecutions', {
    ...execution,
    id: execution.id || generateId('exec'),
    status: execution.status || 'in-progress',
    startTime: execution.startTime || new Date().toISOString(),
    endTime: '',
    duration: 0,
    logs: execution.logs || [],
    evidence: execution.evidence || [],
    aiAnalysis: execution.aiAnalysis || {
      summary: '',
      rootCause: '',
      recommendation: '',
      confidence: 0,
      relatedDefects: [],
    },
    defectsFound: execution.defectsFound || [],
  });
  return newExecution;
}

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------

/**
 * Fetches schedules with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.frequency] - Filter by frequency
 * @param {string} [filters.environment] - Filter by environment
 * @param {string} [filters.application] - Filter by application
 * @param {string} [filters.segment] - Filter by segment
 * @returns {Promise<import('@/data/schedules').Schedule[]>}
 */
export async function getSchedules(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('schedules') || [];
  if (filters.status) {
    data = data.filter((s) => s.status === filters.status);
  }
  if (filters.frequency) {
    data = data.filter((s) => s.frequency === filters.frequency);
  }
  if (filters.environment) {
    data = data.filter((s) => s.environment === filters.environment);
  }
  if (filters.application) {
    data = data.filter((s) => s.application === filters.application);
  }
  if (filters.segment) {
    data = data.filter((s) => s.segment === filters.segment);
  }
  return data;
}

/**
 * Creates a new schedule.
 *
 * @param {Object} schedule - The schedule data
 * @returns {Promise<Object>} The created schedule
 */
export async function createSchedule(schedule) {
  await delay();
  ensureStore();
  if (!schedule || !schedule.name) {
    throw { error: 'Validation failed: missing name', code: 400 };
  }
  const newSchedule = MockDataStore.add('schedules', {
    ...schedule,
    id: schedule.id || generateId('sched'),
    status: schedule.status || 'active',
    createdDate: schedule.createdDate || new Date().toISOString().split('T')[0],
  });
  return newSchedule;
}

/**
 * Edits an existing schedule.
 *
 * @param {string} scheduleId - The schedule ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated schedule
 */
export async function editSchedule(scheduleId, updates) {
  await delay();
  ensureStore();
  if (!scheduleId) {
    throw { error: 'Validation failed: missing scheduleId', code: 400 };
  }
  const updated = MockDataStore.update('schedules', scheduleId, updates);
  if (!updated) {
    throw { error: 'Schedule not found', code: 404 };
  }
  return updated;
}

/**
 * Pauses a schedule.
 *
 * @param {string} scheduleId - The schedule ID
 * @returns {Promise<Object>} The updated schedule
 */
export async function pauseSchedule(scheduleId) {
  await delay();
  ensureStore();
  if (!scheduleId) {
    throw { error: 'Validation failed: missing scheduleId', code: 400 };
  }
  const updated = MockDataStore.update('schedules', scheduleId, {
    status: 'paused',
    nextRun: '',
  });
  if (!updated) {
    throw { error: 'Schedule not found', code: 404 };
  }
  return updated;
}

/**
 * Resumes a paused schedule.
 *
 * @param {string} scheduleId - The schedule ID
 * @returns {Promise<Object>} The updated schedule
 */
export async function resumeSchedule(scheduleId) {
  await delay();
  ensureStore();
  if (!scheduleId) {
    throw { error: 'Validation failed: missing scheduleId', code: 400 };
  }
  const updated = MockDataStore.update('schedules', scheduleId, {
    status: 'active',
    nextRun: new Date(Date.now() + 86400000).toISOString(),
  });
  if (!updated) {
    throw { error: 'Schedule not found', code: 404 };
  }
  return updated;
}

/**
 * Disables a schedule.
 *
 * @param {string} scheduleId - The schedule ID
 * @returns {Promise<Object>} The updated schedule
 */
export async function disableSchedule(scheduleId) {
  await delay();
  ensureStore();
  if (!scheduleId) {
    throw { error: 'Validation failed: missing scheduleId', code: 400 };
  }
  const updated = MockDataStore.update('schedules', scheduleId, {
    status: 'disabled',
    nextRun: '',
  });
  if (!updated) {
    throw { error: 'Schedule not found', code: 404 };
  }
  return updated;
}

/**
 * Deletes a schedule.
 *
 * @param {string} scheduleId - The schedule ID
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteSchedule(scheduleId) {
  await delay();
  ensureStore();
  if (!scheduleId) {
    throw { error: 'Validation failed: missing scheduleId', code: 400 };
  }
  const removed = MockDataStore.remove('schedules', scheduleId);
  if (!removed) {
    throw { error: 'Schedule not found', code: 404 };
  }
  return true;
}

// ---------------------------------------------------------------------------
// Segments
// ---------------------------------------------------------------------------

/**
 * Fetches all segments with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.status] - Filter by status
 * @returns {Promise<import('@/data/segments').Segment[]>}
 */
export async function getSegments(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('segments') || [];
  if (filters.status) {
    data = data.filter((s) => s.status === filters.status);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Dashboard Metrics
// ---------------------------------------------------------------------------

/**
 * Fetches dashboard metrics.
 *
 * @returns {Promise<import('@/data/dashboardMetrics').DashboardMetrics>}
 */
export async function getDashboardMetrics() {
  await delay();
  ensureStore();
  return MockDataStore.load('dashboardMetrics') || {};
}

// ---------------------------------------------------------------------------
// HTH Metrics (Automation Intelligence)
// ---------------------------------------------------------------------------

/**
 * Fetches automation intelligence / HTH metrics.
 *
 * @returns {Promise<import('@/data/automationIntelligence').AutomationIntelligenceData>}
 */
export async function getHTHMetrics() {
  await delay();
  ensureStore();
  return MockDataStore.load('automationIntelligence') || {};
}

// ---------------------------------------------------------------------------
// Environments
// ---------------------------------------------------------------------------

/**
 * Fetches environments with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.type] - Filter by type
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.owner] - Filter by owner
 * @returns {Promise<import('@/data/environments').Environment[]>}
 */
export async function getEnvironments(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('environments') || [];
  if (filters.type) {
    data = data.filter((e) => e.type === filters.type);
  }
  if (filters.status) {
    data = data.filter((e) => e.status === filters.status);
  }
  if (filters.owner) {
    data = data.filter((e) => e.owner === filters.owner);
  }
  return data;
}

/**
 * Reserves an environment.
 *
 * @param {string} environmentId - The environment ID
 * @param {Object} reservation - Reservation details
 * @param {string} reservation.reservedBy - Name of the person reserving
 * @param {string} reservation.reservationStart - Start time in ISO format
 * @param {string} reservation.reservationEnd - End time in ISO format
 * @returns {Promise<Object>} The updated environment
 */
export async function reserveEnvironment(environmentId, reservation) {
  await delay();
  ensureStore();
  if (!environmentId) {
    throw { error: 'Validation failed: missing environmentId', code: 400 };
  }
  if (!reservation || !reservation.reservedBy) {
    throw { error: 'Validation failed: missing reservedBy', code: 400 };
  }
  const updated = MockDataStore.update('environments', environmentId, {
    status: 'reserved',
    reservedBy: reservation.reservedBy,
    reservationStart: reservation.reservationStart || new Date().toISOString(),
    reservationEnd: reservation.reservationEnd || '',
  });
  if (!updated) {
    throw { error: 'Environment not found', code: 404 };
  }
  return updated;
}

// ---------------------------------------------------------------------------
// Test Data Assets
// ---------------------------------------------------------------------------

/**
 * Fetches test data assets with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.type] - Filter by type
 * @param {string} [filters.application] - Filter by application
 * @param {string} [filters.environment] - Filter by environment
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.maskingStatus] - Filter by masking status
 * @returns {Promise<import('@/data/testData').TestData[]>}
 */
export async function getTestDataAssets(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('testData') || [];
  if (filters.type) {
    data = data.filter((td) => td.type === filters.type);
  }
  if (filters.application) {
    data = data.filter((td) => td.application === filters.application);
  }
  if (filters.environment) {
    data = data.filter((td) => td.environment === filters.environment);
  }
  if (filters.status) {
    data = data.filter((td) => td.status === filters.status);
  }
  if (filters.maskingStatus) {
    data = data.filter((td) => td.maskingStatus === filters.maskingStatus);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Quality Gates
// ---------------------------------------------------------------------------

/**
 * Fetches quality gates with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.application] - Filter by application
 * @param {string} [filters.overallStatus] - Filter by overall status
 * @param {string} [filters.segment] - Filter by segment
 * @returns {Promise<import('@/data/qualityGates').QualityGate[]>}
 */
export async function getQualityGates(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('qualityGates') || [];
  if (filters.application) {
    data = data.filter((qg) => qg.application === filters.application);
  }
  if (filters.overallStatus) {
    data = data.filter((qg) => qg.overallStatus === filters.overallStatus);
  }
  if (filters.segment) {
    data = data.filter((qg) => qg.segment === filters.segment);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Governance
// ---------------------------------------------------------------------------

/**
 * Fetches governance data.
 *
 * @returns {Promise<import('@/data/governance').GovernanceData>}
 */
export async function getGovernanceData() {
  await delay();
  ensureStore();
  return MockDataStore.load('governance') || {};
}

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

/**
 * Fetches integrations with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.type] - Filter by type
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.vendor] - Filter by vendor
 * @returns {Promise<import('@/data/integrations').Integration[]>}
 */
export async function getIntegrations(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('integrations') || [];
  if (filters.type) {
    data = data.filter((i) => i.type === filters.type);
  }
  if (filters.status) {
    data = data.filter((i) => i.status === filters.status);
  }
  if (filters.vendor) {
    data = data.filter((i) => i.vendor === filters.vendor);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

/**
 * Fetches reports data.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.category] - Filter by category
 * @param {string} [filters.chartType] - Filter by chart type
 * @param {string} [filters.frequency] - Filter by frequency
 * @returns {Promise<Object>} Reports data object with categories and reports
 */
export async function getReports(filters = {}) {
  await delay();
  ensureStore();
  const reportsData = MockDataStore.load('reports') || {};
  if (!filters.category && !filters.chartType && !filters.frequency) {
    return reportsData;
  }
  const result = { ...reportsData };
  if (Array.isArray(result)) {
    let filtered = result;
    if (filters.category) {
      filtered = filtered.filter((r) => r.category === filters.category);
    }
    if (filters.chartType) {
      filtered = filtered.filter((r) => r.chartType === filters.chartType);
    }
    if (filters.frequency) {
      filtered = filtered.filter((r) => r.frequency === filters.frequency);
    }
    return filtered;
  }
  return result;
}

// ---------------------------------------------------------------------------
// AI Insights
// ---------------------------------------------------------------------------

/**
 * Fetches AI insights data.
 *
 * @returns {Promise<import('@/data/aiInsights').AIInsightsData>}
 */
export async function getAIInsights() {
  await delay();
  ensureStore();
  return MockDataStore.load('aiInsights') || {};
}

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

/**
 * Fetches agents with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.type] - Filter by type
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.owner] - Filter by owner
 * @returns {Promise<import('@/data/agents').Agent[]>}
 */
export async function getAgents(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('agents') || [];
  if (filters.type) {
    data = data.filter((a) => a.type === filters.type);
  }
  if (filters.status) {
    data = data.filter((a) => a.status === filters.status);
  }
  if (filters.owner) {
    data = data.filter((a) => a.owner === filters.owner);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Knowledge Graph
// ---------------------------------------------------------------------------

/**
 * Fetches knowledge graph data.
 *
 * @returns {Promise<import('@/data/knowledgeGraph').KnowledgeGraphData>}
 */
export async function getKnowledgeGraph() {
  await delay();
  ensureStore();
  return MockDataStore.load('knowledgeGraph') || { nodes: [], edges: [] };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/**
 * Fetches users with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.role] - Filter by role
 * @param {string} [filters.segment] - Filter by segment
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.department] - Filter by department
 * @returns {Promise<import('@/data/users').User[]>}
 */
export async function getUsers(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('users') || [];
  if (filters.role) {
    data = data.filter((u) => u.role === filters.role);
  }
  if (filters.segment) {
    data = data.filter((u) => u.segment === filters.segment);
  }
  if (filters.status) {
    data = data.filter((u) => u.status === filters.status);
  }
  if (filters.department) {
    data = data.filter((u) => u.department === filters.department);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

/**
 * Fetches notifications with optional filters.
 *
 * @param {Object} [filters={}] - Optional filters
 * @param {string} [filters.personaId] - Filter by persona ID
 * @param {string} [filters.type] - Filter by type
 * @param {string} [filters.priority] - Filter by priority
 * @param {string} [filters.category] - Filter by category
 * @param {boolean} [filters.read] - Filter by read status
 * @returns {Promise<import('@/data/notifications').Notification[]>}
 */
export async function getNotifications(filters = {}) {
  await delay();
  ensureStore();
  let data = MockDataStore.load('notifications') || [];
  if (filters.personaId) {
    data = data.filter((n) => n.personaId === filters.personaId);
  }
  if (filters.type) {
    data = data.filter((n) => n.type === filters.type);
  }
  if (filters.priority) {
    data = data.filter((n) => n.priority === filters.priority);
  }
  if (filters.category) {
    data = data.filter((n) => n.category === filters.category);
  }
  if (typeof filters.read === 'boolean') {
    data = data.filter((n) => n.read === filters.read);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

/**
 * Logs an audit event.
 *
 * @param {Object} event - The audit event data
 * @param {string} event.eventType - Type of event
 * @param {string} event.personaId - Persona ID of the actor
 * @param {string} event.personaName - Display name of the actor
 * @param {string} event.action - Short action description
 * @param {string} event.details - Detailed description
 * @param {string} [event.resource] - Resource affected
 * @param {string} [event.outcome] - Outcome of the action
 * @param {string} [event.segment] - Segment context
 * @returns {Promise<Object>} The created audit log entry
 */
export async function logAuditEvent(event) {
  await delay(50);
  ensureStore();
  if (!event || !event.eventType || !event.action) {
    throw { error: 'Validation failed: missing eventType or action', code: 400 };
  }
  const newEntry = MockDataStore.add('auditLogs', {
    ...event,
    id: event.id || generateId('audit'),
    timestamp: event.timestamp || new Date().toISOString(),
    ipAddress: event.ipAddress || '10.128.45.100',
    resource: event.resource || '',
    outcome: event.outcome || 'success',
    segment: event.segment || '',
  });
  return newEntry;
}

// ---------------------------------------------------------------------------
// Post-Deployment
// ---------------------------------------------------------------------------

/**
 * Fetches post-deployment monitoring data.
 *
 * @returns {Promise<import('@/data/postDeployment').PostDeploymentData>}
 */
export async function getPostDeploymentData() {
  await delay();
  ensureStore();
  return MockDataStore.load('postDeployment') || {};
}

// ---------------------------------------------------------------------------
// Adoption
// ---------------------------------------------------------------------------

/**
 * Fetches adoption data.
 *
 * @returns {Promise<import('@/data/adoption').AdoptionData>}
 */
export async function getAdoptionData() {
  await delay();
  ensureStore();
  return MockDataStore.load('adoption') || {};
}

// ---------------------------------------------------------------------------
// Personas
// ---------------------------------------------------------------------------

/**
 * Fetches all personas.
 *
 * @returns {Promise<import('@/data/personas').Persona[]>}
 */
export async function getPersonas() {
  await delay();
  ensureStore();
  return MockDataStore.load('personas') || [];
}

// ---------------------------------------------------------------------------
// Default export: all mock service functions
// ---------------------------------------------------------------------------

const MockService = {
  // Applications
  getApplications,
  addApplication,
  editApplication,
  exportApplications,

  // Demands
  getDemandPipeline,
  intakeDemand,
  approveDemand,
  assignDemand,
  exportDemand,

  // Test Cases
  getTestCases,
  createTestCase,
  editTestCase,
  approveTestCase,
  cloneTestCase,
  retireTestCase,
  importTestCases,

  // Test Executions
  getTestExecutions,
  scheduleExecution,

  // Schedules
  getSchedules,
  createSchedule,
  editSchedule,
  pauseSchedule,
  resumeSchedule,
  disableSchedule,
  deleteSchedule,

  // Segments
  getSegments,

  // Dashboard
  getDashboardMetrics,

  // HTH / Automation Intelligence
  getHTHMetrics,

  // Environments
  getEnvironments,
  reserveEnvironment,

  // Test Data
  getTestDataAssets,

  // Quality Gates
  getQualityGates,

  // Governance
  getGovernanceData,

  // Integrations
  getIntegrations,

  // Reports
  getReports,

  // AI Insights
  getAIInsights,

  // Agents
  getAgents,

  // Knowledge Graph
  getKnowledgeGraph,

  // Users
  getUsers,

  // Notifications
  getNotifications,

  // Audit Logs
  logAuditEvent,

  // Post-Deployment
  getPostDeploymentData,

  // Adoption
  getAdoptionData,

  // Personas
  getPersonas,
};

export default MockService;