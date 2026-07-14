import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} LogEntry
 * @property {string} timestamp - Log entry timestamp in ISO format
 * @property {string} level - Log level (info, warn, error, debug)
 * @property {string} message - Log message
 */

/**
 * @typedef {Object} Evidence
 * @property {string} type - Evidence type (screenshot, video, log, har, report)
 * @property {string} name - Evidence file name
 * @property {string} url - Evidence file URL or path
 * @property {string} capturedAt - Capture timestamp in ISO format
 */

/**
 * @typedef {Object} AIAnalysis
 * @property {string} summary - AI-generated summary of the execution result
 * @property {string} rootCause - AI-suggested root cause for failures (empty string if passed)
 * @property {string} recommendation - AI-generated recommendation for next steps
 * @property {number} confidence - AI confidence score (0-100)
 * @property {string[]} relatedDefects - Array of related defect identifiers
 */

/**
 * @typedef {Object} DefectFound
 * @property {string} id - Defect identifier
 * @property {string} title - Defect title
 * @property {string} severity - Defect severity (critical, high, medium, low)
 * @property {string} status - Defect status (open, in_progress, resolved, closed)
 * @property {string} assignee - Defect assignee name
 */

/**
 * @typedef {Object} TestExecution
 * @property {string} id - Unique test execution identifier
 * @property {string} testCaseId - Reference to the test case ID
 * @property {string} suiteName - Name of the test suite this execution belongs to
 * @property {string} status - Execution status (passed, failed, blocked, skipped, in-progress)
 * @property {string} environment - Execution environment (Production, Staging, QA, Development, Performance)
 * @property {string} startTime - Execution start time in ISO format
 * @property {string} endTime - Execution end time in ISO format (empty string if in-progress)
 * @property {number} duration - Execution duration in seconds (0 if in-progress)
 * @property {string} executedBy - Name of the person or system that executed the test
 * @property {LogEntry[]} logs - Array of log entries from the execution
 * @property {Evidence[]} evidence - Array of evidence artifacts
 * @property {AIAnalysis} aiAnalysis - AI-generated analysis of the execution
 * @property {DefectFound[]} defectsFound - Array of defects found during execution
 */

/**
 * Mock test execution data for the EQIP Quality Platform.
 * Contains test execution objects representing individual test runs across
 * various environments with logs, evidence, AI analysis, and defect tracking.
 *
 * @type {TestExecution[]}
 */
const testExecutions = [
  {
    id: 'exec_001',
    testCaseId: 'tc_001',
    suiteName: 'Claims Unit Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-10T08:15:00Z',
    endTime: '2024-12-10T08:15:42Z',
    duration: 42,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-12-10T08:15:00Z', level: 'info', message: 'Starting claims adjudication test for Medicare Part A' },
      { timestamp: '2024-12-10T08:15:10Z', level: 'info', message: 'Claim submitted with tracking number CLM-2024-98765' },
      { timestamp: '2024-12-10T08:15:25Z', level: 'info', message: 'Claim entered adjudication queue successfully' },
      { timestamp: '2024-12-10T08:15:38Z', level: 'info', message: 'Adjudication completed with approved status' },
      { timestamp: '2024-12-10T08:15:42Z', level: 'info', message: 'All assertions passed. Test completed successfully.' },
    ],
    evidence: [
      { type: 'log', name: 'adjudication-trace.log', url: '/evidence/exec_001/adjudication-trace.log', capturedAt: '2024-12-10T08:15:42Z' },
      { type: 'report', name: 'claims-test-report.html', url: '/evidence/exec_001/claims-test-report.html', capturedAt: '2024-12-10T08:15:42Z' },
    ],
    aiAnalysis: {
      summary: 'Medicare Part A claim adjudication test passed successfully. All steps completed within expected SLA timeframes.',
      rootCause: '',
      recommendation: 'No action required. Consider adding edge case tests for claims with multiple line items.',
      confidence: 98,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_002',
    testCaseId: 'tc_002',
    suiteName: 'Claims Performance Tests',
    status: 'passed',
    environment: 'Performance',
    startTime: '2024-12-08T22:00:00Z',
    endTime: '2024-12-08T22:28:15Z',
    duration: 1695,
    executedBy: 'Marcus Thompson',
    logs: [
      { timestamp: '2024-12-08T22:00:00Z', level: 'info', message: 'Batch performance test initiated with 10,000 claims' },
      { timestamp: '2024-12-08T22:05:00Z', level: 'info', message: '2,500 claims processed (25% complete)' },
      { timestamp: '2024-12-08T22:10:00Z', level: 'info', message: '5,000 claims processed (50% complete)' },
      { timestamp: '2024-12-08T22:18:00Z', level: 'info', message: '7,500 claims processed (75% complete)' },
      { timestamp: '2024-12-08T22:27:00Z', level: 'info', message: '10,000 claims processed (100% complete)' },
      { timestamp: '2024-12-08T22:28:15Z', level: 'info', message: 'Batch completed in 28m 15s. SLA target: 30m. PASS' },
    ],
    evidence: [
      { type: 'report', name: 'batch-performance-report.html', url: '/evidence/exec_002/batch-performance-report.html', capturedAt: '2024-12-08T22:28:15Z' },
      { type: 'log', name: 'throughput-metrics.csv', url: '/evidence/exec_002/throughput-metrics.csv', capturedAt: '2024-12-08T22:28:15Z' },
    ],
    aiAnalysis: {
      summary: 'Batch processing of 10,000 claims completed in 28 minutes 15 seconds, within the 30-minute SLA. Throughput averaged 354 claims per minute.',
      rootCause: '',
      recommendation: 'Performance is within SLA but trending close to the threshold. Consider optimizing database queries for the adjudication step to improve margin.',
      confidence: 95,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_003',
    testCaseId: 'tc_003',
    suiteName: 'Member Portal Smoke Tests',
    status: 'passed',
    environment: 'Staging',
    startTime: '2024-12-12T06:00:00Z',
    endTime: '2024-12-12T06:00:18Z',
    duration: 18,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-12-12T06:00:00Z', level: 'info', message: 'Navigating to member portal login page' },
      { timestamp: '2024-12-12T06:00:05Z', level: 'info', message: 'Login page loaded successfully' },
      { timestamp: '2024-12-12T06:00:08Z', level: 'info', message: 'Entering valid member credentials' },
      { timestamp: '2024-12-12T06:00:12Z', level: 'info', message: 'Authentication successful, redirecting to dashboard' },
      { timestamp: '2024-12-12T06:00:18Z', level: 'info', message: 'Member dashboard loaded with personalized content. Test passed.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'login-page.png', url: '/evidence/exec_003/login-page.png', capturedAt: '2024-12-12T06:00:05Z' },
      { type: 'screenshot', name: 'dashboard-loaded.png', url: '/evidence/exec_003/dashboard-loaded.png', capturedAt: '2024-12-12T06:00:18Z' },
    ],
    aiAnalysis: {
      summary: 'Member portal login smoke test passed. Authentication flow completed in 12 seconds with successful dashboard redirect.',
      rootCause: '',
      recommendation: 'No action required. Login flow is performing within expected parameters.',
      confidence: 99,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_004',
    testCaseId: 'tc_005',
    suiteName: 'Member Portal Accessibility Tests',
    status: 'failed',
    environment: 'Staging',
    startTime: '2024-12-11T14:30:00Z',
    endTime: '2024-12-11T14:35:22Z',
    duration: 322,
    executedBy: 'Omar Hassan',
    logs: [
      { timestamp: '2024-12-11T14:30:00Z', level: 'info', message: 'Starting screen reader compatibility test for claims history' },
      { timestamp: '2024-12-11T14:31:00Z', level: 'info', message: 'Page title and navigation landmarks announced correctly' },
      { timestamp: '2024-12-11T14:32:15Z', level: 'warn', message: 'Table headers not properly associated with data cells in claims table' },
      { timestamp: '2024-12-11T14:33:30Z', level: 'error', message: 'FAIL: Expanded claim detail content not announced to screen reader' },
      { timestamp: '2024-12-11T14:34:45Z', level: 'error', message: 'FAIL: Status badges rely on color alone without text alternatives' },
      { timestamp: '2024-12-11T14:35:22Z', level: 'info', message: 'Test completed with 2 failures' },
    ],
    evidence: [
      { type: 'screenshot', name: 'claims-table-a11y-issue.png', url: '/evidence/exec_004/claims-table-a11y-issue.png', capturedAt: '2024-12-11T14:32:15Z' },
      { type: 'report', name: 'axe-accessibility-report.html', url: '/evidence/exec_004/axe-accessibility-report.html', capturedAt: '2024-12-11T14:35:22Z' },
      { type: 'video', name: 'screen-reader-walkthrough.mp4', url: '/evidence/exec_004/screen-reader-walkthrough.mp4', capturedAt: '2024-12-11T14:35:22Z' },
    ],
    aiAnalysis: {
      summary: 'Screen reader compatibility test failed with 2 critical accessibility issues: missing ARIA attributes on expandable claim details and status badges lacking text alternatives.',
      rootCause: 'The claims history table uses custom expansion components that do not include aria-expanded attributes. Status badges use CSS background colors without visually hidden text labels.',
      recommendation: 'Add aria-expanded and aria-controls attributes to claim detail toggle buttons. Add sr-only text labels to all status badge components. Estimated fix effort: 3-5 hours.',
      confidence: 92,
      relatedDefects: ['DEF-2024-0891'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0891',
        title: 'Claims history status badges lack accessible text alternatives',
        severity: 'high',
        status: 'open',
        assignee: 'Omar Hassan',
      },
    ],
  },
  {
    id: 'exec_005',
    testCaseId: 'tc_007',
    suiteName: 'Auth Service E2E Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-05T10:00:00Z',
    endTime: '2024-12-05T10:02:35Z',
    duration: 155,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-12-05T10:00:00Z', level: 'info', message: 'Starting MFA enrollment flow test' },
      { timestamp: '2024-12-05T10:00:30Z', level: 'info', message: 'User logged in without MFA, enrollment prompt displayed' },
      { timestamp: '2024-12-05T10:01:15Z', level: 'info', message: 'Authenticator app selected, QR code displayed' },
      { timestamp: '2024-12-05T10:01:55Z', level: 'info', message: 'TOTP code validated successfully' },
      { timestamp: '2024-12-05T10:02:35Z', level: 'info', message: 'MFA enrollment complete. Session established with MFA flag. Test passed.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'mfa-enrollment-prompt.png', url: '/evidence/exec_005/mfa-enrollment-prompt.png', capturedAt: '2024-12-05T10:00:30Z' },
      { type: 'screenshot', name: 'mfa-qr-code.png', url: '/evidence/exec_005/mfa-qr-code.png', capturedAt: '2024-12-05T10:01:15Z' },
      { type: 'log', name: 'auth-service-trace.log', url: '/evidence/exec_005/auth-service-trace.log', capturedAt: '2024-12-05T10:02:35Z' },
    ],
    aiAnalysis: {
      summary: 'MFA enrollment E2E test passed. Complete flow from login to MFA enrollment completed in 2 minutes 35 seconds.',
      rootCause: '',
      recommendation: 'No action required. Consider adding negative test cases for invalid TOTP codes and expired QR codes.',
      confidence: 97,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_006',
    testCaseId: 'tc_011',
    suiteName: 'Data Warehouse Performance Tests',
    status: 'failed',
    environment: 'Performance',
    startTime: '2024-12-05T20:00:00Z',
    endTime: '2024-12-05T20:02:18Z',
    duration: 138,
    executedBy: 'Marcus Thompson',
    logs: [
      { timestamp: '2024-12-05T20:00:00Z', level: 'info', message: 'Starting HEDIS measure aggregation query for 1M members' },
      { timestamp: '2024-12-05T20:00:30Z', level: 'info', message: 'Query execution started on Snowflake warehouse XL' },
      { timestamp: '2024-12-05T20:01:30Z', level: 'warn', message: 'Query execution time exceeded 60-second threshold at 90 seconds' },
      { timestamp: '2024-12-05T20:02:10Z', level: 'error', message: 'FAIL: Query completed in 130 seconds, exceeding 60-second SLA' },
      { timestamp: '2024-12-05T20:02:18Z', level: 'info', message: 'Result accuracy verified: within 0.01% tolerance. Performance SLA failed.' },
    ],
    evidence: [
      { type: 'report', name: 'query-performance-profile.html', url: '/evidence/exec_006/query-performance-profile.html', capturedAt: '2024-12-05T20:02:18Z' },
      { type: 'log', name: 'snowflake-query-plan.json', url: '/evidence/exec_006/snowflake-query-plan.json', capturedAt: '2024-12-05T20:02:18Z' },
    ],
    aiAnalysis: {
      summary: 'HEDIS measure aggregation query exceeded the 60-second SLA by completing in 130 seconds. Results were accurate but performance is degraded.',
      rootCause: 'Query plan analysis shows a full table scan on the member_clinical_data table due to missing clustering keys on the measure_year and member_id columns. The join between clinical data and value sets is not optimized.',
      recommendation: 'Add clustering keys on measure_year and member_id columns. Consider materializing intermediate aggregation results. Estimated improvement: 40-60% reduction in query time.',
      confidence: 88,
      relatedDefects: ['DEF-2024-0845'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0845',
        title: 'HEDIS aggregation query exceeds 60-second SLA for 1M member population',
        severity: 'medium',
        status: 'in_progress',
        assignee: 'Samantha Clark',
      },
    ],
  },
  {
    id: 'exec_007',
    testCaseId: 'tc_013',
    suiteName: 'Medicare Enrollment Functional Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-11T09:00:00Z',
    endTime: '2024-12-11T09:03:45Z',
    duration: 225,
    executedBy: 'Lisa Johnson',
    logs: [
      { timestamp: '2024-12-11T09:00:00Z', level: 'info', message: 'Submitting new Medicare Advantage enrollment for AEP 2025' },
      { timestamp: '2024-12-11T09:00:45Z', level: 'info', message: 'Enrollment accepted with AEP election type and tracking ID ENR-2025-44321' },
      { timestamp: '2024-12-11T09:01:30Z', level: 'info', message: 'Eligibility checks passed for selected plan' },
      { timestamp: '2024-12-11T09:02:30Z', level: 'info', message: 'CMS transaction format validated successfully' },
      { timestamp: '2024-12-11T09:03:45Z', level: 'info', message: 'Effective date confirmed as 2025-01-01. All assertions passed.' },
    ],
    evidence: [
      { type: 'log', name: 'enrollment-transaction.xml', url: '/evidence/exec_007/enrollment-transaction.xml', capturedAt: '2024-12-11T09:03:45Z' },
      { type: 'report', name: 'aep-enrollment-test-report.html', url: '/evidence/exec_007/aep-enrollment-test-report.html', capturedAt: '2024-12-11T09:03:45Z' },
    ],
    aiAnalysis: {
      summary: 'AEP 2025 enrollment test passed. New member enrollment processed correctly with proper eligibility validation, CMS-compliant transaction, and correct January 1 effective date.',
      rootCause: '',
      recommendation: 'No action required. Test coverage for AEP scenarios is comprehensive.',
      confidence: 96,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_008',
    testCaseId: 'tc_016',
    suiteName: 'HEDIS Engine Functional Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-12-04T11:00:00Z',
    endTime: '2024-12-04T11:08:32Z',
    duration: 512,
    executedBy: 'Lisa Johnson',
    logs: [
      { timestamp: '2024-12-04T11:00:00Z', level: 'info', message: 'Loading clinical data for BCS eligible population' },
      { timestamp: '2024-12-04T11:02:00Z', level: 'info', message: 'Eligible population identified: 45,230 members' },
      { timestamp: '2024-12-04T11:03:30Z', level: 'info', message: 'Applying BCS exclusion criteria' },
      { timestamp: '2024-12-04T11:05:00Z', level: 'warn', message: 'Bilateral mastectomy exclusion logic not matching expected count. Expected: 1,245, Actual: 1,102' },
      { timestamp: '2024-12-04T11:06:30Z', level: 'info', message: 'Numerator compliance evaluation completed' },
      { timestamp: '2024-12-04T11:08:00Z', level: 'error', message: 'FAIL: BCS measure rate 72.3% does not match expected 74.1% (tolerance: 0.1%)' },
      { timestamp: '2024-12-04T11:08:32Z', level: 'info', message: 'Test completed with 1 failure. Exclusion logic discrepancy identified.' },
    ],
    evidence: [
      { type: 'report', name: 'bcs-measure-calculation-report.html', url: '/evidence/exec_008/bcs-measure-calculation-report.html', capturedAt: '2024-12-04T11:08:32Z' },
      { type: 'log', name: 'exclusion-analysis.csv', url: '/evidence/exec_008/exclusion-analysis.csv', capturedAt: '2024-12-04T11:08:32Z' },
      { type: 'log', name: 'bcs-debug-trace.log', url: '/evidence/exec_008/bcs-debug-trace.log', capturedAt: '2024-12-04T11:08:32Z' },
    ],
    aiAnalysis: {
      summary: 'BCS measure calculation failed due to incorrect bilateral mastectomy exclusion logic. 143 members who should have been excluded were incorrectly included in the denominator.',
      rootCause: 'The bilateral mastectomy exclusion rule is not correctly handling cases where the procedure was documented using ICD-10-PCS codes in addition to CPT codes. The current logic only checks CPT codes 19303 and 19304.',
      recommendation: 'Update the BCS exclusion rule to include ICD-10-PCS codes 0HTV0ZZ and 0HTU0ZZ for bilateral mastectomy. Add value set VS-BCS-EXCLUSION-2024 to the rule configuration. Estimated fix: 4-6 hours.',
      confidence: 91,
      relatedDefects: ['DEF-2024-0872', 'DEF-2024-0873'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0872',
        title: 'BCS measure exclusion logic missing ICD-10-PCS codes for bilateral mastectomy',
        severity: 'critical',
        status: 'in_progress',
        assignee: 'Lisa Johnson',
      },
      {
        id: 'DEF-2024-0873',
        title: 'BCS measure rate deviation of 1.8% from expected value',
        severity: 'high',
        status: 'open',
        assignee: 'Lisa Johnson',
      },
    ],
  },
  {
    id: 'exec_009',
    testCaseId: 'tc_018',
    suiteName: 'HEDIS Engine Performance Tests',
    status: 'failed',
    environment: 'Performance',
    startTime: '2024-12-02T21:00:00Z',
    endTime: '2024-12-03T01:45:00Z',
    duration: 17100,
    executedBy: 'Marcus Thompson',
    logs: [
      { timestamp: '2024-12-02T21:00:00Z', level: 'info', message: 'Loading full member population data (523,450 members)' },
      { timestamp: '2024-12-02T21:15:00Z', level: 'info', message: 'Data load complete. Starting measure calculations for all HEDIS measures.' },
      { timestamp: '2024-12-02T22:00:00Z', level: 'info', message: '25% of measures calculated (12 of 48)' },
      { timestamp: '2024-12-02T23:00:00Z', level: 'info', message: '50% of measures calculated (24 of 48)' },
      { timestamp: '2024-12-03T00:15:00Z', level: 'warn', message: '75% of measures calculated. Elapsed time: 3h 15m. Projected completion: 4h 30m (exceeds 4h SLA)' },
      { timestamp: '2024-12-03T01:30:00Z', level: 'info', message: '100% of measures calculated' },
      { timestamp: '2024-12-03T01:45:00Z', level: 'error', message: 'FAIL: Total processing time 4h 45m exceeds 4h SLA by 45 minutes' },
    ],
    evidence: [
      { type: 'report', name: 'hedis-performance-report.html', url: '/evidence/exec_009/hedis-performance-report.html', capturedAt: '2024-12-03T01:45:00Z' },
      { type: 'log', name: 'resource-utilization.csv', url: '/evidence/exec_009/resource-utilization.csv', capturedAt: '2024-12-03T01:45:00Z' },
      { type: 'log', name: 'measure-timing-breakdown.csv', url: '/evidence/exec_009/measure-timing-breakdown.csv', capturedAt: '2024-12-03T01:45:00Z' },
    ],
    aiAnalysis: {
      summary: 'HEDIS engine full population performance test failed. Processing took 4 hours 45 minutes, exceeding the 4-hour SLA by 45 minutes. CDC and CBP measures were the primary bottlenecks.',
      rootCause: 'CDC and CBP measures account for 40% of total processing time due to complex sub-measure calculations and large value set lookups. Memory pressure was observed during concurrent measure execution causing garbage collection pauses.',
      recommendation: 'Implement parallel processing for independent sub-measures within CDC and CBP. Pre-cache value set lookups in memory. Increase JVM heap allocation from 8GB to 12GB. Estimated improvement: 30-40% reduction.',
      confidence: 85,
      relatedDefects: ['DEF-2024-0860'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0860',
        title: 'HEDIS engine exceeds 4-hour SLA for full population measure calculation',
        severity: 'high',
        status: 'in_progress',
        assignee: 'Marcus Thompson',
      },
    ],
  },
  {
    id: 'exec_010',
    testCaseId: 'tc_021',
    suiteName: 'Medicaid Eligibility Functional Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-12-01T13:00:00Z',
    endTime: '2024-12-01T13:06:15Z',
    duration: 375,
    executedBy: 'Robert Kim',
    logs: [
      { timestamp: '2024-12-01T13:00:00Z', level: 'info', message: 'Submitting new Medicaid application with income and household data' },
      { timestamp: '2024-12-01T13:01:00Z', level: 'info', message: 'Application accepted and queued for eligibility determination' },
      { timestamp: '2024-12-01T13:02:30Z', level: 'info', message: 'Income-based eligibility rules applied' },
      { timestamp: '2024-12-01T13:03:45Z', level: 'warn', message: 'Income evaluation returned unexpected category for household of 4 at 135% FPL' },
      { timestamp: '2024-12-01T13:05:00Z', level: 'error', message: 'FAIL: Applicant incorrectly determined as ineligible. Expected: eligible for Medicaid expansion category' },
      { timestamp: '2024-12-01T13:06:15Z', level: 'info', message: 'Test completed with 1 failure. Income threshold logic error detected.' },
    ],
    evidence: [
      { type: 'log', name: 'eligibility-determination-trace.log', url: '/evidence/exec_010/eligibility-determination-trace.log', capturedAt: '2024-12-01T13:06:15Z' },
      { type: 'report', name: 'eligibility-test-report.html', url: '/evidence/exec_010/eligibility-test-report.html', capturedAt: '2024-12-01T13:06:15Z' },
    ],
    aiAnalysis: {
      summary: 'Medicaid eligibility determination test failed. Applicant at 135% FPL with household of 4 was incorrectly determined as ineligible for Medicaid expansion.',
      rootCause: 'The income threshold comparison uses a strict less-than operator instead of less-than-or-equal-to for the 138% FPL cutoff. Applicants at exactly 135% FPL are being evaluated against the wrong eligibility category due to a rounding issue in the FPL calculation.',
      recommendation: 'Update the income comparison logic to use less-than-or-equal-to for FPL threshold checks. Review all state-specific FPL threshold configurations for similar issues. Estimated fix: 2-3 hours.',
      confidence: 93,
      relatedDefects: ['DEF-2024-0882'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0882',
        title: 'Medicaid eligibility income threshold uses incorrect comparison operator',
        severity: 'critical',
        status: 'in_progress',
        assignee: 'Robert Kim',
      },
    ],
  },
  {
    id: 'exec_011',
    testCaseId: 'tc_023',
    suiteName: 'State Reporting Functional Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-11-28T10:00:00Z',
    endTime: '2024-11-28T10:12:45Z',
    duration: 765,
    executedBy: 'Patricia Evans',
    logs: [
      { timestamp: '2024-11-28T10:00:00Z', level: 'info', message: 'Triggering quarterly report generation for all contracted states' },
      { timestamp: '2024-11-28T10:03:00Z', level: 'info', message: 'Report generation started for State A, State B, State C' },
      { timestamp: '2024-11-28T10:06:00Z', level: 'warn', message: 'State B report data accuracy check: 3 fields exceed 0.1% error tolerance' },
      { timestamp: '2024-11-28T10:09:00Z', level: 'error', message: 'FAIL: State B enrollment count discrepancy: reported 45,230 vs source 45,412 (0.4% error)' },
      { timestamp: '2024-11-28T10:11:00Z', level: 'info', message: 'State A and State C reports passed validation' },
      { timestamp: '2024-11-28T10:12:45Z', level: 'info', message: 'Test completed with 1 failure for State B report accuracy' },
    ],
    evidence: [
      { type: 'report', name: 'state-b-accuracy-report.html', url: '/evidence/exec_011/state-b-accuracy-report.html', capturedAt: '2024-11-28T10:12:45Z' },
      { type: 'log', name: 'data-reconciliation-details.csv', url: '/evidence/exec_011/data-reconciliation-details.csv', capturedAt: '2024-11-28T10:12:45Z' },
    ],
    aiAnalysis: {
      summary: 'State regulatory report generation partially failed. State B quarterly report has a 0.4% enrollment count discrepancy exceeding the 0.1% tolerance. States A and C passed.',
      rootCause: 'State B enrollment data extraction query does not account for members with retroactive eligibility changes processed after the reporting period cutoff date. 182 members with retroactive changes are missing from the report.',
      recommendation: 'Update the State B data extraction query to include retroactive eligibility changes with effective dates within the reporting period regardless of processing date. Add a reconciliation step to compare report totals against source system counts.',
      confidence: 89,
      relatedDefects: ['DEF-2024-0855'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0855',
        title: 'State B quarterly report missing retroactive eligibility changes',
        severity: 'high',
        status: 'open',
        assignee: 'Samantha Clark',
      },
    ],
  },
  {
    id: 'exec_012',
    testCaseId: 'tc_025',
    suiteName: 'Care Management Functional Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-06T09:30:00Z',
    endTime: '2024-12-06T09:34:20Z',
    duration: 260,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-12-06T09:30:00Z', level: 'info', message: 'Configuring automated outreach rules for high-priority care gaps' },
      { timestamp: '2024-12-06T09:31:00Z', level: 'info', message: 'Outreach rules saved and activated' },
      { timestamp: '2024-12-06T09:32:00Z', level: 'info', message: 'Outreach scheduling engine triggered. 245 members identified with qualifying care gaps.' },
      { timestamp: '2024-12-06T09:33:00Z', level: 'info', message: 'Outreach appointments created based on member preferences and coordinator availability' },
      { timestamp: '2024-12-06T09:34:20Z', level: 'info', message: 'Outreach records logged with attempt details and outcome fields. Test passed.' },
    ],
    evidence: [
      { type: 'report', name: 'outreach-scheduling-report.html', url: '/evidence/exec_012/outreach-scheduling-report.html', capturedAt: '2024-12-06T09:34:20Z' },
    ],
    aiAnalysis: {
      summary: 'Automated outreach scheduling test passed. 245 members identified and outreach appointments created with proper preference handling and logging.',
      rootCause: '',
      recommendation: 'No action required. Consider adding tests for edge cases where member preferences conflict with coordinator availability.',
      confidence: 94,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_013',
    testCaseId: 'tc_026',
    suiteName: 'Care Management Regression Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-12-05T15:00:00Z',
    endTime: '2024-12-05T15:04:50Z',
    duration: 290,
    executedBy: 'Angela Martinez',
    logs: [
      { timestamp: '2024-12-05T15:00:00Z', level: 'info', message: 'Creating new outreach attempt for member MBR-2024-55678' },
      { timestamp: '2024-12-05T15:01:00Z', level: 'info', message: 'Outreach record created with required fields' },
      { timestamp: '2024-12-05T15:02:00Z', level: 'info', message: 'Recording outreach outcome and follow-up actions' },
      { timestamp: '2024-12-05T15:03:00Z', level: 'error', message: 'FAIL: Follow-up action field is null despite being a required field per governance rules' },
      { timestamp: '2024-12-05T15:04:00Z', level: 'warn', message: 'Outreach compliance report shows 87% field completion instead of required 100%' },
      { timestamp: '2024-12-05T15:04:50Z', level: 'info', message: 'Test completed with 1 failure. Required field validation missing.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'outreach-form-missing-fields.png', url: '/evidence/exec_013/outreach-form-missing-fields.png', capturedAt: '2024-12-05T15:03:00Z' },
      { type: 'report', name: 'outreach-compliance-report.html', url: '/evidence/exec_013/outreach-compliance-report.html', capturedAt: '2024-12-05T15:04:50Z' },
    ],
    aiAnalysis: {
      summary: 'Member outreach tracking compliance test failed. Follow-up action field is not enforced as required, resulting in 87% field completion rate instead of the mandated 100%.',
      rootCause: 'The outreach form submission handler does not validate the follow-up action field as required when the outreach outcome is "no_answer" or "voicemail". The validation rule only enforces required fields for "contacted" outcomes.',
      recommendation: 'Update the outreach form validation to require follow-up action for all outcome types. Add server-side validation as a secondary check. Estimated fix: 1-2 hours.',
      confidence: 95,
      relatedDefects: ['DEF-2024-0888'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0888',
        title: 'Outreach form does not require follow-up action for non-contact outcomes',
        severity: 'high',
        status: 'in_progress',
        assignee: 'James Wright',
      },
    ],
  },
  {
    id: 'exec_014',
    testCaseId: 'tc_034',
    suiteName: 'API Gateway Performance Tests',
    status: 'failed',
    environment: 'Performance',
    startTime: '2024-11-25T18:00:00Z',
    endTime: '2024-11-25T18:05:30Z',
    duration: 330,
    executedBy: 'Marcus Thompson',
    logs: [
      { timestamp: '2024-11-25T18:00:00Z', level: 'info', message: 'Configuring rate limit to 1000 requests per minute for partner PRTNR-001' },
      { timestamp: '2024-11-25T18:00:30Z', level: 'info', message: 'Rate limit configuration applied' },
      { timestamp: '2024-11-25T18:01:00Z', level: 'info', message: 'Sending 1500 requests within 60-second window' },
      { timestamp: '2024-11-25T18:02:00Z', level: 'warn', message: 'Rate limit enforcement inconsistent: 1,087 requests succeeded instead of expected 1,000' },
      { timestamp: '2024-11-25T18:03:00Z', level: 'error', message: 'FAIL: X-RateLimit-Remaining header shows incorrect count after limit exceeded' },
      { timestamp: '2024-11-25T18:04:30Z', level: 'warn', message: 'Gateway response time degraded to 2.3s under sustained load (target: <500ms)' },
      { timestamp: '2024-11-25T18:05:30Z', level: 'info', message: 'Test completed with 2 failures: rate limit accuracy and response time degradation' },
    ],
    evidence: [
      { type: 'report', name: 'rate-limit-test-report.html', url: '/evidence/exec_014/rate-limit-test-report.html', capturedAt: '2024-11-25T18:05:30Z' },
      { type: 'log', name: 'load-test-results.csv', url: '/evidence/exec_014/load-test-results.csv', capturedAt: '2024-11-25T18:05:30Z' },
      { type: 'har', name: 'api-gateway-traffic.har', url: '/evidence/exec_014/api-gateway-traffic.har', capturedAt: '2024-11-25T18:05:30Z' },
    ],
    aiAnalysis: {
      summary: 'API gateway rate limiting test failed with two issues: rate limit enforcement allowed 87 excess requests, and response times degraded to 2.3 seconds under sustained load.',
      rootCause: 'The rate limiter uses a sliding window algorithm with a 5-second granularity, causing up to 8.7% over-admission at window boundaries. Response time degradation is caused by synchronous rate limit counter updates blocking request processing threads.',
      recommendation: 'Switch to a token bucket algorithm with per-second granularity for more accurate rate limiting. Move rate limit counter updates to an async pipeline using Redis INCR. Estimated fix: 8-12 hours.',
      confidence: 87,
      relatedDefects: ['DEF-2024-0835', 'DEF-2024-0836'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0835',
        title: 'API gateway rate limiter allows excess requests at window boundaries',
        severity: 'high',
        status: 'open',
        assignee: 'Alex Rivera',
      },
      {
        id: 'DEF-2024-0836',
        title: 'API gateway response time degrades under sustained high load',
        severity: 'critical',
        status: 'in_progress',
        assignee: 'Marcus Thompson',
      },
    ],
  },
  {
    id: 'exec_015',
    testCaseId: 'tc_035',
    suiteName: 'API Gateway Security Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-11-24T14:00:00Z',
    endTime: '2024-11-24T14:04:12Z',
    duration: 252,
    executedBy: 'Natalie White',
    logs: [
      { timestamp: '2024-11-24T14:00:00Z', level: 'info', message: 'Testing OAuth 2.0 token validation on API gateway' },
      { timestamp: '2024-11-24T14:00:30Z', level: 'info', message: 'Valid bearer token: request processed successfully (200 OK)' },
      { timestamp: '2024-11-24T14:01:15Z', level: 'info', message: 'Expired token: correctly rejected with 401 Unauthorized' },
      { timestamp: '2024-11-24T14:02:00Z', level: 'error', message: 'FAIL: Token with insufficient scopes returned 200 OK instead of 403 Forbidden' },
      { timestamp: '2024-11-24T14:03:00Z', level: 'info', message: 'Malformed token: correctly rejected with 401 Unauthorized' },
      { timestamp: '2024-11-24T14:04:12Z', level: 'info', message: 'Test completed with 1 failure: scope enforcement not working' },
    ],
    evidence: [
      { type: 'log', name: 'oauth-validation-trace.log', url: '/evidence/exec_015/oauth-validation-trace.log', capturedAt: '2024-11-24T14:04:12Z' },
      { type: 'report', name: 'security-test-report.html', url: '/evidence/exec_015/security-test-report.html', capturedAt: '2024-11-24T14:04:12Z' },
    ],
    aiAnalysis: {
      summary: 'OAuth 2.0 token validation test failed. The API gateway does not enforce scope-based access control, allowing tokens with insufficient scopes to access protected resources.',
      rootCause: 'The Kong gateway OAuth plugin is configured to validate token signatures and expiration but the scope enforcement middleware is disabled in the current configuration. The scope_required parameter is set to false in the plugin configuration.',
      recommendation: 'Enable scope enforcement in the Kong OAuth plugin by setting scope_required to true. Define required scopes for each API endpoint in the route configuration. Conduct a full security review of all partner API endpoints.',
      confidence: 94,
      relatedDefects: ['DEF-2024-0830'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0830',
        title: 'API gateway OAuth scope enforcement disabled in production configuration',
        severity: 'critical',
        status: 'in_progress',
        assignee: 'Natalie White',
      },
    ],
  },
  {
    id: 'exec_016',
    testCaseId: 'tc_036',
    suiteName: 'Vendor Integration Security Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-11-18T11:00:00Z',
    endTime: '2024-11-18T11:06:40Z',
    duration: 400,
    executedBy: 'Natalie White',
    logs: [
      { timestamp: '2024-11-18T11:00:00Z', level: 'info', message: 'Testing encrypted data channel enforcement for vendor connections' },
      { timestamp: '2024-11-18T11:01:00Z', level: 'info', message: 'TLS 1.2 connection: established successfully' },
      { timestamp: '2024-11-18T11:02:00Z', level: 'error', message: 'FAIL: TLS 1.1 connection was accepted instead of being rejected' },
      { timestamp: '2024-11-18T11:03:30Z', level: 'info', message: 'Data in transit encryption verified via packet inspection' },
      { timestamp: '2024-11-18T11:05:00Z', level: 'error', message: 'FAIL: Data exchange proceeded for vendor VND-003 without active BAA agreement' },
      { timestamp: '2024-11-18T11:06:40Z', level: 'info', message: 'Test completed with 2 failures: TLS version enforcement and BAA validation' },
    ],
    evidence: [
      { type: 'log', name: 'tls-handshake-trace.log', url: '/evidence/exec_016/tls-handshake-trace.log', capturedAt: '2024-11-18T11:06:40Z' },
      { type: 'report', name: 'vendor-security-report.html', url: '/evidence/exec_016/vendor-security-report.html', capturedAt: '2024-11-18T11:06:40Z' },
    ],
    aiAnalysis: {
      summary: 'Vendor integration security test failed with 2 critical issues: TLS 1.1 connections are not rejected, and BAA agreement validation is not enforced before data exchange.',
      rootCause: 'The vendor integration hub TLS configuration still includes TLS 1.1 in the allowed protocols list. The BAA validation check is implemented as a warning log rather than a blocking enforcement, allowing data exchange to proceed without an active BAA.',
      recommendation: 'Remove TLS 1.1 from the allowed protocols configuration. Convert the BAA validation from a warning to a blocking check that prevents data exchange. Add automated BAA expiration monitoring with 30-day advance alerts.',
      confidence: 96,
      relatedDefects: ['DEF-2024-0820', 'DEF-2024-0821'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0820',
        title: 'Vendor integration hub accepts deprecated TLS 1.1 connections',
        severity: 'critical',
        status: 'open',
        assignee: 'Natalie White',
      },
      {
        id: 'DEF-2024-0821',
        title: 'BAA agreement validation does not block data exchange for non-compliant vendors',
        severity: 'critical',
        status: 'open',
        assignee: 'Alex Rivera',
      },
    ],
  },
  {
    id: 'exec_017',
    testCaseId: 'tc_037',
    suiteName: 'Vendor Integration Functional Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-11-17T16:00:00Z',
    endTime: '2024-11-17T16:08:25Z',
    duration: 505,
    executedBy: 'James Wright',
    logs: [
      { timestamp: '2024-11-17T16:00:00Z', level: 'info', message: 'Simulating vendor data feed failure during file transfer' },
      { timestamp: '2024-11-17T16:01:00Z', level: 'info', message: 'Error detected and logged for feed VND-FEED-PH-001' },
      { timestamp: '2024-11-17T16:02:30Z', level: 'info', message: 'Automatic retry triggered after 60-second delay' },
      { timestamp: '2024-11-17T16:04:00Z', level: 'info', message: 'Simulating persistent failure (retry 2 of 3)' },
      { timestamp: '2024-11-17T16:05:30Z', level: 'info', message: 'Simulating persistent failure (retry 3 of 3)' },
      { timestamp: '2024-11-17T16:06:30Z', level: 'warn', message: 'Max retries exceeded. Feed moved to dead letter queue.' },
      { timestamp: '2024-11-17T16:07:30Z', level: 'error', message: 'FAIL: Alert for persistent failure was not sent to operations team' },
      { timestamp: '2024-11-17T16:08:25Z', level: 'info', message: 'Test completed with 1 failure: alerting not triggered for DLQ items' },
    ],
    evidence: [
      { type: 'log', name: 'feed-retry-trace.log', url: '/evidence/exec_017/feed-retry-trace.log', capturedAt: '2024-11-17T16:08:25Z' },
      { type: 'report', name: 'error-recovery-test-report.html', url: '/evidence/exec_017/error-recovery-test-report.html', capturedAt: '2024-11-17T16:08:25Z' },
    ],
    aiAnalysis: {
      summary: 'Vendor data feed error recovery test partially passed. Retry logic and dead letter queue work correctly, but the alerting mechanism for persistent failures is not triggering.',
      rootCause: 'The dead letter queue consumer is configured to send alerts via the notification hub, but the notification hub integration endpoint URL is pointing to an incorrect environment (dev instead of QA). The alert message is being sent but to the wrong destination.',
      recommendation: 'Update the DLQ consumer notification endpoint configuration to use environment-specific URLs. Add a health check for the alerting pipeline. Estimated fix: 1-2 hours.',
      confidence: 90,
      relatedDefects: ['DEF-2024-0815'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0815',
        title: 'Vendor feed DLQ alerting sends to incorrect environment endpoint',
        severity: 'medium',
        status: 'in_progress',
        assignee: 'James Wright',
      },
    ],
  },
  {
    id: 'exec_018',
    testCaseId: 'tc_038',
    suiteName: 'External Data Feed Functional Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-11-20T09:00:00Z',
    endTime: '2024-11-20T09:05:10Z',
    duration: 310,
    executedBy: 'James Wright',
    logs: [
      { timestamp: '2024-11-20T09:00:00Z', level: 'info', message: 'Submitting CMS data file with valid format' },
      { timestamp: '2024-11-20T09:01:00Z', level: 'info', message: 'Valid file passed format validation and queued for processing' },
      { timestamp: '2024-11-20T09:02:00Z', level: 'info', message: 'Submitting CMS data file with invalid header format' },
      { timestamp: '2024-11-20T09:02:30Z', level: 'info', message: 'Invalid header file correctly rejected with format error' },
      { timestamp: '2024-11-20T09:03:00Z', level: 'info', message: 'Submitting CMS data file with missing required fields' },
      { timestamp: '2024-11-20T09:03:45Z', level: 'error', message: 'FAIL: File with missing required fields was accepted instead of rejected' },
      { timestamp: '2024-11-20T09:04:30Z', level: 'warn', message: 'Validation log incomplete: field-level checks not recorded' },
      { timestamp: '2024-11-20T09:05:10Z', level: 'info', message: 'Test completed with 1 failure: missing field validation not enforced' },
    ],
    evidence: [
      { type: 'log', name: 'file-validation-trace.log', url: '/evidence/exec_018/file-validation-trace.log', capturedAt: '2024-11-20T09:05:10Z' },
      { type: 'report', name: 'cms-format-validation-report.html', url: '/evidence/exec_018/cms-format-validation-report.html', capturedAt: '2024-11-20T09:05:10Z' },
    ],
    aiAnalysis: {
      summary: 'CMS file format validation test partially failed. Header format validation works correctly, but required field validation is not enforced for the new 2025 CMS file layout.',
      rootCause: 'The field-level validation rules for the 2025 CMS file format have not been configured in the validation engine. The validation schema still references the 2024 field requirements which have fewer mandatory fields.',
      recommendation: 'Update the validation schema to include 2025 CMS file format required fields. Add comprehensive field-level validation logging for audit trail compliance. Estimated fix: 3-4 hours.',
      confidence: 91,
      relatedDefects: ['DEF-2024-0810'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0810',
        title: 'External data feed processor missing 2025 CMS required field validation',
        severity: 'high',
        status: 'open',
        assignee: 'James Wright',
      },
    ],
  },
  {
    id: 'exec_019',
    testCaseId: 'tc_040',
    suiteName: 'Audit Tracker Security Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-07T10:00:00Z',
    endTime: '2024-12-07T10:03:55Z',
    duration: 235,
    executedBy: 'Patricia Evans',
    logs: [
      { timestamp: '2024-12-07T10:00:00Z', level: 'info', message: 'Creating new audit finding record' },
      { timestamp: '2024-12-07T10:00:30Z', level: 'info', message: 'Record created with timestamp and creator identity' },
      { timestamp: '2024-12-07T10:01:15Z', level: 'info', message: 'Attempting direct modification of original record' },
      { timestamp: '2024-12-07T10:01:30Z', level: 'info', message: 'Direct modification blocked by immutability constraint' },
      { timestamp: '2024-12-07T10:02:15Z', level: 'info', message: 'Updating finding through amendment workflow' },
      { timestamp: '2024-12-07T10:02:45Z', level: 'info', message: 'Amendment recorded as new version with change history' },
      { timestamp: '2024-12-07T10:03:30Z', level: 'info', message: 'Tamper detection hash validated for record chain' },
      { timestamp: '2024-12-07T10:03:55Z', level: 'info', message: 'All assertions passed. Audit record integrity verified.' },
    ],
    evidence: [
      { type: 'log', name: 'audit-integrity-trace.log', url: '/evidence/exec_019/audit-integrity-trace.log', capturedAt: '2024-12-07T10:03:55Z' },
      { type: 'report', name: 'immutability-test-report.html', url: '/evidence/exec_019/immutability-test-report.html', capturedAt: '2024-12-07T10:03:55Z' },
    ],
    aiAnalysis: {
      summary: 'Audit record immutability test passed. Records are properly protected against direct modification with correct versioning, change history, and tamper detection.',
      rootCause: '',
      recommendation: 'No action required. Consider adding stress tests for concurrent amendment attempts on the same record.',
      confidence: 98,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_020',
    testCaseId: 'tc_042',
    suiteName: 'Regulatory Reporting Functional Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-10T08:00:00Z',
    endTime: '2024-12-10T08:06:30Z',
    duration: 390,
    executedBy: 'Lisa Johnson',
    logs: [
      { timestamp: '2024-12-10T08:00:00Z', level: 'info', message: 'Generating 2025 CMS regulatory report using new template' },
      { timestamp: '2024-12-10T08:02:00Z', level: 'info', message: 'Report generated with all required sections' },
      { timestamp: '2024-12-10T08:03:00Z', level: 'info', message: 'Running automated format compliance validation' },
      { timestamp: '2024-12-10T08:04:00Z', level: 'info', message: 'Format validation passed: all checks successful' },
      { timestamp: '2024-12-10T08:05:00Z', level: 'info', message: 'Data accuracy verified: 99.95% accuracy against source records' },
      { timestamp: '2024-12-10T08:06:00Z', level: 'info', message: 'Submission deadline tracking confirmed active' },
      { timestamp: '2024-12-10T08:06:30Z', level: 'info', message: 'All assertions passed. 2025 CMS template validated successfully.' },
    ],
    evidence: [
      { type: 'report', name: 'cms-2025-template-validation.html', url: '/evidence/exec_020/cms-2025-template-validation.html', capturedAt: '2024-12-10T08:06:30Z' },
      { type: 'log', name: 'format-compliance-checks.json', url: '/evidence/exec_020/format-compliance-checks.json', capturedAt: '2024-12-10T08:06:30Z' },
    ],
    aiAnalysis: {
      summary: 'Regulatory reporting 2025 CMS template validation passed. Report generated with correct format, 99.95% data accuracy, and active deadline tracking.',
      rootCause: '',
      recommendation: 'No action required. Template is ready for production use.',
      confidence: 97,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_021',
    testCaseId: 'tc_043',
    suiteName: 'Compliance Dashboard Performance Tests',
    status: 'passed',
    environment: 'Staging',
    startTime: '2024-12-09T11:00:00Z',
    endTime: '2024-12-09T11:14:20Z',
    duration: 860,
    executedBy: 'Marcus Thompson',
    logs: [
      { timestamp: '2024-12-09T11:00:00Z', level: 'info', message: 'Updating compliance metric in source system' },
      { timestamp: '2024-12-09T11:00:15Z', level: 'info', message: 'Source system update confirmed with timestamp' },
      { timestamp: '2024-12-09T11:05:00Z', level: 'info', message: 'Monitoring compliance dashboard for data refresh...' },
      { timestamp: '2024-12-09T11:12:30Z', level: 'info', message: 'Dashboard data refreshed. Updated metric visible.' },
      { timestamp: '2024-12-09T11:13:00Z', level: 'info', message: 'Refresh latency: 12 minutes 30 seconds (SLA: 15 minutes)' },
      { timestamp: '2024-12-09T11:14:20Z', level: 'info', message: 'Refresh timestamp verified. Test passed within SLA.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'dashboard-before-refresh.png', url: '/evidence/exec_021/dashboard-before-refresh.png', capturedAt: '2024-12-09T11:00:15Z' },
      { type: 'screenshot', name: 'dashboard-after-refresh.png', url: '/evidence/exec_021/dashboard-after-refresh.png', capturedAt: '2024-12-09T11:12:30Z' },
    ],
    aiAnalysis: {
      summary: 'Compliance dashboard data refresh test passed. Data refreshed in 12 minutes 30 seconds, within the 15-minute SLA.',
      rootCause: '',
      recommendation: 'Refresh time is within SLA but using 83% of the allowed window. Monitor for degradation as data volume increases.',
      confidence: 93,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_022',
    testCaseId: 'tc_046',
    suiteName: 'Claims Security Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-11-15T09:00:00Z',
    endTime: '2024-11-15T09:04:45Z',
    duration: 285,
    executedBy: 'Natalie White',
    logs: [
      { timestamp: '2024-11-15T09:00:00Z', level: 'info', message: 'Storing claim containing PHI data in database' },
      { timestamp: '2024-11-15T09:01:00Z', level: 'info', message: 'Claim persisted. Verifying encryption at rest.' },
      { timestamp: '2024-11-15T09:02:00Z', level: 'info', message: 'Raw database inspection confirms AES-256 encryption on PHI fields' },
      { timestamp: '2024-11-15T09:03:00Z', level: 'info', message: 'Application layer retrieval: PHI data decrypted correctly for authorized user' },
      { timestamp: '2024-11-15T09:04:00Z', level: 'info', message: 'Encryption key rotation test: data remains accessible after rotation' },
      { timestamp: '2024-11-15T09:04:45Z', level: 'info', message: 'All assertions passed. HIPAA PHI encryption verified.' },
    ],
    evidence: [
      { type: 'report', name: 'phi-encryption-test-report.html', url: '/evidence/exec_022/phi-encryption-test-report.html', capturedAt: '2024-11-15T09:04:45Z' },
      { type: 'log', name: 'encryption-verification.log', url: '/evidence/exec_022/encryption-verification.log', capturedAt: '2024-11-15T09:04:45Z' },
    ],
    aiAnalysis: {
      summary: 'HIPAA PHI encryption at rest test passed. All PHI fields are encrypted using AES-256 with proper key management and rotation support.',
      rootCause: '',
      recommendation: 'No action required. Encryption implementation meets HIPAA requirements.',
      confidence: 99,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_023',
    testCaseId: 'tc_050',
    suiteName: 'HEDIS Engine Functional Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-12-04T14:00:00Z',
    endTime: '2024-12-04T14:09:18Z',
    duration: 558,
    executedBy: 'Lisa Johnson',
    logs: [
      { timestamp: '2024-12-04T14:00:00Z', level: 'info', message: 'Loading clinical data for CDC eligible population' },
      { timestamp: '2024-12-04T14:02:00Z', level: 'info', message: 'Diabetic members aged 18-75 identified: 38,450' },
      { timestamp: '2024-12-04T14:03:30Z', level: 'info', message: 'Applying CDC exclusion criteria for each sub-measure' },
      { timestamp: '2024-12-04T14:05:00Z', level: 'warn', message: 'HbA1c control sub-measure exclusion count lower than expected' },
      { timestamp: '2024-12-04T14:06:30Z', level: 'info', message: 'Evaluating HbA1c control numerator compliance' },
      { timestamp: '2024-12-04T14:08:00Z', level: 'error', message: 'FAIL: CDC HbA1c poor control rate 28.5% does not match expected 26.2% (tolerance: 0.1%)' },
      { timestamp: '2024-12-04T14:09:18Z', level: 'info', message: 'Test completed with 1 failure. CDC HbA1c sub-measure rate deviation detected.' },
    ],
    evidence: [
      { type: 'report', name: 'cdc-measure-calculation-report.html', url: '/evidence/exec_023/cdc-measure-calculation-report.html', capturedAt: '2024-12-04T14:09:18Z' },
      { type: 'log', name: 'cdc-exclusion-analysis.csv', url: '/evidence/exec_023/cdc-exclusion-analysis.csv', capturedAt: '2024-12-04T14:09:18Z' },
    ],
    aiAnalysis: {
      summary: 'CDC measure calculation failed for the HbA1c poor control sub-measure. Rate deviation of 2.3% from expected value indicates an exclusion logic issue.',
      rootCause: 'The CDC HbA1c poor control sub-measure is not correctly applying the hospice exclusion for members enrolled in hospice during the measurement year. Additionally, the ESRD exclusion is using an outdated value set that does not include 2024 diagnosis codes.',
      recommendation: 'Update the hospice exclusion logic to check enrollment dates against the measurement year. Update the ESRD value set to include 2024 ICD-10 codes. Estimated fix: 6-8 hours.',
      confidence: 88,
      relatedDefects: ['DEF-2024-0875'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0875',
        title: 'CDC HbA1c sub-measure exclusion logic using outdated value sets',
        severity: 'critical',
        status: 'in_progress',
        assignee: 'Lisa Johnson',
      },
    ],
  },
  {
    id: 'exec_024',
    testCaseId: 'tc_028',
    suiteName: 'Group Enrollment E2E Tests',
    status: 'passed',
    environment: 'Staging',
    startTime: '2024-12-09T07:00:00Z',
    endTime: '2024-12-09T07:05:40Z',
    duration: 340,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-12-09T07:00:00Z', level: 'info', message: 'Navigating to self-service enrollment portal' },
      { timestamp: '2024-12-09T07:01:00Z', level: 'info', message: 'Portal landing page loaded with registration option' },
      { timestamp: '2024-12-09T07:02:00Z', level: 'info', message: 'Employer registration form completed and submitted' },
      { timestamp: '2024-12-09T07:03:00Z', level: 'info', message: 'Employer account created with available plan selections' },
      { timestamp: '2024-12-09T07:04:30Z', level: 'info', message: 'Employees added to roster and plans selected' },
      { timestamp: '2024-12-09T07:05:40Z', level: 'info', message: 'Employee enrollments processed and confirmed. Test passed.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'employer-registration.png', url: '/evidence/exec_024/employer-registration.png', capturedAt: '2024-12-09T07:02:00Z' },
      { type: 'screenshot', name: 'enrollment-confirmation.png', url: '/evidence/exec_024/enrollment-confirmation.png', capturedAt: '2024-12-09T07:05:40Z' },
      { type: 'report', name: 'self-service-e2e-report.html', url: '/evidence/exec_024/self-service-e2e-report.html', capturedAt: '2024-12-09T07:05:40Z' },
    ],
    aiAnalysis: {
      summary: 'Group enrollment self-service portal E2E test passed. Complete employer registration and employee enrollment flow completed in 5 minutes 40 seconds.',
      rootCause: '',
      recommendation: 'No action required. Consider adding tests for edge cases with large employee rosters (500+ employees).',
      confidence: 96,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_025',
    testCaseId: 'tc_030',
    suiteName: 'Broker Portal Functional Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-08T10:00:00Z',
    endTime: '2024-12-08T10:03:15Z',
    duration: 195,
    executedBy: 'Priya Patel',
    logs: [
      { timestamp: '2024-12-08T10:00:00Z', level: 'info', message: 'Entering group census data for 50-employee group' },
      { timestamp: '2024-12-08T10:00:30Z', level: 'info', message: 'Census data accepted and validated' },
      { timestamp: '2024-12-08T10:01:00Z', level: 'info', message: 'Requesting real-time quotes for available plan options' },
      { timestamp: '2024-12-08T10:01:04Z', level: 'info', message: 'Quotes generated in 4 seconds (target: <5 seconds)' },
      { timestamp: '2024-12-08T10:02:00Z', level: 'info', message: 'Premium calculations verified against underwriting engine output' },
      { timestamp: '2024-12-08T10:03:15Z', level: 'info', message: 'Proposal PDF generated with accurate quote details. Test passed.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'quote-results.png', url: '/evidence/exec_025/quote-results.png', capturedAt: '2024-12-08T10:01:04Z' },
      { type: 'report', name: 'quoting-accuracy-report.html', url: '/evidence/exec_025/quoting-accuracy-report.html', capturedAt: '2024-12-08T10:03:15Z' },
    ],
    aiAnalysis: {
      summary: 'Broker portal real-time quoting test passed. Quotes generated in 4 seconds with premium calculations matching underwriting engine output exactly.',
      rootCause: '',
      recommendation: 'No action required. Quoting engine performance is excellent.',
      confidence: 98,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_026',
    testCaseId: 'tc_022',
    suiteName: 'Medicaid Eligibility Regression Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-11-30T20:00:00Z',
    endTime: '2024-11-30T20:12:45Z',
    duration: 765,
    executedBy: 'Robert Kim',
    logs: [
      { timestamp: '2024-11-30T20:00:00Z', level: 'info', message: 'Triggering batch redetermination for members with upcoming renewal dates' },
      { timestamp: '2024-11-30T20:02:00Z', level: 'info', message: 'Batch job identified 12,450 members due for redetermination' },
      { timestamp: '2024-11-30T20:05:00Z', level: 'info', message: 'Processing redetermination for each member' },
      { timestamp: '2024-11-30T20:08:00Z', level: 'warn', message: '23 records failed during batch processing with null pointer exception' },
      { timestamp: '2024-11-30T20:10:00Z', level: 'error', message: 'FAIL: Batch processing completed with 23 failures out of 12,450 records' },
      { timestamp: '2024-11-30T20:12:45Z', level: 'info', message: 'Test completed with 1 failure. Batch processing errors detected.' },
    ],
    evidence: [
      { type: 'log', name: 'batch-redetermination-errors.log', url: '/evidence/exec_026/batch-redetermination-errors.log', capturedAt: '2024-11-30T20:12:45Z' },
      { type: 'report', name: 'redetermination-batch-report.html', url: '/evidence/exec_026/redetermination-batch-report.html', capturedAt: '2024-11-30T20:12:45Z' },
    ],
    aiAnalysis: {
      summary: 'Medicaid eligibility redetermination batch test failed. 23 out of 12,450 records failed with null pointer exceptions during processing.',
      rootCause: 'The batch processor encounters a null pointer exception when processing members whose income data was updated to null during the Medicaid unwinding process. The income field is not null-checked before the FPL calculation step.',
      recommendation: 'Add null checks for income data before FPL calculation. Members with null income should be flagged for manual review rather than causing batch failures. Estimated fix: 2-3 hours.',
      confidence: 92,
      relatedDefects: ['DEF-2024-0885'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0885',
        title: 'Medicaid redetermination batch fails on members with null income data',
        severity: 'high',
        status: 'in_progress',
        assignee: 'Robert Kim',
      },
    ],
  },
  {
    id: 'exec_027',
    testCaseId: 'tc_033',
    suiteName: 'Wellness Platform Functional Tests',
    status: 'passed',
    environment: 'Staging',
    startTime: '2024-12-11T12:00:00Z',
    endTime: '2024-12-11T12:02:30Z',
    duration: 150,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-12-11T12:00:00Z', level: 'info', message: 'Completing wellness activity qualifying for badge' },
      { timestamp: '2024-12-11T12:00:30Z', level: 'info', message: 'Activity completion recorded' },
      { timestamp: '2024-12-11T12:01:00Z', level: 'info', message: 'Badge awarded based on achievement criteria' },
      { timestamp: '2024-12-11T12:01:30Z', level: 'info', message: 'Reward points credited: 50 points' },
      { timestamp: '2024-12-11T12:02:00Z', level: 'info', message: 'In-app notification sent to member' },
      { timestamp: '2024-12-11T12:02:30Z', level: 'info', message: 'All assertions passed. Gamification badge flow verified.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'badge-awarded.png', url: '/evidence/exec_027/badge-awarded.png', capturedAt: '2024-12-11T12:01:00Z' },
      { type: 'screenshot', name: 'points-credited.png', url: '/evidence/exec_027/points-credited.png', capturedAt: '2024-12-11T12:01:30Z' },
    ],
    aiAnalysis: {
      summary: 'Wellness platform gamification badge test passed. Badge awarded correctly with proper point crediting and member notification.',
      rootCause: '',
      recommendation: 'No action required. Consider adding tests for badge revocation scenarios.',
      confidence: 97,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_028',
    testCaseId: 'tc_009',
    suiteName: 'Auth Service Security Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-04T16:00:00Z',
    endTime: '2024-12-04T16:03:20Z',
    duration: 200,
    executedBy: 'Natalie White',
    logs: [
      { timestamp: '2024-12-04T16:00:00Z', level: 'info', message: 'Obtaining valid access token and refresh token pair' },
      { timestamp: '2024-12-04T16:00:30Z', level: 'info', message: 'Tokens issued with correct expiration times' },
      { timestamp: '2024-12-04T16:01:00Z', level: 'info', message: 'Expired access token correctly rejected with 401' },
      { timestamp: '2024-12-04T16:01:45Z', level: 'info', message: 'Revoked refresh token correctly rejected. Associated tokens invalidated.' },
      { timestamp: '2024-12-04T16:02:30Z', level: 'info', message: 'Token replay attack detected. Entire token family revoked.' },
      { timestamp: '2024-12-04T16:03:20Z', level: 'info', message: 'All assertions passed. Token refresh vulnerability patch verified.' },
    ],
    evidence: [
      { type: 'report', name: 'token-security-test-report.html', url: '/evidence/exec_028/token-security-test-report.html', capturedAt: '2024-12-04T16:03:20Z' },
      { type: 'log', name: 'token-lifecycle-trace.log', url: '/evidence/exec_028/token-lifecycle-trace.log', capturedAt: '2024-12-04T16:03:20Z' },
    ],
    aiAnalysis: {
      summary: 'Token refresh vulnerability patch test passed. Token rotation, replay detection, and family revocation all working correctly.',
      rootCause: '',
      recommendation: 'No action required. Security patch is effective. Schedule periodic penetration testing to verify continued protection.',
      confidence: 99,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_029',
    testCaseId: 'tc_039',
    suiteName: 'External Data Feed Performance Tests',
    status: 'failed',
    environment: 'Performance',
    startTime: '2024-11-19T14:00:00Z',
    endTime: '2024-11-19T18:45:00Z',
    duration: 17100,
    executedBy: 'Marcus Thompson',
    logs: [
      { timestamp: '2024-11-19T14:00:00Z', level: 'info', message: 'Submitting standard-size data file (100MB) during business hours' },
      { timestamp: '2024-11-19T14:00:15Z', level: 'info', message: 'File accepted and processing started' },
      { timestamp: '2024-11-19T16:00:00Z', level: 'warn', message: '2 hours elapsed. Processing at 45% completion.' },
      { timestamp: '2024-11-19T18:00:00Z', level: 'warn', message: '4 hours elapsed. Processing at 85% completion. SLA breached.' },
      { timestamp: '2024-11-19T18:30:00Z', level: 'info', message: 'Processing completed at 4h 30m' },
      { timestamp: '2024-11-19T18:45:00Z', level: 'error', message: 'FAIL: Processing time 4h 30m exceeds 4-hour SLA by 30 minutes' },
    ],
    evidence: [
      { type: 'report', name: 'feed-processing-performance.html', url: '/evidence/exec_029/feed-processing-performance.html', capturedAt: '2024-11-19T18:45:00Z' },
      { type: 'log', name: 'processing-timeline.csv', url: '/evidence/exec_029/processing-timeline.csv', capturedAt: '2024-11-19T18:45:00Z' },
    ],
    aiAnalysis: {
      summary: 'External data feed processing SLA test failed. 100MB file took 4 hours 30 minutes to process, exceeding the 4-hour SLA by 30 minutes.',
      rootCause: 'File parsing is single-threaded and processes records sequentially. The validation step performs individual database lookups for each record instead of batch lookups, creating a significant I/O bottleneck.',
      recommendation: 'Implement parallel file parsing with configurable thread count. Convert individual record validation lookups to batch queries. Add priority-based queue management for concurrent file processing.',
      confidence: 86,
      relatedDefects: ['DEF-2024-0808'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0808',
        title: 'External data feed processing exceeds 4-hour SLA for standard files',
        severity: 'medium',
        status: 'open',
        assignee: 'James Wright',
      },
    ],
  },
  {
    id: 'exec_030',
    testCaseId: 'tc_054',
    suiteName: 'Vendor Integration Tests',
    status: 'blocked',
    environment: 'QA',
    startTime: '2024-11-28T09:00:00Z',
    endTime: '',
    duration: 0,
    executedBy: 'James Wright',
    logs: [
      { timestamp: '2024-11-28T09:00:00Z', level: 'info', message: 'Attempting to trigger daily reconciliation for pharmacy vendor data feed' },
      { timestamp: '2024-11-28T09:01:00Z', level: 'error', message: 'BLOCKED: Pharmacy vendor test environment (VND-PH-QA) is unavailable' },
      { timestamp: '2024-11-28T09:01:30Z', level: 'warn', message: 'Vendor reported scheduled maintenance window until 2024-11-29 06:00 UTC' },
      { timestamp: '2024-11-28T09:02:00Z', level: 'info', message: 'Test execution blocked. Rescheduling for 2024-11-29.' },
    ],
    evidence: [
      { type: 'log', name: 'vendor-connectivity-check.log', url: '/evidence/exec_030/vendor-connectivity-check.log', capturedAt: '2024-11-28T09:02:00Z' },
    ],
    aiAnalysis: {
      summary: 'Test execution blocked due to pharmacy vendor test environment unavailability. Vendor is performing scheduled maintenance.',
      rootCause: 'External dependency: pharmacy vendor QA environment is under scheduled maintenance and not accessible for testing.',
      recommendation: 'Reschedule test execution for after the maintenance window (2024-11-29 06:00 UTC). Consider implementing a vendor environment mock for critical path testing to reduce external dependency.',
      confidence: 100,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_031',
    testCaseId: 'tc_051',
    suiteName: 'Medicaid Eligibility Smoke Tests',
    status: 'skipped',
    environment: 'QA',
    startTime: '2024-12-05T08:00:00Z',
    endTime: '2024-12-05T08:00:05Z',
    duration: 5,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-12-05T08:00:00Z', level: 'info', message: 'Evaluating test prerequisites for multi-state configuration test' },
      { timestamp: '2024-12-05T08:00:03Z', level: 'warn', message: 'SKIPPED: Multi-state configuration feature not yet deployed to QA environment' },
      { timestamp: '2024-12-05T08:00:05Z', level: 'info', message: 'Test skipped. Feature flag "multi_state_config" is disabled in QA.' },
    ],
    evidence: [],
    aiAnalysis: {
      summary: 'Test skipped because the multi-state configuration feature has not been deployed to the QA environment. Feature flag is disabled.',
      rootCause: 'Feature dependency: multi-state configuration feature (dem_036) is still in intake status and not available for testing.',
      recommendation: 'This test should be executed once the multi-state configuration feature is deployed to QA. Add to the regression suite for the feature release.',
      confidence: 100,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_032',
    testCaseId: 'tc_053',
    suiteName: 'API Gateway Integration Tests',
    status: 'skipped',
    environment: 'QA',
    startTime: '2024-11-25T10:00:00Z',
    endTime: '2024-11-25T10:00:08Z',
    duration: 8,
    executedBy: 'CI Pipeline',
    logs: [
      { timestamp: '2024-11-25T10:00:00Z', level: 'info', message: 'Evaluating test prerequisites for TLS 1.3 connection handling test' },
      { timestamp: '2024-11-25T10:00:05Z', level: 'warn', message: 'SKIPPED: TLS 1.3 migration (dem_012) not yet deployed. Current environment supports TLS 1.2 only.' },
      { timestamp: '2024-11-25T10:00:08Z', level: 'info', message: 'Test skipped. Awaiting TLS 1.3 infrastructure deployment.' },
    ],
    evidence: [],
    aiAnalysis: {
      summary: 'Test skipped because TLS 1.3 migration has not been deployed to the QA environment. Infrastructure upgrade is pending.',
      rootCause: 'Infrastructure dependency: TLS 1.3 migration (dem_012) is in approved status but not yet implemented.',
      recommendation: 'Execute this test immediately after TLS 1.3 infrastructure deployment. Include in the migration validation test suite.',
      confidence: 100,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_033',
    testCaseId: 'tc_060',
    suiteName: 'Notification Hub Performance Tests',
    status: 'passed',
    environment: 'Performance',
    startTime: '2024-12-08T22:00:00Z',
    endTime: '2024-12-08T22:25:10Z',
    duration: 1510,
    executedBy: 'Marcus Thompson',
    logs: [
      { timestamp: '2024-12-08T22:00:00Z', level: 'info', message: 'Queuing 50,000 notifications for batch delivery' },
      { timestamp: '2024-12-08T22:00:30Z', level: 'info', message: 'Notifications queued. Batch processing started.' },
      { timestamp: '2024-12-08T22:08:00Z', level: 'info', message: '25,000 notifications delivered (50% complete)' },
      { timestamp: '2024-12-08T22:16:00Z', level: 'info', message: '40,000 notifications delivered (80% complete)' },
      { timestamp: '2024-12-08T22:23:00Z', level: 'info', message: '50,000 notifications delivered (100% complete)' },
      { timestamp: '2024-12-08T22:24:00Z', level: 'info', message: 'Delivery status tracking verified: 49,850 sent, 120 delivered, 30 bounced' },
      { timestamp: '2024-12-08T22:25:10Z', level: 'info', message: 'Zero duplicate deliveries detected. Test passed within 30-minute SLA.' },
    ],
    evidence: [
      { type: 'report', name: 'batch-delivery-performance.html', url: '/evidence/exec_033/batch-delivery-performance.html', capturedAt: '2024-12-08T22:25:10Z' },
      { type: 'log', name: 'delivery-status-summary.csv', url: '/evidence/exec_033/delivery-status-summary.csv', capturedAt: '2024-12-08T22:25:10Z' },
    ],
    aiAnalysis: {
      summary: 'Notification hub batch delivery test passed. 50,000 notifications processed in 23 minutes within the 30-minute SLA. Zero duplicates detected.',
      rootCause: '',
      recommendation: 'No action required. Batch delivery performance is healthy with 7-minute margin on SLA.',
      confidence: 96,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_034',
    testCaseId: 'tc_015',
    suiteName: 'Star Ratings Functional Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-07T09:00:00Z',
    endTime: '2024-12-07T09:07:45Z',
    duration: 465,
    executedBy: 'Emily Davis',
    logs: [
      { timestamp: '2024-12-07T09:00:00Z', level: 'info', message: 'Loading MY2024 measure data for all Part C measures' },
      { timestamp: '2024-12-07T09:02:00Z', level: 'info', message: 'Measure data loaded with correct rates and denominators' },
      { timestamp: '2024-12-07T09:03:30Z', level: 'info', message: 'Star Ratings calculation engine executed for Part C' },
      { timestamp: '2024-12-07T09:05:00Z', level: 'info', message: 'Domain-level star ratings computed and verified' },
      { timestamp: '2024-12-07T09:06:30Z', level: 'info', message: 'Overall Part C star rating calculated: 4.0 stars (expected: 4.0)' },
      { timestamp: '2024-12-07T09:07:45Z', level: 'info', message: 'All assertions passed. Part C Star Rating calculation verified.' },
    ],
    evidence: [
      { type: 'report', name: 'star-ratings-calculation-report.html', url: '/evidence/exec_034/star-ratings-calculation-report.html', capturedAt: '2024-12-07T09:07:45Z' },
      { type: 'log', name: 'measure-level-ratings.csv', url: '/evidence/exec_034/measure-level-ratings.csv', capturedAt: '2024-12-07T09:07:45Z' },
    ],
    aiAnalysis: {
      summary: 'Part C overall Star Rating calculation test passed. Rating of 4.0 stars matches expected value using CMS methodology with accurate measure-level and domain-level ratings.',
      rootCause: '',
      recommendation: 'No action required. Star Ratings calculation is aligned with CMS Technical Notes.',
      confidence: 97,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_035',
    testCaseId: 'tc_004',
    suiteName: 'Member Portal Accessibility Tests',
    status: 'passed',
    environment: 'Staging',
    startTime: '2024-12-11T13:00:00Z',
    endTime: '2024-12-11T13:08:15Z',
    duration: 495,
    executedBy: 'Omar Hassan',
    logs: [
      { timestamp: '2024-12-11T13:00:00Z', level: 'info', message: 'Starting WCAG 2.1 AA keyboard navigation test' },
      { timestamp: '2024-12-11T13:02:00Z', level: 'info', message: 'All interactive elements reachable via Tab key' },
      { timestamp: '2024-12-11T13:04:00Z', level: 'info', message: 'Focus indicators visible with sufficient contrast on all elements' },
      { timestamp: '2024-12-11T13:06:00Z', level: 'info', message: 'Main menu navigable with arrow keys, screen reader announcements correct' },
      { timestamp: '2024-12-11T13:07:30Z', level: 'info', message: 'Claims search form fully operable via keyboard' },
      { timestamp: '2024-12-11T13:08:15Z', level: 'info', message: 'All assertions passed. Keyboard navigation compliance verified.' },
    ],
    evidence: [
      { type: 'report', name: 'keyboard-navigation-report.html', url: '/evidence/exec_035/keyboard-navigation-report.html', capturedAt: '2024-12-11T13:08:15Z' },
      { type: 'video', name: 'keyboard-navigation-walkthrough.mp4', url: '/evidence/exec_035/keyboard-navigation-walkthrough.mp4', capturedAt: '2024-12-11T13:08:15Z' },
    ],
    aiAnalysis: {
      summary: 'WCAG 2.1 AA keyboard navigation test passed. All interactive elements are keyboard accessible with visible focus indicators and proper ARIA attributes.',
      rootCause: '',
      recommendation: 'No action required. Keyboard navigation meets WCAG 2.1 AA standards.',
      confidence: 98,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_036',
    testCaseId: 'tc_017',
    suiteName: 'HEDIS Engine Integration Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-12-03T10:00:00Z',
    endTime: '2024-12-03T10:12:40Z',
    duration: 760,
    executedBy: 'Samantha Clark',
    logs: [
      { timestamp: '2024-12-03T10:00:00Z', level: 'info', message: 'Ingesting supplemental data from electronic clinical data source' },
      { timestamp: '2024-12-03T10:03:00Z', level: 'info', message: 'Data ingested and mapped to HEDIS value sets' },
      { timestamp: '2024-12-03T10:05:00Z', level: 'warn', message: 'Supplemental data linkage: 94.2% match rate (expected: >98%)' },
      { timestamp: '2024-12-03T10:07:00Z', level: 'info', message: 'Running measure calculation with supplemental data' },
      { timestamp: '2024-12-03T10:09:00Z', level: 'info', message: 'Comparing measure rates with and without supplemental data' },
      { timestamp: '2024-12-03T10:11:00Z', level: 'error', message: 'FAIL: Supplemental data linkage rate 94.2% below 98% threshold. 2,340 records unlinked.' },
      { timestamp: '2024-12-03T10:12:40Z', level: 'info', message: 'Test completed with 1 failure. Data linkage accuracy below threshold.' },
    ],
    evidence: [
      { type: 'report', name: 'supplemental-data-linkage-report.html', url: '/evidence/exec_036/supplemental-data-linkage-report.html', capturedAt: '2024-12-03T10:12:40Z' },
      { type: 'log', name: 'unlinked-records-analysis.csv', url: '/evidence/exec_036/unlinked-records-analysis.csv', capturedAt: '2024-12-03T10:12:40Z' },
    ],
    aiAnalysis: {
      summary: 'HEDIS supplemental data integration test failed. Data linkage rate of 94.2% is below the 98% threshold, with 2,340 records unable to be linked to member records.',
      rootCause: 'The supplemental data source uses a different member ID format (MRN) than the HEDIS engine (member plan ID). The crosswalk table is missing entries for recently enrolled members added in the last 90 days.',
      recommendation: 'Update the member ID crosswalk table to include all members enrolled within the last 90 days. Implement a daily crosswalk refresh job. Add fuzzy matching as a fallback for unlinked records.',
      confidence: 89,
      relatedDefects: ['DEF-2024-0868'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0868',
        title: 'HEDIS supplemental data linkage missing crosswalk entries for recent enrollees',
        severity: 'high',
        status: 'open',
        assignee: 'Samantha Clark',
      },
    ],
  },
  {
    id: 'exec_037',
    testCaseId: 'tc_045',
    suiteName: 'Risk Assessment Functional Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-05T11:00:00Z',
    endTime: '2024-12-05T11:04:10Z',
    duration: 250,
    executedBy: 'Samantha Clark',
    logs: [
      { timestamp: '2024-12-05T11:00:00Z', level: 'info', message: 'Submitting risk assessment with known risk factors' },
      { timestamp: '2024-12-05T11:01:00Z', level: 'info', message: 'Assessment accepted. Scoring engine processing.' },
      { timestamp: '2024-12-05T11:02:00Z', level: 'info', message: 'Risk score calculated: 72.5 (expected: 72.5 ± 0.5)' },
      { timestamp: '2024-12-05T11:03:00Z', level: 'info', message: 'Risk category assigned: High (correct for score range 70-85)' },
      { timestamp: '2024-12-05T11:03:45Z', level: 'info', message: 'Risk register updated with latest assessment results' },
      { timestamp: '2024-12-05T11:04:10Z', level: 'info', message: 'All assertions passed. Automated risk scoring verified.' },
    ],
    evidence: [
      { type: 'report', name: 'risk-scoring-test-report.html', url: '/evidence/exec_037/risk-scoring-test-report.html', capturedAt: '2024-12-05T11:04:10Z' },
    ],
    aiAnalysis: {
      summary: 'Risk assessment automated scoring test passed. Score of 72.5 matches expected value with correct High risk category assignment and risk register update.',
      rootCause: '',
      recommendation: 'No action required. Scoring engine is functioning accurately.',
      confidence: 97,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_038',
    testCaseId: 'tc_019',
    suiteName: 'Part D Formulary Functional Tests',
    status: 'passed',
    environment: 'QA',
    startTime: '2024-12-03T08:00:00Z',
    endTime: '2024-12-03T08:05:20Z',
    duration: 320,
    executedBy: 'Lisa Johnson',
    logs: [
      { timestamp: '2024-12-03T08:00:00Z', level: 'info', message: 'Generating CMS formulary file for 2025 plan year' },
      { timestamp: '2024-12-03T08:01:30Z', level: 'info', message: 'File generated with all required fields' },
      { timestamp: '2024-12-03T08:02:30Z', level: 'info', message: 'Format validation against CMS specifications: PASSED' },
      { timestamp: '2024-12-03T08:03:30Z', level: 'info', message: 'Drug tier assignments verified against approved formulary' },
      { timestamp: '2024-12-03T08:04:30Z', level: 'info', message: 'Prior authorization indicators verified' },
      { timestamp: '2024-12-03T08:05:20Z', level: 'info', message: 'All assertions passed. CMS formulary file compliance verified.' },
    ],
    evidence: [
      { type: 'report', name: 'formulary-compliance-report.html', url: '/evidence/exec_038/formulary-compliance-report.html', capturedAt: '2024-12-03T08:05:20Z' },
      { type: 'log', name: 'formulary-validation-details.json', url: '/evidence/exec_038/formulary-validation-details.json', capturedAt: '2024-12-03T08:05:20Z' },
    ],
    aiAnalysis: {
      summary: 'Part D formulary CMS file submission test passed. File format, drug tier assignments, and prior authorization indicators all validated correctly.',
      rootCause: '',
      recommendation: 'No action required. Formulary file is compliant with CMS specifications.',
      confidence: 98,
      relatedDefects: [],
    },
    defectsFound: [],
  },
  {
    id: 'exec_039',
    testCaseId: 'tc_024',
    suiteName: 'State Reporting Regression Tests',
    status: 'failed',
    environment: 'QA',
    startTime: '2024-11-27T14:00:00Z',
    endTime: '2024-11-27T14:06:30Z',
    duration: 390,
    executedBy: 'Samantha Clark',
    logs: [
      { timestamp: '2024-11-27T14:00:00Z', level: 'info', message: 'Running automated data accuracy validation on sample report' },
      { timestamp: '2024-11-27T14:01:30Z', level: 'info', message: 'Validation engine processing all data fields' },
      { timestamp: '2024-11-27T14:03:00Z', level: 'warn', message: 'Cross-field validation: 5 inconsistent data combinations detected' },
      { timestamp: '2024-11-27T14:04:30Z', level: 'error', message: 'FAIL: Historical trend validation detected 3 anomalies exceeding 2-sigma threshold' },
      { timestamp: '2024-11-27T14:06:00Z', level: 'info', message: 'Anomalies: enrollment count spike in Region 3, utilization drop in Region 7, cost variance in Region 12' },
      { timestamp: '2024-11-27T14:06:30Z', level: 'info', message: 'Test completed with failures. Data accuracy validation identified issues.' },
    ],
    evidence: [
      { type: 'report', name: 'data-accuracy-validation-report.html', url: '/evidence/exec_039/data-accuracy-validation-report.html', capturedAt: '2024-11-27T14:06:30Z' },
      { type: 'log', name: 'anomaly-details.csv', url: '/evidence/exec_039/anomaly-details.csv', capturedAt: '2024-11-27T14:06:30Z' },
    ],
    aiAnalysis: {
      summary: 'State reporting data accuracy validation failed with 5 cross-field inconsistencies and 3 historical trend anomalies detected.',
      rootCause: 'Cross-field inconsistencies are caused by timing differences between enrollment and claims data extractions. Historical anomalies in Regions 3, 7, and 12 correlate with the Medicaid unwinding process that caused unusual enrollment and utilization patterns.',
      recommendation: 'Synchronize enrollment and claims data extraction timestamps. Add Medicaid unwinding adjustment factors to the historical trend validation baseline. Flag expected anomalies with documented justifications.',
      confidence: 84,
      relatedDefects: ['DEF-2024-0852'],
    },
    defectsFound: [
      {
        id: 'DEF-2024-0852',
        title: 'State reporting cross-field validation fails due to data extraction timing mismatch',
        severity: 'medium',
        status: 'open',
        assignee: 'Samantha Clark',
      },
    ],
  },
  {
    id: 'exec_040',
    testCaseId: 'tc_029',
    suiteName: 'Individual Marketplace Functional Tests',
    status: 'passed',
    environment: 'Staging',
    startTime: '2024-12-10T07:30:00Z',
    endTime: '2024-12-10T07:34:15Z',
    duration: 255,
    executedBy: 'Priya Patel',
    logs: [
      { timestamp: '2024-12-10T07:30:00Z', level: 'info', message: 'Entering household income and family size for subsidy calculation' },
      { timestamp: '2024-12-10T07:31:00Z', level: 'info', message: 'Subsidy amount calculated based on FPL percentage' },
      { timestamp: '2024-12-10T07:32:00Z', level: 'info', message: 'Two plans selected for side-by-side comparison' },
      { timestamp: '2024-12-10T07:33:00Z', level: 'info', message: 'Premium amounts correctly reflect applied subsidies' },
      { timestamp: '2024-12-10T07:33:45Z', level: 'info', message: 'SBC summary links accessible and displaying correctly' },
      { timestamp: '2024-12-10T07:34:15Z', level: 'info', message: 'All assertions passed. Plan comparison tool verified.' },
    ],
    evidence: [
      { type: 'screenshot', name: 'plan-comparison-view.png', url: '/evidence/exec_040/plan-comparison-view.png', capturedAt: '2024-12-10T07:32:00Z' },
      { type: 'report', name: 'marketplace-test-report.html', url: '/evidence/exec_040/marketplace-test-report.html', capturedAt: '2024-12-10T07:34:15Z' },
    ],
    aiAnalysis: {
      summary: 'Individual marketplace plan comparison test passed. Subsidy calculations, premium displays, and SBC summaries all verified correctly.',
      rootCause: '',
      recommendation: 'No action required. Plan comparison tool is functioning as expected for OEP 2025.',
      confidence: 97,
      relatedDefects: [],
    },
    defectsFound: [],
  },
];

/**
 * Returns all available test executions.
 *
 * @returns {TestExecution[]} Array of all test execution objects
 */
export function getAllTestExecutions() {
  return [...testExecutions];
}

/**
 * Retrieves a single test execution by its unique ID.
 *
 * @param {string} executionId - The execution identifier to look up
 * @returns {TestExecution|null} The matching test execution object, or null if not found
 */
export function getTestExecutionById(executionId) {
  if (!executionId || typeof executionId !== 'string') {
    return null;
  }
  return testExecutions.find((e) => e.id === executionId) || null;
}

/**
 * Returns all test executions for a specific test case.
 *
 * @param {string} testCaseId - The test case ID to filter by
 * @returns {TestExecution[]} Array of test executions for the specified test case
 */
export function getTestExecutionsByTestCaseId(testCaseId) {
  if (!testCaseId || typeof testCaseId !== 'string') {
    return [];
  }
  return testExecutions.filter((e) => e.testCaseId === testCaseId);
}

/**
 * Returns all test executions filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'passed', 'failed', 'blocked', 'skipped', 'in-progress')
 * @returns {TestExecution[]} Array of test executions matching the specified status
 */
export function getTestExecutionsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return testExecutions.filter((e) => e.status === status);
}

/**
 * Returns all test executions filtered by environment.
 *
 * @param {string} environment - The environment to filter by (e.g. 'Production', 'Staging', 'QA', 'Development', 'Performance')
 * @returns {TestExecution[]} Array of test executions matching the specified environment
 */
export function getTestExecutionsByEnvironment(environment) {
  if (!environment || typeof environment !== 'string') {
    return [];
  }
  return testExecutions.filter((e) => e.environment === environment);
}

/**
 * Returns all test executions filtered by suite name.
 *
 * @param {string} suiteName - The suite name to filter by
 * @returns {TestExecution[]} Array of test executions matching the specified suite name
 */
export function getTestExecutionsBySuiteName(suiteName) {
  if (!suiteName || typeof suiteName !== 'string') {
    return [];
  }
  return testExecutions.filter((e) => e.suiteName === suiteName);
}

/**
 * Returns all test executions executed by a specific person or system.
 *
 * @param {string} executedBy - The executor name to filter by
 * @returns {TestExecution[]} Array of test executions by the specified executor
 */
export function getTestExecutionsByExecutor(executedBy) {
  if (!executedBy || typeof executedBy !== 'string') {
    return [];
  }
  return testExecutions.filter((e) => e.executedBy === executedBy);
}

/**
 * Returns all test executions that have defects found.
 *
 * @returns {TestExecution[]} Array of test executions with at least one defect
 */
export function getTestExecutionsWithDefects() {
  return testExecutions.filter((e) => e.defectsFound.length > 0);
}

/**
 * Returns aggregate statistics across all test executions.
 *
 * @returns {{ totalExecutions: number, statusBreakdown: Object<string, number>, environmentBreakdown: Object<string, number>, totalDefectsFound: number, averageDuration: number, passRate: number, averageAIConfidence: number }} Aggregate test execution statistics
 */
export function getTestExecutionAggregates() {
  const totalExecutions = testExecutions.length;

  const statusBreakdown = testExecutions.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const environmentBreakdown = testExecutions.reduce((acc, e) => {
    acc[e.environment] = (acc[e.environment] || 0) + 1;
    return acc;
  }, {});

  const totalDefectsFound = testExecutions.reduce((sum, e) => sum + e.defectsFound.length, 0);

  const executionsWithDuration = testExecutions.filter((e) => e.duration > 0);
  const averageDuration =
    executionsWithDuration.length > 0
      ? Math.round(executionsWithDuration.reduce((sum, e) => sum + e.duration, 0) / executionsWithDuration.length)
      : 0;

  const executedTests = testExecutions.filter((e) => e.status === 'passed' || e.status === 'failed');
  const passedTests = testExecutions.filter((e) => e.status === 'passed');
  const passRate =
    executedTests.length > 0
      ? Math.round((passedTests.length / executedTests.length) * 1000) / 10
      : 0;

  const averageAIConfidence =
    totalExecutions > 0
      ? Math.round((testExecutions.reduce((sum, e) => sum + e.aiAnalysis.confidence, 0) / totalExecutions) * 10) / 10
      : 0;

  return {
    totalExecutions,
    statusBreakdown,
    environmentBreakdown,
    totalDefectsFound,
    averageDuration,
    passRate,
    averageAIConfidence,
  };
}

/**
 * Returns all unique suite names across all test executions.
 *
 * @returns {string[]} Array of unique suite names sorted alphabetically
 */
export function getAllExecutionSuiteNames() {
  const suiteNames = new Set(testExecutions.map((e) => e.suiteName));
  return [...suiteNames].sort();
}

/**
 * Returns all unique environments across all test executions.
 *
 * @returns {string[]} Array of unique environments sorted alphabetically
 */
export function getAllExecutionEnvironments() {
  const environments = new Set(testExecutions.map((e) => e.environment));
  return [...environments].sort();
}

/**
 * Returns all unique executor names across all test executions.
 *
 * @returns {string[]} Array of unique executor names sorted alphabetically
 */
export function getAllExecutors() {
  const executors = new Set(testExecutions.map((e) => e.executedBy));
  return [...executors].sort();
}

/**
 * Returns all unique defect IDs found across all test executions.
 *
 * @returns {string[]} Array of unique defect IDs sorted alphabetically
 */
export function getAllDefectIds() {
  const defectIds = new Set(testExecutions.flatMap((e) => e.defectsFound.map((d) => d.id)));
  return [...defectIds].sort();
}

export default testExecutions;