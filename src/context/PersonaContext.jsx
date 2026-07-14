import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPersonaById, getDefaultPersona, getAllPersonas } from '@/data/personas';
import { canPerformAction, getPermissionsForPersona, isReadOnly as checkIsReadOnly, hasApprovalAuthority, canExport } from '@/lib/permissions';
import { STORAGE_KEYS } from '@/lib/constants';
import { load, save, remove } from '@/lib/storage';

/**
 * @typedef {Object} PersonaContextValue
 * @property {import('@/data/personas').Persona} currentPersona - The currently selected persona
 * @property {string[]} permissions - Array of permission keys for the current persona
 * @property {boolean} isReadOnly - Whether the current persona has read-only access
 * @property {boolean} approvalAuthority - Whether the current persona has approval authority
 * @property {boolean} canExportData - Whether the current persona can export data
 * @property {function(string): void} setPersona - Sets the active persona by ID
 * @property {function(string): boolean} hasPermission - Checks if the current persona has a specific permission
 * @property {import('@/data/personas').Persona[]} allPersonas - All available personas
 */

const PersonaContext = createContext(null);

/**
 * Resolves the initial persona from localStorage or falls back to the default persona.
 *
 * @returns {import('@/data/personas').Persona} The resolved persona
 */
function resolveInitialPersona() {
  const storedPersonaId = load(STORAGE_KEYS.SELECTED_PERSONA, null);
  if (storedPersonaId && typeof storedPersonaId === 'string') {
    const persona = getPersonaById(storedPersonaId);
    if (persona) {
      return persona;
    }
  }
  return getDefaultPersona();
}

/**
 * PersonaProvider wraps the application and provides persona/role context
 * to all child components. Persists the selected persona to localStorage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 */
export function PersonaProvider({ children }) {
  const [currentPersona, setCurrentPersona] = useState(resolveInitialPersona);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(load(STORAGE_KEYS.AUTH_TOKEN, null))
  );

  const allPersonas = useMemo(() => getAllPersonas(), []);

  /**
   * Mock sign-in: activates the chosen persona and persists a fake session
   * token to localStorage. No backend — any password is accepted upstream.
   *
   * @param {string} personaId - The persona to sign in as
   * @returns {import('@/data/personas').Persona} The signed-in persona
   */
  const login = useCallback((personaId) => {
    const persona = getPersonaById(personaId) || getDefaultPersona();
    setCurrentPersona(persona);
    save(STORAGE_KEYS.SELECTED_PERSONA, persona.id);
    save(STORAGE_KEYS.AUTH_TOKEN, { token: `eqip-mock-${persona.id}`, at: Date.now() });
    setIsAuthenticated(true);
    return persona;
  }, []);

  /**
   * Clears the mock session so the app returns to the login screen.
   *
   * @returns {void}
   */
  const logout = useCallback(() => {
    remove(STORAGE_KEYS.AUTH_TOKEN);
    setIsAuthenticated(false);
  }, []);

  const permissions = useMemo(
    () => getPermissionsForPersona(currentPersona.id),
    [currentPersona.id]
  );

  const isReadOnly = useMemo(
    () => checkIsReadOnly(currentPersona.id),
    [currentPersona.id]
  );

  const approvalAuthority = useMemo(
    () => hasApprovalAuthority(currentPersona.id),
    [currentPersona.id]
  );

  const canExportData = useMemo(
    () => canExport(currentPersona.id),
    [currentPersona.id]
  );

  const setPersona = useCallback(
    (personaId) => {
      if (!personaId || typeof personaId !== 'string') {
        return;
      }

      const persona = getPersonaById(personaId);
      if (!persona) {
        console.error(`[PersonaContext] Persona not found: "${personaId}"`);
        return;
      }

      setCurrentPersona(persona);
      save(STORAGE_KEYS.SELECTED_PERSONA, personaId);
    },
    []
  );

  const hasPermission = useCallback(
    (action) => {
      if (!action || typeof action !== 'string') {
        return false;
      }
      return canPerformAction(currentPersona.id, action);
    },
    [currentPersona.id]
  );

  useEffect(() => {
    save(STORAGE_KEYS.SELECTED_PERSONA, currentPersona.id);
  }, [currentPersona.id]);

  const value = useMemo(
    () => ({
      currentPersona,
      permissions,
      isReadOnly,
      approvalAuthority,
      canExportData,
      setPersona,
      hasPermission,
      allPersonas,
      isAuthenticated,
      login,
      logout,
    }),
    [currentPersona, permissions, isReadOnly, approvalAuthority, canExportData, setPersona, hasPermission, allPersonas, isAuthenticated, login, logout]
  );

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
}

PersonaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the persona context.
 * Must be used within a PersonaProvider.
 *
 * @returns {PersonaContextValue} The persona context value
 * @throws {Error} If used outside of a PersonaProvider
 */
export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === null) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}

export default PersonaContext;