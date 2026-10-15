import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardTopBar } from '../components/dashboard/DashboardTopBar';
import { portalApi } from '../api/portalApi';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadNotesCount, setUnreadNotesCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshBadges = useCallback(async () => {
    try {
      const stats = await portalApi.getDashboardStats();
      if (stats.role === 'alumni') {
        setPendingCount(stats.stats.pendingRequests);
        setUnreadNotesCount(stats.stats.unreadNotifications);
      } else {
        setPendingCount(stats.stats.sentPending);
        setUnreadNotesCount(stats.stats.unreadNotifications);
      }
    } catch {
      // Quiet fail if unauthorized or networking glitch
    }
  }, []);

  useEffect(() => {
    refreshBadges();
    const interval = setInterval(refreshBadges, 15000);
    return () => clearInterval(interval);
  }, [refreshBadges]);

  return (
    <div className="min-h-screen bg-[#18251D] text-[#EEF3E8] flex flex-col font-sans">
      <DashboardSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        pendingCount={pendingCount}
        unreadNotesCount={unreadNotesCount}
      />

      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <DashboardTopBar
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          unreadCount={unreadNotesCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet context={{ refreshBadges }} />
        </main>
      </div>
    </div>
  );
};
