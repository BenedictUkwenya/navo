import React, { useState, useEffect } from 'react';
import './ShipmentPage.css';
import { getShipments, getShipmentById } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';

// --- ICON IMPORTS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import viewIcon from '../../assets/images/eyeicon.png';
import backArrowIcon from '../../assets/images/previcon.png';
import avatar from '../../assets/images/profilepic.png';
import { IconType } from 'react-icons';
import { IoEyeOutline } from 'react-icons/io5';

const IoEyeOutlineIcon = IoEyeOutline as IconType;

type ShipmentTab = 'shipment-pricing' | 'customer-shipments';

const ShipmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShipmentTab>('customer-shipments');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'shipment-pricing':
        return <div className="placeholder-tab">Shipment Pricing content will go here.</div>;
      case 'customer-shipments':
        return selectedShipmentId ? (
            <CustomerShipmentDetail shipmentId={selectedShipmentId} onGoBack={() => setSelectedShipmentId(null)} />
        ) : (
            <CustomerShipmentsList onViewDetails={(shipmentId) => setSelectedShipmentId(shipmentId)} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="shipment-page">
      {/* The main page header, controlled by Layout.tsx */}
      
      <div className="page-content-wrapper">
        <div className="content-header">
            <div className="shipment-tabs">
                <button className={activeTab === 'shipment-pricing' ? 'active' : ''} onClick={() => setActiveTab('shipment-pricing')}>Shipment Pricing</button>
                <button className={activeTab === 'customer-shipments' ? 'active' : ''} onClick={() => setActiveTab('customer-shipments')}>Customer Shipments</button>
            </div>
            {/* === THE CORRECTED JSX STRUCTURE === */}
            <div className="page-controls">
                <button className="filter-btn"><img src={filterIcon} alt="Filter" /></button>
                <div className="page-search-bar">
                    <img src={searchIcon} alt="Search" />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
        </div>
        <div className="shipment-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};


// --- SUB-COMPONENTS ---

const CustomerShipmentsList: React.FC<{ onViewDetails: (shipmentId: string) => void }> = ({ onViewDetails }) => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShipments = async () => {
            setLoading(true);
            try {
                const response = await getShipments();
                setShipments(response.data.shipments || []);
            } catch (err) { setError("Failed to load shipments."); }
            finally { setLoading(false); }
        };
        fetchShipments();
    }, []);

    if (loading) return <div className="page-loading">Loading Shipments...</div>;
    if (error) return <div className="page-error">{error}</div>;

    return (
        <div className="customer-shipments-list">
            <div className="table-container">
                <table className="data-table">
                    <thead><tr><th>Name</th><th>Shipment ID</th><th>Tracking ID</th><th>Status</th><th>Date Created</th><th>Action</th></tr></thead>
                    <tbody>
                        {shipments.map(shipment => (
                            <tr key={shipment.id}>
                                <td>{`${shipment.user?.firstName || ''} ${shipment.user?.lastName || 'N/A'}`}</td>
                                <td>{shipment.id}</td>
                                <td>{shipment.trackingId || 'N/A'}</td>
                                <td><span className={`status-badge status-${shipment.shipmentStatus.toLowerCase()}`}>{shipment.shipmentStatus}</span></td>
                                <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                                <td className="action-cell"><button className="action-button" onClick={() => onViewDetails(shipment.id)}><IoEyeOutlineIcon className="action-icon"/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DetailInfoPair: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="detail-info-pair">
        <label>{label}</label>
        <span>{value}</span>
    </div>
);

const CustomerShipmentDetail: React.FC<{ shipmentId: string, onGoBack: () => void }> = ({ shipmentId, onGoBack }) => {
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShipment = async () => {
            setLoading(true);
            try {
                const response = await getShipmentById(shipmentId);
                setShipment(response.data.shipment);
            } catch (err) {
                setError("Failed to load shipment details.");
            } finally {
                setLoading(false);
            }
        };
        fetchShipment();
    }, [shipmentId]);

    if (loading) return <div className="page-loading">Loading Details...</div>;
    if (error) return <div className="page-error">{error}</div>;
    if (!shipment) return <div className="page-error">Shipment not found.</div>;

    const fullName = `${shipment.user?.firstName || ''} ${shipment.user?.lastName || 'N/A'}`;
    const amount = shipment.totalCost ? `₦${shipment.totalCost.toLocaleString('en-US')}` : 'N/A';
    const shipmentType = shipment.serviceType ? shipment.serviceType.charAt(0).toUpperCase() + shipment.serviceType.slice(1).toLowerCase() : 'N/A';

    return (
        <div className="customer-shipment-detail">
            <div className="detail-view-header">
                <button className="detail-back-button" onClick={onGoBack}>
                    <img src={backArrowIcon} alt="Back"/>
                    <span className="breadcrumb-main">Customer Shipments</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{fullName}</span>
                </button>
                <div className="header-actions">
                    <button className="filter-btn small"><img src={filterIcon} alt="Filter" /></button>
                    <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search..." /></div>
                    <button className="add-shipment-button">+ Add Shipment</button>
                </div>
            </div>

            <div className="detail-profile-header">
                <img src={avatar} alt={fullName} className="profile-avatar"/>
                <h1>{fullName}</h1>
            </div>

            <div className="detail-info-grid">
                {/* Row 1 */}
                <DetailInfoPair label="Customer ID" value={shipment.userId} />
                <DetailInfoPair label="Shipment type" value={shipmentType} />
                <DetailInfoPair label="Shipment ID" value={shipment.id} />
                <DetailInfoPair label="Goods Type" value={shipment.goodsType || 'N/A'} />
                
                {/* Row 2 */}
                <DetailInfoPair label="Delivery timeline" value={shipment.estimatedDelivery ? `${shipment.estimatedDelivery} Weeks` : '4 Weeks'} />
                <DetailInfoPair label="Location" value={`${shipment.locationFrom || '?'} to ${shipment.locationTo || '?'}`} />
                <DetailInfoPair label="Service type" value={shipment.serviceType || 'N/A'} />
                <DetailInfoPair label="Weight" value={shipment.weight ? `${shipment.weight}kg` : 'N/A'} />

                {/* Row 3 */}
                <DetailInfoPair label="Amount" value={amount} />
                <DetailInfoPair label="Track ID" value={shipment.trackingId || 'N/A'} />
                <DetailInfoPair label="Status" value={shipment.shipmentStatus} />
            </div>
        </div>
    );
};
export default ShipmentPage;