import { useEffect, useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AlertCircle, Columns3, Filter, Rows3, Download, Search, Info } from 'lucide-react';
import { cn, downloadCSV } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { ROUTES } from '@/lib/constants';

/* Mock data mirrors Docs/mocks/05-hth-in-sprint-view.png (frontend-only). */

const FILTERS = [
  { label: 'Portfolio (CTO)', options: ['Humana Insurance', 'CenterWell', 'Corporate'] },
  { label: 'Project', options: ['Member Portal', 'Claims Platform', 'Provider Portal'] },
  { label: 'Squad', options: ['Member Portal Team', 'Claims Team', 'Provider Team'] },
  { label: 'Sprint', options: ['FY26 Q4 PI SP2', 'FY26 Q4 PI SP1', 'FY26 Q3 PI SP6'] },
];

const STORY_TILES = [
  { label: 'Total Stories', value: '1,294', muted: false },
  { label: 'Stories with Only Automated Tests', value: '246', pct: '19.0%' },
  { label: 'Stories without a Test', value: '685', pct: '52.9%', alert: true },
  { label: 'Stories with Manual Tests', value: '363', pct: '28.1%', alert: true },
];
const STORY_LEGEND = [
  { label: 'Stories with Only Automated Tests', value: 246, color: '#16b364' },
  { label: 'Stories with Manual Tests', value: 263, color: '#f59e0b' },
  { label: 'Stories without a Test', value: 665, color: '#ef4444' },
];

const TEST_SEG = [
  { label: 'Automated', value: 1028, pct: '46.9%', color: '#3b82f6' },
  { label: 'Manual', value: 851, pct: '38.8%', color: '#ef4444' },
  { label: 'Not Required', value: 119, pct: '5.4%', color: '#94a3b8' },
  { label: 'Not Feasible', value: 195, pct: '8.9%', color: '#16b364' },
];

const JIRA_TREND = [
  { pi: 'Q3 SP5', backlog: 600, sprint: 1050 },
  { pi: 'Q4 SP4', backlog: 590, sprint: 1180 },
  { pi: 'Q4 SP5', backlog: 585, sprint: 1320 },
  { pi: 'Q4 SP6', backlog: 560, sprint: 1280 },
  { pi: 'Q4 SP1', backlog: 540, sprint: 1520 },
  { pi: 'Q4 SP2', backlog: 520, sprint: 1180 },
];

const DEFECT_TABS = ['Jira Artifacts', 'In-Sprint Automation', 'Automation & Manual', 'Automation Executions', 'Stories', 'Test Cases Types', 'Defects', 'AI Generated Tests'];

const DEFECTS = [
  { squad: 'Member Portal – Enablement', total: 0, open: 0, closed: 0, noAcher: 0 },
  { squad: 'Member Portal – Claims', total: 0, open: 0, closed: 0, noAcher: 0 },
  { squad: 'Member Portal – Provider', total: 0, open: 0, closed: 0, noAcher: 0 },
  { squad: 'Member Portal – Enrollment', total: 1, open: 1, closed: 0, noAcher: 1 },
  { squad: 'Member Portal – Billing', total: 0, open: 0, closed: 0, noAcher: 0 },
  { squad: 'Services – Issuer Integration', total: 0, open: 0, closed: 0, noAcher: 1 },
  { squad: 'Member Portal – Digital Access', total: 1, open: 1, closed: 0, noAcher: 0 },
  { squad: 'Claims – Adjudication', total: 3, open: 2, closed: 1, noAcher: 0 },
  { squad: 'Provider – Directory', total: 2, open: 1, closed: 1, noAcher: 1 },
  { squad: 'Pharmacy – Formulary', total: 1, open: 0, closed: 1, noAcher: 0 },
];

/**
 * Stateful labelled select for the In-Sprint filter row.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string[]} props.options - Option labels
 * @returns {React.ReactElement}
 */
function FilterSelect({ label, options }) {
  const [value, setValue] = useState(options[0]);
  return (
    <label className="flex flex-1 flex-col gap-1 min-w-[160px]">
      <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

/**
 * Segmented toggle (pill group) used in panel headers.
 *
 * @param {object} props
 * @param {string[]} props.options - Toggle labels
 * @param {string} props.value - Active value
 * @param {function(string):void} props.onChange - Change handler
 * @returns {React.ReactElement}
 */
function Toggle({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            'rounded-full px-2.5 py-1 text-2xs font-medium transition-colors',
            value === o ? 'bg-info-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/**
 * In-Sprint View — real-time sprint quality insights, rebuilt to match
 * Docs/mocks/05-hth-in-sprint-view.png. Toggles, trend metric, defect tabs,
 * and search are interactive.
 *
 * @returns {React.ReactElement}
 */
function InSprintViewPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  const [storyView, setStoryView] = useState('Stories');
  const [testView, setTestView] = useState('Tests In Sprint');
  const [trendView, setTrendView] = useState('In-Sprint Automation');
  const [defectTab, setDefectTab] = useState('Defects');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'In-Sprint View' },
    ]);
  }, [setBreadcrumbs]);

  const storyTotal = STORY_LEGEND.reduce((s, x) => s + x.value, 0);
  const testTotal = TEST_SEG.reduce((s, x) => s + x.value, 0);

  const defectRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? DEFECTS.filter((d) => d.squad.toLowerCase().includes(q)) : DEFECTS;
  }, [search]);

  const totals = useMemo(() => defectRows.reduce(
    (acc, d) => ({ total: acc.total + d.total, open: acc.open + d.open, closed: acc.closed + d.closed, noAcher: acc.noAcher + d.noAcher }),
    { total: 0, open: 0, closed: 0, noAcher: 0 }
  ), [defectRows]);

  const handleExport = () => {
    downloadCSV(defectRows, 'in-sprint-defects.csv');
    toast({ variant: 'success', title: 'Export complete', description: `${defectRows.length} squads exported to CSV.` });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">In-Sprint View</h1>
        <p className="text-sm text-slate-500">Real-time quality insights for the current sprint.</p>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        {FILTERS.map((f) => <FilterSelect key={f.label} label={f.label} options={f.options} />)}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Story Metrics */}
        <PanelCard title="Story Metrics" actions={<Toggle options={['Stories', 'Jira Tickets']} value={storyView} onChange={setStoryView} />}>
          <div className="grid grid-cols-2 gap-3">
            {STORY_TILES.map((t) => (
              <div key={t.label} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-2xl font-semibold text-slate-900">{t.value}</span>
                  {t.pct ? <span className="text-2xs text-slate-400">{t.pct}</span> : null}
                  {t.alert ? <AlertCircle className="h-4 w-4 text-danger-500" aria-hidden="true" /> : null}
                </div>
                <p className="mt-1 text-2xs leading-tight text-slate-500">{t.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
            {STORY_LEGEND.map((s) => (
              <div key={s.label} style={{ width: `${(s.value / storyTotal) * 100}%`, backgroundColor: s.color }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-col gap-1.5">
            {STORY_LEGEND.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.label}</span>
                <span className="ml-auto font-semibold text-slate-900">{s.value}</span>
              </li>
            ))}
          </ul>
        </PanelCard>

        {/* Test Case Metrics */}
        <PanelCard title="Test Case Metrics" actions={<Toggle options={['Tests In Sprint', 'Automation', 'Jira Trends']} value={testView} onChange={setTestView} />}>
          <p className="text-2xl font-semibold text-slate-900">2,193</p>
          <p className="text-2xs uppercase tracking-wider text-slate-400">Unique Linked Tests</p>
          <div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
            {TEST_SEG.map((s) => (
              <div key={s.label} style={{ width: `${(s.value / testTotal) * 100}%`, backgroundColor: s.color }} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {TEST_SEG.map((s) => (
              <div key={s.label} className="rounded-lg border border-slate-200 p-2.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-slate-900">{s.value.toLocaleString()}</span>
                  <span className="text-2xs text-slate-400">{s.pct}</span>
                </div>
                <p className="text-2xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Jira Trends */}
        <PanelCard title="Jira Trends" actions={<Toggle options={['In-Sprint Automation', 'Test Cases', 'Stories']} value={trendView} onChange={setTrendView} />}>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={JIRA_TREND} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="pi" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="backlog" name="Automation (Backlog)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 2.5 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="sprint" name="Automation (In Sprint)" stroke="#16b364" strokeWidth={2.5} dot={{ r: 2.5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
      </div>

      {/* Defects grid */}
      <PanelCard title="Defects">
        {/* Tabs */}
        <div className="-mt-1 mb-3 flex flex-wrap gap-1 border-b border-slate-100 pb-2">
          {DEFECT_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDefectTab(t)}
              className={cn(
                'rounded-full px-2.5 py-1 text-2xs font-medium transition-colors',
                defectTab === t ? 'bg-danger-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-info-600 hover:text-info-700"><Columns3 className="h-3.5 w-3.5" /> Columns</button>
          <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-info-600 hover:text-info-700"><Filter className="h-3.5 w-3.5" /> Filters</button>
          <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-info-600 hover:text-info-700"><Rows3 className="h-3.5 w-3.5" /> Density</button>
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-1 text-xs font-medium text-info-600 hover:text-info-700"><Download className="h-3.5 w-3.5" /> Export</button>
          <span className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search squads..." className="h-8 w-52 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40" />
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-danger-500/70 text-2xs uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">Squad</th>
                <th className="px-3 py-2 text-right font-medium">Total Defects</th>
                <th className="px-3 py-2 text-right font-medium">Open</th>
                <th className="px-3 py-2 text-right font-medium">Closed</th>
                <th className="px-3 py-2 text-right font-medium">Without Acher ID</th>
              </tr>
            </thead>
            <tbody>
              {defectRows.map((d) => (
                <tr key={d.squad} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="px-3 py-2.5 text-slate-700">{d.squad}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-slate-900">{d.total}</td>
                  <td className="px-3 py-2.5 text-right text-slate-600">{d.open}</td>
                  <td className="px-3 py-2.5 text-right text-slate-600">{d.closed}</td>
                  <td className={cn('px-3 py-2.5 text-right', d.noAcher > 0 ? 'font-medium text-danger-600' : 'text-slate-600')}>{d.noAcher}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 text-sm font-semibold text-slate-900">
                <td className="px-3 py-2.5">Total Squads: {defectRows.length}</td>
                <td className="px-3 py-2.5 text-right">{totals.total}</td>
                <td className="px-3 py-2.5 text-right">{totals.open}</td>
                <td className="px-3 py-2.5 text-right">{totals.closed}</td>
                <td className="px-3 py-2.5 text-right">{totals.noAcher}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-2xs text-slate-400">
          <span className="inline-flex items-center gap-1"><Info className="h-3 w-3" /> Showing all linked defects for the selected sprint.</span>
          <span>1–{defectRows.length} of {defectRows.length}</span>
        </div>
      </PanelCard>
    </div>
  );
}

InSprintViewPage.displayName = 'InSprintViewPage';

export { InSprintViewPage };
export default InSprintViewPage;
