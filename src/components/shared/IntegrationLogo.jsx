import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  SiJenkins,
  SiGithub,
  SiGitlab,
  SiJira,
  SiSonarqubeserver,
  SiDynatrace,
  SiSplunk,
  SiOkta,
  SiReact,
  SiAngular,
  SiNodedotjs,
  SiPython,
  SiDotnet,
  SiOpenjdk,
  SiMysql,
  SiPostgresql,
  SiSpring,
  SiDocker,
  SiKubernetes,
  SiDatabricks,
} from 'react-icons/si';
import { Cloud, Database, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Size map for the integration logo component.
 * @type {Object<string, { icon: number, img: string }>}
 */
const sizeMap = {
  xs: { icon: 14, img: 'h-3.5 w-3.5' },
  sm: { icon: 16, img: 'h-4 w-4' },
  md: { icon: 20, img: 'h-5 w-5' },
  lg: { icon: 24, img: 'h-6 w-6' },
  xl: { icon: 32, img: 'h-8 w-8' },
  '2xl': { icon: 40, img: 'h-10 w-10' },
};

/**
 * Official brand colors (Simple Icons hex) keyed by normalized name, used to
 * render each logo in its recognizable color instead of flat slate. Names not
 * listed fall back to the inherited slate text color.
 * @type {Object<string, string>}
 */
const BRAND_COLORS = {
  jenkins: '#D24939',
  github: '#181717',
  gitlab: '#FC6D26',
  jira: '#0052CC',
  'jira align': '#0052CC',
  sonarqube: '#4E9BCD',
  dynatrace: '#1496FF',
  splunk: '#000000',
  okta: '#007DC1',
  react: '#61DAFB',
  angular: '#DD0031',
  node: '#5FA04E',
  'node.js': '#5FA04E',
  nodejs: '#5FA04E',
  python: '#3776AB',
  '.net': '#512BD4',
  dotnet: '#512BD4',
  java: '#E76F00',
  mysql: '#4479A1',
  sql: '#00758F',
  postgresql: '#4169E1',
  postgres: '#4169E1',
  spring: '#6DB33F',
  docker: '#2496ED',
  kubernetes: '#326CE5',
  k8s: '#326CE5',
  databricks: '#FF3621',
  aws: '#FF9900',
  azure: '#0078D4',
  bi: '#F2C811',
  'power bi': '#F2C811',
};

/**
 * Maps integration/technology names (lowercase) to their corresponding icon
 * component. Uses react-icons/si Simple Icons for real brand marks and a few
 * colored lucide glyphs (cloud/database/chart) for brands that don't have a
 * dedicated Simple Icon in this package (AWS, Azure, generic SQL, BI).
 *
 * @param {string} name - The integration name (case-insensitive)
 * @returns {React.ElementType|null} The icon component, or null if not found
 */
function resolveIconComponent(name) {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const normalized = name.toLowerCase().trim();

  switch (normalized) {
    case 'azure devops':
    case 'azure pipelines':
    case 'azure entra id':
    case 'microsoft azure':
      return null;
    case 'jenkins':
      return SiJenkins;
    case 'github':
      return SiGithub;
    case 'gitlab':
      return SiGitlab;
    case 'jira':
    case 'jira align':
      return SiJira;
    case 'sonarqube':
      return SiSonarqubeserver;
    case 'dynatrace':
      return SiDynatrace;
    case 'splunk':
      return SiSplunk;
    case 'slack':
      return null;
    case 'microsoft teams':
      return null;
    case 'okta':
      return SiOkta;
    case 'power bi':
    case 'bi':
      return BarChart3;
    case 'react':
      return SiReact;
    case 'angular':
      return SiAngular;
    case 'node':
    case 'node.js':
    case 'nodejs':
      return SiNodedotjs;
    case 'python':
      return SiPython;
    case '.net':
    case 'dotnet':
      return SiDotnet;
    case 'java':
      return SiOpenjdk;
    case 'mysql':
      return SiMysql;
    case 'postgresql':
    case 'postgres':
      return SiPostgresql;
    case 'sql':
      return Database;
    case 'spring':
      return SiSpring;
    case 'docker':
      return SiDocker;
    case 'kubernetes':
    case 'k8s':
      return SiKubernetes;
    case 'databricks':
      return SiDatabricks;
    case 'aws':
    case 'azure':
      return Cloud;
    default:
      return null;
  }
}

/**
 * Resolves the fallback SVG path for integrations without a react-icons match.
 *
 * @param {string} name - The integration name
 * @returns {string} The SVG file path
 */
function resolveFallbackPath(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `/brand/integrations/${slug}.svg`;
}

/**
 * Integration logo component that renders react-icons/si Simple Icons
 * for known vendors and falls back to SVG images from /public/brand/integrations/
 * for others. Displays a styled placeholder initial when neither is available.
 * Known brands render in their official brand color.
 *
 * @param {object} props
 * @param {string} props.name - The integration name used to resolve the icon
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] - Size variant
 * @param {string} [props.className] - Additional class names for the container
 * @param {string} [props.iconClassName] - Additional class names for the icon element
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.ReactElement}
 */
const IntegrationLogo = forwardRef(function IntegrationLogo(
  {
    name,
    size = 'md',
    className,
    iconClassName,
    ...props
  },
  ref
) {
  const resolvedSize = sizeMap[size] || sizeMap.md;
  const IconComponent = resolveIconComponent(name);
  const brandColor = name ? BRAND_COLORS[name.toLowerCase().trim()] : undefined;

  if (IconComponent) {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex shrink-0 items-center justify-center text-slate-600',
          className
        )}
        aria-label={name || 'Integration'}
        role="img"
        {...props}
      >
        <IconComponent
          size={resolvedSize.icon}
          color={brandColor}
          className={cn(iconClassName)}
          aria-hidden="true"
        />
      </span>
    );
  }

  const fallbackPath = resolveFallbackPath(name);
  const initial = name && typeof name === 'string' ? name.charAt(0).toUpperCase() : '?';

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        className
      )}
      aria-label={name || 'Integration'}
      role="img"
      {...props}
    >
      {fallbackPath ? (
        <img
          src={fallbackPath}
          alt={name || 'Integration logo'}
          className={cn(resolvedSize.img, 'object-contain', iconClassName)}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('[data-fallback-initial]')) {
              const span = document.createElement('span');
              span.setAttribute('data-fallback-initial', 'true');
              span.setAttribute('aria-hidden', 'true');
              span.className = cn(
                'inline-flex items-center justify-center rounded bg-slate-100 text-slate-500 font-medium select-none',
                resolvedSize.img,
                size === 'xs' || size === 'sm' ? 'text-2xs' : 'text-xs'
              );
              span.textContent = initial;
              parent.appendChild(span);
            }
          }}
          draggable={false}
        />
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded bg-slate-100 text-slate-500 font-medium select-none',
            resolvedSize.img,
            size === 'xs' || size === 'sm' ? 'text-2xs' : 'text-xs'
          )}
          aria-hidden="true"
        >
          {initial}
        </span>
      )}
    </span>
  );
});

IntegrationLogo.displayName = 'IntegrationLogo';

IntegrationLogo.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
  iconClassName: PropTypes.string,
};

export { IntegrationLogo };
export default IntegrationLogo;
