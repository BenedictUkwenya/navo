// src/pages/ShipmentPage/ShipmentPage.tsx

import React, { useState } from 'react';
import './ShipmentPage.css';
import { mockCurrentShipmentValues } from '../../data/mockShipmentSettings';
import { mockCustomerShipments, CustomerShipment } from '../../data/mockCustomerShipments';

// --- ICONS ---
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import viewIcon from '../../assets/images/loginpageye.png';
import backArrowIcon from '../../assets/images/previcon.png';
import avatar from '../../assets/images/profilepic.png';
import emptyIcon from '../../assets/images/shipment-icon.png';

type ShipmentTab = 'shipment-pricing' | 'customer-shipments';

const ShipmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShipmentTab>('customer-shipments');
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [pricingSettings, setPricingSettings] = useState(mockCurrentShipmentValues);
  
  const [selectedShipment, setSelectedShipment] = useState<CustomerShipment | null>(null);

  const handleSettingChange = (field: keyof typeof pricingSettings, value: string) => {
    setPricingSettings(prev => ({ ...prev, [field]: value }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'shipment-pricing':
        return isEditingPricing ? (
            <EditSettingsForm settings={pricingSettings} onSettingChange={handleSettingChange} onCancel={() => setIsEditingPricing(false)} />
        ) : (
            <DisplaySettingsTab settings={pricingSettings} onSetPrice={() => setIsEditingPricing(true)} />
        );
      case 'customer-shipments':
        return selectedShipment ? (
            <CustomerShipmentDetail shipment={selectedShipment} onGoBack={() => setSelectedShipment(null)} />
        ) : (
            <CustomerShipmentsList shipments={mockCustomerShipments} onViewDetails={(shipment) => setSelectedShipment(shipment)} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="shipment-page">
      <div className="shipment-header">
        <div className="shipment-tabs">
          <button className={activeTab === 'shipment-pricing' ? 'active' : ''} onClick={() => setActiveTab('shipment-pricing')}>Shipment Pricing</button>
          <button className={activeTab === 'customer-shipments' ? 'active' : ''} onClick={() => setActiveTab('customer-shipments')}>Customer Shipments</button>
        </div>
        <div className="shipment-controls">
          <button className="filter-btn"><img src={filterIcon} alt="Filter" /></button>
          <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search..." /></div>
        </div>
      </div>
      
      <div className="shipment-content">
        {renderTabContent()}
      </div>
    </div>
  );
};


// --- CUSTOMER SHIPMENTS SUB-COMPONENTS ---

const CustomerShipmentsList: React.FC<{ shipments: CustomerShipment[], onViewDetails: (shipment: CustomerShipment) => void }> = ({ shipments, onViewDetails }) => (
    <div className="customer-shipments-list">
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Shipment ID</th>
                        <th>Track ID</th>
                        <th>Timeline</th>
                        <th>Amount</th>
                        <th>Service Type</th>
                        {/* === THE NEW COLUMN HEADER === */}
                        <th>Delivery Type</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {shipments.map(shipment => (
                        <tr key={shipment.id}>
                            <td>{shipment.userId}</td>
                            <td>{shipment.name}</td>
                            <td>{shipment.shipmentId}</td>
                            <td>{shipment.trackId}</td>
                            <td>{shipment.timeline}</td>
                            <td>{shipment.amount}</td>
                            <td>{shipment.serviceType}</td>
                            {/* === THE NEW COLUMN DATA === */}
                            <td>{shipment.deliveryType}</td>
                            <td>{shipment.status}</td>
                            <td>
                                <button className="action-button" onClick={() => onViewDetails(shipment)}>
                                    <img src={viewIcon} alt="View Details"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <footer className="page-footer">
            <div className="pagination-info">Showing 1-{shipments.length} of {shipments.length}</div>
            <div className="pagination-controls">
                <button disabled>‹</button>
                <button disabled>›</button>
            </div>
        </footer>
    </div>
);

const DetailInfoPair: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="detail-info-pair">
        <label>{label}</label>
        <span>{value}</span>
    </div>
);

const CustomerShipmentDetail: React.FC<{ shipment: CustomerShipment, onGoBack: () => void }> = ({ shipment, onGoBack }) => (
    <div className="customer-shipment-detail">
        <div className="detail-view-header">
            <button className="detail-back-button" onClick={onGoBack}>
                <img src={backArrowIcon} alt="Back"/>
                Customer Shipments
            </button>
            {/* <button className="add-shipment-button">+ Add Shipment</button> */}
        </div>
        <div className="detail-profile-header">
            <img src={avatar} alt={shipment.name} className="profile-avatar"/>
            <h1>{shipment.name}</h1>
        </div>
        <div className="detail-info-grid">
            <DetailInfoPair label="Customer ID" value={shipment.userId} />
            <DetailInfoPair label="Shipment Type" value={shipment.shipmentId} />
            <DetailInfoPair label="Shipment ID" value={shipment.shipmentId} />
            <DetailInfoPair label="Goods Type" value={shipment.goodsType} />
            <DetailInfoPair label="Delivery timeline" value={shipment.timeline} />
            <DetailInfoPair label="Location" value={shipment.location} />
            <DetailInfoPair label="Service type" value={shipment.serviceType} />
            <DetailInfoPair label="Delivery Type" value={shipment.deliveryType} />
            <DetailInfoPair label="Status" value={shipment.status} />
            <DetailInfoPair label="Weight" value={shipment.weight} />
            <DetailInfoPair label="Amount" value={shipment.amount} />
            <DetailInfoPair label="Track ID" value={shipment.trackId} />
        </div>
    </div>
);


// --- SHIPMENT PRICING SUB-COMPONENTS (Unchanged) ---
const SettingDisplayItem: React.FC<{ title: string; value: string; onSetPrice?: () => void; }> = ({ title, value, onSetPrice }) => ( <div className="settings-column"> <h4>{title}</h4> <div className="options-list"> {title === 'Pricing' ? null : <div className="setting-item">{value}</div>} </div> {title === 'Pricing' ? ( <button className="set-button" onClick={onSetPrice}>Set</button> ) : ( <button className="add-button">+ Add</button> )} </div> );
const DisplaySettingsTab: React.FC<{ settings: typeof mockCurrentShipmentValues; onSetPrice: () => void; }> = ({ settings, onSetPrice }) => ( <div className="settings-container-card"> <div className="settings-grid"> <SettingDisplayItem title="Category" value={settings.category} /> <SettingDisplayItem title="Good Type" value={settings.goodType} /> <SettingDisplayItem title="Weight" value={settings.weight} /> <SettingDisplayItem title="Price" value={`£${settings.price}`} /> <SettingDisplayItem title="Pick up from" value={settings.pickup} /> <SettingDisplayItem title="Deliver to" value={settings.delivery} /> <SettingDisplayItem title="Delivery Type" value={settings.deliveryType} /> <SettingDisplayItem title="Delivery Date" value={settings.deliveryDate} /> <SettingDisplayItem title="Packaging Price" value={`£${settings.packagingPrice}`} /> <SettingDisplayItem title="Clearance Fee" value={`£${settings.clearanceFee}`} /> <SettingDisplayItem title="Pricing" value="" onSetPrice={onSetPrice} /> </div> </div> );
const EditSettingsForm: React.FC<{ settings: any; onSettingChange: Function; onCancel: () => void; }> = ({ settings, onSettingChange, onCancel }) => ( <div className="edit-form-container-card"> <div className="edit-form-grid"> <div className="form-column"> <div className="form-group"><div className="form-group-header"><h4>Category</h4><button className="edit-button" onClick={onCancel}>Edit</button></div><div className="input-container"><input type="text" value={settings.category} onChange={(e) => onSettingChange('category', e.target.value)} /></div></div> <div className="form-group"><div className="form-group-header"><h4>Good type</h4><button className="edit-button" onClick={onCancel}>Edit</button></div><div className="input-container"><input type="text" value={settings.goodType} onChange={(e) => onSettingChange('goodType', e.target.value)} /></div></div> <div className="form-group-row"> <div className="form-group"><div className="form-group-header"><h4>Pick up from</h4></div><div className="input-container"><input type="text" value={settings.pickup} onChange={(e) => onSettingChange('pickup', e.target.value)} /></div></div> <div className="form-group"><div className="form-group-header"><h4>Delivery to</h4></div><div className="input-container"><input type="text" value={settings.delivery} onChange={(e) => onSettingChange('delivery', e.target.value)} /></div></div> </div> <div className="form-group"><div className="form-group-header"><h4>Packaging Price (£)</h4></div><div className="input-container"><input type="number" value={settings.packagingPrice} onChange={(e) => onSettingChange('packagingPrice', e.target.value)} /></div></div> </div> <div className="form-column"> <div className="form-group"><div className="form-group-header"><h4>Weight</h4><button className="edit-button" onClick={onCancel}>Edit</button></div><div className="input-container"><input type="text" value={settings.weight} onChange={(e) => onSettingChange('weight', e.target.value)} /></div></div> <div className="form-group"><div className="form-group-header"><h4>Price (£)</h4><button className="edit-button" onClick={onCancel}>Edit</button></div><div className="input-container"><input type="number" value={settings.price} onChange={(e) => onSettingChange('price', e.target.value)} /></div></div> <div className="form-group"><div className="form-group-header"><h4>Delivery Date</h4></div><div className="input-container"><input type="date" value={settings.deliveryDate} onChange={(e) => onSettingChange('deliveryDate', e.target.value)} /></div></div> <div className="form-group"><div className="form-group-header"><h4>Clearance Fee (£)</h4></div><div className="input-container"><input type="number" value={settings.clearanceFee} onChange={(e) => onSettingChange('clearanceFee', e.target.value)} /></div></div> <div className="form-group"><div className="form-group-header"><h4>Delivery Type</h4></div><div className="radio-group"><label className="radio-label"><input type="radio" name="deliveryType" value="Pick up from hub" checked={settings.deliveryType === 'Pick up from hub'} onChange={(e) => onSettingChange('deliveryType', e.target.value)} /><span className="custom-radio"></span> Pick up from hub</label><label className="radio-label"><input type="radio" name="deliveryType" value="Home delivery" checked={settings.deliveryType === 'Home delivery'} onChange={(e) => onSettingChange('deliveryType', e.target.value)} /><span className="custom-radio"></span> Home delivery</label></div></div> </div> </div> </div> );

const EmptySettingsTab: React.FC = () => (
    <div className="empty-state-container"><div className="empty-state-icon-bg"><img src={emptyIcon} alt="No settings" /></div><h3>No Shipment settings created yet</h3></div>
);

export default ShipmentPage;