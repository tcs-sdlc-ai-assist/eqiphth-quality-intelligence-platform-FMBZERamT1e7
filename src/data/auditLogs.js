import { NOTIFICATION_TYPES } from '@/lib/constants';

/**
 * @typedef {Object} AuditLog
 * @property {string} id - Unique audit log entry identifier
 * @property {string} eventType - Type of event (login, logout, data_access, data_export, config_change, permission_change, quality_gate_update, report_generated, schedule_change, environment_action, integration_sync, test_execution, demand_update, governance_update, notification_sent, user_management)
 * @property {string} personaId - Persona ID of the user who performed the action
 * @property {string} personaName - Display name of the user who performed the action
 * @property {string} action - Short action description
 * @property {string} details - Detailed description of the audit event
 * @property {string} timestamp - Event timestamp in ISO format
 * @property {string} ipAddress - Mock IP address of the client
 * @property {string} resource - The resource or entity affected (empty string if not applicable)
 * @property {string} outcome - Outcome of the action (success, failure, denied)
 * @property {string} segment - Organizational segment context (empty string if global)
 */

/**
 * Mock audit log data for the EQIP Quality Platform.
 * Contains audit log entry objects representing user actions, system events,
 * and configuration changes with timestamps, IP addresses, and outcome tracking.
 *
 * @type {AuditLog[]}
 */
const auditLogs = [
  {
    id: 'audit_001',
    eventType: 'login',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'User Login',
    details: 'Successfully authenticated via SSO with MFA verification. Session established.',
    timestamp: '2024-12-12T14:30:00Z',
    ipAddress: '10.128.45.102',
    resource: '',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_002',
    eventType: 'login',
    personaId: 'vp_qe',
    personaName: 'Jennifer Williams',
    action: 'User Login',
    details: 'Successfully authenticated via SSO with MFA verification. Session established.',
    timestamp: '2024-12-12T14:15:00Z',
    ipAddress: '10.128.45.110',
    resource: '',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_003',
    eventType: 'login',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'User Login',
    details: 'Successfully authenticated via SSO with MFA verification. Admin session established with elevated privileges.',
    timestamp: '2024-12-12T13:45:00Z',
    ipAddress: '10.128.45.200',
    resource: '',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_004',
    eventType: 'login',
    personaId: 'vendor_partner',
    personaName: 'Alex Rivera',
    action: 'User Login Failed',
    details: 'Authentication failed due to expired MFA token. User prompted to re-enroll MFA device.',
    timestamp: '2024-12-12T13:30:00Z',
    ipAddress: '203.0.113.45',
    resource: '',
    outcome: 'failure',
    segment: 'External',
  },
  {
    id: 'audit_005',
    eventType: 'login',
    personaId: 'vendor_partner',
    personaName: 'Alex Rivera',
    action: 'User Login',
    details: 'Successfully authenticated after MFA re-enrollment. Session established with external partner access.',
    timestamp: '2024-12-12T13:35:00Z',
    ipAddress: '203.0.113.45',
    resource: '',
    outcome: 'success',
    segment: 'External',
  },
  {
    id: 'audit_006',
    eventType: 'data_access',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Viewed Dashboard',
    details: 'Accessed executive quality dashboard with KPI summary, segment breakdowns, and risk distributions.',
    timestamp: '2024-12-12T14:31:00Z',
    ipAddress: '10.128.45.102',
    resource: '/dashboard',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_007',
    eventType: 'data_access',
    personaId: 'quality_engineer',
    personaName: 'Lisa Johnson',
    action: 'Viewed Application Details',
    details: 'Accessed HEDIS Measure Engine application details including test suites, releases, and governance rules.',
    timestamp: '2024-12-12T14:00:00Z',
    ipAddress: '10.128.46.55',
    resource: 'app_hedis_engine',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_008',
    eventType: 'data_access',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Viewed Compliance Scores',
    details: 'Accessed compliance framework scores for all 8 frameworks including HIPAA, SOC2, CMS, NCQA, ACA, STATE_MEDICAID, NIST, and PCI_DSS.',
    timestamp: '2024-12-12T13:00:00Z',
    ipAddress: '10.128.47.88',
    resource: '/reports',
    outcome: 'success',
    segment: 'Compliance',
  },
  {
    id: 'audit_009',
    eventType: 'data_access',
    personaId: 'segment_leader',
    personaName: 'Michael Torres',
    action: 'Viewed Segment Metrics',
    details: 'Accessed Medicare segment quality metrics including Star Ratings, HEDIS measures, and enrollment data.',
    timestamp: '2024-12-12T12:30:00Z',
    ipAddress: '10.128.45.130',
    resource: 'seg_medicare',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_010',
    eventType: 'data_access',
    personaId: 'security_engineer',
    personaName: 'Natalie White',
    action: 'Viewed Audit Findings',
    details: 'Accessed open audit findings filtered by critical severity. Reviewed findings AF-002, AF-003, and AF-004 related to API gateway and vendor integration security.',
    timestamp: '2024-12-12T11:45:00Z',
    ipAddress: '10.128.45.175',
    resource: '/reports',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_011',
    eventType: 'data_export',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Exported Compliance Report',
    details: 'Exported State Medicaid compliance framework report as PDF. Report includes domain scores, trend data, and remediation status for all contracted states.',
    timestamp: '2024-12-12T13:15:00Z',
    ipAddress: '10.128.47.88',
    resource: 'cs_006',
    outcome: 'success',
    segment: 'Compliance',
  },
  {
    id: 'audit_012',
    eventType: 'data_export',
    personaId: 'vp_qe',
    personaName: 'Jennifer Williams',
    action: 'Exported Quality Gate Summary',
    details: 'Exported quality gate summary report as CSV for all 32 quality gates across all segments. Includes gate criteria, thresholds, actual values, and waiver details.',
    timestamp: '2024-12-12T14:20:00Z',
    ipAddress: '10.128.45.110',
    resource: '/measures',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_013',
    eventType: 'data_export',
    personaId: 'performance_engineer',
    personaName: 'Marcus Thompson',
    action: 'Exported Performance Report',
    details: 'Exported HEDIS engine performance test results as JSON. Includes execution timing, resource utilization, and measure-level breakdown for full population test.',
    timestamp: '2024-12-12T10:00:00Z',
    ipAddress: '10.128.45.160',
    resource: 'exec_009',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_014',
    eventType: 'data_export',
    personaId: 'read_only_user',
    personaName: 'Sandra Cooper',
    action: 'Export Denied',
    details: 'Attempted to export dashboard metrics as CSV. Export denied due to insufficient permissions for read-only user role.',
    timestamp: '2024-12-12T09:30:00Z',
    ipAddress: '10.128.45.220',
    resource: '/dashboard',
    outcome: 'denied',
    segment: 'Enterprise',
  },
  {
    id: 'audit_015',
    eventType: 'config_change',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Updated Platform Settings',
    details: 'Updated notification delivery configuration: increased batch size from 1,000 to 2,000 and enabled priority-based queue processing.',
    timestamp: '2024-12-12T13:50:00Z',
    ipAddress: '10.128.45.200',
    resource: '/settings',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_016',
    eventType: 'config_change',
    personaId: 'environment_manager',
    personaName: 'Daniel Robinson',
    action: 'Updated Environment Configuration',
    details: 'Updated Staging External environment (env_staging_external) status from available to maintenance. Scheduled infrastructure upgrade window from 02:00 to 18:00 UTC.',
    timestamp: '2024-12-12T01:55:00Z',
    ipAddress: '10.128.45.185',
    resource: 'env_staging_external',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_017',
    eventType: 'config_change',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Updated Quality Gate Threshold',
    details: 'Updated HEDIS Engine v4.6.0 Release Gate (qg_009) measure specification accuracy threshold from 98% to 100% to align with NCQA requirements.',
    timestamp: '2024-12-04T09:00:00Z',
    ipAddress: '10.128.45.102',
    resource: 'qg_009',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_018',
    eventType: 'permission_change',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Updated User Permissions',
    details: 'Granted EXPORT_REPORTS permission to user Omar Hassan (accessibility_engineer) to enable accessibility audit report exports.',
    timestamp: '2024-12-11T16:00:00Z',
    ipAddress: '10.128.45.200',
    resource: 'accessibility_engineer',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_019',
    eventType: 'permission_change',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Revoked User Access',
    details: 'Revoked EDIT_MEASURES permission from contractor account CTR-2024-0045 due to contract expiration.',
    timestamp: '2024-12-10T17:00:00Z',
    ipAddress: '10.128.45.200',
    resource: 'CTR-2024-0045',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_020',
    eventType: 'quality_gate_update',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Approved Quality Gate Waiver',
    details: 'Approved waiver wv_001 for Member Portal v3.8.0 accessibility compliance gate. Waiver valid until 2025-01-15. Reason: Two minor WCAG 2.1 AA findings scheduled for remediation in v3.8.1.',
    timestamp: '2024-12-11T11:00:00Z',
    ipAddress: '10.128.45.102',
    resource: 'qg_002',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_021',
    eventType: 'quality_gate_update',
    personaId: 'vp_qe',
    personaName: 'Jennifer Williams',
    action: 'Approved Quality Gate Waiver',
    details: 'Approved waiver wv_003 for Partner API Gateway v1.7.0 code coverage gate. Waiver valid until 2025-02-28. Reason: Coverage improvement is part of TLS 1.3 migration effort.',
    timestamp: '2024-11-20T14:00:00Z',
    ipAddress: '10.128.45.110',
    resource: 'qg_021',
    outcome: 'success',
    segment: 'External',
  },
  {
    id: 'audit_022',
    eventType: 'quality_gate_update',
    personaId: 'vp_qe',
    personaName: 'Jennifer Williams',
    action: 'Approved Emergency Fix Gate',
    details: 'Approved emergency fix gate waiver wv_008 for API Gateway v1.6.2. Load test stability waived due to critical timeout fix. Waiver valid until 2025-01-15.',
    timestamp: '2024-11-04T16:00:00Z',
    ipAddress: '10.128.45.110',
    resource: 'qg_032',
    outcome: 'success',
    segment: 'External',
  },
  {
    id: 'audit_023',
    eventType: 'quality_gate_update',
    personaId: 'avp_qe',
    personaName: 'David Park',
    action: 'Approved Quality Gate Waiver',
    details: 'Approved waiver wv_006 for Medicaid Eligibility v3.8.2 unit test pass rate. Pre-existing failures related to multi-state configuration feature not in scope for hotfix.',
    timestamp: '2024-11-13T10:00:00Z',
    ipAddress: '10.128.45.140',
    resource: 'qg_031',
    outcome: 'success',
    segment: 'Medicaid',
  },
  {
    id: 'audit_024',
    eventType: 'report_generated',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Generated Regulatory Report',
    details: 'Generated 2025 CMS regulatory report using new template. Report passed all format compliance validation checks with 99.95% data accuracy.',
    timestamp: '2024-12-10T08:06:30Z',
    ipAddress: '10.128.47.88',
    resource: 'app_regulatory_reporting',
    outcome: 'success',
    segment: 'Compliance',
  },
  {
    id: 'audit_025',
    eventType: 'report_generated',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Generated State Report',
    details: 'Generated quarterly state regulatory reports for State A, State B, and State C. State B report flagged with data accuracy issues (0.4% enrollment count discrepancy).',
    timestamp: '2024-11-28T10:12:45Z',
    ipAddress: '10.128.47.88',
    resource: 'app_state_reporting',
    outcome: 'failure',
    segment: 'Medicaid',
  },
  {
    id: 'audit_026',
    eventType: 'schedule_change',
    personaId: 'automation_engineer',
    personaName: 'James Wright',
    action: 'Paused Test Schedule',
    details: 'Paused Provider Network E2E test schedule (sched_039) pending environment stabilization after recent infrastructure changes.',
    timestamp: '2024-11-21T07:00:00Z',
    ipAddress: '10.128.46.70',
    resource: 'sched_039',
    outcome: 'success',
    segment: 'Medicaid',
  },
  {
    id: 'audit_027',
    eventType: 'schedule_change',
    personaId: 'sdet',
    personaName: 'Priya Patel',
    action: 'Disabled Test Schedule',
    details: 'Disabled Individual Marketplace regression schedule (sched_040) during OEP 2025 deployment freeze. Will be re-enabled after deployment stabilization.',
    timestamp: '2024-11-15T10:00:00Z',
    ipAddress: '10.128.46.65',
    resource: 'sched_040',
    outcome: 'success',
    segment: 'Commercial',
  },
  {
    id: 'audit_028',
    eventType: 'schedule_change',
    personaId: 'quality_engineer',
    personaName: 'Lisa Johnson',
    action: 'Created Test Schedule',
    details: 'Created HEDIS E2E Measure Validation cron schedule (sched_038) running Monday, Wednesday, and Friday at 4 AM UTC in QA environment.',
    timestamp: '2024-04-25T09:00:00Z',
    ipAddress: '10.128.46.55',
    resource: 'sched_038',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_029',
    eventType: 'environment_action',
    personaId: 'quality_engineer',
    personaName: 'Lisa Johnson',
    action: 'Reserved Environment',
    details: 'Reserved Development 2 environment (env_dev_02) for HEDIS measure specification development. Reservation period: 2024-12-12T08:00Z to 2024-12-13T18:00Z.',
    timestamp: '2024-12-12T07:55:00Z',
    ipAddress: '10.128.46.55',
    resource: 'env_dev_02',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_030',
    eventType: 'environment_action',
    personaId: 'qe_manager',
    personaName: 'Robert Kim',
    action: 'Reserved Environment',
    details: 'Reserved QA Secondary environment (env_qa_02) for Medicaid segment testing. Reservation period: 2024-12-12T06:00Z to 2024-12-13T22:00Z.',
    timestamp: '2024-12-12T05:55:00Z',
    ipAddress: '10.128.46.80',
    resource: 'env_qa_02',
    outcome: 'success',
    segment: 'Medicaid',
  },
  {
    id: 'audit_031',
    eventType: 'environment_action',
    personaId: 'avp_qe',
    personaName: 'David Park',
    action: 'Reserved Environment',
    details: 'Reserved Staging Medicaid environment (env_staging_02) for pre-release validation. Reservation period: 2024-12-12T00:00Z to 2024-12-14T23:59Z.',
    timestamp: '2024-12-11T23:50:00Z',
    ipAddress: '10.128.45.140',
    resource: 'env_staging_02',
    outcome: 'success',
    segment: 'Medicaid',
  },
  {
    id: 'audit_032',
    eventType: 'environment_action',
    personaId: 'environment_manager',
    personaName: 'Daniel Robinson',
    action: 'Environment Maintenance Started',
    details: 'Initiated scheduled maintenance on Staging External environment (env_staging_external). Infrastructure upgrade for TLS 1.3 support and load balancer configuration.',
    timestamp: '2024-12-12T02:00:00Z',
    ipAddress: '10.128.45.185',
    resource: 'env_staging_external',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_033',
    eventType: 'integration_sync',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Integration Sync Completed',
    details: 'Azure DevOps integration (int_azure_devops) full sync completed successfully. 1,245 records processed including work items, pipelines, and repository data.',
    timestamp: '2024-12-12T14:30:00Z',
    ipAddress: '10.128.45.200',
    resource: 'int_azure_devops',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_034',
    eventType: 'integration_sync',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Integration Sync Failed',
    details: 'SAP Fieldglass integration (int_fieldglass) sync failed. Authentication certificate expired for service account EQIP_FG_SVC. 2 consecutive failures recorded.',
    timestamp: '2024-12-12T06:00:00Z',
    ipAddress: '10.128.45.200',
    resource: 'int_fieldglass',
    outcome: 'failure',
    segment: 'Enterprise',
  },
  {
    id: 'audit_035',
    eventType: 'integration_sync',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Integration Sync Completed',
    details: 'qTest integration (int_qtest) full sync completed successfully. 3,420 records processed including test cases, test runs, and defect links.',
    timestamp: '2024-12-12T14:00:00Z',
    ipAddress: '10.128.45.102',
    resource: 'int_qtest',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_036',
    eventType: 'test_execution',
    personaId: 'quality_engineer',
    personaName: 'Lisa Johnson',
    action: 'Test Execution Completed',
    details: 'HEDIS BCS measure calculation test (tc_016) executed and failed. BCS measure rate 72.3% does not match expected 74.1%. Bilateral mastectomy exclusion logic missing ICD-10-PCS codes.',
    timestamp: '2024-12-04T11:08:32Z',
    ipAddress: '10.128.46.55',
    resource: 'exec_008',
    outcome: 'failure',
    segment: 'Medicare',
  },
  {
    id: 'audit_037',
    eventType: 'test_execution',
    personaId: 'security_engineer',
    personaName: 'Natalie White',
    action: 'Test Execution Completed',
    details: 'API Gateway OAuth 2.0 token validation test (tc_035) executed and failed. Token with insufficient scopes returned 200 OK instead of 403 Forbidden. Scope enforcement disabled.',
    timestamp: '2024-11-24T14:04:12Z',
    ipAddress: '10.128.45.175',
    resource: 'exec_015',
    outcome: 'failure',
    segment: 'External',
  },
  {
    id: 'audit_038',
    eventType: 'test_execution',
    personaId: 'security_engineer',
    personaName: 'Natalie White',
    action: 'Test Execution Completed',
    details: 'Vendor integration encrypted data channel test (tc_036) executed and failed. TLS 1.1 connection accepted and BAA agreement validation not enforced.',
    timestamp: '2024-11-18T11:06:40Z',
    ipAddress: '10.128.45.175',
    resource: 'exec_016',
    outcome: 'failure',
    segment: 'External',
  },
  {
    id: 'audit_039',
    eventType: 'test_execution',
    personaId: 'security_engineer',
    personaName: 'Natalie White',
    action: 'Test Execution Completed',
    details: 'HIPAA PHI encryption at rest test (tc_046) executed and passed. All PHI fields encrypted using AES-256 with proper key management and rotation support.',
    timestamp: '2024-11-15T09:04:45Z',
    ipAddress: '10.128.45.175',
    resource: 'exec_022',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_040',
    eventType: 'test_execution',
    personaId: 'performance_engineer',
    personaName: 'Marcus Thompson',
    action: 'Test Execution Completed',
    details: 'Claims batch processing performance test (tc_002) executed and passed. 10,000 claims processed in 28 minutes 15 seconds within 30-minute SLA. Throughput: 354 claims/minute.',
    timestamp: '2024-12-08T22:28:15Z',
    ipAddress: '10.128.45.160',
    resource: 'exec_002',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_041',
    eventType: 'test_execution',
    personaId: 'performance_engineer',
    personaName: 'Marcus Thompson',
    action: 'Test Execution Completed',
    details: 'HEDIS engine full population performance test (tc_018) executed and failed. Processing took 4h 45m, exceeding 4-hour SLA by 45 minutes. CDC and CBP measures are primary bottlenecks.',
    timestamp: '2024-12-03T01:45:00Z',
    ipAddress: '10.128.45.160',
    resource: 'exec_009',
    outcome: 'failure',
    segment: 'Medicare',
  },
  {
    id: 'audit_042',
    eventType: 'demand_update',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Approved Demand',
    details: 'Approved demand dem_003 (Member Portal Accessibility Remediation). Assigned to Omar Hassan with target date 2025-03-15. Estimated effort: 13 story points.',
    timestamp: '2024-11-05T10:00:00Z',
    ipAddress: '10.128.45.102',
    resource: 'dem_003',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_043',
    eventType: 'demand_update',
    personaId: 'vp_qe',
    personaName: 'Jennifer Williams',
    action: 'Approved Demand',
    details: 'Approved demand dem_004 (API Gateway Performance Optimization). Critical enhancement assigned to Marcus Thompson with target date 2025-01-15.',
    timestamp: '2024-10-22T14:00:00Z',
    ipAddress: '10.128.45.110',
    resource: 'dem_004',
    outcome: 'success',
    segment: 'External',
  },
  {
    id: 'audit_044',
    eventType: 'demand_update',
    personaId: 'vp_qe',
    personaName: 'Jennifer Williams',
    action: 'Deferred Demand',
    details: 'Deferred demand dem_035 (Claims Processing Batch Performance Improvement) to Q2 2025. Current batch performance is within SLA. Priority shifted to critical items.',
    timestamp: '2024-11-01T11:00:00Z',
    ipAddress: '10.128.45.110',
    resource: 'dem_035',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_045',
    eventType: 'demand_update',
    personaId: 'segment_leader',
    personaName: 'Michael Torres',
    action: 'Completed Demand',
    details: 'Marked demand dem_014 (Medicare Enrollment AEP 2025 Rules Update) as completed. CMS-mandated enrollment rules and plan benefit updates deployed to production.',
    timestamp: '2024-12-11T18:30:00Z',
    ipAddress: '10.128.45.130',
    resource: 'dem_014',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_046',
    eventType: 'governance_update',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Updated Compliance Score',
    details: 'Updated State Medicaid compliance framework score to 79.8% (AT_RISK). Eligibility processing, state reporting, and member outreach domains marked as non-compliant.',
    timestamp: '2024-11-20T15:00:00Z',
    ipAddress: '10.128.47.88',
    resource: 'cs_006',
    outcome: 'success',
    segment: 'Compliance',
  },
  {
    id: 'audit_047',
    eventType: 'governance_update',
    personaId: 'security_engineer',
    personaName: 'Natalie White',
    action: 'Updated Compliance Score',
    details: 'Updated PCI DSS compliance framework score to 72.5% (CRITICAL). Monitoring & Testing and Security Policy domains marked as non-compliant. Next assessment due 2025-01-25.',
    timestamp: '2024-11-25T16:00:00Z',
    ipAddress: '10.128.45.175',
    resource: 'cs_008',
    outcome: 'success',
    segment: 'Compliance',
  },
  {
    id: 'audit_048',
    eventType: 'governance_update',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Created Audit Finding',
    details: 'Created audit finding AF-001 (HEDIS Measure Specification Non-Compliance). Critical severity. BCS and CDC measure calculations do not fully align with NCQA MY2024 specifications.',
    timestamp: '2024-12-01T09:00:00Z',
    ipAddress: '10.128.45.102',
    resource: 'af_001',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_049',
    eventType: 'governance_update',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Closed Audit Finding',
    details: 'Closed audit finding AF-011 (HIPAA PHI Encryption Audit - Passed). Annual HIPAA PHI encryption audit confirmed AES-256 compliance with proper key management.',
    timestamp: '2024-11-15T16:30:00Z',
    ipAddress: '10.128.47.88',
    resource: 'af_011',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_050',
    eventType: 'governance_update',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Closed Audit Finding',
    details: 'Closed audit finding AF-012 (SOC 2 Type II Annual Audit - Passed). All trust service criteria met with no exceptions noted.',
    timestamp: '2024-10-15T17:00:00Z',
    ipAddress: '10.128.47.88',
    resource: 'af_012',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_051',
    eventType: 'notification_sent',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Notification Delivered',
    details: 'Quality gate failure notification sent for HEDIS Engine v4.6.0. Delivered via email and in-app channels to quality_director and vp_qe personas.',
    timestamp: '2024-12-12T14:30:00Z',
    ipAddress: '10.128.45.102',
    resource: 'notif_001',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_052',
    eventType: 'notification_sent',
    personaId: 'security_engineer',
    personaName: 'Natalie White',
    action: 'Notification Delivered',
    details: 'Security alert notification sent for API Gateway OAuth scope enforcement disabled. Delivered via email and Slack channels to security_engineer and vendor_partner personas.',
    timestamp: '2024-12-12T09:00:00Z',
    ipAddress: '10.128.45.175',
    resource: 'notif_007',
    outcome: 'success',
    segment: 'External',
  },
  {
    id: 'audit_053',
    eventType: 'notification_sent',
    personaId: 'environment_manager',
    personaName: 'Daniel Robinson',
    action: 'Notification Delivered',
    details: 'Environment down notification sent for QA Hotfix environment (env_qa_hotfix). Delivered via email, Slack, and in-app channels to environment_manager and production_support personas.',
    timestamp: '2024-12-11T22:15:00Z',
    ipAddress: '10.128.45.185',
    resource: 'notif_017',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_054',
    eventType: 'data_access',
    personaId: 'test_data_engineer',
    personaName: 'Samantha Clark',
    action: 'Viewed Test Data Assets',
    details: 'Accessed test data management view. Reviewed 45 test data assets across all applications and environments. Identified 3 stale datasets requiring refresh.',
    timestamp: '2024-12-12T08:00:00Z',
    ipAddress: '10.128.46.90',
    resource: '/patients',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_055',
    eventType: 'data_access',
    personaId: 'test_data_engineer',
    personaName: 'Samantha Clark',
    action: 'Refreshed Test Data',
    details: 'Refreshed HEDIS Measure Calculation Clinical Data (td_013) with MY2025 measure specification changes and new exclusion criteria data. Full PHI masking reapplied.',
    timestamp: '2024-12-04T07:00:00Z',
    ipAddress: '10.128.46.90',
    resource: 'td_013',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_056',
    eventType: 'data_access',
    personaId: 'test_data_engineer',
    personaName: 'Samantha Clark',
    action: 'Test Data Provisioning Failed',
    details: 'Claims Engine subset test data (td_045) provisioning failed due to database connection timeout in Development 1 environment. Partial masking was incomplete.',
    timestamp: '2024-12-11T11:00:00Z',
    ipAddress: '10.128.46.90',
    resource: 'td_045',
    outcome: 'failure',
    segment: 'Enterprise',
  },
  {
    id: 'audit_057',
    eventType: 'logout',
    personaId: 'vendor_partner',
    personaName: 'Alex Rivera',
    action: 'User Logout',
    details: 'User session terminated. Session duration: 4 hours 25 minutes. All temporary tokens invalidated.',
    timestamp: '2024-12-12T18:00:00Z',
    ipAddress: '203.0.113.45',
    resource: '',
    outcome: 'success',
    segment: 'External',
  },
  {
    id: 'audit_058',
    eventType: 'logout',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    action: 'Session Timeout',
    details: 'User session expired after 30 minutes of inactivity. Automatic logout triggered per session management policy.',
    timestamp: '2024-12-12T17:30:00Z',
    ipAddress: '10.128.45.102',
    resource: '',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_059',
    eventType: 'user_management',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Created User Account',
    details: 'Created new user account for contractor Maria Santos with quality_engineer role. Assigned to Medicare segment with standard permissions.',
    timestamp: '2024-12-10T09:00:00Z',
    ipAddress: '10.128.45.200',
    resource: 'CTR-2024-0052',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_060',
    eventType: 'user_management',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Deactivated User Account',
    details: 'Deactivated user account for former employee Mark Johnson. All active sessions terminated and access tokens revoked.',
    timestamp: '2024-12-09T16:00:00Z',
    ipAddress: '10.128.45.200',
    resource: 'EMP-2024-0198',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_061',
    eventType: 'data_access',
    personaId: 'accessibility_engineer',
    personaName: 'Omar Hassan',
    action: 'Viewed Test Execution Results',
    details: 'Accessed screen reader compatibility test execution results (exec_004) for Member Portal claims history. Reviewed 2 accessibility failures and evidence artifacts.',
    timestamp: '2024-12-11T14:40:00Z',
    ipAddress: '10.128.46.95',
    resource: 'exec_004',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_062',
    eventType: 'data_access',
    personaId: 'product_owner',
    personaName: 'Emily Davis',
    action: 'Viewed Star Ratings Analytics',
    details: 'Accessed Star Ratings Analytics application details. Reviewed MY2024 measure data, Part C overall rating calculation, and predictive modeling baseline.',
    timestamp: '2024-12-07T09:10:00Z',
    ipAddress: '10.128.45.150',
    resource: 'app_star_ratings',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_063',
    eventType: 'config_change',
    personaId: 'automation_engineer',
    personaName: 'James Wright',
    action: 'Updated Schedule Retry Policy',
    details: 'Updated Vendor Integration Regression schedule (sched_032) retry policy. Changed max retries from 1 to 2 and backoff strategy from fixed to exponential.',
    timestamp: '2024-12-10T11:00:00Z',
    ipAddress: '10.128.46.70',
    resource: 'sched_032',
    outcome: 'success',
    segment: 'External',
  },
  {
    id: 'audit_064',
    eventType: 'data_access',
    personaId: 'executive_leadership',
    personaName: 'Sarah Chen',
    action: 'Viewed Executive Dashboard',
    details: 'Accessed executive quality dashboard. Reviewed overall quality score (88.2%), segment breakdowns, and risk distribution across all 24 applications.',
    timestamp: '2024-12-12T09:00:00Z',
    ipAddress: '10.128.45.100',
    resource: '/dashboard',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_065',
    eventType: 'data_export',
    personaId: 'product_owner',
    personaName: 'Emily Davis',
    action: 'Exported Demand Report',
    details: 'Exported demand pipeline report as CSV for Medicare segment. Includes 12 demands with status, priority, effort estimates, and analytics scores.',
    timestamp: '2024-12-11T15:00:00Z',
    ipAddress: '10.128.45.150',
    resource: '/measures',
    outcome: 'success',
    segment: 'Medicare',
  },
  {
    id: 'audit_066',
    eventType: 'governance_update',
    personaId: 'qe_manager',
    personaName: 'Robert Kim',
    action: 'Updated Procedure',
    details: 'Submitted Code Review Standards procedure (proc_018) v3.3.0-draft for review. Updates include security review triggers and approval criteria changes.',
    timestamp: '2024-12-10T14:00:00Z',
    ipAddress: '10.128.46.80',
    resource: 'proc_018',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_067',
    eventType: 'test_execution',
    personaId: 'accessibility_engineer',
    personaName: 'Omar Hassan',
    action: 'Test Execution Completed',
    details: 'WCAG 2.1 AA keyboard navigation test (tc_004) executed and passed. All interactive elements keyboard accessible with visible focus indicators and proper ARIA attributes.',
    timestamp: '2024-12-11T13:08:15Z',
    ipAddress: '10.128.46.95',
    resource: 'exec_035',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_068',
    eventType: 'test_execution',
    personaId: 'qe_manager',
    personaName: 'Robert Kim',
    action: 'Test Execution Completed',
    details: 'Medicaid eligibility determination test (tc_021) executed and failed. Applicant at 135% FPL incorrectly determined as ineligible due to income threshold comparison operator error.',
    timestamp: '2024-12-01T13:06:15Z',
    ipAddress: '10.128.46.80',
    resource: 'exec_010',
    outcome: 'failure',
    segment: 'Medicaid',
  },
  {
    id: 'audit_069',
    eventType: 'login',
    personaId: 'production_support',
    personaName: 'Karen Mitchell',
    action: 'User Login',
    details: 'Successfully authenticated via SSO with MFA verification. Session established for production support monitoring.',
    timestamp: '2024-12-12T06:00:00Z',
    ipAddress: '10.128.45.190',
    resource: '',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_070',
    eventType: 'data_access',
    personaId: 'production_support',
    personaName: 'Karen Mitchell',
    action: 'Viewed Production Health',
    details: 'Accessed Production US-East environment health dashboard. Overall health score: 99.4%. Vendor Integration service degraded with 280ms response time.',
    timestamp: '2024-12-12T06:05:00Z',
    ipAddress: '10.128.45.190',
    resource: 'env_prod_01',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_071',
    eventType: 'data_access',
    personaId: 'scrum_master',
    personaName: 'Kevin Brown',
    action: 'Viewed Demand Pipeline',
    details: 'Accessed demand pipeline for Commercial segment. Reviewed 8 active demands including group enrollment self-service portal and underwriting risk model updates.',
    timestamp: '2024-12-11T10:00:00Z',
    ipAddress: '10.128.45.145',
    resource: '/measures',
    outcome: 'success',
    segment: 'Commercial',
  },
  {
    id: 'audit_072',
    eventType: 'data_access',
    personaId: 'release_manager',
    personaName: 'Amanda Garcia',
    action: 'Viewed Release History',
    details: 'Accessed release history for Care Management Platform. Reviewed v2.8.0 release details including quality gate status (failed) and outreach tracking compliance issues.',
    timestamp: '2024-12-06T17:00:00Z',
    ipAddress: '10.128.45.155',
    resource: 'app_care_management',
    outcome: 'success',
    segment: 'Medicaid',
  },
  {
    id: 'audit_073',
    eventType: 'data_access',
    personaId: 'developer',
    personaName: 'Chris Anderson',
    action: 'Viewed Test Case Details',
    details: 'Accessed provider directory geo-spatial search test case (tc_006) details. Reviewed test steps, expected results, and execution history.',
    timestamp: '2024-12-08T11:00:00Z',
    ipAddress: '10.128.46.60',
    resource: 'tc_006',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_074',
    eventType: 'data_access',
    personaId: 'program_manager',
    personaName: 'Thomas Lee',
    action: 'Viewed Segment Overview',
    details: 'Accessed Medicaid segment overview. Reviewed quality score (78.4%), compliance rate (85.6%), and AT_RISK status with 4 applications requiring attention.',
    timestamp: '2024-12-11T14:00:00Z',
    ipAddress: '10.128.45.135',
    resource: 'seg_medicaid',
    outcome: 'success',
    segment: 'Medicaid',
  },
  {
    id: 'audit_075',
    eventType: 'login',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'User Login',
    details: 'Successfully authenticated via SSO with MFA verification. Session established for compliance audit activities.',
    timestamp: '2024-12-12T07:00:00Z',
    ipAddress: '10.128.47.88',
    resource: '',
    outcome: 'success',
    segment: 'Compliance',
  },
  {
    id: 'audit_076',
    eventType: 'governance_update',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    action: 'Closed Audit Finding',
    details: 'Closed audit finding AF-013 (Disaster Recovery Test Q4 2024 - Passed). Failover to US-West DR environment completed within RTO of 4 hours with zero data loss.',
    timestamp: '2024-10-20T18:30:00Z',
    ipAddress: '10.128.47.88',
    resource: 'af_013',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_077',
    eventType: 'data_export',
    personaId: 'analyst',
    personaName: 'Emily Davis',
    action: 'Exported Trend Data',
    details: 'Exported 12-month quality score trend data as CSV for all 6 segments. Includes monthly quality scores and compliance rates.',
    timestamp: '2024-12-12T11:00:00Z',
    ipAddress: '10.128.45.150',
    resource: '/analytics',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_078',
    eventType: 'config_change',
    personaId: 'admin',
    personaName: 'Brian Foster',
    action: 'Updated Integration Configuration',
    details: 'Updated Dynatrace integration (int_dynatrace) alerting profile from eqip-standard to eqip-critical. Reduced alert threshold for response time degradation.',
    timestamp: '2024-12-10T15:00:00Z',
    ipAddress: '10.128.45.200',
    resource: 'int_dynatrace',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_079',
    eventType: 'data_access',
    personaId: 'application_owner',
    personaName: 'Rachel Nguyen',
    action: 'Viewed Application Quality',
    details: 'Accessed Member Portal application quality details. Reviewed v3.8.0 release quality score (96.5%), test results (3,050 passed, 8 failed), and accessibility waiver status.',
    timestamp: '2024-12-12T10:00:00Z',
    ipAddress: '10.128.45.165',
    resource: 'app_member_portal',
    outcome: 'success',
    segment: 'Enterprise',
  },
  {
    id: 'audit_080',
    eventType: 'login',
    personaId: 'quality_engineer',
    personaName: 'Lisa Johnson',
    action: 'User Login',
    details: 'Successfully authenticated via SSO with MFA verification. Session established for Medicare quality engineering activities.',
    timestamp: '2024-12-12T08:00:00Z',
    ipAddress: '10.128.46.55',
    resource: '',
    outcome: 'success',
    segment: 'Medicare',
  },
];

/**
 * Returns all available audit logs.
 *
 * @returns {AuditLog[]} Array of all audit log objects
 */
export function getAllAuditLogs() {
  return [...auditLogs];
}

/**
 * Retrieves a single audit log entry by its unique ID.
 *
 * @param {string} auditLogId - The audit log identifier to look up
 * @returns {AuditLog|null} The matching audit log object, or null if not found
 */
export function getAuditLogById(auditLogId) {
  if (!auditLogId || typeof auditLogId !== 'string') {
    return null;
  }
  return auditLogs.find((a) => a.id === auditLogId) || null;
}

/**
 * Returns all audit logs filtered by event type.
 *
 * @param {string} eventType - The event type to filter by (e.g. 'login', 'data_access', 'config_change')
 * @returns {AuditLog[]} Array of audit logs matching the specified event type
 */
export function getAuditLogsByEventType(eventType) {
  if (!eventType || typeof eventType !== 'string') {
    return [];
  }
  return auditLogs.filter((a) => a.eventType === eventType);
}

/**
 * Returns all audit logs for a specific persona.
 *
 * @param {string} personaId - The persona ID to filter by
 * @returns {AuditLog[]} Array of audit logs for the specified persona
 */
export function getAuditLogsByPersona(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return [];
  }
  return auditLogs.filter((a) => a.personaId === personaId);
}

/**
 * Returns all audit logs filtered by outcome.
 *
 * @param {string} outcome - The outcome to filter by (e.g. 'success', 'failure', 'denied')
 * @returns {AuditLog[]} Array of audit logs matching the specified outcome
 */
export function getAuditLogsByOutcome(outcome) {
  if (!outcome || typeof outcome !== 'string') {
    return [];
  }
  return auditLogs.filter((a) => a.outcome === outcome);
}

/**
 * Returns all audit logs filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {AuditLog[]} Array of audit logs matching the specified segment
 */
export function getAuditLogsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return auditLogs.filter((a) => a.segment === segment);
}

/**
 * Returns all audit logs related to a specific resource.
 *
 * @param {string} resource - The resource identifier to filter by
 * @returns {AuditLog[]} Array of audit logs for the specified resource
 */
export function getAuditLogsByResource(resource) {
  if (!resource || typeof resource !== 'string') {
    return [];
  }
  return auditLogs.filter((a) => a.resource === resource);
}

/**
 * Returns all audit logs for a specific persona name.
 *
 * @param {string} personaName - The persona display name to filter by
 * @returns {AuditLog[]} Array of audit logs for the specified persona name
 */
export function getAuditLogsByPersonaName(personaName) {
  if (!personaName || typeof personaName !== 'string') {
    return [];
  }
  return auditLogs.filter((a) => a.personaName === personaName);
}

/**
 * Returns aggregate statistics across all audit logs.
 *
 * @returns {{ totalLogs: number, eventTypeBreakdown: Object<string, number>, outcomeBreakdown: Object<string, number>, segmentBreakdown: Object<string, number>, personaBreakdown: Object<string, number>, successCount: number, failureCount: number, deniedCount: number }} Aggregate audit log statistics
 */
export function getAuditLogAggregates() {
  const totalLogs = auditLogs.length;

  const eventTypeBreakdown = auditLogs.reduce((acc, a) => {
    acc[a.eventType] = (acc[a.eventType] || 0) + 1;
    return acc;
  }, {});

  const outcomeBreakdown = auditLogs.reduce((acc, a) => {
    acc[a.outcome] = (acc[a.outcome] || 0) + 1;
    return acc;
  }, {});

  const segmentBreakdown = auditLogs.reduce((acc, a) => {
    if (a.segment) {
      acc[a.segment] = (acc[a.segment] || 0) + 1;
    }
    return acc;
  }, {});

  const personaBreakdown = auditLogs.reduce((acc, a) => {
    acc[a.personaId] = (acc[a.personaId] || 0) + 1;
    return acc;
  }, {});

  const successCount = auditLogs.filter((a) => a.outcome === 'success').length;
  const failureCount = auditLogs.filter((a) => a.outcome === 'failure').length;
  const deniedCount = auditLogs.filter((a) => a.outcome === 'denied').length;

  return {
    totalLogs,
    eventTypeBreakdown,
    outcomeBreakdown,
    segmentBreakdown,
    personaBreakdown,
    successCount,
    failureCount,
    deniedCount,
  };
}

/**
 * Returns all unique event types across all audit logs.
 *
 * @returns {string[]} Array of unique event types sorted alphabetically
 */
export function getAllAuditLogEventTypes() {
  const eventTypes = new Set(auditLogs.map((a) => a.eventType));
  return [...eventTypes].sort();
}

/**
 * Returns all unique outcomes across all audit logs.
 *
 * @returns {string[]} Array of unique outcomes sorted alphabetically
 */
export function getAllAuditLogOutcomes() {
  const outcomes = new Set(auditLogs.map((a) => a.outcome));
  return [...outcomes].sort();
}

/**
 * Returns all unique segments across all audit logs.
 *
 * @returns {string[]} Array of unique segments sorted alphabetically
 */
export function getAllAuditLogSegments() {
  const segments = new Set(auditLogs.filter((a) => a.segment).map((a) => a.segment));
  return [...segments].sort();
}

/**
 * Returns all unique persona names across all audit logs.
 *
 * @returns {string[]} Array of unique persona names sorted alphabetically
 */
export function getAllAuditLogPersonaNames() {
  const names = new Set(auditLogs.map((a) => a.personaName));
  return [...names].sort();
}

export default auditLogs;