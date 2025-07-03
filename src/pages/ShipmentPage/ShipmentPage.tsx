import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShipmentPage.css';

// API Services and Types
import { getShipments } from '../../services/shipmentService';
import { createShipmentRate } from '../../services/shipmentPricingService';
import { Shipment } from '../../types/shipment';

// Icon Imports
import { IoEyeOutline, IoSearchOutline } from 'react-icons/io5';
import { TfiFilter } from 'react-icons/tfi';
import { FaChevronDown } from 'react-icons/fa';

// Component Imports
import ShipmentPricingModal from '../../compoonents/ShipmentPricingModal/ShipmentPricingModal';
import filtericon from '../../assets/images/filterIcon.png'
type ShipmentTab = 'shipment-pricing' | 'customer-shipments';
type PricingOptions = {
  category: string; goodType: string; shipmentType: string; weight: string;
  deliveryType: string; pickup: string; delivery: string;
};

// ====================================================================================
// --- MAIN PAGE COMPONENT ---
// ====================================================================================
const ShipmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShipmentTab>('shipment-pricing');
  
  return (
    <div className="shipment-page">
      <div className="page-content-wrapper">
        <header className="content-header">
          <div className="shipment-tabs">
            <button className={activeTab === 'shipment-pricing' ? 'active' : ''} onClick={() => setActiveTab('shipment-pricing')}>Shipment Pricing</button>
            <button className={activeTab === 'customer-shipments' ? 'active' : ''} onClick={() => setActiveTab('customer-shipments')}>Customer Shipments</button>
          </div>
          <div className="page-controls">
              <button className="filter-btn small"><img src={filtericon}/></button>
              <div className="input-with-icon search-bar"><IoSearchOutline /><input type="text" placeholder="Search..." /></div>
          </div>
        </header>
        <div className="shipment-content">
          {activeTab === 'shipment-pricing' && <ShipmentPricingTab />}
          {activeTab === 'customer-shipments' && <CustomerShipmentsList />}
        </div>
      </div>
    </div>
  );
};


// ====================================================================================
// --- SUB-COMPONENT for Shipment Pricing Tab ---
// ====================================================================================
// Find the ShipmentPricingTab component in your file and replace it with this.
// The rest of the file (main component, other sub-components) can remain the same.

// --- SUB-COMPONENT FOR SHIPMENT PRICING TAB ---
const ShipmentPricingTab: React.FC = () => {
    const [view, setView] = useState<'create' | 'edit'>('create');
    
    // This will hold the fully created rule object returned from the API
    const [activeRule, setActiveRule] = useState<any>(null);
  
    // This state holds the user's selections for creating a NEW rule
    const [newRuleSelections, setNewRuleSelections] = useState({
      category: '', goodType: '', shipmentType: '', weight: '',
      deliveryType: '', pickup: '', delivery: '',
    });
  
    const settingsData = {
      category: ['Individual', 'Business'],
      goodType: ['General goods', 'Sensitive goods', 'Travelling extra luggage'],
      shipmentType: ['Air', 'Sea'],
      weight: ['0-2 kg', '3-5kg', '5-10kg', '11-20kg'],
      deliveryType: ['Pick up from hub', 'Home delivery'],
      pickup: ['United Kingdom', 'Nigeria'],
      delivery: ['Nigeria', 'United Kingdom'],
    };
  
    const handleSelectOption = (key: keyof typeof newRuleSelections, value: string) => {
      setNewRuleSelections(prev => ({ ...prev, [key]: value }));
    };
  
    // === THIS IS THE MAIN FIX ===
    const handleCreateAndSet = async () => {
      // Check if all options are selected
      const allOptionsSelected = Object.values(newRuleSelections).every(option => option !== '');
      if (!allOptionsSelected) {
        alert("Please select one option from each of the first 7 columns.");
        return;
      }
      
      // In a real app, you would open a modal here to get price, fee, days
      // For now, we'll use placeholder values.
      const pricingDetails = {
        pricePerKg: 15, // Placeholder
        clearanceFee: 50, // Placeholder
        deliveryDays: 7,  // Placeholder
      };
  
      // Construct the full payload for the API
      const payload = {
          fromCountry: newRuleSelections.pickup === 'United Kingdom' ? 'UK' : 'NG',
          toCountry: newRuleSelections.delivery === 'Nigeria' ? 'NG' : 'UK',
          currency: 'GBP', // Assuming
          ...pricingDetails
      };
  
      try {
          console.log("Creating rate with payload:", payload);
          const response = await createShipmentRate(payload);
          
          // IMPORTANT: The API returns the newly created rule. Save it to state.
          setActiveRule(response.data);
          
          // Now, switch to the edit view.
          setView('edit');
          
      } catch (error) {
          alert("Failed to create new pricing rule.");
          console.error(error);
      }
    };
  
    const handleSave = async () => {
      if (!activeRule) return;
      alert(`Updating rate for ID: ${activeRule.id}`);
      // Here you would call the updateShipmentRate service
      setView('create'); // Go back to the create view after saving
      setActiveRule(null);
      setNewRuleSelections({ category: '', goodType: '', shipmentType: '', weight: '',
      deliveryType: '', pickup: '', delivery: '' });
    };
  
  
    if (view === 'edit' && activeRule) {
      // This is the "Edit" view. It now displays data from the `activeRule` state.
      return (
        <div className="edit-settings-view">
        <div className="form-column">
            <div className="form-group">
                <div className="form-group-header">
                    <h4>Category</h4>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="input-container">
                    <input readOnly value={newRuleSelections.category} />
                    <FaChevronDown/>
                </div>
            </div>
            <div className="form-group">
                <div className="form-group-header">
                    <h4>Good type</h4>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="input-container">
                    <input readOnly value={newRuleSelections.goodType} />
                    <FaChevronDown/>
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <div className="form-group-header"><h4>Pick up from</h4></div>
                    <div className="input-container">
                        <input readOnly value={newRuleSelections.pickup} />
                        <FaChevronDown/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group-header"><h4>Delivery to</h4></div>
                    <div className="input-container">
                        <input readOnly value={newRuleSelections.delivery} />
                        <FaChevronDown/>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <div className="form-group-header"><h4>Price Per Kg</h4></div>
                <div className="input-container">
                    <input value={`₦${activeRule.pricePerKg}`} readOnly />
                </div>
            </div>
        </div>
    
        <div className="form-column">
            <div className="form-group">
                <div className="form-group-header">
                    <h4>Shipment Type</h4>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="input-container">
                    <input readOnly value={newRuleSelections.shipmentType} />
                    <FaChevronDown/>
                </div>
            </div>
            <div className="form-group">
                <div className="form-group-header">
                    <h4>Weight</h4>
                    <button className="edit-btn">Edit</button>
                </div>
                <div className="input-container">
                    <input readOnly value={newRuleSelections.weight} />
                    <FaChevronDown/>
                </div>
            </div>
            <div className="form-group">
                <div className="form-group-header"><h4>Delivery Type</h4></div>
                <div className="radio-group">
                    <label className="radio-label">
                        <input type="radio" name="deliveryType" checked={newRuleSelections.deliveryType === 'Pick up from hub'} readOnly />
                        <span className="custom-radio"></span> Pick up from hub
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="deliveryType" checked={newRuleSelections.deliveryType === 'Home delivery'} readOnly />
                        <span className="custom-radio"></span> Home delivery
                    </label>
                </div>
            </div>
            <div className="form-group">
                <div className="form-group-header"><h4>Clearance Fee</h4></div>
                <div className="input-container">
                    <input value={`₦${activeRule.clearanceFee}`} readOnly />
                </div>
            </div>
            <div className="form-group">
                <div className="form-group-header"><h4>Delivery Days</h4></div>
                <div className="input-container">
                    <input value={`${activeRule.deliveryDays} days`} readOnly />
                </div>
            </div>
        </div>
    
        <div className="form-actions-full-width">
            <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
    </div>
      );
    }
  
    // This is the default "Create" view
    const isSetButtonEnabled = Object.values(newRuleSelections).every(option => option !== '');
    
    return (
      <div className="display-settings-grid">
        {Object.entries(settingsData).map(([key, options]) => (
          <div className="settings-display-column" key={key}>
            <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
            <div className="tags-container">
              {options.map(option => (
                <button key={option} className={`tag ${newRuleSelections[key as keyof typeof newRuleSelections] === option ? 'selected' : ''}`} onClick={() => handleSelectOption(key as keyof typeof newRuleSelections, option)}>
                  {option}
                </button>
              ))}
              <button className="add-tag-btn">+ Add</button>
            </div>
          </div>
        ))}
        <div className="settings-display-column">
          <h4>Pricing</h4>
          <button className="set-price-btn" onClick={handleCreateAndSet} disabled={!isSetButtonEnabled}>Set</button>
        </div>
      </div>
    );
  };


// ====================================================================================
// --- SUB-COMPONENT for Customer Shipments Tab (Unchanged) ---
// ====================================================================================
const CustomerShipmentsList: React.FC = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShipments = async () => {
            setLoading(true);
            try {
                const response = await getShipments();
                setShipments(response.data.shipments || []);
            } catch (err) { console.error("Failed to load shipments.", err); }
            finally { setLoading(false); }
        };
        fetchShipments();
    }, []);

    if (loading) return <div className="page-loading">Loading Shipments...</div>;

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
                                <td className="action-cell"><button className="action-button" onClick={() => navigate(`/shipments/${shipment.id}`)}><IoEyeOutline /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShipmentPage;