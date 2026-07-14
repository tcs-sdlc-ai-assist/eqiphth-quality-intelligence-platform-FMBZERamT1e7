import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} ReportFilter
 * @property {string} id - Unique filter identifier
 * @property {string} label - Display label for the filter
 * @property {string} type - Filter type (select, multiselect, daterange, text)
 * @property {string[]} options - Available filter options (empty array for text/daterange)
 * @property {string} defaultValue - Default filter value
 */

/**
 * @typedef {Object} ReportDataPoint
 * @property {string} label - Data point label
 * @property {number} value - Data point value
 * @property {string} [category] - Optional category grouping
 * @property {string} [status] - Optional status indicator
 * @property {string} [color] - Optional color token
 */

/**
 * @typedef {Object} ReportDefinition
 * @property {string} id - Unique report identifier
 * @property {string} name - Display name of the report
 * @property {string} category - Report category (executive, segment, application, test, governance, compliance)
 * @property {string} description - Detailed description of the report
 * @property {ReportFilter[]} filters - Array of available filters for the report
 * @property {string} chartType - Primary chart type (bar, line, pie, donut, stacked_bar, table, gauge, heatmap, treemap, radar, area, scatter)
 * @property {ReportDataPoint[]} data - Array of data points for the report
 * @property {string} owner - Name of the person responsible for the report
 * @property {string} lastGenerated - Last generation date in ISO format
 * @property {string} frequency - Report generation frequency (daily, weekly, monthly, quarterly, on_demand)
 * @property {string[]} applicableSegments - Array of applicable segment names
 */

/**
 * @typedef {Object} ReportCategory
 * @property {string} id - Unique category identifier
 * @property {string} name - Display name of the category
 * @property {string} description - Description of the category
 * @property {number} reportCount - Number of reports in this category
 * @property {string} icon - Icon identifier for the category
 */

/**
 * Mock report categories for the EQIP Quality Platform.
 * @type {ReportCategory[]}
 */
const reportCategories = [
  {
    id: 'cat_executive',
    name: 'Executive',
    description: 'High-level executive dashboards and KPI summaries for leadership visibility into quality performance across all segments.',
    reportCount: 5,
    icon: 'briefcase',
  },
  {
    id: 'cat_segment',
    name: 'Segment',
    description: 'Segment-level quality metrics, compliance rates, and trend analysis for each organizational segment.',
    reportCount: 4,
    icon: 'layers',
  },
  {
    id: 'cat_application',
    name: 'Application',
    description: 'Application-specific quality reports including release history, test coverage, and defect analysis.',
    reportCount: 5,
    icon: 'monitor',
  },
  {
    id: 'cat_test',
    name: 'Test',
    description: 'Test execution reports covering pass rates, automation coverage, defect trends, and test data management.',
    reportCount: 5,
    icon: 'check-circle',
  },
  {
    id: 'cat_governance',
    name: 'Governance',
    description: 'Governance and operational reports including quality gate status, adherence metrics, and procedure compliance.',
    reportCount: 4,
    icon: 'shield',
  },
  {
    id: 'cat_compliance',
    name: 'Compliance',
    description: 'Regulatory compliance reports covering framework scores, audit findings, and operating expectation adherence.',
    reportCount: 5,
    icon: 'file-text',
  },
];

/**
 * Mock report definitions for the EQIP Quality Platform.
 * Contains report objects representing various reporting views across
 * executive, segment, application, test, governance, and compliance categories.
 *
 * @type {ReportDefinition[]}
 */
const reports = [
  // ---------------------------------------------------------------------------
  // Executive Reports
  // ---------------------------------------------------------------------------
  {
    id: 'rpt_exec_quality_summary',
    name: 'Executive Quality Summary',
    category: 'executive',
    description: 'High-level quality summary across all segments showing overall quality score, pass rate, automation coverage, defect density, and release readiness KPIs with monthly trends.',
    filters: [
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 30 Days', 'Last 90 Days', 'Last 6 Months', 'Last 12 Months', 'Year to Date'], defaultValue: 'Last 12 Months' },
      { id: 'f_segment', label: 'Segment', type: 'multiselect', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: '' },
    ],
    chartType: 'line',
    data: [
      { label: 'Jan', value: 79.5, category: 'Quality Score' },
      { label: 'Feb', value: 80.3, category: 'Quality Score' },
      { label: 'Mar', value: 81.2, category: 'Quality Score' },
      { label: 'Apr', value: 82.0, category: 'Quality Score' },
      { label: 'May', value: 83.1, category: 'Quality Score' },
      { label: 'Jun', value: 84.0, category: 'Quality Score' },
      { label: 'Jul', value: 84.8, category: 'Quality Score' },
      { label: 'Aug', value: 85.5, category: 'Quality Score' },
      { label: 'Sep', value: 86.3, category: 'Quality Score' },
      { label: 'Oct', value: 87.0, category: 'Quality Score' },
      { label: 'Nov', value: 87.6, category: 'Quality Score' },
      { label: 'Dec', value: 88.2, category: 'Quality Score' },
    ],
    owner: 'Jennifer Williams',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_exec_risk_distribution',
    name: 'Risk Distribution Overview',
    category: 'executive',
    description: 'Distribution of applications across risk levels (low, medium, high, critical) with drill-down capability to identify at-risk and critical applications.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'multiselect', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: '' },
    ],
    chartType: 'donut',
    data: [
      { label: 'Low', value: 8, category: 'risk', color: 'success' },
      { label: 'Medium', value: 9, category: 'risk', color: 'warning' },
      { label: 'High', value: 5, category: 'risk', color: 'danger' },
      { label: 'Critical', value: 2, category: 'risk', color: 'danger' },
    ],
    owner: 'Jennifer Williams',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_exec_quality_status',
    name: 'Quality Status Summary',
    category: 'executive',
    description: 'Summary of application quality statuses across all segments showing on-track, at-risk, critical, and not-started counts with percentage breakdowns.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'multiselect', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: '' },
    ],
    chartType: 'pie',
    data: [
      { label: 'On Track', value: 16, status: MEASURE_STATUS.ON_TRACK, color: 'success' },
      { label: 'At Risk', value: 4, status: MEASURE_STATUS.AT_RISK, color: 'warning' },
      { label: 'Critical', value: 2, status: MEASURE_STATUS.CRITICAL, color: 'danger' },
      { label: 'Not Started', value: 0, status: MEASURE_STATUS.NOT_STARTED, color: 'neutral' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_exec_release_readiness',
    name: 'Release Readiness Trend',
    category: 'executive',
    description: 'Monthly trend of release readiness percentage across all segments showing the percentage of applications that have passed all quality gates.',
    filters: [
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months', 'Year to Date'], defaultValue: 'Last 12 Months' },
    ],
    chartType: 'area',
    data: [
      { label: 'Jan', value: 48.0 },
      { label: 'Feb', value: 49.5 },
      { label: 'Mar', value: 50.8 },
      { label: 'Apr', value: 52.0 },
      { label: 'May', value: 53.5 },
      { label: 'Jun', value: 55.0 },
      { label: 'Jul', value: 56.2 },
      { label: 'Aug', value: 57.5 },
      { label: 'Sep', value: 58.8 },
      { label: 'Oct', value: 60.0 },
      { label: 'Nov', value: 61.2 },
      { label: 'Dec', value: 62.5 },
    ],
    owner: 'Jennifer Williams',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_exec_kpi_scorecard',
    name: 'KPI Scorecard',
    category: 'executive',
    description: 'Comprehensive KPI scorecard showing current values, previous period values, trend direction, and change percentages for all key performance indicators.',
    filters: [
      { id: 'f_period', label: 'Comparison Period', type: 'select', options: ['Previous Month', 'Previous Quarter', 'Previous Year'], defaultValue: 'Previous Month' },
    ],
    chartType: 'table',
    data: [
      { label: 'Total Test Cases', value: 38680, category: 'count', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Pass Rate', value: 87.4, category: 'percent', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Automation Coverage', value: 83.7, category: 'percent', status: MEASURE_STATUS.AT_RISK },
      { label: 'Defect Density', value: 2.3, category: 'ratio', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Quality Score', value: 88.2, category: 'score', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Release Readiness', value: 62.5, category: 'percent', status: MEASURE_STATUS.AT_RISK },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },

  // ---------------------------------------------------------------------------
  // Segment Reports
  // ---------------------------------------------------------------------------
  {
    id: 'rpt_seg_quality_comparison',
    name: 'Segment Quality Comparison',
    category: 'segment',
    description: 'Side-by-side comparison of quality scores, pass rates, automation coverage, and defect density across all organizational segments.',
    filters: [
      { id: 'f_metric', label: 'Metric', type: 'select', options: ['Quality Score', 'Pass Rate', 'Automation Coverage', 'Defect Density', 'Release Readiness'], defaultValue: 'Quality Score' },
    ],
    chartType: 'bar',
    data: [
      { label: 'Enterprise', value: 92.8, category: 'Quality Score', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Medicare', value: 89.5, category: 'Quality Score', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Medicaid', value: 78.4, category: 'Quality Score', status: MEASURE_STATUS.AT_RISK },
      { label: 'Commercial', value: 90.3, category: 'Quality Score', status: MEASURE_STATUS.ON_TRACK },
      { label: 'External', value: 69.5, category: 'Quality Score', status: MEASURE_STATUS.CRITICAL },
      { label: 'Compliance', value: 95.6, category: 'Quality Score', status: MEASURE_STATUS.ON_TRACK },
    ],
    owner: 'Jennifer Williams',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_seg_compliance_rates',
    name: 'Segment Compliance Rates',
    category: 'segment',
    description: 'Compliance rate trends by segment over the past 12 months showing improvement trajectories and areas requiring attention.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'multiselect', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: '' },
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months'], defaultValue: 'Last 12 Months' },
    ],
    chartType: 'line',
    data: [
      { label: 'Jan', value: 90.1, category: 'Enterprise' },
      { label: 'Jan', value: 93.5, category: 'Medicare' },
      { label: 'Jan', value: 80.2, category: 'Medicaid' },
      { label: 'Jan', value: 87.5, category: 'Commercial' },
      { label: 'Jan', value: 74.0, category: 'External' },
      { label: 'Jan', value: 95.5, category: 'Compliance' },
      { label: 'Dec', value: 94.2, category: 'Enterprise' },
      { label: 'Dec', value: 96.8, category: 'Medicare' },
      { label: 'Dec', value: 85.6, category: 'Medicaid' },
      { label: 'Dec', value: 91.3, category: 'Commercial' },
      { label: 'Dec', value: 80.4, category: 'External' },
      { label: 'Dec', value: 98.1, category: 'Compliance' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_seg_test_coverage',
    name: 'Segment Test Coverage Breakdown',
    category: 'segment',
    description: 'Test case distribution and automation coverage breakdown by segment showing total test cases, automated vs manual split, and coverage gaps.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'select', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: 'Enterprise' },
    ],
    chartType: 'stacked_bar',
    data: [
      { label: 'Enterprise', value: 14040, category: 'Total Tests' },
      { label: 'Enterprise', value: 89.2, category: 'Automation %' },
      { label: 'Medicare', value: 10980, category: 'Total Tests' },
      { label: 'Medicare', value: 85.7, category: 'Automation %' },
      { label: 'Medicaid', value: 6600, category: 'Total Tests' },
      { label: 'Medicaid', value: 75.7, category: 'Automation %' },
      { label: 'Commercial', value: 7880, category: 'Total Tests' },
      { label: 'Commercial', value: 86.1, category: 'Automation %' },
      { label: 'External', value: 3180, category: 'Total Tests' },
      { label: 'External', value: 67.2, category: 'Automation %' },
      { label: 'Compliance', value: 4150, category: 'Total Tests' },
      { label: 'Compliance', value: 92.6, category: 'Automation %' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_seg_defect_density',
    name: 'Segment Defect Density Trend',
    category: 'segment',
    description: 'Defect density trends by segment over the past 12 months showing defects per 1,000 lines of code with improvement trajectories.',
    filters: [
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months'], defaultValue: 'Last 12 Months' },
    ],
    chartType: 'line',
    data: [
      { label: 'Jan', value: 2.2, category: 'Enterprise' },
      { label: 'Jan', value: 2.8, category: 'Medicare' },
      { label: 'Jan', value: 4.5, category: 'Medicaid' },
      { label: 'Jan', value: 2.5, category: 'Commercial' },
      { label: 'Jan', value: 6.2, category: 'External' },
      { label: 'Jan', value: 1.2, category: 'Compliance' },
      { label: 'Dec', value: 1.5, category: 'Enterprise' },
      { label: 'Dec', value: 2.1, category: 'Medicare' },
      { label: 'Dec', value: 3.4, category: 'Medicaid' },
      { label: 'Dec', value: 1.8, category: 'Commercial' },
      { label: 'Dec', value: 4.8, category: 'External' },
      { label: 'Dec', value: 0.8, category: 'Compliance' },
    ],
    owner: 'Jennifer Williams',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },

  // ---------------------------------------------------------------------------
  // Application Reports
  // ---------------------------------------------------------------------------
  {
    id: 'rpt_app_release_history',
    name: 'Application Release History',
    category: 'application',
    description: 'Detailed release history for each application showing version, date, quality score, test results, and deployment status across all releases.',
    filters: [
      { id: 'f_application', label: 'Application', type: 'select', options: ['Claims Processing Engine', 'Member Portal', 'Auth Service', 'HEDIS Measure Engine', 'Medicare Enrollment System', 'Medicaid Eligibility Engine', 'Partner API Gateway', 'Vendor Integration Hub'], defaultValue: 'Claims Processing Engine' },
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months', 'All Time'], defaultValue: 'Last 12 Months' },
    ],
    chartType: 'table',
    data: [
      { label: 'v4.12.0', value: 94.2, category: 'Claims Processing Engine', status: 'deployed' },
      { label: 'v4.11.2', value: 92.8, category: 'Claims Processing Engine', status: 'deployed' },
      { label: 'v4.11.0', value: 91.5, category: 'Claims Processing Engine', status: 'deployed' },
      { label: 'v3.8.0', value: 96.5, category: 'Member Portal', status: 'deployed' },
      { label: 'v3.7.1', value: 95.8, category: 'Member Portal', status: 'deployed' },
      { label: 'v5.3.0', value: 98.1, category: 'Auth Service', status: 'deployed' },
      { label: 'v4.6.0', value: 84.5, category: 'HEDIS Measure Engine', status: 'deployed' },
      { label: 'v6.4.0', value: 91.8, category: 'Medicare Enrollment System', status: 'deployed' },
    ],
    owner: 'Amanda Garcia',
    lastGenerated: '2024-12-12',
    frequency: 'on_demand',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_app_test_coverage_detail',
    name: 'Application Test Coverage Detail',
    category: 'application',
    description: 'Detailed test coverage breakdown by application showing unit, integration, E2E, performance, security, and accessibility test coverage percentages.',
    filters: [
      { id: 'f_application', label: 'Application', type: 'select', options: ['Claims Processing Engine', 'Member Portal', 'Auth Service', 'HEDIS Measure Engine', 'Medicare Enrollment System', 'Medicaid Eligibility Engine', 'Partner API Gateway', 'Vendor Integration Hub'], defaultValue: 'Claims Processing Engine' },
    ],
    chartType: 'radar',
    data: [
      { label: 'Unit', value: 91.4, category: 'Claims Processing Engine' },
      { label: 'Integration', value: 84.2, category: 'Claims Processing Engine' },
      { label: 'E2E', value: 72.5, category: 'Claims Processing Engine' },
      { label: 'Performance', value: 93.3, category: 'Claims Processing Engine' },
      { label: 'Unit', value: 94.2, category: 'Member Portal' },
      { label: 'Integration', value: 88.7, category: 'Member Portal' },
      { label: 'E2E', value: 78.3, category: 'Member Portal' },
      { label: 'Accessibility', value: 98.2, category: 'Member Portal' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_app_quality_scores',
    name: 'Application Quality Scores',
    category: 'application',
    description: 'Quality scores for all applications ranked from highest to lowest with risk level indicators and quality status badges.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'multiselect', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: '' },
      { id: 'f_risk_level', label: 'Risk Level', type: 'multiselect', options: ['low', 'medium', 'high', 'critical'], defaultValue: '' },
    ],
    chartType: 'bar',
    data: [
      { label: 'Auth Service', value: 98.1, category: 'Enterprise', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Compliance Dashboard', value: 97.2, category: 'Compliance', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Member Portal', value: 96.5, category: 'Enterprise', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Audit Tracker', value: 96.8, category: 'Compliance', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Notification Hub', value: 95.4, category: 'Enterprise', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Risk Assessment', value: 95.1, category: 'Compliance', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Wellness Platform', value: 94.8, category: 'Commercial', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Regulatory Reporting', value: 94.5, category: 'Compliance', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Claims Engine', value: 94.2, category: 'Enterprise', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Broker Portal', value: 93.7, category: 'Commercial', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Provider Directory', value: 93.1, category: 'Enterprise', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Part D Formulary', value: 92.4, category: 'Medicare', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Medicare Enrollment', value: 91.8, category: 'Medicare', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Individual Marketplace', value: 91.8, category: 'Commercial', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Benefits Admin', value: 91.2, category: 'Medicare', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Star Ratings', value: 90.8, category: 'Medicare', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Group Enrollment', value: 90.5, category: 'Commercial', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Underwriting Engine', value: 89.6, category: 'Commercial', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Data Warehouse', value: 89.3, category: 'Enterprise', status: MEASURE_STATUS.ON_TRACK },
      { label: 'Provider Network', value: 88.1, category: 'Medicaid', status: MEASURE_STATUS.ON_TRACK },
      { label: 'HEDIS Engine', value: 84.5, category: 'Medicare', status: MEASURE_STATUS.AT_RISK },
      { label: 'Care Management', value: 82.3, category: 'Medicaid', status: MEASURE_STATUS.AT_RISK },
      { label: 'Medicaid Eligibility', value: 79.8, category: 'Medicaid', status: MEASURE_STATUS.AT_RISK },
      { label: 'State Reporting', value: 76.4, category: 'Medicaid', status: MEASURE_STATUS.AT_RISK },
      { label: 'External Data Feed', value: 75.2, category: 'External', status: MEASURE_STATUS.AT_RISK },
      { label: 'API Gateway', value: 72.3, category: 'External', status: MEASURE_STATUS.CRITICAL },
      { label: 'Vendor Integration', value: 65.8, category: 'External', status: MEASURE_STATUS.CRITICAL },
    ],
    owner: 'Jennifer Williams',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_app_automation_coverage',
    name: 'Application Automation Coverage',
    category: 'application',
    description: 'Automation coverage percentages for all applications with target threshold indicators and improvement trends.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'select', options: ['All', 'Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: 'All' },
      { id: 'f_threshold', label: 'Below Threshold Only', type: 'select', options: ['All', 'Below 80%', 'Below 85%'], defaultValue: 'All' },
    ],
    chartType: 'bar',
    data: [
      { label: 'Auth Service', value: 95.2, category: 'Enterprise' },
      { label: 'Compliance Dashboard', value: 94.2, category: 'Compliance' },
      { label: 'Audit Tracker', value: 93.5, category: 'Compliance' },
      { label: 'Member Portal', value: 92.1, category: 'Enterprise' },
      { label: 'Regulatory Reporting', value: 91.8, category: 'Compliance' },
      { label: 'Notification Hub', value: 91.0, category: 'Enterprise' },
      { label: 'Risk Assessment', value: 90.8, category: 'Compliance' },
      { label: 'Wellness Platform', value: 90.1, category: 'Commercial' },
      { label: 'Provider Directory', value: 89.6, category: 'Enterprise' },
      { label: 'Medicare Enrollment', value: 88.7, category: 'Medicare' },
      { label: 'Broker Portal', value: 88.2, category: 'Commercial' },
      { label: 'Claims Engine', value: 87.3, category: 'Enterprise' },
      { label: 'Part D Formulary', value: 86.9, category: 'Medicare' },
      { label: 'Individual Marketplace', value: 85.7, category: 'Commercial' },
      { label: 'Star Ratings', value: 85.3, category: 'Medicare' },
      { label: 'Benefits Admin', value: 84.5, category: 'Medicare' },
      { label: 'Group Enrollment', value: 83.9, category: 'Commercial' },
      { label: 'Underwriting Engine', value: 82.4, category: 'Commercial' },
      { label: 'HEDIS Engine', value: 82.1, category: 'Medicare' },
      { label: 'Provider Network', value: 80.5, category: 'Medicaid' },
      { label: 'Data Warehouse', value: 78.4, category: 'Enterprise' },
      { label: 'Care Management', value: 76.3, category: 'Medicaid' },
      { label: 'Medicaid Eligibility', value: 74.8, category: 'Medicaid' },
      { label: 'State Reporting', value: 71.2, category: 'Medicaid' },
      { label: 'External Data Feed', value: 70.3, category: 'External' },
      { label: 'API Gateway', value: 68.5, category: 'External' },
      { label: 'Vendor Integration', value: 62.8, category: 'External' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_app_incident_trend',
    name: 'Application Incident Trend',
    category: 'application',
    description: 'Monthly incident counts by application over the past 12 months showing incident frequency trends and correlation with deployment activity.',
    filters: [
      { id: 'f_application', label: 'Application', type: 'multiselect', options: ['Claims Processing Engine', 'Member Portal', 'HEDIS Measure Engine', 'Medicaid Eligibility Engine', 'Partner API Gateway', 'Vendor Integration Hub'], defaultValue: '' },
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months'], defaultValue: 'Last 12 Months' },
    ],
    chartType: 'line',
    data: [
      { label: 'Jan', value: 2, category: 'Claims Engine' },
      { label: 'Feb', value: 1, category: 'Claims Engine' },
      { label: 'Mar', value: 3, category: 'Claims Engine' },
      { label: 'Apr', value: 1, category: 'Claims Engine' },
      { label: 'May', value: 2, category: 'Claims Engine' },
      { label: 'Jun', value: 0, category: 'Claims Engine' },
      { label: 'Jul', value: 1, category: 'Claims Engine' },
      { label: 'Aug', value: 2, category: 'Claims Engine' },
      { label: 'Sep', value: 1, category: 'Claims Engine' },
      { label: 'Oct', value: 0, category: 'Claims Engine' },
      { label: 'Nov', value: 1, category: 'Claims Engine' },
      { label: 'Dec', value: 1, category: 'Claims Engine' },
      { label: 'Jan', value: 4, category: 'Vendor Integration' },
      { label: 'Feb', value: 3, category: 'Vendor Integration' },
      { label: 'Mar', value: 5, category: 'Vendor Integration' },
      { label: 'Apr', value: 3, category: 'Vendor Integration' },
      { label: 'May', value: 4, category: 'Vendor Integration' },
      { label: 'Jun', value: 5, category: 'Vendor Integration' },
      { label: 'Jul', value: 3, category: 'Vendor Integration' },
      { label: 'Aug', value: 4, category: 'Vendor Integration' },
      { label: 'Sep', value: 5, category: 'Vendor Integration' },
      { label: 'Oct', value: 4, category: 'Vendor Integration' },
      { label: 'Nov', value: 3, category: 'Vendor Integration' },
      { label: 'Dec', value: 3, category: 'Vendor Integration' },
    ],
    owner: 'Karen Mitchell',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External'],
  },

  // ---------------------------------------------------------------------------
  // Test Reports
  // ---------------------------------------------------------------------------
  {
    id: 'rpt_test_pass_rate_trend',
    name: 'Test Pass Rate Trend',
    category: 'test',
    description: 'Monthly test pass rate trends across all applications showing overall pass rate improvement trajectory and segment-level breakdowns.',
    filters: [
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months'], defaultValue: 'Last 12 Months' },
      { id: 'f_test_type', label: 'Test Type', type: 'multiselect', options: ['unit', 'integration', 'e2e', 'performance', 'security', 'accessibility'], defaultValue: '' },
    ],
    chartType: 'line',
    data: [
      { label: 'Jan', value: 80.2 },
      { label: 'Feb', value: 81.0 },
      { label: 'Mar', value: 81.8 },
      { label: 'Apr', value: 82.5 },
      { label: 'May', value: 83.2 },
      { label: 'Jun', value: 83.9 },
      { label: 'Jul', value: 84.5 },
      { label: 'Aug', value: 85.1 },
      { label: 'Sep', value: 85.8 },
      { label: 'Oct', value: 86.4 },
      { label: 'Nov', value: 87.0 },
      { label: 'Dec', value: 87.4 },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_test_execution_summary',
    name: 'Test Execution Summary',
    category: 'test',
    description: 'Summary of recent test executions showing pass, fail, blocked, and skipped counts with defect correlation and AI analysis confidence scores.',
    filters: [
      { id: 'f_environment', label: 'Environment', type: 'multiselect', options: ['Production', 'Staging', 'QA', 'Development', 'Performance'], defaultValue: '' },
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['passed', 'failed', 'blocked', 'skipped', 'in-progress'], defaultValue: '' },
    ],
    chartType: 'stacked_bar',
    data: [
      { label: 'Passed', value: 24, category: 'Status', color: 'success' },
      { label: 'Failed', value: 12, category: 'Status', color: 'danger' },
      { label: 'Blocked', value: 1, category: 'Status', color: 'warning' },
      { label: 'Skipped', value: 2, category: 'Status', color: 'neutral' },
      { label: 'In Progress', value: 1, category: 'Status', color: 'info' },
    ],
    owner: 'Lisa Johnson',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_test_type_distribution',
    name: 'Test Type Distribution',
    category: 'test',
    description: 'Distribution of test cases by type (functional, regression, smoke, integration, E2E, performance, security, accessibility) across all applications.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'select', options: ['All', 'Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: 'All' },
    ],
    chartType: 'pie',
    data: [
      { label: 'Functional', value: 18, category: 'type' },
      { label: 'Regression', value: 10, category: 'type' },
      { label: 'Smoke', value: 4, category: 'type' },
      { label: 'Integration', value: 6, category: 'type' },
      { label: 'E2E', value: 8, category: 'type' },
      { label: 'Performance', value: 7, category: 'type' },
      { label: 'Security', value: 5, category: 'type' },
      { label: 'Accessibility', value: 2, category: 'type' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_test_defect_trend',
    name: 'Test Defect Discovery Trend',
    category: 'test',
    description: 'Monthly trend of defects discovered through testing showing severity distribution and resolution rates over time.',
    filters: [
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months'], defaultValue: 'Last 12 Months' },
      { id: 'f_severity', label: 'Severity', type: 'multiselect', options: ['critical', 'high', 'medium', 'low'], defaultValue: '' },
    ],
    chartType: 'stacked_bar',
    data: [
      { label: 'Jan', value: 8, category: 'Critical' },
      { label: 'Jan', value: 15, category: 'High' },
      { label: 'Jan', value: 22, category: 'Medium' },
      { label: 'Jan', value: 10, category: 'Low' },
      { label: 'Jun', value: 5, category: 'Critical' },
      { label: 'Jun', value: 12, category: 'High' },
      { label: 'Jun', value: 18, category: 'Medium' },
      { label: 'Jun', value: 8, category: 'Low' },
      { label: 'Dec', value: 4, category: 'Critical' },
      { label: 'Dec', value: 9, category: 'High' },
      { label: 'Dec', value: 14, category: 'Medium' },
      { label: 'Dec', value: 6, category: 'Low' },
    ],
    owner: 'Lisa Johnson',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_test_data_management',
    name: 'Test Data Management Status',
    category: 'test',
    description: 'Status overview of test data assets showing active, stale, archived, and error counts with masking and provisioning status breakdowns.',
    filters: [
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['active', 'stale', 'archived', 'provisioning', 'error'], defaultValue: '' },
      { id: 'f_type', label: 'Data Type', type: 'multiselect', options: ['synthetic', 'masked_production', 'golden', 'seed', 'reference', 'snapshot', 'subset'], defaultValue: '' },
    ],
    chartType: 'donut',
    data: [
      { label: 'Active', value: 38, category: 'status', color: 'success' },
      { label: 'Stale', value: 3, category: 'status', color: 'warning' },
      { label: 'Archived', value: 2, category: 'status', color: 'neutral' },
      { label: 'Error', value: 1, category: 'status', color: 'danger' },
      { label: 'Provisioning', value: 1, category: 'status', color: 'info' },
    ],
    owner: 'Samantha Clark',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },

  // ---------------------------------------------------------------------------
  // Governance Reports
  // ---------------------------------------------------------------------------
  {
    id: 'rpt_gov_quality_gate_status',
    name: 'Quality Gate Status Report',
    category: 'governance',
    description: 'Comprehensive quality gate status report showing pass/fail/waived status for all quality gates across segments with gate criteria details and waiver information.',
    filters: [
      { id: 'f_segment', label: 'Segment', type: 'multiselect', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: '' },
      { id: 'f_status', label: 'Gate Status', type: 'multiselect', options: ['passed', 'failed', 'waived', 'pending'], defaultValue: '' },
    ],
    chartType: 'stacked_bar',
    data: [
      { label: 'Enterprise', value: 7, category: 'Passed', color: 'success' },
      { label: 'Enterprise', value: 1, category: 'Failed', color: 'danger' },
      { label: 'Medicare', value: 5, category: 'Passed', color: 'success' },
      { label: 'Medicare', value: 3, category: 'Failed', color: 'danger' },
      { label: 'Medicaid', value: 1, category: 'Passed', color: 'success' },
      { label: 'Medicaid', value: 3, category: 'Failed', color: 'danger' },
      { label: 'Commercial', value: 5, category: 'Passed', color: 'success' },
      { label: 'Commercial', value: 0, category: 'Failed', color: 'danger' },
      { label: 'External', value: 0, category: 'Passed', color: 'success' },
      { label: 'External', value: 3, category: 'Failed', color: 'danger' },
      { label: 'Compliance', value: 4, category: 'Passed', color: 'success' },
      { label: 'Compliance', value: 0, category: 'Failed', color: 'danger' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_gov_adherence_metrics',
    name: 'Adherence Metrics Dashboard',
    category: 'governance',
    description: 'Dashboard showing all adherence metrics with target vs actual values, met/not-met status, and trend indicators for operational governance tracking.',
    filters: [
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['met', 'not_met', 'at_risk', 'pending'], defaultValue: '' },
      { id: 'f_trend', label: 'Trend', type: 'select', options: ['All', 'improving', 'declining', 'stable'], defaultValue: 'All' },
    ],
    chartType: 'table',
    data: [
      { label: 'Quality Gate Pass Rate', value: 62.5, category: 'Target: 90.0%', status: 'not_met' },
      { label: 'Automated Test Coverage', value: 83.7, category: 'Target: 85.0%', status: 'at_risk' },
      { label: 'Code Review Compliance', value: 98.5, category: 'Target: 100.0%', status: 'met' },
      { label: 'Security Scan Pass Rate', value: 91.2, category: 'Target: 95.0%', status: 'not_met' },
      { label: 'Production Incident MTTR', value: 2.3, category: 'Target: 2.0h', status: 'not_met' },
      { label: 'Change Failure Rate', value: 4.8, category: 'Target: 5.0%', status: 'met' },
      { label: 'Deployment Frequency', value: 5.2, category: 'Target: 4.0/mo', status: 'met' },
      { label: 'Test Data Freshness', value: 88.9, category: 'Target: 95.0%', status: 'not_met' },
      { label: 'Environment Availability', value: 90.0, category: 'Target: 95.0%', status: 'not_met' },
      { label: 'Regulatory Report On-Time', value: 92.5, category: 'Target: 100.0%', status: 'not_met' },
      { label: 'HIPAA Training Completion', value: 99.2, category: 'Target: 100.0%', status: 'met' },
      { label: 'Accessibility Compliance', value: 96.8, category: 'Target: 100.0%', status: 'at_risk' },
      { label: 'Vendor BAA Coverage', value: 85.0, category: 'Target: 100.0%', status: 'not_met' },
      { label: 'DR Test Success Rate', value: 100.0, category: 'Target: 100.0%', status: 'met' },
      { label: 'Data Quality Score', value: 97.8, category: 'Target: 99.0%', status: 'at_risk' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_gov_procedure_compliance',
    name: 'Procedure Compliance Report',
    category: 'governance',
    description: 'Status of all governance procedures showing active, draft, under review, and deprecated procedures with review schedule tracking.',
    filters: [
      { id: 'f_category', label: 'Category', type: 'multiselect', options: ['quality_assurance', 'change_management', 'incident_management', 'release_management', 'security', 'data_governance', 'compliance', 'testing'], defaultValue: '' },
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['active', 'draft', 'under_review', 'deprecated', 'archived'], defaultValue: '' },
    ],
    chartType: 'donut',
    data: [
      { label: 'Active', value: 18, category: 'status', color: 'success' },
      { label: 'Under Review', value: 1, category: 'status', color: 'warning' },
      { label: 'Draft', value: 1, category: 'status', color: 'info' },
      { label: 'Deprecated', value: 0, category: 'status', color: 'neutral' },
    ],
    owner: 'Patricia Evans',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_gov_demand_pipeline',
    name: 'Demand Pipeline Report',
    category: 'governance',
    description: 'Overview of the demand pipeline showing demand items by status, priority, type, and segment with effort estimates and analytics scores.',
    filters: [
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['intake', 'analysis', 'approved', 'in_progress', 'completed', 'deferred', 'rejected'], defaultValue: '' },
      { id: 'f_priority', label: 'Priority', type: 'multiselect', options: ['critical', 'high', 'medium', 'low'], defaultValue: '' },
      { id: 'f_segment', label: 'Segment', type: 'multiselect', options: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'], defaultValue: '' },
    ],
    chartType: 'stacked_bar',
    data: [
      { label: 'Intake', value: 3, category: 'Status' },
      { label: 'Analysis', value: 4, category: 'Status' },
      { label: 'Approved', value: 5, category: 'Status' },
      { label: 'In Progress', value: 8, category: 'Status' },
      { label: 'Completed', value: 18, category: 'Status' },
      { label: 'Deferred', value: 1, category: 'Status' },
      { label: 'Rejected', value: 0, category: 'Status' },
    ],
    owner: 'Jennifer Williams',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },

  // ---------------------------------------------------------------------------
  // Compliance Reports
  // ---------------------------------------------------------------------------
  {
    id: 'rpt_comp_framework_scores',
    name: 'Compliance Framework Scores',
    category: 'compliance',
    description: 'Overall compliance scores for all regulatory frameworks (HIPAA, SOC2, CMS, NCQA, ACA, STATE_MEDICAID, NIST, PCI_DSS) with domain-level breakdowns.',
    filters: [
      { id: 'f_framework', label: 'Framework', type: 'multiselect', options: ['HIPAA', 'SOC2', 'CMS', 'NCQA', 'ACA', 'STATE_MEDICAID', 'NIST', 'PCI_DSS'], defaultValue: '' },
      { id: 'f_status', label: 'Status', type: 'multiselect', options: [MEASURE_STATUS.ON_TRACK, MEASURE_STATUS.AT_RISK, MEASURE_STATUS.CRITICAL], defaultValue: '' },
    ],
    chartType: 'bar',
    data: [
      { label: 'SOC2', value: 96.8, status: MEASURE_STATUS.ON_TRACK, color: 'success' },
      { label: 'HIPAA', value: 94.5, status: MEASURE_STATUS.ON_TRACK, color: 'success' },
      { label: 'ACA', value: 93.4, status: MEASURE_STATUS.ON_TRACK, color: 'success' },
      { label: 'CMS', value: 91.2, status: MEASURE_STATUS.ON_TRACK, color: 'success' },
      { label: 'NCQA', value: 88.7, status: MEASURE_STATUS.ON_TRACK, color: 'success' },
      { label: 'NIST', value: 87.3, status: MEASURE_STATUS.ON_TRACK, color: 'success' },
      { label: 'STATE_MEDICAID', value: 79.8, status: MEASURE_STATUS.AT_RISK, color: 'warning' },
      { label: 'PCI_DSS', value: 72.5, status: MEASURE_STATUS.CRITICAL, color: 'danger' },
    ],
    owner: 'Patricia Evans',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_comp_framework_trends',
    name: 'Compliance Framework Trends',
    category: 'compliance',
    description: 'Monthly compliance score trends for all regulatory frameworks over the past 12 months showing improvement trajectories and areas of concern.',
    filters: [
      { id: 'f_framework', label: 'Framework', type: 'multiselect', options: ['HIPAA', 'SOC2', 'CMS', 'NCQA', 'ACA', 'STATE_MEDICAID', 'NIST', 'PCI_DSS'], defaultValue: '' },
      { id: 'f_period', label: 'Time Period', type: 'select', options: ['Last 6 Months', 'Last 12 Months'], defaultValue: 'Last 12 Months' },
    ],
    chartType: 'line',
    data: [
      { label: 'Jan', value: 90.2, category: 'HIPAA' },
      { label: 'Jun', value: 92.8, category: 'HIPAA' },
      { label: 'Dec', value: 94.5, category: 'HIPAA' },
      { label: 'Jan', value: 94.0, category: 'SOC2' },
      { label: 'Jun', value: 95.8, category: 'SOC2' },
      { label: 'Dec', value: 96.8, category: 'SOC2' },
      { label: 'Jan', value: 86.5, category: 'CMS' },
      { label: 'Jun', value: 89.3, category: 'CMS' },
      { label: 'Dec', value: 91.2, category: 'CMS' },
      { label: 'Jan', value: 72.0, category: 'STATE_MEDICAID' },
      { label: 'Jun', value: 75.8, category: 'STATE_MEDICAID' },
      { label: 'Dec', value: 79.8, category: 'STATE_MEDICAID' },
      { label: 'Jan', value: 65.0, category: 'PCI_DSS' },
      { label: 'Jun', value: 68.5, category: 'PCI_DSS' },
      { label: 'Dec', value: 72.5, category: 'PCI_DSS' },
    ],
    owner: 'Patricia Evans',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_comp_audit_findings',
    name: 'Audit Findings Report',
    category: 'compliance',
    description: 'Comprehensive audit findings report showing open, in-progress, and closed findings with severity distribution, aging analysis, and corrective action tracking.',
    filters: [
      { id: 'f_severity', label: 'Severity', type: 'multiselect', options: ['critical', 'high', 'medium', 'low', 'informational'], defaultValue: '' },
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['open', 'in_progress', 'remediated', 'closed', 'accepted_risk'], defaultValue: '' },
      { id: 'f_assignee', label: 'Assignee', type: 'text', options: [], defaultValue: '' },
    ],
    chartType: 'stacked_bar',
    data: [
      { label: 'Critical', value: 3, category: 'Open/In Progress', color: 'danger' },
      { label: 'Critical', value: 1, category: 'Closed', color: 'success' },
      { label: 'High', value: 5, category: 'Open/In Progress', color: 'warning' },
      { label: 'High', value: 0, category: 'Closed', color: 'success' },
      { label: 'Medium', value: 2, category: 'Open/In Progress', color: 'info' },
      { label: 'Medium', value: 0, category: 'Closed', color: 'success' },
      { label: 'Informational', value: 0, category: 'Open/In Progress', color: 'neutral' },
      { label: 'Informational', value: 3, category: 'Closed', color: 'success' },
    ],
    owner: 'Patricia Evans',
    lastGenerated: '2024-12-12',
    frequency: 'weekly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_comp_operating_expectations',
    name: 'Operating Expectations Status',
    category: 'compliance',
    description: 'Status of all operating expectations showing compliant, non-compliant, partially compliant, and pending review counts with category breakdowns.',
    filters: [
      { id: 'f_category', label: 'Category', type: 'multiselect', options: ['quality', 'security', 'compliance', 'operations', 'development', 'data'], defaultValue: '' },
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['compliant', 'non_compliant', 'partially_compliant', 'waived', 'pending_review'], defaultValue: '' },
    ],
    chartType: 'donut',
    data: [
      { label: 'Compliant', value: 9, category: 'status', color: 'success' },
      { label: 'Partially Compliant', value: 3, category: 'status', color: 'warning' },
      { label: 'Non-Compliant', value: 2, category: 'status', color: 'danger' },
      { label: 'Pending Review', value: 1, category: 'status', color: 'info' },
    ],
    owner: 'Angela Martinez',
    lastGenerated: '2024-12-12',
    frequency: 'monthly',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
  {
    id: 'rpt_comp_environment_health',
    name: 'Environment Health Report',
    category: 'compliance',
    description: 'Health status of all environments showing health scores, availability, conflict detection status, and service-level health check results.',
    filters: [
      { id: 'f_type', label: 'Environment Type', type: 'multiselect', options: ['dev', 'staging', 'qa', 'uat', 'prod'], defaultValue: '' },
      { id: 'f_status', label: 'Status', type: 'multiselect', options: ['available', 'reserved', 'maintenance', 'down'], defaultValue: '' },
    ],
    chartType: 'heatmap',
    data: [
      { label: 'Development 1', value: 95.2, category: 'dev', status: 'available' },
      { label: 'Development 2', value: 92.8, category: 'dev', status: 'reserved' },
      { label: 'Development 3', value: 88.5, category: 'dev', status: 'available' },
      { label: 'Development 4', value: 78.3, category: 'dev', status: 'reserved' },
      { label: 'QA Primary', value: 96.5, category: 'qa', status: 'available' },
      { label: 'QA Secondary', value: 91.2, category: 'qa', status: 'reserved' },
      { label: 'QA Commercial', value: 94.8, category: 'qa', status: 'available' },
      { label: 'QA External', value: 72.4, category: 'qa', status: 'available' },
      { label: 'QA Compliance', value: 98.1, category: 'qa', status: 'available' },
      { label: 'QA Hotfix', value: 0, category: 'qa', status: 'down' },
      { label: 'Staging Primary', value: 97.8, category: 'staging', status: 'available' },
      { label: 'Staging Medicaid', value: 93.4, category: 'staging', status: 'reserved' },
      { label: 'Staging External', value: 45.2, category: 'staging', status: 'maintenance' },
      { label: 'Performance Testing', value: 94.0, category: 'staging', status: 'reserved' },
      { label: 'UAT Enterprise', value: 98.5, category: 'uat', status: 'reserved' },
      { label: 'UAT Medicare', value: 95.7, category: 'uat', status: 'reserved' },
      { label: 'UAT Compliance', value: 99.2, category: 'uat', status: 'available' },
      { label: 'Production US-East', value: 99.4, category: 'prod', status: 'available' },
      { label: 'Production US-West (DR)', value: 99.1, category: 'prod', status: 'available' },
      { label: 'Partner Sandbox', value: 90.5, category: 'dev', status: 'available' },
    ],
    owner: 'Daniel Robinson',
    lastGenerated: '2024-12-12',
    frequency: 'daily',
    applicableSegments: ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'],
  },
];

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all report categories.
 *
 * @returns {ReportCategory[]} Array of all report category objects
 */
export function getAllReportCategories() {
  return [...reportCategories];
}

/**
 * Retrieves a single report category by its unique ID.
 *
 * @param {string} categoryId - The category identifier to look up
 * @returns {ReportCategory|null} The matching report category object, or null if not found
 */
export function getReportCategoryById(categoryId) {
  if (!categoryId || typeof categoryId !== 'string') {
    return null;
  }
  return reportCategories.find((c) => c.id === categoryId) || null;
}

/**
 * Returns all report definitions.
 *
 * @returns {ReportDefinition[]} Array of all report definition objects
 */
export function getAllReports() {
  return [...reports];
}

/**
 * Retrieves a single report by its unique ID.
 *
 * @param {string} reportId - The report identifier to look up
 * @returns {ReportDefinition|null} The matching report object, or null if not found
 */
export function getReportById(reportId) {
  if (!reportId || typeof reportId !== 'string') {
    return null;
  }
  return reports.find((r) => r.id === reportId) || null;
}

/**
 * Returns all reports filtered by category.
 *
 * @param {string} category - The category to filter by (e.g. 'executive', 'segment', 'application', 'test', 'governance', 'compliance')
 * @returns {ReportDefinition[]} Array of reports matching the specified category
 */
export function getReportsByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  return reports.filter((r) => r.category === category);
}

/**
 * Returns all reports filtered by chart type.
 *
 * @param {string} chartType - The chart type to filter by (e.g. 'bar', 'line', 'pie', 'donut', 'table')
 * @returns {ReportDefinition[]} Array of reports matching the specified chart type
 */
export function getReportsByChartType(chartType) {
  if (!chartType || typeof chartType !== 'string') {
    return [];
  }
  return reports.filter((r) => r.chartType === chartType);
}

/**
 * Returns all reports filtered by frequency.
 *
 * @param {string} frequency - The frequency to filter by (e.g. 'daily', 'weekly', 'monthly', 'quarterly', 'on_demand')
 * @returns {ReportDefinition[]} Array of reports matching the specified frequency
 */
export function getReportsByFrequency(frequency) {
  if (!frequency || typeof frequency !== 'string') {
    return [];
  }
  return reports.filter((r) => r.frequency === frequency);
}

/**
 * Returns all reports owned by a specific person.
 *
 * @param {string} owner - The owner name to filter by
 * @returns {ReportDefinition[]} Array of reports owned by the specified person
 */
export function getReportsByOwner(owner) {
  if (!owner || typeof owner !== 'string') {
    return [];
  }
  return reports.filter((r) => r.owner === owner);
}

/**
 * Returns all reports applicable to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {ReportDefinition[]} Array of reports applicable to the specified segment
 */
export function getReportsBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return reports.filter((r) => r.applicableSegments.includes(segment));
}

/**
 * Returns aggregate statistics across all reports.
 *
 * @returns {{ totalReports: number, totalCategories: number, categoryBreakdown: Object<string, number>, chartTypeBreakdown: Object<string, number>, frequencyBreakdown: Object<string, number>, ownerBreakdown: Object<string, number> }} Aggregate report statistics
 */
export function getReportAggregates() {
  const totalReports = reports.length;
  const totalCategories = reportCategories.length;

  const categoryBreakdown = reports.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const chartTypeBreakdown = reports.reduce((acc, r) => {
    acc[r.chartType] = (acc[r.chartType] || 0) + 1;
    return acc;
  }, {});

  const frequencyBreakdown = reports.reduce((acc, r) => {
    acc[r.frequency] = (acc[r.frequency] || 0) + 1;
    return acc;
  }, {});

  const ownerBreakdown = reports.reduce((acc, r) => {
    acc[r.owner] = (acc[r.owner] || 0) + 1;
    return acc;
  }, {});

  return {
    totalReports,
    totalCategories,
    categoryBreakdown,
    chartTypeBreakdown,
    frequencyBreakdown,
    ownerBreakdown,
  };
}

/**
 * Returns all unique report categories from report definitions.
 *
 * @returns {string[]} Array of unique category names sorted alphabetically
 */
export function getAllReportCategoryNames() {
  const categories = new Set(reports.map((r) => r.category));
  return [...categories].sort();
}

/**
 * Returns all unique chart types across all reports.
 *
 * @returns {string[]} Array of unique chart types sorted alphabetically
 */
export function getAllReportChartTypes() {
  const chartTypes = new Set(reports.map((r) => r.chartType));
  return [...chartTypes].sort();
}

/**
 * Returns all unique frequencies across all reports.
 *
 * @returns {string[]} Array of unique frequencies sorted alphabetically
 */
export function getAllReportFrequencies() {
  const frequencies = new Set(reports.map((r) => r.frequency));
  return [...frequencies].sort();
}

/**
 * Returns all unique owner names across all reports.
 *
 * @returns {string[]} Array of unique owner names sorted alphabetically
 */
export function getAllReportOwners() {
  const owners = new Set(reports.map((r) => r.owner));
  return [...owners].sort();
}

export default reports;