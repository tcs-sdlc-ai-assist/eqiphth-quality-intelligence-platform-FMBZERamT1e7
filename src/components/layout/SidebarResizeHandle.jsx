import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from '@/context/NavigationContext';

const RESIZE_STEP = 16;

/**
 * A draggable vertical handle pinned to a sidebar's trailing edge, letting
 * the user resize the sidebar by dragging (mouse/touch via Pointer Events)
 * or with the arrow keys when focused. Purely presentational — width state
 * and clamping/persistence live in `NavigationContext`.
 *
 * @param {object} props
 * @param {number} props.width - Current sidebar width in px (drag start reference)
 * @param {(nextWidth: number) => void} props.onResize - Called with the proposed next width
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement}
 */
function SidebarResizeHandle({ width, onResize, className }) {
  const draggingRef = useRef(false);

  const handlePointerDown = useCallback(
    (event) => {
      event.preventDefault();
      draggingRef.current = true;
      const startX = event.clientX;
      const startWidth = width;
      const prevCursor = document.body.style.cursor;
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const handlePointerMove = (moveEvent) => {
        if (!draggingRef.current) return;
        onResize(startWidth + (moveEvent.clientX - startX));
      };
      const handlePointerUp = () => {
        draggingRef.current = false;
        document.body.style.cursor = prevCursor;
        document.body.style.userSelect = prevUserSelect;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [width, onResize]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onResize(width - RESIZE_STEP);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onResize(width + RESIZE_STEP);
      }
    },
    [width, onResize]
  );

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={width}
      aria-valuemin={SIDEBAR_MIN_WIDTH}
      aria-valuemax={SIDEBAR_MAX_WIDTH}
      aria-label="Resize sidebar"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={cn(
        'group absolute inset-y-0 -right-1 z-10 hidden w-2.5 cursor-col-resize touch-none lg:block',
        'focus-visible:outline-none',
        className
      )}
    >
      <div className="mx-auto h-full w-px bg-transparent transition-colors group-hover:bg-humana-green-400/60 group-focus-visible:bg-humana-green-400" />
    </div>
  );
}

SidebarResizeHandle.propTypes = {
  width: PropTypes.number.isRequired,
  onResize: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export { SidebarResizeHandle };
export default SidebarResizeHandle;
