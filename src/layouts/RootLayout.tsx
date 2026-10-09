import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { RoleSwitcherModal } from '../components/shared/RoleSwitcherModal';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <RoleSwitcherModal />
    </div>
  );
};
