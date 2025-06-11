// src/components/UserViewModal/UserViewModal.tsx

import React from 'react';
import './UserViewModa.css';
import { AdminUser } from '../../data/mockAdminUsers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser;
}

const UserViewModal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="uv-modal-overlay" onClick={onClose}>
      <div className="uv-modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="uv-modal-header">
          <h2>{user.name}</h2>
          <button className="uv-modal-close-btn" onClick={onClose}>×</button>
        </header>
        <main className="uv-modal-body">
          <div className="detail-item">
            <span>Email</span>
            <p>{user.email}</p>
          </div>
          <div className="detail-item">
            <span>Phone Number</span>
            <p>{user.phone}</p>
          </div>
          <div className="detail-item">
            <span>Job Title</span>
            <p>{user.jobTitle}</p>
          </div>
          <div className="detail-item">
            <span>Role</span>
            <p>{user.role}</p>
          </div>
        </main>
        <footer className="uv-modal-footer">
          <button className="close-action-btn" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
};

export default UserViewModal;