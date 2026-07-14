import { PERSONA_IDS, PERMISSIONS } from '@/lib/constants';

/**
 * Role-based permission definitions.
 * Maps each persona ID to an object describing their allowed permissions
 * and capability flags.
 *
 * @type {Object<string, { permissions: string[], readOnly: boolean, approvalAuthority: boolean, canExport: boolean }>}
 */
const ROLE_PERMISSION_MAP = Object.freeze({
  [PERSONA_IDS.QUALITY_DIRECTOR]: {
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    readOnly: false,
    approvalAuthority: true,
    canExport: true,
  },
  [PERSONA_IDS.PRACTICE_MANAGER]: {
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    readOnly: false,
    approvalAuthority: false,
    canExport: true,
  },
  [PERSONA_IDS.CARE_COORDINATOR]: {
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    readOnly: false,
    approvalAuthority: false,
    canExport: false,
  },
  [PERSONA_IDS.PROVIDER]: {
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    readOnly: true,
    approvalAuthority: false,
    canExport: false,
  },
  [PERSONA_IDS.ANALYST]: {
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    readOnly: true,
    approvalAuthority: false,
    canExport: true,
  },
  [PERSONA_IDS.ADMIN]: {
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    readOnly: false,
    approvalAuthority: true,
    canExport: true,
  },
});

/**
 * Resolves the role definition for a given persona ID.
 * Returns null if the persona is not found.
 *
 * @param {string} personaId - The persona identifier
 * @returns {{ permissions: string[], readOnly: boolean, approvalAuthority: boolean, canExport: boolean } | null}
 */
function resolveRole(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return null;
  }
  return ROLE_PERMISSION_MAP[personaId] || null;
}

/**
 * Checks whether a persona is allowed to perform a specific action.
 *
 * @param {string} personaId - The persona identifier (e.g. 'quality_director')
 * @param {string} action - The permission action key (e.g. 'view_dashboard')
 * @returns {boolean} True if the persona has the specified permission
 */
export function canPerformAction(personaId, action) {
  const role = resolveRole(personaId);
  if (!role) {
    return false;
  }
  if (!action || typeof action !== 'string') {
    return false;
  }
  return role.permissions.includes(action);
}

/**
 * Returns the full list of permission keys granted to a persona.
 *
 * @param {string} personaId - The persona identifier
 * @returns {string[]} Array of permission key strings; empty array if persona not found
 */
export function getPermissionsForPersona(personaId) {
  const role = resolveRole(personaId);
  if (!role) {
    return [];
  }
  return [...role.permissions];
}

/**
 * Determines whether a persona has read-only access.
 * Read-only personas cannot create, edit, or approve resources.
 *
 * @param {string} personaId - The persona identifier
 * @returns {boolean} True if the persona is read-only
 */
export function isReadOnly(personaId) {
  const role = resolveRole(personaId);
  if (!role) {
    return true;
  }
  return role.readOnly;
}

/**
 * Determines whether a persona has approval authority.
 * Personas with approval authority can approve quality gates,
 * measures, and other reviewable items.
 *
 * @param {string} personaId - The persona identifier
 * @returns {boolean} True if the persona has approval authority
 */
export function hasApprovalAuthority(personaId) {
  const role = resolveRole(personaId);
  if (!role) {
    return false;
  }
  return role.approvalAuthority;
}

/**
 * Determines whether a persona is allowed to export data
 * (reports, CSV, JSON downloads).
 *
 * @param {string} personaId - The persona identifier
 * @returns {boolean} True if the persona can export data
 */
export function canExport(personaId) {
  const role = resolveRole(personaId);
  if (!role) {
    return false;
  }
  return role.canExport;
}

/**
 * Returns the complete role permission map.
 * Useful for debugging and administrative views.
 *
 * @returns {Object<string, { permissions: string[], readOnly: boolean, approvalAuthority: boolean, canExport: boolean }>}
 */
export function getRolePermissionMap() {
  return ROLE_PERMISSION_MAP;
}