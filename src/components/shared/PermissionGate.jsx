import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { usePersona } from '@/context/PersonaContext';
import { cn } from '@/lib/utils';

/**
 * Determines the render behavior when the user lacks the required permission.
 *
 * - 'hidden': Children are not rendered at all (default).
 * - 'disabled': Children are rendered but wrapped in a container with
 *   pointer-events disabled and reduced opacity.
 * - 'placeholder': A custom fallback element is rendered instead of children.
 *
 * @typedef {'hidden'|'disabled'|'placeholder'} UnauthorizedBehavior
 */

/**
 * PermissionGate component that conditionally renders children based on
 * the current persona's permissions. Accepts a single required permission
 * action or an array of required actions. Supports multiple unauthorized
 * behaviors: hide, disable, or render a placeholder fallback.
 *
 * Used to wrap action buttons, form controls, and sensitive UI elements
 * across all screens to enforce role-based access control in the UI.
 *
 * @param {object} props
 * @param {string|string[]} props.requiredAction - A single permission action key or an array of permission action keys required to render children. When an array is provided, behavior depends on the `matchAll` prop.
 * @param {boolean} [props.matchAll=false] - When `requiredAction` is an array, if true ALL permissions must be present; if false ANY single permission is sufficient.
 * @param {'hidden'|'disabled'|'placeholder'} [props.behavior='hidden'] - How to handle unauthorized access: 'hidden' removes children from the DOM, 'disabled' renders children with disabled styling, 'placeholder' renders the fallback prop instead.
 * @param {React.ReactNode} [props.fallback=null] - Fallback content rendered when behavior is 'placeholder' and the user lacks permission.
 * @param {string} [props.className] - Additional class names applied to the wrapper element when behavior is 'disabled'.
 * @param {string} [props.disabledClassName] - Custom class names for the disabled wrapper (overrides default disabled styling).
 * @param {React.ReactNode} props.children - The content to conditionally render based on permissions.
 * @param {React.Ref} ref - Forwarded ref applied to the wrapper element when behavior is 'disabled'.
 * @returns {React.ReactElement|null}
 */
const PermissionGate = forwardRef(function PermissionGate(
  {
    requiredAction,
    matchAll = false,
    behavior = 'hidden',
    fallback = null,
    className,
    disabledClassName,
    children,
    ...props
  },
  ref
) {
  const { hasPermission } = usePersona();

  /**
   * Evaluates whether the current persona has the required permission(s).
   *
   * @returns {boolean} True if the persona is authorized
   */
  function isAuthorized() {
    if (!requiredAction) {
      return true;
    }

    if (typeof requiredAction === 'string') {
      return hasPermission(requiredAction);
    }

    if (Array.isArray(requiredAction)) {
      if (requiredAction.length === 0) {
        return true;
      }

      if (matchAll) {
        return requiredAction.every((action) => hasPermission(action));
      }

      return requiredAction.some((action) => hasPermission(action));
    }

    return false;
  }

  const authorized = isAuthorized();

  if (authorized) {
    return children;
  }

  switch (behavior) {
    case 'disabled': {
      return (
        <div
          ref={ref}
          className={cn(
            disabledClassName ||
              'pointer-events-none opacity-50 cursor-not-allowed select-none',
            className
          )}
          aria-disabled="true"
          {...props}
        >
          {children}
        </div>
      );
    }

    case 'placeholder': {
      return fallback || null;
    }

    case 'hidden':
    default: {
      return null;
    }
  }
});

PermissionGate.displayName = 'PermissionGate';

PermissionGate.propTypes = {
  requiredAction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  matchAll: PropTypes.bool,
  behavior: PropTypes.oneOf(['hidden', 'disabled', 'placeholder']),
  fallback: PropTypes.node,
  className: PropTypes.string,
  disabledClassName: PropTypes.string,
  children: PropTypes.node,
};

export { PermissionGate };
export default PermissionGate;