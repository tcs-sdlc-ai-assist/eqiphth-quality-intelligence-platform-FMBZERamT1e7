import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} KPI
 * @property {string} id - Unique KPI identifier
 * @property {string} name - Display name of the KPI
 * @property {number} value - Current KPI value
 * @property {number} previousValue - Previous period KPI value
 * @property {string} unit - Unit of measurement (count, percent, ratio, score)
 * @property {string} trend - Trend direction (improving, declining, stable)
 * @property {number} changePercent - Percentage change from previous period
 * @property {string} status - KPI status using MEASURE_STATUS
 * @property {string} description - Description of the KPI
 */

/**
 * @typedef {Object} TrendDataPoint
 * @property {string} month - Month label (e.g. 'Jan', 'Feb')
 * @property {number} value - Metric value for the month
 */

/**
 * @typedef {Object} TrendMetric
 * @property {string} id - Unique trend metric identifier
 * @property {string} name - Display name of the trend metric
 * @property {TrendDataPoint[]} data - Monthly trend data points
 * @property {string} unit - Unit of measurement
 */

/**
 * @typedef {Object} SegmentBreakdown
 * @property {string} segment - Segment name
 * @property {number} totalTestCases - Total test cases in the segment
 * @property {number} passRate - Pass rate percentage
 * @property {number} automationCoverage - Automation coverage percentage
 * @property {number} defectDensity - Defect density (defects per 1000 LOC)
 * @property {number} qualityScore - Quality score (0-100)
 * @property {number} releaseReadiness - Release readiness percentage
 * @property {string} status - Segment status using MEASURE_STATUS
 */

/**
 * @typedef {Object} RiskDistribution
 * @property {string} level - Risk level (low, medium, high, critical)
 * @property {number} count - Number of applications at this risk level
 * @property {number} percentage - Percentage of total applications
 * @property {string[]} applications - Array of application IDs at this risk level
 */

/**
 * @typedef {Object} QualityStatusSummary
 * @property {string} status - Quality status using MEASURE_STATUS
 * @property {number} count - Number of applications with this status
 * @property {number} percentage - Percentage of total applications
 * @property {string[]} applications - Array of application IDs with this status
 */

/**
 * @typedef {Object} DashboardMetrics
 * @property {KPI[]} kpis - Array of key performance indicators
 * @property {TrendMetric[]} trendMetrics - Array of trend metrics with monthly data
 * @property {SegmentBreakdown[]} segmentBreakdowns - Array of segment-level breakdowns
 * @property {RiskDistribution[]} riskDistributions - Array of risk level distributions
 * @property {QualityStatusSummary[]} qualityStatusSummaries - Array of quality status summaries
 */

/**
 * Mock KPI data for the executive dashboard.
 * @type {KPI[]}
 */
const kpis = [
  {
    id: 'kpi_total_test_cases',
    name: 'Total Test Cases',
    value: 38680,
    previousValue: 35420,
    unit: 'count',
    trend: 'improving',
    changePercent: 9.2,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Total number of test cases across all applications and segments.',
  },
  {
    id: 'kpi_pass_rate',
    name: 'Pass Rate',
    value: 87.4,
    previousValue: 84.8,
    unit: 'percent',
    trend: 'improving',
    changePercent: 3.1,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Overall test pass rate across all executed test suites.',
  },
  {
    id: 'kpi_automation_coverage',
    name: 'Automation Coverage',
    value: 83.7,
    previousValue: 80.2,
    unit: 'percent',
    trend: 'improving',
    changePercent: 4.4,
    status: MEASURE_STATUS.AT_RISK,
    description: 'Percentage of test cases that are automated across all applications.',
  },
  {
    id: 'kpi_defect_density',
    name: 'Defect Density',
    value: 2.3,
    previousValue: 2.8,
    unit: 'ratio',
    trend: 'improving',
    changePercent: -17.9,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Average number of defects per 1,000 lines of code across all applications.',
  },
  {
    id: 'kpi_quality_score',
    name: 'Quality Score',
    value: 88.2,
    previousValue: 85.6,
    unit: 'score',
    trend: 'improving',
    changePercent: 3.0,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Composite quality score derived from test coverage, pass rate, defect density, and compliance metrics.',
  },
  {
    id: 'kpi_release_readiness',
    name: 'Release Readiness',
    value: 62.5,
    previousValue: 58.3,
    unit: 'percent',
    trend: 'improving',
    changePercent: 7.2,
    status: MEASURE_STATUS.AT_RISK,
    description: 'Percentage of applications that have passed all quality gates and are ready for production release.',
  },
];

/**
 * Mock trend data for the executive dashboard.
 * @type {TrendMetric[]}
 */
const trendMetrics = [
  {
    id: 'trend_pass_rate',
    name: 'Pass Rate',
    data: [
      { month: 'Jan', value: 80.2 },
      { month: 'Feb', value: 81.0 },
      { month: 'Mar', value: 81.8 },
      { month: 'Apr', value: 82.5 },
      { month: 'May', value: 83.2 },
      { month: 'Jun', value: 83.9 },
      { month: 'Jul', value: 84.5 },
      { month: 'Aug', value: 85.1 },
      { month: 'Sep', value: 85.8 },
      { month: 'Oct', value: 86.4 },
      { month: 'Nov', value: 87.0 },
      { month: 'Dec', value: 87.4 },
    ],
    unit: 'percent',
  },
  {
    id: 'trend_automation_coverage',
    name: 'Automation Coverage',
    data: [
      { month: 'Jan', value: 74.5 },
      { month: 'Feb', value: 75.3 },
      { month: 'Mar', value: 76.2 },
      { month: 'Apr', value: 77.0 },
      { month: 'May', value: 78.1 },
      { month: 'Jun', value: 79.0 },
      { month: 'Jul', value: 79.8 },
      { month: 'Aug', value: 80.5 },
      { month: 'Sep', value: 81.3 },
      { month: 'Oct', value: 82.1 },
      { month: 'Nov', value: 83.0 },
      { month: 'Dec', value: 83.7 },
    ],
    unit: 'percent',
  },
  {
    id: 'trend_defect_density',
    name: 'Defect Density',
    data: [
      { month: 'Jan', value: 3.8 },
      { month: 'Feb', value: 3.6 },
      { month: 'Mar', value: 3.5 },
      { month: 'Apr', value: 3.3 },
      { month: 'May', value: 3.1 },
      { month: 'Jun', value: 3.0 },
      { month: 'Jul', value: 2.9 },
      { month: 'Aug', value: 2.8 },
      { month: 'Sep', value: 2.6 },
      { month: 'Oct', value: 2.5 },
      { month: 'Nov', value: 2.4 },
      { month: 'Dec', value: 2.3 },
    ],
    unit: 'ratio',
  },
  {
    id: 'trend_quality_score',
    name: 'Quality Score',
    data: [
      { month: 'Jan', value: 79.5 },
      { month: 'Feb', value: 80.3 },
      { month: 'Mar', value: 81.2 },
      { month: 'Apr', value: 82.0 },
      { month: 'May', value: 83.1 },
      { month: 'Jun', value: 84.0 },
      { month: 'Jul', value: 84.8 },
      { month: 'Aug', value: 85.5 },
      { month: 'Sep', value: 86.3 },
      { month: 'Oct', value: 87.0 },
      { month: 'Nov', value: 87.6 },
      { month: 'Dec', value: 88.2 },
    ],
    unit: 'score',
  },
  {
    id: 'trend_release_readiness',
    name: 'Release Readiness',
    data: [
      { month: 'Jan', value: 48.0 },
      { month: 'Feb', value: 49.5 },
      { month: 'Mar', value: 50.8 },
      { month: 'Apr', value: 52.0 },
      { month: 'May', value: 53.5 },
      { month: 'Jun', value: 55.0 },
      { month: 'Jul', value: 56.2 },
      { month: 'Aug', value: 57.5 },
      { month: 'Sep', value: 58.8 },
      { month: 'Oct', value: 60.0 },
      { month: 'Nov', value: 61.2 },
      { month: 'Dec', value: 62.5 },
    ],
    unit: 'percent',
  },
  {
    id: 'trend_total_test_cases',
    name: 'Total Test Cases',
    data: [
      { month: 'Jan', value: 30200 },
      { month: 'Feb', value: 31050 },
      { month: 'Mar', value: 31900 },
      { month: 'Apr', value: 32800 },
      { month: 'May', value: 33650 },
      { month: 'Jun', value: 34500 },
      { month: 'Jul', value: 35200 },
      { month: 'Aug', value: 35900 },
      { month: 'Sep', value: 36700 },
      { month: 'Oct', value: 37400 },
      { month: 'Nov', value: 38100 },
      { month: 'Dec', value: 38680 },
    ],
    unit: 'count',
  },
];

/**
 * Mock segment breakdown data for the executive dashboard.
 * @type {SegmentBreakdown[]}
 */
const segmentBreakdowns = [
  {
    segment: 'Enterprise',
    totalTestCases: 14040,
    passRate: 93.5,
    automationCoverage: 89.2,
    defectDensity: 1.5,
    qualityScore: 92.8,
    releaseReadiness: 83.3,
    status: MEASURE_STATUS.ON_TRACK,
  },
  {
    segment: 'Medicare',
    totalTestCases: 10980,
    passRate: 89.8,
    automationCoverage: 85.7,
    defectDensity: 2.1,
    qualityScore: 89.5,
    releaseReadiness: 71.4,
    status: MEASURE_STATUS.ON_TRACK,
  },
  {
    segment: 'Medicaid',
    totalTestCases: 6600,
    passRate: 78.2,
    automationCoverage: 75.7,
    defectDensity: 3.4,
    qualityScore: 78.4,
    releaseReadiness: 25.0,
    status: MEASURE_STATUS.AT_RISK,
  },
  {
    segment: 'Commercial',
    totalTestCases: 7880,
    passRate: 91.2,
    automationCoverage: 86.1,
    defectDensity: 1.8,
    qualityScore: 90.3,
    releaseReadiness: 80.0,
    status: MEASURE_STATUS.ON_TRACK,
  },
  {
    segment: 'External',
    totalTestCases: 3180,
    passRate: 68.5,
    automationCoverage: 67.2,
    defectDensity: 4.8,
    qualityScore: 69.5,
    releaseReadiness: 0.0,
    status: MEASURE_STATUS.CRITICAL,
  },
  {
    segment: 'Compliance',
    totalTestCases: 4150,
    passRate: 97.8,
    automationCoverage: 92.6,
    defectDensity: 0.8,
    qualityScore: 95.6,
    releaseReadiness: 100.0,
    status: MEASURE_STATUS.ON_TRACK,
  },
];

/**
 * Mock risk distribution data for the executive dashboard.
 * @type {RiskDistribution[]}
 */
const riskDistributions = [
  {
    level: 'low',
    count: 8,
    percentage: 33.3,
    applications: [
      'app_member_portal',
      'app_provider_directory',
      'app_notification_hub',
      'app_broker_portal',
      'app_wellness_platform',
      'app_audit_tracker',
      'app_compliance_dashboard',
      'app_risk_assessment',
    ],
  },
  {
    level: 'medium',
    count: 9,
    percentage: 37.5,
    applications: [
      'app_claims_engine',
      'app_data_warehouse',
      'app_star_ratings',
      'app_part_d_formulary',
      'app_benefits_admin',
      'app_provider_network',
      'app_group_enrollment',
      'app_individual_marketplace',
      'app_underwriting_engine',
      'app_care_management',
      'app_external_data_feed',
    ],
  },
  {
    level: 'high',
    count: 5,
    percentage: 20.8,
    applications: [
      'app_auth_service',
      'app_medicare_enrollment',
      'app_hedis_engine',
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_partner_api_gateway',
      'app_vendor_integration',
    ],
  },
  {
    level: 'critical',
    count: 2,
    percentage: 8.3,
    applications: [
      'app_partner_api_gateway',
      'app_vendor_integration',
    ],
  },
];

/**
 * Mock quality status summary data for the executive dashboard.
 * @type {QualityStatusSummary[]}
 */
const qualityStatusSummaries = [
  {
    status: MEASURE_STATUS.ON_TRACK,
    count: 16,
    percentage: 66.7,
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_provider_directory',
      'app_auth_service',
      'app_data_warehouse',
      'app_notification_hub',
      'app_medicare_enrollment',
      'app_star_ratings',
      'app_part_d_formulary',
      'app_benefits_admin',
      'app_provider_network',
      'app_group_enrollment',
      'app_individual_marketplace',
      'app_broker_portal',
      'app_underwriting_engine',
      'app_wellness_platform',
    ],
  },
  {
    status: MEASURE_STATUS.AT_RISK,
    count: 4,
    percentage: 16.7,
    applications: [
      'app_hedis_engine',
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_care_management',
      'app_external_data_feed',
    ],
  },
  {
    status: MEASURE_STATUS.CRITICAL,
    count: 2,
    percentage: 8.3,
    applications: [
      'app_partner_api_gateway',
      'app_vendor_integration',
    ],
  },
  {
    status: MEASURE_STATUS.COMPLETED,
    count: 0,
    percentage: 0,
    applications: [],
  },
  {
    status: MEASURE_STATUS.NOT_STARTED,
    count: 0,
    percentage: 0,
    applications: [],
  },
];

/**
 * Combined dashboard metrics object.
 * @type {DashboardMetrics}
 */
const dashboardMetrics = {
  kpis,
  trendMetrics,
  segmentBreakdowns,
  riskDistributions,
  qualityStatusSummaries,
};

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all dashboard metrics.
 *
 * @returns {DashboardMetrics} The complete dashboard metrics object
 */
export function getAllDashboardMetrics() {
  return {
    kpis: [...kpis],
    trendMetrics: [...trendMetrics],
    segmentBreakdowns: [...segmentBreakdowns],
    riskDistributions: [...riskDistributions],
    qualityStatusSummaries: [...qualityStatusSummaries],
  };
}

// ---------------------------------------------------------------------------
// KPI accessors
// ---------------------------------------------------------------------------

/**
 * Returns all KPIs.
 *
 * @returns {KPI[]} Array of all KPI objects
 */
export function getAllKPIs() {
  return [...kpis];
}

/**
 * Retrieves a single KPI by its unique ID.
 *
 * @param {string} kpiId - The KPI identifier to look up
 * @returns {KPI|null} The matching KPI object, or null if not found
 */
export function getKPIById(kpiId) {
  if (!kpiId || typeof kpiId !== 'string') {
    return null;
  }
  return kpis.find((k) => k.id === kpiId) || null;
}

/**
 * Returns all KPIs filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {KPI[]} Array of KPIs matching the specified status
 */
export function getKPIsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return kpis.filter((k) => k.status === status);
}

/**
 * Returns all KPIs filtered by trend.
 *
 * @param {string} trend - The trend to filter by (e.g. 'improving', 'declining', 'stable')
 * @returns {KPI[]} Array of KPIs matching the specified trend
 */
export function getKPIsByTrend(trend) {
  if (!trend || typeof trend !== 'string') {
    return [];
  }
  return kpis.filter((k) => k.trend === trend);
}

// ---------------------------------------------------------------------------
// Trend metric accessors
// ---------------------------------------------------------------------------

/**
 * Returns all trend metrics.
 *
 * @returns {TrendMetric[]} Array of all trend metric objects
 */
export function getAllTrendMetrics() {
  return [...trendMetrics];
}

/**
 * Retrieves a single trend metric by its unique ID.
 *
 * @param {string} trendId - The trend metric identifier to look up
 * @returns {TrendMetric|null} The matching trend metric object, or null if not found
 */
export function getTrendMetricById(trendId) {
  if (!trendId || typeof trendId !== 'string') {
    return null;
  }
  return trendMetrics.find((t) => t.id === trendId) || null;
}

/**
 * Retrieves a trend metric by its display name.
 *
 * @param {string} name - The trend metric name to look up
 * @returns {TrendMetric|null} The matching trend metric object, or null if not found
 */
export function getTrendMetricByName(name) {
  if (!name || typeof name !== 'string') {
    return null;
  }
  return trendMetrics.find((t) => t.name === name) || null;
}

// ---------------------------------------------------------------------------
// Segment breakdown accessors
// ---------------------------------------------------------------------------

/**
 * Returns all segment breakdowns.
 *
 * @returns {SegmentBreakdown[]} Array of all segment breakdown objects
 */
export function getAllSegmentBreakdowns() {
  return [...segmentBreakdowns];
}

/**
 * Retrieves a single segment breakdown by segment name.
 *
 * @param {string} segment - The segment name to look up
 * @returns {SegmentBreakdown|null} The matching segment breakdown object, or null if not found
 */
export function getSegmentBreakdownByName(segment) {
  if (!segment || typeof segment !== 'string') {
    return null;
  }
  return segmentBreakdowns.find((s) => s.segment === segment) || null;
}

/**
 * Returns all segment breakdowns filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {SegmentBreakdown[]} Array of segment breakdowns matching the specified status
 */
export function getSegmentBreakdownsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return segmentBreakdowns.filter((s) => s.status === status);
}

// ---------------------------------------------------------------------------
// Risk distribution accessors
// ---------------------------------------------------------------------------

/**
 * Returns all risk distributions.
 *
 * @returns {RiskDistribution[]} Array of all risk distribution objects
 */
export function getAllRiskDistributions() {
  return [...riskDistributions];
}

/**
 * Retrieves a single risk distribution by risk level.
 *
 * @param {string} level - The risk level to look up (e.g. 'low', 'medium', 'high', 'critical')
 * @returns {RiskDistribution|null} The matching risk distribution object, or null if not found
 */
export function getRiskDistributionByLevel(level) {
  if (!level || typeof level !== 'string') {
    return null;
  }
  return riskDistributions.find((r) => r.level === level) || null;
}

// ---------------------------------------------------------------------------
// Quality status summary accessors
// ---------------------------------------------------------------------------

/**
 * Returns all quality status summaries.
 *
 * @returns {QualityStatusSummary[]} Array of all quality status summary objects
 */
export function getAllQualityStatusSummaries() {
  return [...qualityStatusSummaries];
}

/**
 * Retrieves a single quality status summary by status.
 *
 * @param {string} status - The quality status to look up
 * @returns {QualityStatusSummary|null} The matching quality status summary object, or null if not found
 */
export function getQualityStatusSummaryByStatus(status) {
  if (!status || typeof status !== 'string') {
    return null;
  }
  return qualityStatusSummaries.find((q) => q.status === status) || null;
}

// ---------------------------------------------------------------------------
// Aggregate statistics
// ---------------------------------------------------------------------------

/**
 * Returns aggregate statistics across all dashboard metrics.
 *
 * @returns {{ totalKPIs: number, kpisOnTrack: number, kpisAtRisk: number, kpisCritical: number, totalSegments: number, averagePassRate: number, averageAutomationCoverage: number, averageQualityScore: number, averageDefectDensity: number, averageReleaseReadiness: number, totalApplicationsAtRisk: number, totalApplicationsCritical: number }} Aggregate dashboard statistics
 */
export function getDashboardAggregates() {
  const totalKPIs = kpis.length;
  const kpisOnTrack = kpis.filter((k) => k.status === MEASURE_STATUS.ON_TRACK).length;
  const kpisAtRisk = kpis.filter((k) => k.status === MEASURE_STATUS.AT_RISK).length;
  const kpisCritical = kpis.filter((k) => k.status === MEASURE_STATUS.CRITICAL).length;

  const totalSegments = segmentBreakdowns.length;

  const averagePassRate =
    totalSegments > 0
      ? Math.round((segmentBreakdowns.reduce((sum, s) => sum + s.passRate, 0) / totalSegments) * 10) / 10
      : 0;

  const averageAutomationCoverage =
    totalSegments > 0
      ? Math.round((segmentBreakdowns.reduce((sum, s) => sum + s.automationCoverage, 0) / totalSegments) * 10) / 10
      : 0;

  const averageQualityScore =
    totalSegments > 0
      ? Math.round((segmentBreakdowns.reduce((sum, s) => sum + s.qualityScore, 0) / totalSegments) * 10) / 10
      : 0;

  const averageDefectDensity =
    totalSegments > 0
      ? Math.round((segmentBreakdowns.reduce((sum, s) => sum + s.defectDensity, 0) / totalSegments) * 10) / 10
      : 0;

  const averageReleaseReadiness =
    totalSegments > 0
      ? Math.round((segmentBreakdowns.reduce((sum, s) => sum + s.releaseReadiness, 0) / totalSegments) * 10) / 10
      : 0;

  const atRiskSummary = qualityStatusSummaries.find((q) => q.status === MEASURE_STATUS.AT_RISK);
  const criticalSummary = qualityStatusSummaries.find((q) => q.status === MEASURE_STATUS.CRITICAL);

  const totalApplicationsAtRisk = atRiskSummary ? atRiskSummary.count : 0;
  const totalApplicationsCritical = criticalSummary ? criticalSummary.count : 0;

  return {
    totalKPIs,
    kpisOnTrack,
    kpisAtRisk,
    kpisCritical,
    totalSegments,
    averagePassRate,
    averageAutomationCoverage,
    averageQualityScore,
    averageDefectDensity,
    averageReleaseReadiness,
    totalApplicationsAtRisk,
    totalApplicationsCritical,
  };
}

/**
 * Returns all unique KPI unit types.
 *
 * @returns {string[]} Array of unique unit types sorted alphabetically
 */
export function getAllKPIUnits() {
  const units = new Set(kpis.map((k) => k.unit));
  return [...units].sort();
}

/**
 * Returns all unique risk levels.
 *
 * @returns {string[]} Array of unique risk levels
 */
export function getAllRiskLevels() {
  return ['low', 'medium', 'high', 'critical'];
}

/**
 * Returns all unique segment names from the breakdowns.
 *
 * @returns {string[]} Array of unique segment names sorted alphabetically
 */
export function getAllDashboardSegments() {
  return segmentBreakdowns.map((s) => s.segment).sort();
}

export default dashboardMetrics;