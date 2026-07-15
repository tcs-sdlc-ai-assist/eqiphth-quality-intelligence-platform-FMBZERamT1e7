import { useEffect, useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { usePersona } from '@/context/PersonaContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PERMISSIONS, ROUTES } from '@/lib/constants';

/* Mock data — HTH framework configuration (PRD §5 "Inventory › Configurations", §6.24). */

const INITIAL_TEST_TYPES = [
  { key: 'functional', label: 'Functional Testing', enabled: true },
  { key: 'regression', label: 'Regression Testing', enabled: true },
  { key: 'api', label: 'API Testing', enabled: true },
  { key: 'performance', label: 'Performance Testing', enabled: true },
  { key: 'security', label: 'Security Testing', enabled: true },
  { key: 'accessibility', label: 'Accessibility Testing', enabled: false },
];

const INITIAL_GATES = [
  { key: 'manual_complete', label: 'Manual Testing Complete', enabled: true },
  { key: 'automation_complete', label: 'Automation Execution Complete', enabled: true },
  { key: 'unit_coverage', label: 'Unit Test Coverage Met', enabled: true },
  { key: 'security_scan', label: 'Security Scan Passed', enabled: true },
  { key: 'defect_threshold', label: 'Defect Threshold Met', enabled: false },
];

const RETRY_OPTIONS = [
  { value: '0', label: 'No retries' },
  { value: '1', label: 'Retry once' },
  { value: '2', label: 'Retry twice' },
  { value: '3', label: 'Retry 3 times' },
];

const FAILURE_HANDLING_OPTIONS = [
  { value: 'continue', label: 'Continue on failure' },
  { value: 'stop', label: 'Stop suite on failure' },
  { value: 'quarantine', label: 'Quarantine and continue' },
];

/**
 * Configurations — HTH framework and quality-gate configuration, per PRD §5
 * "Inventory › Configurations" and §6.24's Test Type / Quality Gate
 * Configuration concepts, scoped to the test harness. Read-only for
 * personas without `EDIT_QUALITY_GATES`; editable for QE leadership/admin.
 *
 * @returns {React.ReactElement}
 */
function ConfigurationsPage() {
  const { setBreadcrumbs } = useNavigation();
  const { hasPermission } = usePersona();
  const { toast } = useToast();

  const [testTypes, setTestTypes] = useState(INITIAL_TEST_TYPES);
  const [gates, setGates] = useState(INITIAL_GATES);
  const [retryRule, setRetryRule] = useState('1');
  const [failureHandling, setFailureHandling] = useState('continue');

  const canEdit = hasPermission(PERMISSIONS.EDIT_QUALITY_GATES);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Humana Test Harness', path: ROUTES.HTH },
      { label: 'Configurations' },
    ]);
  }, [setBreadcrumbs]);

  const toggleTestType = (key) => setTestTypes((prev) => prev.map((t) => (t.key === key ? { ...t, enabled: !t.enabled } : t)));
  const toggleGate = (key) => setGates((prev) => prev.map((g) => (g.key === key ? { ...g, enabled: !g.enabled } : g)));

  const handleSave = () => {
    toast({ variant: 'success', title: 'Configuration saved', description: 'Test harness configuration updated for this session.' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-humana-green-50 text-humana-green-600">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Configurations</h1>
            <p className="text-sm text-slate-500">Test type, quality gate, and execution defaults for the Humana Test Harness.</p>
          </div>
        </div>
        <PermissionGate requiredAction={PERMISSIONS.EDIT_QUALITY_GATES} behavior="hidden">
          <Button variant="primary" size="sm" iconLeft={<Save className="h-3.5 w-3.5" />} onClick={handleSave}>Save Changes</Button>
        </PermissionGate>
      </div>

      {!canEdit ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          You have read-only access to these configurations. Contact a QE Manager or Administrator to make changes.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard title="Test Type Configuration" subtitle="Testing types available for suite authoring">
          <div className="flex flex-col divide-y divide-slate-100">
            {testTypes.map((t) => (
              <div key={t.key} className="py-2.5 first:pt-0">
                <Switch label={t.label} checked={t.enabled} onCheckedChange={() => toggleTestType(t.key)} disabled={!canEdit} />
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Quality Gate Configuration" subtitle="Gates enforced before a release is marked ready">
          <div className="flex flex-col divide-y divide-slate-100">
            {gates.map((g) => (
              <div key={g.key} className="py-2.5 first:pt-0">
                <Switch label={g.label} checked={g.enabled} onCheckedChange={() => toggleGate(g.key)} disabled={!canEdit} />
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Retry Rules" subtitle="Default retry behavior for scheduled executions">
          <Select label="Retry Policy" value={retryRule} onValueChange={setRetryRule} options={RETRY_OPTIONS} disabled={!canEdit} />
        </PanelCard>

        <PanelCard title="Failure Handling" subtitle="Default behavior when a test step fails mid-suite">
          <Select label="On Failure" value={failureHandling} onValueChange={setFailureHandling} options={FAILURE_HANDLING_OPTIONS} disabled={!canEdit} />
        </PanelCard>
      </div>
    </div>
  );
}

ConfigurationsPage.displayName = 'ConfigurationsPage';

export { ConfigurationsPage };
export default ConfigurationsPage;
