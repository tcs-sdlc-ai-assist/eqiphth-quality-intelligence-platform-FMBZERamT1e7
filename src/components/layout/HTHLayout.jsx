import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Outlet, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { TopHeader } from '@/components/layout/TopHeader';
import { HTHSidebarNav } from '@/components/layout/HTHSidebarNav';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { DESIGN_TOKENS, ROUTES } from '@/lib/constants';

/**
 * Layout for the Humana Test Harness module (PRD §5, §6.4.1). Mirrors
 * `AppLayout`'s shell (sticky `TopHeader` + scrollable content) but swaps in
 * `HTHSidebarNav` and a dual brand header — the EQIP mark plus a second
 * "Humana Test Harness (HTH)" block with its own tagline — so the HTH module
 * reads as its own workspace, matching the reference mocks.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names for the outer container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const HTHLayout = forwardRef(function HTHLayout({ className, ...props }, ref) {
  const { sidebarOpen, toggleSidebar } = useNavigation();

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
        className={cn(
          'z-40 flex w-64 shrink-0 flex-col text-slate-300',
          'bg-gradient-to-b from-[#102449] to-[#0a1730]',
          'fixed inset-y-0 left-0 -translate-x-full transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen && 'translate-x-0'
        )}
        role="complementary"
        aria-label="Humana Test Harness sidebar"
      >
        {/* Brand header */}
        <div className="flex shrink-0 flex-col border-b border-white/10 px-5 py-4">
          <Link
            to="/dashboard"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400"
            aria-label="EQIP Quality Platform — Go to dashboard"
          >
            <BrandLogo variant="light" size="sm" />
          </Link>
          <div className="mt-3 border-t border-white/10 pt-3">
            <Link to={ROUTES.HTH} className="text-sm font-bold leading-tight text-white hover:text-humana-green-300">
              Humana Test Harness (HTH)
            </Link>
            <p className="mt-1 text-2xs leading-snug text-slate-400">
              Intelligent orchestration. Seamless execution. Quality at speed.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <HTHSidebarNav className="flex-1 min-h-0" />

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          <p className="text-base font-bold text-humana-green-400 leading-none">Humana.</p>
          <p className="mt-1 text-2xs uppercase tracking-wider text-slate-400">Quality Without Compromise</p>
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

HTHLayout.displayName = 'HTHLayout';

HTHLayout.propTypes = {
  className: PropTypes.string,
};

export { HTHLayout };
export default HTHLayout;
