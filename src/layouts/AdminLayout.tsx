import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DemoDataNotice } from '../components/common/DemoDataNotice';
import { alumniApi } from '../api/alumniApi';
import { DEMO_ADMIN_USER } from '../api/mockData';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = async () => {
    try {
      const pending = await alumniApi.getApprovalsList('PENDING');
      setPendingCount(pending.length);
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#18251D] text-[#EEF3E8] flex flex-col font-sans">
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        pendingApprovalsCount={pendingCount}
        adminUser={DEMO_ADMIN_USER}
      />

      {/* Main Content Area offset by 248px on desktop */}
      <div className="flex-1 md:pl-[248px] flex flex-col min-w-0">
        <DemoDataNotice />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onOpenMobileMenu: () => setMobileSidebarOpen(true), refreshPendingCount }} />
        </main>
      </div>
    </div>
  );
};
