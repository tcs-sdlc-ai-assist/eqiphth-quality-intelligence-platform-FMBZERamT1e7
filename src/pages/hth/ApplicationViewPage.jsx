import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Gauge, CheckCircle2, Bug, Zap } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { DataTable } from '@/components/shared/DataTable';
import { StatusPill } from '@/components/shared/StatusPill';
import { Select } from '@/components/ui/Select';
import { ROUTES } from '@/lib/constants';

/* Mock data — per-application testing snapshot (PRD §5 "Application View"). */

const APP_SNAPSHOTS = {
  'Member Portal': { coverage: 78.3, passRate: 87.6, openDefects: 112, automation: 51.9, executions: 8452 },
  'Claims Platform': { coverage: 71.4, passRate: 82.1, openDefects: 98, automation: 62.3, executions: 6218 },
  'Provider Portal': { coverage: 68.9, passRate: 79.4, openDefects: 76, automation: 48.7, executions: 4103 },
  'Pharmacy Portal': { coverage: 74.2, passRate: 85.0, openDefects: 63, automation: 55.1, executions: 2984 },
  'Clinical Platform': { coverage: 66.5, passRate: 76.8, openDefects: 45, automation: 44.0, executions: 2210 },
  'Enrollment System': { coverage: 80.1, passRate: 89.2, openDefects: 37, automation: 67.8, executions: 3120 },
  'Billing Platform': { coverage: 72.8, passRate: 83.5, openDefects: 18, automation: 58.6, executions: 1876 },
};

const APP_NAMES = Object.keys(APP_SNAPSHOTS);

const TYPE_COLORS = { Functional: '#3b82f6', API: '#16b364', UI: '#8b5cf6', Integration: '#f59e0b', Performance: '#06b6d4', Security: '#ef4444' };

function getTestTypeSplit() {
  return [
    { name: 'Functional', value: 38, color: TYPE_COLORS.Functional },
    { name: 'API', value: 22, color: TYPE_COLORS.API },
    { name: 'UI', value: 16, color: TYPE_COLORS.UI },
    { name: 'Integration', value: 12, color: TYPE_COLORS.Integration },
    { name: 'Performance', value: 7, color: TYPE_COLORS.Performance },
    { name: 'Security', value: 5, color: TYPE_COLORS.Security },
  ];
}

function getRecentExecutions(appName) {
  const envs = ['Prod', 'Pre-Prod', 'QA', 'SIT'];
  const statuses = ['passed', 'failed', 'passed', 'passed', 'blocked'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${appName.slice(0, 3).toUpperCase()}-EXEC-${400 + i}`,
    suite: `${appName} - ${['Regression', 'Smoke', 'API', 'E2E'][i % 4]} Suite`,
    environment: envs[i % envs.length],
    status: statuses[i % statuses.length],
    duration: `${20 + (i * 7) % 60}m`,
    date: `Jul ${14 - i}, 2026`,
  }));
}

/**
 * Application View — per-application testing snapshot (PRD §5 "Analytics ›
 * Application View"): coverage, pass rate, defects, automation, test-type
 * split, and recent executions for a selected application.
 *
 * @returns {React.ReactElement}
 */
function ApplicationViewPage() {
  const { setBreadcrumbs } = useNavigation();
  const [selectedApp, setSelectedApp] = useState(APP_NAMES[0]);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'Application View' },
    ]);
  }, [setBreadcrumbs]);

  const snapshot = APP_SNAPSHOTS[selectedApp];
  const typeSplit = useMemo(() => getTestTypeSplit(), []);
  const executions = useMemo(() => getRecentExecutions(selectedApp), [selectedApp]);

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'Execution', size: 160 },
      { accessorKey: 'suite', header: 'Test Suite' },
      { accessorKey: 'environment', header: 'Environment', size: 110 },
      { id: 'status', header: 'Status', size: 100, cell: ({ row }) => <StatusPill status={row.original.status} size="sm" dot /> },
      { accessorKey: 'duration', header: 'Duration', size: 90 },
      { accessorKey: 'date', header: 'Date', size: 110 },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Application View</h1>
          <p className="text-sm text-slate-500">Testing snapshot for a single application — coverage, pass rate, defects, and recent executions.</p>
        </div>
        <Select
          value={selectedApp}
          onValueChange={setSelectedApp}
          options={APP_NAMES.map((n) => ({ value: n, label: n }))}
          wrapperClassName="w-56"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Test Coverage" value={snapshot.coverage} unit="percent" icon={<Gauge />} tone="blue" />
        <KpiCard label="Pass Rate" value={snapshot.passRate} unit="percent" icon={<CheckCircle2 />} tone="green" />
        <KpiCard label="Open Defects" value={snapshot.openDefects} unit="count" icon={<Bug />} tone="red" />
        <KpiCard label="Automation Coverage" value={snapshot.automation} unit="percent" icon={<Zap />} tone="purple" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Test Type Split" subtitle={`${snapshot.executions.toLocaleString()} total executions`} className="xl:col-span-1">
          <div className="flex items-center gap-3">
            <div className="relative h-[150px] w-[150px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {typeSplit.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-1 flex-col gap-1.5">
              {typeSplit.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-slate-600">{d.name}</span></span>
                  <span className="font-semibold text-slate-900">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </PanelCard>

        <PanelCard title="Recent Executions" className="xl:col-span-2" noPadding>
          <div className="p-5">
            <DataTable columns={columns} data={executions} enablePagination={false} searchPlaceholder="Search executions..." />
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

ApplicationViewPage.displayName = 'ApplicationViewPage';

export { ApplicationViewPage };
export default ApplicationViewPage;
