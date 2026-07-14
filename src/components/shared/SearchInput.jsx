import { forwardRef, useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Loader2 } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';
import { Input } from '@/components/ui/Input';

/**
 * Search input component with debounced search, clear button, and search icon.
 * Used for entity search across all list screens. Supports controlled and
 * uncontrolled usage with configurable debounce delay.
 *
 * @param {object} props
 * @param {string} [props.value] - Controlled search value
 * @param {string} [props.defaultValue=''] - Default search value for uncontrolled usage
 * @param {function(string): void} [props.onSearch] - Callback fired after debounce with the current search value
 * @param {function(string): void} [props.onChange] - Callback fired immediately on every input change (before debounce)
 * @param {function(): void} [props.onClear] - Callback fired when the clear button is clicked
 * @param {function(React.FormEvent): void} [props.onSubmit] - Callback fired when Enter is pressed
 * @param {number} [props.debounceMs=300] - Debounce delay in milliseconds
 * @param {string} [props.placeholder='Search...'] - Placeholder text
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Input size variant
 * @param {boolean} [props.loading=false] - Whether a search is currently in progress
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {boolean} [props.autoFocus=false] - Whether the input should be focused on mount
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.label] - Label text displayed above the input
 * @param {string} [props.className] - Additional class names for the outer wrapper
 * @param {string} [props.inputClassName] - Additional class names for the input element
 * @param {string} [props.ariaLabel] - Accessible label for the search input
 * @param {React.Ref} ref - Forwarded ref applied to the input element
 * @returns {React.ReactElement}
 */
const SearchInput = forwardRef(function SearchInput(
  {
    value: controlledValue,
    defaultValue = '',
    onSearch,
    onChange,
    onClear,
    onSubmit,
    debounceMs = 300,
    placeholder = 'Search...',
    size,
    loading = false,
    disabled = false,
    autoFocus = false,
    id,
    label,
    className,
    inputClassName,
    ariaLabel,
    ...props
  },
  ref
) {
  const isControlled = controlledValue !== undefined && controlledValue !== null;
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = isControlled ? controlledValue : internalValue;

  const debouncedSearchRef = useRef(null);

  useEffect(() => {
    if (typeof onSearch === 'function') {
      debouncedSearchRef.current = debounce((searchValue) => {
        onSearch(searchValue);
      }, debounceMs);
    }

    return () => {
      if (debouncedSearchRef.current && typeof debouncedSearchRef.current.cancel === 'function') {
        debouncedSearchRef.current.cancel();
      }
    };
  }, [onSearch, debounceMs]);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (typeof onChange === 'function') {
        onChange(newValue);
      }

      if (debouncedSearchRef.current) {
        debouncedSearchRef.current(newValue);
      }
    },
    [isControlled, onChange]
  );

  const handleClear = useCallback(() => {
    if (disabled) {
      return;
    }

    if (!isControlled) {
      setInternalValue('');
    }

    if (typeof onChange === 'function') {
      onChange('');
    }

    if (typeof onClear === 'function') {
      onClear();
    }

    if (debouncedSearchRef.current && typeof debouncedSearchRef.current.cancel === 'function') {
      debouncedSearchRef.current.cancel();
    }

    if (typeof onSearch === 'function') {
      onSearch('');
    }
  }, [disabled, isControlled, onChange, onClear, onSearch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();

        if (debouncedSearchRef.current && typeof debouncedSearchRef.current.cancel === 'function') {
          debouncedSearchRef.current.cancel();
        }

        if (typeof onSearch === 'function') {
          onSearch(currentValue);
        }

        if (typeof onSubmit === 'function') {
          onSubmit(e);
        }
      }

      if (e.key === 'Escape' && currentValue) {
        handleClear();
      }
    },
    [currentValue, onSearch, onSubmit, handleClear]
  );

  const showClear = currentValue && currentValue.length > 0 && !disabled;

  const rightIcon = loading ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" aria-hidden="true" />
  ) : showClear ? (
    <button
      type="button"
      onClick={handleClear}
      className={cn(
        'pointer-events-auto cursor-pointer text-slate-400 hover:text-slate-600 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1 rounded-sm'
      )}
      aria-label="Clear search"
      tabIndex={-1}
    >
      <X className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  ) : null;

  return (
    <div className={cn('relative', className)} role="search" aria-label={ariaLabel || 'Search'}>
      <Input
        ref={ref}
        id={id}
        label={label}
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        autoFocus={autoFocus}
        iconLeft={<Search className="h-4 w-4" />}
        iconRight={rightIcon}
        className={inputClassName}
        aria-label={ariaLabel || placeholder || 'Search'}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

SearchInput.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSubmit: PropTypes.func,
  debounceMs: PropTypes.number,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export { SearchInput };
export default SearchInput;