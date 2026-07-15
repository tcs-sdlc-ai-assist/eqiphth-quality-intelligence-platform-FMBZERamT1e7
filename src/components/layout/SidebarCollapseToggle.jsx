import PropTypes from 'prop-types';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Icon button that toggles a desktop sidebar between its full width and a
 * narrow icon-only rail, giving more horizontal room to page content.
 *
 * @param {object} props
 * @param {boolean} props.collapsed - Current collapsed state
 * @param {() => void} props.onToggle - Called to flip the collapsed state
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement}
 */
function SidebarCollapseToggle({ collapsed, onToggle, className }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400/70',
        className
      )}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? (
        <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
      ) : (
        <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

SidebarCollapseToggle.propTypes = {
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export { SidebarCollapseToggle };
export default SidebarCollapseToggle;
