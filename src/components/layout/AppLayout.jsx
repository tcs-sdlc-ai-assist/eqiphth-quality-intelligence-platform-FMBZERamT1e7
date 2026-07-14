import { forwardRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { TopHeader } from '@/components/layout/TopHeader';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { DESIGN_TOKENS } from '@/lib/constants';

/**
 * Main application layout component that composes the TopHeader, SidebarNav,
 * and main content area with an Outlet for nested route rendering.
 *
 * Handles responsive sidebar toggle behavior:
 * - On desktop (lg+), the sidebar is always visible and can be collapsed to icon-only mode.
 * - On mobile (<lg), the sidebar renders as an overlay controlled by the
 *   NavigationContext sidebarOpen state.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names for the outer container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const AppLayout = forwardRef(function AppLayout({ className, ...props }, ref) {
  const { sidebarOpen, toggleSidebar } = useNavigation();

  // Close sidebar on route change for mobile
  // (handled inside SidebarNav via toggleSidebar on navigate)

  // Close mobile sidebar overlay on window resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= DESIGN_TOKENS.BREAKPOINTS.LG && sidebarOpen) {
        // On desktop, sidebar is always visible; no action needed
      }
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  const handleOverlayClick = useCallback(() => {
    if (sidebarOpen && window.innerWidth < DESIGN_TOKENS.BREAKPOINTS.LG) {
      toggleSidebar();
    }
  }, [sidebarOpen, toggleSidebar]);

  return (
    <div
      ref={ref}
      className={cn('flex h-screen flex-col overflow-hidden bg-slate-50', className)}
      {...props}
    >
      {/* Top header */}
      <TopHeader />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay backdrop */}
        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        ) : null}

        {/* Sidebar */}
        <aside
          className={cn(
            'z-40 flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300',
            // Desktop: always visible, width depends on collapsed state
            'hidden lg:flex',
            sidebarOpen ? 'lg:w-64' : 'lg:w-16',
            // Mobile: overlay positioning
            sidebarOpen && 'fixed inset-y-0 left-0 top-16 flex w-64 lg:relative lg:top-0'
          )}
          role="complementary"
          aria-label="Sidebar navigation"
        >
          <SidebarNav className="flex-1" />
        </aside>

        {/* Main content area */}
        <main
          className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden"
          role="main"
          aria-label="Main content"
        >
          <div className="flex-1 p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

AppLayout.propTypes = {
  className: PropTypes.string,
};

export { AppLayout };
export default AppLayout;