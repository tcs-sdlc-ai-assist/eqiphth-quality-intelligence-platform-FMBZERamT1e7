import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} IntegrationConfig
 * @property {string} baseUrl - Base URL for the integration endpoint
 * @property {string} authType - Authentication type (oauth2, api_key, basic, saml, oidc, token, certificate)
 * @property {boolean} autoSync - Whether automatic synchronization is enabled
 * @property {number} syncIntervalMinutes - Synchronization interval in minutes
 * @property {string} environment - Target environment (production, staging, development)
 * @property {string[]} scopes - Array of permission scopes or access levels
 * @property {Object<string, string>} customFields - Custom configuration key-value pairs
 */

/**
 * @typedef {Object} ErrorState
 * @property {boolean} hasError - Whether the integration currently has an error
 * @property {string} errorMessage - Error message description (empty string if no error)
 * @property {string} errorCode - Error code identifier (empty string if no error)
 * @property {string} lastErrorDate - Date of the last error in ISO format (empty string if no error)
 * @property {number} consecutiveFailures - Number of consecutive sync failures
 */

/**
 * @typedef {Object} SyncHistory
 * @property {string} timestamp - Sync event timestamp in ISO format
 * @property {string} status - Sync status (success, failed, partial)
 * @property {number} recordsProcessed - Number of records processed
 * @property {number} recordsFailed - Number of records that failed
 * @property {string} details - Description of the sync event
 */

/**
 * @typedef {Object} Integration
 * @property {string} id - Unique integration identifier
 * @property {string} name - Display name of the integration
 * @property {string} type - Integration type (devops, test_management, project_management, portfolio_management, source_control, ci_cd, code_quality, security_scanning, cast_analysis, apm, logging, itsm, analytics, collaboration, identity, hr)
 * @property {string} status - Current integration status (active, inactive, error, maintenance, pending)
 * @property {string} lastSync - Last successful sync timestamp in ISO format (empty string if never synced)
 * @property {ErrorState} errorState - Current error state information
 * @property {IntegrationConfig} config - Integration configuration
 * @property {string} owner - Name of the person responsible for the integration
 * @property {string} description - Description of the integration purpose
 * @property {string} vendor - Vendor or provider name
 * @property {string} version - Integration version or API version
 * @property {string} createdDate - Integration creation date in ISO format
 * @property {string} lastModifiedDate - Last modification date in ISO format
 * @property {string[]} connectedApplications - Array of application IDs connected through this integration
 * @property {SyncHistory[]} syncHistory - Array of recent sync history entries
 */

/**
 * Mock integration data for the EQIP Quality Platform.
 * Contains integration objects representing various external tool connections
 * with status, configuration, error state, and sync history information.
 *
 * @type {Integration[]}
 */
const integrations = [
  {
    id: 'int_azure_devops',
    name: 'Azure DevOps',
    type: 'devops',
    status: 'active',
    lastSync: '2024-12-12T14:30:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://dev.azure.com/eqip-org',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 15,
      environment: 'production',
      scopes: ['work_items.read', 'work_items.write', 'pipelines.read', 'repos.read'],
      customFields: {
        organization: 'eqip-org',
        defaultProject: 'EQIP-Platform',
        workItemTypes: 'Bug,Task,User Story,Feature',
      },
    },
    owner: 'Daniel Robinson',
    description: 'Primary DevOps platform integration for work item tracking, pipeline management, and repository access across all enterprise applications.',
    vendor: 'Microsoft',
    version: '7.1',
    createdDate: '2022-03-15',
    lastModifiedDate: '2024-11-20',
    connectedApplications: ['app_claims_engine', 'app_member_portal', 'app_auth_service', 'app_data_warehouse', 'app_notification_hub', 'app_provider_directory'],
    syncHistory: [
      { timestamp: '2024-12-12T14:30:00Z', status: 'success', recordsProcessed: 1245, recordsFailed: 0, details: 'Full sync completed. Work items, pipelines, and repository data synchronized.' },
      { timestamp: '2024-12-12T14:15:00Z', status: 'success', recordsProcessed: 87, recordsFailed: 0, details: 'Incremental sync. 87 work item updates processed.' },
      { timestamp: '2024-12-12T14:00:00Z', status: 'success', recordsProcessed: 42, recordsFailed: 0, details: 'Incremental sync. 42 pipeline run results processed.' },
    ],
  },
  {
    id: 'int_qtest',
    name: 'qTest',
    type: 'test_management',
    status: 'active',
    lastSync: '2024-12-12T14:00:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://eqip.qtestnet.com/api/v3',
      authType: 'api_key',
      autoSync: true,
      syncIntervalMinutes: 30,
      environment: 'production',
      scopes: ['test_cases.read', 'test_cases.write', 'test_runs.read', 'test_runs.write', 'requirements.read'],
      customFields: {
        projectId: 'EQIP-QA',
        testCyclePrefix: 'TC-',
        defectIntegration: 'jira',
      },
    },
    owner: 'Angela Martinez',
    description: 'Enterprise test management platform integration for test case management, test execution tracking, and requirements traceability.',
    vendor: 'Tricentis',
    version: '10.5',
    createdDate: '2022-06-01',
    lastModifiedDate: '2024-12-01',
    connectedApplications: ['app_claims_engine', 'app_member_portal', 'app_medicare_enrollment', 'app_hedis_engine', 'app_medicaid_eligibility'],
    syncHistory: [
      { timestamp: '2024-12-12T14:00:00Z', status: 'success', recordsProcessed: 3420, recordsFailed: 0, details: 'Full sync completed. Test cases, test runs, and defect links synchronized.' },
      { timestamp: '2024-12-12T13:30:00Z', status: 'success', recordsProcessed: 156, recordsFailed: 0, details: 'Incremental sync. 156 test execution results processed.' },
      { timestamp: '2024-12-12T13:00:00Z', status: 'success', recordsProcessed: 89, recordsFailed: 0, details: 'Incremental sync. 89 test case updates processed.' },
    ],
  },
  {
    id: 'int_jira',
    name: 'Jira',
    type: 'project_management',
    status: 'active',
    lastSync: '2024-12-12T14:45:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://eqip-health.atlassian.net/rest/api/3',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 10,
      environment: 'production',
      scopes: ['read:jira-work', 'write:jira-work', 'read:jira-user', 'read:sprint:jira-software'],
      customFields: {
        cloudId: 'eqip-health-cloud',
        defaultProject: 'EQIP',
        issueTypes: 'Story,Bug,Task,Epic,Sub-task',
        customFieldMapping: 'cf_10001=segment,cf_10002=application',
      },
    },
    owner: 'Robert Kim',
    description: 'Project management and issue tracking integration for agile development workflows, sprint management, and defect tracking across all segments.',
    vendor: 'Atlassian',
    version: '3.0',
    createdDate: '2021-09-01',
    lastModifiedDate: '2024-11-15',
    connectedApplications: ['app_claims_engine', 'app_member_portal', 'app_provider_directory', 'app_auth_service', 'app_medicare_enrollment', 'app_hedis_engine', 'app_medicaid_eligibility', 'app_care_management', 'app_group_enrollment', 'app_broker_portal'],
    syncHistory: [
      { timestamp: '2024-12-12T14:45:00Z', status: 'success', recordsProcessed: 2180, recordsFailed: 0, details: 'Full sync completed. Issues, sprints, and board data synchronized.' },
      { timestamp: '2024-12-12T14:35:00Z', status: 'success', recordsProcessed: 64, recordsFailed: 0, details: 'Incremental sync. 64 issue updates processed.' },
      { timestamp: '2024-12-12T14:25:00Z', status: 'success', recordsProcessed: 31, recordsFailed: 0, details: 'Incremental sync. 31 sprint updates processed.' },
    ],
  },
  {
    id: 'int_jira_align',
    name: 'Jira Align',
    type: 'portfolio_management',
    status: 'active',
    lastSync: '2024-12-12T13:00:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://eqip-health.jiraalign.com/rest/align/api/2',
      authType: 'api_key',
      autoSync: true,
      syncIntervalMinutes: 60,
      environment: 'production',
      scopes: ['portfolios.read', 'programs.read', 'epics.read', 'features.read', 'objectives.read'],
      customFields: {
        instanceId: 'eqip-align-prod',
        portfolioId: 'PF-001',
        programIncrementPrefix: 'PI-',
      },
    },
    owner: 'Jennifer Williams',
    description: 'Portfolio management integration for strategic alignment, program increment planning, and cross-segment dependency tracking.',
    vendor: 'Atlassian',
    version: '2.0',
    createdDate: '2023-01-15',
    lastModifiedDate: '2024-10-30',
    connectedApplications: ['app_claims_engine', 'app_medicare_enrollment', 'app_medicaid_eligibility', 'app_partner_api_gateway'],
    syncHistory: [
      { timestamp: '2024-12-12T13:00:00Z', status: 'success', recordsProcessed: 845, recordsFailed: 0, details: 'Full sync completed. Portfolio items, program increments, and objectives synchronized.' },
      { timestamp: '2024-12-12T12:00:00Z', status: 'success', recordsProcessed: 23, recordsFailed: 0, details: 'Incremental sync. 23 feature status updates processed.' },
      { timestamp: '2024-12-12T11:00:00Z', status: 'success', recordsProcessed: 12, recordsFailed: 0, details: 'Incremental sync. 12 dependency updates processed.' },
    ],
  },
  {
    id: 'int_github',
    name: 'GitHub',
    type: 'source_control',
    status: 'active',
    lastSync: '2024-12-12T14:50:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://api.github.com',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 5,
      environment: 'production',
      scopes: ['repo', 'read:org', 'read:user', 'workflow', 'read:packages'],
      customFields: {
        organization: 'eqip-health',
        defaultBranch: 'main',
        protectedBranches: 'main,develop,release/*',
        webhookSecret: '********',
      },
    },
    owner: 'Chris Anderson',
    description: 'Source code management integration for repository access, pull request tracking, code review metrics, and GitHub Actions workflow monitoring.',
    vendor: 'GitHub',
    version: '2022-11-28',
    createdDate: '2021-06-01',
    lastModifiedDate: '2024-12-05',
    connectedApplications: ['app_member_portal', 'app_notification_hub', 'app_broker_portal', 'app_wellness_platform', 'app_compliance_dashboard', 'app_individual_marketplace'],
    syncHistory: [
      { timestamp: '2024-12-12T14:50:00Z', status: 'success', recordsProcessed: 567, recordsFailed: 0, details: 'Full sync completed. Repositories, pull requests, and workflow runs synchronized.' },
      { timestamp: '2024-12-12T14:45:00Z', status: 'success', recordsProcessed: 34, recordsFailed: 0, details: 'Incremental sync. 34 commit and PR updates processed.' },
      { timestamp: '2024-12-12T14:40:00Z', status: 'success', recordsProcessed: 18, recordsFailed: 0, details: 'Incremental sync. 18 workflow run results processed.' },
    ],
  },
  {
    id: 'int_gitlab',
    name: 'GitLab',
    type: 'source_control',
    status: 'active',
    lastSync: '2024-12-12T14:20:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://gitlab.eqip-health.com/api/v4',
      authType: 'token',
      autoSync: true,
      syncIntervalMinutes: 10,
      environment: 'production',
      scopes: ['read_api', 'read_repository', 'read_user', 'read_registry'],
      customFields: {
        groupId: 'eqip-platform',
        defaultBranch: 'main',
        ciConfigPath: '.gitlab-ci.yml',
      },
    },
    owner: 'Robert Kim',
    description: 'Self-hosted GitLab integration for Medicaid and compliance segment source code management, CI/CD pipelines, and container registry access.',
    vendor: 'GitLab',
    version: '16.8',
    createdDate: '2022-01-10',
    lastModifiedDate: '2024-11-28',
    connectedApplications: ['app_medicaid_eligibility', 'app_state_reporting', 'app_care_management', 'app_provider_network', 'app_audit_tracker', 'app_regulatory_reporting', 'app_risk_assessment'],
    syncHistory: [
      { timestamp: '2024-12-12T14:20:00Z', status: 'success', recordsProcessed: 423, recordsFailed: 0, details: 'Full sync completed. Projects, merge requests, and pipeline data synchronized.' },
      { timestamp: '2024-12-12T14:10:00Z', status: 'success', recordsProcessed: 28, recordsFailed: 0, details: 'Incremental sync. 28 merge request updates processed.' },
      { timestamp: '2024-12-12T14:00:00Z', status: 'success', recordsProcessed: 15, recordsFailed: 0, details: 'Incremental sync. 15 pipeline results processed.' },
    ],
  },
  {
    id: 'int_jenkins',
    name: 'Jenkins',
    type: 'ci_cd',
    status: 'active',
    lastSync: '2024-12-12T14:10:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://jenkins.eqip-health.com/api',
      authType: 'api_key',
      autoSync: true,
      syncIntervalMinutes: 5,
      environment: 'production',
      scopes: ['job.read', 'build.read', 'node.read', 'view.read'],
      customFields: {
        masterUrl: 'https://jenkins.eqip-health.com',
        agentLabels: 'linux,docker,maven,gradle',
        pipelinePrefix: 'eqip-',
      },
    },
    owner: 'Daniel Robinson',
    description: 'CI/CD pipeline integration for legacy Java-based applications including claims engine, Medicare enrollment, and HEDIS engine build and deployment automation.',
    vendor: 'Jenkins',
    version: '2.426',
    createdDate: '2020-04-01',
    lastModifiedDate: '2024-11-10',
    connectedApplications: ['app_claims_engine', 'app_medicare_enrollment', 'app_hedis_engine', 'app_benefits_admin', 'app_data_warehouse'],
    syncHistory: [
      { timestamp: '2024-12-12T14:10:00Z', status: 'success', recordsProcessed: 312, recordsFailed: 0, details: 'Full sync completed. Jobs, builds, and node status synchronized.' },
      { timestamp: '2024-12-12T14:05:00Z', status: 'success', recordsProcessed: 22, recordsFailed: 0, details: 'Incremental sync. 22 build results processed.' },
      { timestamp: '2024-12-12T14:00:00Z', status: 'success', recordsProcessed: 8, recordsFailed: 0, details: 'Incremental sync. 8 pipeline stage updates processed.' },
    ],
  },
  {
    id: 'int_harness',
    name: 'Harness',
    type: 'ci_cd',
    status: 'active',
    lastSync: '2024-12-12T14:25:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://app.harness.io/gateway/api',
      authType: 'api_key',
      autoSync: true,
      syncIntervalMinutes: 10,
      environment: 'production',
      scopes: ['pipeline.read', 'deployment.read', 'service.read', 'environment.read', 'connector.read'],
      customFields: {
        accountId: 'eqip-health-prod',
        orgIdentifier: 'eqip',
        projectIdentifier: 'quality-platform',
        featureFlags: 'CD_GITOPS,CI_DOCKER_LAYER_CACHING',
      },
    },
    owner: 'Amanda Garcia',
    description: 'Modern CI/CD platform integration for cloud-native applications including member portal, broker portal, and wellness platform deployment pipelines.',
    vendor: 'Harness',
    version: '1.0',
    createdDate: '2023-06-01',
    lastModifiedDate: '2024-12-08',
    connectedApplications: ['app_member_portal', 'app_broker_portal', 'app_wellness_platform', 'app_individual_marketplace', 'app_notification_hub', 'app_compliance_dashboard'],
    syncHistory: [
      { timestamp: '2024-12-12T14:25:00Z', status: 'success', recordsProcessed: 198, recordsFailed: 0, details: 'Full sync completed. Pipelines, deployments, and service data synchronized.' },
      { timestamp: '2024-12-12T14:15:00Z', status: 'success', recordsProcessed: 14, recordsFailed: 0, details: 'Incremental sync. 14 deployment status updates processed.' },
      { timestamp: '2024-12-12T14:05:00Z', status: 'success', recordsProcessed: 9, recordsFailed: 0, details: 'Incremental sync. 9 pipeline execution results processed.' },
    ],
  },
  {
    id: 'int_azure_pipelines',
    name: 'Azure Pipelines',
    type: 'ci_cd',
    status: 'active',
    lastSync: '2024-12-12T14:35:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://dev.azure.com/eqip-org/_apis/pipelines',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 10,
      environment: 'production',
      scopes: ['pipelines.read', 'build.read', 'release.read', 'environment.read'],
      customFields: {
        organization: 'eqip-org',
        project: 'EQIP-Platform',
        agentPoolName: 'eqip-hosted-agents',
        serviceConnectionId: 'sc-azure-prod',
      },
    },
    owner: 'Daniel Robinson',
    description: 'Azure Pipelines integration for .NET and Azure-hosted application build, test, and deployment automation including Part D Formulary and underwriting engine.',
    vendor: 'Microsoft',
    version: '7.1',
    createdDate: '2022-08-15',
    lastModifiedDate: '2024-11-25',
    connectedApplications: ['app_part_d_formulary', 'app_underwriting_engine', 'app_group_enrollment', 'app_auth_service'],
    syncHistory: [
      { timestamp: '2024-12-12T14:35:00Z', status: 'success', recordsProcessed: 245, recordsFailed: 0, details: 'Full sync completed. Pipeline runs, releases, and environment data synchronized.' },
      { timestamp: '2024-12-12T14:25:00Z', status: 'success', recordsProcessed: 18, recordsFailed: 0, details: 'Incremental sync. 18 build results processed.' },
      { timestamp: '2024-12-12T14:15:00Z', status: 'success', recordsProcessed: 7, recordsFailed: 0, details: 'Incremental sync. 7 release deployment updates processed.' },
    ],
  },
  {
    id: 'int_sonarqube',
    name: 'SonarQube',
    type: 'code_quality',
    status: 'active',
    lastSync: '2024-12-12T13:45:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://sonar.eqip-health.com/api',
      authType: 'token',
      autoSync: true,
      syncIntervalMinutes: 30,
      environment: 'production',
      scopes: ['scan', 'provisioning', 'user', 'admin'],
      customFields: {
        qualityGateId: 'eqip-standard',
        defaultProfile: 'eqip-java-profile',
        newCodePeriod: 'previous_version',
        branchAnalysis: 'true',
      },
    },
    owner: 'Angela Martinez',
    description: 'Static code analysis integration for code quality metrics, technical debt tracking, code coverage reporting, and quality gate enforcement across all applications.',
    vendor: 'SonarSource',
    version: '10.3',
    createdDate: '2021-03-01',
    lastModifiedDate: '2024-12-02',
    connectedApplications: ['app_claims_engine', 'app_member_portal', 'app_auth_service', 'app_medicare_enrollment', 'app_hedis_engine', 'app_medicaid_eligibility', 'app_broker_portal', 'app_partner_api_gateway'],
    syncHistory: [
      { timestamp: '2024-12-12T13:45:00Z', status: 'success', recordsProcessed: 1890, recordsFailed: 0, details: 'Full sync completed. Project analyses, quality gate results, and coverage data synchronized.' },
      { timestamp: '2024-12-12T13:15:00Z', status: 'success', recordsProcessed: 45, recordsFailed: 0, details: 'Incremental sync. 45 analysis results processed from recent builds.' },
      { timestamp: '2024-12-12T12:45:00Z', status: 'success', recordsProcessed: 32, recordsFailed: 0, details: 'Incremental sync. 32 quality gate status updates processed.' },
    ],
  },
  {
    id: 'int_checkmarx',
    name: 'Checkmarx',
    type: 'security_scanning',
    status: 'active',
    lastSync: '2024-12-12T12:00:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://checkmarx.eqip-health.com/cxrestapi',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 60,
      environment: 'production',
      scopes: ['sast.read', 'sca.read', 'reports.read', 'projects.read'],
      customFields: {
        teamId: 'eqip-security',
        presetName: 'EQIP-HIPAA-Preset',
        scanType: 'full',
        engineConfiguration: 'Default Configuration',
      },
    },
    owner: 'Natalie White',
    description: 'Application security testing integration for SAST and SCA scanning, vulnerability tracking, and security compliance reporting across all applications.',
    vendor: 'Checkmarx',
    version: '9.5',
    createdDate: '2022-02-01',
    lastModifiedDate: '2024-11-18',
    connectedApplications: ['app_claims_engine', 'app_auth_service', 'app_medicare_enrollment', 'app_partner_api_gateway', 'app_vendor_integration', 'app_medicaid_eligibility'],
    syncHistory: [
      { timestamp: '2024-12-12T12:00:00Z', status: 'success', recordsProcessed: 678, recordsFailed: 0, details: 'Full sync completed. Scan results, vulnerabilities, and compliance data synchronized.' },
      { timestamp: '2024-12-12T11:00:00Z', status: 'success', recordsProcessed: 24, recordsFailed: 0, details: 'Incremental sync. 24 new vulnerability findings processed.' },
      { timestamp: '2024-12-12T10:00:00Z', status: 'success', recordsProcessed: 15, recordsFailed: 0, details: 'Incremental sync. 15 vulnerability status updates processed.' },
    ],
  },
  {
    id: 'int_cast',
    name: 'CAST',
    type: 'cast_analysis',
    status: 'active',
    lastSync: '2024-12-11T22:00:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://cast.eqip-health.com/rest/api',
      authType: 'api_key',
      autoSync: true,
      syncIntervalMinutes: 1440,
      environment: 'production',
      scopes: ['applications.read', 'snapshots.read', 'metrics.read', 'rules.read'],
      customFields: {
        domainId: 'eqip-platform',
        analysisProfile: 'EQIP-Standard',
        healthFactors: 'Transferability,Changeability,Robustness,Efficiency,Security',
        snapshotRetention: '12',
      },
    },
    owner: 'Angela Martinez',
    description: 'Software intelligence platform integration for structural code analysis, technical debt measurement, architectural health scoring, and software risk assessment.',
    vendor: 'CAST Software',
    version: '8.3',
    createdDate: '2022-09-01',
    lastModifiedDate: '2024-11-30',
    connectedApplications: ['app_claims_engine', 'app_medicare_enrollment', 'app_hedis_engine', 'app_medicaid_eligibility', 'app_data_warehouse', 'app_partner_api_gateway', 'app_vendor_integration'],
    syncHistory: [
      { timestamp: '2024-12-11T22:00:00Z', status: 'success', recordsProcessed: 2450, recordsFailed: 0, details: 'Nightly full analysis sync completed. Application health scores, technical debt, and rule violations synchronized.' },
      { timestamp: '2024-12-10T22:00:00Z', status: 'success', recordsProcessed: 2380, recordsFailed: 0, details: 'Nightly full analysis sync completed. 7 new critical violations detected.' },
      { timestamp: '2024-12-09T22:00:00Z', status: 'success', recordsProcessed: 2410, recordsFailed: 0, details: 'Nightly full analysis sync completed. Architecture health improved by 0.3 points.' },
    ],
  },
  {
    id: 'int_dynatrace',
    name: 'Dynatrace',
    type: 'apm',
    status: 'active',
    lastSync: '2024-12-12T14:55:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://eqip.live.dynatrace.com/api/v2',
      authType: 'api_key',
      autoSync: true,
      syncIntervalMinutes: 5,
      environment: 'production',
      scopes: ['metrics.read', 'entities.read', 'problems.read', 'events.read', 'slo.read'],
      customFields: {
        environmentId: 'eqip-prod',
        managementZone: 'EQIP-Platform',
        sloDefinitions: 'availability,response_time,error_rate',
        alertingProfile: 'eqip-critical',
      },
    },
    owner: 'Marcus Thompson',
    description: 'Application performance monitoring integration for real-time performance metrics, SLO tracking, problem detection, and root cause analysis across all production applications.',
    vendor: 'Dynatrace',
    version: '1.0',
    createdDate: '2021-11-01',
    lastModifiedDate: '2024-12-10',
    connectedApplications: ['app_claims_engine', 'app_member_portal', 'app_auth_service', 'app_medicare_enrollment', 'app_hedis_engine', 'app_partner_api_gateway', 'app_data_warehouse'],
    syncHistory: [
      { timestamp: '2024-12-12T14:55:00Z', status: 'success', recordsProcessed: 4520, recordsFailed: 0, details: 'Real-time sync. Performance metrics, SLO status, and active problems synchronized.' },
      { timestamp: '2024-12-12T14:50:00Z', status: 'success', recordsProcessed: 3890, recordsFailed: 0, details: 'Real-time sync. Response time and error rate metrics updated.' },
      { timestamp: '2024-12-12T14:45:00Z', status: 'success', recordsProcessed: 4100, recordsFailed: 0, details: 'Real-time sync. 2 new problems detected and correlated.' },
    ],
  },
  {
    id: 'int_splunk',
    name: 'Splunk',
    type: 'logging',
    status: 'active',
    lastSync: '2024-12-12T14:50:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://splunk.eqip-health.com:8089/services',
      authType: 'token',
      autoSync: true,
      syncIntervalMinutes: 5,
      environment: 'production',
      scopes: ['search.read', 'alerts.read', 'dashboards.read', 'saved_searches.read'],
      customFields: {
        indexPrefix: 'eqip_',
        searchHead: 'splunk-sh.eqip-health.com',
        retentionDays: '90',
        alertActions: 'email,slack,pagerduty',
      },
    },
    owner: 'Karen Mitchell',
    description: 'Centralized logging and observability integration for log aggregation, security event monitoring, operational dashboards, and alert management across all environments.',
    vendor: 'Splunk',
    version: '9.1',
    createdDate: '2020-08-01',
    lastModifiedDate: '2024-12-05',
    connectedApplications: ['app_claims_engine', 'app_member_portal', 'app_auth_service', 'app_medicare_enrollment', 'app_partner_api_gateway', 'app_vendor_integration', 'app_external_data_feed'],
    syncHistory: [
      { timestamp: '2024-12-12T14:50:00Z', status: 'success', recordsProcessed: 8920, recordsFailed: 0, details: 'Real-time sync. Log events, alerts, and dashboard data synchronized.' },
      { timestamp: '2024-12-12T14:45:00Z', status: 'success', recordsProcessed: 7650, recordsFailed: 0, details: 'Real-time sync. 3 new alerts triggered and correlated.' },
      { timestamp: '2024-12-12T14:40:00Z', status: 'success', recordsProcessed: 8100, recordsFailed: 0, details: 'Real-time sync. Security event monitoring data updated.' },
    ],
  },
  {
    id: 'int_servicenow',
    name: 'ServiceNow',
    type: 'itsm',
    status: 'active',
    lastSync: '2024-12-12T14:40:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://eqiphealth.service-now.com/api',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 15,
      environment: 'production',
      scopes: ['incident.read', 'incident.write', 'change.read', 'change.write', 'cmdb.read', 'problem.read'],
      customFields: {
        instanceName: 'eqiphealth',
        assignmentGroup: 'EQIP-Platform-Support',
        changeApprovalGroup: 'EQIP-CAB',
        cmdbClassFilter: 'cmdb_ci_appl,cmdb_ci_server',
      },
    },
    owner: 'Karen Mitchell',
    description: 'IT service management integration for incident management, change management, CMDB synchronization, and problem management workflows.',
    vendor: 'ServiceNow',
    version: 'Vancouver',
    createdDate: '2020-01-15',
    lastModifiedDate: '2024-12-01',
    connectedApplications: ['app_claims_engine', 'app_member_portal', 'app_auth_service', 'app_medicare_enrollment', 'app_hedis_engine', 'app_medicaid_eligibility', 'app_partner_api_gateway', 'app_vendor_integration'],
    syncHistory: [
      { timestamp: '2024-12-12T14:40:00Z', status: 'success', recordsProcessed: 1560, recordsFailed: 0, details: 'Full sync completed. Incidents, changes, and CMDB records synchronized.' },
      { timestamp: '2024-12-12T14:25:00Z', status: 'success', recordsProcessed: 42, recordsFailed: 0, details: 'Incremental sync. 42 incident status updates processed.' },
      { timestamp: '2024-12-12T14:10:00Z', status: 'success', recordsProcessed: 18, recordsFailed: 0, details: 'Incremental sync. 18 change request updates processed.' },
    ],
  },
  {
    id: 'int_power_bi',
    name: 'Power BI',
    type: 'analytics',
    status: 'active',
    lastSync: '2024-12-12T13:30:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://api.powerbi.com/v1.0/myorg',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 60,
      environment: 'production',
      scopes: ['Dataset.ReadWrite.All', 'Report.Read.All', 'Workspace.Read.All', 'Dashboard.Read.All'],
      customFields: {
        workspaceId: 'eqip-quality-analytics',
        datasetRefreshSchedule: 'daily',
        gatewayCluster: 'eqip-on-prem-gateway',
        capacityId: 'eqip-premium-capacity',
      },
    },
    owner: 'Samantha Clark',
    description: 'Business intelligence and analytics integration for quality metrics dashboards, executive reporting, trend analysis, and data-driven decision support.',
    vendor: 'Microsoft',
    version: '1.0',
    createdDate: '2022-04-01',
    lastModifiedDate: '2024-11-22',
    connectedApplications: ['app_data_warehouse', 'app_star_ratings', 'app_hedis_engine', 'app_compliance_dashboard'],
    syncHistory: [
      { timestamp: '2024-12-12T13:30:00Z', status: 'success', recordsProcessed: 890, recordsFailed: 0, details: 'Full sync completed. Datasets, reports, and dashboard metadata synchronized.' },
      { timestamp: '2024-12-12T12:30:00Z', status: 'success', recordsProcessed: 12, recordsFailed: 0, details: 'Incremental sync. 12 dataset refresh status updates processed.' },
      { timestamp: '2024-12-12T11:30:00Z', status: 'success', recordsProcessed: 8, recordsFailed: 0, details: 'Incremental sync. 8 report usage metrics processed.' },
    ],
  },
  {
    id: 'int_teams',
    name: 'Microsoft Teams',
    type: 'collaboration',
    status: 'active',
    lastSync: '2024-12-12T14:55:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://graph.microsoft.com/v1.0',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 1,
      environment: 'production',
      scopes: ['ChannelMessage.Send', 'Chat.ReadWrite', 'Team.ReadBasic.All', 'Channel.ReadBasic.All'],
      customFields: {
        tenantId: 'eqip-health-tenant',
        botAppId: 'eqip-quality-bot',
        notificationChannels: 'quality-alerts,release-notifications,incident-response',
        adaptiveCardTemplates: 'quality-gate,test-failure,deployment-status',
      },
    },
    owner: 'James Wright',
    description: 'Microsoft Teams collaboration integration for real-time quality alerts, release notifications, incident response coordination, and team communication.',
    vendor: 'Microsoft',
    version: '1.0',
    createdDate: '2022-07-01',
    lastModifiedDate: '2024-12-08',
    connectedApplications: [],
    syncHistory: [
      { timestamp: '2024-12-12T14:55:00Z', status: 'success', recordsProcessed: 45, recordsFailed: 0, details: 'Real-time sync. 45 notification messages delivered to Teams channels.' },
      { timestamp: '2024-12-12T14:54:00Z', status: 'success', recordsProcessed: 12, recordsFailed: 0, details: 'Real-time sync. 12 adaptive card notifications sent.' },
      { timestamp: '2024-12-12T14:53:00Z', status: 'success', recordsProcessed: 8, recordsFailed: 0, details: 'Real-time sync. 8 quality gate status notifications delivered.' },
    ],
  },
  {
    id: 'int_slack',
    name: 'Slack',
    type: 'collaboration',
    status: 'active',
    lastSync: '2024-12-12T14:55:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://slack.com/api',
      authType: 'oauth2',
      autoSync: true,
      syncIntervalMinutes: 1,
      environment: 'production',
      scopes: ['chat:write', 'channels:read', 'users:read', 'files:write', 'incoming-webhook'],
      customFields: {
        workspaceId: 'eqip-health',
        botToken: '********',
        alertChannels: '#quality-alerts,#release-status,#incident-response,#test-results',
        webhookUrl: 'https://hooks.slack.com/services/********',
      },
    },
    owner: 'James Wright',
    description: 'Slack workspace integration for development team notifications, test result alerts, deployment status updates, and cross-team collaboration.',
    vendor: 'Salesforce',
    version: '2.0',
    createdDate: '2021-05-01',
    lastModifiedDate: '2024-12-06',
    connectedApplications: [],
    syncHistory: [
      { timestamp: '2024-12-12T14:55:00Z', status: 'success', recordsProcessed: 67, recordsFailed: 0, details: 'Real-time sync. 67 notification messages delivered to Slack channels.' },
      { timestamp: '2024-12-12T14:54:00Z', status: 'success', recordsProcessed: 23, recordsFailed: 0, details: 'Real-time sync. 23 test result notifications sent.' },
      { timestamp: '2024-12-12T14:53:00Z', status: 'success', recordsProcessed: 15, recordsFailed: 0, details: 'Real-time sync. 15 deployment status updates delivered.' },
    ],
  },
  {
    id: 'int_azure_entra_id',
    name: 'Azure Entra ID',
    type: 'identity',
    status: 'active',
    lastSync: '2024-12-12T14:30:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://graph.microsoft.com/v1.0',
      authType: 'oidc',
      autoSync: true,
      syncIntervalMinutes: 30,
      environment: 'production',
      scopes: ['User.Read.All', 'Group.Read.All', 'Directory.Read.All', 'Application.Read.All'],
      customFields: {
        tenantId: 'eqip-health-tenant',
        clientId: 'eqip-quality-platform',
        directorySync: 'true',
        conditionalAccessPolicies: 'MFA-Required,Compliant-Device',
        groupPrefix: 'EQIP-',
      },
    },
    owner: 'Natalie White',
    description: 'Azure Entra ID (formerly Azure AD) integration for enterprise SSO, user directory synchronization, group-based access control, and conditional access policy enforcement.',
    vendor: 'Microsoft',
    version: '1.0',
    createdDate: '2020-06-01',
    lastModifiedDate: '2024-11-28',
    connectedApplications: ['app_auth_service', 'app_member_portal', 'app_broker_portal', 'app_compliance_dashboard'],
    syncHistory: [
      { timestamp: '2024-12-12T14:30:00Z', status: 'success', recordsProcessed: 2340, recordsFailed: 0, details: 'Full sync completed. Users, groups, and application registrations synchronized.' },
      { timestamp: '2024-12-12T14:00:00Z', status: 'success', recordsProcessed: 56, recordsFailed: 0, details: 'Incremental sync. 56 user attribute updates processed.' },
      { timestamp: '2024-12-12T13:30:00Z', status: 'success', recordsProcessed: 12, recordsFailed: 0, details: 'Incremental sync. 12 group membership changes processed.' },
    ],
  },
  {
    id: 'int_okta',
    name: 'Okta',
    type: 'identity',
    status: 'active',
    lastSync: '2024-12-12T14:15:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://eqip-health.okta.com/api/v1',
      authType: 'api_key',
      autoSync: true,
      syncIntervalMinutes: 30,
      environment: 'production',
      scopes: ['okta.users.read', 'okta.groups.read', 'okta.apps.read', 'okta.logs.read'],
      customFields: {
        orgUrl: 'https://eqip-health.okta.com',
        mfaPolicy: 'EQIP-MFA-Required',
        passwordPolicy: 'EQIP-Password-Standard',
        sessionLifetime: '480',
      },
    },
    owner: 'Natalie White',
    description: 'Okta identity management integration for external partner SSO, MFA enforcement, user lifecycle management, and authentication event logging.',
    vendor: 'Okta',
    version: '2024.01',
    createdDate: '2021-08-01',
    lastModifiedDate: '2024-12-03',
    connectedApplications: ['app_auth_service', 'app_partner_api_gateway', 'app_vendor_integration'],
    syncHistory: [
      { timestamp: '2024-12-12T14:15:00Z', status: 'success', recordsProcessed: 1120, recordsFailed: 0, details: 'Full sync completed. Users, groups, applications, and authentication logs synchronized.' },
      { timestamp: '2024-12-12T13:45:00Z', status: 'success', recordsProcessed: 34, recordsFailed: 0, details: 'Incremental sync. 34 authentication event logs processed.' },
      { timestamp: '2024-12-12T13:15:00Z', status: 'success', recordsProcessed: 8, recordsFailed: 0, details: 'Incremental sync. 8 user provisioning events processed.' },
    ],
  },
  {
    id: 'int_workday',
    name: 'Workday',
    type: 'hr',
    status: 'active',
    lastSync: '2024-12-12T06:00:00Z',
    errorState: {
      hasError: false,
      errorMessage: '',
      errorCode: '',
      lastErrorDate: '',
      consecutiveFailures: 0,
    },
    config: {
      baseUrl: 'https://wd5-impl-services1.workday.com/ccx/service/eqip_health',
      authType: 'certificate',
      autoSync: true,
      syncIntervalMinutes: 1440,
      environment: 'production',
      scopes: ['workers.read', 'organizations.read', 'positions.read', 'cost_centers.read'],
      customFields: {
        tenantName: 'eqip_health',
        integrationSystemId: 'ISU_EQIP_Quality',
        workerDataScope: 'active_employees',
        organizationHierarchy: 'supervisory',
      },
    },
    owner: 'Brian Foster',
    description: 'Workday HCM integration for employee data synchronization, organizational hierarchy mapping, cost center alignment, and workforce analytics for quality team capacity planning.',
    vendor: 'Workday',
    version: '40.1',
    createdDate: '2023-03-01',
    lastModifiedDate: '2024-10-15',
    connectedApplications: [],
    syncHistory: [
      { timestamp: '2024-12-12T06:00:00Z', status: 'success', recordsProcessed: 1850, recordsFailed: 0, details: 'Daily sync completed. Employee records, org hierarchy, and cost center data synchronized.' },
      { timestamp: '2024-12-11T06:00:00Z', status: 'success', recordsProcessed: 1845, recordsFailed: 0, details: 'Daily sync completed. 5 new hires and 2 terminations processed.' },
      { timestamp: '2024-12-10T06:00:00Z', status: 'success', recordsProcessed: 1842, recordsFailed: 0, details: 'Daily sync completed. 3 department transfers processed.' },
    ],
  },
  {
    id: 'int_fieldglass',
    name: 'Fieldglass',
    type: 'hr',
    status: 'error',
    lastSync: '2024-12-11T06:00:00Z',
    errorState: {
      hasError: true,
      errorMessage: 'Authentication token expired. Certificate renewal required for service account EQIP_FG_SVC.',
      errorCode: 'AUTH_CERT_EXPIRED',
      lastErrorDate: '2024-12-12T06:00:00Z',
      consecutiveFailures: 2,
    },
    config: {
      baseUrl: 'https://www.fieldglass.net/api/v1',
      authType: 'certificate',
      autoSync: true,
      syncIntervalMinutes: 1440,
      environment: 'production',
      scopes: ['workers.read', 'assignments.read', 'time_sheets.read', 'cost_centers.read'],
      customFields: {
        companyCode: 'EQIP_HEALTH',
        buyerCode: 'EQIP',
        workerTypes: 'contingent,sow',
        integrationId: 'INT_EQIP_QUALITY',
      },
    },
    owner: 'Brian Foster',
    description: 'SAP Fieldglass integration for contingent workforce management, contractor data synchronization, and vendor management system alignment for quality engineering resources.',
    vendor: 'SAP',
    version: '2.0',
    createdDate: '2023-06-15',
    lastModifiedDate: '2024-12-12',
    connectedApplications: [],
    syncHistory: [
      { timestamp: '2024-12-12T06:00:00Z', status: 'failed', recordsProcessed: 0, recordsFailed: 0, details: 'Sync failed. Authentication certificate expired for service account EQIP_FG_SVC.' },
      { timestamp: '2024-12-11T06:00:00Z', status: 'success', recordsProcessed: 245, recordsFailed: 0, details: 'Daily sync completed. Contingent worker records and assignment data synchronized.' },
      { timestamp: '2024-12-10T06:00:00Z', status: 'success', recordsProcessed: 242, recordsFailed: 0, details: 'Daily sync completed. 3 new contractor onboarding records processed.' },
    ],
  },
];

/**
 * Returns all available integrations.
 *
 * @returns {Integration[]} Array of all integration objects
 */
export function getAllIntegrations() {
  return [...integrations];
}

/**
 * Retrieves a single integration by its unique ID.
 *
 * @param {string} integrationId - The integration identifier to look up
 * @returns {Integration|null} The matching integration object, or null if not found
 */
export function getIntegrationById(integrationId) {
  if (!integrationId || typeof integrationId !== 'string') {
    return null;
  }
  return integrations.find((i) => i.id === integrationId) || null;
}

/**
 * Returns all integrations filtered by type.
 *
 * @param {string} type - The type to filter by (e.g. 'ci_cd', 'source_control', 'identity')
 * @returns {Integration[]} Array of integrations matching the specified type
 */
export function getIntegrationsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return integrations.filter((i) => i.type === type);
}

/**
 * Returns all integrations filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'active', 'inactive', 'error', 'maintenance', 'pending')
 * @returns {Integration[]} Array of integrations matching the specified status
 */
export function getIntegrationsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return integrations.filter((i) => i.status === status);
}

/**
 * Returns all integrations owned by a specific person.
 *
 * @param {string} owner - The owner name to filter by
 * @returns {Integration[]} Array of integrations owned by the specified person
 */
export function getIntegrationsByOwner(owner) {
  if (!owner || typeof owner !== 'string') {
    return [];
  }
  return integrations.filter((i) => i.owner === owner);
}

/**
 * Returns all integrations connected to a specific application.
 *
 * @param {string} applicationId - The application ID to search for
 * @returns {Integration[]} Array of integrations connected to the specified application
 */
export function getIntegrationsByApplication(applicationId) {
  if (!applicationId || typeof applicationId !== 'string') {
    return [];
  }
  return integrations.filter((i) => i.connectedApplications.includes(applicationId));
}

/**
 * Returns all integrations that currently have errors.
 *
 * @returns {Integration[]} Array of integrations with active error states
 */
export function getIntegrationsWithErrors() {
  return integrations.filter((i) => i.errorState.hasError);
}

/**
 * Returns all integrations filtered by vendor.
 *
 * @param {string} vendor - The vendor name to filter by
 * @returns {Integration[]} Array of integrations from the specified vendor
 */
export function getIntegrationsByVendor(vendor) {
  if (!vendor || typeof vendor !== 'string') {
    return [];
  }
  return integrations.filter((i) => i.vendor === vendor);
}

/**
 * Returns all integrations filtered by authentication type.
 *
 * @param {string} authType - The authentication type to filter by (e.g. 'oauth2', 'api_key', 'token', 'certificate')
 * @returns {Integration[]} Array of integrations matching the specified auth type
 */
export function getIntegrationsByAuthType(authType) {
  if (!authType || typeof authType !== 'string') {
    return [];
  }
  return integrations.filter((i) => i.config.authType === authType);
}

/**
 * Returns aggregate statistics across all integrations.
 *
 * @returns {{ totalIntegrations: number, statusBreakdown: Object<string, number>, typeBreakdown: Object<string, number>, vendorBreakdown: Object<string, number>, activeCount: number, errorCount: number, totalConnectedApplications: number, integrationsWithErrors: number, averageSyncIntervalMinutes: number }} Aggregate integration statistics
 */
export function getIntegrationAggregates() {
  const totalIntegrations = integrations.length;

  const statusBreakdown = integrations.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});

  const typeBreakdown = integrations.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {});

  const vendorBreakdown = integrations.reduce((acc, i) => {
    acc[i.vendor] = (acc[i.vendor] || 0) + 1;
    return acc;
  }, {});

  const activeCount = integrations.filter((i) => i.status === 'active').length;
  const errorCount = integrations.filter((i) => i.status === 'error').length;

  const connectedAppSets = new Set(integrations.flatMap((i) => i.connectedApplications));
  const totalConnectedApplications = connectedAppSets.size;

  const integrationsWithErrors = integrations.filter((i) => i.errorState.hasError).length;

  const averageSyncIntervalMinutes =
    totalIntegrations > 0
      ? Math.round(integrations.reduce((sum, i) => sum + i.config.syncIntervalMinutes, 0) / totalIntegrations)
      : 0;

  return {
    totalIntegrations,
    statusBreakdown,
    typeBreakdown,
    vendorBreakdown,
    activeCount,
    errorCount,
    totalConnectedApplications,
    integrationsWithErrors,
    averageSyncIntervalMinutes,
  };
}

/**
 * Returns all unique integration types.
 *
 * @returns {string[]} Array of unique integration types sorted alphabetically
 */
export function getAllIntegrationTypes() {
  const types = new Set(integrations.map((i) => i.type));
  return [...types].sort();
}

/**
 * Returns all unique integration statuses.
 *
 * @returns {string[]} Array of unique integration statuses sorted alphabetically
 */
export function getAllIntegrationStatuses() {
  const statuses = new Set(integrations.map((i) => i.status));
  return [...statuses].sort();
}

/**
 * Returns all unique vendor names across all integrations.
 *
 * @returns {string[]} Array of unique vendor names sorted alphabetically
 */
export function getAllIntegrationVendors() {
  const vendors = new Set(integrations.map((i) => i.vendor));
  return [...vendors].sort();
}

/**
 * Returns all unique owner names across all integrations.
 *
 * @returns {string[]} Array of unique owner names sorted alphabetically
 */
export function getAllIntegrationOwners() {
  const owners = new Set(integrations.map((i) => i.owner));
  return [...owners].sort();
}

/**
 * Returns all unique authentication types across all integrations.
 *
 * @returns {string[]} Array of unique auth types sorted alphabetically
 */
export function getAllAuthTypes() {
  const authTypes = new Set(integrations.map((i) => i.config.authType));
  return [...authTypes].sort();
}

export default integrations;