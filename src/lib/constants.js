/**
 * Application-wide constants for the EQIP Quality Platform.
 * @module constants
 */

// ---------------------------------------------------------------------------
// Data version – mirrors VITE_MOCK_DATA_VERSION from .env
// ---------------------------------------------------------------------------
export const DATA_VERSION = import.meta.env.VITE_MOCK_DATA_VERSION || '1.0.0';

// ---------------------------------------------------------------------------
// App metadata
// ---------------------------------------------------------------------------
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'EQIP Quality Platform';

// ---------------------------------------------------------------------------
// Persona IDs
// ---------------------------------------------------------------------------
export const PERSONA_IDS = Object.freeze({
  QUALITY_DIRECTOR: 'quality_director',
  PRACTICE_MANAGER: 'practice_manager',
  CARE_COORDINATOR: 'care_coordinator',
  PROVIDER: 'provider',
  ANALYST: 'analyst',
  ADMIN: 'admin',
});

// ---------------------------------------------------------------------------
// Role names (display-friendly)
// ---------------------------------------------------------------------------
export const ROLE_NAMES = Object.freeze({
  [PERSONA_IDS.QUALITY_DIRECTOR]: 'Quality Director',
  [PERSONA_IDS.PRACTICE_MANAGER]: 'Practice Manager',
  [PERSONA_IDS.CARE_COORDINATOR]: 'Care Coordinator',
  [PERSONA_IDS.PROVIDER]: 'Provider',
  [PERSONA_IDS.ANALYST]: 'Analyst',
  [PERSONA_IDS.ADMIN]: 'Administrator',
});

// ---------------------------------------------------------------------------
// Permission action keys
// ---------------------------------------------------------------------------
export const PERMISSIONS = Object.freeze({
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_MEASURES: 'view_measures',
  EDIT_MEASURES: 'edit_measures',
  VIEW_PATIENTS: 'view_patients',
  EDIT_PATIENTS: 'edit_patients',
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_QUALITY_GATES: 'view_quality_gates',
  EDIT_QUALITY_GATES: 'edit_quality_gates',
  VIEW_NOTIFICATIONS: 'view_notifications',
  MANAGE_NOTIFICATIONS: 'manage_notifications',
});

// ---------------------------------------------------------------------------
// Route paths
// ---------------------------------------------------------------------------
export const ROUTES = Object.freeze({
  HOME: '/',
  DASHBOARD: '/dashboard',
  MEASURES: '/measures',
  MEASURE_DETAIL: '/measures/:measureId',
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/:patientId',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  LOGIN: '/login',
  NOT_FOUND: '*',
});

// ---------------------------------------------------------------------------
// localStorage / sessionStorage keys
// ---------------------------------------------------------------------------
export const STORAGE_KEYS = Object.freeze({
  AUTH_TOKEN: 'eqip_auth_token',
  USER_PROFILE: 'eqip_user_profile',
  SELECTED_PERSONA: 'eqip_selected_persona',
  THEME: 'eqip_theme',
  SIDEBAR_COLLAPSED: 'eqip_sidebar_collapsed',
  DATA_VERSION: 'eqip_data_version',
  FILTERS: 'eqip_filters',
  RECENT_SEARCHES: 'eqip_recent_searches',
});

// ---------------------------------------------------------------------------
// Notification types
// ---------------------------------------------------------------------------
export const NOTIFICATION_TYPES = Object.freeze({
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
});

// ---------------------------------------------------------------------------
// Status enums
// ---------------------------------------------------------------------------
export const MEASURE_STATUS = Object.freeze({
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  CRITICAL: 'critical',
  COMPLETED: 'completed',
  NOT_STARTED: 'not_started',
});

export const PATIENT_STATUS = Object.freeze({
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  PENDING: 'pending',
  EXCLUDED: 'excluded',
});

export const GAP_STATUS = Object.freeze({
  OPEN: 'open',
  CLOSED: 'closed',
  IN_PROGRESS: 'in_progress',
  DEFERRED: 'deferred',
});

// ---------------------------------------------------------------------------
// Quality gate types
// ---------------------------------------------------------------------------
export const QUALITY_GATE_TYPES = Object.freeze({
  THRESHOLD: 'threshold',
  TREND: 'trend',
  COMPLIANCE: 'compliance',
  BENCHMARK: 'benchmark',
});

// ---------------------------------------------------------------------------
// Status → display label mapping
// ---------------------------------------------------------------------------
export const STATUS_LABELS = Object.freeze({
  [MEASURE_STATUS.ON_TRACK]: 'On Track',
  [MEASURE_STATUS.AT_RISK]: 'At Risk',
  [MEASURE_STATUS.CRITICAL]: 'Critical',
  [MEASURE_STATUS.COMPLETED]: 'Completed',
  [MEASURE_STATUS.NOT_STARTED]: 'Not Started',
  [PATIENT_STATUS.COMPLIANT]: 'Compliant',
  [PATIENT_STATUS.NON_COMPLIANT]: 'Non-Compliant',
  [PATIENT_STATUS.PENDING]: 'Pending',
  [PATIENT_STATUS.EXCLUDED]: 'Excluded',
  [GAP_STATUS.OPEN]: 'Open',
  [GAP_STATUS.CLOSED]: 'Closed',
  [GAP_STATUS.IN_PROGRESS]: 'In Progress',
  [GAP_STATUS.DEFERRED]: 'Deferred',
});

// ---------------------------------------------------------------------------
// Status → color mapping (Tailwind class-friendly tokens)
// ---------------------------------------------------------------------------
export const STATUS_COLORS = Object.freeze({
  [MEASURE_STATUS.ON_TRACK]: 'success',
  [MEASURE_STATUS.AT_RISK]: 'warning',
  [MEASURE_STATUS.CRITICAL]: 'danger',
  [MEASURE_STATUS.COMPLETED]: 'info',
  [MEASURE_STATUS.NOT_STARTED]: 'neutral',
  [PATIENT_STATUS.COMPLIANT]: 'success',
  [PATIENT_STATUS.NON_COMPLIANT]: 'danger',
  [PATIENT_STATUS.PENDING]: 'warning',
  [PATIENT_STATUS.EXCLUDED]: 'neutral',
  [GAP_STATUS.OPEN]: 'danger',
  [GAP_STATUS.CLOSED]: 'success',
  [GAP_STATUS.IN_PROGRESS]: 'warning',
  [GAP_STATUS.DEFERRED]: 'neutral',
});

// ---------------------------------------------------------------------------
// Design token values (mirrors tailwind.config.js for JS usage)
// ---------------------------------------------------------------------------
export const DESIGN_TOKENS = Object.freeze({
  COLORS: Object.freeze({
    HUMANA_GREEN: '#16b364',
    NAVY: '#1e1a42',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#3b82f6',
  }),
  BORDER_RADIUS: Object.freeze({
    SM: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    FULL: '9999px',
  }),
  BREAKPOINTS: Object.freeze({
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  }),
  TRANSITION_DURATION: Object.freeze({
    FAST: 150,
    DEFAULT: 200,
    SLOW: 300,
  }),
});

// ---------------------------------------------------------------------------
// Pagination defaults
// ---------------------------------------------------------------------------
export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
});

// ---------------------------------------------------------------------------
// Date format strings (for date-fns)
// ---------------------------------------------------------------------------
export const DATE_FORMATS = Object.freeze({
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  SHORT: 'MM/dd/yyyy',
  MONTH_YEAR: 'MMMM yyyy',
});