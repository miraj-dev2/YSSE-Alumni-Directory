import React from 'react';
import { ChartBarData } from '../../types/admin';

interface DashboardChartsProps {
  batchData: ChartBarData[];
  wingData: ChartBarData[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ batchData, wingData }) => {
  const maxBatch = Math.max(...batchData.map((d) => d.count), 1);
  const maxWing = Math.max(...wingData.map((d) => d.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Distribution by Batch */}
      <div className="bg-[#1F3027] border border-[#2E4336] rounded p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E4336]">
          <div>
            <h2 className="text-sm font-bold font-heading text-[#EEF3E8]">
              Alumni Distribution by Batch
            </h2>
            <p className="text-xs text-[#9DB0A2] mt-0.5">Historical cohort strength</p>
          </div>
          <span className="text-[10px] font-mono uppercase text-[#9DB0A2] bg-[#18251D] px-2 py-0.5 rounded border border-[#2E4336]">
            {batchData.length} Batches
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {batchData.length === 0 ? (
            <p className="text-xs text-[#9DB0A2] py-4 text-center">No batch data available</p>
          ) : (
            batchData.map((item) => {
              const widthPct = Math.round((item.count / maxBatch) * 100);
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#EEF3E8] font-medium">{item.label}</span>
                    <span className="font-mono text-[#9DB0A2]">{item.count}</span>
                  </div>
                  <div className="h-2 w-full bg-[#18251D] rounded-full overflow-hidden border border-[#2E4336]">
                    <div
                      className="h-full bg-[#B7FF72] transition-all duration-300"
                      style={{ width: `${widthPct}%` }}
                      role="progressbar"
                      aria-valuenow={item.count}
                      aria-valuemin={0}
                      aria-valuemax={maxBatch}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Distribution by Wing */}
      <div className="bg-[#1F3027] border border-[#2E4336] rounded p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E4336]">
          <div>
            <h2 className="text-sm font-bold font-heading text-[#EEF3E8]">
              Alumni Distribution by Wing
            </h2>
            <p className="text-xs text-[#9DB0A2] mt-0.5">YSSE functional department representation</p>
          </div>
          <span className="text-[10px] font-mono uppercase text-[#9DB0A2] bg-[#18251D] px-2 py-0.5 rounded border border-[#2E4336]">
            {wingData.length} Wings
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {wingData.length === 0 ? (
            <p className="text-xs text-[#9DB0A2] py-4 text-center">No wing data available</p>
          ) : (
            wingData.map((item) => {
              const widthPct = Math.round((item.count / maxWing) * 100);
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#EEF3E8] font-medium">{item.label}</span>
                    <span className="font-mono text-[#9DB0A2]">{item.count}</span>
                  </div>
                  <div className="h-2 w-full bg-[#18251D] rounded-full overflow-hidden border border-[#2E4336]">
                    <div
                      className="h-full bg-[#B7FF72] transition-all duration-300"
                      style={{ width: `${widthPct}%` }}
                      role="progressbar"
                      aria-valuenow={item.count}
                      aria-valuemin={0}
                      aria-valuemax={maxWing}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
