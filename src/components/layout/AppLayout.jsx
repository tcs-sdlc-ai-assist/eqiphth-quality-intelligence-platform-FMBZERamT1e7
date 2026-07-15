import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Outlet, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNavigation, SIDEBAR_COLLAPSED_WIDTH } from '@/context/NavigationContext';
import { TopHeader } from '@/components/layout/TopHeader';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { SidebarCollapseToggle } from '@/components/layout/SidebarCollapseToggle';
import { SidebarResizeHandle } from '@/components/layout/SidebarResizeHandle';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { DESIGN_TOKENS } from '@/lib/constants';

/**
 * Main application layout: a full-height dark-navy sidebar on the left (brand
 * mark at top, navigation in the middle, Humana footer at the bottom) with the
 * TopHeader and routed content in the column to its right.
 *
 * Responsive: on desktop (lg+) the sidebar is always visible. On mobile it
 * slides in as an overlay controlled by NavigationContext.sidebarOpen.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names for the outer container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const AppLayout = forwardRef(function AppLayout({ className, ...props }, ref) {
  const {
    sidebarOpen,
    toggleSidebar,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    sidebarWidth,
    setSidebarWidth,
  } = useNavigation();

  const handleOverlayClick = useCallback(() => {
    if (sidebarOpen && window.innerWidth < DESIGN_TOKENS.BREAKPOINTS.LG) {
      toggleSidebar();
    }
  }, [sidebarOpen, toggleSidebar]);

  return (
    <div
      ref={ref}
      className={cn('flex h-screen overflow-hidden bg-slate-50', className)}
      {...props}
    >
      {/* Mobile sidebar overlay backdrop */}
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      ) : null}

      {/* Sidebar — full height, dark navy */}
      <aside
        style={{ width: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : sidebarWidth }}
        className={cn(
          'relative z-40 flex shrink-0 flex-col text-slate-300',
          'bg-gradient-to-b from-[#102449] to-[#0a1730]',
          // Off-canvas on mobile; static and always visible on desktop
          'fixed inset-y-0 left-0 -translate-x-full transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen && 'translate-x-0'
        )}
        role="complementary"
        aria-label="Sidebar navigation"
      >
        {!sidebarCollapsed ? (
          <SidebarResizeHandle width={sidebarWidth} onResize={setSidebarWidth} />
        ) : null}

        {/* Brand header — logo at the top of the sidebar */}
        <div className="relative flex shrink-0 flex-col items-start justify-center gap-1 border-b border-white/10 px-2 py-4">
          <Link
            to="/dashboard"
            className="min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400"
            aria-label="EQIP Quality Platform — Go to dashboard"
          >
            <BrandLogo
              variant="light"
              size="md"
              showText={!sidebarCollapsed}
              showHumana={false}
            />
          </Link>
          <SidebarCollapseToggle
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebarCollapsed}
            className="absolute right-2 top-2 z-20 hidden border border-white/10 bg-white/5 lg:flex"
          />
        </div>

        {/* Navigation */}
        <SidebarNav className="flex-1 min-h-0" collapsed={sidebarCollapsed} />

        {/* Footer */}
        <div
          className={cn(
            'shrink-0 border-t border-white/10 py-4',
            sidebarCollapsed ? 'flex justify-center px-2' : 'px-5'
          )}
        >
          {sidebarCollapsed ? (
            <span className="text-base font-bold text-humana-green-400 leading-none" title="Humana. — Quality Without Compromise">
              H.
            </span>
          ) : (
            <>
              <p className="text-base font-bold text-humana-green-400 leading-none">
                Humana.
              </p>
              <p className="mt-1 text-2xs uppercase tracking-wider text-slate-400">
                Quality Without Compromise
              </p>
            </>
          )}
        </div>
      </aside>

      {/* Main column: header + content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader />
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          role="main"
          aria-label="Main content"
        >
          <div className="p-4 lg:p-6">
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
