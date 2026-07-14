import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import GaugeComponent from 'react-gauge-component';
import {
  Boxes,
  Users,
  Clock,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Lightbulb,
  FileText,
  ShoppingCart,
  Stethoscope,
  MessageSquare,
  ClipboardCheck,
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/lib/constants';

/* ------------------------------------------------------------------ *
 * Mock data — numbers mirror the EQIP Demand Management UX mock.
 * Frontend-only demo: no API, all values are static.
 * ------------------------------------------------------------------ */

const KPIS = [
  { id: 'total', label: 'Total Demand', subtitle: '(Next 90 Days)', value: 3248, unit: 'count', changePercent: 12, changeLabel: 'vs Last 90 Days', trend: 'improving', icon: <Boxes />, tone: 'blue' },
  { id: 'committed', label: 'Committed Demand', subtitle: '(Next 90 Days)', value: 2156, unit: 'count', changePercent: 8, changeLabel: 'vs Last 90 Days', trend: 'improving', icon: <Users />, tone: 'green' },
  { id: 'utilization', label: 'Capacity Utilization', subtitle: '(Next 90 Days)', value: '78%', changePercent: 5, changeLabel: 'vs Last 90 Days', trend: 'improving', icon: <Clock />, tone: 'orange' },
  { id: 'atrisk', label: 'At Risk Initiatives', subtitle: '(Next 90 Days)', value: 18, unit: 'count', changePercent: -10, changeLabel: 'vs Last 90 Days', trend: 'declining', icon: <Users />, tone: 'purple' },
  { id: 'shortage', label: 'Demand Shortage', subtitle: '(Next 90 Days)', value: 236, unit: 'count', changeText: 'High Priority', changeTone: 'danger', icon: <AlertTriangle />, tone: 'red' },
];

const PIPELINE = [
  { name: 'Requirements / Discovery', value: 842, pct: 26, color: '#3b82f6' },
  { name: 'Scoping', value: 654, pct: 20, color: '#16b364' },
  { name: 'Estimating', value: 612, pct: 19, color: '#f59e0b' },
  { name: 'Approved / Funded', value: 778, pct: 24, color: '#8b5cf6' },
  { name: 'On Hold', value: 362, pct: 11, color: '#cbd5e1' },
];

const CAPACITY = [
  { name: 'Available', fte: 854, pct: 22, color: '#16b364' },
  { name: 'Committed', fte: 3012, pct: 78, color: '#3b82f6' },
  { name: 'Over Capacity', fte: 156, pct: 5, color: '#ef4444' },
];

const TREND = [
  { month: "May '25", demand: 2050, capacity: 1900, forecast: false },
  { month: "Jun '25", demand: 2180, capacity: 1980, forecast: false },
  { month: "Jul '25", demand: 2320, capacity: 2050, forecast: false },
  { month: "Aug '25", demand: 2480, capacity: 2120, forecast: false },
  { month: "Sep '25", demand: 2660, capacity: 2190, forecast: false },
  { month: "Oct '25", demand: 2850, capacity: 2260, forecast: true },
  { month: "Nov '25", demand: 3050, capacity: 2330, forecast: true },
  { month: "Dec '25", demand: 3280, capacity: 2410, forecast: true },
];

const PORTFOLIO = [
  { name: 'Insurance', value: 1248, color: '#3b82f6' },
  { name: 'CenterWell', value: 854, color: '#8b5cf6' },
  { name: 'Growth', value: 612, color: '#16b364' },
  { name: 'Corporate Functions', value: 298, color: '#f59e0b' },
  { name: 'Shared Tech', value: 236, color: '#94a3b8' },
];

const AT_RISK = [
  { initiative: 'Member Portal Modernization', portfolio: 'Insurance', goLive: 'Jul 15, 2025', risk: 'High', reason: 'Capacity shortage' },
  { initiative: 'Provider Data Platform', portfolio: 'CenterWell', goLive: 'Aug 01, 2025', risk: 'High', reason: 'Skilled resources' },
  { initiative: 'Claims AI Insights', portfolio: 'Insurance', goLive: 'Jul 30, 2025', risk: 'Medium', reason: 'Multiple dependencies' },
  { initiative: 'Enterprise Auth Transformation', portfolio: 'Shared Tech', goLive: 'Sep 10, 2025', risk: 'Medium', reason: 'Environment readiness' },
  { initiative: 'Benefits Admin Upgrade', portfolio: 'Insurance', goLive: 'Aug 15, 2025', risk: 'Low', reason: 'Manual testing bandwidth' },
];

const INTAKE = [
  { id: 1, title: 'Pharmacy Portal Enhancement', portfolio: 'Insurance', status: 'New', time: '1h ago', icon: <ShoppingCart /> },
  { id: 2, title: 'Provider Search Optimization', portfolio: 'CenterWell', status: 'New', time: '2h ago', icon: <FileText /> },
  { id: 3, title: 'Claims Document AI', portfolio: 'Insurance', status: 'In Review', time: '5h ago', icon: <FileText /> },
  { id: 4, title: 'Member Communications Hub', portfolio: 'Insurance', status: 'In Review', time: '1d ago', icon: <MessageSquare /> },
  { id: 5, title: 'Clinical Scheduling Platform', portfolio: 'CenterWell', status: 'Queued', time: '1d ago', icon: <Stethoscope /> },
];

const RISK_VARIANT = { High: 'error', Medium: 'warning', Low: 'success' };
const INTAKE_VARIANT = { New: 'info', 'In Review': 'warning', Queued: 'neutral' };

/**
 * A right-aligned footer link rendered at the bottom of a panel.
 *
 * @param {object} props
 * @param {string} props.label - Link text
 * @returns {React.ReactElement}
 */
function PanelFooterLink({ label, onClick }) {
  return (
    <div className="mt-4 -mx-5 -mb-5 border-t border-slate-100">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-center gap-1.5 py-3 text-sm font-medium text-info-600 transition-colors hover:bg-slate-50 hover:text-info-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500"
      >
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Compact chart tooltip used across the demand panels.
 *
 * @param {object} props - Recharts tooltip props
 * @returns {React.ReactElement|null}
 */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      {label ? <p className="text-xs font-medium text-slate-900">{label}</p> : null}
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-slate-600" style={{ color: entry.color || entry.payload?.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

/**
 * Demand Management dashboard — capacity-planning view rebuilt to match the
 * EQIP UX mock (Docs/mocks/02-demand-management.png).
 *
 * @returns {React.ReactElement}
 */
function DemandManagementPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const [range, setRange] = useState('Last 30 Days');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Demand Management' },
    ]);
  }, [setBreadcrumbs]);

  const open = (label) => toast({ title: label, description: 'Detailed view is a demo in this frontend-only build.' });

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-humana-green-50 text-humana-green-600">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Demand Management</h1>
            <p className="text-sm text-slate-500">Plan demand. Align capacity. Deliver quality.</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-card">
          <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <select value={range} onChange={(e) => setRange(e.target.value)} className="bg-transparent focus:outline-none">
            {['Last 30 Days', 'Last 60 Days', 'Last 90 Days'].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPIS.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            subtitle={kpi.subtitle}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            changePercent={kpi.changePercent}
            changeLabel={kpi.changeLabel}
            changeText={kpi.changeText}
            changeTone={kpi.changeTone}
            icon={kpi.icon}
            tone={kpi.tone}
          />
        ))}
      </div>

      {/* Row 1: Pipeline donut · Capacity gauge · Demand vs Capacity trend */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Demand Pipeline */}
        <PanelCard title="Demand Pipeline" subtitle="(Next 90 Days)">
          <div className="flex items-center gap-2">
            <div className="relative h-[190px] w-[190px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIPELINE} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {PIPELINE.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-slate-900">3,248</span>
                <span className="text-2xs text-slate-400">FTEs</span>
              </div>
            </div>
            <ul className="flex flex-1 flex-col gap-2">
              {PIPELINE.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden="true" />
                    <span className="truncate text-slate-600">{d.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-500">
                    <span className="font-semibold text-slate-900">{d.value}</span> ({d.pct}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <PanelFooterLink label="View Demand Pipeline" onClick={() => open('Demand Pipeline')} />
        </PanelCard>

        {/* Capacity Overview */}
        <PanelCard title="Capacity Overview" subtitle="(Next 90 Days)">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[240px]">
              <GaugeComponent
                type="semicircle"
                value={78}
                minValue={0}
                maxValue={100}
                arc={{
                  width: 0.25,
                  padding: 0.01,
                  cornerRadius: 2,
                  subArcs: [
                    { limit: 40, color: '#16b364' },
                    { limit: 75, color: '#f59e0b' },
                    { limit: 100, color: '#ef4444' },
                  ],
                }}
                pointer={{ type: 'needle', color: '#334155', width: 12, length: 0.7 }}
                labels={{ valueLabel: { hide: true }, tickLabels: { hideMinMax: true } }}
              />
            </div>
            <div className="-mt-2 flex flex-col items-center">
              <span className="text-2xl font-semibold text-slate-900">78%</span>
              <span className="text-2xs text-slate-400">Utilization</span>
            </div>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {CAPACITY.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} aria-hidden="true" />
                  <span className="text-slate-600">{c.name}</span>
                </span>
                <span className="tabular-nums text-slate-500">
                  <span className="font-semibold text-slate-900">{c.fte.toLocaleString()} FTEs</span> ({c.pct}%)
                </span>
              </li>
            ))}
          </ul>
          <PanelFooterLink label="View Capacity Overview" onClick={() => open('Capacity Overview')} />
        </PanelCard>

        {/* Demand vs Capacity Trend */}
        <PanelCard title="Demand vs Capacity Trend">
          <ChartWrapper height={230} noCard noPadding>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="demand" name="Demand (FTEs)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 2.5, fill: '#8b5cf6', strokeWidth: 0 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="capacity" name="Capacity (FTEs)" stroke="#16b364" strokeWidth={2.5} dot={{ r: 2.5, fill: '#16b364', strokeWidth: 0 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <PanelFooterLink label="View Full Forecast" onClick={() => open('Full Forecast')} />
        </PanelCard>
      </div>

      {/* Row 2: Portfolio bars · At-risk table · Recent intake */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Top Demand by Portfolio */}
        <PanelCard title="Top Demand by Portfolio" subtitle="(Next 90 Days)">
          <ChartWrapper height={230} noCard noPadding>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PORTFOLIO} layout="vertical" margin={{ top: 4, right: 40, left: 20, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false}>
                  {PORTFOLIO.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <PanelFooterLink label="View Portfolio Demand" onClick={() => open('Portfolio Demand')} />
        </PanelCard>

        {/* Upcoming At Risk Initiatives */}
        <PanelCard title="Upcoming At Risk Initiatives">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-2xs uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-2 font-medium">Initiative</th>
                  <th className="pb-2 pr-2 font-medium">Go Live</th>
                  <th className="pb-2 pr-2 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {AT_RISK.map((r) => (
                  <tr key={r.initiative} className="border-t border-slate-100">
                    <td className="py-2 pr-2">
                      <p className="font-medium text-slate-800">{r.initiative}</p>
                      <p className="text-2xs text-slate-400">{r.portfolio} · {r.reason}</p>
                    </td>
                    <td className="py-2 pr-2 text-slate-600 whitespace-nowrap">{r.goLive}</td>
                    <td className="py-2 pr-2">
                      <Badge variant={RISK_VARIANT[r.risk]} size="sm">{r.risk}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooterLink label="View All At Risk Initiatives" onClick={() => open('At Risk Initiatives')} />
        </PanelCard>

        {/* Recent Demand Intake */}
        <PanelCard title="Recent Demand Intake">
          <ul className="flex flex-col divide-y divide-slate-100">
            {INTAKE.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 [&_svg]:h-4 [&_svg]:w-4">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-2xs text-slate-400">{item.portfolio} · New Intake</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge variant={INTAKE_VARIANT[item.status]} size="sm">{item.status}</Badge>
                  <span className="text-2xs text-slate-400">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <PanelFooterLink label="View Intake Queue" onClick={() => open('Intake Queue')} />
        </PanelCard>
      </div>

      {/* Insight banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-humana-green-200 bg-humana-green-50 p-4 sm:flex-row sm:items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-humana-green-100 text-humana-green-600" aria-hidden="true">
          <Lightbulb className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-humana-green-900">Insight</p>
          <p className="text-sm text-humana-green-900/80">
            Demand is projected to exceed capacity by 236 FTEs in the next 90 days. Review at risk initiatives and take early action.
          </p>
        </div>
        <button
          type="button"
          onClick={() => open('Capacity Recommendations')}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-humana-green-700 hover:text-humana-green-800"
        >
          View Recommendations <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

DemandManagementPage.displayName = 'DemandManagementPage';

export { DemandManagementPage };
export default DemandManagementPage;
