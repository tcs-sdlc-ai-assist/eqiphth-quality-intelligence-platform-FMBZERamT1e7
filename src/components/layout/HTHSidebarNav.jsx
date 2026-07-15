import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Home,
  Eye,
  AlertTriangle,
  ListChecks,
  UserCheck,
  Sparkles,
  RefreshCw,
  ClipboardList,
  Bug,
  PlayCircle,
  CheckSquare,
  Rocket,
  Settings,
  Star,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LifeBuoy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { ROUTES } from '@/lib/constants';

/**
 * The Humana Test Harness's own nested navigation tree (PRD §5): HTH Home,
 * an Analytics group, and an Inventory group.
 */
const ANALYTICS_ITEMS = [
  { label: 'Application View', to: ROUTES.APPLICATION_VIEW, icon: Eye },
  { label: 'Triage', to: ROUTES.TRIAGE, icon: AlertTriangle },
  { label: 'Executions Triage', to: ROUTES.EXECUTIONS_TRIAGE, icon: ListChecks },
  { label: 'My Assignments', to: ROUTES.MY_ASSIGNMENTS, icon: UserCheck },
  { label: 'AI In Testing', to: ROUTES.AI_IN_TESTING, icon: Sparkles },
  { label: 'In-Sprint View', to: ROUTES.HTH_IN_SPRINT, icon: RefreshCw },
];

const INVENTORY_ITEMS = [
  { label: 'Test Cases', to: ROUTES.TEST_CASES, icon: ClipboardList },
  { label: 'Bugs/Defects', to: ROUTES.BUGS_DEFECTS, icon: Bug },
  { label: 'Executions', to: ROUTES.EXECUTIONS, icon: PlayCircle },
  { label: 'Unit Tests', to: ROUTES.UNIT_TESTS, icon: CheckSquare },
  { label: 'Release Readiness', to: ROUTES.RELEASE_READINESS, icon: Rocket },
  { label: 'Configurations', to: ROUTES.CONFIGURATIONS, icon: Settings },
];

/** Not part of the PRD §5 Inventory list, but kept reachable within the HTH workspace. */
const MORE_ITEMS = [
  { label: 'Scheduler', to: ROUTES.SCHEDULER, icon: RefreshCw },
  { label: 'Automation Intelligence', to: ROUTES.AUTOMATION, icon: Sparkles },
];

const FAVORITED_SUITES = [
  { label: 'Core Enrollment Regression Suite', to: '/test-suites/suite-101' },
  { label: 'Claims API Smoke Suite', to: '/test-suites/suite-102' },
];

/**
 * A single nav row: icon + label, with active/hover styling matching the
 * main SidebarNav's visual language.
 */
function NavRow({ label, to, icon: Icon, active, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(to)}
      className={cn(
        'group relative flex w-full items-center gap-2.5 rounded-lg py-2 pl-4 pr-3 text-left text-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400/70',
        active ? 'bg-humana-green-500/15 font-medium text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
      )}
      aria-current={active ? 'page' : undefined}
    >
      {active ? <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-humana-green-400" aria-hidden="true" /> : null}
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-humana-green-400' : 'text-slate-400 group-hover:text-slate-200')} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </button>
  );
}

NavRow.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  active: PropTypes.bool,
  onNavigate: PropTypes.func.isRequired,
};

/**
 * HTHSidebarNav — the Humana Test Harness module's own nested left
 * navigation (PRD §5, §6.4.1): HTH Home, an Analytics group, an Inventory
 * group, Favorited Test Suites, and a Docs & Support footer link. Rendered
 * by `HTHLayout` in place of the shared `SidebarNav` while inside `/hth`,
 * `/test-cases`, `/bugs-defects`, `/executions`, `/release-readiness`, etc.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const HTHSidebarNav = forwardRef(function HTHSidebarNav({ className, ...props }, ref) {
  const { sidebarOpen, toggleSidebar } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const handleNavigate = (to) => {
    navigate(to);
    if (window.innerWidth < 1024 && sidebarOpen) {
      toggleSidebar();
    }
  };

  const isActive = (to) => location.pathname === to;

  return (
    <nav
      ref={ref}
      className={cn('flex flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-dark', className)}
      role="navigation"
      aria-label="Humana Test Harness navigation"
      {...props}
    >
      <button
        type="button"
        onClick={() => handleNavigate(ROUTES.DASHBOARD)}
        className="mb-1 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        Back to EQIP
      </button>
      <div className="mb-1 border-t border-white/10" aria-hidden="true" />

      <NavRow label="HTH Home" to={ROUTES.HTH} icon={Home} active={isActive(ROUTES.HTH)} onNavigate={handleNavigate} />

      <div className="mt-3 px-4 text-2xs font-semibold uppercase tracking-wider text-slate-500">Analytics</div>
      {ANALYTICS_ITEMS.map((item) => (
        <NavRow key={item.to} label={item.label} to={item.to} icon={item.icon} active={isActive(item.to)} onNavigate={handleNavigate} />
      ))}

      <div className="mt-3 px-4 text-2xs font-semibold uppercase tracking-wider text-slate-500">Inventory</div>
      {INVENTORY_ITEMS.map((item) => (
        <NavRow key={item.to} label={item.label} to={item.to} icon={item.icon} active={isActive(item.to)} onNavigate={handleNavigate} />
      ))}

      <div className="my-1 mx-4 border-t border-white/10" aria-hidden="true" />
      {MORE_ITEMS.map((item) => (
        <NavRow key={item.to} label={item.label} to={item.to} icon={item.icon} active={isActive(item.to)} onNavigate={handleNavigate} />
      ))}

      <button
        type="button"
        onClick={() => setFavoritesOpen((o) => !o)}
        className="mt-3 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-2xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
        aria-expanded={favoritesOpen}
      >
        <Star className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">Favorited Test Suites</span>
        {favoritesOpen ? <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>
      {favoritesOpen ? (
        <div className="flex flex-col gap-0.5 pl-2">
          {FAVORITED_SUITES.map((s) => (
            <button
              key={s.to}
              type="button"
              onClick={() => handleNavigate(s.to)}
              className="flex items-center gap-2.5 rounded-lg py-1.5 pl-6 pr-3 text-left text-xs text-slate-400 transition-colors hover:text-slate-100"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" aria-hidden="true" />
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-auto pt-3">
        <Link
          to={`${ROUTES.HELP}#documentation`}
          className="flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
        >
          <LifeBuoy className="h-4 w-4 shrink-0" aria-hidden="true" />
          HTH Docs &amp; Support
        </Link>
      </div>
    </nav>
  );
});

HTHSidebarNav.displayName = 'HTHSidebarNav';

HTHSidebarNav.propTypes = {
  className: PropTypes.string,
};

export { HTHSidebarNav };
export default HTHSidebarNav;
