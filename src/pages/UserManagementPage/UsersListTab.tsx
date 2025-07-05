// src/pages/UserManagementPage/UsersListTab.tsx

import React, { useState, useEffect } from 'react';
// We now need getRoles, not getAdmins.
import { getRoles, createRole } from '../../services/adminService'; 
import { Role } from '../../types/admin'; // Use the Role type
import { FiTrash2 } from 'react-icons/fi'; // An icon for a delete action

interface UsersListTabProps {
  onRoleCreated: () => void;
}

const UsersListTab: React.FC<UsersListTabProps> = ({ onRoleCreated }) => {
  // --- STATE CHANGE: We are now managing a list of Roles, not Users ---
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newRoleName, setNewRoleName] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  // --- LOGIC CHANGE: This now fetches roles, not admins ---
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const rolesArray = await getRoles(); // Call the correct service
        if (Array.isArray(rolesArray)) {
          setRoles(rolesArray);
        } else {
          setError("The API response for roles was not in the expected format.");
          setRoles([]);
        }
      } catch (err) { 
        setError('Failed to fetch roles.'); // Update the error message
        console.error(err);
      } finally { 
        setLoading(false); 
      }
    };
    fetchRoles();
    // This effect should run when the parent tells it a role was created,
    // so we can also add a dependency here if needed, but for now this is fine.
  }, [onRoleCreated]); // Re-fetch when a role is created to refresh the list

  // This function remains the same and is correct
  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) { return; }
    setIsCreatingRole(true);
    try {
      await createRole({ name: newRoleName.trim().toUpperCase() });
      setNewRoleName('');
      onRoleCreated(); // This correctly notifies the parent to refresh the other tab
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to create role.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    alert(`Delete action for role "${roleName}" (ID: ${roleId}). API functionality to be added.`);
  };

  return (
    <div className="users-list-container">
      <div className="role-creation-section">
        <h4 className="section-title">Create a New Role</h4>
        <form className="role-creation-form" onSubmit={handleCreateRoleSubmit}>
          <input
            type="text" placeholder="Enter role name (e.g. FINANCIAL_ANALYST)"
            value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)}
          />
          <button type="submit" disabled={isCreatingRole}>
            {isCreatingRole ? 'Creating...' : 'Create Role'}
          </button>
        </form>
      </div>

      <div className="users-list-section">
        <header className="list-header">
          <h4 className="section-title">All Available Roles</h4>
          {/* We can remove the search bar for now as it was for users */}
        </header>
        <div className="table-container">
          {loading && <div className="page-loading">Loading roles...</div>}
          {error && <div className="page-error">{error}</div>}
          {!loading && !error && (
            // --- UI CHANGE: The table now displays role information ---
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                    <tr><td colSpan={3} className="no-data-message">No roles found. Create one above to get started.</td></tr>
                ) : (
                  roles.map(role => (
                    <tr key={role.id}>
                      <td>{role.name}</td>
                      <td>{role.description || 'No description'}</td>
                      <td className="actions-cell">
                        <button className="delete-btn" onClick={() => handleDeleteRole(role.id, role.name)}>
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersListTab;