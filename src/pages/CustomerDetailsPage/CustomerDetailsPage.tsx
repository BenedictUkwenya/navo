import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CustomerDetailsPage.css';
import { getCustomerById } from '../../services/customerService';
import { Customer } from '../../types/customer';

// Import Icons
import backArrowIcon from '../../assets/images/previcon.png';
import avatar from '../../assets/images/profilepic.png';

type DetailTab = 'personal' | 'wallet' | 'shipments' | 'referral';
type Currency = 'ngn' | 'gbp';

const CustomerDetailsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('personal');

  useEffect(() => {
    if (!customerId) return;
    
    const fetchCustomerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCustomerById(customerId);
        setCustomer(response.customer);
      } catch (err) {
        setError('Failed to fetch customer details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerDetails();
  }, [customerId]);

  if (loading) return <div className="page-loading">Loading customer details...</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!customer) return <div className="page-error">Customer not found.</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDetailsTab customer={customer} />;
      case 'wallet':
        return <WalletBalanceTab customer={customer} />;
      case 'shipments':
        return <ShipmentsTab shipments={customer.shipments || []} />;
      case 'referral':
        return <ReferralTab referral={customer.referral} />;
      default:
        return null;
    }
  };

  return (
    <div className="customer-details-page">
      <div className="details-header">
        <div className="breadcrumb">
          <Link to="/customers" className="back-link"><img src={backArrowIcon} alt="Back" /></Link>
          <span className="breadcrumb-text">All customers <span className="separator">/</span> {`${customer.firstName} ${customer.lastName}`}</span>
        </div>
      </div>
      <div className="customer-profile-header">
        <img src={customer.profilePicture || avatar} alt={`${customer.firstName} ${customer.lastName}`} className="profile-avatar" />
        <h1>{`${customer.firstName} ${customer.lastName}`}</h1>
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
  // This will need to be updated once we know the shape of locationDetails
  <div className="personal-details-tab">
    <div className="info-section">
      <div className="info-pair"><label>Phone Number</label><span>{customer.phoneNumber}</span></div>
      <div className="info-pair"><label>Email</label><span>{customer.email}</span></div>
      <div className="info-pair"><label>Gender</label><span>{customer.gender}</span></div>
    </div>
  </div>
);

const WalletBalanceTab: React.FC<{ customer: Customer }> = ({ customer }) => {
  const [currency, setCurrency] = useState<Currency>('ngn');
  const ngnBalance = customer.wallet?.walletBalanceNGN || 0;
  const gbpBalance = customer.wallet?.walletBalanceGBP || 0;

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

const ShipmentsTab: React.FC<{ shipments: any[] }> = ({ shipments }) => (
  // This will need to be updated once we know the shape of a shipment object
  shipments.length > 0 ? (
    <div className="shipments-tab"><div className="table-container"><p>Shipment data available.</p></div></div>
  ) : <p>No shipments for this customer.</p>
);

const ReferralTab: React.FC<{ referral: any }> = ({ referral }) => (
  // This will need to be updated once we know the shape of a referral object
  referral ? <div className="referral-tab"><p>Referral data available.</p></div> : <p>No referral data.</p>
);

export default CustomerDetailsPage;