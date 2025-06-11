// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './compoonents/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import CustomersPage from './pages/CustomersPage/CustomersPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage/CustomerDetailsPage';
import QuoteRequestPage from './pages/QuoteRequestPage/QuoteRequestPage';
import TrackingMgtPage from './pages/TrackingMgtPage/TrackingMgtPage';
import PurchaseOrdersPage from './pages/PurchaseOrderPage/PurchaseOrderPage';
import PurchaseOrderDetailsPage from './pages/PurchaseOrderDetailsPage/PurchaseOrderDetailsPage';
import TransactionPage from './pages/TransactionPage/TransactionPage';
import SupportTicketPage from './pages/SupportTicketPag/SupportTicketPage';
import AuditMgtPage from './pages/AuditMgtPage/AuditMgtPage';
import UserManagementPage from './pages/UserManagementPage/UserManagementPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
// import LoginPage from './pages/LoginPage/LoginPage';

function App() {
  return (
    <Routes>
      {/* For each route, we now explicitly wrap the page in the Layout
          and pass the specific title we want for that page. */}
      
      <Route
        path="/"
        element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>}
      />
      <Route
        path="/customers"
        element={<Layout pageTitle="Customers"><CustomersPage /></Layout>}
      />
      <Route
        path="/customers/:customerId"
        element={<Layout pageTitle="Customer Details"><CustomerDetailsPage /></Layout>}
      />
      <Route
        path="/quote-request"
        element={<Layout pageTitle="Quote Request"><QuoteRequestPage /></Layout>}
      />

      {/* --- CORRECTED LINE --- */}
      {/* We wrapped the element prop inside a proper Route component with a path */}
      <Route
        path="/tracking"
        element={<Layout pageTitle="Tracking Management"><TrackingMgtPage /></Layout>}
      />
            <Route
        path="/purchase-orders"
        element={<Layout pageTitle="Order for Purchase"><PurchaseOrdersPage /></Layout>
        }
      />
      <Route
        path="/purchase-orders/:orderId"
        element={<Layout pageTitle="Purchase Order Details"><PurchaseOrderDetailsPage /></Layout>}
      />
            <Route
        path="/transactions"
        element={<Layout pageTitle="Transaction"><TransactionPage /></Layout>}
      />
         <Route
        path="/support"
        element={<Layout pageTitle="Support Ticket"><SupportTicketPage /></Layout>}
      />
            <Route
        path="/audit"
        element={<Layout pageTitle="Audit Management"><AuditMgtPage /></Layout>}
      />
            <Route
        path="/user-management"
        element={<Layout pageTitle="User Management"><UserManagementPage /></Layout>}
      />

<Route
        path="/settings"
        element={<Layout pageTitle="Settings"><SettingsPage /></Layout>}
      />


      {/* ---------------------- */}
      
      {/* When you're ready, you can add the login page route here.
          It doesn't use the Layout, so it stands alone. */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}

export default App;