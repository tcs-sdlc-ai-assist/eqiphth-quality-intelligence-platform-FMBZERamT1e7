/**
 * Mock data for the Bugs / Defects Overview page (frontend-only, mirrors the
 * provided design reference). Total counts reconcile exactly across every
 * breakdown so the KPI strip, charts, and per-application tables all agree.
 * @module data/defects
 */

// ---------------------------------------------------------------------------
// KPI strip
// ---------------------------------------------------------------------------
export const DEFECT_KPIS = [
  { id: 'total', label: 'Total Defects', value: 1813, changePercent: 12, trend: 'up', changeLabel: 'vs prev 30 days' },
  { id: 'open', label: 'Open Defects', value: 515, changePercent: 8, trend: 'up', changeLabel: 'vs prev 30 days' },
  { id: 'in_progress', label: 'In Progress', value: 328, changePercent: 5, trend: 'up', changeLabel: 'vs prev 30 days' },
  { id: 'closed', label: 'Closed Defects', value: 1205, changePercent: 15, trend: 'up', changeLabel: 'vs prev 30 days' },
  { id: 'reopened', label: 'Reopened Defects', value: 67, changePercent: -7, trend: 'down', changeLabel: 'vs prev 30 days' },
];

// ---------------------------------------------------------------------------
// Defects by Priority (donut, 1,813 total)
// ---------------------------------------------------------------------------
export const DEFECTS_BY_PRIORITY = [
  { name: 'Blocker', value: 25, pct: '1.4%', color: '#ef4444' },
  { name: 'Critical', value: 162, pct: '8.9%', color: '#f97316' },
  { name: 'High', value: 414, pct: '22.8%', color: '#3b82f6' },
  { name: 'Medium', value: 1150, pct: '63.4%', color: '#f59e0b' },
  { name: 'Low', value: 62, pct: '3.4%', color: '#16b364' },
  { name: 'None/Other', value: 0, pct: '0.0%', color: '#94a3b8' },
];

// ---------------------------------------------------------------------------
// Defects Aging (bar chart) — buckets sum to the 515 Open Defects KPI
// ---------------------------------------------------------------------------
export const DEFECTS_AGING = [
  { bucket: '1-5 Days', count: 60 },
  { bucket: '6-10 Days', count: 77 },
  { bucket: '11-30 Days', count: 163 },
  { bucket: '31+ Days', count: 215 },
];

// ---------------------------------------------------------------------------
// Defects by Type (donut, percent of 1,813 total)
// ---------------------------------------------------------------------------
export const DEFECTS_BY_TYPE = [
  { name: 'Functional', pct: 38.0, color: '#3b82f6' },
  { name: 'Data', pct: 17.6, color: '#16b364' },
  { name: 'UI / UX', pct: 12.8, color: '#8b5cf6' },
  { name: 'Performance', pct: 9.4, color: '#f59e0b' },
  { name: 'Integration', pct: 8.7, color: '#f97316' },
  { name: 'Security', pct: 6.2, color: '#ef4444' },
  { name: 'Other', pct: 7.3, color: '#94a3b8' },
];

// ---------------------------------------------------------------------------
// Top Applications by High/Critical/Blocker count
// ---------------------------------------------------------------------------
export const TOP_APPS_HIGH_CRITICAL = [
  { name: 'Member Portal', count: 96 },
  { name: 'Claims Platform', count: 89 },
  { name: 'Provider Portal', count: 59 },
  { name: 'Pharmacy Portal', count: 38 },
  { name: 'Clinical Platform', count: 28 },
];

// ---------------------------------------------------------------------------
// Defects by Source (donut)
// ---------------------------------------------------------------------------
export const DEFECTS_BY_SOURCE = [
  { name: 'Testing', value: 1065, pct: '58.7%', color: '#3b82f6' },
  { name: 'Production Monitoring', value: 332, pct: '18.3%', color: '#16b364' },
  { name: 'User Reported', value: 243, pct: '13.4%', color: '#f59e0b' },
  { name: 'Automated Detection', value: 122, pct: '6.7%', color: '#8b5cf6' },
  { name: 'Other', value: 51, pct: '2.9%', color: '#94a3b8' },
];

// ---------------------------------------------------------------------------
// Per-application defect breakdown (Priority tab) — base dataset every other
// tab derives its columns from, so totals always reconcile.
// ---------------------------------------------------------------------------
export const APP_DEFECT_ROWS = [
  { application: 'Member Portal', totalDefects: 318, blocker: 8, critical: 27, high: 83, medium: 186, low: 14, none: 0, openDefects: 112, status: 'in_progress' },
  { application: 'Claims Platform', totalDefects: 298, blocker: 7, critical: 25, high: 76, medium: 172, low: 18, none: 0, openDefects: 98, status: 'in_progress' },
  { application: 'Provider Portal', totalDefects: 252, blocker: 5, critical: 20, high: 60, medium: 155, low: 12, none: 0, openDefects: 76, status: 'open' },
  { application: 'Pharmacy Portal', totalDefects: 197, blocker: 3, critical: 16, high: 44, medium: 124, low: 10, none: 0, openDefects: 63, status: 'open' },
  { application: 'Clinical Platform', totalDefects: 142, blocker: 2, critical: 11, high: 30, medium: 92, low: 7, none: 0, openDefects: 45, status: 'in_progress' },
  { application: 'Enrollment System', totalDefects: 118, blocker: 0, critical: 9, high: 27, medium: 74, low: 8, none: 0, openDefects: 37, status: 'in_progress' },
  { application: 'Benefits Administration', totalDefects: 96, blocker: 0, critical: 6, high: 21, medium: 60, low: 9, none: 0, openDefects: 28, status: 'open' },
  { application: 'Billing Platform', totalDefects: 64, blocker: 0, critical: 5, high: 15, medium: 37, low: 7, none: 0, openDefects: 18, status: 'resolved' },
  { application: 'Care Coordination', totalDefects: 45, blocker: 0, critical: 2, high: 10, medium: 28, low: 5, none: 0, openDefects: 12, status: 'resolved' },
  { application: 'Communication Hub', totalDefects: 31, blocker: 0, critical: 1, high: 6, medium: 19, low: 5, none: 0, openDefects: 8, status: 'resolved' },
  { application: 'Claims Processing Engine', totalDefects: 27, blocker: 0, critical: 2, high: 6, medium: 16, low: 3, none: 0, openDefects: 9, status: 'in_progress' },
  { application: 'Enterprise Data Warehouse', totalDefects: 24, blocker: 0, critical: 1, high: 5, medium: 15, low: 3, none: 0, openDefects: 7, status: 'open' },
  { application: 'Authentication Service', totalDefects: 22, blocker: 1, critical: 3, high: 5, medium: 11, low: 2, none: 0, openDefects: 10, status: 'in_progress' },
  { application: 'Provider Directory Service', totalDefects: 20, blocker: 0, critical: 1, high: 4, medium: 13, low: 2, none: 0, openDefects: 6, status: 'resolved' },
  { application: 'Notification Hub', totalDefects: 18, blocker: 0, critical: 0, high: 3, medium: 12, low: 3, none: 0, openDefects: 4, status: 'resolved' },
  { application: 'Star Ratings Analytics', totalDefects: 16, blocker: 0, critical: 1, high: 3, medium: 10, low: 2, none: 0, openDefects: 5, status: 'open' },
  { application: 'HEDIS Measure Engine', totalDefects: 15, blocker: 0, critical: 0, high: 3, medium: 9, low: 3, none: 0, openDefects: 4, status: 'resolved' },
  { application: 'Part D Formulary Manager', totalDefects: 13, blocker: 0, critical: 1, high: 2, medium: 8, low: 2, none: 0, openDefects: 5, status: 'in_progress' },
  { application: 'Medicaid Eligibility Engine', totalDefects: 12, blocker: 0, critical: 0, high: 2, medium: 8, low: 2, none: 0, openDefects: 3, status: 'resolved' },
  { application: 'State Regulatory Reporting', totalDefects: 10, blocker: 0, critical: 1, high: 2, medium: 6, low: 1, none: 0, openDefects: 4, status: 'open' },
  { application: 'Provider Network Management', totalDefects: 9, blocker: 0, critical: 0, high: 1, medium: 6, low: 2, none: 0, openDefects: 2, status: 'resolved' },
  { application: 'Group Enrollment Platform', totalDefects: 7, blocker: 0, critical: 0, high: 1, medium: 5, low: 1, none: 0, openDefects: 2, status: 'resolved' },
  { application: 'Individual Marketplace', totalDefects: 5, blocker: 0, critical: 0, high: 1, medium: 3, low: 1, none: 0, openDefects: 1, status: 'resolved' },
  { application: 'Broker Portal', totalDefects: 4, blocker: 0, critical: 0, high: 0, medium: 3, low: 1, none: 0, openDefects: 1, status: 'resolved' },
];

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

/**
 * Distributes a total across weighted buckets, forcing the last bucket to
 * absorb any rounding remainder so the sum always equals `total` exactly.
 *
 * @param {number} total - The value to distribute
 * @param {{ key: string, pct: number }[]} weights - Buckets with their share of the total (should sum to ~1)
 * @returns {Object<string, number>} Bucket key → whole-number value
 */
function distribute(total, weights) {
  const result = {};
  let used = 0;
  weights.forEach((w, i) => {
    if (i === weights.length - 1) {
      result[w.key] = Math.max(0, total - used);
      return;
    }
    const v = Math.max(0, Math.round(total * w.pct));
    result[w.key] = v;
    used += v;
  });
  return result;
}

/**
 * Regroups each row's Blocker/Critical/High/Medium/Low/None columns into
 * Sev1-Sev4 severity buckets. Exact — no re-derivation needed.
 *
 * @returns {object[]} Rows augmented with sev1-sev4 fields
 */
export function withSeverityBreakdown() {
  return APP_DEFECT_ROWS.map((row) => ({
    ...row,
    sev1: row.blocker + row.critical,
    sev2: row.high,
    sev3: row.medium,
    sev4: row.low + row.none,
  }));
}

const ENV_WEIGHTS = [
  { key: 'prod', pct: 0.12 },
  { key: 'uat', pct: 0.18 },
  { key: 'qa', pct: 0.38 },
  { key: 'dev', pct: 0.22 },
  { key: 'sit', pct: 0.1 },
];

/**
 * Distributes each row's total defects across environments.
 *
 * @returns {object[]} Rows augmented with prod/uat/qa/dev/sit fields
 */
export function withEnvironmentBreakdown() {
  return APP_DEFECT_ROWS.map((row) => ({ ...row, ...distribute(row.totalDefects, ENV_WEIGHTS) }));
}

const OPEN_SPLIT_WEIGHTS = [
  { key: 'openOnly', pct: 120 / 515 },
  { key: 'reopened', pct: 67 / 515 },
  { key: 'inProgress', pct: 328 / 515 },
];

/**
 * Splits each row into Closed / Open / In Progress / Reopened counts that
 * reconcile exactly with totalDefects and openDefects.
 *
 * @returns {object[]} Rows augmented with closedCount/openOnly/inProgressCount/reopenedCount
 */
export function withStatusBreakdown() {
  return APP_DEFECT_ROWS.map((row) => {
    const split = distribute(row.openDefects, OPEN_SPLIT_WEIGHTS);
    return {
      ...row,
      closedCount: row.totalDefects - row.openDefects,
      openOnly: split.openOnly,
      inProgressCount: split.inProgress,
      reopenedCount: split.reopened,
    };
  });
}

const ISSUE_TYPE_WEIGHTS = [
  { key: 'functional', pct: 0.38 },
  { key: 'data', pct: 0.176 },
  { key: 'uiUx', pct: 0.128 },
  { key: 'performance', pct: 0.094 },
  { key: 'integration', pct: 0.087 },
  { key: 'security', pct: 0.062 },
  { key: 'other', pct: 0.073 },
];

/**
 * Distributes each row's total defects across issue types.
 *
 * @returns {object[]} Rows augmented with functional/data/uiUx/performance/integration/security/other fields
 */
export function withIssueTypeBreakdown() {
  return APP_DEFECT_ROWS.map((row) => ({ ...row, ...distribute(row.totalDefects, ISSUE_TYPE_WEIGHTS) }));
}

const AGING_WEIGHTS = [
  { key: 'age1to5', pct: 60 / 515 },
  { key: 'age6to10', pct: 77 / 515 },
  { key: 'age11to30', pct: 163 / 515 },
  { key: 'age31plus', pct: 215 / 515 },
];

/**
 * Distributes each row's open defects across aging buckets, plus a small
 * "leaked to production" indicator for the Aging/Leakage tab.
 *
 * @returns {object[]} Rows augmented with age1to5/age6to10/age11to30/age31plus/leakedToProd fields
 */
export function withAgingBreakdown() {
  return APP_DEFECT_ROWS.map((row) => ({
    ...row,
    ...distribute(row.openDefects, AGING_WEIGHTS),
    leakedToProd: Math.round(row.totalDefects * 0.05),
  }));
}

/**
 * Derives a synthetic test case count and defect-density ratios per row for
 * the Defect Density tab.
 *
 * @returns {object[]} Rows augmented with testCaseCount/densityPer1k/densityPerKloc fields
 */
export function withDensityBreakdown() {
  return APP_DEFECT_ROWS.map((row, i) => {
    const testCaseCount = Math.round(row.totalDefects * (7 + (i % 5)));
    const klocCount = Math.max(5, Math.round(testCaseCount / 22));
    return {
      ...row,
      testCaseCount,
      densityPer1k: Math.round((row.totalDefects / testCaseCount) * 1000 * 10) / 10,
      densityPerKloc: Math.round((row.totalDefects / klocCount) * 10) / 10,
    };
  });
}

export { STATUS_LABELS };
