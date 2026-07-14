import { PERSONA_IDS, PERMISSIONS } from '@/lib/constants';
import personas from '@/data/personas';

/**
 * Resolves the persona definition for a given persona ID.
 * Returns null if the persona is not found.
 *
 * @param {string} personaId - The persona identifier
 * @returns {import('@/data/personas').Persona | null}
 */
function resolvePersona(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return null;
  }
  return personas.find((p) => p.id === personaId) || null;
}

/**
 * Checks whether a persona is allowed to perform a specific action.
 *
 * @param {string} personaId - The persona identifier (e.g. 'quality_director')
 * @param {string} action - The permission action key (e.g. 'view_dashboard')
 * @returns {boolean} True if the persona has the specified permission
 */
export function canPerformAction(personaId, action) {
  const persona = resolvePersona(personaId);
  if (!persona) {
    return false;
  }
  if (!action || typeof action !== 'string') {
    return false;
  }
  return persona.permissions.includes(action);
}

/**
 * Returns the full list of permission keys granted to a persona.
 *
 * @param {string} personaId - The persona identifier
 * @returns {string[]} Array of permission key strings; empty array if persona not found
 */
export function getPermissionsForPersona(personaId) {
  const persona = resolvePersona(personaId);
  if (!persona) {
    return [];
  }
  return [...persona.permissions];
}

/**
 * Determines whether a persona has read-only access.
 * Read-only personas cannot create, edit, or approve resources.
 *
 * @param {string} personaId - The persona identifier
 * @returns {boolean} True if the persona is read-only
 */
export function isReadOnly(personaId) {
  const persona = resolvePersona(personaId);
  if (!persona) {
    return true;
  }
  const readOnlyRoles = [
    'scrum_master',
    'vendor_partner',
    'auditor',
    'read_only_user'
  ];
  return readOnlyRoles.includes(persona.id);
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
  const persona = resolvePersona(personaId);
  if (!persona) {
    return false;
  }
  const approvalRoles = [
    'executive_leadership',
    'segment_leader',
    'vp_qe',
    'avp_qe',
    'quality_director',
    'qe_manager',
    'product_owner',
    'release_manager',
    'program_manager',
    'application_owner',
    'environment_manager',
    'admin'
  ];
  return approvalRoles.includes(persona.id);
}

/**
 * Determines whether a persona is allowed to export data
 * (reports, CSV, JSON downloads).
 *
 * @param {string} personaId - The persona identifier
 * @returns {boolean} True if the persona can export data
 */
export function canExport(personaId) {
  const persona = resolvePersona(personaId);
  if (!persona) {
    return false;
  }
  const exportRoles = [
    'executive_leadership',
    'segment_leader',
    'vp_qe',
    'avp_qe',
    'quality_director',
    'qe_manager',
    'product_owner',
    'release_manager',
    'program_manager',
    'application_owner',
    'environment_manager',
    'test_data_engineer',
    'performance_engineer',
    'security_engineer',
    'auditor',
    'admin'
  ];
  return exportRoles.includes(persona.id);
}

/**
 * Returns the complete role permission map based on personas.js.
 * Useful for debugging and administrative views.
 *
 * @returns {Object<string, { permissions: string[], readOnly: boolean, approvalAuthority: boolean, canExport: boolean }>}
 */
export function getRolePermissionMap() {
  const map = {};
  for (const p of personas) {
    map[p.id] = {
      permissions: p.permissions,
      readOnly: isReadOnly(p.id),
      approvalAuthority: hasApprovalAuthority(p.id),
      canExport: canExport(p.id)
    };
  }
  return map;
}