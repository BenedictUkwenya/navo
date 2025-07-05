// src/pages/UserManagementPage/UserManagementPage.tsx

import React, { useState } from 'react';
import './UserManagementPage.css';
import UserProfileTab from './UserProfileTab';
import UsersListTab from './UsersListTab';

type AdminTab = 'profile' | 'users';

const UserManagementPage: React.FC = () => {
  // This state controls which tab is currently visible. We'll start on the 'Users' tab.
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  // This state is a simple counter. When it changes, it tells the Profile tab
  // that it needs to refetch the list of roles.
  const [roleRefetchKey, setRoleRefetchKey] = useState(0);

  // This function is called from the Users tab after a new role is created.
  const handleRoleCreated = () => {
    alert('Role created successfully! You can now assign it in the Profile tab.');
    // Incrementing the key will trigger the useEffect in UserProfileTab to run again.
    setRoleRefetchKey(prevKey => prevKey + 1);
  };

  // This function is called from the Profile tab after a new user is created.
  const handleUserCreated = () => {
    // Automatically switch to the Users tab to see the new user in the list.
    setActiveTab('users');
  };

  return (
    <div className="user-mgt-page">
      <h1 className="page-main-title">User Management</h1>

      <div className="page-content-wrapper">
        <header className="user-mgt-header">
          <div className="user-mgt-tabs">
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>
        </header>

        <main className="user-mgt-content">
          {activeTab === 'profile' && <UserProfileTab onAdminCreated={handleUserCreated} refetchKey={roleRefetchKey} />}
          {activeTab === 'users' && <UsersListTab onRoleCreated={handleRoleCreated} />}
        </main>
      </div>
    </div>
  );
};

export default UserManagementPage;