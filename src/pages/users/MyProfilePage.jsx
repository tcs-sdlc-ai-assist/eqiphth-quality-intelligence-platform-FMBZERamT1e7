import { useState, useEffect } from 'react';
import {
  User,
  Settings,
  Bell,
  Heart,
  Bookmark,
  RefreshCw,
  Mail,
  MessageSquare,
  Chrome,
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { PanelCard } from '@/components/shared/PanelCard';
import { PageActions } from '@/components/layout/PageActions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { ROUTES } from '@/lib/constants';

export function MyProfilePage() {
  const { currentPersona } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { toast } = useToast();

  usePageHeader({
    title: 'My Profile',
    subtitle: `Manage your personal settings, notification rules, and workspace dashboard favorites.`,
  });

  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState(currentPersona.name || '');
  const [profileEmail, setProfileEmail] = useState(currentPersona.email || `${currentPersona.id}@humana.com`);
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [teamsNotif, setTeamsNotif] = useState(true);
  const [slackNotif, setSlackNotif] = useState(false);
  const [realtimeFrequency, setRealtimeFrequency] = useState('daily');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'My Profile' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    setProfileName(currentPersona.name || '');
    setProfileEmail(currentPersona.email || `${currentPersona.id}@humana.com`);
  }, [currentPersona]);

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your profile settings have been successfully updated.',
      variant: 'success',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Save Changes — portalled into the navbar (left of the bell) */}
      <PageActions>
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </PageActions>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card details */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <PanelCard
            title="Profile Details"
            subtitle="Your current persona credentials"
            icon={<User className="h-5 w-5 text-emerald-600" />}
          >
            <div className="flex flex-col items-center py-4 border-b border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 font-extrabold text-2xl mb-3 shadow-inner">
                {profileName.charAt(0)}
              </div>
              <h3 className="font-semibold text-slate-900 text-base">{profileName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentPersona.role}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-2xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  {currentPersona.segment} Segment
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">User ID</label>
                <span className="text-sm text-slate-700 font-mono select-all bg-slate-50 border rounded p-1.5">{currentPersona.id}</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
                <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
              </div>
            </div>
          </PanelCard>
        </div>

        {/* Notifications & Saved Favorites */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Notifications */}
          <PanelCard
            title="Notification Preferences"
            subtitle="Control email and system messaging rules"
            icon={<Bell className="h-5 w-5 text-emerald-600" />}
          >
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">Email Notifications</span>
                    <span className="text-xs text-slate-500">Send alerts to {profileEmail}</span>
                  </div>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">Microsoft Teams Alerts</span>
                    <span className="text-xs text-slate-500">Push to HTH workspace channel</span>
                  </div>
                </div>
                <Switch checked={teamsNotif} onCheckedChange={setTeamsNotif} />
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <Chrome className="h-5 w-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">Slack Notifications</span>
                    <span className="text-xs text-slate-500">Push alerts to development channel</span>
                  </div>
                </div>
                <Switch checked={slackNotif} onCheckedChange={setSlackNotif} />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Digest Frequency</span>
                <div className="flex gap-4">
                  {['realtime', 'daily', 'weekly'].map((freq) => (
                    <label key={freq} className="flex items-center gap-2 text-xs font-semibold text-slate-700 capitalize cursor-pointer">
                      <input
                        type="radio"
                        name="frequency"
                        value={freq}
                        checked={realtimeFrequency === freq}
                        onChange={(e) => setRealtimeFrequency(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {freq}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </PanelCard>

          {/* Favorites & Bookmarks */}
          <PanelCard
            title="Saved Views & Favorites"
            subtitle="Your favorited segments and applications"
            icon={<Heart className="h-5 w-5 text-emerald-600" />}
          >
            <div className="flex flex-col gap-4 text-xs py-2">
              <div className="flex flex-col gap-2 border-b pb-3">
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Favorite Segment</span>
                <span className="font-semibold text-slate-800 text-sm">{currentPersona.segment} Segment</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">Default Landing Page</span>
                <span className="font-semibold text-slate-800 text-sm">{currentPersona.landingPage || ROUTES.DASHBOARD}</span>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
