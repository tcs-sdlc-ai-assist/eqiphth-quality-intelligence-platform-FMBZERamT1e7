import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} EvidenceItem
 * @property {string} id - Unique evidence identifier
 * @property {string} name - Evidence document name
 * @property {string} type - Evidence type (document, screenshot, report, audit_log, certificate, attestation)
 * @property {string} url - Evidence file URL or path
 * @property {string} uploadedBy - Name of the person who uploaded the evidence
 * @property {string} uploadedDate - Upload date in ISO format
 * @property {string} description - Description of the evidence
 */

/**
 * @typedef {Object} AuditFinding
 * @property {string} id - Unique finding identifier
 * @property {string} title - Finding title
 * @property {string} severity - Finding severity (critical, high, medium, low, informational)
 * @property {string} status - Finding status (open, in_progress, remediated, closed, accepted_risk)
 * @property {string} description - Detailed description of the finding
 * @property {string} identifiedDate - Date the finding was identified in ISO format
 * @property {string} dueDate - Remediation due date in ISO format
 * @property {string} closedDate - Date the finding was closed in ISO format (empty string if not closed)
 * @property {string} assignee - Name of the person assigned to remediate
 * @property {string} auditor - Name of the auditor who identified the finding
 * @property {string} correctiveAction - Description of the corrective action plan
 * @property {EvidenceItem[]} evidence - Array of evidence items supporting the finding
 */

/**
 * @typedef {Object} AdherenceMetric
 * @property {string} name - Metric name
 * @property {number} target - Target value (percentage)
 * @property {number} actual - Actual measured value (percentage)
 * @property {string} status - Metric status (met, not_met, at_risk, pending)
 * @property {string} measurementDate - Date of measurement in ISO format
 * @property {string} trend - Trend direction (improving, declining, stable)
 */

/**
 * @typedef {Object} OperatingExpectation
 * @property {string} id - Unique operating expectation identifier
 * @property {string} name - Expectation name
 * @property {string} description - Detailed description of the expectation
 * @property {string} category - Expectation category (quality, security, compliance, operations, development, data)
 * @property {string} status - Expectation status (compliant, non_compliant, partially_compliant, waived, pending_review)
 * @property {string} owner - Name of the person responsible
 * @property {string} lastReviewDate - Last review date in ISO format
 * @property {string} nextReviewDate - Next scheduled review date in ISO format
 * @property {EvidenceItem[]} evidence - Array of evidence items supporting compliance
 */

/**
 * @typedef {Object} Procedure
 * @property {string} id - Unique procedure identifier
 * @property {string} name - Procedure name
 * @property {string} description - Detailed description of the procedure
 * @property {string} category - Procedure category (quality_assurance, change_management, incident_management, release_management, security, data_governance, compliance, testing)
 * @property {string} status - Procedure status (active, draft, under_review, deprecated, archived)
 * @property {string} version - Procedure version string
 * @property {string} owner - Name of the procedure owner
 * @property {string} approvedBy - Name of the person who approved the procedure
 * @property {string} effectiveDate - Effective date in ISO format
 * @property {string} lastReviewDate - Last review date in ISO format
 * @property {string} nextReviewDate - Next scheduled review date in ISO format
 * @property {string[]} applicableSegments - Array of applicable segment names
 * @property {string[]} applicableApplications - Array of applicable application IDs
 */

/**
 * @typedef {Object} ComplianceScore
 * @property {string} id - Unique compliance score identifier
 * @property {string} framework - Compliance framework name (HIPAA, SOC2, CMS, NCQA, ACA, PCI_DSS, NIST, STATE_MEDICAID)
 * @property {number} overallScore - Overall compliance score (0-100)
 * @property {string} status - Compliance status using MEASURE_STATUS
 * @property {string} lastAssessmentDate - Last assessment date in ISO format
 * @property {string} nextAssessmentDate - Next scheduled assessment date in ISO format
 * @property {string} assessor - Name of the assessor
 * @property {{ domain: string, score: number, status: string }[]} domainScores - Array of domain-level scores
 * @property {{ month: string, score: number }[]} trendData - Monthly trend data
 */

/**
 * @typedef {Object} GovernanceData
 * @property {Procedure[]} procedures - Array of governance procedures
 * @property {ComplianceScore[]} complianceScores - Array of compliance framework scores
 * @property {AdherenceMetric[]} adherenceMetrics - Array of adherence metrics
 * @property {AuditFinding[]} auditFindings - Array of audit findings
 * @property {OperatingExpectation[]} operatingExpectations - Array of operating expectations
 */

/**
 * Mock governance procedures for the EQIP Quality Platform.
 * @type {Procedure[]}
 */
const procedures = [
  {
    id: 'proc_001',
    name: 'Quality Assurance Review Process',
    description: 'Defines the end-to-end quality assurance review process for all software releases including test planning, execution, defect management, and sign-off criteria.',
    category: 'quality_assurance',
    status: 'active',
    version: '3.2.0',
    owner: 'Angela Martinez',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-01-15',
    lastReviewDate: '2024-11-01',
    nextReviewDate: '2025-05-01',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_002',
    name: 'Change Management Procedure',
    description: 'Governs the process for requesting, evaluating, approving, and implementing changes to production systems including emergency change protocols.',
    category: 'change_management',
    status: 'active',
    version: '4.1.0',
    owner: 'Daniel Robinson',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-03-01',
    lastReviewDate: '2024-10-15',
    nextReviewDate: '2025-04-15',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
    applicableApplications: [],
  },
  {
    id: 'proc_003',
    name: 'Incident Management Procedure',
    description: 'Establishes the process for detecting, reporting, triaging, resolving, and conducting post-incident reviews for production incidents across all severity levels.',
    category: 'incident_management',
    status: 'active',
    version: '2.5.0',
    owner: 'Karen Mitchell',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-02-01',
    lastReviewDate: '2024-09-20',
    nextReviewDate: '2025-03-20',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
    applicableApplications: [],
  },
  {
    id: 'proc_004',
    name: 'Release Management Procedure',
    description: 'Defines the release lifecycle from planning through deployment including quality gate enforcement, environment promotion, rollback procedures, and post-release validation.',
    category: 'release_management',
    status: 'active',
    version: '3.0.0',
    owner: 'Amanda Garcia',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-04-01',
    lastReviewDate: '2024-11-10',
    nextReviewDate: '2025-05-10',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_005',
    name: 'Security Assessment Procedure',
    description: 'Outlines the security assessment process including vulnerability scanning, penetration testing, code security review, and remediation tracking for all applications.',
    category: 'security',
    status: 'active',
    version: '2.3.0',
    owner: 'Natalie White',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-01-01',
    lastReviewDate: '2024-10-01',
    nextReviewDate: '2025-04-01',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
    applicableApplications: [],
  },
  {
    id: 'proc_006',
    name: 'Data Governance Procedure',
    description: 'Establishes data governance standards including data classification, access controls, retention policies, masking requirements, and data quality validation processes.',
    category: 'data_governance',
    status: 'active',
    version: '2.1.0',
    owner: 'Samantha Clark',
    approvedBy: 'Patricia Evans',
    effectiveDate: '2024-02-15',
    lastReviewDate: '2024-11-05',
    nextReviewDate: '2025-05-05',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_007',
    name: 'HIPAA Compliance Procedure',
    description: 'Defines HIPAA compliance requirements for all systems handling protected health information including privacy, security, and breach notification protocols.',
    category: 'compliance',
    status: 'active',
    version: '5.0.0',
    owner: 'Patricia Evans',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-01-01',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-06-01',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_008',
    name: 'Test Environment Management Procedure',
    description: 'Governs the provisioning, configuration, reservation, and decommissioning of test environments including conflict detection and data refresh protocols.',
    category: 'testing',
    status: 'active',
    version: '1.8.0',
    owner: 'Daniel Robinson',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-05-01',
    lastReviewDate: '2024-10-20',
    nextReviewDate: '2025-04-20',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
    applicableApplications: [],
  },
  {
    id: 'proc_009',
    name: 'CMS Regulatory Reporting Procedure',
    description: 'Defines the process for generating, validating, and submitting CMS-mandated regulatory reports including data accuracy requirements and submission deadlines.',
    category: 'compliance',
    status: 'active',
    version: '3.4.0',
    owner: 'Patricia Evans',
    approvedBy: 'Michael Torres',
    effectiveDate: '2024-01-15',
    lastReviewDate: '2024-11-15',
    nextReviewDate: '2025-05-15',
    applicableSegments: ['Medicare', 'Compliance'],
    applicableApplications: ['app_regulatory_reporting', 'app_star_ratings', 'app_hedis_engine'],
  },
  {
    id: 'proc_010',
    name: 'State Medicaid Compliance Procedure',
    description: 'Establishes compliance requirements for state Medicaid contracts including eligibility processing, network adequacy, and state-specific reporting obligations.',
    category: 'compliance',
    status: 'active',
    version: '2.6.0',
    owner: 'Patricia Evans',
    approvedBy: 'David Park',
    effectiveDate: '2024-03-01',
    lastReviewDate: '2024-11-20',
    nextReviewDate: '2025-05-20',
    applicableSegments: ['Medicaid', 'Compliance'],
    applicableApplications: ['app_medicaid_eligibility', 'app_state_reporting', 'app_care_management', 'app_provider_network'],
  },
  {
    id: 'proc_011',
    name: 'Automated Test Coverage Standards',
    description: 'Defines minimum automated test coverage requirements by test type, application risk level, and deployment environment including coverage measurement and reporting.',
    category: 'testing',
    status: 'active',
    version: '2.0.0',
    owner: 'Angela Martinez',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-06-01',
    lastReviewDate: '2024-12-05',
    nextReviewDate: '2025-06-05',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_012',
    name: 'Vendor Integration Security Standards',
    description: 'Defines security requirements for all vendor integrations including encrypted data channels, BAA agreements, API authentication, and data reconciliation protocols.',
    category: 'security',
    status: 'active',
    version: '1.5.0',
    owner: 'Natalie White',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-04-15',
    lastReviewDate: '2024-11-10',
    nextReviewDate: '2025-05-10',
    applicableSegments: ['External'],
    applicableApplications: ['app_partner_api_gateway', 'app_vendor_integration', 'app_external_data_feed'],
  },
  {
    id: 'proc_013',
    name: 'Quality Gate Enforcement Procedure',
    description: 'Defines the quality gate framework including gate criteria, threshold configuration, waiver process, and escalation procedures for gate failures.',
    category: 'quality_assurance',
    status: 'active',
    version: '2.2.0',
    owner: 'Angela Martinez',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-05-15',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-06-01',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_014',
    name: 'Performance Testing Standards',
    description: 'Establishes performance testing requirements including load testing, stress testing, benchmark validation, and SLA compliance verification for all applications.',
    category: 'testing',
    status: 'active',
    version: '1.6.0',
    owner: 'Marcus Thompson',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-03-15',
    lastReviewDate: '2024-10-25',
    nextReviewDate: '2025-04-25',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
    applicableApplications: [],
  },
  {
    id: 'proc_015',
    name: 'Accessibility Compliance Procedure',
    description: 'Defines WCAG 2.1 AA compliance requirements for all member-facing applications including testing methodology, remediation timelines, and audit processes.',
    category: 'compliance',
    status: 'active',
    version: '1.3.0',
    owner: 'Omar Hassan',
    approvedBy: 'Rachel Nguyen',
    effectiveDate: '2024-04-01',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-06-01',
    applicableSegments: ['Enterprise', 'Commercial'],
    applicableApplications: ['app_member_portal', 'app_individual_marketplace', 'app_broker_portal', 'app_wellness_platform'],
  },
  {
    id: 'proc_016',
    name: 'Disaster Recovery Testing Procedure',
    description: 'Defines the quarterly disaster recovery testing process including failover validation, data integrity checks, RTO/RPO verification, and documentation requirements.',
    category: 'incident_management',
    status: 'active',
    version: '2.0.0',
    owner: 'Daniel Robinson',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-01-01',
    lastReviewDate: '2024-10-20',
    nextReviewDate: '2025-04-20',
    applicableSegments: ['Enterprise'],
    applicableApplications: ['app_claims_engine', 'app_auth_service', 'app_data_warehouse', 'app_medicare_enrollment', 'app_medicaid_eligibility'],
  },
  {
    id: 'proc_017',
    name: 'Test Data Management Procedure',
    description: 'Governs the creation, masking, provisioning, refresh, and decommissioning of test data assets including PHI handling and data lineage tracking.',
    category: 'data_governance',
    status: 'active',
    version: '1.4.0',
    owner: 'Samantha Clark',
    approvedBy: 'Angela Martinez',
    effectiveDate: '2024-06-01',
    lastReviewDate: '2024-11-25',
    nextReviewDate: '2025-05-25',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_018',
    name: 'Code Review Standards',
    description: 'Establishes code review requirements including minimum reviewer count, review checklist, security review triggers, and approval criteria for all code changes.',
    category: 'quality_assurance',
    status: 'under_review',
    version: '3.3.0-draft',
    owner: 'Robert Kim',
    approvedBy: '',
    effectiveDate: '',
    lastReviewDate: '2024-12-10',
    nextReviewDate: '2025-01-15',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
    applicableApplications: [],
  },
  {
    id: 'proc_019',
    name: 'API Governance Standards',
    description: 'Defines API design, versioning, deprecation, documentation, and security standards for all internal and external-facing APIs.',
    category: 'quality_assurance',
    status: 'active',
    version: '1.2.0',
    owner: 'Chris Anderson',
    approvedBy: 'Jennifer Williams',
    effectiveDate: '2024-07-01',
    lastReviewDate: '2024-11-10',
    nextReviewDate: '2025-05-10',
    applicableSegments: ['Enterprise', 'External'],
    applicableApplications: ['app_partner_api_gateway', 'app_provider_directory', 'app_auth_service'],
  },
  {
    id: 'proc_020',
    name: 'Legacy System Decommissioning Procedure',
    description: 'Defines the process for safely decommissioning legacy systems including data migration, dependency analysis, stakeholder communication, and archival requirements.',
    category: 'change_management',
    status: 'draft',
    version: '0.9.0',
    owner: 'Jennifer Williams',
    approvedBy: '',
    effectiveDate: '',
    lastReviewDate: '2024-12-08',
    nextReviewDate: '2025-02-01',
    applicableSegments: ['Enterprise'],
    applicableApplications: [],
  },
];

/**
 * Mock compliance framework scores for the EQIP Quality Platform.
 * @type {ComplianceScore[]}
 */
const complianceScores = [
  {
    id: 'cs_001',
    framework: 'HIPAA',
    overallScore: 94.5,
    status: MEASURE_STATUS.ON_TRACK,
    lastAssessmentDate: '2024-11-15',
    nextAssessmentDate: '2025-05-15',
    assessor: 'Patricia Evans',
    domainScores: [
      { domain: 'Privacy Rule', score: 96.2, status: 'compliant' },
      { domain: 'Security Rule', score: 93.8, status: 'compliant' },
      { domain: 'Breach Notification', score: 97.0, status: 'compliant' },
      { domain: 'Administrative Safeguards', score: 92.5, status: 'compliant' },
      { domain: 'Physical Safeguards', score: 95.0, status: 'compliant' },
      { domain: 'Technical Safeguards', score: 91.8, status: 'compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 90.2 },
      { month: 'Feb', score: 90.8 },
      { month: 'Mar', score: 91.5 },
      { month: 'Apr', score: 91.9 },
      { month: 'May', score: 92.3 },
      { month: 'Jun', score: 92.8 },
      { month: 'Jul', score: 93.0 },
      { month: 'Aug', score: 93.4 },
      { month: 'Sep', score: 93.7 },
      { month: 'Oct', score: 94.0 },
      { month: 'Nov', score: 94.5 },
      { month: 'Dec', score: 94.5 },
    ],
  },
  {
    id: 'cs_002',
    framework: 'SOC2',
    overallScore: 96.8,
    status: MEASURE_STATUS.ON_TRACK,
    lastAssessmentDate: '2024-10-15',
    nextAssessmentDate: '2025-10-15',
    assessor: 'Patricia Evans',
    domainScores: [
      { domain: 'Security', score: 97.5, status: 'compliant' },
      { domain: 'Availability', score: 96.2, status: 'compliant' },
      { domain: 'Processing Integrity', score: 95.8, status: 'compliant' },
      { domain: 'Confidentiality', score: 97.0, status: 'compliant' },
      { domain: 'Privacy', score: 96.5, status: 'compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 94.0 },
      { month: 'Feb', score: 94.3 },
      { month: 'Mar', score: 94.8 },
      { month: 'Apr', score: 95.1 },
      { month: 'May', score: 95.5 },
      { month: 'Jun', score: 95.8 },
      { month: 'Jul', score: 96.0 },
      { month: 'Aug', score: 96.2 },
      { month: 'Sep', score: 96.4 },
      { month: 'Oct', score: 96.8 },
      { month: 'Nov', score: 96.8 },
      { month: 'Dec', score: 96.8 },
    ],
  },
  {
    id: 'cs_003',
    framework: 'CMS',
    overallScore: 91.2,
    status: MEASURE_STATUS.ON_TRACK,
    lastAssessmentDate: '2024-11-20',
    nextAssessmentDate: '2025-05-20',
    assessor: 'Patricia Evans',
    domainScores: [
      { domain: 'Enrollment Processing', score: 94.5, status: 'compliant' },
      { domain: 'Claims Processing', score: 93.2, status: 'compliant' },
      { domain: 'Star Ratings', score: 90.8, status: 'compliant' },
      { domain: 'HEDIS Reporting', score: 84.5, status: 'non_compliant' },
      { domain: 'Part D Formulary', score: 95.0, status: 'compliant' },
      { domain: 'Grievance & Appeals', score: 92.1, status: 'compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 86.5 },
      { month: 'Feb', score: 87.0 },
      { month: 'Mar', score: 87.8 },
      { month: 'Apr', score: 88.2 },
      { month: 'May', score: 88.9 },
      { month: 'Jun', score: 89.3 },
      { month: 'Jul', score: 89.8 },
      { month: 'Aug', score: 90.1 },
      { month: 'Sep', score: 90.5 },
      { month: 'Oct', score: 90.8 },
      { month: 'Nov', score: 91.2 },
      { month: 'Dec', score: 91.2 },
    ],
  },
  {
    id: 'cs_004',
    framework: 'NCQA',
    overallScore: 88.7,
    status: MEASURE_STATUS.ON_TRACK,
    lastAssessmentDate: '2024-09-15',
    nextAssessmentDate: '2025-09-15',
    assessor: 'Angela Martinez',
    domainScores: [
      { domain: 'HEDIS Measure Accuracy', score: 85.2, status: 'at_risk' },
      { domain: 'Data Collection', score: 90.5, status: 'compliant' },
      { domain: 'Measure Specification Adherence', score: 87.8, status: 'compliant' },
      { domain: 'Audit Readiness', score: 92.0, status: 'compliant' },
      { domain: 'Supplemental Data Integration', score: 88.0, status: 'compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 83.0 },
      { month: 'Feb', score: 83.8 },
      { month: 'Mar', score: 84.5 },
      { month: 'Apr', score: 85.2 },
      { month: 'May', score: 85.9 },
      { month: 'Jun', score: 86.5 },
      { month: 'Jul', score: 87.0 },
      { month: 'Aug', score: 87.5 },
      { month: 'Sep', score: 88.0 },
      { month: 'Oct', score: 88.3 },
      { month: 'Nov', score: 88.5 },
      { month: 'Dec', score: 88.7 },
    ],
  },
  {
    id: 'cs_005',
    framework: 'ACA',
    overallScore: 93.4,
    status: MEASURE_STATUS.ON_TRACK,
    lastAssessmentDate: '2024-11-10',
    nextAssessmentDate: '2025-05-10',
    assessor: 'Patricia Evans',
    domainScores: [
      { domain: 'Essential Health Benefits', score: 96.0, status: 'compliant' },
      { domain: 'Plan Display Requirements', score: 94.5, status: 'compliant' },
      { domain: 'Subsidy Calculations', score: 92.8, status: 'compliant' },
      { domain: 'Enrollment Processing', score: 91.5, status: 'compliant' },
      { domain: 'Nondiscrimination', score: 92.2, status: 'compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 89.5 },
      { month: 'Feb', score: 90.0 },
      { month: 'Mar', score: 90.5 },
      { month: 'Apr', score: 91.0 },
      { month: 'May', score: 91.4 },
      { month: 'Jun', score: 91.8 },
      { month: 'Jul', score: 92.1 },
      { month: 'Aug', score: 92.4 },
      { month: 'Sep', score: 92.7 },
      { month: 'Oct', score: 93.0 },
      { month: 'Nov', score: 93.4 },
      { month: 'Dec', score: 93.4 },
    ],
  },
  {
    id: 'cs_006',
    framework: 'STATE_MEDICAID',
    overallScore: 79.8,
    status: MEASURE_STATUS.AT_RISK,
    lastAssessmentDate: '2024-11-20',
    nextAssessmentDate: '2025-02-20',
    assessor: 'Patricia Evans',
    domainScores: [
      { domain: 'Eligibility Processing', score: 78.4, status: 'non_compliant' },
      { domain: 'State Reporting', score: 76.4, status: 'non_compliant' },
      { domain: 'Network Adequacy', score: 88.1, status: 'compliant' },
      { domain: 'Care Management', score: 82.3, status: 'at_risk' },
      { domain: 'Member Outreach', score: 74.0, status: 'non_compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 72.0 },
      { month: 'Feb', score: 72.8 },
      { month: 'Mar', score: 73.5 },
      { month: 'Apr', score: 74.2 },
      { month: 'May', score: 75.0 },
      { month: 'Jun', score: 75.8 },
      { month: 'Jul', score: 76.5 },
      { month: 'Aug', score: 77.2 },
      { month: 'Sep', score: 78.0 },
      { month: 'Oct', score: 78.8 },
      { month: 'Nov', score: 79.8 },
      { month: 'Dec', score: 79.8 },
    ],
  },
  {
    id: 'cs_007',
    framework: 'NIST',
    overallScore: 87.3,
    status: MEASURE_STATUS.ON_TRACK,
    lastAssessmentDate: '2024-10-01',
    nextAssessmentDate: '2025-04-01',
    assessor: 'Natalie White',
    domainScores: [
      { domain: 'Identify', score: 90.2, status: 'compliant' },
      { domain: 'Protect', score: 88.5, status: 'compliant' },
      { domain: 'Detect', score: 85.8, status: 'compliant' },
      { domain: 'Respond', score: 86.0, status: 'compliant' },
      { domain: 'Recover', score: 86.0, status: 'compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 82.0 },
      { month: 'Feb', score: 82.8 },
      { month: 'Mar', score: 83.5 },
      { month: 'Apr', score: 84.0 },
      { month: 'May', score: 84.5 },
      { month: 'Jun', score: 85.0 },
      { month: 'Jul', score: 85.5 },
      { month: 'Aug', score: 86.0 },
      { month: 'Sep', score: 86.5 },
      { month: 'Oct', score: 87.3 },
      { month: 'Nov', score: 87.3 },
      { month: 'Dec', score: 87.3 },
    ],
  },
  {
    id: 'cs_008',
    framework: 'PCI_DSS',
    overallScore: 72.5,
    status: MEASURE_STATUS.CRITICAL,
    lastAssessmentDate: '2024-11-25',
    nextAssessmentDate: '2025-01-25',
    assessor: 'Natalie White',
    domainScores: [
      { domain: 'Network Security', score: 78.0, status: 'at_risk' },
      { domain: 'Data Protection', score: 72.0, status: 'non_compliant' },
      { domain: 'Access Control', score: 80.5, status: 'at_risk' },
      { domain: 'Monitoring & Testing', score: 65.8, status: 'non_compliant' },
      { domain: 'Security Policy', score: 66.2, status: 'non_compliant' },
    ],
    trendData: [
      { month: 'Jan', score: 65.0 },
      { month: 'Feb', score: 65.5 },
      { month: 'Mar', score: 66.2 },
      { month: 'Apr', score: 67.0 },
      { month: 'May', score: 67.8 },
      { month: 'Jun', score: 68.5 },
      { month: 'Jul', score: 69.2 },
      { month: 'Aug', score: 70.0 },
      { month: 'Sep', score: 70.8 },
      { month: 'Oct', score: 71.5 },
      { month: 'Nov', score: 72.5 },
      { month: 'Dec', score: 72.5 },
    ],
  },
];

/**
 * Mock adherence metrics for the EQIP Quality Platform.
 * @type {AdherenceMetric[]}
 */
const adherenceMetrics = [
  {
    name: 'Quality Gate Pass Rate',
    target: 90.0,
    actual: 62.5,
    status: 'not_met',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'Automated Test Coverage',
    target: 85.0,
    actual: 83.7,
    status: 'at_risk',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'Code Review Compliance',
    target: 100.0,
    actual: 98.5,
    status: 'met',
    measurementDate: '2024-12-12',
    trend: 'stable',
  },
  {
    name: 'Security Scan Pass Rate',
    target: 95.0,
    actual: 91.2,
    status: 'not_met',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'Production Incident MTTR',
    target: 2.0,
    actual: 2.3,
    status: 'not_met',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'Change Failure Rate',
    target: 5.0,
    actual: 4.8,
    status: 'met',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'Deployment Frequency (per month)',
    target: 4.0,
    actual: 5.2,
    status: 'met',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'Test Data Freshness',
    target: 95.0,
    actual: 88.9,
    status: 'not_met',
    measurementDate: '2024-12-12',
    trend: 'declining',
  },
  {
    name: 'Environment Availability',
    target: 95.0,
    actual: 90.0,
    status: 'not_met',
    measurementDate: '2024-12-12',
    trend: 'stable',
  },
  {
    name: 'Regulatory Report On-Time Delivery',
    target: 100.0,
    actual: 92.5,
    status: 'not_met',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'HIPAA Training Completion',
    target: 100.0,
    actual: 99.2,
    status: 'met',
    measurementDate: '2024-12-12',
    trend: 'stable',
  },
  {
    name: 'Accessibility Compliance Rate',
    target: 100.0,
    actual: 96.8,
    status: 'at_risk',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'Vendor BAA Coverage',
    target: 100.0,
    actual: 85.0,
    status: 'not_met',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
  {
    name: 'DR Test Success Rate',
    target: 100.0,
    actual: 100.0,
    status: 'met',
    measurementDate: '2024-12-12',
    trend: 'stable',
  },
  {
    name: 'Data Quality Score',
    target: 99.0,
    actual: 97.8,
    status: 'at_risk',
    measurementDate: '2024-12-12',
    trend: 'improving',
  },
];

/**
 * Mock audit findings for the EQIP Quality Platform.
 * @type {AuditFinding[]}
 */
const auditFindings = [
  {
    id: 'af_001',
    title: 'HEDIS Measure Specification Non-Compliance',
    severity: 'critical',
    status: 'in_progress',
    description: 'HEDIS measure engine BCS and CDC measure calculations do not fully align with NCQA MY2024 technical specifications. Exclusion logic is missing ICD-10-PCS codes for bilateral mastectomy and using outdated value sets for ESRD exclusion.',
    identifiedDate: '2024-12-01',
    dueDate: '2025-02-28',
    closedDate: '',
    assignee: 'Lisa Johnson',
    auditor: 'Angela Martinez',
    correctiveAction: 'Update BCS exclusion rule to include ICD-10-PCS codes. Update ESRD value set to include 2024 diagnosis codes. Implement comprehensive measure validation test suite against NCQA reference data.',
    evidence: [
      { id: 'ev_001', name: 'BCS Measure Calculation Report', type: 'report', url: '/evidence/af_001/bcs-calculation-report.pdf', uploadedBy: 'Lisa Johnson', uploadedDate: '2024-12-04', description: 'Detailed BCS measure calculation showing exclusion logic discrepancy.' },
      { id: 'ev_002', name: 'CDC HbA1c Sub-Measure Analysis', type: 'report', url: '/evidence/af_001/cdc-hba1c-analysis.pdf', uploadedBy: 'Lisa Johnson', uploadedDate: '2024-12-04', description: 'Analysis of CDC HbA1c poor control sub-measure rate deviation.' },
    ],
  },
  {
    id: 'af_002',
    title: 'API Gateway OAuth Scope Enforcement Disabled',
    severity: 'critical',
    status: 'in_progress',
    description: 'The partner API gateway does not enforce OAuth 2.0 scope-based access control. Tokens with insufficient scopes are allowed to access protected resources, violating security governance requirements.',
    identifiedDate: '2024-11-24',
    dueDate: '2025-01-31',
    closedDate: '',
    assignee: 'Natalie White',
    auditor: 'Natalie White',
    correctiveAction: 'Enable scope enforcement in Kong OAuth plugin. Define required scopes for each API endpoint. Conduct full security review of all partner API endpoints.',
    evidence: [
      { id: 'ev_003', name: 'OAuth Security Test Report', type: 'report', url: '/evidence/af_002/oauth-security-report.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-11-24', description: 'Security test results showing scope enforcement failure.' },
      { id: 'ev_004', name: 'Kong Plugin Configuration', type: 'screenshot', url: '/evidence/af_002/kong-config-screenshot.png', uploadedBy: 'Natalie White', uploadedDate: '2024-11-25', description: 'Screenshot showing scope_required parameter set to false.' },
    ],
  },
  {
    id: 'af_003',
    title: 'Vendor Integration TLS 1.1 Acceptance',
    severity: 'critical',
    status: 'open',
    description: 'The vendor integration hub accepts deprecated TLS 1.1 connections, violating the minimum TLS 1.2 requirement for all data exchanges containing PHI.',
    identifiedDate: '2024-11-18',
    dueDate: '2025-01-15',
    closedDate: '',
    assignee: 'Natalie White',
    auditor: 'Natalie White',
    correctiveAction: 'Remove TLS 1.1 from allowed protocols configuration. Implement TLS version monitoring and alerting. Coordinate with vendors to ensure TLS 1.2+ support.',
    evidence: [
      { id: 'ev_005', name: 'TLS Handshake Trace Log', type: 'log', url: '/evidence/af_003/tls-handshake-trace.log', uploadedBy: 'Natalie White', uploadedDate: '2024-11-18', description: 'Log showing successful TLS 1.1 connection establishment.' },
    ],
  },
  {
    id: 'af_004',
    title: 'Vendor BAA Agreement Enforcement Gap',
    severity: 'critical',
    status: 'open',
    description: 'The vendor integration hub does not block data exchange for vendors without active Business Associate Agreements. BAA validation is implemented as a warning log rather than a blocking enforcement.',
    identifiedDate: '2024-11-18',
    dueDate: '2025-01-31',
    closedDate: '',
    assignee: 'Alex Rivera',
    auditor: 'Natalie White',
    correctiveAction: 'Convert BAA validation from warning to blocking check. Add automated BAA expiration monitoring with 30-day advance alerts. Implement vendor onboarding checklist requiring BAA verification.',
    evidence: [
      { id: 'ev_006', name: 'Vendor Security Test Report', type: 'report', url: '/evidence/af_004/vendor-security-report.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-11-18', description: 'Security test showing data exchange proceeding without active BAA.' },
    ],
  },
  {
    id: 'af_005',
    title: 'State B Quarterly Report Data Accuracy Below Threshold',
    severity: 'high',
    status: 'in_progress',
    description: 'State B quarterly regulatory report has a 0.4% enrollment count discrepancy, exceeding the 0.1% tolerance. 182 members with retroactive eligibility changes are missing from the report.',
    identifiedDate: '2024-11-28',
    dueDate: '2025-01-31',
    closedDate: '',
    assignee: 'Samantha Clark',
    auditor: 'Patricia Evans',
    correctiveAction: 'Update State B data extraction query to include retroactive eligibility changes. Add reconciliation step to compare report totals against source system counts. Implement automated data accuracy validation.',
    evidence: [
      { id: 'ev_007', name: 'State B Accuracy Report', type: 'report', url: '/evidence/af_005/state-b-accuracy-report.pdf', uploadedBy: 'Patricia Evans', uploadedDate: '2024-11-28', description: 'Report showing enrollment count discrepancy for State B.' },
      { id: 'ev_008', name: 'Data Reconciliation Details', type: 'audit_log', url: '/evidence/af_005/reconciliation-details.csv', uploadedBy: 'Samantha Clark', uploadedDate: '2024-11-29', description: 'Detailed reconciliation showing 182 missing member records.' },
    ],
  },
  {
    id: 'af_006',
    title: 'Medicaid Eligibility Income Threshold Comparison Error',
    severity: 'critical',
    status: 'in_progress',
    description: 'The Medicaid eligibility engine uses a strict less-than operator instead of less-than-or-equal-to for the 138% FPL cutoff, causing incorrect eligibility determinations for applicants at boundary income levels.',
    identifiedDate: '2024-12-01',
    dueDate: '2025-01-15',
    closedDate: '',
    assignee: 'Robert Kim',
    auditor: 'David Park',
    correctiveAction: 'Update income comparison logic to use less-than-or-equal-to for FPL threshold checks. Review all state-specific FPL threshold configurations for similar issues. Add boundary value test cases.',
    evidence: [
      { id: 'ev_009', name: 'Eligibility Determination Trace', type: 'log', url: '/evidence/af_006/eligibility-trace.log', uploadedBy: 'Robert Kim', uploadedDate: '2024-12-01', description: 'Trace log showing incorrect eligibility determination for 135% FPL applicant.' },
    ],
  },
  {
    id: 'af_007',
    title: 'Care Management Outreach Tracking Non-Compliance',
    severity: 'high',
    status: 'in_progress',
    description: 'Member outreach tracking does not enforce required follow-up action field for non-contact outcomes (no_answer, voicemail), resulting in 87% field completion rate instead of the mandated 100%.',
    identifiedDate: '2024-12-02',
    dueDate: '2025-01-15',
    closedDate: '',
    assignee: 'James Wright',
    auditor: 'Angela Martinez',
    correctiveAction: 'Update outreach form validation to require follow-up action for all outcome types. Add server-side validation as secondary check. Backfill missing follow-up actions for existing records.',
    evidence: [
      { id: 'ev_010', name: 'Outreach Compliance Report', type: 'report', url: '/evidence/af_007/outreach-compliance-report.pdf', uploadedBy: 'Angela Martinez', uploadedDate: '2024-12-05', description: 'Report showing 87% field completion rate for outreach tracking.' },
      { id: 'ev_011', name: 'Outreach Form Screenshot', type: 'screenshot', url: '/evidence/af_007/outreach-form-missing-fields.png', uploadedBy: 'Angela Martinez', uploadedDate: '2024-12-05', description: 'Screenshot showing missing required fields on outreach form.' },
    ],
  },
  {
    id: 'af_008',
    title: 'API Gateway Rate Limiting Accuracy Issue',
    severity: 'high',
    status: 'open',
    description: 'The API gateway rate limiter allows up to 8.7% excess requests at sliding window boundaries due to 5-second granularity in the sliding window algorithm.',
    identifiedDate: '2024-11-25',
    dueDate: '2025-02-15',
    closedDate: '',
    assignee: 'Alex Rivera',
    auditor: 'Marcus Thompson',
    correctiveAction: 'Switch to token bucket algorithm with per-second granularity. Move rate limit counter updates to async pipeline using Redis INCR. Implement rate limit accuracy monitoring.',
    evidence: [
      { id: 'ev_012', name: 'Rate Limit Test Report', type: 'report', url: '/evidence/af_008/rate-limit-test-report.pdf', uploadedBy: 'Marcus Thompson', uploadedDate: '2024-11-25', description: 'Performance test results showing rate limit over-admission.' },
    ],
  },
  {
    id: 'af_009',
    title: 'External Data Feed Processing SLA Breach',
    severity: 'medium',
    status: 'open',
    description: 'External data feed processor exceeds the 4-hour processing SLA for standard 100MB files. Single-threaded file parsing and individual record validation lookups create I/O bottlenecks.',
    identifiedDate: '2024-11-19',
    dueDate: '2025-03-31',
    closedDate: '',
    assignee: 'James Wright',
    auditor: 'Marcus Thompson',
    correctiveAction: 'Implement parallel file parsing with configurable thread count. Convert individual record validation lookups to batch queries. Add priority-based queue management.',
    evidence: [
      { id: 'ev_013', name: 'Feed Processing Performance Report', type: 'report', url: '/evidence/af_009/feed-processing-performance.pdf', uploadedBy: 'Marcus Thompson', uploadedDate: '2024-11-19', description: 'Performance report showing 4h 30m processing time for 100MB file.' },
    ],
  },
  {
    id: 'af_010',
    title: 'Data Warehouse Query Performance SLA Failure',
    severity: 'medium',
    status: 'in_progress',
    description: 'HEDIS measure aggregation query exceeds the 60-second SLA by completing in 130 seconds for 1M member population due to missing clustering keys and unoptimized joins.',
    identifiedDate: '2024-12-05',
    dueDate: '2025-02-28',
    closedDate: '',
    assignee: 'Samantha Clark',
    auditor: 'Marcus Thompson',
    correctiveAction: 'Add clustering keys on measure_year and member_id columns. Materialize intermediate aggregation results. Optimize value set join operations.',
    evidence: [
      { id: 'ev_014', name: 'Query Performance Profile', type: 'report', url: '/evidence/af_010/query-performance-profile.pdf', uploadedBy: 'Marcus Thompson', uploadedDate: '2024-12-05', description: 'Query execution profile showing full table scan and unoptimized joins.' },
    ],
  },
  {
    id: 'af_011',
    title: 'HIPAA PHI Encryption Audit - Passed',
    severity: 'informational',
    status: 'closed',
    description: 'Annual HIPAA PHI encryption audit confirmed all PHI data in the claims engine is encrypted at rest using AES-256 with proper key management and rotation support.',
    identifiedDate: '2024-11-15',
    dueDate: '2024-11-30',
    closedDate: '2024-11-15',
    assignee: 'Natalie White',
    auditor: 'Patricia Evans',
    correctiveAction: 'No corrective action required. Encryption implementation meets HIPAA requirements.',
    evidence: [
      { id: 'ev_015', name: 'PHI Encryption Test Report', type: 'report', url: '/evidence/af_011/phi-encryption-report.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-11-15', description: 'Comprehensive PHI encryption audit report confirming AES-256 compliance.' },
      { id: 'ev_016', name: 'Encryption Key Rotation Certificate', type: 'certificate', url: '/evidence/af_011/key-rotation-cert.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-11-15', description: 'Certificate confirming successful encryption key rotation.' },
    ],
  },
  {
    id: 'af_012',
    title: 'SOC 2 Type II Annual Audit - Passed',
    severity: 'informational',
    status: 'closed',
    description: 'Annual SOC 2 Type II audit completed successfully for the authentication service. All trust service criteria met with no exceptions noted.',
    identifiedDate: '2024-10-15',
    dueDate: '2024-10-31',
    closedDate: '2024-10-15',
    assignee: 'Natalie White',
    auditor: 'Patricia Evans',
    correctiveAction: 'No corrective action required. SOC 2 Type II certification maintained.',
    evidence: [
      { id: 'ev_017', name: 'SOC 2 Type II Report', type: 'certificate', url: '/evidence/af_012/soc2-type2-report.pdf', uploadedBy: 'Patricia Evans', uploadedDate: '2024-10-15', description: 'SOC 2 Type II audit report with no exceptions.' },
    ],
  },
  {
    id: 'af_013',
    title: 'Disaster Recovery Test Q4 2024 - Passed',
    severity: 'informational',
    status: 'closed',
    description: 'Quarterly disaster recovery test completed successfully. Failover to US-West DR environment completed within RTO of 4 hours. Data integrity verified with zero data loss.',
    identifiedDate: '2024-10-20',
    dueDate: '2024-10-31',
    closedDate: '2024-10-20',
    assignee: 'Daniel Robinson',
    auditor: 'Patricia Evans',
    correctiveAction: 'No corrective action required. DR test met all RTO and RPO objectives.',
    evidence: [
      { id: 'ev_018', name: 'DR Test Results Report', type: 'report', url: '/evidence/af_013/dr-test-results.pdf', uploadedBy: 'Daniel Robinson', uploadedDate: '2024-10-20', description: 'Comprehensive DR test results showing successful failover and recovery.' },
      { id: 'ev_019', name: 'Data Integrity Verification', type: 'audit_log', url: '/evidence/af_013/data-integrity-verification.csv', uploadedBy: 'Daniel Robinson', uploadedDate: '2024-10-20', description: 'Data integrity check results confirming zero data loss during failover.' },
    ],
  },
  {
    id: 'af_014',
    title: 'HEDIS Supplemental Data Linkage Below Threshold',
    severity: 'high',
    status: 'open',
    description: 'HEDIS supplemental data linkage rate of 94.2% is below the 98% threshold. 2,340 records from electronic clinical data sources cannot be linked to member records due to missing crosswalk entries for recently enrolled members.',
    identifiedDate: '2024-12-03',
    dueDate: '2025-02-28',
    closedDate: '',
    assignee: 'Samantha Clark',
    auditor: 'Angela Martinez',
    correctiveAction: 'Update member ID crosswalk table to include all members enrolled within the last 90 days. Implement daily crosswalk refresh job. Add fuzzy matching as fallback for unlinked records.',
    evidence: [
      { id: 'ev_020', name: 'Supplemental Data Linkage Report', type: 'report', url: '/evidence/af_014/supplemental-data-linkage-report.pdf', uploadedBy: 'Samantha Clark', uploadedDate: '2024-12-03', description: 'Report showing 94.2% linkage rate with 2,340 unlinked records.' },
    ],
  },
  {
    id: 'af_015',
    title: 'Medicaid Redetermination Batch Processing Failures',
    severity: 'high',
    status: 'in_progress',
    description: 'Medicaid eligibility redetermination batch processing fails for 23 out of 12,450 records due to null pointer exceptions when processing members with null income data from the Medicaid unwinding process.',
    identifiedDate: '2024-11-30',
    dueDate: '2025-01-15',
    closedDate: '',
    assignee: 'Robert Kim',
    auditor: 'David Park',
    correctiveAction: 'Add null checks for income data before FPL calculation. Flag members with null income for manual review. Add batch processing error recovery for individual record failures.',
    evidence: [
      { id: 'ev_021', name: 'Batch Redetermination Error Log', type: 'log', url: '/evidence/af_015/batch-redetermination-errors.log', uploadedBy: 'Robert Kim', uploadedDate: '2024-11-30', description: 'Error log showing null pointer exceptions during batch processing.' },
    ],
  },
];

/**
 * Mock operating expectations for the EQIP Quality Platform.
 * @type {OperatingExpectation[]}
 */
const operatingExpectations = [
  {
    id: 'oe_001',
    name: 'Production System Uptime SLA',
    description: 'All production systems must maintain 99.9% uptime measured on a monthly basis with planned maintenance windows excluded from calculations.',
    category: 'operations',
    status: 'compliant',
    owner: 'Daniel Robinson',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    evidence: [
      { id: 'ev_022', name: 'Uptime Dashboard Report', type: 'report', url: '/evidence/oe_001/uptime-dashboard-dec2024.pdf', uploadedBy: 'Daniel Robinson', uploadedDate: '2024-12-01', description: 'Monthly uptime report showing 99.94% average across all production systems.' },
    ],
  },
  {
    id: 'oe_002',
    name: 'Minimum Automated Test Coverage',
    description: 'All applications must maintain minimum 80% automated test coverage for unit tests and 70% for integration tests. High-risk applications require 85% unit test coverage.',
    category: 'quality',
    status: 'partially_compliant',
    owner: 'Angela Martinez',
    lastReviewDate: '2024-12-05',
    nextReviewDate: '2025-03-05',
    evidence: [
      { id: 'ev_023', name: 'Test Coverage Summary', type: 'report', url: '/evidence/oe_002/test-coverage-summary.pdf', uploadedBy: 'Angela Martinez', uploadedDate: '2024-12-05', description: 'Test coverage report showing 3 applications below minimum thresholds.' },
    ],
  },
  {
    id: 'oe_003',
    name: 'PHI Data Encryption at Rest',
    description: 'All protected health information must be encrypted at rest using AES-256 encryption with enterprise key management and annual key rotation.',
    category: 'security',
    status: 'compliant',
    owner: 'Natalie White',
    lastReviewDate: '2024-11-15',
    nextReviewDate: '2025-05-15',
    evidence: [
      { id: 'ev_024', name: 'PHI Encryption Audit Report', type: 'report', url: '/evidence/oe_003/phi-encryption-audit.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-11-15', description: 'Annual PHI encryption audit confirming AES-256 compliance across all systems.' },
      { id: 'ev_025', name: 'Key Rotation Attestation', type: 'attestation', url: '/evidence/oe_003/key-rotation-attestation.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-11-15', description: 'Attestation confirming annual encryption key rotation completed.' },
    ],
  },
  {
    id: 'oe_004',
    name: 'Code Review Before Merge',
    description: 'All code changes require at least two peer reviews and approval before merge to the main branch. Security-sensitive changes require an additional security review.',
    category: 'development',
    status: 'compliant',
    owner: 'Robert Kim',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    evidence: [
      { id: 'ev_026', name: 'Code Review Compliance Report', type: 'report', url: '/evidence/oe_004/code-review-compliance.pdf', uploadedBy: 'Robert Kim', uploadedDate: '2024-12-01', description: 'Monthly code review compliance report showing 98.5% adherence.' },
    ],
  },
  {
    id: 'oe_005',
    name: 'CMS Regulatory Report Submission Deadlines',
    description: 'All CMS-mandated regulatory reports must be submitted by their respective deadlines with zero tolerance for late submissions.',
    category: 'compliance',
    status: 'compliant',
    owner: 'Patricia Evans',
    lastReviewDate: '2024-12-10',
    nextReviewDate: '2025-03-10',
    evidence: [
      { id: 'ev_027', name: 'CMS Submission Tracking Log', type: 'audit_log', url: '/evidence/oe_005/cms-submission-tracking.csv', uploadedBy: 'Patricia Evans', uploadedDate: '2024-12-10', description: 'Tracking log showing all CMS submissions delivered on time.' },
    ],
  },
  {
    id: 'oe_006',
    name: 'State Medicaid Reporting Deadlines',
    description: 'All state-mandated Medicaid reports must be submitted by their respective deadlines with data accuracy exceeding 99.9%.',
    category: 'compliance',
    status: 'non_compliant',
    owner: 'Patricia Evans',
    lastReviewDate: '2024-11-15',
    nextReviewDate: '2025-01-15',
    evidence: [
      { id: 'ev_028', name: 'State Reporting Deadline Tracker', type: 'report', url: '/evidence/oe_006/state-reporting-deadlines.pdf', uploadedBy: 'Patricia Evans', uploadedDate: '2024-11-15', description: 'Report showing 2 missed state reporting deadlines in Q3 2024.' },
    ],
  },
  {
    id: 'oe_007',
    name: 'Vendor Data Exchange Security',
    description: 'All vendor data exchanges must use encrypted channels with minimum TLS 1.2 and active Business Associate Agreements must be in place before any PHI exchange.',
    category: 'security',
    status: 'non_compliant',
    owner: 'Natalie White',
    lastReviewDate: '2024-11-18',
    nextReviewDate: '2025-01-18',
    evidence: [
      { id: 'ev_029', name: 'Vendor Security Assessment', type: 'report', url: '/evidence/oe_007/vendor-security-assessment.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-11-18', description: 'Assessment showing TLS 1.1 acceptance and BAA enforcement gaps.' },
    ],
  },
  {
    id: 'oe_008',
    name: 'WCAG 2.1 AA Accessibility Compliance',
    description: 'All member-facing web applications must meet WCAG 2.1 AA accessibility standards with quarterly accessibility audits and remediation within 30 days of finding identification.',
    category: 'compliance',
    status: 'partially_compliant',
    owner: 'Omar Hassan',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    evidence: [
      { id: 'ev_030', name: 'Accessibility Audit Report', type: 'report', url: '/evidence/oe_008/accessibility-audit-q4-2024.pdf', uploadedBy: 'Omar Hassan', uploadedDate: '2024-12-01', description: 'Q4 2024 accessibility audit showing 2 minor findings on claims history table.' },
    ],
  },
  {
    id: 'oe_009',
    name: 'Disaster Recovery Testing',
    description: 'Disaster recovery plans must be tested quarterly with documented results including RTO/RPO verification, data integrity checks, and failover validation.',
    category: 'operations',
    status: 'compliant',
    owner: 'Daniel Robinson',
    lastReviewDate: '2024-10-20',
    nextReviewDate: '2025-01-20',
    evidence: [
      { id: 'ev_031', name: 'Q4 2024 DR Test Results', type: 'report', url: '/evidence/oe_009/dr-test-q4-2024.pdf', uploadedBy: 'Daniel Robinson', uploadedDate: '2024-10-20', description: 'Q4 2024 DR test results showing successful failover within RTO.' },
    ],
  },
  {
    id: 'oe_010',
    name: 'Data Retention Policy Compliance',
    description: 'All data must be retained per regulatory requirements with a minimum of 10 years for CMS data and state-specific retention periods for Medicaid data.',
    category: 'data',
    status: 'compliant',
    owner: 'Samantha Clark',
    lastReviewDate: '2024-11-10',
    nextReviewDate: '2025-05-10',
    evidence: [
      { id: 'ev_032', name: 'Data Retention Compliance Report', type: 'report', url: '/evidence/oe_010/data-retention-compliance.pdf', uploadedBy: 'Samantha Clark', uploadedDate: '2024-11-10', description: 'Annual data retention compliance report confirming all retention policies are met.' },
    ],
  },
  {
    id: 'oe_011',
    name: 'Quality Gate Enforcement for All Releases',
    description: 'All production releases must pass defined quality gates before deployment. Waivers require VP-level approval with documented justification and expiration dates.',
    category: 'quality',
    status: 'partially_compliant',
    owner: 'Angela Martinez',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    evidence: [
      { id: 'ev_033', name: 'Quality Gate Compliance Summary', type: 'report', url: '/evidence/oe_011/quality-gate-compliance.pdf', uploadedBy: 'Angela Martinez', uploadedDate: '2024-12-01', description: 'Summary showing 62.5% quality gate pass rate with 8 active waivers.' },
    ],
  },
  {
    id: 'oe_012',
    name: 'API Versioning and Deprecation Policy',
    description: 'All API changes must follow semantic versioning with minimum 6-month deprecation notice for breaking changes and documented migration guides.',
    category: 'development',
    status: 'compliant',
    owner: 'Chris Anderson',
    lastReviewDate: '2024-11-10',
    nextReviewDate: '2025-05-10',
    evidence: [
      { id: 'ev_034', name: 'API Versioning Compliance Report', type: 'report', url: '/evidence/oe_012/api-versioning-compliance.pdf', uploadedBy: 'Chris Anderson', uploadedDate: '2024-11-10', description: 'Report confirming all API changes follow semantic versioning policy.' },
    ],
  },
  {
    id: 'oe_013',
    name: 'Performance SLA Compliance',
    description: 'All applications must meet defined performance SLAs including page load times under 2 seconds for 95th percentile and API response times under 500ms for 95th percentile.',
    category: 'operations',
    status: 'partially_compliant',
    owner: 'Marcus Thompson',
    lastReviewDate: '2024-12-05',
    nextReviewDate: '2025-03-05',
    evidence: [
      { id: 'ev_035', name: 'Performance SLA Dashboard', type: 'report', url: '/evidence/oe_013/performance-sla-dashboard.pdf', uploadedBy: 'Marcus Thompson', uploadedDate: '2024-12-05', description: 'Performance SLA dashboard showing 3 applications below target thresholds.' },
    ],
  },
  {
    id: 'oe_014',
    name: 'Session Management Security',
    description: 'All application sessions must timeout after 30 minutes of inactivity with secure token invalidation and proper session cleanup.',
    category: 'security',
    status: 'compliant',
    owner: 'Natalie White',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-06-01',
    evidence: [
      { id: 'ev_036', name: 'Session Management Audit', type: 'report', url: '/evidence/oe_014/session-management-audit.pdf', uploadedBy: 'Natalie White', uploadedDate: '2024-12-01', description: 'Audit confirming session timeout and token invalidation compliance.' },
    ],
  },
  {
    id: 'oe_015',
    name: 'PHI Access Logging',
    description: 'All access to protected health information must be logged with user identity, timestamp, action performed, and data accessed for audit trail purposes.',
    category: 'compliance',
    status: 'compliant',
    owner: 'Natalie White',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-06-01',
    evidence: [
      { id: 'ev_037', name: 'PHI Access Logging Audit', type: 'audit_log', url: '/evidence/oe_015/phi-access-logging-audit.csv', uploadedBy: 'Natalie White', uploadedDate: '2024-12-01', description: 'Audit log sample confirming comprehensive PHI access logging.' },
    ],
  },
];

/**
 * Combined governance data object.
 * @type {GovernanceData}
 */
const governance = {
  procedures,
  complianceScores,
  adherenceMetrics,
  auditFindings,
  operatingExpectations,
};

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all governance data.
 *
 * @returns {GovernanceData} The complete governance data object
 */
export function getAllGovernanceData() {
  return {
    procedures: [...procedures],
    complianceScores: [...complianceScores],
    adherenceMetrics: [...adherenceMetrics],
    auditFindings: [...auditFindings],
    operatingExpectations: [...operatingExpectations],
  };
}

// ---------------------------------------------------------------------------
// Procedure accessors
// ---------------------------------------------------------------------------

/**
 * Returns all governance procedures.
 *
 * @returns {Procedure[]} Array of all procedure objects
 */
export function getAllProcedures() {
  return [...procedures];
}

/**
 * Retrieves a single procedure by its unique ID.
 *
 * @param {string} procedureId - The procedure identifier to look up
 * @returns {Procedure|null} The matching procedure object, or null if not found
 */
export function getProcedureById(procedureId) {
  if (!procedureId || typeof procedureId !== 'string') {
    return null;
  }
  return procedures.find((p) => p.id === procedureId) || null;
}

/**
 * Returns all procedures filtered by category.
 *
 * @param {string} category - The category to filter by
 * @returns {Procedure[]} Array of procedures matching the specified category
 */
export function getProceduresByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  return procedures.filter((p) => p.category === category);
}

/**
 * Returns all procedures filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {Procedure[]} Array of procedures matching the specified status
 */
export function getProceduresByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return procedures.filter((p) => p.status === status);
}

/**
 * Returns all procedures applicable to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {Procedure[]} Array of procedures applicable to the specified segment
 */
export function getProceduresBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return procedures.filter((p) => p.applicableSegments.includes(segment));
}

/**
 * Returns all unique procedure categories.
 *
 * @returns {string[]} Array of unique procedure categories sorted alphabetically
 */
export function getAllProcedureCategories() {
  const categories = new Set(procedures.map((p) => p.category));
  return [...categories].sort();
}

/**
 * Returns all unique procedure statuses.
 *
 * @returns {string[]} Array of unique procedure statuses sorted alphabetically
 */
export function getAllProcedureStatuses() {
  const statuses = new Set(procedures.map((p) => p.status));
  return [...statuses].sort();
}

// ---------------------------------------------------------------------------
// Compliance score accessors
// ---------------------------------------------------------------------------

/**
 * Returns all compliance scores.
 *
 * @returns {ComplianceScore[]} Array of all compliance score objects
 */
export function getAllComplianceScores() {
  return [...complianceScores];
}

/**
 * Retrieves a single compliance score by its unique ID.
 *
 * @param {string} scoreId - The compliance score identifier to look up
 * @returns {ComplianceScore|null} The matching compliance score object, or null if not found
 */
export function getComplianceScoreById(scoreId) {
  if (!scoreId || typeof scoreId !== 'string') {
    return null;
  }
  return complianceScores.find((cs) => cs.id === scoreId) || null;
}

/**
 * Retrieves a compliance score by framework name.
 *
 * @param {string} framework - The framework name to look up
 * @returns {ComplianceScore|null} The matching compliance score object, or null if not found
 */
export function getComplianceScoreByFramework(framework) {
  if (!framework || typeof framework !== 'string') {
    return null;
  }
  return complianceScores.find((cs) => cs.framework === framework) || null;
}

/**
 * Returns all compliance scores filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {ComplianceScore[]} Array of compliance scores matching the specified status
 */
export function getComplianceScoresByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return complianceScores.filter((cs) => cs.status === status);
}

/**
 * Returns all unique compliance framework names.
 *
 * @returns {string[]} Array of unique framework names sorted alphabetically
 */
export function getAllComplianceFrameworks() {
  const frameworks = new Set(complianceScores.map((cs) => cs.framework));
  return [...frameworks].sort();
}

// ---------------------------------------------------------------------------
// Adherence metric accessors
// ---------------------------------------------------------------------------

/**
 * Returns all adherence metrics.
 *
 * @returns {AdherenceMetric[]} Array of all adherence metric objects
 */
export function getAllAdherenceMetrics() {
  return [...adherenceMetrics];
}

/**
 * Returns all adherence metrics filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'met', 'not_met', 'at_risk', 'pending')
 * @returns {AdherenceMetric[]} Array of adherence metrics matching the specified status
 */
export function getAdherenceMetricsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return adherenceMetrics.filter((m) => m.status === status);
}

/**
 * Returns all adherence metrics filtered by trend.
 *
 * @param {string} trend - The trend to filter by (e.g. 'improving', 'declining', 'stable')
 * @returns {AdherenceMetric[]} Array of adherence metrics matching the specified trend
 */
export function getAdherenceMetricsByTrend(trend) {
  if (!trend || typeof trend !== 'string') {
    return [];
  }
  return adherenceMetrics.filter((m) => m.trend === trend);
}

// ---------------------------------------------------------------------------
// Audit finding accessors
// ---------------------------------------------------------------------------

/**
 * Returns all audit findings.
 *
 * @returns {AuditFinding[]} Array of all audit finding objects
 */
export function getAllAuditFindings() {
  return [...auditFindings];
}

/**
 * Retrieves a single audit finding by its unique ID.
 *
 * @param {string} findingId - The finding identifier to look up
 * @returns {AuditFinding|null} The matching audit finding object, or null if not found
 */
export function getAuditFindingById(findingId) {
  if (!findingId || typeof findingId !== 'string') {
    return null;
  }
  return auditFindings.find((f) => f.id === findingId) || null;
}

/**
 * Returns all audit findings filtered by severity.
 *
 * @param {string} severity - The severity to filter by (e.g. 'critical', 'high', 'medium', 'low', 'informational')
 * @returns {AuditFinding[]} Array of audit findings matching the specified severity
 */
export function getAuditFindingsBySeverity(severity) {
  if (!severity || typeof severity !== 'string') {
    return [];
  }
  return auditFindings.filter((f) => f.severity === severity);
}

/**
 * Returns all audit findings filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'open', 'in_progress', 'remediated', 'closed', 'accepted_risk')
 * @returns {AuditFinding[]} Array of audit findings matching the specified status
 */
export function getAuditFindingsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return auditFindings.filter((f) => f.status === status);
}

/**
 * Returns all audit findings assigned to a specific person.
 *
 * @param {string} assignee - The assignee name to filter by
 * @returns {AuditFinding[]} Array of audit findings assigned to the specified person
 */
export function getAuditFindingsByAssignee(assignee) {
  if (!assignee || typeof assignee !== 'string') {
    return [];
  }
  return auditFindings.filter((f) => f.assignee === assignee);
}

/**
 * Returns all open audit findings (status is 'open' or 'in_progress').
 *
 * @returns {AuditFinding[]} Array of open audit findings
 */
export function getOpenAuditFindings() {
  return auditFindings.filter((f) => f.status === 'open' || f.status === 'in_progress');
}

/**
 * Returns all unique audit finding severities.
 *
 * @returns {string[]} Array of unique severities sorted by priority
 */
export function getAllAuditFindingSeverities() {
  return ['critical', 'high', 'medium', 'low', 'informational'];
}

/**
 * Returns all unique audit finding statuses.
 *
 * @returns {string[]} Array of unique statuses sorted alphabetically
 */
export function getAllAuditFindingStatuses() {
  const statuses = new Set(auditFindings.map((f) => f.status));
  return [...statuses].sort();
}

// ---------------------------------------------------------------------------
// Operating expectation accessors
// ---------------------------------------------------------------------------

/**
 * Returns all operating expectations.
 *
 * @returns {OperatingExpectation[]} Array of all operating expectation objects
 */
export function getAllOperatingExpectations() {
  return [...operatingExpectations];
}

/**
 * Retrieves a single operating expectation by its unique ID.
 *
 * @param {string} expectationId - The expectation identifier to look up
 * @returns {OperatingExpectation|null} The matching operating expectation object, or null if not found
 */
export function getOperatingExpectationById(expectationId) {
  if (!expectationId || typeof expectationId !== 'string') {
    return null;
  }
  return operatingExpectations.find((oe) => oe.id === expectationId) || null;
}

/**
 * Returns all operating expectations filtered by category.
 *
 * @param {string} category - The category to filter by
 * @returns {OperatingExpectation[]} Array of operating expectations matching the specified category
 */
export function getOperatingExpectationsByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  return operatingExpectations.filter((oe) => oe.category === category);
}

/**
 * Returns all operating expectations filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {OperatingExpectation[]} Array of operating expectations matching the specified status
 */
export function getOperatingExpectationsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return operatingExpectations.filter((oe) => oe.status === status);
}

/**
 * Returns all unique operating expectation categories.
 *
 * @returns {string[]} Array of unique categories sorted alphabetically
 */
export function getAllOperatingExpectationCategories() {
  const categories = new Set(operatingExpectations.map((oe) => oe.category));
  return [...categories].sort();
}

/**
 * Returns all unique operating expectation statuses.
 *
 * @returns {string[]} Array of unique statuses sorted alphabetically
 */
export function getAllOperatingExpectationStatuses() {
  const statuses = new Set(operatingExpectations.map((oe) => oe.status));
  return [...statuses].sort();
}

// ---------------------------------------------------------------------------
// Aggregate statistics
// ---------------------------------------------------------------------------

/**
 * Returns aggregate statistics across all governance data.
 *
 * @returns {{ totalProcedures: number, activeProcedures: number, totalComplianceFrameworks: number, averageComplianceScore: number, totalAuditFindings: number, openFindings: number, criticalFindings: number, totalOperatingExpectations: number, compliantExpectations: number, nonCompliantExpectations: number, adherenceMetMet: number, adherenceNotMet: number, procedureCategoryBreakdown: Object<string, number>, findingSeverityBreakdown: Object<string, number>, findingStatusBreakdown: Object<string, number>, expectationStatusBreakdown: Object<string, number> }} Aggregate governance statistics
 */
export function getGovernanceAggregates() {
  const totalProcedures = procedures.length;
  const activeProcedures = procedures.filter((p) => p.status === 'active').length;

  const totalComplianceFrameworks = complianceScores.length;
  const averageComplianceScore =
    totalComplianceFrameworks > 0
      ? Math.round((complianceScores.reduce((sum, cs) => sum + cs.overallScore, 0) / totalComplianceFrameworks) * 10) / 10
      : 0;

  const totalAuditFindings = auditFindings.length;
  const openFindings = auditFindings.filter((f) => f.status === 'open' || f.status === 'in_progress').length;
  const criticalFindings = auditFindings.filter((f) => f.severity === 'critical' && (f.status === 'open' || f.status === 'in_progress')).length;

  const totalOperatingExpectations = operatingExpectations.length;
  const compliantExpectations = operatingExpectations.filter((oe) => oe.status === 'compliant').length;
  const nonCompliantExpectations = operatingExpectations.filter((oe) => oe.status === 'non_compliant').length;

  const adherenceMetMet = adherenceMetrics.filter((m) => m.status === 'met').length;
  const adherenceNotMet = adherenceMetrics.filter((m) => m.status === 'not_met').length;

  const procedureCategoryBreakdown = procedures.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const findingSeverityBreakdown = auditFindings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {});

  const findingStatusBreakdown = auditFindings.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const expectationStatusBreakdown = operatingExpectations.reduce((acc, oe) => {
    acc[oe.status] = (acc[oe.status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalProcedures,
    activeProcedures,
    totalComplianceFrameworks,
    averageComplianceScore,
    totalAuditFindings,
    openFindings,
    criticalFindings,
    totalOperatingExpectations,
    compliantExpectations,
    nonCompliantExpectations,
    adherenceMetMet,
    adherenceNotMet,
    procedureCategoryBreakdown,
    findingSeverityBreakdown,
    findingStatusBreakdown,
    expectationStatusBreakdown,
  };
}

export default governance;