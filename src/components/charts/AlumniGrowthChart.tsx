import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { GrowthPoint } from '../../types/admin';

interface AlumniGrowthChartProps {
  data: GrowthPoint[];
  interval: 'yearly' | 'monthly';
  onIntervalChange: (interval: 'yearly' | 'monthly') => void;
  isLoading?: boolean;
}

export const AlumniGrowthChart: React.FC<AlumniGrowthChartProps> = ({
  data,
  interval,
  onIntervalChange,
  isLoading = false,
}) => {
  return (
    <div className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-[#2E4336]">
        <div>
          <h2 className="text-sm font-bold font-heading text-[#EEF3E8]">Alumni growth</h2>
          <p className="text-[11px] text-[#9DB0A2] mt-0.5">Cumulative directory network</p>
        </div>

        <div className="flex items-center bg-[#18251D] border border-[#2E4336] rounded-full p-0.5 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => onIntervalChange('yearly')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              interval === 'yearly'
                ? 'bg-[#B7FF72] text-[#18251D] font-bold'
                : 'text-[#9DB0A2] hover:text-[#EEF3E8]'
            }`}
          >
            Yearly
          </button>
          <button
            type="button"
            onClick={() => onIntervalChange('monthly')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              interval === 'monthly'
                ? 'bg-[#B7FF72] text-[#18251D] font-bold'
                : 'text-[#9DB0A2] hover:text-[#EEF3E8]'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-48 mt-4 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-xs text-[#9DB0A2] animate-pulse">
            Loading growth data...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#9DB0A2]">
            No growth history recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B7FF72" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#B7FF72" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#9DB0A2" fontSize={10} tickLine={false} />
              <YAxis stroke="#9DB0A2" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18251D',
                  borderColor: '#2E4336',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#EEF3E8',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#B7FF72"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#growthGrad)"
                name="Alumni count"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Accessible visually hidden table alternative */}
      <table className="sr-only">
        <caption>Alumni growth data ({interval})</caption>
        <thead>
          <tr><th>Period</th><th>Count</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.period}><td>{d.period}</td><td>{d.count}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
