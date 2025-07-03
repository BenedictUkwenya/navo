import React, { useState, useEffect, useMemo } from 'react';
import './UserManagementPage.css';

// API Services and Types
import { createAdmin, getAdmins } from '../../services/adminService'; // Assuming getAdmins exists
import { AdminUser as AdminUserType } from '../../types/admin'; // Use our new Admin type

// Component Imports
import { UserForm } from './components/UserForm';
import { PermissionsView } from './components/PermissionsView'; // Kept for future use
import UserViewModal from '../../compoonents/UserViewModa/UserViewModa';

// Icon Imports
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

// Define a simpler view state
type ViewState = 'list' | 'create' | 'edit' | 'permissions';
interface PageState {
  view: ViewState;
  selectedUserId?: string;
}

const ITEMS_PER_PAGE = 7;

const UserManagementPage: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>({ view: 'list' });
  const [adminUsers, setAdminUsers] = useState<AdminUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: We are assuming a getAdmins() function exists and works.
      // We will fall back to mock data if it fails for now.
      const response = await getAdmins();
      setAdminUsers(response.data.users || []);
    } catch (err) {
      console.error("Failed to fetch admins, using mock data as fallback.", err);
      // In a real scenario, you'd show an error. For now, we use mock data.
      // setAdminUsers(mockAdminUsers); // You can uncomment this if getAdmins fails
      setError("Could not load admin users from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageState.view === 'list') {
      fetchAdmins();
    }
  }, [pageState.view]);


  const handleCreateNewAdmin = async (formData: any) => {
    try {
      const apiData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        customRole: formData.role,
      };
      await createAdmin(apiData);
      alert('Admin user created successfully!');
      setPageState({ view: 'list' }); // Go back to the list view, which will trigger a refetch
    } catch (error) {
      alert('Failed to create admin user. Please check the console for errors.');
      console.error(error);
    }
  };

  const renderContent = () => {
    switch (pageState.view) {
      case 'create':
        return (
          <>
            <header className="user-mgt-header">
              <div className="user-mgt-tabs">
                {/* A simple header for the create form */}
                <button className="tab-btn active">Create New Admin User</button>
              </div>
            </header>
            <UserForm mode="create" onSave={handleCreateNewAdmin} />
          </>
        );
      
      // We can add 'edit' and 'permissions' cases back here later
      // case 'edit': return ...
      // case 'permissions': return ...

      case 'list':
      default:
        return (
          <>
            <header className="user-mgt-header">
              <div className="user-mgt-tabs">
                <button className="tab-btn active">Users</button>
              </div>
              <div className="header-actions">
                <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search" /></div>
                <button className="add-new-btn" onClick={() => setPageState({ view: 'create' })}>+ Add New</button>
              </div>
            </header>
            <main className="user-mgt-content">
              {loading && <div>Loading users...</div>}
              {error && <div className="page-error">{error}</div>}
              {!loading && !error && (
                <UsersTab 
                  users={adminUsers}
                  onEdit={(user) => setPageState({ view: 'edit', selectedUserId: user.id })}
                  onAddPermission={(user) => setPageState({ view: 'permissions', selectedUserId: user.id })}
                />
              )}
            </main>
          </>
        );
    }
  };

  return <div className="user-mgt-page">{renderContent()}</div>;
};


// --- UsersTab Component ---
const UsersTab: React.FC<{
  users: AdminUserType[];
  onEdit: (user: AdminUserType) => void;
  onAddPermission: (user: AdminUserType) => void;
}> = ({ users, onEdit, onAddPermission }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const currentUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  return (
    <div className="users-tab-container">
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {/* Use the role name from the nested customRole object */}
                <td>{user.customRole.name}</td>
                <td><span className={`status-badge status-${user.status?.toLowerCase() || 'active'}`}>{user.status || 'Active'}</span></td>
                <td className="actions-cell">
                  <div className="actions-container">
                    <button className="actions-btn" onClick={() => setOpenActionMenuId(openActionMenuId === user.id ? null : user.id)}>Actions</button>
                    {openActionMenuId === user.id && (
                      <div className="actions-dropdown">
                        <button>View</button>
                        <button>Edit</button>
                        <button>Add Permission</button>
                        <button className="deactivate">Deactivate</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="page-footer">
        <div className="pagination-info">Showing {currentUsers.length} of {users.length}</div>
        <div className="pagination-controls">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </div>
  );
};

export default UserManagementPage;