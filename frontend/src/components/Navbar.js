import React from 'react';
import { Plus, Bell, Bookmark } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="karoda-topbar">
      <div>
        <button className="btn-add-new">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="topbar-right-actions">
        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={20} />
        </button>
        <button className="topbar-icon-btn" title="Bookmarks">
          <Bookmark size={20} />
        </button>
      </div>
    </header>
  );
};
