import { NOTIFICATION_TYPES } from '@/lib/constants';

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique notification identifier
 * @property {string} personaId - Persona ID this notification is targeted to
 * @property {string} type - Notification type (success, warning, error, info)
 * @property {string} title - Display title of the notification
 * @property {string} message - Detailed notification message
 * @property {string} timestamp - Notification timestamp in ISO format
 * @property {boolean} read - Whether the notification has been read
 * @property {string} actionUrl - URL or route path for the notification action (empty string if no action)
 * @property {string} priority - Priority level (critical, high, medium, low)
 * @property {string} category - Notification category (quality_gate, test_failure, deployment, compliance, environment, security, performance, governance, demand, schedule, integration, data)
 * @property {string} source - Source system or application that generated the notification
 */

/**
 * Mock notification data for the EQIP Quality Platform.
 * Contains notification objects representing various trigger types across
 * quality gates, test failures, deployments, compliance, environments,
 * security, performance, governance, demands, schedules, integrations, and data.
 *
 * @type {Notification[]}
 */
const notifications = [
  {
    id: 'notif_001',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Quality Gate Failed: HEDIS Engine v4.6.0',
    message: 'Quality gate for HEDIS Engine v4.6.0 has failed. 3 critical defects detected and measure specification accuracy is below threshold at 96.8% (required: 100%).',
    timestamp: '2024-12-12T14:30:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'quality_gate',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_002',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Quality Gate Failed: Medicaid Eligibility v3.9.0',
    message: 'Quality gate for Medicaid Eligibility v3.9.0 has failed. Unit test pass rate at 94.6% is below the 95% threshold. 2 critical defects remain open.',
    timestamp: '2024-12-12T13:45:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'quality_gate',
    source: 'app_medicaid_eligibility',
  },
  {
    id: 'notif_003',
    personaId: 'vp_qe',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Quality Gate Failed: Vendor Integration v1.5.0',
    message: 'Quality gate for Vendor Integration v1.5.0 has failed across all criteria. Unit test pass rate at 88.5%, vendor data security at 72.0%, and 5 critical defects detected.',
    timestamp: '2024-12-12T12:00:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'quality_gate',
    source: 'app_vendor_integration',
  },
  {
    id: 'notif_004',
    personaId: 'quality_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'BCS Measure Calculation Test Failed',
    message: 'HEDIS BCS measure calculation test (tc_016) failed. BCS measure rate 72.3% does not match expected 74.1%. Bilateral mastectomy exclusion logic is missing ICD-10-PCS codes.',
    timestamp: '2024-12-12T11:15:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'test_failure',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_005',
    personaId: 'quality_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'CDC HbA1c Sub-Measure Test Failed',
    message: 'HEDIS CDC HbA1c poor control sub-measure test (tc_050) failed. Rate deviation of 2.3% from expected value. ESRD exclusion using outdated value set.',
    timestamp: '2024-12-12T10:30:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'test_failure',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_006',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Medicaid Eligibility Determination Test Failed',
    message: 'Medicaid eligibility determination test (tc_021) failed. Applicant at 135% FPL incorrectly determined as ineligible due to income threshold comparison operator error.',
    timestamp: '2024-12-12T09:45:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'test_failure',
    source: 'app_medicaid_eligibility',
  },
  {
    id: 'notif_007',
    personaId: 'security_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'API Gateway OAuth Scope Enforcement Disabled',
    message: 'Security test (tc_035) detected that OAuth 2.0 scope enforcement is disabled on the partner API gateway. Tokens with insufficient scopes can access protected resources.',
    timestamp: '2024-12-12T09:00:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'security',
    source: 'app_partner_api_gateway',
  },
  {
    id: 'notif_008',
    personaId: 'security_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Vendor Integration Accepts TLS 1.1 Connections',
    message: 'Security test (tc_036) confirmed vendor integration hub accepts deprecated TLS 1.1 connections, violating minimum TLS 1.2 requirement for PHI data exchanges.',
    timestamp: '2024-12-12T08:30:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'security',
    source: 'app_vendor_integration',
  },
  {
    id: 'notif_009',
    personaId: 'security_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Vendor BAA Agreement Enforcement Gap',
    message: 'BAA agreement validation is implemented as a warning log rather than a blocking enforcement. Data exchange proceeds for vendors without active BAA agreements.',
    timestamp: '2024-12-12T08:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'security',
    source: 'app_vendor_integration',
  },
  {
    id: 'notif_010',
    personaId: 'vp_qe',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Claims Engine v4.12.0 Deployed to Production',
    message: 'Claims Processing Engine v4.12.0 has been successfully deployed to production. Quality gate passed with 94.2% quality score. Real-time claim status tracking is now live.',
    timestamp: '2024-12-10T16:00:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'medium',
    category: 'deployment',
    source: 'app_claims_engine',
  },
  {
    id: 'notif_011',
    personaId: 'vp_qe',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Member Portal v3.8.0 Deployed to Production',
    message: 'Member Portal v3.8.0 has been successfully deployed to production with quality gate passed (waiver for accessibility). New dashboard redesign is now live.',
    timestamp: '2024-12-12T10:00:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'medium',
    category: 'deployment',
    source: 'app_member_portal',
  },
  {
    id: 'notif_012',
    personaId: 'segment_leader',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Medicare Enrollment v6.4.0 Deployed to Production',
    message: 'Medicare Enrollment System v6.4.0 has been deployed to production. AEP 2025 enrollment rules and plan benefit updates are now active.',
    timestamp: '2024-12-11T18:00:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'medium',
    category: 'deployment',
    source: 'app_medicare_enrollment',
  },
  {
    id: 'notif_013',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'State Medicaid Compliance Non-Compliant',
    message: 'State Medicaid compliance framework score has dropped to 79.8% (AT_RISK). Eligibility processing, state reporting, and member outreach domains are non-compliant.',
    timestamp: '2024-12-12T07:30:00Z',
    read: false,
    actionUrl: '/reports',
    priority: 'critical',
    category: 'compliance',
    source: 'app_state_reporting',
  },
  {
    id: 'notif_014',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'PCI DSS Compliance Score Critical',
    message: 'PCI DSS compliance framework score is at 72.5% (CRITICAL). Monitoring & Testing and Security Policy domains are non-compliant. Next assessment due 2025-01-25.',
    timestamp: '2024-12-12T07:00:00Z',
    read: false,
    actionUrl: '/reports',
    priority: 'critical',
    category: 'compliance',
    source: 'app_partner_api_gateway',
  },
  {
    id: 'notif_015',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'HEDIS Measure Specification Non-Compliance Finding',
    message: 'Audit finding AF-001: HEDIS measure engine BCS and CDC calculations do not fully align with NCQA MY2024 specifications. Corrective action in progress.',
    timestamp: '2024-12-12T06:30:00Z',
    read: true,
    actionUrl: '/reports',
    priority: 'high',
    category: 'compliance',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_016',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'State B Quarterly Report Data Accuracy Below Threshold',
    message: 'Audit finding AF-005: State B quarterly report has 0.4% enrollment count discrepancy, exceeding the 0.1% tolerance. 182 members with retroactive changes are missing.',
    timestamp: '2024-12-11T14:00:00Z',
    read: true,
    actionUrl: '/reports',
    priority: 'high',
    category: 'compliance',
    source: 'app_state_reporting',
  },
  {
    id: 'notif_017',
    personaId: 'environment_manager',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'QA Hotfix Environment Down',
    message: 'QA Hotfix environment (env_qa_hotfix) is offline due to infrastructure failure. Health score: 0%. Incident ticket INC-2024-1205 has been opened.',
    timestamp: '2024-12-11T22:15:00Z',
    read: false,
    actionUrl: '/settings',
    priority: 'critical',
    category: 'environment',
    source: 'env_qa_hotfix',
  },
  {
    id: 'notif_018',
    personaId: 'environment_manager',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Staging External Environment Under Maintenance',
    message: 'Staging External environment (env_staging_external) is under scheduled maintenance for infrastructure upgrades. Health score: 45.2%. Expected completion: 2024-12-12T18:00Z.',
    timestamp: '2024-12-12T02:00:00Z',
    read: true,
    actionUrl: '/settings',
    priority: 'high',
    category: 'environment',
    source: 'env_staging_external',
  },
  {
    id: 'notif_019',
    personaId: 'environment_manager',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'QA External Environment Health Degraded',
    message: 'QA External environment health score dropped to 72.4%. Vendor Integration service is unhealthy (response time: 950ms). 2 active conflicts detected.',
    timestamp: '2024-12-12T12:15:00Z',
    read: false,
    actionUrl: '/settings',
    priority: 'high',
    category: 'environment',
    source: 'env_qa_04',
  },
  {
    id: 'notif_020',
    personaId: 'environment_manager',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Environment Conflict Detected: Dev 3',
    message: 'Conflict detected in Development 3 environment: Medicaid eligibility rules engine branch conflicts with state reporting data model changes.',
    timestamp: '2024-12-12T12:30:00Z',
    read: false,
    actionUrl: '/settings',
    priority: 'medium',
    category: 'environment',
    source: 'env_dev_03',
  },
  {
    id: 'notif_021',
    personaId: 'performance_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'HEDIS Engine Performance SLA Breach',
    message: 'HEDIS engine full population performance test failed. Processing took 4h 45m, exceeding the 4-hour SLA by 45 minutes. CDC and CBP measures are primary bottlenecks.',
    timestamp: '2024-12-12T06:00:00Z',
    read: false,
    actionUrl: '/analytics',
    priority: 'high',
    category: 'performance',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_022',
    personaId: 'performance_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Data Warehouse Query Performance SLA Failure',
    message: 'HEDIS measure aggregation query completed in 130 seconds, exceeding the 60-second SLA. Missing clustering keys and unoptimized joins identified as root cause.',
    timestamp: '2024-12-12T05:30:00Z',
    read: true,
    actionUrl: '/analytics',
    priority: 'high',
    category: 'performance',
    source: 'app_data_warehouse',
  },
  {
    id: 'notif_023',
    personaId: 'performance_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'API Gateway Rate Limiting Accuracy Issue',
    message: 'API gateway rate limiter allows up to 8.7% excess requests at sliding window boundaries. Response time degraded to 2.3s under sustained load (target: <500ms).',
    timestamp: '2024-12-11T18:30:00Z',
    read: true,
    actionUrl: '/analytics',
    priority: 'high',
    category: 'performance',
    source: 'app_partner_api_gateway',
  },
  {
    id: 'notif_024',
    personaId: 'performance_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'External Data Feed Processing SLA Breach',
    message: 'External data feed processor exceeded the 4-hour SLA for a standard 100MB file. Processing completed in 4h 30m due to single-threaded parsing bottleneck.',
    timestamp: '2024-12-11T19:00:00Z',
    read: true,
    actionUrl: '/analytics',
    priority: 'medium',
    category: 'performance',
    source: 'app_external_data_feed',
  },
  {
    id: 'notif_025',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Quality Gate Pass Rate Below Target',
    message: 'Overall quality gate pass rate is at 62.5%, below the 90% target. 12 out of 32 quality gates have failed status. External and Medicaid segments are primary contributors.',
    timestamp: '2024-12-12T08:00:00Z',
    read: false,
    actionUrl: '/dashboard',
    priority: 'high',
    category: 'governance',
    source: 'eqip_platform',
  },
  {
    id: 'notif_026',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Automated Test Coverage Below Target',
    message: 'Automation coverage is at 83.7%, below the 85% target. 3 applications (Vendor Integration, External Data Feed, State Reporting) are below minimum thresholds.',
    timestamp: '2024-12-12T07:45:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'medium',
    category: 'governance',
    source: 'eqip_platform',
  },
  {
    id: 'notif_027',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Vendor BAA Coverage Below 100%',
    message: 'Adherence metric: Vendor BAA Coverage is at 85.0%, below the 100% target. Not all vendor data exchanges have active Business Associate Agreements in place.',
    timestamp: '2024-12-12T07:15:00Z',
    read: false,
    actionUrl: '/reports',
    priority: 'high',
    category: 'governance',
    source: 'app_vendor_integration',
  },
  {
    id: 'notif_028',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Regulatory Report On-Time Delivery Below Target',
    message: 'Adherence metric: Regulatory Report On-Time Delivery is at 92.5%, below the 100% target. 2 state reporting deadlines were missed in Q3 2024.',
    timestamp: '2024-12-12T06:45:00Z',
    read: true,
    actionUrl: '/reports',
    priority: 'high',
    category: 'governance',
    source: 'app_state_reporting',
  },
  {
    id: 'notif_029',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Care Management Outreach Tracking Non-Compliance',
    message: 'Operating expectation OE-002 non-compliant: Member outreach tracking has 87% field completion rate instead of mandated 100%. Follow-up action field not enforced for non-contact outcomes.',
    timestamp: '2024-12-12T06:15:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'high',
    category: 'governance',
    source: 'app_care_management',
  },
  {
    id: 'notif_030',
    personaId: 'quality_engineer',
    type: NOTIFICATION_TYPES.INFO,
    title: 'New Demand: HEDIS MY2025 Specification Updates',
    message: 'Critical compliance demand dem_002 is in progress: Update all HEDIS measure calculation logic to align with NCQA MY2025 technical specifications. Target date: 2025-02-28.',
    timestamp: '2024-12-11T10:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'high',
    category: 'demand',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_031',
    personaId: 'vendor_partner',
    type: NOTIFICATION_TYPES.INFO,
    title: 'New Demand: API Gateway Performance Optimization',
    message: 'Critical enhancement demand dem_004 is in progress: Optimize API gateway performance to meet 99.9% SLA requirements. Target date: 2025-01-15.',
    timestamp: '2024-12-11T09:30:00Z',
    read: false,
    actionUrl: '/dashboard',
    priority: 'high',
    category: 'demand',
    source: 'app_partner_api_gateway',
  },
  {
    id: 'notif_032',
    personaId: 'avp_qe',
    type: NOTIFICATION_TYPES.INFO,
    title: 'New Demand: State Regulatory Reporting Automation',
    message: 'Critical enhancement demand dem_013 is in progress: Automate state regulatory report generation and submission workflows. Target date: 2025-02-28.',
    timestamp: '2024-12-11T09:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'high',
    category: 'demand',
    source: 'app_state_reporting',
  },
  {
    id: 'notif_033',
    personaId: 'vendor_partner',
    type: NOTIFICATION_TYPES.INFO,
    title: 'New Demand: Vendor BAA Compliance Remediation',
    message: 'Critical compliance demand dem_028 has been approved: Remediate vendor data security non-compliance by implementing encrypted data channels and enforcing BAA agreements. Target date: 2025-01-31.',
    timestamp: '2024-12-11T08:30:00Z',
    read: false,
    actionUrl: '/dashboard',
    priority: 'critical',
    category: 'demand',
    source: 'app_vendor_integration',
  },
  {
    id: 'notif_034',
    personaId: 'avp_qe',
    type: NOTIFICATION_TYPES.INFO,
    title: 'New Demand: State Reporting Data Accuracy Remediation',
    message: 'Critical defect demand dem_034 is in progress: Remediate data accuracy issues in state regulatory reports to achieve less than 0.1% error rate. Target date: 2025-01-31.',
    timestamp: '2024-12-11T08:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'demand',
    source: 'app_state_reporting',
  },
  {
    id: 'notif_035',
    personaId: 'quality_engineer',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Demand Completed: Broker Portal Real-Time Quoting',
    message: 'Demand dem_008 has been completed: Real-time quoting engine for the broker portal is now live. Quality score: 93.7%.',
    timestamp: '2024-12-08T17:00:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'low',
    category: 'demand',
    source: 'app_broker_portal',
  },
  {
    id: 'notif_036',
    personaId: 'automation_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Scheduled Test Failed: HEDIS Engine Full Regression',
    message: 'Nightly HEDIS engine full regression (sched_017) completed with failures. 28 unit tests failed out of 1,600. Coverage at 85.2%.',
    timestamp: '2024-12-12T04:30:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'high',
    category: 'schedule',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_037',
    personaId: 'automation_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Scheduled Test Failed: Medicaid Eligibility Regression',
    message: 'Nightly Medicaid eligibility regression (sched_022) completed with failures. 32 unit tests failed out of 1,200. Income threshold comparison errors detected.',
    timestamp: '2024-12-12T04:00:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'high',
    category: 'schedule',
    source: 'app_medicaid_eligibility',
  },
  {
    id: 'notif_038',
    personaId: 'automation_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Scheduled Test Failed: Vendor Integration Regression',
    message: 'Daily vendor integration regression (sched_032) completed with failures. 32 unit tests failed out of 480. Error recovery alerting not triggering for DLQ items.',
    timestamp: '2024-12-12T04:15:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'high',
    category: 'schedule',
    source: 'app_vendor_integration',
  },
  {
    id: 'notif_039',
    personaId: 'automation_engineer',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Schedule Paused: Provider Network E2E',
    message: 'Provider Network E2E test schedule (sched_039) has been paused pending environment stabilization after recent infrastructure changes.',
    timestamp: '2024-12-11T06:30:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'medium',
    category: 'schedule',
    source: 'app_provider_network',
  },
  {
    id: 'notif_040',
    personaId: 'automation_engineer',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Schedule Disabled: Individual Marketplace Regression',
    message: 'Individual Marketplace regression schedule (sched_040) has been disabled during OEP 2025 deployment freeze. Will be re-enabled after deployment stabilization.',
    timestamp: '2024-11-15T10:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'schedule',
    source: 'app_individual_marketplace',
  },
  {
    id: 'notif_041',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Integration Error: Fieldglass Sync Failed',
    message: 'SAP Fieldglass integration (int_fieldglass) sync failed. Authentication certificate expired for service account EQIP_FG_SVC. 2 consecutive failures.',
    timestamp: '2024-12-12T06:05:00Z',
    read: false,
    actionUrl: '/settings',
    priority: 'high',
    category: 'integration',
    source: 'int_fieldglass',
  },
  {
    id: 'notif_042',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Integration Sync Complete: Azure DevOps',
    message: 'Azure DevOps integration full sync completed successfully. 1,245 records processed including work items, pipelines, and repository data.',
    timestamp: '2024-12-12T14:30:00Z',
    read: true,
    actionUrl: '/settings',
    priority: 'low',
    category: 'integration',
    source: 'int_azure_devops',
  },
  {
    id: 'notif_043',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Integration Sync Complete: qTest',
    message: 'qTest integration full sync completed successfully. 3,420 records processed including test cases, test runs, and defect links.',
    timestamp: '2024-12-12T14:00:00Z',
    read: true,
    actionUrl: '/settings',
    priority: 'low',
    category: 'integration',
    source: 'int_qtest',
  },
  {
    id: 'notif_044',
    personaId: 'test_data_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Test Data Provisioning Failed',
    message: 'Claims Engine subset test data (td_045) provisioning failed due to database connection timeout in Development 1 environment. Partial masking was incomplete.',
    timestamp: '2024-12-11T11:00:00Z',
    read: false,
    actionUrl: '/patients',
    priority: 'high',
    category: 'data',
    source: 'app_claims_engine',
  },
  {
    id: 'notif_045',
    personaId: 'test_data_engineer',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Test Data Stale: Vendor Integration Feed Data',
    message: 'Vendor Integration Feed Test Data (td_029) is stale. Last refreshed on 2024-11-18. Data may not reflect current vendor integration configurations.',
    timestamp: '2024-12-12T08:00:00Z',
    read: false,
    actionUrl: '/patients',
    priority: 'medium',
    category: 'data',
    source: 'app_vendor_integration',
  },
  {
    id: 'notif_046',
    personaId: 'test_data_engineer',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Test Data Stale: State Reporting Submission Data',
    message: 'State Reporting Quarterly Submission Data (td_019) is stale. Last refreshed on 2024-11-28. May not include latest retroactive eligibility changes.',
    timestamp: '2024-12-12T07:30:00Z',
    read: true,
    actionUrl: '/patients',
    priority: 'medium',
    category: 'data',
    source: 'app_state_reporting',
  },
  {
    id: 'notif_047',
    personaId: 'test_data_engineer',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Test Data Stale: External Data Feed CMS Files',
    message: 'External Data Feed CMS Format Test Files (td_030) is stale. Last refreshed on 2024-11-20. 2025 CMS format validation rules may be incomplete.',
    timestamp: '2024-12-12T07:00:00Z',
    read: true,
    actionUrl: '/patients',
    priority: 'medium',
    category: 'data',
    source: 'app_external_data_feed',
  },
  {
    id: 'notif_048',
    personaId: 'test_data_engineer',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Test Data Refreshed: HEDIS Clinical Data',
    message: 'HEDIS Measure Calculation Clinical Data (td_013) has been refreshed with MY2025 measure specification changes and new exclusion criteria data.',
    timestamp: '2024-12-04T08:00:00Z',
    read: true,
    actionUrl: '/patients',
    priority: 'low',
    category: 'data',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_049',
    personaId: 'executive_leadership',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'External Segment Quality Score Critical',
    message: 'External segment quality score is at 72.1% (CRITICAL status). Partner API Gateway and Vendor Integration Hub are the primary contributors to the low score.',
    timestamp: '2024-12-12T09:00:00Z',
    read: false,
    actionUrl: '/dashboard',
    priority: 'critical',
    category: 'quality_gate',
    source: 'eqip_platform',
  },
  {
    id: 'notif_050',
    personaId: 'executive_leadership',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Medicaid Segment At Risk',
    message: 'Medicaid segment quality score is at 78.4% (AT_RISK status). Eligibility engine, state reporting, and care management applications have failing quality gates.',
    timestamp: '2024-12-12T08:45:00Z',
    read: false,
    actionUrl: '/dashboard',
    priority: 'high',
    category: 'quality_gate',
    source: 'eqip_platform',
  },
  {
    id: 'notif_051',
    personaId: 'segment_leader',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Star Ratings v3.2.0 Quality Gate Passed',
    message: 'Quality gate for Star Ratings Analytics v3.2.0 has passed. All criteria met including CMS methodology alignment at 100%. Quality score: 90.8%.',
    timestamp: '2024-12-07T12:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'quality_gate',
    source: 'app_star_ratings',
  },
  {
    id: 'notif_052',
    personaId: 'segment_leader',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Part D Formulary v2.5.0 Quality Gate Passed',
    message: 'Quality gate for Part D Formulary Manager v2.5.0 has passed. CMS file format compliance at 100%. Quality score: 92.4%.',
    timestamp: '2024-12-03T14:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'quality_gate',
    source: 'app_part_d_formulary',
  },
  {
    id: 'notif_053',
    personaId: 'accessibility_engineer',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Accessibility Test Failed: Claims History Screen Reader',
    message: 'Member portal screen reader compatibility test (tc_005) failed. Expanded claim detail content not announced and status badges lack text alternatives.',
    timestamp: '2024-12-11T14:40:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'high',
    category: 'test_failure',
    source: 'app_member_portal',
  },
  {
    id: 'notif_054',
    personaId: 'accessibility_engineer',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Accessibility Test Passed: Keyboard Navigation',
    message: 'Member portal WCAG 2.1 AA keyboard navigation test (tc_004) passed. All interactive elements are keyboard accessible with visible focus indicators.',
    timestamp: '2024-12-11T13:15:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'test_failure',
    source: 'app_member_portal',
  },
  {
    id: 'notif_055',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Quality Gate Waiver Expiring: Member Portal Accessibility',
    message: 'Waiver wv_001 for Member Portal v3.8.0 accessibility compliance gate expires on 2025-01-15. Remediation of WCAG 2.1 AA findings must be completed before expiration.',
    timestamp: '2024-12-12T10:00:00Z',
    read: false,
    actionUrl: '/measures',
    priority: 'medium',
    category: 'quality_gate',
    source: 'app_member_portal',
  },
  {
    id: 'notif_056',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Quality Gate Waiver Expiring: API Gateway Code Coverage',
    message: 'Waiver wv_003 for Partner API Gateway v1.7.0 code coverage gate expires on 2025-02-28. Coverage improvement must be completed as part of TLS 1.3 migration.',
    timestamp: '2024-12-12T09:30:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'medium',
    category: 'quality_gate',
    source: 'app_partner_api_gateway',
  },
  {
    id: 'notif_057',
    personaId: 'production_support',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'Production Vendor Integration Service Degraded',
    message: 'Vendor Integration service in Production US-East is degraded with response time of 280ms. All other production services are healthy. Overall health score: 99.4%.',
    timestamp: '2024-12-12T14:55:00Z',
    read: false,
    actionUrl: '/dashboard',
    priority: 'medium',
    category: 'environment',
    source: 'env_prod_01',
  },
  {
    id: 'notif_058',
    personaId: 'scrum_master',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Demand Completed: Group Enrollment Self-Service Portal',
    message: 'Demand dem_023 has been completed: Self-service enrollment portal for small group employers is now live. Quality score: 90.5%.',
    timestamp: '2024-12-09T17:00:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'low',
    category: 'demand',
    source: 'app_group_enrollment',
  },
  {
    id: 'notif_059',
    personaId: 'release_manager',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Auth Service v5.3.0 Quality Gate Passed',
    message: 'Quality gate for Authentication Service v5.3.0 has passed with all criteria met. Penetration test and token lifecycle validation both at 100%. Quality score: 98.1%.',
    timestamp: '2024-12-05T12:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'quality_gate',
    source: 'app_auth_service',
  },
  {
    id: 'notif_060',
    personaId: 'release_manager',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Quality Gate Failed: State Reporting v2.3.0',
    message: 'Quality gate for State Reporting v2.3.0 has failed. Data accuracy validation at 98.2% (required: 99.9%), reporting deadline compliance at 85.0% (required: 100%), and 1 critical defect.',
    timestamp: '2024-11-28T16:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'critical',
    category: 'quality_gate',
    source: 'app_state_reporting',
  },
  {
    id: 'notif_061',
    personaId: 'developer',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Provider Directory v2.14.0 Quality Gate Passed',
    message: 'Quality gate for Provider Directory Service v2.14.0 has passed. All criteria met with zero critical defects. Geo-spatial search feature is ready for production.',
    timestamp: '2024-12-08T14:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'quality_gate',
    source: 'app_provider_directory',
  },
  {
    id: 'notif_062',
    personaId: 'developer',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Claims Engine Nightly Regression Passed',
    message: 'Claims engine nightly regression suite (sched_001) completed successfully. All 2,756 unit tests passed with 91.4% code coverage.',
    timestamp: '2024-12-12T03:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'schedule',
    source: 'app_claims_engine',
  },
  {
    id: 'notif_063',
    personaId: 'product_owner',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Star Ratings Predictive Analytics Demand Approved',
    message: 'Demand dem_006 has been approved: Develop predictive analytics module for Star Ratings forecasting. Estimated effort: 21 story points. Target date: 2025-03-31.',
    timestamp: '2024-12-10T11:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'medium',
    category: 'demand',
    source: 'app_star_ratings',
  },
  {
    id: 'notif_064',
    personaId: 'product_owner',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Demand Completed: Medicare Enrollment AEP 2025 Rules',
    message: 'Demand dem_014 has been completed: CMS-mandated enrollment rules and plan benefit updates for AEP 2025 are now live. Quality score: 91.8%.',
    timestamp: '2024-12-11T18:30:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'low',
    category: 'demand',
    source: 'app_medicare_enrollment',
  },
  {
    id: 'notif_065',
    personaId: 'application_owner',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Member Portal v3.8.0 All Tests Passed',
    message: 'Member Portal v3.8.0 release: 3,050 tests passed, 8 failed, 122 skipped. Quality score: 96.5%. New dashboard redesign validated successfully.',
    timestamp: '2024-12-12T09:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'deployment',
    source: 'app_member_portal',
  },
  {
    id: 'notif_066',
    personaId: 'sdet',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Claims E2E Smoke Tests Passed',
    message: 'Daily claims E2E smoke tests (sched_003) completed successfully in staging environment. All critical claim submission and adjudication paths verified.',
    timestamp: '2024-12-12T06:30:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'schedule',
    source: 'app_claims_engine',
  },
  {
    id: 'notif_067',
    personaId: 'sdet',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Wellness Platform E2E Tests Passed',
    message: 'Daily wellness platform E2E tests (sched_029) completed successfully. Gamification badges, rewards, and wellness challenge workflows all verified.',
    timestamp: '2024-12-12T06:45:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'schedule',
    source: 'app_wellness_platform',
  },
  {
    id: 'notif_068',
    personaId: 'program_manager',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Medicaid Eligibility Rules Engine Refactor In Analysis',
    message: 'Demand dem_005 is in analysis phase: Refactor Medicaid eligibility rules engine for multi-state configuration. Estimated effort: 34 story points. Target date: 2025-04-30.',
    timestamp: '2024-12-11T14:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'medium',
    category: 'demand',
    source: 'app_medicaid_eligibility',
  },
  {
    id: 'notif_069',
    personaId: 'qe_manager',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Compliance Dashboard v1.6.0 Quality Gate Passed',
    message: 'Quality gate for Compliance Dashboard v1.6.0 has passed with all criteria met. Data refresh SLA at 100%. Quality score: 97.2%.',
    timestamp: '2024-12-09T14:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'low',
    category: 'quality_gate',
    source: 'app_compliance_dashboard',
  },
  {
    id: 'notif_070',
    personaId: 'qe_manager',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Care Management v2.8.0 Quality Gate Failed',
    message: 'Quality gate for Care Management v2.8.0 has failed. Outreach tracking compliance at 87.0% (required: 100%) and 1 critical defect related to follow-up action validation.',
    timestamp: '2024-12-06T16:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'high',
    category: 'quality_gate',
    source: 'app_care_management',
  },
  {
    id: 'notif_071',
    personaId: 'read_only_user',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Weekly Quality Summary Available',
    message: 'Weekly quality summary for the week of December 9-12, 2024 is now available. Overall quality score: 88.2% (improving). 15 applications on track, 5 at risk, 2 critical.',
    timestamp: '2024-12-12T15:00:00Z',
    read: false,
    actionUrl: '/dashboard',
    priority: 'low',
    category: 'governance',
    source: 'eqip_platform',
  },
  {
    id: 'notif_072',
    personaId: 'executive_leadership',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Compliance Segment Performing Well',
    message: 'Compliance segment quality score is at 93.2% (ON_TRACK). All 4 compliance applications have passed quality gates with 100% release readiness.',
    timestamp: '2024-12-12T09:30:00Z',
    read: true,
    actionUrl: '/dashboard',
    priority: 'low',
    category: 'quality_gate',
    source: 'eqip_platform',
  },
  {
    id: 'notif_073',
    personaId: 'performance_engineer',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Notification Hub Batch Delivery Performance Passed',
    message: 'Notification hub batch delivery test passed. 50,000 notifications processed in 23 minutes within the 30-minute SLA. Zero duplicates detected.',
    timestamp: '2024-12-08T22:30:00Z',
    read: true,
    actionUrl: '/analytics',
    priority: 'low',
    category: 'performance',
    source: 'app_notification_hub',
  },
  {
    id: 'notif_074',
    personaId: 'performance_engineer',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Claims Batch Performance Within SLA',
    message: 'Claims batch processing performance test passed. 10,000 claims processed in 28 minutes 15 seconds, within the 30-minute SLA. Throughput: 354 claims/minute.',
    timestamp: '2024-12-08T22:30:00Z',
    read: true,
    actionUrl: '/analytics',
    priority: 'low',
    category: 'performance',
    source: 'app_claims_engine',
  },
  {
    id: 'notif_075',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'SOC 2 Type II Annual Audit Passed',
    message: 'Annual SOC 2 Type II audit completed successfully for the authentication service. All trust service criteria met with no exceptions noted.',
    timestamp: '2024-10-15T16:00:00Z',
    read: true,
    actionUrl: '/reports',
    priority: 'low',
    category: 'compliance',
    source: 'app_auth_service',
  },
  {
    id: 'notif_076',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'Disaster Recovery Test Q4 2024 Passed',
    message: 'Quarterly disaster recovery test completed successfully. Failover to US-West DR environment completed within RTO of 4 hours. Zero data loss confirmed.',
    timestamp: '2024-10-20T18:00:00Z',
    read: true,
    actionUrl: '/reports',
    priority: 'low',
    category: 'compliance',
    source: 'app_claims_engine',
  },
  {
    id: 'notif_077',
    personaId: 'auditor',
    type: NOTIFICATION_TYPES.SUCCESS,
    title: 'HIPAA PHI Encryption Audit Passed',
    message: 'Annual HIPAA PHI encryption audit confirmed all PHI data in the claims engine is encrypted at rest using AES-256 with proper key management and rotation.',
    timestamp: '2024-11-15T16:00:00Z',
    read: true,
    actionUrl: '/reports',
    priority: 'low',
    category: 'compliance',
    source: 'app_claims_engine',
  },
  {
    id: 'notif_078',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.WARNING,
    title: 'HEDIS Supplemental Data Linkage Below Threshold',
    message: 'Audit finding AF-014: HEDIS supplemental data linkage rate of 94.2% is below the 98% threshold. 2,340 records cannot be linked due to missing crosswalk entries.',
    timestamp: '2024-12-03T12:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'high',
    category: 'compliance',
    source: 'app_hedis_engine',
  },
  {
    id: 'notif_079',
    personaId: 'avp_qe',
    type: NOTIFICATION_TYPES.ERROR,
    title: 'Medicaid Redetermination Batch Processing Failures',
    message: 'Audit finding AF-015: 23 out of 12,450 redetermination records failed with null pointer exceptions when processing members with null income data from Medicaid unwinding.',
    timestamp: '2024-11-30T14:00:00Z',
    read: true,
    actionUrl: '/measures',
    priority: 'high',
    category: 'compliance',
    source: 'app_medicaid_eligibility',
  },
  {
    id: 'notif_080',
    personaId: 'quality_director',
    type: NOTIFICATION_TYPES.INFO,
    title: 'Code Review Standards Under Review',
    message: 'Governance procedure proc_018 (Code Review Standards v3.3.0-draft) is under review. Next review date: 2025-01-15. Updates include security review triggers and approval criteria.',
    timestamp: '2024-12-10T10:00:00Z',
    read: true,
    actionUrl: '/reports',
    priority: 'low',
    category: 'governance',
    source: 'eqip_platform',
  },
];

/**
 * Returns all available notifications.
 *
 * @returns {Notification[]} Array of all notification objects
 */
export function getAllNotifications() {
  return [...notifications];
}

/**
 * Retrieves a single notification by its unique ID.
 *
 * @param {string} notificationId - The notification identifier to look up
 * @returns {Notification|null} The matching notification object, or null if not found
 */
export function getNotificationById(notificationId) {
  if (!notificationId || typeof notificationId !== 'string') {
    return null;
  }
  return notifications.find((n) => n.id === notificationId) || null;
}

/**
 * Returns all notifications for a specific persona.
 *
 * @param {string} personaId - The persona ID to filter by
 * @returns {Notification[]} Array of notifications for the specified persona
 */
export function getNotificationsByPersona(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return [];
  }
  return notifications.filter((n) => n.personaId === personaId);
}

/**
 * Returns all notifications filtered by type.
 *
 * @param {string} type - The notification type to filter by (e.g. 'success', 'warning', 'error', 'info')
 * @returns {Notification[]} Array of notifications matching the specified type
 */
export function getNotificationsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return notifications.filter((n) => n.type === type);
}

/**
 * Returns all notifications filtered by priority.
 *
 * @param {string} priority - The priority to filter by (e.g. 'critical', 'high', 'medium', 'low')
 * @returns {Notification[]} Array of notifications matching the specified priority
 */
export function getNotificationsByPriority(priority) {
  if (!priority || typeof priority !== 'string') {
    return [];
  }
  return notifications.filter((n) => n.priority === priority);
}

/**
 * Returns all notifications filtered by category.
 *
 * @param {string} category - The category to filter by (e.g. 'quality_gate', 'test_failure', 'deployment', 'compliance', 'environment', 'security', 'performance', 'governance', 'demand', 'schedule', 'integration', 'data')
 * @returns {Notification[]} Array of notifications matching the specified category
 */
export function getNotificationsByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  return notifications.filter((n) => n.category === category);
}

/**
 * Returns all notifications filtered by read status.
 *
 * @param {boolean} read - The read status to filter by
 * @returns {Notification[]} Array of notifications matching the specified read status
 */
export function getNotificationsByReadStatus(read) {
  if (typeof read !== 'boolean') {
    return [];
  }
  return notifications.filter((n) => n.read === read);
}

/**
 * Returns all unread notifications for a specific persona.
 *
 * @param {string} personaId - The persona ID to filter by
 * @returns {Notification[]} Array of unread notifications for the specified persona
 */
export function getUnreadNotificationsByPersona(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return [];
  }
  return notifications.filter((n) => n.personaId === personaId && !n.read);
}

/**
 * Returns all notifications filtered by source.
 *
 * @param {string} source - The source system or application to filter by
 * @returns {Notification[]} Array of notifications from the specified source
 */
export function getNotificationsBySource(source) {
  if (!source || typeof source !== 'string') {
    return [];
  }
  return notifications.filter((n) => n.source === source);
}

/**
 * Returns aggregate statistics across all notifications.
 *
 * @returns {{ totalNotifications: number, unreadCount: number, readCount: number, typeBreakdown: Object<string, number>, priorityBreakdown: Object<string, number>, categoryBreakdown: Object<string, number>, personaBreakdown: Object<string, number> }} Aggregate notification statistics
 */
export function getNotificationAggregates() {
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const typeBreakdown = notifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  const priorityBreakdown = notifications.reduce((acc, n) => {
    acc[n.priority] = (acc[n.priority] || 0) + 1;
    return acc;
  }, {});

  const categoryBreakdown = notifications.reduce((acc, n) => {
    acc[n.category] = (acc[n.category] || 0) + 1;
    return acc;
  }, {});

  const personaBreakdown = notifications.reduce((acc, n) => {
    acc[n.personaId] = (acc[n.personaId] || 0) + 1;
    return acc;
  }, {});

  return {
    totalNotifications,
    unreadCount,
    readCount,
    typeBreakdown,
    priorityBreakdown,
    categoryBreakdown,
    personaBreakdown,
  };
}

/**
 * Returns all unique notification categories.
 *
 * @returns {string[]} Array of unique notification categories sorted alphabetically
 */
export function getAllNotificationCategories() {
  const categories = new Set(notifications.map((n) => n.category));
  return [...categories].sort();
}

/**
 * Returns all unique notification priorities.
 *
 * @returns {string[]} Array of unique notification priorities
 */
export function getAllNotificationPriorities() {
  return ['critical', 'high', 'medium', 'low'];
}

/**
 * Returns all unique notification sources.
 *
 * @returns {string[]} Array of unique notification sources sorted alphabetically
 */
export function getAllNotificationSources() {
  const sources = new Set(notifications.map((n) => n.source));
  return [...sources].sort();
}

/**
 * Returns all unique persona IDs that have notifications.
 *
 * @returns {string[]} Array of unique persona IDs sorted alphabetically
 */
export function getAllNotificationPersonas() {
  const personas = new Set(notifications.map((n) => n.personaId));
  return [...personas].sort();
}

export default notifications;