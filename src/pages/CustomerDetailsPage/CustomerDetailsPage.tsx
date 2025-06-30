import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './CustomerDetailsPage.css';
import { getCustomerById } from '../../services/customerService';
// Import both Customer and the new CustomerShipment type
import { Customer, CustomerShipment } from '../../types/customer'; 

// Import Icons
import backArrowIcon from '../../assets/images/previcon.png';
import avatar from '../../assets/images/profilepic.png';

type DetailTab = 'personal' | 'wallet' | 'shipments' | 'referral';
type Currency = 'ngn' | 'gbp';

const CustomerDetailsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('shipments'); // Default to shipments to see the change

  useEffect(() => {
    if (!customerId) {
        setError("No Customer ID provided in URL.");
        setLoading(false);
        return;
    };
    
    const fetchCustomerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCustomerById(customerId);
        setCustomer(response.customer);
      } catch (err) {
        setError('Failed to fetch customer details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerDetails();
  }, [customerId]);

  if (loading) return <div className="page-loading">Loading customer details...</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!customer) return <div className="page-error">Customer not found.</div>;

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'N/A';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDetailsTab customer={customer} />;
      case 'wallet':
        return <WalletBalanceTab customer={customer} />;
      case 'shipments':
        // Pass the shipments array to the ShipmentsTab component
        return <ShipmentsTab shipments={customer.shipments || []} />;
      case 'referral':
        return <ReferralTab referral={null} />; // Assuming referral data is not ready
      default:
        return null;
    }
  };

  return (
    <div className="customer-details-page">
      <div className="details-header">
        <div className="breadcrumb">
          <button onClick={() => navigate(-1)} className="back-link-button">
            <img src={backArrowIcon} alt="Back" />
          </button>
          <span className="breadcrumb-text">All customers <span className="separator">/</span> {fullName}</span>
        </div>
      </div>
      <div className="customer-profile-header">
        <img src={customer.profilePicture || avatar} alt={fullName} className="profile-avatar" />
        <h1>{fullName}</h1>
      </div>
      <div className="details-tabs">
        <button className={activeTab === 'personal' ? 'active' : ''} onClick={() => setActiveTab('personal')}>Personal Details</button>
        <button className={activeTab === 'wallet' ? 'active' : ''} onClick={() => setActiveTab('wallet')}>Wallet Balance</button>
        <button className={activeTab === 'shipments' ? 'active' : ''} onClick={() => setActiveTab('shipments')}>Shipments</button>
        <button className={activeTab === 'referral' ? 'active' : ''} onClick={() => setActiveTab('referral')}>Referral</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};


// --- SUB-COMPONENTS ---

const PersonalDetailsTab: React.FC<{ customer: Customer }> = ({ customer }) => (
  <div className="personal-details-tab">
    <div className="info-section">
      <div className="info-pair"><label>Phone Number</label><span>{customer.phoneNumber || 'N/A'}</span></div>
      <div className="info-pair"><label>Email</label><span>{customer.email}</span></div>
      <div className="info-pair"><label>Gender</label><span>{customer.gender || 'N/A'}</span></div>
    </div>
  </div>
);

const WalletBalanceTab: React.FC<{ customer: Customer }> = ({ customer }) => {
  const [currency, setCurrency] = useState<Currency>('ngn');
  const ngnBalance = parseFloat(customer.wallet?.walletBalanceNGN as any) || 0;
  const gbpBalance = parseFloat(customer.wallet?.walletBalanceGBP as any) || 0;

  return (
    <div className="wallet-tab">
      <div className="wallet-card">
        <div className="wallet-amount">
          {currency === 'ngn' 
              ? `₦${ngnBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
              : `£${gbpBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          }
        </div>
        <div className="page-level-currency-toggle">
          <button className={currency === 'ngn' ? 'active' : ''} onClick={() => setCurrency('ngn')}>NGN</button>
          <button className={currency === 'gbp' ? 'active' : ''} onClick={() => setCurrency('gbp')}>GBP</button>
        </div>
      </div>
    </div>
  );
};

// === THE REWRITTEN SHIPMENTS TAB COMPONENT ===
const ShipmentsTab: React.FC<{ shipments: CustomerShipment[] }> = ({ shipments }) => {
  if (shipments.length === 0) {
    return <p>This customer has no shipments.</p>;
  }

  return (
    <div className="shipments-tab">
      <h3>Shipment History</h3>
      <div className="table-container">
        {/* We reuse the 'data-table' class from other pages for consistent styling */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>From</th>
              <th>To</th>
              <th>Weight</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td data-label="Shipment ID">{shipment.id}</td>
                <td data-label="From">{shipment.locationFrom}</td>
                <td data-label="To">{shipment.locationTo}</td>
                <td data-label="Weight">{`${shipment.weight}kg`}</td>
                <td data-label="Cost">{`${shipment.currency} ${shipment.totalCost.toLocaleString()}`}</td>
                <td data-label="Status">
                  <span className={`status-badge status-${shipment.shipmentStatus.toLowerCase()}`}>
                    {shipment.shipmentStatus}
                  </span>
                </td>
                <td data-label="Date">{new Date(shipment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const ReferralTab: React.FC<{ referral: any }> = ({ referral }) => (
  referral ? (
    <div className="referral-tab">
      <h4>Referral Details</h4>
      <p>Referral data available.</p>
    </div>
  ) : <p>No referral data for this customer.</p>
);

export default CustomerDetailsPage;