import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import {
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  BookOpen,
  MessageCircle,
  ExternalLink,
  Keyboard,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useNotifications } from '@/context/NotificationContext';
import { PersonaSwitcher } from '@/components/layout/PersonaSwitcher';
import { NotificationBell } from '@/components/layout/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip';

/**
 * Breadcrumb navigation component displaying the current navigation path.
 *
 * @param {object} props
 * @param {{ label: string, path?: string }[]} props.items - Array of breadcrumb items
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement|null}
 */
function Breadcrumbs({ items, className }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('hidden md:flex items-center gap-1 text-sm', className)}
    >
      <ol className="flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight
                  className="h-3.5 w-3.5 text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              ) : null}
              {isLast || !item.path ? (
                <span
                  className={cn(
                    'truncate max-w-[160px]',
                    isLast
                      ? 'font-medium text-slate-900'
                      : 'text-slate-500'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'text-slate-500 hover:text-humana-green-600 transition-colors duration-200 truncate max-w-[160px]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2 rounded-sm'
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};



/**
 * Help menu dropdown with documentation, support, and keyboard shortcuts links.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement}
 */
function HelpMenu({ className }) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition-colors duration-200',
                'hover:bg-slate-100 hover:text-slate-700',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                className
              )}
              aria-label="Help and resources"
            >
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Help &amp; Resources</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Help &amp; Resources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`${ROUTES.HELP}#documentation`)}>
          <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
          Documentation
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`${ROUTES.HELP}#shortcuts`)}>
          <Keyboard className="mr-2 h-4 w-4" aria-hidden="true" />
          Keyboard Shortcuts
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`${ROUTES.HELP}#support`)}>
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          Contact Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`${ROUTES.HELP}#release-notes`)}>
          <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
          Release Notes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`${ROUTES.HELP}#about`)}>
          <Info className="mr-2 h-4 w-4" aria-hidden="true" />
          About EQIP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

HelpMenu.propTypes = {
  className: PropTypes.string,
};

/**
 * TopHeader component providing the top navigation bar for the EQIP Quality
 * Platform. Displays the brand logo, breadcrumb navigation, global search,
 * notification bell with unread count, persona switcher, and help menu.
 *
 * Responsive: on mobile, the search input collapses into a toggle button,
 * and the sidebar toggle button is displayed. Fully accessible with ARIA
 * labels and keyboard navigation support.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names for the header container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TopHeader = forwardRef(function TopHeader({ className, showBackToEqip = false, ...props }, ref) {
  const { currentPersona } = usePersona();
  const { breadcrumbs, pageHeader, toggleSidebar, sidebarOpen, setPageActionsEl } = useNavigation();
  const { unreadCount } = useNotifications();

  const handleSidebarToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-40 flex h-16 w-full items-center border-b border-slate-200 bg-white px-4 lg:px-6',
        className
      )}
      role="banner"
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left section: sidebar toggle, logo, breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Sidebar toggle (mobile) */}
          <button
            type="button"
            onClick={handleSidebarToggle}
            className={cn(
              'inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition-colors duration-200 lg:hidden',
              'hover:bg-slate-100 hover:text-slate-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
            )}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Back to EQIP (HTH module only) */}
          {showBackToEqip ? (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors',
                  'hover:bg-slate-100 hover:text-slate-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
                )}
              >
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Back to EQIP</span>
              </Link>
              <div className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden="true" />
            </>
          ) : null}

          {/* Page heading (title + subtitle) — falls back to breadcrumbs when unset */}
          {pageHeader && pageHeader.title ? (
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold leading-tight text-slate-900">{pageHeader.title}</h1>
              {pageHeader.subtitle ? (
                <p className="truncate text-xs leading-tight text-slate-500">{pageHeader.subtitle}</p>
              ) : null}
            </div>
          ) : (
            <Breadcrumbs items={breadcrumbs} />
          )}
        </div>

        {/* Right section: page actions, notifications, help, profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Page actions slot — pages portal navbar-right controls here (e.g. refresh, date filters) */}
          <div ref={setPageActionsEl} className="flex items-center gap-2 empty:hidden" />

          {/* Notification bell */}
          <NotificationBell />

          {/* Help menu */}
          <HelpMenu />

          {/* Divider */}
          <div
            className="hidden sm:block h-6 w-px bg-slate-200 mx-1"
            aria-hidden="true"
          />

          {/* Profile */}
          <PersonaSwitcher variant="profile" />
        </div>
      </div>
    </header>
  );
});

TopHeader.displayName = 'TopHeader';

TopHeader.propTypes = {
  className: PropTypes.string,
  showBackToEqip: PropTypes.bool,
};

export { TopHeader };
export default TopHeader;