import { forwardRef, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Download,
  Columns3,
  X,
  Check,
  FileDown,
  FileJson,
} from 'lucide-react';
import { cn, downloadCSV, downloadJSON } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import {
  Select,
} from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Renders a sort indicator icon based on the current sort direction.
 *
 * @param {object} props
 * @param {false|'asc'|'desc'} props.direction - Current sort direction
 * @returns {React.ReactElement}
 */
function SortIcon({ direction }) {
  if (direction === 'asc') {
    return <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />;
  }
  if (direction === 'desc') {
    return <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />;
  }
  return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />;
}

SortIcon.propTypes = {
  direction: PropTypes.oneOf([false, 'asc', 'desc']),
};

/**
 * Pagination info component showing current range and total.
 *
 * @param {object} props
 * @param {import('@tanstack/react-table').Table} props.table - Table instance
 * @returns {React.ReactElement}
 */
function PaginationInfo({ table }) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;

  if (totalRows === 0) {
    return <span className="text-sm text-slate-500">No results</span>;
  }

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <span className="text-sm text-slate-500">
      Showing {start}–{end} of {totalRows}
    </span>
  );
}

PaginationInfo.propTypes = {
  table: PropTypes.object.isRequired,
};

/**
 * Page size selector component.
 *
 * @param {object} props
 * @param {number} props.pageSize - Current page size
 * @param {function(number): void} props.onPageSizeChange - Callback when page size changes
 * @param {number[]} props.pageSizeOptions - Available page size options
 * @returns {React.ReactElement}
 */
function PageSizeSelector({ pageSize, onPageSizeChange, pageSizeOptions }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 whitespace-nowrap">Rows per page</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className={cn(
          'h-8 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
          'hover:border-slate-400 transition-colors duration-200'
        )}
        aria-label="Rows per page"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}

PageSizeSelector.propTypes = {
  pageSize: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

/**
 * Loading skeleton for the data table.
 *
 * @param {object} props
 * @param {number} props.columnCount - Number of columns
 * @param {number} props.rowCount - Number of skeleton rows
 * @returns {React.ReactElement}
 */
function DataTableSkeleton({ columnCount, rowCount }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading table data" aria-busy="true">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.from({ length: columnCount }).map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

DataTableSkeleton.propTypes = {
  columnCount: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/**
 * Empty state component for when no data matches filters.
 *
 * @param {object} props
 * @param {number} props.columnCount - Number of columns for colspan
 * @param {string} [props.message] - Custom empty state message
 * @returns {React.ReactElement}
 */
function EmptyState({ columnCount, message }) {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <Search className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <p className="text-sm text-slate-500">
            {message || 'No results found.'}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

EmptyState.propTypes = {
  columnCount: PropTypes.number.isRequired,
  message: PropTypes.string,
};

/**
 * Reusable DataTable component wrapping @tanstack/react-table with sorting,
 * filtering, pagination, column visibility, row selection, and export actions.
 * Accessible with keyboard navigation and ARIA attributes.
 *
 * @param {object} props
 * @param {import('@tanstack/react-table').ColumnDef[]} props.columns - Column definitions for the table
 * @param {object[]} props.data - Array of data objects to display
 * @param {boolean} [props.loading=false] - Whether the table is in a loading state
 * @param {boolean} [props.enableSorting=true] - Whether column sorting is enabled
 * @param {boolean} [props.enableFiltering=true] - Whether global filtering is enabled
 * @param {boolean} [props.enablePagination=true] - Whether pagination is enabled
 * @param {boolean} [props.enableColumnVisibility=true] - Whether column visibility toggle is enabled
 * @param {boolean} [props.enableRowSelection=false] - Whether row selection is enabled
 * @param {boolean} [props.enableExport=false] - Whether export actions are enabled
 * @param {number} [props.pageSize=10] - Default page size
 * @param {number[]} [props.pageSizeOptions=[10, 25, 50, 100]] - Available page size options
 * @param {string} [props.searchPlaceholder='Search...'] - Placeholder text for the search input
 * @param {string} [props.emptyMessage] - Custom message when no results are found
 * @param {string} [props.exportFilename='export'] - Base filename for exports (without extension)
 * @param {function(object[]): void} [props.onRowSelectionChange] - Callback when row selection changes
 * @param {function(object): void} [props.onRowClick] - Callback when a row is clicked
 * @param {React.ReactNode} [props.toolbarActions] - Additional action elements rendered in the toolbar
 * @param {string} [props.className] - Additional class names for the container
 * @param {string} [props.tableClassName] - Additional class names for the table element
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const DataTable = forwardRef(function DataTable(
  {
    columns,
    data,
    loading = false,
    enableSorting = true,
    enableFiltering = true,
    enablePagination = true,
    enableColumnVisibility = true,
    enableRowSelection = false,
    enableExport = false,
    pageSize: defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    searchPlaceholder = 'Search...',
    emptyMessage,
    exportFilename = 'export',
    onRowSelectionChange,
    onRowClick,
    toolbarActions,
    className,
    tableClassName,
    ...props
  },
  ref
) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const resolvedColumns = useMemo(() => {
    if (!enableRowSelection) {
      return columns;
    }

    const selectionColumn = {
      id: '_select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows on this page"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select row ${row.index + 1}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data: data || [],
    columns: resolvedColumns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    enableRowSelection,
    enableSorting,
    enableFiltering: enableFiltering,
    enableColumnResizing: false,
  });

  useEffect(() => {
    if (typeof onRowSelectionChange === 'function') {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  const handleRowClick = useCallback(
    (row, event) => {
      if (typeof onRowClick !== 'function') {
        return;
      }
      const target = event.target;
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('a') ||
        target.closest('[role="checkbox"]')
      ) {
        return;
      }
      onRowClick(row.original);
    },
    [onRowClick]
  );

  const handleRowKeyDown = useCallback(
    (row, event) => {
      if (typeof onRowClick !== 'function') {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onRowClick(row.original);
      }
    },
    [onRowClick]
  );

  const handleExportCSV = useCallback(() => {
    const rows = table.getFilteredRowModel().rows;
    const visibleColumns = table
      .getAllColumns()
      .filter((col) => col.getIsVisible() && col.id !== '_select');

    const exportData = rows.map((row) => {
      const rowData = {};
      for (const col of visibleColumns) {
        const value = row.getValue(col.id);
        const header =
          typeof col.columnDef.header === 'string'
            ? col.columnDef.header
            : col.id;
        rowData[header] = value ?? '';
      }
      return rowData;
    });

    downloadCSV(exportData, `${exportFilename}.csv`);
  }, [table, exportFilename]);

  const handleExportJSON = useCallback(() => {
    const rows = table.getFilteredRowModel().rows;
    const exportData = rows.map((row) => row.original);
    downloadJSON(exportData, `${exportFilename}.json`);
  }, [table, exportFilename]);

  const handleClearFilter = useCallback(() => {
    setGlobalFilter('');
  }, []);

  const handlePageSizeChange = useCallback(
    (newSize) => {
      setPagination((prev) => ({
        ...prev,
        pageSize: newSize,
        pageIndex: 0,
      }));
    },
    []
  );

  const selectedCount = Object.keys(rowSelection).length;
  const hasToolbar =
    enableFiltering ||
    enableColumnVisibility ||
    enableExport ||
    toolbarActions ||
    (enableRowSelection && selectedCount > 0);

  if (loading) {
    return (
      <DataTableSkeleton
        columnCount={resolvedColumns.length}
        rowCount={Math.min(defaultPageSize, 5)}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      {/* Toolbar */}
      {hasToolbar ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {enableFiltering ? (
              <div className="relative flex-1 max-w-sm">
                <Input
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder={searchPlaceholder}
                  size="sm"
                  iconLeft={<Search className="h-4 w-4" />}
                  iconRight={
                    globalFilter ? (
                      <button
                        type="button"
                        onClick={handleClearFilter}
                        className="pointer-events-auto cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : null
                  }
                  aria-label="Search table"
                />
              </div>
            ) : null}

            {enableRowSelection && selectedCount > 0 ? (
              <span className="text-sm text-slate-500 whitespace-nowrap">
                {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toolbarActions ? toolbarActions : null}

            {enableColumnVisibility ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    iconLeft={<Columns3 className="h-3.5 w-3.5" />}
                  >
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== 'undefined' &&
                        column.getCanHide()
                    )
                    .map((column) => {
                      const headerValue = column.columnDef.header;
                      const label =
                        typeof headerValue === 'string'
                          ? headerValue
                          : column.id;
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {label}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {enableExport ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    iconLeft={<Download className="h-3.5 w-3.5" />}
                  >
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Export as</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-slate-900 outline-none transition-colors duration-200',
                      'hover:bg-humana-green-50 hover:text-humana-green-900',
                      'focus:bg-humana-green-50 focus:text-humana-green-900'
                    )}
                  >
                    <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-slate-900 outline-none transition-colors duration-200',
                      'hover:bg-humana-green-50 hover:text-humana-green-900',
                      'focus:bg-humana-green-50 focus:text-humana-green-900'
                    )}
                  >
                    <FileJson className="mr-2 h-4 w-4" aria-hidden="true" />
                    JSON
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <Table className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      style={
                        header.column.columnDef.size
                          ? { width: `${header.column.columnDef.size}px` }
                          : undefined
                      }
                      className={cn(
                        canSort && 'cursor-pointer select-none'
                      )}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      onKeyDown={
                        canSort
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                const handler = header.column.getToggleSortingHandler();
                                if (handler) {
                                  handler(e);
                                }
                              }
                            }
                          : undefined
                      }
                      tabIndex={canSort ? 0 : undefined}
                      role={canSort ? 'columnheader' : undefined}
                      aria-sort={
                        sortDirection === 'asc'
                          ? 'ascending'
                          : sortDirection === 'desc'
                            ? 'descending'
                            : canSort
                              ? 'none'
                              : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {canSort ? (
                            <SortIcon direction={sortDirection} />
                          ) : null}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const isClickable = typeof onRowClick === 'function';

                return (
                  <TableRow
                    key={row.id}
                    selected={row.getIsSelected()}
                    className={cn(
                      isClickable && 'cursor-pointer',
                      row.getIsSelected() && 'bg-humana-green-50'
                    )}
                    onClick={
                      isClickable
                        ? (e) => handleRowClick(row, e)
                        : undefined
                    }
                    onKeyDown={
                      isClickable
                        ? (e) => handleRowKeyDown(row, e)
                        : undefined
                    }
                    tabIndex={isClickable ? 0 : undefined}
                    role={isClickable ? 'button' : undefined}
                    aria-selected={
                      enableRowSelection ? row.getIsSelected() : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={
                          cell.column.columnDef.size
                            ? { width: `${cell.column.columnDef.size}px` }
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <EmptyState
                columnCount={resolvedColumns.length}
                message={emptyMessage}
              />
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PaginationInfo table={table} />

          <div className="flex items-center gap-4">
            <PageSizeSelector
              pageSize={pagination.pageSize}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={pageSizeOptions}
            />

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to first page"
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to previous page"
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>

              <span className="text-sm text-slate-600 px-2 whitespace-nowrap">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount() || 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Go to next page"
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Go to last page"
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
});

DataTable.displayName = 'DataTable';

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  enableSorting: PropTypes.bool,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
  enableColumnVisibility: PropTypes.bool,
  enableRowSelection: PropTypes.bool,
  enableExport: PropTypes.bool,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  searchPlaceholder: PropTypes.string,
  emptyMessage: PropTypes.string,
  exportFilename: PropTypes.string,
  onRowSelectionChange: PropTypes.func,
  onRowClick: PropTypes.func,
  toolbarActions: PropTypes.node,
  className: PropTypes.string,
  tableClassName: PropTypes.string,
};

export { DataTable };
export default DataTable;