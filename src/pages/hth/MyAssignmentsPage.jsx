import { useEffect, useMemo, useState } from 'react';
import { ListTodo, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { usePersona } from '@/context/PersonaContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ROUTES } from '@/lib/constants';

const TYPE_ICON_VARIANT = { Defect: 'error', 'Test Case': 'info', Execution: 'warning' };
const PRIORITY_VARIANT = { High: 'error', Medium: 'warning', Low: 'success' };

/** Builds a deterministic assignment queue "for" the given persona name. */
function buildAssignments(name) {
  return [
    { id: 'BUG-3987', type: 'Defect', title: 'Claims submission fails for multi-provider bundles', application: 'Claims Platform', priority: 'High', due: '2026-07-17', owner: name, status: 'Open' },
    { id: 'TC-2214', type: 'Test Case', title: 'Author regression cases for new formulary lookup API', application: 'Pharmacy Portal', priority: 'Medium', due: '2026-07-18', owner: name, status: 'Open' },
    { id: 'EXEC-8842', type: 'Execution', title: 'Investigate flaky Member Portal login E2E suite', application: 'Member Portal', priority: 'Medium', due: '2026-07-16', owner: name, status: 'In Progress' },
    { id: 'BUG-3991', type: 'Defect', title: 'Provider search pagination skips page 2', application: 'Provider Portal', priority: 'Low', due: '2026-07-21', owner: name, status: 'Open' },
    { id: 'TC-2219', type: 'Test Case', title: 'Update accessibility test suite for new enrollment flow', application: 'Enrollment System', priority: 'Low', due: '2026-07-22', owner: name, status: 'In Progress' },
    { id: 'EXEC-8850', type: 'Execution', title: 'Root-cause billing batch validation timeout', application: 'Billing Platform', priority: 'High', due: '2026-07-15', owner: name, status: 'Open' },
  ];
}

/**
 * My Assignments — the current persona's personal work queue across
 * defects, test cases, and executions, per PRD §5 "Analytics › My
 * Assignments". "Mark Complete" mutates the in-memory queue.
 *
 * @returns {React.ReactElement}
 */
function MyAssignmentsPage() {
  const { setBreadcrumbs } = useNavigation();
  const { currentPersona } = usePersona();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState(() => buildAssignments(currentPersona.name));
  const [typeTab, setTypeTab] = useState('All');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'My Assignments' },
    ]);
  }, [setBreadcrumbs]);

  const open = assignments.filter((a) => a.status !== 'Completed');
  const overdue = open.filter((a) => new Date(a.due) < new Date('2026-07-15')).length;
  const highPriority = open.filter((a) => a.priority === 'High').length;
  const completed = assignments.filter((a) => a.status === 'Completed').length;

  const markComplete = (id) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Completed' } : a)));
    toast({ variant: 'success', title: 'Marked complete', description: `${id} has been closed out.` });
  };

  const rows = useMemo(
    () => (typeTab === 'All' ? assignments : assignments.filter((a) => a.type === typeTab)),
    [assignments, typeTab]
  );

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 100 },
      { id: 'type', header: 'Type', size: 100, cell: ({ row }) => <Badge variant={TYPE_ICON_VARIANT[row.original.type]} size="sm">{row.original.type}</Badge> },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'application', header: 'Application', size: 140 },
      { id: 'priority', header: 'Priority', size: 90, cell: ({ row }) => <Badge variant={PRIORITY_VARIANT[row.original.priority]} size="sm">{row.original.priority}</Badge> },
      { accessorKey: 'due', header: 'Due', size: 110 },
      {
        id: 'status',
        header: 'Status',
        size: 150,
        enableSorting: false,
        cell: ({ row }) => {
          const a = row.original;
          if (a.status === 'Completed') return <Badge variant="success" size="sm">Completed</Badge>;
          return (
            <div className="flex items-center gap-2">
              <Badge variant={a.status === 'In Progress' ? 'warning' : 'info'} size="sm">{a.status}</Badge>
              <Button variant="ghost" size="sm" iconLeft={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => markComplete(a.id)}>Complete</Button>
            </div>
          );
        },
      },
    ],
    [assignments]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Assignments</h1>
        <p className="text-sm text-slate-500">Defects, test cases, and executions assigned to {currentPersona.name}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open Assignments" value={open.length} unit="count" icon={<ListTodo />} tone="blue" />
        <KpiCard label="High Priority" value={highPriority} unit="count" icon={<AlertTriangle />} tone="red" />
        <KpiCard label="Overdue" value={overdue} unit="count" icon={<Clock />} tone="orange" />
        <KpiCard label="Completed" value={completed} unit="count" icon={<CheckCircle2 />} tone="green" />
      </div>

      <Tabs value={typeTab} onValueChange={setTypeTab}>
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Defect">Defects</TabsTrigger>
          <TabsTrigger value="Test Case">Test Cases</TabsTrigger>
          <TabsTrigger value="Execution">Executions</TabsTrigger>
        </TabsList>
        <TabsContent value={typeTab}>
          <DataTable columns={columns} data={rows} pageSize={10} searchPlaceholder="Search assignments..." emptyMessage="No assignments match your search." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

MyAssignmentsPage.displayName = 'MyAssignmentsPage';

export { MyAssignmentsPage };
export default MyAssignmentsPage;
