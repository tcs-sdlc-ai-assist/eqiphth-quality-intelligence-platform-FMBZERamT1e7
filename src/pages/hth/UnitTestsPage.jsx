import { useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckSquare, TrendingUp, FileCode, AlertTriangle } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { DataTable } from '@/components/shared/DataTable';
import { Progress } from '@/components/ui/Progress';
import { ROUTES } from '@/lib/constants';

/* Mock data — unit test coverage by application (PRD §5 "Inventory › Unit Tests", §6.7). */

const COVERAGE_TREND = [
  { month: 'Feb', overall: 68.4 }, { month: 'Mar', overall: 70.1 }, { month: 'Apr', overall: 72.8 },
  { month: 'May', overall: 75.2 }, { month: 'Jun', overall: 77.0 }, { month: 'Jul', overall: 78.3 },
];

const APP_COVERAGE = [
  { application: 'Member Portal', unitTests: 3842, overallCoverage: 78.3, newCodeCoverage: 71.5, bugs: 0, vulnerabilities: 0 },
  { application: 'Claims Platform', unitTests: 3120, overallCoverage: 71.4, newCodeCoverage: 60.2, bugs: 4, vulnerabilities: 2 },
  { application: 'Provider Portal', unitTests: 2456, overallCoverage: 68.9, newCodeCoverage: 55.8, bugs: 2, vulnerabilities: 0 },
  { application: 'Pharmacy Portal', unitTests: 1980, overallCoverage: 74.2, newCodeCoverage: 66.1, bugs: 1, vulnerabilities: 0 },
  { application: 'Clinical Platform', unitTests: 1542, overallCoverage: 66.5, newCodeCoverage: 50.4, bugs: 3, vulnerabilities: 1 },
  { application: 'Enrollment System', unitTests: 2210, overallCoverage: 80.1, newCodeCoverage: 74.6, bugs: 0, vulnerabilities: 0 },
  { application: 'Billing Platform', unitTests: 1687, overallCoverage: 72.8, newCodeCoverage: 63.9, bugs: 1, vulnerabilities: 0 },
  { application: 'Authentication Service', unitTests: 1204, overallCoverage: 91.2, newCodeCoverage: 88.7, bugs: 0, vulnerabilities: 0 },
];

/**
 * Unit Tests — unit test coverage and code-quality inventory across
 * applications, per PRD §5 "Inventory › Unit Tests" and §6.7's Unit Test
 * Results / Code Coverage / SonarQube fields.
 *
 * @returns {React.ReactElement}
 */
function UnitTestsPage() {
  const { setBreadcrumbs } = useNavigation();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'Unit Tests' },
    ]);
  }, [setBreadcrumbs]);

  const totalUnitTests = APP_COVERAGE.reduce((s, a) => s + a.unitTests, 0);
  const avgCoverage = (APP_COVERAGE.reduce((s, a) => s + a.overallCoverage, 0) / APP_COVERAGE.length).toFixed(1);
  const totalBugs = APP_COVERAGE.reduce((s, a) => s + a.bugs, 0);

  const columns = useMemo(
    () => [
      { accessorKey: 'application', header: 'Application' },
      { accessorKey: 'unitTests', header: 'Unit Tests', size: 110, cell: ({ row }) => row.original.unitTests.toLocaleString() },
      {
        id: 'overallCoverage',
        header: 'Overall Coverage',
        size: 180,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress value={row.original.overallCoverage} max={100} variant="auto" size="sm" className="w-24" />
            <span className="text-xs font-medium text-slate-700">{row.original.overallCoverage}%</span>
          </div>
        ),
      },
      {
        id: 'newCodeCoverage',
        header: 'New Code Coverage',
        size: 180,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress value={row.original.newCodeCoverage} max={100} variant="auto" size="sm" className="w-24" />
            <span className="text-xs font-medium text-slate-700">{row.original.newCodeCoverage}%</span>
          </div>
        ),
      },
      { accessorKey: 'bugs', header: 'SonarQube Bugs', size: 130 },
      { accessorKey: 'vulnerabilities', header: 'Vulnerabilities', size: 120 },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Unit Tests</h1>
        <p className="text-sm text-slate-500">Unit test volume, code coverage, and static analysis findings across the application portfolio.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Unit Tests" value={totalUnitTests} unit="count" icon={<CheckSquare />} tone="blue" />
        <KpiCard label="Avg. Overall Coverage" value={Number(avgCoverage)} unit="percent" icon={<TrendingUp />} tone="green" />
        <KpiCard label="Applications Tracked" value={APP_COVERAGE.length} unit="count" icon={<FileCode />} tone="purple" />
        <KpiCard label="Open SonarQube Bugs" value={totalBugs} unit="count" icon={<AlertTriangle />} tone="red" />
      </div>

      <PanelCard title="Coverage Trend" subtitle="Overall unit test coverage, last 6 months">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={COVERAGE_TREND} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis domain={[60, 85]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}%`, 'Overall Coverage']} />
              <Line type="monotone" dataKey="overall" stroke="#16b364" strokeWidth={2.5} dot={{ r: 3, fill: '#16b364' }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </PanelCard>

      <PanelCard title="Coverage by Application" noPadding>
        <div className="p-5">
          <DataTable columns={columns} data={APP_COVERAGE} enableExport pageSize={10} searchPlaceholder="Search applications..." exportFilename="unit-test-coverage" />
        </div>
      </PanelCard>
    </div>
  );
}

UnitTestsPage.displayName = 'UnitTestsPage';

export { UnitTestsPage };
export default UnitTestsPage;
