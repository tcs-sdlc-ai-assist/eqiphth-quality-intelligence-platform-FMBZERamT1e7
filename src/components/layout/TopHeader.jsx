import { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import {
  Bell,
  HelpCircle,
  Search,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  MessageCircle,
  ExternalLink,
  Keyboard,
  Info,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useNotifications } from '@/context/NotificationContext';
import { PersonaSwitcher } from '@/components/layout/PersonaSwitcher';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/shared/SearchInput';
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
const TopHeader = forwardRef(function TopHeader({ className, ...props }, ref) {
  const { currentPersona, logout } = usePersona();
  const { breadcrumbs, toggleSidebar, sidebarOpen } = useNavigation();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleToggleSearch = useCallback(() => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          if (searchInputRef.current) {
            const input = searchInputRef.current.querySelector('input');
            if (input) {
              input.focus();
            }
          }
        }, 0);
      }
      return next;
    });
  }, []);

  const handleCloseSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const handleSearch = useCallback(
    (query) => {
      if (query && query.trim().length > 0) {
        // Navigate to dashboard with search context (simulated)
        navigate('/dashboard');
      }
    },
    [navigate]
  );



  const handleSidebarToggle = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  useEffect(() => {
    if (!searchOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleCloseSearch();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen, handleCloseSearch]);

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

          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Right section: search, notifications, help, persona switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search - desktop */}
          <div className="hidden md:block">
            <SearchInput
              placeholder="Search platform..."
              size="sm"
              debounceMs={400}
              onSearch={handleSearch}
              className="w-56 lg:w-64"
              ariaLabel="Search the EQIP platform"
            />
          </div>

          {/* Search toggle - mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleToggleSearch}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition-colors duration-200 md:hidden',
                  'hover:bg-slate-100 hover:text-slate-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                  searchOpen && 'bg-slate-100 text-slate-700'
                )}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                aria-expanded={searchOpen}
              >
                {searchOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Search className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {searchOpen ? 'Close search' : 'Search'}
            </TooltipContent>
          </Tooltip>

          {/* Notification bell */}
          <NotificationBell />

          {/* Help menu */}
          <HelpMenu />

          {/* Divider */}
          <div
            className="hidden sm:block h-6 w-px bg-slate-200 mx-1"
            aria-hidden="true"
          />

          {/* Persona switcher */}
          <PersonaSwitcher
            variant="compact"
            className="hidden sm:block"
          />
          <PersonaSwitcher
            variant="compact"
            className="sm:hidden"
          />

          {/* Sign out */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition-colors duration-200',
                  'hover:bg-danger-50 hover:text-danger-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
                )}
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Sign out</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen ? (
        <div
          className={cn(
            'absolute left-0 right-0 top-16 z-50 border-b border-slate-200 bg-white px-4 py-3 shadow-dropdown md:hidden',
            'animate-slide-in-down'
          )}
          ref={searchInputRef}
        >
          <SearchInput
            placeholder="Search platform..."
            size="md"
            debounceMs={400}
            onSearch={(query) => {
              handleSearch(query);
              handleCloseSearch();
            }}
            autoFocus
            ariaLabel="Search the EQIP platform"
          />
        </div>
      ) : null}
    </header>
  );
});

TopHeader.displayName = 'TopHeader';

TopHeader.propTypes = {
  className: PropTypes.string,
};

export { TopHeader };
export default TopHeader;