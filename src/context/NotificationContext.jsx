import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePersona } from '@/context/PersonaContext';
import { getAllNotifications } from '@/data/notifications';

/**
 * @typedef {Object} NotificationContextValue
 * @property {import('@/data/notifications').Notification[]} notifications - Notifications for the current persona
 * @property {number} unreadCount - Number of unread notifications for the current persona
 * @property {function(string): void} markAsRead - Marks a single notification as read by ID
 * @property {function(): void} markAllRead - Marks all notifications for the current persona as read
 * @property {function(import('@/data/notifications').Notification): void} addNotification - Adds a new notification
 * @property {function(string): void} dismissNotification - Removes a notification by ID
 */

const NotificationContext = createContext(null);

/**
 * NotificationProvider wraps the application and provides notification state
 * scoped to the current persona. Notifications are filtered by persona ID
 * and support read/unread tracking, addition, and dismissal.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 */
export function NotificationProvider({ children }) {
  const { currentPersona } = usePersona();

  const [allNotifications, setAllNotifications] = useState(() => {
    return getAllNotifications();
  });

  const notifications = useMemo(() => {
    if (!currentPersona || !currentPersona.id) {
      return [];
    }
    return allNotifications.filter((n) => n.personaId === currentPersona.id);
  }, [allNotifications, currentPersona]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback(
    (notificationId) => {
      if (!notificationId || typeof notificationId !== 'string') {
        return;
      }
      setAllNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    },
    []
  );

  const markAllRead = useCallback(() => {
    if (!currentPersona || !currentPersona.id) {
      return;
    }
    setAllNotifications((prev) =>
      prev.map((n) =>
        n.personaId === currentPersona.id ? { ...n, read: true } : n
      )
    );
  }, [currentPersona]);

  const addNotification = useCallback(
    (notification) => {
      if (!notification || typeof notification !== 'object') {
        return;
      }
      const newNotification = {
        ...notification,
        id: notification.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        personaId: notification.personaId || (currentPersona ? currentPersona.id : ''),
        read: notification.read !== undefined ? notification.read : false,
        timestamp: notification.timestamp || new Date().toISOString(),
      };
      setAllNotifications((prev) => [newNotification, ...prev]);
    },
    [currentPersona]
  );

  const dismissNotification = useCallback(
    (notificationId) => {
      if (!notificationId || typeof notificationId !== 'string') {
        return;
      }
      setAllNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllRead,
      addNotification,
      dismissNotification,
    }),
    [notifications, unreadCount, markAsRead, markAllRead, addNotification, dismissNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the notification context.
 * Must be used within a NotificationProvider.
 *
 * @returns {NotificationContextValue} The notification context value
 * @throws {Error} If used outside of a NotificationProvider
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;