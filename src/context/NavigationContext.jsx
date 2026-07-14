import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { usePersona } from '@/context/PersonaContext';
import { ROUTES, PERMISSIONS, STORAGE_KEYS } from '@/lib/constants';
import { load, save } from '@/lib/storage';

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - Display label for the breadcrumb
 * @property {string} [path] - Optional route path for the breadcrumb link
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} id - Unique navigation item identifier
 * @property {string} label - Display label
 * @property {string} path - Route path
 * @property {string} icon - Icon identifier
 * @property {string} permission - Required permission to view this item
 * @property {string} section - Navigation section grouping
 */

/**
 * @typedef {Object} NavigationContextValue
 * @property {boolean} sidebarOpen - Whether the sidebar is currently open
 * @property {function(): void} toggleSidebar - Toggles the sidebar open/closed state
 * @property {BreadcrumbItem[]} breadcrumbs - Current breadcrumb trail
 * @property {function(BreadcrumbItem[]): void} setBreadcrumbs - Sets the breadcrumb trail
 * @property {string} activeRoute - The current active route path
 * @property {NavigationItem[]} navigationItems - Navigation items filtered by persona permissions
 */

const NavigationContext = createContext(null);

/**
 * All possible navigation items in the platform.
 * @type {NavigationItem[]}
 */
const ALL_NAVIGATION_ITEMS = [
  {
    id: 'nav_dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'layout-dashboard',
    permission: PERMISSIONS.VIEW_DASHBOARD,
    section: 'dashboard',
  },
  {
    id: 'nav_measures',
    label: 'Measures',
    path: ROUTES.MEASURES,
    icon: 'bar-chart-2',
    permission: PERMISSIONS.VIEW_MEASURES,
    section: 'measures',
  },
  {
    id: 'nav_patients',
    label: 'Test Data',
    path: ROUTES.PATIENTS,
    icon: 'database',
    permission: PERMISSIONS.VIEW_PATIENTS,
    section: 'patients',
  },
  {
    id: 'nav_reports',
    label: 'Reports',
    path: ROUTES.REPORTS,
    icon: 'file-text',
    permission: PERMISSIONS.VIEW_REPORTS,
    section: 'reports',
  },
  {
    id: 'nav_analytics',
    label: 'Analytics',
    path: ROUTES.ANALYTICS,
    icon: 'trending-up',
    permission: PERMISSIONS.VIEW_ANALYTICS,
    section: 'analytics',
  },
  {
    id: 'nav_settings',
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: 'settings',
    permission: PERMISSIONS.MANAGE_SETTINGS,
    section: 'settings',
  },
];

/**
 * Resolves the initial sidebar open state from localStorage.
 *
 * @returns {boolean} The initial sidebar open state
 */
function resolveInitialSidebarState() {
  const stored = load(STORAGE_KEYS.SIDEBAR_COLLAPSED, null);
  if (stored === true) {
    return false;
  }
  return true;
}

/**
 * NavigationProvider wraps the application and provides navigation state
 * including sidebar toggle, breadcrumbs, active route detection, and
 * persona-filtered navigation items.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 */
export function NavigationProvider({ children }) {
  const { currentPersona, hasPermission } = usePersona();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(resolveInitialSidebarState);
  const [breadcrumbs, setBreadcrumbsState] = useState([]);

  const activeRoute = useMemo(() => {
    return location.pathname || '/';
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      save(STORAGE_KEYS.SIDEBAR_COLLAPSED, !next);
      return next;
    });
  }, []);

  const setBreadcrumbs = useCallback((newBreadcrumbs) => {
    if (!Array.isArray(newBreadcrumbs)) {
      return;
    }
    setBreadcrumbsState(newBreadcrumbs);
  }, []);

  const navigationItems = useMemo(() => {
    if (!currentPersona || !currentPersona.id) {
      return [];
    }

    const navConfig = currentPersona.navConfig;
    const visibleSections = navConfig ? navConfig.visibleSections : [];

    return ALL_NAVIGATION_ITEMS.filter((item) => {
      if (!hasPermission(item.permission)) {
        return false;
      }

      if (visibleSections && visibleSections.length > 0) {
        if (!visibleSections.includes(item.section)) {
          return false;
        }
      }

      return true;
    });
  }, [currentPersona, hasPermission]);

  useEffect(() => {
    const routeLabelMap = {
      [ROUTES.DASHBOARD]: 'Dashboard',
      [ROUTES.MEASURES]: 'Measures',
      [ROUTES.PATIENTS]: 'Test Data',
      [ROUTES.REPORTS]: 'Reports',
      [ROUTES.ANALYTICS]: 'Analytics',
      [ROUTES.SETTINGS]: 'Settings',
    };

    const currentPath = location.pathname;
    const label = routeLabelMap[currentPath];

    if (label) {
      setBreadcrumbsState([
        { label: 'Home', path: ROUTES.DASHBOARD },
        { label, path: currentPath },
      ]);
    } else if (currentPath === '/' || currentPath === '') {
      setBreadcrumbsState([{ label: 'Home', path: ROUTES.DASHBOARD }]);
    }
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      sidebarOpen,
      toggleSidebar,
      breadcrumbs,
      setBreadcrumbs,
      activeRoute,
      navigationItems,
    }),
    [sidebarOpen, toggleSidebar, breadcrumbs, setBreadcrumbs, activeRoute, navigationItems]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

NavigationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the navigation context.
 * Must be used within a NavigationProvider.
 *
 * @returns {NavigationContextValue} The navigation context value
 * @throws {Error} If used outside of a NavigationProvider
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === null) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export default NavigationContext;