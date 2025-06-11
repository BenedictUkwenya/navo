// src/pages/UserManagementPage/components/UserForm.tsx
import React, { useState } from 'react';
import { AdminUser } from '../../../data/mockAdminUsers';
import chevronDownIcon from '../../../assets/images/chevron-down.png';

interface UserFormProps {
  user?: Partial<AdminUser>;
  mode: 'edit' | 'profile' | 'create';
  onSave: (data: any) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user = {}, mode, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    jobTitle: user.jobTitle || '',
    role: user.role || '',
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
      <div className="form-group"><label>Role</label><div className="select-wrapper"><select name="role" value={formData.role} onChange={handleInputChange}><option>Data Analyst</option><option>Administrator</option></select><img src={chevronDownIcon} alt="select" className="select-arrow" /></div></div>
      <div className="form-group"><label>Job Title</label><div className="select-wrapper"><select name="jobTitle" value={formData.jobTitle} onChange={handleInputChange}><option>Data Manager</option><option>Support Lead</option></select><img src={chevronDownIcon} alt="select" className="select-arrow" /></div></div>
      {mode !== 'edit' && <div className="form-group"><label>Password</label><input type="password" name="password" placeholder="Enter here" onChange={handleInputChange} /></div>}
      <div className="form-actions"><button type="submit" className="save-btn">{mode === 'edit' ? 'Update' : 'Save'}</button></div>
    </form>
  );
};