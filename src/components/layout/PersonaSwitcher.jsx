import { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Check, Search, X, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

/** Dummy profile photo for the navbar profile trigger (same source as Application Master). */
const profilePhoto = (name) => `https://i.pravatar.cc/96?u=${encodeURIComponent(name || 'user')}`;

/**
 * Groups personas by segment for organized display.
 *
 * @param {import('@/data/personas').Persona[]} personas - Array of persona objects
 * @returns {Object<string, import('@/data/personas').Persona[]>} Personas grouped by segment
 */
function groupPersonasBySegment(personas) {
  const groups = {};
  for (const persona of personas) {
    const segment = persona.segment || 'Other';
    if (!groups[segment]) {
      groups[segment] = [];
    }
    groups[segment].push(persona);
  }
  return groups;
}

/**
 * Filters personas by search query matching name, role, or segment.
 *
 * @param {import('@/data/personas').Persona[]} personas - Array of persona objects
 * @param {string} query - Search query string
 * @returns {import('@/data/personas').Persona[]} Filtered personas
 */
function filterPersonas(personas, query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return personas;
  }
  const lowerQuery = query.toLowerCase().trim();
  return personas.filter((persona) => {
    const name = (persona.name || '').toLowerCase();
    const role = (persona.role || '').toLowerCase();
    const segment = (persona.segment || '').toLowerCase();
    return (
      name.includes(lowerQuery) ||
      role.includes(lowerQuery) ||
      segment.includes(lowerQuery)
    );
  });
}

/**
 * Resolves a segment color token for badge display.
 *
 * @param {string} segment - Segment name
 * @returns {'primary'|'info'|'warning'|'error'|'neutral'|'success'} Badge variant
 */
function getSegmentBadgeVariant(segment) {
  switch (segment) {
    case 'Enterprise':
      return 'primary';
    case 'Medicare':
      return 'info';
    case 'Medicaid':
      return 'warning';
    case 'Commercial':
      return 'neutral';
    case 'External':
      return 'error';
    case 'Compliance':
      return 'success';
    default:
      return 'neutral';
  }
}

/**
 * Individual persona option item within the dropdown list.
 *
 * @param {object} props
 * @param {import('@/data/personas').Persona} props.persona - The persona to display
 * @param {boolean} props.isSelected - Whether this persona is currently selected
 * @param {function(string): void} props.onSelect - Callback when this persona is selected
 * @param {boolean} props.isFocused - Whether this item has keyboard focus
 * @returns {React.ReactElement}
 */
function PersonaOption({ persona, isSelected, onSelect, isFocused }) {
  const handleClick = useCallback(() => {
    onSelect(persona.id);
  }, [onSelect, persona.id]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(persona.id);
      }
    },
    [onSelect, persona.id]
  );

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200',
        'hover:bg-humana-green-50 hover:text-humana-green-900',
        'focus:bg-humana-green-50 focus:text-humana-green-900 focus:outline-none',
        isSelected && 'bg-humana-green-50/50',
        isFocused && 'bg-humana-green-50 text-humana-green-900'
      )}
      tabIndex={-1}
      data-persona-id={persona.id}
    >
      <Avatar
        name={persona.name}
        size="sm"
        className="shrink-0"
      />
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-sm font-medium text-slate-900 truncate">
          {persona.name}
        </span>
        <span className="text-2xs text-slate-500 truncate">
          {persona.role}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant={getSegmentBadgeVariant(persona.segment)}
          size="sm"
        >
          {persona.segment}
        </Badge>
        {isSelected ? (
          <Check
            className="h-4 w-4 text-humana-green-500 shrink-0"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </button>
  );
}

PersonaOption.propTypes = {
  persona: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
};

/**
 * PersonaSwitcher component providing an accessible dropdown for selecting
 * any of the 24+ personas in the EQIP Quality Platform. Displays the current
 * persona name, role, and avatar. On change, updates PersonaContext, triggers
 * UI re-render across all screens, and logs a simulated audit event.
 *
 * Supports keyboard navigation (ArrowUp/ArrowDown/Enter/Escape), search
 * filtering, segment grouping, and ARIA roles for accessibility compliance.
 *
 * @param {object} props
 * @param {'compact'|'full'} [props.variant='full'] - Display variant (compact shows avatar only, full shows name and role)
 * @param {string} [props.className] - Additional class names for the outer container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const PersonaSwitcher = forwardRef(function PersonaSwitcher(
  { variant = 'full', className, ...props },
  ref
) {
  const { currentPersona, setPersona, allPersonas } = usePersona();
  const { logEvent } = useAuditLog();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const filteredPersonas = useMemo(() => {
    return filterPersonas(allPersonas, searchQuery);
  }, [allPersonas, searchQuery]);

  const groupedPersonas = useMemo(() => {
    return groupPersonasBySegment(filteredPersonas);
  }, [filteredPersonas]);

  const flatFilteredList = useMemo(() => {
    const result = [];
    const segmentOrder = ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'];
    const sortedSegments = Object.keys(groupedPersonas).sort((a, b) => {
      const aIdx = segmentOrder.indexOf(a);
      const bIdx = segmentOrder.indexOf(b);
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
    for (const segment of sortedSegments) {
      const personas = groupedPersonas[segment];
      for (const persona of personas) {
        result.push(persona);
      }
    }
    return result;
  }, [groupedPersonas]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setSearchQuery('');
    setFocusedIndex(-1);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchQuery('');
    setFocusedIndex(-1);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  const handleToggle = useCallback(() => {
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [open, handleOpen, handleClose]);

  const handleSelect = useCallback(
    (personaId) => {
      if (!personaId || personaId === currentPersona.id) {
        handleClose();
        return;
      }

      const previousPersonaId = currentPersona.id;
      const previousPersonaName = currentPersona.name;

      setPersona(personaId);

      const selectedPersona = allPersonas.find((p) => p.id === personaId);
      const selectedName = selectedPersona ? selectedPersona.name : personaId;
      const selectedRole = selectedPersona ? selectedPersona.role : '';

      logEvent('persona_switch', {
        action: 'Persona Switched',
        details: `Persona switched from "${previousPersonaName}" (${previousPersonaId}) to "${selectedName}" (${personaId}, ${selectedRole}) via PersonaSwitcher.`,
        personaId: personaId,
        personaName: selectedName,
        resource: '',
        outcome: 'success',
        segment: selectedPersona ? selectedPersona.segment : '',
      });

      if (selectedPersona && selectedPersona.landingPage) {
        navigate(selectedPersona.landingPage);
      }

      handleClose();
    },
    [currentPersona, setPersona, allPersonas, logEvent, handleClose, navigate]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setFocusedIndex(-1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setFocusedIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (!open) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleOpen();
        }
        return;
      }

      switch (e.key) {
        case 'Escape': {
          e.preventDefault();
          handleClose();
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= flatFilteredList.length ? 0 : next;
          });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? flatFilteredList.length - 1 : next;
          });
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < flatFilteredList.length) {
            handleSelect(flatFilteredList[focusedIndex].id);
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          setFocusedIndex(0);
          break;
        }
        case 'End': {
          e.preventDefault();
          setFocusedIndex(flatFilteredList.length - 1);
          break;
        }
        default:
          break;
      }
    },
    [open, handleOpen, handleClose, handleSelect, flatFilteredList, focusedIndex]
  );

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-persona-id]');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        handleClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, handleClose]);

  const isCompact = variant === 'compact';
  const isProfile = variant === 'profile';

  const segmentOrder = ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'];
  const sortedSegmentKeys = useMemo(() => {
    return Object.keys(groupedPersonas).sort((a, b) => {
      const aIdx = segmentOrder.indexOf(a);
      const bIdx = segmentOrder.indexOf(b);
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
  }, [groupedPersonas]);

  let flatIndex = -1;

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {/* Simulation label */}
      {!isCompact && !isProfile ? (
        <div className="flex items-center gap-1.5 mb-1">
          <Shield className="h-3 w-3 text-humana-green-500" aria-hidden="true" />
          <span className="text-2xs font-medium text-humana-green-600 uppercase tracking-wider select-none">
            Persona Simulation
          </span>
        </div>
      ) : null}

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-2.5 rounded-lg transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
          isProfile
            ? cn('py-1 pl-1 pr-1.5 hover:bg-slate-100', open && 'bg-slate-100')
            : cn(
                'border bg-white border-slate-200 hover:border-slate-300',
                isCompact ? 'p-1.5' : 'px-3 py-2 w-full',
                open && 'border-humana-green-500 ring-2 ring-humana-green-500 ring-offset-2'
              )
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Current persona: ${currentPersona.name}, ${currentPersona.role}. Click to switch persona.`}
      >
        <Avatar
          src={isProfile ? profilePhoto(currentPersona.name) : undefined}
          name={currentPersona.name}
          size={isProfile ? 'md' : 'sm'}
          className="shrink-0"
        />
        {!isCompact ? (
          <div className={cn('flex flex-col gap-0 min-w-0 text-left', isProfile ? 'hidden sm:flex' : 'flex-1')}>
            <span className="text-sm font-medium text-slate-900 truncate">
              {currentPersona.name}
            </span>
            <span className="text-2xs text-slate-500 truncate">
              {currentPersona.role}
            </span>
          </div>
        ) : null}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      {open ? (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 sm:hidden"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-50 mt-1 w-80 max-h-[28rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-dropdown',
              'animate-scale-in',
              isCompact || isProfile ? 'right-0' : 'left-0'
            )}
            role="dialog"
            aria-label="Select a persona"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5">
              <Users className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-sm font-semibold text-slate-900">
                Switch Persona
              </span>
              <span className="text-2xs text-slate-400 ml-auto">
                {allPersonas.length} available
              </span>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-slate-100">
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by name, role, or segment..."
                  className={cn(
                    'flex h-8 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-8 text-xs text-slate-900 transition-colors duration-200',
                    'placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2 focus:ring-humana-green-500 focus:ring-offset-1 focus:border-humana-green-500 focus:bg-white'
                  )}
                  aria-label="Search personas"
                  autoComplete="off"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear search"
                    tabIndex={-1}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Persona list */}
            <div
              ref={listRef}
              className="overflow-y-auto max-h-[20rem] p-1.5"
              role="listbox"
              aria-label="Available personas"
            >
              {flatFilteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-1.5 py-6">
                  <Search className="h-6 w-6 text-slate-300" aria-hidden="true" />
                  <p className="text-xs text-slate-500">
                    No personas match &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              ) : (
                sortedSegmentKeys.map((segment) => {
                  const segmentPersonas = groupedPersonas[segment];
                  if (!segmentPersonas || segmentPersonas.length === 0) {
                    return null;
                  }

                  return (
                    <div key={segment} className="mb-1 last:mb-0">
                      <div className="px-3 py-1.5">
                        <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                          {segment}
                        </span>
                      </div>
                      {segmentPersonas.map((persona) => {
                        flatIndex++;
                        const currentFlatIndex = flatFilteredList.findIndex(
                          (p) => p.id === persona.id
                        );
                        return (
                          <PersonaOption
                            key={persona.id}
                            persona={persona}
                            isSelected={persona.id === currentPersona.id}
                            onSelect={handleSelect}
                            isFocused={currentFlatIndex === focusedIndex}
                          />
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-3 py-2">
              <p className="text-2xs text-slate-400 text-center">
                Simulated persona switching for demonstration purposes
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
});

PersonaSwitcher.displayName = 'PersonaSwitcher';

PersonaSwitcher.propTypes = {
  variant: PropTypes.oneOf(['compact', 'full', 'profile']),
  className: PropTypes.string,
};

export { PersonaSwitcher };
export default PersonaSwitcher;