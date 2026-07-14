import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} AuditEntry
 * @property {string} timestamp - Audit event timestamp in ISO format
 * @property {string} action - Action performed (created, refreshed, masked, provisioned, updated, archived, restored)
 * @property {string} performedBy - Name of the person who performed the action
 * @property {string} details - Description of the action performed
 */

/**
 * @typedef {Object} TestData
 * @property {string} id - Unique test data identifier
 * @property {string} name - Display name of the test data asset
 * @property {string} type - Test data type (synthetic, masked_production, subset, seed, reference, golden, snapshot)
 * @property {string} application - Application ID this test data relates to
 * @property {string} environment - Target environment (Production, Staging, QA, Development, Performance)
 * @property {string} status - Current status (active, stale, archived, provisioning, error)
 * @property {string} maskingStatus - Data masking status (fully_masked, partially_masked, not_masked, not_applicable)
 * @property {string} provisioningStatus - Provisioning status (provisioned, pending, in_progress, failed, not_provisioned)
 * @property {string} lastRefreshed - Last refresh date in ISO format
 * @property {string} createdBy - Name of the person who created the test data
 * @property {AuditEntry[]} auditTrail - Array of audit trail entries
 */

/**
 * Mock test data assets for the EQIP Quality Platform.
 * Contains test data objects representing various test data sets across
 * applications and environments with masking, provisioning, and audit information.
 *
 * @type {TestData[]}
 */
const testData = [
  {
    id: 'td_001',
    name: 'Claims Adjudication Golden Dataset',
    type: 'golden',
    application: 'app_claims_engine',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-10',
    createdBy: 'Lisa Johnson',
    auditTrail: [
      { timestamp: '2024-06-15T09:00:00Z', action: 'created', performedBy: 'Lisa Johnson', details: 'Initial golden dataset created with 50,000 claims covering all lines of business.' },
      { timestamp: '2024-09-01T14:30:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Refreshed with updated value sets and new claim types for MY2024.' },
      { timestamp: '2024-09-01T15:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking applied using AES-256 tokenization.' },
      { timestamp: '2024-12-10T08:00:00Z', action: 'refreshed', performedBy: 'Lisa Johnson', details: 'Refreshed with AEP 2025 claim scenarios and updated fee schedules.' },
    ],
  },
  {
    id: 'td_002',
    name: 'Claims Batch Processing Performance Set',
    type: 'synthetic',
    application: 'app_claims_engine',
    environment: 'Performance',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-08',
    createdBy: 'Marcus Thompson',
    auditTrail: [
      { timestamp: '2024-05-20T10:00:00Z', action: 'created', performedBy: 'Marcus Thompson', details: 'Synthetic dataset generated with 100,000 claims for batch performance testing.' },
      { timestamp: '2024-08-15T16:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Expanded to 150,000 claims with varied complexity distributions.' },
      { timestamp: '2024-12-08T22:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Updated claim mix to reflect 2025 plan year processing patterns.' },
    ],
  },
  {
    id: 'td_003',
    name: 'Member Portal User Profiles',
    type: 'synthetic',
    application: 'app_member_portal',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-12',
    createdBy: 'Priya Patel',
    auditTrail: [
      { timestamp: '2024-06-01T11:00:00Z', action: 'created', performedBy: 'Priya Patel', details: 'Created 5,000 synthetic member profiles with varied demographics and plan types.' },
      { timestamp: '2024-09-15T09:30:00Z', action: 'refreshed', performedBy: 'Priya Patel', details: 'Added telehealth-eligible members and virtual ID card test data.' },
      { timestamp: '2024-12-12T07:00:00Z', action: 'refreshed', performedBy: 'Priya Patel', details: 'Updated profiles for 2025 plan year benefits and new dashboard redesign testing.' },
    ],
  },
  {
    id: 'td_004',
    name: 'Member Portal Accessibility Test Data',
    type: 'seed',
    application: 'app_member_portal',
    environment: 'Staging',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-11',
    createdBy: 'Omar Hassan',
    auditTrail: [
      { timestamp: '2024-04-15T08:00:00Z', action: 'created', performedBy: 'Omar Hassan', details: 'Seed data for accessibility testing with screen reader compatible content.' },
      { timestamp: '2024-12-11T10:00:00Z', action: 'refreshed', performedBy: 'Omar Hassan', details: 'Updated with new claims history table data for ARIA attribute testing.' },
    ],
  },
  {
    id: 'td_005',
    name: 'Provider Directory Geo-Spatial Dataset',
    type: 'synthetic',
    application: 'app_provider_directory',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-08',
    createdBy: 'Chris Anderson',
    auditTrail: [
      { timestamp: '2024-07-15T13:00:00Z', action: 'created', performedBy: 'Chris Anderson', details: 'Generated 25,000 synthetic provider records with geo-coordinates across 50 states.' },
      { timestamp: '2024-10-20T11:00:00Z', action: 'refreshed', performedBy: 'Chris Anderson', details: 'Added specialty matching data and drive time calculation test points.' },
      { timestamp: '2024-12-08T09:00:00Z', action: 'refreshed', performedBy: 'Chris Anderson', details: 'Updated with new credentialing status data and network participation flags.' },
    ],
  },
  {
    id: 'td_006',
    name: 'Auth Service Token Lifecycle Data',
    type: 'seed',
    application: 'app_auth_service',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-05',
    createdBy: 'Natalie White',
    auditTrail: [
      { timestamp: '2024-03-01T09:00:00Z', action: 'created', performedBy: 'Natalie White', details: 'Seed data for OAuth token lifecycle testing including expired, revoked, and valid tokens.' },
      { timestamp: '2024-08-10T14:00:00Z', action: 'refreshed', performedBy: 'Natalie White', details: 'Added passkey credential test data for FIDO2/WebAuthn testing.' },
      { timestamp: '2024-12-05T10:00:00Z', action: 'refreshed', performedBy: 'Chris Anderson', details: 'Updated with new MFA enrollment scenarios and token replay detection test cases.' },
    ],
  },
  {
    id: 'td_007',
    name: 'Data Warehouse HEDIS Clinical Data',
    type: 'masked_production',
    application: 'app_data_warehouse',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-06',
    createdBy: 'Samantha Clark',
    auditTrail: [
      { timestamp: '2024-02-15T10:00:00Z', action: 'created', performedBy: 'Samantha Clark', details: 'Masked production extract of 500,000 member clinical records for HEDIS measure testing.' },
      { timestamp: '2024-02-15T12:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Applied full PHI masking with deterministic tokenization for referential integrity.' },
      { timestamp: '2024-06-20T08:00:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Refreshed with Q2 2024 clinical data and new supplemental data sources.' },
      { timestamp: '2024-12-06T07:00:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Refreshed with MY2024 clinical data for HEDIS measure specification updates.' },
    ],
  },
  {
    id: 'td_008',
    name: 'Data Warehouse Performance Benchmark Set',
    type: 'synthetic',
    application: 'app_data_warehouse',
    environment: 'Performance',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-05',
    createdBy: 'Marcus Thompson',
    auditTrail: [
      { timestamp: '2024-06-20T14:00:00Z', action: 'created', performedBy: 'Marcus Thompson', details: 'Synthetic dataset with 1M member records for query performance benchmarking.' },
      { timestamp: '2024-12-05T20:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Updated data distribution to match production cardinality for accurate benchmark results.' },
    ],
  },
  {
    id: 'td_009',
    name: 'Notification Hub Delivery Test Data',
    type: 'seed',
    application: 'app_notification_hub',
    environment: 'Staging',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-09',
    createdBy: 'James Wright',
    auditTrail: [
      { timestamp: '2024-08-01T09:00:00Z', action: 'created', performedBy: 'James Wright', details: 'Seed data for notification delivery testing across email, SMS, push, and in-app channels.' },
      { timestamp: '2024-12-09T06:00:00Z', action: 'refreshed', performedBy: 'James Wright', details: 'Added preference center opt-out scenarios and batch delivery test records.' },
    ],
  },
  {
    id: 'td_010',
    name: 'Medicare Enrollment AEP 2025 Dataset',
    type: 'golden',
    application: 'app_medicare_enrollment',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-11',
    createdBy: 'Lisa Johnson',
    auditTrail: [
      { timestamp: '2024-07-15T08:00:00Z', action: 'created', performedBy: 'Lisa Johnson', details: 'Golden dataset for AEP 2025 enrollment testing with 10,000 member enrollment scenarios.' },
      { timestamp: '2024-07-15T10:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking applied to all member demographic and enrollment data.' },
      { timestamp: '2024-09-28T14:00:00Z', action: 'refreshed', performedBy: 'Lisa Johnson', details: 'Updated with CMS-mandated AEP 2025 enrollment rules and plan benefit configurations.' },
      { timestamp: '2024-12-11T09:00:00Z', action: 'refreshed', performedBy: 'Lisa Johnson', details: 'Added dual-eligible enrollment scenarios and new SEP reason codes.' },
    ],
  },
  {
    id: 'td_011',
    name: 'Medicare Enrollment Performance Load Set',
    type: 'synthetic',
    application: 'app_medicare_enrollment',
    environment: 'Performance',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-09',
    createdBy: 'Marcus Thompson',
    auditTrail: [
      { timestamp: '2024-06-10T15:00:00Z', action: 'created', performedBy: 'Marcus Thompson', details: 'Synthetic enrollment dataset with 50,000 records for peak load simulation during AEP.' },
      { timestamp: '2024-12-09T21:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Updated enrollment mix to reflect 2025 plan year distribution patterns.' },
    ],
  },
  {
    id: 'td_012',
    name: 'Star Ratings MY2024 Measure Data',
    type: 'golden',
    application: 'app_star_ratings',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-07',
    createdBy: 'Emily Davis',
    auditTrail: [
      { timestamp: '2024-06-05T10:00:00Z', action: 'created', performedBy: 'Emily Davis', details: 'Golden dataset with pre-calculated measure rates for Star Ratings validation.' },
      { timestamp: '2024-06-05T11:30:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'PHI masking applied to underlying member-level measure data.' },
      { timestamp: '2024-12-07T08:00:00Z', action: 'refreshed', performedBy: 'Emily Davis', details: 'Updated with MY2025 methodology changes and predictive modeling baseline data.' },
    ],
  },
  {
    id: 'td_013',
    name: 'HEDIS Measure Calculation Clinical Data',
    type: 'masked_production',
    application: 'app_hedis_engine',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-04',
    createdBy: 'Samantha Clark',
    auditTrail: [
      { timestamp: '2024-03-15T09:00:00Z', action: 'created', performedBy: 'Samantha Clark', details: 'Masked production clinical data for HEDIS measure calculation validation with 200,000 members.' },
      { timestamp: '2024-03-15T12:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking with deterministic tokenization preserving referential integrity across tables.' },
      { timestamp: '2024-06-01T08:00:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Added supplemental data source records and updated value sets for MY2024.' },
      { timestamp: '2024-12-04T07:00:00Z', action: 'refreshed', performedBy: 'Lisa Johnson', details: 'Updated with MY2025 measure specification changes and new exclusion criteria data.' },
    ],
  },
  {
    id: 'td_014',
    name: 'HEDIS Engine Full Population Performance Set',
    type: 'synthetic',
    application: 'app_hedis_engine',
    environment: 'Performance',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-02',
    createdBy: 'Marcus Thompson',
    auditTrail: [
      { timestamp: '2024-05-01T14:00:00Z', action: 'created', performedBy: 'Marcus Thompson', details: 'Synthetic dataset with 523,450 member records for full population HEDIS performance testing.' },
      { timestamp: '2024-12-02T21:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Updated clinical data distributions to match production patterns for accurate performance benchmarking.' },
    ],
  },
  {
    id: 'td_015',
    name: 'Part D Formulary 2025 Reference Data',
    type: 'reference',
    application: 'app_part_d_formulary',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-03',
    createdBy: 'Lisa Johnson',
    auditTrail: [
      { timestamp: '2024-07-10T10:00:00Z', action: 'created', performedBy: 'Lisa Johnson', details: 'Reference dataset with 2025 formulary drug list, tier assignments, and PA criteria.' },
      { timestamp: '2024-12-03T08:00:00Z', action: 'refreshed', performedBy: 'Lisa Johnson', details: 'Updated with final 2025 plan year formulary configurations and CMS file format specifications.' },
    ],
  },
  {
    id: 'td_016',
    name: 'Benefits Admin 2025 Plan Configurations',
    type: 'reference',
    application: 'app_benefits_admin',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-02',
    createdBy: 'Robert Kim',
    auditTrail: [
      { timestamp: '2024-08-15T09:00:00Z', action: 'created', performedBy: 'Robert Kim', details: 'Reference data for 2025 plan year benefit structures, cost-sharing rules, and OOP maximums.' },
      { timestamp: '2024-12-02T10:00:00Z', action: 'refreshed', performedBy: 'Robert Kim', details: 'Updated with CMS-approved bid submission values and supplemental benefit configurations.' },
    ],
  },
  {
    id: 'td_017',
    name: 'Medicaid Eligibility Multi-State Rules Data',
    type: 'reference',
    application: 'app_medicaid_eligibility',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-01',
    createdBy: 'Robert Kim',
    auditTrail: [
      { timestamp: '2024-05-25T10:00:00Z', action: 'created', performedBy: 'Robert Kim', details: 'Reference data with state-specific eligibility rules, FPL thresholds, and categorical criteria.' },
      { timestamp: '2024-08-20T14:00:00Z', action: 'refreshed', performedBy: 'Robert Kim', details: 'Added Medicaid unwinding processing rules and updated FPL thresholds for 2024.' },
      { timestamp: '2024-12-01T08:00:00Z', action: 'refreshed', performedBy: 'Robert Kim', details: 'Updated with new state contract eligibility rules and redetermination batch scenarios.' },
    ],
  },
  {
    id: 'td_018',
    name: 'Medicaid Eligibility Applicant Test Data',
    type: 'synthetic',
    application: 'app_medicaid_eligibility',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-01',
    createdBy: 'Robert Kim',
    auditTrail: [
      { timestamp: '2024-05-25T11:00:00Z', action: 'created', performedBy: 'Robert Kim', details: 'Synthetic applicant data with 15,000 records covering income-based and categorical eligibility scenarios.' },
      { timestamp: '2024-11-14T09:00:00Z', action: 'refreshed', performedBy: 'Robert Kim', details: 'Added applicants with null income data for Medicaid unwinding edge case testing.' },
      { timestamp: '2024-12-01T09:00:00Z', action: 'refreshed', performedBy: 'Robert Kim', details: 'Updated with batch redetermination test scenarios and dual-eligible member records.' },
    ],
  },
  {
    id: 'td_019',
    name: 'State Reporting Quarterly Submission Data',
    type: 'masked_production',
    application: 'app_state_reporting',
    environment: 'QA',
    status: 'stale',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-28',
    createdBy: 'Patricia Evans',
    auditTrail: [
      { timestamp: '2024-05-01T08:00:00Z', action: 'created', performedBy: 'Patricia Evans', details: 'Masked production data for quarterly state regulatory report validation across 3 contracted states.' },
      { timestamp: '2024-05-01T10:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking applied with state-specific data retention compliance.' },
      { timestamp: '2024-08-15T09:00:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Refreshed with Q2 2024 reporting data and updated state templates.' },
      { timestamp: '2024-11-28T10:00:00Z', action: 'refreshed', performedBy: 'Patricia Evans', details: 'Updated with Q3 2024 data including retroactive eligibility changes for State B.' },
    ],
  },
  {
    id: 'td_020',
    name: 'Care Management Outreach Test Data',
    type: 'synthetic',
    application: 'app_care_management',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-06',
    createdBy: 'Amanda Garcia',
    auditTrail: [
      { timestamp: '2024-06-20T10:00:00Z', action: 'created', performedBy: 'Amanda Garcia', details: 'Synthetic member data with care gaps, outreach history, and care plan templates for 3,000 members.' },
      { timestamp: '2024-09-10T08:00:00Z', action: 'refreshed', performedBy: 'Amanda Garcia', details: 'Added automated outreach scheduling scenarios and coordinator availability data.' },
      { timestamp: '2024-12-06T09:00:00Z', action: 'refreshed', performedBy: 'Amanda Garcia', details: 'Updated with outreach tracking compliance test scenarios and follow-up action validation data.' },
    ],
  },
  {
    id: 'td_021',
    name: 'Provider Network Adequacy Dataset',
    type: 'synthetic',
    application: 'app_provider_network',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-22',
    createdBy: 'Robert Kim',
    auditTrail: [
      { timestamp: '2024-08-25T09:00:00Z', action: 'created', performedBy: 'Robert Kim', details: 'Synthetic provider network data with 8,000 providers across urban and rural service areas.' },
      { timestamp: '2024-11-22T10:00:00Z', action: 'refreshed', performedBy: 'Robert Kim', details: 'Added network adequacy gap scenarios and state-mandated adequacy standard thresholds.' },
    ],
  },
  {
    id: 'td_022',
    name: 'Group Enrollment Employer Census Data',
    type: 'synthetic',
    application: 'app_group_enrollment',
    environment: 'Staging',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-09',
    createdBy: 'Chris Anderson',
    auditTrail: [
      { timestamp: '2024-08-10T11:00:00Z', action: 'created', performedBy: 'Chris Anderson', details: 'Synthetic employer census data with 200 groups ranging from 5 to 500 employees.' },
      { timestamp: '2024-12-09T07:00:00Z', action: 'refreshed', performedBy: 'Chris Anderson', details: 'Added self-service portal registration scenarios and ACA EHB compliance test data.' },
    ],
  },
  {
    id: 'td_023',
    name: 'Individual Marketplace Plan Comparison Data',
    type: 'reference',
    application: 'app_individual_marketplace',
    environment: 'Staging',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-10',
    createdBy: 'Priya Patel',
    auditTrail: [
      { timestamp: '2024-09-01T10:00:00Z', action: 'created', performedBy: 'Priya Patel', details: 'Reference data with 2025 OEP plan offerings, subsidy tables, and SBC documents.' },
      { timestamp: '2024-12-10T08:00:00Z', action: 'refreshed', performedBy: 'Priya Patel', details: 'Updated with final 2025 plan year premium rates and enhanced plan comparison tool data.' },
    ],
  },
  {
    id: 'td_024',
    name: 'Broker Portal Quoting Engine Data',
    type: 'synthetic',
    application: 'app_broker_portal',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-08',
    createdBy: 'Priya Patel',
    auditTrail: [
      { timestamp: '2024-07-25T09:00:00Z', action: 'created', performedBy: 'Priya Patel', details: 'Synthetic broker and group census data for real-time quoting engine validation.' },
      { timestamp: '2024-12-08T10:00:00Z', action: 'refreshed', performedBy: 'Priya Patel', details: 'Updated with 2025 rating tables, commission structures, and license verification test data.' },
    ],
  },
  {
    id: 'td_025',
    name: 'Underwriting Risk Model Training Data',
    type: 'masked_production',
    application: 'app_underwriting_engine',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-04',
    createdBy: 'Priya Patel',
    auditTrail: [
      { timestamp: '2024-08-05T10:00:00Z', action: 'created', performedBy: 'Priya Patel', details: 'Masked production data with 20,000 historical underwriting cases for risk model validation.' },
      { timestamp: '2024-08-05T12:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking applied with actuarial data preserved for model accuracy testing.' },
      { timestamp: '2024-12-04T09:00:00Z', action: 'refreshed', performedBy: 'Priya Patel', details: 'Updated with 2025 actuarial tables and revised risk factor configurations.' },
    ],
  },
  {
    id: 'td_026',
    name: 'Wellness Platform Gamification Data',
    type: 'seed',
    application: 'app_wellness_platform',
    environment: 'Staging',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-11',
    createdBy: 'Chris Anderson',
    auditTrail: [
      { timestamp: '2024-09-01T10:00:00Z', action: 'created', performedBy: 'Chris Anderson', details: 'Seed data for wellness gamification testing with badges, challenges, and reward point configurations.' },
      { timestamp: '2024-12-11T08:00:00Z', action: 'refreshed', performedBy: 'Chris Anderson', details: 'Added social wellness challenge data and leaderboard test scenarios.' },
    ],
  },
  {
    id: 'td_027',
    name: 'API Gateway Partner Authentication Data',
    type: 'seed',
    application: 'app_partner_api_gateway',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-25',
    createdBy: 'Natalie White',
    auditTrail: [
      { timestamp: '2024-04-01T09:00:00Z', action: 'created', performedBy: 'Natalie White', details: 'Seed data with partner OAuth credentials, rate limit configurations, and API scope definitions.' },
      { timestamp: '2024-11-25T10:00:00Z', action: 'refreshed', performedBy: 'Natalie White', details: 'Updated with new partner onboarding test data and TLS 1.3 migration test configurations.' },
    ],
  },
  {
    id: 'td_028',
    name: 'API Gateway Load Test Data',
    type: 'synthetic',
    application: 'app_partner_api_gateway',
    environment: 'Performance',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-23',
    createdBy: 'Marcus Thompson',
    auditTrail: [
      { timestamp: '2024-05-15T14:00:00Z', action: 'created', performedBy: 'Marcus Thompson', details: 'Synthetic API request payloads for rate limiting and load testing with varied partner profiles.' },
      { timestamp: '2024-11-23T18:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Updated request patterns to simulate sustained high load scenarios for SLA validation.' },
    ],
  },
  {
    id: 'td_029',
    name: 'Vendor Integration Feed Test Data',
    type: 'synthetic',
    application: 'app_vendor_integration',
    environment: 'QA',
    status: 'stale',
    maskingStatus: 'partially_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-18',
    createdBy: 'James Wright',
    auditTrail: [
      { timestamp: '2024-06-01T10:00:00Z', action: 'created', performedBy: 'James Wright', details: 'Synthetic vendor data feeds for lab, pharmacy, and TPA integration testing.' },
      { timestamp: '2024-06-01T11:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Partial masking applied to vendor-specific PHI fields while preserving integration identifiers.' },
      { timestamp: '2024-09-15T09:00:00Z', action: 'refreshed', performedBy: 'James Wright', details: 'Added error recovery test scenarios and dead letter queue test data.' },
      { timestamp: '2024-11-18T08:00:00Z', action: 'refreshed', performedBy: 'James Wright', details: 'Updated with new lab vendor integration data and encrypted channel test configurations.' },
    ],
  },
  {
    id: 'td_030',
    name: 'External Data Feed CMS Format Test Files',
    type: 'reference',
    application: 'app_external_data_feed',
    environment: 'QA',
    status: 'stale',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-20',
    createdBy: 'James Wright',
    auditTrail: [
      { timestamp: '2024-07-01T10:00:00Z', action: 'created', performedBy: 'James Wright', details: 'Reference CMS data feed files in 2024 and 2025 formats for format validation testing.' },
      { timestamp: '2024-09-25T09:00:00Z', action: 'refreshed', performedBy: 'James Wright', details: 'Added 2025 CMS file format samples with new required fields and validation rules.' },
      { timestamp: '2024-11-20T08:00:00Z', action: 'refreshed', performedBy: 'James Wright', details: 'Updated with error recovery test files and SLA compliance measurement data.' },
    ],
  },
  {
    id: 'td_031',
    name: 'Audit Tracker Immutability Test Data',
    type: 'seed',
    application: 'app_audit_tracker',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-07',
    createdBy: 'Patricia Evans',
    auditTrail: [
      { timestamp: '2024-06-10T09:00:00Z', action: 'created', performedBy: 'Patricia Evans', details: 'Seed data for audit record immutability testing with pre-populated finding records and amendment chains.' },
      { timestamp: '2024-10-15T10:00:00Z', action: 'refreshed', performedBy: 'Patricia Evans', details: 'Added recurring audit template data and calendar integration test scenarios.' },
      { timestamp: '2024-12-07T08:00:00Z', action: 'refreshed', performedBy: 'Priya Patel', details: 'Updated with automated scheduling test data and tamper detection hash validation records.' },
    ],
  },
  {
    id: 'td_032',
    name: 'Regulatory Reporting 2025 CMS Templates',
    type: 'reference',
    application: 'app_regulatory_reporting',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-10',
    createdBy: 'Lisa Johnson',
    auditTrail: [
      { timestamp: '2024-07-20T10:00:00Z', action: 'created', performedBy: 'Lisa Johnson', details: 'Reference data with 2025 CMS regulatory report templates and submission validation rules.' },
      { timestamp: '2024-12-10T08:00:00Z', action: 'refreshed', performedBy: 'Lisa Johnson', details: 'Updated with final 2025 CMS template specifications and deadline tracking configurations.' },
    ],
  },
  {
    id: 'td_033',
    name: 'Compliance Dashboard Source Data',
    type: 'synthetic',
    application: 'app_compliance_dashboard',
    environment: 'Staging',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-09',
    createdBy: 'Priya Patel',
    auditTrail: [
      { timestamp: '2024-09-10T10:00:00Z', action: 'created', performedBy: 'Priya Patel', details: 'Synthetic compliance metrics data for dashboard visualization and data refresh SLA testing.' },
      { timestamp: '2024-12-09T07:00:00Z', action: 'refreshed', performedBy: 'Priya Patel', details: 'Added risk heat map data and automated compliance scoring test scenarios.' },
    ],
  },
  {
    id: 'td_034',
    name: 'Risk Assessment Scoring Engine Data',
    type: 'seed',
    application: 'app_risk_assessment',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-05',
    createdBy: 'Samantha Clark',
    auditTrail: [
      { timestamp: '2024-08-20T10:00:00Z', action: 'created', performedBy: 'Samantha Clark', details: 'Seed data with known risk factors and expected scores for automated scoring engine validation.' },
      { timestamp: '2024-12-05T09:00:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Updated with new risk category thresholds and risk register management test scenarios.' },
    ],
  },
  {
    id: 'td_035',
    name: 'Claims Engine UAT Snapshot',
    type: 'snapshot',
    application: 'app_claims_engine',
    environment: 'Development',
    status: 'archived',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'not_provisioned',
    lastRefreshed: '2024-10-15',
    createdBy: 'Lisa Johnson',
    auditTrail: [
      { timestamp: '2024-10-15T08:00:00Z', action: 'created', performedBy: 'Lisa Johnson', details: 'Point-in-time snapshot of UAT environment data for v4.11.0 release validation.' },
      { timestamp: '2024-10-15T09:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking applied to snapshot data.' },
      { timestamp: '2024-11-10T14:00:00Z', action: 'archived', performedBy: 'Lisa Johnson', details: 'Archived after v4.11.0 release was deployed to production.' },
    ],
  },
  {
    id: 'td_036',
    name: 'HEDIS Supplemental Data Linkage Set',
    type: 'masked_production',
    application: 'app_hedis_engine',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-03',
    createdBy: 'Samantha Clark',
    auditTrail: [
      { timestamp: '2024-04-10T09:00:00Z', action: 'created', performedBy: 'Samantha Clark', details: 'Masked production supplemental data with member ID crosswalk for data linkage testing.' },
      { timestamp: '2024-04-10T11:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'PHI masking applied with crosswalk integrity preserved for linkage validation.' },
      { timestamp: '2024-12-03T10:00:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Updated crosswalk table with recently enrolled members and new supplemental data sources.' },
    ],
  },
  {
    id: 'td_037',
    name: 'Medicaid Eligibility Batch Redetermination Set',
    type: 'synthetic',
    application: 'app_medicaid_eligibility',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-30',
    createdBy: 'Robert Kim',
    auditTrail: [
      { timestamp: '2024-06-15T10:00:00Z', action: 'created', performedBy: 'Robert Kim', details: 'Synthetic dataset with 12,450 members due for eligibility redetermination batch processing.' },
      { timestamp: '2024-11-30T08:00:00Z', action: 'refreshed', performedBy: 'Robert Kim', details: 'Added members with null income data for Medicaid unwinding edge case validation.' },
    ],
  },
  {
    id: 'td_038',
    name: 'Vendor Reconciliation Pharmacy Data',
    type: 'synthetic',
    application: 'app_vendor_integration',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'partially_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-28',
    createdBy: 'James Wright',
    auditTrail: [
      { timestamp: '2024-07-15T10:00:00Z', action: 'created', performedBy: 'James Wright', details: 'Synthetic pharmacy vendor data for daily reconciliation testing with intentional discrepancies.' },
      { timestamp: '2024-07-15T11:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Partial masking applied to patient identifiers while preserving pharmacy transaction IDs.' },
      { timestamp: '2024-11-28T09:00:00Z', action: 'refreshed', performedBy: 'James Wright', details: 'Updated with new discrepancy patterns and reconciliation threshold test scenarios.' },
    ],
  },
  {
    id: 'td_039',
    name: 'External Data Feed SLA Test Files',
    type: 'synthetic',
    application: 'app_external_data_feed',
    environment: 'Performance',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-19',
    createdBy: 'Marcus Thompson',
    auditTrail: [
      { timestamp: '2024-07-01T14:00:00Z', action: 'created', performedBy: 'Marcus Thompson', details: 'Synthetic data files of varying sizes (10MB, 50MB, 100MB, 500MB) for SLA compliance testing.' },
      { timestamp: '2024-11-19T14:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Updated file content to reflect 2025 CMS format and added concurrent processing test files.' },
    ],
  },
  {
    id: 'td_040',
    name: 'Medicare Enrollment UAT Snapshot v6.3.0',
    type: 'snapshot',
    application: 'app_medicare_enrollment',
    environment: 'Development',
    status: 'archived',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'not_provisioned',
    lastRefreshed: '2024-11-01',
    createdBy: 'Lisa Johnson',
    auditTrail: [
      { timestamp: '2024-11-01T08:00:00Z', action: 'created', performedBy: 'Lisa Johnson', details: 'Point-in-time snapshot of UAT data for v6.3.0 release validation with SEP reason code updates.' },
      { timestamp: '2024-11-01T09:30:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking applied to enrollment and member demographic data.' },
      { timestamp: '2024-11-25T16:00:00Z', action: 'archived', performedBy: 'Lisa Johnson', details: 'Archived after v6.3.2 hotfix was deployed to production.' },
    ],
  },
  {
    id: 'td_041',
    name: 'State Reporting Data Accuracy Validation Set',
    type: 'golden',
    application: 'app_state_reporting',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'fully_masked',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-27',
    createdBy: 'Samantha Clark',
    auditTrail: [
      { timestamp: '2024-05-20T09:00:00Z', action: 'created', performedBy: 'Samantha Clark', details: 'Golden dataset with pre-validated report data for cross-field and historical trend validation testing.' },
      { timestamp: '2024-05-20T11:00:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Full PHI masking applied with reporting aggregates preserved for accuracy validation.' },
      { timestamp: '2024-11-27T14:00:00Z', action: 'refreshed', performedBy: 'Samantha Clark', details: 'Updated with Medicaid unwinding adjustment factors and Region 3, 7, 12 anomaly baselines.' },
    ],
  },
  {
    id: 'td_042',
    name: 'Care Management Gap Closure Tracking Data',
    type: 'synthetic',
    application: 'app_care_management',
    environment: 'Staging',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-05',
    createdBy: 'Amanda Garcia',
    auditTrail: [
      { timestamp: '2024-07-10T10:00:00Z', action: 'created', performedBy: 'Amanda Garcia', details: 'Synthetic data with care gap closure scenarios and member outreach outcome tracking records.' },
      { timestamp: '2024-12-05T09:00:00Z', action: 'refreshed', performedBy: 'Amanda Garcia', details: 'Added outreach compliance validation data with required field completion test scenarios.' },
    ],
  },
  {
    id: 'td_043',
    name: 'Vendor Integration BAA Compliance Data',
    type: 'seed',
    application: 'app_vendor_integration',
    environment: 'QA',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-11-18',
    createdBy: 'Natalie White',
    auditTrail: [
      { timestamp: '2024-06-01T09:00:00Z', action: 'created', performedBy: 'Natalie White', details: 'Seed data with vendor BAA agreement statuses, TLS configurations, and encryption channel test data.' },
      { timestamp: '2024-11-18T11:00:00Z', action: 'refreshed', performedBy: 'Natalie White', details: 'Updated with vendors having expired BAA agreements and deprecated TLS 1.1 connection test data.' },
    ],
  },
  {
    id: 'td_044',
    name: 'Notification Hub Batch Delivery Performance Set',
    type: 'synthetic',
    application: 'app_notification_hub',
    environment: 'Performance',
    status: 'active',
    maskingStatus: 'not_applicable',
    provisioningStatus: 'provisioned',
    lastRefreshed: '2024-12-08',
    createdBy: 'Marcus Thompson',
    auditTrail: [
      { timestamp: '2024-08-01T14:00:00Z', action: 'created', performedBy: 'Marcus Thompson', details: 'Synthetic dataset with 50,000 notification records for batch delivery throughput testing.' },
      { timestamp: '2024-12-08T22:00:00Z', action: 'refreshed', performedBy: 'Marcus Thompson', details: 'Updated notification payload distributions and added duplicate detection test scenarios.' },
    ],
  },
  {
    id: 'td_045',
    name: 'Claims Engine Provisioning Failed Set',
    type: 'subset',
    application: 'app_claims_engine',
    environment: 'Development',
    status: 'error',
    maskingStatus: 'partially_masked',
    provisioningStatus: 'failed',
    lastRefreshed: '2024-12-11',
    createdBy: 'Lisa Johnson',
    auditTrail: [
      { timestamp: '2024-12-11T10:00:00Z', action: 'created', performedBy: 'Lisa Johnson', details: 'Subset of production claims data for development environment feature testing.' },
      { timestamp: '2024-12-11T10:30:00Z', action: 'masked', performedBy: 'Samantha Clark', details: 'Partial masking initiated but failed during PHI field tokenization.' },
      { timestamp: '2024-12-11T11:00:00Z', action: 'updated', performedBy: 'Samantha Clark', details: 'Provisioning failed due to database connection timeout in Development 1 environment. Retry scheduled.' },
    ],
  },
];

/**
 * Returns all available test data assets.
 *
 * @returns {TestData[]} Array of all test data objects
 */
export function getAllTestData() {
  return [...testData];
}

/**
 * Retrieves a single test data asset by its unique ID.
 *
 * @param {string} testDataId - The test data identifier to look up
 * @returns {TestData|null} The matching test data object, or null if not found
 */
export function getTestDataById(testDataId) {
  if (!testDataId || typeof testDataId !== 'string') {
    return null;
  }
  return testData.find((td) => td.id === testDataId) || null;
}

/**
 * Returns all test data assets filtered by type.
 *
 * @param {string} type - The type to filter by (e.g. 'synthetic', 'masked_production', 'golden', 'seed', 'reference', 'snapshot', 'subset')
 * @returns {TestData[]} Array of test data matching the specified type
 */
export function getTestDataByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return testData.filter((td) => td.type === type);
}

/**
 * Returns all test data assets associated with a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {TestData[]} Array of test data for the specified application
 */
export function getTestDataByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return testData.filter((td) => td.application === applicationId);
}

/**
 * Returns all test data assets filtered by environment.
 *
 * @param {string} environment - The environment to filter by (e.g. 'Production', 'Staging', 'QA', 'Development', 'Performance')
 * @returns {TestData[]} Array of test data matching the specified environment
 */
export function getTestDataByEnvironment(environment) {
  if (!environment || typeof environment !== 'string') {
    return [];
  }
  return testData.filter((td) => td.environment === environment);
}

/**
 * Returns all test data assets filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'active', 'stale', 'archived', 'provisioning', 'error')
 * @returns {TestData[]} Array of test data matching the specified status
 */
export function getTestDataByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return testData.filter((td) => td.status === status);
}

/**
 * Returns all test data assets filtered by masking status.
 *
 * @param {string} maskingStatus - The masking status to filter by (e.g. 'fully_masked', 'partially_masked', 'not_masked', 'not_applicable')
 * @returns {TestData[]} Array of test data matching the specified masking status
 */
export function getTestDataByMaskingStatus(maskingStatus) {
  if (!maskingStatus || typeof maskingStatus !== 'string') {
    return [];
  }
  return testData.filter((td) => td.maskingStatus === maskingStatus);
}

/**
 * Returns all test data assets filtered by provisioning status.
 *
 * @param {string} provisioningStatus - The provisioning status to filter by (e.g. 'provisioned', 'pending', 'in_progress', 'failed', 'not_provisioned')
 * @returns {TestData[]} Array of test data matching the specified provisioning status
 */
export function getTestDataByProvisioningStatus(provisioningStatus) {
  if (!provisioningStatus || typeof provisioningStatus !== 'string') {
    return [];
  }
  return testData.filter((td) => td.provisioningStatus === provisioningStatus);
}

/**
 * Returns all test data assets created by a specific person.
 *
 * @param {string} createdBy - The creator name to filter by
 * @returns {TestData[]} Array of test data created by the specified person
 */
export function getTestDataByCreator(createdBy) {
  if (!createdBy || typeof createdBy !== 'string') {
    return [];
  }
  return testData.filter((td) => td.createdBy === createdBy);
}

/**
 * Returns aggregate statistics across all test data assets.
 *
 * @returns {{ totalTestData: number, statusBreakdown: Object<string, number>, typeBreakdown: Object<string, number>, maskingBreakdown: Object<string, number>, provisioningBreakdown: Object<string, number>, environmentBreakdown: Object<string, number>, activeCount: number, staleCount: number, archivedCount: number, errorCount: number }} Aggregate test data statistics
 */
export function getTestDataAggregates() {
  const totalTestData = testData.length;

  const statusBreakdown = testData.reduce((acc, td) => {
    acc[td.status] = (acc[td.status] || 0) + 1;
    return acc;
  }, {});

  const typeBreakdown = testData.reduce((acc, td) => {
    acc[td.type] = (acc[td.type] || 0) + 1;
    return acc;
  }, {});

  const maskingBreakdown = testData.reduce((acc, td) => {
    acc[td.maskingStatus] = (acc[td.maskingStatus] || 0) + 1;
    return acc;
  }, {});

  const provisioningBreakdown = testData.reduce((acc, td) => {
    acc[td.provisioningStatus] = (acc[td.provisioningStatus] || 0) + 1;
    return acc;
  }, {});

  const environmentBreakdown = testData.reduce((acc, td) => {
    acc[td.environment] = (acc[td.environment] || 0) + 1;
    return acc;
  }, {});

  const activeCount = testData.filter((td) => td.status === 'active').length;
  const staleCount = testData.filter((td) => td.status === 'stale').length;
  const archivedCount = testData.filter((td) => td.status === 'archived').length;
  const errorCount = testData.filter((td) => td.status === 'error').length;

  return {
    totalTestData,
    statusBreakdown,
    typeBreakdown,
    maskingBreakdown,
    provisioningBreakdown,
    environmentBreakdown,
    activeCount,
    staleCount,
    archivedCount,
    errorCount,
  };
}

/**
 * Returns all unique test data types.
 *
 * @returns {string[]} Array of unique test data types sorted alphabetically
 */
export function getAllTestDataTypes() {
  const types = new Set(testData.map((td) => td.type));
  return [...types].sort();
}

/**
 * Returns all unique test data statuses.
 *
 * @returns {string[]} Array of unique test data statuses sorted alphabetically
 */
export function getAllTestDataStatuses() {
  const statuses = new Set(testData.map((td) => td.status));
  return [...statuses].sort();
}

/**
 * Returns all unique masking statuses across all test data.
 *
 * @returns {string[]} Array of unique masking statuses sorted alphabetically
 */
export function getAllMaskingStatuses() {
  const statuses = new Set(testData.map((td) => td.maskingStatus));
  return [...statuses].sort();
}

/**
 * Returns all unique provisioning statuses across all test data.
 *
 * @returns {string[]} Array of unique provisioning statuses sorted alphabetically
 */
export function getAllProvisioningStatuses() {
  const statuses = new Set(testData.map((td) => td.provisioningStatus));
  return [...statuses].sort();
}

/**
 * Returns all unique environments across all test data.
 *
 * @returns {string[]} Array of unique environments sorted alphabetically
 */
export function getAllTestDataEnvironments() {
  const environments = new Set(testData.map((td) => td.environment));
  return [...environments].sort();
}

/**
 * Returns all unique creator names across all test data.
 *
 * @returns {string[]} Array of unique creator names sorted alphabetically
 */
export function getAllTestDataCreators() {
  const creators = new Set(testData.map((td) => td.createdBy));
  return [...creators].sort();
}

export default testData;