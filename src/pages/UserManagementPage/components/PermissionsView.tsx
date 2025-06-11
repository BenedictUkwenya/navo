// src/pages/UserManagementPage/components/PermissionsView.tsx
import React from 'react';
import { AdminUser } from '../../../data/mockAdminUsers';
import { permissionGroups } from '../../../data/mockPermissions';

// --- IMPORTANT ---
// You will need to add these icons to your assets folder.
// I'm using logical names; replace them with your actual filenames.
import onboardingIcon from '../../../assets/images/onboarding-icon.svg'; // Placeholder
import shipmentsIcon from '../../../assets/images/shipment-icon.png';
import transactionsIcon from '../../../assets/images/transactionicon.png';
import adminIcon from '../../../assets/images/settings.png';
import supportIcon from '../../../assets/images/support.png';
import contentIcon from '../../../assets/images/content-mgt-icon.svg'; // Placeholder
import educationIcon from '../../../assets/images/education-icon.svg'; // Placeholder
import alertsIcon from '../../../assets/images/alerts-icon.svg'; // Placeholder

interface PermissionsViewProps {
  user: AdminUser;
  onBack: () => void;
}

// Helper to map group titles to icons
const getIconForGroup = (title: string) => {
  switch (title) {
    case 'Onboarding': return onboardingIcon;
    case 'Shipments': return shipmentsIcon;
    case 'Transactions': return transactionsIcon;
    case 'System Administration': return adminIcon;
    case 'Support and Communication': return supportIcon;
    case 'Content Management': return contentIcon;
    case 'Educational Resources': return educationIcon;
    case 'Alerts and Notifications': return alertsIcon;
    default: return contentIcon; // A default icon
  }
};

export const PermissionsView: React.FC<PermissionsViewProps> = ({ user, onBack }) => {
  // A real implementation would manage the checked state
  const handleSave = () => {
    alert(`Permissions saved for ${user.name}`);
    onBack();
  };

  return (
    <div className="permissions-view-container">
      {/* The main header is now handled by the parent component */}
      <div className="permissions-grid">
        {permissionGroups.map(group => (
          <div key={group.title} className="permission-group">
            <h4 className="permission-group-title">
              <img src={getIconForGroup(group.title)} alt={`${group.title} icon`} />
              {group.title}
            </h4>
            <div className="permissions-list">
              {group.permissions.map(permission => (
                <label key={permission} className="permission-item">
                  <input type="checkbox" />
                  <span>{permission}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <footer className="permissions-footer">
        <button className="save-btn" onClick={handleSave}>Save Permissions</button>
      </footer>
    </div>
  );
};