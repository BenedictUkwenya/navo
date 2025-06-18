// src/pages/CustomerDetailsPage/CustomerDetailsPage.tsx

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CustomerDetailsPage.css';
import { mockCustomerDetailsData } from '../../data/mockCustomersDetailss';

// Import Icons
import backArrowIcon from '../../assets/images/previcon.png';
import avatar from '../../assets/images/profilepic.png';

type DetailTab = 'personal' | 'wallet' | 'shipments' | 'referral';
type Currency = 'ngn' | 'gbp';

const CustomerDetailsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customerId === mockCustomerDetailsData.id ? mockCustomerDetailsData : null;

  const [activeTab, setActiveTab] = useState<DetailTab>('wallet');
  
 

  if (!customer) {
    return <div className="customer-details-page"><h2>Customer not found.</h2></div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDetailsTab customer={customer} />;
      case 'wallet':
        // The WalletBalanceTab component is now self-contained
        return <WalletBalanceTab customer={customer} />;
      case 'shipments':
        return <ShipmentsTab shipments={customer.shipments} />;
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
          <span className="breadcrumb-text">All customers <span className="separator">/</span> {customer.name}</span>
        </div>
      </div>
      <div className="customer-profile-header">
        <img src={avatar} alt={customer.name} className="profile-avatar" />
        <h1>{customer.name}</h1>
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

 

const PersonalDetailsTab: React.FC<{ customer: any }> = ({ customer }) => (
  <div className="personal-details-tab"><div className="info-section"><div className="info-pair"><label>Phone Number (NGN)</label><span>{customer.personal.phoneNGN}</span></div><div className="info-pair"><label>Phone Number (UK)</label><span>{customer.personal.phoneUK}</span></div><div className="info-pair"><label>Email</label><span>{customer.personal.email}</span></div><div className="info-pair"><label>Gender</label><span>{customer.personal.gender}</span></div></div><div className="address-section"><div className="address-column"><h4>Delivery Address</h4><h5>Nigeria</h5><ul><li><strong>State:</strong> {customer.addresses.nigeria.state}</li><li><strong>City:</strong> {customer.addresses.nigeria.city}</li><li><strong>Street Name:</strong> {customer.addresses.nigeria.street}</li><li><strong>Apartment/Building:</strong> {customer.addresses.nigeria.apartment}</li><li><strong>Postal Code:</strong> {customer.addresses.nigeria.postalCode}</li><li><strong>Status:</strong> <span className="status-active">{customer.addresses.nigeria.status}</span></li></ul></div><div className="address-column"><h5 className="address-country">United Kingdom</h5><ul><li><strong>State:</strong> {customer.addresses.uk.state}</li><li><strong>City:</strong> {customer.addresses.uk.city}</li><li><strong>Street Name:</strong> {customer.addresses.uk.street}</li><li><strong>Apartment/Building:</strong> {customer.addresses.uk.apartment}</li><li><strong>Postal Code:</strong> {customer.addresses.uk.postalCode}</li><li><strong>Status:</strong> <span className="status-active">{customer.addresses.uk.status}</span></li></ul></div></div></div>
);

// WalletBalanceTab is now self-contained again
const WalletBalanceTab: React.FC<{ customer: any }> = ({ customer }) => {
  const [currency, setCurrency] = useState<Currency>('ngn');

  return (
    <div className="wallet-tab">
      <div className="wallet-card">
        <div className="wallet-amount">
          {currency === 'ngn' 
              ? `₦${customer.wallet.ngn.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
              : `£${customer.wallet.gbp.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
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
  <div className="shipments-tab"><div className="table-container"><table className="shipments-details-table"><thead><tr><th>From</th><th>To</th><th>Goods Type</th><th>Address</th><th>Weight</th><th>Amount</th><th>Date</th></tr></thead><tbody>{shipments.map((shipment, index) => (<tr key={index}><td>{shipment.from}</td><td>{shipment.to}</td><td>{shipment.goodsType}</td><td>{shipment.address}</td><td>{shipment.weight}</td><td>{shipment.amount}</td><td>{shipment.date}</td></tr>))}</tbody></table></div></div>
);

const ReferralTab: React.FC<{ referral: any }> = ({ referral }) => (
  <div className="referral-tab"><div className="info-pair"><label>Referral Code</label><span>{referral.code}</span></div><div className="info-pair"><label>Referred User(s)</label><span>{referral.referredUsers.join(', ')}</span></div><div className="info-pair"><label>Date Created/Registered</label><span>{referral.dateCreated}</span></div><div className="info-pair"><label>Referral Points</label><span>{referral.points}</span></div></div>
);

export default CustomerDetailsPage;