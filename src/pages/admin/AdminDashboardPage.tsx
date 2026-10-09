import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import {
  Users,
  UserCheck,
  Sparkles,
  CalendarCheck2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [chartMetric, setChartMetric] = useState<'batch' | 'wing' | 'country' | 'trend'>('batch');
  const [dateRange, setDateRange] = useState('30d');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => adminService.getDashboardStats(),
  });

  const barChartData = React.useMemo(() => {
    if (!stats) return [];
    if (chartMetric === 'batch') {
      return stats.batchDistribution.map((d) => ({ name: d.batch, count: d.count }));
    }
    if (chartMetric === 'wing') {
      return stats.wingDistribution.map((d) => ({ name: d.wing, count: d.count }));
    }
    if (chartMetric === 'country') {
      return stats.countryDistribution.map((d) => ({ name: d.country, count: d.count }));
    }
    return [];
  }, [stats, chartMetric]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Leadership Overview
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Community metrics, cohort breakdowns, and moderation queues.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-base !min-h-[36px] h-[36px] text-xs py-1 cursor-pointer font-medium"
            aria-label="Select date range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* 4 Stat Tiles with 30-day delta and click-through */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Alumni */}
        <Link
          to="/admin/alumni"
          className="bg-surface border border-border hover:border-border-strong rounded-card p-4 transition-colors block"
        >
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-mono uppercase text-[11px]">Total Alumni</span>
            <Users className="w-4 h-4 text-muted" />
          </div>
          <span className="text-2xl font-bold font-heading text-text">
            {isLoading ? '...' : stats?.totalAlumni}
          </span>
          <div className="flex items-center justify-between mt-2 text-xs text-muted">
            <span className="text-accent text-[11px] font-mono">{stats?.totalAlumniDelta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Pending Approvals */}
        <Link
          to="/admin/approvals"
          className="bg-surface border border-border hover:border-status-pending/50 rounded-card p-4 transition-colors block"
        >
          <div className="flex items-center justify-between text-xs text-status-pending mb-2">
            <span className="font-mono uppercase text-[11px]">Pending Reviews</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-heading text-status-pending">
            {isLoading ? '...' : stats?.pendingApprovals}
          </span>
          <div className="flex items-center justify-between mt-2 text-xs text-muted">
            <span className="text-[11px] font-mono">{stats?.pendingDelta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Open to Sessions */}
        <Link
          to="/admin/alumni?openToSessions=true"
          className="bg-surface border border-border hover:border-border-strong rounded-card p-4 transition-colors block"
        >
          <div className="flex items-center justify-between text-xs text-accent mb-2">
            <span className="font-mono uppercase text-[11px]">Active Mentors</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-heading text-accent">
            {isLoading ? '...' : stats?.openSessionsCount}
          </span>
          <div className="flex items-center justify-between mt-2 text-xs text-muted">
            <span className="text-[11px] font-mono">{stats?.sessionsDelta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Open Requests */}
        <Link
          to="/admin/sessions"
          className="bg-surface border border-border hover:border-border-strong rounded-card p-4 transition-colors block"
        >
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-mono uppercase text-[11px]">Logged Requests</span>
            <CalendarCheck2 className="w-4 h-4 text-muted" />
          </div>
          <span className="text-2xl font-bold font-heading text-text">
            {isLoading ? '...' : stats?.sessionRequestsCount}
          </span>
          <div className="flex items-center justify-between mt-2 text-xs text-muted">
            <span className="text-status-approved text-[11px] font-mono">{stats?.requestsDelta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Grid: Charts (Left 2 cols) vs "Needs Attention" Panel (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Container */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Demographic & Growth Breakdown</span>
            </h2>

            {/* Metric Tabs */}
            <div className="flex items-center gap-1 border border-border rounded-md p-0.5 bg-surface-hover text-xs font-mono">
              <button
                onClick={() => setChartMetric('batch')}
                className={`px-2.5 py-1 rounded-sm transition-colors ${
                  chartMetric === 'batch' ? 'bg-surface text-accent font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                Batch
              </button>
              <button
                onClick={() => setChartMetric('wing')}
                className={`px-2.5 py-1 rounded-sm transition-colors ${
                  chartMetric === 'wing' ? 'bg-surface text-accent font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                Wing
              </button>
              <button
                onClick={() => setChartMetric('country')}
                className={`px-2.5 py-1 rounded-sm transition-colors ${
                  chartMetric === 'country' ? 'bg-surface text-accent font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                Country
              </button>
              <button
                onClick={() => setChartMetric('trend')}
                className={`px-2.5 py-1 rounded-sm transition-colors ${
                  chartMetric === 'trend' ? 'bg-surface text-accent font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                Registrations
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="w-full h-full bg-surface-hover animate-pulse rounded-md" />
            ) : chartMetric === 'trend' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.registrationsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2E4336" vertical={false} />
                  <XAxis dataKey="month" stroke="#9DB0A2" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9DB0A2" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F3027',
                      borderColor: '#3B5244',
                      borderRadius: '8px',
                      color: '#EEF3E8',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#B7FF72" strokeWidth={2} dot={{ r: 4, fill: '#B7FF72' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2E4336" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#9DB0A2"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#9DB0A2" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F3027',
                      borderColor: '#3B5244',
                      borderRadius: '8px',
                      color: '#EEF3E8',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#B7FF72" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Needs Attention Panel */}
        <div className="bg-surface border border-border rounded-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <AlertTriangle className="w-4 h-4 text-status-pending" />
            <h2 className="text-sm font-semibold text-text">Needs Attention</h2>
          </div>

          <div className="space-y-3">
            <Link
              to="/admin/approvals"
              className="p-3 bg-surface-hover/60 rounded-md border border-border flex items-center justify-between hover:border-status-pending/50 transition-colors block"
            >
              <div>
                <span className="text-xs font-semibold text-text block">
                  Pending Alumni Registrations
                </span>
                <span className="text-[11px] text-muted">Awaiting Secretariat review</span>
              </div>
              <span className="chip bg-status-pending-bg text-status-pending border-status-pending/30">
                {stats?.needsAttention.pendingApprovalsCount}
              </span>
            </Link>

            <Link
              to="/admin/sessions"
              className="p-3 bg-surface-hover/60 rounded-md border border-border flex items-center justify-between hover:border-border-strong transition-colors block"
            >
              <div>
                <span className="text-xs font-semibold text-text block">
                  Unconfirmed Session Inquiries
                </span>
                <span className="text-[11px] text-muted">Awaiting mentor action</span>
              </div>
              <span className="chip bg-surface text-text border-border">
                {stats?.needsAttention.pendingSessionsCount}
              </span>
            </Link>

            <Link
              to="/admin/stale"
              className="p-3 bg-surface-hover/60 rounded-md border border-border flex items-center justify-between hover:border-border-strong transition-colors block"
            >
              <div>
                <span className="text-xs font-semibold text-text block">
                  Stale Profiles (6+ Months)
                </span>
                <span className="text-[11px] text-muted">Eligible for refresh reminder</span>
              </div>
              <span className="chip bg-surface text-muted border-border">
                {stats?.needsAttention.staleProfilesCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-surface border border-border rounded-card p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            <span>Recent System Activity</span>
          </h2>
          <Link to="/admin/activity" className="text-xs text-accent hover:underline">
            View full log
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {stats?.recentActivity.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-text">{log.actorName}</span>{' '}
                <span className="text-muted">{log.action}:</span>{' '}
                <span className="text-text font-medium">{log.target}</span>
              </div>
              <span className="font-mono text-[11px] text-muted whitespace-nowrap">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
