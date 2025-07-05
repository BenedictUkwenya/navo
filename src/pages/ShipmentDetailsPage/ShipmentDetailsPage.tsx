// src/pages/ShipmentDetailsPage/ShipmentDetailsPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShipmentById } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import './ShipmentDetailsPage.css';
import { FiChevronLeft } from 'react-icons/fi'; // An icon for the back button

const ShipmentDetailsPage: React.FC = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipmentId) {
      setError("No shipment ID provided.");
      setLoading(false);
      return;
    }

    const fetchShipmentDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getShipmentById(shipmentId);
        setShipment(data);
      } catch (err) {
        setError("Failed to fetch shipment details. The shipment may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentDetails();
  }, [shipmentId]);

  if (loading) {
    return <div className="page-loading">Loading Shipment Details...</div>;
  }

  if (error || !shipment) {
    return <div className="page-error">{error || 'Shipment not found.'}</div>;
  }

  return (
    <div className="shipment-details-page">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft />
          Customer Shipments / {shipment.user?.firstName || 'N/A'} {shipment.user?.lastName || ''}
        </button>
        <button className="add-shipment-btn">+ Add Shipment</button>
      </header>

      <div className="details-content-wrapper">
        <div className="customer-info-header">
          <h2>{shipment.user?.firstName} {shipment.user?.lastName}</h2>
          <span className={`status-pill status-${shipment.shipmentStatus.toLowerCase()}`}>{shipment.shipmentStatus}</span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Customer ID</span>
            <p className="detail-value">{shipment.user?.id || 'N/A'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Shipment ID</span>
            <p className="detail-value">{shipment.id}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Goods Type</span>
            <p className="detail-value">{shipment.goodsType || 'General goods'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Delivery Timeline</span>
            <p className="detail-value">{shipment.deliveryDays ? `${shipment.deliveryDays} Days` : '4 Weeks'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <p className="detail-value">{shipment.toCountry || 'Nigeria'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Service type</span>
            <p className="detail-value">{shipment.shipmentType || 'Send'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Weight</span>
            <p className="detail-value">{shipment.weight ? `${shipment.weight}KG` : 'N/A'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Amount</span>
            <p className="detail-value">{shipment.amount ? `₦${Number(shipment.amount).toLocaleString()}` : 'N/A'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Track ID</span>
            <p className="detail-value">{shipment.trackingId || 'N/A'}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <p className="detail-value">{shipment.shipmentStatus || 'Packed'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsPage;