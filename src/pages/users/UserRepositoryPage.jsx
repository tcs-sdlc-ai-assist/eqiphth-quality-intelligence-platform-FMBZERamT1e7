import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
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
import {
  Users,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Shield,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Mail,
  Globe,
  Monitor,
  Search,
  Settings,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON, getInitials } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getUsers,
} from '@/lib/mock-api/mockService';
import {
  getAllUsers,
  getUserById,
  getUsersByRole,
  getUsersBySegment,
  getUsersByStatus,
  getUsersByDepartment,
  getUserAggregates,
  getAllUserStatuses,
  getAllUserRoles,
  getAllUserSegments,
  getAllUserDepartments,
  getAllUserGroups,
  getAllUserLocations,
} from '@/data/users';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { InsightBanner } from '@/components/shared/InsightBanner';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import {
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/Tooltip';
import { PERMISSIONS, ROUTES } from '@/lib/constants';

const SEGMENT_COLORS = {
  Enterprise: '#16b364',
  Medicare: '#3b82f6',
  Medicaid: '#f59e0b',
  Commercial: '#8b5cf6',
  External: '#ef4444',
  Compliance: '#06b6d4',
};

const USER_STATUS_COLORS = {
  active: '#10b981',
  inactive: '#a3a3a3',
  locked: '#ef4444',
  pending: '#f59e0b',
  suspended: '#dc2626',
};

function CustomTooltipChart({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      <p className="text-xs font-medium text-slate-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs text-slate-600" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

function formatLabel(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusBadgeVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'neutral';
    case 'locked':
      return 'error';
    case 'pending':
      return 'warning';
    case 'suspended':
      return 'error';
    default:
      return 'neutral';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'active':
      return CheckCircle;
    case 'inactive':
      return XCircle;
    case 'locked':
      return Lock;
    case 'pending':
      return Clock;
    case 'suspended':
      return AlertTriangle;
    default:
      return User;
  }
}

function EditUserDialog({ open, onOpenChange, onSubmit, loading, user }) {
  const roleOptions = useMemo(() => {
    return getAllUserRoles().map((r) => ({ value: r, label: r }));
  }, []);

  const segmentOptions = useMemo(() => {
    return getAllUserSegments().map((s) => ({ value: s, label: s }));
  }, []);

  const statusOptions = useMemo(() => {
    return getAllUserStatuses().map((s) => ({
      value: s,
      label: formatLabel(s),
    }));
  }, []);

  const departmentOptions = useMemo(() => {
    return getAllUserDepartments().map((d) => ({ value: d, label: d }));
  }, []);

  const locationOptions = useMemo(() => {
    return getAllUserLocations().map((l) => ({ value: l, label: l }));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    segment: 'Enterprise',
    status: 'active',
    department: '',
    title: '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        segment: user.segment || 'Enterprise',
        status: user.status || 'active',
        department: user.department || '',
        title: user.title || '',
        phone: user.phone || '',
        location: user.location || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        segment: 'Enterprise',
        status: 'active',
        department: '',
        title: '',
        phone: '',
        location: '',
      });
    }
    setErrors({});
  }, [user, open]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleInputChange = useCallback(
    (field) => (e) => {
      handleChange(field, e.target.value);
    },
    [handleChange]
  );

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    onSubmit(formData);
  }, [formData, validate, onSubmit]);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (!nextOpen) {
        setFormData({
          name: '',
          email: '',
          role: '',
          segment: 'Enterprise',
          status: 'active',
          department: '',
          title: '',
          phone: '',
          location: '',
        });
        setErrors({});
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user account details below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role"
              placeholder="Select role"
              options={roleOptions}
              value={formData.role}
              onValueChange={(val) => handleChange('role', val)}
              error={errors.role}
              required
            />
            <Select
              label="Segment"
              options={segmentOptions}
              value={formData.segment}
              onValueChange={(val) => handleChange('segment', val)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onValueChange={(val) => handleChange('status', val)}
            />
            <Select
              label="Department"
              placeholder="Select department"
              options={departmentOptions}
              value={formData.department}
              onValueChange={(val) => handleChange('department', val)}
            />
          </div>

          <Input
            label="Job Title"
            placeholder="Enter job title"
            value={formData.title}
            onChange={handleInputChange('title')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
              placeholder="(555) 000-0000"
              value={formData.phone}
              onChange={handleInputChange('phone')}
            />
            <Select
              label="Location"
              placeholder="Select location"
              options={locationOptions}
              value={formData.location}
              onValueChange={(val) => handleChange('location', val)}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" size="md" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserDetailDialog({ user, open, onOpenChange, onLock, onUnlock, onDeactivate, onActivate, onEdit }) {
  const { hasPermission } = usePersona();

  if (!user) return null;

  const accessHistory = user.accessHistory || [];
  const groups = user.groups || [];
  const preferences = user.preferences || {};
  const canManage = hasPermission(PERMISSIONS.MANAGE_USERS);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Avatar name={user.name} size="lg" />
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{user.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {user.email} • {user.role} • {user.segment}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getStatusBadgeVariant(user.status)} size="md">
            {formatLabel(user.status)}
          </Badge>
          <Badge variant="outline" size="md">
            {user.segment}
          </Badge>
          <Badge variant="outline" size="md">
            {user.department}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{user.status}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Role</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{user.role}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Department</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{user.department}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Location</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{user.location}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Email:</span>
            <span className="font-medium text-slate-900">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Title:</span>
            <span className="font-medium text-slate-900">{user.title || '—'}</span>
          </div>
          {user.phone ? (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Phone:</span>
              <span className="font-medium text-slate-900">{user.phone}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Created:</span>
            <span className="font-medium text-slate-900">{formatDate(user.createdDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Login:</span>
            <span className="font-medium text-slate-900">
              {user.lastLogin ? formatDate(user.lastLogin, 'MMM d, yyyy h:mm a') : 'Never'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Modified:</span>
            <span className="font-medium text-slate-900">{formatDate(user.lastModifiedDate)}</span>
          </div>
          {user.managerId ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-slate-500">Manager ID:</span>
              <span className="font-medium text-slate-900">{user.managerId}</span>
            </div>
          ) : null}
        </div>

        {groups.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Groups ({groups.length})</h4>
            <div className="flex flex-wrap gap-1.5">
              {groups.map((group) => (
                <Badge key={group} variant="outline" size="sm">{group}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Preferences</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Theme</span>
              <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">{preferences.theme || '—'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Language</span>
              <p className="mt-1 text-sm font-semibold text-slate-900 uppercase">{preferences.language || '—'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Layout</span>
              <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">{preferences.dashboardLayout || '—'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Timezone</span>
              <p className="mt-1 text-xs font-semibold text-slate-900">{preferences.timezone || '—'}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span>Email Notifications: {preferences.emailNotifications ? 'On' : 'Off'}</span>
            <span>In-App Notifications: {preferences.inAppNotifications ? 'On' : 'Off'}</span>
            <span>Accessibility: {preferences.accessibilityMode ? 'On' : 'Off'}</span>
          </div>
        </div>

        {accessHistory.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Recent Access History ({accessHistory.length})</h4>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
              {accessHistory.map((entry, index) => (
                <div key={index} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusPill status={entry.action} size="sm" />
                        <span className="text-xs text-slate-500">{entry.ipAddress}</span>
                      </div>
                      {entry.resource ? (
                        <span className="text-2xs text-slate-400 font-mono">{entry.resource}</span>
                      ) : null}
                    </div>
                    <span className="text-2xs text-slate-400 shrink-0">
                      {entry.timestamp ? formatDate(entry.timestamp, 'MMM d, h:mm a') : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <DialogFooter className="pt-4">
          {canManage ? (
            <>
              <Button
                variant="outline"
                size="md"
                iconLeft={<Edit className="h-3.5 w-3.5" />}
                onClick={() => onEdit(user)}
              >
                Edit
              </Button>
              {user.status === 'active' ? (
                <>
                  <Button
                    variant="outline"
                    size="md"
                    iconLeft={<Lock className="h-3.5 w-3.5" />}
                    onClick={() => onLock(user.id)}
                  >
                    Lock
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    iconLeft={<UserMinus className="h-3.5 w-3.5" />}
                    onClick={() => onDeactivate(user.id)}
                  >
                    Deactivate
                  </Button>
                </>
              ) : null}
              {user.status === 'locked' ? (
                <Button
                  variant="primary"
                  size="md"
                  iconLeft={<Unlock className="h-3.5 w-3.5" />}
                  onClick={() => onUnlock(user.id)}
                >
                  Unlock
                </Button>
              ) : null}
              {user.status === 'inactive' || user.status === 'suspended' ? (
                <Button
                  variant="primary"
                  size="md"
                  iconLeft={<CheckCircle className="h-3.5 w-3.5" />}
                  onClick={() => onActivate(user.id)}
                >
                  Activate
                </Button>
              ) : null}
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsPanel({ users }) {
  const statusData = useMemo(() => {
    const counts = {};
    for (const u of users) {
      counts[u.status] = (counts[u.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [users]);

  const segmentData = useMemo(() => {
    const counts = {};
    for (const u of users) {
      counts[u.segment] = (counts[u.segment] || 0) + 1;
    }
    return Object.entries(counts).map(([segment, count]) => ({
      segment,
      count,
    }));
  }, [users]);

  const departmentData = useMemo(() => {
    const counts = {};
    for (const u of users) {
      counts[u.department] = (counts[u.department] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([department, count]) => ({
        department: department.length > 20 ? department.substring(0, 20) + '…' : department,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [users]);

  const roleData = useMemo(() => {
    const counts = {};
    for (const u of users) {
      counts[u.role] = (counts[u.role] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([role, count]) => ({
        role: role.length > 22 ? role.substring(0, 22) + '…' : role,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [users]);

  const locationData = useMemo(() => {
    const counts = {};
    for (const u of users) {
      counts[u.location] = (counts[u.location] || 0) + 1;
    }
    return Object.entries(counts).map(([location, count]) => ({
      location,
      count,
    }));
  }, [users]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="Users by Status"
        subtitle="Account status distribution"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={USER_STATUS_COLORS[entry.status] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} users`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: USER_STATUS_COLORS[item.status] || '#a3a3a3' }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Users by Segment"
        subtitle="Distribution across organizational segments"
        icon={<Layers className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="segment"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltipChart />} />
              <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]} barSize={32}>
                {segmentData.map((entry) => (
                  <Cell key={entry.segment} fill={SEGMENT_COLORS[entry.segment] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Users by Department"
        subtitle="Distribution across departments"
        icon={<Monitor className="h-5 w-5" />}
      >
        <ChartWrapper height={280} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltipChart />} />
              <Bar dataKey="count" name="Users" fill="#16b364" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Users by Role"
        subtitle="Distribution across role types"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {roleData.map((item) => (
            <div key={item.role} className="flex items-center gap-3">
              <div className="w-36 shrink-0 truncate">
                <span className="text-sm font-medium text-slate-700">{item.role}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={users.length || 1}
                  variant="primary"
                  size="sm"
                  animate
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard
        title="Users by Location"
        subtitle="Geographic distribution"
        icon={<Globe className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {locationData.map((item) => (
            <div key={item.location} className="flex items-center gap-3">
              <div className="w-28 shrink-0 truncate">
                <span className="text-sm font-medium text-slate-700">{item.location}</span>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={users.length || 1}
                  variant="info"
                  size="sm"
                  animate
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard
        title="Group Membership"
        subtitle="Top groups by member count"
        icon={<Users className="h-5 w-5" />}
      >
        {(() => {
          const groupCounts = {};
          for (const u of users) {
            for (const g of u.groups || []) {
              groupCounts[g] = (groupCounts[g] || 0) + 1;
            }
          }
          const groupData = Object.entries(groupCounts)
            .map(([group, count]) => ({
              group: group.length > 25 ? group.substring(0, 25) + '…' : group,
              count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          return (
            <div className="flex flex-col gap-3">
              {groupData.map((item) => (
                <div key={item.group} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 truncate">
                    <span className="text-xs font-medium text-slate-700">{item.group}</span>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={item.count}
                      max={users.length || 1}
                      variant="warning"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </PanelCard>
    </div>
  );
}

function UserRepositoryPageSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading user repository" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-96 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * User Repository page component.
 * Displays user directory with search, filters, and user detail view.
 * Shows user name, email, role, segment, status, last login, and access history.
 * Supports edit and status change actions (simulated).
 *
 * @returns {React.ReactElement}
 */
function UserRepositoryPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false);
  const [lockTarget, setLockTarget] = useState(null);
  const [unlockConfirmOpen, setUnlockConfirmOpen] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState(null);
  const [deactivateConfirmOpen, setDeactivateConfirmOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [activateConfirmOpen, setActivateConfirmOpen] = useState(false);
  const [activateTarget, setActivateTarget] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    segment: '',
    role: '',
    department: '',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Test Data', path: ROUTES.PATIENTS },
      { label: 'User Repository' },
    ]);
  }, [setBreadcrumbs]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filters.status) filterParams.status = filters.status;
      if (filters.segment) filterParams.segment = filters.segment;
      if (filters.role) filterParams.role = filters.role;
      if (filters.department) filterParams.department = filters.department;
      const data = await getUsers(filterParams);
      setUsers(data);
    } catch {
      setUsers(getAllUsers());
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  const handleUserClick = useCallback((user) => {
    setSelectedUser(user);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback((open) => {
    setDetailOpen(open);
    if (!open) setSelectedUser(null);
  }, []);

  const handleEditFromDetail = useCallback((user) => {
    setDetailOpen(false);
    setSelectedUser(null);
    setEditTarget(user);
    setEditOpen(true);
  }, []);

  const handleEditClick = useCallback((user) => {
    setEditTarget(user);
    setEditOpen(true);
  }, []);

  const handleEditSubmit = useCallback(
    (formData) => {
      setEditLoading(true);
      setTimeout(() => {
        logEvent('user_management', {
          action: 'User Updated',
          details: `User "${formData.name}" updated by ${currentPersona.name}.`,
          resource: editTarget ? editTarget.id : '',
          outcome: 'success',
        });
        toast({
          variant: 'success',
          title: 'User Updated',
          description: `"${formData.name}" has been updated successfully.`,
        });
        setEditOpen(false);
        setEditTarget(null);
        setEditLoading(false);
      }, 500);
    },
    [editTarget, currentPersona, logEvent, toast]
  );

  const handleLockClick = useCallback((userId) => {
    setLockTarget(userId);
    setLockConfirmOpen(true);
    setDetailOpen(false);
    setSelectedUser(null);
  }, []);

  const handleLockConfirm = useCallback(() => {
    if (!lockTarget) return;
    logEvent('user_management', {
      action: 'User Account Locked',
      details: `User account ${lockTarget} locked by ${currentPersona.name}.`,
      resource: lockTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Account Locked',
      description: 'The user account has been locked.',
    });
  }, [lockTarget, currentPersona, logEvent, toast]);

  const handleUnlockClick = useCallback((userId) => {
    setUnlockTarget(userId);
    setUnlockConfirmOpen(true);
    setDetailOpen(false);
    setSelectedUser(null);
  }, []);

  const handleUnlockConfirm = useCallback(() => {
    if (!unlockTarget) return;
    logEvent('user_management', {
      action: 'User Account Unlocked',
      details: `User account ${unlockTarget} unlocked by ${currentPersona.name}.`,
      resource: unlockTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Account Unlocked',
      description: 'The user account has been unlocked.',
    });
  }, [unlockTarget, currentPersona, logEvent, toast]);

  const handleDeactivateClick = useCallback((userId) => {
    setDeactivateTarget(userId);
    setDeactivateConfirmOpen(true);
    setDetailOpen(false);
    setSelectedUser(null);
  }, []);

  const handleDeactivateConfirm = useCallback(() => {
    if (!deactivateTarget) return;
    logEvent('user_management', {
      action: 'User Account Deactivated',
      details: `User account ${deactivateTarget} deactivated by ${currentPersona.name}.`,
      resource: deactivateTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Account Deactivated',
      description: 'The user account has been deactivated.',
    });
  }, [deactivateTarget, currentPersona, logEvent, toast]);

  const handleActivateClick = useCallback((userId) => {
    setActivateTarget(userId);
    setActivateConfirmOpen(true);
    setDetailOpen(false);
    setSelectedUser(null);
  }, []);

  const handleActivateConfirm = useCallback(() => {
    if (!activateTarget) return;
    logEvent('user_management', {
      action: 'User Account Activated',
      details: `User account ${activateTarget} activated by ${currentPersona.name}.`,
      resource: activateTarget,
      outcome: 'success',
    });
    toast({
      variant: 'success',
      title: 'Account Activated',
      description: 'The user account has been activated.',
    });
  }, [activateTarget, currentPersona, logEvent, toast]);

  const handleExportCSV = useCallback(() => {
    try {
      const data = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        segment: u.segment,
        status: u.status,
        department: u.department,
        title: u.title,
        phone: u.phone,
        location: u.location,
        lastLogin: u.lastLogin || '',
        createdDate: u.createdDate,
        lastModifiedDate: u.lastModifiedDate,
        groups: (u.groups || []).join('; '),
      }));
      downloadCSV(data, 'user-repository.csv');
      logEvent('data_export', {
        action: 'Exported User Repository',
        details: `User repository exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/patients',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} users exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export user repository.',
      });
    }
  }, [users, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        segment: u.segment,
        status: u.status,
        department: u.department,
        title: u.title,
        phone: u.phone,
        location: u.location,
        lastLogin: u.lastLogin || '',
        createdDate: u.createdDate,
        lastModifiedDate: u.lastModifiedDate,
        groups: u.groups || [],
      }));
      downloadJSON(data, 'user-repository.json');
      logEvent('data_export', {
        action: 'Exported User Repository',
        details: `User repository exported as JSON by ${currentPersona.name}. ${data.length} records.`,
        resource: '/patients',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} users exported as JSON.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export user repository.',
      });
    }
  }, [users, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'active').length;
    const locked = users.filter((u) => u.status === 'locked').length;
    const pending = users.filter((u) => u.status === 'pending').length;
    const inactive = users.filter((u) => u.status === 'inactive').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;

    return [
      {
        id: 'kpi_total',
        label: 'Total Users',
        value: total,
        unit: 'count',
        trend: 'stable',
        status: 'on_track',
        description: 'Total user accounts in the directory.',
      },
      {
        id: 'kpi_active',
        label: 'Active Users',
        value: active,
        unit: 'count',
        trend: 'improving',
        status: 'on_track',
        description: 'Users with active account status.',
      },
      {
        id: 'kpi_issues',
        label: 'Issues',
        value: locked + suspended,
        unit: 'count',
        trend: (locked + suspended) > 3 ? 'declining' : 'stable',
        status: (locked + suspended) > 3 ? 'at_risk' : 'on_track',
        description: 'Locked or suspended accounts.',
      },
      {
        id: 'kpi_pending',
        label: 'Pending / Inactive',
        value: pending + inactive,
        unit: 'count',
        trend: 'stable',
        status: (pending + inactive) > 3 ? 'at_risk' : 'on_track',
        description: 'Pending or inactive accounts.',
      },
    ];
  }, [users]);

  const filterFields = useMemo(() => {
    const statusOptions = getAllUserStatuses().map((s) => ({
      value: s,
      label: formatLabel(s),
    }));
    const segmentOptions = getAllUserSegments().map((s) => ({
      value: s,
      label: s,
    }));
    const roleOptions = getAllUserRoles().map((r) => ({
      value: r,
      label: r,
    }));
    const departmentOptions = getAllUserDepartments().map((d) => ({
      value: d,
      label: d,
    }));

    return [
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        options: [{ value: '', label: 'All Statuses' }, ...statusOptions],
        defaultValue: '',
      },
      {
        id: 'segment',
        label: 'Segment',
        type: 'select',
        options: [{ value: '', label: 'All Segments' }, ...segmentOptions],
        defaultValue: '',
      },
      {
        id: 'role',
        label: 'Role',
        type: 'select',
        options: [{ value: '', label: 'All Roles' }, ...roleOptions],
        defaultValue: '',
      },
      {
        id: 'department',
        label: 'Department',
        type: 'select',
        options: [{ value: '', label: 'All Departments' }, ...departmentOptions],
        defaultValue: '',
      },
    ];
  }, []);

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.name} size="sm" />
            <div className="flex flex-col gap-0 min-w-0">
              <button
                type="button"
                onClick={() => handleUserClick(row.original)}
                className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors truncate"
              >
                {row.original.name}
              </button>
              <span className="text-2xs text-slate-500 truncate">{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 160,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 truncate block max-w-[160px]">{row.original.role}</span>
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segment',
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: SEGMENT_COLORS[row.original.segment] || '#64748b' }}
              aria-hidden="true"
            />
            <span className="text-sm text-slate-700">{row.original.segment}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getStatusBadgeVariant(row.original.status)} size="sm">
            {formatLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 140,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700 truncate block max-w-[140px]">{row.original.department}</span>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Location',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.location}</span>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        size: 150,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {row.original.lastLogin ? formatDate(row.original.lastLogin, 'MMM d, yyyy h:mm a') : 'Never'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 80,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <UITooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleUserClick(row.original)}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                    'hover:bg-slate-100 hover:text-slate-600',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                  )}
                  aria-label={`View ${row.original.name}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">View Details</TooltipContent>
            </UITooltip>
            {hasPermission(PERMISSIONS.MANAGE_USERS) ? (
              <UITooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(row.original);
                    }}
                    className={cn(
                      'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                      'hover:bg-slate-100 hover:text-slate-600',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                    )}
                    aria-label={`Edit ${row.original.name}`}
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit</TooltipContent>
              </UITooltip>
            ) : null}
          </div>
        ),
      },
    ],
    [handleUserClick, handleEditClick, hasPermission]
  );

  const insightData = useMemo(() => {
    if (users.length === 0) return null;

    const locked = users.filter((u) => u.status === 'locked').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;
    const pending = users.filter((u) => u.status === 'pending').length;
    const active = users.filter((u) => u.status === 'active').length;

    if (locked > 0 || suspended > 0) {
      return {
        variant: 'warning',
        title: `${locked + suspended} user account${(locked + suspended) !== 1 ? 's' : ''} require attention`,
        message: `${locked} locked and ${suspended} suspended account${(locked + suspended) !== 1 ? 's' : ''} detected. ${pending} pending account${pending !== 1 ? 's' : ''} awaiting activation. ${active} of ${users.length} accounts are active.`,
        source: 'User Management',
        confidence: 98,
      };
    }

    if (pending > 0) {
      return {
        variant: 'recommendation',
        title: `${pending} pending account${pending !== 1 ? 's' : ''} awaiting activation`,
        message: `${pending} user account${pending !== 1 ? 's are' : ' is'} in pending status. Review and activate to grant platform access.`,
        source: 'User Management',
        confidence: 95,
      };
    }

    return {
      variant: 'success',
      title: 'All user accounts healthy',
      message: `${active} of ${users.length} user accounts are active with no locked or suspended accounts detected.`,
      source: 'User Management',
      confidence: 98,
    };
  }, [users]);

  if (loading) {
    return <UserRepositoryPageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">User Repository</h1>
          <p className="text-sm text-slate-500">
            User directory with search, filters, and account management for {currentPersona.name}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          <PermissionGate requiredAction={PERMISSIONS.EXPORT_REPORTS} behavior="hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Download className="h-3.5 w-3.5" />}
                >
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionGate>
        </div>
      </div>

      {/* AI Insight Banner */}
      {insightData ? (
        <InsightBanner
          variant={insightData.variant}
          title={insightData.title}
          message={insightData.message}
          source={insightData.source}
          confidence={insightData.confidence}
          dismissible
          expandable={false}
        />
      ) : null}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            status={kpi.status}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={handleFilterChange}
        liveMode
        showApplyButton={false}
        showResetButton
        showActiveFilters
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View ({users.length})</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {users.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No users found"
              message="No users match the current filter criteria. Try adjusting your filters."
              size="lg"
              bordered
            />
          ) : (
            <DataTable
              columns={tableColumns}
              data={users}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search users..."
              emptyMessage="No users match the search criteria."
              onRowClick={handleUserClick}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {users.length === 0 ? (
            <EmptyState
              type="no_data"
              title="No users found"
              message="No users match the current filter criteria."
              size="lg"
              bordered
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => {
                const StatusIcon = getStatusIcon(user.status);

                return (
                  <Card
                    key={user.id}
                    className={cn(
                      'p-5 cursor-pointer transition-all duration-200',
                      'hover:shadow-card-hover hover:border-humana-green-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2',
                      'active:scale-[0.99]'
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleUserClick(user)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleUserClick(user);
                      }
                    }}
                    aria-label={`${user.name}. Status: ${user.status}. Role: ${user.role}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={user.name} size="md" />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{user.name}</h3>
                          <span className="text-2xs text-slate-500 truncate">{user.email}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(user.status)} size="sm">
                        {formatLabel(user.status)}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Role</span>
                        <span className="text-xs font-medium text-slate-700 truncate">{user.role}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Segment</span>
                        <div className="flex items-center gap-1">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: SEGMENT_COLORS[user.segment] || '#64748b' }}
                            aria-hidden="true"
                          />
                          <span className="text-xs font-medium text-slate-700">{user.segment}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Department</span>
                        <span className="text-xs text-slate-700 truncate">{user.department}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-2xs text-slate-400 uppercase tracking-wider">Location</span>
                        <span className="text-xs text-slate-700">{user.location}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-2xs text-slate-400">
                        Last login: {user.lastLogin ? formatDate(user.lastLogin, 'MMM d, h:mm a') : 'Never'}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {users.length === 0 ? (
            <EmptyState
              type="no_chart"
              title="No data for analytics"
              message="No user data available to generate analytics."
              size="lg"
              bordered
            />
          ) : (
            <AnalyticsPanel users={users} />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {users.length > 0 ? (
        <PanelCard
          title="User Repository Summary"
          subtitle={`${users.length} users across ${new Set(users.map((u) => u.segment)).size} segments`}
          icon={<Activity className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Active</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {users.filter((u) => u.status === 'active').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Inactive</span>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {users.filter((u) => u.status === 'inactive').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Locked</span>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-danger-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {users.filter((u) => u.status === 'locked').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Pending</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-warning-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {users.filter((u) => u.status === 'pending').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Suspended</span>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-danger-500" aria-hidden="true" />
                <span className="text-2xl font-semibold text-slate-900">
                  {users.filter((u) => u.status === 'suspended').length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Account Health</h4>
            <Progress
              value={users.filter((u) => u.status === 'active').length}
              max={users.length || 1}
              variant="auto"
              size="md"
              showValue
              valueFormat="fraction"
              label="Active Accounts"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-slate-900">By Segment</h4>
            {Array.from(new Set(users.map((u) => u.segment))).sort().map((segment) => {
              const count = users.filter((u) => u.segment === segment).length;
              return (
                <div key={segment} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: SEGMENT_COLORS[segment] || '#64748b' }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-slate-700">{segment}</span>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={users.length || 1}
                      variant="primary"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-slate-900">By Status</h4>
            {getAllUserStatuses().map((status) => {
              const count = users.filter((u) => u.status === status).length;
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <Badge variant={getStatusBadgeVariant(status)} size="sm">
                      {formatLabel(status)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={count}
                      max={users.length || 1}
                      variant="primary"
                      size="xs"
                      animate
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </PanelCard>
      ) : null}

      {/* User Detail Dialog */}
      <UserDetailDialog
        user={selectedUser}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onLock={handleLockClick}
        onUnlock={handleUnlockClick}
        onDeactivate={handleDeactivateClick}
        onActivate={handleActivateClick}
        onEdit={handleEditFromDetail}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditTarget(null);
        }}
        onSubmit={handleEditSubmit}
        loading={editLoading}
        user={editTarget}
      />

      {/* Lock Confirmation */}
      <ConfirmDialog
        open={lockConfirmOpen}
        onOpenChange={setLockConfirmOpen}
        title="Lock User Account"
        message="Are you sure you want to lock this user account? The user will be unable to log in until the account is unlocked."
        variant="warning"
        confirmLabel="Lock Account"
        cancelLabel="Cancel"
        onConfirm={handleLockConfirm}
      />

      {/* Unlock Confirmation */}
      <ConfirmDialog
        open={unlockConfirmOpen}
        onOpenChange={setUnlockConfirmOpen}
        title="Unlock User Account"
        message="Are you sure you want to unlock this user account? The user will be able to log in again."
        variant="info"
        confirmLabel="Unlock Account"
        cancelLabel="Cancel"
        onConfirm={handleUnlockConfirm}
      />

      {/* Deactivate Confirmation */}
      <ConfirmDialog
        open={deactivateConfirmOpen}
        onOpenChange={setDeactivateConfirmOpen}
        title="Deactivate User Account"
        message="Are you sure you want to deactivate this user account? All active sessions will be terminated and access tokens revoked."
        variant="destructive"
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        onConfirm={handleDeactivateConfirm}
      />

      {/* Activate Confirmation */}
      <ConfirmDialog
        open={activateConfirmOpen}
        onOpenChange={setActivateConfirmOpen}
        title="Activate User Account"
        message="Are you sure you want to activate this user account? The user will be able to log in and access the platform."
        variant="info"
        confirmLabel="Activate"
        cancelLabel="Cancel"
        onConfirm={handleActivateConfirm}
      />
    </div>
  );
}

UserRepositoryPage.displayName = 'UserRepositoryPage';

export { UserRepositoryPage };
export default UserRepositoryPage;