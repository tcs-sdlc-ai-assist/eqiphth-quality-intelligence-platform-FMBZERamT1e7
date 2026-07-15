import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, X, Plus } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { usePersona } from '@/context/PersonaContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ROUTES } from '@/lib/constants';

/**
 * Maps `persona.navConfig.pinnedItems` keys (and any bookmark a user adds) to
 * a real route + display label, so "Bookmarks" (PRD §5) is a genuine,
 * per-persona saved-views list rather than a static placeholder.
 */
const BOOKMARKABLE_PAGES = {
  dashboard: { label: 'Executive Dashboard', to: ROUTES.DASHBOARD },
  measures: { label: 'Humana Test Harness', to: ROUTES.HTH },
  patients: { label: 'Test Data Management', to: ROUTES.TEST_DATA },
  reports: { label: 'Reports & Analytics', to: ROUTES.REPORTS },
  analytics: { label: 'AI Insights', to: ROUTES.AI_INSIGHTS },
  settings: { label: 'Administration', to: ROUTES.ADMIN },
  applications: { label: 'Application Master', to: ROUTES.APPLICATIONS },
  demand: { label: 'Demand Management', to: ROUTES.DEMAND },
  quality_gates: { label: 'Quality Gates', to: ROUTES.QUALITY_GATES },
  governance: { label: 'Governance & Compliance', to: ROUTES.GOVERNANCE },
  release_readiness: { label: 'Release Readiness', to: ROUTES.RELEASE_READINESS },
  bugs_defects: { label: 'Bugs / Defects', to: ROUTES.BUGS_DEFECTS },
};

/**
 * Bookmarks — a per-persona list of saved/pinned views, per PRD §5's
 * top-level "Bookmarks" nav item. Seeded from `persona.navConfig.pinnedItems`;
 * users can add or remove bookmarks for the session.
 *
 * @returns {React.ReactElement}
 */
function BookmarksPage() {
  const { setBreadcrumbs } = useNavigation();
  const { currentPersona } = usePersona();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState(() => (currentPersona.navConfig?.pinnedItems || []).filter((k) => BOOKMARKABLE_PAGES[k]));
  const [addKey, setAddKey] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Bookmarks' },
    ]);
  }, [setBreadcrumbs]);

  const availableToAdd = Object.keys(BOOKMARKABLE_PAGES).filter((k) => !bookmarks.includes(k));

  const addBookmark = () => {
    if (!addKey) return;
    setBookmarks((prev) => [...prev, addKey]);
    toast({ variant: 'success', title: 'Bookmark added', description: `${BOOKMARKABLE_PAGES[addKey].label} added to your bookmarks.` });
    setAddKey('');
  };

  const removeBookmark = (key) => {
    setBookmarks((prev) => prev.filter((k) => k !== key));
    toast({ variant: 'success', title: 'Bookmark removed', description: `${BOOKMARKABLE_PAGES[key].label} removed from your bookmarks.` });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-humana-green-50 text-humana-green-600">
          <Bookmark className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Bookmarks</h1>
          <p className="text-sm text-slate-500">{currentPersona.name}'s saved views, pinned for quick access.</p>
        </div>
      </div>

      <PanelCard title="Add a Bookmark">
        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="Page"
            placeholder="Choose a page to bookmark"
            value={addKey}
            onValueChange={setAddKey}
            options={availableToAdd.map((k) => ({ value: k, label: BOOKMARKABLE_PAGES[k].label }))}
            wrapperClassName="w-64"
            disabled={availableToAdd.length === 0}
          />
          <Button variant="primary" size="md" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={addBookmark} disabled={!addKey}>
            Add Bookmark
          </Button>
        </div>
      </PanelCard>

      {bookmarks.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          message="Add a page above to pin it here for quick access."
          bordered
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((key) => {
            const page = BOOKMARKABLE_PAGES[key];
            return (
              <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                <button type="button" onClick={() => navigate(page.to)} className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-slate-800 hover:text-humana-green-700">
                  {page.label} <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => removeBookmark(key)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={`Remove ${page.label} bookmark`}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

BookmarksPage.displayName = 'BookmarksPage';

export { BookmarksPage };
export default BookmarksPage;
