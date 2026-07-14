import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Table container component with design system styling.
 * Wraps a native HTML table with consistent border, spacing, and overflow handling.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Table content (TableHeader, TableBody, etc.)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const Table = forwardRef(function Table({ className, children, ...props }, ref) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});

Table.displayName = 'Table';

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Table header section component wrapping thead.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - TableRow elements containing TableHead cells
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TableHeader = forwardRef(function TableHeader({ className, children, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn('[&_tr]:border-b', className)}
      {...props}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

TableHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Table body section component wrapping tbody.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - TableRow elements containing TableCell cells
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TableBody = forwardRef(function TableBody({ className, children, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

TableBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Table footer section component wrapping tfoot.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Footer content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TableFooter = forwardRef(function TableFooter({ className, children, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn(
        'border-t bg-slate-50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
});

TableFooter.displayName = 'TableFooter';

TableFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Table row component wrapping tr.
 * Includes hover and selected state styling.
 *
 * @param {object} props
 * @param {boolean} [props.selected=false] - Whether the row is in a selected state
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - TableHead or TableCell elements
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TableRow = forwardRef(function TableRow({ className, selected = false, children, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        'border-b border-slate-200 transition-colors duration-200',
        'hover:bg-slate-50',
        'data-[state=selected]:bg-humana-green-50',
        selected && 'bg-humana-green-50',
        className
      )}
      data-state={selected ? 'selected' : undefined}
      {...props}
    >
      {children}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

TableRow.propTypes = {
  selected: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Table head cell component wrapping th.
 * Used inside TableHeader > TableRow for column headers.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Header cell content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TableHead = forwardRef(function TableHead({ className, children, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle font-medium text-slate-500',
        'whitespace-nowrap text-xs uppercase tracking-wider',
        '[&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
});

TableHead.displayName = 'TableHead';

TableHead.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Table data cell component wrapping td.
 * Used inside TableBody > TableRow for data cells.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Cell content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TableCell = forwardRef(function TableCell({ className, children, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle text-sm text-slate-900',
        '[&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
});

TableCell.displayName = 'TableCell';

TableCell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Table caption component wrapping caption.
 *
 * @param {object} props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} [props.children] - Caption content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const TableCaption = forwardRef(function TableCaption({ className, children, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-slate-500', className)}
      {...props}
    >
      {children}
    </caption>
  );
});

TableCaption.displayName = 'TableCaption';

TableCaption.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};

export default Table;