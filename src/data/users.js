import { PERSONA_IDS } from '@/lib/constants';

/**
 * @typedef {Object} UserPreferences
 * @property {string} theme - UI theme preference (light, dark, system)
 * @property {string} language - Preferred language code (en, es, fr)
 * @property {boolean} emailNotifications - Whether email notifications are enabled
 * @property {boolean} inAppNotifications - Whether in-app notifications are enabled
 * @property {string} dashboardLayout - Preferred dashboard layout (default, compact, expanded)
 * @property {string} timezone - User timezone (e.g. 'America/New_York')
 * @property {boolean} accessibilityMode - Whether accessibility enhancements are enabled
 */

/**
 * @typedef {Object} AccessHistoryEntry
 * @property {string} timestamp - Access event timestamp in ISO format
 * @property {string} action - Action performed (login, logout, page_view, data_export, config_change)
 * @property {string} ipAddress - Client IP address
 * @property {string} userAgent - Client user agent string
 * @property {string} resource - Resource accessed (empty string if not applicable)
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} name - Display name of the user
 * @property {string} email - Email address
 * @property {string} role - Role title
 * @property {string} segment - Organizational segment
 * @property {string} status - Account status (active, inactive, locked, pending, suspended)
 * @property {string} lastLogin - Last login timestamp in ISO format (empty string if never logged in)
 * @property {string} createdDate - Account creation date in ISO format
 * @property {string} lastModifiedDate - Last account modification date in ISO format
 * @property {string} department - Department name
 * @property {string} title - Job title
 * @property {string} phone - Phone number
 * @property {string} location - Office location
 * @property {string} managerId - Manager user ID (empty string if no manager)
 * @property {string[]} groups - Array of group names the user belongs to
 * @property {UserPreferences} preferences - User preferences
 * @property {AccessHistoryEntry[]} accessHistory - Array of recent access history entries
 */

/**
 * Mock user directory data for the EQIP Quality Platform.
 * Contains user objects representing the full user directory for admin screens
 * with account status, preferences, and access history information.
 * Distinct from personas — represents the user directory for administration.
 *
 * @type {User[]}
 */
const users = [
  {
    id: 'usr_001',
    name: 'Angela Martinez',
    email: 'angela.martinez@eqip-health.com',
    role: 'Director Quality Engineering',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T14:30:00Z',
    createdDate: '2022-01-10',
    lastModifiedDate: '2024-12-10',
    department: 'Quality Engineering',
    title: 'Director, Quality Engineering',
    phone: '(555) 201-1001',
    location: 'Louisville, KY',
    managerId: 'usr_002',
    groups: ['EQIP-QE-Leadership', 'EQIP-Quality-Directors', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T14:30:00Z', action: 'login', ipAddress: '10.128.45.102', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T14:31:00Z', action: 'page_view', ipAddress: '10.128.45.102', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/dashboard' },
      { timestamp: '2024-12-11T17:30:00Z', action: 'logout', ipAddress: '10.128.45.102', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
    ],
  },
  {
    id: 'usr_002',
    name: 'Jennifer Williams',
    email: 'jennifer.williams@eqip-health.com',
    role: 'VP Quality Engineering',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T14:15:00Z',
    createdDate: '2021-06-15',
    lastModifiedDate: '2024-11-28',
    department: 'Quality Engineering',
    title: 'Vice President, Quality Engineering',
    phone: '(555) 201-1002',
    location: 'Louisville, KY',
    managerId: '',
    groups: ['EQIP-Executive-Leadership', 'EQIP-QE-Leadership', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'expanded',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T14:15:00Z', action: 'login', ipAddress: '10.128.45.110', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', resource: '' },
      { timestamp: '2024-12-12T14:20:00Z', action: 'data_export', ipAddress: '10.128.45.110', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', resource: '/measures' },
      { timestamp: '2024-12-11T18:00:00Z', action: 'logout', ipAddress: '10.128.45.110', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', resource: '' },
    ],
  },
  {
    id: 'usr_003',
    name: 'Brian Foster',
    email: 'brian.foster@eqip-health.com',
    role: 'Platform Administrator',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T13:45:00Z',
    createdDate: '2021-03-01',
    lastModifiedDate: '2024-12-12',
    department: 'IT Operations',
    title: 'Senior Platform Administrator',
    phone: '(555) 201-1003',
    location: 'Louisville, KY',
    managerId: 'usr_002',
    groups: ['EQIP-Platform-Admins', 'EQIP-IT-Operations', 'EQIP-All-Employees'],
    preferences: {
      theme: 'dark',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'compact',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T13:45:00Z', action: 'login', ipAddress: '10.128.45.200', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T13:50:00Z', action: 'config_change', ipAddress: '10.128.45.200', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/settings' },
      { timestamp: '2024-12-11T19:00:00Z', action: 'logout', ipAddress: '10.128.45.200', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
    ],
  },
  {
    id: 'usr_004',
    name: 'Sarah Chen',
    email: 'sarah.chen@eqip-health.com',
    role: 'Executive Leadership',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T09:00:00Z',
    createdDate: '2020-09-01',
    lastModifiedDate: '2024-10-15',
    department: 'Executive Office',
    title: 'Chief Quality Officer',
    phone: '(555) 201-1004',
    location: 'Louisville, KY',
    managerId: '',
    groups: ['EQIP-Executive-Leadership', 'EQIP-C-Suite', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'expanded',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T09:00:00Z', action: 'login', ipAddress: '10.128.45.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', resource: '' },
      { timestamp: '2024-12-12T09:05:00Z', action: 'page_view', ipAddress: '10.128.45.100', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', resource: '/dashboard' },
    ],
  },
  {
    id: 'usr_005',
    name: 'Michael Torres',
    email: 'michael.torres@eqip-health.com',
    role: 'Segment Leader',
    segment: 'Medicare',
    status: 'active',
    lastLogin: '2024-12-12T12:30:00Z',
    createdDate: '2021-08-15',
    lastModifiedDate: '2024-11-20',
    department: 'Medicare Operations',
    title: 'Senior Director, Medicare Segment',
    phone: '(555) 201-1005',
    location: 'Louisville, KY',
    managerId: 'usr_004',
    groups: ['EQIP-Segment-Leaders', 'EQIP-Medicare-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T12:30:00Z', action: 'login', ipAddress: '10.128.45.130', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T12:35:00Z', action: 'page_view', ipAddress: '10.128.45.130', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/dashboard' },
    ],
  },
  {
    id: 'usr_006',
    name: 'David Park',
    email: 'david.park@eqip-health.com',
    role: 'AVP Quality Engineering',
    segment: 'Medicaid',
    status: 'active',
    lastLogin: '2024-12-12T10:00:00Z',
    createdDate: '2022-02-01',
    lastModifiedDate: '2024-12-05',
    department: 'Quality Engineering',
    title: 'Associate Vice President, Quality Engineering',
    phone: '(555) 201-1006',
    location: 'Green Bay, WI',
    managerId: 'usr_002',
    groups: ['EQIP-QE-Leadership', 'EQIP-Medicaid-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/Chicago',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T10:00:00Z', action: 'login', ipAddress: '10.128.45.140', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T10:10:00Z', action: 'page_view', ipAddress: '10.128.45.140', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_007',
    name: 'Lisa Johnson',
    email: 'lisa.johnson@eqip-health.com',
    role: 'Quality Engineer',
    segment: 'Medicare',
    status: 'active',
    lastLogin: '2024-12-12T08:00:00Z',
    createdDate: '2022-06-15',
    lastModifiedDate: '2024-12-04',
    department: 'Quality Engineering',
    title: 'Senior Quality Engineer',
    phone: '(555) 201-1007',
    location: 'Louisville, KY',
    managerId: 'usr_001',
    groups: ['EQIP-Quality-Engineers', 'EQIP-Medicare-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T08:00:00Z', action: 'login', ipAddress: '10.128.46.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T08:05:00Z', action: 'page_view', ipAddress: '10.128.46.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
      { timestamp: '2024-12-11T17:00:00Z', action: 'logout', ipAddress: '10.128.46.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
    ],
  },
  {
    id: 'usr_008',
    name: 'Robert Kim',
    email: 'robert.kim@eqip-health.com',
    role: 'QE Manager',
    segment: 'Commercial',
    status: 'active',
    lastLogin: '2024-12-12T09:30:00Z',
    createdDate: '2022-04-01',
    lastModifiedDate: '2024-12-10',
    department: 'Quality Engineering',
    title: 'Quality Engineering Manager',
    phone: '(555) 201-1008',
    location: 'Louisville, KY',
    managerId: 'usr_001',
    groups: ['EQIP-QE-Managers', 'EQIP-Commercial-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T09:30:00Z', action: 'login', ipAddress: '10.128.46.80', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T09:35:00Z', action: 'page_view', ipAddress: '10.128.46.80', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_009',
    name: 'James Wright',
    email: 'james.wright@eqip-health.com',
    role: 'Automation Engineer',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T07:30:00Z',
    createdDate: '2022-09-01',
    lastModifiedDate: '2024-12-09',
    department: 'Quality Engineering',
    title: 'Senior Automation Engineer',
    phone: '(555) 201-1009',
    location: 'Louisville, KY',
    managerId: 'usr_001',
    groups: ['EQIP-Automation-Engineers', 'EQIP-Quality-Engineers', 'EQIP-All-Employees'],
    preferences: {
      theme: 'dark',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: true,
      dashboardLayout: 'compact',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T07:30:00Z', action: 'login', ipAddress: '10.128.46.70', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T07:35:00Z', action: 'page_view', ipAddress: '10.128.46.70', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_010',
    name: 'Priya Patel',
    email: 'priya.patel@eqip-health.com',
    role: 'SDET',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T08:15:00Z',
    createdDate: '2023-01-15',
    lastModifiedDate: '2024-12-08',
    department: 'Quality Engineering',
    title: 'Software Development Engineer in Test',
    phone: '(555) 201-1010',
    location: 'Louisville, KY',
    managerId: 'usr_008',
    groups: ['EQIP-SDETs', 'EQIP-Quality-Engineers', 'EQIP-All-Employees'],
    preferences: {
      theme: 'dark',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: true,
      dashboardLayout: 'compact',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T08:15:00Z', action: 'login', ipAddress: '10.128.46.65', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T08:20:00Z', action: 'page_view', ipAddress: '10.128.46.65', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_011',
    name: 'Chris Anderson',
    email: 'chris.anderson@eqip-health.com',
    role: 'Developer',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T08:45:00Z',
    createdDate: '2022-07-01',
    lastModifiedDate: '2024-12-08',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    phone: '(555) 201-1011',
    location: 'Louisville, KY',
    managerId: 'usr_008',
    groups: ['EQIP-Developers', 'EQIP-Enterprise-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'dark',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: true,
      dashboardLayout: 'compact',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T08:45:00Z', action: 'login', ipAddress: '10.128.46.60', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T08:50:00Z', action: 'page_view', ipAddress: '10.128.46.60', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0', resource: '/dashboard' },
    ],
  },
  {
    id: 'usr_012',
    name: 'Emily Davis',
    email: 'emily.davis@eqip-health.com',
    role: 'Product Owner',
    segment: 'Medicare',
    status: 'active',
    lastLogin: '2024-12-12T09:10:00Z',
    createdDate: '2022-03-15',
    lastModifiedDate: '2024-12-07',
    department: 'Product Management',
    title: 'Senior Product Owner',
    phone: '(555) 201-1012',
    location: 'Louisville, KY',
    managerId: 'usr_005',
    groups: ['EQIP-Product-Owners', 'EQIP-Medicare-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T09:10:00Z', action: 'login', ipAddress: '10.128.45.150', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T09:15:00Z', action: 'page_view', ipAddress: '10.128.45.150', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/dashboard' },
    ],
  },
  {
    id: 'usr_013',
    name: 'Patricia Evans',
    email: 'patricia.evans@eqip-health.com',
    role: 'Auditor',
    segment: 'Compliance',
    status: 'active',
    lastLogin: '2024-12-12T07:00:00Z',
    createdDate: '2021-11-01',
    lastModifiedDate: '2024-12-10',
    department: 'Compliance & Audit',
    title: 'Director, Compliance & Audit',
    phone: '(555) 201-1013',
    location: 'Louisville, KY',
    managerId: 'usr_004',
    groups: ['EQIP-Auditors', 'EQIP-Compliance-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T07:00:00Z', action: 'login', ipAddress: '10.128.47.88', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T07:05:00Z', action: 'page_view', ipAddress: '10.128.47.88', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/reports' },
      { timestamp: '2024-12-12T13:15:00Z', action: 'data_export', ipAddress: '10.128.47.88', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/reports' },
    ],
  },
  {
    id: 'usr_014',
    name: 'Natalie White',
    email: 'natalie.white@eqip-health.com',
    role: 'Security Engineer',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T11:45:00Z',
    createdDate: '2022-01-20',
    lastModifiedDate: '2024-12-12',
    department: 'Information Security',
    title: 'Senior Security Engineer',
    phone: '(555) 201-1014',
    location: 'Louisville, KY',
    managerId: 'usr_003',
    groups: ['EQIP-Security-Team', 'EQIP-Enterprise-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'dark',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'compact',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T11:45:00Z', action: 'login', ipAddress: '10.128.45.175', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/133.0', resource: '' },
      { timestamp: '2024-12-12T11:50:00Z', action: 'page_view', ipAddress: '10.128.45.175', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/133.0', resource: '/reports' },
    ],
  },
  {
    id: 'usr_015',
    name: 'Marcus Thompson',
    email: 'marcus.thompson@eqip-health.com',
    role: 'Performance Engineer',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T10:00:00Z',
    createdDate: '2022-05-01',
    lastModifiedDate: '2024-12-10',
    department: 'Quality Engineering',
    title: 'Senior Performance Engineer',
    phone: '(555) 201-1015',
    location: 'Louisville, KY',
    managerId: 'usr_001',
    groups: ['EQIP-Performance-Engineers', 'EQIP-Quality-Engineers', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T10:00:00Z', action: 'login', ipAddress: '10.128.45.160', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T10:05:00Z', action: 'data_export', ipAddress: '10.128.45.160', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/analytics' },
    ],
  },
  {
    id: 'usr_016',
    name: 'Alex Rivera',
    email: 'alex.rivera@eqip-health.com',
    role: 'Vendor Partner',
    segment: 'External',
    status: 'active',
    lastLogin: '2024-12-12T13:35:00Z',
    createdDate: '2023-03-01',
    lastModifiedDate: '2024-12-08',
    department: 'External Partners',
    title: 'Partner Integration Lead',
    phone: '(555) 201-1016',
    location: 'Remote',
    managerId: '',
    groups: ['EQIP-External-Partners', 'EQIP-Vendor-Partners'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: false,
      dashboardLayout: 'default',
      timezone: 'America/Los_Angeles',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T13:35:00Z', action: 'login', ipAddress: '203.0.113.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T13:40:00Z', action: 'page_view', ipAddress: '203.0.113.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0', resource: '/dashboard' },
      { timestamp: '2024-12-12T18:00:00Z', action: 'logout', ipAddress: '203.0.113.45', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0', resource: '' },
    ],
  },
  {
    id: 'usr_017',
    name: 'Samantha Clark',
    email: 'samantha.clark@eqip-health.com',
    role: 'Test Data Engineer',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T08:00:00Z',
    createdDate: '2022-08-15',
    lastModifiedDate: '2024-12-08',
    department: 'Quality Engineering',
    title: 'Senior Test Data Engineer',
    phone: '(555) 201-1017',
    location: 'Louisville, KY',
    managerId: 'usr_001',
    groups: ['EQIP-Data-Engineers', 'EQIP-Quality-Engineers', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T08:00:00Z', action: 'login', ipAddress: '10.128.46.90', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T08:05:00Z', action: 'page_view', ipAddress: '10.128.46.90', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/patients' },
    ],
  },
  {
    id: 'usr_018',
    name: 'Omar Hassan',
    email: 'omar.hassan@eqip-health.com',
    role: 'Accessibility Engineer',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-11T14:30:00Z',
    createdDate: '2023-04-01',
    lastModifiedDate: '2024-12-11',
    department: 'Quality Engineering',
    title: 'Accessibility Engineer',
    phone: '(555) 201-1018',
    location: 'Louisville, KY',
    managerId: 'usr_008',
    groups: ['EQIP-Accessibility-Team', 'EQIP-Quality-Engineers', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: true,
    },
    accessHistory: [
      { timestamp: '2024-12-11T14:30:00Z', action: 'login', ipAddress: '10.128.46.95', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-11T14:35:00Z', action: 'page_view', ipAddress: '10.128.46.95', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_019',
    name: 'Karen Mitchell',
    email: 'karen.mitchell@eqip-health.com',
    role: 'Production Support',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T06:00:00Z',
    createdDate: '2021-10-01',
    lastModifiedDate: '2024-12-11',
    department: 'IT Operations',
    title: 'Production Support Lead',
    phone: '(555) 201-1019',
    location: 'Louisville, KY',
    managerId: 'usr_003',
    groups: ['EQIP-Production-Support', 'EQIP-IT-Operations', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T06:00:00Z', action: 'login', ipAddress: '10.128.45.190', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T06:05:00Z', action: 'page_view', ipAddress: '10.128.45.190', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/dashboard' },
    ],
  },
  {
    id: 'usr_020',
    name: 'Daniel Robinson',
    email: 'daniel.robinson@eqip-health.com',
    role: 'Environment Manager',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T01:55:00Z',
    createdDate: '2022-02-15',
    lastModifiedDate: '2024-12-12',
    department: 'IT Operations',
    title: 'Environment Manager',
    phone: '(555) 201-1020',
    location: 'Louisville, KY',
    managerId: 'usr_003',
    groups: ['EQIP-Environment-Managers', 'EQIP-IT-Operations', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T01:55:00Z', action: 'login', ipAddress: '10.128.45.185', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T02:00:00Z', action: 'config_change', ipAddress: '10.128.45.185', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/settings' },
    ],
  },
  {
    id: 'usr_021',
    name: 'Kevin Brown',
    email: 'kevin.brown@eqip-health.com',
    role: 'Scrum Master',
    segment: 'Commercial',
    status: 'active',
    lastLogin: '2024-12-11T10:00:00Z',
    createdDate: '2022-10-01',
    lastModifiedDate: '2024-11-25',
    department: 'Agile Delivery',
    title: 'Senior Scrum Master',
    phone: '(555) 201-1021',
    location: 'Louisville, KY',
    managerId: 'usr_008',
    groups: ['EQIP-Scrum-Masters', 'EQIP-Commercial-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-11T10:00:00Z', action: 'login', ipAddress: '10.128.45.145', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-11T10:05:00Z', action: 'page_view', ipAddress: '10.128.45.145', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_022',
    name: 'Amanda Garcia',
    email: 'amanda.garcia@eqip-health.com',
    role: 'Release Manager',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T09:00:00Z',
    createdDate: '2022-05-15',
    lastModifiedDate: '2024-12-06',
    department: 'Release Management',
    title: 'Senior Release Manager',
    phone: '(555) 201-1022',
    location: 'Louisville, KY',
    managerId: 'usr_002',
    groups: ['EQIP-Release-Managers', 'EQIP-Enterprise-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T09:00:00Z', action: 'login', ipAddress: '10.128.45.155', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T09:05:00Z', action: 'page_view', ipAddress: '10.128.45.155', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_023',
    name: 'Thomas Lee',
    email: 'thomas.lee@eqip-health.com',
    role: 'Program Manager',
    segment: 'Medicaid',
    status: 'active',
    lastLogin: '2024-12-11T14:00:00Z',
    createdDate: '2022-08-01',
    lastModifiedDate: '2024-12-04',
    department: 'Program Management',
    title: 'Senior Program Manager',
    phone: '(555) 201-1023',
    location: 'Louisville, KY',
    managerId: 'usr_006',
    groups: ['EQIP-Program-Managers', 'EQIP-Medicaid-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-11T14:00:00Z', action: 'login', ipAddress: '10.128.45.135', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-11T14:05:00Z', action: 'page_view', ipAddress: '10.128.45.135', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/dashboard' },
    ],
  },
  {
    id: 'usr_024',
    name: 'Rachel Nguyen',
    email: 'rachel.nguyen@eqip-health.com',
    role: 'Application Owner',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T10:00:00Z',
    createdDate: '2022-03-01',
    lastModifiedDate: '2024-12-12',
    department: 'Engineering',
    title: 'Application Owner, Member Portal',
    phone: '(555) 201-1024',
    location: 'Louisville, KY',
    managerId: 'usr_002',
    groups: ['EQIP-Application-Owners', 'EQIP-Enterprise-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T10:00:00Z', action: 'login', ipAddress: '10.128.45.165', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T10:05:00Z', action: 'page_view', ipAddress: '10.128.45.165', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_025',
    name: 'Sandra Cooper',
    email: 'sandra.cooper@eqip-health.com',
    role: 'Read Only User',
    segment: 'Enterprise',
    status: 'active',
    lastLogin: '2024-12-12T09:30:00Z',
    createdDate: '2023-06-01',
    lastModifiedDate: '2024-10-15',
    department: 'Business Operations',
    title: 'Business Analyst',
    phone: '(555) 201-1025',
    location: 'Louisville, KY',
    managerId: 'usr_005',
    groups: ['EQIP-Read-Only-Users', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-12T09:30:00Z', action: 'login', ipAddress: '10.128.45.220', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-12T09:35:00Z', action: 'page_view', ipAddress: '10.128.45.220', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/dashboard' },
    ],
  },
  {
    id: 'usr_026',
    name: 'Maria Santos',
    email: 'maria.santos@eqip-health.com',
    role: 'Quality Engineer',
    segment: 'Medicare',
    status: 'active',
    lastLogin: '2024-12-11T09:00:00Z',
    createdDate: '2024-12-10',
    lastModifiedDate: '2024-12-10',
    department: 'Quality Engineering',
    title: 'Quality Engineer (Contractor)',
    phone: '(555) 201-1026',
    location: 'Remote',
    managerId: 'usr_007',
    groups: ['EQIP-Quality-Engineers', 'EQIP-Medicare-Team', 'EQIP-Contractors'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-11T09:00:00Z', action: 'login', ipAddress: '10.128.46.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-11T09:05:00Z', action: 'page_view', ipAddress: '10.128.46.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '/measures' },
    ],
  },
  {
    id: 'usr_027',
    name: 'Mark Johnson',
    email: 'mark.johnson@eqip-health.com',
    role: 'Developer',
    segment: 'Enterprise',
    status: 'inactive',
    lastLogin: '2024-12-05T16:00:00Z',
    createdDate: '2022-04-15',
    lastModifiedDate: '2024-12-09',
    department: 'Engineering',
    title: 'Software Engineer',
    phone: '(555) 201-1027',
    location: 'Louisville, KY',
    managerId: 'usr_008',
    groups: ['EQIP-Developers', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: false,
      inAppNotifications: false,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-05T16:00:00Z', action: 'logout', ipAddress: '10.128.46.75', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-05T08:00:00Z', action: 'login', ipAddress: '10.128.46.75', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
    ],
  },
  {
    id: 'usr_028',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@eqip-health.com',
    role: 'Quality Engineer',
    segment: 'Commercial',
    status: 'locked',
    lastLogin: '2024-12-08T11:00:00Z',
    createdDate: '2023-02-01',
    lastModifiedDate: '2024-12-10',
    department: 'Quality Engineering',
    title: 'Quality Engineer',
    phone: '(555) 201-1028',
    location: 'Louisville, KY',
    managerId: 'usr_008',
    groups: ['EQIP-Quality-Engineers', 'EQIP-Commercial-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-12-08T11:00:00Z', action: 'login', ipAddress: '10.128.46.85', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-08T11:01:00Z', action: 'login', ipAddress: '10.128.46.85', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
      { timestamp: '2024-12-08T11:02:00Z', action: 'login', ipAddress: '10.128.46.85', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0', resource: '' },
    ],
  },
  {
    id: 'usr_029',
    name: 'Andrew Wilson',
    email: 'andrew.wilson@eqip-health.com',
    role: 'Developer',
    segment: 'Medicaid',
    status: 'pending',
    lastLogin: '',
    createdDate: '2024-12-11',
    lastModifiedDate: '2024-12-11',
    department: 'Engineering',
    title: 'Software Engineer',
    phone: '(555) 201-1029',
    location: 'Green Bay, WI',
    managerId: 'usr_006',
    groups: ['EQIP-Developers', 'EQIP-Medicaid-Team'],
    preferences: {
      theme: 'system',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/Chicago',
      accessibilityMode: false,
    },
    accessHistory: [],
  },
  {
    id: 'usr_030',
    name: 'Linda Chen',
    email: 'linda.chen@eqip-health.com',
    role: 'Auditor',
    segment: 'Compliance',
    status: 'suspended',
    lastLogin: '2024-11-20T14:00:00Z',
    createdDate: '2023-05-01',
    lastModifiedDate: '2024-12-01',
    department: 'Compliance & Audit',
    title: 'Compliance Auditor',
    phone: '(555) 201-1030',
    location: 'Louisville, KY',
    managerId: 'usr_013',
    groups: ['EQIP-Auditors', 'EQIP-Compliance-Team', 'EQIP-All-Employees'],
    preferences: {
      theme: 'light',
      language: 'en',
      emailNotifications: true,
      inAppNotifications: true,
      dashboardLayout: 'default',
      timezone: 'America/New_York',
      accessibilityMode: false,
    },
    accessHistory: [
      { timestamp: '2024-11-20T14:00:00Z', action: 'login', ipAddress: '10.128.47.90', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0', resource: '' },
      { timestamp: '2024-11-20T14:30:00Z', action: 'page_view', ipAddress: '10.128.47.90', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0', resource: '/reports' },
      { timestamp: '2024-11-20T16:00:00Z', action: 'logout', ipAddress: '10.128.47.90', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0', resource: '' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Accessor functions
// ---------------------------------------------------------------------------

/**
 * Returns all available users.
 *
 * @returns {User[]} Array of all user objects
 */
export function getAllUsers() {
  return [...users];
}

/**
 * Retrieves a single user by its unique ID.
 *
 * @param {string} userId - The user identifier to look up
 * @returns {User|null} The matching user object, or null if not found
 */
export function getUserById(userId) {
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  return users.find((u) => u.id === userId) || null;
}

/**
 * Retrieves a single user by email address.
 *
 * @param {string} email - The email address to look up
 * @returns {User|null} The matching user object, or null if not found
 */
export function getUserByEmail(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }
  return users.find((u) => u.email === email) || null;
}

/**
 * Returns all users filtered by role.
 *
 * @param {string} role - The role to filter by
 * @returns {User[]} Array of users matching the specified role
 */
export function getUsersByRole(role) {
  if (!role || typeof role !== 'string') {
    return [];
  }
  return users.filter((u) => u.role === role);
}

/**
 * Returns all users filtered by segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {User[]} Array of users matching the specified segment
 */
export function getUsersBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return users.filter((u) => u.segment === segment);
}

/**
 * Returns all users filtered by status.
 *
 * @param {string} status - The status to filter by (e.g. 'active', 'inactive', 'locked', 'pending', 'suspended')
 * @returns {User[]} Array of users matching the specified status
 */
export function getUsersByStatus(status) {
  if (!status || typeof status !== 'string') {
    return [];
  }
  return users.filter((u) => u.status === status);
}

/**
 * Returns all users filtered by department.
 *
 * @param {string} department - The department name to filter by
 * @returns {User[]} Array of users matching the specified department
 */
export function getUsersByDepartment(department) {
  if (!department || typeof department !== 'string') {
    return [];
  }
  return users.filter((u) => u.department === department);
}

/**
 * Returns all users filtered by group membership.
 *
 * @param {string} group - The group name to filter by
 * @returns {User[]} Array of users belonging to the specified group
 */
export function getUsersByGroup(group) {
  if (!group || typeof group !== 'string') {
    return [];
  }
  return users.filter((u) => u.groups.includes(group));
}

/**
 * Returns all users managed by a specific manager.
 *
 * @param {string} managerId - The manager user ID to filter by
 * @returns {User[]} Array of users managed by the specified manager
 */
export function getUsersByManager(managerId) {
  if (!managerId || typeof managerId !== 'string') {
    return [];
  }
  return users.filter((u) => u.managerId === managerId);
}

/**
 * Returns all users filtered by location.
 *
 * @param {string} location - The location to filter by
 * @returns {User[]} Array of users matching the specified location
 */
export function getUsersByLocation(location) {
  if (!location || typeof location !== 'string') {
    return [];
  }
  return users.filter((u) => u.location === location);
}

/**
 * Returns aggregate statistics across all users.
 *
 * @returns {{ totalUsers: number, statusBreakdown: Object<string, number>, segmentBreakdown: Object<string, number>, roleBreakdown: Object<string, number>, departmentBreakdown: Object<string, number>, activeCount: number, inactiveCount: number, lockedCount: number, pendingCount: number, suspendedCount: number }} Aggregate user statistics
 */
export function getUserAggregates() {
  const totalUsers = users.length;

  const statusBreakdown = users.reduce((acc, u) => {
    acc[u.status] = (acc[u.status] || 0) + 1;
    return acc;
  }, {});

  const segmentBreakdown = users.reduce((acc, u) => {
    acc[u.segment] = (acc[u.segment] || 0) + 1;
    return acc;
  }, {});

  const roleBreakdown = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const departmentBreakdown = users.reduce((acc, u) => {
    acc[u.department] = (acc[u.department] || 0) + 1;
    return acc;
  }, {});

  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;
  const lockedCount = users.filter((u) => u.status === 'locked').length;
  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;

  return {
    totalUsers,
    statusBreakdown,
    segmentBreakdown,
    roleBreakdown,
    departmentBreakdown,
    activeCount,
    inactiveCount,
    lockedCount,
    pendingCount,
    suspendedCount,
  };
}

/**
 * Returns all unique user statuses.
 *
 * @returns {string[]} Array of unique user statuses sorted alphabetically
 */
export function getAllUserStatuses() {
  const statuses = new Set(users.map((u) => u.status));
  return [...statuses].sort();
}

/**
 * Returns all unique user roles.
 *
 * @returns {string[]} Array of unique user roles sorted alphabetically
 */
export function getAllUserRoles() {
  const roles = new Set(users.map((u) => u.role));
  return [...roles].sort();
}

/**
 * Returns all unique segments across all users.
 *
 * @returns {string[]} Array of unique segments sorted alphabetically
 */
export function getAllUserSegments() {
  const segments = new Set(users.map((u) => u.segment));
  return [...segments].sort();
}

/**
 * Returns all unique departments across all users.
 *
 * @returns {string[]} Array of unique departments sorted alphabetically
 */
export function getAllUserDepartments() {
  const departments = new Set(users.map((u) => u.department));
  return [...departments].sort();
}

/**
 * Returns all unique groups across all users.
 *
 * @returns {string[]} Array of unique groups sorted alphabetically
 */
export function getAllUserGroups() {
  const groups = new Set(users.flatMap((u) => u.groups));
  return [...groups].sort();
}

/**
 * Returns all unique locations across all users.
 *
 * @returns {string[]} Array of unique locations sorted alphabetically
 */
export function getAllUserLocations() {
  const locations = new Set(users.map((u) => u.location));
  return [...locations].sort();
}

export default users;