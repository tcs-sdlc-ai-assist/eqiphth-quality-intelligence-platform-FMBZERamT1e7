import { forwardRef, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Hexagon,
  Bot,
  Network,
  Database,
  ClipboardCheck,
  BarChart3,
  ScrollText,
  ShieldCheck,
  Settings,
  Bookmark,
  UserCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { usePersona } from '@/context/PersonaContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { ROUTES, PERMISSIONS } from '@/lib/constants';

/**
 * Flat EQIP navigation tree matching the UX mocks (Docs/mocks). Top-level
 * items appear in order with no section dividers; some are expandable groups.
 * Every leaf `to` resolves to a real route (children of Application Master use
 * a hash so each sub-item is independently highlightable).
 *
 * @type {{ id: string, label: string, icon: React.ElementType, to?: string, children?: {label:string,to:string}[] }[]}
 */
const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  {
    id: 'app-master',
    label: 'Application Master',
    icon: Boxes,
    children: [
      { label: 'Applications', to: ROUTES.APPLICATIONS },
      { label: 'APIs & Services', to: `${ROUTES.APPLICATIONS}#apis` },
      { label: 'Environments', to: ROUTES.ENVIRONMENTS },
      { label: 'Technologies & Frameworks', to: `${ROUTES.APPLICATIONS}#tech` },
      { label: 'Dependencies', to: `${ROUTES.APPLICATIONS}#dependencies` },
      { label: 'Ownership & Contacts', to: `${ROUTES.APPLICATIONS}#ownership` },
    ],
  },
  {
    id: 'hth',
    label: 'Humana Test Harness (HTH)',
    icon: Hexagon,
    to: ROUTES.HTH,
  },
  { id: 'ai-agents', label: 'AI Agent Workforce', icon: Bot, to: ROUTES.AI_AGENTS },
  { id: 'kg', label: 'Enterprise Knowledge Graph', icon: Network, to: ROUTES.KNOWLEDGE_GRAPH },
  { id: 'test-data', label: 'Test Data Management', icon: Database, to: ROUTES.TEST_DATA },
  {
    id: 'demand',
    label: 'Demand Management',
    icon: ClipboardCheck,
    children: [
      { label: 'Demand Home', to: ROUTES.DEMAND },
      { label: 'Demand Pipeline', to: `${ROUTES.DEMAND}#pipeline` },
      { label: 'Demand Intake', to: `${ROUTES.DEMAND}#intake` },
      { label: 'Demand Inventory', to: `${ROUTES.DEMAND}#inventory` },
      { label: 'Portfolio Demand', to: `${ROUTES.DEMAND}#portfolio` },
      { label: 'Approvals', to: `${ROUTES.DEMAND}#approvals` },
      { label: 'Reports & Analytics', to: `${ROUTES.DEMAND}#reports` },
    ],
  },
  {
    id: 'quality-intel',
    label: 'Quality Intelligence',
    icon: BarChart3,
    children: [
      { label: 'Quality Gates', to: ROUTES.QUALITY_GATES },
      { label: 'Reports & Analytics', to: ROUTES.REPORTS },
      { label: 'AI Insights', to: ROUTES.AI_INSIGHTS },
      { label: 'Adoption & Impact', to: ROUTES.ADOPTION },
      { label: 'Post Deployment', to: ROUTES.POST_DEPLOYMENT },
    ],
  },
  { id: 'eqe-log', label: 'EQE Log', icon: ScrollText, to: ROUTES.EQE_LOG },
  { id: 'governance', label: 'Governance & Compliance', icon: ShieldCheck, to: ROUTES.GOVERNANCE },
  {
    id: 'admin',
    label: 'Administration',
    icon: Settings,
    requiredPermission: PERMISSIONS.MANAGE_SETTINGS,
    children: [
      { label: 'Administration', to: ROUTES.ADMIN },
      { label: 'Integrations', to: ROUTES.INTEGRATIONS },
      { label: 'User Repository', to: ROUTES.USERS, requiredPermission: PERMISSIONS.MANAGE_USERS },
    ],
  },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, to: ROUTES.BOOKMARKS },
  { id: 'profile', label: 'My Profile', icon: UserCircle, to: ROUTES.PROFILE },
];

/** Strips the hash from a nav target to get its route path. */
const basePath = (to) => to.split('#')[0];

/**
 * SidebarNav — the flat EQIP navigation for the dark sidebar. Renders the mock
 * structure exactly: top-level items in order, expandable groups, active
 * highlighting, and no section dividers.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const SidebarNav = forwardRef(function SidebarNav({ className, collapsed = false, ...props }, ref) {
  const { sidebarOpen, toggleSidebar } = useNavigation();
  const { hasPermission } = usePersona();
  const navigate = useNavigate();
  const location = useLocation();

  const current = `${location.pathname}${location.hash || ''}`;

  const handleNavigate = useCallback(
    (to) => {
      navigate(to);
      if (window.innerWidth < 1024 && sidebarOpen) {
        toggleSidebar();
      }
    },
    [navigate, sidebarOpen, toggleSidebar]
  );

  const isLeafActive = useCallback((to) => current === to, [current]);
  const groupHasActive = useCallback(
    (item) => item.children?.some((c) => basePath(c.to) === location.pathname),
    [location.pathname]
  );

  // Expanded state: default-open any group containing the active route; user
  // toggles override the default.
  const [overrides, setOverrides] = useState({});
  const isExpanded = (item) => (item.id in overrides ? overrides[item.id] : groupHasActive(item));
  const toggleGroup = (item) => setOverrides((prev) => ({ ...prev, [item.id]: !isExpanded(item) }));

  const canSee = useCallback(
    (navItem) => !navItem.requiredPermission || hasPermission(navItem.requiredPermission),
    [hasPermission]
  );

  const items = useMemo(
    () =>
      NAV.filter(canSee).map((item) =>
        item.children ? { ...item, children: item.children.filter(canSee) } : item
      ),
    [canSee]
  );

  return (
    <nav
      ref={ref}
      className={cn('flex flex-col gap-1 overflow-y-auto overflow-x-hidden py-5 scrollbar-dark', collapsed ? 'px-2' : 'px-3', className)}
      role="navigation"
      aria-label="Main navigation"
      {...props}
    >
      {items.map((item) => {
        const Icon = item.icon;

        if (!item.children) {
          const active = isLeafActive(item.to);
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.to)}
                  aria-label={item.label}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors',
                    collapsed ? 'justify-center px-2' : 'px-3',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400/70',
                    active ? 'bg-humana-green-500/15 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {active ? <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-humana-green-400" aria-hidden="true" /> : null}
                  <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-humana-green-400' : 'text-slate-400 group-hover:text-slate-200')} aria-hidden="true" />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        }

        const expanded = isExpanded(item);
        const sectionActive = groupHasActive(item);

        if (collapsed) {
          return (
            <div key={item.id} className="group/flyout relative">
              <button
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => handleNavigate(item.to || item.children[0].to)}
                className={cn(
                  'flex w-full items-center justify-center rounded-lg px-2 py-2.5 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400/70',
                  sectionActive ? 'bg-humana-green-500/15 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('h-5 w-5 shrink-0', sectionActive ? 'text-humana-green-400' : 'text-slate-400 group-hover/flyout:text-slate-200')} aria-hidden="true" />
              </button>
              <div className="invisible absolute left-full top-0 z-50 ml-1.5 min-w-[13rem] rounded-lg border border-white/10 bg-[#0f213f] py-1.5 opacity-0 shadow-xl transition-opacity group-hover/flyout:visible group-hover/flyout:opacity-100 group-focus-within/flyout:visible group-focus-within/flyout:opacity-100">
                <p className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                {item.children.map((child) => {
                  const active = isLeafActive(child.to);
                  return (
                    <button
                      key={child.to}
                      type="button"
                      onClick={() => handleNavigate(child.to)}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors',
                        active ? 'font-medium text-humana-green-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', active ? 'bg-humana-green-400' : 'bg-slate-600')} aria-hidden="true" />
                      <span className="truncate">{child.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <div key={item.id} className="flex flex-col">
            <button
              type="button"
              onClick={() => toggleGroup(item)}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400/70',
                sectionActive ? 'text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
              aria-expanded={expanded}
            >
              <Icon className={cn('h-5 w-5 shrink-0', sectionActive ? 'text-humana-green-400' : 'text-slate-400 group-hover:text-slate-200')} aria-hidden="true" />
              <span className="truncate">{item.label}</span>
              {expanded ? <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" /> : <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />}
            </button>

            {expanded ? (
              <div className="mb-1 mt-0.5 flex flex-col gap-0.5 pl-4">
                {item.children.map((child) => {
                  const active = isLeafActive(child.to);
                  return (
                    <button
                      key={child.to}
                      type="button"
                      onClick={() => handleNavigate(child.to)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg py-1.5 pl-4 pr-3 text-left text-sm transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400/70',
                        active ? 'font-medium text-humana-green-400' : 'text-slate-400 hover:text-slate-100'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', active ? 'bg-humana-green-400' : 'bg-slate-600')} aria-hidden="true" />
                      <span className="truncate">{child.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
});

SidebarNav.displayName = 'SidebarNav';

SidebarNav.propTypes = {
  className: PropTypes.string,
  collapsed: PropTypes.bool,
};

export { SidebarNav };
export default SidebarNav;
