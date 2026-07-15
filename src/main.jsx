import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { PersonaProvider, usePersona } from '@/context/PersonaContext';
import { AuditLogProvider } from '@/context/AuditLogContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { NavigationProvider } from '@/context/NavigationContext';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { ToastContextProvider } from '@/components/ui/Toast';

import AppLayout from '@/components/layout/AppLayout';
import HTHLayout from '@/components/layout/HTHLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import SegmentManagementPage from '@/pages/segments/SegmentManagementPage';
import DemandManagementPage from '@/pages/demand/DemandManagementPage';
import ApplicationMasterPage from '@/pages/applications/ApplicationMasterPage';
import HTHHomePage from '@/pages/hth/HTHHomePage';
import InSprintViewPage from '@/pages/hth/InSprintViewPage';
import ApplicationViewPage from '@/pages/hth/ApplicationViewPage';
import TriagePage from '@/pages/hth/TriagePage';
import ExecutionsTriagePage from '@/pages/hth/ExecutionsTriagePage';
import MyAssignmentsPage from '@/pages/hth/MyAssignmentsPage';
import AIInTestingPage from '@/pages/hth/AIInTestingPage';
import UnitTestsPage from '@/pages/hth/UnitTestsPage';
import ConfigurationsPage from '@/pages/hth/ConfigurationsPage';
import ReleaseReadinessPage from '@/pages/quality-gates/ReleaseReadinessPage';
import BugsDefectsOverviewPage from '@/pages/bugs-defects/BugsDefectsOverviewPage';
import ReleaseDetailPage from '@/pages/quality-gates/ReleaseDetailPage';
import TestCasesInventoryPage from '@/pages/test-cases/TestCasesInventoryPage';
import TestSuiteDetailPage from '@/pages/test-cases/TestSuiteDetailPage';
import TestExecutionDashboardPage from '@/pages/test-execution/TestExecutionDashboardPage';
import TestExecutionDetailPage from '@/pages/test-execution/TestExecutionDetailPage';
import SchedulerPage from '@/pages/scheduler/SchedulerPage';
import AutomationIntelligencePage from '@/pages/automation/AutomationIntelligencePage';
import EnvironmentManagementPage from '@/pages/environments/EnvironmentManagementPage';
import TestDataManagementPage from '@/pages/test-data/TestDataManagementPage';
import QualityGatesPage from '@/pages/quality-gates/QualityGatesPage';
import GovernanceDashboardPage from '@/pages/governance/GovernanceDashboardPage';
import GovernanceProcedureDetailPage from '@/pages/governance/GovernanceProcedureDetailPage';
import PostDeploymentMonitoringPage from '@/pages/post-deployment/PostDeploymentMonitoringPage';
import AdoptionImpactPage from '@/pages/adoption/AdoptionImpactPage';
import ReportingAnalyticsPage from '@/pages/reporting/ReportingAnalyticsPage';
import AIInsightsPage from '@/pages/ai-insights/AIInsightsPage';
import IntegrationManagementPage from '@/pages/integrations/IntegrationManagementPage';
import AdminPage from '@/pages/admin/AdminPage';
import UserRepositoryPage from '@/pages/users/UserRepositoryPage';
import MyProfilePage from '@/pages/users/MyProfilePage';
import BookmarksPage from '@/pages/bookmarks/BookmarksPage';
import HelpSupportPage from '@/pages/help/HelpSupportPage';
import AIAgentWorkforcePage from '@/pages/ai-insights/AIAgentWorkforcePage';
import EnterpriseKnowledgeGraphPage from '@/pages/ai-insights/EnterpriseKnowledgeGraphPage';
import EQELogPage from '@/pages/admin/EQELogPage';
import LoginPage from '@/pages/auth/LoginPage';

import { ROUTES } from '@/lib/constants';
import '@/index.css';

function LandingRedirect() {
  const { currentPersona } = usePersona();
  return <Navigate to={currentPersona?.landingPage || ROUTES.DASHBOARD} replace />;
}

/**
 * Route guard — redirects to the login screen when there is no mock session.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.ReactElement}
 */
function RequireAuth({ children }) {
  const { isAuthenticated } = usePersona();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <PersonaProvider>
        <AuditLogProvider>
          <NotificationProvider>
            <NavigationProvider>
              <TooltipProvider>
                <ToastContextProvider>
                  <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
                      <Route index element={<LandingRedirect />} />
                      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                      <Route path={ROUTES.SEGMENTS} element={<SegmentManagementPage />} />
                      <Route path={ROUTES.DEMAND} element={<DemandManagementPage />} />
                      <Route path={ROUTES.APPLICATIONS} element={<ApplicationMasterPage />} />
                      <Route path={ROUTES.APPLICATION_DETAIL} element={<ApplicationMasterPage />} />
                      <Route path={ROUTES.ENVIRONMENTS} element={<EnvironmentManagementPage />} />
                      <Route path={ROUTES.TEST_DATA} element={<TestDataManagementPage />} />
                      <Route path={ROUTES.QUALITY_GATES} element={<QualityGatesPage />} />
                      <Route path={ROUTES.GOVERNANCE} element={<GovernanceDashboardPage />} />
                      <Route path={ROUTES.PROCEDURE_DETAIL} element={<GovernanceProcedureDetailPage />} />
                      <Route path={ROUTES.POST_DEPLOYMENT} element={<PostDeploymentMonitoringPage />} />
                      <Route path={ROUTES.ADOPTION} element={<AdoptionImpactPage />} />
                      <Route path={ROUTES.REPORTS} element={<ReportingAnalyticsPage />} />
                      <Route path={ROUTES.AI_INSIGHTS} element={<AIInsightsPage />} />
                      <Route path={ROUTES.INTEGRATIONS} element={<IntegrationManagementPage />} />
                      <Route path={ROUTES.ADMIN} element={<AdminPage />} />
                      <Route path={ROUTES.USERS} element={<UserRepositoryPage />} />
                       <Route path={ROUTES.PROFILE} element={<MyProfilePage />} />
                      <Route path={ROUTES.BOOKMARKS} element={<BookmarksPage />} />
                      <Route path={ROUTES.HELP} element={<HelpSupportPage />} />
                      <Route path={ROUTES.AI_AGENTS} element={<AIAgentWorkforcePage />} />
                      <Route path={ROUTES.KNOWLEDGE_GRAPH} element={<EnterpriseKnowledgeGraphPage />} />
                      <Route path={ROUTES.EQE_LOG} element={<EQELogPage />} />
                      {/* Legacy path redirects */}
                      <Route path="/patients" element={<Navigate to={ROUTES.TEST_DATA} replace />} />
                      <Route path="/analytics" element={<Navigate to={ROUTES.AI_INSIGHTS} replace />} />
                      <Route path="/settings" element={<Navigate to={ROUTES.ADMIN} replace />} />
                    </Route>

                    {/* Humana Test Harness module — its own nested sidebar (PRD §5, §6.4.1) */}
                    <Route path="/" element={<RequireAuth><HTHLayout /></RequireAuth>}>
                      <Route path={ROUTES.HTH} element={<HTHHomePage />} />
                      <Route path={ROUTES.HTH_IN_SPRINT} element={<InSprintViewPage />} />
                      <Route path={ROUTES.APPLICATION_VIEW} element={<ApplicationViewPage />} />
                      <Route path={ROUTES.TRIAGE} element={<TriagePage />} />
                      <Route path={ROUTES.EXECUTIONS_TRIAGE} element={<ExecutionsTriagePage />} />
                      <Route path={ROUTES.MY_ASSIGNMENTS} element={<MyAssignmentsPage />} />
                      <Route path={ROUTES.AI_IN_TESTING} element={<AIInTestingPage />} />
                      <Route path={ROUTES.TEST_CASES} element={<TestCasesInventoryPage />} />
                      <Route path={ROUTES.TEST_SUITE_DETAIL} element={<TestSuiteDetailPage />} />
                      <Route path={ROUTES.BUGS_DEFECTS} element={<BugsDefectsOverviewPage />} />
                      <Route path={ROUTES.EXECUTIONS} element={<TestExecutionDashboardPage />} />
                      <Route path={ROUTES.EXECUTION_DETAIL} element={<TestExecutionDetailPage />} />
                      <Route path={ROUTES.UNIT_TESTS} element={<UnitTestsPage />} />
                      <Route path={ROUTES.RELEASE_READINESS} element={<ReleaseReadinessPage />} />
                      <Route path={ROUTES.RELEASE_DETAIL} element={<ReleaseDetailPage />} />
                      <Route path={ROUTES.CONFIGURATIONS} element={<ConfigurationsPage />} />
                      <Route path={ROUTES.SCHEDULER} element={<SchedulerPage />} />
                      <Route path={ROUTES.AUTOMATION} element={<AutomationIntelligencePage />} />
                      {/* Legacy path redirect */}
                      <Route path="/measures" element={<Navigate to={ROUTES.HTH} replace />} />
                    </Route>

                    <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                  </Routes>
                </ToastContextProvider>
              </TooltipProvider>
            </NavigationProvider>
          </NotificationProvider>
        </AuditLogProvider>
      </PersonaProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

