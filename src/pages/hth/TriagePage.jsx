import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

/* Mock data — untriaged defect queue (PRD §5 "Analytics › Triage"). */

const SEVERITY_VARIANT = { Blocker: 'error', Critical: 'error', High: 'warning', Medium: 'info', Low: 'neutral' };

const INITIAL_QUEUE = [
  { id: 'BUG-4021', summary: 'Session times out mid-checkout on mobile Safari', application: 'Member Portal', severity: 'Critical', reporter: 'Angela Martinez', reported: '2026-07-14', status: 'New' },
  { id: 'BUG-4022', summary: 'Claim status API returns 500 for multi-line claims', application: 'Claims Platform', severity: 'Blocker', reporter: 'Robert Kim', reported: '2026-07-14', status: 'New' },
  { id: 'BUG-4023', summary: 'Provider search results not sorted by distance', application: 'Provider Portal', severity: 'Medium', reporter: 'Priya Patel', reported: '2026-07-13', status: 'New' },
  { id: 'BUG-4024', summary: 'Formulary lookup shows stale pricing after refresh', application: 'Pharmacy Portal', severity: 'High', reporter: 'Andrew Kim', reported: '2026-07-13', status: 'New' },
  { id: 'BUG-4025', summary: 'Duplicate enrollment confirmation email sent twice', application: 'Enrollment System', severity: 'Low', reporter: 'James Wilson', reported: '2026-07-12', status: 'New' },
  { id: 'BUG-4026', summary: 'Billing statement PDF missing plan disclosures', application: 'Billing Platform', severity: 'High', reporter: 'Lisa Thompson', reported: '2026-07-12', status: 'New' },
  { id: 'BUG-4027', summary: 'Care plan dashboard chart labels overlap on load', application: 'Clinical Platform', severity: 'Low', reporter: 'Robert Brown', reported: '2026-07-11', status: 'New' },
];

/**
 * Triage — the incoming defect queue for the QE team to accept (assign
 * severity/owner) or reject (duplicate/not-a-bug), per PRD §5 "Analytics ›
 * Triage". Accept/Reject mutate the in-memory queue and log a toast.
 *
 * @returns {React.ReactElement}
 */
function TriagePage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const [queue, setQueue] = useState(INITIAL_QUEUE);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'Triage' },
    ]);
  }, [setBreadcrumbs]);

  const pending = queue.filter((d) => d.status === 'New');
  const accepted = queue.filter((d) => d.status === 'Accepted').length;
  const rejected = queue.filter((d) => d.status === 'Rejected').length;
  const blockerCount = pending.filter((d) => d.severity === 'Blocker' || d.severity === 'Critical').length;

  const decide = (id, status) => {
    setQueue((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    const item = queue.find((d) => d.id === id);
    toast({
      variant: status === 'Accepted' ? 'success' : 'warning',
      title: status === 'Accepted' ? 'Defect accepted' : 'Defect rejected',
      description: `${item.id} — ${status === 'Accepted' ? 'moved to the active backlog.' : 'marked as duplicate/not-a-bug.'}`,
    });
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 100 },
      { accessorKey: 'summary', header: 'Summary' },
      { accessorKey: 'application', header: 'Application', size: 150 },
      { id: 'severity', header: 'Severity', size: 100, cell: ({ row }) => <Badge variant={SEVERITY_VARIANT[row.original.severity]} size="sm">{row.original.severity}</Badge> },
      { accessorKey: 'reporter', header: 'Reporter', size: 140 },
      { accessorKey: 'reported', header: 'Reported', size: 110 },
      {
        id: 'actions',
        header: 'Triage',
        size: 190,
        enableSorting: false,
        cell: ({ row }) => {
          const d = row.original;
          if (d.status !== 'New') {
            return <Badge variant={d.status === 'Accepted' ? 'success' : 'neutral'} size="sm">{d.status}</Badge>;
          }
          return (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" iconLeft={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => decide(d.id, 'Accepted')}>Accept</Button>
              <Button variant="ghost" size="sm" iconLeft={<XCircle className="h-3.5 w-3.5" />} onClick={() => decide(d.id, 'Rejected')}>Reject</Button>
            </div>
          );
        },
      },
    ],
    [queue]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Triage</h1>
        <p className="text-sm text-slate-500">Review newly reported defects and accept them into the backlog or reject duplicates.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending Triage" value={pending.length} unit="count" icon={<Clock />} tone="orange" />
        <KpiCard label="Blocker / Critical Pending" value={blockerCount} unit="count" icon={<AlertTriangle />} tone="red" />
        <KpiCard label="Accepted Today" value={accepted} unit="count" icon={<CheckCircle2 />} tone="green" />
        <KpiCard label="Rejected Today" value={rejected} unit="count" icon={<XCircle />} tone="slate" />
      </div>

      <DataTable
        columns={columns}
        data={queue}
        pageSize={10}
        searchPlaceholder="Search defects, applications..."
        emptyMessage="No defects match your search."
      />
    </div>
  );
}

TriagePage.displayName = 'TriagePage';

export { TriagePage };
export default TriagePage;
