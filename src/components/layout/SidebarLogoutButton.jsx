import PropTypes from 'prop-types';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '@/context/PersonaContext';
import { cn } from '@/lib/utils';

/**
 * Sign-out button rendered in the sidebar footer (next to the Humana wordmark).
 * Replaces the former top-header logout control.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @returns {React.ReactElement}
 */
export function SidebarLogoutButton({ className }) {
  const { logout } = usePersona();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      title="Sign out"
      aria-label="Sign out"
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-400/70',
        className
      )}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

SidebarLogoutButton.propTypes = {
  className: PropTypes.string,
};

export default SidebarLogoutButton;
