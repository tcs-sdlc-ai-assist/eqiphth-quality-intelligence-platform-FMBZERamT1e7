import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} GateCriteria
 * @property {string} name - Gate criteria name
 * @property {number} threshold - Required threshold value
 * @property {number} actual - Actual measured value
 * @property {string} status - Gate criteria status (passed, failed, waived, pending)
 */

/**
 * @typedef {Object} Waiver
 * @property {string} id - Unique waiver identifier
 * @property {string} gateName - Name of the gate criteria being waived
 * @property {string} reason - Reason for the waiver
 * @property {string} approvedBy - Name of the person who approved the waiver
 * @property {string} approvedDate - Approval date in ISO format
 * @property {string} expirationDate - Waiver expiration date in ISO format
 */

/**
 * @typedef {Object} QualityGate
 * @property {string} id - Unique quality gate identifier
 * @property {string} name - Display name of the quality gate
 * @property {string} release - Release version this gate applies to
 * @property {string} application - Application ID this gate relates to
 * @property {GateCriteria[]} gates - Array of gate criteria
 * @property {string} overallStatus - Overall quality gate status (passed, failed, waived, pending)
 * @property {Waiver[]} waivers - Array of active waivers
 * @property {string} configuredBy - Name of the person who configured the gate
 * @property {string} lastEvaluated - Last evaluation date in ISO format
 * @property {string} segment - Organizational segment
 */

/**
 * Mock quality gate data for the EQIP Quality Platform.
 * Contains quality gate objects representing release quality checkpoints
 * with gate criteria, thresholds, actual values, and waiver information.
 *
 * @type {QualityGate[]}
 */
const qualityGates = [
  {
    id: 'qg_001',
    name: 'Claims Engine v4.12.0 Release Gate',
    release: '4.12.0',
    application: 'app_claims_engine',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.4, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.9, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 95.3, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 91.4, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
      { name: 'Performance SLA Compliance', threshold: 95, actual: 96.8, status: 'passed' },
      { name: 'Security Scan Pass', threshold: 100, actual: 100, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Jennifer Williams',
    lastEvaluated: '2024-12-10',
    segment: 'Enterprise',
  },
  {
    id: 'qg_002',
    name: 'Member Portal v3.8.0 Release Gate',
    release: '3.8.0',
    application: 'app_member_portal',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 99.2, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 98.7, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 97.9, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 94.2, status: 'passed' },
      { name: 'Accessibility Compliance', threshold: 100, actual: 98.2, status: 'waived' },
      { name: 'Performance SLA Compliance', threshold: 95, actual: 99.1, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [
      {
        id: 'wv_001',
        gateName: 'Accessibility Compliance',
        reason: 'Two minor WCAG 2.1 AA findings on claims history table are scheduled for remediation in v3.8.1. Screen reader compatibility issues do not block core functionality.',
        approvedBy: 'Angela Martinez',
        approvedDate: '2024-12-11',
        expirationDate: '2025-01-15',
      },
    ],
    configuredBy: 'Rachel Nguyen',
    lastEvaluated: '2024-12-12',
    segment: 'Enterprise',
  },
  {
    id: 'qg_003',
    name: 'Auth Service v5.3.0 Release Gate',
    release: '5.3.0',
    application: 'app_auth_service',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 98, actual: 99.6, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 95, actual: 99.2, status: 'passed' },
      { name: 'Security Test Pass Rate', threshold: 98, actual: 98.8, status: 'passed' },
      { name: 'Code Coverage', threshold: 90, actual: 96.8, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
      { name: 'Penetration Test Pass', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Token Lifecycle Validation', threshold: 100, actual: 100, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Natalie White',
    lastEvaluated: '2024-12-05',
    segment: 'Enterprise',
  },
  {
    id: 'qg_004',
    name: 'Data Warehouse v2.8.0 Release Gate',
    release: '2.8.0',
    application: 'app_data_warehouse',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 90, actual: 96.5, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 85, actual: 95.8, status: 'passed' },
      { name: 'Data Quality Validation', threshold: 99, actual: 99.4, status: 'passed' },
      { name: 'Code Coverage', threshold: 75, actual: 82.5, status: 'passed' },
      { name: 'Performance SLA Compliance', threshold: 90, actual: 78.5, status: 'failed' },
      { name: 'ETL Pipeline Reliability', threshold: 95, actual: 97.2, status: 'passed' },
    ],
    overallStatus: 'failed',
    waivers: [],
    configuredBy: 'Samantha Clark',
    lastEvaluated: '2024-12-06',
    segment: 'Enterprise',
  },
  {
    id: 'qg_005',
    name: 'Provider Directory v2.14.0 Release Gate',
    release: '2.14.0',
    application: 'app_provider_directory',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.9, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.3, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 96.3, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 92.0, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Chris Anderson',
    lastEvaluated: '2024-12-08',
    segment: 'Enterprise',
  },
  {
    id: 'qg_006',
    name: 'Notification Hub v1.9.0 Release Gate',
    release: '1.9.0',
    application: 'app_notification_hub',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 99.1, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 98.2, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 97.3, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 93.5, status: 'passed' },
      { name: 'Delivery SLA Compliance', threshold: 95, actual: 98.7, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'James Wright',
    lastEvaluated: '2024-12-09',
    segment: 'Enterprise',
  },
  {
    id: 'qg_007',
    name: 'Medicare Enrollment v6.4.0 Release Gate',
    release: '6.4.0',
    application: 'app_medicare_enrollment',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.4, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.3, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 95.6, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 90.5, status: 'passed' },
      { name: 'CMS Transaction Compliance', threshold: 100, actual: 100, status: 'passed' },
      { name: 'AEP Readiness Certification', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
      { name: 'Performance SLA Compliance', threshold: 90, actual: 93.5, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Michael Torres',
    lastEvaluated: '2024-12-11',
    segment: 'Medicare',
  },
  {
    id: 'qg_008',
    name: 'Star Ratings v3.2.0 Release Gate',
    release: '3.2.0',
    application: 'app_star_ratings',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.2, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 96.8, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 95.5, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 88.4, status: 'passed' },
      { name: 'CMS Methodology Alignment', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Emily Davis',
    lastEvaluated: '2024-12-07',
    segment: 'Medicare',
  },
  {
    id: 'qg_009',
    name: 'HEDIS Engine v4.6.0 Release Gate',
    release: '4.6.0',
    application: 'app_hedis_engine',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 96.3, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 95.0, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 91.4, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 85.2, status: 'passed' },
      { name: 'Measure Specification Accuracy', threshold: 100, actual: 96.8, status: 'failed' },
      { name: 'Performance SLA Compliance', threshold: 90, actual: 82.1, status: 'failed' },
      { name: 'Critical Defects', threshold: 0, actual: 3, status: 'failed' },
      { name: 'NCQA Certification Alignment', threshold: 100, actual: 100, status: 'passed' },
    ],
    overallStatus: 'failed',
    waivers: [],
    configuredBy: 'Angela Martinez',
    lastEvaluated: '2024-12-04',
    segment: 'Medicare',
  },
  {
    id: 'qg_010',
    name: 'Part D Formulary v2.5.0 Release Gate',
    release: '2.5.0',
    application: 'app_part_d_formulary',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.6, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.5, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 95.6, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 89.8, status: 'passed' },
      { name: 'CMS File Format Compliance', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Thomas Lee',
    lastEvaluated: '2024-12-03',
    segment: 'Medicare',
  },
  {
    id: 'qg_011',
    name: 'Benefits Admin v3.7.0 Release Gate',
    release: '3.7.0',
    application: 'app_benefits_admin',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.7, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.2, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 96.0, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 87.6, status: 'passed' },
      { name: 'Plan Benefit Accuracy', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Kevin Brown',
    lastEvaluated: '2024-12-02',
    segment: 'Medicare',
  },
  {
    id: 'qg_012',
    name: 'Medicaid Eligibility v3.9.0 Release Gate',
    release: '3.9.0',
    application: 'app_medicaid_eligibility',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 94.6, status: 'failed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 93.1, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 91.7, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 78.4, status: 'failed' },
      { name: 'State Contract Compliance', threshold: 100, actual: 92.5, status: 'failed' },
      { name: 'Eligibility Determination SLA', threshold: 95, actual: 88.3, status: 'failed' },
      { name: 'Critical Defects', threshold: 0, actual: 2, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [],
    configuredBy: 'David Park',
    lastEvaluated: '2024-12-01',
    segment: 'Medicaid',
  },
  {
    id: 'qg_013',
    name: 'State Reporting v2.3.0 Release Gate',
    release: '2.3.0',
    application: 'app_state_reporting',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 93.1, status: 'failed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 91.3, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 90.0, status: 'passed' },
      { name: 'Code Coverage', threshold: 75, actual: 74.5, status: 'waived' },
      { name: 'Data Accuracy Validation', threshold: 99.9, actual: 98.2, status: 'failed' },
      { name: 'Reporting Deadline Compliance', threshold: 100, actual: 85.0, status: 'failed' },
      { name: 'Critical Defects', threshold: 0, actual: 1, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [
      {
        id: 'wv_002',
        gateName: 'Code Coverage',
        reason: 'Legacy reporting modules have limited test coverage. Coverage improvement plan in progress with target completion Q1 2025.',
        approvedBy: 'Jennifer Williams',
        approvedDate: '2024-11-25',
        expirationDate: '2025-03-31',
      },
    ],
    configuredBy: 'Patricia Evans',
    lastEvaluated: '2024-11-28',
    segment: 'Medicaid',
  },
  {
    id: 'qg_014',
    name: 'Care Management v2.8.0 Release Gate',
    release: '2.8.0',
    application: 'app_care_management',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 95.7, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 94.4, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 93.7, status: 'passed' },
      { name: 'Code Coverage', threshold: 75, actual: 80.2, status: 'passed' },
      { name: 'Outreach Tracking Compliance', threshold: 100, actual: 87.0, status: 'failed' },
      { name: 'Critical Defects', threshold: 0, actual: 1, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [],
    configuredBy: 'Amanda Garcia',
    lastEvaluated: '2024-12-06',
    segment: 'Medicaid',
  },
  {
    id: 'qg_015',
    name: 'Provider Network v1.8.0 Release Gate',
    release: '1.8.0',
    application: 'app_provider_network',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 97.6, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 96.0, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 94.4, status: 'passed' },
      { name: 'Code Coverage', threshold: 75, actual: 83.7, status: 'passed' },
      { name: 'Network Adequacy Standards', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Robert Kim',
    lastEvaluated: '2024-11-22',
    segment: 'Medicaid',
  },
  {
    id: 'qg_016',
    name: 'Group Enrollment v4.2.0 Release Gate',
    release: '4.2.0',
    application: 'app_group_enrollment',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.2, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.1, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 96.1, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 86.5, status: 'passed' },
      { name: 'ACA Compliance', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Robert Kim',
    lastEvaluated: '2024-12-09',
    segment: 'Commercial',
  },
  {
    id: 'qg_017',
    name: 'Individual Marketplace v3.5.0 Release Gate',
    release: '3.5.0',
    application: 'app_individual_marketplace',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.8, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.6, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 96.4, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 88.9, status: 'passed' },
      { name: 'ACA Plan Display Compliance', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Emily Davis',
    lastEvaluated: '2024-12-10',
    segment: 'Commercial',
  },
  {
    id: 'qg_018',
    name: 'Broker Portal v2.6.0 Release Gate',
    release: '2.6.0',
    application: 'app_broker_portal',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 99.0, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 98.2, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 97.4, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 90.4, status: 'passed' },
      { name: 'License Verification Enforcement', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Kevin Brown',
    lastEvaluated: '2024-12-08',
    segment: 'Commercial',
  },
  {
    id: 'qg_019',
    name: 'Underwriting Engine v2.4.0 Release Gate',
    release: '2.4.0',
    application: 'app_underwriting_engine',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 98.0, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 97.0, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 95.7, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 85.3, status: 'passed' },
      { name: 'Rating Factor Compliance', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Thomas Lee',
    lastEvaluated: '2024-12-04',
    segment: 'Commercial',
  },
  {
    id: 'qg_020',
    name: 'Wellness Platform v2.1.0 Release Gate',
    release: '2.1.0',
    application: 'app_wellness_platform',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 99.0, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 98.2, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 97.5, status: 'passed' },
      { name: 'Code Coverage', threshold: 80, actual: 92.1, status: 'passed' },
      { name: 'HIPAA Wellness Compliance', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Amanda Garcia',
    lastEvaluated: '2024-12-11',
    segment: 'Commercial',
  },
  {
    id: 'qg_021',
    name: 'Partner API Gateway v1.7.0 Release Gate',
    release: '1.7.0',
    application: 'app_partner_api_gateway',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 92.0, status: 'failed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 89.5, status: 'failed' },
      { name: 'Security Test Pass Rate', threshold: 95, actual: 86.0, status: 'failed' },
      { name: 'Code Coverage', threshold: 75, actual: 72.3, status: 'waived' },
      { name: 'Performance SLA Compliance', threshold: 99.9, actual: 92.4, status: 'failed' },
      { name: 'OAuth 2.0 Enforcement', threshold: 100, actual: 78.5, status: 'failed' },
      { name: 'Critical Defects', threshold: 0, actual: 4, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [
      {
        id: 'wv_003',
        gateName: 'Code Coverage',
        reason: 'API gateway infrastructure code has limited unit test coverage. Coverage improvement is part of the TLS 1.3 migration effort (dem_012).',
        approvedBy: 'Jennifer Williams',
        approvedDate: '2024-11-20',
        expirationDate: '2025-02-28',
      },
    ],
    configuredBy: 'Alex Rivera',
    lastEvaluated: '2024-11-25',
    segment: 'External',
  },
  {
    id: 'qg_022',
    name: 'Vendor Integration v1.5.0 Release Gate',
    release: '1.5.0',
    application: 'app_vendor_integration',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 88.5, status: 'failed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 83.8, status: 'failed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 78.9, status: 'failed' },
      { name: 'Code Coverage', threshold: 70, actual: 66.4, status: 'failed' },
      { name: 'Vendor Data Security', threshold: 100, actual: 72.0, status: 'failed' },
      { name: 'Data Reconciliation Accuracy', threshold: 95, actual: 81.5, status: 'failed' },
      { name: 'Critical Defects', threshold: 0, actual: 5, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [],
    configuredBy: 'Alex Rivera',
    lastEvaluated: '2024-11-18',
    segment: 'External',
  },
  {
    id: 'qg_023',
    name: 'External Data Feed v1.4.0 Release Gate',
    release: '1.4.0',
    application: 'app_external_data_feed',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 93.3, status: 'failed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 91.5, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 88.2, status: 'passed' },
      { name: 'Code Coverage', threshold: 70, actual: 73.8, status: 'passed' },
      { name: 'File Processing SLA', threshold: 95, actual: 82.0, status: 'failed' },
      { name: 'CMS Format Validation', threshold: 100, actual: 88.5, status: 'failed' },
      { name: 'Critical Defects', threshold: 0, actual: 1, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [],
    configuredBy: 'James Wright',
    lastEvaluated: '2024-11-20',
    segment: 'External',
  },
  {
    id: 'qg_024',
    name: 'Audit Tracker v2.2.0 Release Gate',
    release: '2.2.0',
    application: 'app_audit_tracker',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 98, actual: 99.4, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 95, actual: 98.8, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 90, actual: 98.0, status: 'passed' },
      { name: 'Code Coverage', threshold: 90, actual: 95.2, status: 'passed' },
      { name: 'Audit Trail Integrity', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Patricia Evans',
    lastEvaluated: '2024-12-07',
    segment: 'Compliance',
  },
  {
    id: 'qg_025',
    name: 'Regulatory Reporting v3.1.0 Release Gate',
    release: '3.1.0',
    application: 'app_regulatory_reporting',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 99.1, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 98.5, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 97.6, status: 'passed' },
      { name: 'Code Coverage', threshold: 85, actual: 93.8, status: 'passed' },
      { name: 'Report Accuracy Standards', threshold: 99.9, actual: 99.95, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Patricia Evans',
    lastEvaluated: '2024-12-10',
    segment: 'Compliance',
  },
  {
    id: 'qg_026',
    name: 'Compliance Dashboard v1.6.0 Release Gate',
    release: '1.6.0',
    application: 'app_compliance_dashboard',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 98, actual: 99.6, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 95, actual: 99.2, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 90, actual: 98.8, status: 'passed' },
      { name: 'Code Coverage', threshold: 90, actual: 96.0, status: 'passed' },
      { name: 'Data Refresh SLA', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Angela Martinez',
    lastEvaluated: '2024-12-09',
    segment: 'Compliance',
  },
  {
    id: 'qg_027',
    name: 'Risk Assessment v1.7.0 Release Gate',
    release: '1.7.0',
    application: 'app_risk_assessment',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 99.1, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 98.6, status: 'passed' },
      { name: 'E2E Test Pass Rate', threshold: 85, actual: 97.9, status: 'passed' },
      { name: 'Code Coverage', threshold: 85, actual: 93.2, status: 'passed' },
      { name: 'Risk Scoring Accuracy', threshold: 99, actual: 99.5, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Patricia Evans',
    lastEvaluated: '2024-12-05',
    segment: 'Compliance',
  },
  {
    id: 'qg_028',
    name: 'Claims Engine v4.11.2 Hotfix Gate',
    release: '4.11.2',
    application: 'app_claims_engine',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 97.8, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 96.5, status: 'passed' },
      { name: 'Regression Test Pass Rate', threshold: 95, actual: 98.2, status: 'passed' },
      { name: 'Hotfix Scope Validation', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Jennifer Williams',
    lastEvaluated: '2024-11-22',
    segment: 'Enterprise',
  },
  {
    id: 'qg_029',
    name: 'Medicare Enrollment v6.3.2 Hotfix Gate',
    release: '6.3.2',
    application: 'app_medicare_enrollment',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 97.2, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 95.8, status: 'passed' },
      { name: 'Regression Test Pass Rate', threshold: 95, actual: 96.5, status: 'passed' },
      { name: 'Dual-Eligible Processing Validation', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Critical Defects', threshold: 0, actual: 0, status: 'passed' },
    ],
    overallStatus: 'passed',
    waivers: [],
    configuredBy: 'Michael Torres',
    lastEvaluated: '2024-11-25',
    segment: 'Medicare',
  },
  {
    id: 'qg_030',
    name: 'HEDIS Engine v4.5.1 Hotfix Gate',
    release: '4.5.1',
    application: 'app_hedis_engine',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 95.8, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 93.2, status: 'passed' },
      { name: 'BCS Measure Validation', threshold: 100, actual: 94.5, status: 'waived' },
      { name: 'Performance Regression Check', threshold: 90, actual: 85.2, status: 'waived' },
      { name: 'Critical Defects', threshold: 0, actual: 1, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [
      {
        id: 'wv_004',
        gateName: 'BCS Measure Validation',
        reason: 'BCS measure exclusion logic fix is in progress (DEF-2024-0872). Hotfix addresses a separate BCS data extraction performance issue. Full measure validation will be completed in v4.6.1.',
        approvedBy: 'Angela Martinez',
        approvedDate: '2024-11-14',
        expirationDate: '2025-01-31',
      },
      {
        id: 'wv_005',
        gateName: 'Performance Regression Check',
        reason: 'Known performance degradation for full population calculation is being addressed in a separate performance optimization initiative. Hotfix scope is limited to BCS calculation logic.',
        approvedBy: 'Jennifer Williams',
        approvedDate: '2024-11-14',
        expirationDate: '2025-02-28',
      },
    ],
    configuredBy: 'Angela Martinez',
    lastEvaluated: '2024-11-15',
    segment: 'Medicare',
  },
  {
    id: 'qg_031',
    name: 'Medicaid Eligibility v3.8.2 Hotfix Gate',
    release: '3.8.2',
    application: 'app_medicaid_eligibility',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 95, actual: 94.2, status: 'waived' },
      { name: 'Integration Test Pass Rate', threshold: 90, actual: 92.8, status: 'passed' },
      { name: 'Batch Processing Validation', threshold: 100, actual: 98.5, status: 'waived' },
      { name: 'Critical Defects', threshold: 0, actual: 1, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [
      {
        id: 'wv_006',
        gateName: 'Unit Test Pass Rate',
        reason: 'Unit test failures are related to the multi-state configuration feature (dem_036) which is not in scope for this hotfix. Existing failures are pre-existing and documented.',
        approvedBy: 'David Park',
        approvedDate: '2024-11-13',
        expirationDate: '2025-01-31',
      },
      {
        id: 'wv_007',
        gateName: 'Batch Processing Validation',
        reason: 'Batch processing null pointer exception fix addresses 23 of 25 known failure scenarios. Remaining 2 edge cases require schema changes planned for v3.9.1.',
        approvedBy: 'David Park',
        approvedDate: '2024-11-13',
        expirationDate: '2025-01-15',
      },
    ],
    configuredBy: 'David Park',
    lastEvaluated: '2024-11-14',
    segment: 'Medicaid',
  },
  {
    id: 'qg_032',
    name: 'API Gateway v1.6.2 Emergency Fix Gate',
    release: '1.6.2',
    application: 'app_partner_api_gateway',
    gates: [
      { name: 'Unit Test Pass Rate', threshold: 90, actual: 91.2, status: 'passed' },
      { name: 'Integration Test Pass Rate', threshold: 85, actual: 88.5, status: 'passed' },
      { name: 'Timeout Fix Validation', threshold: 100, actual: 100, status: 'passed' },
      { name: 'Load Test Stability', threshold: 95, actual: 87.3, status: 'waived' },
      { name: 'Critical Defects', threshold: 0, actual: 2, status: 'failed' },
    ],
    overallStatus: 'failed',
    waivers: [
      {
        id: 'wv_008',
        gateName: 'Load Test Stability',
        reason: 'Emergency fix addresses critical timeout issues under high load. Full load test stability improvement is part of the API Gateway Performance Optimization demand (dem_004).',
        approvedBy: 'Jennifer Williams',
        approvedDate: '2024-11-04',
        expirationDate: '2025-01-15',
      },
    ],
    configuredBy: 'Alex Rivera',
    lastEvaluated: '2024-11-05',
    segment: 'External',
  },
];

/**
 * Returns all available quality gates.
 *
 * @returns {QualityGate[]} Array of all quality gate objects
 */
export function getAllQualityGates() {
  return [...qualityGates];
}

/**
 * Retrieves a single quality gate by its unique ID.
 *
 * @param {string} qualityGateId - The quality gate identifier to look up
 * @returns {QualityGate|null} The matching quality gate object, or null if not found
 */
export function getQualityGateById(qualityGateId) {
  if (!qualityGateId || typeof qualityGateId !== 'string') {
    return null;
  }
  return qualityGates.find((qg) => qg.id === qualityGateId) || null;
}

/**
 * Returns all quality gates associated with a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {QualityGate[]} Array of quality gates for the specified application
 */
export function getQualityGatesByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return qualityGates.filter((qg) => qg.application === applicationId);
}

/**
 * Returns all quality gates filtered by overall status.
 *
 * @param {string} status - The overall status to filter by (e.g. 'passed', 'failed', 'waived', 'pending')
 * @returns {QualityGate[]} Array of quality gates matching the specified status
 */
export function getQualityGatesByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return qualityGates.filter((qg) => qg.overallStatus === status);
}

/**
 * Returns all quality gates belonging to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {QualityGate[]} Array of quality gates in the specified segment
 */
export function getQualityGatesBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return qualityGates.filter((qg) => qg.segment === segment);
}

/**
 * Returns all quality gates for a specific release version.
 *
 * @param {string} release - The release version to filter by
 * @returns {QualityGate[]} Array of quality gates for the specified release
 */
export function getQualityGatesByRelease(release) {
  if (!release || typeof release !== 'string') {
    return [];
  }
  return qualityGates.filter((qg) => qg.release === release);
}

/**
 * Returns all quality gates configured by a specific person.
 *
 * @param {string} configuredBy - The name of the person to filter by
 * @returns {QualityGate[]} Array of quality gates configured by the specified person
 */
export function getQualityGatesByConfiguredBy(configuredBy) {
  if (!configuredBy || typeof configuredBy !== 'string') {
    return [];
  }
  return qualityGates.filter((qg) => qg.configuredBy === configuredBy);
}

/**
 * Returns all quality gates that have active waivers.
 *
 * @returns {QualityGate[]} Array of quality gates with at least one waiver
 */
export function getQualityGatesWithWaivers() {
  return qualityGates.filter((qg) => qg.waivers.length > 0);
}

/**
 * Returns aggregate statistics across all quality gates.
 *
 * @returns {{ totalQualityGates: number, statusBreakdown: Object<string, number>, segmentBreakdown: Object<string, number>, totalGateCriteria: number, totalWaivers: number, passRate: number, averageGateCriteriaPerGate: number }} Aggregate quality gate statistics
 */
export function getQualityGateAggregates() {
  const totalQualityGates = qualityGates.length;

  const statusBreakdown = qualityGates.reduce((acc, qg) => {
    acc[qg.overallStatus] = (acc[qg.overallStatus] || 0) + 1;
    return acc;
  }, {});

  const segmentBreakdown = qualityGates.reduce((acc, qg) => {
    acc[qg.segment] = (acc[qg.segment] || 0) + 1;
    return acc;
  }, {});

  const totalGateCriteria = qualityGates.reduce((sum, qg) => sum + qg.gates.length, 0);
  const totalWaivers = qualityGates.reduce((sum, qg) => sum + qg.waivers.length, 0);

  const passedGates = qualityGates.filter((qg) => qg.overallStatus === 'passed').length;
  const passRate =
    totalQualityGates > 0
      ? Math.round((passedGates / totalQualityGates) * 1000) / 10
      : 0;

  const averageGateCriteriaPerGate =
    totalQualityGates > 0
      ? Math.round((totalGateCriteria / totalQualityGates) * 10) / 10
      : 0;

  return {
    totalQualityGates,
    statusBreakdown,
    segmentBreakdown,
    totalGateCriteria,
    totalWaivers,
    passRate,
    averageGateCriteriaPerGate,
  };
}

/**
 * Returns all unique overall statuses across all quality gates.
 *
 * @returns {string[]} Array of unique overall statuses sorted alphabetically
 */
export function getAllQualityGateStatuses() {
  const statuses = new Set(qualityGates.map((qg) => qg.overallStatus));
  return [...statuses].sort();
}

/**
 * Returns all unique segments across all quality gates.
 *
 * @returns {string[]} Array of unique segments sorted alphabetically
 */
export function getAllQualityGateSegments() {
  const segments = new Set(qualityGates.map((qg) => qg.segment));
  return [...segments].sort();
}

/**
 * Returns all unique configuredBy names across all quality gates.
 *
 * @returns {string[]} Array of unique configuredBy names sorted alphabetically
 */
export function getAllQualityGateConfigurers() {
  const configurers = new Set(qualityGates.map((qg) => qg.configuredBy));
  return [...configurers].sort();
}

export default qualityGates;