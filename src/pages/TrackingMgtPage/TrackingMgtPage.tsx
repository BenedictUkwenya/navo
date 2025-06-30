import React, { useState, useEffect } from 'react';
import './TrackingMgtPage.css';
import { getTrackings, deleteTrackingById } from '../../services/trackingService';
import { TrackingItem } from '../../types/tracking';

// --- ICON IMPORTS ---
import emptyStateIcon from '../../assets/images/trackingicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import deleteIcon from '../../assets/images/comments.png'; // Using your 'comments' icon as a placeholder for delete

const TrackingMgtPage: React.FC = () => {
  const [trackings, setTrackings] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTrackings();
        setTrackings(data);
      } catch (err) {
        setError('Failed to load tracking data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrackings();
  }, []);

  const handleDelete = async (id: string) => {
    // Confirm with the user before deleting
    if (window.confirm('Are you sure you want to delete this tracking entry?')) {
      try {
        await deleteTrackingById(id);
        // On success, update the UI by filtering out the deleted item
        setTrackings(currentTrackings => currentTrackings.filter(t => t.id !== id));
        alert('Tracking entry deleted successfully.');
      } catch (err) {
        alert('Failed to delete the tracking entry.');
      }
    }
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
          <div className="page-search-bar">
            <img src={searchIcon} alt="Search" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </header>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Customer Name</th>
              <th>Shipment ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trackings.map(tracking => (
              <tr key={tracking.id}>
                <td data-label="Tracking ID">{tracking.id}</td>
                <td data-label="Customer Name">{`${tracking.user.first_name || ''} ${tracking.user.last_name || ''}`.trim() || 'N/A'}</td>
                {/* The API returns an empty shipment object, so we show 'N/A' for now. */}
                <td data-label="Shipment ID">{tracking.shipment?.id || 'N/A'}</td>
                <td data-label="Action">
                  <button className="action-button" onClick={() => handleDelete(tracking.id)}>
                    <img src={deleteIcon} alt="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination is removed as the API does not support it for this endpoint */}
    </div>
  );
};

export default TrackingMgtPage;