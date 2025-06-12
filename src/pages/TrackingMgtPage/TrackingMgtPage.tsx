// src/pages/TrackingMgtPage/TrackingMgtPage.tsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import './TrackingMgtPage.css';

import { 
  mockTrackingData, 
  Shipment, 
  ShipmentStatus, 
  PICKUP_STATUSES, 
  HOME_DELIVERY_STATUSES 
} from '../../data/mockTrackingData';

// --- CORRECTED ICON IMPORTS ---
import emptyStateIcon from '../../assets/images/trackingicon.png';
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import chevronDownIcon from '../../assets/images/dropdownarrow.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

const ITEMS_PER_PAGE = 9;

const TrackingMgtPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>(mockTrackingData);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const filteredShipments = useMemo(() => {
    if (!searchQuery) return shipments;
    const lowercasedQuery = searchQuery.toLowerCase();
    return shipments.filter(shipment =>
      shipment.shipmentId.toLowerCase().includes(lowercasedQuery) ||
      shipment.trackingId.toLowerCase().includes(lowercasedQuery) ||
      shipment.status.toLowerCase().includes(lowercasedQuery) ||
      shipment.deliveryType.toLowerCase().includes(lowercasedQuery)
    );
  }, [shipments, searchQuery]);

  // --- FULL PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredShipments.length / ITEMS_PER_PAGE);
  const currentShipments = filteredShipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  const handleStatusChange = (shipmentId: string, newStatus: ShipmentStatus) => {
    setShipments(current => current.map(shipment =>
      shipment.id === shipmentId ? { ...shipment, status: newStatus } : shipment
    ));
    setOpenDropdownId(null);
  };
  
  const toggleDropdown = (shipmentId: string) => setOpenDropdownId(openDropdownId === shipmentId ? null : shipmentId);

  if (shipments.length === 0) {
    return (
      <div className="tracking-mgt-page page--empty">
        <img src={emptyStateIcon} alt="No shipments" />
        <h3>No shipments to track yet</h3>
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
            <input 
              type="text" 
              placeholder="Search by ID, status..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
      </header>

      <div className="table-container">
        <table className="data-table">
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
            {currentShipments.map(shipment => {
              const statusOptions = shipment.deliveryType === 'Pick up' ? PICKUP_STATUSES : HOME_DELIVERY_STATUSES;
              return (
                <tr key={shipment.id}>
                  <td data-label="Shipment ID">{shipment.shipmentId}</td>
                  <td data-label="Tracking ID">{shipment.trackingId}</td>
                  <td data-label="Order date">{shipment.orderDate}</td>
                  <td data-label="Delivery timeline">{shipment.deliveryTimeline}</td>
                  <td data-label="Delivery type">{shipment.deliveryType}</td>
                  <td data-label="Status update" className="status-cell">
                    <div className="status-dropdown-container" ref={openDropdownId === shipment.id ? dropdownRef : null}>
                      <div className="status-wrapper" onClick={() => toggleDropdown(shipment.id)}>
                        <span>{shipment.status}</span>
                        <img src={chevronDownIcon} alt="Open" className={openDropdownId === shipment.id ? 'open' : ''}/>
                      </div>
                      {openDropdownId === shipment.id && (
                        <div className="status-dropdown">
                          {statusOptions.map(status => (
                            <div key={status} className="dropdown-item" onClick={() => handleStatusChange(shipment.id, status)}>
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="page-footer">
        <div className="pagination-info">
          Showing {filteredShipments.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredShipments.length)} of {filteredShipments.length}
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}><img src={prevIcon} alt="Previous" /></button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </div>
  );
};

export default TrackingMgtPage;