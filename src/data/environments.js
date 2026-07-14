import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} ConflictDetection
 * @property {boolean} enabled - Whether conflict detection is enabled
 * @property {string[]} activeConflicts - Array of active conflict descriptions
 * @property {string} lastChecked - Last conflict check timestamp in ISO format
 * @property {string} strategy - Conflict resolution strategy (block, warn, auto_resolve)
 */

/**
 * @typedef {Object} HealthCheck
 * @property {string} service - Service name
 * @property {string} status - Health status (healthy, degraded, unhealthy)
 * @property {number} responseTimeMs - Response time in milliseconds
 * @property {string} lastChecked - Last health check timestamp in ISO format
 */

/**
 * @typedef {Object} Environment
 * @property {string} id - Unique environment identifier
 * @property {string} name - Display name of the environment
 * @property {string} type - Environment type (dev, staging, qa, uat, prod)
 * @property {string} status - Current status (available, reserved, maintenance, down)
 * @property {string} reservedBy - Name of the person who reserved the environment (empty string if not reserved)
 * @property {string} reservationStart - Reservation start time in ISO format (empty string if not reserved)
 * @property {string} reservationEnd - Reservation end time in ISO format (empty string if not reserved)
 * @property {string[]} applications - Array of application IDs deployed to this environment
 * @property {number} healthScore - Overall health score (0-100)
 * @property {ConflictDetection} conflictDetection - Conflict detection configuration and state
 * @property {HealthCheck[]} healthChecks - Array of individual service health checks
 * @property {string} region - Deployment region
 * @property {string} owner - Environment owner name
 * @property {string} description - Description of the environment purpose
 * @property {string} lastDeployDate - Last deployment date in ISO format
 * @property {string} createdDate - Environment creation date in ISO format
 */

/**
 * Mock environment data for the EQIP Quality Platform.
 * Contains environment objects representing various deployment environments
 * with status, reservation, health, and conflict detection information.
 *
 * @type {Environment[]}
 */
const environments = [
  {
    id: 'env_dev_01',
    name: 'Development 1',
    type: 'dev',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_auth_service',
      'app_notification_hub',
    ],
    healthScore: 95.2,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:00:00Z',
      strategy: 'warn',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 45, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Member Portal', status: 'healthy', responseTimeMs: 32, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Notification Hub', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Chris Anderson',
    description: 'Primary development environment for enterprise application feature development and unit testing.',
    lastDeployDate: '2024-12-12',
    createdDate: '2023-01-15',
  },
  {
    id: 'env_dev_02',
    name: 'Development 2',
    type: 'dev',
    status: 'reserved',
    reservedBy: 'Lisa Johnson',
    reservationStart: '2024-12-12T08:00:00Z',
    reservationEnd: '2024-12-13T18:00:00Z',
    applications: [
      'app_hedis_engine',
      'app_star_ratings',
      'app_data_warehouse',
    ],
    healthScore: 92.8,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T13:45:00Z',
      strategy: 'warn',
    },
    healthChecks: [
      { service: 'HEDIS Engine', status: 'healthy', responseTimeMs: 68, lastChecked: '2024-12-12T13:45:00Z' },
      { service: 'Star Ratings', status: 'healthy', responseTimeMs: 42, lastChecked: '2024-12-12T13:45:00Z' },
      { service: 'Data Warehouse', status: 'degraded', responseTimeMs: 320, lastChecked: '2024-12-12T13:45:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Lisa Johnson',
    description: 'Secondary development environment dedicated to Medicare measure engine development and HEDIS specification updates.',
    lastDeployDate: '2024-12-11',
    createdDate: '2023-03-20',
  },
  {
    id: 'env_dev_03',
    name: 'Development 3',
    type: 'dev',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_care_management',
      'app_provider_network',
    ],
    healthScore: 88.5,
    conflictDetection: {
      enabled: true,
      activeConflicts: ['Medicaid eligibility rules engine branch conflict with state reporting data model changes'],
      lastChecked: '2024-12-12T12:30:00Z',
      strategy: 'warn',
    },
    healthChecks: [
      { service: 'Medicaid Eligibility', status: 'healthy', responseTimeMs: 55, lastChecked: '2024-12-12T12:30:00Z' },
      { service: 'State Reporting', status: 'healthy', responseTimeMs: 48, lastChecked: '2024-12-12T12:30:00Z' },
      { service: 'Care Management', status: 'degraded', responseTimeMs: 280, lastChecked: '2024-12-12T12:30:00Z' },
      { service: 'Provider Network', status: 'healthy', responseTimeMs: 38, lastChecked: '2024-12-12T12:30:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Robert Kim',
    description: 'Development environment for Medicaid segment applications including eligibility, reporting, and care management.',
    lastDeployDate: '2024-12-10',
    createdDate: '2023-05-10',
  },
  {
    id: 'env_dev_04',
    name: 'Development 4',
    type: 'dev',
    status: 'reserved',
    reservedBy: 'James Wright',
    reservationStart: '2024-12-11T10:00:00Z',
    reservationEnd: '2024-12-14T18:00:00Z',
    applications: [
      'app_vendor_integration',
      'app_partner_api_gateway',
      'app_external_data_feed',
    ],
    healthScore: 78.3,
    conflictDetection: {
      enabled: true,
      activeConflicts: ['Vendor integration error recovery branch conflicts with API gateway rate limiting changes'],
      lastChecked: '2024-12-12T11:00:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Vendor Integration', status: 'degraded', responseTimeMs: 450, lastChecked: '2024-12-12T11:00:00Z' },
      { service: 'Partner API Gateway', status: 'healthy', responseTimeMs: 62, lastChecked: '2024-12-12T11:00:00Z' },
      { service: 'External Data Feed', status: 'unhealthy', responseTimeMs: 1200, lastChecked: '2024-12-12T11:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Alex Rivera',
    description: 'Development environment for external integration applications including vendor hub, API gateway, and data feed processor.',
    lastDeployDate: '2024-12-11',
    createdDate: '2023-07-01',
  },
  {
    id: 'env_qa_01',
    name: 'QA Primary',
    type: 'qa',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_provider_directory',
      'app_auth_service',
      'app_data_warehouse',
      'app_notification_hub',
      'app_medicare_enrollment',
      'app_star_ratings',
      'app_hedis_engine',
      'app_part_d_formulary',
      'app_benefits_admin',
    ],
    healthScore: 96.5,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:15:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 38, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Member Portal', status: 'healthy', responseTimeMs: 25, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Provider Directory', status: 'healthy', responseTimeMs: 30, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 15, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 85, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Notification Hub', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Medicare Enrollment', status: 'healthy', responseTimeMs: 42, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Star Ratings', status: 'healthy', responseTimeMs: 35, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'HEDIS Engine', status: 'healthy', responseTimeMs: 58, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Part D Formulary', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:15:00Z' },
      { service: 'Benefits Admin', status: 'healthy', responseTimeMs: 32, lastChecked: '2024-12-12T14:15:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Jennifer Williams',
    description: 'Primary QA environment for enterprise and Medicare application testing with full integration stack.',
    lastDeployDate: '2024-12-12',
    createdDate: '2022-06-01',
  },
  {
    id: 'env_qa_02',
    name: 'QA Secondary',
    type: 'qa',
    status: 'reserved',
    reservedBy: 'Robert Kim',
    reservationStart: '2024-12-12T06:00:00Z',
    reservationEnd: '2024-12-13T22:00:00Z',
    applications: [
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_care_management',
      'app_provider_network',
      'app_claims_engine',
      'app_auth_service',
    ],
    healthScore: 91.2,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T13:00:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Medicaid Eligibility', status: 'healthy', responseTimeMs: 48, lastChecked: '2024-12-12T13:00:00Z' },
      { service: 'State Reporting', status: 'healthy', responseTimeMs: 55, lastChecked: '2024-12-12T13:00:00Z' },
      { service: 'Care Management', status: 'healthy', responseTimeMs: 42, lastChecked: '2024-12-12T13:00:00Z' },
      { service: 'Provider Network', status: 'healthy', responseTimeMs: 35, lastChecked: '2024-12-12T13:00:00Z' },
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 40, lastChecked: '2024-12-12T13:00:00Z' },
      { service: 'Auth Service', status: 'degraded', responseTimeMs: 180, lastChecked: '2024-12-12T13:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'David Park',
    description: 'Secondary QA environment dedicated to Medicaid segment testing including eligibility, reporting, and care management workflows.',
    lastDeployDate: '2024-12-11',
    createdDate: '2022-08-15',
  },
  {
    id: 'env_qa_03',
    name: 'QA Commercial',
    type: 'qa',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_group_enrollment',
      'app_individual_marketplace',
      'app_broker_portal',
      'app_underwriting_engine',
      'app_wellness_platform',
      'app_claims_engine',
      'app_auth_service',
    ],
    healthScore: 94.8,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:30:00Z',
      strategy: 'warn',
    },
    healthChecks: [
      { service: 'Group Enrollment', status: 'healthy', responseTimeMs: 35, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Individual Marketplace', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Broker Portal', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Underwriting Engine', status: 'healthy', responseTimeMs: 45, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Wellness Platform', status: 'healthy', responseTimeMs: 30, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 38, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 15, lastChecked: '2024-12-12T14:30:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Kevin Brown',
    description: 'QA environment for commercial segment applications including group enrollment, marketplace, broker portal, and underwriting.',
    lastDeployDate: '2024-12-12',
    createdDate: '2022-10-01',
  },
  {
    id: 'env_qa_04',
    name: 'QA External',
    type: 'qa',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_partner_api_gateway',
      'app_vendor_integration',
      'app_external_data_feed',
      'app_auth_service',
    ],
    healthScore: 72.4,
    conflictDetection: {
      enabled: true,
      activeConflicts: [
        'API gateway OAuth scope enforcement changes conflict with vendor integration authentication flow',
        'External data feed 2025 CMS format validation conflicts with existing file processing pipeline',
      ],
      lastChecked: '2024-12-12T12:00:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Partner API Gateway', status: 'degraded', responseTimeMs: 380, lastChecked: '2024-12-12T12:00:00Z' },
      { service: 'Vendor Integration', status: 'unhealthy', responseTimeMs: 950, lastChecked: '2024-12-12T12:00:00Z' },
      { service: 'External Data Feed', status: 'degraded', responseTimeMs: 520, lastChecked: '2024-12-12T12:00:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T12:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Alex Rivera',
    description: 'QA environment for external-facing integration applications including partner APIs, vendor integrations, and data feed processing.',
    lastDeployDate: '2024-12-10',
    createdDate: '2023-01-20',
  },
  {
    id: 'env_qa_compliance',
    name: 'QA Compliance',
    type: 'qa',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_audit_tracker',
      'app_regulatory_reporting',
      'app_compliance_dashboard',
      'app_risk_assessment',
      'app_data_warehouse',
    ],
    healthScore: 98.1,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:45:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Audit Tracker', status: 'healthy', responseTimeMs: 20, lastChecked: '2024-12-12T14:45:00Z' },
      { service: 'Regulatory Reporting', status: 'healthy', responseTimeMs: 32, lastChecked: '2024-12-12T14:45:00Z' },
      { service: 'Compliance Dashboard', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T14:45:00Z' },
      { service: 'Risk Assessment', status: 'healthy', responseTimeMs: 25, lastChecked: '2024-12-12T14:45:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 78, lastChecked: '2024-12-12T14:45:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Patricia Evans',
    description: 'Dedicated QA environment for compliance segment applications including audit tracking, regulatory reporting, and risk assessment.',
    lastDeployDate: '2024-12-12',
    createdDate: '2023-02-15',
  },
  {
    id: 'env_staging_01',
    name: 'Staging Primary',
    type: 'staging',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_provider_directory',
      'app_auth_service',
      'app_data_warehouse',
      'app_notification_hub',
      'app_medicare_enrollment',
      'app_star_ratings',
      'app_hedis_engine',
      'app_part_d_formulary',
      'app_benefits_admin',
      'app_group_enrollment',
      'app_individual_marketplace',
      'app_broker_portal',
      'app_underwriting_engine',
      'app_wellness_platform',
    ],
    healthScore: 97.8,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:30:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 35, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Member Portal', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Provider Directory', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 12, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 72, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Notification Hub', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Medicare Enrollment', status: 'healthy', responseTimeMs: 38, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Star Ratings', status: 'healthy', responseTimeMs: 30, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'HEDIS Engine', status: 'healthy', responseTimeMs: 52, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Part D Formulary', status: 'healthy', responseTimeMs: 24, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Benefits Admin', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Group Enrollment', status: 'healthy', responseTimeMs: 32, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Individual Marketplace', status: 'healthy', responseTimeMs: 25, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Broker Portal', status: 'healthy', responseTimeMs: 20, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Underwriting Engine', status: 'healthy', responseTimeMs: 40, lastChecked: '2024-12-12T14:30:00Z' },
      { service: 'Wellness Platform', status: 'healthy', responseTimeMs: 26, lastChecked: '2024-12-12T14:30:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Jennifer Williams',
    description: 'Primary staging environment mirroring production configuration for pre-release validation of enterprise, Medicare, and commercial applications.',
    lastDeployDate: '2024-12-12',
    createdDate: '2022-03-01',
  },
  {
    id: 'env_staging_02',
    name: 'Staging Medicaid',
    type: 'staging',
    status: 'reserved',
    reservedBy: 'David Park',
    reservationStart: '2024-12-12T00:00:00Z',
    reservationEnd: '2024-12-14T23:59:00Z',
    applications: [
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_care_management',
      'app_provider_network',
      'app_claims_engine',
      'app_auth_service',
      'app_data_warehouse',
    ],
    healthScore: 93.4,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T13:30:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Medicaid Eligibility', status: 'healthy', responseTimeMs: 42, lastChecked: '2024-12-12T13:30:00Z' },
      { service: 'State Reporting', status: 'healthy', responseTimeMs: 50, lastChecked: '2024-12-12T13:30:00Z' },
      { service: 'Care Management', status: 'healthy', responseTimeMs: 38, lastChecked: '2024-12-12T13:30:00Z' },
      { service: 'Provider Network', status: 'healthy', responseTimeMs: 30, lastChecked: '2024-12-12T13:30:00Z' },
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 36, lastChecked: '2024-12-12T13:30:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 14, lastChecked: '2024-12-12T13:30:00Z' },
      { service: 'Data Warehouse', status: 'degraded', responseTimeMs: 250, lastChecked: '2024-12-12T13:30:00Z' },
    ],
    region: 'us-east-1',
    owner: 'David Park',
    description: 'Staging environment for Medicaid segment pre-release validation including eligibility, state reporting, and care management workflows.',
    lastDeployDate: '2024-12-11',
    createdDate: '2022-09-15',
  },
  {
    id: 'env_staging_external',
    name: 'Staging External',
    type: 'staging',
    status: 'maintenance',
    reservedBy: 'Daniel Robinson',
    reservationStart: '2024-12-12T02:00:00Z',
    reservationEnd: '2024-12-12T18:00:00Z',
    applications: [
      'app_partner_api_gateway',
      'app_vendor_integration',
      'app_external_data_feed',
      'app_auth_service',
    ],
    healthScore: 45.2,
    conflictDetection: {
      enabled: false,
      activeConflicts: [],
      lastChecked: '2024-12-12T02:00:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Partner API Gateway', status: 'unhealthy', responseTimeMs: 0, lastChecked: '2024-12-12T02:00:00Z' },
      { service: 'Vendor Integration', status: 'unhealthy', responseTimeMs: 0, lastChecked: '2024-12-12T02:00:00Z' },
      { service: 'External Data Feed', status: 'unhealthy', responseTimeMs: 0, lastChecked: '2024-12-12T02:00:00Z' },
      { service: 'Auth Service', status: 'unhealthy', responseTimeMs: 0, lastChecked: '2024-12-12T02:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Alex Rivera',
    description: 'Staging environment for external integration applications currently under scheduled maintenance for infrastructure upgrades.',
    lastDeployDate: '2024-12-10',
    createdDate: '2023-04-01',
  },
  {
    id: 'env_uat_01',
    name: 'UAT Enterprise',
    type: 'uat',
    status: 'reserved',
    reservedBy: 'Angela Martinez',
    reservationStart: '2024-12-10T08:00:00Z',
    reservationEnd: '2024-12-16T18:00:00Z',
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_provider_directory',
      'app_auth_service',
      'app_data_warehouse',
      'app_notification_hub',
    ],
    healthScore: 98.5,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:00:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 32, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Member Portal', status: 'healthy', responseTimeMs: 20, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Provider Directory', status: 'healthy', responseTimeMs: 25, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 10, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 65, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Notification Hub', status: 'healthy', responseTimeMs: 15, lastChecked: '2024-12-12T14:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Angela Martinez',
    description: 'User acceptance testing environment for enterprise applications with production-like data and configuration for stakeholder validation.',
    lastDeployDate: '2024-12-10',
    createdDate: '2022-04-15',
  },
  {
    id: 'env_uat_02',
    name: 'UAT Medicare',
    type: 'uat',
    status: 'reserved',
    reservedBy: 'Michael Torres',
    reservationStart: '2024-12-09T08:00:00Z',
    reservationEnd: '2024-12-15T18:00:00Z',
    applications: [
      'app_medicare_enrollment',
      'app_star_ratings',
      'app_hedis_engine',
      'app_part_d_formulary',
      'app_benefits_admin',
      'app_claims_engine',
      'app_auth_service',
    ],
    healthScore: 95.7,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T13:15:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Medicare Enrollment', status: 'healthy', responseTimeMs: 35, lastChecked: '2024-12-12T13:15:00Z' },
      { service: 'Star Ratings', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T13:15:00Z' },
      { service: 'HEDIS Engine', status: 'healthy', responseTimeMs: 48, lastChecked: '2024-12-12T13:15:00Z' },
      { service: 'Part D Formulary', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T13:15:00Z' },
      { service: 'Benefits Admin', status: 'healthy', responseTimeMs: 26, lastChecked: '2024-12-12T13:15:00Z' },
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 34, lastChecked: '2024-12-12T13:15:00Z' },
      { service: 'Auth Service', status: 'degraded', responseTimeMs: 150, lastChecked: '2024-12-12T13:15:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Michael Torres',
    description: 'User acceptance testing environment for Medicare segment applications with AEP 2025 enrollment rules and Star Ratings validation.',
    lastDeployDate: '2024-12-09',
    createdDate: '2022-05-20',
  },
  {
    id: 'env_uat_03',
    name: 'UAT Compliance',
    type: 'uat',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_audit_tracker',
      'app_regulatory_reporting',
      'app_compliance_dashboard',
      'app_risk_assessment',
      'app_data_warehouse',
      'app_auth_service',
    ],
    healthScore: 99.2,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:50:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Audit Tracker', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T14:50:00Z' },
      { service: 'Regulatory Reporting', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:50:00Z' },
      { service: 'Compliance Dashboard', status: 'healthy', responseTimeMs: 15, lastChecked: '2024-12-12T14:50:00Z' },
      { service: 'Risk Assessment', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:50:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 68, lastChecked: '2024-12-12T14:50:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 10, lastChecked: '2024-12-12T14:50:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Patricia Evans',
    description: 'User acceptance testing environment for compliance applications with auditor-validated data sets and regulatory report templates.',
    lastDeployDate: '2024-12-09',
    createdDate: '2023-01-10',
  },
  {
    id: 'env_perf_01',
    name: 'Performance Testing',
    type: 'staging',
    status: 'reserved',
    reservedBy: 'Marcus Thompson',
    reservationStart: '2024-12-12T18:00:00Z',
    reservationEnd: '2024-12-13T06:00:00Z',
    applications: [
      'app_claims_engine',
      'app_hedis_engine',
      'app_data_warehouse',
      'app_medicare_enrollment',
      'app_partner_api_gateway',
      'app_notification_hub',
    ],
    healthScore: 94.0,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:00:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 40, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'HEDIS Engine', status: 'healthy', responseTimeMs: 55, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 90, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Medicare Enrollment', status: 'healthy', responseTimeMs: 45, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Partner API Gateway', status: 'healthy', responseTimeMs: 50, lastChecked: '2024-12-12T14:00:00Z' },
      { service: 'Notification Hub', status: 'healthy', responseTimeMs: 25, lastChecked: '2024-12-12T14:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Marcus Thompson',
    description: 'Dedicated performance testing environment with production-equivalent hardware for load testing, stress testing, and benchmark validation.',
    lastDeployDate: '2024-12-12',
    createdDate: '2022-07-01',
  },
  {
    id: 'env_prod_01',
    name: 'Production US-East',
    type: 'prod',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_provider_directory',
      'app_auth_service',
      'app_data_warehouse',
      'app_notification_hub',
      'app_medicare_enrollment',
      'app_star_ratings',
      'app_hedis_engine',
      'app_part_d_formulary',
      'app_benefits_admin',
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_care_management',
      'app_provider_network',
      'app_group_enrollment',
      'app_individual_marketplace',
      'app_broker_portal',
      'app_underwriting_engine',
      'app_wellness_platform',
      'app_partner_api_gateway',
      'app_vendor_integration',
      'app_external_data_feed',
      'app_audit_tracker',
      'app_regulatory_reporting',
      'app_compliance_dashboard',
      'app_risk_assessment',
    ],
    healthScore: 99.4,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:55:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Member Portal', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Provider Directory', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 8, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 55, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Notification Hub', status: 'healthy', responseTimeMs: 12, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Medicare Enrollment', status: 'healthy', responseTimeMs: 30, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Star Ratings', status: 'healthy', responseTimeMs: 25, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'HEDIS Engine', status: 'healthy', responseTimeMs: 42, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Part D Formulary', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Benefits Admin', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Medicaid Eligibility', status: 'healthy', responseTimeMs: 35, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'State Reporting', status: 'healthy', responseTimeMs: 40, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Care Management', status: 'healthy', responseTimeMs: 30, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Provider Network', status: 'healthy', responseTimeMs: 25, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Group Enrollment', status: 'healthy', responseTimeMs: 28, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Individual Marketplace', status: 'healthy', responseTimeMs: 20, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Broker Portal', status: 'healthy', responseTimeMs: 16, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Underwriting Engine', status: 'healthy', responseTimeMs: 35, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Wellness Platform', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Partner API Gateway', status: 'healthy', responseTimeMs: 45, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Vendor Integration', status: 'degraded', responseTimeMs: 280, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'External Data Feed', status: 'healthy', responseTimeMs: 65, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Audit Tracker', status: 'healthy', responseTimeMs: 14, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Regulatory Reporting', status: 'healthy', responseTimeMs: 24, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Compliance Dashboard', status: 'healthy', responseTimeMs: 12, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Risk Assessment', status: 'healthy', responseTimeMs: 18, lastChecked: '2024-12-12T14:55:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Jennifer Williams',
    description: 'Primary production environment hosting all platform applications serving members, providers, brokers, and internal users.',
    lastDeployDate: '2024-12-12',
    createdDate: '2019-01-01',
  },
  {
    id: 'env_prod_02',
    name: 'Production US-West (DR)',
    type: 'prod',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_auth_service',
      'app_data_warehouse',
      'app_medicare_enrollment',
      'app_medicaid_eligibility',
    ],
    healthScore: 99.1,
    conflictDetection: {
      enabled: true,
      activeConflicts: [],
      lastChecked: '2024-12-12T14:55:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'healthy', responseTimeMs: 32, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Member Portal', status: 'healthy', responseTimeMs: 22, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 10, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Data Warehouse', status: 'healthy', responseTimeMs: 60, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Medicare Enrollment', status: 'healthy', responseTimeMs: 34, lastChecked: '2024-12-12T14:55:00Z' },
      { service: 'Medicaid Eligibility', status: 'healthy', responseTimeMs: 38, lastChecked: '2024-12-12T14:55:00Z' },
    ],
    region: 'us-west-2',
    owner: 'Daniel Robinson',
    description: 'Disaster recovery production environment in US-West region with critical application replicas for business continuity.',
    lastDeployDate: '2024-12-12',
    createdDate: '2020-06-01',
  },
  {
    id: 'env_sandbox_01',
    name: 'Partner Sandbox',
    type: 'dev',
    status: 'available',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_partner_api_gateway',
      'app_auth_service',
    ],
    healthScore: 90.5,
    conflictDetection: {
      enabled: false,
      activeConflicts: [],
      lastChecked: '2024-12-12T10:00:00Z',
      strategy: 'warn',
    },
    healthChecks: [
      { service: 'Partner API Gateway', status: 'healthy', responseTimeMs: 55, lastChecked: '2024-12-12T10:00:00Z' },
      { service: 'Auth Service', status: 'healthy', responseTimeMs: 20, lastChecked: '2024-12-12T10:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Alex Rivera',
    description: 'Sandbox environment for external partner API integration testing and onboarding with rate-limited access and mock data.',
    lastDeployDate: '2024-12-08',
    createdDate: '2023-06-15',
  },
  {
    id: 'env_qa_hotfix',
    name: 'QA Hotfix',
    type: 'qa',
    status: 'down',
    reservedBy: '',
    reservationStart: '',
    reservationEnd: '',
    applications: [
      'app_claims_engine',
      'app_member_portal',
      'app_auth_service',
    ],
    healthScore: 0,
    conflictDetection: {
      enabled: false,
      activeConflicts: [],
      lastChecked: '2024-12-11T22:00:00Z',
      strategy: 'block',
    },
    healthChecks: [
      { service: 'Claims Engine', status: 'unhealthy', responseTimeMs: 0, lastChecked: '2024-12-11T22:00:00Z' },
      { service: 'Member Portal', status: 'unhealthy', responseTimeMs: 0, lastChecked: '2024-12-11T22:00:00Z' },
      { service: 'Auth Service', status: 'unhealthy', responseTimeMs: 0, lastChecked: '2024-12-11T22:00:00Z' },
    ],
    region: 'us-east-1',
    owner: 'Karen Mitchell',
    description: 'Dedicated QA environment for hotfix validation currently offline due to infrastructure failure. Incident ticket INC-2024-1205 opened.',
    lastDeployDate: '2024-12-11',
    createdDate: '2023-09-01',
  },
];

/**
 * Returns all available environments.
 *
 * @returns {Environment[]} Array of all environment objects
 */
export function getAllEnvironments() {
  return [...environments];
}

/**
 * Retrieves a single environment by its unique ID.
 *
 * @param {string} environmentId - The environment identifier to look up
 * @returns {Environment|null} The matching environment object, or null if not found
 */
export function getEnvironmentById(environmentId) {
  if (!environmentId || typeof environmentId !== 'string') {
    return null;
  }
  return environments.find((e) => e.id === environmentId) || null;
}

/**
 * Returns all environments filtered by type.
 *
 * @param {string} type - The type to filter by (e.g. 'dev', 'staging', 'qa', 'uat', 'prod')
 * @returns {Environment[]} Array of environments matching the specified type
 */
export function getEnvironmentsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return environments.filter((e) => e.type === type);
}

/**
 * Returns all environments filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'available', 'reserved', 'maintenance', 'down')
 * @returns {Environment[]} Array of environments matching the specified status
 */
export function getEnvironmentsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return environments.filter((e) => e.status === status);
}

/**
 * Returns all environments that contain a specific application.
 *
 * @param {string} applicationId - The application ID to search for
 * @returns {Environment[]} Array of environments containing the specified application
 */
export function getEnvironmentsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return environments.filter((e) => e.applications.includes(applicationId));
}

/**
 * Returns all environments reserved by a specific person.
 *
 * @param {string} reservedBy - The name of the person to filter by
 * @returns {Environment[]} Array of environments reserved by the specified person
 */
export function getEnvironmentsByReservedBy(reservedBy) {
  if (!reservedBy || typeof reservedBy !== 'string') {
    return [];
  }
  return environments.filter((e) => e.reservedBy === reservedBy);
}

/**
 * Returns all environments owned by a specific person.
 *
 * @param {string} owner - The owner name to filter by
 * @returns {Environment[]} Array of environments owned by the specified person
 */
export function getEnvironmentsByOwner(owner) {
  if (!owner || typeof owner !== 'string') {
    return [];
  }
  return environments.filter((e) => e.owner === owner);
}

/**
 * Returns all environments that have active conflicts.
 *
 * @returns {Environment[]} Array of environments with at least one active conflict
 */
export function getEnvironmentsWithConflicts() {
  return environments.filter((e) => e.conflictDetection.activeConflicts.length > 0);
}

/**
 * Returns all environments with health score below a specified threshold.
 *
 * @param {number} threshold - The health score threshold (0-100)
 * @returns {Environment[]} Array of environments with health score below the threshold
 */
export function getUnhealthyEnvironments(threshold = 80) {
  if (!Number.isFinite(threshold)) {
    return [];
  }
  return environments.filter((e) => e.healthScore < threshold);
}

/**
 * Returns aggregate statistics across all environments.
 *
 * @returns {{ totalEnvironments: number, statusBreakdown: Object<string, number>, typeBreakdown: Object<string, number>, averageHealthScore: number, totalApplicationDeployments: number, environmentsWithConflicts: number, availableCount: number, reservedCount: number, maintenanceCount: number, downCount: number }} Aggregate environment statistics
 */
export function getEnvironmentAggregates() {
  const totalEnvironments = environments.length;

  const statusBreakdown = environments.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  const typeBreakdown = environments.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  const averageHealthScore =
    totalEnvironments > 0
      ? Math.round((environments.reduce((sum, e) => sum + e.healthScore, 0) / totalEnvironments) * 10) / 10
      : 0;

  const totalApplicationDeployments = environments.reduce((sum, e) => sum + e.applications.length, 0);

  const environmentsWithConflicts = environments.filter(
    (e) => e.conflictDetection.activeConflicts.length > 0
  ).length;

  const availableCount = environments.filter((e) => e.status === 'available').length;
  const reservedCount = environments.filter((e) => e.status === 'reserved').length;
  const maintenanceCount = environments.filter((e) => e.status === 'maintenance').length;
  const downCount = environments.filter((e) => e.status === 'down').length;

  return {
    totalEnvironments,
    statusBreakdown,
    typeBreakdown,
    averageHealthScore,
    totalApplicationDeployments,
    environmentsWithConflicts,
    availableCount,
    reservedCount,
    maintenanceCount,
    downCount,
  };
}

/**
 * Returns all unique environment types.
 *
 * @returns {string[]} Array of unique environment types sorted alphabetically
 */
export function getAllEnvironmentTypes() {
  const types = new Set(environments.map((e) => e.type));
  return [...types].sort();
}

/**
 * Returns all unique environment statuses.
 *
 * @returns {string[]} Array of unique environment statuses sorted alphabetically
 */
export function getAllEnvironmentStatuses() {
  const statuses = new Set(environments.map((e) => e.status));
  return [...statuses].sort();
}

/**
 * Returns all unique regions across all environments.
 *
 * @returns {string[]} Array of unique regions sorted alphabetically
 */
export function getAllEnvironmentRegions() {
  const regions = new Set(environments.map((e) => e.region));
  return [...regions].sort();
}

/**
 * Returns all unique owner names across all environments.
 *
 * @returns {string[]} Array of unique owner names sorted alphabetically
 */
export function getAllEnvironmentOwners() {
  const owners = new Set(environments.map((e) => e.owner));
  return [...owners].sort();
}

export default environments;