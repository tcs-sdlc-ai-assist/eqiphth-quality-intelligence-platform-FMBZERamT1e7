import { forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';

/**
 * Panel card component for grouping related content with title, subtitle,
 * actions toolbar, and collapsible body. Used across all dashboard and
 * management screens for consistent content grouping.
 *
 * @param {object} props
 * @param {string} [props.title] - Panel title displayed in the header
 * @param {string} [props.subtitle] - Subtitle or description displayed below the title
 * @param {React.ReactNode} [props.actions] - Action elements (buttons, dropdowns) rendered in the header toolbar
 * @param {React.ReactNode} [props.icon] - Icon element rendered before the title
 * @param {boolean} [props.collapsible=false] - Whether the panel body can be collapsed
 * @param {boolean} [props.defaultCollapsed=false] - Whether the panel starts in a collapsed state (uncontrolled)
 * @param {boolean} [props.collapsed] - Controlled collapsed state
 * @param {function(boolean): void} [props.onCollapsedChange] - Callback when collapsed state changes
 * @param {boolean} [props.noPadding=false] - Whether to remove default body padding
 * @param {boolean} [props.noBorder=false] - Whether to remove the header bottom border
 * @param {string} [props.headerClassName] - Additional class names for the header section
 * @param {string} [props.bodyClassName] - Additional class names for the body section
 * @param {string} [props.className] - Additional class names for the card container
 * @param {React.ReactNode} [props.children] - Panel body content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const PanelCard = forwardRef(function PanelCard(
  {
    title,
    subtitle,
    actions,
    icon,
    info,
    collapsible = false,
    defaultCollapsed = false,
    collapsed: controlledCollapsed,
    onCollapsedChange,
    noPadding = false,
    noBorder = false,
    headerClassName,
    bodyClassName,
    className,
    children,
    ...props
  },
  ref
) {
  const isControlled = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const handleToggleCollapse = useCallback(() => {
    if (!collapsible) {
      return;
    }

    const nextCollapsed = !isCollapsed;

    if (!isControlled) {
      setInternalCollapsed(nextCollapsed);
    }

    if (typeof onCollapsedChange === 'function') {
      onCollapsedChange(nextCollapsed);
    }
  }, [collapsible, isCollapsed, isControlled, onCollapsedChange]);

  const hasHeader = title || subtitle || actions || icon;

  return (
    <Card
      ref={ref}
      className={cn('overflow-hidden', className)}
      {...props}
    >
      {hasHeader ? (
        <div
          className={cn(
            'flex items-start justify-between gap-3 p-4',
            !noBorder && children ? 'border-b border-slate-200' : '',
            isCollapsed && !noBorder ? 'border-b-0' : '',
            headerClassName
          )}
        >
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            {icon ? (
              <span className="shrink-0 mt-0.5 text-slate-400" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <div className="flex flex-col gap-0.5 min-w-0">
              {title ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3 className="text-base font-semibold leading-tight text-slate-900 truncate">
                    {title}
                  </h3>
                  {info ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500"
                          aria-label={typeof info === 'string' ? info : `About ${title}`}
                        >
                          <Info className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">{info}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              ) : null}
              {subtitle ? (
                <p className="text-sm text-slate-500 line-clamp-2">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actions ? (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            ) : null}
            {collapsible ? (
              <button
                type="button"
                onClick={handleToggleCollapse}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2'
                )}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isCollapsed ? '-rotate-90' : 'rotate-0'
                  )}
                  aria-hidden="true"
                />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {isCollapsed ? null : (
        <div
          className={cn(
            noPadding ? '' : 'p-4',
            hasHeader && !noPadding ? 'pt-3' : '',
            bodyClassName
          )}
        >
          {children}
        </div>
      )}
    </Card>
  );
});

PanelCard.displayName = 'PanelCard';

PanelCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  icon: PropTypes.node,
  info: PropTypes.node,
  collapsible: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapsedChange: PropTypes.func,
  noPadding: PropTypes.bool,
  noBorder: PropTypes.bool,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { PanelCard };
export default PanelCard;