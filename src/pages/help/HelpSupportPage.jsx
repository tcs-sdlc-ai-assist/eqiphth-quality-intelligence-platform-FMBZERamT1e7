import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  MessageCircle,
  ExternalLink,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DATA_VERSION, ROUTES } from '@/lib/constants';

/* Mock content for the Help & Support page — frontend-only. */

const DOC_TOPICS = [
  { title: 'Getting Started with EQIP', desc: 'Navigating workspaces, switching personas, and understanding role-based access.' },
  { title: 'Humana Test Harness Guide', desc: 'Test cases, executions, triage, and release readiness workflows inside HTH.' },
  { title: 'Release Readiness & Quality Gates', desc: 'How readiness scores are calculated and how to request or approve a waiver.' },
  { title: 'Demand Management Guide', desc: 'Submitting intake requests, tracking the demand pipeline, and capacity approvals.' },
  { title: 'Governance & Compliance Guide', desc: 'Procedure adherence, audit evidence, and non-compliance drill-down.' },
];

const SHORTCUTS = [
  { keys: 'Esc', action: 'Close the open dialog or dropdown' },
  { keys: 'Tab / Shift+Tab', action: 'Move focus between interactive elements' },
  { keys: 'Enter / Space', action: 'Activate the focused button, link, or menu item' },
  { keys: '↑ / ↓', action: 'Move between items in an open dropdown or select menu' },
];

const RELEASE_NOTES = [
  { version: 'v2.4.0', date: '2026-07-15', notes: ['Added the Humana Test Harness module shell with its own Analytics/Inventory navigation.', 'Added Bugs/Defects Overview and rebuilt Release Readiness as a table view.', 'Added role-based navigation, approvals, and Human-in-the-Loop review queues.'] },
  { version: 'v2.3.0', date: '2026-06-02', notes: ['Added Demand Management sub-areas: Inventory and Approvals.', 'Added Application Master detail dialog and extra filters.'] },
  { version: 'v2.2.0', date: '2026-04-18', notes: ['Introduced the AI Agent Workforce screen.', 'Added Enterprise Knowledge Graph search.'] },
];

const SUPPORT_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const HASH_TAB_MAP = {
  '#documentation': 'documentation',
  '#shortcuts': 'shortcuts',
  '#support': 'support',
  '#release-notes': 'release-notes',
  '#about': 'about',
};

/**
 * Help & Support — Documentation, Keyboard Shortcuts, Contact Support,
 * Release Notes, and About, reached from the top-header Help menu and the
 * HTH sidebar's "HTH Docs & Support" link. Deep-links via URL hash.
 *
 * @returns {React.ReactElement}
 */
function HelpSupportPage() {
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => HASH_TAB_MAP[location.hash] || 'documentation');
  const [form, setForm] = useState({ subject: '', priority: 'medium', description: '' });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Help & Support' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    setActiveTab(HASH_TAB_MAP[location.hash] || 'documentation');
  }, [location.hash]);

  const handleSubmitSupport = () => {
    if (!form.subject.trim()) return;
    toast({
      variant: 'success',
      title: 'Support request submitted',
      description: `"${form.subject}" (${form.priority} priority) has been logged with the EQIP support team.`,
    });
    setForm({ subject: '', priority: 'medium', description: '' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-humana-green-50 text-humana-green-600">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Help &amp; Support</h1>
          <p className="text-sm text-slate-500">Documentation, shortcuts, release notes, and how to reach the EQIP support team.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
          <TabsTrigger value="support">Contact Support</TabsTrigger>
          <TabsTrigger value="release-notes">Release Notes</TabsTrigger>
          <TabsTrigger value="about">About EQIP</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {DOC_TOPICS.map((d) => (
              <div key={d.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-humana-green-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{d.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shortcuts">
          <PanelCard title="Keyboard Shortcuts" icon={<Keyboard className="h-5 w-5" />}>
            <div className="flex flex-col divide-y divide-slate-100">
              {SHORTCUTS.map((s) => (
                <div key={s.action} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                  <span className="text-sm text-slate-700">{s.action}</span>
                  <kbd className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </PanelCard>
        </TabsContent>

        <TabsContent value="support">
          <PanelCard title="Contact Support" subtitle="Submit a request and the EQIP support team will follow up." icon={<MessageCircle className="h-5 w-5" />}>
            <div className="flex flex-col gap-4">
              <Input label="Subject" placeholder="e.g. Unable to export Reporting data" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required />
              <Select label="Priority" value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))} options={SUPPORT_PRIORITIES} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-none text-slate-700">Description</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-humana-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 hover:border-slate-400"
                  placeholder="Describe the issue or question..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                />
              </div>
              <Button variant="primary" size="md" onClick={handleSubmitSupport} disabled={!form.subject.trim()} className="self-start">Submit Request</Button>
            </div>
          </PanelCard>
        </TabsContent>

        <TabsContent value="release-notes">
          <div className="flex flex-col gap-4">
            {RELEASE_NOTES.map((r) => (
              <PanelCard key={r.version} title={r.version} subtitle={r.date} icon={<ExternalLink className="h-5 w-5" />}>
                <ul className="flex flex-col gap-1.5">
                  {r.notes.map((n) => (
                    <li key={n} className="flex items-start gap-2 text-sm text-slate-600">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                      {n}
                    </li>
                  ))}
                </ul>
              </PanelCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about">
          <PanelCard title="About EQIP" icon={<Info className="h-5 w-5" />}>
            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <p>The Enterprise Quality Intelligence Platform (EQIP) unifies data, intelligence, automation, and governance to orchestrate intelligent quality across Humana's enterprise applications.</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" size="sm">Version {DATA_VERSION}</Badge>
                <Badge variant="outline" size="sm">Humana Internal Use Only</Badge>
              </div>
            </div>
          </PanelCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

HelpSupportPage.displayName = 'HelpSupportPage';

export { HelpSupportPage };
export default HelpSupportPage;
