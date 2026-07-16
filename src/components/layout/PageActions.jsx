import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useNavigation } from '@/context/NavigationContext';

/**
 * Renders its children into the TopHeader's page-actions slot (far right of the
 * navbar) via a portal, so a page can place controls (e.g. a date-range filter)
 * in the navbar without the shared header knowing about page-specific state.
 * Renders nothing until the slot is mounted.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Controls to render in the navbar
 * @returns {React.ReactElement|null}
 */
export function PageActions({ children }) {
  const { pageActionsEl } = useNavigation();
  if (!pageActionsEl) {
    return null;
  }
  return createPortal(children, pageActionsEl);
}

PageActions.propTypes = {
  children: PropTypes.node,
};

export default PageActions;
