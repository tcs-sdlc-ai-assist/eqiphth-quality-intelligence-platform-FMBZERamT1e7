import { useEffect, useMemo, useState } from 'react';
import { XCircle, RefreshCw, Bug, CircleSlash } from 'lucide-react';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ROUTES } from '@/lib/constants';

/* Mock data — failed executions awaiting root-cause classification (PRD §5 "Analytics › Executions Triage"). */

const CLASSIFICATION_OPTIONS = [
  { value: '', label: 'Unclassified' },
  { value: 'product_bug', label: 'Product Bug' },
  { value: 'test_issue', label: 'Test Issue' },
  { value: 'environment', label: 'Environment Issue' },
  { value: 'flaky', label: 'Flaky Test' },
];

const CLASSIFICATION_VARIANT = { product_bug: 'error', test_issue: 'warning', environment: 'info', flaky: 'neutral', '': 'neutral' };

const INITIAL_FAILURES = [
  { id: 'EXEC-9031', suite: 'Member Portal - Regression Suite', application: 'Member Portal', environment: 'QA', failureReason: 'Assertion error: Session timeout', classification: '' },
  { id: 'EXEC-9032', suite: 'Claims API Smoke Suite', application: 'Claims Platform', environment: 'Pre-Prod', failureReason: 'No such element exception: Submit button', classification: '' },
  { id: 'EXEC-9033', suite: 'Provider Directory E2E', application: 'Provider Portal', environment: 'SIT', failureReason: 'Timeout waiting for search results', classification: '' },
  { id: 'EXEC-9034', suite: 'Enrollment E2E Flow', application: 'Enrollment System', environment: 'SIT', failureReason: 'Client exception: Network error executing request', classification: '' },
  { id: 'EXEC-9035', suite: 'Billing Batch Validation', application: 'Billing Platform', environment: 'QA', failureReason: 'Expected 200, received 503', classification: '' },
  { id: 'EXEC-9036', suite: 'Pharmacy Formulary API', application: 'Pharmacy Portal', environment: 'Prod', failureReason: 'Data mismatch: formulary price stale', classification: '' },
];

/**
 * Executions Triage — failed test executions awaiting AI/human root-cause
 * classification (Product Bug / Test Issue / Environment Issue / Flaky),
 * per PRD §5 "Analytics › Executions Triage".
 *
 * @returns {React.ReactElement}
 */
function ExecutionsTriagePage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const [failures, setFailures] = useState(INITIAL_FAILURES);

  usePageHeader({ title: 'Executions Triage', subtitle: `Classify failed test executions to separate real defects from flaky tests and environment issues.` });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'Executions Triage' },
    ]);
  }, [setBreadcrumbs]);

  const unclassified = failures.filter((f) => !f.classification).length;
  const productBugs = failures.filter((f) => f.classification === 'product_bug').length;
  const flaky = failures.filter((f) => f.classification === 'flaky').length;

  const classify = (id, classification) => {
    setFailures((prev) => prev.map((f) => (f.id === id ? { ...f, classification } : f)));
    const label = CLASSIFICATION_OPTIONS.find((o) => o.value === classification)?.label || 'Unclassified';
    toast({ variant: 'success', title: 'Execution classified', description: `${id} marked as "${label}".` });
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'Execution', size: 120 },
      { accessorKey: 'suite', header: 'Test Suite' },
      { accessorKey: 'application', header: 'Application', size: 140 },
      { accessorKey: 'environment', header: 'Environment', size: 100 },
      { accessorKey: 'failureReason', header: 'Failure Reason' },
      {
        id: 'classification',
        header: 'Classification',
        size: 220,
        enableSorting: false,
        cell: ({ row }) => {
          const f = row.original;
          return (
            <div className="flex items-center gap-2">
              <Select
                value={f.classification}
                onValueChange={(v) => classify(f.id, v)}
                options={CLASSIFICATION_OPTIONS}
                wrapperClassName="w-40"
              />
              {f.classification ? <Badge variant={CLASSIFICATION_VARIANT[f.classification]} size="sm">{CLASSIFICATION_OPTIONS.find((o) => o.value === f.classification)?.label}</Badge> : null}
            </div>
          );
        },
      },
    ],
    [failures]
  );

  return (
    <div className="flex flex-col gap-6">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Unclassified Failures" value={unclassified} unit="count" icon={<XCircle />} tone="red" />
        <KpiCard label="Product Bugs Found" value={productBugs} unit="count" icon={<Bug />} tone="orange" />
        <KpiCard label="Flaky Tests Flagged" value={flaky} unit="count" icon={<RefreshCw />} tone="purple" />
        <KpiCard label="Total Failures" value={failures.length} unit="count" icon={<CircleSlash />} tone="slate" />
      </div>

      <DataTable
        columns={columns}
        data={failures}
        pageSize={10}
        searchPlaceholder="Search executions, applications..."
        emptyMessage="No failed executions match your search."
      />
    </div>
  );
}

ExecutionsTriagePage.displayName = 'ExecutionsTriagePage';

export { ExecutionsTriagePage };
export default ExecutionsTriagePage;
