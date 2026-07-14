import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} DemandAnalytics
 * @property {number} complexityScore - Complexity score (1-10)
 * @property {number} businessValue - Business value score (1-10)
 * @property {number} riskScore - Risk score (1-10)
 * @property {number} estimatedROI - Estimated ROI percentage
 * @property {string[]} impactedMeasures - Array of impacted measure identifiers
 * @property {string[]} dependencies - Array of dependency demand IDs
 */

/**
 * @typedef {Object} Demand
 * @property {string} id - Unique demand identifier
 * @property {string} title - Display title of the demand
 * @property {string} type - Demand type (feature, enhancement, defect, compliance, infrastructure, integration)
 * @property {string} priority - Priority level (critical, high, medium, low)
 * @property {string} status - Current status (intake, analysis, approved, in_progress, completed, deferred, rejected)
 * @property {string} requestor - Name of the person who requested the demand
 * @property {string} segment - Organizational segment
 * @property {string} application - Application ID this demand relates to
 * @property {number} estimatedEffort - Estimated effort in story points
 * @property {string} assignee - Name of the assigned person
 * @property {string} approver - Name of the approver
 * @property {string} intakeDate - Intake date in ISO format
 * @property {string} targetDate - Target completion date in ISO format
 * @property {string} description - Detailed description of the demand
 * @property {DemandAnalytics} analytics - Analytics and scoring data
 */

/**
 * Mock demand data for the EQIP Quality Platform.
 * Contains demand item objects representing work requests across organizational segments
 * with priority, status, effort estimates, and analytics fields.
 *
 * @type {Demand[]}
 */
const demands = [
  {
    id: 'dem_001',
    title: 'Real-Time Claims Status Dashboard',
    type: 'feature',
    priority: 'high',
    status: 'in_progress',
    requestor: 'Jennifer Williams',
    segment: 'Enterprise',
    application: 'app_claims_engine',
    estimatedEffort: 21,
    assignee: 'Chris Anderson',
    approver: 'Jennifer Williams',
    intakeDate: '2024-10-15',
    targetDate: '2025-01-31',
    description: 'Build a real-time claims status dashboard providing end-to-end visibility into claim lifecycle stages, adjudication outcomes, and processing bottlenecks.',
    analytics: {
      complexityScore: 7,
      businessValue: 9,
      riskScore: 4,
      estimatedROI: 35,
      impactedMeasures: ['claims_turnaround', 'claims_accuracy'],
      dependencies: [],
    },
  },
  {
    id: 'dem_002',
    title: 'HEDIS MY2025 Measure Specification Updates',
    type: 'compliance',
    priority: 'critical',
    status: 'in_progress',
    requestor: 'Patricia Evans',
    segment: 'Medicare',
    application: 'app_hedis_engine',
    estimatedEffort: 34,
    assignee: 'Lisa Johnson',
    approver: 'Angela Martinez',
    intakeDate: '2024-09-01',
    targetDate: '2025-02-28',
    description: 'Update all HEDIS measure calculation logic to align with NCQA MY2025 technical specifications including new value sets, updated exclusion criteria, and revised measure definitions.',
    analytics: {
      complexityScore: 9,
      businessValue: 10,
      riskScore: 8,
      estimatedROI: 50,
      impactedMeasures: ['hedis_bcs', 'hedis_ccs', 'hedis_cdc', 'hedis_cbp'],
      dependencies: ['dem_010'],
    },
  },
  {
    id: 'dem_003',
    title: 'Member Portal Accessibility Remediation',
    type: 'compliance',
    priority: 'high',
    status: 'approved',
    requestor: 'Omar Hassan',
    segment: 'Enterprise',
    application: 'app_member_portal',
    estimatedEffort: 13,
    assignee: 'Omar Hassan',
    approver: 'Rachel Nguyen',
    intakeDate: '2024-11-01',
    targetDate: '2025-03-15',
    description: 'Remediate WCAG 2.1 AA accessibility findings from the latest audit including keyboard navigation improvements, screen reader compatibility, and color contrast adjustments.',
    analytics: {
      complexityScore: 5,
      businessValue: 8,
      riskScore: 3,
      estimatedROI: 20,
      impactedMeasures: ['accessibility_score', 'member_satisfaction'],
      dependencies: [],
    },
  },
  {
    id: 'dem_004',
    title: 'API Gateway Performance Optimization',
    type: 'enhancement',
    priority: 'critical',
    status: 'in_progress',
    requestor: 'Alex Rivera',
    segment: 'External',
    application: 'app_partner_api_gateway',
    estimatedEffort: 21,
    assignee: 'Marcus Thompson',
    approver: 'Jennifer Williams',
    intakeDate: '2024-10-20',
    targetDate: '2025-01-15',
    description: 'Optimize API gateway performance to meet 99.9% SLA requirements including connection pooling improvements, caching layer enhancements, and load balancer configuration tuning.',
    analytics: {
      complexityScore: 8,
      businessValue: 9,
      riskScore: 7,
      estimatedROI: 40,
      impactedMeasures: ['api_availability', 'api_response_time'],
      dependencies: ['dem_012'],
    },
  },
  {
    id: 'dem_005',
    title: 'Medicaid Eligibility Rules Engine Refactor',
    type: 'enhancement',
    priority: 'high',
    status: 'analysis',
    requestor: 'David Park',
    segment: 'Medicaid',
    application: 'app_medicaid_eligibility',
    estimatedEffort: 34,
    assignee: 'Robert Kim',
    approver: 'David Park',
    intakeDate: '2024-11-10',
    targetDate: '2025-04-30',
    description: 'Refactor the Medicaid eligibility rules engine to support multi-state configuration, improve rule versioning, and reduce eligibility determination processing time by 40%.',
    analytics: {
      complexityScore: 9,
      businessValue: 8,
      riskScore: 7,
      estimatedROI: 30,
      impactedMeasures: ['eligibility_accuracy', 'processing_time'],
      dependencies: [],
    },
  },
  {
    id: 'dem_006',
    title: 'Star Ratings Predictive Analytics Module',
    type: 'feature',
    priority: 'high',
    status: 'approved',
    requestor: 'Emily Davis',
    segment: 'Medicare',
    application: 'app_star_ratings',
    estimatedEffort: 21,
    assignee: 'Samantha Clark',
    approver: 'Michael Torres',
    intakeDate: '2024-10-05',
    targetDate: '2025-03-31',
    description: 'Develop a predictive analytics module that forecasts Star Ratings outcomes based on current measure performance trends, enabling proactive intervention planning.',
    analytics: {
      complexityScore: 8,
      businessValue: 10,
      riskScore: 5,
      estimatedROI: 55,
      impactedMeasures: ['star_overall', 'star_part_c', 'star_part_d'],
      dependencies: ['dem_002'],
    },
  },
  {
    id: 'dem_007',
    title: 'Vendor Data Feed Error Recovery Automation',
    type: 'enhancement',
    priority: 'critical',
    status: 'in_progress',
    requestor: 'James Wright',
    segment: 'External',
    application: 'app_vendor_integration',
    estimatedEffort: 13,
    assignee: 'James Wright',
    approver: 'Alex Rivera',
    intakeDate: '2024-11-05',
    targetDate: '2025-01-31',
    description: 'Implement automated error recovery mechanisms for vendor data feeds including retry logic, dead letter queue processing, and automated alerting for persistent failures.',
    analytics: {
      complexityScore: 6,
      businessValue: 8,
      riskScore: 6,
      estimatedROI: 25,
      impactedMeasures: ['data_feed_reliability', 'vendor_sla_compliance'],
      dependencies: [],
    },
  },
  {
    id: 'dem_008',
    title: 'Broker Portal Real-Time Quoting Engine',
    type: 'feature',
    priority: 'medium',
    status: 'completed',
    requestor: 'Kevin Brown',
    segment: 'Commercial',
    application: 'app_broker_portal',
    estimatedEffort: 21,
    assignee: 'Priya Patel',
    approver: 'Kevin Brown',
    intakeDate: '2024-08-15',
    targetDate: '2024-12-08',
    description: 'Build a real-time quoting engine for the broker portal enabling instant premium calculations, plan comparisons, and proposal generation for group enrollment.',
    analytics: {
      complexityScore: 7,
      businessValue: 9,
      riskScore: 4,
      estimatedROI: 45,
      impactedMeasures: ['broker_satisfaction', 'quote_turnaround'],
      dependencies: [],
    },
  },
  {
    id: 'dem_009',
    title: 'Care Management Automated Outreach Scheduling',
    type: 'feature',
    priority: 'medium',
    status: 'completed',
    requestor: 'Amanda Garcia',
    segment: 'Medicaid',
    application: 'app_care_management',
    estimatedEffort: 13,
    assignee: 'Lisa Johnson',
    approver: 'David Park',
    intakeDate: '2024-09-10',
    targetDate: '2024-12-06',
    description: 'Implement automated member outreach scheduling based on care gap priority, member preferences, and care coordinator availability.',
    analytics: {
      complexityScore: 6,
      businessValue: 8,
      riskScore: 3,
      estimatedROI: 30,
      impactedMeasures: ['member_outreach_rate', 'gap_closure_rate'],
      dependencies: [],
    },
  },
  {
    id: 'dem_010',
    title: 'Data Warehouse HEDIS Data Model Expansion',
    type: 'enhancement',
    priority: 'high',
    status: 'completed',
    requestor: 'Samantha Clark',
    segment: 'Enterprise',
    application: 'app_data_warehouse',
    estimatedEffort: 21,
    assignee: 'Samantha Clark',
    approver: 'Jennifer Williams',
    intakeDate: '2024-08-01',
    targetDate: '2024-12-06',
    description: 'Expand the enterprise data warehouse HEDIS data models to support MY2025 measure specifications, new supplemental data sources, and improved data lineage tracking.',
    analytics: {
      complexityScore: 7,
      businessValue: 9,
      riskScore: 5,
      estimatedROI: 35,
      impactedMeasures: ['data_completeness', 'hedis_data_quality'],
      dependencies: [],
    },
  },
  {
    id: 'dem_011',
    title: 'Authentication Service Passkey Support',
    type: 'feature',
    priority: 'medium',
    status: 'completed',
    requestor: 'Natalie White',
    segment: 'Enterprise',
    application: 'app_auth_service',
    estimatedEffort: 13,
    assignee: 'Chris Anderson',
    approver: 'Natalie White',
    intakeDate: '2024-09-15',
    targetDate: '2024-12-05',
    description: 'Add FIDO2/WebAuthn passkey support to the authentication service enabling passwordless login for all platform applications.',
    analytics: {
      complexityScore: 7,
      businessValue: 7,
      riskScore: 5,
      estimatedROI: 20,
      impactedMeasures: ['auth_security_score', 'login_success_rate'],
      dependencies: [],
    },
  },
  {
    id: 'dem_012',
    title: 'API Gateway TLS 1.3 Migration',
    type: 'infrastructure',
    priority: 'high',
    status: 'approved',
    requestor: 'Natalie White',
    segment: 'External',
    application: 'app_partner_api_gateway',
    estimatedEffort: 8,
    assignee: 'Daniel Robinson',
    approver: 'Natalie White',
    intakeDate: '2024-11-15',
    targetDate: '2025-02-15',
    description: 'Migrate all API gateway endpoints from TLS 1.2 to TLS 1.3 to meet updated security compliance requirements and improve connection performance.',
    analytics: {
      complexityScore: 5,
      businessValue: 7,
      riskScore: 6,
      estimatedROI: 15,
      impactedMeasures: ['security_compliance', 'api_performance'],
      dependencies: [],
    },
  },
  {
    id: 'dem_013',
    title: 'State Regulatory Reporting Automation',
    type: 'enhancement',
    priority: 'critical',
    status: 'in_progress',
    requestor: 'Patricia Evans',
    segment: 'Medicaid',
    application: 'app_state_reporting',
    estimatedEffort: 21,
    assignee: 'Robert Kim',
    approver: 'Patricia Evans',
    intakeDate: '2024-10-01',
    targetDate: '2025-02-28',
    description: 'Automate state regulatory report generation and submission workflows to eliminate manual processing, reduce errors, and ensure on-time delivery across all contracted states.',
    analytics: {
      complexityScore: 8,
      businessValue: 10,
      riskScore: 7,
      estimatedROI: 45,
      impactedMeasures: ['reporting_timeliness', 'reporting_accuracy'],
      dependencies: [],
    },
  },
  {
    id: 'dem_014',
    title: 'Medicare Enrollment AEP 2025 Rules Update',
    type: 'compliance',
    priority: 'critical',
    status: 'completed',
    requestor: 'Michael Torres',
    segment: 'Medicare',
    application: 'app_medicare_enrollment',
    estimatedEffort: 21,
    assignee: 'Lisa Johnson',
    approver: 'Michael Torres',
    intakeDate: '2024-07-15',
    targetDate: '2024-12-11',
    description: 'Implement CMS-mandated enrollment rules and plan benefit updates for the Annual Enrollment Period 2025 including new plan options, updated eligibility criteria, and revised transaction formats.',
    analytics: {
      complexityScore: 8,
      businessValue: 10,
      riskScore: 6,
      estimatedROI: 40,
      impactedMeasures: ['enrollment_accuracy', 'aep_readiness'],
      dependencies: [],
    },
  },
  {
    id: 'dem_015',
    title: 'Compliance Dashboard Risk Heat Map',
    type: 'feature',
    priority: 'medium',
    status: 'completed',
    requestor: 'Angela Martinez',
    segment: 'Compliance',
    application: 'app_compliance_dashboard',
    estimatedEffort: 8,
    assignee: 'Priya Patel',
    approver: 'Angela Martinez',
    intakeDate: '2024-10-01',
    targetDate: '2024-12-09',
    description: 'Add an interactive risk heat map visualization to the compliance dashboard showing risk distribution across segments, applications, and compliance categories.',
    analytics: {
      complexityScore: 5,
      businessValue: 7,
      riskScore: 2,
      estimatedROI: 20,
      impactedMeasures: ['compliance_visibility', 'risk_awareness'],
      dependencies: [],
    },
  },
  {
    id: 'dem_016',
    title: 'Wellness Platform Gamification Features',
    type: 'feature',
    priority: 'low',
    status: 'completed',
    requestor: 'Amanda Garcia',
    segment: 'Commercial',
    application: 'app_wellness_platform',
    estimatedEffort: 13,
    assignee: 'Chris Anderson',
    approver: 'Amanda Garcia',
    intakeDate: '2024-09-20',
    targetDate: '2024-12-11',
    description: 'Implement gamification features including achievement badges, leaderboards, social wellness challenges, and reward point tracking to increase member engagement.',
    analytics: {
      complexityScore: 5,
      businessValue: 7,
      riskScore: 2,
      estimatedROI: 25,
      impactedMeasures: ['member_engagement', 'wellness_participation'],
      dependencies: [],
    },
  },
  {
    id: 'dem_017',
    title: 'Provider Directory Geo-Spatial Search',
    type: 'feature',
    priority: 'medium',
    status: 'completed',
    requestor: 'Chris Anderson',
    segment: 'Enterprise',
    application: 'app_provider_directory',
    estimatedEffort: 13,
    assignee: 'Chris Anderson',
    approver: 'Jennifer Williams',
    intakeDate: '2024-09-05',
    targetDate: '2024-12-08',
    description: 'Enhance provider search with geo-spatial filtering capabilities including radius-based search, drive time calculations, and specialty matching with location awareness.',
    analytics: {
      complexityScore: 6,
      businessValue: 8,
      riskScore: 3,
      estimatedROI: 30,
      impactedMeasures: ['provider_search_accuracy', 'member_satisfaction'],
      dependencies: [],
    },
  },
  {
    id: 'dem_018',
    title: 'Underwriting Risk Model 2025 Update',
    type: 'enhancement',
    priority: 'medium',
    status: 'completed',
    requestor: 'Thomas Lee',
    segment: 'Commercial',
    application: 'app_underwriting_engine',
    estimatedEffort: 13,
    assignee: 'Priya Patel',
    approver: 'Thomas Lee',
    intakeDate: '2024-09-01',
    targetDate: '2024-12-04',
    description: 'Update underwriting risk models for the 2025 plan year incorporating updated actuarial tables, revised risk factors, and new automated approval thresholds.',
    analytics: {
      complexityScore: 7,
      businessValue: 8,
      riskScore: 4,
      estimatedROI: 35,
      impactedMeasures: ['underwriting_accuracy', 'loss_ratio'],
      dependencies: [],
    },
  },
  {
    id: 'dem_019',
    title: 'Notification Hub Preference Center',
    type: 'feature',
    priority: 'low',
    status: 'completed',
    requestor: 'James Wright',
    segment: 'Enterprise',
    application: 'app_notification_hub',
    estimatedEffort: 8,
    assignee: 'James Wright',
    approver: 'Jennifer Williams',
    intakeDate: '2024-10-10',
    targetDate: '2024-12-09',
    description: 'Build a member-facing notification preference center allowing users to manage notification channels, frequency, and topic subscriptions across all communication types.',
    analytics: {
      complexityScore: 4,
      businessValue: 6,
      riskScore: 2,
      estimatedROI: 15,
      impactedMeasures: ['notification_opt_in_rate', 'member_satisfaction'],
      dependencies: [],
    },
  },
  {
    id: 'dem_020',
    title: 'Part D Formulary 2025 Plan Year Update',
    type: 'compliance',
    priority: 'high',
    status: 'completed',
    requestor: 'Thomas Lee',
    segment: 'Medicare',
    application: 'app_part_d_formulary',
    estimatedEffort: 13,
    assignee: 'Lisa Johnson',
    approver: 'Michael Torres',
    intakeDate: '2024-08-20',
    targetDate: '2024-12-03',
    description: 'Update the Part D formulary for the 2025 plan year including new drug tier assignments, prior authorization criteria updates, and CMS formulary file submission compliance.',
    analytics: {
      complexityScore: 6,
      businessValue: 9,
      riskScore: 5,
      estimatedROI: 30,
      impactedMeasures: ['formulary_compliance', 'member_drug_access'],
      dependencies: [],
    },
  },
  {
    id: 'dem_021',
    title: 'External Data Feed CMS Format Support',
    type: 'enhancement',
    priority: 'medium',
    status: 'completed',
    requestor: 'James Wright',
    segment: 'External',
    application: 'app_external_data_feed',
    estimatedEffort: 8,
    assignee: 'James Wright',
    approver: 'Alex Rivera',
    intakeDate: '2024-09-25',
    targetDate: '2024-11-20',
    description: 'Add support for new CMS data feed formats including updated file layouts, validation rules, and error recovery mechanisms for failed file processing.',
    analytics: {
      complexityScore: 5,
      businessValue: 7,
      riskScore: 4,
      estimatedROI: 20,
      impactedMeasures: ['data_feed_compliance', 'processing_reliability'],
      dependencies: [],
    },
  },
  {
    id: 'dem_022',
    title: 'Audit Tracker Automated Scheduling',
    type: 'feature',
    priority: 'low',
    status: 'completed',
    requestor: 'Patricia Evans',
    segment: 'Compliance',
    application: 'app_audit_tracker',
    estimatedEffort: 8,
    assignee: 'Priya Patel',
    approver: 'Patricia Evans',
    intakeDate: '2024-10-15',
    targetDate: '2024-12-07',
    description: 'Implement automated audit scheduling with recurring audit templates, resource allocation, and calendar integration for audit planning and tracking.',
    analytics: {
      complexityScore: 4,
      businessValue: 6,
      riskScore: 2,
      estimatedROI: 15,
      impactedMeasures: ['audit_coverage', 'audit_timeliness'],
      dependencies: [],
    },
  },
  {
    id: 'dem_023',
    title: 'Group Enrollment Self-Service Portal',
    type: 'feature',
    priority: 'medium',
    status: 'completed',
    requestor: 'Robert Kim',
    segment: 'Commercial',
    application: 'app_group_enrollment',
    estimatedEffort: 21,
    assignee: 'Chris Anderson',
    approver: 'Robert Kim',
    intakeDate: '2024-08-10',
    targetDate: '2024-12-09',
    description: 'Build a self-service enrollment portal for small group employers enabling online enrollment, employee roster management, and plan selection without broker assistance.',
    analytics: {
      complexityScore: 7,
      businessValue: 8,
      riskScore: 4,
      estimatedROI: 35,
      impactedMeasures: ['enrollment_efficiency', 'employer_satisfaction'],
      dependencies: [],
    },
  },
  {
    id: 'dem_024',
    title: 'Risk Assessment Automated Scoring Engine',
    type: 'feature',
    priority: 'low',
    status: 'completed',
    requestor: 'Patricia Evans',
    segment: 'Compliance',
    application: 'app_risk_assessment',
    estimatedEffort: 13,
    assignee: 'Samantha Clark',
    approver: 'Patricia Evans',
    intakeDate: '2024-09-10',
    targetDate: '2024-12-05',
    description: 'Develop an automated risk scoring engine that calculates risk scores based on configurable criteria, historical data, and industry benchmarks.',
    analytics: {
      complexityScore: 6,
      businessValue: 7,
      riskScore: 3,
      estimatedROI: 25,
      impactedMeasures: ['risk_assessment_accuracy', 'risk_coverage'],
      dependencies: [],
    },
  },
  {
    id: 'dem_025',
    title: 'Provider Network Adequacy Reporting',
    type: 'feature',
    priority: 'medium',
    status: 'completed',
    requestor: 'Robert Kim',
    segment: 'Medicaid',
    application: 'app_provider_network',
    estimatedEffort: 13,
    assignee: 'Robert Kim',
    approver: 'David Park',
    intakeDate: '2024-08-25',
    targetDate: '2024-11-22',
    description: 'Build network adequacy reporting capabilities including automated adequacy calculations, gap analysis, and state-mandated reporting for all contracted service areas.',
    analytics: {
      complexityScore: 6,
      businessValue: 8,
      riskScore: 4,
      estimatedROI: 30,
      impactedMeasures: ['network_adequacy', 'state_compliance'],
      dependencies: [],
    },
  },
  {
    id: 'dem_026',
    title: 'Individual Marketplace OEP 2025 Updates',
    type: 'compliance',
    priority: 'high',
    status: 'completed',
    requestor: 'Emily Davis',
    segment: 'Commercial',
    application: 'app_individual_marketplace',
    estimatedEffort: 13,
    assignee: 'Priya Patel',
    approver: 'Emily Davis',
    intakeDate: '2024-09-01',
    targetDate: '2024-12-10',
    description: 'Implement Open Enrollment Period 2025 plan year updates including new plan offerings, updated subsidy calculations, and enhanced plan comparison tools.',
    analytics: {
      complexityScore: 6,
      businessValue: 9,
      riskScore: 4,
      estimatedROI: 35,
      impactedMeasures: ['enrollment_accuracy', 'plan_display_compliance'],
      dependencies: [],
    },
  },
  {
    id: 'dem_027',
    title: 'Regulatory Reporting 2025 CMS Templates',
    type: 'compliance',
    priority: 'high',
    status: 'completed',
    requestor: 'Patricia Evans',
    segment: 'Compliance',
    application: 'app_regulatory_reporting',
    estimatedEffort: 13,
    assignee: 'Lisa Johnson',
    approver: 'Patricia Evans',
    intakeDate: '2024-09-15',
    targetDate: '2024-12-10',
    description: 'Add 2025 CMS reporting templates with automated submission validation, format compliance checks, and deadline tracking for all required regulatory submissions.',
    analytics: {
      complexityScore: 6,
      businessValue: 9,
      riskScore: 4,
      estimatedROI: 30,
      impactedMeasures: ['reporting_compliance', 'submission_accuracy'],
      dependencies: [],
    },
  },
  {
    id: 'dem_028',
    title: 'Vendor Integration BAA Compliance Remediation',
    type: 'compliance',
    priority: 'critical',
    status: 'approved',
    requestor: 'Natalie White',
    segment: 'External',
    application: 'app_vendor_integration',
    estimatedEffort: 8,
    assignee: 'Natalie White',
    approver: 'Jennifer Williams',
    intakeDate: '2024-11-20',
    targetDate: '2025-01-31',
    description: 'Remediate vendor data security non-compliance findings by implementing encrypted data channels for all vendor exchanges and ensuring BAA agreements are in place and enforced.',
    analytics: {
      complexityScore: 5,
      businessValue: 9,
      riskScore: 8,
      estimatedROI: 20,
      impactedMeasures: ['vendor_security_compliance', 'data_protection'],
      dependencies: [],
    },
  },
  {
    id: 'dem_029',
    title: 'Benefits Administration 2025 Plan Configurations',
    type: 'compliance',
    priority: 'high',
    status: 'completed',
    requestor: 'Kevin Brown',
    segment: 'Medicare',
    application: 'app_benefits_admin',
    estimatedEffort: 13,
    assignee: 'Robert Kim',
    approver: 'Michael Torres',
    intakeDate: '2024-08-15',
    targetDate: '2024-12-02',
    description: 'Configure 2025 plan year benefit structures including new supplemental benefit types, updated cost-sharing rules, and CMS-approved bid submission alignment.',
    analytics: {
      complexityScore: 6,
      businessValue: 9,
      riskScore: 4,
      estimatedROI: 30,
      impactedMeasures: ['benefit_accuracy', 'plan_compliance'],
      dependencies: [],
    },
  },
  {
    id: 'dem_030',
    title: 'Care Management Member Outreach Tracking Fix',
    type: 'defect',
    priority: 'high',
    status: 'in_progress',
    requestor: 'Angela Martinez',
    segment: 'Medicaid',
    application: 'app_care_management',
    estimatedEffort: 5,
    assignee: 'James Wright',
    approver: 'Amanda Garcia',
    intakeDate: '2024-12-02',
    targetDate: '2025-01-15',
    description: 'Fix member outreach tracking defect where outreach attempts are not consistently logged with outcomes and follow-up actions, causing governance non-compliance.',
    analytics: {
      complexityScore: 4,
      businessValue: 8,
      riskScore: 5,
      estimatedROI: 15,
      impactedMeasures: ['outreach_compliance', 'care_gap_closure'],
      dependencies: [],
    },
  },
  {
    id: 'dem_031',
    title: 'Data Warehouse ETL Pipeline Modernization',
    type: 'infrastructure',
    priority: 'medium',
    status: 'intake',
    requestor: 'Samantha Clark',
    segment: 'Enterprise',
    application: 'app_data_warehouse',
    estimatedEffort: 34,
    assignee: '',
    approver: '',
    intakeDate: '2024-12-10',
    targetDate: '2025-06-30',
    description: 'Modernize legacy ETL pipelines by migrating to dbt-based transformations with improved data quality checks, automated testing, and comprehensive data lineage documentation.',
    analytics: {
      complexityScore: 8,
      businessValue: 7,
      riskScore: 5,
      estimatedROI: 30,
      impactedMeasures: ['data_pipeline_reliability', 'data_quality_score'],
      dependencies: ['dem_010'],
    },
  },
  {
    id: 'dem_032',
    title: 'Member Portal Mobile Responsive Redesign',
    type: 'enhancement',
    priority: 'medium',
    status: 'intake',
    requestor: 'Rachel Nguyen',
    segment: 'Enterprise',
    application: 'app_member_portal',
    estimatedEffort: 21,
    assignee: '',
    approver: '',
    intakeDate: '2024-12-08',
    targetDate: '2025-05-31',
    description: 'Redesign the member portal with a mobile-first responsive approach improving usability on tablets and smartphones while maintaining desktop feature parity.',
    analytics: {
      complexityScore: 7,
      businessValue: 8,
      riskScore: 3,
      estimatedROI: 35,
      impactedMeasures: ['mobile_engagement', 'member_satisfaction'],
      dependencies: ['dem_003'],
    },
  },
  {
    id: 'dem_033',
    title: 'HEDIS Supplemental Data Source Integration',
    type: 'integration',
    priority: 'high',
    status: 'analysis',
    requestor: 'Lisa Johnson',
    segment: 'Medicare',
    application: 'app_hedis_engine',
    estimatedEffort: 21,
    assignee: 'Samantha Clark',
    approver: 'Angela Martinez',
    intakeDate: '2024-11-25',
    targetDate: '2025-03-31',
    description: 'Integrate new supplemental data sources into the HEDIS measure engine including electronic clinical data, health information exchange feeds, and pharmacy benefit manager data.',
    analytics: {
      complexityScore: 8,
      businessValue: 9,
      riskScore: 6,
      estimatedROI: 40,
      impactedMeasures: ['hedis_data_completeness', 'measure_rate_accuracy'],
      dependencies: ['dem_002', 'dem_010'],
    },
  },
  {
    id: 'dem_034',
    title: 'State Reporting Data Accuracy Remediation',
    type: 'defect',
    priority: 'critical',
    status: 'in_progress',
    requestor: 'Patricia Evans',
    segment: 'Medicaid',
    application: 'app_state_reporting',
    estimatedEffort: 13,
    assignee: 'Samantha Clark',
    approver: 'Patricia Evans',
    intakeDate: '2024-11-22',
    targetDate: '2025-01-31',
    description: 'Remediate data accuracy issues in state regulatory reports by implementing comprehensive automated validation checks and reconciliation processes to achieve less than 0.1% error rate.',
    analytics: {
      complexityScore: 7,
      businessValue: 10,
      riskScore: 8,
      estimatedROI: 35,
      impactedMeasures: ['reporting_accuracy', 'state_compliance'],
      dependencies: [],
    },
  },
  {
    id: 'dem_035',
    title: 'Claims Processing Batch Performance Improvement',
    type: 'enhancement',
    priority: 'medium',
    status: 'deferred',
    requestor: 'Jennifer Williams',
    segment: 'Enterprise',
    application: 'app_claims_engine',
    estimatedEffort: 13,
    assignee: '',
    approver: '',
    intakeDate: '2024-10-25',
    targetDate: '2025-06-30',
    description: 'Improve claims batch processing performance by optimizing database queries, implementing parallel processing, and upgrading the batch scheduling framework.',
    analytics: {
      complexityScore: 6,
      businessValue: 6,
      riskScore: 3,
      estimatedROI: 20,
      impactedMeasures: ['claims_processing_time', 'batch_throughput'],
      dependencies: [],
    },
  },
  {
    id: 'dem_036',
    title: 'Medicaid Eligibility Multi-State Configuration',
    type: 'feature',
    priority: 'high',
    status: 'intake',
    requestor: 'David Park',
    segment: 'Medicaid',
    application: 'app_medicaid_eligibility',
    estimatedEffort: 34,
    assignee: '',
    approver: '',
    intakeDate: '2024-12-05',
    targetDate: '2025-07-31',
    description: 'Implement multi-state configuration support for the Medicaid eligibility engine enabling state-specific rule sets, benefit packages, and eligibility criteria without code changes.',
    analytics: {
      complexityScore: 9,
      businessValue: 9,
      riskScore: 7,
      estimatedROI: 40,
      impactedMeasures: ['state_onboarding_time', 'eligibility_accuracy'],
      dependencies: ['dem_005'],
    },
  },
  {
    id: 'dem_037',
    title: 'Partner API OAuth 2.0 Compliance Update',
    type: 'compliance',
    priority: 'high',
    status: 'approved',
    requestor: 'Natalie White',
    segment: 'External',
    application: 'app_partner_api_gateway',
    estimatedEffort: 8,
    assignee: 'Natalie White',
    approver: 'Jennifer Williams',
    intakeDate: '2024-11-18',
    targetDate: '2025-02-28',
    description: 'Update all partner API endpoints to enforce OAuth 2.0 authentication standards including token validation improvements, scope enforcement, and audit logging.',
    analytics: {
      complexityScore: 5,
      businessValue: 8,
      riskScore: 6,
      estimatedROI: 20,
      impactedMeasures: ['api_security_compliance', 'partner_trust_score'],
      dependencies: ['dem_012'],
    },
  },
  {
    id: 'dem_038',
    title: 'Vendor Data Reconciliation Automation',
    type: 'enhancement',
    priority: 'high',
    status: 'analysis',
    requestor: 'Samantha Clark',
    segment: 'External',
    application: 'app_vendor_integration',
    estimatedEffort: 13,
    assignee: 'James Wright',
    approver: 'Alex Rivera',
    intakeDate: '2024-11-28',
    targetDate: '2025-03-15',
    description: 'Implement automated daily data reconciliation for all vendor data feeds with discrepancy detection, automated alerting, and reconciliation reporting dashboards.',
    analytics: {
      complexityScore: 6,
      businessValue: 8,
      riskScore: 5,
      estimatedROI: 25,
      impactedMeasures: ['data_reconciliation_rate', 'vendor_data_quality'],
      dependencies: ['dem_007'],
    },
  },
  {
    id: 'dem_039',
    title: 'Star Ratings CMS Methodology Alignment Audit',
    type: 'compliance',
    priority: 'medium',
    status: 'approved',
    requestor: 'Emily Davis',
    segment: 'Medicare',
    application: 'app_star_ratings',
    estimatedEffort: 8,
    assignee: 'Lisa Johnson',
    approver: 'Michael Torres',
    intakeDate: '2024-12-01',
    targetDate: '2025-02-15',
    description: 'Conduct a comprehensive audit of Star Ratings calculations against the latest CMS Technical Notes to ensure full methodology alignment and document any deviations.',
    analytics: {
      complexityScore: 5,
      businessValue: 9,
      riskScore: 4,
      estimatedROI: 25,
      impactedMeasures: ['star_calculation_accuracy', 'cms_compliance'],
      dependencies: ['dem_006'],
    },
  },
  {
    id: 'dem_040',
    title: 'External Data Feed Processing SLA Improvement',
    type: 'enhancement',
    priority: 'medium',
    status: 'analysis',
    requestor: 'James Wright',
    segment: 'External',
    application: 'app_external_data_feed',
    estimatedEffort: 13,
    assignee: 'Marcus Thompson',
    approver: 'Alex Rivera',
    intakeDate: '2024-12-03',
    targetDate: '2025-03-31',
    description: 'Improve external data feed processing to meet the 4-hour SLA by optimizing file parsing, implementing parallel processing, and adding priority-based queue management.',
    analytics: {
      complexityScore: 6,
      businessValue: 7,
      riskScore: 5,
      estimatedROI: 20,
      impactedMeasures: ['feed_processing_sla', 'data_timeliness'],
      dependencies: ['dem_021'],
    },
  },
];

/**
 * Returns all available demands.
 *
 * @returns {Demand[]} Array of all demand objects
 */
export function getAllDemands() {
  return [...demands];
}

/**
 * Retrieves a single demand by its unique ID.
 *
 * @param {string} demandId - The demand identifier to look up
 * @returns {Demand|null} The matching demand object, or null if not found
 */
export function getDemandById(demandId) {
  if (!demandId || typeof demandId !== 'string') {
    return null;
  }
  return demands.find((d) => d.id === demandId) || null;
}

/**
 * Returns all demands belonging to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {Demand[]} Array of demands in the specified segment
 */
export function getDemandsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return demands.filter((d) => d.segment === segment);
}

/**
 * Returns all demands filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'intake', 'in_progress', 'completed')
 * @returns {Demand[]} Array of demands matching the specified status
 */
export function getDemandsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return demands.filter((d) => d.status === status);
}

/**
 * Returns all demands filtered by priority.
 *
 * @param {string} priority - The priority to filter by (e.g. 'critical', 'high', 'medium', 'low')
 * @returns {Demand[]} Array of demands matching the specified priority
 */
export function getDemandsByPriority(priority) {
  if (!priority || typeof priority !== 'string') {
    return [];
  }
  return demands.filter((d) => d.priority === priority);
}

/**
 * Returns all demands filtered by type.
 *
 * @param {string} type - The type to filter by (e.g. 'feature', 'enhancement', 'defect', 'compliance')
 * @returns {Demand[]} Array of demands matching the specified type
 */
export function getDemandsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return demands.filter((d) => d.type === type);
}

/**
 * Returns all demands associated with a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {Demand[]} Array of demands for the specified application
 */
export function getDemandsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return demands.filter((d) => d.application === applicationId);
}

/**
 * Returns all demands assigned to a specific person.
 *
 * @param {string} assignee - The assignee name to filter by
 * @returns {Demand[]} Array of demands assigned to the specified person
 */
export function getDemandsByAssignee(assignee) {
  if (!assignee || typeof assignee !== 'string') {
    return [];
  }
  return demands.filter((d) => d.assignee === assignee);
}

/**
 * Returns all demands requested by a specific person.
 *
 * @param {string} requestor - The requestor name to filter by
 * @returns {Demand[]} Array of demands requested by the specified person
 */
export function getDemandsByRequestor(requestor) {
  if (!requestor || typeof requestor !== 'string') {
    return [];
  }
  return demands.filter((d) => d.requestor === requestor);
}

/**
 * Returns aggregate statistics across all demands.
 *
 * @returns {{ totalDemands: number, totalEstimatedEffort: number, averageComplexity: number, averageBusinessValue: number, averageRiskScore: number, statusBreakdown: Object<string, number>, priorityBreakdown: Object<string, number>, typeBreakdown: Object<string, number> }} Aggregate demand statistics
 */
export function getDemandAggregates() {
  const totalDemands = demands.length;
  const totalEstimatedEffort = demands.reduce((sum, d) => sum + d.estimatedEffort, 0);
  const averageComplexity =
    totalDemands > 0
      ? Math.round((demands.reduce((sum, d) => sum + d.analytics.complexityScore, 0) / totalDemands) * 10) / 10
      : 0;
  const averageBusinessValue =
    totalDemands > 0
      ? Math.round((demands.reduce((sum, d) => sum + d.analytics.businessValue, 0) / totalDemands) * 10) / 10
      : 0;
  const averageRiskScore =
    totalDemands > 0
      ? Math.round((demands.reduce((sum, d) => sum + d.analytics.riskScore, 0) / totalDemands) * 10) / 10
      : 0;

  const statusBreakdown = demands.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  const priorityBreakdown = demands.reduce((acc, d) => {
    acc[d.priority] = (acc[d.priority] || 0) + 1;
    return acc;
  }, {});

  const typeBreakdown = demands.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  return {
    totalDemands,
    totalEstimatedEffort,
    averageComplexity,
    averageBusinessValue,
    averageRiskScore,
    statusBreakdown,
    priorityBreakdown,
    typeBreakdown,
  };
}

/**
 * Returns all unique demand types.
 *
 * @returns {string[]} Array of unique demand types sorted alphabetically
 */
export function getAllDemandTypes() {
  const types = new Set(demands.map((d) => d.type));
  return [...types].sort();
}

/**
 * Returns all unique demand statuses.
 *
 * @returns {string[]} Array of unique demand statuses sorted alphabetically
 */
export function getAllDemandStatuses() {
  const statuses = new Set(demands.map((d) => d.status));
  return [...statuses].sort();
}

/**
 * Returns all unique demand priorities.
 *
 * @returns {string[]} Array of unique demand priorities
 */
export function getAllDemandPriorities() {
  return ['critical', 'high', 'medium', 'low'];
}

export default demands;