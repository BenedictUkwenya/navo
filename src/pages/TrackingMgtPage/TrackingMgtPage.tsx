import React, { useState, useMemo } from 'react';
import './TrackingMgtPage.css';

import { 
  mockTrackingData, 
  Shipment, 
  ShipmentStatus, 
  PICKUP_STATUSES, 
  HOME_DELIVERY_STATUSES 
} from '../../data/mockTrackingData';

// Import icons
import emptyStateIcon from '../../assets/images/trackingicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import chevronDownIcon from '../../assets/images/chevron-down.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const TrackingMgtPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>(mockTrackingData);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // --- ADDED: State for search query, just like in CustomersPage ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- ADDED: Filtering logic based on the search query ---
  const filteredShipments = useMemo(() => {
    if (!searchQuery) {
      return shipments;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return shipments.filter(shipment =>
      shipment.shipmentId.toLowerCase().includes(lowercasedQuery) ||
      shipment.trackingId.toLowerCase().includes(lowercasedQuery) ||
      shipment.status.toLowerCase().includes(lowercasedQuery) ||
      shipment.deliveryType.toLowerCase().includes(lowercasedQuery)
    );
  }, [shipments, searchQuery]);


  const handleStatusChange = (shipmentId: string, newStatus: ShipmentStatus) => {
    setShipments(currentShipments =>
      currentShipments.map(shipment =>
        shipment.id === shipmentId ? { ...shipment, status: newStatus } : shipment
      )
    );
    setOpenDropdownId(null);
  };
  
  const toggleDropdown = (shipmentId: string) => {
    setOpenDropdownId(openDropdownId === shipmentId ? null : shipmentId);
  }

  // ---- RENDER LOGIC ----

  // Check for empty state based on original data, not filtered data
  if (shipments.length === 0) {
    return (
      <div className="tracking-empty-state">
        <img src={emptyStateIcon} alt="No shipments" />
        <h3>No shipments to track yet</h3>
      </div>
    );
  }

  return (
    <div className="tracking-page">
      {/* --- ADDED: Local page header with search bar, copied from CustomersPage --- */}
      <div className="tracking-page-header">
        <h3>Tracking Management</h3>
        <div className="controls">
          <button className="filter-btn">
            <img src={filterIcon} alt="Filter" />
          </button>
          <div className="search-box">
            <img src={searchIcon} alt="Search" />
            <input 
              type="text" 
              placeholder="Search by ID, status, delivery type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tracking-table-container">
        {/* --- IMPORTANT: Map over `filteredShipments`, not `shipments` --- */}
        <table className="tracking-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Tracking ID</th>
              <th>Order date</th>
              <th>Delivery timeline</th>
              <th>Delivery type</th>
              <th>Status update</th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.map(shipment => {
              const statusOptions = shipment.deliveryType === 'Pick up' 
                ? PICKUP_STATUSES 
                : HOME_DELIVERY_STATUSES;

              return (
                <tr key={shipment.id}>
                  <td>{shipment.shipmentId}</td>
                  <td>{shipment.trackingId}</td>
                  <td>{shipment.orderDate}</td>
                  <td>{shipment.deliveryTimeline}</td>
                  <td>{shipment.deliveryType}</td>
                  <td className="status-cell">
                    <div className="status-wrapper" onClick={() => toggleDropdown(shipment.id)}>
                      <span>{shipment.status}</span>
                      <img src={chevronDownIcon} alt="Open" className={openDropdownId === shipment.id ? 'open' : ''}/>
                    </div>
                    {openDropdownId === shipment.id && (
                      <div className="status-dropdown">
                        {statusOptions.map(status => (
                          <div 
                            key={status} 
                            className="dropdown-item"
                            onClick={() => handleStatusChange(shipment.id, status)}
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer">
        {/* Updated to use filtered data length */}
        <span>Showing 1-{Math.min(9, filteredShipments.length)} of {filteredShipments.length}</span>
        <div className="pagination-controls">
          <button><img src={prevIcon} alt="Previous" /></button>
          <button><img src={nextIcon} alt="Next" /></button>
        </div>
      </div>
    </div>
  );
};

export default TrackingMgtPage;