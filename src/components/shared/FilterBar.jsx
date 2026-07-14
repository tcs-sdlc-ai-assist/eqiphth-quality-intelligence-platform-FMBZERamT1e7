import { forwardRef, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  X,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  Calendar,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

/**
 * Resolves a display label for a filter value.
 *
 * @param {import('./FilterBar').FilterFieldConfig} field - The filter field config
 * @param {string|string[]} value - The current filter value
 * @returns {string} Display label for the value
 */
function resolveValueLabel(field, value) {
  if (!value) return '';

  if (field.type === 'multiselect' && Array.isArray(value)) {
    return value
      .map((v) => {
        const opt = (field.options || []).find((o) => o.value === v);
        return opt ? opt.label : v;
      })
      .join(', ');
  }

  if (field.type === 'select') {
    const opt = (field.options || []).find((o) => o.value === value);
    return opt ? opt.label : String(value);
  }

  if (field.type === 'daterange' && typeof value === 'object' && value !== null) {
    const from = value.from || '';
    const to = value.to || '';
    if (from && to) return `${from} – ${to}`;
    if (from) return `From ${from}`;
    if (to) return `To ${to}`;
    return '';
  }

  return String(value);
}

/**
 * Checks whether a filter value is considered "active" (non-empty).
 *
 * @param {*} value - The filter value
 * @returns {boolean} True if the value is active
 */
function isActiveValue(value) {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Boolean(value.from || value.to);
  }
  return true;
}

/**
 * Returns the default/empty value for a given field type.
 *
 * @param {string} type - The field type
 * @returns {*} The default empty value
 */
function getEmptyValue(type) {
  switch (type) {
    case 'multiselect':
      return [];
    case 'daterange':
      return { from: '', to: '' };
    case 'select':
    case 'text':
    default:
      return '';
  }
}

/**
 * MultiSelect dropdown component for filter fields.
 *
 * @param {object} props
 * @param {string} props.id - HTML id attribute
 * @param {string} props.label - Display label
 * @param {{ value: string, label: string }[]} props.options - Available options
 * @param {string[]} props.value - Currently selected values
 * @param {function(string[]): void} props.onChange - Callback when selection changes
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.disabled] - Whether the field is disabled
 * @returns {React.ReactElement}
 */
function MultiSelectField({ id, label, options, value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);

  const selectedLabels = useMemo(() => {
    if (!Array.isArray(value) || value.length === 0) return '';
    if (value.length === 1) {
      const opt = options.find((o) => o.value === value[0]);
      return opt ? opt.label : value[0];
    }
    return `${value.length} selected`;
  }, [value, options]);

  const handleToggle = useCallback(
    (optionValue) => {
      if (disabled) return;
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      onChange(next);
    },
    [value, onChange, disabled]
  );

  const handleClearAll = useCallback(
    (e) => {
      e.stopPropagation();
      onChange([]);
    },
    [onChange]
  );

  return (
    <div className="relative">
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none text-slate-700 mb-1.5 block',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-lg border bg-white px-3 text-sm transition-colors duration-200',
          'border-slate-300 hover:border-slate-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
          open && 'border-humana-green-500 ring-2 ring-humana-green-500 ring-offset-2'
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={cn('truncate', !selectedLabels && 'text-slate-400')}>
          {selectedLabels || placeholder || 'Select options'}
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {Array.isArray(value) && value.length > 0 ? (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClearAll}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClearAll(e);
                }
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          ) : null}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-slate-400 transition-transform duration-200',
              open && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className={cn(
              'absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-dropdown',
              'animate-scale-in'
            )}
            role="listbox"
            aria-multiselectable="true"
          >
            {options.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleToggle(option.value)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-slate-900 outline-none transition-colors duration-200',
                    'hover:bg-humana-green-50 hover:text-humana-green-900',
                    'focus:bg-humana-green-50 focus:text-humana-green-900',
                    isSelected && 'bg-humana-green-50/50'
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected ? (
                      <Check className="h-4 w-4 text-humana-green-500" aria-hidden="true" />
                    ) : null}
                  </span>
                  {option.label}
                </button>
              );
            })}
            {options.length === 0 ? (
              <div className="py-2 px-3 text-sm text-slate-500">No options available</div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

MultiSelectField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

/**
 * DateRange field component for filter fields.
 *
 * @param {object} props
 * @param {string} props.id - HTML id attribute
 * @param {string} props.label - Display label
 * @param {{ from: string, to: string }} props.value - Current date range value
 * @param {function({ from: string, to: string }): void} props.onChange - Callback when value changes
 * @param {boolean} [props.disabled] - Whether the field is disabled
 * @returns {React.ReactElement}
 */
function DateRangeField({ id, label, value, onChange, disabled }) {
  const safeValue = value && typeof value === 'object' ? value : { from: '', to: '' };

  const handleFromChange = useCallback(
    (e) => {
      onChange({ ...safeValue, from: e.target.value });
    },
    [safeValue, onChange]
  );

  const handleToChange = useCallback(
    (e) => {
      onChange({ ...safeValue, to: e.target.value });
    },
    [safeValue, onChange]
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          className={cn(
            'text-sm font-medium leading-none text-slate-700',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      ) : null}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={`${id}-from`}
            type="date"
            value={safeValue.from || ''}
            onChange={handleFromChange}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors duration-200',
              'placeholder:text-slate-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'hover:border-slate-400',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50'
            )}
            aria-label={`${label || 'Date'} from`}
          />
        </div>
        <span className="text-sm text-slate-400 shrink-0">to</span>
        <div className="relative flex-1">
          <input
            id={`${id}-to`}
            type="date"
            value={safeValue.to || ''}
            onChange={handleToChange}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors duration-200',
              'placeholder:text-slate-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
              'hover:border-slate-400',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50'
            )}
            aria-label={`${label || 'Date'} to`}
          />
        </div>
      </div>
    </div>
  );
}

DateRangeField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

/**
 * Active filter chip component.
 *
 * @param {object} props
 * @param {string} props.label - Filter field label
 * @param {string} props.displayValue - Display value of the filter
 * @param {function(): void} props.onRemove - Callback to remove this filter
 * @returns {React.ReactElement}
 */
function FilterChip({ label, displayValue, onRemove }) {
  return (
    <Badge
      variant="primary"
      size="sm"
      className="gap-1 pr-1"
    >
      <span className="font-medium">{label}:</span>
      <span className="max-w-[120px] truncate">{displayValue}</span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          'inline-flex items-center justify-center rounded-full p-0.5 transition-colors duration-200',
          'hover:bg-humana-green-200',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-humana-green-500'
        )}
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </Badge>
  );
}

FilterChip.propTypes = {
  label: PropTypes.string.isRequired,
  displayValue: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

/**
 * @typedef {Object} FilterFieldConfig
 * @property {string} id - Unique field identifier used as the filter key
 * @property {string} label - Display label for the field
 * @property {'select'|'multiselect'|'text'|'daterange'} type - Field type
 * @property {{ value: string, label: string }[]} [options] - Options for select/multiselect fields
 * @property {string} [placeholder] - Placeholder text
 * @property {*} [defaultValue] - Default value for the field
 * @property {boolean} [disabled] - Whether the field is disabled
 */

/**
 * Reusable FilterBar component with configurable filter fields (select,
 * date range, text search, multi-select), apply/reset buttons, and active
 * filter chips. Used across all list and dashboard screens.
 *
 * @param {object} props
 * @param {FilterFieldConfig[]} props.fields - Array of filter field configurations
 * @param {Object<string, *>} [props.values] - Controlled filter values (keyed by field id)
 * @param {Object<string, *>} [props.defaultValues] - Default filter values for uncontrolled usage
 * @param {function(Object<string, *>): void} [props.onApply] - Callback when filters are applied
 * @param {function(Object<string, *>): void} [props.onChange] - Callback when any filter value changes (live mode)
 * @param {function(): void} [props.onReset] - Callback when filters are reset
 * @param {boolean} [props.showApplyButton=true] - Whether to show the Apply button
 * @param {boolean} [props.showResetButton=true] - Whether to show the Reset button
 * @param {boolean} [props.showActiveFilters=true] - Whether to show active filter chips
 * @param {boolean} [props.liveMode=false] - Whether to call onChange on every filter change (no Apply button needed)
 * @param {string} [props.applyLabel='Apply Filters'] - Label for the Apply button
 * @param {string} [props.resetLabel='Reset'] - Label for the Reset button
 * @param {React.ReactNode} [props.actions] - Additional action elements rendered in the toolbar
 * @param {'horizontal'|'vertical'} [props.layout='horizontal'] - Layout direction for filter fields
 * @param {string} [props.className] - Additional class names for the container
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const FilterBar = forwardRef(function FilterBar(
  {
    fields,
    values: controlledValues,
    defaultValues,
    onApply,
    onChange,
    onReset,
    showApplyButton = true,
    showResetButton = true,
    showActiveFilters = true,
    liveMode = false,
    applyLabel = 'Apply Filters',
    resetLabel = 'Reset',
    actions,
    layout = 'horizontal',
    className,
    ...props
  },
  ref
) {
  const isControlled = controlledValues !== undefined && controlledValues !== null;

  const initialValues = useMemo(() => {
    if (isControlled) return controlledValues;

    const init = {};
    for (const field of fields) {
      const defaultVal =
        defaultValues && defaultValues[field.id] !== undefined
          ? defaultValues[field.id]
          : field.defaultValue !== undefined
            ? field.defaultValue
            : getEmptyValue(field.type);
      init[field.id] = defaultVal;
    }
    return init;
  }, []);

  const [internalValues, setInternalValues] = useState(initialValues);

  const currentValues = isControlled ? controlledValues : internalValues;

  useEffect(() => {
    if (isControlled) {
      setInternalValues(controlledValues);
    }
  }, [isControlled, controlledValues]);

  const handleFieldChange = useCallback(
    (fieldId, newValue) => {
      const nextValues = { ...currentValues, [fieldId]: newValue };

      if (!isControlled) {
        setInternalValues(nextValues);
      }

      if (liveMode && typeof onChange === 'function') {
        onChange(nextValues);
      }
    },
    [currentValues, isControlled, liveMode, onChange]
  );

  const handleApply = useCallback(() => {
    if (typeof onApply === 'function') {
      onApply(currentValues);
    }
  }, [currentValues, onApply]);

  const handleReset = useCallback(() => {
    const resetValues = {};
    for (const field of fields) {
      const defaultVal =
        defaultValues && defaultValues[field.id] !== undefined
          ? defaultValues[field.id]
          : field.defaultValue !== undefined
            ? field.defaultValue
            : getEmptyValue(field.type);
      resetValues[field.id] = defaultVal;
    }

    if (!isControlled) {
      setInternalValues(resetValues);
    }

    if (typeof onReset === 'function') {
      onReset();
    }

    if (liveMode && typeof onChange === 'function') {
      onChange(resetValues);
    }

    if (!liveMode && typeof onApply === 'function') {
      onApply(resetValues);
    }
  }, [fields, defaultValues, isControlled, onReset, liveMode, onChange, onApply]);

  const handleRemoveFilter = useCallback(
    (fieldId) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) return;

      const emptyVal =
        defaultValues && defaultValues[fieldId] !== undefined
          ? defaultValues[fieldId]
          : field.defaultValue !== undefined
            ? field.defaultValue
            : getEmptyValue(field.type);

      const nextValues = { ...currentValues, [fieldId]: emptyVal };

      if (!isControlled) {
        setInternalValues(nextValues);
      }

      if (liveMode && typeof onChange === 'function') {
        onChange(nextValues);
      }

      if (!liveMode && typeof onApply === 'function') {
        onApply(nextValues);
      }
    },
    [fields, defaultValues, currentValues, isControlled, liveMode, onChange, onApply]
  );

  const activeFilters = useMemo(() => {
    const active = [];
    for (const field of fields) {
      const value = currentValues[field.id];
      const defaultVal =
        defaultValues && defaultValues[field.id] !== undefined
          ? defaultValues[field.id]
          : field.defaultValue !== undefined
            ? field.defaultValue
            : getEmptyValue(field.type);

      if (isActiveValue(value)) {
        const isDefault = JSON.stringify(value) === JSON.stringify(defaultVal);
        if (!isDefault) {
          active.push({
            fieldId: field.id,
            label: field.label,
            displayValue: resolveValueLabel(field, value),
          });
        }
      }
    }
    return active;
  }, [fields, currentValues, defaultValues]);

  const hasActiveFilters = activeFilters.length > 0;

  const showApply = showApplyButton && !liveMode;

  const renderField = useCallback(
    (field) => {
      const value = currentValues[field.id];
      const fieldId = `filter-${field.id}`;

      switch (field.type) {
        case 'select':
          return (
            <Select
              key={field.id}
              id={fieldId}
              label={field.label}
              placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
              options={field.options || []}
              value={value || ''}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              disabled={field.disabled}
              wrapperClassName="min-w-[160px]"
            />
          );

        case 'multiselect':
          return (
            <MultiSelectField
              key={field.id}
              id={fieldId}
              label={field.label}
              options={field.options || []}
              value={Array.isArray(value) ? value : []}
              onChange={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
              disabled={field.disabled}
            />
          );

        case 'daterange':
          return (
            <DateRangeField
              key={field.id}
              id={fieldId}
              label={field.label}
              value={value && typeof value === 'object' ? value : { from: '', to: '' }}
              onChange={(val) => handleFieldChange(field.id, val)}
              disabled={field.disabled}
            />
          );

        case 'text':
        default:
          return (
            <Input
              key={field.id}
              id={fieldId}
              label={field.label}
              placeholder={field.placeholder || `Search ${field.label.toLowerCase()}...`}
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={field.disabled}
              size="md"
              iconLeft={<Search className="h-4 w-4" />}
              iconRight={
                value ? (
                  <button
                    type="button"
                    onClick={() => handleFieldChange(field.id, '')}
                    className="pointer-events-auto cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={`Clear ${field.label}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null
              }
              wrapperClassName="min-w-[180px]"
            />
          );
      }
    },
    [currentValues, handleFieldChange]
  );

  if (!Array.isArray(fields) || fields.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-3', className)}
      role="search"
      aria-label="Filter controls"
      {...props}
    >
      {/* Filter fields and buttons */}
      <div
        className={cn(
          'flex gap-3',
          layout === 'vertical'
            ? 'flex-col'
            : 'flex-col sm:flex-row sm:flex-wrap sm:items-end'
        )}
      >
        {/* Fields */}
        <div
          className={cn(
            'flex gap-3 flex-1 min-w-0',
            layout === 'vertical'
              ? 'flex-col'
              : 'flex-col sm:flex-row sm:flex-wrap sm:items-end'
          )}
        >
          {fields.map((field) => (
            <div
              key={field.id}
              className={cn(
                layout === 'vertical' ? 'w-full' : 'flex-1 min-w-[160px] max-w-xs'
              )}
            >
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-2 shrink-0">
          {showApply ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleApply}
              iconLeft={<Filter className="h-3.5 w-3.5" />}
            >
              {applyLabel}
            </Button>
          ) : null}

          {showResetButton ? (
            <Button
              variant="outline"
              size="md"
              onClick={handleReset}
              iconLeft={<RotateCcw className="h-3.5 w-3.5" />}
              disabled={!hasActiveFilters}
            >
              {resetLabel}
            </Button>
          ) : null}

          {actions ? actions : null}
        </div>
      </div>

      {/* Active filter chips */}
      {showActiveFilters && hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Active filters:</span>
          {activeFilters.map((filter) => (
            <FilterChip
              key={filter.fieldId}
              label={filter.label}
              displayValue={filter.displayValue}
              onRemove={() => handleRemoveFilter(filter.fieldId)}
            />
          ))}
          {activeFilters.length > 1 ? (
            <button
              type="button"
              onClick={handleReset}
              className={cn(
                'text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2 rounded'
              )}
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

FilterBar.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['select', 'multiselect', 'text', 'daterange']).isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      placeholder: PropTypes.string,
      defaultValue: PropTypes.any,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  values: PropTypes.object,
  defaultValues: PropTypes.object,
  onApply: PropTypes.func,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  showApplyButton: PropTypes.bool,
  showResetButton: PropTypes.bool,
  showActiveFilters: PropTypes.bool,
  liveMode: PropTypes.bool,
  applyLabel: PropTypes.string,
  resetLabel: PropTypes.string,
  actions: PropTypes.node,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
};

export { FilterBar };
export default FilterBar;