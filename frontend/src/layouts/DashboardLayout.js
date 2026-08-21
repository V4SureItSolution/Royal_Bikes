import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const DashboardLayout = () => {
  return (
    <div className="karoda-app">
      <Sidebar />
      <div className="karoda-main">
        <Navbar />
        <main className="workspace-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
