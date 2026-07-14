import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { usePersona } from '@/context/PersonaContext';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';
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
 * All possible navigation items in the platform matching the PRD workspaces.
 * @type {NavigationItem[]}
 */
const ALL_NAVIGATION_ITEMS = [
  {
    id: 'nav_dashboard',
    label: 'Overview',
    path: ROUTES.DASHBOARD,
    icon: 'layout-dashboard',
    permission: 'view_dashboard',
    section: 'dashboard',
  },
  {
    id: 'nav_segments',
    label: 'Segments',
    path: ROUTES.SEGMENTS,
    icon: 'layers',
    permission: 'view_dashboard',
    section: 'dashboard',
  },
  {
    id: 'nav_applications',
    label: 'Application Master',
    path: ROUTES.APPLICATIONS,
    icon: 'server',
    permission: 'view_dashboard',
    section: 'applications',
  },
  {
    id: 'nav_hth_home',
    label: 'HTH Home',
    path: ROUTES.HTH,
    icon: 'play',
    permission: 'view_dashboard',
    section: 'hth',
  },
  {
    id: 'nav_hth_in_sprint',
    label: 'In-Sprint View',
    path: ROUTES.HTH_IN_SPRINT,
    icon: 'activity',
    permission: 'view_dashboard',
    section: 'hth',
  },
  {
    id: 'nav_test_cases',
    label: 'Test Cases',
    path: ROUTES.TEST_CASES,
    icon: 'test-tube',
    permission: 'view_dashboard',
    section: 'hth',
  },
  {
    id: 'nav_executions',
    label: 'Test Executions',
    path: ROUTES.EXECUTIONS,
    icon: 'clipboard-check',
    permission: 'view_dashboard',
    section: 'hth',
  },
  {
    id: 'nav_scheduler',
    label: 'Scheduler',
    path: ROUTES.SCHEDULER,
    icon: 'calendar',
    permission: 'view_dashboard',
    section: 'hth',
  },
  {
    id: 'nav_automation',
    label: 'Automation Intel',
    path: ROUTES.AUTOMATION,
    icon: 'zap',
    permission: 'view_dashboard',
    section: 'hth',
  },
  {
    id: 'nav_release_readiness',
    label: 'Release Readiness',
    path: ROUTES.RELEASE_READINESS,
    icon: 'shield-check',
    permission: 'view_dashboard',
    section: 'hth',
  },
  {
    id: 'nav_ai_agents',
    label: 'AI Agent Workforce',
    path: ROUTES.AI_AGENTS,
    icon: 'brain',
    permission: 'view_dashboard',
    section: 'ai-workforce',
  },
  {
    id: 'nav_knowledge_graph',
    label: 'Enterprise Graph',
    path: ROUTES.KNOWLEDGE_GRAPH,
    icon: 'network',
    permission: 'view_dashboard',
    section: 'ai-workforce',
  },
  {
    id: 'nav_test_data',
    label: 'Test Data',
    path: ROUTES.TEST_DATA,
    icon: 'database',
    permission: 'view_dashboard',
    section: 'test-data',
  },
  {
    id: 'nav_environments',
    label: 'Environments',
    path: ROUTES.ENVIRONMENTS,
    icon: 'monitor',
    permission: 'view_dashboard',
    section: 'test-data',
  },
  {
    id: 'nav_demand',
    label: 'Demand Management',
    path: ROUTES.DEMAND,
    icon: 'file-text',
    permission: 'view_dashboard',
    section: 'demand',
  },
  {
    id: 'nav_quality_gates',
    label: 'Quality Gates',
    path: ROUTES.QUALITY_GATES,
    icon: 'lock',
    permission: 'view_dashboard',
    section: 'governance',
  },
  {
    id: 'nav_governance',
    label: 'Governance Dashboard',
    path: ROUTES.GOVERNANCE,
    icon: 'shield',
    permission: 'view_dashboard',
    section: 'governance',
  },
  {
    id: 'nav_post_deployment',
    label: 'Post Deployment',
    path: ROUTES.POST_DEPLOYMENT,
    icon: 'trending-up',
    permission: 'view_dashboard',
    section: 'post-deployment',
  },
  {
    id: 'nav_adoption',
    label: 'Adoption & Impact',
    path: ROUTES.ADOPTION,
    icon: 'bar-chart-2',
    permission: 'view_dashboard',
    section: 'post-deployment',
  },
  {
    id: 'nav_reports',
    label: 'Reports & Analytics',
    path: ROUTES.REPORTS,
    icon: 'file-text',
    permission: 'view_dashboard',
    section: 'reporting',
  },
  {
    id: 'nav_ai_insights',
    label: 'AI Insights',
    path: ROUTES.AI_INSIGHTS,
    icon: 'sparkles',
    permission: 'view_dashboard',
    section: 'reporting',
  },
  {
    id: 'nav_integrations',
    label: 'Integrations',
    path: ROUTES.INTEGRATIONS,
    icon: 'link-2',
    permission: 'view_dashboard',
    section: 'admin',
  },
  {
    id: 'nav_users',
    label: 'User Repository',
    path: ROUTES.USERS,
    icon: 'users',
    permission: 'view_dashboard',
    section: 'admin',
  },
  {
    id: 'nav_admin',
    label: 'Administration',
    path: ROUTES.ADMIN,
    icon: 'settings',
    permission: 'view_dashboard',
    section: 'admin',
  },
  {
    id: 'nav_eqe_log',
    label: 'EQE Log',
    path: ROUTES.EQE_LOG,
    icon: 'list-todo',
    permission: 'view_dashboard',
    section: 'admin',
  },
  {
    id: 'nav_profile',
    label: 'My Profile',
    path: ROUTES.PROFILE,
    icon: 'user',
    permission: 'view_dashboard',
    section: 'profile',
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

    // Map legacy visible sections to new workspace section names
    const mappedSections = [];
    for (const sec of visibleSections) {
      if (sec === 'dashboard') mappedSections.push('dashboard');
      if (sec === 'measures') mappedSections.push('hth', 'governance');
      if (sec === 'patients') mappedSections.push('test-data', 'applications');
      if (sec === 'reports') mappedSections.push('reporting', 'post-deployment');
      if (sec === 'analytics') mappedSections.push('ai-workforce', 'demand');
      if (sec === 'settings') mappedSections.push('admin', 'profile');
    }

    return ALL_NAVIGATION_ITEMS.filter((item) => {
      // Direct permission check
      if (!hasPermission(item.permission)) {
        return false;
      }

      // Persona sidebar configuration filter
      if (mappedSections.length > 0) {
        if (!mappedSections.includes(item.section)) {
          return false;
        }
      }

      return true;
    });
  }, [currentPersona, hasPermission]);

  useEffect(() => {
    const routeLabelMap = {
      [ROUTES.DASHBOARD]: 'Dashboard',
      [ROUTES.SEGMENTS]: 'Segments',
      [ROUTES.APPLICATIONS]: 'Application Master',
      [ROUTES.HTH]: 'HTH Home',
      [ROUTES.HTH_IN_SPRINT]: 'In-Sprint View',
      [ROUTES.TEST_CASES]: 'Test Cases',
      [ROUTES.EXECUTIONS]: 'Test Executions',
      [ROUTES.SCHEDULER]: 'Scheduler',
      [ROUTES.AUTOMATION]: 'Automation Intelligence',
      [ROUTES.RELEASE_READINESS]: 'Release Readiness',
      [ROUTES.AI_AGENTS]: 'AI Agent Workforce',
      [ROUTES.KNOWLEDGE_GRAPH]: 'Enterprise Graph',
      [ROUTES.TEST_DATA]: 'Test Data',
      [ROUTES.ENVIRONMENTS]: 'Environments',
      [ROUTES.DEMAND]: 'Demand Management',
      [ROUTES.QUALITY_GATES]: 'Quality Gates',
      [ROUTES.GOVERNANCE]: 'Governance Dashboard',
      [ROUTES.POST_DEPLOYMENT]: 'Post Deployment',
      [ROUTES.ADOPTION]: 'Adoption & Impact',
      [ROUTES.REPORTS]: 'Reports',
      [ROUTES.AI_INSIGHTS]: 'AI Insights',
      [ROUTES.INTEGRATIONS]: 'Integrations',
      [ROUTES.USERS]: 'User Repository',
      [ROUTES.ADMIN]: 'Administration',
      [ROUTES.EQE_LOG]: 'EQE Log',
      [ROUTES.PROFILE]: 'My Profile',
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