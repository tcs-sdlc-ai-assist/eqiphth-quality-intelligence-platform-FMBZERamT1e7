import { useEffect, useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { RefreshCw, Columns3, Rows3, Download, Search, ChevronDown } from 'lucide-react';
import { cn, downloadCSV } from '@/lib/utils';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import { ROUTES } from '@/lib/constants';

/* Mock data mirrors Docs/mocks/06-test-cases-inventory.png (frontend-only). */

const DISPOSITION = [
  { label: 'Automated', value: 6470, pct: '57.3%', color: '#3b82f6' },
  { label: 'Manual', value: 2926, pct: '25.9%', color: '#ef4444' },
  { label: 'Not Required', value: 1244, pct: '11.0%', color: '#94a3b8' },
  { label: 'Not Feasible', value: 652, pct: '5.8%', color: '#16b364' },
];

const TOP_TYPES = [
  { name: 'Functional', value: 5439, color: '#3b82f6' },
  { name: 'Regression', value: 5326, color: '#f59e0b' },
  { name: 'Other', value: 201, color: '#94a3b8' },
  { name: 'Performance', value: 175, color: '#16b364' },
  { name: 'Smoke', value: 86, color: '#f59e0b' },
];

const APP_PIE = [
  { name: 'Humana Member Portal', value: 5.3, color: '#3b82f6' },
  { name: 'Claims Platform', value: 5.3, color: '#f59e0b' },
  { name: 'Provider Portal', value: 5.1, color: '#8b5cf6' },
  { name: 'Other Applications', value: 84.3, color: '#94a3b8' },
];

const GRID = [
  { app: 'Humana Member Portal', total: 3256, e2e: 120, func: 1587, neg: 312, perf: 245, reg: 765, sec: 68, smoke: 45, other: 87, untagged: 27 },
  { app: 'Humana Claims Platform', total: 2145, e2e: 98, func: 1102, neg: 198, perf: 176, reg: 512, sec: 54, smoke: 32, other: 61, untagged: 12 },
  { app: 'Humana Provider Portal', total: 1842, e2e: 75, func: 943, neg: 156, perf: 128, reg: 421, sec: 43, smoke: 28, other: 35, untagged: 13 },
  { app: 'Humana Enrollment System', total: 1365, e2e: 60, func: 612, neg: 123, perf: 98, reg: 312, sec: 32, smoke: 19, other: 26, untagged: 12 },
  { app: 'Humana Billing Platform', total: 1112, e2e: 45, func: 465, neg: 89, perf: 76, reg: 298, sec: 26, smoke: 18, other: 18, untagged: 7 },
  { app: 'Humana Digital Access (Mobile)', total: 756, e2e: 35, func: 345, neg: 56, perf: 44, reg: 176, sec: 18, smoke: 11, other: 15, untagged: 6 },
  { app: 'Humana Clinical Integration', total: 512, e2e: 20, func: 238, neg: 42, perf: 36, reg: 128, sec: 12, smoke: 8, other: 14, untagged: 6 },
  { app: 'Humana Pharmacy Portal', total: 304, e2e: 12, func: 147, neg: 27, perf: 21, reg: 98, sec: 8, smoke: 5, other: 8, untagged: 6 },
];

const GRID_COLS = [
  { key: 'e2e', label: 'End To End' }, { key: 'func', label: 'Functional' }, { key: 'neg', label: 'Negative' },
  { key: 'perf', label: 'Performance' }, { key: 'reg', label: 'Regression' }, { key: 'sec', label: 'Security' },
  { key: 'smoke', label: 'Smoke' }, { key: 'other', label: 'Other' }, { key: 'untagged', label: 'Not Tagged' },
];

const HIGHEST_MANUAL = ['Humana Member Portal', 'Claims Platform', 'Provider Portal', 'Global Proxy Billing', 'Enrollment System'];
const GRID_TABS = ['Testing Type', 'Regression & Smoke', 'Automation & Manual', 'Automated On'];
const FILTERS = [
  { label: 'Portfolio (CTO)', options: ['Humana Insurance', 'CenterWell', 'Corporate'] },
  { label: 'Project', options: ['Portfolio Lead', 'Member Portal', 'Claims Platform'] },
  { label: 'Disposition', options: ['All', 'Automated', 'Manual', 'Not Required'] },
];

/**
 * Stateful labelled select used in the filter row.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string[]} props.options - Options
 * @returns {React.ReactElement}
 */
function FilterSelect({ label, options }) {
  const [value, setValue] = useState(options[0]);
  return (
    <label className="flex min-w-[180px] flex-1 flex-col gap-0.5 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-card transition-colors focus-within:border-humana-green-500 focus-within:ring-2 focus-within:ring-humana-green-500/30">
      <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => setValue(e.target.value)} className="w-full appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-800 focus:outline-none">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      </div>
    </label>
  );
}

/**
 * A separate bordered date filter box matching the mock's filter row.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string} props.defaultValue - Initial ISO date value
 * @returns {React.ReactElement}
 */
function FilterDate({ label, defaultValue }) {
  return (
    <label className="flex min-w-[150px] flex-1 flex-col gap-0.5 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-card transition-colors focus-within:border-humana-green-500 focus-within:ring-2 focus-within:ring-humana-green-500/30">
      <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <input type="date" defaultValue={defaultValue} className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none" />
    </label>
  );
}

/**
 * Inside-slice percentage label (white text) for the Tests By Application pie.
 *
 * @param {object} props - Recharts label props
 * @returns {React.ReactElement}
 */
function PieSliceLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {value}%
    </text>
  );
}

/**
 * A labelled automation percentage with a progress bar.
 *
 * @param {object} props
 * @param {string} props.label - Metric label
 * @param {number} props.pct - Percentage value
 * @param {string} props.color - Bar color
 * @returns {React.ReactElement}
 */
function AutoBar({ label, pct, color }) {
  return (
    <div>
      <p className="text-2xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-warning-600">{pct.toFixed(2)}%</p>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/**
 * Test Cases Inventory — coverage and quality insights across the portfolio,
 * rebuilt to match Docs/mocks/06-test-cases-inventory.png. Toggles, grid tabs,
 * search, and export are interactive.
 *
 * @returns {React.ReactElement}
 */
function TestCasesInventoryPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  usePageHeader({ title: 'Test Cases', subtitle: `Comprehensive inventory and quality insights for test cases across the portfolio.` });

  const [metricView, setMetricView] = useState('Automation/Manual');
  const [gridTab, setGridTab] = useState('Testing Type');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [hiddenCols, setHiddenCols] = useState(() => new Set());
  const [density, setDensity] = useState('comfortable');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Test Cases' },
    ]);
  }, [setBreadcrumbs]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({ variant: 'success', title: 'Data refreshed', description: 'Test case inventory recalculated from the latest mock data.' });
    }, 400);
  };

  const toggleCol = (key) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const visibleGridCols = GRID_COLS.filter((c) => !hiddenCols.has(c.key));
  const cellPad = density === 'compact' ? 'py-1' : 'py-2.5';

  const dispTotal = DISPOSITION.reduce((s, d) => s + d.value, 0);
  const maxType = Math.max(...TOP_TYPES.map((t) => t.value));

  const gridRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? GRID.filter((r) => r.app.toLowerCase().includes(q)) : GRID;
  }, [search]);

  const totals = useMemo(() => {
    const acc = { total: 0 };
    GRID_COLS.forEach((c) => { acc[c.key] = 0; });
    for (const r of gridRows) {
      acc.total += r.total;
      GRID_COLS.forEach((c) => { acc[c.key] += r[c.key]; });
    }
    return acc;
  }, [gridRows]);

  const handleExport = () => {
    downloadCSV(gridRows, 'test-cases-by-type.csv');
    toast({ variant: 'success', title: 'Export complete', description: `${gridRows.length} applications exported to CSV.` });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters — each a separate bordered component */}
      <div className="flex flex-wrap items-stretch gap-3">
        {FILTERS.map((f) => <FilterSelect key={f.label} label={f.label} options={f.options} />)}
        <FilterDate label="Start Date" defaultValue="2026-01-18" />
        <FilterDate label="End Date" defaultValue="2026-04-18" />
        <button type="button" onClick={handleRefresh} title="Refresh" aria-label="Refresh" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-slate-700 shadow-card hover:bg-slate-50">
          <RefreshCw className={cn('h-4 w-4 text-slate-500', refreshing && 'animate-spin')} aria-hidden="true" />
        </button>
      </div>

      {/* Insight panels */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {/* General Metrics */}
        <PanelCard
          title="General Metrics"
          className="xl:col-span-2"
          noBorder
          info="Total active test cases and their automation disposition."
          actions={
            <div className="flex gap-1">
              {['Automation/Manual', 'Smoke/Regression'].map((o) => (
                <button key={o} type="button" onClick={() => setMetricView(o)} className={cn('rounded-full px-2.5 py-1 text-2xs font-medium transition-colors', metricView === o ? 'bg-info-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>{o}</button>
              ))}
            </div>
          }
        >
          <p className="text-2xl font-semibold text-slate-900">11,292</p>
          <p className="text-2xs uppercase tracking-wider text-slate-400">Total Active Test Cases</p>
          <div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
            {DISPOSITION.map((d) => <div key={d.label} style={{ width: `${(d.value / dispTotal) * 100}%`, backgroundColor: d.color }} />)}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {DISPOSITION.map((d) => (
              <div key={d.label} className="rounded-lg border border-slate-200 p-2.5">
                <div className="flex items-baseline gap-1"><span className="text-lg font-semibold text-slate-900">{d.value.toLocaleString()}</span><span className="text-2xs text-slate-400">{d.pct}</span></div>
                <p className="flex items-center gap-1.5 text-2xs text-slate-500"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.label}</p>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Top 5 Testing Types */}
        <PanelCard title="Top 5 Testing Types" noBorder info="The five most common testing types by test-case count.">

          <ul className="flex flex-col gap-2.5">
            {TOP_TYPES.map((t) => (
              <li key={t.name} className="text-xs">
                <div className="flex justify-between"><span className="text-slate-600">{t.name}</span><span className="font-semibold text-slate-900">{t.value.toLocaleString()}</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full" style={{ width: `${(t.value / maxType) * 100}%`, backgroundColor: t.color }} /></div>
              </li>
            ))}
          </ul>
        </PanelCard>

        {/* Automation */}
        <PanelCard title="Automation" noBorder info="Test-bed and eligible automation coverage percentages.">

          <div className="flex flex-col gap-4">
            <AutoBar label="Test Bed Automation %" pct={57.3} color="#f59e0b" />
            <AutoBar label="Eligible Automation %" pct={68.86} color="#f59e0b" />
          </div>
        </PanelCard>

        {/* Manual v. Automation */}
        <PanelCard title="Manual v. Automation" noBorder info="Share of test cases that are automated versus manual.">

          <div className="relative mx-auto h-[150px] w-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DISPOSITION} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} stroke="none" isAnimationActive={false}>
                  {DISPOSITION.map((d) => <Cell key={d.label} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1">
            {DISPOSITION.map((d) => (
              <li key={d.label} className="flex items-center gap-1.5 text-2xs text-slate-600"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.label}</li>
            ))}
          </ul>
        </PanelCard>
      </div>

      {/* Grid + Tests by Application */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <PanelCard
          title="Testing Type"
          className="xl:col-span-3"
          noBorder
          actions={
            <div className="flex flex-wrap justify-end gap-1.5">
              {GRID_TABS.map((t) => (
                <button key={t} type="button" onClick={() => setGridTab(t)} className={cn('rounded-full px-3 py-1 text-xs font-semibold transition-colors', gridTab === t ? 'bg-humana-green-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100')}>{t}</button>
              ))}
            </div>
          }
        >
          {/* Toolbar */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-info-700 hover:text-info-800"><Columns3 className="h-3.5 w-3.5" /> Columns</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {GRID_COLS.map((c) => (
                  <DropdownMenuCheckboxItem key={c.key} checked={!hiddenCols.has(c.key)} onCheckedChange={() => toggleCol(c.key)}>
                    {c.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-info-700 hover:text-info-800"><Rows3 className="h-3.5 w-3.5" /> Density</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel>Row density</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={density === 'comfortable'} onCheckedChange={() => setDensity('comfortable')}>Comfortable</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={density === 'compact'} onCheckedChange={() => setDensity('compact')}>Compact</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button type="button" onClick={handleExport} className="inline-flex items-center gap-1 text-xs font-bold text-info-700 hover:text-info-800"><Download className="h-3.5 w-3.5" /> Export</button>
            <span className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-8 w-48 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40" />
            </span>
          </div>
          <div>
            <table className="w-full table-fixed text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500">
                  <th className="px-2 py-2 font-medium" style={{ width: '20%' }}>Application</th>
                  <th className="px-2 py-2 text-right font-medium" style={{ width: '8%' }}>Total</th>
                  {visibleGridCols.map((c) => <th key={c.key} className="px-2 py-2 text-right font-medium">{c.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {gridRows.map((r) => (
                  <tr key={r.app} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className={cn('px-2 text-slate-700', cellPad)}>{r.app}</td>
                    <td className={cn('px-2 text-right font-semibold text-slate-900', cellPad)}>{r.total.toLocaleString()}</td>
                    {visibleGridCols.map((c) => <td key={c.key} className={cn('px-2 text-right text-slate-600', cellPad)}>{r[c.key].toLocaleString()}</td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-900">
                  <td className="px-2 py-2.5">Total Applications: 258</td>
                  <td className="px-2 py-2.5 text-right">{totals.total.toLocaleString()}</td>
                  {visibleGridCols.map((c) => <td key={c.key} className="px-2 py-2.5 text-right">{totals[c.key].toLocaleString()}</td>)}
                </tr>
              </tfoot>
            </table>
          </div>
        </PanelCard>

        {/* Tests by Application */}
        <PanelCard title="Tests By Application" noBorder info="Share of total test cases contributed by each application.">
          <div className="relative mx-auto h-[170px] w-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={APP_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} stroke="#ffffff" strokeWidth={2} isAnimationActive={false} label={<PieSliceLabel />} labelLine={false}>
                  {APP_PIE.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-2xs font-semibold uppercase tracking-wider text-slate-400">Top Contributing Applications</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {APP_PIE.map((d) => (
              <li key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-slate-600">{d.name}</span></span>
                <span className="font-semibold text-slate-900">{d.value}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-2xs text-slate-400">Highest Manual Test Case %</p>
          <ul className="mt-1 flex flex-col gap-1">
            {HIGHEST_MANUAL.map((a) => (
              <li key={a} className="flex items-center justify-between text-2xs">
                <span className="text-slate-600">{a}</span>
                <span className="font-medium text-slate-900">100%</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </div>
  );
}

TestCasesInventoryPage.displayName = 'TestCasesInventoryPage';

export { TestCasesInventoryPage };
export default TestCasesInventoryPage;
