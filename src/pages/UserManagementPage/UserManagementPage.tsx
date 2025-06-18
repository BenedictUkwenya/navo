// src/pages/UserManagementPage/UserManagementPage.tsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import './UserManagementPage.css';

// Data and Type Imports
import { mockAdminUsers, AdminUser } from '../../data/mockAdminUsers';
import { permissionGroups } from '../../data/mockPermissions';

// Component Imports
import UserViewModal from '../../compoonents/UserViewModa/UserViewModa';

// Icon Imports
import eyeIcon from '../../assets/images/eyeicon.png';
import chevronDownIcon from '../../assets/images/chevron-down.png';
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';
 
import shipmentsIcon from '../../assets/images/shipment-icon.png';
import transactionsIcon from '../../assets/images/transactionicon.png';
import adminIcon from '../../assets/images/settings.png';
import supportIcon from '../../assets/images/support.png';
 
type ActiveTab = 'Profile' | 'Users' | 'Roles' | 'Permissions';
type ViewState = { view: 'tabs'; tab: ActiveTab } | { view: 'edit'; userId: string } | { view: 'permissions'; userId: string };

const ITEMS_PER_PAGE = 7;

 
const UserForm: React.FC<{
  user?: Partial<AdminUser>;
  mode: 'edit' | 'profile';
  onSave: (data: any) => void;
}> = ({ user = {}, mode, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || 'Oladapo Koiki',
    email: user.email || 'khalid@buylogding.com',
    phone: user.phone || '+234 802 938 6768',
    jobTitle: user.jobTitle || 'Data Manager',
    role: user.role || 'Data Analysts',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="profile-form-container" onSubmit={handleSubmit}>
      <div className="form-group"><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} /></div>
      <div className="form-group"><label>Phone number</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} /></div>
      <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div>
      <div className="form-group"><label>Role</label><div className="select-wrapper"><select name="role" value={formData.role} onChange={handleInputChange}><option>Data Analysts</option><option>Administrator</option></select><img src={chevronDownIcon} alt="select" className="select-arrow" /></div></div>
      <div className="form-group"><label>Job Title</label><div className="select-wrapper"><select name="jobTitle" value={formData.jobTitle} onChange={handleInputChange}><option>Data Manager</option><option>Support Lead</option></select><img src={chevronDownIcon} alt="select" className="select-arrow" /></div></div>
      {mode === 'profile' && <div className="form-group"><label>Password</label><div className="password-wrapper"><input type="password" name="password" placeholder="Enter new password" onChange={handleInputChange} /><img src={eyeIcon} alt="show password" className="password-eye-icon" /></div></div>}
      <div className="form-actions"><button type="submit" className="save-btn">{mode === 'edit' ? 'Update' : 'Save'}</button></div>
    </form>
  );
};


 
const PermissionsView: React.FC<{
  user: AdminUser;
  onBack: () => void;
}> = ({ user, onBack }) => {
  const getIconForGroup = (title: string) => {
    if (title.includes('Shipment')) return shipmentsIcon;
    if (title.includes('Transaction')) return transactionsIcon;
    if (title.includes('Admin')) return adminIcon;
    if (title.includes('Support')) return supportIcon;
    return adminIcon;  
  };

  return (
    <div className="permissions-view-container">
      <div className="permissions-grid">
        {permissionGroups.map(group => (
          <div key={group.title} className="permission-group">
            <h4 className="permission-group-title"><img src={getIconForGroup(group.title)} alt="" />{group.title}</h4>
            <div className="permissions-list">
              {group.permissions.map(permission => (
                <label key={permission} className="permission-item"><input type="checkbox" /><span>{permission}</span></label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <footer className="permissions-footer"><button className="save-btn" onClick={onBack}>Save Permissions</button></footer>
    </div>
  );
};


 
const UsersTab: React.FC<{
  onEdit: (user: AdminUser) => void;
  onAddPermission: (user: AdminUser) => void;
}> = ({ onEdit, onAddPermission }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return mockAdminUsers; const lowercasedTerm = searchTerm.toLowerCase();
    return mockAdminUsers.filter(user => user.name.toLowerCase().includes(lowercasedTerm) || user.email.toLowerCase().includes(lowercasedTerm));
  }, [searchTerm]);

  const currentUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleViewClick = (user: AdminUser) => { setSelectedUserForView(user); setIsViewModalOpen(true); setOpenActionMenuId(null); };

  return (
    <>
      <div className="users-tab-container">
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id}>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Role">{user.role}</td>
                  <td data-label="Status"><span className={`status-badge status-${user.status.toLowerCase()}`}>{user.status}</span></td>
                  <td data-label="Actions" className="actions-cell">
                    <div className="actions-container">
                      <button className="actions-btn" onClick={() => setOpenActionMenuId(openActionMenuId === user.id ? null : user.id)}>Actions</button>
                      {openActionMenuId === user.id && (
                        <div className="actions-dropdown" onMouseLeave={() => setOpenActionMenuId(null)}>
                          <button onClick={() => handleViewClick(user)}>View</button>
                          <button onClick={() => onEdit(user)}>Edit</button>
                          <button onClick={() => onAddPermission(user)}>Add Permission</button>
                          <button className="deactivate" onClick={() => alert(`Deactivating ${user.name}`)}>Deactivate</button>
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
          <div className="pagination-info">Showing {filteredUsers.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}</div>
          <div className="pagination-controls"><button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button><button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button></div>
        </footer>
      </div>
      {selectedUserForView && <UserViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={selectedUserForView} />}
    </>
  );
};


 
const UserManagementPage: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ view: 'tabs', tab: 'Users' });
  const tabs: ActiveTab[] = ['Profile', 'Users', 'Roles', 'Permissions'];

  const handleEditUser = (user: AdminUser) => setViewState({ view: 'edit', userId: user.id });
  const handleAddPermission = (user: AdminUser) => setViewState({ view: 'permissions', userId: user.id });
  const handleBackToTabs = () => setViewState({ view: 'tabs', tab: 'Users' });

  const renderContent = () => {
    switch (viewState.view) {
      case 'edit': {
        const userToEdit = mockAdminUsers.find(u => u.id === viewState.userId);
        return (
          <>
            <header className="user-mgt-header">
              <div className="user-mgt-tabs"><button className="tab-btn active">Edit User</button></div>
            </header>
            <UserForm user={userToEdit} mode="edit" onSave={(data) => { alert(`Updated user: ${data.name}`); handleBackToTabs(); }} />
          </>
        );
      }
      case 'permissions': {
        const userForPerms = mockAdminUsers.find(u => u.id === viewState.userId);
        if (!userForPerms) return <div>User not found. <button onClick={handleBackToTabs}>Go Back</button></div>;
        return (
          <>
            <header className="user-mgt-header permissions-view-header">
              <div className="user-mgt-tabs"><button className="tab-btn active">Permissions</button></div>
            </header>
            <PermissionsView user={userForPerms} onBack={handleBackToTabs} />
          </>
        );
      }
      case 'tabs':
      default:
        return (
          <>
            <header className="user-mgt-header">
              <div className="user-mgt-tabs">
                {tabs.map(tab => (<button key={tab} className={`tab-btn ${viewState.tab === tab ? 'active' : ''}`} onClick={() => setViewState({ view: 'tabs', tab })}>{tab}</button>))}
              </div>
              {viewState.tab === 'Users' && (<div className="header-actions"><div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search" /></div><button className="add-new-btn">+ Add New</button></div>)}
            </header>
            <main className="user-mgt-content">
              {viewState.tab === 'Profile' && <UserForm mode="profile" onSave={(data) => alert(`Profile saved: ${data.name}`)} />}
              {viewState.tab === 'Users' && <UsersTab onEdit={handleEditUser} onAddPermission={handleAddPermission} />}
              {viewState.tab === 'Roles' && <div>Roles Content Coming Soon...</div>}
              {viewState.tab === 'Permissions' && <div>Permissions Summary View Coming Soon...</div>}
            </main>
          </>
        );
    }
  };

  return <div className="user-mgt-page">{renderContent()}</div>;
};

export default UserManagementPage;