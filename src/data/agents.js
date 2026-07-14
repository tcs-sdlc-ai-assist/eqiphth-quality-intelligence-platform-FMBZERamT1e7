import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} AgentMetrics
 * @property {number} tasksCompleted - Total tasks completed by the agent
 * @property {number} tasksInProgress - Tasks currently in progress
 * @property {number} tasksFailed - Total tasks that failed
 * @property {number} averageCompletionTimeMinutes - Average task completion time in minutes
 * @property {number} accuracyRate - Accuracy rate percentage (0-100)
 * @property {number} humanOverrideRate - Percentage of tasks overridden by humans (0-100)
 * @property {number} uptimePercent - Agent uptime percentage (0-100)
 * @property {{ month: string, completed: number, failed: number }[]} trendData - Monthly task trend data
 */

/**
 * @typedef {Object} GovernancePolicy
 * @property {string} id - Unique governance policy identifier
 * @property {string} name - Policy name
 * @property {string} description - Policy description
 * @property {string} enforcementLevel - Enforcement level (strict, moderate, advisory)
 * @property {string[]} constraints - Array of constraint descriptions
 * @property {string} lastReviewDate - Last review date in ISO format
 * @property {string} nextReviewDate - Next review date in ISO format
 * @property {string} approvedBy - Name of the person who approved the policy
 */

/**
 * @typedef {Object} ApprovalQueueItem
 * @property {string} id - Unique approval item identifier
 * @property {string} action - Proposed action description
 * @property {string} reason - Reason the action requires approval
 * @property {string} priority - Priority level (critical, high, medium, low)
 * @property {string} requestedAt - Request timestamp in ISO format
 * @property {string} status - Approval status (pending, approved, rejected, expired)
 * @property {string} reviewedBy - Name of the reviewer (empty string if pending)
 * @property {string} reviewedAt - Review timestamp in ISO format (empty string if pending)
 */

/**
 * @typedef {Object} LastAction
 * @property {string} id - Unique action identifier
 * @property {string} description - Description of the action performed
 * @property {string} timestamp - Action timestamp in ISO format
 * @property {string} outcome - Action outcome (success, failure, partial, pending_review)
 * @property {string} target - Target entity or resource
 * @property {string} details - Detailed action result information
 */

/**
 * @typedef {Object} Agent
 * @property {string} id - Unique agent identifier
 * @property {string} name - Display name of the agent
 * @property {string} type - Agent type (quality_monitor, test_orchestrator, compliance_auditor, risk_analyzer, performance_optimizer, data_validator, security_scanner, report_generator, incident_responder, recommendation_engine)
 * @property {string} status - Current agent status (active, idle, paused, error, maintenance, training)
 * @property {string} description - Description of the agent purpose and capabilities
 * @property {string[]} capabilities - Array of capability descriptions
 * @property {string[]} assignedSegments - Array of segment names the agent is assigned to
 * @property {string[]} assignedApplications - Array of application IDs the agent monitors
 * @property {GovernancePolicy} governancePolicy - Governance policy governing the agent
 * @property {boolean} humanInLoopRequired - Whether human approval is required for agent actions
 * @property {AgentMetrics} metrics - Agent performance metrics
 * @property {LastAction} lastAction - Most recent action performed by the agent
 * @property {ApprovalQueueItem[]} approvalQueue - Array of pending approval items
 * @property {string} owner - Name of the person responsible for the agent
 * @property {string} createdDate - Agent creation date in ISO format
 * @property {string} lastModifiedDate - Last modification date in ISO format
 * @property {string} version - Agent version string
 */

/**
 * Mock AI agent workforce data for the EQIP Quality Platform.
 * Contains agent objects representing autonomous and semi-autonomous AI agents
 * with governance policies, human-in-the-loop requirements, metrics, and approval queues.
 *
 * @type {Agent[]}
 */
const agents = [
  {
    id: 'agent_quality_monitor',
    name: 'Quality Monitor Agent',
    type: 'quality_monitor',
    status: 'active',
    description: 'Continuously monitors quality scores, test pass rates, and defect density across all applications and segments. Triggers alerts when metrics breach configured thresholds.',
    capabilities: [
      'Real-time quality score monitoring across all segments',
      'Automated threshold breach detection and alerting',
      'Quality trend analysis and anomaly detection',
      'Cross-segment quality comparison and benchmarking',
      'Predictive quality score forecasting',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    assignedApplications: [
      'app_claims_engine',
      'app_member_portal',
      'app_hedis_engine',
      'app_medicaid_eligibility',
      'app_partner_api_gateway',
      'app_vendor_integration',
    ],
    governancePolicy: {
      id: 'gp_quality_monitor',
      name: 'Quality Monitoring Governance Policy',
      description: 'Defines the boundaries and constraints for the Quality Monitor Agent including alert thresholds, escalation paths, and data access permissions.',
      enforcementLevel: 'moderate',
      constraints: [
        'Cannot modify quality gate thresholds without human approval',
        'Must escalate critical quality score drops (>10%) to quality director within 15 minutes',
        'Read-only access to application quality data',
        'Alert frequency limited to maximum 5 alerts per application per hour',
        'Cannot directly interact with production systems',
      ],
      lastReviewDate: '2024-12-01',
      nextReviewDate: '2025-03-01',
      approvedBy: 'Angela Martinez',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 12450,
      tasksInProgress: 8,
      tasksFailed: 23,
      averageCompletionTimeMinutes: 0.5,
      accuracyRate: 97.8,
      humanOverrideRate: 2.1,
      uptimePercent: 99.95,
      trendData: [
        { month: 'Jul', completed: 1680, failed: 3 },
        { month: 'Aug', completed: 1720, failed: 4 },
        { month: 'Sep', completed: 1810, failed: 2 },
        { month: 'Oct', completed: 1890, failed: 5 },
        { month: 'Nov', completed: 1950, failed: 4 },
        { month: 'Dec', completed: 1400, failed: 5 },
      ],
    },
    lastAction: {
      id: 'act_qm_001',
      description: 'Detected quality score drop for Vendor Integration Hub from 68.2 to 65.8',
      timestamp: '2024-12-12T14:45:00Z',
      outcome: 'success',
      target: 'app_vendor_integration',
      details: 'Quality score breach alert triggered. Notification sent to Alex Rivera and Jennifer Williams. Root cause analysis initiated — 5 new critical defects identified in v1.5.0 release.',
    },
    approvalQueue: [],
    owner: 'Angela Martinez',
    createdDate: '2024-01-15',
    lastModifiedDate: '2024-12-10',
    version: '2.3.0',
  },
  {
    id: 'agent_test_orchestrator',
    name: 'Test Orchestration Agent',
    type: 'test_orchestrator',
    status: 'active',
    description: 'Orchestrates automated test execution across environments, manages test scheduling, prioritizes test suites based on risk analysis, and coordinates parallel test runs.',
    capabilities: [
      'Intelligent test suite prioritization based on code changes and risk',
      'Automated test environment selection and provisioning coordination',
      'Parallel test execution orchestration across multiple environments',
      'Test failure triage and automatic re-run for flaky tests',
      'Dynamic test schedule optimization based on resource availability',
      'Test coverage gap identification and recommendation',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    assignedApplications: [
      'app_claims_engine',
      'app_member_portal',
      'app_auth_service',
      'app_hedis_engine',
      'app_medicare_enrollment',
      'app_medicaid_eligibility',
      'app_partner_api_gateway',
      'app_vendor_integration',
    ],
    governancePolicy: {
      id: 'gp_test_orchestrator',
      name: 'Test Orchestration Governance Policy',
      description: 'Governs the Test Orchestration Agent behavior including environment access, test execution limits, and escalation procedures for blocked tests.',
      enforcementLevel: 'strict',
      constraints: [
        'Cannot execute tests in production environment without explicit human approval',
        'Maximum concurrent test executions limited to 10 per environment',
        'Must respect environment reservation schedules',
        'Cannot modify test case definitions or expected results',
        'Flaky test re-runs limited to 3 attempts before escalation',
        'Must notify environment manager before provisioning new resources',
      ],
      lastReviewDate: '2024-11-15',
      nextReviewDate: '2025-02-15',
      approvedBy: 'Jennifer Williams',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 8920,
      tasksInProgress: 12,
      tasksFailed: 145,
      averageCompletionTimeMinutes: 15.3,
      accuracyRate: 94.2,
      humanOverrideRate: 4.8,
      uptimePercent: 99.88,
      trendData: [
        { month: 'Jul', completed: 1250, failed: 18 },
        { month: 'Aug', completed: 1310, failed: 22 },
        { month: 'Sep', completed: 1380, failed: 25 },
        { month: 'Oct', completed: 1420, failed: 28 },
        { month: 'Nov', completed: 1480, failed: 30 },
        { month: 'Dec', completed: 1080, failed: 22 },
      ],
    },
    lastAction: {
      id: 'act_to_001',
      description: 'Orchestrated nightly regression suite execution for HEDIS Engine across QA environment',
      timestamp: '2024-12-12T03:30:00Z',
      outcome: 'partial',
      target: 'app_hedis_engine',
      details: 'Executed 1,600 unit tests. 1,540 passed, 28 failed, 32 skipped. Identified 3 flaky tests and scheduled re-runs. Escalated BCS measure calculation failure to Lisa Johnson.',
    },
    approvalQueue: [
      {
        id: 'aq_to_001',
        action: 'Execute production smoke tests for Claims Engine v4.12.0 post-deployment validation',
        reason: 'Production environment test execution requires human approval per governance policy',
        priority: 'high',
        requestedAt: '2024-12-12T16:00:00Z',
        status: 'pending',
        reviewedBy: '',
        reviewedAt: '',
      },
    ],
    owner: 'James Wright',
    createdDate: '2024-02-01',
    lastModifiedDate: '2024-12-08',
    version: '3.1.0',
  },
  {
    id: 'agent_compliance_auditor',
    name: 'Compliance Auditor Agent',
    type: 'compliance_auditor',
    status: 'active',
    description: 'Continuously audits compliance framework adherence across all applications and segments. Monitors regulatory requirements, tracks audit findings, and validates corrective actions.',
    capabilities: [
      'Automated compliance framework score calculation and tracking',
      'Regulatory requirement change detection and impact analysis',
      'Audit finding lifecycle management and aging analysis',
      'Corrective action plan validation and progress tracking',
      'Cross-framework compliance gap identification',
      'Evidence collection and validation automation',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    assignedApplications: [
      'app_audit_tracker',
      'app_regulatory_reporting',
      'app_compliance_dashboard',
      'app_risk_assessment',
      'app_hedis_engine',
      'app_state_reporting',
    ],
    governancePolicy: {
      id: 'gp_compliance_auditor',
      name: 'Compliance Auditing Governance Policy',
      description: 'Defines the scope and limitations of the Compliance Auditor Agent including data access, finding creation authority, and escalation requirements.',
      enforcementLevel: 'strict',
      constraints: [
        'Cannot close audit findings without human auditor approval',
        'Must escalate critical compliance score drops to Patricia Evans within 30 minutes',
        'Cannot modify compliance framework scoring criteria',
        'All generated findings must be reviewed by a human auditor within 48 hours',
        'Cannot access PHI data directly — must use pre-aggregated compliance metrics',
        'Evidence validation results require human confirmation for regulatory submissions',
      ],
      lastReviewDate: '2024-12-01',
      nextReviewDate: '2025-03-01',
      approvedBy: 'Patricia Evans',
    },
    humanInLoopRequired: true,
    metrics: {
      tasksCompleted: 3240,
      tasksInProgress: 5,
      tasksFailed: 18,
      averageCompletionTimeMinutes: 8.2,
      accuracyRate: 96.5,
      humanOverrideRate: 8.4,
      uptimePercent: 99.92,
      trendData: [
        { month: 'Jul', completed: 480, failed: 2 },
        { month: 'Aug', completed: 510, failed: 3 },
        { month: 'Sep', completed: 530, failed: 2 },
        { month: 'Oct', completed: 560, failed: 4 },
        { month: 'Nov', completed: 580, failed: 3 },
        { month: 'Dec', completed: 580, failed: 4 },
      ],
    },
    lastAction: {
      id: 'act_ca_001',
      description: 'Identified PCI DSS Monitoring & Testing domain score degradation to 65.8%',
      timestamp: '2024-12-12T13:00:00Z',
      outcome: 'success',
      target: 'cs_008',
      details: 'PCI DSS compliance score dropped below 75% threshold. Generated draft audit finding for Monitoring & Testing domain non-compliance. Submitted to Patricia Evans for review and approval.',
    },
    approvalQueue: [
      {
        id: 'aq_ca_001',
        action: 'Create audit finding for State Medicaid member outreach non-compliance (74.0% vs 100% target)',
        reason: 'All agent-generated audit findings require human auditor review and approval',
        priority: 'high',
        requestedAt: '2024-12-12T11:30:00Z',
        status: 'pending',
        reviewedBy: '',
        reviewedAt: '',
      },
      {
        id: 'aq_ca_002',
        action: 'Update State Medicaid compliance framework score from 81.2% to 79.8%',
        reason: 'Compliance score modifications require human approval per governance policy',
        priority: 'high',
        requestedAt: '2024-12-12T12:00:00Z',
        status: 'approved',
        reviewedBy: 'Patricia Evans',
        reviewedAt: '2024-12-12T12:45:00Z',
      },
    ],
    owner: 'Patricia Evans',
    createdDate: '2024-03-01',
    lastModifiedDate: '2024-12-05',
    version: '2.0.0',
  },
  {
    id: 'agent_risk_analyzer',
    name: 'Risk Analysis Agent',
    type: 'risk_analyzer',
    status: 'active',
    description: 'Analyzes risk factors across applications, segments, and environments. Generates risk assessments, identifies emerging risk patterns, and recommends mitigation strategies.',
    capabilities: [
      'Multi-factor risk score calculation and trending',
      'Emerging risk pattern detection using anomaly analysis',
      'Risk factor correlation and dependency mapping',
      'Automated risk mitigation recommendation generation',
      'Risk heat map data generation for visualization',
      'Change impact risk assessment for upcoming releases',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
    assignedApplications: [
      'app_hedis_engine',
      'app_partner_api_gateway',
      'app_vendor_integration',
      'app_medicaid_eligibility',
      'app_state_reporting',
      'app_external_data_feed',
    ],
    governancePolicy: {
      id: 'gp_risk_analyzer',
      name: 'Risk Analysis Governance Policy',
      description: 'Governs the Risk Analysis Agent including risk score calculation methodology, escalation thresholds, and recommendation generation boundaries.',
      enforcementLevel: 'moderate',
      constraints: [
        'Cannot modify risk assessment scoring criteria without human approval',
        'Must escalate critical risk assessments (score >80) to quality director immediately',
        'Risk mitigation recommendations are advisory only — cannot implement changes directly',
        'Cannot access individual member or patient data for risk calculations',
        'Risk assessments must be regenerated at least weekly for active entities',
      ],
      lastReviewDate: '2024-11-20',
      nextReviewDate: '2025-02-20',
      approvedBy: 'Angela Martinez',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 4560,
      tasksInProgress: 3,
      tasksFailed: 32,
      averageCompletionTimeMinutes: 3.8,
      accuracyRate: 91.3,
      humanOverrideRate: 6.2,
      uptimePercent: 99.90,
      trendData: [
        { month: 'Jul', completed: 650, failed: 4 },
        { month: 'Aug', completed: 690, failed: 5 },
        { month: 'Sep', completed: 720, failed: 6 },
        { month: 'Oct', completed: 780, failed: 5 },
        { month: 'Nov', completed: 810, failed: 7 },
        { month: 'Dec', completed: 910, failed: 5 },
      ],
    },
    lastAction: {
      id: 'act_ra_001',
      description: 'Generated critical risk assessment for Vendor Integration Hub (risk score: 85)',
      timestamp: '2024-12-12T10:00:00Z',
      outcome: 'success',
      target: 'app_vendor_integration',
      details: 'Risk score elevated to 85 (CRITICAL) based on 7 risk factors including TLS 1.1 acceptance, BAA enforcement gap, 12.5% change failure rate, and 62.8% automation coverage. Generated 6 mitigation suggestions.',
    },
    approvalQueue: [],
    owner: 'Angela Martinez',
    createdDate: '2024-04-15',
    lastModifiedDate: '2024-12-12',
    version: '1.8.0',
  },
  {
    id: 'agent_performance_optimizer',
    name: 'Performance Optimization Agent',
    type: 'performance_optimizer',
    status: 'active',
    description: 'Monitors application performance metrics, identifies bottlenecks, analyzes SLA compliance, and generates optimization recommendations for performance-critical systems.',
    capabilities: [
      'Real-time performance metric monitoring and SLA tracking',
      'Performance bottleneck identification and root cause analysis',
      'SLA compliance trend analysis and forecasting',
      'Resource utilization optimization recommendations',
      'Performance regression detection after deployments',
      'Capacity planning data generation and analysis',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'External'],
    assignedApplications: [
      'app_claims_engine',
      'app_hedis_engine',
      'app_data_warehouse',
      'app_partner_api_gateway',
      'app_external_data_feed',
      'app_medicare_enrollment',
    ],
    governancePolicy: {
      id: 'gp_performance_optimizer',
      name: 'Performance Optimization Governance Policy',
      description: 'Defines the scope and constraints for the Performance Optimization Agent including monitoring boundaries, recommendation limits, and escalation procedures.',
      enforcementLevel: 'moderate',
      constraints: [
        'Cannot modify application configurations or infrastructure settings',
        'Performance recommendations are advisory only — implementation requires human approval',
        'Must not generate load on production systems exceeding 1% of baseline',
        'SLA breach alerts must be sent within 5 minutes of detection',
        'Cannot access application source code or database schemas directly',
      ],
      lastReviewDate: '2024-11-10',
      nextReviewDate: '2025-02-10',
      approvedBy: 'Marcus Thompson',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 5680,
      tasksInProgress: 4,
      tasksFailed: 42,
      averageCompletionTimeMinutes: 2.1,
      accuracyRate: 93.7,
      humanOverrideRate: 3.5,
      uptimePercent: 99.93,
      trendData: [
        { month: 'Jul', completed: 820, failed: 5 },
        { month: 'Aug', completed: 860, failed: 7 },
        { month: 'Sep', completed: 910, failed: 8 },
        { month: 'Oct', completed: 950, failed: 6 },
        { month: 'Nov', completed: 1020, failed: 9 },
        { month: 'Dec', completed: 1120, failed: 7 },
      ],
    },
    lastAction: {
      id: 'act_po_001',
      description: 'Detected HEDIS engine full population processing SLA breach (4h 45m vs 4h target)',
      timestamp: '2024-12-12T06:00:00Z',
      outcome: 'success',
      target: 'app_hedis_engine',
      details: 'SLA breach detected for HEDIS engine performance test. CDC and CBP measures identified as primary bottlenecks accounting for 40% of total processing time. Generated optimization recommendation: implement parallel processing for independent sub-measures.',
    },
    approvalQueue: [],
    owner: 'Marcus Thompson',
    createdDate: '2024-03-15',
    lastModifiedDate: '2024-12-10',
    version: '2.1.0',
  },
  {
    id: 'agent_data_validator',
    name: 'Data Validation Agent',
    type: 'data_validator',
    status: 'active',
    description: 'Validates data quality, integrity, and consistency across test data assets, ETL pipelines, and reporting systems. Monitors data freshness and masking compliance.',
    capabilities: [
      'Automated data quality validation across all test data assets',
      'Data freshness monitoring and stale data detection',
      'PHI masking compliance verification',
      'ETL pipeline data integrity validation',
      'Cross-system data reconciliation and discrepancy detection',
      'Data lineage tracking and validation',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'External'],
    assignedApplications: [
      'app_data_warehouse',
      'app_hedis_engine',
      'app_state_reporting',
      'app_vendor_integration',
      'app_external_data_feed',
    ],
    governancePolicy: {
      id: 'gp_data_validator',
      name: 'Data Validation Governance Policy',
      description: 'Governs the Data Validation Agent including data access permissions, masking verification requirements, and data quality threshold enforcement.',
      enforcementLevel: 'strict',
      constraints: [
        'Cannot access unmasked PHI data under any circumstances',
        'Data quality findings must be reported within 1 hour of detection',
        'Cannot modify or delete any data — read-only access only',
        'Stale data alerts must include recommended refresh actions',
        'Must validate masking completeness before any test data provisioning approval',
        'Cannot approve test data provisioning without confirming PHI masking status',
      ],
      lastReviewDate: '2024-11-25',
      nextReviewDate: '2025-02-25',
      approvedBy: 'Samantha Clark',
    },
    humanInLoopRequired: true,
    metrics: {
      tasksCompleted: 6780,
      tasksInProgress: 6,
      tasksFailed: 55,
      averageCompletionTimeMinutes: 4.5,
      accuracyRate: 98.2,
      humanOverrideRate: 3.1,
      uptimePercent: 99.91,
      trendData: [
        { month: 'Jul', completed: 980, failed: 7 },
        { month: 'Aug', completed: 1020, failed: 9 },
        { month: 'Sep', completed: 1080, failed: 8 },
        { month: 'Oct', completed: 1120, failed: 10 },
        { month: 'Nov', completed: 1180, failed: 12 },
        { month: 'Dec', completed: 1400, failed: 9 },
      ],
    },
    lastAction: {
      id: 'act_dv_001',
      description: 'Detected 3 stale test data assets requiring refresh',
      timestamp: '2024-12-12T08:00:00Z',
      outcome: 'success',
      target: 'app_vendor_integration',
      details: 'Identified stale test data: Vendor Integration Feed Test Data (td_029, last refreshed 2024-11-18), State Reporting Quarterly Submission Data (td_019, last refreshed 2024-11-28), External Data Feed CMS Format Test Files (td_030, last refreshed 2024-11-20). Notifications sent to respective data owners.',
    },
    approvalQueue: [
      {
        id: 'aq_dv_001',
        action: 'Approve test data provisioning for Claims Engine subset (td_045) after masking verification',
        reason: 'Test data provisioning with PHI requires human approval to confirm masking completeness',
        priority: 'high',
        requestedAt: '2024-12-12T11:30:00Z',
        status: 'pending',
        reviewedBy: '',
        reviewedAt: '',
      },
    ],
    owner: 'Samantha Clark',
    createdDate: '2024-05-01',
    lastModifiedDate: '2024-12-08',
    version: '1.5.0',
  },
  {
    id: 'agent_security_scanner',
    name: 'Security Scanning Agent',
    type: 'security_scanner',
    status: 'active',
    description: 'Continuously scans applications for security vulnerabilities, monitors compliance with security governance policies, and tracks remediation of security findings.',
    capabilities: [
      'Automated security vulnerability scanning and classification',
      'Security governance policy compliance monitoring',
      'TLS configuration validation and certificate expiration tracking',
      'OAuth and authentication configuration auditing',
      'Security finding lifecycle tracking and aging analysis',
      'Vendor security posture assessment',
    ],
    assignedSegments: ['Enterprise', 'External'],
    assignedApplications: [
      'app_auth_service',
      'app_partner_api_gateway',
      'app_vendor_integration',
      'app_claims_engine',
      'app_member_portal',
    ],
    governancePolicy: {
      id: 'gp_security_scanner',
      name: 'Security Scanning Governance Policy',
      description: 'Defines the boundaries for the Security Scanning Agent including scan scope, vulnerability disclosure rules, and escalation requirements for critical findings.',
      enforcementLevel: 'strict',
      constraints: [
        'Cannot perform active penetration testing without explicit human approval',
        'Critical security vulnerabilities must be escalated to Natalie White within 15 minutes',
        'Cannot modify security configurations or firewall rules',
        'Scan results containing exploit details must be classified as confidential',
        'Cannot scan production systems during peak hours (8 AM - 6 PM ET) without approval',
        'Must coordinate with vendor partners before scanning external-facing endpoints',
      ],
      lastReviewDate: '2024-12-05',
      nextReviewDate: '2025-03-05',
      approvedBy: 'Natalie White',
    },
    humanInLoopRequired: true,
    metrics: {
      tasksCompleted: 2890,
      tasksInProgress: 2,
      tasksFailed: 15,
      averageCompletionTimeMinutes: 12.5,
      accuracyRate: 95.8,
      humanOverrideRate: 5.2,
      uptimePercent: 99.89,
      trendData: [
        { month: 'Jul', completed: 410, failed: 2 },
        { month: 'Aug', completed: 430, failed: 2 },
        { month: 'Sep', completed: 460, failed: 3 },
        { month: 'Oct', completed: 490, failed: 3 },
        { month: 'Nov', completed: 520, failed: 2 },
        { month: 'Dec', completed: 580, failed: 3 },
      ],
    },
    lastAction: {
      id: 'act_ss_001',
      description: 'Confirmed OAuth 2.0 scope enforcement remains disabled on Partner API Gateway',
      timestamp: '2024-12-12T09:00:00Z',
      outcome: 'success',
      target: 'app_partner_api_gateway',
      details: 'Daily security scan confirmed that Kong OAuth plugin scope_required parameter is still set to false. Critical finding AF-002 remains open. Escalation notification sent to Natalie White and Alex Rivera.',
    },
    approvalQueue: [
      {
        id: 'aq_ss_001',
        action: 'Initiate off-hours security scan of Partner API Gateway production endpoints',
        reason: 'Production security scans require human approval per governance policy',
        priority: 'medium',
        requestedAt: '2024-12-12T14:00:00Z',
        status: 'pending',
        reviewedBy: '',
        reviewedAt: '',
      },
    ],
    owner: 'Natalie White',
    createdDate: '2024-02-15',
    lastModifiedDate: '2024-12-12',
    version: '2.4.0',
  },
  {
    id: 'agent_report_generator',
    name: 'Report Generation Agent',
    type: 'report_generator',
    status: 'active',
    description: 'Generates automated reports including executive summaries, segment overviews, compliance status reports, and weekly digests. Tailors content to persona-specific needs.',
    capabilities: [
      'Automated executive briefing generation with key insights',
      'Persona-tailored report content and formatting',
      'Scheduled report generation and distribution',
      'Data aggregation and visualization preparation',
      'Natural language summary generation for complex metrics',
      'Report template management and customization',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    assignedApplications: [],
    governancePolicy: {
      id: 'gp_report_generator',
      name: 'Report Generation Governance Policy',
      description: 'Governs the Report Generation Agent including data access for report content, distribution rules, and content accuracy requirements.',
      enforcementLevel: 'advisory',
      constraints: [
        'Generated reports must include data source citations and confidence scores',
        'Reports containing PHI-derived metrics must be marked as confidential',
        'Distribution lists must be validated against persona access permissions',
        'Executive briefings must be reviewed by quality director before distribution',
        'Cannot generate reports with data older than 24 hours without disclaimer',
      ],
      lastReviewDate: '2024-11-30',
      nextReviewDate: '2025-02-28',
      approvedBy: 'Jennifer Williams',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 1560,
      tasksInProgress: 2,
      tasksFailed: 8,
      averageCompletionTimeMinutes: 5.8,
      accuracyRate: 94.5,
      humanOverrideRate: 7.8,
      uptimePercent: 99.96,
      trendData: [
        { month: 'Jul', completed: 220, failed: 1 },
        { month: 'Aug', completed: 235, failed: 1 },
        { month: 'Sep', completed: 248, failed: 2 },
        { month: 'Oct', completed: 260, failed: 1 },
        { month: 'Nov', completed: 275, failed: 2 },
        { month: 'Dec', completed: 322, failed: 1 },
      ],
    },
    lastAction: {
      id: 'act_rg_001',
      description: 'Generated weekly quality engineering digest for week of December 9-12, 2024',
      timestamp: '2024-12-12T15:00:00Z',
      outcome: 'success',
      target: 'eqip_platform',
      details: 'Weekly digest generated covering 5 production deployments, 24 passed/12 failed test executions, demand pipeline status, and audit finding updates. Distributed to quality_director and vp_qe personas.',
    },
    approvalQueue: [],
    owner: 'Jennifer Williams',
    createdDate: '2024-06-01',
    lastModifiedDate: '2024-12-12',
    version: '1.3.0',
  },
  {
    id: 'agent_incident_responder',
    name: 'Incident Response Agent',
    type: 'incident_responder',
    status: 'active',
    description: 'Monitors production environments for incidents, performs initial triage, correlates related events, and coordinates incident response workflows with human operators.',
    capabilities: [
      'Real-time production incident detection and classification',
      'Automated incident triage and severity assessment',
      'Related event correlation and impact analysis',
      'Incident response workflow coordination',
      'Post-incident timeline reconstruction',
      'Environment health monitoring and degradation alerting',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'External'],
    assignedApplications: [
      'app_claims_engine',
      'app_member_portal',
      'app_auth_service',
      'app_medicare_enrollment',
      'app_partner_api_gateway',
      'app_vendor_integration',
    ],
    governancePolicy: {
      id: 'gp_incident_responder',
      name: 'Incident Response Governance Policy',
      description: 'Defines the incident response agent boundaries including automated response actions, escalation timelines, and communication protocols.',
      enforcementLevel: 'strict',
      constraints: [
        'Cannot execute production remediation actions without human approval',
        'Must escalate P1 incidents to production support within 5 minutes',
        'Cannot restart production services or modify configurations',
        'Incident communications must be reviewed by Karen Mitchell before external distribution',
        'Cannot close incidents without human confirmation of resolution',
        'Must create ServiceNow incident tickets for all detected production issues',
      ],
      lastReviewDate: '2024-12-01',
      nextReviewDate: '2025-03-01',
      approvedBy: 'Karen Mitchell',
    },
    humanInLoopRequired: true,
    metrics: {
      tasksCompleted: 1890,
      tasksInProgress: 1,
      tasksFailed: 12,
      averageCompletionTimeMinutes: 8.5,
      accuracyRate: 96.2,
      humanOverrideRate: 9.5,
      uptimePercent: 99.99,
      trendData: [
        { month: 'Jul', completed: 280, failed: 1 },
        { month: 'Aug', completed: 295, failed: 2 },
        { month: 'Sep', completed: 310, failed: 2 },
        { month: 'Oct', completed: 320, failed: 3 },
        { month: 'Nov', completed: 335, failed: 2 },
        { month: 'Dec', completed: 350, failed: 2 },
      ],
    },
    lastAction: {
      id: 'act_ir_001',
      description: 'Detected QA Hotfix environment failure and initiated incident response',
      timestamp: '2024-12-11T22:15:00Z',
      outcome: 'success',
      target: 'env_qa_hotfix',
      details: 'QA Hotfix environment (env_qa_hotfix) went offline due to infrastructure failure. Incident ticket INC-2024-1205 created in ServiceNow. Notifications sent to Karen Mitchell and Daniel Robinson. Health score dropped to 0%. Awaiting human-led remediation.',
    },
    approvalQueue: [
      {
        id: 'aq_ir_001',
        action: 'Initiate automated failover for QA Hotfix environment to backup infrastructure',
        reason: 'Production and QA environment remediation actions require human approval',
        priority: 'critical',
        requestedAt: '2024-12-11T22:20:00Z',
        status: 'rejected',
        reviewedBy: 'Daniel Robinson',
        reviewedAt: '2024-12-11T22:35:00Z',
      },
    ],
    owner: 'Karen Mitchell',
    createdDate: '2024-01-20',
    lastModifiedDate: '2024-12-11',
    version: '2.5.0',
  },
  {
    id: 'agent_recommendation_engine',
    name: 'Recommendation Engine Agent',
    type: 'recommendation_engine',
    status: 'active',
    description: 'Generates prioritized recommendations for quality improvements, resource allocation, and process optimization based on current metrics, historical patterns, and organizational goals.',
    capabilities: [
      'Prioritized quality improvement recommendation generation',
      'Resource allocation optimization suggestions',
      'Process improvement opportunity identification',
      'Impact estimation for proposed changes',
      'Cross-segment best practice identification and sharing',
      'ROI analysis for recommended improvements',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    assignedApplications: [],
    governancePolicy: {
      id: 'gp_recommendation_engine',
      name: 'Recommendation Engine Governance Policy',
      description: 'Governs the Recommendation Engine Agent including recommendation scope, impact estimation methodology, and implementation authority boundaries.',
      enforcementLevel: 'advisory',
      constraints: [
        'All recommendations are advisory — cannot implement changes directly',
        'Impact estimates must include confidence intervals and assumptions',
        'Resource allocation recommendations must consider current team capacity',
        'Cannot recommend actions that violate existing governance procedures',
        'Critical priority recommendations must be reviewed within 24 hours',
        'Must provide rationale and supporting data for all recommendations',
      ],
      lastReviewDate: '2024-12-03',
      nextReviewDate: '2025-03-03',
      approvedBy: 'Angela Martinez',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 2340,
      tasksInProgress: 4,
      tasksFailed: 28,
      averageCompletionTimeMinutes: 6.2,
      accuracyRate: 88.5,
      humanOverrideRate: 12.3,
      uptimePercent: 99.94,
      trendData: [
        { month: 'Jul', completed: 340, failed: 3 },
        { month: 'Aug', completed: 360, failed: 4 },
        { month: 'Sep', completed: 380, failed: 5 },
        { month: 'Oct', completed: 400, failed: 5 },
        { month: 'Nov', completed: 420, failed: 6 },
        { month: 'Dec', completed: 440, failed: 5 },
      ],
    },
    lastAction: {
      id: 'act_re_001',
      description: 'Generated 12 prioritized recommendations for External segment quality improvement',
      timestamp: '2024-12-12T10:00:00Z',
      outcome: 'success',
      target: 'seg_external',
      details: 'Generated recommendations including: Enable OAuth 2.0 scope enforcement (impact: 10/10, effort: 3 SP), Remediate vendor TLS and BAA compliance (impact: 10/10, effort: 8 SP), Increase test automation coverage to 80% (impact: 7/10, effort: 21 SP). 3 recommendations accepted, 2 in progress, 7 pending review.',
    },
    approvalQueue: [],
    owner: 'Angela Martinez',
    createdDate: '2024-04-01',
    lastModifiedDate: '2024-12-12',
    version: '1.6.0',
  },
  {
    id: 'agent_environment_guardian',
    name: 'Environment Guardian Agent',
    type: 'quality_monitor',
    status: 'idle',
    description: 'Monitors environment health, detects conflicts, manages reservation schedules, and ensures environment readiness for test execution across all deployment environments.',
    capabilities: [
      'Real-time environment health score monitoring',
      'Conflict detection between concurrent deployments and test activities',
      'Environment reservation schedule management and optimization',
      'Service health check orchestration and degradation alerting',
      'Environment capacity planning and utilization analysis',
      'Maintenance window coordination and impact assessment',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
    assignedApplications: [],
    governancePolicy: {
      id: 'gp_environment_guardian',
      name: 'Environment Guardian Governance Policy',
      description: 'Defines the Environment Guardian Agent boundaries including environment access, reservation management authority, and maintenance coordination requirements.',
      enforcementLevel: 'moderate',
      constraints: [
        'Cannot provision or decommission environments without human approval',
        'Must notify environment manager 30 minutes before scheduled maintenance windows',
        'Cannot override existing environment reservations',
        'Environment health alerts must include recommended remediation actions',
        'Cannot modify environment configurations or deployed application versions',
        'Must coordinate with test orchestrator agent before environment status changes',
      ],
      lastReviewDate: '2024-11-20',
      nextReviewDate: '2025-02-20',
      approvedBy: 'Daniel Robinson',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 7890,
      tasksInProgress: 0,
      tasksFailed: 65,
      averageCompletionTimeMinutes: 1.2,
      accuracyRate: 96.8,
      humanOverrideRate: 2.8,
      uptimePercent: 99.97,
      trendData: [
        { month: 'Jul', completed: 1150, failed: 8 },
        { month: 'Aug', completed: 1200, failed: 10 },
        { month: 'Sep', completed: 1250, failed: 11 },
        { month: 'Oct', completed: 1310, failed: 12 },
        { month: 'Nov', completed: 1380, failed: 14 },
        { month: 'Dec', completed: 1600, failed: 10 },
      ],
    },
    lastAction: {
      id: 'act_eg_001',
      description: 'Detected 2 active conflicts in QA External environment (env_qa_04)',
      timestamp: '2024-12-12T12:00:00Z',
      outcome: 'success',
      target: 'env_qa_04',
      details: 'Identified conflicts: (1) API gateway OAuth scope enforcement changes conflict with vendor integration authentication flow, (2) External data feed 2025 CMS format validation conflicts with existing file processing pipeline. Health score: 72.4%. Notifications sent to Alex Rivera.',
    },
    approvalQueue: [],
    owner: 'Daniel Robinson',
    createdDate: '2024-03-10',
    lastModifiedDate: '2024-12-12',
    version: '1.9.0',
  },
  {
    id: 'agent_demand_prioritizer',
    name: 'Demand Prioritization Agent',
    type: 'recommendation_engine',
    status: 'paused',
    description: 'Analyzes the demand pipeline to prioritize work items based on business value, risk, complexity, dependencies, and strategic alignment. Generates prioritization recommendations for demand intake.',
    capabilities: [
      'Multi-criteria demand scoring and ranking',
      'Dependency analysis and sequencing optimization',
      'Business value and ROI estimation for demand items',
      'Resource capacity alignment with demand priorities',
      'Strategic goal alignment scoring',
      'Demand pipeline bottleneck identification',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    assignedApplications: [],
    governancePolicy: {
      id: 'gp_demand_prioritizer',
      name: 'Demand Prioritization Governance Policy',
      description: 'Governs the Demand Prioritization Agent including scoring methodology, priority override rules, and stakeholder notification requirements.',
      enforcementLevel: 'advisory',
      constraints: [
        'Cannot change demand status or priority without human approval',
        'Prioritization recommendations must include scoring rationale',
        'Cannot override manually set priorities by VP-level or above',
        'Must consider regulatory compliance deadlines as non-negotiable constraints',
        'Dependency analysis must be validated by program manager before publication',
      ],
      lastReviewDate: '2024-11-15',
      nextReviewDate: '2025-02-15',
      approvedBy: 'Jennifer Williams',
    },
    humanInLoopRequired: true,
    metrics: {
      tasksCompleted: 890,
      tasksInProgress: 0,
      tasksFailed: 12,
      averageCompletionTimeMinutes: 10.5,
      accuracyRate: 86.2,
      humanOverrideRate: 18.5,
      uptimePercent: 98.50,
      trendData: [
        { month: 'Jul', completed: 145, failed: 2 },
        { month: 'Aug', completed: 152, failed: 2 },
        { month: 'Sep', completed: 158, failed: 2 },
        { month: 'Oct', completed: 165, failed: 3 },
        { month: 'Nov', completed: 170, failed: 2 },
        { month: 'Dec', completed: 100, failed: 1 },
      ],
    },
    lastAction: {
      id: 'act_dp_001',
      description: 'Generated demand prioritization recommendations for Q1 2025 planning',
      timestamp: '2024-12-10T14:00:00Z',
      outcome: 'success',
      target: 'eqip_platform',
      details: 'Analyzed 40 demand items across all segments. Top 5 recommended priorities: (1) HEDIS MY2025 Specification Updates (dem_002), (2) Vendor BAA Compliance Remediation (dem_028), (3) State Reporting Data Accuracy Remediation (dem_034), (4) API Gateway Performance Optimization (dem_004), (5) Medicaid Eligibility Rules Engine Refactor (dem_005). Agent paused pending Q1 planning cycle completion.',
    },
    approvalQueue: [
      {
        id: 'aq_dp_001',
        action: 'Publish Q1 2025 demand prioritization recommendations to segment leaders',
        reason: 'Demand prioritization publications require VP-level approval before distribution',
        priority: 'medium',
        requestedAt: '2024-12-10T14:30:00Z',
        status: 'pending',
        reviewedBy: '',
        reviewedAt: '',
      },
    ],
    owner: 'Jennifer Williams',
    createdDate: '2024-07-01',
    lastModifiedDate: '2024-12-10',
    version: '1.1.0',
  },
  {
    id: 'agent_nlp_search',
    name: 'Natural Language Search Agent',
    type: 'recommendation_engine',
    status: 'active',
    description: 'Processes natural language queries from platform users to search across quality metrics, test results, compliance data, and governance information with intent detection and entity extraction.',
    capabilities: [
      'Natural language query understanding and intent detection',
      'Entity extraction and context-aware search',
      'Multi-domain search across quality, compliance, and operational data',
      'Conversational follow-up query handling',
      'Search result ranking and relevance scoring',
      'Suggested follow-up query generation',
    ],
    assignedSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    assignedApplications: [],
    governancePolicy: {
      id: 'gp_nlp_search',
      name: 'Natural Language Search Governance Policy',
      description: 'Governs the NLP Search Agent including data access scope, query logging requirements, and response accuracy standards.',
      enforcementLevel: 'moderate',
      constraints: [
        'Cannot return PHI or PII data in search results',
        'All queries must be logged for audit trail purposes',
        'Search results must respect persona-based access permissions',
        'Must include confidence scores with all search results',
        'Cannot execute actions based on queries — search is read-only',
        'Response time must not exceed 3 seconds for standard queries',
      ],
      lastReviewDate: '2024-12-08',
      nextReviewDate: '2025-03-08',
      approvedBy: 'Angela Martinez',
    },
    humanInLoopRequired: false,
    metrics: {
      tasksCompleted: 15680,
      tasksInProgress: 1,
      tasksFailed: 120,
      averageCompletionTimeMinutes: 0.2,
      accuracyRate: 92.8,
      humanOverrideRate: 1.5,
      uptimePercent: 99.98,
      trendData: [
        { month: 'Jul', completed: 2200, failed: 15 },
        { month: 'Aug', completed: 2350, failed: 18 },
        { month: 'Sep', completed: 2480, failed: 20 },
        { month: 'Oct', completed: 2620, failed: 22 },
        { month: 'Nov', completed: 2780, failed: 25 },
        { month: 'Dec', completed: 3250, failed: 20 },
      ],
    },
    lastAction: {
      id: 'act_ns_001',
      description: 'Processed natural language query: "What actions should we take to improve the External segment?"',
      timestamp: '2024-12-12T14:30:00Z',
      outcome: 'success',
      target: 'seg_external',
      details: 'Intent detected: recommendation_request. Returned 5 ranked results with relevance scores 85-96%. Generated summary with prioritized action plan. Suggested 3 follow-up queries. Confidence: 91%.',
    },
    approvalQueue: [],
    owner: 'Angela Martinez',
    createdDate: '2024-05-15',
    lastModifiedDate: '2024-12-12',
    version: '2.0.0',
  },
];

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all available agents.
 *
 * @returns {Agent[]} Array of all agent objects
 */
export function getAllAgents() {
  return [...agents];
}

/**
 * Retrieves a single agent by its unique ID.
 *
 * @param {string} agentId - The agent identifier to look up
 * @returns {Agent|null} The matching agent object, or null if not found
 */
export function getAgentById(agentId) {
  if (!agentId || typeof agentId !== 'string') {
    return null;
  }
  return agents.find((a) => a.id === agentId) || null;
}

/**
 * Returns all agents filtered by type.
 *
 * @param {string} type - The agent type to filter by
 * @returns {Agent[]} Array of agents matching the specified type
 */
export function getAgentsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return agents.filter((a) => a.type === type);
}

/**
 * Returns all agents filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'active', 'idle', 'paused', 'error', 'maintenance', 'training')
 * @returns {Agent[]} Array of agents matching the specified status
 */
export function getAgentsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return agents.filter((a) => a.status === status);
}

/**
 * Returns all agents assigned to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {Agent[]} Array of agents assigned to the specified segment
 */
export function getAgentsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return agents.filter((a) => a.assignedSegments.includes(segment));
}

/**
 * Returns all agents assigned to a specific application.
 *
 * @param {string} applicationId - The application ID to filter by
 * @returns {Agent[]} Array of agents assigned to the specified application
 */
export function getAgentsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return agents.filter((a) => a.assignedApplications.includes(applicationId));
}

/**
 * Returns all agents owned by a specific person.
 *
 * @param {string} owner - The owner name to filter by
 * @returns {Agent[]} Array of agents owned by the specified person
 */
export function getAgentsByOwner(owner) {
  if (!owner || typeof owner !== 'string') {
    return [];
  }
  return agents.filter((a) => a.owner === owner);
}

/**
 * Returns all agents that require human-in-the-loop approval.
 *
 * @returns {Agent[]} Array of agents with humanInLoopRequired set to true
 */
export function getAgentsRequiringHumanApproval() {
  return agents.filter((a) => a.humanInLoopRequired);
}

/**
 * Returns all agents that have pending items in their approval queue.
 *
 * @returns {Agent[]} Array of agents with at least one pending approval item
 */
export function getAgentsWithPendingApprovals() {
  return agents.filter((a) => a.approvalQueue.some((item) => item.status === 'pending'));
}

/**
 * Returns all pending approval queue items across all agents.
 *
 * @returns {{ agentId: string, agentName: string, item: ApprovalQueueItem }[]} Array of pending approval items with agent context
 */
export function getAllPendingApprovals() {
  const pending = [];
  for (const agent of agents) {
    for (const item of agent.approvalQueue) {
      if (item.status === 'pending') {
        pending.push({
          agentId: agent.id,
          agentName: agent.name,
          item: { ...item },
        });
      }
    }
  }
  return pending;
}

/**
 * Returns all agents filtered by governance enforcement level.
 *
 * @param {string} enforcementLevel - The enforcement level to filter by (e.g. 'strict', 'moderate', 'advisory')
 * @returns {Agent[]} Array of agents matching the specified enforcement level
 */
export function getAgentsByEnforcementLevel(enforcementLevel) {
  if (!enforcementLevel || typeof enforcementLevel !== 'string') {
    return [];
  }
  return agents.filter((a) => a.governancePolicy.enforcementLevel === enforcementLevel);
}

/**
 * Returns all unique agent types.
 *
 * @returns {string[]} Array of unique agent types sorted alphabetically
 */
export function getAllAgentTypes() {
  const types = new Set(agents.map((a) => a.type));
  return [...types].sort();
}

/**
 * Returns all unique agent statuses.
 *
 * @returns {string[]} Array of unique agent statuses sorted alphabetically
 */
export function getAllAgentStatuses() {
  const statuses = new Set(agents.map((a) => a.status));
  return [...statuses].sort();
}

/**
 * Returns all unique governance enforcement levels.
 *
 * @returns {string[]} Array of unique enforcement levels sorted alphabetically
 */
export function getAllEnforcementLevels() {
  const levels = new Set(agents.map((a) => a.governancePolicy.enforcementLevel));
  return [...levels].sort();
}

/**
 * Returns all unique owner names across all agents.
 *
 * @returns {string[]} Array of unique owner names sorted alphabetically
 */
export function getAllAgentOwners() {
  const owners = new Set(agents.map((a) => a.owner));
  return [...owners].sort();
}

/**
 * Returns aggregate statistics across all agents.
 *
 * @returns {{ totalAgents: number, activeAgents: number, statusBreakdown: Object<string, number>, typeBreakdown: Object<string, number>, totalTasksCompleted: number, totalTasksFailed: number, averageAccuracyRate: number, averageUptimePercent: number, agentsRequiringHumanApproval: number, totalPendingApprovals: number, enforcementLevelBreakdown: Object<string, number> }} Aggregate agent statistics
 */
export function getAgentAggregates() {
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;

  const statusBreakdown = agents.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const typeBreakdown = agents.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  const totalTasksCompleted = agents.reduce((sum, a) => sum + a.metrics.tasksCompleted, 0);
  const totalTasksFailed = agents.reduce((sum, a) => sum + a.metrics.tasksFailed, 0);

  const averageAccuracyRate =
    totalAgents > 0
      ? Math.round((agents.reduce((sum, a) => sum + a.metrics.accuracyRate, 0) / totalAgents) * 10) / 10
      : 0;

  const averageUptimePercent =
    totalAgents > 0
      ? Math.round((agents.reduce((sum, a) => sum + a.metrics.uptimePercent, 0) / totalAgents) * 100) / 100
      : 0;

  const agentsRequiringHumanApproval = agents.filter((a) => a.humanInLoopRequired).length;

  const totalPendingApprovals = agents.reduce(
    (sum, a) => sum + a.approvalQueue.filter((item) => item.status === 'pending').length,
    0
  );

  const enforcementLevelBreakdown = agents.reduce((acc, a) => {
    const level = a.governancePolicy.enforcementLevel;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  return {
    totalAgents,
    activeAgents,
    statusBreakdown,
    typeBreakdown,
    totalTasksCompleted,
    totalTasksFailed,
    averageAccuracyRate,
    averageUptimePercent,
    agentsRequiringHumanApproval,
    totalPendingApprovals,
    enforcementLevelBreakdown,
  };
}

export default agents;