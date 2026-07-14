import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} KnowledgeGraphNode
 * @property {string} id - Unique node identifier
 * @property {string} name - Display name of the node
 * @property {string} type - Node type (application, requirement, code, test, defect, incident, telemetry, org_unit)
 * @property {string} status - Node status (active, inactive, resolved, open, closed, degraded, healthy, at_risk, critical)
 * @property {string} description - Description of the node
 * @property {Object<string, string|number|boolean>} metadata - Additional metadata key-value pairs
 */

/**
 * @typedef {Object} KnowledgeGraphEdge
 * @property {string} id - Unique edge identifier
 * @property {string} source - Source node ID
 * @property {string} target - Target node ID
 * @property {string} relationship - Relationship type (depends_on, tests, covers, caused_by, monitors, owns, implements, discovered_in, related_to, deployed_to, produces, consumes, assigned_to, blocks, resolves)
 * @property {string} description - Description of the relationship
 * @property {number} weight - Relationship strength/weight (0-1)
 */

/**
 * @typedef {Object} KnowledgeGraphData
 * @property {KnowledgeGraphNode[]} nodes - Array of knowledge graph nodes
 * @property {KnowledgeGraphEdge[]} edges - Array of knowledge graph edges
 */

/**
 * Mock knowledge graph nodes for the EQIP Quality Platform.
 * @type {KnowledgeGraphNode[]}
 */
const nodes = [
  // ---------------------------------------------------------------------------
  // Application nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_app_claims',
    name: 'Claims Processing Engine',
    type: 'application',
    status: 'active',
    description: 'Core claims adjudication and processing engine handling all lines of business.',
    metadata: {
      applicationId: 'app_claims_engine',
      segment: 'Enterprise',
      qualityScore: 94.2,
      riskLevel: 'medium',
      owner: 'Jennifer Williams',
    },
  },
  {
    id: 'node_app_member_portal',
    name: 'Member Portal',
    type: 'application',
    status: 'active',
    description: 'Member-facing web portal providing access to benefits, claims history, and health management tools.',
    metadata: {
      applicationId: 'app_member_portal',
      segment: 'Enterprise',
      qualityScore: 96.5,
      riskLevel: 'low',
      owner: 'Rachel Nguyen',
    },
  },
  {
    id: 'node_app_hedis',
    name: 'HEDIS Measure Engine',
    type: 'application',
    status: 'at_risk',
    description: 'HEDIS quality measure calculation engine processing clinical data for NCQA reporting and Star Ratings.',
    metadata: {
      applicationId: 'app_hedis_engine',
      segment: 'Medicare',
      qualityScore: 84.5,
      riskLevel: 'high',
      owner: 'Lisa Johnson',
    },
  },
  {
    id: 'node_app_api_gateway',
    name: 'Partner API Gateway',
    type: 'application',
    status: 'critical',
    description: 'API gateway managing external partner integrations, rate limiting, and authentication.',
    metadata: {
      applicationId: 'app_partner_api_gateway',
      segment: 'External',
      qualityScore: 72.3,
      riskLevel: 'high',
      owner: 'Alex Rivera',
    },
  },
  {
    id: 'node_app_vendor_integration',
    name: 'Vendor Integration Hub',
    type: 'application',
    status: 'critical',
    description: 'Integration hub managing data exchange with external vendors including labs, pharmacies, and TPAs.',
    metadata: {
      applicationId: 'app_vendor_integration',
      segment: 'External',
      qualityScore: 65.8,
      riskLevel: 'high',
      owner: 'Alex Rivera',
    },
  },
  {
    id: 'node_app_medicaid_elig',
    name: 'Medicaid Eligibility Engine',
    type: 'application',
    status: 'at_risk',
    description: 'Medicaid eligibility determination engine processing enrollment and redetermination across multiple state contracts.',
    metadata: {
      applicationId: 'app_medicaid_eligibility',
      segment: 'Medicaid',
      qualityScore: 79.8,
      riskLevel: 'high',
      owner: 'David Park',
    },
  },
  {
    id: 'node_app_auth',
    name: 'Authentication Service',
    type: 'application',
    status: 'active',
    description: 'Centralized authentication and authorization service providing SSO, MFA, and RBAC.',
    metadata: {
      applicationId: 'app_auth_service',
      segment: 'Enterprise',
      qualityScore: 98.1,
      riskLevel: 'high',
      owner: 'Natalie White',
    },
  },
  {
    id: 'node_app_star_ratings',
    name: 'Star Ratings Analytics',
    type: 'application',
    status: 'active',
    description: 'CMS Star Ratings calculation, tracking, and analytics platform for Medicare Advantage and Part D plans.',
    metadata: {
      applicationId: 'app_star_ratings',
      segment: 'Medicare',
      qualityScore: 90.8,
      riskLevel: 'medium',
      owner: 'Emily Davis',
    },
  },
  {
    id: 'node_app_state_reporting',
    name: 'State Regulatory Reporting',
    type: 'application',
    status: 'at_risk',
    description: 'Regulatory reporting platform generating and submitting required reports to state Medicaid agencies.',
    metadata: {
      applicationId: 'app_state_reporting',
      segment: 'Medicaid',
      qualityScore: 76.4,
      riskLevel: 'high',
      owner: 'Patricia Evans',
    },
  },
  {
    id: 'node_app_care_mgmt',
    name: 'Care Management Platform',
    type: 'application',
    status: 'at_risk',
    description: 'Care management platform supporting care coordinators with member outreach and gap closure tracking.',
    metadata: {
      applicationId: 'app_care_management',
      segment: 'Medicaid',
      qualityScore: 82.3,
      riskLevel: 'medium',
      owner: 'Amanda Garcia',
    },
  },
  {
    id: 'node_app_data_warehouse',
    name: 'Enterprise Data Warehouse',
    type: 'application',
    status: 'active',
    description: 'Centralized data warehouse aggregating data from all operational systems for analytics and reporting.',
    metadata: {
      applicationId: 'app_data_warehouse',
      segment: 'Enterprise',
      qualityScore: 89.3,
      riskLevel: 'medium',
      owner: 'Samantha Clark',
    },
  },
  {
    id: 'node_app_compliance_dash',
    name: 'Compliance Dashboard',
    type: 'application',
    status: 'active',
    description: 'Executive compliance dashboard providing real-time visibility into regulatory compliance status.',
    metadata: {
      applicationId: 'app_compliance_dashboard',
      segment: 'Compliance',
      qualityScore: 97.2,
      riskLevel: 'low',
      owner: 'Angela Martinez',
    },
  },

  // ---------------------------------------------------------------------------
  // Requirement nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_req_hedis_my2025',
    name: 'HEDIS MY2025 Specification Updates',
    type: 'requirement',
    status: 'active',
    description: 'Update all HEDIS measure calculation logic to align with NCQA MY2025 technical specifications.',
    metadata: {
      demandId: 'dem_002',
      priority: 'critical',
      segment: 'Medicare',
      estimatedEffort: 34,
      targetDate: '2025-02-28',
    },
  },
  {
    id: 'node_req_oauth_enforcement',
    name: 'OAuth 2.0 Scope Enforcement',
    type: 'requirement',
    status: 'active',
    description: 'Enable OAuth 2.0 scope enforcement on the partner API gateway to prevent unauthorized resource access.',
    metadata: {
      demandId: 'dem_037',
      priority: 'high',
      segment: 'External',
      estimatedEffort: 8,
      targetDate: '2025-02-28',
    },
  },
  {
    id: 'node_req_baa_compliance',
    name: 'Vendor BAA Compliance Remediation',
    type: 'requirement',
    status: 'active',
    description: 'Implement encrypted data channels and enforce BAA agreements for all vendor data exchanges.',
    metadata: {
      demandId: 'dem_028',
      priority: 'critical',
      segment: 'External',
      estimatedEffort: 8,
      targetDate: '2025-01-31',
    },
  },
  {
    id: 'node_req_eligibility_refactor',
    name: 'Medicaid Eligibility Rules Engine Refactor',
    type: 'requirement',
    status: 'active',
    description: 'Refactor the Medicaid eligibility rules engine to support multi-state configuration and improve processing time.',
    metadata: {
      demandId: 'dem_005',
      priority: 'high',
      segment: 'Medicaid',
      estimatedEffort: 34,
      targetDate: '2025-04-30',
    },
  },
  {
    id: 'node_req_state_reporting_auto',
    name: 'State Regulatory Reporting Automation',
    type: 'requirement',
    status: 'active',
    description: 'Automate state regulatory report generation and submission workflows across all contracted states.',
    metadata: {
      demandId: 'dem_013',
      priority: 'critical',
      segment: 'Medicaid',
      estimatedEffort: 21,
      targetDate: '2025-02-28',
    },
  },
  {
    id: 'node_req_api_perf',
    name: 'API Gateway Performance Optimization',
    type: 'requirement',
    status: 'active',
    description: 'Optimize API gateway performance to meet 99.9% SLA requirements.',
    metadata: {
      demandId: 'dem_004',
      priority: 'critical',
      segment: 'External',
      estimatedEffort: 21,
      targetDate: '2025-01-15',
    },
  },
  {
    id: 'node_req_accessibility',
    name: 'Member Portal Accessibility Remediation',
    type: 'requirement',
    status: 'active',
    description: 'Remediate WCAG 2.1 AA accessibility findings including keyboard navigation and screen reader compatibility.',
    metadata: {
      demandId: 'dem_003',
      priority: 'high',
      segment: 'Enterprise',
      estimatedEffort: 13,
      targetDate: '2025-03-15',
    },
  },

  // ---------------------------------------------------------------------------
  // Code nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_code_bcs_exclusion',
    name: 'BCS Exclusion Logic Module',
    type: 'code',
    status: 'at_risk',
    description: 'BCS measure bilateral mastectomy exclusion logic missing ICD-10-PCS codes.',
    metadata: {
      repository: 'hedis-engine',
      module: 'measures/bcs/exclusions',
      language: 'Java',
      linesOfCode: 2450,
      coverage: 85.2,
    },
  },
  {
    id: 'node_code_cdc_valueset',
    name: 'CDC Value Set Configuration',
    type: 'code',
    status: 'at_risk',
    description: 'CDC HbA1c sub-measure ESRD exclusion using outdated value set without 2024 diagnosis codes.',
    metadata: {
      repository: 'hedis-engine',
      module: 'measures/cdc/valuesets',
      language: 'Java',
      linesOfCode: 1820,
      coverage: 78.6,
    },
  },
  {
    id: 'node_code_oauth_plugin',
    name: 'Kong OAuth Plugin Configuration',
    type: 'code',
    status: 'critical',
    description: 'Kong OAuth plugin with scope_required parameter set to false, disabling scope enforcement.',
    metadata: {
      repository: 'api-gateway',
      module: 'plugins/oauth',
      language: 'Go',
      linesOfCode: 680,
      coverage: 72.3,
    },
  },
  {
    id: 'node_code_income_threshold',
    name: 'Income Threshold Comparison Logic',
    type: 'code',
    status: 'critical',
    description: 'Medicaid eligibility income threshold uses strict less-than instead of less-than-or-equal-to for 138% FPL cutoff.',
    metadata: {
      repository: 'medicaid-eligibility',
      module: 'rules/income',
      language: 'Java',
      linesOfCode: 1240,
      coverage: 74.8,
    },
  },
  {
    id: 'node_code_tls_config',
    name: 'Vendor TLS Configuration',
    type: 'code',
    status: 'critical',
    description: 'Vendor integration TLS configuration still includes TLS 1.1 in allowed protocols list.',
    metadata: {
      repository: 'vendor-integration',
      module: 'security/tls',
      language: 'Java',
      linesOfCode: 420,
      coverage: 66.4,
    },
  },
  {
    id: 'node_code_rate_limiter',
    name: 'Rate Limiter Algorithm',
    type: 'code',
    status: 'at_risk',
    description: 'Sliding window rate limiter with 5-second granularity causing up to 8.7% over-admission at window boundaries.',
    metadata: {
      repository: 'api-gateway',
      module: 'middleware/ratelimit',
      language: 'Go',
      linesOfCode: 950,
      coverage: 68.5,
    },
  },
  {
    id: 'node_code_outreach_form',
    name: 'Outreach Form Validation',
    type: 'code',
    status: 'at_risk',
    description: 'Outreach form validation does not require follow-up action for non-contact outcomes.',
    metadata: {
      repository: 'care-management',
      module: 'forms/outreach',
      language: 'JavaScript',
      linesOfCode: 580,
      coverage: 76.3,
    },
  },
  {
    id: 'node_code_claims_adjudication',
    name: 'Claims Adjudication Engine',
    type: 'code',
    status: 'active',
    description: 'Core claims adjudication rules engine processing Medicare, Medicaid, and Commercial claims.',
    metadata: {
      repository: 'claims-engine',
      module: 'adjudication/core',
      language: 'Java',
      linesOfCode: 12500,
      coverage: 91.4,
    },
  },

  // ---------------------------------------------------------------------------
  // Test nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_test_bcs_calc',
    name: 'BCS Measure Calculation Test',
    type: 'test',
    status: 'open',
    description: 'HEDIS BCS measure calculation test failed — BCS measure rate 72.3% does not match expected 74.1%.',
    metadata: {
      testCaseId: 'tc_016',
      executionId: 'exec_008',
      testType: 'functional',
      priority: 'critical',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_cdc_hba1c',
    name: 'CDC HbA1c Sub-Measure Test',
    type: 'test',
    status: 'open',
    description: 'CDC HbA1c poor control sub-measure test failed — rate deviation of 2.3% from expected value.',
    metadata: {
      testCaseId: 'tc_050',
      executionId: 'exec_023',
      testType: 'functional',
      priority: 'critical',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_oauth_validation',
    name: 'OAuth 2.0 Token Validation Test',
    type: 'test',
    status: 'open',
    description: 'API Gateway OAuth 2.0 token validation test failed — token with insufficient scopes returned 200 OK.',
    metadata: {
      testCaseId: 'tc_035',
      executionId: 'exec_015',
      testType: 'security',
      priority: 'critical',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_eligibility_determination',
    name: 'Medicaid Eligibility Determination Test',
    type: 'test',
    status: 'open',
    description: 'Medicaid eligibility determination test failed — applicant at 135% FPL incorrectly determined as ineligible.',
    metadata: {
      testCaseId: 'tc_021',
      executionId: 'exec_010',
      testType: 'functional',
      priority: 'critical',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_tls_enforcement',
    name: 'Vendor TLS Enforcement Test',
    type: 'test',
    status: 'open',
    description: 'Vendor integration encrypted data channel test failed — TLS 1.1 connection accepted.',
    metadata: {
      testCaseId: 'tc_036',
      executionId: 'exec_016',
      testType: 'security',
      priority: 'critical',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_rate_limiting',
    name: 'API Gateway Rate Limiting Test',
    type: 'test',
    status: 'open',
    description: 'API gateway rate limiting test failed — allows 8.7% excess requests at window boundaries.',
    metadata: {
      testCaseId: 'tc_034',
      executionId: 'exec_014',
      testType: 'performance',
      priority: 'critical',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_hedis_perf',
    name: 'HEDIS Engine Performance Test',
    type: 'test',
    status: 'open',
    description: 'HEDIS engine full population performance test failed — processing took 4h 45m, exceeding 4h SLA.',
    metadata: {
      testCaseId: 'tc_018',
      executionId: 'exec_009',
      testType: 'performance',
      priority: 'high',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_outreach_compliance',
    name: 'Outreach Tracking Compliance Test',
    type: 'test',
    status: 'open',
    description: 'Member outreach tracking compliance test failed — 87% field completion instead of mandated 100%.',
    metadata: {
      testCaseId: 'tc_026',
      executionId: 'exec_013',
      testType: 'regression',
      priority: 'high',
      lastResult: 'failed',
    },
  },
  {
    id: 'node_test_claims_batch',
    name: 'Claims Batch Processing Test',
    type: 'test',
    status: 'resolved',
    description: 'Claims batch processing performance test passed — 10,000 claims processed in 28m 15s within 30m SLA.',
    metadata: {
      testCaseId: 'tc_002',
      executionId: 'exec_002',
      testType: 'performance',
      priority: 'high',
      lastResult: 'passed',
    },
  },
  {
    id: 'node_test_phi_encryption',
    name: 'HIPAA PHI Encryption Test',
    type: 'test',
    status: 'resolved',
    description: 'HIPAA PHI encryption at rest test passed — all PHI fields encrypted using AES-256.',
    metadata: {
      testCaseId: 'tc_046',
      executionId: 'exec_022',
      testType: 'security',
      priority: 'critical',
      lastResult: 'passed',
    },
  },
  {
    id: 'node_test_a11y_keyboard',
    name: 'Keyboard Navigation Accessibility Test',
    type: 'test',
    status: 'resolved',
    description: 'WCAG 2.1 AA keyboard navigation test passed — all interactive elements keyboard accessible.',
    metadata: {
      testCaseId: 'tc_004',
      executionId: 'exec_035',
      testType: 'accessibility',
      priority: 'high',
      lastResult: 'passed',
    },
  },

  // ---------------------------------------------------------------------------
  // Defect nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_defect_bcs_exclusion',
    name: 'BCS Exclusion Missing ICD-10-PCS Codes',
    type: 'defect',
    status: 'open',
    description: 'BCS measure exclusion logic missing ICD-10-PCS codes for bilateral mastectomy causing 1.8% rate deviation.',
    metadata: {
      defectId: 'DEF-2024-0872',
      severity: 'critical',
      assignee: 'Lisa Johnson',
      findingId: 'af_001',
      application: 'app_hedis_engine',
    },
  },
  {
    id: 'node_defect_oauth_scope',
    name: 'OAuth Scope Enforcement Disabled',
    type: 'defect',
    status: 'open',
    description: 'Kong OAuth plugin scope_required parameter set to false allowing unauthorized resource access.',
    metadata: {
      defectId: 'DEF-2024-0830',
      severity: 'critical',
      assignee: 'Natalie White',
      findingId: 'af_002',
      application: 'app_partner_api_gateway',
    },
  },
  {
    id: 'node_defect_tls_11',
    name: 'Vendor TLS 1.1 Acceptance',
    type: 'defect',
    status: 'open',
    description: 'Vendor integration hub accepts deprecated TLS 1.1 connections violating minimum TLS 1.2 requirement.',
    metadata: {
      defectId: 'DEF-2024-0820',
      severity: 'critical',
      assignee: 'Natalie White',
      findingId: 'af_003',
      application: 'app_vendor_integration',
    },
  },
  {
    id: 'node_defect_baa_enforcement',
    name: 'BAA Enforcement Gap',
    type: 'defect',
    status: 'open',
    description: 'BAA validation implemented as warning log rather than blocking enforcement for vendor data exchange.',
    metadata: {
      defectId: 'DEF-2024-0821',
      severity: 'critical',
      assignee: 'Alex Rivera',
      findingId: 'af_004',
      application: 'app_vendor_integration',
    },
  },
  {
    id: 'node_defect_income_operator',
    name: 'Income Threshold Comparison Operator Error',
    type: 'defect',
    status: 'open',
    description: 'Income threshold comparison uses strict less-than instead of less-than-or-equal-to for 138% FPL cutoff.',
    metadata: {
      defectId: 'DEF-2024-0882',
      severity: 'critical',
      assignee: 'Robert Kim',
      findingId: 'af_006',
      application: 'app_medicaid_eligibility',
    },
  },
  {
    id: 'node_defect_rate_limit_accuracy',
    name: 'Rate Limiter Over-Admission',
    type: 'defect',
    status: 'open',
    description: 'API gateway rate limiter allows up to 8.7% excess requests at sliding window boundaries.',
    metadata: {
      defectId: 'DEF-2024-0835',
      severity: 'high',
      assignee: 'Alex Rivera',
      findingId: 'af_008',
      application: 'app_partner_api_gateway',
    },
  },
  {
    id: 'node_defect_outreach_validation',
    name: 'Outreach Follow-Up Action Not Required',
    type: 'defect',
    status: 'open',
    description: 'Outreach form does not require follow-up action for non-contact outcomes resulting in 87% field completion.',
    metadata: {
      defectId: 'DEF-2024-0888',
      severity: 'high',
      assignee: 'James Wright',
      findingId: 'af_007',
      application: 'app_care_management',
    },
  },
  {
    id: 'node_defect_hedis_perf_sla',
    name: 'HEDIS Engine SLA Breach',
    type: 'defect',
    status: 'open',
    description: 'HEDIS engine exceeds 4-hour SLA for full population measure calculation by 45 minutes.',
    metadata: {
      defectId: 'DEF-2024-0860',
      severity: 'high',
      assignee: 'Marcus Thompson',
      findingId: 'af_010',
      application: 'app_hedis_engine',
    },
  },
  {
    id: 'node_defect_cdc_valueset',
    name: 'CDC ESRD Value Set Outdated',
    type: 'defect',
    status: 'open',
    description: 'CDC HbA1c sub-measure exclusion logic using outdated ESRD value set without 2024 diagnosis codes.',
    metadata: {
      defectId: 'DEF-2024-0875',
      severity: 'critical',
      assignee: 'Lisa Johnson',
      findingId: 'af_001',
      application: 'app_hedis_engine',
    },
  },

  // ---------------------------------------------------------------------------
  // Incident nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_incident_qa_hotfix',
    name: 'QA Hotfix Environment Failure',
    type: 'incident',
    status: 'open',
    description: 'QA Hotfix environment offline due to infrastructure failure. Incident ticket INC-2024-1205 opened.',
    metadata: {
      incidentId: 'INC-2024-1205',
      severity: 'P1',
      environment: 'env_qa_hotfix',
      detectedAt: '2024-12-11T22:15:00Z',
      assignee: 'Daniel Robinson',
    },
  },
  {
    id: 'node_incident_fieldglass',
    name: 'Fieldglass Integration Certificate Expired',
    type: 'incident',
    status: 'open',
    description: 'SAP Fieldglass integration sync failed due to expired authentication certificate for service account.',
    metadata: {
      incidentId: 'INC-2024-1210',
      severity: 'P2',
      integration: 'int_fieldglass',
      detectedAt: '2024-12-12T06:00:00Z',
      assignee: 'Brian Foster',
    },
  },
  {
    id: 'node_incident_vendor_degraded',
    name: 'Production Vendor Integration Degraded',
    type: 'incident',
    status: 'active',
    description: 'Vendor Integration service in Production US-East degraded with 280ms response time.',
    metadata: {
      incidentId: 'INC-2024-1215',
      severity: 'P3',
      environment: 'env_prod_01',
      detectedAt: '2024-12-12T14:55:00Z',
      assignee: 'Karen Mitchell',
    },
  },

  // ---------------------------------------------------------------------------
  // Telemetry nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_telemetry_claims_uptime',
    name: 'Claims Engine Uptime Monitor',
    type: 'telemetry',
    status: 'healthy',
    description: 'Real-time uptime monitoring for Claims Processing Engine showing 99.95% availability.',
    metadata: {
      metricType: 'uptime',
      currentValue: 99.95,
      threshold: 99.9,
      unit: 'percent',
      source: 'Dynatrace',
    },
  },
  {
    id: 'node_telemetry_api_response',
    name: 'API Gateway Response Time Monitor',
    type: 'telemetry',
    status: 'degraded',
    description: 'API gateway response time monitoring showing degradation to 2.3s under sustained load.',
    metadata: {
      metricType: 'response_time',
      currentValue: 2300,
      threshold: 500,
      unit: 'milliseconds',
      source: 'Dynatrace',
    },
  },
  {
    id: 'node_telemetry_hedis_processing',
    name: 'HEDIS Processing Time Monitor',
    type: 'telemetry',
    status: 'degraded',
    description: 'HEDIS engine full population processing time monitoring showing 4h 45m vs 4h SLA.',
    metadata: {
      metricType: 'processing_time',
      currentValue: 285,
      threshold: 240,
      unit: 'minutes',
      source: 'Splunk',
    },
  },
  {
    id: 'node_telemetry_auth_uptime',
    name: 'Auth Service Uptime Monitor',
    type: 'telemetry',
    status: 'healthy',
    description: 'Authentication service uptime monitoring showing 99.99% availability.',
    metadata: {
      metricType: 'uptime',
      currentValue: 99.99,
      threshold: 99.9,
      unit: 'percent',
      source: 'Dynatrace',
    },
  },
  {
    id: 'node_telemetry_vendor_health',
    name: 'Vendor Integration Health Monitor',
    type: 'telemetry',
    status: 'degraded',
    description: 'Vendor integration hub health monitoring showing 99.65% uptime with elevated error rates.',
    metadata: {
      metricType: 'uptime',
      currentValue: 99.65,
      threshold: 99.9,
      unit: 'percent',
      source: 'Dynatrace',
    },
  },
  {
    id: 'node_telemetry_qa_external_health',
    name: 'QA External Environment Health',
    type: 'telemetry',
    status: 'degraded',
    description: 'QA External environment health score at 72.4% with unhealthy vendor integration service.',
    metadata: {
      metricType: 'health_score',
      currentValue: 72.4,
      threshold: 80,
      unit: 'percent',
      source: 'Environment Guardian Agent',
    },
  },

  // ---------------------------------------------------------------------------
  // Org unit nodes
  // ---------------------------------------------------------------------------
  {
    id: 'node_org_enterprise',
    name: 'Enterprise Segment',
    type: 'org_unit',
    status: 'active',
    description: 'Enterprise-wide applications and services spanning all business units and shared infrastructure.',
    metadata: {
      segmentId: 'seg_enterprise',
      qualityScore: 88.5,
      complianceRate: 94.2,
      applicationCount: 6,
      owner: 'Jennifer Williams',
    },
  },
  {
    id: 'node_org_medicare',
    name: 'Medicare Segment',
    type: 'org_unit',
    status: 'active',
    description: 'Medicare segment covering Medicare Advantage, Part D, and supplemental benefit programs.',
    metadata: {
      segmentId: 'seg_medicare',
      qualityScore: 91.3,
      complianceRate: 96.8,
      applicationCount: 5,
      owner: 'Michael Torres',
    },
  },
  {
    id: 'node_org_medicaid',
    name: 'Medicaid Segment',
    type: 'org_unit',
    status: 'at_risk',
    description: 'Medicaid managed care programs across multiple state contracts and regulatory environments.',
    metadata: {
      segmentId: 'seg_medicaid',
      qualityScore: 78.4,
      complianceRate: 85.6,
      applicationCount: 4,
      owner: 'David Park',
    },
  },
  {
    id: 'node_org_external',
    name: 'External Segment',
    type: 'org_unit',
    status: 'critical',
    description: 'External-facing integrations, partner APIs, and vendor-managed services.',
    metadata: {
      segmentId: 'seg_external',
      qualityScore: 72.1,
      complianceRate: 80.4,
      applicationCount: 3,
      owner: 'Alex Rivera',
    },
  },
  {
    id: 'node_org_compliance',
    name: 'Compliance Segment',
    type: 'org_unit',
    status: 'active',
    description: 'Regulatory compliance, audit management, and quality assurance systems.',
    metadata: {
      segmentId: 'seg_compliance',
      qualityScore: 93.2,
      complianceRate: 98.1,
      applicationCount: 4,
      owner: 'Patricia Evans',
    },
  },
  {
    id: 'node_org_qe_team',
    name: 'Quality Engineering Team',
    type: 'org_unit',
    status: 'active',
    description: 'Cross-functional quality engineering team responsible for test strategy, automation, and quality governance.',
    metadata: {
      teamSize: 25,
      leader: 'Angela Martinez',
      vpQE: 'Jennifer Williams',
      automationCoverage: 83.7,
    },
  },
];

/**
 * Mock knowledge graph edges for the EQIP Quality Platform.
 * @type {KnowledgeGraphEdge[]}
 */
const edges = [
  // ---------------------------------------------------------------------------
  // Application → Application (depends_on)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_001',
    source: 'node_app_member_portal',
    target: 'node_app_claims',
    relationship: 'depends_on',
    description: 'Member Portal depends on Claims Processing Engine for claims history and status data.',
    weight: 0.9,
  },
  {
    id: 'edge_002',
    source: 'node_app_member_portal',
    target: 'node_app_auth',
    relationship: 'depends_on',
    description: 'Member Portal depends on Authentication Service for SSO and MFA.',
    weight: 1.0,
  },
  {
    id: 'edge_003',
    source: 'node_app_hedis',
    target: 'node_app_data_warehouse',
    relationship: 'depends_on',
    description: 'HEDIS Engine depends on Data Warehouse for clinical data and supplemental data sources.',
    weight: 0.95,
  },
  {
    id: 'edge_004',
    source: 'node_app_star_ratings',
    target: 'node_app_hedis',
    relationship: 'depends_on',
    description: 'Star Ratings Analytics depends on HEDIS Engine for measure rate calculations.',
    weight: 1.0,
  },
  {
    id: 'edge_005',
    source: 'node_app_vendor_integration',
    target: 'node_app_api_gateway',
    relationship: 'depends_on',
    description: 'Vendor Integration Hub depends on Partner API Gateway for external connectivity.',
    weight: 0.8,
  },
  {
    id: 'edge_006',
    source: 'node_app_state_reporting',
    target: 'node_app_medicaid_elig',
    relationship: 'depends_on',
    description: 'State Regulatory Reporting depends on Medicaid Eligibility Engine for enrollment data.',
    weight: 0.9,
  },
  {
    id: 'edge_007',
    source: 'node_app_care_mgmt',
    target: 'node_app_medicaid_elig',
    relationship: 'depends_on',
    description: 'Care Management Platform depends on Medicaid Eligibility Engine for member eligibility status.',
    weight: 0.85,
  },
  {
    id: 'edge_008',
    source: 'node_app_state_reporting',
    target: 'node_app_data_warehouse',
    relationship: 'depends_on',
    description: 'State Regulatory Reporting depends on Data Warehouse for aggregated reporting data.',
    weight: 0.9,
  },
  {
    id: 'edge_009',
    source: 'node_app_compliance_dash',
    target: 'node_app_data_warehouse',
    relationship: 'consumes',
    description: 'Compliance Dashboard consumes compliance metrics from the Enterprise Data Warehouse.',
    weight: 0.85,
  },
  {
    id: 'edge_010',
    source: 'node_app_api_gateway',
    target: 'node_app_auth',
    relationship: 'depends_on',
    description: 'Partner API Gateway depends on Authentication Service for OAuth token validation.',
    weight: 1.0,
  },

  // ---------------------------------------------------------------------------
  // Requirement → Application (implements)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_011',
    source: 'node_app_hedis',
    target: 'node_req_hedis_my2025',
    relationship: 'implements',
    description: 'HEDIS Engine implements the MY2025 specification update requirement.',
    weight: 1.0,
  },
  {
    id: 'edge_012',
    source: 'node_app_api_gateway',
    target: 'node_req_oauth_enforcement',
    relationship: 'implements',
    description: 'Partner API Gateway implements the OAuth 2.0 scope enforcement requirement.',
    weight: 1.0,
  },
  {
    id: 'edge_013',
    source: 'node_app_vendor_integration',
    target: 'node_req_baa_compliance',
    relationship: 'implements',
    description: 'Vendor Integration Hub implements the BAA compliance remediation requirement.',
    weight: 1.0,
  },
  {
    id: 'edge_014',
    source: 'node_app_medicaid_elig',
    target: 'node_req_eligibility_refactor',
    relationship: 'implements',
    description: 'Medicaid Eligibility Engine implements the rules engine refactor requirement.',
    weight: 1.0,
  },
  {
    id: 'edge_015',
    source: 'node_app_state_reporting',
    target: 'node_req_state_reporting_auto',
    relationship: 'implements',
    description: 'State Regulatory Reporting implements the reporting automation requirement.',
    weight: 1.0,
  },
  {
    id: 'edge_016',
    source: 'node_app_api_gateway',
    target: 'node_req_api_perf',
    relationship: 'implements',
    description: 'Partner API Gateway implements the performance optimization requirement.',
    weight: 1.0,
  },
  {
    id: 'edge_017',
    source: 'node_app_member_portal',
    target: 'node_req_accessibility',
    relationship: 'implements',
    description: 'Member Portal implements the accessibility remediation requirement.',
    weight: 1.0,
  },

  // ---------------------------------------------------------------------------
  // Test → Code (tests)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_018',
    source: 'node_test_bcs_calc',
    target: 'node_code_bcs_exclusion',
    relationship: 'tests',
    description: 'BCS measure calculation test validates the BCS exclusion logic module.',
    weight: 1.0,
  },
  {
    id: 'edge_019',
    source: 'node_test_cdc_hba1c',
    target: 'node_code_cdc_valueset',
    relationship: 'tests',
    description: 'CDC HbA1c sub-measure test validates the CDC value set configuration.',
    weight: 1.0,
  },
  {
    id: 'edge_020',
    source: 'node_test_oauth_validation',
    target: 'node_code_oauth_plugin',
    relationship: 'tests',
    description: 'OAuth token validation test validates the Kong OAuth plugin configuration.',
    weight: 1.0,
  },
  {
    id: 'edge_021',
    source: 'node_test_eligibility_determination',
    target: 'node_code_income_threshold',
    relationship: 'tests',
    description: 'Medicaid eligibility determination test validates the income threshold comparison logic.',
    weight: 1.0,
  },
  {
    id: 'edge_022',
    source: 'node_test_tls_enforcement',
    target: 'node_code_tls_config',
    relationship: 'tests',
    description: 'Vendor TLS enforcement test validates the vendor TLS configuration.',
    weight: 1.0,
  },
  {
    id: 'edge_023',
    source: 'node_test_rate_limiting',
    target: 'node_code_rate_limiter',
    relationship: 'tests',
    description: 'API gateway rate limiting test validates the rate limiter algorithm.',
    weight: 1.0,
  },
  {
    id: 'edge_024',
    source: 'node_test_outreach_compliance',
    target: 'node_code_outreach_form',
    relationship: 'tests',
    description: 'Outreach tracking compliance test validates the outreach form validation logic.',
    weight: 1.0,
  },
  {
    id: 'edge_025',
    source: 'node_test_claims_batch',
    target: 'node_code_claims_adjudication',
    relationship: 'tests',
    description: 'Claims batch processing test validates the claims adjudication engine performance.',
    weight: 0.9,
  },

  // ---------------------------------------------------------------------------
  // Test → Application (covers)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_026',
    source: 'node_test_bcs_calc',
    target: 'node_app_hedis',
    relationship: 'covers',
    description: 'BCS measure calculation test covers the HEDIS Measure Engine application.',
    weight: 0.8,
  },
  {
    id: 'edge_027',
    source: 'node_test_oauth_validation',
    target: 'node_app_api_gateway',
    relationship: 'covers',
    description: 'OAuth token validation test covers the Partner API Gateway application.',
    weight: 0.9,
  },
  {
    id: 'edge_028',
    source: 'node_test_eligibility_determination',
    target: 'node_app_medicaid_elig',
    relationship: 'covers',
    description: 'Medicaid eligibility determination test covers the Medicaid Eligibility Engine.',
    weight: 0.85,
  },
  {
    id: 'edge_029',
    source: 'node_test_tls_enforcement',
    target: 'node_app_vendor_integration',
    relationship: 'covers',
    description: 'Vendor TLS enforcement test covers the Vendor Integration Hub.',
    weight: 0.9,
  },
  {
    id: 'edge_030',
    source: 'node_test_phi_encryption',
    target: 'node_app_claims',
    relationship: 'covers',
    description: 'HIPAA PHI encryption test covers the Claims Processing Engine.',
    weight: 0.7,
  },
  {
    id: 'edge_031',
    source: 'node_test_a11y_keyboard',
    target: 'node_app_member_portal',
    relationship: 'covers',
    description: 'Keyboard navigation accessibility test covers the Member Portal.',
    weight: 0.6,
  },

  // ---------------------------------------------------------------------------
  // Defect → Code (caused_by)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_032',
    source: 'node_defect_bcs_exclusion',
    target: 'node_code_bcs_exclusion',
    relationship: 'caused_by',
    description: 'BCS exclusion defect is caused by missing ICD-10-PCS codes in the exclusion logic module.',
    weight: 1.0,
  },
  {
    id: 'edge_033',
    source: 'node_defect_oauth_scope',
    target: 'node_code_oauth_plugin',
    relationship: 'caused_by',
    description: 'OAuth scope enforcement defect is caused by disabled scope_required parameter in Kong plugin.',
    weight: 1.0,
  },
  {
    id: 'edge_034',
    source: 'node_defect_tls_11',
    target: 'node_code_tls_config',
    relationship: 'caused_by',
    description: 'TLS 1.1 acceptance defect is caused by TLS 1.1 remaining in allowed protocols list.',
    weight: 1.0,
  },
  {
    id: 'edge_035',
    source: 'node_defect_income_operator',
    target: 'node_code_income_threshold',
    relationship: 'caused_by',
    description: 'Income threshold defect is caused by incorrect comparison operator in eligibility rules.',
    weight: 1.0,
  },
  {
    id: 'edge_036',
    source: 'node_defect_rate_limit_accuracy',
    target: 'node_code_rate_limiter',
    relationship: 'caused_by',
    description: 'Rate limiter over-admission defect is caused by 5-second granularity in sliding window algorithm.',
    weight: 1.0,
  },
  {
    id: 'edge_037',
    source: 'node_defect_outreach_validation',
    target: 'node_code_outreach_form',
    relationship: 'caused_by',
    description: 'Outreach validation defect is caused by missing required field enforcement for non-contact outcomes.',
    weight: 1.0,
  },
  {
    id: 'edge_038',
    source: 'node_defect_cdc_valueset',
    target: 'node_code_cdc_valueset',
    relationship: 'caused_by',
    description: 'CDC value set defect is caused by outdated ESRD value set without 2024 diagnosis codes.',
    weight: 1.0,
  },

  // ---------------------------------------------------------------------------
  // Defect → Test (discovered_in)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_039',
    source: 'node_defect_bcs_exclusion',
    target: 'node_test_bcs_calc',
    relationship: 'discovered_in',
    description: 'BCS exclusion defect was discovered in the BCS measure calculation test.',
    weight: 1.0,
  },
  {
    id: 'edge_040',
    source: 'node_defect_oauth_scope',
    target: 'node_test_oauth_validation',
    relationship: 'discovered_in',
    description: 'OAuth scope enforcement defect was discovered in the OAuth token validation test.',
    weight: 1.0,
  },
  {
    id: 'edge_041',
    source: 'node_defect_tls_11',
    target: 'node_test_tls_enforcement',
    relationship: 'discovered_in',
    description: 'TLS 1.1 acceptance defect was discovered in the vendor TLS enforcement test.',
    weight: 1.0,
  },
  {
    id: 'edge_042',
    source: 'node_defect_income_operator',
    target: 'node_test_eligibility_determination',
    relationship: 'discovered_in',
    description: 'Income threshold defect was discovered in the Medicaid eligibility determination test.',
    weight: 1.0,
  },
  {
    id: 'edge_043',
    source: 'node_defect_rate_limit_accuracy',
    target: 'node_test_rate_limiting',
    relationship: 'discovered_in',
    description: 'Rate limiter defect was discovered in the API gateway rate limiting test.',
    weight: 1.0,
  },
  {
    id: 'edge_044',
    source: 'node_defect_outreach_validation',
    target: 'node_test_outreach_compliance',
    relationship: 'discovered_in',
    description: 'Outreach validation defect was discovered in the outreach tracking compliance test.',
    weight: 1.0,
  },
  {
    id: 'edge_045',
    source: 'node_defect_cdc_valueset',
    target: 'node_test_cdc_hba1c',
    relationship: 'discovered_in',
    description: 'CDC value set defect was discovered in the CDC HbA1c sub-measure test.',
    weight: 1.0,
  },

  // ---------------------------------------------------------------------------
  // Requirement → Defect (resolves)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_046',
    source: 'node_req_hedis_my2025',
    target: 'node_defect_bcs_exclusion',
    relationship: 'resolves',
    description: 'HEDIS MY2025 specification updates will resolve the BCS exclusion defect.',
    weight: 0.9,
  },
  {
    id: 'edge_047',
    source: 'node_req_hedis_my2025',
    target: 'node_defect_cdc_valueset',
    relationship: 'resolves',
    description: 'HEDIS MY2025 specification updates will resolve the CDC value set defect.',
    weight: 0.9,
  },
  {
    id: 'edge_048',
    source: 'node_req_oauth_enforcement',
    target: 'node_defect_oauth_scope',
    relationship: 'resolves',
    description: 'OAuth 2.0 scope enforcement requirement will resolve the OAuth scope defect.',
    weight: 1.0,
  },
  {
    id: 'edge_049',
    source: 'node_req_baa_compliance',
    target: 'node_defect_tls_11',
    relationship: 'resolves',
    description: 'BAA compliance remediation will resolve the TLS 1.1 acceptance defect.',
    weight: 0.9,
  },
  {
    id: 'edge_050',
    source: 'node_req_baa_compliance',
    target: 'node_defect_baa_enforcement',
    relationship: 'resolves',
    description: 'BAA compliance remediation will resolve the BAA enforcement gap defect.',
    weight: 1.0,
  },
  {
    id: 'edge_051',
    source: 'node_req_eligibility_refactor',
    target: 'node_defect_income_operator',
    relationship: 'resolves',
    description: 'Eligibility rules engine refactor will resolve the income threshold comparison defect.',
    weight: 0.85,
  },
  {
    id: 'edge_052',
    source: 'node_req_api_perf',
    target: 'node_defect_rate_limit_accuracy',
    relationship: 'resolves',
    description: 'API gateway performance optimization will resolve the rate limiter over-admission defect.',
    weight: 0.9,
  },

  // ---------------------------------------------------------------------------
  // Telemetry → Application (monitors)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_053',
    source: 'node_telemetry_claims_uptime',
    target: 'node_app_claims',
    relationship: 'monitors',
    description: 'Claims engine uptime monitor tracks availability of the Claims Processing Engine.',
    weight: 1.0,
  },
  {
    id: 'edge_054',
    source: 'node_telemetry_api_response',
    target: 'node_app_api_gateway',
    relationship: 'monitors',
    description: 'API gateway response time monitor tracks performance of the Partner API Gateway.',
    weight: 1.0,
  },
  {
    id: 'edge_055',
    source: 'node_telemetry_hedis_processing',
    target: 'node_app_hedis',
    relationship: 'monitors',
    description: 'HEDIS processing time monitor tracks measure calculation performance.',
    weight: 1.0,
  },
  {
    id: 'edge_056',
    source: 'node_telemetry_auth_uptime',
    target: 'node_app_auth',
    relationship: 'monitors',
    description: 'Auth service uptime monitor tracks availability of the Authentication Service.',
    weight: 1.0,
  },
  {
    id: 'edge_057',
    source: 'node_telemetry_vendor_health',
    target: 'node_app_vendor_integration',
    relationship: 'monitors',
    description: 'Vendor integration health monitor tracks availability and error rates.',
    weight: 1.0,
  },

  // ---------------------------------------------------------------------------
  // Incident → Application / Telemetry (related_to)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_058',
    source: 'node_incident_vendor_degraded',
    target: 'node_app_vendor_integration',
    relationship: 'related_to',
    description: 'Production vendor integration degradation incident is related to the Vendor Integration Hub.',
    weight: 1.0,
  },
  {
    id: 'edge_059',
    source: 'node_incident_vendor_degraded',
    target: 'node_telemetry_vendor_health',
    relationship: 'related_to',
    description: 'Production vendor degradation incident is correlated with vendor health telemetry.',
    weight: 0.9,
  },
  {
    id: 'edge_060',
    source: 'node_incident_qa_hotfix',
    target: 'node_telemetry_qa_external_health',
    relationship: 'related_to',
    description: 'QA Hotfix environment failure is related to environment health telemetry.',
    weight: 0.7,
  },

  // ---------------------------------------------------------------------------
  // Defect → Defect (blocks)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_061',
    source: 'node_defect_bcs_exclusion',
    target: 'node_defect_hedis_perf_sla',
    relationship: 'blocks',
    description: 'BCS exclusion defect blocks resolution of HEDIS performance SLA breach due to shared measure calculation pipeline.',
    weight: 0.6,
  },
  {
    id: 'edge_062',
    source: 'node_defect_oauth_scope',
    target: 'node_defect_rate_limit_accuracy',
    relationship: 'related_to',
    description: 'OAuth scope enforcement defect is related to rate limiter accuracy as both affect API gateway security posture.',
    weight: 0.5,
  },
  {
    id: 'edge_063',
    source: 'node_defect_tls_11',
    target: 'node_defect_baa_enforcement',
    relationship: 'related_to',
    description: 'TLS 1.1 acceptance and BAA enforcement gap are related vendor security compliance defects.',
    weight: 0.8,
  },

  // ---------------------------------------------------------------------------
  // Org unit → Application (owns)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_064',
    source: 'node_org_enterprise',
    target: 'node_app_claims',
    relationship: 'owns',
    description: 'Enterprise segment owns the Claims Processing Engine.',
    weight: 1.0,
  },
  {
    id: 'edge_065',
    source: 'node_org_enterprise',
    target: 'node_app_member_portal',
    relationship: 'owns',
    description: 'Enterprise segment owns the Member Portal.',
    weight: 1.0,
  },
  {
    id: 'edge_066',
    source: 'node_org_enterprise',
    target: 'node_app_auth',
    relationship: 'owns',
    description: 'Enterprise segment owns the Authentication Service.',
    weight: 1.0,
  },
  {
    id: 'edge_067',
    source: 'node_org_enterprise',
    target: 'node_app_data_warehouse',
    relationship: 'owns',
    description: 'Enterprise segment owns the Enterprise Data Warehouse.',
    weight: 1.0,
  },
  {
    id: 'edge_068',
    source: 'node_org_medicare',
    target: 'node_app_hedis',
    relationship: 'owns',
    description: 'Medicare segment owns the HEDIS Measure Engine.',
    weight: 1.0,
  },
  {
    id: 'edge_069',
    source: 'node_org_medicare',
    target: 'node_app_star_ratings',
    relationship: 'owns',
    description: 'Medicare segment owns the Star Ratings Analytics application.',
    weight: 1.0,
  },
  {
    id: 'edge_070',
    source: 'node_org_medicaid',
    target: 'node_app_medicaid_elig',
    relationship: 'owns',
    description: 'Medicaid segment owns the Medicaid Eligibility Engine.',
    weight: 1.0,
  },
  {
    id: 'edge_071',
    source: 'node_org_medicaid',
    target: 'node_app_state_reporting',
    relationship: 'owns',
    description: 'Medicaid segment owns the State Regulatory Reporting application.',
    weight: 1.0,
  },
  {
    id: 'edge_072',
    source: 'node_org_medicaid',
    target: 'node_app_care_mgmt',
    relationship: 'owns',
    description: 'Medicaid segment owns the Care Management Platform.',
    weight: 1.0,
  },
  {
    id: 'edge_073',
    source: 'node_org_external',
    target: 'node_app_api_gateway',
    relationship: 'owns',
    description: 'External segment owns the Partner API Gateway.',
    weight: 1.0,
  },
  {
    id: 'edge_074',
    source: 'node_org_external',
    target: 'node_app_vendor_integration',
    relationship: 'owns',
    description: 'External segment owns the Vendor Integration Hub.',
    weight: 1.0,
  },
  {
    id: 'edge_075',
    source: 'node_org_compliance',
    target: 'node_app_compliance_dash',
    relationship: 'owns',
    description: 'Compliance segment owns the Compliance Dashboard.',
    weight: 1.0,
  },

  // ---------------------------------------------------------------------------
  // Org unit → Defect (assigned_to)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_076',
    source: 'node_defect_bcs_exclusion',
    target: 'node_org_medicare',
    relationship: 'assigned_to',
    description: 'BCS exclusion defect is assigned to the Medicare segment for remediation.',
    weight: 0.8,
  },
  {
    id: 'edge_077',
    source: 'node_defect_oauth_scope',
    target: 'node_org_external',
    relationship: 'assigned_to',
    description: 'OAuth scope enforcement defect is assigned to the External segment for remediation.',
    weight: 0.8,
  },
  {
    id: 'edge_078',
    source: 'node_defect_income_operator',
    target: 'node_org_medicaid',
    relationship: 'assigned_to',
    description: 'Income threshold defect is assigned to the Medicaid segment for remediation.',
    weight: 0.8,
  },

  // ---------------------------------------------------------------------------
  // Code → Application (deployed_to)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_079',
    source: 'node_code_bcs_exclusion',
    target: 'node_app_hedis',
    relationship: 'deployed_to',
    description: 'BCS exclusion logic module is deployed to the HEDIS Measure Engine.',
    weight: 1.0,
  },
  {
    id: 'edge_080',
    source: 'node_code_cdc_valueset',
    target: 'node_app_hedis',
    relationship: 'deployed_to',
    description: 'CDC value set configuration is deployed to the HEDIS Measure Engine.',
    weight: 1.0,
  },
  {
    id: 'edge_081',
    source: 'node_code_oauth_plugin',
    target: 'node_app_api_gateway',
    relationship: 'deployed_to',
    description: 'Kong OAuth plugin configuration is deployed to the Partner API Gateway.',
    weight: 1.0,
  },
  {
    id: 'edge_082',
    source: 'node_code_income_threshold',
    target: 'node_app_medicaid_elig',
    relationship: 'deployed_to',
    description: 'Income threshold comparison logic is deployed to the Medicaid Eligibility Engine.',
    weight: 1.0,
  },
  {
    id: 'edge_083',
    source: 'node_code_tls_config',
    target: 'node_app_vendor_integration',
    relationship: 'deployed_to',
    description: 'Vendor TLS configuration is deployed to the Vendor Integration Hub.',
    weight: 1.0,
  },
  {
    id: 'edge_084',
    source: 'node_code_rate_limiter',
    target: 'node_app_api_gateway',
    relationship: 'deployed_to',
    description: 'Rate limiter algorithm is deployed to the Partner API Gateway.',
    weight: 1.0,
  },
  {
    id: 'edge_085',
    source: 'node_code_outreach_form',
    target: 'node_app_care_mgmt',
    relationship: 'deployed_to',
    description: 'Outreach form validation is deployed to the Care Management Platform.',
    weight: 1.0,
  },
  {
    id: 'edge_086',
    source: 'node_code_claims_adjudication',
    target: 'node_app_claims',
    relationship: 'deployed_to',
    description: 'Claims adjudication engine is deployed to the Claims Processing Engine.',
    weight: 1.0,
  },

  // ---------------------------------------------------------------------------
  // Telemetry → Incident (related_to)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_087',
    source: 'node_telemetry_api_response',
    target: 'node_defect_rate_limit_accuracy',
    relationship: 'related_to',
    description: 'API response time degradation telemetry is related to the rate limiter accuracy defect.',
    weight: 0.7,
  },
  {
    id: 'edge_088',
    source: 'node_telemetry_hedis_processing',
    target: 'node_defect_hedis_perf_sla',
    relationship: 'related_to',
    description: 'HEDIS processing time telemetry is related to the HEDIS engine SLA breach defect.',
    weight: 0.9,
  },

  // ---------------------------------------------------------------------------
  // Org unit → Org unit (related_to)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_089',
    source: 'node_org_qe_team',
    target: 'node_org_enterprise',
    relationship: 'related_to',
    description: 'Quality Engineering team supports the Enterprise segment.',
    weight: 0.9,
  },
  {
    id: 'edge_090',
    source: 'node_org_qe_team',
    target: 'node_org_medicare',
    relationship: 'related_to',
    description: 'Quality Engineering team supports the Medicare segment.',
    weight: 0.9,
  },
  {
    id: 'edge_091',
    source: 'node_org_qe_team',
    target: 'node_org_medicaid',
    relationship: 'related_to',
    description: 'Quality Engineering team supports the Medicaid segment.',
    weight: 0.9,
  },
  {
    id: 'edge_092',
    source: 'node_org_qe_team',
    target: 'node_org_external',
    relationship: 'related_to',
    description: 'Quality Engineering team supports the External segment.',
    weight: 0.8,
  },
  {
    id: 'edge_093',
    source: 'node_org_qe_team',
    target: 'node_org_compliance',
    relationship: 'related_to',
    description: 'Quality Engineering team supports the Compliance segment.',
    weight: 0.85,
  },

  // ---------------------------------------------------------------------------
  // Application → Telemetry (produces)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_094',
    source: 'node_app_claims',
    target: 'node_telemetry_claims_uptime',
    relationship: 'produces',
    description: 'Claims Processing Engine produces uptime telemetry data.',
    weight: 0.8,
  },
  {
    id: 'edge_095',
    source: 'node_app_api_gateway',
    target: 'node_telemetry_api_response',
    relationship: 'produces',
    description: 'Partner API Gateway produces response time telemetry data.',
    weight: 0.8,
  },
  {
    id: 'edge_096',
    source: 'node_app_hedis',
    target: 'node_telemetry_hedis_processing',
    relationship: 'produces',
    description: 'HEDIS Measure Engine produces processing time telemetry data.',
    weight: 0.8,
  },
  {
    id: 'edge_097',
    source: 'node_app_vendor_integration',
    target: 'node_telemetry_vendor_health',
    relationship: 'produces',
    description: 'Vendor Integration Hub produces health telemetry data.',
    weight: 0.8,
  },

  // ---------------------------------------------------------------------------
  // Incident → Defect (caused_by)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_098',
    source: 'node_incident_vendor_degraded',
    target: 'node_defect_tls_11',
    relationship: 'related_to',
    description: 'Production vendor degradation may be related to TLS configuration issues.',
    weight: 0.4,
  },

  // ---------------------------------------------------------------------------
  // Requirement → Requirement (depends_on)
  // ---------------------------------------------------------------------------
  {
    id: 'edge_099',
    source: 'node_req_api_perf',
    target: 'node_req_oauth_enforcement',
    relationship: 'related_to',
    description: 'API gateway performance optimization is related to OAuth enforcement as both affect gateway behavior.',
    weight: 0.6,
  },
  {
    id: 'edge_100',
    source: 'node_req_state_reporting_auto',
    target: 'node_req_eligibility_refactor',
    relationship: 'depends_on',
    description: 'State reporting automation depends on eligibility refactor for accurate enrollment data.',
    weight: 0.5,
  },
];

/**
 * Combined knowledge graph data object.
 * @type {KnowledgeGraphData}
 */
const knowledgeGraph = {
  nodes,
  edges,
};

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all knowledge graph data.
 *
 * @returns {KnowledgeGraphData} The complete knowledge graph data object
 */
export function getAllKnowledgeGraphData() {
  return {
    nodes: [...nodes],
    edges: [...edges],
  };
}

/**
 * Returns all knowledge graph nodes.
 *
 * @returns {KnowledgeGraphNode[]} Array of all node objects
 */
export function getAllNodes() {
  return [...nodes];
}

/**
 * Retrieves a single node by its unique ID.
 *
 * @param {string} nodeId - The node identifier to look up
 * @returns {KnowledgeGraphNode|null} The matching node object, or null if not found
 */
export function getNodeById(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    return null;
  }
  return nodes.find((n) => n.id === nodeId) || null;
}

/**
 * Returns all nodes filtered by type.
 *
 * @param {string} type - The node type to filter by (e.g. 'application', 'requirement', 'code', 'test', 'defect', 'incident', 'telemetry', 'org_unit')
 * @returns {KnowledgeGraphNode[]} Array of nodes matching the specified type
 */
export function getNodesByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return nodes.filter((n) => n.type === type);
}

/**
 * Returns all nodes filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {KnowledgeGraphNode[]} Array of nodes matching the specified status
 */
export function getNodesByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return nodes.filter((n) => n.status === status);
}

/**
 * Returns all knowledge graph edges.
 *
 * @returns {KnowledgeGraphEdge[]} Array of all edge objects
 */
export function getAllEdges() {
  return [...edges];
}

/**
 * Retrieves a single edge by its unique ID.
 *
 * @param {string} edgeId - The edge identifier to look up
 * @returns {KnowledgeGraphEdge|null} The matching edge object, or null if not found
 */
export function getEdgeById(edgeId) {
  if (!edgeId || typeof edgeId !== 'string') {
    return null;
  }
  return edges.find((e) => e.id === edgeId) || null;
}

/**
 * Returns all edges filtered by relationship type.
 *
 * @param {string} relationship - The relationship type to filter by (e.g. 'depends_on', 'tests', 'covers', 'caused_by', 'monitors', 'owns', 'implements', 'discovered_in', 'related_to', 'deployed_to', 'produces', 'consumes', 'assigned_to', 'blocks', 'resolves')
 * @returns {KnowledgeGraphEdge[]} Array of edges matching the specified relationship
 */
export function getEdgesByRelationship(relationship) {
  if (!relationship || typeof relationship !== 'string') {
    return [];
  }
  return edges.filter((e) => e.relationship === relationship);
}

/**
 * Returns all edges connected to a specific node (as source or target).
 *
 * @param {string} nodeId - The node ID to find connected edges for
 * @returns {KnowledgeGraphEdge[]} Array of edges connected to the specified node
 */
export function getEdgesByNode(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    return [];
  }
  return edges.filter((e) => e.source === nodeId || e.target === nodeId);
}

/**
 * Returns all edges where the specified node is the source.
 *
 * @param {string} nodeId - The source node ID to filter by
 * @returns {KnowledgeGraphEdge[]} Array of outgoing edges from the specified node
 */
export function getOutgoingEdges(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    return [];
  }
  return edges.filter((e) => e.source === nodeId);
}

/**
 * Returns all edges where the specified node is the target.
 *
 * @param {string} nodeId - The target node ID to filter by
 * @returns {KnowledgeGraphEdge[]} Array of incoming edges to the specified node
 */
export function getIncomingEdges(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    return [];
  }
  return edges.filter((e) => e.target === nodeId);
}

/**
 * Returns all neighbor nodes connected to a specific node.
 *
 * @param {string} nodeId - The node ID to find neighbors for
 * @returns {KnowledgeGraphNode[]} Array of neighbor node objects
 */
export function getNeighborNodes(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    return [];
  }
  const connectedEdges = getEdgesByNode(nodeId);
  const neighborIds = new Set();
  for (const edge of connectedEdges) {
    if (edge.source === nodeId) {
      neighborIds.add(edge.target);
    } else {
      neighborIds.add(edge.source);
    }
  }
  return nodes.filter((n) => neighborIds.has(n.id));
}

/**
 * Returns all unique node types.
 *
 * @returns {string[]} Array of unique node types sorted alphabetically
 */
export function getAllNodeTypes() {
  const types = new Set(nodes.map((n) => n.type));
  return [...types].sort();
}

/**
 * Returns all unique node statuses.
 *
 * @returns {string[]} Array of unique node statuses sorted alphabetically
 */
export function getAllNodeStatuses() {
  const statuses = new Set(nodes.map((n) => n.status));
  return [...statuses].sort();
}

/**
 * Returns all unique relationship types.
 *
 * @returns {string[]} Array of unique relationship types sorted alphabetically
 */
export function getAllRelationshipTypes() {
  const types = new Set(edges.map((e) => e.relationship));
  return [...types].sort();
}

/**
 * Returns aggregate statistics across all knowledge graph data.
 *
 * @returns {{ totalNodes: number, totalEdges: number, nodeTypeBreakdown: Object<string, number>, nodeStatusBreakdown: Object<string, number>, relationshipBreakdown: Object<string, number>, averageEdgeWeight: number, nodesWithMostConnections: { nodeId: string, nodeName: string, connectionCount: number }[] }} Aggregate knowledge graph statistics
 */
export function getKnowledgeGraphAggregates() {
  const totalNodes = nodes.length;
  const totalEdges = edges.length;

  const nodeTypeBreakdown = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  const nodeStatusBreakdown = nodes.reduce((acc, n) => {
    acc[n.status] = (acc[n.status] || 0) + 1;
    return acc;
  }, {});

  const relationshipBreakdown = edges.reduce((acc, e) => {
    acc[e.relationship] = (acc[e.relationship] || 0) + 1;
    return acc;
  }, {});

  const averageEdgeWeight =
    totalEdges > 0
      ? Math.round((edges.reduce((sum, e) => sum + e.weight, 0) / totalEdges) * 100) / 100
      : 0;

  const connectionCounts = {};
  for (const edge of edges) {
    connectionCounts[edge.source] = (connectionCounts[edge.source] || 0) + 1;
    connectionCounts[edge.target] = (connectionCounts[edge.target] || 0) + 1;
  }

  const nodesWithMostConnections = Object.entries(connectionCounts)
    .map(([nodeId, count]) => {
      const node = nodes.find((n) => n.id === nodeId);
      return {
        nodeId,
        nodeName: node ? node.name : nodeId,
        connectionCount: count,
      };
    })
    .sort((a, b) => b.connectionCount - a.connectionCount)
    .slice(0, 10);

  return {
    totalNodes,
    totalEdges,
    nodeTypeBreakdown,
    nodeStatusBreakdown,
    relationshipBreakdown,
    averageEdgeWeight,
    nodesWithMostConnections,
  };
}

export default knowledgeGraph;