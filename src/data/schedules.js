import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} NotificationConfig
 * @property {boolean} onSuccess - Whether to notify on successful execution
 * @property {boolean} onFailure - Whether to notify on failed execution
 * @property {boolean} onSkip - Whether to notify on skipped execution
 * @property {string[]} channels - Notification channels (email, slack, inApp)
 * @property {string[]} recipients - Array of recipient names or email addresses
 */

/**
 * @typedef {Object} RetryPolicy
 * @property {boolean} enabled - Whether retry is enabled
 * @property {number} maxRetries - Maximum number of retry attempts
 * @property {number} retryDelaySeconds - Delay between retries in seconds
 * @property {string} backoffStrategy - Backoff strategy (fixed, linear, exponential)
 */

/**
 * @typedef {Object} Schedule
 * @property {string} id - Unique schedule identifier
 * @property {string} name - Display name of the schedule
 * @property {string} testSuiteId - Reference to the test suite ID this schedule runs
 * @property {string} frequency - Schedule frequency (daily, weekly, cron)
 * @property {string} cronExpression - Cron expression for cron frequency schedules (empty string for daily/weekly)
 * @property {string} nextRun - Next scheduled run time in ISO format
 * @property {string} lastRun - Last run time in ISO format (empty string if never run)
 * @property {string} status - Schedule status (active, paused, disabled)
 * @property {string} environment - Target execution environment (Production, Staging, QA, Development, Performance)
 * @property {string} createdBy - Name of the person who created the schedule
 * @property {string} createdDate - Creation date in ISO format
 * @property {string} description - Description of the schedule purpose
 * @property {string} application - Application ID this schedule relates to
 * @property {string} segment - Organizational segment
 * @property {NotificationConfig} notifications - Notification configuration
 * @property {RetryPolicy} retryPolicy - Retry policy configuration
 */

/**
 * Mock schedule data for the EQIP Quality Platform.
 * Contains schedule objects representing automated test execution schedules
 * with frequency, environment, notification, and retry configurations.
 *
 * @type {Schedule[]}
 */
const schedules = [
  {
    id: 'sched_001',
    name: 'Claims Engine Nightly Regression',
    testSuiteId: 'ts_claims_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T02:00:00Z',
    lastRun: '2024-12-12T02:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Lisa Johnson',
    createdDate: '2024-06-15',
    description: 'Nightly regression run of all claims engine unit tests to catch regressions early in the development cycle.',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Lisa Johnson', 'Jennifer Williams'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_002',
    name: 'Claims Integration Tests - Daily',
    testSuiteId: 'ts_claims_integration',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T04:00:00Z',
    lastRun: '2024-12-12T04:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Chris Anderson',
    createdDate: '2024-07-01',
    description: 'Daily integration test suite for claims processing engine validating cross-service interactions and data flows.',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Chris Anderson', 'Lisa Johnson'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 600,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_003',
    name: 'Claims E2E Smoke Tests',
    testSuiteId: 'ts_claims_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T06:00:00Z',
    lastRun: '2024-12-12T06:00:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Priya Patel',
    createdDate: '2024-08-10',
    description: 'Daily end-to-end smoke tests for claims processing covering critical claim submission and adjudication paths.',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack', 'inApp'],
      recipients: ['Priya Patel', 'Jennifer Williams', 'Lisa Johnson'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      retryDelaySeconds: 180,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_004',
    name: 'Claims Performance Benchmark - Weekly',
    testSuiteId: 'ts_claims_perf',
    frequency: 'weekly',
    cronExpression: '',
    nextRun: '2024-12-15T22:00:00Z',
    lastRun: '2024-12-08T22:00:00Z',
    status: 'active',
    environment: 'Performance',
    createdBy: 'Marcus Thompson',
    createdDate: '2024-05-20',
    description: 'Weekly performance benchmark tests for claims batch processing to track throughput trends and detect performance regressions.',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Marcus Thompson', 'Jennifer Williams'],
    },
    retryPolicy: {
      enabled: false,
      maxRetries: 0,
      retryDelaySeconds: 0,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_005',
    name: 'Member Portal Unit Tests - Nightly',
    testSuiteId: 'ts_member_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T01:00:00Z',
    lastRun: '2024-12-12T01:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Priya Patel',
    createdDate: '2024-06-01',
    description: 'Nightly unit test execution for the member portal covering all React components and utility functions.',
    application: 'app_member_portal',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Priya Patel', 'Rachel Nguyen'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 120,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_006',
    name: 'Member Portal Accessibility Audit',
    testSuiteId: 'ts_member_a11y',
    frequency: 'weekly',
    cronExpression: '',
    nextRun: '2024-12-16T10:00:00Z',
    lastRun: '2024-12-11T10:00:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Omar Hassan',
    createdDate: '2024-04-15',
    description: 'Weekly accessibility audit running WCAG 2.1 AA compliance checks across all member-facing pages.',
    application: 'app_member_portal',
    segment: 'Enterprise',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Omar Hassan', 'Rachel Nguyen'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 600,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_007',
    name: 'Member Portal E2E - Daily',
    testSuiteId: 'ts_member_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T05:30:00Z',
    lastRun: '2024-12-12T05:30:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Priya Patel',
    createdDate: '2024-07-20',
    description: 'Daily end-to-end tests for member portal covering login, claims history, provider search, and prescription refill workflows.',
    application: 'app_member_portal',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'inApp'],
      recipients: ['Priya Patel', 'Rachel Nguyen'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 240,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_008',
    name: 'Auth Service Security Scan',
    testSuiteId: 'ts_auth_security',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T03:00:00Z',
    lastRun: '2024-12-12T03:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Natalie White',
    createdDate: '2024-03-01',
    description: 'Daily security test suite for the authentication service covering token validation, MFA flows, and vulnerability checks.',
    application: 'app_auth_service',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Natalie White', 'Brian Foster'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 300,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_009',
    name: 'Auth Service Unit Tests - Nightly',
    testSuiteId: 'ts_auth_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T01:30:00Z',
    lastRun: '2024-12-12T01:30:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Chris Anderson',
    createdDate: '2024-04-01',
    description: 'Nightly unit test execution for the authentication service covering OAuth, OIDC, and session management logic.',
    application: 'app_auth_service',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Chris Anderson', 'Natalie White'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 120,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_010',
    name: 'Data Warehouse ETL Validation',
    testSuiteId: 'ts_dw_integration',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T07:00:00Z',
    lastRun: '2024-12-12T07:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Samantha Clark',
    createdDate: '2024-05-10',
    description: 'Daily integration tests validating ETL pipeline data transformations, quality checks, and lineage tracking for the enterprise data warehouse.',
    application: 'app_data_warehouse',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Samantha Clark', 'Jennifer Williams'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 600,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_011',
    name: 'Data Warehouse Performance Tests - Weekly',
    testSuiteId: 'ts_dw_perf',
    frequency: 'weekly',
    cronExpression: '',
    nextRun: '2024-12-15T20:00:00Z',
    lastRun: '2024-12-08T20:00:00Z',
    status: 'active',
    environment: 'Performance',
    createdBy: 'Marcus Thompson',
    createdDate: '2024-06-20',
    description: 'Weekly performance tests for data warehouse query execution times and resource utilization under full population load.',
    application: 'app_data_warehouse',
    segment: 'Enterprise',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Marcus Thompson', 'Samantha Clark'],
    },
    retryPolicy: {
      enabled: false,
      maxRetries: 0,
      retryDelaySeconds: 0,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_012',
    name: 'Provider Directory Unit Tests - Nightly',
    testSuiteId: 'ts_provider_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T01:45:00Z',
    lastRun: '2024-12-12T01:45:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Chris Anderson',
    createdDate: '2024-07-15',
    description: 'Nightly unit test execution for the provider directory service covering search, filtering, and credentialing logic.',
    application: 'app_provider_directory',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Chris Anderson'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 120,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_013',
    name: 'Notification Hub E2E Tests - Daily',
    testSuiteId: 'ts_notif_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T06:30:00Z',
    lastRun: '2024-12-12T06:30:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'James Wright',
    createdDate: '2024-08-01',
    description: 'Daily end-to-end tests for the notification hub covering email, SMS, push, and in-app notification delivery workflows.',
    application: 'app_notification_hub',
    segment: 'Enterprise',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'inApp'],
      recipients: ['James Wright'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      retryDelaySeconds: 180,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_014',
    name: 'Medicare Enrollment Regression - Nightly',
    testSuiteId: 'ts_medicare_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T02:30:00Z',
    lastRun: '2024-12-12T02:30:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Lisa Johnson',
    createdDate: '2024-04-20',
    description: 'Nightly regression suite for Medicare enrollment system covering AEP rules, SEP processing, and dual-eligible enrollment logic.',
    application: 'app_medicare_enrollment',
    segment: 'Medicare',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Lisa Johnson', 'Michael Torres'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_015',
    name: 'Medicare Enrollment E2E - Daily',
    testSuiteId: 'ts_medicare_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T05:00:00Z',
    lastRun: '2024-12-12T05:00:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Lisa Johnson',
    createdDate: '2024-05-15',
    description: 'Daily end-to-end tests for Medicare enrollment covering complete enrollment workflows, CMS transaction validation, and effective date calculations.',
    application: 'app_medicare_enrollment',
    segment: 'Medicare',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack', 'inApp'],
      recipients: ['Lisa Johnson', 'Michael Torres', 'Patricia Evans'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 240,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_016',
    name: 'Medicare Enrollment Performance - Weekly',
    testSuiteId: 'ts_medicare_perf',
    frequency: 'weekly',
    cronExpression: '',
    nextRun: '2024-12-15T21:00:00Z',
    lastRun: '2024-12-09T21:00:00Z',
    status: 'active',
    environment: 'Performance',
    createdBy: 'Marcus Thompson',
    createdDate: '2024-06-10',
    description: 'Weekly performance tests for Medicare enrollment system measuring enrollment processing throughput and batch performance under peak load.',
    application: 'app_medicare_enrollment',
    segment: 'Medicare',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email'],
      recipients: ['Marcus Thompson', 'Michael Torres'],
    },
    retryPolicy: {
      enabled: false,
      maxRetries: 0,
      retryDelaySeconds: 0,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_017',
    name: 'HEDIS Engine Full Regression',
    testSuiteId: 'ts_hedis_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T03:30:00Z',
    lastRun: '2024-12-12T03:30:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Lisa Johnson',
    createdDate: '2024-03-15',
    description: 'Nightly full regression of HEDIS measure engine unit tests covering all measure calculation logic, exclusion criteria, and value set lookups.',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Lisa Johnson', 'Angela Martinez'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_018',
    name: 'HEDIS Engine Integration Tests - Daily',
    testSuiteId: 'ts_hedis_integration',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T04:30:00Z',
    lastRun: '2024-12-12T04:30:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Samantha Clark',
    createdDate: '2024-04-10',
    description: 'Daily integration tests for HEDIS engine validating supplemental data source integration, data linkage, and cross-system measure calculations.',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Samantha Clark', 'Lisa Johnson'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 600,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_019',
    name: 'HEDIS Engine Performance - Weekly',
    testSuiteId: 'ts_hedis_perf',
    frequency: 'weekly',
    cronExpression: '',
    nextRun: '2024-12-14T21:00:00Z',
    lastRun: '2024-12-07T21:00:00Z',
    status: 'active',
    environment: 'Performance',
    createdBy: 'Marcus Thompson',
    createdDate: '2024-05-01',
    description: 'Weekly performance tests for HEDIS engine measuring full population measure calculation throughput and resource utilization.',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Marcus Thompson', 'Lisa Johnson', 'Angela Martinez'],
    },
    retryPolicy: {
      enabled: false,
      maxRetries: 0,
      retryDelaySeconds: 0,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_020',
    name: 'Star Ratings Calculation Validation',
    testSuiteId: 'ts_star_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T02:15:00Z',
    lastRun: '2024-12-12T02:15:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Emily Davis',
    createdDate: '2024-06-05',
    description: 'Daily validation of Star Ratings calculation logic ensuring alignment with CMS methodology and accurate measure-level, domain-level, and overall ratings.',
    application: 'app_star_ratings',
    segment: 'Medicare',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Emily Davis', 'Lisa Johnson'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 180,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_021',
    name: 'Part D Formulary Compliance Tests',
    testSuiteId: 'ts_partd_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T02:45:00Z',
    lastRun: '2024-12-12T02:45:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Lisa Johnson',
    createdDate: '2024-07-10',
    description: 'Daily compliance test suite for Part D formulary manager validating drug tier assignments, PA criteria, and CMS file format compliance.',
    application: 'app_part_d_formulary',
    segment: 'Medicare',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email'],
      recipients: ['Lisa Johnson', 'Thomas Lee'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 300,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_022',
    name: 'Medicaid Eligibility Regression - Nightly',
    testSuiteId: 'ts_medicaid_elig_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T03:00:00Z',
    lastRun: '2024-12-12T03:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Robert Kim',
    createdDate: '2024-05-25',
    description: 'Nightly regression suite for Medicaid eligibility engine covering income-based rules, categorical eligibility, and multi-state configurations.',
    application: 'app_medicaid_eligibility',
    segment: 'Medicaid',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Robert Kim', 'David Park'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_023',
    name: 'Medicaid Eligibility E2E - Daily',
    testSuiteId: 'ts_medicaid_elig_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T06:00:00Z',
    lastRun: '2024-12-12T06:00:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Robert Kim',
    createdDate: '2024-06-15',
    description: 'Daily end-to-end tests for Medicaid eligibility covering new applications, redeterminations, and batch processing workflows.',
    application: 'app_medicaid_eligibility',
    segment: 'Medicaid',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack', 'inApp'],
      recipients: ['Robert Kim', 'David Park', 'Patricia Evans'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      retryDelaySeconds: 240,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_024',
    name: 'State Reporting Validation - Daily',
    testSuiteId: 'ts_state_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T04:00:00Z',
    lastRun: '2024-12-12T04:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Patricia Evans',
    createdDate: '2024-05-01',
    description: 'Daily validation tests for state regulatory reporting covering data accuracy, format compliance, and cross-field validation rules.',
    application: 'app_state_reporting',
    segment: 'Medicaid',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Patricia Evans', 'Samantha Clark'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_025',
    name: 'Care Management Regression - Nightly',
    testSuiteId: 'ts_care_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T02:00:00Z',
    lastRun: '2024-12-12T02:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Amanda Garcia',
    createdDate: '2024-06-20',
    description: 'Nightly regression suite for care management platform covering care plan templates, outreach scheduling, and gap closure tracking.',
    application: 'app_care_management',
    segment: 'Medicaid',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email'],
      recipients: ['Amanda Garcia', 'Angela Martinez'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 180,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_026',
    name: 'Group Enrollment E2E - Daily',
    testSuiteId: 'ts_group_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T05:30:00Z',
    lastRun: '2024-12-12T05:30:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Chris Anderson',
    createdDate: '2024-08-15',
    description: 'Daily end-to-end tests for group enrollment platform covering employer registration, employee enrollment, and plan selection workflows.',
    application: 'app_group_enrollment',
    segment: 'Commercial',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'inApp'],
      recipients: ['Chris Anderson', 'Robert Kim'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 240,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_027',
    name: 'Broker Portal Regression - Nightly',
    testSuiteId: 'ts_broker_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T01:15:00Z',
    lastRun: '2024-12-12T01:15:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Priya Patel',
    createdDate: '2024-07-25',
    description: 'Nightly regression suite for broker portal covering quoting engine, commission tracking, and license verification logic.',
    application: 'app_broker_portal',
    segment: 'Commercial',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Priya Patel', 'Kevin Brown'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 120,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_028',
    name: 'Underwriting Engine Validation - Daily',
    testSuiteId: 'ts_underwriting_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T02:00:00Z',
    lastRun: '2024-12-12T02:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Priya Patel',
    createdDate: '2024-08-05',
    description: 'Daily validation tests for underwriting engine covering risk model accuracy, rating factor compliance, and automated approval thresholds.',
    application: 'app_underwriting_engine',
    segment: 'Commercial',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Priya Patel', 'Thomas Lee'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 300,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_029',
    name: 'Wellness Platform E2E - Daily',
    testSuiteId: 'ts_wellness_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T06:00:00Z',
    lastRun: '2024-12-12T06:00:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Chris Anderson',
    createdDate: '2024-09-01',
    description: 'Daily end-to-end tests for wellness platform covering health assessments, gamification badges, rewards, and wellness challenge workflows.',
    application: 'app_wellness_platform',
    segment: 'Commercial',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Chris Anderson', 'Amanda Garcia'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 180,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_030',
    name: 'API Gateway Security Scan - Daily',
    testSuiteId: 'ts_api_gw_security',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T03:00:00Z',
    lastRun: '2024-12-12T03:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Natalie White',
    createdDate: '2024-04-01',
    description: 'Daily security scan for the partner API gateway covering OAuth token validation, rate limiting enforcement, and TLS configuration checks.',
    application: 'app_partner_api_gateway',
    segment: 'External',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Natalie White', 'Alex Rivera'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 300,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_031',
    name: 'API Gateway Performance - Weekly',
    testSuiteId: 'ts_api_gw_perf',
    frequency: 'weekly',
    cronExpression: '',
    nextRun: '2024-12-14T18:00:00Z',
    lastRun: '2024-12-07T18:00:00Z',
    status: 'active',
    environment: 'Performance',
    createdBy: 'Marcus Thompson',
    createdDate: '2024-05-15',
    description: 'Weekly performance tests for the API gateway measuring rate limiting accuracy, response times under load, and gateway stability.',
    application: 'app_partner_api_gateway',
    segment: 'External',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Marcus Thompson', 'Alex Rivera'],
    },
    retryPolicy: {
      enabled: false,
      maxRetries: 0,
      retryDelaySeconds: 0,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_032',
    name: 'Vendor Integration Regression - Daily',
    testSuiteId: 'ts_vendor_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T03:30:00Z',
    lastRun: '2024-12-12T03:30:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'James Wright',
    createdDate: '2024-06-01',
    description: 'Daily regression tests for vendor integration hub covering data feed processing, error recovery, and encrypted channel enforcement.',
    application: 'app_vendor_integration',
    segment: 'External',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['James Wright', 'Alex Rivera'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_033',
    name: 'External Data Feed Validation - Daily',
    testSuiteId: 'ts_data_feed_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T04:00:00Z',
    lastRun: '2024-12-12T04:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'James Wright',
    createdDate: '2024-07-01',
    description: 'Daily validation tests for external data feed processor covering CMS file format validation, required field checks, and processing SLA compliance.',
    application: 'app_external_data_feed',
    segment: 'External',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email'],
      recipients: ['James Wright'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 240,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_034',
    name: 'Audit Tracker Regression - Nightly',
    testSuiteId: 'ts_audit_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T01:00:00Z',
    lastRun: '2024-12-12T01:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Patricia Evans',
    createdDate: '2024-06-10',
    description: 'Nightly regression suite for audit tracking system covering record immutability, amendment workflows, and tamper detection.',
    application: 'app_audit_tracker',
    segment: 'Compliance',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Patricia Evans'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 120,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_035',
    name: 'Regulatory Reporting Validation - Daily',
    testSuiteId: 'ts_reg_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T02:30:00Z',
    lastRun: '2024-12-12T02:30:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Lisa Johnson',
    createdDate: '2024-07-20',
    description: 'Daily validation tests for regulatory reporting engine covering CMS template generation, format compliance, and data accuracy checks.',
    application: 'app_regulatory_reporting',
    segment: 'Compliance',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email'],
      recipients: ['Lisa Johnson', 'Patricia Evans'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 1,
      retryDelaySeconds: 300,
      backoffStrategy: 'fixed',
    },
  },
  {
    id: 'sched_036',
    name: 'Compliance Dashboard E2E - Daily',
    testSuiteId: 'ts_comp_dash_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T06:30:00Z',
    lastRun: '2024-12-12T06:30:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Priya Patel',
    createdDate: '2024-09-10',
    description: 'Daily end-to-end tests for compliance dashboard covering data refresh SLA, risk heat map visualization, and drill-down functionality.',
    application: 'app_compliance_dashboard',
    segment: 'Compliance',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email', 'inApp'],
      recipients: ['Priya Patel', 'Angela Martinez'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 180,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_037',
    name: 'Risk Assessment Validation - Daily',
    testSuiteId: 'ts_risk_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '2024-12-13T01:45:00Z',
    lastRun: '2024-12-12T01:45:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Samantha Clark',
    createdDate: '2024-08-20',
    description: 'Daily validation tests for risk assessment platform covering automated scoring engine accuracy, risk category assignment, and risk register management.',
    application: 'app_risk_assessment',
    segment: 'Compliance',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Samantha Clark', 'Patricia Evans'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 120,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_038',
    name: 'HEDIS E2E Measure Validation - Cron',
    testSuiteId: 'ts_hedis_e2e',
    frequency: 'cron',
    cronExpression: '0 4 * * 1,3,5',
    nextRun: '2024-12-13T04:00:00Z',
    lastRun: '2024-12-11T04:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'Lisa Johnson',
    createdDate: '2024-04-25',
    description: 'Cron-scheduled end-to-end HEDIS measure validation running Monday, Wednesday, and Friday at 4 AM UTC covering all measure calculations and exclusion logic.',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Lisa Johnson', 'Angela Martinez', 'Samantha Clark'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 600,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_039',
    name: 'Provider Network E2E - Paused',
    testSuiteId: 'ts_prov_net_e2e',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '',
    lastRun: '2024-11-21T06:00:00Z',
    status: 'paused',
    environment: 'Staging',
    createdBy: 'Robert Kim',
    createdDate: '2024-08-01',
    description: 'Daily end-to-end tests for provider network management paused pending environment stabilization after recent infrastructure changes.',
    application: 'app_provider_network',
    segment: 'Medicaid',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email'],
      recipients: ['Robert Kim', 'David Park'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 240,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_040',
    name: 'Individual Marketplace Regression - Disabled',
    testSuiteId: 'ts_individual_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '',
    lastRun: '2024-11-15T02:00:00Z',
    status: 'disabled',
    environment: 'QA',
    createdBy: 'Priya Patel',
    createdDate: '2024-07-01',
    description: 'Daily regression suite for individual marketplace disabled during OEP 2025 deployment freeze. Will be re-enabled after deployment stabilization.',
    application: 'app_individual_marketplace',
    segment: 'Commercial',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: false,
      channels: ['email'],
      recipients: ['Priya Patel', 'Emily Davis'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 180,
      backoffStrategy: 'linear',
    },
  },
  {
    id: 'sched_041',
    name: 'Benefits Admin Regression - Paused',
    testSuiteId: 'ts_benefits_unit',
    frequency: 'daily',
    cronExpression: '',
    nextRun: '',
    lastRun: '2024-12-01T02:00:00Z',
    status: 'paused',
    environment: 'QA',
    createdBy: 'Robert Kim',
    createdDate: '2024-06-15',
    description: 'Daily regression suite for benefits administration paused during 2025 plan year configuration migration. Scheduled to resume after migration completion.',
    application: 'app_benefits_admin',
    segment: 'Medicare',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email'],
      recipients: ['Robert Kim', 'Kevin Brown'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_042',
    name: 'Full Platform Smoke Tests - Cron',
    testSuiteId: 'ts_claims_e2e',
    frequency: 'cron',
    cronExpression: '0 6 * * *',
    nextRun: '2024-12-13T06:00:00Z',
    lastRun: '2024-12-12T06:00:00Z',
    status: 'active',
    environment: 'Production',
    createdBy: 'Jennifer Williams',
    createdDate: '2024-02-01',
    description: 'Daily production smoke tests running at 6 AM UTC validating critical path functionality across all enterprise applications.',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack', 'inApp'],
      recipients: ['Jennifer Williams', 'Karen Mitchell', 'Daniel Robinson'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      retryDelaySeconds: 60,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_043',
    name: 'State Reporting E2E - Cron',
    testSuiteId: 'ts_state_e2e',
    frequency: 'cron',
    cronExpression: '0 5 * * 2,4',
    nextRun: '2024-12-14T05:00:00Z',
    lastRun: '2024-12-12T05:00:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Patricia Evans',
    createdDate: '2024-05-20',
    description: 'Cron-scheduled end-to-end state reporting tests running Tuesday and Thursday at 5 AM UTC covering report generation, validation, and submission workflows.',
    application: 'app_state_reporting',
    segment: 'Medicaid',
    notifications: {
      onSuccess: true,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Patricia Evans', 'David Park'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 300,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_044',
    name: 'Vendor Integration E2E - Cron',
    testSuiteId: 'ts_vendor_e2e',
    frequency: 'cron',
    cronExpression: '0 8 * * 1-5',
    nextRun: '2024-12-13T08:00:00Z',
    lastRun: '2024-12-12T08:00:00Z',
    status: 'active',
    environment: 'QA',
    createdBy: 'James Wright',
    createdDate: '2024-07-15',
    description: 'Cron-scheduled weekday end-to-end tests for vendor integration hub running at 8 AM UTC covering data exchange, reconciliation, and error recovery workflows.',
    application: 'app_vendor_integration',
    segment: 'External',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['James Wright', 'Alex Rivera', 'Natalie White'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      retryDelaySeconds: 180,
      backoffStrategy: 'exponential',
    },
  },
  {
    id: 'sched_045',
    name: 'Care Management E2E - Cron',
    testSuiteId: 'ts_care_e2e',
    frequency: 'cron',
    cronExpression: '30 5 * * 1,3,5',
    nextRun: '2024-12-13T05:30:00Z',
    lastRun: '2024-12-11T05:30:00Z',
    status: 'active',
    environment: 'Staging',
    createdBy: 'Amanda Garcia',
    createdDate: '2024-07-10',
    description: 'Cron-scheduled end-to-end care management tests running Monday, Wednesday, and Friday at 5:30 AM UTC covering care plan workflows and outreach tracking.',
    application: 'app_care_management',
    segment: 'Medicaid',
    notifications: {
      onSuccess: false,
      onFailure: true,
      onSkip: true,
      channels: ['email', 'slack'],
      recipients: ['Amanda Garcia', 'David Park', 'Angela Martinez'],
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelaySeconds: 240,
      backoffStrategy: 'exponential',
    },
  },
];

/**
 * Returns all available schedules.
 *
 * @returns {Schedule[]} Array of all schedule objects
 */
export function getAllSchedules() {
  return [...schedules];
}

/**
 * Retrieves a single schedule by its unique ID.
 *
 * @param {string} scheduleId - The schedule identifier to look up
 * @returns {Schedule|null} The matching schedule object, or null if not found
 */
export function getScheduleById(scheduleId) {
  if (!scheduleId || typeof scheduleId !== 'string') {
    return null;
  }
  return schedules.find((s) => s.id === scheduleId) || null;
}

/**
 * Returns all schedules filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'active', 'paused', 'disabled')
 * @returns {Schedule[]} Array of schedules matching the specified status
 */
export function getSchedulesByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return schedules.filter((s) => s.status === status);
}

/**
 * Returns all schedules filtered by frequency.
 *
 * @param {string} frequency - The frequency to filter by (e.g. 'daily', 'weekly', 'cron')
 * @returns {Schedule[]} Array of schedules matching the specified frequency
 */
export function getSchedulesByFrequency(frequency) {
  if (!frequency || typeof frequency !== 'string') {
    return [];
  }
  return schedules.filter((s) => s.frequency === frequency);
}

/**
 * Returns all schedules filtered by environment.
 *
 * @param {string} environment - The environment to filter by (e.g. 'Production', 'Staging', 'QA', 'Performance')
 * @returns {Schedule[]} Array of schedules matching the specified environment
 */
export function getSchedulesByEnvironment(environment) {
  if (!environment || typeof environment !== 'string') {
    return [];
  }
  return schedules.filter((s) => s.environment === environment);
}

/**
 * Returns all schedules associated with a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {Schedule[]} Array of schedules for the specified application
 */
export function getSchedulesByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return schedules.filter((s) => s.application === applicationId);
}

/**
 * Returns all schedules belonging to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {Schedule[]} Array of schedules in the specified segment
 */
export function getSchedulesBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return schedules.filter((s) => s.segment === segment);
}

/**
 * Returns all schedules created by a specific person.
 *
 * @param {string} createdBy - The creator name to filter by
 * @returns {Schedule[]} Array of schedules created by the specified person
 */
export function getSchedulesByCreator(createdBy) {
  if (!createdBy || typeof createdBy !== 'string') {
    return [];
  }
  return schedules.filter((s) => s.createdBy === createdBy);
}

/**
 * Returns all schedules for a specific test suite.
 *
 * @param {string} testSuiteId - The test suite ID to filter by
 * @returns {Schedule[]} Array of schedules for the specified test suite
 */
export function getSchedulesByTestSuiteId(testSuiteId) {
  if (!testSuiteId || typeof testSuiteId !== 'string') {
    return [];
  }
  return schedules.filter((s) => s.testSuiteId === testSuiteId);
}

/**
 * Returns aggregate statistics across all schedules.
 *
 * @returns {{ totalSchedules: number, statusBreakdown: Object<string, number>, frequencyBreakdown: Object<string, number>, environmentBreakdown: Object<string, number>, activeCount: number, pausedCount: number, disabledCount: number }} Aggregate schedule statistics
 */
export function getScheduleAggregates() {
  const totalSchedules = schedules.length;

  const statusBreakdown = schedules.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const frequencyBreakdown = schedules.reduce((acc, s) => {
    acc[s.frequency] = (acc[s.frequency] || 0) + 1;
    return acc;
  }, {});

  const environmentBreakdown = schedules.reduce((acc, s) => {
    acc[s.environment] = (acc[s.environment] || 0) + 1;
    return acc;
  }, {});

  const activeCount = schedules.filter((s) => s.status === 'active').length;
  const pausedCount = schedules.filter((s) => s.status === 'paused').length;
  const disabledCount = schedules.filter((s) => s.status === 'disabled').length;

  return {
    totalSchedules,
    statusBreakdown,
    frequencyBreakdown,
    environmentBreakdown,
    activeCount,
    pausedCount,
    disabledCount,
  };
}

/**
 * Returns all unique schedule statuses.
 *
 * @returns {string[]} Array of unique schedule statuses sorted alphabetically
 */
export function getAllScheduleStatuses() {
  const statuses = new Set(schedules.map((s) => s.status));
  return [...statuses].sort();
}

/**
 * Returns all unique schedule frequencies.
 *
 * @returns {string[]} Array of unique schedule frequencies sorted alphabetically
 */
export function getAllScheduleFrequencies() {
  const frequencies = new Set(schedules.map((s) => s.frequency));
  return [...frequencies].sort();
}

/**
 * Returns all unique environments across all schedules.
 *
 * @returns {string[]} Array of unique environments sorted alphabetically
 */
export function getAllScheduleEnvironments() {
  const environments = new Set(schedules.map((s) => s.environment));
  return [...environments].sort();
}

export default schedules;