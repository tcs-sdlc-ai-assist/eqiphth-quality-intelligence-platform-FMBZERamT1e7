import { MEASURE_STATUS } from '@/lib/constants';

/**
 * @typedef {Object} ModelMetadata
 * @property {string} id - Unique model identifier
 * @property {string} name - Display name of the model
 * @property {string} version - Model version string
 * @property {string} type - Model type (classification, regression, nlp, generative, anomaly_detection, recommendation)
 * @property {string} status - Model status (active, training, deprecated, evaluation)
 * @property {number} accuracy - Model accuracy percentage (0-100)
 * @property {string} lastTrained - Last training date in ISO format
 * @property {string} nextTraining - Next scheduled training date in ISO format
 * @property {string} owner - Name of the model owner
 * @property {string} description - Description of the model purpose
 * @property {string[]} inputFeatures - Array of input feature names
 * @property {string} trainingDataSize - Description of training data size
 * @property {number} inferenceTimeMs - Average inference time in milliseconds
 */

/**
 * @typedef {Object} Prediction
 * @property {string} id - Unique prediction identifier
 * @property {string} modelId - Reference to the model that generated this prediction
 * @property {string} type - Prediction type (quality_score, measure_rate, risk_level, compliance_score, defect_probability, performance_trend)
 * @property {string} target - Target entity (application ID, measure ID, segment name)
 * @property {string} targetName - Display name of the target entity
 * @property {number} predictedValue - Predicted value
 * @property {number} confidence - Prediction confidence percentage (0-100)
 * @property {string} timeframe - Prediction timeframe (next_month, next_quarter, next_6_months, next_year)
 * @property {string} generatedAt - Prediction generation timestamp in ISO format
 * @property {string} status - Prediction status using MEASURE_STATUS
 * @property {{ month: string, value: number }[]} trendData - Predicted trend data points
 * @property {string} explanation - Natural language explanation of the prediction
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} id - Unique recommendation identifier
 * @property {string} type - Recommendation type (action, improvement, risk_mitigation, optimization, compliance, resource_allocation)
 * @property {string} priority - Priority level (critical, high, medium, low)
 * @property {string} title - Display title of the recommendation
 * @property {string} description - Detailed description of the recommendation
 * @property {string} rationale - AI-generated rationale for the recommendation
 * @property {string} target - Target entity (application ID, segment name, process name)
 * @property {string} targetName - Display name of the target entity
 * @property {number} estimatedImpact - Estimated impact score (1-10)
 * @property {number} estimatedEffort - Estimated effort in story points
 * @property {number} confidence - Recommendation confidence percentage (0-100)
 * @property {string} generatedAt - Recommendation generation timestamp in ISO format
 * @property {string} status - Recommendation status (new, accepted, in_progress, completed, dismissed)
 * @property {string[]} relatedInsights - Array of related insight IDs
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {string} id - Unique risk assessment identifier
 * @property {string} entityType - Entity type (application, segment, release, integration, environment)
 * @property {string} entityId - Entity identifier
 * @property {string} entityName - Display name of the entity
 * @property {string} riskLevel - Assessed risk level (low, medium, high, critical)
 * @property {number} riskScore - Numeric risk score (0-100)
 * @property {string[]} riskFactors - Array of contributing risk factor descriptions
 * @property {string[]} mitigationSuggestions - Array of suggested mitigation actions
 * @property {number} confidence - Assessment confidence percentage (0-100)
 * @property {string} generatedAt - Assessment generation timestamp in ISO format
 * @property {{ factor: string, weight: number, score: number }[]} factorBreakdown - Detailed risk factor breakdown
 */

/**
 * @typedef {Object} NLSearchResult
 * @property {string} id - Unique search result identifier
 * @property {string} query - Natural language query string
 * @property {string} intent - Detected query intent (status_inquiry, metric_lookup, comparison, trend_analysis, root_cause, recommendation_request)
 * @property {{ id: string, type: string, name: string, relevanceScore: number, snippet: string }[]} results - Array of matched results
 * @property {string} summary - AI-generated summary of the search results
 * @property {number} confidence - Search confidence percentage (0-100)
 * @property {string} generatedAt - Search result generation timestamp in ISO format
 * @property {string[]} suggestedFollowUps - Array of suggested follow-up queries
 */

/**
 * @typedef {Object} GenerativeSummary
 * @property {string} id - Unique summary identifier
 * @property {string} type - Summary type (executive_briefing, segment_overview, application_health, incident_summary, compliance_status, release_readiness, weekly_digest)
 * @property {string} title - Display title of the summary
 * @property {string} content - AI-generated summary content
 * @property {string[]} keyPoints - Array of key takeaway points
 * @property {string[]} dataSourceIds - Array of data source identifiers used to generate the summary
 * @property {number} confidence - Summary confidence percentage (0-100)
 * @property {string} generatedAt - Summary generation timestamp in ISO format
 * @property {string} generatedFor - Persona ID or role the summary is tailored for
 * @property {string} timeframe - Summary timeframe (daily, weekly, monthly, quarterly)
 */

/**
 * @typedef {Object} AIInsightsData
 * @property {ModelMetadata[]} models - Array of AI model metadata
 * @property {Prediction[]} predictions - Array of AI predictions
 * @property {Recommendation[]} recommendations - Array of AI recommendations
 * @property {RiskAssessment[]} riskAssessments - Array of AI risk assessments
 * @property {NLSearchResult[]} nlSearchResults - Array of natural language search results
 * @property {GenerativeSummary[]} generativeSummaries - Array of generative summaries
 */

/**
 * Mock AI model metadata for the EQIP Quality Platform.
 * @type {ModelMetadata[]}
 */
const models = [
  {
    id: 'model_quality_predictor',
    name: 'Quality Score Predictor',
    version: '2.4.0',
    type: 'regression',
    status: 'active',
    accuracy: 91.3,
    lastTrained: '2024-12-01',
    nextTraining: '2025-01-01',
    owner: 'Angela Martinez',
    description: 'Predicts future quality scores for applications based on historical test results, defect trends, code coverage, and deployment frequency.',
    inputFeatures: ['test_pass_rate', 'defect_density', 'code_coverage', 'deployment_frequency', 'change_failure_rate', 'mttr', 'automation_coverage'],
    trainingDataSize: '24 months of quality metrics across 24 applications',
    inferenceTimeMs: 45,
  },
  {
    id: 'model_risk_classifier',
    name: 'Application Risk Classifier',
    version: '1.8.0',
    type: 'classification',
    status: 'active',
    accuracy: 88.7,
    lastTrained: '2024-11-15',
    nextTraining: '2025-01-15',
    owner: 'Patricia Evans',
    description: 'Classifies applications into risk levels (low, medium, high, critical) based on quality metrics, compliance status, incident history, and governance adherence.',
    inputFeatures: ['quality_score', 'compliance_rate', 'incident_count', 'governance_violations', 'test_coverage', 'open_defects', 'audit_findings'],
    trainingDataSize: '18 months of application risk data across 24 applications',
    inferenceTimeMs: 32,
  },
  {
    id: 'model_defect_predictor',
    name: 'Defect Probability Predictor',
    version: '1.5.0',
    type: 'classification',
    status: 'active',
    accuracy: 85.2,
    lastTrained: '2024-11-20',
    nextTraining: '2025-01-20',
    owner: 'Lisa Johnson',
    description: 'Predicts the probability of defects in upcoming releases based on code complexity, change volume, historical defect patterns, and test coverage gaps.',
    inputFeatures: ['code_complexity', 'lines_changed', 'files_changed', 'test_coverage_delta', 'historical_defect_rate', 'reviewer_count', 'time_since_last_release'],
    trainingDataSize: '12 months of release and defect data across 300+ releases',
    inferenceTimeMs: 28,
  },
  {
    id: 'model_measure_forecaster',
    name: 'HEDIS Measure Rate Forecaster',
    version: '3.1.0',
    type: 'regression',
    status: 'active',
    accuracy: 89.5,
    lastTrained: '2024-12-05',
    nextTraining: '2025-02-05',
    owner: 'Emily Davis',
    description: 'Forecasts HEDIS measure rates and Star Ratings outcomes based on current performance trends, gap closure rates, and supplemental data integration progress.',
    inputFeatures: ['current_measure_rate', 'gap_closure_rate', 'supplemental_data_linkage', 'member_outreach_rate', 'provider_engagement', 'historical_trend'],
    trainingDataSize: '36 months of HEDIS measure data across 48 measures',
    inferenceTimeMs: 62,
  },
  {
    id: 'model_nlp_search',
    name: 'Natural Language Search Engine',
    version: '2.0.0',
    type: 'nlp',
    status: 'active',
    accuracy: 92.8,
    lastTrained: '2024-12-08',
    nextTraining: '2025-02-08',
    owner: 'Samantha Clark',
    description: 'Processes natural language queries to search across quality metrics, test results, compliance data, and governance information with intent detection and entity extraction.',
    inputFeatures: ['query_text', 'user_context', 'persona_role', 'recent_interactions', 'active_filters'],
    trainingDataSize: '50,000 labeled query-result pairs from platform usage data',
    inferenceTimeMs: 120,
  },
  {
    id: 'model_summary_generator',
    name: 'Executive Summary Generator',
    version: '1.3.0',
    type: 'generative',
    status: 'active',
    accuracy: 87.4,
    lastTrained: '2024-12-10',
    nextTraining: '2025-02-10',
    owner: 'Jennifer Williams',
    description: 'Generates executive-level summaries, briefings, and digests from quality metrics, compliance data, and operational status across all segments.',
    inputFeatures: ['quality_metrics', 'compliance_scores', 'incident_data', 'release_status', 'audit_findings', 'demand_pipeline', 'environment_health'],
    trainingDataSize: '2,000 expert-written summaries paired with source data',
    inferenceTimeMs: 850,
  },
  {
    id: 'model_anomaly_detector',
    name: 'Quality Anomaly Detector',
    version: '1.2.0',
    type: 'anomaly_detection',
    status: 'active',
    accuracy: 86.1,
    lastTrained: '2024-11-25',
    nextTraining: '2025-01-25',
    owner: 'Marcus Thompson',
    description: 'Detects anomalous patterns in quality metrics, test execution results, and performance data that may indicate emerging issues or regressions.',
    inputFeatures: ['metric_time_series', 'deployment_events', 'configuration_changes', 'environment_health', 'test_execution_patterns'],
    trainingDataSize: '12 months of time-series quality data with 450 labeled anomalies',
    inferenceTimeMs: 55,
  },
  {
    id: 'model_recommendation_engine',
    name: 'Quality Improvement Recommender',
    version: '1.6.0',
    type: 'recommendation',
    status: 'active',
    accuracy: 84.9,
    lastTrained: '2024-12-03',
    nextTraining: '2025-02-03',
    owner: 'Angela Martinez',
    description: 'Generates prioritized recommendations for quality improvements based on current metrics, historical patterns, industry benchmarks, and organizational goals.',
    inputFeatures: ['current_metrics', 'historical_trends', 'benchmark_data', 'resource_availability', 'strategic_priorities', 'risk_profile'],
    trainingDataSize: '1,500 expert-validated recommendation-outcome pairs',
    inferenceTimeMs: 180,
  },
];

/**
 * Mock AI predictions for the EQIP Quality Platform.
 * @type {Prediction[]}
 */
const predictions = [
  {
    id: 'pred_001',
    modelId: 'model_quality_predictor',
    type: 'quality_score',
    target: 'app_hedis_engine',
    targetName: 'HEDIS Measure Engine',
    predictedValue: 88.2,
    confidence: 87,
    timeframe: 'next_quarter',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.AT_RISK,
    trendData: [
      { month: 'Jan', value: 85.5 },
      { month: 'Feb', value: 86.2 },
      { month: 'Mar', value: 88.2 },
    ],
    explanation: 'HEDIS Measure Engine quality score is predicted to improve from 84.5 to 88.2 over the next quarter, driven by the MY2025 specification updates (dem_002) and supplemental data integration (dem_033). However, the improvement is contingent on resolving the BCS and CDC measure specification non-compliance findings.',
  },
  {
    id: 'pred_002',
    modelId: 'model_quality_predictor',
    type: 'quality_score',
    target: 'app_partner_api_gateway',
    targetName: 'Partner API Gateway',
    predictedValue: 82.5,
    confidence: 83,
    timeframe: 'next_quarter',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.AT_RISK,
    trendData: [
      { month: 'Jan', value: 75.8 },
      { month: 'Feb', value: 79.1 },
      { month: 'Mar', value: 82.5 },
    ],
    explanation: 'Partner API Gateway quality score is predicted to improve from 72.3 to 82.5 over the next quarter if the performance optimization (dem_004), TLS 1.3 migration (dem_012), and OAuth 2.0 compliance update (dem_037) are completed on schedule. Current trajectory shows steady improvement.',
  },
  {
    id: 'pred_003',
    modelId: 'model_quality_predictor',
    type: 'quality_score',
    target: 'app_vendor_integration',
    targetName: 'Vendor Integration Hub',
    predictedValue: 78.4,
    confidence: 79,
    timeframe: 'next_quarter',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.AT_RISK,
    trendData: [
      { month: 'Jan', value: 69.2 },
      { month: 'Feb', value: 73.8 },
      { month: 'Mar', value: 78.4 },
    ],
    explanation: 'Vendor Integration Hub quality score is predicted to improve from 65.8 to 78.4 over the next quarter. The BAA compliance remediation (dem_028) and data reconciliation automation (dem_038) are key drivers. Risk remains elevated due to the high change failure rate and vendor dependency.',
  },
  {
    id: 'pred_004',
    modelId: 'model_quality_predictor',
    type: 'quality_score',
    target: 'app_medicaid_eligibility',
    targetName: 'Medicaid Eligibility Engine',
    predictedValue: 85.1,
    confidence: 85,
    timeframe: 'next_quarter',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.ON_TRACK,
    trendData: [
      { month: 'Jan', value: 81.2 },
      { month: 'Feb', value: 83.0 },
      { month: 'Mar', value: 85.1 },
    ],
    explanation: 'Medicaid Eligibility Engine quality score is predicted to improve from 79.8 to 85.1 over the next quarter. The rules engine refactor (dem_005) and income threshold fix are expected to resolve the primary quality issues. Multi-state configuration (dem_036) will further stabilize the system.',
  },
  {
    id: 'pred_005',
    modelId: 'model_measure_forecaster',
    type: 'measure_rate',
    target: 'app_star_ratings',
    targetName: 'Star Ratings - Overall Part C',
    predictedValue: 4.5,
    confidence: 82,
    timeframe: 'next_year',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.ON_TRACK,
    trendData: [
      { month: 'Q1', value: 4.0 },
      { month: 'Q2', value: 4.2 },
      { month: 'Q3', value: 4.3 },
      { month: 'Q4', value: 4.5 },
    ],
    explanation: 'Overall Part C Star Rating is predicted to improve from 4.0 to 4.5 stars over the next measurement year. Key drivers include HEDIS measure specification updates, supplemental data integration improvements, and the predictive analytics module enabling proactive intervention planning.',
  },
  {
    id: 'pred_006',
    modelId: 'model_quality_predictor',
    type: 'quality_score',
    target: 'seg_external',
    targetName: 'External Segment',
    predictedValue: 80.5,
    confidence: 78,
    timeframe: 'next_6_months',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.AT_RISK,
    trendData: [
      { month: 'Jan', value: 73.5 },
      { month: 'Feb', value: 75.2 },
      { month: 'Mar', value: 76.8 },
      { month: 'Apr', value: 78.1 },
      { month: 'May', value: 79.4 },
      { month: 'Jun', value: 80.5 },
    ],
    explanation: 'External segment quality score is predicted to improve from 72.1 to 80.5 over the next 6 months. This requires successful completion of API gateway performance optimization, vendor BAA compliance remediation, and data feed processing SLA improvements. The segment will likely transition from CRITICAL to AT_RISK status by Q1 2025.',
  },
  {
    id: 'pred_007',
    modelId: 'model_defect_predictor',
    type: 'defect_probability',
    target: 'app_hedis_engine',
    targetName: 'HEDIS Measure Engine - Next Release',
    predictedValue: 68.5,
    confidence: 84,
    timeframe: 'next_month',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.AT_RISK,
    trendData: [
      { month: 'Week 1', value: 72.0 },
      { month: 'Week 2', value: 70.5 },
      { month: 'Week 3', value: 69.0 },
      { month: 'Week 4', value: 68.5 },
    ],
    explanation: 'The next HEDIS Engine release has a 68.5% probability of containing defects based on the high code complexity of the MY2025 specification changes, the number of files being modified (142), and the current test coverage gap in exclusion logic. Recommend increasing code review depth and adding boundary value test cases.',
  },
  {
    id: 'pred_008',
    modelId: 'model_quality_predictor',
    type: 'compliance_score',
    target: 'cs_006',
    targetName: 'State Medicaid Compliance',
    predictedValue: 86.5,
    confidence: 81,
    timeframe: 'next_quarter',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.ON_TRACK,
    trendData: [
      { month: 'Jan', value: 81.2 },
      { month: 'Feb', value: 83.5 },
      { month: 'Mar', value: 86.5 },
    ],
    explanation: 'State Medicaid compliance score is predicted to improve from 79.8 to 86.5 over the next quarter. The state regulatory reporting automation (dem_013) and data accuracy remediation (dem_034) are expected to address the primary non-compliance areas in eligibility processing and state reporting.',
  },
  {
    id: 'pred_009',
    modelId: 'model_quality_predictor',
    type: 'performance_trend',
    target: 'app_claims_engine',
    targetName: 'Claims Processing Engine',
    predictedValue: 95.8,
    confidence: 92,
    timeframe: 'next_quarter',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.ON_TRACK,
    trendData: [
      { month: 'Jan', value: 94.5 },
      { month: 'Feb', value: 95.0 },
      { month: 'Mar', value: 95.8 },
    ],
    explanation: 'Claims Processing Engine quality score is predicted to remain stable and improve slightly from 94.2 to 95.8 over the next quarter. The real-time claims status dashboard (dem_001) will enhance operational visibility. Batch processing performance remains within SLA with healthy margin.',
  },
  {
    id: 'pred_010',
    modelId: 'model_quality_predictor',
    type: 'quality_score',
    target: 'seg_medicaid',
    targetName: 'Medicaid Segment',
    predictedValue: 83.8,
    confidence: 80,
    timeframe: 'next_quarter',
    generatedAt: '2024-12-12T10:00:00Z',
    status: MEASURE_STATUS.ON_TRACK,
    trendData: [
      { month: 'Jan', value: 79.8 },
      { month: 'Feb', value: 81.5 },
      { month: 'Mar', value: 83.8 },
    ],
    explanation: 'Medicaid segment quality score is predicted to improve from 78.4 to 83.8 over the next quarter, transitioning from AT_RISK to ON_TRACK status. Key improvements expected from eligibility rules engine refactor, state reporting automation, and care management outreach tracking fix.',
  },
];

/**
 * Mock AI recommendations for the EQIP Quality Platform.
 * @type {Recommendation[]}
 */
const recommendations = [
  {
    id: 'rec_001',
    type: 'risk_mitigation',
    priority: 'critical',
    title: 'Prioritize HEDIS Measure Specification Alignment',
    description: 'Immediately prioritize the alignment of BCS and CDC measure calculations with NCQA MY2024 technical specifications. The current non-compliance poses a risk to Star Ratings and CMS audit readiness.',
    rationale: 'Analysis of audit finding AF-001 and test execution failures (exec_008, exec_023) indicates that measure specification non-compliance affects 2 of the top 5 weighted Star Ratings measures. Delayed remediation could result in a 0.5-star rating decrease and potential CMS corrective action.',
    target: 'app_hedis_engine',
    targetName: 'HEDIS Measure Engine',
    estimatedImpact: 9,
    estimatedEffort: 34,
    confidence: 93,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'accepted',
    relatedInsights: ['pred_001', 'pred_005', 'risk_001'],
  },
  {
    id: 'rec_002',
    type: 'action',
    priority: 'critical',
    title: 'Enable OAuth 2.0 Scope Enforcement on API Gateway',
    description: 'Enable OAuth 2.0 scope enforcement on the partner API gateway immediately. The current configuration allows tokens with insufficient scopes to access protected resources, creating a critical security vulnerability.',
    rationale: 'Security test tc_035 confirmed that scope enforcement is disabled in the Kong OAuth plugin configuration. This violates SOC 2 and HIPAA security requirements. The fix is a configuration change with low implementation risk but high security impact.',
    target: 'app_partner_api_gateway',
    targetName: 'Partner API Gateway',
    estimatedImpact: 10,
    estimatedEffort: 3,
    confidence: 96,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'in_progress',
    relatedInsights: ['risk_003', 'pred_002'],
  },
  {
    id: 'rec_003',
    type: 'improvement',
    priority: 'high',
    title: 'Implement Automated Data Reconciliation for Vendor Feeds',
    description: 'Implement automated daily data reconciliation for all vendor data feeds with discrepancy detection, automated alerting, and reconciliation reporting dashboards to address the current governance non-compliance.',
    rationale: 'The vendor integration hub currently has no automated reconciliation process, resulting in data quality issues going undetected for days. Analysis shows that 3 out of 5 vendor feeds have had undetected discrepancies in the past 30 days, contributing to the 65.8 quality score.',
    target: 'app_vendor_integration',
    targetName: 'Vendor Integration Hub',
    estimatedImpact: 8,
    estimatedEffort: 13,
    confidence: 89,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'accepted',
    relatedInsights: ['pred_003', 'risk_004'],
  },
  {
    id: 'rec_004',
    type: 'optimization',
    priority: 'high',
    title: 'Optimize HEDIS Engine Performance with Parallel Processing',
    description: 'Implement parallel processing for independent sub-measures within CDC and CBP measures, and pre-cache value set lookups to reduce the HEDIS engine full population processing time from 4h 45m to under 3h 30m.',
    rationale: 'Performance test exec_009 shows CDC and CBP measures account for 40% of total processing time. Parallel processing of independent sub-measures and value set caching could reduce processing time by 30-40%, bringing it well within the 4-hour SLA.',
    target: 'app_hedis_engine',
    targetName: 'HEDIS Measure Engine',
    estimatedImpact: 7,
    estimatedEffort: 21,
    confidence: 85,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'new',
    relatedInsights: ['pred_001', 'pred_007'],
  },
  {
    id: 'rec_005',
    type: 'compliance',
    priority: 'critical',
    title: 'Remediate Vendor TLS 1.1 Acceptance and BAA Enforcement',
    description: 'Remove TLS 1.1 from allowed protocols and convert BAA validation from warning to blocking enforcement on the vendor integration hub to address critical security compliance gaps.',
    rationale: 'Audit findings AF-003 and AF-004 identify critical security compliance gaps. TLS 1.1 acceptance violates minimum encryption standards for PHI data exchange, and non-blocking BAA validation allows data exchange with vendors lacking active agreements. Both issues have regulatory implications.',
    target: 'app_vendor_integration',
    targetName: 'Vendor Integration Hub',
    estimatedImpact: 10,
    estimatedEffort: 8,
    confidence: 97,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'in_progress',
    relatedInsights: ['risk_004', 'pred_003'],
  },
  {
    id: 'rec_006',
    type: 'improvement',
    priority: 'high',
    title: 'Increase External Segment Test Automation Coverage',
    description: 'Increase automation coverage for External segment applications from 67.2% to at least 80% by automating the top 50 manual test cases for API gateway, vendor integration, and external data feed applications.',
    rationale: 'The External segment has the lowest automation coverage (67.2%) across all segments, contributing to its CRITICAL quality status. Analysis shows that 35% of test failures in this segment are detected late due to manual testing delays. Automating high-priority test cases would reduce detection time by 60%.',
    target: 'seg_external',
    targetName: 'External Segment',
    estimatedImpact: 7,
    estimatedEffort: 21,
    confidence: 88,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'new',
    relatedInsights: ['pred_006', 'risk_003'],
  },
  {
    id: 'rec_007',
    type: 'resource_allocation',
    priority: 'high',
    title: 'Allocate Additional QE Resources to Medicaid Segment',
    description: 'Allocate 2 additional quality engineers to the Medicaid segment to address the backlog of test automation, state reporting validation, and eligibility rules engine testing needs.',
    rationale: 'The Medicaid segment has 4 applications at AT_RISK status with the lowest quality score (78.4%) among non-External segments. Current QE capacity is insufficient to address the eligibility rules engine refactor, state reporting automation, and care management outreach tracking simultaneously.',
    target: 'seg_medicaid',
    targetName: 'Medicaid Segment',
    estimatedImpact: 8,
    estimatedEffort: 0,
    confidence: 82,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'new',
    relatedInsights: ['pred_010', 'risk_002'],
  },
  {
    id: 'rec_008',
    type: 'action',
    priority: 'medium',
    title: 'Update HEDIS Supplemental Data Crosswalk Table',
    description: 'Update the member ID crosswalk table to include all members enrolled within the last 90 days and implement a daily crosswalk refresh job to improve supplemental data linkage from 94.2% to above 98%.',
    rationale: 'Audit finding AF-014 and test execution exec_036 show that 2,340 supplemental data records cannot be linked to member records due to missing crosswalk entries for recently enrolled members. This directly impacts HEDIS measure rates and Star Ratings calculations.',
    target: 'app_hedis_engine',
    targetName: 'HEDIS Measure Engine',
    estimatedImpact: 6,
    estimatedEffort: 8,
    confidence: 91,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'accepted',
    relatedInsights: ['pred_001', 'pred_005'],
  },
  {
    id: 'rec_009',
    type: 'improvement',
    priority: 'medium',
    title: 'Implement Environment Health Monitoring Dashboard',
    description: 'Create a centralized environment health monitoring dashboard with automated alerting for health score degradation, conflict detection, and capacity planning across all 20 environments.',
    rationale: 'Analysis shows that 3 environments currently have health scores below 80% (Dev 4: 78.3%, QA External: 72.4%, Staging External: 45.2%) and 1 environment is completely down (QA Hotfix: 0%). Proactive monitoring would reduce environment-related test execution delays by an estimated 40%.',
    target: 'seg_enterprise',
    targetName: 'Enterprise Segment',
    estimatedImpact: 6,
    estimatedEffort: 13,
    confidence: 86,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'new',
    relatedInsights: ['risk_005'],
  },
  {
    id: 'rec_010',
    type: 'optimization',
    priority: 'medium',
    title: 'Optimize External Data Feed Processing Pipeline',
    description: 'Implement parallel file parsing and batch validation lookups in the external data feed processor to reduce processing time from 4h 30m to under 2h 30m for standard 100MB files.',
    rationale: 'Performance test exec_029 shows single-threaded file parsing and individual record validation lookups create I/O bottlenecks. Parallel processing with batch lookups could reduce processing time by 40-50%, bringing it well within the 4-hour SLA with margin for larger files.',
    target: 'app_external_data_feed',
    targetName: 'External Data Feed Processor',
    estimatedImpact: 5,
    estimatedEffort: 13,
    confidence: 86,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'new',
    relatedInsights: ['pred_006'],
  },
  {
    id: 'rec_011',
    type: 'compliance',
    priority: 'high',
    title: 'Address PCI DSS Monitoring and Security Policy Gaps',
    description: 'Remediate PCI DSS non-compliance in Monitoring & Testing (65.8%) and Security Policy (66.2%) domains by implementing continuous monitoring controls and updating security policy documentation.',
    rationale: 'PCI DSS compliance score is at 72.5% (CRITICAL status) with the next assessment due 2025-01-25. The Monitoring & Testing and Security Policy domains are the primary contributors to the low score. Failure to remediate before the next assessment could result in compliance certification loss.',
    target: 'cs_008',
    targetName: 'PCI DSS Compliance',
    estimatedImpact: 9,
    estimatedEffort: 21,
    confidence: 90,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'new',
    relatedInsights: ['risk_003'],
  },
  {
    id: 'rec_012',
    type: 'action',
    priority: 'medium',
    title: 'Fix Care Management Outreach Tracking Validation',
    description: 'Update the outreach form validation to require follow-up action for all outcome types, not just "contacted" outcomes. Add server-side validation as a secondary check and backfill missing follow-up actions.',
    rationale: 'Audit finding AF-007 and test execution exec_013 show that the outreach form does not enforce required follow-up action fields for non-contact outcomes (no_answer, voicemail), resulting in 87% field completion instead of the mandated 100%. This is a governance non-compliance issue.',
    target: 'app_care_management',
    targetName: 'Care Management Platform',
    estimatedImpact: 7,
    estimatedEffort: 5,
    confidence: 95,
    generatedAt: '2024-12-12T10:00:00Z',
    status: 'in_progress',
    relatedInsights: ['pred_010'],
  },
];

/**
 * Mock AI risk assessments for the EQIP Quality Platform.
 * @type {RiskAssessment[]}
 */
const riskAssessments = [
  {
    id: 'risk_001',
    entityType: 'application',
    entityId: 'app_hedis_engine',
    entityName: 'HEDIS Measure Engine',
    riskLevel: 'high',
    riskScore: 72,
    riskFactors: [
      'Measure specification non-compliance for BCS and CDC measures',
      'Performance SLA breach for full population calculation (4h 45m vs 4h target)',
      '3 critical defects in the current release',
      'Supplemental data linkage rate below 98% threshold at 94.2%',
      'High code complexity in measure calculation logic',
    ],
    mitigationSuggestions: [
      'Prioritize BCS exclusion logic fix to include ICD-10-PCS codes',
      'Update ESRD value set for CDC measure to include 2024 diagnosis codes',
      'Implement parallel processing for CDC and CBP sub-measures',
      'Update member ID crosswalk table for supplemental data linkage',
      'Increase unit test coverage for exclusion logic from 85.2% to 95%',
    ],
    confidence: 91,
    generatedAt: '2024-12-12T10:00:00Z',
    factorBreakdown: [
      { factor: 'Measure Specification Compliance', weight: 0.30, score: 35 },
      { factor: 'Performance SLA Compliance', weight: 0.20, score: 60 },
      { factor: 'Critical Defect Count', weight: 0.20, score: 40 },
      { factor: 'Data Integration Quality', weight: 0.15, score: 55 },
      { factor: 'Code Quality & Complexity', weight: 0.15, score: 65 },
    ],
  },
  {
    id: 'risk_002',
    entityType: 'segment',
    entityId: 'seg_medicaid',
    entityName: 'Medicaid Segment',
    riskLevel: 'high',
    riskScore: 68,
    riskFactors: [
      '4 applications at AT_RISK quality status',
      'State contract compliance non-compliance for eligibility processing',
      'State reporting data accuracy below 0.1% threshold',
      'Care management outreach tracking governance violation',
      'Lowest automation coverage among non-External segments at 75.7%',
    ],
    mitigationSuggestions: [
      'Accelerate Medicaid eligibility rules engine refactor (dem_005)',
      'Complete state regulatory reporting automation (dem_013)',
      'Fix care management outreach tracking validation (dem_030)',
      'Increase test automation coverage to 85% target',
      'Allocate additional QE resources for Medicaid segment testing',
    ],
    confidence: 87,
    generatedAt: '2024-12-12T10:00:00Z',
    factorBreakdown: [
      { factor: 'Application Quality Status', weight: 0.25, score: 45 },
      { factor: 'Compliance Rate', weight: 0.25, score: 55 },
      { factor: 'Test Automation Coverage', weight: 0.20, score: 60 },
      { factor: 'Governance Adherence', weight: 0.15, score: 50 },
      { factor: 'Incident Frequency', weight: 0.15, score: 55 },
    ],
  },
  {
    id: 'risk_003',
    entityType: 'segment',
    entityId: 'seg_external',
    entityName: 'External Segment',
    riskLevel: 'critical',
    riskScore: 82,
    riskFactors: [
      'Both applications at CRITICAL quality status',
      'API gateway OAuth scope enforcement disabled',
      'Vendor integration accepts deprecated TLS 1.1 connections',
      'BAA agreement enforcement not blocking non-compliant vendors',
      'Highest change failure rate across all segments at 9.8%',
      'Lowest automation coverage at 67.2%',
      'PCI DSS compliance at CRITICAL level (72.5%)',
    ],
    mitigationSuggestions: [
      'Enable OAuth 2.0 scope enforcement immediately (configuration change)',
      'Remove TLS 1.1 from allowed protocols',
      'Convert BAA validation to blocking enforcement',
      'Implement API gateway performance optimization (dem_004)',
      'Increase test automation coverage to 80% minimum',
      'Address PCI DSS Monitoring & Testing domain gaps',
    ],
    confidence: 94,
    generatedAt: '2024-12-12T10:00:00Z',
    factorBreakdown: [
      { factor: 'Security Compliance', weight: 0.30, score: 25 },
      { factor: 'Application Quality Status', weight: 0.20, score: 30 },
      { factor: 'Change Failure Rate', weight: 0.15, score: 20 },
      { factor: 'Test Automation Coverage', weight: 0.15, score: 40 },
      { factor: 'Performance SLA Compliance', weight: 0.10, score: 35 },
      { factor: 'Vendor Dependency Risk', weight: 0.10, score: 30 },
    ],
  },
  {
    id: 'risk_004',
    entityType: 'application',
    entityId: 'app_vendor_integration',
    entityName: 'Vendor Integration Hub',
    riskLevel: 'critical',
    riskScore: 85,
    riskFactors: [
      'Lowest quality score across all applications at 65.8',
      'TLS 1.1 connections accepted for PHI data exchange',
      'BAA agreement validation not enforced as blocking check',
      'Highest change failure rate at 12.5%',
      'Lowest automation coverage at 62.8%',
      'Data reconciliation not automated',
      '5 critical defects in current release',
    ],
    mitigationSuggestions: [
      'Implement encrypted data channel enforcement with TLS 1.2 minimum',
      'Convert BAA validation to blocking enforcement',
      'Implement automated daily data reconciliation',
      'Increase test automation coverage from 62.8% to 80%',
      'Implement error recovery automation for vendor data feeds',
      'Reduce change failure rate through improved testing and code review',
    ],
    confidence: 95,
    generatedAt: '2024-12-12T10:00:00Z',
    factorBreakdown: [
      { factor: 'Security Compliance', weight: 0.30, score: 15 },
      { factor: 'Quality Score', weight: 0.20, score: 20 },
      { factor: 'Change Failure Rate', weight: 0.15, score: 10 },
      { factor: 'Test Coverage', weight: 0.15, score: 25 },
      { factor: 'Data Quality', weight: 0.10, score: 30 },
      { factor: 'Operational Stability', weight: 0.10, score: 25 },
    ],
  },
  {
    id: 'risk_005',
    entityType: 'environment',
    entityId: 'env_qa_04',
    entityName: 'QA External Environment',
    riskLevel: 'high',
    riskScore: 70,
    riskFactors: [
      'Health score at 72.4% with degraded and unhealthy services',
      'Vendor Integration service unhealthy with 950ms response time',
      '2 active conflicts detected in conflict detection system',
      'External Data Feed service degraded with 520ms response time',
      'Environment supports critical External segment testing',
    ],
    mitigationSuggestions: [
      'Investigate and resolve Vendor Integration service health issues',
      'Resolve active conflicts between OAuth scope enforcement and vendor authentication',
      'Resolve CMS format validation conflict with file processing pipeline',
      'Consider provisioning a dedicated environment for External segment testing',
      'Implement automated environment health monitoring with alerting',
    ],
    confidence: 90,
    generatedAt: '2024-12-12T10:00:00Z',
    factorBreakdown: [
      { factor: 'Service Health', weight: 0.35, score: 35 },
      { factor: 'Active Conflicts', weight: 0.25, score: 30 },
      { factor: 'Testing Impact', weight: 0.20, score: 40 },
      { factor: 'Recovery Time', weight: 0.20, score: 50 },
    ],
  },
  {
    id: 'risk_006',
    entityType: 'application',
    entityId: 'app_state_reporting',
    entityName: 'State Regulatory Reporting',
    riskLevel: 'high',
    riskScore: 71,
    riskFactors: [
      'Quality score at 76.4 (AT_RISK status)',
      'Reporting deadline compliance at 85.0% (target: 100%)',
      'Data accuracy validation at 98.2% (target: 99.9%)',
      '2 governance rules non-compliant',
      'Automation coverage at 71.2% (below 80% target)',
    ],
    mitigationSuggestions: [
      'Complete state regulatory reporting automation (dem_013)',
      'Implement comprehensive data accuracy validation checks',
      'Update State B data extraction to include retroactive eligibility changes',
      'Increase test automation coverage to 85%',
      'Add automated submission deadline tracking with advance alerts',
    ],
    confidence: 88,
    generatedAt: '2024-12-12T10:00:00Z',
    factorBreakdown: [
      { factor: 'Reporting Timeliness', weight: 0.30, score: 30 },
      { factor: 'Data Accuracy', weight: 0.25, score: 35 },
      { factor: 'Governance Compliance', weight: 0.20, score: 25 },
      { factor: 'Test Coverage', weight: 0.15, score: 40 },
      { factor: 'Operational Stability', weight: 0.10, score: 45 },
    ],
  },
];

/**
 * Mock natural language search results for the EQIP Quality Platform.
 * @type {NLSearchResult[]}
 */
const nlSearchResults = [
  {
    id: 'nls_001',
    query: 'What is the current quality status of the HEDIS engine?',
    intent: 'status_inquiry',
    results: [
      { id: 'app_hedis_engine', type: 'application', name: 'HEDIS Measure Engine', relevanceScore: 98, snippet: 'Quality status: AT_RISK. Quality score: 84.5. Automation coverage: 82.1%. 3 critical defects in current release v4.6.0.' },
      { id: 'qg_009', type: 'quality_gate', name: 'HEDIS Engine v4.6.0 Release Gate', relevanceScore: 92, snippet: 'Quality gate FAILED. Measure specification accuracy at 96.8% (required: 100%). Performance SLA at 82.1% (required: 90%). 3 critical defects.' },
      { id: 'af_001', type: 'audit_finding', name: 'HEDIS Measure Specification Non-Compliance', relevanceScore: 88, snippet: 'Critical finding: BCS and CDC measure calculations do not fully align with NCQA MY2024 specifications. Status: In Progress.' },
    ],
    summary: 'The HEDIS Measure Engine is currently at AT_RISK status with a quality score of 84.5. The v4.6.0 release gate has failed due to measure specification non-compliance (BCS and CDC measures), performance SLA breach, and 3 critical defects. A critical audit finding (AF-001) is in progress for measure specification alignment.',
    confidence: 95,
    generatedAt: '2024-12-12T14:30:00Z',
    suggestedFollowUps: [
      'What are the specific BCS measure calculation issues?',
      'When is the HEDIS engine performance fix expected?',
      'Show me the HEDIS engine test failure details',
    ],
  },
  {
    id: 'nls_002',
    query: 'Which applications have critical security vulnerabilities?',
    intent: 'status_inquiry',
    results: [
      { id: 'app_partner_api_gateway', type: 'application', name: 'Partner API Gateway', relevanceScore: 96, snippet: 'OAuth 2.0 scope enforcement disabled. Tokens with insufficient scopes can access protected resources. Critical security finding AF-002.' },
      { id: 'app_vendor_integration', type: 'application', name: 'Vendor Integration Hub', relevanceScore: 94, snippet: 'Accepts deprecated TLS 1.1 connections for PHI data exchange. BAA agreement validation not enforced. Critical findings AF-003 and AF-004.' },
      { id: 'af_002', type: 'audit_finding', name: 'API Gateway OAuth Scope Enforcement Disabled', relevanceScore: 90, snippet: 'Critical severity. Status: In Progress. Scope enforcement middleware disabled in Kong OAuth plugin configuration.' },
      { id: 'af_003', type: 'audit_finding', name: 'Vendor Integration TLS 1.1 Acceptance', relevanceScore: 88, snippet: 'Critical severity. Status: Open. TLS 1.1 still in allowed protocols list, violating minimum TLS 1.2 requirement.' },
    ],
    summary: 'Two applications have critical security vulnerabilities: (1) Partner API Gateway has OAuth 2.0 scope enforcement disabled, allowing unauthorized access to protected resources. (2) Vendor Integration Hub accepts deprecated TLS 1.1 connections and does not enforce BAA agreements before PHI data exchange. Both issues have active audit findings and remediation is in progress.',
    confidence: 96,
    generatedAt: '2024-12-12T14:30:00Z',
    suggestedFollowUps: [
      'What is the timeline for fixing the OAuth scope enforcement?',
      'Which vendors are affected by the TLS 1.1 issue?',
      'Show me the PCI DSS compliance status',
    ],
  },
  {
    id: 'nls_003',
    query: 'Compare quality scores across all segments',
    intent: 'comparison',
    results: [
      { id: 'seg_compliance', type: 'segment', name: 'Compliance', relevanceScore: 95, snippet: 'Quality score: 93.2 (ON_TRACK). Highest quality score across all segments. 100% release readiness.' },
      { id: 'seg_enterprise', type: 'segment', name: 'Enterprise', relevanceScore: 94, snippet: 'Quality score: 88.5 (ON_TRACK). 6 applications with strong test coverage and compliance rates.' },
      { id: 'seg_medicare', type: 'segment', name: 'Medicare', relevanceScore: 93, snippet: 'Quality score: 91.3 (ON_TRACK). Strong compliance rate at 96.8%. HEDIS engine is the primary risk area.' },
      { id: 'seg_commercial', type: 'segment', name: 'Commercial', relevanceScore: 92, snippet: 'Quality score: 84.7 (ON_TRACK). 5 applications with 80% release readiness.' },
      { id: 'seg_medicaid', type: 'segment', name: 'Medicaid', relevanceScore: 91, snippet: 'Quality score: 78.4 (AT_RISK). 4 applications requiring attention. Lowest compliance rate among non-External segments.' },
      { id: 'seg_external', type: 'segment', name: 'External', relevanceScore: 90, snippet: 'Quality score: 72.1 (CRITICAL). Lowest quality score. 0% release readiness. Security compliance gaps.' },
    ],
    summary: 'Segment quality scores ranked from highest to lowest: Compliance (93.2), Medicare (91.3), Enterprise (88.5), Commercial (84.7), Medicaid (78.4), External (72.1). Four segments are ON_TRACK, Medicaid is AT_RISK, and External is CRITICAL. The overall platform quality score is 88.2 with an improving trend.',
    confidence: 98,
    generatedAt: '2024-12-12T14:30:00Z',
    suggestedFollowUps: [
      'Why is the External segment at critical status?',
      'What improvements are planned for the Medicaid segment?',
      'Show me the quality score trend over the past 12 months',
    ],
  },
  {
    id: 'nls_004',
    query: 'Why did the Medicaid eligibility determination test fail?',
    intent: 'root_cause',
    results: [
      { id: 'exec_010', type: 'test_execution', name: 'Medicaid Eligibility Determination Test', relevanceScore: 97, snippet: 'Failed: Applicant at 135% FPL incorrectly determined as ineligible. Income threshold comparison uses strict less-than instead of less-than-or-equal-to for 138% FPL cutoff.' },
      { id: 'tc_021', type: 'test_case', name: 'Verify Medicaid eligibility determination for new applicant', relevanceScore: 93, snippet: 'Critical priority functional test. Status: Failed. Income-based eligibility rules not applied correctly for boundary cases.' },
      { id: 'af_006', type: 'audit_finding', name: 'Medicaid Eligibility Income Threshold Comparison Error', relevanceScore: 90, snippet: 'Critical severity. Uses strict less-than operator instead of less-than-or-equal-to for 138% FPL cutoff.' },
    ],
    summary: 'The Medicaid eligibility determination test (tc_021) failed because the income threshold comparison logic uses a strict less-than operator (<) instead of less-than-or-equal-to (<=) for the 138% FPL cutoff. This causes applicants at exactly 135% FPL to be incorrectly evaluated against the wrong eligibility category due to a rounding issue in the FPL calculation. The fix involves updating the comparison operator and reviewing all state-specific FPL threshold configurations.',
    confidence: 93,
    generatedAt: '2024-12-12T14:30:00Z',
    suggestedFollowUps: [
      'How many members are affected by this eligibility error?',
      'What is the timeline for the eligibility fix?',
      'Are there similar issues in other state configurations?',
    ],
  },
  {
    id: 'nls_005',
    query: 'Show me the trend of automation coverage over the past year',
    intent: 'trend_analysis',
    results: [
      { id: 'trend_automation_coverage', type: 'trend_metric', name: 'Automation Coverage Trend', relevanceScore: 97, snippet: 'Automation coverage improved from 74.5% (Jan) to 83.7% (Dec), a 9.2 percentage point increase over 12 months.' },
      { id: 'kpi_automation_coverage', type: 'kpi', name: 'Automation Coverage KPI', relevanceScore: 92, snippet: 'Current: 83.7%. Previous: 80.2%. Change: +4.4%. Status: AT_RISK (target: 85.0%).' },
    ],
    summary: 'Automation coverage has improved steadily from 74.5% in January to 83.7% in December 2024, representing a 9.2 percentage point increase. The current rate is slightly below the 85% target, placing it at AT_RISK status. The improvement trend is consistent at approximately 0.8 percentage points per month. At this rate, the 85% target should be reached by February 2025.',
    confidence: 96,
    generatedAt: '2024-12-12T14:30:00Z',
    suggestedFollowUps: [
      'Which applications have the lowest automation coverage?',
      'What is blocking us from reaching the 85% target?',
      'Compare automation coverage by segment',
    ],
  },
  {
    id: 'nls_006',
    query: 'What actions should we take to improve the External segment?',
    intent: 'recommendation_request',
    results: [
      { id: 'rec_002', type: 'recommendation', name: 'Enable OAuth 2.0 Scope Enforcement', relevanceScore: 96, snippet: 'Critical priority. Enable scope enforcement on API gateway. Low effort (3 SP), high impact (10/10). Configuration change.' },
      { id: 'rec_005', type: 'recommendation', name: 'Remediate Vendor TLS and BAA Compliance', relevanceScore: 94, snippet: 'Critical priority. Remove TLS 1.1 and enforce BAA validation. Effort: 8 SP. Impact: 10/10.' },
      { id: 'rec_006', type: 'recommendation', name: 'Increase Test Automation Coverage', relevanceScore: 90, snippet: 'High priority. Increase from 67.2% to 80%. Automate top 50 manual test cases. Effort: 21 SP.' },
      { id: 'rec_003', type: 'recommendation', name: 'Implement Automated Data Reconciliation', relevanceScore: 88, snippet: 'High priority. Automate daily vendor data reconciliation. Effort: 13 SP. Impact: 8/10.' },
      { id: 'rec_010', type: 'recommendation', name: 'Optimize Data Feed Processing', relevanceScore: 85, snippet: 'Medium priority. Implement parallel processing for data feeds. Effort: 13 SP. Impact: 5/10.' },
    ],
    summary: 'To improve the External segment from CRITICAL to AT_RISK status, prioritize these actions: (1) Enable OAuth 2.0 scope enforcement on the API gateway — this is a low-effort configuration change with critical security impact. (2) Remediate vendor TLS 1.1 acceptance and BAA enforcement gaps. (3) Increase test automation coverage from 67.2% to 80%. (4) Implement automated daily data reconciliation for vendor feeds. (5) Optimize external data feed processing pipeline for SLA compliance.',
    confidence: 91,
    generatedAt: '2024-12-12T14:30:00Z',
    suggestedFollowUps: [
      'What is the estimated timeline for these improvements?',
      'How much QE resource is needed for the External segment?',
      'What is the predicted quality score after these changes?',
    ],
  },
];

/**
 * Mock generative summaries for the EQIP Quality Platform.
 * @type {GenerativeSummary[]}
 */
const generativeSummaries = [
  {
    id: 'summary_001',
    type: 'executive_briefing',
    title: 'Executive Quality Briefing - December 12, 2024',
    content: 'The EQIP Quality Platform overall quality score stands at 88.2%, reflecting a 3.0% improvement from the previous period. Of 24 applications, 16 are on track, 5 are at risk, and 2 are critical. The Compliance segment leads with a 93.2% quality score, while the External segment requires immediate attention at 72.1%. Key concerns include HEDIS measure specification non-compliance affecting Star Ratings, critical security vulnerabilities in the External segment, and Medicaid eligibility processing accuracy issues. Release readiness is at 62.5%, below the 90% target, primarily due to quality gate failures in External and Medicaid segments. Positive developments include successful AEP 2025 enrollment deployment, Member Portal v3.8.0 launch with 96.5% quality score, and Authentication Service maintaining 99.99% uptime.',
    keyPoints: [
      'Overall quality score: 88.2% (+3.0% improvement)',
      '16 applications on track, 5 at risk, 2 critical',
      'External segment at CRITICAL status requires immediate security remediation',
      'HEDIS measure specification non-compliance threatens Star Ratings',
      'Medicaid segment at AT_RISK with 4 applications needing attention',
      'Release readiness at 62.5% — below 90% target',
      'AEP 2025 enrollment and Member Portal v3.8.0 successfully deployed',
    ],
    dataSourceIds: ['kpi_quality_score', 'kpi_release_readiness', 'seg_enterprise', 'seg_medicare', 'seg_medicaid', 'seg_commercial', 'seg_external', 'seg_compliance'],
    confidence: 94,
    generatedAt: '2024-12-12T15:00:00Z',
    generatedFor: 'executive_leadership',
    timeframe: 'weekly',
  },
  {
    id: 'summary_002',
    type: 'segment_overview',
    title: 'Medicare Segment Quality Overview - December 2024',
    content: 'The Medicare segment maintains an ON_TRACK status with a quality score of 91.3% and compliance rate of 96.8%. Five applications are managed within this segment. The Medicare Enrollment System successfully deployed AEP 2025 rules (v6.4.0) with a 91.8% quality score. Star Ratings Analytics v3.2.0 passed all quality gates with CMS methodology alignment at 100%. However, the HEDIS Measure Engine remains at AT_RISK with a quality score of 84.5 due to BCS and CDC measure specification non-compliance and performance SLA breach. The Part D Formulary Manager and Benefits Administration applications are performing well with quality scores above 91%. Key priorities for the next quarter include completing HEDIS MY2025 specification updates, resolving supplemental data linkage issues, and implementing the Star Ratings predictive analytics module.',
    keyPoints: [
      'Medicare segment quality score: 91.3% (ON_TRACK)',
      'AEP 2025 enrollment rules successfully deployed',
      'Star Ratings v3.2.0 passed all quality gates',
      'HEDIS Engine at AT_RISK — measure specification non-compliance',
      'Part D Formulary and Benefits Admin performing well (>91%)',
      'Priority: Complete HEDIS MY2025 specification updates by Q1 2025',
    ],
    dataSourceIds: ['seg_medicare', 'app_medicare_enrollment', 'app_star_ratings', 'app_hedis_engine', 'app_part_d_formulary', 'app_benefits_admin'],
    confidence: 92,
    generatedAt: '2024-12-12T15:00:00Z',
    generatedFor: 'segment_leader',
    timeframe: 'monthly',
  },
  {
    id: 'summary_003',
    type: 'application_health',
    title: 'Partner API Gateway Health Assessment',
    content: 'The Partner API Gateway is at CRITICAL quality status with a quality score of 72.3%. The v1.7.0 release gate has failed across multiple criteria including unit test pass rate (92.0% vs 95% threshold), security test pass rate (86.0% vs 95% threshold), and OAuth 2.0 enforcement (78.5% vs 100% threshold). Four critical defects remain open. The most urgent issue is the disabled OAuth scope enforcement (AF-002), which allows tokens with insufficient scopes to access protected resources. Performance testing shows rate limiting allows 8.7% excess requests at window boundaries, and response times degrade to 2.3 seconds under sustained load. Active remediation efforts include the performance optimization demand (dem_004, target: 2025-01-15), TLS 1.3 migration (dem_012, target: 2025-02-15), and OAuth compliance update (dem_037, target: 2025-02-28). The quality score is predicted to improve to 82.5 by end of Q1 2025 if all remediation efforts are completed on schedule.',
    keyPoints: [
      'Quality status: CRITICAL (72.3%)',
      'v1.7.0 release gate failed across 6 of 7 criteria',
      'OAuth scope enforcement disabled — critical security vulnerability',
      'Rate limiting accuracy issue: 8.7% excess requests',
      'Response time degrades to 2.3s under load (target: <500ms)',
      'Predicted improvement to 82.5% by Q1 2025 with active remediation',
    ],
    dataSourceIds: ['app_partner_api_gateway', 'qg_021', 'af_002', 'af_008', 'dem_004', 'dem_012', 'dem_037'],
    confidence: 90,
    generatedAt: '2024-12-12T15:00:00Z',
    generatedFor: 'quality_director',
    timeframe: 'weekly',
  },
  {
    id: 'summary_004',
    type: 'compliance_status',
    title: 'Compliance Framework Status Summary - December 2024',
    content: 'Across 8 compliance frameworks, 6 are ON_TRACK, 1 is AT_RISK, and 1 is CRITICAL. The average compliance score is 88.1%. SOC 2 leads at 96.8% following a successful Type II annual audit. HIPAA compliance is strong at 94.5% with all PHI encryption requirements met. CMS compliance is at 91.2% with HEDIS reporting as the primary gap area. The State Medicaid framework is AT_RISK at 79.8% due to eligibility processing, state reporting, and member outreach non-compliance across multiple state contracts. PCI DSS is CRITICAL at 72.5% with Monitoring & Testing (65.8%) and Security Policy (66.2%) domains requiring immediate attention before the next assessment on 2025-01-25. There are 10 open audit findings: 4 critical, 5 high, and 1 medium severity. Three findings have been closed this quarter including the SOC 2 Type II audit, HIPAA PHI encryption audit, and Q4 disaster recovery test.',
    keyPoints: [
      '6 frameworks ON_TRACK, 1 AT_RISK, 1 CRITICAL',
      'Average compliance score: 88.1%',
      'SOC 2 Type II: 96.8% — annual audit passed',
      'State Medicaid: 79.8% (AT_RISK) — 3 non-compliant domains',
      'PCI DSS: 72.5% (CRITICAL) — next assessment 2025-01-25',
      '10 open audit findings (4 critical, 5 high, 1 medium)',
      '3 findings closed this quarter (SOC 2, HIPAA, DR test)',
    ],
    dataSourceIds: ['cs_001', 'cs_002', 'cs_003', 'cs_004', 'cs_005', 'cs_006', 'cs_007', 'cs_008'],
    confidence: 93,
    generatedAt: '2024-12-12T15:00:00Z',
    generatedFor: 'auditor',
    timeframe: 'monthly',
  },
  {
    id: 'summary_005',
    type: 'release_readiness',
    title: 'Release Readiness Assessment - December 2024',
    content: 'Overall release readiness is at 62.5%, with 20 of 32 quality gates passing. By segment: Compliance leads at 100% (4/4 gates passed), Commercial at 80% (4/5 gates passed), Enterprise at 83.3% (5/6 gates passed, Data Warehouse performance SLA failed), Medicare at 71.4% (5/7 gates passed, HEDIS Engine failed), Medicaid at 25% (1/4 gates passed), and External at 0% (0/3 gates passed). Eight quality gates have active waivers, with the most significant being the Member Portal accessibility waiver (expires 2025-01-15) and the API Gateway code coverage waiver (expires 2025-02-28). The primary blockers for release readiness improvement are: HEDIS measure specification non-compliance, Medicaid eligibility income threshold error, state reporting data accuracy issues, and External segment security vulnerabilities.',
    keyPoints: [
      'Overall release readiness: 62.5% (20/32 gates passed)',
      'Compliance: 100%, Commercial: 80%, Enterprise: 83.3%',
      'Medicare: 71.4%, Medicaid: 25%, External: 0%',
      '8 active quality gate waivers',
      'Key blockers: HEDIS specs, Medicaid eligibility, state reporting, External security',
      'Member Portal accessibility waiver expires 2025-01-15',
    ],
    dataSourceIds: ['qg_001', 'qg_002', 'qg_009', 'qg_012', 'qg_013', 'qg_014', 'qg_021', 'qg_022', 'qg_023'],
    confidence: 91,
    generatedAt: '2024-12-12T15:00:00Z',
    generatedFor: 'vp_qe',
    timeframe: 'weekly',
  },
  {
    id: 'summary_006',
    type: 'incident_summary',
    title: 'Environment and Infrastructure Status - December 12, 2024',
    content: 'Of 20 environments, 9 are available, 6 are reserved, 1 is under maintenance, and 1 is down. The QA Hotfix environment (env_qa_hotfix) has been offline since December 11 due to infrastructure failure with incident ticket INC-2024-1205 opened. The Staging External environment is under scheduled maintenance for TLS 1.3 infrastructure upgrades with expected completion at 18:00 UTC. The QA External environment has a degraded health score of 72.4% with the Vendor Integration service unhealthy (950ms response time) and 2 active conflicts. Production US-East is healthy at 99.4% with only the Vendor Integration service showing degradation (280ms response time). The Performance Testing environment is reserved for overnight testing by Marcus Thompson. All integration systems are operational except SAP Fieldglass, which has a certificate expiration error with 2 consecutive sync failures.',
    keyPoints: [
      '9 available, 6 reserved, 1 maintenance, 1 down environments',
      'QA Hotfix environment offline — incident INC-2024-1205',
      'Staging External under maintenance for TLS 1.3 upgrade',
      'QA External degraded (72.4%) with 2 active conflicts',
      'Production US-East healthy at 99.4%',
      'Fieldglass integration error: certificate expired',
    ],
    dataSourceIds: ['env_qa_hotfix', 'env_staging_external', 'env_qa_04', 'env_prod_01', 'int_fieldglass'],
    confidence: 95,
    generatedAt: '2024-12-12T15:00:00Z',
    generatedFor: 'environment_manager',
    timeframe: 'daily',
  },
  {
    id: 'summary_007',
    type: 'weekly_digest',
    title: 'Quality Engineering Weekly Digest - Week of December 9-12, 2024',
    content: 'This week saw 5 production deployments: Claims Engine v4.12.0 (94.2% quality score), Member Portal v3.8.0 (96.5%), Medicare Enrollment v6.4.0 (91.8%), Notification Hub v1.9.0 (95.4%), and Wellness Platform v2.1.0 (94.8%). All deployments passed quality gates, with the Member Portal receiving an accessibility waiver for 2 minor WCAG findings. Test execution highlights include 24 passed, 12 failed, 1 blocked, and 2 skipped test executions. Notable failures include HEDIS BCS measure calculation (exec_008), Medicaid eligibility determination (exec_010), and API gateway rate limiting (exec_014). The demand pipeline has 8 items in progress, 5 approved, and 18 completed. Key completions include the Broker Portal real-time quoting engine, Medicare Enrollment AEP 2025 rules, and the Compliance Dashboard risk heat map. Three new audit findings were identified and 2 were closed. The overall quality score improved from 87.6 to 88.2.',
    keyPoints: [
      '5 successful production deployments this week',
      '24 passed, 12 failed, 1 blocked, 2 skipped test executions',
      'Notable failures: HEDIS BCS, Medicaid eligibility, API gateway rate limiting',
      '8 demands in progress, 5 approved, 18 completed',
      '3 new audit findings identified, 2 closed',
      'Overall quality score improved from 87.6 to 88.2',
    ],
    dataSourceIds: ['rel_claims_034', 'rel_member_028', 'rel_medicare_026', 'rel_notif_012', 'rel_wellness_012'],
    confidence: 92,
    generatedAt: '2024-12-12T15:00:00Z',
    generatedFor: 'quality_director',
    timeframe: 'weekly',
  },
];

/**
 * Combined AI insights data object.
 * @type {AIInsightsData}
 */
const aiInsights = {
  models,
  predictions,
  recommendations,
  riskAssessments,
  nlSearchResults,
  generativeSummaries,
};

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all AI insights data.
 *
 * @returns {AIInsightsData} The complete AI insights data object
 */
export function getAllAIInsights() {
  return {
    models: [...models],
    predictions: [...predictions],
    recommendations: [...recommendations],
    riskAssessments: [...riskAssessments],
    nlSearchResults: [...nlSearchResults],
    generativeSummaries: [...generativeSummaries],
  };
}

// ---------------------------------------------------------------------------
// Model accessors
// ---------------------------------------------------------------------------

/**
 * Returns all AI model metadata.
 *
 * @returns {ModelMetadata[]} Array of all model metadata objects
 */
export function getAllModels() {
  return [...models];
}

/**
 * Retrieves a single model by its unique ID.
 *
 * @param {string} modelId - The model identifier to look up
 * @returns {ModelMetadata|null} The matching model object, or null if not found
 */
export function getModelById(modelId) {
  if (!modelId || typeof modelId !== 'string') {
    return null;
  }
  return models.find((m) => m.id === modelId) || null;
}

/**
 * Returns all models filtered by type.
 *
 * @param {string} type - The model type to filter by
 * @returns {ModelMetadata[]} Array of models matching the specified type
 */
export function getModelsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return models.filter((m) => m.type === type);
}

/**
 * Returns all models filtered by status.
 *
 * @param {string} status - The model status to filter by
 * @returns {ModelMetadata[]} Array of models matching the specified status
 */
export function getModelsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return models.filter((m) => m.status === status);
}

/**
 * Returns all unique model types.
 *
 * @returns {string[]} Array of unique model types sorted alphabetically
 */
export function getAllModelTypes() {
  const types = new Set(models.map((m) => m.type));
  return [...types].sort();
}

// ---------------------------------------------------------------------------
// Prediction accessors
// ---------------------------------------------------------------------------

/**
 * Returns all AI predictions.
 *
 * @returns {Prediction[]} Array of all prediction objects
 */
export function getAllPredictions() {
  return [...predictions];
}

/**
 * Retrieves a single prediction by its unique ID.
 *
 * @param {string} predictionId - The prediction identifier to look up
 * @returns {Prediction|null} The matching prediction object, or null if not found
 */
export function getPredictionById(predictionId) {
  if (!predictionId || typeof predictionId !== 'string') {
    return null;
  }
  return predictions.find((p) => p.id === predictionId) || null;
}

/**
 * Returns all predictions filtered by type.
 *
 * @param {string} type - The prediction type to filter by
 * @returns {Prediction[]} Array of predictions matching the specified type
 */
export function getPredictionsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return predictions.filter((p) => p.type === type);
}

/**
 * Returns all predictions for a specific target.
 *
 * @param {string} target - The target entity to filter by
 * @returns {Prediction[]} Array of predictions for the specified target
 */
export function getPredictionsByTarget(target) {
  if (!target || typeof target !== 'string') {
    return [];
  }
  return predictions.filter((p) => p.target === target);
}

/**
 * Returns all predictions filtered by timeframe.
 *
 * @param {string} timeframe - The timeframe to filter by
 * @returns {Prediction[]} Array of predictions matching the specified timeframe
 */
export function getPredictionsByTimeframe(timeframe) {
  if (!timeframe || typeof timeframe !== 'string') {
    return [];
  }
  return predictions.filter((p) => p.timeframe === timeframe);
}

/**
 * Returns all predictions filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {Prediction[]} Array of predictions matching the specified status
 */
export function getPredictionsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return predictions.filter((p) => p.status === status);
}

/**
 * Returns all unique prediction types.
 *
 * @returns {string[]} Array of unique prediction types sorted alphabetically
 */
export function getAllPredictionTypes() {
  const types = new Set(predictions.map((p) => p.type));
  return [...types].sort();
}

/**
 * Returns all unique prediction timeframes.
 *
 * @returns {string[]} Array of unique prediction timeframes sorted alphabetically
 */
export function getAllPredictionTimeframes() {
  const timeframes = new Set(predictions.map((p) => p.timeframe));
  return [...timeframes].sort();
}

// ---------------------------------------------------------------------------
// Recommendation accessors
// ---------------------------------------------------------------------------

/**
 * Returns all AI recommendations.
 *
 * @returns {Recommendation[]} Array of all recommendation objects
 */
export function getAllRecommendations() {
  return [...recommendations];
}

/**
 * Retrieves a single recommendation by its unique ID.
 *
 * @param {string} recommendationId - The recommendation identifier to look up
 * @returns {Recommendation|null} The matching recommendation object, or null if not found
 */
export function getRecommendationById(recommendationId) {
  if (!recommendationId || typeof recommendationId !== 'string') {
    return null;
  }
  return recommendations.find((r) => r.id === recommendationId) || null;
}

/**
 * Returns all recommendations filtered by type.
 *
 * @param {string} type - The recommendation type to filter by
 * @returns {Recommendation[]} Array of recommendations matching the specified type
 */
export function getRecommendationsByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return recommendations.filter((r) => r.type === type);
}

/**
 * Returns all recommendations filtered by priority.
 *
 * @param {string} priority - The priority to filter by
 * @returns {Recommendation[]} Array of recommendations matching the specified priority
 */
export function getRecommendationsByPriority(priority) {
  if (!priority || typeof priority !== 'string') {
    return [];
  }
  return recommendations.filter((r) => r.priority === priority);
}

/**
 * Returns all recommendations filtered by status.
 *
 * @param {string} status - The status to filter by
 * @returns {Recommendation[]} Array of recommendations matching the specified status
 */
export function getRecommendationsByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return recommendations.filter((r) => r.status === status);
}

/**
 * Returns all recommendations for a specific target.
 *
 * @param {string} target - The target entity to filter by
 * @returns {Recommendation[]} Array of recommendations for the specified target
 */
export function getRecommendationsByTarget(target) {
  if (!target || typeof target !== 'string') {
    return [];
  }
  return recommendations.filter((r) => r.target === target);
}

/**
 * Returns all unique recommendation types.
 *
 * @returns {string[]} Array of unique recommendation types sorted alphabetically
 */
export function getAllRecommendationTypes() {
  const types = new Set(recommendations.map((r) => r.type));
  return [...types].sort();
}

/**
 * Returns all unique recommendation statuses.
 *
 * @returns {string[]} Array of unique recommendation statuses sorted alphabetically
 */
export function getAllRecommendationStatuses() {
  const statuses = new Set(recommendations.map((r) => r.status));
  return [...statuses].sort();
}

/**
 * Returns all unique recommendation priorities.
 *
 * @returns {string[]} Array of unique recommendation priorities
 */
export function getAllRecommendationPriorities() {
  return ['critical', 'high', 'medium', 'low'];
}

// ---------------------------------------------------------------------------
// Risk assessment accessors
// ---------------------------------------------------------------------------

/**
 * Returns all AI risk assessments.
 *
 * @returns {RiskAssessment[]} Array of all risk assessment objects
 */
export function getAllRiskAssessments() {
  return [...riskAssessments];
}

/**
 * Retrieves a single risk assessment by its unique ID.
 *
 * @param {string} assessmentId - The risk assessment identifier to look up
 * @returns {RiskAssessment|null} The matching risk assessment object, or null if not found
 */
export function getRiskAssessmentById(assessmentId) {
  if (!assessmentId || typeof assessmentId !== 'string') {
    return null;
  }
  return riskAssessments.find((r) => r.id === assessmentId) || null;
}

/**
 * Returns all risk assessments filtered by entity type.
 *
 * @param {string} entityType - The entity type to filter by
 * @returns {RiskAssessment[]} Array of risk assessments matching the specified entity type
 */
export function getRiskAssessmentsByEntityType(entityType) {
  if (!entityType || typeof entityType !== 'string') {
    return [];
  }
  return riskAssessments.filter((r) => r.entityType === entityType);
}

/**
 * Returns all risk assessments filtered by risk level.
 *
 * @param {string} riskLevel - The risk level to filter by
 * @returns {RiskAssessment[]} Array of risk assessments matching the specified risk level
 */
export function getRiskAssessmentsByRiskLevel(riskLevel) {
  if (!riskLevel || typeof riskLevel !== 'string') {
    return [];
  }
  return riskAssessments.filter((r) => r.riskLevel === riskLevel);
}

/**
 * Returns all risk assessments for a specific entity.
 *
 * @param {string} entityId - The entity ID to filter by
 * @returns {RiskAssessment[]} Array of risk assessments for the specified entity
 */
export function getRiskAssessmentsByEntityId(entityId) {
  if (!entityId || typeof entityId !== 'string') {
    return [];
  }
  return riskAssessments.filter((r) => r.entityId === entityId);
}

/**
 * Returns all unique entity types across all risk assessments.
 *
 * @returns {string[]} Array of unique entity types sorted alphabetically
 */
export function getAllRiskAssessmentEntityTypes() {
  const types = new Set(riskAssessments.map((r) => r.entityType));
  return [...types].sort();
}

/**
 * Returns all unique risk levels across all risk assessments.
 *
 * @returns {string[]} Array of unique risk levels
 */
export function getAllRiskAssessmentLevels() {
  return ['low', 'medium', 'high', 'critical'];
}

// ---------------------------------------------------------------------------
// Natural language search result accessors
// ---------------------------------------------------------------------------

/**
 * Returns all natural language search results.
 *
 * @returns {NLSearchResult[]} Array of all NL search result objects
 */
export function getAllNLSearchResults() {
  return [...nlSearchResults];
}

/**
 * Retrieves a single NL search result by its unique ID.
 *
 * @param {string} searchId - The search result identifier to look up
 * @returns {NLSearchResult|null} The matching search result object, or null if not found
 */
export function getNLSearchResultById(searchId) {
  if (!searchId || typeof searchId !== 'string') {
    return null;
  }
  return nlSearchResults.find((s) => s.id === searchId) || null;
}

/**
 * Returns all NL search results filtered by intent.
 *
 * @param {string} intent - The query intent to filter by
 * @returns {NLSearchResult[]} Array of search results matching the specified intent
 */
export function getNLSearchResultsByIntent(intent) {
  if (!intent || typeof intent !== 'string') {
    return [];
  }
  return nlSearchResults.filter((s) => s.intent === intent);
}

/**
 * Returns all unique search intents.
 *
 * @returns {string[]} Array of unique search intents sorted alphabetically
 */
export function getAllSearchIntents() {
  const intents = new Set(nlSearchResults.map((s) => s.intent));
  return [...intents].sort();
}

// ---------------------------------------------------------------------------
// Generative summary accessors
// ---------------------------------------------------------------------------

/**
 * Returns all generative summaries.
 *
 * @returns {GenerativeSummary[]} Array of all generative summary objects
 */
export function getAllGenerativeSummaries() {
  return [...generativeSummaries];
}

/**
 * Retrieves a single generative summary by its unique ID.
 *
 * @param {string} summaryId - The summary identifier to look up
 * @returns {GenerativeSummary|null} The matching summary object, or null if not found
 */
export function getGenerativeSummaryById(summaryId) {
  if (!summaryId || typeof summaryId !== 'string') {
    return null;
  }
  return generativeSummaries.find((s) => s.id === summaryId) || null;
}

/**
 * Returns all generative summaries filtered by type.
 *
 * @param {string} type - The summary type to filter by
 * @returns {GenerativeSummary[]} Array of summaries matching the specified type
 */
export function getGenerativeSummariesByType(type) {
  if (!type || typeof type !== 'string') {
    return [];
  }
  return generativeSummaries.filter((s) => s.type === type);
}

/**
 * Returns all generative summaries for a specific persona.
 *
 * @param {string} personaId - The persona ID to filter by
 * @returns {GenerativeSummary[]} Array of summaries generated for the specified persona
 */
export function getGenerativeSummariesByPersona(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return [];
  }
  return generativeSummaries.filter((s) => s.generatedFor === personaId);
}

/**
 * Returns all generative summaries filtered by timeframe.
 *
 * @param {string} timeframe - The timeframe to filter by
 * @returns {GenerativeSummary[]} Array of summaries matching the specified timeframe
 */
export function getGenerativeSummariesByTimeframe(timeframe) {
  if (!timeframe || typeof timeframe !== 'string') {
    return [];
  }
  return generativeSummaries.filter((s) => s.timeframe === timeframe);
}

/**
 * Returns all unique summary types.
 *
 * @returns {string[]} Array of unique summary types sorted alphabetically
 */
export function getAllSummaryTypes() {
  const types = new Set(generativeSummaries.map((s) => s.type));
  return [...types].sort();
}

/**
 * Returns all unique summary timeframes.
 *
 * @returns {string[]} Array of unique summary timeframes sorted alphabetically
 */
export function getAllSummaryTimeframes() {
  const timeframes = new Set(generativeSummaries.map((s) => s.timeframe));
  return [...timeframes].sort();
}

// ---------------------------------------------------------------------------
// Aggregate statistics
// ---------------------------------------------------------------------------

/**
 * Returns aggregate statistics across all AI insights data.
 *
 * @returns {{ totalModels: number, activeModels: number, totalPredictions: number, averagePredictionConfidence: number, totalRecommendations: number, recommendationStatusBreakdown: Object<string, number>, recommendationPriorityBreakdown: Object<string, number>, totalRiskAssessments: number, riskLevelBreakdown: Object<string, number>, averageRiskScore: number, totalSearchResults: number, totalSummaries: number, averageModelAccuracy: number }} Aggregate AI insights statistics
 */
export function getAIInsightsAggregates() {
  const totalModels = models.length;
  const activeModels = models.filter((m) => m.status === 'active').length;

  const totalPredictions = predictions.length;
  const averagePredictionConfidence =
    totalPredictions > 0
      ? Math.round((predictions.reduce((sum, p) => sum + p.confidence, 0) / totalPredictions) * 10) / 10
      : 0;

  const totalRecommendations = recommendations.length;
  const recommendationStatusBreakdown = recommendations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const recommendationPriorityBreakdown = recommendations.reduce((acc, r) => {
    acc[r.priority] = (acc[r.priority] || 0) + 1;
    return acc;
  }, {});

  const totalRiskAssessments = riskAssessments.length;
  const riskLevelBreakdown = riskAssessments.reduce((acc, r) => {
    acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1;
    return acc;
  }, {});

  const averageRiskScore =
    totalRiskAssessments > 0
      ? Math.round((riskAssessments.reduce((sum, r) => sum + r.riskScore, 0) / totalRiskAssessments) * 10) / 10
      : 0;

  const totalSearchResults = nlSearchResults.length;
  const totalSummaries = generativeSummaries.length;

  const averageModelAccuracy =
    totalModels > 0
      ? Math.round((models.reduce((sum, m) => sum + m.accuracy, 0) / totalModels) * 10) / 10
      : 0;

  return {
    totalModels,
    activeModels,
    totalPredictions,
    averagePredictionConfidence,
    totalRecommendations,
    recommendationStatusBreakdown,
    recommendationPriorityBreakdown,
    totalRiskAssessments,
    riskLevelBreakdown,
    averageRiskScore,
    totalSearchResults,
    totalSummaries,
    averageModelAccuracy,
  };
}

export default aiInsights;