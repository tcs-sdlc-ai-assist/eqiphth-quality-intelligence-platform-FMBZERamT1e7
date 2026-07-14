import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} PlatformUsageMetric
 * @property {string} id - Unique metric identifier
 * @property {string} name - Display name of the metric
 * @property {number} currentValue - Current metric value
 * @property {number} previousValue - Previous period metric value
 * @property {string} unit - Unit of measurement (count, percent, minutes, sessions, ratio)
 * @property {string} trend - Trend direction (improving, declining, stable)
 * @property {number} changePercent - Percentage change from previous period
 * @property {string} status - Metric status using MEASURE_STATUS
 * @property {string} description - Description of the metric
 * @property {{ month: string, value: number }[]} trendData - Monthly trend data
 */

/**
 * @typedef {Object} UserAdoptionRate
 * @property {string} id - Unique adoption rate identifier
 * @property {string} personaId - Persona ID this adoption rate relates to
 * @property {string} personaName - Display name of the persona
 * @property {string} role - Role title
 * @property {string} segment - Organizational segment
 * @property {number} totalUsers - Total number of users with this persona
 * @property {number} activeUsers - Number of active users (logged in within last 30 days)
 * @property {number} adoptionRate - Adoption rate percentage (0-100)
 * @property {number} averageSessionsPerWeek - Average sessions per user per week
 * @property {number} averageSessionDurationMinutes - Average session duration in minutes
 * @property {string} status - Adoption status using MEASURE_STATUS
 * @property {string} trend - Trend direction (improving, declining, stable)
 * @property {{ month: string, rate: number }[]} trendData - Monthly adoption rate trend data
 * @property {string[]} topFeatures - Top 3 features used by this persona
 */

/**
 * @typedef {Object} FeatureUtilization
 * @property {string} id - Unique feature utilization identifier
 * @property {string} featureName - Display name of the feature
 * @property {string} category - Feature category (dashboard, quality_management, test_management, compliance, analytics, governance, automation, collaboration, administration)
 * @property {string} route - Route path associated with the feature
 * @property {number} totalPageViews - Total page views in the current period
 * @property {number} uniqueUsers - Number of unique users who accessed the feature
 * @property {number} utilizationRate - Utilization rate percentage (0-100)
 * @property {number} averageTimeOnFeatureMinutes - Average time spent on the feature in minutes
 * @property {string} status - Utilization status using MEASURE_STATUS
 * @property {string} trend - Trend direction (improving, declining, stable)
 * @property {{ month: string, views: number, users: number }[]} trendData - Monthly utilization trend data
 * @property {string[]} topPersonas - Top 3 personas using this feature
 */

/**
 * @typedef {Object} ValueRealizationKPI
 * @property {string} id - Unique KPI identifier
 * @property {string} name - Display name of the KPI
 * @property {string} category - KPI category (efficiency, quality, compliance, cost, velocity, risk)
 * @property {number} baselineValue - Baseline value before platform adoption
 * @property {number} currentValue - Current measured value
 * @property {number} targetValue - Target value for full realization
 * @property {string} unit - Unit of measurement (percent, hours, days, count, ratio, currency)
 * @property {number} improvementPercent - Improvement percentage from baseline
 * @property {number} realizationPercent - Percentage of target value realized (0-100)
 * @property {string} status - Realization status using MEASURE_STATUS
 * @property {string} description - Description of the KPI and its business impact
 * @property {{ quarter: string, value: number }[]} trendData - Quarterly trend data
 * @property {string} owner - Name of the person responsible for the KPI
 */

/**
 * @typedef {Object} AdoptionMilestone
 * @property {string} id - Unique milestone identifier
 * @property {string} title - Display title of the milestone
 * @property {string} description - Description of the milestone
 * @property {string} targetDate - Target date in ISO format
 * @property {string} achievedDate - Achieved date in ISO format (empty string if not achieved)
 * @property {string} status - Milestone status (achieved, on_track, at_risk, missed, upcoming)
 * @property {number} completionPercent - Completion percentage (0-100)
 * @property {string} category - Milestone category (onboarding, feature_rollout, integration, training, optimization)
 * @property {string} owner - Name of the person responsible for the milestone
 */

/**
 * @typedef {Object} AdoptionData
 * @property {PlatformUsageMetric[]} platformUsageMetrics - Array of platform usage metrics
 * @property {UserAdoptionRate[]} userAdoptionRates - Array of user adoption rates
 * @property {FeatureUtilization[]} featureUtilizations - Array of feature utilization data
 * @property {ValueRealizationKPI[]} valueRealizationKPIs - Array of value realization KPIs
 * @property {AdoptionMilestone[]} adoptionMilestones - Array of adoption milestones
 */

/**
 * Mock platform usage metrics for the EQIP Quality Platform.
 * @type {PlatformUsageMetric[]}
 */
const platformUsageMetrics = [
  {
    id: 'pum_001',
    name: 'Daily Active Users',
    currentValue: 187,
    previousValue: 162,
    unit: 'count',
    trend: 'improving',
    changePercent: 15.4,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Number of unique users who log in and perform at least one action per day across all personas and segments.',
    trendData: [
      { month: 'Jan', value: 120 },
      { month: 'Feb', value: 128 },
      { month: 'Mar', value: 135 },
      { month: 'Apr', value: 142 },
      { month: 'May', value: 148 },
      { month: 'Jun', value: 155 },
      { month: 'Jul', value: 160 },
      { month: 'Aug', value: 165 },
      { month: 'Sep', value: 170 },
      { month: 'Oct', value: 175 },
      { month: 'Nov', value: 180 },
      { month: 'Dec', value: 187 },
    ],
  },
  {
    id: 'pum_002',
    name: 'Weekly Active Users',
    currentValue: 312,
    previousValue: 285,
    unit: 'count',
    trend: 'improving',
    changePercent: 9.5,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Number of unique users who log in and perform at least one action per week across all personas and segments.',
    trendData: [
      { month: 'Jan', value: 210 },
      { month: 'Feb', value: 222 },
      { month: 'Mar', value: 235 },
      { month: 'Apr', value: 245 },
      { month: 'May', value: 255 },
      { month: 'Jun', value: 265 },
      { month: 'Jul', value: 272 },
      { month: 'Aug', value: 280 },
      { month: 'Sep', value: 288 },
      { month: 'Oct', value: 295 },
      { month: 'Nov', value: 305 },
      { month: 'Dec', value: 312 },
    ],
  },
  {
    id: 'pum_003',
    name: 'Monthly Active Users',
    currentValue: 428,
    previousValue: 395,
    unit: 'count',
    trend: 'improving',
    changePercent: 8.4,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Number of unique users who log in at least once per month across all personas and segments.',
    trendData: [
      { month: 'Jan', value: 290 },
      { month: 'Feb', value: 305 },
      { month: 'Mar', value: 318 },
      { month: 'Apr', value: 330 },
      { month: 'May', value: 342 },
      { month: 'Jun', value: 355 },
      { month: 'Jul', value: 365 },
      { month: 'Aug', value: 375 },
      { month: 'Sep', value: 385 },
      { month: 'Oct', value: 398 },
      { month: 'Nov', value: 412 },
      { month: 'Dec', value: 428 },
    ],
  },
  {
    id: 'pum_004',
    name: 'Average Session Duration',
    currentValue: 18.5,
    previousValue: 16.2,
    unit: 'minutes',
    trend: 'improving',
    changePercent: 14.2,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Average time users spend per session on the platform, indicating depth of engagement and feature exploration.',
    trendData: [
      { month: 'Jan', value: 12.0 },
      { month: 'Feb', value: 12.8 },
      { month: 'Mar', value: 13.5 },
      { month: 'Apr', value: 14.0 },
      { month: 'May', value: 14.5 },
      { month: 'Jun', value: 15.2 },
      { month: 'Jul', value: 15.8 },
      { month: 'Aug', value: 16.2 },
      { month: 'Sep', value: 16.8 },
      { month: 'Oct', value: 17.4 },
      { month: 'Nov', value: 18.0 },
      { month: 'Dec', value: 18.5 },
    ],
  },
  {
    id: 'pum_005',
    name: 'Sessions Per User Per Week',
    currentValue: 4.8,
    previousValue: 4.2,
    unit: 'sessions',
    trend: 'improving',
    changePercent: 14.3,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Average number of sessions per active user per week, indicating frequency of platform engagement.',
    trendData: [
      { month: 'Jan', value: 3.0 },
      { month: 'Feb', value: 3.2 },
      { month: 'Mar', value: 3.4 },
      { month: 'Apr', value: 3.6 },
      { month: 'May', value: 3.8 },
      { month: 'Jun', value: 4.0 },
      { month: 'Jul', value: 4.1 },
      { month: 'Aug', value: 4.2 },
      { month: 'Sep', value: 4.4 },
      { month: 'Oct', value: 4.5 },
      { month: 'Nov', value: 4.7 },
      { month: 'Dec', value: 4.8 },
    ],
  },
  {
    id: 'pum_006',
    name: 'Platform Adoption Rate',
    currentValue: 85.6,
    previousValue: 79.0,
    unit: 'percent',
    trend: 'improving',
    changePercent: 8.4,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Percentage of provisioned users who have actively used the platform in the last 30 days.',
    trendData: [
      { month: 'Jan', value: 58.0 },
      { month: 'Feb', value: 61.5 },
      { month: 'Mar', value: 64.0 },
      { month: 'Apr', value: 66.5 },
      { month: 'May', value: 69.0 },
      { month: 'Jun', value: 72.0 },
      { month: 'Jul', value: 74.5 },
      { month: 'Aug', value: 77.0 },
      { month: 'Sep', value: 79.0 },
      { month: 'Oct', value: 81.5 },
      { month: 'Nov', value: 83.5 },
      { month: 'Dec', value: 85.6 },
    ],
  },
  {
    id: 'pum_007',
    name: 'Feature Adoption Breadth',
    currentValue: 72.3,
    previousValue: 65.8,
    unit: 'percent',
    trend: 'improving',
    changePercent: 9.9,
    status: MEASURE_STATUS.AT_RISK,
    description: 'Percentage of available platform features that have been used by at least 50% of target users.',
    trendData: [
      { month: 'Jan', value: 42.0 },
      { month: 'Feb', value: 45.5 },
      { month: 'Mar', value: 48.0 },
      { month: 'Apr', value: 51.0 },
      { month: 'May', value: 54.5 },
      { month: 'Jun', value: 57.0 },
      { month: 'Jul', value: 60.0 },
      { month: 'Aug', value: 62.5 },
      { month: 'Sep', value: 65.0 },
      { month: 'Oct', value: 67.8 },
      { month: 'Nov', value: 70.0 },
      { month: 'Dec', value: 72.3 },
    ],
  },
  {
    id: 'pum_008',
    name: 'Data Export Utilization',
    currentValue: 342,
    previousValue: 298,
    unit: 'count',
    trend: 'improving',
    changePercent: 14.8,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Total number of data exports (CSV, JSON, PDF) performed per month across all users.',
    trendData: [
      { month: 'Jan', value: 180 },
      { month: 'Feb', value: 195 },
      { month: 'Mar', value: 210 },
      { month: 'Apr', value: 225 },
      { month: 'May', value: 240 },
      { month: 'Jun', value: 255 },
      { month: 'Jul', value: 268 },
      { month: 'Aug', value: 280 },
      { month: 'Sep', value: 295 },
      { month: 'Oct', value: 310 },
      { month: 'Nov', value: 325 },
      { month: 'Dec', value: 342 },
    ],
  },
  {
    id: 'pum_009',
    name: 'API Integration Calls',
    currentValue: 45200,
    previousValue: 38500,
    unit: 'count',
    trend: 'improving',
    changePercent: 17.4,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Total number of API calls made through platform integrations per month, indicating system-to-system adoption.',
    trendData: [
      { month: 'Jan', value: 22000 },
      { month: 'Feb', value: 24500 },
      { month: 'Mar', value: 27000 },
      { month: 'Apr', value: 29500 },
      { month: 'May', value: 31500 },
      { month: 'Jun', value: 33800 },
      { month: 'Jul', value: 35500 },
      { month: 'Aug', value: 37200 },
      { month: 'Sep', value: 39000 },
      { month: 'Oct', value: 41000 },
      { month: 'Nov', value: 43200 },
      { month: 'Dec', value: 45200 },
    ],
  },
  {
    id: 'pum_010',
    name: 'User Satisfaction Score',
    currentValue: 4.3,
    previousValue: 4.1,
    unit: 'ratio',
    trend: 'improving',
    changePercent: 4.9,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Average user satisfaction score on a 1-5 scale collected through in-app feedback surveys.',
    trendData: [
      { month: 'Jan', value: 3.5 },
      { month: 'Feb', value: 3.6 },
      { month: 'Mar', value: 3.7 },
      { month: 'Apr', value: 3.8 },
      { month: 'May', value: 3.9 },
      { month: 'Jun', value: 4.0 },
      { month: 'Jul', value: 4.0 },
      { month: 'Aug', value: 4.1 },
      { month: 'Sep', value: 4.1 },
      { month: 'Oct', value: 4.2 },
      { month: 'Nov', value: 4.2 },
      { month: 'Dec', value: 4.3 },
    ],
  },
];

/**
 * Mock user adoption rates for the EQIP Quality Platform.
 * @type {UserAdoptionRate[]}
 */
const userAdoptionRates = [
  {
    id: 'uar_001',
    personaId: 'quality_director',
    personaName: 'Angela Martinez',
    role: 'Director Quality Engineering',
    segment: 'Enterprise',
    totalUsers: 3,
    activeUsers: 3,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 8.2,
    averageSessionDurationMinutes: 25.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 100.0 },
      { month: 'Feb', rate: 100.0 },
      { month: 'Mar', rate: 100.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Executive Dashboard', 'Quality Gate Management', 'Demand Pipeline'],
  },
  {
    id: 'uar_002',
    personaId: 'vp_qe',
    personaName: 'Jennifer Williams',
    role: 'VP Quality Engineering',
    segment: 'Enterprise',
    totalUsers: 2,
    activeUsers: 2,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 7.5,
    averageSessionDurationMinutes: 22.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 100.0 },
      { month: 'Feb', rate: 100.0 },
      { month: 'Mar', rate: 100.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Executive Dashboard', 'Release Readiness', 'Quality Gate Waivers'],
  },
  {
    id: 'uar_003',
    personaId: 'quality_engineer',
    personaName: 'Lisa Johnson',
    role: 'Quality Engineer',
    segment: 'Medicare',
    totalUsers: 12,
    activeUsers: 11,
    adoptionRate: 91.7,
    averageSessionsPerWeek: 6.8,
    averageSessionDurationMinutes: 28.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', rate: 75.0 },
      { month: 'Feb', rate: 77.5 },
      { month: 'Mar', rate: 80.0 },
      { month: 'Apr', rate: 82.0 },
      { month: 'May', rate: 83.5 },
      { month: 'Jun', rate: 85.0 },
      { month: 'Jul', rate: 86.5 },
      { month: 'Aug', rate: 87.5 },
      { month: 'Sep', rate: 88.5 },
      { month: 'Oct', rate: 89.5 },
      { month: 'Nov', rate: 90.8 },
      { month: 'Dec', rate: 91.7 },
    ],
    topFeatures: ['Test Case Management', 'Test Execution Results', 'Defect Tracking'],
  },
  {
    id: 'uar_004',
    personaId: 'automation_engineer',
    personaName: 'James Wright',
    role: 'Automation Engineer',
    segment: 'Enterprise',
    totalUsers: 8,
    activeUsers: 8,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 9.2,
    averageSessionDurationMinutes: 32.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 87.5 },
      { month: 'Feb', rate: 87.5 },
      { month: 'Mar', rate: 100.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Schedule Management', 'Automation Intelligence', 'Test Execution Results'],
  },
  {
    id: 'uar_005',
    personaId: 'auditor',
    personaName: 'Patricia Evans',
    role: 'Auditor',
    segment: 'Compliance',
    totalUsers: 5,
    activeUsers: 5,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 5.5,
    averageSessionDurationMinutes: 20.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 80.0 },
      { month: 'Feb', rate: 80.0 },
      { month: 'Mar', rate: 80.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Compliance Framework Scores', 'Audit Findings', 'Governance Reports'],
  },
  {
    id: 'uar_006',
    personaId: 'segment_leader',
    personaName: 'Michael Torres',
    role: 'Segment Leader',
    segment: 'Medicare',
    totalUsers: 6,
    activeUsers: 5,
    adoptionRate: 83.3,
    averageSessionsPerWeek: 4.2,
    averageSessionDurationMinutes: 15.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', rate: 50.0 },
      { month: 'Feb', rate: 55.0 },
      { month: 'Mar', rate: 60.0 },
      { month: 'Apr', rate: 63.0 },
      { month: 'May', rate: 66.7 },
      { month: 'Jun', rate: 70.0 },
      { month: 'Jul', rate: 72.0 },
      { month: 'Aug', rate: 75.0 },
      { month: 'Sep', rate: 77.0 },
      { month: 'Oct', rate: 79.0 },
      { month: 'Nov', rate: 81.0 },
      { month: 'Dec', rate: 83.3 },
    ],
    topFeatures: ['Executive Dashboard', 'Segment Overview', 'Release Readiness'],
  },
  {
    id: 'uar_007',
    personaId: 'performance_engineer',
    personaName: 'Marcus Thompson',
    role: 'Performance Engineer',
    segment: 'Enterprise',
    totalUsers: 4,
    activeUsers: 4,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 7.0,
    averageSessionDurationMinutes: 24.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 75.0 },
      { month: 'Feb', rate: 75.0 },
      { month: 'Mar', rate: 100.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Performance Analytics', 'Post-Deployment Monitoring', 'SLA Compliance'],
  },
  {
    id: 'uar_008',
    personaId: 'security_engineer',
    personaName: 'Natalie White',
    role: 'Security Engineer',
    segment: 'Enterprise',
    totalUsers: 3,
    activeUsers: 3,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 5.8,
    averageSessionDurationMinutes: 18.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 66.7 },
      { month: 'Feb', rate: 66.7 },
      { month: 'Mar', rate: 100.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Security Test Results', 'Audit Findings', 'Compliance Scores'],
  },
  {
    id: 'uar_009',
    personaId: 'vendor_partner',
    personaName: 'Alex Rivera',
    role: 'Vendor Partner',
    segment: 'External',
    totalUsers: 15,
    activeUsers: 9,
    adoptionRate: 60.0,
    averageSessionsPerWeek: 2.5,
    averageSessionDurationMinutes: 10.0,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', rate: 26.7 },
      { month: 'Feb', rate: 30.0 },
      { month: 'Mar', rate: 33.3 },
      { month: 'Apr', rate: 36.7 },
      { month: 'May', rate: 40.0 },
      { month: 'Jun', rate: 43.3 },
      { month: 'Jul', rate: 46.7 },
      { month: 'Aug', rate: 48.0 },
      { month: 'Sep', rate: 50.0 },
      { month: 'Oct', rate: 53.3 },
      { month: 'Nov', rate: 56.7 },
      { month: 'Dec', rate: 60.0 },
    ],
    topFeatures: ['Dashboard Overview', 'Integration Status', 'Notification Center'],
  },
  {
    id: 'uar_010',
    personaId: 'developer',
    personaName: 'Chris Anderson',
    role: 'Developer',
    segment: 'Enterprise',
    totalUsers: 45,
    activeUsers: 32,
    adoptionRate: 71.1,
    averageSessionsPerWeek: 3.2,
    averageSessionDurationMinutes: 12.0,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', rate: 40.0 },
      { month: 'Feb', rate: 44.4 },
      { month: 'Mar', rate: 48.9 },
      { month: 'Apr', rate: 51.1 },
      { month: 'May', rate: 53.3 },
      { month: 'Jun', rate: 55.6 },
      { month: 'Jul', rate: 57.8 },
      { month: 'Aug', rate: 60.0 },
      { month: 'Sep', rate: 62.2 },
      { month: 'Oct', rate: 64.4 },
      { month: 'Nov', rate: 68.9 },
      { month: 'Dec', rate: 71.1 },
    ],
    topFeatures: ['Quality Gate Status', 'Test Results', 'Application Details'],
  },
  {
    id: 'uar_011',
    personaId: 'executive_leadership',
    personaName: 'Sarah Chen',
    role: 'Executive Leadership',
    segment: 'Enterprise',
    totalUsers: 4,
    activeUsers: 3,
    adoptionRate: 75.0,
    averageSessionsPerWeek: 2.0,
    averageSessionDurationMinutes: 8.5,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', rate: 25.0 },
      { month: 'Feb', rate: 25.0 },
      { month: 'Mar', rate: 50.0 },
      { month: 'Apr', rate: 50.0 },
      { month: 'May', rate: 50.0 },
      { month: 'Jun', rate: 50.0 },
      { month: 'Jul', rate: 50.0 },
      { month: 'Aug', rate: 75.0 },
      { month: 'Sep', rate: 75.0 },
      { month: 'Oct', rate: 75.0 },
      { month: 'Nov', rate: 75.0 },
      { month: 'Dec', rate: 75.0 },
    ],
    topFeatures: ['Executive Dashboard', 'KPI Scorecard', 'AI Executive Briefing'],
  },
  {
    id: 'uar_012',
    personaId: 'environment_manager',
    personaName: 'Daniel Robinson',
    role: 'Environment Manager',
    segment: 'Enterprise',
    totalUsers: 3,
    activeUsers: 3,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 8.5,
    averageSessionDurationMinutes: 20.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 66.7 },
      { month: 'Feb', rate: 100.0 },
      { month: 'Mar', rate: 100.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Environment Health', 'Conflict Detection', 'Reservation Management'],
  },
  {
    id: 'uar_013',
    personaId: 'test_data_engineer',
    personaName: 'Samantha Clark',
    role: 'Test Data Engineer',
    segment: 'Enterprise',
    totalUsers: 4,
    activeUsers: 4,
    adoptionRate: 100.0,
    averageSessionsPerWeek: 6.0,
    averageSessionDurationMinutes: 22.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', rate: 75.0 },
      { month: 'Feb', rate: 75.0 },
      { month: 'Mar', rate: 100.0 },
      { month: 'Apr', rate: 100.0 },
      { month: 'May', rate: 100.0 },
      { month: 'Jun', rate: 100.0 },
      { month: 'Jul', rate: 100.0 },
      { month: 'Aug', rate: 100.0 },
      { month: 'Sep', rate: 100.0 },
      { month: 'Oct', rate: 100.0 },
      { month: 'Nov', rate: 100.0 },
      { month: 'Dec', rate: 100.0 },
    ],
    topFeatures: ['Test Data Management', 'Data Masking Status', 'Provisioning Workflows'],
  },
  {
    id: 'uar_014',
    personaId: 'read_only_user',
    personaName: 'Sandra Cooper',
    role: 'Read Only User',
    segment: 'Enterprise',
    totalUsers: 25,
    activeUsers: 15,
    adoptionRate: 60.0,
    averageSessionsPerWeek: 1.8,
    averageSessionDurationMinutes: 7.0,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', rate: 32.0 },
      { month: 'Feb', rate: 36.0 },
      { month: 'Mar', rate: 38.0 },
      { month: 'Apr', rate: 40.0 },
      { month: 'May', rate: 42.0 },
      { month: 'Jun', rate: 44.0 },
      { month: 'Jul', rate: 46.0 },
      { month: 'Aug', rate: 48.0 },
      { month: 'Sep', rate: 50.0 },
      { month: 'Oct', rate: 54.0 },
      { month: 'Nov', rate: 56.0 },
      { month: 'Dec', rate: 60.0 },
    ],
    topFeatures: ['Executive Dashboard', 'Quality Summary', 'Weekly Digest'],
  },
];

/**
 * Mock feature utilization data for the EQIP Quality Platform.
 * @type {FeatureUtilization[]}
 */
const featureUtilizations = [
  {
    id: 'fu_001',
    featureName: 'Executive Dashboard',
    category: 'dashboard',
    route: '/dashboard',
    totalPageViews: 8450,
    uniqueUsers: 285,
    utilizationRate: 95.0,
    averageTimeOnFeatureMinutes: 5.2,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', views: 5200, users: 180 },
      { month: 'Feb', views: 5500, users: 190 },
      { month: 'Mar', views: 5800, users: 200 },
      { month: 'Apr', views: 6100, users: 210 },
      { month: 'May', views: 6400, users: 220 },
      { month: 'Jun', views: 6700, users: 230 },
      { month: 'Jul', views: 7000, users: 240 },
      { month: 'Aug', views: 7300, users: 250 },
      { month: 'Sep', views: 7600, users: 260 },
      { month: 'Oct', views: 7900, users: 270 },
      { month: 'Nov', views: 8200, users: 278 },
      { month: 'Dec', views: 8450, users: 285 },
    ],
    topPersonas: ['quality_director', 'vp_qe', 'executive_leadership'],
  },
  {
    id: 'fu_002',
    featureName: 'Quality Gate Management',
    category: 'quality_management',
    route: '/measures',
    totalPageViews: 6200,
    uniqueUsers: 195,
    utilizationRate: 88.5,
    averageTimeOnFeatureMinutes: 8.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 3500, users: 120 },
      { month: 'Feb', views: 3800, users: 130 },
      { month: 'Mar', views: 4100, users: 140 },
      { month: 'Apr', views: 4400, users: 148 },
      { month: 'May', views: 4700, users: 155 },
      { month: 'Jun', views: 4900, users: 162 },
      { month: 'Jul', views: 5100, users: 168 },
      { month: 'Aug', views: 5300, users: 174 },
      { month: 'Sep', views: 5500, users: 180 },
      { month: 'Oct', views: 5700, users: 185 },
      { month: 'Nov', views: 5950, users: 190 },
      { month: 'Dec', views: 6200, users: 195 },
    ],
    topPersonas: ['quality_director', 'quality_engineer', 'release_manager'],
  },
  {
    id: 'fu_003',
    featureName: 'Test Execution Results',
    category: 'test_management',
    route: '/measures',
    totalPageViews: 7800,
    uniqueUsers: 210,
    utilizationRate: 92.0,
    averageTimeOnFeatureMinutes: 12.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 4200, users: 135 },
      { month: 'Feb', views: 4600, users: 145 },
      { month: 'Mar', views: 5000, users: 155 },
      { month: 'Apr', views: 5300, users: 162 },
      { month: 'May', views: 5600, users: 170 },
      { month: 'Jun', views: 5900, users: 175 },
      { month: 'Jul', views: 6200, users: 180 },
      { month: 'Aug', views: 6500, users: 185 },
      { month: 'Sep', views: 6800, users: 192 },
      { month: 'Oct', views: 7100, users: 198 },
      { month: 'Nov', views: 7450, users: 205 },
      { month: 'Dec', views: 7800, users: 210 },
    ],
    topPersonas: ['quality_engineer', 'automation_engineer', 'sdet'],
  },
  {
    id: 'fu_004',
    featureName: 'Compliance Framework Scores',
    category: 'compliance',
    route: '/reports',
    totalPageViews: 3200,
    uniqueUsers: 85,
    utilizationRate: 78.5,
    averageTimeOnFeatureMinutes: 10.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 1800, users: 48 },
      { month: 'Feb', views: 1950, users: 52 },
      { month: 'Mar', views: 2100, users: 56 },
      { month: 'Apr', views: 2200, users: 60 },
      { month: 'May', views: 2350, users: 63 },
      { month: 'Jun', views: 2500, users: 66 },
      { month: 'Jul', views: 2600, users: 70 },
      { month: 'Aug', views: 2700, users: 73 },
      { month: 'Sep', views: 2850, users: 76 },
      { month: 'Oct', views: 2950, users: 79 },
      { month: 'Nov', views: 3080, users: 82 },
      { month: 'Dec', views: 3200, users: 85 },
    ],
    topPersonas: ['auditor', 'quality_director', 'security_engineer'],
  },
  {
    id: 'fu_005',
    featureName: 'AI Insights & Predictions',
    category: 'analytics',
    route: '/analytics',
    totalPageViews: 2800,
    uniqueUsers: 95,
    utilizationRate: 65.0,
    averageTimeOnFeatureMinutes: 7.5,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 800, users: 28 },
      { month: 'Feb', views: 1000, users: 35 },
      { month: 'Mar', views: 1200, users: 42 },
      { month: 'Apr', views: 1400, users: 48 },
      { month: 'May', views: 1600, users: 55 },
      { month: 'Jun', views: 1800, users: 60 },
      { month: 'Jul', views: 1950, users: 65 },
      { month: 'Aug', views: 2100, users: 72 },
      { month: 'Sep', views: 2300, users: 78 },
      { month: 'Oct', views: 2500, users: 84 },
      { month: 'Nov', views: 2650, users: 90 },
      { month: 'Dec', views: 2800, users: 95 },
    ],
    topPersonas: ['quality_director', 'performance_engineer', 'product_owner'],
  },
  {
    id: 'fu_006',
    featureName: 'Test Data Management',
    category: 'test_management',
    route: '/patients',
    totalPageViews: 2400,
    uniqueUsers: 68,
    utilizationRate: 72.0,
    averageTimeOnFeatureMinutes: 15.0,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 1200, users: 35 },
      { month: 'Feb', views: 1350, users: 38 },
      { month: 'Mar', views: 1500, users: 42 },
      { month: 'Apr', views: 1600, users: 45 },
      { month: 'May', views: 1700, users: 48 },
      { month: 'Jun', views: 1800, users: 50 },
      { month: 'Jul', views: 1900, users: 53 },
      { month: 'Aug', views: 2000, users: 56 },
      { month: 'Sep', views: 2100, users: 59 },
      { month: 'Oct', views: 2200, users: 62 },
      { month: 'Nov', views: 2300, users: 65 },
      { month: 'Dec', views: 2400, users: 68 },
    ],
    topPersonas: ['test_data_engineer', 'quality_engineer', 'automation_engineer'],
  },
  {
    id: 'fu_007',
    featureName: 'Governance & Procedures',
    category: 'governance',
    route: '/reports',
    totalPageViews: 1800,
    uniqueUsers: 72,
    utilizationRate: 68.0,
    averageTimeOnFeatureMinutes: 9.0,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', views: 1000, users: 40 },
      { month: 'Feb', views: 1050, users: 42 },
      { month: 'Mar', views: 1100, users: 45 },
      { month: 'Apr', views: 1200, users: 48 },
      { month: 'May', views: 1300, users: 50 },
      { month: 'Jun', views: 1350, users: 52 },
      { month: 'Jul', views: 1400, users: 55 },
      { month: 'Aug', views: 1500, users: 58 },
      { month: 'Sep', views: 1550, users: 60 },
      { month: 'Oct', views: 1650, users: 64 },
      { month: 'Nov', views: 1720, users: 68 },
      { month: 'Dec', views: 1800, users: 72 },
    ],
    topPersonas: ['auditor', 'quality_director', 'qe_manager'],
  },
  {
    id: 'fu_008',
    featureName: 'Automation Intelligence',
    category: 'automation',
    route: '/analytics',
    totalPageViews: 2100,
    uniqueUsers: 58,
    utilizationRate: 62.0,
    averageTimeOnFeatureMinutes: 11.0,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 600, users: 18 },
      { month: 'Feb', views: 750, users: 22 },
      { month: 'Mar', views: 900, users: 26 },
      { month: 'Apr', views: 1050, users: 30 },
      { month: 'May', views: 1200, users: 34 },
      { month: 'Jun', views: 1350, users: 38 },
      { month: 'Jul', views: 1450, users: 40 },
      { month: 'Aug', views: 1550, users: 43 },
      { month: 'Sep', views: 1700, users: 47 },
      { month: 'Oct', views: 1850, users: 51 },
      { month: 'Nov', views: 1980, users: 55 },
      { month: 'Dec', views: 2100, users: 58 },
    ],
    topPersonas: ['automation_engineer', 'quality_director', 'sdet'],
  },
  {
    id: 'fu_009',
    featureName: 'Environment Health Monitoring',
    category: 'administration',
    route: '/settings',
    totalPageViews: 3500,
    uniqueUsers: 45,
    utilizationRate: 82.0,
    averageTimeOnFeatureMinutes: 6.5,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', views: 2000, users: 28 },
      { month: 'Feb', views: 2150, users: 30 },
      { month: 'Mar', views: 2300, users: 32 },
      { month: 'Apr', views: 2450, users: 34 },
      { month: 'May', views: 2600, users: 35 },
      { month: 'Jun', views: 2700, users: 36 },
      { month: 'Jul', views: 2850, users: 38 },
      { month: 'Aug', views: 2950, users: 39 },
      { month: 'Sep', views: 3100, users: 40 },
      { month: 'Oct', views: 3200, users: 42 },
      { month: 'Nov', views: 3350, users: 43 },
      { month: 'Dec', views: 3500, users: 45 },
    ],
    topPersonas: ['environment_manager', 'production_support', 'admin'],
  },
  {
    id: 'fu_010',
    featureName: 'Notification Center',
    category: 'collaboration',
    route: '/dashboard',
    totalPageViews: 5600,
    uniqueUsers: 320,
    utilizationRate: 90.0,
    averageTimeOnFeatureMinutes: 3.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'stable',
    trendData: [
      { month: 'Jan', views: 3200, users: 200 },
      { month: 'Feb', views: 3400, users: 215 },
      { month: 'Mar', views: 3600, users: 228 },
      { month: 'Apr', views: 3800, users: 240 },
      { month: 'May', views: 4000, users: 252 },
      { month: 'Jun', views: 4200, users: 262 },
      { month: 'Jul', views: 4400, users: 272 },
      { month: 'Aug', views: 4600, users: 282 },
      { month: 'Sep', views: 4800, users: 292 },
      { month: 'Oct', views: 5100, users: 302 },
      { month: 'Nov', views: 5350, users: 312 },
      { month: 'Dec', views: 5600, users: 320 },
    ],
    topPersonas: ['quality_director', 'automation_engineer', 'environment_manager'],
  },
  {
    id: 'fu_011',
    featureName: 'Demand Pipeline',
    category: 'governance',
    route: '/measures',
    totalPageViews: 2900,
    uniqueUsers: 110,
    utilizationRate: 75.0,
    averageTimeOnFeatureMinutes: 8.0,
    status: MEASURE_STATUS.ON_TRACK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 1500, users: 55 },
      { month: 'Feb', views: 1650, users: 60 },
      { month: 'Mar', views: 1800, users: 65 },
      { month: 'Apr', views: 1950, users: 72 },
      { month: 'May', views: 2050, users: 78 },
      { month: 'Jun', views: 2200, users: 82 },
      { month: 'Jul', views: 2300, users: 86 },
      { month: 'Aug', views: 2400, users: 90 },
      { month: 'Sep', views: 2550, users: 95 },
      { month: 'Oct', views: 2650, users: 100 },
      { month: 'Nov', views: 2780, users: 105 },
      { month: 'Dec', views: 2900, users: 110 },
    ],
    topPersonas: ['quality_director', 'vp_qe', 'product_owner'],
  },
  {
    id: 'fu_012',
    featureName: 'Post-Deployment Monitoring',
    category: 'quality_management',
    route: '/analytics',
    totalPageViews: 1950,
    uniqueUsers: 65,
    utilizationRate: 58.0,
    averageTimeOnFeatureMinutes: 9.5,
    status: MEASURE_STATUS.AT_RISK,
    trend: 'improving',
    trendData: [
      { month: 'Jan', views: 500, users: 15 },
      { month: 'Feb', views: 650, users: 20 },
      { month: 'Mar', views: 800, users: 25 },
      { month: 'Apr', views: 950, users: 30 },
      { month: 'May', views: 1050, users: 35 },
      { month: 'Jun', views: 1200, users: 38 },
      { month: 'Jul', views: 1300, users: 42 },
      { month: 'Aug', views: 1400, users: 46 },
      { month: 'Sep', views: 1550, users: 50 },
      { month: 'Oct', views: 1700, users: 55 },
      { month: 'Nov', views: 1820, users: 60 },
      { month: 'Dec', views: 1950, users: 65 },
    ],
    topPersonas: ['performance_engineer', 'release_manager', 'production_support'],
  },
];

/**
 * Mock value realization KPIs for the EQIP Quality Platform.
 * @type {ValueRealizationKPI[]}
 */
const valueRealizationKPIs = [
  {
    id: 'vrk_001',
    name: 'Defect Detection Time Reduction',
    category: 'efficiency',
    baselineValue: 72,
    currentValue: 28,
    targetValue: 24,
    unit: 'hours',
    improvementPercent: 61.1,
    realizationPercent: 91.7,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Average time from defect introduction to detection. Platform-enabled automated testing and AI analysis have significantly reduced detection time from 72 hours to 28 hours.',
    trendData: [
      { quarter: 'Q1 2024', value: 55 },
      { quarter: 'Q2 2024', value: 42 },
      { quarter: 'Q3 2024', value: 35 },
      { quarter: 'Q4 2024', value: 28 },
    ],
    owner: 'Angela Martinez',
  },
  {
    id: 'vrk_002',
    name: 'Quality Gate Evaluation Time',
    category: 'velocity',
    baselineValue: 4.5,
    currentValue: 0.5,
    targetValue: 0.25,
    unit: 'hours',
    improvementPercent: 88.9,
    realizationPercent: 94.1,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Time required to evaluate all quality gate criteria for a release. Automated gate evaluation reduced manual effort from 4.5 hours to 30 minutes per release.',
    trendData: [
      { quarter: 'Q1 2024', value: 3.0 },
      { quarter: 'Q2 2024', value: 1.5 },
      { quarter: 'Q3 2024', value: 0.8 },
      { quarter: 'Q4 2024', value: 0.5 },
    ],
    owner: 'Jennifer Williams',
  },
  {
    id: 'vrk_003',
    name: 'Compliance Audit Preparation Time',
    category: 'compliance',
    baselineValue: 120,
    currentValue: 35,
    targetValue: 24,
    unit: 'hours',
    improvementPercent: 70.8,
    realizationPercent: 88.5,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Time required to prepare for a compliance audit including evidence collection, report generation, and documentation review. Centralized governance data reduced preparation from 120 hours to 35 hours.',
    trendData: [
      { quarter: 'Q1 2024', value: 85 },
      { quarter: 'Q2 2024', value: 62 },
      { quarter: 'Q3 2024', value: 48 },
      { quarter: 'Q4 2024', value: 35 },
    ],
    owner: 'Patricia Evans',
  },
  {
    id: 'vrk_004',
    name: 'Test Automation ROI',
    category: 'cost',
    baselineValue: 0,
    currentValue: 720000,
    targetValue: 900000,
    unit: 'currency',
    improvementPercent: 100.0,
    realizationPercent: 80.0,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Annual cost savings from test automation including reduced manual testing effort, faster regression cycles, and earlier defect detection. Platform automation intelligence drives continuous improvement.',
    trendData: [
      { quarter: 'Q1 2024', value: 120000 },
      { quarter: 'Q2 2024', value: 300000 },
      { quarter: 'Q3 2024', value: 510000 },
      { quarter: 'Q4 2024', value: 720000 },
    ],
    owner: 'Jennifer Williams',
  },
  {
    id: 'vrk_005',
    name: 'Release Velocity Improvement',
    category: 'velocity',
    baselineValue: 2.5,
    currentValue: 5.2,
    targetValue: 6.0,
    unit: 'count',
    improvementPercent: 108.0,
    realizationPercent: 77.1,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Average number of production deployments per application per month. Platform quality gates and automated validation enabled faster, more confident releases from 2.5 to 5.2 per month.',
    trendData: [
      { quarter: 'Q1 2024', value: 3.2 },
      { quarter: 'Q2 2024', value: 3.8 },
      { quarter: 'Q3 2024', value: 4.5 },
      { quarter: 'Q4 2024', value: 5.2 },
    ],
    owner: 'Amanda Garcia',
  },
  {
    id: 'vrk_006',
    name: 'Change Failure Rate Reduction',
    category: 'quality',
    baselineValue: 12.5,
    currentValue: 4.8,
    targetValue: 3.0,
    unit: 'percent',
    improvementPercent: 61.6,
    realizationPercent: 81.1,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Percentage of deployments that result in degraded service or require rollback. Platform quality gates and pre-deployment validation reduced change failure rate from 12.5% to 4.8%.',
    trendData: [
      { quarter: 'Q1 2024', value: 9.5 },
      { quarter: 'Q2 2024', value: 7.8 },
      { quarter: 'Q3 2024', value: 6.2 },
      { quarter: 'Q4 2024', value: 4.8 },
    ],
    owner: 'Angela Martinez',
  },
  {
    id: 'vrk_007',
    name: 'Mean Time to Recovery (MTTR)',
    category: 'quality',
    baselineValue: 4.5,
    currentValue: 2.3,
    targetValue: 1.5,
    unit: 'hours',
    improvementPercent: 48.9,
    realizationPercent: 73.3,
    status: MEASURE_STATUS.AT_RISK,
    description: 'Average time to recover from a production incident. Platform post-deployment monitoring and incident correlation capabilities reduced MTTR from 4.5 hours to 2.3 hours.',
    trendData: [
      { quarter: 'Q1 2024', value: 3.8 },
      { quarter: 'Q2 2024', value: 3.2 },
      { quarter: 'Q3 2024', value: 2.8 },
      { quarter: 'Q4 2024', value: 2.3 },
    ],
    owner: 'Karen Mitchell',
  },
  {
    id: 'vrk_008',
    name: 'Test Environment Utilization',
    category: 'efficiency',
    baselineValue: 45.0,
    currentValue: 78.5,
    targetValue: 85.0,
    unit: 'percent',
    improvementPercent: 74.4,
    realizationPercent: 83.8,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Percentage of available test environment capacity that is actively utilized. Platform environment management and conflict detection improved utilization from 45% to 78.5%.',
    trendData: [
      { quarter: 'Q1 2024', value: 55.0 },
      { quarter: 'Q2 2024', value: 62.0 },
      { quarter: 'Q3 2024', value: 70.0 },
      { quarter: 'Q4 2024', value: 78.5 },
    ],
    owner: 'Daniel Robinson',
  },
  {
    id: 'vrk_009',
    name: 'Regulatory Reporting Accuracy',
    category: 'compliance',
    baselineValue: 96.5,
    currentValue: 99.2,
    targetValue: 99.9,
    unit: 'percent',
    improvementPercent: 2.8,
    realizationPercent: 79.4,
    status: MEASURE_STATUS.AT_RISK,
    description: 'Accuracy rate of regulatory report submissions. Platform automated validation and data quality checks improved accuracy from 96.5% to 99.2%, approaching the 99.9% target.',
    trendData: [
      { quarter: 'Q1 2024', value: 97.2 },
      { quarter: 'Q2 2024', value: 97.8 },
      { quarter: 'Q3 2024', value: 98.5 },
      { quarter: 'Q4 2024', value: 99.2 },
    ],
    owner: 'Patricia Evans',
  },
  {
    id: 'vrk_010',
    name: 'Cross-Segment Visibility Score',
    category: 'efficiency',
    baselineValue: 25.0,
    currentValue: 88.2,
    targetValue: 95.0,
    unit: 'percent',
    improvementPercent: 252.8,
    realizationPercent: 90.3,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Percentage of quality metrics visible across organizational segments through the platform. Centralized dashboard and reporting increased cross-segment visibility from 25% to 88.2%.',
    trendData: [
      { quarter: 'Q1 2024', value: 48.0 },
      { quarter: 'Q2 2024', value: 62.0 },
      { quarter: 'Q3 2024', value: 75.0 },
      { quarter: 'Q4 2024', value: 88.2 },
    ],
    owner: 'Jennifer Williams',
  },
  {
    id: 'vrk_011',
    name: 'Risk Identification Lead Time',
    category: 'risk',
    baselineValue: 14,
    currentValue: 3,
    targetValue: 2,
    unit: 'days',
    improvementPercent: 78.6,
    realizationPercent: 91.7,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Average number of days before a release that quality risks are identified. AI-powered risk analysis and predictive insights reduced lead time from 14 days to 3 days.',
    trendData: [
      { quarter: 'Q1 2024', value: 10 },
      { quarter: 'Q2 2024', value: 7 },
      { quarter: 'Q3 2024', value: 5 },
      { quarter: 'Q4 2024', value: 3 },
    ],
    owner: 'Angela Martinez',
  },
  {
    id: 'vrk_012',
    name: 'Manual Testing Effort Reduction',
    category: 'cost',
    baselineValue: 2400,
    currentValue: 960,
    targetValue: 720,
    unit: 'hours',
    improvementPercent: 60.0,
    realizationPercent: 85.7,
    status: MEASURE_STATUS.ON_TRACK,
    description: 'Monthly hours spent on manual testing across all applications. Platform automation intelligence and test candidate identification reduced manual effort from 2,400 to 960 hours per month.',
    trendData: [
      { quarter: 'Q1 2024', value: 1800 },
      { quarter: 'Q2 2024', value: 1400 },
      { quarter: 'Q3 2024', value: 1150 },
      { quarter: 'Q4 2024', value: 960 },
    ],
    owner: 'Angela Martinez',
  },
];

/**
 * Mock adoption milestones for the EQIP Quality Platform.
 * @type {AdoptionMilestone[]}
 */
const adoptionMilestones = [
  {
    id: 'am_001',
    title: 'Platform Launch & Core User Onboarding',
    description: 'Initial platform launch with core quality engineering team onboarded including quality directors, QE managers, and senior quality engineers.',
    targetDate: '2024-01-31',
    achievedDate: '2024-01-28',
    status: 'achieved',
    completionPercent: 100,
    category: 'onboarding',
    owner: 'Jennifer Williams',
  },
  {
    id: 'am_002',
    title: 'Executive Dashboard & KPI Rollout',
    description: 'Executive dashboard with KPI scorecard, segment breakdowns, and risk distribution deployed and adopted by leadership team.',
    targetDate: '2024-02-28',
    achievedDate: '2024-02-25',
    status: 'achieved',
    completionPercent: 100,
    category: 'feature_rollout',
    owner: 'Angela Martinez',
  },
  {
    id: 'am_003',
    title: 'Quality Gate Framework Deployment',
    description: 'Quality gate framework with automated evaluation, waiver management, and release readiness tracking deployed across all segments.',
    targetDate: '2024-03-31',
    achievedDate: '2024-04-05',
    status: 'achieved',
    completionPercent: 100,
    category: 'feature_rollout',
    owner: 'Angela Martinez',
  },
  {
    id: 'am_004',
    title: 'CI/CD Integration Completion',
    description: 'All CI/CD pipeline integrations (Jenkins, Harness, Azure Pipelines) connected and syncing build, test, and deployment data.',
    targetDate: '2024-04-30',
    achievedDate: '2024-04-22',
    status: 'achieved',
    completionPercent: 100,
    category: 'integration',
    owner: 'Daniel Robinson',
  },
  {
    id: 'am_005',
    title: 'Compliance & Governance Module Launch',
    description: 'Compliance framework scoring, audit finding management, operating expectations, and governance procedures module deployed for compliance team.',
    targetDate: '2024-05-31',
    achievedDate: '2024-05-28',
    status: 'achieved',
    completionPercent: 100,
    category: 'feature_rollout',
    owner: 'Patricia Evans',
  },
  {
    id: 'am_006',
    title: 'Full Segment Leader Onboarding',
    description: 'All segment leaders (Enterprise, Medicare, Medicaid, Commercial, External, Compliance) onboarded with segment-specific dashboards and reports.',
    targetDate: '2024-06-30',
    achievedDate: '2024-06-18',
    status: 'achieved',
    completionPercent: 100,
    category: 'onboarding',
    owner: 'Jennifer Williams',
  },
  {
    id: 'am_007',
    title: 'AI Insights & Predictive Analytics Launch',
    description: 'AI-powered quality predictions, risk assessments, recommendations, and natural language search deployed for quality leadership.',
    targetDate: '2024-07-31',
    achievedDate: '2024-08-05',
    status: 'achieved',
    completionPercent: 100,
    category: 'feature_rollout',
    owner: 'Angela Martinez',
  },
  {
    id: 'am_008',
    title: 'Automation Intelligence Module Launch',
    description: 'Automation health scores, flaky test detection, automation candidate identification, and ROI projections deployed for automation team.',
    targetDate: '2024-08-31',
    achievedDate: '2024-08-28',
    status: 'achieved',
    completionPercent: 100,
    category: 'feature_rollout',
    owner: 'James Wright',
  },
  {
    id: 'am_009',
    title: 'External Partner Portal Access',
    description: 'Vendor partner access provisioned with limited dashboard views, integration status monitoring, and notification capabilities.',
    targetDate: '2024-09-30',
    achievedDate: '2024-10-08',
    status: 'achieved',
    completionPercent: 100,
    category: 'onboarding',
    owner: 'Alex Rivera',
  },
  {
    id: 'am_010',
    title: 'Post-Deployment Monitoring Module Launch',
    description: 'Production health metrics, release outcome tracking, incident correlation, and quality feedback loops deployed for operations team.',
    targetDate: '2024-10-31',
    achievedDate: '2024-10-25',
    status: 'achieved',
    completionPercent: 100,
    category: 'feature_rollout',
    owner: 'Karen Mitchell',
  },
  {
    id: 'am_011',
    title: 'AI Agent Workforce Deployment',
    description: 'AI agent workforce with governance policies, human-in-the-loop controls, and approval queues deployed for autonomous quality monitoring.',
    targetDate: '2024-11-30',
    achievedDate: '2024-11-22',
    status: 'achieved',
    completionPercent: 100,
    category: 'feature_rollout',
    owner: 'Angela Martinez',
  },
  {
    id: 'am_012',
    title: '85% Platform Adoption Rate',
    description: 'Achieve 85% adoption rate across all provisioned users with at least monthly active usage.',
    targetDate: '2024-12-31',
    achievedDate: '',
    status: 'on_track',
    completionPercent: 92,
    category: 'optimization',
    owner: 'Jennifer Williams',
  },
  {
    id: 'am_013',
    title: 'Developer Community Adoption (80%)',
    description: 'Achieve 80% adoption rate among developer personas with regular platform usage for quality gate status and test results.',
    targetDate: '2025-01-31',
    achievedDate: '',
    status: 'at_risk',
    completionPercent: 71,
    category: 'onboarding',
    owner: 'Robert Kim',
  },
  {
    id: 'am_014',
    title: 'Knowledge Graph & Traceability Launch',
    description: 'Full knowledge graph with requirement-to-code-to-test-to-defect traceability deployed for impact analysis and root cause investigation.',
    targetDate: '2025-02-28',
    achievedDate: '',
    status: 'on_track',
    completionPercent: 85,
    category: 'feature_rollout',
    owner: 'Angela Martinez',
  },
  {
    id: 'am_015',
    title: 'Full Value Realization (90% KPI Targets)',
    description: 'Achieve 90% or higher realization across all value realization KPIs demonstrating measurable business impact from platform adoption.',
    targetDate: '2025-06-30',
    achievedDate: '',
    status: 'on_track',
    completionPercent: 65,
    category: 'optimization',
    owner: 'Jennifer Williams',
  },
  {
    id: 'am_016',
    title: 'Advanced Training Program Completion',
    description: 'Complete advanced training program for all power users covering AI insights, automation intelligence, and knowledge graph features.',
    targetDate: '2025-03-31',
    achievedDate: '',
    status: 'upcoming',
    completionPercent: 30,
    category: 'training',
    owner: 'Angela Martinez',
  },
];

/**
 * Combined adoption data object.
 * @type {AdoptionData}
 */
const adoption = {
  platformUsageMetrics,
  userAdoptionRates,
  featureUtilizations,
  valueRealizationKPIs,
  adoptionMilestones,
};

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all adoption data.
 *
 * @returns {AdoptionData} The complete adoption data object
 */
export function getAllAdoptionData() {
  return {
    platformUsageMetrics: [...platformUsageMetrics],
    userAdoptionRates: [...userAdoptionRates],
    featureUtilizations: [...featureUtilizations],
    valueRealizationKPIs: [...valueRealizationKPIs],
    adoptionMilestones: [...adoptionMilestones],
  };
}

// ---------------------------------------------------------------------------
// Platform usage metric accessors
// ---------------------------------------------------------------------------

/**
 * Returns all platform usage metrics.
 *
 * @returns {PlatformUsageMetric[]} Array of all platform usage metric objects
 */
export function getAllPlatformUsageMetrics() {
  return [...platformUsageMetrics];
}

/**
 * Retrieves a single platform usage metric by its unique ID.
 *
 * @param {string} metricId - The metric identifier to look up
 * @returns {PlatformUsageMetric|null} The matching metric object, or null if not found
 */
export function getPlatformUsageMetricById(metricId) {
  if (!metricId || typeof metricId !== 'string') {
    return null;
  }
  return platformUsageMetrics.find((m) => m.id === metricId) || null;
}

/**
 * Returns all platform usage metrics filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {PlatformUsageMetric[]} Array of metrics matching the specified status
 */
export function getPlatformUsageMetricsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return platformUsageMetrics.filter((m) => m.status === status);
}

/**
 * Returns all platform usage metrics filtered by trend.
 *
 * @param {string} trend - The trend to filter by (e.g. 'improving', 'declining', 'stable')
 * @returns {PlatformUsageMetric[]} Array of metrics matching the specified trend
 */
export function getPlatformUsageMetricsByTrend(trend) {
  if (!trend || typeof trend !== 'string') {
    return [];
  }
  return platformUsageMetrics.filter((m) => m.trend === trend);
}

// ---------------------------------------------------------------------------
// User adoption rate accessors
// ---------------------------------------------------------------------------

/**
 * Returns all user adoption rates.
 *
 * @returns {UserAdoptionRate[]} Array of all user adoption rate objects
 */
export function getAllUserAdoptionRates() {
  return [...userAdoptionRates];
}

/**
 * Retrieves a single user adoption rate by its unique ID.
 *
 * @param {string} adoptionId - The adoption rate identifier to look up
 * @returns {UserAdoptionRate|null} The matching adoption rate object, or null if not found
 */
export function getUserAdoptionRateById(adoptionId) {
  if (!adoptionId || typeof adoptionId !== 'string') {
    return null;
  }
  return userAdoptionRates.find((u) => u.id === adoptionId) || null;
}

/**
 * Returns the user adoption rate for a specific persona.
 *
 * @param {string} personaId - The persona ID to filter by
 * @returns {UserAdoptionRate|null} The matching adoption rate object, or null if not found
 */
export function getUserAdoptionRateByPersona(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return null;
  }
  return userAdoptionRates.find((u) => u.personaId === personaId) || null;
}

/**
 * Returns all user adoption rates filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {UserAdoptionRate[]} Array of adoption rates matching the specified segment
 */
export function getUserAdoptionRatesBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return userAdoptionRates.filter((u) => u.segment === segment);
}

/**
 * Returns all user adoption rates filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {UserAdoptionRate[]} Array of adoption rates matching the specified status
 */
export function getUserAdoptionRatesByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return userAdoptionRates.filter((u) => u.status === status);
}

/**
 * Returns all user adoption rates filtered by trend.
 *
 * @param {string} trend - The trend to filter by (e.g. 'improving', 'declining', 'stable')
 * @returns {UserAdoptionRate[]} Array of adoption rates matching the specified trend
 */
export function getUserAdoptionRatesByTrend(trend) {
  if (!trend || typeof trend !== 'string') {
    return [];
  }
  return userAdoptionRates.filter((u) => u.trend === trend);
}

// ---------------------------------------------------------------------------
// Feature utilization accessors
// ---------------------------------------------------------------------------

/**
 * Returns all feature utilizations.
 *
 * @returns {FeatureUtilization[]} Array of all feature utilization objects
 */
export function getAllFeatureUtilizations() {
  return [...featureUtilizations];
}

/**
 * Retrieves a single feature utilization by its unique ID.
 *
 * @param {string} featureId - The feature utilization identifier to look up
 * @returns {FeatureUtilization|null} The matching feature utilization object, or null if not found
 */
export function getFeatureUtilizationById(featureId) {
  if (!featureId || typeof featureId !== 'string') {
    return null;
  }
  return featureUtilizations.find((f) => f.id === featureId) || null;
}

/**
 * Returns all feature utilizations filtered by category.
 *
 * @param {string} category - The category to filter by
 * @returns {FeatureUtilization[]} Array of feature utilizations matching the specified category
 */
export function getFeatureUtilizationsByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  return featureUtilizations.filter((f) => f.category === category);
}

/**
 * Returns all feature utilizations filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {FeatureUtilization[]} Array of feature utilizations matching the specified status
 */
export function getFeatureUtilizationsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return featureUtilizations.filter((f) => f.status === status);
}

/**
 * Returns all feature utilizations filtered by trend.
 *
 * @param {string} trend - The trend to filter by (e.g. 'improving', 'declining', 'stable')
 * @returns {FeatureUtilization[]} Array of feature utilizations matching the specified trend
 */
export function getFeatureUtilizationsByTrend(trend) {
  if (!trend || typeof trend !== 'string') {
    return [];
  }
  return featureUtilizations.filter((f) => f.trend === trend);
}

/**
 * Returns all feature utilizations sorted by utilization rate (highest first).
 *
 * @returns {FeatureUtilization[]} Array of feature utilizations sorted by utilization rate descending
 */
export function getFeatureUtilizationsByUtilizationRate() {
  return [...featureUtilizations].sort((a, b) => b.utilizationRate - a.utilizationRate);
}

/**
 * Returns all unique feature categories.
 *
 * @returns {string[]} Array of unique feature categories sorted alphabetically
 */
export function getAllFeatureCategories() {
  const categories = new Set(featureUtilizations.map((f) => f.category));
  return [...categories].sort();
}

// ---------------------------------------------------------------------------
// Value realization KPI accessors
// ---------------------------------------------------------------------------

/**
 * Returns all value realization KPIs.
 *
 * @returns {ValueRealizationKPI[]} Array of all value realization KPI objects
 */
export function getAllValueRealizationKPIs() {
  return [...valueRealizationKPIs];
}

/**
 * Retrieves a single value realization KPI by its unique ID.
 *
 * @param {string} kpiId - The KPI identifier to look up
 * @returns {ValueRealizationKPI|null} The matching KPI object, or null if not found
 */
export function getValueRealizationKPIById(kpiId) {
  if (!kpiId || typeof kpiId !== 'string') {
    return null;
  }
  return valueRealizationKPIs.find((k) => k.id === kpiId) || null;
}

/**
 * Returns all value realization KPIs filtered by category.
 *
 * @param {string} category - The category to filter by
 * @returns {ValueRealizationKPI[]} Array of KPIs matching the specified category
 */
export function getValueRealizationKPIsByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  return valueRealizationKPIs.filter((k) => k.category === category);
}

/**
 * Returns all value realization KPIs filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {ValueRealizationKPI[]} Array of KPIs matching the specified status
 */
export function getValueRealizationKPIsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return valueRealizationKPIs.filter((k) => k.status === status);
}

/**
 * Returns all value realization KPIs owned by a specific person.
 *
 * @param {string} owner - The owner name to filter by
 * @returns {ValueRealizationKPI[]} Array of KPIs owned by the specified person
 */
export function getValueRealizationKPIsByOwner(owner) {
  if (!owner || typeof owner !== 'string') {
    return [];
  }
  return valueRealizationKPIs.filter((k) => k.owner === owner);
}

/**
 * Returns all unique value realization KPI categories.
 *
 * @returns {string[]} Array of unique KPI categories sorted alphabetically
 */
export function getAllValueRealizationCategories() {
  const categories = new Set(valueRealizationKPIs.map((k) => k.category));
  return [...categories].sort();
}

// ---------------------------------------------------------------------------
// Adoption milestone accessors
// ---------------------------------------------------------------------------

/**
 * Returns all adoption milestones.
 *
 * @returns {AdoptionMilestone[]} Array of all adoption milestone objects
 */
export function getAllAdoptionMilestones() {
  return [...adoptionMilestones];
}

/**
 * Retrieves a single adoption milestone by its unique ID.
 *
 * @param {string} milestoneId - The milestone identifier to look up
 * @returns {AdoptionMilestone|null} The matching milestone object, or null if not found
 */
export function getAdoptionMilestoneById(milestoneId) {
  if (!milestoneId || typeof milestoneId !== 'string') {
    return null;
  }
  return adoptionMilestones.find((m) => m.id === milestoneId) || null;
}

/**
 * Returns all adoption milestones filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'achieved', 'on_track', 'at_risk', 'missed', 'upcoming')
 * @returns {AdoptionMilestone[]} Array of milestones matching the specified status
 */
export function getAdoptionMilestonesByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return adoptionMilestones.filter((m) => m.status === status);
}

/**
 * Returns all adoption milestones filtered by category.
 *
 * @param {string} category - The category to filter by (e.g. 'onboarding', 'feature_rollout', 'integration', 'training', 'optimization')
 * @returns {AdoptionMilestone[]} Array of milestones matching the specified category
 */
export function getAdoptionMilestonesByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  return adoptionMilestones.filter((m) => m.category === category);
}

/**
 * Returns all adoption milestones owned by a specific person.
 *
 * @param {string} owner - The owner name to filter by
 * @returns {AdoptionMilestone[]} Array of milestones owned by the specified person
 */
export function getAdoptionMilestonesByOwner(owner) {
  if (!owner || typeof owner !== 'string') {
    return [];
  }
  return adoptionMilestones.filter((m) => m.owner === owner);
}

/**
 * Returns all unique milestone categories.
 *
 * @returns {string[]} Array of unique milestone categories sorted alphabetically
 */
export function getAllMilestoneCategories() {
  const categories = new Set(adoptionMilestones.map((m) => m.category));
  return [...categories].sort();
}

/**
 * Returns all unique milestone statuses.
 *
 * @returns {string[]} Array of unique milestone statuses sorted alphabetically
 */
export function getAllMilestoneStatuses() {
  const statuses = new Set(adoptionMilestones.map((m) => m.status));
  return [...statuses].sort();
}

// ---------------------------------------------------------------------------
// Aggregate statistics
// ---------------------------------------------------------------------------

/**
 * Returns aggregate statistics across all adoption data.
 *
 * @returns {{ totalPlatformUsageMetrics: number, totalUserAdoptionRates: number, averageAdoptionRate: number, totalActiveUsers: number, totalProvisionedUsers: number, overallAdoptionRate: number, adoptionStatusBreakdown: Object<string, number>, totalFeatureUtilizations: number, averageUtilizationRate: number, featureStatusBreakdown: Object<string, number>, totalValueRealizationKPIs: number, averageRealizationPercent: number, kpiStatusBreakdown: Object<string, number>, kpiCategoryBreakdown: Object<string, number>, totalMilestones: number, achievedMilestones: number, milestoneStatusBreakdown: Object<string, number>, milestoneCategoryBreakdown: Object<string, number> }} Aggregate adoption statistics
 */
export function getAdoptionAggregates() {
  const totalPlatformUsageMetrics = platformUsageMetrics.length;

  const totalUserAdoptionRates = userAdoptionRates.length;
  const averageAdoptionRate =
    totalUserAdoptionRates > 0
      ? Math.round((userAdoptionRates.reduce((sum, u) => sum + u.adoptionRate, 0) / totalUserAdoptionRates) * 10) / 10
      : 0;

  const totalActiveUsers = userAdoptionRates.reduce((sum, u) => sum + u.activeUsers, 0);
  const totalProvisionedUsers = userAdoptionRates.reduce((sum, u) => sum + u.totalUsers, 0);
  const overallAdoptionRate =
    totalProvisionedUsers > 0
      ? Math.round((totalActiveUsers / totalProvisionedUsers) * 1000) / 10
      : 0;

  const adoptionStatusBreakdown = userAdoptionRates.reduce((acc, u) => {
    acc[u.status] = (acc[u.status] || 0) + 1;
    return acc;
  }, {});

  const totalFeatureUtilizations = featureUtilizations.length;
  const averageUtilizationRate =
    totalFeatureUtilizations > 0
      ? Math.round((featureUtilizations.reduce((sum, f) => sum + f.utilizationRate, 0) / totalFeatureUtilizations) * 10) / 10
      : 0;

  const featureStatusBreakdown = featureUtilizations.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const totalValueRealizationKPIs = valueRealizationKPIs.length;
  const averageRealizationPercent =
    totalValueRealizationKPIs > 0
      ? Math.round((valueRealizationKPIs.reduce((sum, k) => sum + k.realizationPercent, 0) / totalValueRealizationKPIs) * 10) / 10
      : 0;

  const kpiStatusBreakdown = valueRealizationKPIs.reduce((acc, k) => {
    acc[k.status] = (acc[k.status] || 0) + 1;
    return acc;
  }, {});

  const kpiCategoryBreakdown = valueRealizationKPIs.reduce((acc, k) => {
    acc[k.category] = (acc[k.category] || 0) + 1;
    return acc;
  }, {});

  const totalMilestones = adoptionMilestones.length;
  const achievedMilestones = adoptionMilestones.filter((m) => m.status === 'achieved').length;

  const milestoneStatusBreakdown = adoptionMilestones.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});

  const milestoneCategoryBreakdown = adoptionMilestones.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalPlatformUsageMetrics,
    totalUserAdoptionRates,
    averageAdoptionRate,
    totalActiveUsers,
    totalProvisionedUsers,
    overallAdoptionRate,
    adoptionStatusBreakdown,
    totalFeatureUtilizations,
    averageUtilizationRate,
    featureStatusBreakdown,
    totalValueRealizationKPIs,
    averageRealizationPercent,
    kpiStatusBreakdown,
    kpiCategoryBreakdown,
    totalMilestones,
    achievedMilestones,
    milestoneStatusBreakdown,
    milestoneCategoryBreakdown,
  };
}

export default adoption;