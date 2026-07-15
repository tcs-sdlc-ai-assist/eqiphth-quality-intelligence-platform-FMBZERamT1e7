import { useState, useMemo, useCallback } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, Sparkles, GitBranch, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants';

/** Preferred segment ordering for the persona picker. */
const SEGMENT_ORDER = ['Enterprise', 'Medicare', 'Medicaid', 'Commercial', 'External', 'Compliance'];

/** Personas surfaced as one-click demo sign-ins. */
const QUICK_IDS = ['executive_leadership', 'qe_manager', 'quality_engineer', 'automation_engineer'];

/** Derives a mock corporate email from a persona name. */
const emailFor = (name) => `${(name || 'user').toLowerCase().replace(/[^a-z]+/g, '.')}@humana.com`;

/**
 * Mock persona login screen. Frontend-only: pick a persona, any password is
 * accepted, and the session is stored in localStorage via PersonaContext.
 *
 * @returns {React.ReactElement}
 */
function LoginPage() {
  const { allPersonas, isAuthenticated, login, currentPersona } = usePersona();
  const navigate = useNavigate();
  const location = useLocation();

  const [personaId, setPersonaId] = useState(currentPersona?.id || allPersonas[0]?.id || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const grouped = useMemo(() => {
    const map = {};
    for (const p of allPersonas) (map[p.segment] || (map[p.segment] = [])).push(p);
    const segs = Object.keys(map).sort((a, b) => {
      const ai = SEGMENT_ORDER.indexOf(a);
      const bi = SEGMENT_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    return segs.map((s) => ({ segment: s, personas: map[s] }));
  }, [allPersonas]);

  const selected = useMemo(
    () => allPersonas.find((p) => p.id === personaId) || null,
    [allPersonas, personaId]
  );
  const quick = useMemo(
    () => QUICK_IDS.map((id) => allPersonas.find((p) => p.id === id)).filter(Boolean),
    [allPersonas]
  );

  const redirectTo = location.state?.from?.pathname;

  const handleSignIn = useCallback(
    (id) => {
      const target = id || personaId;
      if (!target) {
        setError('Please select a persona to continue.');
        return;
      }
      const persona = login(target);
      navigate(redirectTo || persona.landingPage || ROUTES.DASHBOARD, { replace: true });
    },
    [personaId, login, navigate, redirectTo]
  );

  // Already signed in → skip the login screen.
  if (isAuthenticated) {
    return <Navigate to={redirectTo || currentPersona?.landingPage || ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#102449] to-[#0a1730] p-12 text-white lg:flex">
        <BrandLogo variant="light" size="lg" />

        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight text-white">Quality Without Compromise.</h1>
          <p className="mt-4 text-slate-300">
            EQIP unifies data, intelligence, automation and governance to orchestrate intelligent
            quality across the enterprise — driving consistency, scale and business impact.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {[
              { icon: Sparkles, text: 'Unified quality intelligence & AI agent workforce' },
              { icon: GitBranch, text: 'Orchestrated test execution across the SDLC' },
              { icon: ShieldCheck, text: 'Policy-driven governance and audit readiness' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4 text-humana-green-400" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-2xs uppercase tracking-wider text-slate-400">
          Humana Internal Use Only · Enterprise Quality Engineering
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo variant="dark" size="md" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose a persona to enter the EQIP demo. Each persona has its own role-based views.
          </p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Persona</span>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <select
                  value={personaId}
                  onChange={(e) => { setPersonaId(e.target.value); setError(''); }}
                  className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-9 pr-8 text-sm text-slate-900 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40"
                >
                  {grouped.map((g) => (
                    <optgroup key={g.segment} label={g.segment}>
                      {g.personas.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — {p.role}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="email"
                  readOnly
                  value={selected ? emailFor(selected.name) : ''}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-600"
                  aria-label="Email (derived from persona)"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Any password (demo)"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-humana-green-500 focus:outline-none focus:ring-2 focus:ring-humana-green-500/40"
                />
              </div>
            </label>

            {error ? <p className="text-sm text-danger-600" role="alert">{error}</p> : null}

            <button
              type="submit"
              className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-humana-green-600 text-sm font-semibold text-white transition-colors hover:bg-humana-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-2"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign in{selected ? ` as ${selected.name}` : ''}
            </button>
          </form>

          {/* Quick sign-in */}
          <div className="mt-6">
            <p className="text-2xs font-medium uppercase tracking-wider text-slate-400">Quick sign-in</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {quick.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSignIn(p.id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-xs text-slate-700 transition-colors',
                    'hover:border-humana-green-300 hover:bg-humana-green-50'
                  )}
                >
                  <Avatar name={p.name} size="xs" />
                  {p.role}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-2xs text-slate-400">
            Demo environment — no backend. Any password is accepted; your selection is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}

LoginPage.displayName = 'LoginPage';

export { LoginPage };
export default LoginPage;
