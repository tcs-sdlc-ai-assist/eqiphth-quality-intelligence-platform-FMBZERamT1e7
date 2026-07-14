import { PERSONA_IDS, PERMISSIONS, ROUTES } from '@/lib/constants';

/**
 * @typedef {Object} NotificationPrefs
 * @property {boolean} email - Whether email notifications are enabled
 * @property {boolean} inApp - Whether in-app notifications are enabled
 * @property {boolean} digest - Whether digest notifications are enabled
 * @property {string} frequency - Notification frequency ('realtime'|'daily'|'weekly')
 */

/**
 * @typedef {Object} NavConfig
 * @property {string[]} visibleSections - Navigation sections visible to this persona
 * @property {string[]} pinnedItems - Pinned navigation items
 * @property {boolean} showAnalytics - Whether analytics section is visible
 * @property {boolean} showAdmin - Whether admin section is visible
 */

/**
 * @typedef {Object} Persona
 * @property {string} id - Unique persona identifier
 * @property {string} name - Display name of the persona user
 * @property {string} role - Role title
 * @property {string} segment - Organizational segment
 * @property {string[]} permissions - List of permission keys
 * @property {NotificationPrefs} notificationPrefs - Notification preferences
 * @property {string} landingPage - Default landing page route
 * @property {NavConfig} navConfig - Navigation configuration
 * @property {string} avatarUrl - URL or path for avatar image
 */

/**
 * Mock persona/user data for the EQIP Quality Platform.
 * Contains 25 persona objects representing various roles across the organization.
 *
 * @type {Persona[]}
 */
const personas = [
  {
    id: 'executive_leadership',
    name: 'Sarah Chen',
    role: 'Executive Leadership',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'weekly',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'reports', 'analytics'],
      pinnedItems: ['dashboard', 'reports'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/sarah-chen.png',
  },
  {
    id: 'segment_leader',
    name: 'Michael Torres',
    role: 'Segment Leader',
    segment: 'Medicare',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports', 'analytics'],
      pinnedItems: ['dashboard', 'analytics'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/michael-torres.png',
  },
  {
    id: 'vp_qe',
    name: 'Jennifer Williams',
    role: 'VP Quality Engineering',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports', 'analytics'],
      pinnedItems: ['dashboard', 'measures'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/jennifer-williams.png',
  },
  {
    id: 'avp_qe',
    name: 'David Park',
    role: 'AVP Quality Engineering',
    segment: 'Medicaid',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: false,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports', 'analytics'],
      pinnedItems: ['dashboard', 'measures', 'analytics'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/david-park.png',
  },
  {
    id: PERSONA_IDS.QUALITY_DIRECTOR,
    name: 'Angela Martinez',
    role: 'Director Quality Engineering',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports', 'analytics'],
      pinnedItems: ['dashboard', 'measures', 'patients'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/angela-martinez.png',
  },
  {
    id: 'qe_manager',
    name: 'Robert Kim',
    role: 'QE Manager',
    segment: 'Commercial',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: false,
      frequency: 'realtime',
    },
    landingPage: ROUTES.MEASURES,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports', 'analytics'],
      pinnedItems: ['measures', 'patients'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/robert-kim.png',
  },
  {
    id: 'quality_engineer',
    name: 'Lisa Johnson',
    role: 'Quality Engineer',
    segment: 'Medicare',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: false,
      frequency: 'realtime',
    },
    landingPage: ROUTES.MEASURES,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports'],
      pinnedItems: ['measures', 'patients'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/lisa-johnson.png',
  },
  {
    id: 'automation_engineer',
    name: 'James Wright',
    role: 'Automation Engineer',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: false,
      inApp: true,
      digest: false,
      frequency: 'realtime',
    },
    landingPage: ROUTES.MEASURES,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['measures'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/james-wright.png',
  },
  {
    id: 'sdet',
    name: 'Priya Patel',
    role: 'SDET',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: false,
      inApp: true,
      digest: false,
      frequency: 'realtime',
    },
    landingPage: ROUTES.MEASURES,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['measures'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/priya-patel.png',
  },
  {
    id: 'developer',
    name: 'Chris Anderson',
    role: 'Developer',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: false,
      inApp: true,
      digest: false,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['dashboard'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/chris-anderson.png',
  },
  {
    id: 'product_owner',
    name: 'Emily Davis',
    role: 'Product Owner',
    segment: 'Medicare',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports', 'analytics'],
      pinnedItems: ['dashboard', 'measures'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/emily-davis.png',
  },
  {
    id: 'scrum_master',
    name: 'Kevin Brown',
    role: 'Scrum Master',
    segment: 'Commercial',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: false,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['dashboard'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/kevin-brown.png',
  },
  {
    id: 'release_manager',
    name: 'Amanda Garcia',
    role: 'Release Manager',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'realtime',
    },
    landingPage: ROUTES.MEASURES,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['measures', 'reports'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/amanda-garcia.png',
  },
  {
    id: 'program_manager',
    name: 'Thomas Lee',
    role: 'Program Manager',
    segment: 'Medicaid',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'daily',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports', 'analytics'],
      pinnedItems: ['dashboard', 'reports'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/thomas-lee.png',
  },
  {
    id: 'application_owner',
    name: 'Rachel Nguyen',
    role: 'Application Owner',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: false,
      frequency: 'realtime',
    },
    landingPage: ROUTES.MEASURES,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports'],
      pinnedItems: ['measures', 'patients'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/rachel-nguyen.png',
  },
  {
    id: 'environment_manager',
    name: 'Daniel Robinson',
    role: 'Environment Manager',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_SETTINGS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: false,
      frequency: 'realtime',
    },
    landingPage: ROUTES.SETTINGS,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports', 'settings'],
      pinnedItems: ['settings'],
      showAnalytics: false,
      showAdmin: true,
    },
    avatarUrl: '/avatars/daniel-robinson.png',
  },
  {
    id: 'test_data_engineer',
    name: 'Samantha Clark',
    role: 'Test Data Engineer',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: false,
      inApp: true,
      digest: false,
      frequency: 'daily',
    },
    landingPage: ROUTES.PATIENTS,
    navConfig: {
      visibleSections: ['dashboard', 'patients', 'reports'],
      pinnedItems: ['patients'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/samantha-clark.png',
  },
  {
    id: 'performance_engineer',
    name: 'Marcus Thompson',
    role: 'Performance Engineer',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: false,
      inApp: true,
      digest: false,
      frequency: 'daily',
    },
    landingPage: ROUTES.ANALYTICS,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports', 'analytics'],
      pinnedItems: ['analytics', 'reports'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/marcus-thompson.png',
  },
  {
    id: 'security_engineer',
    name: 'Natalie White',
    role: 'Security Engineer',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'realtime',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['dashboard', 'reports'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/natalie-white.png',
  },
  {
    id: 'accessibility_engineer',
    name: 'Omar Hassan',
    role: 'Accessibility Engineer',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: false,
      inApp: true,
      digest: false,
      frequency: 'daily',
    },
    landingPage: ROUTES.MEASURES,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['measures'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/omar-hassan.png',
  },
  {
    id: 'production_support',
    name: 'Karen Mitchell',
    role: 'Production Support',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: false,
      frequency: 'realtime',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports'],
      pinnedItems: ['dashboard'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/karen-mitchell.png',
  },
  {
    id: 'vendor_partner',
    name: 'Alex Rivera',
    role: 'Vendor Partner',
    segment: 'External',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: false,
      digest: true,
      frequency: 'weekly',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'reports'],
      pinnedItems: ['dashboard'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/alex-rivera.png',
  },
  {
    id: 'auditor',
    name: 'Patricia Evans',
    role: 'Auditor',
    segment: 'Compliance',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'daily',
    },
    landingPage: ROUTES.REPORTS,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports', 'analytics'],
      pinnedItems: ['reports', 'analytics'],
      showAnalytics: true,
      showAdmin: false,
    },
    avatarUrl: '/avatars/patricia-evans.png',
  },
  {
    id: PERSONA_IDS.ADMIN,
    name: 'Brian Foster',
    role: 'Platform Administrator',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.EDIT_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.EDIT_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.EDIT_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: true,
      inApp: true,
      digest: true,
      frequency: 'realtime',
    },
    landingPage: ROUTES.SETTINGS,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports', 'analytics', 'settings'],
      pinnedItems: ['dashboard', 'settings'],
      showAnalytics: true,
      showAdmin: true,
    },
    avatarUrl: '/avatars/brian-foster.png',
  },
  {
    id: 'read_only_user',
    name: 'Sandra Cooper',
    role: 'Read Only User',
    segment: 'Enterprise',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MEASURES,
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_QUALITY_GATES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
    notificationPrefs: {
      email: false,
      inApp: true,
      digest: false,
      frequency: 'weekly',
    },
    landingPage: ROUTES.DASHBOARD,
    navConfig: {
      visibleSections: ['dashboard', 'measures', 'patients', 'reports'],
      pinnedItems: ['dashboard'],
      showAnalytics: false,
      showAdmin: false,
    },
    avatarUrl: '/avatars/sandra-cooper.png',
  },
];

/**
 * Returns all available personas.
 *
 * @returns {Persona[]} Array of all persona objects
 */
export function getAllPersonas() {
  return [...personas];
}

/**
 * Retrieves a single persona by its unique ID.
 *
 * @param {string} personaId - The persona identifier to look up
 * @returns {Persona|null} The matching persona object, or null if not found
 */
export function getPersonaById(personaId) {
  if (!personaId || typeof personaId !== 'string') {
    return null;
  }
  return personas.find((p) => p.id === personaId) || null;
}

/**
 * Returns all personas belonging to a specific segment.
 *
 * @param {string} segment - The segment name to filter by
 * @returns {Persona[]} Array of personas in the specified segment
 */
export function getPersonasBySegment(segment) {
  if (!segment || typeof segment !== 'string') {
    return [];
  }
  return personas.filter((p) => p.segment === segment);
}

/**
 * Returns all personas that have a specific permission.
 *
 * @param {string} permission - The permission key to filter by
 * @returns {Persona[]} Array of personas with the specified permission
 */
export function getPersonasByPermission(permission) {
  if (!permission || typeof permission !== 'string') {
    return [];
  }
  return personas.filter((p) => p.permissions.includes(permission));
}

/**
 * Returns the default persona (Quality Director).
 *
 * @returns {Persona} The default persona object
 */
export function getDefaultPersona() {
  return getPersonaById(PERSONA_IDS.QUALITY_DIRECTOR) || personas[0];
}

/**
 * Returns all unique segment names across personas.
 *
 * @returns {string[]} Array of unique segment names
 */
export function getAllSegments() {
  const segments = new Set(personas.map((p) => p.segment));
  return [...segments].sort();
}

/**
 * Returns all unique role names across personas.
 *
 * @returns {string[]} Array of unique role names
 */
export function getAllRoles() {
  const roles = new Set(personas.map((p) => p.role));
  return [...roles].sort();
}

export default personas;