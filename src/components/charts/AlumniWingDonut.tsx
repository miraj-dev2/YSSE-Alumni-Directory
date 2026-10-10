import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { WingDonutPoint } from '../../types/admin';

interface AlumniWingDonutProps {
  data: WingDonutPoint[];
  isLoading?: boolean;
}

export const AlumniWingDonut: React.FC<AlumniWingDonutProps> = ({ data, isLoading = false }) => {
  return (
    <div className="bg-[#1F3027] border border-[#2E4336] rounded-[22px] p-6 flex flex-col justify-between">
      <div className="pb-3 border-b border-[#2E4336]">
        <h2 className="text-sm font-bold font-heading text-[#EEF3E8]">Alumni by wing</h2>
        <p className="text-[11px] text-[#9DB0A2] mt-0.5">Functional department composition</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="h-40 w-40 shrink-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-[#9DB0A2] animate-pulse">
              Loading...
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[#9DB0A2]">
              No wings
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} (${name})`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#18251D',
                    borderColor: '#2E4336',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#EEF3E8',
                  }}
                />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="wing"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  stroke="#1F3027"
                  strokeWidth={2}
                >
                  {data.map((entry) => (
                    <Cell key={entry.wing} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 text-xs min-w-0 w-full">
          {data.slice(0, 5).map((d) => (
            <div key={d.wing} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[#EEF3E8] truncate text-[11px]">{d.wing}</span>
              </div>
              <span className="font-mono text-[#9DB0A2] text-[11px] shrink-0">{d.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible visually hidden table alternative */}
      <table className="sr-only">
        <caption>Alumni by wing distribution</caption>
        <thead>
          <tr><th>Wing</th><th>Count</th><th>Percentage</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.wing}><td>{d.wing}</td><td>{d.count}</td><td>{d.percentage}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
