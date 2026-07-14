import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} TestStep
 * @property {number} stepNumber - Step sequence number
 * @property {string} action - Action to perform
 * @property {string} expectedResult - Expected result of the action
 */

/**
 * @typedef {Object} TestCase
 * @property {string} id - Unique test case identifier
 * @property {string} title - Display title of the test case
 * @property {string} type - Test type (functional, regression, smoke, integration, e2e, performance, security, accessibility)
 * @property {string} status - Current execution status (passed, failed, blocked, not_run, in_progress, skipped)
 * @property {string} priority - Priority level (critical, high, medium, low)
 * @property {string} application - Application ID this test case relates to
 * @property {string} segment - Organizational segment
 * @property {string} automationStatus - Automation status (automated, manual, hybrid, planned)
 * @property {TestStep[]} steps - Array of test steps
 * @property {string} expectedResult - Overall expected result of the test case
 * @property {string[]} tags - Array of tags for categorization
 * @property {string} createdBy - Name of the person who created the test case
 * @property {string} lastModified - Last modified date in ISO format
 * @property {string} approvalStatus - Approval status (approved, pending, rejected, draft)
 */

/**
 * Mock test case data for the EQIP Quality Platform.
 * Contains test case objects representing various test scenarios across organizational segments
 * with execution status, automation status, steps, and approval information.
 *
 * @type {TestCase[]}
 */
const testCases = [
  {
    id: 'tc_001',
    title: 'Verify claims adjudication for standard Medicare Part A claim',
    type: 'functional',
    status: 'passed',
    priority: 'critical',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a standard Medicare Part A claim with valid member ID and provider NPI', expectedResult: 'Claim is accepted and assigned a tracking number' },
      { stepNumber: 2, action: 'Verify claim enters adjudication queue', expectedResult: 'Claim status shows "In Adjudication"' },
      { stepNumber: 3, action: 'Wait for adjudication engine to process the claim', expectedResult: 'Claim is adjudicated within SLA timeframe' },
      { stepNumber: 4, action: 'Verify adjudication outcome and payment determination', expectedResult: 'Claim is approved with correct payment amount based on fee schedule' },
    ],
    expectedResult: 'Medicare Part A claim is successfully adjudicated with correct payment determination and all audit fields populated.',
    tags: ['claims', 'medicare', 'adjudication', 'part-a', 'critical-path'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-12-10',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_002',
    title: 'Verify claims batch processing handles 10,000 claims within SLA',
    type: 'performance',
    status: 'passed',
    priority: 'high',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Prepare a batch file containing 10,000 mixed claim types', expectedResult: 'Batch file is generated with valid claim data' },
      { stepNumber: 2, action: 'Submit the batch file to the claims processing engine', expectedResult: 'Batch is accepted and processing begins' },
      { stepNumber: 3, action: 'Monitor processing throughput and completion time', expectedResult: 'All 10,000 claims are processed within 30-minute SLA' },
      { stepNumber: 4, action: 'Verify no claims are dropped or duplicated', expectedResult: 'Claim count matches input count with zero data loss' },
    ],
    expectedResult: 'Batch of 10,000 claims is processed within the 30-minute SLA with zero data loss and all claims adjudicated correctly.',
    tags: ['claims', 'performance', 'batch', 'sla', 'throughput'],
    createdBy: 'Marcus Thompson',
    lastModified: '2024-12-08',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_003',
    title: 'Verify member portal login with valid credentials',
    type: 'smoke',
    status: 'passed',
    priority: 'critical',
    application: 'app_member_portal',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Navigate to the member portal login page', expectedResult: 'Login page loads with username and password fields' },
      { stepNumber: 2, action: 'Enter valid member credentials', expectedResult: 'Credentials are accepted in the form fields' },
      { stepNumber: 3, action: 'Click the Sign In button', expectedResult: 'Authentication request is sent to the auth service' },
      { stepNumber: 4, action: 'Verify successful redirect to member dashboard', expectedResult: 'Member dashboard loads with personalized content' },
    ],
    expectedResult: 'Member successfully logs in and is redirected to the personalized dashboard with correct member information displayed.',
    tags: ['member-portal', 'login', 'smoke', 'authentication', 'critical-path'],
    createdBy: 'Priya Patel',
    lastModified: '2024-12-12',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_004',
    title: 'Verify member portal WCAG 2.1 AA keyboard navigation compliance',
    type: 'accessibility',
    status: 'passed',
    priority: 'high',
    application: 'app_member_portal',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Navigate to the member portal home page using keyboard only', expectedResult: 'All interactive elements are reachable via Tab key' },
      { stepNumber: 2, action: 'Verify focus indicators are visible on all focusable elements', expectedResult: 'Focus ring is clearly visible with sufficient contrast' },
      { stepNumber: 3, action: 'Navigate through the main menu using arrow keys', expectedResult: 'Menu items are navigable and announce correctly to screen readers' },
      { stepNumber: 4, action: 'Complete a claims search using keyboard only', expectedResult: 'Search form is fully operable without mouse interaction' },
    ],
    expectedResult: 'All member portal pages meet WCAG 2.1 AA keyboard navigation requirements with visible focus indicators and proper ARIA attributes.',
    tags: ['accessibility', 'wcag', 'keyboard', 'member-portal', 'compliance'],
    createdBy: 'Omar Hassan',
    lastModified: '2024-12-11',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_005',
    title: 'Verify member portal screen reader compatibility for claims history',
    type: 'accessibility',
    status: 'failed',
    priority: 'high',
    application: 'app_member_portal',
    segment: 'Enterprise',
    automationStatus: 'hybrid',
    steps: [
      { stepNumber: 1, action: 'Enable screen reader and navigate to claims history page', expectedResult: 'Page title and navigation landmarks are announced' },
      { stepNumber: 2, action: 'Navigate the claims history data table', expectedResult: 'Table headers and cell values are read correctly' },
      { stepNumber: 3, action: 'Interact with claim detail expansion', expectedResult: 'Expanded content is announced with proper context' },
      { stepNumber: 4, action: 'Verify all status badges have accessible text alternatives', expectedResult: 'Status information is conveyed through text, not color alone' },
    ],
    expectedResult: 'Claims history page is fully accessible via screen reader with proper ARIA labels, table semantics, and status announcements.',
    tags: ['accessibility', 'screen-reader', 'claims-history', 'member-portal', 'aria'],
    createdBy: 'Omar Hassan',
    lastModified: '2024-12-11',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_006',
    title: 'Verify provider directory geo-spatial search returns accurate results',
    type: 'functional',
    status: 'passed',
    priority: 'high',
    application: 'app_provider_directory',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Enter a ZIP code and select a 10-mile radius', expectedResult: 'Search parameters are accepted' },
      { stepNumber: 2, action: 'Select specialty filter for "Primary Care"', expectedResult: 'Specialty filter is applied' },
      { stepNumber: 3, action: 'Execute the provider search', expectedResult: 'Results are returned within 2 seconds' },
      { stepNumber: 4, action: 'Verify all returned providers are within the specified radius', expectedResult: 'All providers are within 10 miles of the specified ZIP code' },
    ],
    expectedResult: 'Provider search returns only providers within the specified radius matching the selected specialty with accurate distance calculations.',
    tags: ['provider-directory', 'geo-spatial', 'search', 'functional'],
    createdBy: 'Chris Anderson',
    lastModified: '2024-12-08',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_007',
    title: 'Verify authentication service MFA enrollment flow',
    type: 'e2e',
    status: 'passed',
    priority: 'critical',
    application: 'app_auth_service',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Log in with valid credentials for a user without MFA configured', expectedResult: 'User is prompted to enroll in MFA' },
      { stepNumber: 2, action: 'Select authenticator app as MFA method', expectedResult: 'QR code is displayed for authenticator app setup' },
      { stepNumber: 3, action: 'Scan QR code and enter the generated TOTP code', expectedResult: 'TOTP code is validated successfully' },
      { stepNumber: 4, action: 'Verify MFA enrollment is complete and user is redirected', expectedResult: 'User session is established with MFA flag enabled' },
    ],
    expectedResult: 'User successfully enrolls in MFA via authenticator app and subsequent logins require MFA verification.',
    tags: ['auth', 'mfa', 'enrollment', 'e2e', 'security', 'critical-path'],
    createdBy: 'Natalie White',
    lastModified: '2024-12-05',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_008',
    title: 'Verify authentication service passkey registration and login',
    type: 'e2e',
    status: 'passed',
    priority: 'high',
    application: 'app_auth_service',
    segment: 'Enterprise',
    automationStatus: 'hybrid',
    steps: [
      { stepNumber: 1, action: 'Navigate to account security settings', expectedResult: 'Security settings page loads with passkey option' },
      { stepNumber: 2, action: 'Click "Register Passkey" and complete WebAuthn ceremony', expectedResult: 'Passkey is registered and displayed in the list of credentials' },
      { stepNumber: 3, action: 'Log out and attempt login using the registered passkey', expectedResult: 'WebAuthn authentication prompt appears' },
      { stepNumber: 4, action: 'Complete passkey authentication', expectedResult: 'User is authenticated and redirected to dashboard' },
    ],
    expectedResult: 'Passkey is successfully registered and can be used for passwordless authentication on subsequent logins.',
    tags: ['auth', 'passkey', 'webauthn', 'fido2', 'passwordless'],
    createdBy: 'Chris Anderson',
    lastModified: '2024-12-05',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_009',
    title: 'Verify authentication service token refresh vulnerability patch',
    type: 'security',
    status: 'passed',
    priority: 'critical',
    application: 'app_auth_service',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Obtain a valid access token and refresh token pair', expectedResult: 'Tokens are issued with correct expiration times' },
      { stepNumber: 2, action: 'Attempt to use an expired access token to access a protected resource', expectedResult: 'Request is rejected with 401 Unauthorized' },
      { stepNumber: 3, action: 'Attempt to use a revoked refresh token to obtain a new access token', expectedResult: 'Refresh request is rejected and all associated tokens are invalidated' },
      { stepNumber: 4, action: 'Attempt token replay attack with a previously used refresh token', expectedResult: 'Replay is detected and the entire token family is revoked' },
    ],
    expectedResult: 'Token refresh vulnerability is patched with proper token rotation, replay detection, and family revocation.',
    tags: ['auth', 'security', 'token', 'vulnerability', 'patch'],
    createdBy: 'Natalie White',
    lastModified: '2024-12-04',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_010',
    title: 'Verify data warehouse ETL pipeline processes HEDIS data correctly',
    type: 'integration',
    status: 'passed',
    priority: 'high',
    application: 'app_data_warehouse',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Trigger the HEDIS ETL pipeline with sample clinical data', expectedResult: 'Pipeline starts and source data is extracted' },
      { stepNumber: 2, action: 'Verify data transformations match HEDIS measure specifications', expectedResult: 'Transformed data conforms to expected schema and value sets' },
      { stepNumber: 3, action: 'Validate data quality checks pass for all loaded records', expectedResult: 'Zero data quality violations detected' },
      { stepNumber: 4, action: 'Verify data lineage is captured for all transformations', expectedResult: 'Complete lineage trail from source to target is documented' },
    ],
    expectedResult: 'HEDIS ETL pipeline correctly extracts, transforms, and loads clinical data with full data quality validation and lineage tracking.',
    tags: ['data-warehouse', 'etl', 'hedis', 'integration', 'data-quality'],
    createdBy: 'Samantha Clark',
    lastModified: '2024-12-06',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_011',
    title: 'Verify data warehouse query performance for HEDIS measure aggregation',
    type: 'performance',
    status: 'failed',
    priority: 'medium',
    application: 'app_data_warehouse',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Execute HEDIS measure aggregation query for all measures across 1M members', expectedResult: 'Query begins execution' },
      { stepNumber: 2, action: 'Monitor query execution time and resource utilization', expectedResult: 'Query completes within 60-second threshold' },
      { stepNumber: 3, action: 'Verify result accuracy against pre-calculated benchmarks', expectedResult: 'Aggregated results match benchmark values within 0.01% tolerance' },
    ],
    expectedResult: 'HEDIS measure aggregation query completes within performance SLA with accurate results for the full member population.',
    tags: ['data-warehouse', 'performance', 'hedis', 'query', 'aggregation'],
    createdBy: 'Marcus Thompson',
    lastModified: '2024-12-05',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_012',
    title: 'Verify notification hub email delivery with preference center opt-out',
    type: 'functional',
    status: 'passed',
    priority: 'medium',
    application: 'app_notification_hub',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Configure a member to opt out of marketing email notifications', expectedResult: 'Preference is saved in the notification preference center' },
      { stepNumber: 2, action: 'Trigger a marketing email notification for the opted-out member', expectedResult: 'Notification is suppressed and not delivered' },
      { stepNumber: 3, action: 'Trigger a transactional email notification for the same member', expectedResult: 'Transactional email is delivered regardless of marketing opt-out' },
      { stepNumber: 4, action: 'Verify audit log captures both suppression and delivery events', expectedResult: 'Audit log shows suppression reason and delivery confirmation' },
    ],
    expectedResult: 'Notification preference center correctly suppresses opted-out notification types while allowing transactional notifications through.',
    tags: ['notification', 'email', 'preference-center', 'opt-out', 'can-spam'],
    createdBy: 'James Wright',
    lastModified: '2024-12-09',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_013',
    title: 'Verify Medicare enrollment AEP 2025 rules for new member enrollment',
    type: 'functional',
    status: 'passed',
    priority: 'critical',
    application: 'app_medicare_enrollment',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a new Medicare Advantage enrollment during AEP window', expectedResult: 'Enrollment application is accepted with AEP election type' },
      { stepNumber: 2, action: 'Verify eligibility checks against CMS enrollment rules', expectedResult: 'Member passes all eligibility criteria for the selected plan' },
      { stepNumber: 3, action: 'Validate enrollment transaction format matches CMS specifications', expectedResult: 'Transaction conforms to CMS-required format and field values' },
      { stepNumber: 4, action: 'Verify enrollment effective date is set to January 1, 2025', expectedResult: 'Effective date is correctly set per AEP rules' },
    ],
    expectedResult: 'New Medicare Advantage enrollment during AEP is processed correctly with proper eligibility validation, CMS-compliant transaction format, and correct effective date.',
    tags: ['medicare', 'enrollment', 'aep', '2025', 'compliance', 'critical-path'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-12-11',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_014',
    title: 'Verify Medicare enrollment dual-eligible member processing',
    type: 'regression',
    status: 'passed',
    priority: 'critical',
    application: 'app_medicare_enrollment',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit an enrollment for a dual-eligible member (Medicare + Medicaid)', expectedResult: 'Enrollment is accepted with dual-eligible indicator' },
      { stepNumber: 2, action: 'Verify dual-eligible status is correctly identified from eligibility data', expectedResult: 'System correctly flags member as dual-eligible' },
      { stepNumber: 3, action: 'Validate D-SNP plan assignment and benefit configuration', expectedResult: 'Member is enrolled in appropriate D-SNP plan with correct benefits' },
      { stepNumber: 4, action: 'Verify CMS transaction includes dual-eligible data elements', expectedResult: 'Transaction contains all required dual-eligible fields' },
    ],
    expectedResult: 'Dual-eligible member enrollment is processed correctly with proper plan assignment, benefit configuration, and CMS transaction compliance.',
    tags: ['medicare', 'enrollment', 'dual-eligible', 'regression', 'd-snp'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-11-25',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_015',
    title: 'Verify Star Ratings calculation for Part C overall rating',
    type: 'functional',
    status: 'passed',
    priority: 'critical',
    application: 'app_star_ratings',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Load MY2024 measure data for all Part C measures', expectedResult: 'Measure data is loaded with correct rates and denominators' },
      { stepNumber: 2, action: 'Execute Star Ratings calculation engine for Part C', expectedResult: 'Individual measure star ratings are calculated' },
      { stepNumber: 3, action: 'Verify domain-level star ratings are computed correctly', expectedResult: 'Domain ratings match expected values based on CMS methodology' },
      { stepNumber: 4, action: 'Verify overall Part C star rating using CMS weighting methodology', expectedResult: 'Overall rating matches CMS Technical Notes calculation' },
    ],
    expectedResult: 'Part C overall Star Rating is calculated correctly using CMS methodology with accurate measure-level, domain-level, and overall ratings.',
    tags: ['star-ratings', 'part-c', 'calculation', 'cms', 'methodology'],
    createdBy: 'Emily Davis',
    lastModified: '2024-12-07',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_016',
    title: 'Verify HEDIS BCS measure calculation for MY2024',
    type: 'functional',
    status: 'failed',
    priority: 'critical',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Load clinical data for BCS (Breast Cancer Screening) eligible population', expectedResult: 'Eligible population is identified based on age and gender criteria' },
      { stepNumber: 2, action: 'Apply BCS measure exclusion criteria', expectedResult: 'Members with bilateral mastectomy are correctly excluded' },
      { stepNumber: 3, action: 'Evaluate numerator compliance for mammography screening', expectedResult: 'Members with qualifying mammography are counted in numerator' },
      { stepNumber: 4, action: 'Calculate final BCS measure rate', expectedResult: 'Measure rate matches expected value within 0.1% tolerance' },
    ],
    expectedResult: 'BCS measure is calculated correctly with accurate eligible population, proper exclusions, and numerator compliance per NCQA specifications.',
    tags: ['hedis', 'bcs', 'measure', 'calculation', 'my2024', 'ncqa'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-12-04',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_017',
    title: 'Verify HEDIS engine supplemental data source integration',
    type: 'integration',
    status: 'failed',
    priority: 'high',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Ingest supplemental data from electronic clinical data source', expectedResult: 'Data is ingested and mapped to HEDIS value sets' },
      { stepNumber: 2, action: 'Verify supplemental data is correctly linked to member records', expectedResult: 'Data linkage matches on member ID with correct date ranges' },
      { stepNumber: 3, action: 'Run measure calculation with supplemental data included', expectedResult: 'Supplemental data contributes to numerator compliance where applicable' },
      { stepNumber: 4, action: 'Compare measure rates with and without supplemental data', expectedResult: 'Supplemental data improves measure rates as expected' },
    ],
    expectedResult: 'Supplemental data sources are correctly integrated into HEDIS measure calculations with proper data linkage and measure rate improvement.',
    tags: ['hedis', 'supplemental-data', 'integration', 'clinical-data', 'measure-rate'],
    createdBy: 'Samantha Clark',
    lastModified: '2024-12-03',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_018',
    title: 'Verify HEDIS engine performance under full population load',
    type: 'performance',
    status: 'failed',
    priority: 'high',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Load full member population data (500K+ members)', expectedResult: 'Data is loaded into the calculation engine' },
      { stepNumber: 2, action: 'Execute all HEDIS measures simultaneously', expectedResult: 'Calculation begins for all measures' },
      { stepNumber: 3, action: 'Monitor processing time and resource utilization', expectedResult: 'All measures complete within 4-hour processing window' },
    ],
    expectedResult: 'HEDIS engine processes all measures for the full population within the 4-hour SLA with stable resource utilization.',
    tags: ['hedis', 'performance', 'full-population', 'sla', 'scalability'],
    createdBy: 'Marcus Thompson',
    lastModified: '2024-12-02',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_019',
    title: 'Verify Part D formulary CMS file submission format compliance',
    type: 'functional',
    status: 'passed',
    priority: 'critical',
    application: 'app_part_d_formulary',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Generate the CMS formulary file for 2025 plan year', expectedResult: 'File is generated with all required fields' },
      { stepNumber: 2, action: 'Validate file format against CMS specifications', expectedResult: 'File passes all format validation checks' },
      { stepNumber: 3, action: 'Verify drug tier assignments match approved formulary', expectedResult: 'All drug tier assignments are correct' },
      { stepNumber: 4, action: 'Verify prior authorization indicators are correctly set', expectedResult: 'PA indicators match approved PA criteria' },
    ],
    expectedResult: 'CMS formulary file is generated with correct format, accurate drug tier assignments, and proper prior authorization indicators.',
    tags: ['part-d', 'formulary', 'cms', 'file-submission', 'compliance'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-12-03',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_020',
    title: 'Verify benefits administration 2025 plan year cost-sharing rules',
    type: 'regression',
    status: 'passed',
    priority: 'high',
    application: 'app_benefits_admin',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Load 2025 plan year benefit configuration', expectedResult: 'Configuration is loaded with updated cost-sharing rules' },
      { stepNumber: 2, action: 'Verify copay amounts for primary care visits', expectedResult: 'Copay matches CMS-approved bid submission values' },
      { stepNumber: 3, action: 'Verify coinsurance rates for specialist visits', expectedResult: 'Coinsurance rates are correctly configured' },
      { stepNumber: 4, action: 'Verify out-of-pocket maximum calculations', expectedResult: 'OOP max is correctly enforced per plan design' },
    ],
    expectedResult: 'All 2025 plan year cost-sharing rules are correctly configured and match CMS-approved bid submission values.',
    tags: ['benefits', 'cost-sharing', '2025', 'regression', 'plan-design'],
    createdBy: 'Robert Kim',
    lastModified: '2024-12-02',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_021',
    title: 'Verify Medicaid eligibility determination for new applicant',
    type: 'functional',
    status: 'failed',
    priority: 'critical',
    application: 'app_medicaid_eligibility',
    segment: 'Medicaid',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a new Medicaid application with income and household data', expectedResult: 'Application is accepted and queued for eligibility determination' },
      { stepNumber: 2, action: 'Verify income-based eligibility rules are applied correctly', expectedResult: 'Income is evaluated against state-specific FPL thresholds' },
      { stepNumber: 3, action: 'Verify categorical eligibility criteria are checked', expectedResult: 'Applicant is evaluated for all applicable eligibility categories' },
      { stepNumber: 4, action: 'Verify eligibility determination is completed within 45-day SLA', expectedResult: 'Determination is rendered within the required timeframe' },
    ],
    expectedResult: 'Medicaid eligibility determination is completed correctly with proper income evaluation, categorical checks, and SLA compliance.',
    tags: ['medicaid', 'eligibility', 'determination', 'income', 'functional'],
    createdBy: 'Robert Kim',
    lastModified: '2024-12-01',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_022',
    title: 'Verify Medicaid eligibility redetermination batch processing',
    type: 'regression',
    status: 'failed',
    priority: 'critical',
    application: 'app_medicaid_eligibility',
    segment: 'Medicaid',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Trigger batch redetermination for members with upcoming renewal dates', expectedResult: 'Batch job identifies all members due for redetermination' },
      { stepNumber: 2, action: 'Process redetermination for each member using current eligibility data', expectedResult: 'Each member is evaluated against current eligibility rules' },
      { stepNumber: 3, action: 'Verify members who no longer qualify are flagged for disenrollment', expectedResult: 'Ineligible members receive proper notice and grace period' },
      { stepNumber: 4, action: 'Verify batch processing completes without failures', expectedResult: 'All records are processed with zero batch failures' },
    ],
    expectedResult: 'Medicaid eligibility redetermination batch processes all members correctly with proper eligibility evaluation and disenrollment handling.',
    tags: ['medicaid', 'eligibility', 'redetermination', 'batch', 'regression', 'unwinding'],
    createdBy: 'Robert Kim',
    lastModified: '2024-11-30',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_023',
    title: 'Verify state regulatory report generation for quarterly submission',
    type: 'functional',
    status: 'failed',
    priority: 'critical',
    application: 'app_state_reporting',
    segment: 'Medicaid',
    automationStatus: 'hybrid',
    steps: [
      { stepNumber: 1, action: 'Trigger quarterly report generation for all contracted states', expectedResult: 'Report generation begins for each state template' },
      { stepNumber: 2, action: 'Verify data accuracy against source system records', expectedResult: 'Report data matches source data within 0.1% tolerance' },
      { stepNumber: 3, action: 'Validate report format against state-specific templates', expectedResult: 'Reports conform to each state required format' },
      { stepNumber: 4, action: 'Verify automated submission workflow triggers correctly', expectedResult: 'Reports are queued for submission to state agencies' },
    ],
    expectedResult: 'Quarterly state regulatory reports are generated with accurate data, correct formatting, and automated submission workflow.',
    tags: ['state-reporting', 'quarterly', 'regulatory', 'compliance', 'submission'],
    createdBy: 'Patricia Evans',
    lastModified: '2024-11-28',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_024',
    title: 'Verify state reporting data accuracy validation checks',
    type: 'regression',
    status: 'failed',
    priority: 'high',
    application: 'app_state_reporting',
    segment: 'Medicaid',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Run automated data accuracy validation on a sample report', expectedResult: 'Validation engine processes all data fields' },
      { stepNumber: 2, action: 'Verify cross-field validation rules are applied', expectedResult: 'Inconsistent data combinations are flagged' },
      { stepNumber: 3, action: 'Verify historical trend validation detects anomalies', expectedResult: 'Significant deviations from historical patterns are flagged' },
    ],
    expectedResult: 'Data accuracy validation checks identify all data quality issues with proper flagging and error categorization.',
    tags: ['state-reporting', 'data-accuracy', 'validation', 'regression', 'quality'],
    createdBy: 'Samantha Clark',
    lastModified: '2024-11-27',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_025',
    title: 'Verify care management automated outreach scheduling',
    type: 'functional',
    status: 'passed',
    priority: 'high',
    application: 'app_care_management',
    segment: 'Medicaid',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Configure automated outreach rules for high-priority care gaps', expectedResult: 'Outreach rules are saved and activated' },
      { stepNumber: 2, action: 'Trigger the outreach scheduling engine', expectedResult: 'Engine identifies members with qualifying care gaps' },
      { stepNumber: 3, action: 'Verify outreach is scheduled based on member preferences and coordinator availability', expectedResult: 'Outreach appointments are created with correct timing' },
      { stepNumber: 4, action: 'Verify outreach attempt is logged with outcome tracking', expectedResult: 'Outreach record includes attempt details and outcome fields' },
    ],
    expectedResult: 'Automated outreach scheduling correctly identifies members, respects preferences, and logs all outreach attempts with outcomes.',
    tags: ['care-management', 'outreach', 'scheduling', 'automation', 'gap-closure'],
    createdBy: 'Amanda Garcia',
    lastModified: '2024-12-06',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_026',
    title: 'Verify care management member outreach tracking compliance',
    type: 'regression',
    status: 'failed',
    priority: 'high',
    application: 'app_care_management',
    segment: 'Medicaid',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Create a new outreach attempt for a member', expectedResult: 'Outreach record is created with required fields' },
      { stepNumber: 2, action: 'Record the outreach outcome and follow-up actions', expectedResult: 'Outcome and follow-up are saved to the outreach record' },
      { stepNumber: 3, action: 'Verify all required fields are populated per governance rules', expectedResult: 'No required fields are missing from the outreach record' },
      { stepNumber: 4, action: 'Generate outreach compliance report', expectedResult: 'Report shows 100% field completion for all outreach records' },
    ],
    expectedResult: 'Member outreach tracking captures all required data fields per governance rules with complete outcome and follow-up documentation.',
    tags: ['care-management', 'outreach', 'tracking', 'compliance', 'governance'],
    createdBy: 'Angela Martinez',
    lastModified: '2024-12-05',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_027',
    title: 'Verify provider network adequacy calculation for urban service area',
    type: 'functional',
    status: 'passed',
    priority: 'medium',
    application: 'app_provider_network',
    segment: 'Medicaid',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Select an urban service area and specialty type', expectedResult: 'Service area and specialty parameters are set' },
      { stepNumber: 2, action: 'Execute network adequacy calculation', expectedResult: 'Calculation completes with provider-to-member ratios' },
      { stepNumber: 3, action: 'Verify adequacy results against state-mandated standards', expectedResult: 'Results indicate whether standards are met or gaps exist' },
      { stepNumber: 4, action: 'Generate adequacy gap report for non-compliant areas', expectedResult: 'Gap report identifies specific deficiencies and recommended actions' },
    ],
    expectedResult: 'Network adequacy calculation correctly evaluates provider-to-member ratios against state standards and identifies gaps.',
    tags: ['provider-network', 'adequacy', 'urban', 'calculation', 'compliance'],
    createdBy: 'Robert Kim',
    lastModified: '2024-11-22',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_028',
    title: 'Verify group enrollment self-service portal employer registration',
    type: 'e2e',
    status: 'passed',
    priority: 'high',
    application: 'app_group_enrollment',
    segment: 'Commercial',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Navigate to the self-service enrollment portal', expectedResult: 'Portal landing page loads with registration option' },
      { stepNumber: 2, action: 'Complete employer registration form with company details', expectedResult: 'Registration form is submitted successfully' },
      { stepNumber: 3, action: 'Verify employer account is created with correct plan options', expectedResult: 'Account is active with available plan selections' },
      { stepNumber: 4, action: 'Add employees to the group roster and select plans', expectedResult: 'Employee enrollments are processed and confirmed' },
    ],
    expectedResult: 'Small group employer can self-register, select plans, and enroll employees through the self-service portal without broker assistance.',
    tags: ['group-enrollment', 'self-service', 'employer', 'e2e', 'registration'],
    createdBy: 'Chris Anderson',
    lastModified: '2024-12-09',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_029',
    title: 'Verify individual marketplace plan comparison tool accuracy',
    type: 'functional',
    status: 'passed',
    priority: 'medium',
    application: 'app_individual_marketplace',
    segment: 'Commercial',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Enter household income and family size for subsidy calculation', expectedResult: 'Subsidy amount is calculated based on FPL percentage' },
      { stepNumber: 2, action: 'Select two plans for side-by-side comparison', expectedResult: 'Plan comparison view displays with all benefit details' },
      { stepNumber: 3, action: 'Verify premium amounts reflect applied subsidies', expectedResult: 'Net premium after subsidy is displayed correctly' },
      { stepNumber: 4, action: 'Verify SBC summary links are available for each plan', expectedResult: 'SBC documents are accessible and display correctly' },
    ],
    expectedResult: 'Plan comparison tool accurately displays benefit details, subsidy-adjusted premiums, and SBC summaries for selected plans.',
    tags: ['individual-marketplace', 'plan-comparison', 'subsidy', 'aca', 'functional'],
    createdBy: 'Priya Patel',
    lastModified: '2024-12-10',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_030',
    title: 'Verify broker portal real-time quoting engine accuracy',
    type: 'functional',
    status: 'passed',
    priority: 'high',
    application: 'app_broker_portal',
    segment: 'Commercial',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Enter group census data for a 50-employee group', expectedResult: 'Census data is accepted and validated' },
      { stepNumber: 2, action: 'Request real-time quotes for available plan options', expectedResult: 'Quotes are generated within 5 seconds' },
      { stepNumber: 3, action: 'Verify premium calculations match underwriting engine output', expectedResult: 'Quoted premiums match underwriting calculations exactly' },
      { stepNumber: 4, action: 'Generate a proposal document with selected plans', expectedResult: 'Proposal PDF is generated with accurate quote details' },
    ],
    expectedResult: 'Real-time quoting engine generates accurate premium quotes matching underwriting calculations with proposal generation capability.',
    tags: ['broker-portal', 'quoting', 'real-time', 'premium', 'accuracy'],
    createdBy: 'Priya Patel',
    lastModified: '2024-12-08',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_031',
    title: 'Verify broker portal license verification before enrollment access',
    type: 'security',
    status: 'passed',
    priority: 'critical',
    application: 'app_broker_portal',
    segment: 'Commercial',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Attempt to access enrollment functions with an expired broker license', expectedResult: 'Access is denied with license expiration message' },
      { stepNumber: 2, action: 'Attempt to access enrollment functions with a valid license in a non-licensed state', expectedResult: 'Access is denied for the non-licensed state' },
      { stepNumber: 3, action: 'Access enrollment functions with a valid, active license', expectedResult: 'Full enrollment access is granted' },
    ],
    expectedResult: 'Broker licensing verification correctly restricts enrollment access based on license status and state authorization.',
    tags: ['broker-portal', 'license', 'verification', 'security', 'compliance'],
    createdBy: 'Natalie White',
    lastModified: '2024-12-07',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_032',
    title: 'Verify underwriting engine risk model accuracy for large group',
    type: 'functional',
    status: 'passed',
    priority: 'high',
    application: 'app_underwriting_engine',
    segment: 'Commercial',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a large group (500+ employees) census for underwriting', expectedResult: 'Census data is processed by the risk model' },
      { stepNumber: 2, action: 'Verify risk score calculation against actuarial benchmarks', expectedResult: 'Risk score falls within expected range for the group profile' },
      { stepNumber: 3, action: 'Verify rating factors comply with state-specific regulations', expectedResult: 'All rating factors are within regulatory limits' },
      { stepNumber: 4, action: 'Verify automated approval threshold is correctly applied', expectedResult: 'Groups meeting criteria are auto-approved without manual review' },
    ],
    expectedResult: 'Underwriting risk model accurately assesses large group risk with compliant rating factors and correct automated approval decisions.',
    tags: ['underwriting', 'risk-model', 'large-group', 'accuracy', 'rating'],
    createdBy: 'Priya Patel',
    lastModified: '2024-12-04',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_033',
    title: 'Verify wellness platform gamification badge award logic',
    type: 'functional',
    status: 'passed',
    priority: 'low',
    application: 'app_wellness_platform',
    segment: 'Commercial',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Complete a wellness activity that qualifies for a badge', expectedResult: 'Activity completion is recorded' },
      { stepNumber: 2, action: 'Verify badge is awarded based on achievement criteria', expectedResult: 'Badge appears in the member achievement gallery' },
      { stepNumber: 3, action: 'Verify reward points are credited for the badge', expectedResult: 'Point balance is updated with correct amount' },
      { stepNumber: 4, action: 'Verify badge notification is sent to the member', expectedResult: 'In-app notification congratulates the member on the achievement' },
    ],
    expectedResult: 'Gamification badges are correctly awarded based on achievement criteria with proper point crediting and member notification.',
    tags: ['wellness', 'gamification', 'badges', 'rewards', 'engagement'],
    createdBy: 'Chris Anderson',
    lastModified: '2024-12-11',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_034',
    title: 'Verify partner API gateway rate limiting under high load',
    type: 'performance',
    status: 'failed',
    priority: 'critical',
    application: 'app_partner_api_gateway',
    segment: 'External',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Configure rate limit to 1000 requests per minute for a partner', expectedResult: 'Rate limit configuration is applied' },
      { stepNumber: 2, action: 'Send 1500 requests within a 60-second window', expectedResult: 'First 1000 requests succeed, remaining 500 receive 429 status' },
      { stepNumber: 3, action: 'Verify rate limit headers are included in responses', expectedResult: 'X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After headers are present' },
      { stepNumber: 4, action: 'Verify gateway remains stable under sustained high load', expectedResult: 'No gateway errors or crashes during load test' },
    ],
    expectedResult: 'API gateway correctly enforces rate limits with proper HTTP headers and remains stable under sustained high load conditions.',
    tags: ['api-gateway', 'rate-limiting', 'performance', 'load-test', 'stability'],
    createdBy: 'Marcus Thompson',
    lastModified: '2024-11-25',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_035',
    title: 'Verify partner API gateway OAuth 2.0 token validation',
    type: 'security',
    status: 'failed',
    priority: 'critical',
    application: 'app_partner_api_gateway',
    segment: 'External',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Send a request with a valid OAuth 2.0 bearer token', expectedResult: 'Request is authenticated and processed successfully' },
      { stepNumber: 2, action: 'Send a request with an expired OAuth 2.0 token', expectedResult: 'Request is rejected with 401 Unauthorized' },
      { stepNumber: 3, action: 'Send a request with a token lacking required scopes', expectedResult: 'Request is rejected with 403 Forbidden' },
      { stepNumber: 4, action: 'Send a request with a malformed token', expectedResult: 'Request is rejected with 401 Unauthorized and proper error message' },
    ],
    expectedResult: 'API gateway correctly validates OAuth 2.0 tokens including expiration, scope enforcement, and malformed token rejection.',
    tags: ['api-gateway', 'oauth', 'security', 'token-validation', 'authentication'],
    createdBy: 'Natalie White',
    lastModified: '2024-11-24',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_036',
    title: 'Verify vendor integration hub encrypted data channel enforcement',
    type: 'security',
    status: 'failed',
    priority: 'critical',
    application: 'app_vendor_integration',
    segment: 'External',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Attempt to establish a vendor data connection using TLS 1.2', expectedResult: 'Connection is established successfully' },
      { stepNumber: 2, action: 'Attempt to establish a vendor data connection using TLS 1.1', expectedResult: 'Connection is rejected with protocol version error' },
      { stepNumber: 3, action: 'Verify data in transit is encrypted end-to-end', expectedResult: 'Packet inspection confirms encryption' },
      { stepNumber: 4, action: 'Verify BAA agreement status is checked before data exchange', expectedResult: 'Data exchange is blocked for vendors without active BAA' },
    ],
    expectedResult: 'Vendor integration hub enforces encrypted data channels with minimum TLS 1.2 and validates BAA agreements before data exchange.',
    tags: ['vendor', 'security', 'encryption', 'tls', 'baa', 'compliance'],
    createdBy: 'Natalie White',
    lastModified: '2024-11-18',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_037',
    title: 'Verify vendor data feed error recovery and retry logic',
    type: 'functional',
    status: 'failed',
    priority: 'high',
    application: 'app_vendor_integration',
    segment: 'External',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Simulate a vendor data feed failure during file transfer', expectedResult: 'Error is detected and logged' },
      { stepNumber: 2, action: 'Verify automatic retry is triggered after configured delay', expectedResult: 'Retry attempt is made within the configured interval' },
      { stepNumber: 3, action: 'Simulate persistent failure exceeding retry threshold', expectedResult: 'Feed is moved to dead letter queue after max retries' },
      { stepNumber: 4, action: 'Verify alert is sent for persistent failures', expectedResult: 'Operations team receives alert with failure details' },
    ],
    expectedResult: 'Vendor data feed error recovery correctly retries failed transfers, moves persistent failures to dead letter queue, and alerts operations.',
    tags: ['vendor', 'error-recovery', 'retry', 'dead-letter-queue', 'alerting'],
    createdBy: 'James Wright',
    lastModified: '2024-11-17',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_038',
    title: 'Verify external data feed CMS file format validation',
    type: 'functional',
    status: 'failed',
    priority: 'high',
    application: 'app_external_data_feed',
    segment: 'External',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a CMS data file with valid format', expectedResult: 'File passes format validation and is queued for processing' },
      { stepNumber: 2, action: 'Submit a CMS data file with invalid header format', expectedResult: 'File is rejected with specific format error message' },
      { stepNumber: 3, action: 'Submit a CMS data file with missing required fields', expectedResult: 'File is rejected with field-level validation errors' },
      { stepNumber: 4, action: 'Verify validation results are logged for audit trail', expectedResult: 'Validation log captures all checks performed and results' },
    ],
    expectedResult: 'External data feed processor correctly validates CMS file formats with specific error reporting and audit logging.',
    tags: ['external-data-feed', 'cms', 'format-validation', 'file-processing'],
    createdBy: 'James Wright',
    lastModified: '2024-11-20',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_039',
    title: 'Verify external data feed processing SLA compliance',
    type: 'performance',
    status: 'failed',
    priority: 'medium',
    application: 'app_external_data_feed',
    segment: 'External',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a standard-size data file (100MB) during business hours', expectedResult: 'File is accepted and processing begins' },
      { stepNumber: 2, action: 'Monitor processing time from receipt to completion', expectedResult: 'Processing completes within 4-hour SLA' },
      { stepNumber: 3, action: 'Submit multiple files concurrently to test queue management', expectedResult: 'Files are processed in priority order without SLA breach' },
    ],
    expectedResult: 'External data feed processing meets the 4-hour SLA for standard files with proper queue management under concurrent load.',
    tags: ['external-data-feed', 'performance', 'sla', 'processing-time', 'queue'],
    createdBy: 'Marcus Thompson',
    lastModified: '2024-11-19',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_040',
    title: 'Verify audit tracker immutable record integrity',
    type: 'security',
    status: 'passed',
    priority: 'high',
    application: 'app_audit_tracker',
    segment: 'Compliance',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Create a new audit finding record', expectedResult: 'Record is created with timestamp and creator identity' },
      { stepNumber: 2, action: 'Attempt to modify the original audit finding record directly', expectedResult: 'Direct modification is blocked by the system' },
      { stepNumber: 3, action: 'Update the finding through the proper amendment workflow', expectedResult: 'Amendment is recorded as a new version with change history' },
      { stepNumber: 4, action: 'Verify tamper detection hash is valid for the record chain', expectedResult: 'Hash validation confirms record integrity' },
    ],
    expectedResult: 'Audit records are immutable with proper versioning, change history, and tamper detection ensuring complete audit trail integrity.',
    tags: ['audit', 'immutability', 'security', 'tamper-detection', 'integrity'],
    createdBy: 'Patricia Evans',
    lastModified: '2024-12-07',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_041',
    title: 'Verify audit tracker automated scheduling creates recurring audits',
    type: 'functional',
    status: 'passed',
    priority: 'medium',
    application: 'app_audit_tracker',
    segment: 'Compliance',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Create a recurring audit template with quarterly frequency', expectedResult: 'Template is saved with recurrence configuration' },
      { stepNumber: 2, action: 'Verify next audit instance is automatically created', expectedResult: 'New audit instance appears on the scheduled date' },
      { stepNumber: 3, action: 'Verify resource allocation is applied from the template', expectedResult: 'Assigned auditors and reviewers are populated' },
      { stepNumber: 4, action: 'Verify calendar integration shows upcoming audits', expectedResult: 'Audit dates appear in the integrated calendar view' },
    ],
    expectedResult: 'Automated audit scheduling correctly creates recurring audit instances with proper resource allocation and calendar integration.',
    tags: ['audit', 'scheduling', 'recurring', 'automation', 'calendar'],
    createdBy: 'Priya Patel',
    lastModified: '2024-12-06',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_042',
    title: 'Verify regulatory reporting 2025 CMS template validation',
    type: 'functional',
    status: 'passed',
    priority: 'high',
    application: 'app_regulatory_reporting',
    segment: 'Compliance',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Generate a 2025 CMS regulatory report using the new template', expectedResult: 'Report is generated with all required sections' },
      { stepNumber: 2, action: 'Run automated format compliance validation', expectedResult: 'Report passes all format checks' },
      { stepNumber: 3, action: 'Verify data accuracy against source system records', expectedResult: 'Report data matches source data with 99.9% accuracy' },
      { stepNumber: 4, action: 'Verify submission deadline tracking is active', expectedResult: 'Deadline alerts are configured and active for the report' },
    ],
    expectedResult: 'Regulatory reporting engine generates 2025 CMS reports with correct format, accurate data, and active deadline tracking.',
    tags: ['regulatory', 'reporting', 'cms', '2025', 'template', 'compliance'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-12-10',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_043',
    title: 'Verify compliance dashboard data refresh within 15-minute SLA',
    type: 'performance',
    status: 'passed',
    priority: 'medium',
    application: 'app_compliance_dashboard',
    segment: 'Compliance',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Update a compliance metric in the source system', expectedResult: 'Source system records the update with timestamp' },
      { stepNumber: 2, action: 'Monitor the compliance dashboard for data refresh', expectedResult: 'Dashboard reflects the updated metric within 15 minutes' },
      { stepNumber: 3, action: 'Verify refresh timestamp is displayed on the dashboard', expectedResult: 'Last refresh timestamp matches the actual refresh time' },
    ],
    expectedResult: 'Compliance dashboard refreshes data within the 15-minute SLA with accurate timestamp display.',
    tags: ['compliance-dashboard', 'performance', 'data-refresh', 'sla', 'real-time'],
    createdBy: 'Marcus Thompson',
    lastModified: '2024-12-09',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_044',
    title: 'Verify compliance dashboard risk heat map visualization',
    type: 'e2e',
    status: 'passed',
    priority: 'medium',
    application: 'app_compliance_dashboard',
    segment: 'Compliance',
    automationStatus: 'hybrid',
    steps: [
      { stepNumber: 1, action: 'Navigate to the compliance dashboard risk heat map view', expectedResult: 'Heat map visualization loads with current risk data' },
      { stepNumber: 2, action: 'Verify risk distribution across segments is displayed correctly', expectedResult: 'Segment risk levels match underlying risk assessment data' },
      { stepNumber: 3, action: 'Click on a high-risk segment to drill down', expectedResult: 'Drill-down view shows application-level risk details' },
      { stepNumber: 4, action: 'Verify compliance scoring is calculated and displayed', expectedResult: 'Automated compliance scores match expected calculations' },
    ],
    expectedResult: 'Risk heat map correctly visualizes risk distribution with drill-down capability and accurate compliance scoring.',
    tags: ['compliance-dashboard', 'risk-heat-map', 'visualization', 'drill-down', 'e2e'],
    createdBy: 'Priya Patel',
    lastModified: '2024-12-08',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_045',
    title: 'Verify risk assessment automated scoring engine accuracy',
    type: 'functional',
    status: 'passed',
    priority: 'medium',
    application: 'app_risk_assessment',
    segment: 'Compliance',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a risk assessment with known risk factors', expectedResult: 'Assessment is accepted and scoring begins' },
      { stepNumber: 2, action: 'Verify risk score calculation against expected formula', expectedResult: 'Calculated score matches expected value within tolerance' },
      { stepNumber: 3, action: 'Verify risk category assignment based on score thresholds', expectedResult: 'Risk category (low/medium/high/critical) is correctly assigned' },
      { stepNumber: 4, action: 'Verify risk register is updated with the new assessment', expectedResult: 'Risk register reflects the latest assessment results' },
    ],
    expectedResult: 'Automated risk scoring engine calculates accurate risk scores with correct category assignment and risk register updates.',
    tags: ['risk-assessment', 'scoring', 'automation', 'accuracy', 'risk-register'],
    createdBy: 'Samantha Clark',
    lastModified: '2024-12-05',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_046',
    title: 'Verify claims engine HIPAA PHI encryption at rest',
    type: 'security',
    status: 'passed',
    priority: 'critical',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Store a claim containing PHI data in the database', expectedResult: 'Claim is persisted to the database' },
      { stepNumber: 2, action: 'Verify PHI fields are encrypted using AES-256 at rest', expectedResult: 'Raw database inspection shows encrypted values for PHI fields' },
      { stepNumber: 3, action: 'Retrieve the claim through the application layer', expectedResult: 'PHI data is decrypted and displayed correctly to authorized users' },
      { stepNumber: 4, action: 'Verify encryption key rotation does not impact data access', expectedResult: 'Data remains accessible after key rotation' },
    ],
    expectedResult: 'All PHI data in the claims engine is encrypted at rest using AES-256 with proper key management and rotation support.',
    tags: ['claims', 'security', 'hipaa', 'encryption', 'phi', 'aes-256'],
    createdBy: 'Natalie White',
    lastModified: '2024-11-15',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_047',
    title: 'Verify claims engine handles duplicate claim submission correctly',
    type: 'regression',
    status: 'passed',
    priority: 'high',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a claim with a unique claim reference number', expectedResult: 'Claim is accepted and processed' },
      { stepNumber: 2, action: 'Submit the same claim again with identical reference number', expectedResult: 'Duplicate is detected and rejected with appropriate error code' },
      { stepNumber: 3, action: 'Verify the original claim is not affected by the duplicate submission', expectedResult: 'Original claim status and data remain unchanged' },
    ],
    expectedResult: 'Claims engine correctly detects and rejects duplicate claim submissions without affecting the original claim record.',
    tags: ['claims', 'duplicate', 'regression', 'data-integrity', 'idempotency'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-12-09',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_048',
    title: 'Verify member portal claims history end-to-end flow',
    type: 'e2e',
    status: 'passed',
    priority: 'high',
    application: 'app_member_portal',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Log in as a member with existing claims history', expectedResult: 'Member dashboard loads successfully' },
      { stepNumber: 2, action: 'Navigate to the claims history section', expectedResult: 'Claims history page displays with recent claims' },
      { stepNumber: 3, action: 'Apply date range filter to narrow results', expectedResult: 'Claims list updates to show only claims within the date range' },
      { stepNumber: 4, action: 'Click on a claim to view detailed information', expectedResult: 'Claim detail view shows all claim line items, status, and payment information' },
      { stepNumber: 5, action: 'Download the Explanation of Benefits (EOB) document', expectedResult: 'EOB PDF downloads with correct claim information' },
    ],
    expectedResult: 'Member can view claims history, filter by date, view claim details, and download EOB documents through the portal.',
    tags: ['member-portal', 'claims-history', 'e2e', 'eob', 'user-flow'],
    createdBy: 'Priya Patel',
    lastModified: '2024-12-11',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_049',
    title: 'Verify Medicare enrollment SEP reason code validation',
    type: 'functional',
    status: 'passed',
    priority: 'high',
    application: 'app_medicare_enrollment',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit an enrollment with a valid SEP reason code', expectedResult: 'Enrollment is accepted with SEP election type' },
      { stepNumber: 2, action: 'Submit an enrollment with an invalid SEP reason code', expectedResult: 'Enrollment is rejected with reason code validation error' },
      { stepNumber: 3, action: 'Verify SEP effective date is calculated correctly based on reason code', expectedResult: 'Effective date follows CMS SEP timing rules for the reason code' },
    ],
    expectedResult: 'Medicare enrollment system correctly validates SEP reason codes and calculates effective dates per CMS rules.',
    tags: ['medicare', 'enrollment', 'sep', 'reason-code', 'validation'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-11-01',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_050',
    title: 'Verify HEDIS CDC measure calculation with exclusion criteria',
    type: 'functional',
    status: 'failed',
    priority: 'critical',
    application: 'app_hedis_engine',
    segment: 'Medicare',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Load clinical data for CDC (Comprehensive Diabetes Care) eligible population', expectedResult: 'Diabetic members aged 18-75 are identified' },
      { stepNumber: 2, action: 'Apply CDC measure exclusion criteria for each sub-measure', expectedResult: 'Members meeting exclusion criteria are properly excluded' },
      { stepNumber: 3, action: 'Evaluate HbA1c control numerator compliance', expectedResult: 'Members with qualifying HbA1c results are counted correctly' },
      { stepNumber: 4, action: 'Calculate final CDC sub-measure rates', expectedResult: 'All sub-measure rates match expected values within tolerance' },
    ],
    expectedResult: 'CDC measure is calculated correctly across all sub-measures with proper exclusion handling and accurate rate calculation.',
    tags: ['hedis', 'cdc', 'diabetes', 'measure', 'exclusion', 'hba1c'],
    createdBy: 'Lisa Johnson',
    lastModified: '2024-12-04',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_051',
    title: 'Verify Medicaid eligibility multi-state rule configuration',
    type: 'smoke',
    status: 'not_run',
    priority: 'high',
    application: 'app_medicaid_eligibility',
    segment: 'Medicaid',
    automationStatus: 'planned',
    steps: [
      { stepNumber: 1, action: 'Configure eligibility rules for State A with specific FPL thresholds', expectedResult: 'State A rules are saved and activated' },
      { stepNumber: 2, action: 'Configure eligibility rules for State B with different FPL thresholds', expectedResult: 'State B rules are saved without affecting State A' },
      { stepNumber: 3, action: 'Process an eligibility determination for a State A applicant', expectedResult: 'State A rules are applied correctly' },
      { stepNumber: 4, action: 'Process an eligibility determination for a State B applicant', expectedResult: 'State B rules are applied correctly' },
    ],
    expectedResult: 'Multi-state eligibility configuration allows independent rule sets per state without cross-state interference.',
    tags: ['medicaid', 'eligibility', 'multi-state', 'configuration', 'smoke'],
    createdBy: 'Robert Kim',
    lastModified: '2024-12-05',
    approvalStatus: 'draft',
  },
  {
    id: 'tc_052',
    title: 'Verify group enrollment ACA essential health benefits compliance',
    type: 'regression',
    status: 'passed',
    priority: 'high',
    application: 'app_group_enrollment',
    segment: 'Commercial',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Create a new group enrollment with a plan that includes all EHB categories', expectedResult: 'Plan is validated for EHB compliance' },
      { stepNumber: 2, action: 'Verify all 10 essential health benefit categories are covered', expectedResult: 'Each EHB category is present in the plan benefit structure' },
      { stepNumber: 3, action: 'Attempt to create a plan missing an EHB category', expectedResult: 'System rejects the plan with EHB compliance error' },
    ],
    expectedResult: 'Group enrollment system enforces ACA essential health benefits compliance for all plan configurations.',
    tags: ['group-enrollment', 'aca', 'ehb', 'compliance', 'regression'],
    createdBy: 'Robert Kim',
    lastModified: '2024-12-08',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_053',
    title: 'Verify partner API gateway TLS 1.3 connection handling',
    type: 'integration',
    status: 'not_run',
    priority: 'high',
    application: 'app_partner_api_gateway',
    segment: 'External',
    automationStatus: 'planned',
    steps: [
      { stepNumber: 1, action: 'Establish a connection using TLS 1.3 protocol', expectedResult: 'Connection is established successfully with TLS 1.3' },
      { stepNumber: 2, action: 'Verify cipher suite negotiation uses approved algorithms', expectedResult: 'Negotiated cipher suite is in the approved list' },
      { stepNumber: 3, action: 'Attempt connection with TLS 1.1 (deprecated)', expectedResult: 'Connection is rejected with protocol version error' },
    ],
    expectedResult: 'API gateway correctly handles TLS 1.3 connections with approved cipher suites and rejects deprecated protocol versions.',
    tags: ['api-gateway', 'tls', 'integration', 'security', 'protocol'],
    createdBy: 'Daniel Robinson',
    lastModified: '2024-11-25',
    approvalStatus: 'pending',
  },
  {
    id: 'tc_054',
    title: 'Verify vendor integration daily data reconciliation process',
    type: 'integration',
    status: 'blocked',
    priority: 'high',
    application: 'app_vendor_integration',
    segment: 'External',
    automationStatus: 'manual',
    steps: [
      { stepNumber: 1, action: 'Trigger daily reconciliation for pharmacy vendor data feed', expectedResult: 'Reconciliation process starts and compares source and target records' },
      { stepNumber: 2, action: 'Verify discrepancy detection identifies mismatched records', expectedResult: 'All discrepancies are identified and categorized' },
      { stepNumber: 3, action: 'Verify automated alert is sent for discrepancies exceeding threshold', expectedResult: 'Alert is delivered to the operations team with discrepancy details' },
      { stepNumber: 4, action: 'Generate reconciliation report', expectedResult: 'Report shows reconciliation summary with match rate and discrepancy details' },
    ],
    expectedResult: 'Daily data reconciliation correctly identifies discrepancies, sends alerts for threshold breaches, and generates comprehensive reports.',
    tags: ['vendor', 'reconciliation', 'daily', 'integration', 'data-quality'],
    createdBy: 'James Wright',
    lastModified: '2024-11-28',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_055',
    title: 'Verify regulatory reporting automated submission validation',
    type: 'smoke',
    status: 'passed',
    priority: 'high',
    application: 'app_regulatory_reporting',
    segment: 'Compliance',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Generate a regulatory report ready for submission', expectedResult: 'Report is generated and marked as ready' },
      { stepNumber: 2, action: 'Trigger automated pre-submission validation', expectedResult: 'Validation checks run against submission requirements' },
      { stepNumber: 3, action: 'Verify validation results are displayed with pass/fail indicators', expectedResult: 'All validation checks show pass status' },
    ],
    expectedResult: 'Automated submission validation correctly validates regulatory reports against submission requirements before delivery.',
    tags: ['regulatory', 'reporting', 'submission', 'validation', 'smoke'],
    createdBy: 'Patricia Evans',
    lastModified: '2024-12-09',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_056',
    title: 'Verify risk assessment platform risk register management',
    type: 'e2e',
    status: 'passed',
    priority: 'low',
    application: 'app_risk_assessment',
    segment: 'Compliance',
    automationStatus: 'hybrid',
    steps: [
      { stepNumber: 1, action: 'Create a new risk entry in the risk register', expectedResult: 'Risk entry is created with all required fields' },
      { stepNumber: 2, action: 'Assign risk owner and mitigation plan', expectedResult: 'Owner and mitigation details are saved' },
      { stepNumber: 3, action: 'Update risk status through the mitigation workflow', expectedResult: 'Risk status transitions are tracked with timestamps' },
      { stepNumber: 4, action: 'Generate risk register summary report', expectedResult: 'Report shows all active risks with current status and owners' },
    ],
    expectedResult: 'Risk register supports full lifecycle management of risk entries with proper ownership, mitigation tracking, and reporting.',
    tags: ['risk-assessment', 'risk-register', 'management', 'e2e', 'lifecycle'],
    createdBy: 'Patricia Evans',
    lastModified: '2024-12-04',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_057',
    title: 'Verify claims engine integration with provider directory for NPI validation',
    type: 'integration',
    status: 'passed',
    priority: 'high',
    application: 'app_claims_engine',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Submit a claim with a valid provider NPI', expectedResult: 'NPI is validated against the provider directory' },
      { stepNumber: 2, action: 'Submit a claim with an invalid provider NPI', expectedResult: 'Claim is flagged with NPI validation error' },
      { stepNumber: 3, action: 'Submit a claim with a provider NPI not in network', expectedResult: 'Claim is processed with out-of-network indicator' },
    ],
    expectedResult: 'Claims engine correctly validates provider NPIs against the provider directory with proper handling of invalid and out-of-network providers.',
    tags: ['claims', 'provider-directory', 'integration', 'npi', 'validation'],
    createdBy: 'Chris Anderson',
    lastModified: '2024-12-10',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_058',
    title: 'Verify wellness platform HIPAA wellness program nondiscrimination compliance',
    type: 'regression',
    status: 'passed',
    priority: 'medium',
    application: 'app_wellness_platform',
    segment: 'Commercial',
    automationStatus: 'hybrid',
    steps: [
      { stepNumber: 1, action: 'Configure a health-contingent wellness program with reward incentive', expectedResult: 'Program is created with reward configuration' },
      { stepNumber: 2, action: 'Verify reasonable alternative standard is offered to all participants', expectedResult: 'Alternative standard option is available and clearly communicated' },
      { stepNumber: 3, action: 'Verify reward does not exceed 30% of total cost of coverage', expectedResult: 'Reward amount is within HIPAA-compliant limits' },
    ],
    expectedResult: 'Wellness programs comply with HIPAA nondiscrimination rules including reasonable alternative standards and reward limits.',
    tags: ['wellness', 'hipaa', 'nondiscrimination', 'compliance', 'regression'],
    createdBy: 'Amanda Garcia',
    lastModified: '2024-12-10',
    approvalStatus: 'approved',
  },
  {
    id: 'tc_059',
    title: 'Verify Star Ratings predictive model forecast accuracy',
    type: 'functional',
    status: 'not_run',
    priority: 'high',
    application: 'app_star_ratings',
    segment: 'Medicare',
    automationStatus: 'planned',
    steps: [
      { stepNumber: 1, action: 'Load historical measure performance data for the past 3 years', expectedResult: 'Historical data is loaded and validated' },
      { stepNumber: 2, action: 'Execute the predictive analytics model for next year forecast', expectedResult: 'Model generates predicted Star Ratings for each measure' },
      { stepNumber: 3, action: 'Compare predictions against known outcomes for validation year', expectedResult: 'Prediction accuracy is within acceptable tolerance' },
      { stepNumber: 4, action: 'Generate intervention recommendations based on predictions', expectedResult: 'Actionable recommendations are produced for at-risk measures' },
    ],
    expectedResult: 'Predictive analytics model accurately forecasts Star Ratings outcomes and generates actionable intervention recommendations.',
    tags: ['star-ratings', 'predictive', 'analytics', 'forecast', 'model'],
    createdBy: 'Samantha Clark',
    lastModified: '2024-12-01',
    approvalStatus: 'draft',
  },
  {
    id: 'tc_060',
    title: 'Verify notification hub batch delivery optimization under high volume',
    type: 'performance',
    status: 'passed',
    priority: 'medium',
    application: 'app_notification_hub',
    segment: 'Enterprise',
    automationStatus: 'automated',
    steps: [
      { stepNumber: 1, action: 'Queue 50,000 notifications for batch delivery', expectedResult: 'Notifications are queued and batch processing begins' },
      { stepNumber: 2, action: 'Monitor delivery throughput and completion time', expectedResult: 'All notifications are delivered within 30-minute window' },
      { stepNumber: 3, action: 'Verify delivery status tracking for each notification', expectedResult: 'Each notification has a delivery status (sent, delivered, bounced)' },
      { stepNumber: 4, action: 'Verify no duplicate deliveries occur', expectedResult: 'Zero duplicate notifications detected' },
    ],
    expectedResult: 'Notification hub processes high-volume batch deliveries within SLA with accurate status tracking and zero duplicates.',
    tags: ['notification', 'batch', 'performance', 'throughput', 'delivery'],
    createdBy: 'Marcus Thompson',
    lastModified: '2024-12-08',
    approvalStatus: 'approved',
  },
];

/**
 * Returns all available test cases.
 *
 * @returns {TestCase[]} Array of all test case objects
 */
export function getAllTestCases() {
  return [...testCases];
}

/**
 * Retrieves a single test case by its unique ID.
 *
 * @param {string} testCaseId - The test case identifier to look up
 * @returns {TestCase|null} The matching test case object, or null if not found
 */
export function getTestCaseById(testCaseId) {
  if (!testCaseId || typeof testCaseId !== 'string') {
    return null;
  }
  return testCases.find((tc) => tc.id === testCaseId) || null;
}

/**
 * Returns all test cases belonging to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {TestCase[]} Array of test cases in the specified segment
 */
export function getTestCasesBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.segment === segment);
}

/**
 * Returns all test cases filtered by type.
 *
 * @param {string} type - The test type to filter by (e.g. 'functional', 'regression', 'smoke', 'integration', 'e2e', 'performance', 'security', 'accessibility')
 * @returns {TestCase[]} Array of test cases matching the specified type
 */
export function getTestCasesByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.type === type);
}

/**
 * Returns all test cases filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'passed', 'failed', 'blocked', 'not_run', 'in_progress', 'skipped')
 * @returns {TestCase[]} Array of test cases matching the specified status
 */
export function getTestCasesByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.status === status);
}

/**
 * Returns all test cases filtered by priority.
 *
 * @param {string} priority - The priority to filter by (e.g. 'critical', 'high', 'medium', 'low')
 * @returns {TestCase[]} Array of test cases matching the specified priority
 */
export function getTestCasesByPriority(priority) {
  if (!priority || typeof priority !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.priority === priority);
}

/**
 * Returns all test cases associated with a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {TestCase[]} Array of test cases for the specified application
 */
export function getTestCasesByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.application === applicationId);
}

/**
 * Returns all test cases filtered by automation status.
 *
 * @param {string} automationStatus - The automation status to filter by (e.g. 'automated', 'manual', 'hybrid', 'planned')
 * @returns {TestCase[]} Array of test cases matching the specified automation status
 */
export function getTestCasesByAutomationStatus(automationStatus) {
  if (!automationStatus || typeof automationStatus !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.automationStatus === automationStatus);
}

/**
 * Returns all test cases filtered by approval status.
 *
 * @param {string} approvalStatus - The approval status to filter by (e.g. 'approved', 'pending', 'rejected', 'draft')
 * @returns {TestCase[]} Array of test cases matching the specified approval status
 */
export function getTestCasesByApprovalStatus(approvalStatus) {
  if (!approvalStatus || typeof approvalStatus !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.approvalStatus === approvalStatus);
}

/**
 * Returns all test cases created by a specific person.
 *
 * @param {string} createdBy - The creator name to filter by
 * @returns {TestCase[]} Array of test cases created by the specified person
 */
export function getTestCasesByCreator(createdBy) {
  if (!createdBy || typeof createdBy !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.createdBy === createdBy);
}

/**
 * Returns all test cases matching a specific tag.
 *
 * @param {string} tag - The tag to filter by
 * @returns {TestCase[]} Array of test cases containing the specified tag
 */
export function getTestCasesByTag(tag) {
  if (!tag || typeof tag !== 'string') {
    return [];
  }
  return testCases.filter((tc) => tc.tags.includes(tag));
}

/**
 * Returns aggregate statistics across all test cases.
 *
 * @returns {{ totalTestCases: number, statusBreakdown: Object<string, number>, typeBreakdown: Object<string, number>, priorityBreakdown: Object<string, number>, automationBreakdown: Object<string, number>, approvalBreakdown: Object<string, number>, passRate: number }} Aggregate test case statistics
 */
export function getTestCaseAggregates() {
  const totalTestCases = testCases.length;

  const statusBreakdown = testCases.reduce((acc, tc) => {
    acc[tc.status] = (acc[tc.status] || 0) + 1;
    return acc;
  }, {});

  const typeBreakdown = testCases.reduce((acc, tc) => {
    acc[tc.type] = (acc[tc.type] || 0) + 1;
    return acc;
  }, {});

  const priorityBreakdown = testCases.reduce((acc, tc) => {
    acc[tc.priority] = (acc[tc.priority] || 0) + 1;
    return acc;
  }, {});

  const automationBreakdown = testCases.reduce((acc, tc) => {
    acc[tc.automationStatus] = (acc[tc.automationStatus] || 0) + 1;
    return acc;
  }, {});

  const approvalBreakdown = testCases.reduce((acc, tc) => {
    acc[tc.approvalStatus] = (acc[tc.approvalStatus] || 0) + 1;
    return acc;
  }, {});

  const executedTests = testCases.filter((tc) => tc.status === 'passed' || tc.status === 'failed');
  const passedTests = testCases.filter((tc) => tc.status === 'passed');
  const passRate =
    executedTests.length > 0
      ? Math.round((passedTests.length / executedTests.length) * 1000) / 10
      : 0;

  return {
    totalTestCases,
    statusBreakdown,
    typeBreakdown,
    priorityBreakdown,
    automationBreakdown,
    approvalBreakdown,
    passRate,
  };
}

/**
 * Returns all unique test case types.
 *
 * @returns {string[]} Array of unique test case types sorted alphabetically
 */
export function getAllTestCaseTypes() {
  const types = new Set(testCases.map((tc) => tc.type));
  return [...types].sort();
}

/**
 * Returns all unique test case statuses.
 *
 * @returns {string[]} Array of unique test case statuses sorted alphabetically
 */
export function getAllTestCaseStatuses() {
  const statuses = new Set(testCases.map((tc) => tc.status));
  return [...statuses].sort();
}

/**
 * Returns all unique test case priorities.
 *
 * @returns {string[]} Array of unique test case priorities
 */
export function getAllTestCasePriorities() {
  return ['critical', 'high', 'medium', 'low'];
}

/**
 * Returns all unique automation statuses.
 *
 * @returns {string[]} Array of unique automation statuses sorted alphabetically
 */
export function getAllAutomationStatuses() {
  const statuses = new Set(testCases.map((tc) => tc.automationStatus));
  return [...statuses].sort();
}

/**
 * Returns all unique tags across all test cases.
 *
 * @returns {string[]} Array of unique tags sorted alphabetically
 */
export function getAllTestCaseTags() {
  const tags = new Set(testCases.flatMap((tc) => tc.tags));
  return [...tags].sort();
}

export default testCases;