// src/pages/UserManagementPage/UserProfileTab.tsx

import React, { useState, useEffect } from 'react';
import { createAdmin, getRoles } from '../../services/adminService';
import { Role } from '../../types/admin';

interface UserProfileTabProps {
  onAdminCreated: () => void;
  refetchKey: number;
}

  const UserProfileTab: React.FC<UserProfileTabProps> = ({ onAdminCreated, refetchKey }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        // Our getRoles service now returns a direct array of roles
        const rolesArray = await getRoles();
        
        // === THE FIX IS HERE ===
        // We now safely check if the response is an array before setting it.
        if (Array.isArray(rolesArray)) {
          setRoles(rolesArray);
        } else {
          console.error("API response for getRoles was not an array.", rolesArray);
          setRoles([]);
        }
        
      } catch (error) {
        console.error("Failed to fetch roles.", error);
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, [refetchKey]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      alert('Please select a role for the new admin.');
      return;
    }
    setFormLoading(true);
    try {
      await createAdmin(formData);
      alert('Admin user created successfully!');
      onAdminCreated(); // Tell the parent to switch to the Users list tab.
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Failed to create admin.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form className="profile-form-container" onSubmit={handleSubmit}>
      <div className="form-column">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Enter here" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter here" value={formData.email} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="form-column">
        <div className="form-group">
          <label htmlFor="customRole">Role</label>
          <div className="select-wrapper">
            <select
              id="role" name="role" value={formData.role}
              onChange={handleInputChange} required
              disabled={rolesLoading || roles.length === 0}
            >
              <option value="" disabled>
                {rolesLoading ? 'Loading roles...' : (roles.length === 0 ? 'No roles found' : 'Select a role')}
              </option>
              {roles.map(role => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          {roles.length === 0 && !rolesLoading && (
            <small className="form-hint">Go to the 'Users' tab to create a role first.</small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter here" value={formData.password} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={formLoading}>
          {formLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default UserProfileTab;