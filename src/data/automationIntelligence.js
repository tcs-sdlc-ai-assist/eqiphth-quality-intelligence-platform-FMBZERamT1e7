import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} AutomationHealthScore
 * @property {string} id - Unique health score identifier
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {number} overallScore - Overall automation health score (0-100)
 * @property {number} coverageScore - Test coverage sub-score (0-100)
 * @property {number} stabilityScore - Test stability sub-score (0-100)
 * @property {number} maintenanceScore - Maintenance burden sub-score (0-100)
 * @property {number} executionSpeedScore - Execution speed sub-score (0-100)
 * @property {string} status - Health status using MEASURE_STATUS
 * @property {string} trend - Trend direction (improving, declining, stable)
 * @property {{ month: string, score: number }[]} trendData - Monthly trend data
 * @property {string} lastAssessed - Last assessment date in ISO format
 */

/**
 * @typedef {Object} CoverageMetric
 * @property {string} id - Unique coverage metric identifier
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {number} totalTestCases - Total number of test cases
 * @property {number} automatedTestCases - Number of automated test cases
 * @property {number} manualTestCases - Number of manual test cases
 * @property {number} hybridTestCases - Number of hybrid test cases
 * @property {number} plannedTestCases - Number of planned-for-automation test cases
 * @property {number} automationPercentage - Automation coverage percentage (0-100)
 * @property {number} targetPercentage - Target automation coverage percentage (0-100)
 * @property {string} status - Coverage status using MEASURE_STATUS
 * @property {{ type: string, count: number, automated: number, percentage: number }[]} byTestType - Coverage breakdown by test type
 */

/**
 * @typedef {Object} FlakyTest
 * @property {string} id - Unique flaky test identifier
 * @property {string} testCaseId - Reference to the test case ID
 * @property {string} testName - Display name of the test
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {string} testType - Test type (unit, integration, e2e, performance, security)
 * @property {number} flakinessRate - Flakiness rate percentage (0-100)
 * @property {number} totalExecutions - Total number of executions in the analysis window
 * @property {number} inconsistentResults - Number of inconsistent results
 * @property {string} rootCause - Identified or suspected root cause
 * @property {string} recommendation - Recommended fix action
 * @property {string} severity - Flakiness severity (critical, high, medium, low)
 * @property {string} lastFlakeDate - Date of the last flaky result in ISO format
 * @property {string} assignee - Name of the person assigned to investigate
 * @property {string} status - Investigation status (open, investigating, fixed, accepted, muted)
 */

/**
 * @typedef {Object} AutomationCandidate
 * @property {string} id - Unique candidate identifier
 * @property {string} testCaseId - Reference to the test case ID
 * @property {string} testName - Display name of the test case
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {string} testType - Test type (functional, regression, smoke, integration, e2e)
 * @property {string} currentStatus - Current automation status (manual, hybrid, planned)
 * @property {number} priorityScore - Automation priority score (0-100)
 * @property {number} complexityScore - Estimated complexity (1-10)
 * @property {number} estimatedEffortHours - Estimated effort to automate in hours
 * @property {number} executionFrequency - How often the test is executed per month
 * @property {number} manualExecutionTimeMinutes - Time to execute manually in minutes
 * @property {number} estimatedMonthlySavingsMinutes - Estimated monthly time savings in minutes
 * @property {string} rationale - AI-generated rationale for automation recommendation
 * @property {string} recommendedFramework - Recommended automation framework or tool
 * @property {string} status - Candidate status (recommended, approved, in_progress, completed, deferred)
 */

/**
 * @typedef {Object} ROIProjection
 * @property {string} id - Unique ROI projection identifier
 * @property {string} application - Application ID (empty string for platform-wide)
 * @property {string} applicationName - Display name of the application (empty string for platform-wide)
 * @property {string} segment - Organizational segment (empty string for platform-wide)
 * @property {string} scope - Projection scope (application, segment, platform)
 * @property {number} currentAutomationCoverage - Current automation coverage percentage
 * @property {number} projectedAutomationCoverage - Projected automation coverage percentage
 * @property {number} investmentHours - Total investment hours required
 * @property {number} investmentCost - Estimated investment cost in USD
 * @property {number} annualTimeSavingsHours - Projected annual time savings in hours
 * @property {number} annualCostSavings - Projected annual cost savings in USD
 * @property {number} paybackPeriodMonths - Estimated payback period in months
 * @property {number} threeYearROI - Projected 3-year ROI percentage
 * @property {number} defectDetectionImprovement - Projected defect detection improvement percentage
 * @property {number} releaseVelocityImprovement - Projected release velocity improvement percentage
 * @property {{ quarter: string, coverage: number, savings: number }[]} projectionTimeline - Quarterly projection timeline
 * @property {string} generatedAt - Projection generation timestamp in ISO format
 * @property {number} confidence - Projection confidence percentage (0-100)
 */

/**
 * @typedef {Object} AutomationIntelligenceData
 * @property {AutomationHealthScore[]} healthScores - Array of automation health scores
 * @property {CoverageMetric[]} coverageMetrics - Array of coverage metrics
 * @property {FlakyTest[]} flakyTests - Array of flaky tests
 * @property {AutomationCandidate[]} automationCandidates - Array of automation candidates
 * @property {ROIProjection[]} roiProjections - Array of ROI projections
 */

/**
 * Mock automation health scores for the EQIP Quality Platform.
 * @type {AutomationHealthScore[]}
 */
const healthScores = [
  {
    id: 'ahs_001',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    overallScore: 88.5,
    coverageScore: 91.4,
    stabilityScore: 92.0,
    maintenanceScore: 82.5,
    executionSpeedScore: 88.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jul', score: 83.0 },
      { month: 'Aug', score: 84.2 },
      { month: 'Sep', score: 85.5 },
      { month: 'Oct', score: 86.3 },
      { month: 'Nov', score: 87.4 },
      { month: 'Dec', score: 88.5 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_002',
    application: 'app_member_portal',
    applicationName: 'Member Portal',
    segment: 'Enterprise',
    overallScore: 93.2,
    coverageScore: 94.2,
    stabilityScore: 95.5,
    maintenanceScore: 89.8,
    executionSpeedScore: 93.2,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jul', score: 91.5 },
      { month: 'Aug', score: 92.0 },
      { month: 'Sep', score: 92.3 },
      { month: 'Oct', score: 92.8 },
      { month: 'Nov', score: 93.0 },
      { month: 'Dec', score: 93.2 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_003',
    application: 'app_auth_service',
    applicationName: 'Authentication Service',
    segment: 'Enterprise',
    overallScore: 96.1,
    coverageScore: 96.8,
    stabilityScore: 98.0,
    maintenanceScore: 93.5,
    executionSpeedScore: 96.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jul', score: 95.0 },
      { month: 'Aug', score: 95.3 },
      { month: 'Sep', score: 95.5 },
      { month: 'Oct', score: 95.8 },
      { month: 'Nov', score: 96.0 },
      { month: 'Dec', score: 96.1 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_004',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    overallScore: 72.8,
    coverageScore: 82.1,
    stabilityScore: 65.0,
    maintenanceScore: 68.5,
    executionSpeedScore: 75.5,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'declining',
    trendData: [
      { month: 'Jul', score: 78.5 },
      { month: 'Aug', score: 77.2 },
      { month: 'Sep', score: 76.0 },
      { month: 'Oct', score: 75.0 },
      { month: 'Nov', score: 73.8 },
      { month: 'Dec', score: 72.8 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_005',
    application: 'app_medicare_enrollment',
    applicationName: 'Medicare Enrollment System',
    segment: 'Medicare',
    overallScore: 85.4,
    coverageScore: 88.7,
    stabilityScore: 86.0,
    maintenanceScore: 80.5,
    executionSpeedScore: 86.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jul', score: 81.0 },
      { month: 'Aug', score: 82.2 },
      { month: 'Sep', score: 83.0 },
      { month: 'Oct', score: 84.0 },
      { month: 'Nov', score: 84.8 },
      { month: 'Dec', score: 85.4 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_006',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    overallScore: 64.2,
    coverageScore: 74.8,
    stabilityScore: 58.0,
    maintenanceScore: 60.5,
    executionSpeedScore: 63.5,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'declining',
    trendData: [
      { month: 'Jul', score: 70.0 },
      { month: 'Aug', score: 68.5 },
      { month: 'Sep', score: 67.2 },
      { month: 'Oct', score: 66.0 },
      { month: 'Nov', score: 65.0 },
      { month: 'Dec', score: 64.2 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_007',
    application: 'app_state_reporting',
    applicationName: 'State Regulatory Reporting',
    segment: 'Medicaid',
    overallScore: 60.5,
    coverageScore: 71.2,
    stabilityScore: 55.0,
    maintenanceScore: 56.8,
    executionSpeedScore: 59.0,
    status: MEASURE_STATUS.CRITICAL,
    trend: 'declining',
    trendData: [
      { month: 'Jul', score: 66.0 },
      { month: 'Aug', score: 65.0 },
      { month: 'Sep', score: 64.0 },
      { month: 'Oct', score: 63.0 },
      { month: 'Nov', score: 61.5 },
      { month: 'Dec', score: 60.5 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_008',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    overallScore: 55.3,
    coverageScore: 68.5,
    stabilityScore: 48.0,
    maintenanceScore: 50.2,
    executionSpeedScore: 54.5,
    status: MEASURE_STATUS.CRITICAL,
    trend: 'declining',
    trendData: [
      { month: 'Jul', score: 62.0 },
      { month: 'Aug', score: 60.5 },
      { month: 'Sep', score: 59.0 },
      { month: 'Oct', score: 57.8 },
      { month: 'Nov', score: 56.5 },
      { month: 'Dec', score: 55.3 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_009',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    overallScore: 48.6,
    coverageScore: 62.8,
    stabilityScore: 40.0,
    maintenanceScore: 42.5,
    executionSpeedScore: 49.0,
    status: MEASURE_STATUS.CRITICAL,
    trend: 'declining',
    trendData: [
      { month: 'Jul', score: 55.0 },
      { month: 'Aug', score: 53.5 },
      { month: 'Sep', score: 52.0 },
      { month: 'Oct', score: 51.0 },
      { month: 'Nov', score: 49.8 },
      { month: 'Dec', score: 48.6 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_010',
    application: 'app_compliance_dashboard',
    applicationName: 'Compliance Dashboard',
    segment: 'Compliance',
    overallScore: 95.8,
    coverageScore: 96.0,
    stabilityScore: 97.5,
    maintenanceScore: 93.0,
    executionSpeedScore: 96.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jul', score: 94.5 },
      { month: 'Aug', score: 94.8 },
      { month: 'Sep', score: 95.0 },
      { month: 'Oct', score: 95.2 },
      { month: 'Nov', score: 95.5 },
      { month: 'Dec', score: 95.8 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_011',
    application: 'app_broker_portal',
    applicationName: 'Broker Portal',
    segment: 'Commercial',
    overallScore: 89.5,
    coverageScore: 90.4,
    stabilityScore: 91.0,
    maintenanceScore: 86.5,
    executionSpeedScore: 90.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jul', score: 85.0 },
      { month: 'Aug', score: 86.2 },
      { month: 'Sep', score: 87.0 },
      { month: 'Oct', score: 88.0 },
      { month: 'Nov', score: 88.8 },
      { month: 'Dec', score: 89.5 },
    ],
    lastAssessed: '2024-12-12',
  },
  {
    id: 'ahs_012',
    application: 'app_care_management',
    applicationName: 'Care Management Platform',
    segment: 'Medicaid',
    overallScore: 67.0,
    coverageScore: 76.3,
    stabilityScore: 62.0,
    maintenanceScore: 60.5,
    executionSpeedScore: 69.2,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'stable',
    trendData: [
      { month: 'Jul', score: 65.5 },
      { month: 'Aug', score: 66.0 },
      { month: 'Sep', score: 66.2 },
      { month: 'Oct', score: 66.5 },
      { month: 'Nov', score: 66.8 },
      { month: 'Dec', score: 67.0 },
    ],
    lastAssessed: '2024-12-12',
  },
];

/**
 * Mock coverage metrics for the EQIP Quality Platform.
 * @type {CoverageMetric[]}
 */
const coverageMetrics = [
  {
    id: 'acm_001',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    totalTestCases: 4250,
    automatedTestCases: 3710,
    manualTestCases: 340,
    hybridTestCases: 120,
    plannedTestCases: 80,
    automationPercentage: 87.3,
    targetPercentage: 90.0,
    status: MEASURE_STATUS.AT_RISK,
    byTestType: [
      { type: 'unit', count: 2800, automated: 2756, percentage: 98.4 },
      { type: 'integration', count: 850, automated: 720, percentage: 84.7 },
      { type: 'e2e', count: 320, automated: 180, percentage: 56.3 },
      { type: 'performance', count: 45, automated: 42, percentage: 93.3 },
      { type: 'security', count: 235, automated: 12, percentage: 5.1 },
    ],
  },
  {
    id: 'acm_002',
    application: 'app_member_portal',
    applicationName: 'Member Portal',
    segment: 'Enterprise',
    totalTestCases: 3180,
    automatedTestCases: 2928,
    manualTestCases: 152,
    hybridTestCases: 60,
    plannedTestCases: 40,
    automationPercentage: 92.1,
    targetPercentage: 90.0,
    status: MEASURE_STATUS.ON_TRACK,
    byTestType: [
      { type: 'unit', count: 1800, automated: 1785, percentage: 99.2 },
      { type: 'integration', count: 620, automated: 580, percentage: 93.5 },
      { type: 'e2e', count: 480, automated: 340, percentage: 70.8 },
      { type: 'accessibility', count: 280, automated: 223, percentage: 79.6 },
    ],
  },
  {
    id: 'acm_003',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    totalTestCases: 2800,
    automatedTestCases: 2299,
    manualTestCases: 350,
    hybridTestCases: 85,
    plannedTestCases: 66,
    automationPercentage: 82.1,
    targetPercentage: 90.0,
    status: MEASURE_STATUS.AT_RISK,
    byTestType: [
      { type: 'unit', count: 1600, automated: 1540, percentage: 96.3 },
      { type: 'integration', count: 700, automated: 520, percentage: 74.3 },
      { type: 'e2e', count: 350, automated: 180, percentage: 51.4 },
      { type: 'performance', count: 150, automated: 59, percentage: 39.3 },
    ],
  },
  {
    id: 'acm_004',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    totalTestCases: 2200,
    automatedTestCases: 1646,
    manualTestCases: 410,
    hybridTestCases: 95,
    plannedTestCases: 49,
    automationPercentage: 74.8,
    targetPercentage: 85.0,
    status: MEASURE_STATUS.AT_RISK,
    byTestType: [
      { type: 'unit', count: 1200, automated: 1050, percentage: 87.5 },
      { type: 'integration', count: 580, automated: 380, percentage: 65.5 },
      { type: 'e2e', count: 420, automated: 216, percentage: 51.4 },
    ],
  },
  {
    id: 'acm_005',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    totalTestCases: 1350,
    automatedTestCases: 925,
    manualTestCases: 310,
    hybridTestCases: 65,
    plannedTestCases: 50,
    automationPercentage: 68.5,
    targetPercentage: 85.0,
    status: MEASURE_STATUS.CRITICAL,
    byTestType: [
      { type: 'unit', count: 650, automated: 520, percentage: 80.0 },
      { type: 'integration', count: 380, automated: 240, percentage: 63.2 },
      { type: 'security', count: 200, automated: 110, percentage: 55.0 },
      { type: 'performance', count: 120, automated: 55, percentage: 45.8 },
    ],
  },
  {
    id: 'acm_006',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    totalTestCases: 980,
    automatedTestCases: 615,
    manualTestCases: 280,
    hybridTestCases: 50,
    plannedTestCases: 35,
    automationPercentage: 62.8,
    targetPercentage: 80.0,
    status: MEASURE_STATUS.CRITICAL,
    byTestType: [
      { type: 'unit', count: 480, automated: 350, percentage: 72.9 },
      { type: 'integration', count: 320, automated: 180, percentage: 56.3 },
      { type: 'e2e', count: 180, automated: 85, percentage: 47.2 },
    ],
  },
  {
    id: 'acm_007',
    application: 'app_compliance_dashboard',
    applicationName: 'Compliance Dashboard',
    segment: 'Compliance',
    totalTestCases: 900,
    automatedTestCases: 848,
    manualTestCases: 32,
    hybridTestCases: 12,
    plannedTestCases: 8,
    automationPercentage: 94.2,
    targetPercentage: 90.0,
    status: MEASURE_STATUS.ON_TRACK,
    byTestType: [
      { type: 'unit', count: 500, automated: 498, percentage: 99.6 },
      { type: 'integration', count: 240, automated: 230, percentage: 95.8 },
      { type: 'e2e', count: 160, automated: 120, percentage: 75.0 },
    ],
  },
  {
    id: 'acm_008',
    application: 'app_state_reporting',
    applicationName: 'State Regulatory Reporting',
    segment: 'Medicaid',
    totalTestCases: 1400,
    automatedTestCases: 997,
    manualTestCases: 310,
    hybridTestCases: 55,
    plannedTestCases: 38,
    automationPercentage: 71.2,
    targetPercentage: 85.0,
    status: MEASURE_STATUS.AT_RISK,
    byTestType: [
      { type: 'unit', count: 750, automated: 600, percentage: 80.0 },
      { type: 'integration', count: 400, automated: 260, percentage: 65.0 },
      { type: 'e2e', count: 250, automated: 137, percentage: 54.8 },
    ],
  },
];

/**
 * Mock flaky test data for the EQIP Quality Platform.
 * @type {FlakyTest[]}
 */
const flakyTests = [
  {
    id: 'flaky_001',
    testCaseId: 'tc_018',
    testName: 'HEDIS Engine Full Population Performance Test',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    testType: 'performance',
    flakinessRate: 35.0,
    totalExecutions: 20,
    inconsistentResults: 7,
    rootCause: 'Test results vary based on JVM garbage collection timing and concurrent measure execution load. Memory pressure causes non-deterministic processing times.',
    recommendation: 'Isolate performance tests to dedicated JVM instances with fixed heap allocation. Add warm-up phase before measurement. Set tolerance bands based on statistical analysis of historical runs.',
    severity: 'critical',
    lastFlakeDate: '2024-12-07',
    assignee: 'Marcus Thompson',
    status: 'investigating',
  },
  {
    id: 'flaky_002',
    testCaseId: 'tc_017',
    testName: 'HEDIS Supplemental Data Source Integration Test',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    testType: 'integration',
    flakinessRate: 22.5,
    totalExecutions: 40,
    inconsistentResults: 9,
    rootCause: 'Supplemental data linkage test depends on crosswalk table state which varies between test runs. Race condition in data loading causes intermittent linkage failures.',
    recommendation: 'Use dedicated test data fixtures with deterministic crosswalk entries. Add explicit data setup and teardown steps. Implement retry with fresh data load on first failure.',
    severity: 'high',
    lastFlakeDate: '2024-12-10',
    assignee: 'Samantha Clark',
    status: 'investigating',
  },
  {
    id: 'flaky_003',
    testCaseId: 'tc_034',
    testName: 'Partner API Gateway Rate Limiting Under High Load',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    testType: 'performance',
    flakinessRate: 28.0,
    totalExecutions: 25,
    inconsistentResults: 7,
    rootCause: 'Sliding window rate limiter boundary conditions produce different results depending on exact request timing. Network latency variations in QA environment contribute to inconsistency.',
    recommendation: 'Switch to token bucket algorithm for deterministic rate limiting. Use controlled request scheduling with precise timing. Run rate limit tests in isolated performance environment.',
    severity: 'critical',
    lastFlakeDate: '2024-12-07',
    assignee: 'Marcus Thompson',
    status: 'open',
  },
  {
    id: 'flaky_004',
    testCaseId: 'tc_005',
    testName: 'Member Portal Screen Reader Compatibility for Claims History',
    application: 'app_member_portal',
    applicationName: 'Member Portal',
    segment: 'Enterprise',
    testType: 'e2e',
    flakinessRate: 15.0,
    totalExecutions: 40,
    inconsistentResults: 6,
    rootCause: 'Screen reader detection timing varies across test environments. ARIA attribute rendering depends on React hydration completion which is non-deterministic in CI.',
    recommendation: 'Add explicit wait for React hydration completion before screen reader assertions. Use aria-busy attribute to signal rendering state. Increase assertion timeout for accessibility checks.',
    severity: 'medium',
    lastFlakeDate: '2024-12-11',
    assignee: 'Omar Hassan',
    status: 'investigating',
  },
  {
    id: 'flaky_005',
    testCaseId: 'tc_037',
    testName: 'Vendor Data Feed Error Recovery and Retry Logic',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    testType: 'integration',
    flakinessRate: 30.0,
    totalExecutions: 30,
    inconsistentResults: 9,
    rootCause: 'RabbitMQ message delivery timing in QA environment is non-deterministic. Dead letter queue consumer sometimes processes messages before the test assertion checkpoint.',
    recommendation: 'Use test-specific RabbitMQ virtual host with controlled message delivery. Add explicit message acknowledgment checkpoints. Implement polling-based assertions with configurable timeout.',
    severity: 'high',
    lastFlakeDate: '2024-12-12',
    assignee: 'James Wright',
    status: 'open',
  },
  {
    id: 'flaky_006',
    testCaseId: 'tc_022',
    testName: 'Medicaid Eligibility Redetermination Batch Processing',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    testType: 'integration',
    flakinessRate: 18.0,
    totalExecutions: 50,
    inconsistentResults: 9,
    rootCause: 'Batch processing test depends on database connection pool availability. Under concurrent test execution, connection pool exhaustion causes intermittent timeout failures.',
    recommendation: 'Allocate dedicated database connection pool for batch processing tests. Add connection pool health check before test execution. Implement sequential execution for batch tests.',
    severity: 'high',
    lastFlakeDate: '2024-12-12',
    assignee: 'Robert Kim',
    status: 'investigating',
  },
  {
    id: 'flaky_007',
    testCaseId: 'tc_011',
    testName: 'Data Warehouse Query Performance for HEDIS Measure Aggregation',
    application: 'app_data_warehouse',
    applicationName: 'Enterprise Data Warehouse',
    segment: 'Enterprise',
    testType: 'performance',
    flakinessRate: 20.0,
    totalExecutions: 15,
    inconsistentResults: 3,
    rootCause: 'Snowflake warehouse auto-scaling introduces variable query execution times. Cold start vs warm cache produces significantly different performance results.',
    recommendation: 'Pre-warm Snowflake warehouse before performance tests. Use dedicated warehouse with fixed size for consistent results. Add warm-up queries before measurement phase.',
    severity: 'medium',
    lastFlakeDate: '2024-12-05',
    assignee: 'Marcus Thompson',
    status: 'fixed',
  },
  {
    id: 'flaky_008',
    testCaseId: 'tc_023',
    testName: 'State Regulatory Report Generation for Quarterly Submission',
    application: 'app_state_reporting',
    applicationName: 'State Regulatory Reporting',
    segment: 'Medicaid',
    testType: 'e2e',
    flakinessRate: 25.0,
    totalExecutions: 20,
    inconsistentResults: 5,
    rootCause: 'Report generation depends on Celery task queue processing order which is non-deterministic. Multiple state reports compete for worker resources causing variable completion times.',
    recommendation: 'Use dedicated Celery worker for test execution. Implement sequential report generation in test mode. Add explicit task completion polling with configurable timeout.',
    severity: 'high',
    lastFlakeDate: '2024-12-12',
    assignee: 'Patricia Evans',
    status: 'open',
  },
  {
    id: 'flaky_009',
    testCaseId: 'tc_048',
    testName: 'Member Portal Claims History End-to-End Flow',
    application: 'app_member_portal',
    applicationName: 'Member Portal',
    segment: 'Enterprise',
    testType: 'e2e',
    flakinessRate: 12.0,
    totalExecutions: 50,
    inconsistentResults: 6,
    rootCause: 'Claims history API response time varies in staging environment causing intermittent timeout on data table rendering. Lazy loading of claim details triggers race condition with assertion.',
    recommendation: 'Add explicit wait for claims data table to be fully populated before assertions. Use network idle detection before interacting with claim details. Increase API response timeout in test configuration.',
    severity: 'medium',
    lastFlakeDate: '2024-12-11',
    assignee: 'Priya Patel',
    status: 'fixed',
  },
  {
    id: 'flaky_010',
    testCaseId: 'tc_038',
    testName: 'External Data Feed CMS File Format Validation',
    application: 'app_external_data_feed',
    applicationName: 'External Data Feed Processor',
    segment: 'External',
    testType: 'integration',
    flakinessRate: 16.0,
    totalExecutions: 25,
    inconsistentResults: 4,
    rootCause: 'File system I/O timing in Docker containers causes intermittent file read failures. Temporary file cleanup from previous test runs occasionally interferes with current test data.',
    recommendation: 'Use unique temporary directories per test execution. Add file existence verification before processing. Implement file system synchronization barrier between test steps.',
    severity: 'medium',
    lastFlakeDate: '2024-12-10',
    assignee: 'James Wright',
    status: 'investigating',
  },
];

/**
 * Mock automation candidate data for the EQIP Quality Platform.
 * @type {AutomationCandidate[]}
 */
const automationCandidates = [
  {
    id: 'ac_001',
    testCaseId: 'tc_023',
    testName: 'State Regulatory Report Generation for Quarterly Submission',
    application: 'app_state_reporting',
    applicationName: 'State Regulatory Reporting',
    segment: 'Medicaid',
    testType: 'functional',
    currentStatus: 'hybrid',
    priorityScore: 95,
    complexityScore: 7,
    estimatedEffortHours: 24,
    executionFrequency: 12,
    manualExecutionTimeMinutes: 90,
    estimatedMonthlySavingsMinutes: 810,
    rationale: 'High-frequency critical compliance test currently requiring significant manual intervention for data validation and report format verification. Full automation would eliminate 90% of manual effort and reduce report generation validation time from 90 minutes to under 10 minutes.',
    recommendedFramework: 'Pytest + Celery test utilities',
    status: 'recommended',
  },
  {
    id: 'ac_002',
    testCaseId: 'tc_054',
    testName: 'Vendor Integration Daily Data Reconciliation Process',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    testType: 'integration',
    currentStatus: 'manual',
    priorityScore: 92,
    complexityScore: 6,
    estimatedEffortHours: 16,
    executionFrequency: 20,
    manualExecutionTimeMinutes: 45,
    estimatedMonthlySavingsMinutes: 720,
    rationale: 'Daily manual reconciliation test is a critical data quality checkpoint. Automating this test would enable continuous reconciliation monitoring and reduce the risk of undetected data discrepancies from days to minutes.',
    recommendedFramework: 'JUnit 5 + Spring Boot Test + Testcontainers',
    status: 'approved',
  },
  {
    id: 'ac_003',
    testCaseId: 'tc_024',
    testName: 'State Reporting Data Accuracy Validation Checks',
    application: 'app_state_reporting',
    applicationName: 'State Regulatory Reporting',
    segment: 'Medicaid',
    testType: 'regression',
    currentStatus: 'manual',
    priorityScore: 90,
    complexityScore: 8,
    estimatedEffortHours: 32,
    executionFrequency: 8,
    manualExecutionTimeMinutes: 120,
    estimatedMonthlySavingsMinutes: 840,
    rationale: 'Complex data accuracy validation currently performed manually by compliance team. Automation would enable continuous data quality monitoring and catch accuracy issues before they impact regulatory submissions.',
    recommendedFramework: 'Pytest + Great Expectations',
    status: 'recommended',
  },
  {
    id: 'ac_004',
    testCaseId: 'tc_036',
    testName: 'Vendor Integration Hub Encrypted Data Channel Enforcement',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    testType: 'security',
    currentStatus: 'manual',
    priorityScore: 88,
    complexityScore: 5,
    estimatedEffortHours: 12,
    executionFrequency: 20,
    manualExecutionTimeMinutes: 30,
    estimatedMonthlySavingsMinutes: 480,
    rationale: 'Critical security test currently executed manually by security engineer. Automating TLS version validation and BAA enforcement checks would enable daily security posture verification without manual intervention.',
    recommendedFramework: 'JUnit 5 + SSLContext testing + WireMock',
    status: 'in_progress',
  },
  {
    id: 'ac_005',
    testCaseId: 'tc_044',
    testName: 'Compliance Dashboard Risk Heat Map Visualization',
    application: 'app_compliance_dashboard',
    applicationName: 'Compliance Dashboard',
    segment: 'Compliance',
    testType: 'e2e',
    currentStatus: 'hybrid',
    priorityScore: 72,
    complexityScore: 6,
    estimatedEffortHours: 20,
    executionFrequency: 4,
    manualExecutionTimeMinutes: 60,
    estimatedMonthlySavingsMinutes: 180,
    rationale: 'Visual validation of risk heat map currently requires manual verification of color coding and drill-down functionality. Automated visual regression testing would catch rendering issues early in the development cycle.',
    recommendedFramework: 'Playwright + Percy visual testing',
    status: 'recommended',
  },
  {
    id: 'ac_006',
    testCaseId: 'tc_039',
    testName: 'External Data Feed Processing SLA Compliance',
    application: 'app_external_data_feed',
    applicationName: 'External Data Feed Processor',
    segment: 'External',
    testType: 'performance',
    currentStatus: 'manual',
    priorityScore: 85,
    complexityScore: 5,
    estimatedEffortHours: 14,
    executionFrequency: 8,
    manualExecutionTimeMinutes: 45,
    estimatedMonthlySavingsMinutes: 288,
    rationale: 'SLA compliance testing requires manual file submission and timing measurement. Automating this test would enable continuous SLA monitoring and early detection of processing performance degradation.',
    recommendedFramework: 'Pytest + Apache Airflow test utilities',
    status: 'approved',
  },
  {
    id: 'ac_007',
    testCaseId: 'tc_026',
    testName: 'Care Management Member Outreach Tracking Compliance',
    application: 'app_care_management',
    applicationName: 'Care Management Platform',
    segment: 'Medicaid',
    testType: 'regression',
    currentStatus: 'manual',
    priorityScore: 82,
    complexityScore: 4,
    estimatedEffortHours: 10,
    executionFrequency: 12,
    manualExecutionTimeMinutes: 35,
    estimatedMonthlySavingsMinutes: 350,
    rationale: 'Outreach tracking compliance validation is a governance-critical test executed frequently. Automation would ensure continuous compliance monitoring and immediately detect field validation regressions.',
    recommendedFramework: 'Cypress + React Testing Library',
    status: 'recommended',
  },
  {
    id: 'ac_008',
    testCaseId: 'tc_051',
    testName: 'Medicaid Eligibility Multi-State Rule Configuration',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    testType: 'smoke',
    currentStatus: 'planned',
    priorityScore: 78,
    complexityScore: 7,
    estimatedEffortHours: 28,
    executionFrequency: 4,
    manualExecutionTimeMinutes: 75,
    estimatedMonthlySavingsMinutes: 225,
    rationale: 'Multi-state configuration testing will become critical as new state contracts are onboarded. Early automation investment will scale testing capacity without proportional manual effort increase.',
    recommendedFramework: 'JUnit 5 + Drools test utilities',
    status: 'deferred',
  },
  {
    id: 'ac_009',
    testCaseId: 'tc_053',
    testName: 'Partner API Gateway TLS 1.3 Connection Handling',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    testType: 'integration',
    currentStatus: 'planned',
    priorityScore: 80,
    complexityScore: 5,
    estimatedEffortHours: 12,
    executionFrequency: 8,
    manualExecutionTimeMinutes: 25,
    estimatedMonthlySavingsMinutes: 160,
    rationale: 'TLS 1.3 migration testing requires protocol-level validation that is tedious to perform manually. Automation would enable continuous TLS configuration monitoring and prevent protocol regression.',
    recommendedFramework: 'Go test + crypto/tls + httptest',
    status: 'approved',
  },
  {
    id: 'ac_010',
    testCaseId: 'tc_059',
    testName: 'Star Ratings Predictive Model Forecast Accuracy',
    application: 'app_star_ratings',
    applicationName: 'Star Ratings Analytics',
    segment: 'Medicare',
    testType: 'functional',
    currentStatus: 'planned',
    priorityScore: 75,
    complexityScore: 8,
    estimatedEffortHours: 36,
    executionFrequency: 4,
    manualExecutionTimeMinutes: 120,
    estimatedMonthlySavingsMinutes: 360,
    rationale: 'Predictive model validation requires comparison of forecasted vs actual Star Ratings across multiple measures. Automation would enable continuous model accuracy monitoring and early detection of model drift.',
    recommendedFramework: 'Pytest + scikit-learn test utilities + Pandas',
    status: 'recommended',
  },
  {
    id: 'ac_011',
    testCaseId: 'tc_056',
    testName: 'Risk Assessment Platform Risk Register Management',
    application: 'app_risk_assessment',
    applicationName: 'Risk Assessment Platform',
    segment: 'Compliance',
    testType: 'e2e',
    currentStatus: 'hybrid',
    priorityScore: 65,
    complexityScore: 5,
    estimatedEffortHours: 16,
    executionFrequency: 4,
    manualExecutionTimeMinutes: 40,
    estimatedMonthlySavingsMinutes: 120,
    rationale: 'Risk register lifecycle management test has manual steps for status transition verification. Full automation would reduce regression testing time and enable continuous risk register integrity validation.',
    recommendedFramework: 'Playwright + Django test client',
    status: 'recommended',
  },
  {
    id: 'ac_012',
    testCaseId: 'tc_058',
    testName: 'Wellness Platform HIPAA Wellness Program Nondiscrimination Compliance',
    application: 'app_wellness_platform',
    applicationName: 'Wellness Platform',
    segment: 'Commercial',
    testType: 'regression',
    currentStatus: 'hybrid',
    priorityScore: 60,
    complexityScore: 4,
    estimatedEffortHours: 8,
    executionFrequency: 4,
    manualExecutionTimeMinutes: 30,
    estimatedMonthlySavingsMinutes: 90,
    rationale: 'HIPAA nondiscrimination compliance validation has manual verification steps for reward limit calculations. Full automation would ensure continuous compliance monitoring during wellness program configuration changes.',
    recommendedFramework: 'Jest + React Testing Library',
    status: 'completed',
  },
];

/**
 * Mock ROI projection data for the EQIP Quality Platform.
 * @type {ROIProjection[]}
 */
const roiProjections = [
  {
    id: 'roi_001',
    application: '',
    applicationName: '',
    segment: '',
    scope: 'platform',
    currentAutomationCoverage: 83.7,
    projectedAutomationCoverage: 92.0,
    investmentHours: 1200,
    investmentCost: 180000,
    annualTimeSavingsHours: 4800,
    annualCostSavings: 720000,
    paybackPeriodMonths: 3,
    threeYearROI: 1100,
    defectDetectionImprovement: 35,
    releaseVelocityImprovement: 25,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 86.0, savings: 120000 },
      { quarter: 'Q2 2025', coverage: 88.5, savings: 180000 },
      { quarter: 'Q3 2025', coverage: 90.5, savings: 210000 },
      { quarter: 'Q4 2025', coverage: 92.0, savings: 210000 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 82,
  },
  {
    id: 'roi_002',
    application: '',
    applicationName: '',
    segment: 'External',
    scope: 'segment',
    currentAutomationCoverage: 67.2,
    projectedAutomationCoverage: 82.0,
    investmentHours: 480,
    investmentCost: 72000,
    annualTimeSavingsHours: 1920,
    annualCostSavings: 288000,
    paybackPeriodMonths: 3,
    threeYearROI: 1100,
    defectDetectionImprovement: 45,
    releaseVelocityImprovement: 35,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 72.0, savings: 48000 },
      { quarter: 'Q2 2025', coverage: 76.0, savings: 72000 },
      { quarter: 'Q3 2025', coverage: 79.5, savings: 84000 },
      { quarter: 'Q4 2025', coverage: 82.0, savings: 84000 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 78,
  },
  {
    id: 'roi_003',
    application: '',
    applicationName: '',
    segment: 'Medicaid',
    scope: 'segment',
    currentAutomationCoverage: 75.7,
    projectedAutomationCoverage: 88.0,
    investmentHours: 360,
    investmentCost: 54000,
    annualTimeSavingsHours: 1440,
    annualCostSavings: 216000,
    paybackPeriodMonths: 3,
    threeYearROI: 1100,
    defectDetectionImprovement: 40,
    releaseVelocityImprovement: 30,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 79.0, savings: 36000 },
      { quarter: 'Q2 2025', coverage: 82.5, savings: 54000 },
      { quarter: 'Q3 2025', coverage: 85.5, savings: 63000 },
      { quarter: 'Q4 2025', coverage: 88.0, savings: 63000 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 80,
  },
  {
    id: 'roi_004',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    scope: 'application',
    currentAutomationCoverage: 62.8,
    projectedAutomationCoverage: 80.0,
    investmentHours: 200,
    investmentCost: 30000,
    annualTimeSavingsHours: 960,
    annualCostSavings: 144000,
    paybackPeriodMonths: 3,
    threeYearROI: 1340,
    defectDetectionImprovement: 50,
    releaseVelocityImprovement: 40,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 68.0, savings: 24000 },
      { quarter: 'Q2 2025', coverage: 73.0, savings: 36000 },
      { quarter: 'Q3 2025', coverage: 77.0, savings: 42000 },
      { quarter: 'Q4 2025', coverage: 80.0, savings: 42000 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 85,
  },
  {
    id: 'roi_005',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    scope: 'application',
    currentAutomationCoverage: 68.5,
    projectedAutomationCoverage: 85.0,
    investmentHours: 180,
    investmentCost: 27000,
    annualTimeSavingsHours: 720,
    annualCostSavings: 108000,
    paybackPeriodMonths: 3,
    threeYearROI: 1100,
    defectDetectionImprovement: 40,
    releaseVelocityImprovement: 30,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 73.0, savings: 18000 },
      { quarter: 'Q2 2025', coverage: 78.0, savings: 27000 },
      { quarter: 'Q3 2025', coverage: 82.0, savings: 31500 },
      { quarter: 'Q4 2025', coverage: 85.0, savings: 31500 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 83,
  },
  {
    id: 'roi_006',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    scope: 'application',
    currentAutomationCoverage: 82.1,
    projectedAutomationCoverage: 92.0,
    investmentHours: 160,
    investmentCost: 24000,
    annualTimeSavingsHours: 600,
    annualCostSavings: 90000,
    paybackPeriodMonths: 4,
    threeYearROI: 1025,
    defectDetectionImprovement: 30,
    releaseVelocityImprovement: 20,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 85.0, savings: 15000 },
      { quarter: 'Q2 2025', coverage: 88.0, savings: 22500 },
      { quarter: 'Q3 2025', coverage: 90.5, savings: 26250 },
      { quarter: 'Q4 2025', coverage: 92.0, savings: 26250 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 86,
  },
  {
    id: 'roi_007',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    scope: 'application',
    currentAutomationCoverage: 74.8,
    projectedAutomationCoverage: 88.0,
    investmentHours: 200,
    investmentCost: 30000,
    annualTimeSavingsHours: 840,
    annualCostSavings: 126000,
    paybackPeriodMonths: 3,
    threeYearROI: 1160,
    defectDetectionImprovement: 38,
    releaseVelocityImprovement: 28,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 78.0, savings: 21000 },
      { quarter: 'Q2 2025', coverage: 82.0, savings: 31500 },
      { quarter: 'Q3 2025', coverage: 85.5, savings: 36750 },
      { quarter: 'Q4 2025', coverage: 88.0, savings: 36750 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 81,
  },
  {
    id: 'roi_008',
    application: 'app_state_reporting',
    applicationName: 'State Regulatory Reporting',
    segment: 'Medicaid',
    scope: 'application',
    currentAutomationCoverage: 71.2,
    projectedAutomationCoverage: 87.0,
    investmentHours: 180,
    investmentCost: 27000,
    annualTimeSavingsHours: 720,
    annualCostSavings: 108000,
    paybackPeriodMonths: 3,
    threeYearROI: 1100,
    defectDetectionImprovement: 42,
    releaseVelocityImprovement: 32,
    projectionTimeline: [
      { quarter: 'Q1 2025', coverage: 75.0, savings: 18000 },
      { quarter: 'Q2 2025', coverage: 79.5, savings: 27000 },
      { quarter: 'Q3 2025', coverage: 83.5, savings: 31500 },
      { quarter: 'Q4 2025', coverage: 87.0, savings: 31500 },
    ],
    generatedAt: '2024-12-12T10:00:00Z',
    confidence: 79,
  },
];

/**
 * Combined automation intelligence data object.
 * @type {AutomationIntelligenceData}
 */
const automationIntelligence = {
  healthScores,
  coverageMetrics,
  flakyTests,
  automationCandidates,
  roiProjections,
};

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all automation intelligence data.
 *
 * @returns {AutomationIntelligenceData} The complete automation intelligence data object
 */
export function getAllAutomationIntelligence() {
  return {
    healthScores: [...healthScores],
    coverageMetrics: [...coverageMetrics],
    flakyTests: [...flakyTests],
    automationCandidates: [...automationCandidates],
    roiProjections: [...roiProjections],
  };
}

// ---------------------------------------------------------------------------
// Health score accessors
// ---------------------------------------------------------------------------

/**
 * Returns all automation health scores.
 *
 * @returns {AutomationHealthScore[]} Array of all health score objects
 */
export function getAllHealthScores() {
  return [...healthScores];
}

/**
 * Retrieves a single health score by its unique ID.
 *
 * @param {string} healthScoreId - The health score identifier to look up
 * @returns {AutomationHealthScore|null} The matching health score object, or null if not found
 */
export function getHealthScoreById(healthScoreId) {
  if (!healthScoreId || typeof healthScoreId !== 'string') {
    return null;
  }
  return healthScores.find((h) => h.id === healthScoreId) || null;
}

/**
 * Returns all health scores for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {AutomationHealthScore|null} The matching health score object, or null if not found
 */
export function getHealthScoreByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return null;
  }
  return healthScores.find((h) => h.application === applicationId) || null;
}

/**
 * Returns all health scores filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {AutomationHealthScore[]} Array of health scores matching the specified segment
 */
export function getHealthScoresBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return healthScores.filter((h) => h.segment === segment);
}

/**
 * Returns all health scores filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {AutomationHealthScore[]} Array of health scores matching the specified status
 */
export function getHealthScoresByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return healthScores.filter((h) => h.status === status);
}

/**
 * Returns all health scores filtered by trend.
 *
 * @param {string} trend - The trend to filter by (e.g. 'improving', 'declining', 'stable')
 * @returns {AutomationHealthScore[]} Array of health scores matching the specified trend
 */
export function getHealthScoresByTrend(trend) {
  if (!trend || typeof trend !== 'string') {
    return [];
  }
  return healthScores.filter((h) => h.trend === trend);
}

// ---------------------------------------------------------------------------
// Coverage metric accessors
// ---------------------------------------------------------------------------

/**
 * Returns all coverage metrics.
 *
 * @returns {CoverageMetric[]} Array of all coverage metric objects
 */
export function getAllCoverageMetrics() {
  return [...coverageMetrics];
}

/**
 * Retrieves a single coverage metric by its unique ID.
 *
 * @param {string} coverageId - The coverage metric identifier to look up
 * @returns {CoverageMetric|null} The matching coverage metric object, or null if not found
 */
export function getCoverageMetricById(coverageId) {
  if (!coverageId || typeof coverageId !== 'string') {
    return null;
  }
  return coverageMetrics.find((c) => c.id === coverageId) || null;
}

/**
 * Returns the coverage metric for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {CoverageMetric|null} The matching coverage metric object, or null if not found
 */
export function getCoverageMetricByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return null;
  }
  return coverageMetrics.find((c) => c.application === applicationId) || null;
}

/**
 * Returns all coverage metrics filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {CoverageMetric[]} Array of coverage metrics matching the specified segment
 */
export function getCoverageMetricsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return coverageMetrics.filter((c) => c.segment === segment);
}

/**
 * Returns all coverage metrics filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {CoverageMetric[]} Array of coverage metrics matching the specified status
 */
export function getCoverageMetricsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return coverageMetrics.filter((c) => c.status === status);
}

/**
 * Returns all coverage metrics where automation percentage is below target.
 *
 * @returns {CoverageMetric[]} Array of coverage metrics below their target percentage
 */
export function getCoverageMetricsBelowTarget() {
  return coverageMetrics.filter((c) => c.automationPercentage < c.targetPercentage);
}

// ---------------------------------------------------------------------------
// Flaky test accessors
// ---------------------------------------------------------------------------

/**
 * Returns all flaky tests.
 *
 * @returns {FlakyTest[]} Array of all flaky test objects
 */
export function getAllFlakyTests() {
  return [...flakyTests];
}

/**
 * Retrieves a single flaky test by its unique ID.
 *
 * @param {string} flakyTestId - The flaky test identifier to look up
 * @returns {FlakyTest|null} The matching flaky test object, or null if not found
 */
export function getFlakyTestById(flakyTestId) {
  if (!flakyTestId || typeof flakyTestId !== 'string') {
    return null;
  }
  return flakyTests.find((f) => f.id === flakyTestId) || null;
}

/**
 * Returns all flaky tests for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {FlakyTest[]} Array of flaky tests for the specified application
 */
export function getFlakyTestsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return flakyTests.filter((f) => f.application === applicationId);
}

/**
 * Returns all flaky tests filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {FlakyTest[]} Array of flaky tests matching the specified segment
 */
export function getFlakyTestsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return flakyTests.filter((f) => f.segment === segment);
}

/**
 * Returns all flaky tests filtered by severity.
 *
 * @param {string} severity - The severity to filter by (e.g. 'critical', 'high', 'medium', 'low')
 * @returns {FlakyTest[]} Array of flaky tests matching the specified severity
 */
export function getFlakyTestsBySeverity(severity) {
  if (!severity || typeof severity !== 'string') {
    return [];
  }
  return flakyTests.filter((f) => f.severity === severity);
}

/**
 * Returns all flaky tests filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'open', 'investigating', 'fixed', 'accepted', 'muted')
 * @returns {FlakyTest[]} Array of flaky tests matching the specified status
 */
export function getFlakyTestsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return flakyTests.filter((f) => f.status === status);
}

/**
 * Returns all flaky tests assigned to a specific person.
 *
 * @param {string} assignee - The assignee name to filter by
 * @returns {FlakyTest[]} Array of flaky tests assigned to the specified person
 */
export function getFlakyTestsByAssignee(assignee) {
  if (!assignee || typeof assignee !== 'string') {
    return [];
  }
  return flakyTests.filter((f) => f.assignee === assignee);
}

/**
 * Returns all unique flaky test severities.
 *
 * @returns {string[]} Array of unique severities
 */
export function getAllFlakyTestSeverities() {
  return ['critical', 'high', 'medium', 'low'];
}

/**
 * Returns all unique flaky test statuses.
 *
 * @returns {string[]} Array of unique statuses sorted alphabetically
 */
export function getAllFlakyTestStatuses() {
  const statuses = new Set(flakyTests.map((f) => f.status));
  return [...statuses].sort();
}

// ---------------------------------------------------------------------------
// Automation candidate accessors
// ---------------------------------------------------------------------------

/**
 * Returns all automation candidates.
 *
 * @returns {AutomationCandidate[]} Array of all automation candidate objects
 */
export function getAllAutomationCandidates() {
  return [...automationCandidates];
}

/**
 * Retrieves a single automation candidate by its unique ID.
 *
 * @param {string} candidateId - The candidate identifier to look up
 * @returns {AutomationCandidate|null} The matching automation candidate object, or null if not found
 */
export function getAutomationCandidateById(candidateId) {
  if (!candidateId || typeof candidateId !== 'string') {
    return null;
  }
  return automationCandidates.find((c) => c.id === candidateId) || null;
}

/**
 * Returns all automation candidates for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {AutomationCandidate[]} Array of automation candidates for the specified application
 */
export function getAutomationCandidatesByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return automationCandidates.filter((c) => c.application === applicationId);
}

/**
 * Returns all automation candidates filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {AutomationCandidate[]} Array of automation candidates matching the specified segment
 */
export function getAutomationCandidatesBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return automationCandidates.filter((c) => c.segment === segment);
}

/**
 * Returns all automation candidates filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'recommended', 'approved', 'in_progress', 'completed', 'deferred')
 * @returns {AutomationCandidate[]} Array of automation candidates matching the specified status
 */
export function getAutomationCandidatesByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return automationCandidates.filter((c) => c.status === status);
}

/**
 * Returns all automation candidates filtered by current automation status.
 *
 * @param {string} currentStatus - The current automation status to filter by (e.g. 'manual', 'hybrid', 'planned')
 * @returns {AutomationCandidate[]} Array of automation candidates matching the specified current status
 */
export function getAutomationCandidatesByCurrentStatus(currentStatus) {
  if (!currentStatus || typeof currentStatus !== 'string') {
    return [];
  }
  return automationCandidates.filter((c) => c.currentStatus === currentStatus);
}

/**
 * Returns all automation candidates sorted by priority score (highest first).
 *
 * @returns {AutomationCandidate[]} Array of automation candidates sorted by priority score descending
 */
export function getAutomationCandidatesByPriority() {
  return [...automationCandidates].sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Returns all unique automation candidate statuses.
 *
 * @returns {string[]} Array of unique statuses sorted alphabetically
 */
export function getAllAutomationCandidateStatuses() {
  const statuses = new Set(automationCandidates.map((c) => c.status));
  return [...statuses].sort();
}

// ---------------------------------------------------------------------------
// ROI projection accessors
// ---------------------------------------------------------------------------

/**
 * Returns all ROI projections.
 *
 * @returns {ROIProjection[]} Array of all ROI projection objects
 */
export function getAllROIProjections() {
  return [...roiProjections];
}

/**
 * Retrieves a single ROI projection by its unique ID.
 *
 * @param {string} projectionId - The projection identifier to look up
 * @returns {ROIProjection|null} The matching ROI projection object, or null if not found
 */
export function getROIProjectionById(projectionId) {
  if (!projectionId || typeof projectionId !== 'string') {
    return null;
  }
  return roiProjections.find((r) => r.id === projectionId) || null;
}

/**
 * Returns all ROI projections filtered by scope.
 *
 * @param {string} scope - The scope to filter by (e.g. 'application', 'segment', 'platform')
 * @returns {ROIProjection[]} Array of ROI projections matching the specified scope
 */
export function getROIProjectionsByScope(scope) {
  if (!scope || typeof scope !== 'string') {
    return [];
  }
  return roiProjections.filter((r) => r.scope === scope);
}

/**
 * Returns all ROI projections for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {ROIProjection[]} Array of ROI projections for the specified application
 */
export function getROIProjectionsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return roiProjections.filter((r) => r.application === applicationId);
}

/**
 * Returns all ROI projections filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {ROIProjection[]} Array of ROI projections matching the specified segment
 */
export function getROIProjectionsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return roiProjections.filter((r) => r.segment === segment);
}

/**
 * Returns the platform-wide ROI projection.
 *
 * @returns {ROIProjection|null} The platform-wide ROI projection, or null if not found
 */
export function getPlatformROIProjection() {
  return roiProjections.find((r) => r.scope === 'platform') || null;
}

/**
 * Returns all unique ROI projection scopes.
 *
 * @returns {string[]} Array of unique scopes sorted alphabetically
 */
export function getAllROIProjectionScopes() {
  const scopes = new Set(roiProjections.map((r) => r.scope));
  return [...scopes].sort();
}

// ---------------------------------------------------------------------------
// Aggregate statistics
// ---------------------------------------------------------------------------

/**
 * Returns aggregate statistics across all automation intelligence data.
 *
 * @returns {{ totalHealthScores: number, averageHealthScore: number, healthStatusBreakdown: Object<string, number>, totalCoverageMetrics: number, averageAutomationCoverage: number, coverageStatusBreakdown: Object<string, number>, totalFlakyTests: number, flakyTestSeverityBreakdown: Object<string, number>, flakyTestStatusBreakdown: Object<string, number>, averageFlakinessRate: number, totalAutomationCandidates: number, candidateStatusBreakdown: Object<string, number>, totalEstimatedEffortHours: number, totalEstimatedMonthlySavingsMinutes: number, totalROIProjections: number, platformAnnualCostSavings: number, platformThreeYearROI: number }} Aggregate automation intelligence statistics
 */
export function getAutomationIntelligenceAggregates() {
  const totalHealthScores = healthScores.length;
  const averageHealthScore =
    totalHealthScores > 0
      ? Math.round((healthScores.reduce((sum, h) => sum + h.overallScore, 0) / totalHealthScores) * 10) / 10
      : 0;

  const healthStatusBreakdown = healthScores.reduce((acc, h) => {
    acc[h.status] = (acc[h.status] || 0) + 1;
    return acc;
  }, {});

  const totalCoverageMetrics = coverageMetrics.length;
  const averageAutomationCoverage =
    totalCoverageMetrics > 0
      ? Math.round((coverageMetrics.reduce((sum, c) => sum + c.automationPercentage, 0) / totalCoverageMetrics) * 10) / 10
      : 0;

  const coverageStatusBreakdown = coverageMetrics.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const totalFlakyTests = flakyTests.length;
  const flakyTestSeverityBreakdown = flakyTests.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {});

  const flakyTestStatusBreakdown = flakyTests.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const averageFlakinessRate =
    totalFlakyTests > 0
      ? Math.round((flakyTests.reduce((sum, f) => sum + f.flakinessRate, 0) / totalFlakyTests) * 10) / 10
      : 0;

  const totalAutomationCandidates = automationCandidates.length;
  const candidateStatusBreakdown = automationCandidates.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const totalEstimatedEffortHours = automationCandidates.reduce((sum, c) => sum + c.estimatedEffortHours, 0);
  const totalEstimatedMonthlySavingsMinutes = automationCandidates.reduce((sum, c) => sum + c.estimatedMonthlySavingsMinutes, 0);

  const totalROIProjections = roiProjections.length;
  const platformProjection = roiProjections.find((r) => r.scope === 'platform');
  const platformAnnualCostSavings = platformProjection ? platformProjection.annualCostSavings : 0;
  const platformThreeYearROI = platformProjection ? platformProjection.threeYearROI : 0;

  return {
    totalHealthScores,
    averageHealthScore,
    healthStatusBreakdown,
    totalCoverageMetrics,
    averageAutomationCoverage,
    coverageStatusBreakdown,
    totalFlakyTests,
    flakyTestSeverityBreakdown,
    flakyTestStatusBreakdown,
    averageFlakinessRate,
    totalAutomationCandidates,
    candidateStatusBreakdown,
    totalEstimatedEffortHours,
    totalEstimatedMonthlySavingsMinutes,
    totalROIProjections,
    platformAnnualCostSavings,
    platformThreeYearROI,
  };
}

export default automationIntelligence;