import React, { useState, useEffect, useRef } from 'react';
import './TrackingMgtPage.css';
import { getTrackings } from '../../services/trackingService';
import { TrackingItem } from '../../types/tracking';

// --- ICON IMPORTS ---
import emptyStateIcon from '../../assets/images/trackingicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import chevronDownIcon from '../../assets/images/dropdownarrow.png';

// Placeholder status options
const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED'];

const TrackingMgtPage: React.FC = () => {
  const [trackings, setTrackings] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTrackings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTrackings();
        setTrackings(response.data.filtered || []);
      } catch (err) {
        setError('Failed to load tracking data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrackings();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = (trackingId: string, newStatus: string) => {
    // Update the status locally for immediate UI feedback
    setTrackings(current =>
      current.map(t => t.id === trackingId ? { ...t, shipment: { ...t.shipment, shipmentStatus: newStatus } } : t)
    );
    setOpenDropdownId(null);
    // In a real app, you would now make a PUT/PATCH API call to save this change
    console.log(`Updated status for ${trackingId} to ${newStatus}`);
  };

  const toggleDropdown = (trackingId: string) => {
    setOpenDropdownId(openDropdownId === trackingId ? null : trackingId);
  };

  if (loading) return <div className="page-loading">Loading tracking data...</div>;
  if (error) return <div className="page-error">{error}</div>;

  if (trackings.length === 0) {
    return (
      <div className="tracking-mgt-page page--empty">
        <img src={emptyStateIcon} alt="No shipments" />
        <h3>No tracking entries found</h3>
      </div>
    );
  }

  return (
    <div className="tracking-mgt-page">
      <header className="page-header">
        <h3>Tracking Management</h3>
        <div className="page-controls">
          <button className="filter-btn"><img src={filterIcon} alt="Filter" /></button>
          <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search..." /></div>
        </div>
      </header>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Tracking ID</th>
              <th>Customer Name</th>
              <th>Delivery Type</th>
              <th>Status Update</th>
            </tr>
          </thead>
          <tbody>
            {trackings.map(tracking => (
              <tr key={tracking.id}>
                <td>{tracking.shipmentId}</td>
                <td>{tracking.trackingId}</td>
                <td>{`${tracking.user.first_name || ''} ${tracking.user.last_name || 'N/A'}`}</td>
                <td>{tracking.shipment.deliveryTypeTo.replace('_', ' ')}</td>
                <td className="status-cell">
                  <div className="status-dropdown-container" ref={openDropdownId === tracking.id ? dropdownRef : null}>
                    <div className="status-wrapper" onClick={() => toggleDropdown(tracking.id)}>
                      <span className={`status-badge status-${tracking.shipment.shipmentStatus.toLowerCase()}`}>{tracking.shipment.shipmentStatus}</span>
                      <img src={chevronDownIcon} alt="Open" className={openDropdownId === tracking.id ? 'open' : ''}/>
                    </div>
                    {openDropdownId === tracking.id && (
                      <div className="status-dropdown">
                        {STATUS_OPTIONS.map(status => (
                          <div key={status} className="dropdown-item" onClick={() => handleStatusChange(tracking.id, status)}>
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackingMgtPage;