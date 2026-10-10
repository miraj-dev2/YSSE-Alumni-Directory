import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopBar } from '../components/admin/AdminTopBar';
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

      {/* Main Content Area offset by 264px on desktop */}
      <div className="flex-1 lg:pl-[264px] flex flex-col min-w-0">
        <AdminTopBar onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
        <DemoDataNotice />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-7 lg:px-[36px] lg:py-[28px] max-w-[1440px] w-full mx-auto space-y-7">
          <Outlet context={{ onOpenMobileMenu: () => setMobileSidebarOpen(true), refreshPendingCount }} />
        </main>
      </div>
    </div>
  );
};
