import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} ProductionHealthMetric
 * @property {string} id - Unique metric identifier
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {string} metricType - Metric type (uptime, error_rate, response_time, throughput, cpu_utilization, memory_utilization, disk_io)
 * @property {number} currentValue - Current metric value
 * @property {number} threshold - Alert threshold value
 * @property {string} unit - Unit of measurement (percent, milliseconds, requests_per_second, percent_cpu, percent_memory, mbps)
 * @property {string} status - Metric status (healthy, degraded, critical)
 * @property {string} trend - Trend direction (improving, declining, stable)
 * @property {{ timestamp: string, value: number }[]} history - Recent metric history data points
 * @property {string} lastUpdated - Last update timestamp in ISO format
 */

/**
 * @typedef {Object} ReleaseOutcome
 * @property {string} id - Unique release outcome identifier
 * @property {string} releaseId - Reference to the release ID
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {string} version - Release version string
 * @property {string} deployedAt - Deployment timestamp in ISO format
 * @property {string} deployedBy - Name of the person who deployed
 * @property {string} environment - Deployment environment
 * @property {string} outcome - Deployment outcome (success, partial_success, rollback, failed)
 * @property {number} qualityScore - Quality score at time of deployment (0-100)
 * @property {number} preDeployTestPassRate - Pre-deployment test pass rate percentage (0-100)
 * @property {number} postDeployTestPassRate - Post-deployment smoke test pass rate percentage (0-100)
 * @property {number} incidentCount - Number of incidents within 72 hours post-deployment
 * @property {number} rollbackTimeMinutes - Time to rollback in minutes (0 if no rollback)
 * @property {number} mttrMinutes - Mean time to recovery in minutes (0 if no incidents)
 * @property {string} changeFailureCategory - Change failure category (none, minor, major, critical)
 * @property {string[]} postDeployIssues - Array of post-deployment issue descriptions
 * @property {string} stabilizationStatus - Stabilization status (stable, monitoring, unstable, rolled_back)
 * @property {string} stabilizedAt - Stabilization timestamp in ISO format (empty string if not yet stabilized)
 * @property {{ metric: string, before: number, after: number, unit: string }[]} performanceComparison - Pre vs post deployment performance comparison
 */

/**
 * @typedef {Object} IncidentCorrelation
 * @property {string} id - Unique incident correlation identifier
 * @property {string} incidentId - Incident ticket identifier
 * @property {string} severity - Incident severity (P1, P2, P3, P4)
 * @property {string} title - Incident title
 * @property {string} description - Incident description
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {string} detectedAt - Detection timestamp in ISO format
 * @property {string} resolvedAt - Resolution timestamp in ISO format (empty string if unresolved)
 * @property {number} durationMinutes - Incident duration in minutes (0 if unresolved)
 * @property {string} rootCause - Root cause description
 * @property {string} correlatedReleaseId - Correlated release ID (empty string if not release-related)
 * @property {string} correlatedReleaseVersion - Correlated release version (empty string if not release-related)
 * @property {boolean} isReleaseRelated - Whether the incident is correlated with a release
 * @property {string} impactScope - Impact scope (single_service, multi_service, segment_wide, platform_wide)
 * @property {number} affectedUsers - Estimated number of affected users
 * @property {string[]} mitigationActions - Array of mitigation actions taken
 * @property {string} status - Incident status (open, investigating, mitigated, resolved, closed)
 * @property {string} assignee - Name of the person assigned to the incident
 */

/**
 * @typedef {Object} QualityFeedbackLoop
 * @property {string} id - Unique feedback loop identifier
 * @property {string} application - Application ID
 * @property {string} applicationName - Display name of the application
 * @property {string} segment - Organizational segment
 * @property {string} releaseId - Reference to the release ID
 * @property {string} releaseVersion - Release version string
 * @property {string} feedbackType - Feedback type (defect_escape, test_gap, process_improvement, automation_opportunity, monitoring_gap, documentation_gap)
 * @property {string} priority - Priority level (critical, high, medium, low)
 * @property {string} title - Feedback title
 * @property {string} description - Detailed description of the feedback
 * @property {string} source - Feedback source (production_incident, monitoring_alert, user_report, automated_analysis, post_mortem, quality_review)
 * @property {string} identifiedAt - Identification timestamp in ISO format
 * @property {string} status - Feedback status (new, acknowledged, in_progress, implemented, deferred, dismissed)
 * @property {string} assignee - Name of the person assigned to address the feedback
 * @property {string} resolution - Resolution description (empty string if not resolved)
 * @property {string} resolvedAt - Resolution timestamp in ISO format (empty string if not resolved)
 * @property {string[]} actionItems - Array of action items derived from the feedback
 * @property {string[]} relatedTestCases - Array of related test case IDs
 * @property {string[]} relatedDefects - Array of related defect IDs
 * @property {number} estimatedImpact - Estimated impact score (1-10)
 */

/**
 * @typedef {Object} PostDeploymentData
 * @property {ProductionHealthMetric[]} productionHealthMetrics - Array of production health metrics
 * @property {ReleaseOutcome[]} releaseOutcomes - Array of release outcomes
 * @property {IncidentCorrelation[]} incidentCorrelations - Array of incident correlations
 * @property {QualityFeedbackLoop[]} qualityFeedbackLoops - Array of quality feedback loops
 */

/**
 * Mock production health metrics for the EQIP Quality Platform.
 * @type {ProductionHealthMetric[]}
 */
const productionHealthMetrics = [
  {
    id: 'phm_001',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    metricType: 'uptime',
    currentValue: 99.95,
    threshold: 99.9,
    unit: 'percent',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.95 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.96 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.94 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.95 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.97 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.95 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_002',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    metricType: 'response_time',
    currentValue: 145,
    threshold: 500,
    unit: 'milliseconds',
    status: 'healthy',
    trend: 'improving',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 145 },
      { timestamp: '2024-12-12T08:00:00Z', value: 152 },
      { timestamp: '2024-12-12T04:00:00Z', value: 138 },
      { timestamp: '2024-12-12T00:00:00Z', value: 160 },
      { timestamp: '2024-12-11T20:00:00Z', value: 155 },
      { timestamp: '2024-12-11T16:00:00Z', value: 148 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_003',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    metricType: 'error_rate',
    currentValue: 0.12,
    threshold: 1.0,
    unit: 'percent',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 0.12 },
      { timestamp: '2024-12-12T08:00:00Z', value: 0.14 },
      { timestamp: '2024-12-12T04:00:00Z', value: 0.10 },
      { timestamp: '2024-12-12T00:00:00Z', value: 0.11 },
      { timestamp: '2024-12-11T20:00:00Z', value: 0.13 },
      { timestamp: '2024-12-11T16:00:00Z', value: 0.15 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_004',
    application: 'app_member_portal',
    applicationName: 'Member Portal',
    segment: 'Enterprise',
    metricType: 'uptime',
    currentValue: 99.98,
    threshold: 99.9,
    unit: 'percent',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.98 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.99 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.98 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.97 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.99 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.98 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_005',
    application: 'app_member_portal',
    applicationName: 'Member Portal',
    segment: 'Enterprise',
    metricType: 'response_time',
    currentValue: 85,
    threshold: 2000,
    unit: 'milliseconds',
    status: 'healthy',
    trend: 'improving',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 85 },
      { timestamp: '2024-12-12T08:00:00Z', value: 92 },
      { timestamp: '2024-12-12T04:00:00Z', value: 78 },
      { timestamp: '2024-12-12T00:00:00Z', value: 88 },
      { timestamp: '2024-12-11T20:00:00Z', value: 95 },
      { timestamp: '2024-12-11T16:00:00Z', value: 90 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_006',
    application: 'app_auth_service',
    applicationName: 'Authentication Service',
    segment: 'Enterprise',
    metricType: 'uptime',
    currentValue: 99.99,
    threshold: 99.95,
    unit: 'percent',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.99 },
      { timestamp: '2024-12-12T08:00:00Z', value: 100.0 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.99 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.99 },
      { timestamp: '2024-12-11T20:00:00Z', value: 100.0 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.99 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_007',
    application: 'app_auth_service',
    applicationName: 'Authentication Service',
    segment: 'Enterprise',
    metricType: 'response_time',
    currentValue: 28,
    threshold: 200,
    unit: 'milliseconds',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 28 },
      { timestamp: '2024-12-12T08:00:00Z', value: 30 },
      { timestamp: '2024-12-12T04:00:00Z', value: 25 },
      { timestamp: '2024-12-12T00:00:00Z', value: 27 },
      { timestamp: '2024-12-11T20:00:00Z', value: 29 },
      { timestamp: '2024-12-11T16:00:00Z', value: 26 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_008',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    metricType: 'uptime',
    currentValue: 99.85,
    threshold: 99.9,
    unit: 'percent',
    status: 'degraded',
    trend: 'declining',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.85 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.88 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.82 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.90 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.92 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.91 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_009',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    metricType: 'throughput',
    currentValue: 1250,
    threshold: 1000,
    unit: 'requests_per_second',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 1250 },
      { timestamp: '2024-12-12T08:00:00Z', value: 1180 },
      { timestamp: '2024-12-12T04:00:00Z', value: 1320 },
      { timestamp: '2024-12-12T00:00:00Z', value: 1200 },
      { timestamp: '2024-12-11T20:00:00Z', value: 1280 },
      { timestamp: '2024-12-11T16:00:00Z', value: 1240 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_010',
    application: 'app_medicare_enrollment',
    applicationName: 'Medicare Enrollment System',
    segment: 'Medicare',
    metricType: 'uptime',
    currentValue: 99.94,
    threshold: 99.9,
    unit: 'percent',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.94 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.95 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.93 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.94 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.96 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.95 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_011',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    metricType: 'uptime',
    currentValue: 99.72,
    threshold: 99.9,
    unit: 'percent',
    status: 'degraded',
    trend: 'declining',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.72 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.75 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.68 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.78 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.80 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.82 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_012',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    metricType: 'response_time',
    currentValue: 680,
    threshold: 500,
    unit: 'milliseconds',
    status: 'critical',
    trend: 'declining',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 680 },
      { timestamp: '2024-12-12T08:00:00Z', value: 620 },
      { timestamp: '2024-12-12T04:00:00Z', value: 550 },
      { timestamp: '2024-12-12T00:00:00Z', value: 510 },
      { timestamp: '2024-12-11T20:00:00Z', value: 480 },
      { timestamp: '2024-12-11T16:00:00Z', value: 450 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_013',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    metricType: 'error_rate',
    currentValue: 2.8,
    threshold: 1.0,
    unit: 'percent',
    status: 'critical',
    trend: 'declining',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 2.8 },
      { timestamp: '2024-12-12T08:00:00Z', value: 2.4 },
      { timestamp: '2024-12-12T04:00:00Z', value: 1.9 },
      { timestamp: '2024-12-12T00:00:00Z', value: 1.5 },
      { timestamp: '2024-12-11T20:00:00Z', value: 1.2 },
      { timestamp: '2024-12-11T16:00:00Z', value: 0.9 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_014',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    metricType: 'uptime',
    currentValue: 99.65,
    threshold: 99.9,
    unit: 'percent',
    status: 'critical',
    trend: 'declining',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.65 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.68 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.60 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.70 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.72 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.75 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_015',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    metricType: 'response_time',
    currentValue: 280,
    threshold: 300,
    unit: 'milliseconds',
    status: 'degraded',
    trend: 'declining',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 280 },
      { timestamp: '2024-12-12T08:00:00Z', value: 260 },
      { timestamp: '2024-12-12T04:00:00Z', value: 240 },
      { timestamp: '2024-12-12T00:00:00Z', value: 220 },
      { timestamp: '2024-12-11T20:00:00Z', value: 200 },
      { timestamp: '2024-12-11T16:00:00Z', value: 185 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_016',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    metricType: 'uptime',
    currentValue: 99.82,
    threshold: 99.9,
    unit: 'percent',
    status: 'degraded',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.82 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.84 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.80 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.83 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.81 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.82 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_017',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    metricType: 'error_rate',
    currentValue: 0.85,
    threshold: 1.0,
    unit: 'percent',
    status: 'degraded',
    trend: 'declining',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 0.85 },
      { timestamp: '2024-12-12T08:00:00Z', value: 0.78 },
      { timestamp: '2024-12-12T04:00:00Z', value: 0.72 },
      { timestamp: '2024-12-12T00:00:00Z', value: 0.65 },
      { timestamp: '2024-12-11T20:00:00Z', value: 0.60 },
      { timestamp: '2024-12-11T16:00:00Z', value: 0.55 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_018',
    application: 'app_compliance_dashboard',
    applicationName: 'Compliance Dashboard',
    segment: 'Compliance',
    metricType: 'uptime',
    currentValue: 99.98,
    threshold: 99.9,
    unit: 'percent',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.98 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.99 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.98 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.98 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.99 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.98 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_019',
    application: 'app_broker_portal',
    applicationName: 'Broker Portal',
    segment: 'Commercial',
    metricType: 'uptime',
    currentValue: 99.94,
    threshold: 99.9,
    unit: 'percent',
    status: 'healthy',
    trend: 'stable',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 99.94 },
      { timestamp: '2024-12-12T08:00:00Z', value: 99.95 },
      { timestamp: '2024-12-12T04:00:00Z', value: 99.93 },
      { timestamp: '2024-12-12T00:00:00Z', value: 99.94 },
      { timestamp: '2024-12-11T20:00:00Z', value: 99.96 },
      { timestamp: '2024-12-11T16:00:00Z', value: 99.95 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
  {
    id: 'phm_020',
    application: 'app_broker_portal',
    applicationName: 'Broker Portal',
    segment: 'Commercial',
    metricType: 'response_time',
    currentValue: 110,
    threshold: 500,
    unit: 'milliseconds',
    status: 'healthy',
    trend: 'improving',
    history: [
      { timestamp: '2024-12-12T12:00:00Z', value: 110 },
      { timestamp: '2024-12-12T08:00:00Z', value: 118 },
      { timestamp: '2024-12-12T04:00:00Z', value: 105 },
      { timestamp: '2024-12-12T00:00:00Z', value: 120 },
      { timestamp: '2024-12-11T20:00:00Z', value: 125 },
      { timestamp: '2024-12-11T16:00:00Z', value: 115 },
    ],
    lastUpdated: '2024-12-12T14:55:00Z',
  },
];

/**
 * Mock release outcome data for the EQIP Quality Platform.
 * @type {ReleaseOutcome[]}
 */
const releaseOutcomes = [
  {
    id: 'ro_001',
    releaseId: 'rel_claims_034',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    version: '4.12.0',
    deployedAt: '2024-12-10T16:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 94.2,
    preDeployTestPassRate: 98.4,
    postDeployTestPassRate: 99.1,
    incidentCount: 0,
    rollbackTimeMinutes: 0,
    mttrMinutes: 0,
    changeFailureCategory: 'none',
    postDeployIssues: [],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-12-10T17:30:00Z',
    performanceComparison: [
      { metric: 'Response Time (p95)', before: 155, after: 145, unit: 'ms' },
      { metric: 'Error Rate', before: 0.15, after: 0.12, unit: '%' },
      { metric: 'Throughput', before: 340, after: 354, unit: 'claims/min' },
      { metric: 'CPU Utilization', before: 62, after: 58, unit: '%' },
    ],
  },
  {
    id: 'ro_002',
    releaseId: 'rel_member_028',
    application: 'app_member_portal',
    applicationName: 'Member Portal',
    segment: 'Enterprise',
    version: '3.8.0',
    deployedAt: '2024-12-12T10:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 96.5,
    preDeployTestPassRate: 99.2,
    postDeployTestPassRate: 99.5,
    incidentCount: 0,
    rollbackTimeMinutes: 0,
    mttrMinutes: 0,
    changeFailureCategory: 'none',
    postDeployIssues: [],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-12-12T11:15:00Z',
    performanceComparison: [
      { metric: 'Page Load Time (p95)', before: 1.8, after: 1.5, unit: 's' },
      { metric: 'Error Rate', before: 0.08, after: 0.06, unit: '%' },
      { metric: 'Core Web Vitals LCP', before: 2.1, after: 1.8, unit: 's' },
      { metric: 'Memory Utilization', before: 68, after: 65, unit: '%' },
    ],
  },
  {
    id: 'ro_003',
    releaseId: 'rel_medicare_026',
    application: 'app_medicare_enrollment',
    applicationName: 'Medicare Enrollment System',
    segment: 'Medicare',
    version: '6.4.0',
    deployedAt: '2024-12-11T18:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 91.8,
    preDeployTestPassRate: 97.3,
    postDeployTestPassRate: 98.0,
    incidentCount: 0,
    rollbackTimeMinutes: 0,
    mttrMinutes: 0,
    changeFailureCategory: 'none',
    postDeployIssues: [],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-12-11T19:45:00Z',
    performanceComparison: [
      { metric: 'Enrollment Processing Time', before: 3.2, after: 2.8, unit: 's' },
      { metric: 'Error Rate', before: 0.22, after: 0.18, unit: '%' },
      { metric: 'Batch Throughput', before: 420, after: 445, unit: 'enrollments/min' },
      { metric: 'CPU Utilization', before: 55, after: 52, unit: '%' },
    ],
  },
  {
    id: 'ro_004',
    releaseId: 'rel_hedis_020',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    version: '4.6.0',
    deployedAt: '2024-12-04T20:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'partial_success',
    qualityScore: 84.5,
    preDeployTestPassRate: 91.4,
    postDeployTestPassRate: 88.5,
    incidentCount: 2,
    rollbackTimeMinutes: 0,
    mttrMinutes: 45,
    changeFailureCategory: 'minor',
    postDeployIssues: [
      'BCS measure calculation rate deviation of 1.8% detected in production monitoring',
      'Full population processing time exceeded 4-hour SLA by 45 minutes during first nightly run',
      'Supplemental data linkage rate dropped to 94.2% from pre-deployment 96.5%',
    ],
    stabilizationStatus: 'monitoring',
    stabilizedAt: '',
    performanceComparison: [
      { metric: 'Full Population Processing', before: 240, after: 285, unit: 'min' },
      { metric: 'Error Rate', before: 0.35, after: 0.52, unit: '%' },
      { metric: 'Memory Utilization', before: 72, after: 85, unit: '%' },
      { metric: 'Data Linkage Rate', before: 96.5, after: 94.2, unit: '%' },
    ],
  },
  {
    id: 'ro_005',
    releaseId: 'rel_api_gw_011',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    version: '1.7.0',
    deployedAt: '2024-11-25T22:00:00Z',
    deployedBy: 'Daniel Robinson',
    environment: 'Production',
    outcome: 'partial_success',
    qualityScore: 72.3,
    preDeployTestPassRate: 89.5,
    postDeployTestPassRate: 85.2,
    incidentCount: 3,
    rollbackTimeMinutes: 0,
    mttrMinutes: 120,
    changeFailureCategory: 'major',
    postDeployIssues: [
      'Response time degradation to 2.3s under sustained load detected within 4 hours of deployment',
      'Rate limiting accuracy issue allowing 8.7% excess requests at window boundaries',
      'OAuth scope enforcement confirmed disabled in production configuration',
      'Partner onboarding workflow timeout errors reported by 2 integration partners',
    ],
    stabilizationStatus: 'unstable',
    stabilizedAt: '',
    performanceComparison: [
      { metric: 'Response Time (p95)', before: 380, after: 680, unit: 'ms' },
      { metric: 'Error Rate', before: 1.5, after: 2.8, unit: '%' },
      { metric: 'Rate Limit Accuracy', before: 95.2, after: 91.3, unit: '%' },
      { metric: 'CPU Utilization', before: 45, after: 72, unit: '%' },
    ],
  },
  {
    id: 'ro_006',
    releaseId: 'rel_api_gw_010',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    version: '1.6.2',
    deployedAt: '2024-11-05T23:00:00Z',
    deployedBy: 'Daniel Robinson',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 70.1,
    preDeployTestPassRate: 88.5,
    postDeployTestPassRate: 90.2,
    incidentCount: 1,
    rollbackTimeMinutes: 0,
    mttrMinutes: 35,
    changeFailureCategory: 'minor',
    postDeployIssues: [
      'Transient connection pool exhaustion during first 30 minutes post-deployment resolved by auto-scaling',
    ],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-11-06T00:30:00Z',
    performanceComparison: [
      { metric: 'Response Time (p95)', before: 520, after: 380, unit: 'ms' },
      { metric: 'Error Rate', before: 3.2, after: 1.5, unit: '%' },
      { metric: 'Timeout Rate', before: 2.1, after: 0.3, unit: '%' },
      { metric: 'CPU Utilization', before: 68, after: 45, unit: '%' },
    ],
  },
  {
    id: 'ro_007',
    releaseId: 'rel_vendor_009',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    version: '1.5.0',
    deployedAt: '2024-11-18T21:00:00Z',
    deployedBy: 'Daniel Robinson',
    environment: 'Production',
    outcome: 'partial_success',
    qualityScore: 65.8,
    preDeployTestPassRate: 83.8,
    postDeployTestPassRate: 80.5,
    incidentCount: 4,
    rollbackTimeMinutes: 0,
    mttrMinutes: 180,
    changeFailureCategory: 'major',
    postDeployIssues: [
      'New lab vendor integration failed to authenticate in production due to certificate mismatch',
      'Pharmacy data feed error recovery not triggering alerts for dead letter queue items',
      'TLS 1.1 connections still accepted in production despite security remediation intent',
      'BAA validation logging as warning instead of blocking non-compliant vendor exchanges',
      'Data reconciliation discrepancies detected for 3 vendor feeds within 24 hours',
    ],
    stabilizationStatus: 'unstable',
    stabilizedAt: '',
    performanceComparison: [
      { metric: 'Response Time (p95)', before: 185, after: 280, unit: 'ms' },
      { metric: 'Error Rate', before: 1.8, after: 3.5, unit: '%' },
      { metric: 'Feed Processing Success Rate', before: 96.2, after: 91.8, unit: '%' },
      { metric: 'Data Reconciliation Match Rate', before: 98.5, after: 94.2, unit: '%' },
    ],
  },
  {
    id: 'ro_008',
    releaseId: 'rel_notif_012',
    application: 'app_notification_hub',
    applicationName: 'Notification Hub',
    segment: 'Enterprise',
    version: '1.9.0',
    deployedAt: '2024-12-09T16:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 95.4,
    preDeployTestPassRate: 98.2,
    postDeployTestPassRate: 99.0,
    incidentCount: 0,
    rollbackTimeMinutes: 0,
    mttrMinutes: 0,
    changeFailureCategory: 'none',
    postDeployIssues: [],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-12-09T17:00:00Z',
    performanceComparison: [
      { metric: 'Delivery Latency (p95)', before: 1.2, after: 0.9, unit: 's' },
      { metric: 'Error Rate', before: 0.05, after: 0.03, unit: '%' },
      { metric: 'Batch Throughput', before: 2100, after: 2350, unit: 'notifications/min' },
      { metric: 'Memory Utilization', before: 58, after: 55, unit: '%' },
    ],
  },
  {
    id: 'ro_009',
    releaseId: 'rel_wellness_012',
    application: 'app_wellness_platform',
    applicationName: 'Wellness Platform',
    segment: 'Commercial',
    version: '2.1.0',
    deployedAt: '2024-12-11T15:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 94.8,
    preDeployTestPassRate: 98.2,
    postDeployTestPassRate: 98.8,
    incidentCount: 0,
    rollbackTimeMinutes: 0,
    mttrMinutes: 0,
    changeFailureCategory: 'none',
    postDeployIssues: [],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-12-11T16:00:00Z',
    performanceComparison: [
      { metric: 'Page Load Time (p95)', before: 1.5, after: 1.3, unit: 's' },
      { metric: 'Error Rate', before: 0.06, after: 0.04, unit: '%' },
      { metric: 'API Response Time', before: 120, after: 105, unit: 'ms' },
      { metric: 'Memory Utilization', before: 52, after: 50, unit: '%' },
    ],
  },
  {
    id: 'ro_010',
    releaseId: 'rel_medicaid_elig_018',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    version: '3.9.0',
    deployedAt: '2024-12-01T20:00:00Z',
    deployedBy: 'Daniel Robinson',
    environment: 'Production',
    outcome: 'partial_success',
    qualityScore: 79.8,
    preDeployTestPassRate: 93.1,
    postDeployTestPassRate: 90.5,
    incidentCount: 2,
    rollbackTimeMinutes: 0,
    mttrMinutes: 90,
    changeFailureCategory: 'minor',
    postDeployIssues: [
      'Income threshold comparison operator error causing incorrect eligibility determinations for boundary cases',
      'Batch redetermination processing failures for 23 records with null income data from Medicaid unwinding',
    ],
    stabilizationStatus: 'monitoring',
    stabilizedAt: '',
    performanceComparison: [
      { metric: 'Determination Processing Time', before: 2.5, after: 2.8, unit: 's' },
      { metric: 'Error Rate', before: 0.55, after: 0.85, unit: '%' },
      { metric: 'Batch Success Rate', before: 99.8, after: 99.6, unit: '%' },
      { metric: 'CPU Utilization', before: 48, after: 55, unit: '%' },
    ],
  },
  {
    id: 'ro_011',
    releaseId: 'rel_auth_018',
    application: 'app_auth_service',
    applicationName: 'Authentication Service',
    segment: 'Enterprise',
    version: '5.3.0',
    deployedAt: '2024-12-05T18:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 98.1,
    preDeployTestPassRate: 99.6,
    postDeployTestPassRate: 99.8,
    incidentCount: 0,
    rollbackTimeMinutes: 0,
    mttrMinutes: 0,
    changeFailureCategory: 'none',
    postDeployIssues: [],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-12-05T18:45:00Z',
    performanceComparison: [
      { metric: 'Auth Response Time (p95)', before: 30, after: 28, unit: 'ms' },
      { metric: 'Error Rate', before: 0.02, after: 0.01, unit: '%' },
      { metric: 'Token Issuance Rate', before: 850, after: 880, unit: 'tokens/s' },
      { metric: 'MFA Success Rate', before: 99.5, after: 99.7, unit: '%' },
    ],
  },
  {
    id: 'ro_012',
    releaseId: 'rel_broker_015',
    application: 'app_broker_portal',
    applicationName: 'Broker Portal',
    segment: 'Commercial',
    version: '2.6.0',
    deployedAt: '2024-12-08T16:00:00Z',
    deployedBy: 'Amanda Garcia',
    environment: 'Production',
    outcome: 'success',
    qualityScore: 93.7,
    preDeployTestPassRate: 98.2,
    postDeployTestPassRate: 98.5,
    incidentCount: 0,
    rollbackTimeMinutes: 0,
    mttrMinutes: 0,
    changeFailureCategory: 'none',
    postDeployIssues: [],
    stabilizationStatus: 'stable',
    stabilizedAt: '2024-12-08T17:15:00Z',
    performanceComparison: [
      { metric: 'Quote Generation Time', before: 4.8, after: 4.0, unit: 's' },
      { metric: 'Error Rate', before: 0.10, after: 0.08, unit: '%' },
      { metric: 'Page Load Time (p95)', before: 1.6, after: 1.4, unit: 's' },
      { metric: 'CPU Utilization', before: 42, after: 40, unit: '%' },
    ],
  },
];

/**
 * Mock incident correlation data for the EQIP Quality Platform.
 * @type {IncidentCorrelation[]}
 */
const incidentCorrelations = [
  {
    id: 'ic_001',
    incidentId: 'INC-2024-1180',
    severity: 'P2',
    title: 'HEDIS Engine BCS Measure Rate Deviation in Production',
    description: 'Production monitoring detected a 1.8% deviation in BCS measure calculation rates compared to expected values. Bilateral mastectomy exclusion logic is not correctly handling ICD-10-PCS codes.',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    detectedAt: '2024-12-05T06:00:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'BCS measure exclusion rule missing ICD-10-PCS codes 0HTV0ZZ and 0HTU0ZZ for bilateral mastectomy. Deployed in v4.6.0 without complete exclusion logic validation.',
    correlatedReleaseId: 'rel_hedis_020',
    correlatedReleaseVersion: '4.6.0',
    isReleaseRelated: true,
    impactScope: 'single_service',
    affectedUsers: 180,
    mitigationActions: [
      'Identified root cause as missing ICD-10-PCS codes in exclusion logic',
      'Created hotfix branch with updated exclusion rule',
      'Notified Star Ratings team of potential impact on measure rates',
      'Scheduled expedited code review for exclusion logic fix',
    ],
    status: 'investigating',
    assignee: 'Lisa Johnson',
  },
  {
    id: 'ic_002',
    incidentId: 'INC-2024-1185',
    severity: 'P2',
    title: 'HEDIS Engine Full Population Processing SLA Breach',
    description: 'Nightly HEDIS full population measure calculation exceeded the 4-hour SLA by 45 minutes. CDC and CBP measures identified as primary bottlenecks accounting for 40% of total processing time.',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    detectedAt: '2024-12-05T01:45:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'CDC and CBP measures perform sequential sub-measure calculations with individual value set lookups. Memory pressure from concurrent measure execution causes JVM garbage collection pauses.',
    correlatedReleaseId: 'rel_hedis_020',
    correlatedReleaseVersion: '4.6.0',
    isReleaseRelated: true,
    impactScope: 'single_service',
    affectedUsers: 180,
    mitigationActions: [
      'Increased JVM heap allocation from 8GB to 12GB as temporary mitigation',
      'Identified CDC and CBP measures as primary bottlenecks',
      'Generated performance optimization recommendation for parallel processing',
      'Scheduled performance testing with optimized configuration',
    ],
    status: 'investigating',
    assignee: 'Marcus Thompson',
  },
  {
    id: 'ic_003',
    incidentId: 'INC-2024-1170',
    severity: 'P1',
    title: 'API Gateway Response Time Degradation Under Sustained Load',
    description: 'Partner API gateway response times degraded to 2.3 seconds under sustained load, exceeding the 500ms SLA. Multiple partner integrations reported timeout errors.',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    detectedAt: '2024-11-26T02:00:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'Synchronous rate limit counter updates blocking request processing threads. Sliding window algorithm with 5-second granularity causing over-admission at window boundaries, leading to resource contention.',
    correlatedReleaseId: 'rel_api_gw_011',
    correlatedReleaseVersion: '1.7.0',
    isReleaseRelated: true,
    impactScope: 'multi_service',
    affectedUsers: 450,
    mitigationActions: [
      'Increased connection pool size from 100 to 200 as temporary mitigation',
      'Enabled request queuing with 5-second timeout for overflow',
      'Notified affected partner integrations of degraded performance',
      'Initiated performance optimization demand (dem_004)',
    ],
    status: 'mitigated',
    assignee: 'Alex Rivera',
  },
  {
    id: 'ic_004',
    incidentId: 'INC-2024-1165',
    severity: 'P2',
    title: 'Vendor Integration Lab Vendor Authentication Failure',
    description: 'New lab vendor integration deployed in v1.5.0 failed to authenticate in production due to certificate mismatch between staging and production environments.',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    detectedAt: '2024-11-19T03:00:00Z',
    resolvedAt: '2024-11-19T08:30:00Z',
    durationMinutes: 330,
    rootCause: 'Lab vendor SSL certificate was configured for staging environment hostname. Production environment uses a different hostname that was not included in the certificate SAN list.',
    correlatedReleaseId: 'rel_vendor_009',
    correlatedReleaseVersion: '1.5.0',
    isReleaseRelated: true,
    impactScope: 'single_service',
    affectedUsers: 85,
    mitigationActions: [
      'Identified certificate hostname mismatch between staging and production',
      'Requested updated certificate from lab vendor with production hostname',
      'Installed updated certificate and verified connectivity',
      'Added certificate validation to pre-deployment checklist',
    ],
    status: 'resolved',
    assignee: 'James Wright',
  },
  {
    id: 'ic_005',
    incidentId: 'INC-2024-1168',
    severity: 'P3',
    title: 'Vendor Data Feed DLQ Alerting Not Triggering',
    description: 'Dead letter queue alerting for vendor data feed failures is not triggering notifications to the operations team. Failed feeds are accumulating in the DLQ without visibility.',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    detectedAt: '2024-11-20T10:00:00Z',
    resolvedAt: '2024-11-21T14:00:00Z',
    durationMinutes: 1680,
    rootCause: 'DLQ consumer notification endpoint URL pointing to development environment instead of production. Alert messages were being sent but to the wrong destination.',
    correlatedReleaseId: 'rel_vendor_009',
    correlatedReleaseVersion: '1.5.0',
    isReleaseRelated: true,
    impactScope: 'single_service',
    affectedUsers: 45,
    mitigationActions: [
      'Corrected DLQ consumer notification endpoint to production URL',
      'Processed accumulated DLQ items manually',
      'Added environment-specific URL validation to deployment pipeline',
      'Verified alerting pipeline with test DLQ message',
    ],
    status: 'resolved',
    assignee: 'James Wright',
  },
  {
    id: 'ic_006',
    incidentId: 'INC-2024-1195',
    severity: 'P2',
    title: 'Medicaid Eligibility Incorrect Determinations at FPL Boundary',
    description: 'Applicants at exactly 135% FPL are being incorrectly determined as ineligible for Medicaid expansion due to income threshold comparison operator error.',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    detectedAt: '2024-12-02T09:00:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'Income threshold comparison uses strict less-than operator instead of less-than-or-equal-to for the 138% FPL cutoff. Rounding issue in FPL calculation causes applicants at 135% to be evaluated against the wrong eligibility category.',
    correlatedReleaseId: 'rel_medicaid_elig_018',
    correlatedReleaseVersion: '3.9.0',
    isReleaseRelated: true,
    impactScope: 'single_service',
    affectedUsers: 890,
    mitigationActions: [
      'Identified comparison operator error in eligibility rules engine',
      'Estimated 23 applicants potentially affected since deployment',
      'Initiated manual review of affected eligibility determinations',
      'Created hotfix for income threshold comparison logic',
    ],
    status: 'investigating',
    assignee: 'Robert Kim',
  },
  {
    id: 'ic_007',
    incidentId: 'INC-2024-1205',
    severity: 'P1',
    title: 'QA Hotfix Environment Infrastructure Failure',
    description: 'QA Hotfix environment went completely offline due to infrastructure failure. All services in the environment are unreachable with health score at 0%.',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    detectedAt: '2024-12-11T22:15:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'Infrastructure failure in the QA Hotfix environment hosting cluster. Root cause under investigation — suspected storage controller failure.',
    correlatedReleaseId: '',
    correlatedReleaseVersion: '',
    isReleaseRelated: false,
    impactScope: 'single_service',
    affectedUsers: 25,
    mitigationActions: [
      'Incident ticket INC-2024-1205 opened in ServiceNow',
      'Notifications sent to environment manager and production support',
      'Hotfix validation activities redirected to QA Primary environment',
      'Infrastructure team investigating storage controller failure',
    ],
    status: 'open',
    assignee: 'Daniel Robinson',
  },
  {
    id: 'ic_008',
    incidentId: 'INC-2024-1210',
    severity: 'P2',
    title: 'Fieldglass Integration Certificate Expired',
    description: 'SAP Fieldglass integration sync failed due to expired authentication certificate for service account EQIP_FG_SVC. 2 consecutive sync failures recorded.',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    detectedAt: '2024-12-12T06:00:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'Authentication certificate for Fieldglass service account expired. Certificate renewal was not tracked in the certificate management system.',
    correlatedReleaseId: '',
    correlatedReleaseVersion: '',
    isReleaseRelated: false,
    impactScope: 'single_service',
    affectedUsers: 15,
    mitigationActions: [
      'Identified expired certificate for EQIP_FG_SVC service account',
      'Certificate renewal request submitted to security team',
      'Added Fieldglass certificate to automated certificate monitoring',
      'Contingent workforce data manually synced from backup source',
    ],
    status: 'investigating',
    assignee: 'Brian Foster',
  },
  {
    id: 'ic_009',
    incidentId: 'INC-2024-1215',
    severity: 'P3',
    title: 'Production Vendor Integration Service Degraded',
    description: 'Vendor Integration service in Production US-East showing degraded performance with response time of 280ms, approaching the 300ms threshold.',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    detectedAt: '2024-12-12T14:55:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'Increased vendor data feed volume combined with unoptimized data reconciliation queries causing elevated response times.',
    correlatedReleaseId: 'rel_vendor_009',
    correlatedReleaseVersion: '1.5.0',
    isReleaseRelated: true,
    impactScope: 'single_service',
    affectedUsers: 85,
    mitigationActions: [
      'Monitoring response time trend for further degradation',
      'Identified data reconciliation queries as primary contributor',
      'Prepared query optimization plan for immediate deployment if threshold breached',
    ],
    status: 'investigating',
    assignee: 'Karen Mitchell',
  },
  {
    id: 'ic_010',
    incidentId: 'INC-2024-1198',
    severity: 'P3',
    title: 'Medicaid Batch Redetermination Null Pointer Failures',
    description: 'Medicaid eligibility redetermination batch processing fails for 23 out of 12,450 records due to null pointer exceptions when processing members with null income data.',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    detectedAt: '2024-12-01T20:30:00Z',
    resolvedAt: '',
    durationMinutes: 0,
    rootCause: 'Batch processor encounters null pointer exception when income data is null for members updated during Medicaid unwinding process. Income field not null-checked before FPL calculation.',
    correlatedReleaseId: 'rel_medicaid_elig_018',
    correlatedReleaseVersion: '3.9.0',
    isReleaseRelated: true,
    impactScope: 'single_service',
    affectedUsers: 23,
    mitigationActions: [
      'Identified 23 affected member records with null income data',
      'Flagged affected members for manual eligibility review',
      'Created hotfix to add null checks before FPL calculation',
      'Added null income test scenarios to regression suite',
    ],
    status: 'investigating',
    assignee: 'Robert Kim',
  },
];

/**
 * Mock quality feedback loop data for the EQIP Quality Platform.
 * @type {QualityFeedbackLoop[]}
 */
const qualityFeedbackLoops = [
  {
    id: 'qfl_001',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    releaseId: 'rel_hedis_020',
    releaseVersion: '4.6.0',
    feedbackType: 'defect_escape',
    priority: 'critical',
    title: 'BCS Measure Exclusion Logic Defect Escaped to Production',
    description: 'The BCS measure bilateral mastectomy exclusion logic missing ICD-10-PCS codes was not caught during pre-deployment testing. The existing test suite only validated CPT code-based exclusions and did not include ICD-10-PCS code scenarios.',
    source: 'production_incident',
    identifiedAt: '2024-12-05T06:30:00Z',
    status: 'in_progress',
    assignee: 'Lisa Johnson',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add ICD-10-PCS code test scenarios to BCS measure exclusion test suite',
      'Create comprehensive value set validation tests for all HEDIS measures',
      'Implement automated value set completeness checks in CI pipeline',
      'Add production measure rate monitoring with deviation alerting',
    ],
    relatedTestCases: ['tc_016'],
    relatedDefects: ['DEF-2024-0872'],
    estimatedImpact: 9,
  },
  {
    id: 'qfl_002',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    releaseId: 'rel_hedis_020',
    releaseVersion: '4.6.0',
    feedbackType: 'test_gap',
    priority: 'high',
    title: 'Missing Performance Regression Tests for Full Population Processing',
    description: 'The HEDIS engine performance SLA breach was not detected before deployment because the performance test suite only tested with a 100K member subset, not the full 523K production population. The performance regression was only visible at full scale.',
    source: 'post_mortem',
    identifiedAt: '2024-12-06T10:00:00Z',
    status: 'in_progress',
    assignee: 'Marcus Thompson',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Create full-population performance test scenario in performance environment',
      'Add performance SLA gate to quality gate criteria for HEDIS releases',
      'Implement automated performance trend analysis comparing release-over-release',
      'Add memory utilization monitoring to performance test assertions',
    ],
    relatedTestCases: ['tc_018'],
    relatedDefects: ['DEF-2024-0860'],
    estimatedImpact: 8,
  },
  {
    id: 'qfl_003',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    releaseId: 'rel_api_gw_011',
    releaseVersion: '1.7.0',
    feedbackType: 'monitoring_gap',
    priority: 'critical',
    title: 'OAuth Scope Enforcement Not Monitored in Production',
    description: 'The disabled OAuth scope enforcement was not detected by production monitoring because there were no security compliance monitors checking scope validation behavior. The issue was only discovered through a scheduled security scan.',
    source: 'quality_review',
    identifiedAt: '2024-11-26T10:00:00Z',
    status: 'in_progress',
    assignee: 'Natalie White',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add production security compliance monitor for OAuth scope enforcement',
      'Create automated security configuration drift detection',
      'Add scope enforcement validation to post-deployment smoke tests',
      'Implement security configuration audit in CI/CD pipeline',
    ],
    relatedTestCases: ['tc_035'],
    relatedDefects: ['DEF-2024-0830'],
    estimatedImpact: 10,
  },
  {
    id: 'qfl_004',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    releaseId: 'rel_api_gw_011',
    releaseVersion: '1.7.0',
    feedbackType: 'process_improvement',
    priority: 'high',
    title: 'Load Testing Not Required in Quality Gate for API Gateway Releases',
    description: 'The API gateway quality gate did not require load testing as a mandatory criterion. The response time degradation under sustained load was only discovered post-deployment. Load testing should be a mandatory gate for all API gateway releases.',
    source: 'post_mortem',
    identifiedAt: '2024-11-27T14:00:00Z',
    status: 'acknowledged',
    assignee: 'Angela Martinez',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add mandatory load test pass criterion to API gateway quality gate',
      'Define sustained load test scenarios matching production traffic patterns',
      'Implement automated load test execution in pre-deployment pipeline',
      'Create load test result comparison dashboard for release-over-release analysis',
    ],
    relatedTestCases: ['tc_034'],
    relatedDefects: ['DEF-2024-0835', 'DEF-2024-0836'],
    estimatedImpact: 8,
  },
  {
    id: 'qfl_005',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    releaseId: 'rel_vendor_009',
    releaseVersion: '1.5.0',
    feedbackType: 'defect_escape',
    priority: 'critical',
    title: 'TLS 1.1 Acceptance Not Caught by Pre-Deployment Security Tests',
    description: 'The vendor integration hub continued to accept TLS 1.1 connections in production despite the security remediation intent. Pre-deployment security tests did not include TLS protocol version validation as a test scenario.',
    source: 'production_incident',
    identifiedAt: '2024-11-19T12:00:00Z',
    status: 'in_progress',
    assignee: 'Natalie White',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add TLS protocol version validation to vendor integration security test suite',
      'Create automated TLS configuration compliance check in CI pipeline',
      'Add TLS version monitoring to production security dashboard',
      'Implement pre-deployment TLS handshake validation for all vendor endpoints',
    ],
    relatedTestCases: ['tc_036'],
    relatedDefects: ['DEF-2024-0820'],
    estimatedImpact: 10,
  },
  {
    id: 'qfl_006',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    releaseId: 'rel_vendor_009',
    releaseVersion: '1.5.0',
    feedbackType: 'automation_opportunity',
    priority: 'high',
    title: 'Vendor Certificate Validation Should Be Automated Pre-Deployment',
    description: 'The lab vendor certificate mismatch between staging and production could have been prevented by automated certificate validation during the deployment pipeline. Currently, certificate validation is a manual step.',
    source: 'post_mortem',
    identifiedAt: '2024-11-20T16:00:00Z',
    status: 'acknowledged',
    assignee: 'James Wright',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Implement automated certificate validation in deployment pipeline',
      'Add certificate hostname verification for all vendor endpoints per environment',
      'Create certificate expiration monitoring with 30-day advance alerting',
      'Add certificate validation to pre-deployment checklist automation',
    ],
    relatedTestCases: [],
    relatedDefects: [],
    estimatedImpact: 7,
  },
  {
    id: 'qfl_007',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    releaseId: 'rel_medicaid_elig_018',
    releaseVersion: '3.9.0',
    feedbackType: 'test_gap',
    priority: 'critical',
    title: 'Boundary Value Testing Missing for FPL Threshold Comparisons',
    description: 'The income threshold comparison operator error was not caught because the test suite did not include boundary value test cases for FPL threshold comparisons. Tests only covered values clearly above and below thresholds, not exact boundary values.',
    source: 'production_incident',
    identifiedAt: '2024-12-02T14:00:00Z',
    status: 'in_progress',
    assignee: 'Robert Kim',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add boundary value test cases for all FPL threshold comparisons',
      'Create parameterized test suite covering exact threshold, threshold-1, and threshold+1 values',
      'Review all comparison operators in eligibility rules for similar issues',
      'Add boundary value testing requirement to code review checklist',
    ],
    relatedTestCases: ['tc_021'],
    relatedDefects: ['DEF-2024-0882'],
    estimatedImpact: 9,
  },
  {
    id: 'qfl_008',
    application: 'app_medicaid_eligibility',
    applicationName: 'Medicaid Eligibility Engine',
    segment: 'Medicaid',
    releaseId: 'rel_medicaid_elig_018',
    releaseVersion: '3.9.0',
    feedbackType: 'test_gap',
    priority: 'high',
    title: 'Null Data Handling Not Tested for Medicaid Unwinding Scenarios',
    description: 'Batch redetermination failures for members with null income data were not caught because test data did not include null income scenarios introduced by the Medicaid unwinding process. Test data generation needs to account for real-world data quality issues.',
    source: 'production_incident',
    identifiedAt: '2024-12-02T10:00:00Z',
    status: 'in_progress',
    assignee: 'Samantha Clark',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add null income data scenarios to Medicaid eligibility test data',
      'Create negative test cases for all nullable fields in eligibility processing',
      'Implement data quality validation in test data generation pipeline',
      'Add null handling assertions to batch processing regression suite',
    ],
    relatedTestCases: ['tc_022'],
    relatedDefects: ['DEF-2024-0885'],
    estimatedImpact: 7,
  },
  {
    id: 'qfl_009',
    application: 'app_vendor_integration',
    applicationName: 'Vendor Integration Hub',
    segment: 'External',
    releaseId: 'rel_vendor_009',
    releaseVersion: '1.5.0',
    feedbackType: 'documentation_gap',
    priority: 'medium',
    title: 'Environment-Specific Configuration Not Documented for DLQ Consumer',
    description: 'The DLQ consumer notification endpoint URL was incorrectly configured because environment-specific configuration requirements were not documented. The deployment runbook did not include a step to verify notification endpoint URLs per environment.',
    source: 'post_mortem',
    identifiedAt: '2024-11-22T10:00:00Z',
    status: 'implemented',
    assignee: 'James Wright',
    resolution: 'Updated deployment runbook with environment-specific configuration verification steps. Added automated configuration validation to deployment pipeline.',
    resolvedAt: '2024-11-25T16:00:00Z',
    actionItems: [
      'Update deployment runbook with environment-specific configuration checklist',
      'Add automated configuration validation to deployment pipeline',
      'Create environment configuration diff report as pre-deployment artifact',
      'Document all environment-specific URLs and endpoints in configuration management system',
    ],
    relatedTestCases: ['tc_037'],
    relatedDefects: ['DEF-2024-0815'],
    estimatedImpact: 5,
  },
  {
    id: 'qfl_010',
    application: 'app_claims_engine',
    applicationName: 'Claims Processing Engine',
    segment: 'Enterprise',
    releaseId: 'rel_claims_034',
    releaseVersion: '4.12.0',
    feedbackType: 'process_improvement',
    priority: 'low',
    title: 'Post-Deployment Smoke Test Coverage Could Be Expanded',
    description: 'While the v4.12.0 deployment was successful, the post-deployment smoke test suite only covers 15 critical paths. Expanding coverage to include real-time claim status tracking (new feature) would improve deployment confidence.',
    source: 'quality_review',
    identifiedAt: '2024-12-11T10:00:00Z',
    status: 'acknowledged',
    assignee: 'Lisa Johnson',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add real-time claim status tracking scenarios to post-deployment smoke tests',
      'Create automated post-deployment validation for all new features',
      'Implement canary deployment validation with automated rollback triggers',
      'Add post-deployment performance baseline comparison to smoke test suite',
    ],
    relatedTestCases: ['tc_001', 'tc_002'],
    relatedDefects: [],
    estimatedImpact: 4,
  },
  {
    id: 'qfl_011',
    application: 'app_hedis_engine',
    applicationName: 'HEDIS Measure Engine',
    segment: 'Medicare',
    releaseId: 'rel_hedis_020',
    releaseVersion: '4.6.0',
    feedbackType: 'monitoring_gap',
    priority: 'high',
    title: 'Supplemental Data Linkage Rate Not Monitored Post-Deployment',
    description: 'The supplemental data linkage rate drop from 96.5% to 94.2% was not detected until a scheduled data quality review 2 days after deployment. Real-time monitoring of data linkage rates would enable faster detection.',
    source: 'automated_analysis',
    identifiedAt: '2024-12-06T14:00:00Z',
    status: 'in_progress',
    assignee: 'Samantha Clark',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Add supplemental data linkage rate to production monitoring dashboard',
      'Create automated alerting for linkage rate drops exceeding 1% threshold',
      'Include data linkage rate in post-deployment validation checklist',
      'Implement daily crosswalk table completeness verification',
    ],
    relatedTestCases: ['tc_017'],
    relatedDefects: ['DEF-2024-0868'],
    estimatedImpact: 7,
  },
  {
    id: 'qfl_012',
    application: 'app_partner_api_gateway',
    applicationName: 'Partner API Gateway',
    segment: 'External',
    releaseId: 'rel_api_gw_011',
    releaseVersion: '1.7.0',
    feedbackType: 'automation_opportunity',
    priority: 'high',
    title: 'Partner Integration Smoke Tests Should Run Automatically Post-Deployment',
    description: 'Partner onboarding workflow timeout errors were reported by integration partners 4 hours after deployment. Automated partner integration smoke tests running immediately post-deployment would detect these issues faster.',
    source: 'user_report',
    identifiedAt: '2024-11-26T06:00:00Z',
    status: 'acknowledged',
    assignee: 'Alex Rivera',
    resolution: '',
    resolvedAt: '',
    actionItems: [
      'Create automated partner integration smoke test suite',
      'Configure smoke tests to run automatically within 15 minutes of deployment',
      'Add partner-specific health check endpoints for automated validation',
      'Implement partner notification system for deployment status updates',
    ],
    relatedTestCases: [],
    relatedDefects: [],
    estimatedImpact: 6,
  },
];

/**
 * Combined post-deployment monitoring data object.
 * @type {PostDeploymentData}
 */
const postDeployment = {
  productionHealthMetrics,
  releaseOutcomes,
  incidentCorrelations,
  qualityFeedbackLoops,
};

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all post-deployment monitoring data.
 *
 * @returns {PostDeploymentData} The complete post-deployment data object
 */
export function getAllPostDeploymentData() {
  return {
    productionHealthMetrics: [...productionHealthMetrics],
    releaseOutcomes: [...releaseOutcomes],
    incidentCorrelations: [...incidentCorrelations],
    qualityFeedbackLoops: [...qualityFeedbackLoops],
  };
}

// ---------------------------------------------------------------------------
// Production health metric accessors
// ---------------------------------------------------------------------------

/**
 * Returns all production health metrics.
 *
 * @returns {ProductionHealthMetric[]} Array of all production health metric objects
 */
export function getAllProductionHealthMetrics() {
  return [...productionHealthMetrics];
}

/**
 * Retrieves a single production health metric by its unique ID.
 *
 * @param {string} metricId - The metric identifier to look up
 * @returns {ProductionHealthMetric|null} The matching metric object, or null if not found
 */
export function getProductionHealthMetricById(metricId) {
  if (!metricId || typeof metricId !== 'string') {
    return null;
  }
  return productionHealthMetrics.find((m) => m.id === metricId) || null;
}

/**
 * Returns all production health metrics for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {ProductionHealthMetric[]} Array of metrics for the specified application
 */
export function getProductionHealthMetricsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return productionHealthMetrics.filter((m) => m.application === applicationId);
}

/**
 * Returns all production health metrics filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {ProductionHealthMetric[]} Array of metrics matching the specified segment
 */
export function getProductionHealthMetricsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return productionHealthMetrics.filter((m) => m.segment === segment);
}

/**
 * Returns all production health metrics filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'healthy', 'degraded', 'critical')
 * @returns {ProductionHealthMetric[]} Array of metrics matching the specified status
 */
export function getProductionHealthMetricsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return productionHealthMetrics.filter((m) => m.status === status);
}

/**
 * Returns all production health metrics filtered by metric type.
 *
 * @param {string} metricType - The metric type to filter by (e.g. 'uptime', 'error_rate', 'response_time', 'throughput')
 * @returns {ProductionHealthMetric[]} Array of metrics matching the specified type
 */
export function getProductionHealthMetricsByType(metricType) {
  if (!metricType || typeof metricType !== 'string') {
    return [];
  }
  return productionHealthMetrics.filter((m) => m.metricType === metricType);
}

/**
 * Returns all production health metrics that are breaching their thresholds.
 *
 * @returns {ProductionHealthMetric[]} Array of metrics currently breaching thresholds
 */
export function getBreachingProductionHealthMetrics() {
  return productionHealthMetrics.filter((m) => {
    if (m.metricType === 'uptime') {
      return m.currentValue < m.threshold;
    }
    if (m.metricType === 'error_rate') {
      return m.currentValue > m.threshold;
    }
    if (m.metricType === 'response_time') {
      return m.currentValue > m.threshold;
    }
    return false;
  });
}

// ---------------------------------------------------------------------------
// Release outcome accessors
// ---------------------------------------------------------------------------

/**
 * Returns all release outcomes.
 *
 * @returns {ReleaseOutcome[]} Array of all release outcome objects
 */
export function getAllReleaseOutcomes() {
  return [...releaseOutcomes];
}

/**
 * Retrieves a single release outcome by its unique ID.
 *
 * @param {string} outcomeId - The outcome identifier to look up
 * @returns {ReleaseOutcome|null} The matching release outcome object, or null if not found
 */
export function getReleaseOutcomeById(outcomeId) {
  if (!outcomeId || typeof outcomeId !== 'string') {
    return null;
  }
  return releaseOutcomes.find((r) => r.id === outcomeId) || null;
}

/**
 * Returns all release outcomes for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {ReleaseOutcome[]} Array of release outcomes for the specified application
 */
export function getReleaseOutcomesByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return releaseOutcomes.filter((r) => r.application === applicationId);
}

/**
 * Returns all release outcomes filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {ReleaseOutcome[]} Array of release outcomes matching the specified segment
 */
export function getReleaseOutcomesBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return releaseOutcomes.filter((r) => r.segment === segment);
}

/**
 * Returns all release outcomes filtered by outcome status.
 *
 * @param {string} outcome - The outcome to filter by (e.g. 'success', 'partial_success', 'rollback', 'failed')
 * @returns {ReleaseOutcome[]} Array of release outcomes matching the specified outcome
 */
export function getReleaseOutcomesByOutcome(outcome) {
  if (!outcome || typeof outcome !== 'string') {
    return [];
  }
  return releaseOutcomes.filter((r) => r.outcome === outcome);
}

/**
 * Returns all release outcomes filtered by stabilization status.
 *
 * @param {string} stabilizationStatus - The stabilization status to filter by (e.g. 'stable', 'monitoring', 'unstable', 'rolled_back')
 * @returns {ReleaseOutcome[]} Array of release outcomes matching the specified stabilization status
 */
export function getReleaseOutcomesByStabilizationStatus(stabilizationStatus) {
  if (!stabilizationStatus || typeof stabilizationStatus !== 'string') {
    return [];
  }
  return releaseOutcomes.filter((r) => r.stabilizationStatus === stabilizationStatus);
}

/**
 * Returns all release outcomes that had post-deployment incidents.
 *
 * @returns {ReleaseOutcome[]} Array of release outcomes with at least one incident
 */
export function getReleaseOutcomesWithIncidents() {
  return releaseOutcomes.filter((r) => r.incidentCount > 0);
}

/**
 * Returns the release outcome for a specific release ID.
 *
 * @param {string} releaseId - The release ID to look up
 * @returns {ReleaseOutcome|null} The matching release outcome object, or null if not found
 */
export function getReleaseOutcomeByReleaseId(releaseId) {
  if (!releaseId || typeof releaseId !== 'string') {
    return null;
  }
  return releaseOutcomes.find((r) => r.releaseId === releaseId) || null;
}

// ---------------------------------------------------------------------------
// Incident correlation accessors
// ---------------------------------------------------------------------------

/**
 * Returns all incident correlations.
 *
 * @returns {IncidentCorrelation[]} Array of all incident correlation objects
 */
export function getAllIncidentCorrelations() {
  return [...incidentCorrelations];
}

/**
 * Retrieves a single incident correlation by its unique ID.
 *
 * @param {string} correlationId - The correlation identifier to look up
 * @returns {IncidentCorrelation|null} The matching incident correlation object, or null if not found
 */
export function getIncidentCorrelationById(correlationId) {
  if (!correlationId || typeof correlationId !== 'string') {
    return null;
  }
  return incidentCorrelations.find((i) => i.id === correlationId) || null;
}

/**
 * Returns all incident correlations for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {IncidentCorrelation[]} Array of incident correlations for the specified application
 */
export function getIncidentCorrelationsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return incidentCorrelations.filter((i) => i.application === applicationId);
}

/**
 * Returns all incident correlations filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {IncidentCorrelation[]} Array of incident correlations matching the specified segment
 */
export function getIncidentCorrelationsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return incidentCorrelations.filter((i) => i.segment === segment);
}

/**
 * Returns all incident correlations filtered by severity.
 *
 * @param {string} severity - The severity to filter by (e.g. 'P1', 'P2', 'P3', 'P4')
 * @returns {IncidentCorrelation[]} Array of incident correlations matching the specified severity
 */
export function getIncidentCorrelationsBySeverity(severity) {
  if (!severity || typeof severity !== 'string') {
    return [];
  }
  return incidentCorrelations.filter((i) => i.severity === severity);
}

/**
 * Returns all incident correlations filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'open', 'investigating', 'mitigated', 'resolved', 'closed')
 * @returns {IncidentCorrelation[]} Array of incident correlations matching the specified status
 */
export function getIncidentCorrelationsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return incidentCorrelations.filter((i) => i.status === status);
}

/**
 * Returns all incident correlations that are release-related.
 *
 * @returns {IncidentCorrelation[]} Array of release-related incident correlations
 */
export function getReleaseRelatedIncidents() {
  return incidentCorrelations.filter((i) => i.isReleaseRelated);
}

/**
 * Returns all incident correlations correlated with a specific release.
 *
 * @param {string} releaseId - The release ID to filter by
 * @returns {IncidentCorrelation[]} Array of incident correlations for the specified release
 */
export function getIncidentCorrelationsByReleaseId(releaseId) {
  if (!releaseId || typeof releaseId !== 'string') {
    return [];
  }
  return incidentCorrelations.filter((i) => i.correlatedReleaseId === releaseId);
}

/**
 * Returns all open incident correlations (status is 'open', 'investigating', or 'mitigated').
 *
 * @returns {IncidentCorrelation[]} Array of open incident correlations
 */
export function getOpenIncidentCorrelations() {
  return incidentCorrelations.filter(
    (i) => i.status === 'open' || i.status === 'investigating' || i.status === 'mitigated'
  );
}

// ---------------------------------------------------------------------------
// Quality feedback loop accessors
// ---------------------------------------------------------------------------

/**
 * Returns all quality feedback loops.
 *
 * @returns {QualityFeedbackLoop[]} Array of all quality feedback loop objects
 */
export function getAllQualityFeedbackLoops() {
  return [...qualityFeedbackLoops];
}

/**
 * Retrieves a single quality feedback loop by its unique ID.
 *
 * @param {string} feedbackId - The feedback identifier to look up
 * @returns {QualityFeedbackLoop|null} The matching quality feedback loop object, or null if not found
 */
export function getQualityFeedbackLoopById(feedbackId) {
  if (!feedbackId || typeof feedbackId !== 'string') {
    return null;
  }
  return qualityFeedbackLoops.find((f) => f.id === feedbackId) || null;
}

/**
 * Returns all quality feedback loops for a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {QualityFeedbackLoop[]} Array of feedback loops for the specified application
 */
export function getQualityFeedbackLoopsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return qualityFeedbackLoops.filter((f) => f.application === applicationId);
}

/**
 * Returns all quality feedback loops filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {QualityFeedbackLoop[]} Array of feedback loops matching the specified segment
 */
export function getQualityFeedbackLoopsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return qualityFeedbackLoops.filter((f) => f.segment === segment);
}

/**
 * Returns all quality feedback loops filtered by feedback type.
 *
 * @param {string} feedbackType - The feedback type to filter by (e.g. 'defect_escape', 'test_gap', 'process_improvement', 'automation_opportunity', 'monitoring_gap', 'documentation_gap')
 * @returns {QualityFeedbackLoop[]} Array of feedback loops matching the specified type
 */
export function getQualityFeedbackLoopsByType(feedbackType) {
  if (!feedbackType || typeof feedbackType !== 'string') {
    return [];
  }
  return qualityFeedbackLoops.filter((f) => f.feedbackType === feedbackType);
}

/**
 * Returns all quality feedback loops filtered by priority.
 *
 * @param {string} priority - The priority to filter by (e.g. 'critical', 'high', 'medium', 'low')
 * @returns {QualityFeedbackLoop[]} Array of feedback loops matching the specified priority
 */
export function getQualityFeedbackLoopsByPriority(priority) {
  if (!priority || typeof priority !== 'string') {
    return [];
  }
  return qualityFeedbackLoops.filter((f) => f.priority === priority);
}

/**
 * Returns all quality feedback loops filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'new', 'acknowledged', 'in_progress', 'implemented', 'deferred', 'dismissed')
 * @returns {QualityFeedbackLoop[]} Array of feedback loops matching the specified status
 */
export function getQualityFeedbackLoopsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return qualityFeedbackLoops.filter((f) => f.status === status);
}

/**
 * Returns all quality feedback loops for a specific release.
 *
 * @param {string} releaseId - The release ID to filter by
 * @returns {QualityFeedbackLoop[]} Array of feedback loops for the specified release
 */
export function getQualityFeedbackLoopsByReleaseId(releaseId) {
  if (!releaseId || typeof releaseId !== 'string') {
    return [];
  }
  return qualityFeedbackLoops.filter((f) => f.releaseId === releaseId);
}

/**
 * Returns all quality feedback loops assigned to a specific person.
 *
 * @param {string} assignee - The assignee name to filter by
 * @returns {QualityFeedbackLoop[]} Array of feedback loops assigned to the specified person
 */
export function getQualityFeedbackLoopsByAssignee(assignee) {
  if (!assignee || typeof assignee !== 'string') {
    return [];
  }
  return qualityFeedbackLoops.filter((f) => f.assignee === assignee);
}

/**
 * Returns all unique feedback types across all quality feedback loops.
 *
 * @returns {string[]} Array of unique feedback types sorted alphabetically
 */
export function getAllFeedbackTypes() {
  const types = new Set(qualityFeedbackLoops.map((f) => f.feedbackType));
  return [...types].sort();
}

/**
 * Returns all unique feedback statuses across all quality feedback loops.
 *
 * @returns {string[]} Array of unique feedback statuses sorted alphabetically
 */
export function getAllFeedbackStatuses() {
  const statuses = new Set(qualityFeedbackLoops.map((f) => f.status));
  return [...statuses].sort();
}

/**
 * Returns all unique feedback sources across all quality feedback loops.
 *
 * @returns {string[]} Array of unique feedback sources sorted alphabetically
 */
export function getAllFeedbackSources() {
  const sources = new Set(qualityFeedbackLoops.map((f) => f.source));
  return [...sources].sort();
}

// ---------------------------------------------------------------------------
// Aggregate statistics
// ---------------------------------------------------------------------------

/**
 * Returns aggregate statistics across all post-deployment monitoring data.
 *
 * @returns {{ totalProductionHealthMetrics: number, healthStatusBreakdown: Object<string, number>, totalReleaseOutcomes: number, releaseOutcomeBreakdown: Object<string, number>, stabilizationBreakdown: Object<string, number>, averageQualityScore: number, totalIncidents: number, releaseRelatedIncidents: number, nonReleaseRelatedIncidents: number, incidentSeverityBreakdown: Object<string, number>, incidentStatusBreakdown: Object<string, number>, totalFeedbackLoops: number, feedbackTypeBreakdown: Object<string, number>, feedbackPriorityBreakdown: Object<string, number>, feedbackStatusBreakdown: Object<string, number>, averageChangeFailureRate: number, averageMTTR: number }} Aggregate post-deployment statistics
 */
export function getPostDeploymentAggregates() {
  const totalProductionHealthMetrics = productionHealthMetrics.length;
  const healthStatusBreakdown = productionHealthMetrics.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});

  const totalReleaseOutcomes = releaseOutcomes.length;
  const releaseOutcomeBreakdown = releaseOutcomes.reduce((acc, r) => {
    acc[r.outcome] = (acc[r.outcome] || 0) + 1;
    return acc;
  }, {});

  const stabilizationBreakdown = releaseOutcomes.reduce((acc, r) => {
    acc[r.stabilizationStatus] = (acc[r.stabilizationStatus] || 0) + 1;
    return acc;
  }, {});

  const averageQualityScore =
    totalReleaseOutcomes > 0
      ? Math.round((releaseOutcomes.reduce((sum, r) => sum + r.qualityScore, 0) / totalReleaseOutcomes) * 10) / 10
      : 0;

  const totalIncidents = incidentCorrelations.length;
  const releaseRelatedIncidents = incidentCorrelations.filter((i) => i.isReleaseRelated).length;
  const nonReleaseRelatedIncidents = totalIncidents - releaseRelatedIncidents;

  const incidentSeverityBreakdown = incidentCorrelations.reduce((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1;
    return acc;
  }, {});

  const incidentStatusBreakdown = incidentCorrelations.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});

  const totalFeedbackLoops = qualityFeedbackLoops.length;
  const feedbackTypeBreakdown = qualityFeedbackLoops.reduce((acc, f) => {
    acc[f.feedbackType] = (acc[f.feedbackType] || 0) + 1;
    return acc;
  }, {});

  const feedbackPriorityBreakdown = qualityFeedbackLoops.reduce((acc, f) => {
    acc[f.priority] = (acc[f.priority] || 0) + 1;
    return acc;
  }, {});

  const feedbackStatusBreakdown = qualityFeedbackLoops.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const releasesWithFailures = releaseOutcomes.filter((r) => r.changeFailureCategory !== 'none');
  const averageChangeFailureRate =
    totalReleaseOutcomes > 0
      ? Math.round((releasesWithFailures.length / totalReleaseOutcomes) * 1000) / 10
      : 0;

  const releasesWithMTTR = releaseOutcomes.filter((r) => r.mttrMinutes > 0);
  const averageMTTR =
    releasesWithMTTR.length > 0
      ? Math.round(releasesWithMTTR.reduce((sum, r) => sum + r.mttrMinutes, 0) / releasesWithMTTR.length)
      : 0;

  return {
    totalProductionHealthMetrics,
    healthStatusBreakdown,
    totalReleaseOutcomes,
    releaseOutcomeBreakdown,
    stabilizationBreakdown,
    averageQualityScore,
    totalIncidents,
    releaseRelatedIncidents,
    nonReleaseRelatedIncidents,
    incidentSeverityBreakdown,
    incidentStatusBreakdown,
    totalFeedbackLoops,
    feedbackTypeBreakdown,
    feedbackPriorityBreakdown,
    feedbackStatusBreakdown,
    averageChangeFailureRate,
    averageMTTR,
  };
}

export default postDeployment;