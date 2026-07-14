import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} TrendDataPoint
 * @property {string} month - Month label (e.g. 'Jan', 'Feb')
 * @property {number} qualityScore - Quality score for the month
 * @property {number} complianceRate - Compliance rate for the month
 */

/**
 * @typedef {Object} Segment
 * @property {string} id - Unique segment identifier
 * @property {string} name - Display name of the segment
 * @property {string} description - Brief description of the segment
 * @property {number} applicationCount - Number of applications in this segment
 * @property {number} releaseCount - Number of releases in this segment
 * @property {number} qualityScore - Overall quality score (0-100)
 * @property {number} complianceRate - Compliance rate as a percentage (0-100)
 * @property {TrendDataPoint[]} trendData - Monthly trend data points
 * @property {string[]} applications - Array of application IDs belonging to this segment
 * @property {string} owner - Name of the segment owner
 * @property {string} status - Current status of the segment
 */

/**
 * Mock segment data for the EQIP Quality Platform.
 * Contains segment objects representing various organizational segments
 * with quality metrics, compliance data, and trend information.
 *
 * @type {Segment[]}
 */
const segments = [
  {
    id: 'seg_enterprise',
    name: 'Enterprise',
    description: 'Enterprise-wide applications and services spanning all business units and shared infrastructure.',
    applicationCount: 42,
    releaseCount: 187,
    qualityScore: 88.5,
    complianceRate: 94.2,
    trendData: [
      { month: 'Jan', qualityScore: 82.0, complianceRate: 90.1 },
      { month: 'Feb', qualityScore: 83.5, complianceRate: 91.0 },
      { month: 'Mar', qualityScore: 84.2, complianceRate: 91.8 },
      { month: 'Apr', qualityScore: 85.0, complianceRate: 92.3 },
      { month: 'May', qualityScore: 86.1, complianceRate: 92.7 },
      { month: 'Jun', qualityScore: 86.8, complianceRate: 93.0 },
      { month: 'Jul', qualityScore: 87.2, complianceRate: 93.4 },
      { month: 'Aug', qualityScore: 87.5, complianceRate: 93.6 },
      { month: 'Sep', qualityScore: 87.9, complianceRate: 93.8 },
      { month: 'Oct', qualityScore: 88.0, complianceRate: 94.0 },
      { month: 'Nov', qualityScore: 88.3, complianceRate: 94.1 },
      { month: 'Dec', qualityScore: 88.5, complianceRate: 94.2 },
    ],
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_provider_directory',
      'app_auth_service',
      'app_data_warehouse',
      'app_notification_hub',
    ],
    owner: 'Jennifer Williams',
    status: MEASURE_STATUS.ON_TRACK,
  },
  {
    id: 'seg_medicare',
    name: 'Medicare',
    description: 'Medicare segment covering Medicare Advantage, Part D, and supplemental benefit programs.',
    applicationCount: 28,
    releaseCount: 134,
    qualityScore: 91.3,
    complianceRate: 96.8,
    trendData: [
      { month: 'Jan', qualityScore: 86.0, complianceRate: 93.5 },
      { month: 'Feb', qualityScore: 86.8, complianceRate: 93.9 },
      { month: 'Mar', qualityScore: 87.5, complianceRate: 94.2 },
      { month: 'Apr', qualityScore: 88.2, complianceRate: 94.8 },
      { month: 'May', qualityScore: 88.9, complianceRate: 95.1 },
      { month: 'Jun', qualityScore: 89.4, complianceRate: 95.5 },
      { month: 'Jul', qualityScore: 89.8, complianceRate: 95.8 },
      { month: 'Aug', qualityScore: 90.2, complianceRate: 96.0 },
      { month: 'Sep', qualityScore: 90.5, complianceRate: 96.2 },
      { month: 'Oct', qualityScore: 90.8, complianceRate: 96.4 },
      { month: 'Nov', qualityScore: 91.0, complianceRate: 96.6 },
      { month: 'Dec', qualityScore: 91.3, complianceRate: 96.8 },
    ],
    applications: [
      'app_medicare_enrollment',
      'app_star_ratings',
      'app_hedis_engine',
      'app_part_d_formulary',
      'app_benefits_admin',
    ],
    owner: 'Michael Torres',
    status: MEASURE_STATUS.ON_TRACK,
  },
  {
    id: 'seg_medicaid',
    name: 'Medicaid',
    description: 'Medicaid managed care programs across multiple state contracts and regulatory environments.',
    applicationCount: 19,
    releaseCount: 89,
    qualityScore: 78.4,
    complianceRate: 85.6,
    trendData: [
      { month: 'Jan', qualityScore: 72.0, complianceRate: 80.2 },
      { month: 'Feb', qualityScore: 72.8, complianceRate: 80.9 },
      { month: 'Mar', qualityScore: 73.5, complianceRate: 81.5 },
      { month: 'Apr', qualityScore: 74.2, complianceRate: 82.0 },
      { month: 'May', qualityScore: 75.0, complianceRate: 82.8 },
      { month: 'Jun', qualityScore: 75.8, complianceRate: 83.2 },
      { month: 'Jul', qualityScore: 76.3, complianceRate: 83.7 },
      { month: 'Aug', qualityScore: 76.9, complianceRate: 84.1 },
      { month: 'Sep', qualityScore: 77.4, complianceRate: 84.6 },
      { month: 'Oct', qualityScore: 77.8, complianceRate: 85.0 },
      { month: 'Nov', qualityScore: 78.1, complianceRate: 85.3 },
      { month: 'Dec', qualityScore: 78.4, complianceRate: 85.6 },
    ],
    applications: [
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_care_management',
      'app_provider_network',
    ],
    owner: 'David Park',
    status: MEASURE_STATUS.AT_RISK,
  },
  {
    id: 'seg_commercial',
    name: 'Commercial',
    description: 'Commercial group and individual health insurance products including employer-sponsored plans.',
    applicationCount: 24,
    releaseCount: 112,
    qualityScore: 84.7,
    complianceRate: 91.3,
    trendData: [
      { month: 'Jan', qualityScore: 79.0, complianceRate: 87.5 },
      { month: 'Feb', qualityScore: 79.8, complianceRate: 88.0 },
      { month: 'Mar', qualityScore: 80.5, complianceRate: 88.5 },
      { month: 'Apr', qualityScore: 81.2, complianceRate: 89.0 },
      { month: 'May', qualityScore: 81.8, complianceRate: 89.4 },
      { month: 'Jun', qualityScore: 82.3, complianceRate: 89.8 },
      { month: 'Jul', qualityScore: 82.9, complianceRate: 90.1 },
      { month: 'Aug', qualityScore: 83.4, complianceRate: 90.4 },
      { month: 'Sep', qualityScore: 83.8, complianceRate: 90.7 },
      { month: 'Oct', qualityScore: 84.1, complianceRate: 91.0 },
      { month: 'Nov', qualityScore: 84.4, complianceRate: 91.1 },
      { month: 'Dec', qualityScore: 84.7, complianceRate: 91.3 },
    ],
    applications: [
      'app_group_enrollment',
      'app_individual_marketplace',
      'app_broker_portal',
      'app_underwriting_engine',
      'app_wellness_platform',
    ],
    owner: 'Robert Kim',
    status: MEASURE_STATUS.ON_TRACK,
  },
  {
    id: 'seg_external',
    name: 'External',
    description: 'External-facing integrations, partner APIs, and vendor-managed services and platforms.',
    applicationCount: 11,
    releaseCount: 47,
    qualityScore: 72.1,
    complianceRate: 80.4,
    trendData: [
      { month: 'Jan', qualityScore: 65.0, complianceRate: 74.0 },
      { month: 'Feb', qualityScore: 65.8, complianceRate: 74.8 },
      { month: 'Mar', qualityScore: 66.5, complianceRate: 75.5 },
      { month: 'Apr', qualityScore: 67.3, complianceRate: 76.2 },
      { month: 'May', qualityScore: 68.0, complianceRate: 76.9 },
      { month: 'Jun', qualityScore: 68.8, complianceRate: 77.5 },
      { month: 'Jul', qualityScore: 69.5, complianceRate: 78.0 },
      { month: 'Aug', qualityScore: 70.1, complianceRate: 78.6 },
      { month: 'Sep', qualityScore: 70.7, complianceRate: 79.1 },
      { month: 'Oct', qualityScore: 71.2, complianceRate: 79.6 },
      { month: 'Nov', qualityScore: 71.7, complianceRate: 80.0 },
      { month: 'Dec', qualityScore: 72.1, complianceRate: 80.4 },
    ],
    applications: [
      'app_partner_api_gateway',
      'app_vendor_integration',
      'app_external_data_feed',
    ],
    owner: 'Alex Rivera',
    status: MEASURE_STATUS.CRITICAL,
  },
  {
    id: 'seg_compliance',
    name: 'Compliance',
    description: 'Regulatory compliance, audit management, and quality assurance systems across all segments.',
    applicationCount: 15,
    releaseCount: 63,
    qualityScore: 93.2,
    complianceRate: 98.1,
    trendData: [
      { month: 'Jan', qualityScore: 89.0, complianceRate: 95.5 },
      { month: 'Feb', qualityScore: 89.5, complianceRate: 95.8 },
      { month: 'Mar', qualityScore: 90.0, complianceRate: 96.1 },
      { month: 'Apr', qualityScore: 90.5, complianceRate: 96.5 },
      { month: 'May', qualityScore: 91.0, complianceRate: 96.8 },
      { month: 'Jun', qualityScore: 91.4, complianceRate: 97.0 },
      { month: 'Jul', qualityScore: 91.8, complianceRate: 97.2 },
      { month: 'Aug', qualityScore: 92.1, complianceRate: 97.4 },
      { month: 'Sep', qualityScore: 92.4, complianceRate: 97.6 },
      { month: 'Oct', qualityScore: 92.7, complianceRate: 97.8 },
      { month: 'Nov', qualityScore: 93.0, complianceRate: 97.9 },
      { month: 'Dec', qualityScore: 93.2, complianceRate: 98.1 },
    ],
    applications: [
      'app_audit_tracker',
      'app_regulatory_reporting',
      'app_compliance_dashboard',
      'app_risk_assessment',
    ],
    owner: 'Patricia Evans',
    status: MEASURE_STATUS.ON_TRACK,
  },
];

/**
 * Returns all available segments.
 *
 * @returns {Segment[]} Array of all segment objects
 */
export function getAllSegments() {
  return [...segments];
}

/**
 * Retrieves a single segment by its unique ID.
 *
 * @param {string} segmentId - The segment identifier to look up
 * @returns {Segment|null} The matching segment object, or null if not found
 */
export function getSegmentById(segmentId) {
  if (!segmentId || typeof segmentId !== 'string') {
    return null;
  }
  return segments.find((s) => s.id === segmentId) || null;
}

/**
 * Retrieves a single segment by its name.
 *
 * @param {string} name - The segment name to look up
 * @returns {Segment|null} The matching segment object, or null if not found
 */
export function getSegmentByName(name) {
  if (!name || typeof name !== 'string') {
    return null;
  }
  return segments.find((s) => s.name === name) || null;
}

/**
 * Returns all segments filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'on_track', 'at_risk', 'critical')
 * @returns {Segment[]} Array of segments matching the specified status
 */
export function getSegmentsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return segments.filter((s) => s.status === status);
}

/**
 * Returns all unique segment names.
 *
 * @returns {string[]} Array of segment names sorted alphabetically
 */
export function getSegmentNames() {
  return segments.map((s) => s.name).sort();
}

/**
 * Returns aggregate statistics across all segments.
 *
 * @returns {{ totalApplications: number, totalReleases: number, averageQualityScore: number, averageComplianceRate: number }} Aggregate segment statistics
 */
export function getSegmentAggregates() {
  const totalApplications = segments.reduce((sum, s) => sum + s.applicationCount, 0);
  const totalReleases = segments.reduce((sum, s) => sum + s.releaseCount, 0);
  const averageQualityScore =
    segments.length > 0
      ? Math.round((segments.reduce((sum, s) => sum + s.qualityScore, 0) / segments.length) * 10) / 10
      : 0;
  const averageComplianceRate =
    segments.length > 0
      ? Math.round((segments.reduce((sum, s) => sum + s.complianceRate, 0) / segments.length) * 10) / 10
      : 0;

  return {
    totalApplications,
    totalReleases,
    averageQualityScore,
    averageComplianceRate,
  };
}

export default segments;