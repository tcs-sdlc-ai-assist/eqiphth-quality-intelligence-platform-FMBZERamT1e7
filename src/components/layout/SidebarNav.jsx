import { forwardRef, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  Database,
  FileText,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  Server,
  Play,
  Activity,
  TestTube,
  ClipboardCheck,
  Calendar,
  Zap,
  ShieldCheck,
  Brain,
  Network,
  Monitor,
  Lock,
  Shield,
  Sparkles,
  Link2,
  Users,
  ListTodo,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { Badge } from '@/components/ui/Badge';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip';

/**
 * Maps icon identifier strings to Lucide icon components.
 *
 * @param {string} iconName - The icon identifier string
 * @returns {React.ElementType} The corresponding Lucide icon component
 */
function resolveIcon(iconName) {
  switch (iconName) {
    case 'layout-dashboard':
      return LayoutDashboard;
    case 'bar-chart-2':
      return BarChart2;
    case 'database':
      return Database;
    case 'file-text':
      return FileText;
    case 'trending-up':
      return TrendingUp;
    case 'settings':
      return Settings;
    case 'layers':
      return Layers;
    case 'server':
      return Server;
    case 'play':
      return Play;
    case 'activity':
      return Activity;
    case 'test-tube':
      return TestTube;
    case 'clipboard-check':
      return ClipboardCheck;
    case 'calendar':
      return Calendar;
    case 'zap':
      return Zap;
    case 'shield-check':
      return ShieldCheck;
    case 'brain':
      return Brain;
    case 'network':
      return Network;
    case 'monitor':
      return Monitor;
    case 'lock':
      return Lock;
    case 'shield':
      return Shield;
    case 'sparkles':
      return Sparkles;
    case 'link-2':
      return Link2;
    case 'users':
      return Users;
    case 'list-todo':
      return ListTodo;
    case 'user':
      return User;
    default:
      return LayoutDashboard;
  }
}

/**
 * Groups navigation items by their section property.
 *
 * @param {import('@/context/NavigationContext').NavigationItem[]} items - Array of navigation items
 * @returns {{ section: string, items: import('@/context/NavigationContext').NavigationItem[] }[]} Grouped navigation items
 */
function groupItemsBySection(items) {
  const sectionOrder = [
    'dashboard',
    'measures',
    'patients',
    'reports',
    'analytics',
    'settings',
  ];

  const groups = {};
  for (const item of items) {
    const section = item.section || 'other';
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(item);
  }

  const result = [];
  for (const section of sectionOrder) {
    if (groups[section] && groups[section].length > 0) {
      result.push({ section, items: groups[section] });
    }
  }

  const remainingSections = Object.keys(groups).filter(
    (s) => !sectionOrder.includes(s)
  );
  for (const section of remainingSections) {
    if (groups[section] && groups[section].length > 0) {
      result.push({ section, items: groups[section] });
    }
  }

  return result;
}

/**
 * Resolves a display-friendly label for a navigation section.
 *
 * @param {string} section - The section identifier
 * @returns {string} Display label for the section
 */
function getSectionLabel(section) {
  switch (section) {
    case 'dashboard':
      return 'Overview';
    case 'measures':
      return 'Quality';
    case 'patients':
      return 'Data';
    case 'reports':
      return 'Reporting';
    case 'analytics':
      return 'Intelligence';
    case 'settings':
      return 'Administration';
    default:
      return section.charAt(0).toUpperCase() + section.slice(1);
  }
}

/**
 * Individual navigation item component.
 *
 * @param {object} props
 * @param {import('@/context/NavigationContext').NavigationItem} props.item - The navigation item to render
 * @param {boolean} props.isActive - Whether this item is currently active
 * @param {boolean} props.isCollapsed - Whether the sidebar is in collapsed mode
 * @param {function(string): void} props.onNavigate - Callback when the item is clicked
 * @returns {React.ReactElement}
 */
function NavItem({ item, isActive, isCollapsed, onNavigate }) {
  const IconComponent = resolveIcon(item.icon);

  const handleClick = useCallback(() => {
    onNavigate(item.path);
  }, [onNavigate, item.path]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNavigate(item.path);
      }
    },
    [onNavigate, item.path]
  );

  const itemContent = (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
        isActive
          ? 'bg-humana-green-50 text-humana-green-700'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        isCollapsed && 'justify-center px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-label={item.label}
      tabIndex={0}
    >
      {/* Active indicator */}
      {isActive ? (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-humana-green-500"
          aria-hidden="true"
        />
      ) : null}

      <IconComponent
        className={cn(
          'h-5 w-5 shrink-0 transition-colors duration-200',
          isActive
            ? 'text-humana-green-600'
            : 'text-slate-400 group-hover:text-slate-600'
        )}
        aria-hidden="true"
      />

      {!isCollapsed ? (
        <span className="truncate">{item.label}</span>
      ) : null}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return itemContent;
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

/**
 * Collapsible navigation group component.
 *
 * @param {object} props
 * @param {string} props.label - Display label for the group
 * @param {import('@/context/NavigationContext').NavigationItem[]} props.items - Navigation items in this group
 * @param {string} props.activeRoute - The current active route path
 * @param {boolean} props.isCollapsed - Whether the sidebar is in collapsed mode
 * @param {boolean} props.defaultExpanded - Whether the group starts expanded
 * @param {function(string): void} props.onNavigate - Callback when an item is clicked
 * @returns {React.ReactElement}
 */
function NavGroup({ label, items, activeRoute, isCollapsed, defaultExpanded, onNavigate }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const hasActiveItem = useMemo(() => {
    return items.some((item) => activeRoute === item.path);
  }, [items, activeRoute]);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setExpanded((prev) => !prev);
      }
    },
    []
  );

  // In collapsed mode, render items without group headers
  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-1" role="group" aria-label={label}>
        {items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeRoute === item.path}
            isCollapsed={isCollapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  // If only one item in the group, render without collapsible header
  if (items.length === 1) {
    return (
      <div className="flex flex-col gap-1" role="group" aria-label={label}>
        <NavItem
          key={items[0].id}
          item={items[0]}
          isActive={activeRoute === items[0].path}
          isCollapsed={isCollapsed}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5" role="group" aria-label={label}>
      {/* Group header */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider transition-colors duration-200',
          'text-slate-400 hover:text-slate-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
          hasActiveItem && 'text-slate-500'
        )}
        aria-expanded={expanded}
        aria-label={`${label} navigation group`}
      >
        <span className="select-none">{label}</span>
        {expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
        )}
      </button>

      {/* Group items */}
      {expanded ? (
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeRoute === item.path}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

NavGroup.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  activeRoute: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  defaultExpanded: PropTypes.bool,
  onNavigate: PropTypes.func.isRequired,
};

/**
 * SidebarNav component providing the main sidebar navigation for the EQIP
 * Quality Platform. Renders navigation items dynamically based on the current
 * persona's permissions. Supports collapsible groups, active state highlighting,
 * icons, and keyboard navigation with ARIA attributes.
 *
 * Responsive: on mobile, the sidebar is rendered as an overlay controlled by
 * the NavigationContext sidebarOpen state. On desktop (lg+), it is always
 * visible and can be collapsed to icon-only mode.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names for the nav container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const SidebarNav = forwardRef(function SidebarNav(
  { className, ...props },
  ref
) {
  const { currentPersona } = usePersona();
  const { sidebarOpen, activeRoute, navigationItems, toggleSidebar } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const resolvedActiveRoute = useMemo(() => {
    return location.pathname || activeRoute || '/';
  }, [location.pathname, activeRoute]);

  const groupedItems = useMemo(() => {
    return groupItemsBySection(navigationItems);
  }, [navigationItems]);

  const isCollapsed = !sidebarOpen;

  const handleNavigate = useCallback(
    (path) => {
      if (!path) return;
      navigate(path);

      // Close sidebar on mobile after navigation
      if (window.innerWidth < 1024 && sidebarOpen) {
        toggleSidebar();
      }
    },
    [navigate, sidebarOpen, toggleSidebar]
  );

  // Determine which groups should be expanded by default
  const isGroupDefaultExpanded = useCallback(
    (sectionItems) => {
      return sectionItems.some((item) => resolvedActiveRoute === item.path);
    },
    [resolvedActiveRoute]
  );

  if (navigationItems.length === 0) {
    return null;
  }

  return (
    <nav
      ref={ref}
      className={cn(
        'flex flex-col gap-4 overflow-y-auto overflow-x-hidden',
        isCollapsed ? 'items-center px-2 py-4' : 'px-3 py-4',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
      {...props}
    >
      {/* Persona context indicator (expanded mode only) */}
      {!isCollapsed ? (
        <div className="px-3 pb-2 border-b border-slate-200">
          <p className="text-2xs font-medium text-slate-400 uppercase tracking-wider truncate">
            {currentPersona.role}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {currentPersona.segment} Segment
          </p>
        </div>
      ) : null}

      {/* Navigation groups */}
      <div
        className={cn(
          'flex flex-col',
          isCollapsed ? 'gap-2' : 'gap-4'
        )}
      >
        {groupedItems.map((group) => {
          const sectionLabel = getSectionLabel(group.section);
          const defaultExpanded =
            isGroupDefaultExpanded(group.items) || group.items.length <= 2;

          return (
            <NavGroup
              key={group.section}
              label={sectionLabel}
              items={group.items}
              activeRoute={resolvedActiveRoute}
              isCollapsed={isCollapsed}
              defaultExpanded={defaultExpanded}
              onNavigate={handleNavigate}
            />
          );
        })}
      </div>

      {/* Bottom spacer for scroll */}
      <div className="flex-1 min-h-4" aria-hidden="true" />

      {/* Collapsed mode: sidebar toggle hint */}
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                'flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors duration-200',
                'hover:bg-slate-100 hover:text-slate-600',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
              )}
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Expand sidebar
          </TooltipContent>
        </Tooltip>
      ) : null}
    </nav>
  );
});

SidebarNav.displayName = 'SidebarNav';

SidebarNav.propTypes = {
  className: PropTypes.string,
};

export { SidebarNav };
export default SidebarNav;