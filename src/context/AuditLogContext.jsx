import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePersona } from '@/context/PersonaContext';
import { getAllAuditLogs } from '@/data/auditLogs';
import { generateId } from '@/lib/utils';

/**
 * @typedef {Object} AuditLogEntry
 * @property {string} id - Unique audit log entry identifier
 * @property {string} eventType - Type of event (login, logout, data_access, data_export, config_change, permission_change, quality_gate_update, report_generated, schedule_change, environment_action, integration_sync, test_execution, demand_update, governance_update, notification_sent, user_management, persona_switch)
 * @property {string} personaId - Persona ID of the user who performed the action
 * @property {string} personaName - Display name of the user who performed the action
 * @property {string} action - Short action description
 * @property {string} details - Detailed description of the audit event
 * @property {string} timestamp - Event timestamp in ISO format
 * @property {string} ipAddress - Mock IP address of the client
 * @property {string} resource - The resource or entity affected (empty string if not applicable)
 * @property {string} outcome - Outcome of the action (success, failure, denied)
 * @property {string} segment - Organizational segment context (empty string if global)
 */

/**
 * @typedef {Object} AuditLogContextValue
 * @property {AuditLogEntry[]} auditLogs - All audit log entries
 * @property {function(string, Object): AuditLogEntry} logEvent - Logs a new audit event
 * @property {function(Object): AuditLogEntry[]} getAuditLogs - Returns filtered audit logs
 */

const AuditLogContext = createContext(null);

/**
 * AuditLogProvider wraps the application and provides simulated audit logging
 * capabilities. Automatically captures persona switches and provides methods
 * for logging sensitive actions and retrieving filtered audit logs.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 */
export function AuditLogProvider({ children }) {
  const { currentPersona } = usePersona();

  const [allAuditLogs, setAllAuditLogs] = useState(() => {
    return getAllAuditLogs();
  });

  const previousPersonaIdRef = useMemo(() => ({ current: currentPersona ? currentPersona.id : null }), []);

  const logEvent = useCallback(
    (eventType, details = {}) => {
      if (!eventType || typeof eventType !== 'string') {
        return null;
      }

      const persona = currentPersona || {};

      const newEntry = {
        id: generateId('audit'),
        eventType,
        personaId: details.personaId || persona.id || '',
        personaName: details.personaName || persona.name || '',
        action: details.action || '',
        details: details.details || '',
        timestamp: details.timestamp || new Date().toISOString(),
        ipAddress: details.ipAddress || '10.128.45.100',
        resource: details.resource || '',
        outcome: details.outcome || 'success',
        segment: details.segment || (persona.segment || ''),
      };

      setAllAuditLogs((prev) => [newEntry, ...prev]);

      return newEntry;
    },
    [currentPersona]
  );

  useEffect(() => {
    if (!currentPersona || !currentPersona.id) {
      return;
    }

    if (previousPersonaIdRef.current !== null && previousPersonaIdRef.current !== currentPersona.id) {
      const entry = {
        id: generateId('audit'),
        eventType: 'persona_switch',
        personaId: currentPersona.id,
        personaName: currentPersona.name || '',
        action: 'Persona Switched',
        details: `Persona switched from "${previousPersonaIdRef.current}" to "${currentPersona.id}" (${currentPersona.name || ''}, ${currentPersona.role || ''}).`,
        timestamp: new Date().toISOString(),
        ipAddress: '10.128.45.100',
        resource: '',
        outcome: 'success',
        segment: currentPersona.segment || '',
      };

      setAllAuditLogs((prev) => [entry, ...prev]);
    }

    previousPersonaIdRef.current = currentPersona.id;
  }, [currentPersona, previousPersonaIdRef]);

  const getAuditLogs = useCallback(
    (filters = {}) => {
      let results = allAuditLogs;

      if (filters.eventType && typeof filters.eventType === 'string') {
        results = results.filter((log) => log.eventType === filters.eventType);
      }

      if (filters.personaId && typeof filters.personaId === 'string') {
        results = results.filter((log) => log.personaId === filters.personaId);
      }

      if (filters.personaName && typeof filters.personaName === 'string') {
        results = results.filter((log) => log.personaName === filters.personaName);
      }

      if (filters.outcome && typeof filters.outcome === 'string') {
        results = results.filter((log) => log.outcome === filters.outcome);
      }

      if (filters.segment && typeof filters.segment === 'string') {
        results = results.filter((log) => log.segment === filters.segment);
      }

      if (filters.resource && typeof filters.resource === 'string') {
        results = results.filter((log) => log.resource === filters.resource);
      }

      if (filters.limit && typeof filters.limit === 'number' && filters.limit > 0) {
        results = results.slice(0, filters.limit);
      }

      return results;
    },
    [allAuditLogs]
  );

  const value = useMemo(
    () => ({
      auditLogs: allAuditLogs,
      logEvent,
      getAuditLogs,
    }),
    [allAuditLogs, logEvent, getAuditLogs]
  );

  return (
    <AuditLogContext.Provider value={value}>
      {children}
    </AuditLogContext.Provider>
  );
}

AuditLogProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the audit log context.
 * Must be used within an AuditLogProvider.
 *
 * @returns {AuditLogContextValue} The audit log context value
 * @throws {Error} If used outside of an AuditLogProvider
 */
export function useAuditLog() {
  const context = useContext(AuditLogContext);
  if (context === null) {
    throw new Error('useAuditLog must be used within an AuditLogProvider');
  }
  return context;
}

export default AuditLogContext;