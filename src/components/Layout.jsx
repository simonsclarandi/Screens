import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Aquí caerán los CRUDs de Roles, Usuarios, etc. */}
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;