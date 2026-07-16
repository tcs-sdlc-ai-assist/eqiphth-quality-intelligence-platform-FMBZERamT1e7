import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  BarChart2,
  Layers,
  FileText,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Shield,
  Sparkles,
  Lightbulb,
  Search,
  Brain,
  Cpu,
  MessageSquare,
  Star,
  BookOpen,
  Monitor,
  Info,
  Send,
  ExternalLink,
} from 'lucide-react';
import { cn, formatNumber, formatDate, downloadCSV, downloadJSON } from '@/lib/utils';
import { usePersona } from '@/context/PersonaContext';
import { useNavigation, usePageHeader } from '@/context/NavigationContext';
import { useAuditLog } from '@/context/AuditLogContext';
import { useToast } from '@/components/ui/Toast';
import {
  getAIInsights,
} from '@/lib/mock-api/mockService';
import {
  getAllModels,
  getAllPredictions,
  getAllRecommendations,
  getAllRiskAssessments,
  getAllNLSearchResults,
  getAllGenerativeSummaries,
  getAIInsightsAggregates,
  getAllModelTypes,
  getAllPredictionTypes,
  getAllRecommendationTypes,
  getAllRecommendationStatuses,
  getAllRecommendationPriorities,
  getAllRiskAssessmentLevels,
  getAllSummaryTypes,
  getAllSearchIntents,
} from '@/data/aiInsights';
import { KpiCard } from '@/components/shared/KpiCard';
import { PanelCard } from '@/components/shared/PanelCard';
import { ChartWrapper } from '@/components/shared/ChartWrapper';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { InsightBanner } from '@/components/shared/InsightBanner';
import { PageActions } from '@/components/layout/PageActions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Progress } from '@/components/ui/Progress';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { PERMISSIONS, ROUTES, MEASURE_STATUS } from '@/lib/constants';

const RISK_LEVEL_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
};

const PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#3b82f6',
  low: '#a3a3a3',
};

const REC_STATUS_COLORS = {
  new: '#3b82f6',
  accepted: '#06b6d4',
  in_progress: '#f59e0b',
  completed: '#10b981',
  dismissed: '#a3a3a3',
};

const REC_TYPE_COLORS = {
  action: '#16b364',
  improvement: '#3b82f6',
  risk_mitigation: '#ef4444',
  optimization: '#8b5cf6',
  compliance: '#f59e0b',
  resource_allocation: '#06b6d4',
};

const MODEL_TYPE_COLORS = {
  classification: '#16b364',
  regression: '#3b82f6',
  nlp: '#8b5cf6',
  generative: '#f59e0b',
  anomaly_detection: '#ef4444',
  recommendation: '#06b6d4',
};

const MODEL_STATUS_COLORS = {
  active: '#10b981',
  training: '#f59e0b',
  deprecated: '#a3a3a3',
  evaluation: '#3b82f6',
};

const PREDICTION_TYPE_COLORS = {
  quality_score: '#16b364',
  measure_rate: '#3b82f6',
  risk_level: '#ef4444',
  compliance_score: '#8b5cf6',
  defect_probability: '#f59e0b',
  performance_trend: '#06b6d4',
};

const SUMMARY_TYPE_COLORS = {
  executive_briefing: '#16b364',
  segment_overview: '#3b82f6',
  application_health: '#8b5cf6',
  incident_summary: '#ef4444',
  compliance_status: '#f59e0b',
  release_readiness: '#06b6d4',
  weekly_digest: '#10b981',
};

const INTENT_COLORS = {
  status_inquiry: '#16b364',
  metric_lookup: '#3b82f6',
  comparison: '#8b5cf6',
  trend_analysis: '#f59e0b',
  root_cause: '#ef4444',
  recommendation_request: '#06b6d4',
};

function CustomTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-dropdown">
      <p className="text-xs font-medium text-slate-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs text-slate-600" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          {unit}
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

function getRiskLevelBadgeVariant(level) {
  switch (level) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'neutral';
  }
}

function getPriorityBadgeVariant(priority) {
  switch (priority) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getRecStatusBadgeVariant(status) {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'accepted':
      return 'info';
    case 'new':
      return 'primary';
    case 'dismissed':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getRecTypeBadgeVariant(type) {
  switch (type) {
    case 'action':
      return 'primary';
    case 'improvement':
      return 'info';
    case 'risk_mitigation':
      return 'error';
    case 'optimization':
      return 'warning';
    case 'compliance':
      return 'warning';
    case 'resource_allocation':
      return 'success';
    default:
      return 'neutral';
  }
}

function getModelStatusBadgeVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'training':
      return 'warning';
    case 'deprecated':
      return 'neutral';
    case 'evaluation':
      return 'info';
    default:
      return 'neutral';
  }
}

function getModelTypeBadgeVariant(type) {
  switch (type) {
    case 'classification':
      return 'primary';
    case 'regression':
      return 'info';
    case 'nlp':
      return 'warning';
    case 'generative':
      return 'success';
    case 'anomaly_detection':
      return 'error';
    case 'recommendation':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getSummaryTypeBadgeVariant(type) {
  switch (type) {
    case 'executive_briefing':
      return 'primary';
    case 'segment_overview':
      return 'info';
    case 'application_health':
      return 'warning';
    case 'incident_summary':
      return 'error';
    case 'compliance_status':
      return 'warning';
    case 'release_readiness':
      return 'success';
    case 'weekly_digest':
      return 'primary';
    default:
      return 'neutral';
  }
}

function PredictionDetailDialog({ prediction, open, onOpenChange }) {
  if (!prediction) return null;

  const trendData = prediction.trendData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <TrendingUp className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{prediction.targetName}</DialogTitle>
              <DialogDescription className="mt-1">
                {prediction.id} • {formatLabel(prediction.type)} • Prediction
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusPill status={prediction.status} size="md" dot />
          <Badge variant="outline" size="md">
            {formatLabel(prediction.type)}
          </Badge>
          <Badge variant="outline" size="md">
            {formatLabel(prediction.timeframe)}
          </Badge>
          <Badge variant="primary" size="md">
            Confidence: {prediction.confidence}%
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Predicted Value</span>
            <p className="mt-1 text-lg font-semibold text-humana-green-600">{prediction.predictedValue}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Confidence</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{prediction.confidence}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Timeframe</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatLabel(prediction.timeframe)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Model</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{prediction.modelId}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Target:</span>
            <span className="font-medium text-slate-900">{prediction.target}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Generated:</span>
            <span className="font-medium text-slate-900">{formatDate(prediction.generatedAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>

        {prediction.explanation ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Explanation</h4>
            <div className="rounded-lg border border-humana-green-200 bg-humana-green-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{prediction.explanation}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Confidence Score</h4>
          <Progress
            value={prediction.confidence}
            max={100}
            variant="auto"
            size="md"
            showValue
            label="Prediction Confidence"
          />
        </div>

        {trendData.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Predicted Trend</h4>
            <ChartWrapper height={220} noCard noPadding>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Predicted Value"
                    stroke="#16b364"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#16b364', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RecommendationDetailDialog({ recommendation, open, onOpenChange }) {
  if (!recommendation) return null;

  const relatedInsights = recommendation.relatedInsights || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Lightbulb className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{recommendation.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {recommendation.id} • {formatLabel(recommendation.type)} • Recommendation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getRecTypeBadgeVariant(recommendation.type)} size="md">
            {formatLabel(recommendation.type)}
          </Badge>
          <Badge variant={getPriorityBadgeVariant(recommendation.priority)} size="md">
            {recommendation.priority}
          </Badge>
          <Badge variant={getRecStatusBadgeVariant(recommendation.status)} size="md">
            {formatLabel(recommendation.status)}
          </Badge>
          <Badge variant="primary" size="md">
            Confidence: {recommendation.confidence}%
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Impact</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{recommendation.estimatedImpact}/10</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Effort (SP)</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{recommendation.estimatedEffort}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Confidence</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{recommendation.confidence}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Target</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{recommendation.targetName}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Target:</span>
            <span className="font-medium text-slate-900">{recommendation.targetName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Generated:</span>
            <span className="font-medium text-slate-900">{formatDate(recommendation.generatedAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>

        {recommendation.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{recommendation.description}</p>
          </div>
        ) : null}

        {recommendation.rationale ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Rationale</h4>
            <div className="rounded-lg border border-info-200 bg-info-50/30 p-3">
              <p className="text-sm text-slate-700 leading-relaxed">{recommendation.rationale}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Estimated Impact</h4>
            <Progress
              value={recommendation.estimatedImpact}
              max={10}
              variant="auto"
              size="md"
              showValue
              valueFormat="fraction"
              label="Impact Score"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Confidence</h4>
            <Progress
              value={recommendation.confidence}
              max={100}
              variant="primary"
              size="md"
              showValue
              label="AI Confidence"
            />
          </div>
        </div>

        {relatedInsights.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Related Insights</h4>
            <div className="flex flex-wrap gap-1.5">
              {relatedInsights.map((id) => (
                <Badge key={id} variant="outline" size="sm">{id}</Badge>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RiskAssessmentDetailDialog({ riskAssessment, open, onOpenChange }) {
  if (!riskAssessment) return null;

  const riskFactors = riskAssessment.riskFactors || [];
  const mitigationSuggestions = riskAssessment.mitigationSuggestions || [];
  const factorBreakdown = riskAssessment.factorBreakdown || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-danger-50">
              <Shield className="h-5 w-5 text-danger-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{riskAssessment.entityName}</DialogTitle>
              <DialogDescription className="mt-1">
                {riskAssessment.id} • {formatLabel(riskAssessment.entityType)} • Risk Assessment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getRiskLevelBadgeVariant(riskAssessment.riskLevel)} size="md">
            {formatLabel(riskAssessment.riskLevel)} Risk
          </Badge>
          <Badge variant="outline" size="md">
            Score: {riskAssessment.riskScore}/100
          </Badge>
          <Badge variant="outline" size="md">
            {formatLabel(riskAssessment.entityType)}
          </Badge>
          <Badge variant="primary" size="md">
            Confidence: {riskAssessment.confidence}%
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Risk Score</span>
            <p className="mt-1 text-lg font-semibold" style={{ color: RISK_LEVEL_COLORS[riskAssessment.riskLevel] || '#64748b' }}>
              {riskAssessment.riskScore}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Risk Level</span>
            <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">{riskAssessment.riskLevel}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Confidence</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{riskAssessment.confidence}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Factors</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{riskFactors.length}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Entity:</span>
            <span className="font-medium text-slate-900">{riskAssessment.entityId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Generated:</span>
            <span className="font-medium text-slate-900">{formatDate(riskAssessment.generatedAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Risk Score</h4>
          <Progress
            value={riskAssessment.riskScore}
            max={100}
            variant={riskAssessment.riskScore >= 80 ? 'error' : riskAssessment.riskScore >= 60 ? 'warning' : 'success'}
            size="md"
            showValue
            label="Overall Risk"
          />
        </div>

        {riskFactors.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Risk Factors ({riskFactors.length})</h4>
            <div className="flex flex-col gap-2">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-2 rounded-lg border border-slate-200 p-3">
                  <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-slate-700">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {factorBreakdown.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Factor Breakdown</h4>
            <div className="flex flex-col gap-2">
              {factorBreakdown.map((fb, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{fb.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Weight: {(fb.weight * 100).toFixed(0)}%</span>
                      <span className="text-sm font-semibold text-slate-900">{fb.score}/100</span>
                    </div>
                  </div>
                  <Progress
                    value={fb.score}
                    max={100}
                    variant={fb.score < 40 ? 'error' : fb.score < 60 ? 'warning' : 'success'}
                    size="xs"
                    animate
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {mitigationSuggestions.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Mitigation Suggestions ({mitigationSuggestions.length})</h4>
            <div className="flex flex-col gap-2">
              {mitigationSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 rounded-lg border border-info-200 bg-info-50/30 p-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-info-100 text-2xs font-semibold text-info-700">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ModelDetailDialog({ model, open, onOpenChange }) {
  if (!model) return null;

  const inputFeatures = model.inputFeatures || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Cpu className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{model.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {model.id} • v{model.version} • {formatLabel(model.type)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getModelStatusBadgeVariant(model.status)} size="md">
            {formatLabel(model.status)}
          </Badge>
          <Badge variant={getModelTypeBadgeVariant(model.type)} size="md">
            {formatLabel(model.type)}
          </Badge>
          <Badge variant="outline" size="md">
            v{model.version}
          </Badge>
          <Badge variant="primary" size="md">
            Accuracy: {model.accuracy}%
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Accuracy</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{model.accuracy}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Inference Time</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{model.inferenceTimeMs}ms</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Features</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{inputFeatures.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Version</span>
            <p className="mt-1 text-lg font-semibold text-slate-900">{model.version}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Owner:</span>
            <span className="font-medium text-slate-900">{model.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Last Trained:</span>
            <span className="font-medium text-slate-900">{formatDate(model.lastTrained)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Next Training:</span>
            <span className="font-medium text-slate-900">{formatDate(model.nextTraining)}</span>
          </div>
        </div>

        {model.description ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{model.description}</p>
          </div>
        ) : null}

        {model.trainingDataSize ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Training Data</h4>
            <p className="text-sm text-slate-600">{model.trainingDataSize}</p>
          </div>
        ) : null}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Model Accuracy</h4>
          <Progress
            value={model.accuracy}
            max={100}
            variant="auto"
            size="md"
            showValue
            label="Accuracy Score"
          />
        </div>

        {inputFeatures.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Input Features ({inputFeatures.length})</h4>
            <div className="flex flex-wrap gap-1.5">
              {inputFeatures.map((feature) => (
                <Badge key={feature} variant="outline" size="sm">{feature}</Badge>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function SummaryDetailDialog({ summary, open, onOpenChange }) {
  if (!summary) return null;

  const keyPoints = summary.keyPoints || [];
  const dataSourceIds = summary.dataSourceIds || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <BookOpen className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">{summary.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {summary.id} • {formatLabel(summary.type)} • {formatLabel(summary.timeframe)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant={getSummaryTypeBadgeVariant(summary.type)} size="md">
            {formatLabel(summary.type)}
          </Badge>
          <Badge variant="outline" size="md">
            {formatLabel(summary.timeframe)}
          </Badge>
          <Badge variant="primary" size="md">
            Confidence: {summary.confidence}%
          </Badge>
          <Badge variant="outline" size="md">
            For: {summary.generatedFor}
          </Badge>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Generated:</span>
            <span className="font-medium text-slate-900">{formatDate(summary.generatedAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-500">Generated For:</span>
            <span className="font-medium text-slate-900">{summary.generatedFor}</span>
          </div>
        </div>

        {summary.content ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Content</h4>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{summary.content}</p>
            </div>
          </div>
        ) : null}

        {keyPoints.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Points ({keyPoints.length})</h4>
            <div className="flex flex-col gap-2">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2 rounded-lg border border-slate-200 p-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-humana-green-50 text-2xs font-semibold text-humana-green-700">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {dataSourceIds.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">Data Sources ({dataSourceIds.length})</h4>
            <div className="flex flex-wrap gap-1.5">
              {dataSourceIds.map((id) => (
                <Badge key={id} variant="outline" size="sm">{id}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <Progress
            value={summary.confidence}
            max={100}
            variant="primary"
            size="md"
            showValue
            label="Summary Confidence"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NLSearchDetailDialog({ searchResult, open, onOpenChange }) {
  if (!searchResult) return null;

  const results = searchResult.results || [];
  const suggestedFollowUps = searchResult.suggestedFollowUps || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-humana-green-50">
              <Search className="h-5 w-5 text-humana-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="pr-8">&ldquo;{searchResult.query}&rdquo;</DialogTitle>
              <DialogDescription className="mt-1">
                {searchResult.id} • Intent: {formatLabel(searchResult.intent)} • {results.length} results
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" size="md">
            Intent: {formatLabel(searchResult.intent)}
          </Badge>
          <Badge variant="primary" size="md">
            Confidence: {searchResult.confidence}%
          </Badge>
          <Badge variant="outline" size="md">
            {results.length} results
          </Badge>
        </div>

        {searchResult.summary ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">AI Summary</h4>
            <div className="rounded-lg border border-humana-green-200 bg-humana-green-50/30 p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{searchResult.summary}</p>
            </div>
          </div>
        ) : null}

        {results.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Search Results ({results.length})</h4>
            <div className="flex flex-col gap-2">
              {results.map((result) => (
                <div key={result.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{result.name}</span>
                        <Badge variant="outline" size="sm">{result.type}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{result.snippet}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-medium text-humana-green-600">{result.relevanceScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {suggestedFollowUps.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Suggested Follow-Up Queries</h4>
            <div className="flex flex-col gap-2">
              {suggestedFollowUps.map((query, index) => (
                <div key={index} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors">
                  <MessageSquare className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <p className="text-sm text-slate-700">{query}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <Progress
            value={searchResult.confidence}
            max={100}
            variant="primary"
            size="md"
            showValue
            label="Search Confidence"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NLSearchPanel({ searchResults, onSearchResultClick }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return searchResults;
    const lower = searchQuery.toLowerCase();
    return searchResults.filter(
      (sr) => sr.query.toLowerCase().includes(lower) || sr.intent.toLowerCase().includes(lower)
    );
  }, [searchResults, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search through AI-powered queries..."
            className={cn(
              'flex h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 transition-colors duration-200',
              'placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-humana-green-500 focus:ring-offset-2 focus:border-humana-green-500',
              'hover:border-slate-400'
            )}
            aria-label="Search AI queries"
          />
        </div>
        <Badge variant="outline" size="md">{filteredResults.length} queries</Badge>
      </div>

      {filteredResults.length === 0 ? (
        <EmptyState
          type="no_results"
          title="No search results"
          message="No AI search queries match your filter. Try a different search term."
          size="md"
          bordered
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredResults.map((sr) => (
            <div
              key={sr.id}
              className={cn(
                'rounded-lg border border-slate-200 p-4 transition-all duration-200 cursor-pointer',
                'hover:shadow-card-hover hover:border-humana-green-200'
              )}
              role="button"
              tabIndex={0}
              onClick={() => onSearchResultClick(sr)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSearchResultClick(sr);
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-humana-green-500 shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-slate-900">&ldquo;{sr.query}&rdquo;</p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" size="sm">
                      Intent: {formatLabel(sr.intent)}
                    </Badge>
                    <Badge variant="primary" size="sm">
                      {sr.confidence}% confidence
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {sr.results ? sr.results.length : 0} results
                    </Badge>
                  </div>
                  {sr.summary ? (
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">{sr.summary}</p>
                  ) : null}
                  {sr.suggestedFollowUps && sr.suggestedFollowUps.length > 0 ? (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-2xs text-slate-400">{sr.suggestedFollowUps.length} follow-up suggestions</span>
                    </div>
                  ) : null}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsPanel({ models, predictions, recommendations, riskAssessments, summaries, searchResults }) {
  const modelTypeData = useMemo(() => {
    const counts = {};
    for (const m of models) {
      counts[m.type] = (counts[m.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: formatLabel(type),
    }));
  }, [models]);

  const predictionTypeData = useMemo(() => {
    const counts = {};
    for (const p of predictions) {
      counts[p.type] = (counts[p.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: formatLabel(type),
    }));
  }, [predictions]);

  const recPriorityData = useMemo(() => {
    const counts = {};
    for (const r of recommendations) {
      counts[r.priority] = (counts[r.priority] || 0) + 1;
    }
    return Object.entries(counts).map(([priority, count]) => ({
      priority,
      count,
      label: formatLabel(priority),
    }));
  }, [recommendations]);

  const recStatusData = useMemo(() => {
    const counts = {};
    for (const r of recommendations) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: formatLabel(status),
    }));
  }, [recommendations]);

  const riskLevelData = useMemo(() => {
    const counts = {};
    for (const r of riskAssessments) {
      counts[r.riskLevel] = (counts[r.riskLevel] || 0) + 1;
    }
    return Object.entries(counts).map(([level, count]) => ({
      level,
      count,
      label: formatLabel(level),
    }));
  }, [riskAssessments]);

  const summaryTypeData = useMemo(() => {
    const counts = {};
    for (const s of summaries) {
      counts[s.type] = (counts[s.type] || 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      label: formatLabel(type),
    }));
  }, [summaries]);

  const modelAccuracyData = useMemo(() => {
    return models.map((m) => ({
      name: m.name.length > 20 ? m.name.substring(0, 20) + '…' : m.name,
      accuracy: m.accuracy,
    })).sort((a, b) => b.accuracy - a.accuracy);
  }, [models]);

  const riskScoreData = useMemo(() => {
    return riskAssessments.map((r) => ({
      name: r.entityName.length > 18 ? r.entityName.substring(0, 18) + '…' : r.entityName,
      riskScore: r.riskScore,
    })).sort((a, b) => b.riskScore - a.riskScore);
  }, [riskAssessments]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <PanelCard
        title="AI Models by Type"
        subtitle="Distribution across model types"
        icon={<Cpu className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {modelTypeData.map((entry) => (
                    <Cell key={entry.type} fill={MODEL_TYPE_COLORS[entry.type] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} models`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {modelTypeData.map((item) => (
              <div key={item.type} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: MODEL_TYPE_COLORS[item.type] || '#a3a3a3' }}
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
        title="Model Accuracy Rankings"
        subtitle="AI models ranked by accuracy"
        icon={<Star className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelAccuracyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="accuracy" name="Accuracy" radius={[4, 4, 0, 0]} barSize={24}>
                {modelAccuracyData.map((entry) => {
                  let color = '#10b981';
                  if (entry.accuracy < 85) color = '#f59e0b';
                  if (entry.accuracy < 80) color = '#ef4444';
                  return <Cell key={entry.name} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Predictions by Type"
        subtitle="Distribution across prediction categories"
        icon={<TrendingUp className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={predictionTypeData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
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
                dataKey="label"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Predictions" radius={[0, 4, 4, 0]} barSize={16}>
                {predictionTypeData.map((entry) => (
                  <Cell key={entry.type} fill={PREDICTION_TYPE_COLORS[entry.type] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Recommendations by Priority"
        subtitle="Priority distribution of AI recommendations"
        icon={<Lightbulb className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {recPriorityData.map((entry) => (
                    <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} recommendations`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {recPriorityData.map((item) => (
              <div key={item.priority} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: PRIORITY_COLORS[item.priority] || '#a3a3a3' }}
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
        title="Recommendation Status"
        subtitle="Lifecycle status of AI recommendations"
        icon={<Activity className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {recStatusData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <Badge variant={getRecStatusBadgeVariant(item.status)} size="sm">
                  {item.label}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={recommendations.length || 1}
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
        title="Risk Level Distribution"
        subtitle="Risk assessments by severity level"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <ChartWrapper height={200} noCard noPadding className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                  stroke="none"
                >
                  {riskLevelData.map((entry) => (
                    <Cell key={entry.level} fill={RISK_LEVEL_COLORS[entry.level] || '#a3a3a3'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} assessments`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <div className="flex flex-col gap-2.5 flex-1">
            {riskLevelData.map((item) => (
              <div key={item.level} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: RISK_LEVEL_COLORS[item.level] || '#a3a3a3' }}
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
        title="Risk Score Rankings"
        subtitle="Entities ranked by risk score"
        icon={<AlertTriangle className="h-5 w-5" />}
      >
        <ChartWrapper height={250} noCard noPadding>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskScoreData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="riskScore" name="Risk Score" radius={[4, 4, 0, 0]} barSize={24}>
                {riskScoreData.map((entry) => {
                  let color = '#10b981';
                  if (entry.riskScore >= 80) color = '#dc2626';
                  else if (entry.riskScore >= 60) color = '#ef4444';
                  else if (entry.riskScore >= 40) color = '#f59e0b';
                  return <Cell key={entry.name} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </PanelCard>

      <PanelCard
        title="Generative Summaries by Type"
        subtitle="Distribution across summary categories"
        icon={<BookOpen className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3">
          {summaryTypeData.map((item) => (
            <div key={item.type} className="flex items-center gap-3">
              <div className="w-32 shrink-0">
                <Badge variant={getSummaryTypeBadgeVariant(item.type)} size="sm">
                  {item.label}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress
                  value={item.count}
                  max={summaries.length || 1}
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
    </div>
  );
}

function AIInsightsSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading AI insights" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-10 w-full rounded-lg" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * AI Insights page component.
 * Displays predictive quality intelligence, generative summaries,
 * risk predictions, natural language search (simulated), recommendations,
 * and model metadata. All data from mockService.
 *
 * @returns {React.ReactElement}
 */
function AIInsightsPage() {
  const { currentPersona, hasPermission } = usePersona();
  const { setBreadcrumbs } = useNavigation();
  const { logEvent } = useAuditLog();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [predictionDetailOpen, setPredictionDetailOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [recommendationDetailOpen, setRecommendationDetailOpen] = useState(false);
  const [selectedRiskAssessment, setSelectedRiskAssessment] = useState(null);
  const [riskDetailOpen, setRiskDetailOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelDetailOpen, setModelDetailOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [summaryDetailOpen, setSummaryDetailOpen] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);
  const [searchDetailOpen, setSearchDetailOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: ROUTES.DASHBOARD },
      { label: 'Analytics', path: ROUTES.ANALYTICS },
      { label: 'AI Insights' },
    ]);
  }, [setBreadcrumbs]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await getAIInsights();
      setModels(getAllModels());
      setPredictions(getAllPredictions());
      setRecommendations(getAllRecommendations());
      setRiskAssessments(getAllRiskAssessments());
      setSearchResults(getAllNLSearchResults());
      setSummaries(getAllGenerativeSummaries());
      setAggregates(getAIInsightsAggregates());
    } catch {
      setModels(getAllModels());
      setPredictions(getAllPredictions());
      setRecommendations(getAllRecommendations());
      setRiskAssessments(getAllRiskAssessments());
      setSearchResults(getAllNLSearchResults());
      setSummaries(getAllGenerativeSummaries());
      setAggregates(getAIInsightsAggregates());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handlePredictionClick = useCallback((prediction) => {
    setSelectedPrediction(prediction);
    setPredictionDetailOpen(true);
  }, []);

  const handlePredictionDetailClose = useCallback((open) => {
    setPredictionDetailOpen(open);
    if (!open) setSelectedPrediction(null);
  }, []);

  const handleRecommendationClick = useCallback((rec) => {
    setSelectedRecommendation(rec);
    setRecommendationDetailOpen(true);
  }, []);

  const handleRecommendationDetailClose = useCallback((open) => {
    setRecommendationDetailOpen(open);
    if (!open) setSelectedRecommendation(null);
  }, []);

  const handleRiskClick = useCallback((risk) => {
    setSelectedRiskAssessment(risk);
    setRiskDetailOpen(true);
  }, []);

  const handleRiskDetailClose = useCallback((open) => {
    setRiskDetailOpen(open);
    if (!open) setSelectedRiskAssessment(null);
  }, []);

  const handleModelClick = useCallback((model) => {
    setSelectedModel(model);
    setModelDetailOpen(true);
  }, []);

  const handleModelDetailClose = useCallback((open) => {
    setModelDetailOpen(open);
    if (!open) setSelectedModel(null);
  }, []);

  const handleSummaryClick = useCallback((summary) => {
    setSelectedSummary(summary);
    setSummaryDetailOpen(true);
  }, []);

  const handleSummaryDetailClose = useCallback((open) => {
    setSummaryDetailOpen(open);
    if (!open) setSelectedSummary(null);
  }, []);

  const handleSearchResultClick = useCallback((sr) => {
    setSelectedSearchResult(sr);
    setSearchDetailOpen(true);
  }, []);

  const handleSearchDetailClose = useCallback((open) => {
    setSearchDetailOpen(open);
    if (!open) setSelectedSearchResult(null);
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      const data = predictions.map((p) => ({
        id: p.id,
        modelId: p.modelId,
        type: p.type,
        target: p.target,
        targetName: p.targetName,
        predictedValue: p.predictedValue,
        confidence: p.confidence,
        timeframe: p.timeframe,
        status: p.status,
        generatedAt: p.generatedAt,
      }));
      downloadCSV(data, 'ai-predictions.csv');
      logEvent('data_export', {
        action: 'Exported AI Predictions',
        details: `AI predictions exported as CSV by ${currentPersona.name}. ${data.length} records.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: `${data.length} predictions exported as CSV.`,
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export AI predictions.',
      });
    }
  }, [predictions, currentPersona, logEvent, toast]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = {
        models: models.length,
        predictions: predictions.map((p) => ({
          id: p.id,
          type: p.type,
          targetName: p.targetName,
          predictedValue: p.predictedValue,
          confidence: p.confidence,
          timeframe: p.timeframe,
          status: p.status,
        })),
        recommendations: recommendations.length,
        riskAssessments: riskAssessments.length,
        summaries: summaries.length,
        searchResults: searchResults.length,
      };
      downloadJSON(data, 'ai-insights.json');
      logEvent('data_export', {
        action: 'Exported AI Insights',
        details: `AI insights data exported as JSON by ${currentPersona.name}.`,
        resource: '/analytics',
        outcome: 'success',
      });
      toast({
        variant: 'success',
        title: 'Export Complete',
        description: 'AI insights data exported as JSON.',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Export Failed',
        description: 'Failed to export AI insights data.',
      });
    }
  }, [models, predictions, recommendations, riskAssessments, summaries, searchResults, currentPersona, logEvent, toast]);

  const kpiData = useMemo(() => {
    if (!aggregates) return [];

    return [
      {
        id: 'kpi_models',
        label: 'Active Models',
        value: aggregates.activeModels,
        unit: 'count',
        trend: 'stable',
        icon: <Cpu />,
        tone: 'blue',
        description: `${aggregates.activeModels} of ${aggregates.totalModels} models active.`,
      },
      {
        id: 'kpi_avg_accuracy',
        label: 'Avg Model Accuracy',
        value: aggregates.averageModelAccuracy,
        unit: 'percent',
        trend: aggregates.averageModelAccuracy >= 88 ? 'improving' : 'stable',
        icon: <Target />,
        tone: 'green',
        description: 'Average accuracy across all AI models.',
      },
      {
        id: 'kpi_predictions',
        label: 'Predictions',
        value: aggregates.totalPredictions,
        unit: 'count',
        trend: 'improving',
        icon: <TrendingUp />,
        tone: 'purple',
        description: `${aggregates.totalPredictions} predictions with ${aggregates.averagePredictionConfidence.toFixed(0)}% avg confidence.`,
      },
      {
        id: 'kpi_recommendations',
        label: 'Recommendations',
        value: aggregates.totalRecommendations,
        unit: 'count',
        trend: 'improving',
        icon: <Lightbulb />,
        tone: 'orange',
        description: `${aggregates.totalRecommendations} AI-generated recommendations.`,
      },
    ];
  }, [aggregates]);

  const insightData = useMemo(() => {
    if (!aggregates) return null;

    const criticalRisks = (aggregates.riskLevelBreakdown && aggregates.riskLevelBreakdown.critical) || 0;
    const highRisks = (aggregates.riskLevelBreakdown && aggregates.riskLevelBreakdown.high) || 0;
    const criticalRecs = (aggregates.recommendationPriorityBreakdown && aggregates.recommendationPriorityBreakdown.critical) || 0;

    if (criticalRisks > 0) {
      return {
        variant: 'critical',
        title: `${criticalRisks} critical risk assessment${criticalRisks !== 1 ? 's' : ''} identified`,
        message: `${criticalRisks} critical and ${highRisks} high risk assessments require immediate attention. ${criticalRecs} critical priority recommendation${criticalRecs !== 1 ? 's' : ''} available. Average model accuracy is ${aggregates.averageModelAccuracy.toFixed(1)}%.`,
        source: 'AI Insights Engine',
        confidence: 93,
      };
    }

    if (highRisks > 0 || criticalRecs > 0) {
      return {
        variant: 'warning',
        title: `${highRisks} high risk assessment${highRisks !== 1 ? 's' : ''} and ${criticalRecs} critical recommendation${criticalRecs !== 1 ? 's' : ''}`,
        message: `Review high-priority risk assessments and recommendations. ${aggregates.totalPredictions} predictions generated with ${aggregates.averagePredictionConfidence.toFixed(0)}% average confidence. ${aggregates.totalSummaries} generative summaries available.`,
        source: 'AI Insights Engine',
        confidence: 89,
      };
    }

    return {
      variant: 'success',
      title: 'AI insights performing well',
      message: `${aggregates.activeModels} active models with ${aggregates.averageModelAccuracy.toFixed(1)}% average accuracy. ${aggregates.totalPredictions} predictions, ${aggregates.totalRecommendations} recommendations, and ${aggregates.totalRiskAssessments} risk assessments generated.`,
      source: 'AI Insights Engine',
      confidence: 96,
    };
  }, [aggregates]);

  const predictionColumns = useMemo(
    () => [
      {
        accessorKey: 'targetName',
        header: 'Target',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handlePredictionClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.targetName}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 130,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{formatLabel(row.original.type)}</Badge>
        ),
      },
      {
        accessorKey: 'predictedValue',
        header: 'Predicted',
        size: 90,
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-humana-green-600">{row.original.predictedValue}</span>
        ),
      },
      {
        accessorKey: 'confidence',
        header: 'Confidence',
        size: 110,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress
              value={row.original.confidence}
              max={100}
              variant="auto"
              size="xs"
              className="flex-1"
            />
            <span className="text-xs font-medium text-slate-700 w-10 text-right">
              {row.original.confidence}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'timeframe',
        header: 'Timeframe',
        size: 120,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{formatLabel(row.original.timeframe)}</Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <StatusPill status={row.original.status} size="sm" dot />
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handlePredictionClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.targetName}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handlePredictionClick]
  );

  const recommendationColumns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Recommendation',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleRecommendationClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors line-clamp-2"
          >
            {row.original.title}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 130,
        cell: ({ row }) => (
          <Badge variant={getRecTypeBadgeVariant(row.original.type)} size="sm">
            {formatLabel(row.original.type)}
          </Badge>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 90,
        cell: ({ row }) => (
          <Badge variant={getPriorityBadgeVariant(row.original.priority)} size="sm">
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'estimatedImpact',
        header: 'Impact',
        size: 70,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-900">{row.original.estimatedImpact}/10</span>
        ),
      },
      {
        accessorKey: 'estimatedEffort',
        header: 'Effort',
        size: 70,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.estimatedEffort} SP</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        cell: ({ row }) => (
          <Badge variant={getRecStatusBadgeVariant(row.original.status)} size="sm">
            {formatLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: 'confidence',
        header: 'Confidence',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.confidence}%</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleRecommendationClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.title}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleRecommendationClick]
  );

  const riskColumns = useMemo(
    () => [
      {
        accessorKey: 'entityName',
        header: 'Entity',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleRiskClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.entityName}
          </button>
        ),
      },
      {
        accessorKey: 'entityType',
        header: 'Type',
        size: 110,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">{formatLabel(row.original.entityType)}</Badge>
        ),
      },
      {
        accessorKey: 'riskLevel',
        header: 'Risk Level',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getRiskLevelBadgeVariant(row.original.riskLevel)} size="sm">
            {formatLabel(row.original.riskLevel)}
          </Badge>
        ),
      },
      {
        accessorKey: 'riskScore',
        header: 'Score',
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress
              value={row.original.riskScore}
              max={100}
              variant={row.original.riskScore >= 80 ? 'error' : row.original.riskScore >= 60 ? 'warning' : 'success'}
              size="xs"
              className="flex-1"
            />
            <span className="text-xs font-medium text-slate-700 w-8 text-right">
              {row.original.riskScore}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'confidence',
        header: 'Confidence',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.confidence}%</span>
        ),
      },
      {
        id: 'factors',
        header: 'Factors',
        size: 70,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.riskFactors ? row.original.riskFactors.length : 0}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleRiskClick(row.original)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors duration-200',
                  'hover:bg-slate-100 hover:text-slate-600',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-humana-green-500 focus-visible:ring-offset-1'
                )}
                aria-label={`View ${row.original.entityName}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">View Details</TooltipContent>
          </UITooltip>
        ),
      },
    ],
    [handleRiskClick]
  );

  const modelColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Model',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleModelClick(row.original)}
            className="text-sm font-medium text-humana-green-600 hover:text-humana-green-700 hover:underline text-left transition-colors"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 130,
        cell: ({ row }) => (
          <Badge variant={getModelTypeBadgeVariant(row.original.type)} size="sm">
            {formatLabel(row.original.type)}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <Badge variant={getModelStatusBadgeVariant(row.original.status)} size="sm">
            {formatLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: 'accuracy',
        header: 'Accuracy',
        size: 110,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress
              value={row.original.accuracy}
              max={100}
              variant="auto"
              size="xs"
              className="flex-1"
            />
            <span className="text-xs font-medium text-slate-700 w-10 text-right">
              {row.original.accuracy}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'version',
        header: 'Version',
        size: 80,
        cell: ({ row }) => (
          <Badge variant="outline" size="sm">v{row.original.version}</Badge>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        size: 130,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.owner}</span>
        ),
      },
      {
        accessorKey: 'inferenceTimeMs',
        header: 'Inference',
        size: 80,
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">{row.original.inferenceTimeMs}ms</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <UITooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleModelClick(row.original)}
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
        ),
      },
    ],
    [handleModelClick]
  );

  usePageHeader({ title: 'AI Insights', subtitle: `Predictive intelligence, risk assessments, recommendations, and generative summaries for ${currentPersona.name}` });

  if (loading) {
    return <AIInsightsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Refresh + Export — portalled into the navbar (left of the bell) */}
      <PageActions>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              iconLeft={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              aria-label="Refresh AI insights"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Refresh</TooltipContent>
        </UITooltip>

        <PermissionGate requiredAction={PERMISSIONS.EXPORT_REPORTS} behavior="hidden">
          <DropdownMenu>
            <UITooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2"
                    iconLeft={<Download className="h-4 w-4" />}
                    aria-label="Export AI insights"
                  />
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Export</TooltipContent>
            </UITooltip>
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
      </PageActions>

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
            icon={kpi.icon}
            tone={kpi.tone}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions ({predictions.length})</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations ({recommendations.length})</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessments ({riskAssessments.length})</TabsTrigger>
          <TabsTrigger value="search">NL Search ({searchResults.length})</TabsTrigger>
          <TabsTrigger value="summaries">Summaries ({summaries.length})</TabsTrigger>
          <TabsTrigger value="models">Models ({models.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-6">
            {/* Predictions Overview */}
            <PanelCard
              title="Quality Predictions"
              subtitle={`${predictions.length} predictions generated`}
              icon={<TrendingUp className="h-5 w-5" />}
            >
              {predictions.length === 0 ? (
                <EmptyState type="no_data" title="No predictions" message="No predictions available." size="sm" />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {predictions.slice(0, 6).map((pred) => (
                    <Card
                      key={pred.id}
                      className={cn(
                        'p-4 cursor-pointer transition-all duration-200',
                        'hover:shadow-card-hover hover:border-humana-green-200',
                        'active:scale-[0.99]'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handlePredictionClick(pred)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePredictionClick(pred);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{pred.targetName}</h3>
                          <span className="text-2xs text-slate-500">{formatLabel(pred.type)}</span>
                        </div>
                        <StatusPill status={pred.status} size="sm" dot />
                      </div>
                      <div className="mt-3 flex items-end justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-2xs text-slate-400">Predicted Value</span>
                          <span className="text-xl font-semibold text-humana-green-600">{pred.predictedValue}</span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-2xs text-slate-400">Confidence</span>
                          <span className="text-sm font-semibold text-slate-900">{pred.confidence}%</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" size="sm">{formatLabel(pred.timeframe)}</Badge>
                        <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {predictions.length > 6 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{predictions.length - 6} more predictions. Switch to Predictions tab to see all.
                </p>
              ) : null}
            </PanelCard>

            {/* Recommendations Overview */}
            <PanelCard
              title="AI Recommendations"
              subtitle={`${recommendations.length} recommendations generated`}
              icon={<Lightbulb className="h-5 w-5" />}
            >
              {recommendations.length === 0 ? (
                <EmptyState type="no_data" title="No recommendations" message="No recommendations available." size="sm" />
              ) : (
                <div className="flex flex-col gap-3">
                  {recommendations.slice(0, 5).map((rec) => (
                    <div
                      key={rec.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border border-slate-200 p-4 transition-all duration-200 cursor-pointer',
                        'hover:shadow-card-hover hover:border-humana-green-200'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRecommendationClick(rec)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRecommendationClick(rec);
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{rec.title}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant={getPriorityBadgeVariant(rec.priority)} size="sm">
                              {rec.priority}
                            </Badge>
                            <Badge variant={getRecStatusBadgeVariant(rec.status)} size="sm">
                              {formatLabel(rec.status)}
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{rec.description}</p>
                        <div className="mt-2 flex items-center gap-3 text-2xs text-slate-400">
                          <span>Impact: {rec.estimatedImpact}/10</span>
                          <span>Effort: {rec.estimatedEffort} SP</span>
                          <span>Confidence: {rec.confidence}%</span>
                          <Badge variant={getRecTypeBadgeVariant(rec.type)} size="sm">
                            {formatLabel(rec.type)}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              )}
              {recommendations.length > 5 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{recommendations.length - 5} more. Switch to Recommendations tab to see all.
                </p>
              ) : null}
            </PanelCard>

            {/* Risk Assessments Overview */}
            <PanelCard
              title="Risk Assessments"
              subtitle={`${riskAssessments.length} assessments generated`}
              icon={<Shield className="h-5 w-5" />}
            >
              {riskAssessments.length === 0 ? (
                <EmptyState type="no_data" title="No risk assessments" message="No risk assessments available." size="sm" />
              ) : (
                <div className="flex flex-col gap-3">
                  {riskAssessments.map((risk) => (
                    <div
                      key={risk.id}
                      className={cn(
                        'rounded-lg border p-4 transition-all duration-200 cursor-pointer',
                        'hover:shadow-card-hover hover:border-humana-green-200',
                        risk.riskLevel === 'critical' ? 'border-danger-200 bg-danger-50/10' :
                        risk.riskLevel === 'high' ? 'border-warning-200 bg-warning-50/10' :
                        'border-slate-200'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRiskClick(risk)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRiskClick(risk);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900">{risk.entityName}</h3>
                            <Badge variant={getRiskLevelBadgeVariant(risk.riskLevel)} size="sm">
                              {formatLabel(risk.riskLevel)}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                            <span>{formatLabel(risk.entityType)}</span>
                            <span>Score: {risk.riskScore}/100</span>
                            <span>Confidence: {risk.confidence}%</span>
                            <span>{risk.riskFactors ? risk.riskFactors.length : 0} factors</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: RISK_LEVEL_COLORS[risk.riskLevel] || '#64748b' }}
                          >
                            {risk.riskScore}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={risk.riskScore}
                          max={100}
                          variant={risk.riskScore >= 80 ? 'error' : risk.riskScore >= 60 ? 'warning' : 'success'}
                          size="xs"
                          animate
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PanelCard>

            {/* Generative Summaries Overview */}
            <PanelCard
              title="Generative Summaries"
              subtitle={`${summaries.length} AI-generated summaries`}
              icon={<BookOpen className="h-5 w-5" />}
              collapsible
              defaultCollapsed={false}
            >
              {summaries.length === 0 ? (
                <EmptyState type="no_data" title="No summaries" message="No generative summaries available." size="sm" />
              ) : (
                <div className="flex flex-col gap-3">
                  {summaries.slice(0, 4).map((summary) => (
                    <div
                      key={summary.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border border-slate-200 p-4 transition-all duration-200 cursor-pointer',
                        'hover:shadow-card-hover hover:border-humana-green-200'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSummaryClick(summary)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSummaryClick(summary);
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{summary.title}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant={getSummaryTypeBadgeVariant(summary.type)} size="sm">
                              {formatLabel(summary.type)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-2xs text-slate-400">
                          <Badge variant="outline" size="sm">{formatLabel(summary.timeframe)}</Badge>
                          <span>For: {summary.generatedFor}</span>
                          <span>Confidence: {summary.confidence}%</span>
                        </div>
                        {summary.keyPoints && summary.keyPoints.length > 0 ? (
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
                            {summary.keyPoints[0]}
                          </p>
                        ) : null}
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-2" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              )}
              {summaries.length > 4 ? (
                <p className="mt-3 text-xs text-slate-400 text-center">
                  +{summaries.length - 4} more summaries. Switch to Summaries tab to see all.
                </p>
              ) : null}
            </PanelCard>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          {predictions.length === 0 ? (
            <EmptyState type="no_data" title="No predictions" message="No AI predictions available." size="lg" bordered />
          ) : (
            <DataTable
              columns={predictionColumns}
              data={predictions}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search predictions..."
              emptyMessage="No predictions match the search criteria."
              onRowClick={handlePredictionClick}
            />
          )}
        </TabsContent>

        <TabsContent value="recommendations">
          {recommendations.length === 0 ? (
            <EmptyState type="no_data" title="No recommendations" message="No AI recommendations available." size="lg" bordered />
          ) : (
            <DataTable
              columns={recommendationColumns}
              data={recommendations}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search recommendations..."
              emptyMessage="No recommendations match the search criteria."
              onRowClick={handleRecommendationClick}
            />
          )}
        </TabsContent>

        <TabsContent value="risks">
          {riskAssessments.length === 0 ? (
            <EmptyState type="no_data" title="No risk assessments" message="No AI risk assessments available." size="lg" bordered />
          ) : (
            <DataTable
              columns={riskColumns}
              data={riskAssessments}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search risk assessments..."
              emptyMessage="No risk assessments match the search criteria."
              onRowClick={handleRiskClick}
            />
          )}
        </TabsContent>

        <TabsContent value="search">
          <PanelCard
            title="Natural Language Search"
            subtitle={`${searchResults.length} AI-powered search queries`}
            icon={<Search className="h-5 w-5" />}
          >
            <NLSearchPanel
              searchResults={searchResults}
              onSearchResultClick={handleSearchResultClick}
            />
          </PanelCard>
        </TabsContent>

        <TabsContent value="summaries">
          {summaries.length === 0 ? (
            <EmptyState type="no_data" title="No summaries" message="No generative summaries available." size="lg" bordered />
          ) : (
            <div className="flex flex-col gap-3">
              {summaries.map((summary) => (
                <div
                  key={summary.id}
                  className={cn(
                    'rounded-lg border border-slate-200 p-5 transition-all duration-200 cursor-pointer',
                    'hover:shadow-card-hover hover:border-humana-green-200'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSummaryClick(summary)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSummaryClick(summary);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-900">{summary.title}</h3>
                        <Badge variant={getSummaryTypeBadgeVariant(summary.type)} size="sm">
                          {formatLabel(summary.type)}
                        </Badge>
                        <Badge variant="outline" size="sm">{formatLabel(summary.timeframe)}</Badge>
                        <Badge variant="primary" size="sm">{summary.confidence}% confidence</Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-2xs text-slate-400">
                        <span>For: {summary.generatedFor}</span>
                        <span>•</span>
                        <span>{formatDate(summary.generatedAt, 'MMM d, yyyy h:mm a')}</span>
                        {summary.keyPoints ? (
                          <>
                            <span>•</span>
                            <span>{summary.keyPoints.length} key points</span>
                          </>
                        ) : null}
                      </div>
                      {summary.keyPoints && summary.keyPoints.length > 0 ? (
                        <div className="mt-2 flex flex-col gap-1">
                          {summary.keyPoints.slice(0, 3).map((point, index) => (
                            <div key={index} className="flex items-start gap-1.5">
                              <span className="text-2xs text-humana-green-500 mt-0.5">•</span>
                              <p className="text-xs text-slate-600 line-clamp-1">{point}</p>
                            </div>
                          ))}
                          {summary.keyPoints.length > 3 ? (
                            <span className="text-2xs text-slate-400 ml-3">+{summary.keyPoints.length - 3} more points</span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models">
          {models.length === 0 ? (
            <EmptyState type="no_data" title="No models" message="No AI models available." size="lg" bordered />
          ) : (
            <DataTable
              columns={modelColumns}
              data={models}
              enableSorting
              enableFiltering
              enablePagination
              enableColumnVisibility
              enableExport={false}
              pageSize={15}
              searchPlaceholder="Search models..."
              emptyMessage="No models match the search criteria."
              onRowClick={handleModelClick}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {models.length === 0 && predictions.length === 0 ? (
            <EmptyState type="no_chart" title="No data for analytics" message="No AI insights data available to generate analytics." size="lg" bordered />
          ) : (
            <AnalyticsPanel
              models={models}
              predictions={predictions}
              recommendations={recommendations}
              riskAssessments={riskAssessments}
              summaries={summaries}
              searchResults={searchResults}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      {aggregates ? (
        <PanelCard
          title="AI Insights Summary"
          subtitle="Aggregate metrics across all AI capabilities"
          icon={<Sparkles className="h-5 w-5" />}
          collapsible
          defaultCollapsed
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Models</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalModels}</span>
              <span className="text-2xs text-slate-500">{aggregates.activeModels} active</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Avg Accuracy</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.averageModelAccuracy.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Predictions</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalPredictions}</span>
              <span className="text-2xs text-slate-500">{aggregates.averagePredictionConfidence.toFixed(0)}% avg conf.</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Recommendations</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalRecommendations}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Risk Assessments</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalRiskAssessments}</span>
              <span className="text-2xs text-slate-500">Avg score: {aggregates.averageRiskScore.toFixed(0)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xs font-medium text-slate-400 uppercase tracking-wider">Summaries</span>
              <span className="text-2xl font-semibold text-slate-900">{aggregates.totalSummaries}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Average Model Accuracy</h4>
            <Progress
              value={aggregates.averageModelAccuracy}
              max={100}
              variant="auto"
              size="md"
              showValue
              label="Platform Average"
            />
          </div>

          {aggregates.recommendationStatusBreakdown ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommendation Status</h4>
              <div className="flex flex-col gap-2">
                {Object.entries(aggregates.recommendationStatusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <Badge variant={getRecStatusBadgeVariant(status)} size="sm">
                        {formatLabel(status)}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={count}
                        max={aggregates.totalRecommendations || 1}
                        variant="primary"
                        size="xs"
                        animate
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {aggregates.riskLevelBreakdown ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Risk Level Distribution</h4>
              <div className="flex flex-col gap-2">
                {Object.entries(aggregates.riskLevelBreakdown).map(([level, count]) => (
                  <div key={level} className="flex items-center gap-3">
                    <div className="w-20 shrink-0">
                      <Badge variant={getRiskLevelBadgeVariant(level)} size="sm">
                        {formatLabel(level)}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={count}
                        max={aggregates.totalRiskAssessments || 1}
                        variant="primary"
                        size="xs"
                        animate
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {aggregates.recommendationPriorityBreakdown ? (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommendation Priority</h4>
              <div className="flex flex-col gap-2">
                {Object.entries(aggregates.recommendationPriorityBreakdown).map(([priority, count]) => (
                  <div key={priority} className="flex items-center gap-3">
                    <div className="w-20 shrink-0">
                      <Badge variant={getPriorityBadgeVariant(priority)} size="sm">
                        {formatLabel(priority)}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={count}
                        max={aggregates.totalRecommendations || 1}
                        variant="primary"
                        size="xs"
                        animate
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </PanelCard>
      ) : null}

      {/* Detail Dialogs */}
      <PredictionDetailDialog
        prediction={selectedPrediction}
        open={predictionDetailOpen}
        onOpenChange={handlePredictionDetailClose}
      />

      <RecommendationDetailDialog
        recommendation={selectedRecommendation}
        open={recommendationDetailOpen}
        onOpenChange={handleRecommendationDetailClose}
      />

      <RiskAssessmentDetailDialog
        riskAssessment={selectedRiskAssessment}
        open={riskDetailOpen}
        onOpenChange={handleRiskDetailClose}
      />

      <ModelDetailDialog
        model={selectedModel}
        open={modelDetailOpen}
        onOpenChange={handleModelDetailClose}
      />

      <SummaryDetailDialog
        summary={selectedSummary}
        open={summaryDetailOpen}
        onOpenChange={handleSummaryDetailClose}
      />

      <NLSearchDetailDialog
        searchResult={selectedSearchResult}
        open={searchDetailOpen}
        onOpenChange={handleSearchDetailClose}
      />
    </div>
  );
}

AIInsightsPage.displayName = 'AIInsightsPage';

export { AIInsightsPage };
export default AIInsightsPage;