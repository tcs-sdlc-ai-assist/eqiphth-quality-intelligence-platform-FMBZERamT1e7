import { useState, useEffect, useMemo } from 'react';
import {
  ListTodo,
  RefreshCw,
  Search,
  Filter,
  FileDown,
  ScrollText,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { KpiCard } from '@/components/shared/KpiCard';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { PageActions } from '@/components/layout/PageActions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tooltip as UiTooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { getAllAuditLogs } from '@/data/auditLogs';
import { ROUTES } from '@/lib/constants';

const FILTER_FIELDS = [
  {
    id: 'outcome',
    label: 'Outcome',
    type: 'select',
    options: [
      { value: '', label: 'All Outcomes' },
      { value: 'success', label: 'Success' },
      { value: 'failure', label: 'Failure' },
      { value: 'denied', label: 'Denied' },
    ],
    defaultValue: '',
  },
  {
    id: 'segment',
    label: 'Segment',
    type: 'select',
    options: [
      { value: '', label: 'All Segments' },
      { value: 'Enterprise', label: 'Enterprise' },
      { value: 'Medicare', label: 'Medicare' },
      { value: 'Medicaid', label: 'Medicaid' },
      { value: 'Commercial', label: 'Commercial' },
      { value: 'Compliance', label: 'Compliance' },
      { value: 'External', label: 'External' },
    ],
    defaultValue: '',
  },
];

export function EQELogPage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  usePageHeader({
    title: 'EQE Log',
    subtitle: `Audit logging console tracking deployments, executions, environments, and quality gate updates.`,
  });

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    outcome: '',
    segment: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Administration', path: ROUTES.ADMIN },
      { label: 'EQE Log' },
    ]);
    setLogs(getAllAuditLogs() || []);
  }, [setBreadcrumbs]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLogs(getAllAuditLogs() || []);
      toast({
        title: 'Logs Synced',
        description: 'Audit logs synchronized with the server database.',
        variant: 'success',
      });
    }, 400);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filters.outcome && log.outcome !== filters.outcome) return false;
      if (filters.segment && log.segment !== filters.segment) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const details = (log.details || '').toLowerCase();
        const action = (log.action || '').toLowerCase();
        const user = (log.personaName || '').toLowerCase();
        if (!details.includes(query) && !action.includes(query) && !user.includes(query)) return false;
      }
      return true;
    });
  }, [logs, filters, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Refresh Logs — portalled into the navbar (left of the bell) */}
      <PageActions>
        <UiTooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              iconLeft={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              aria-label="Refresh logs"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Refresh Logs</TooltipContent>
        </UiTooltip>
      </PageActions>

      {/* KPI stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Logged Events" value={logs.length.toString()} trend="stable" icon={<ScrollText />} tone="blue" />
        <KpiCard label="Successful Operations" value={logs.filter(l => l.outcome === 'success').length.toString()} trend="improving" icon={<CheckCircle2 />} tone="green" />
        <KpiCard label="Failed Checks" value={logs.filter(l => l.outcome === 'failure' || l.outcome === 'denied').length.toString()} trend="declining" icon={<AlertTriangle />} tone="red" />
        <KpiCard label="Sync Quality" value="100%" trend="stable" icon={<Activity />} tone="purple" />
      </div>

      {/* Filters and search */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by action, details, or user..."
              className="pl-10 text-xs"
            />
          </div>
        </div>
        <FilterBar fields={FILTER_FIELDS} values={filters} onChange={handleFilterChange} liveMode showApplyButton={false} showResetButton />
      </div>

      {/* Audit Log Table */}
      <PanelCard
        title="Audit Logs Database"
        subtitle={`Showing ${filteredLogs.length} events matching query`}
        icon={<ListTodo className="h-5 w-5 text-emerald-600" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-2xs uppercase text-slate-500 font-semibold border-b">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">User (Persona)</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLogs.slice(0, 50).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-500 font-mono text-2xs whitespace-nowrap">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{log.action || 'Event'}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{log.details || '-'}</td>
                  <td className="px-4 py-3 font-medium">{log.personaName || 'System'}</td>
                  <td className="px-4 py-3 text-slate-500">{log.segment || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusPill status={log.outcome || 'success'} size="sm" dot />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}

export default EQELogPage;
