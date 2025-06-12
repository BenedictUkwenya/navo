import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page and Layout Imports
import Layout from './compoonents/Layout/Layout';
import ProtectedRoute from './compoonents/ProtectedRoute'; // <-- Import the gatekeeper
import LoginPage from './pages/LoginPage/LoginPage'; // <-- Import the login page

// Your other page components
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

function App() {
  return (
    <Routes>
      {/* Public Route: The login page doesn't use the main Layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes: All routes inside here require authentication */}
      <Route element={<ProtectedRoute />}>
        {/* The Layout now wraps all protected pages */}
        <Route path="/" element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>} />
        
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
        <Route
          path="/tracking"
          element={<Layout pageTitle="Tracking Management"><TrackingMgtPage /></Layout>}
        />
        <Route
          path="/purchase-orders"
          element={<Layout pageTitle="Order for Purchase"><PurchaseOrdersPage /></Layout>}
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
      </Route>
    </Routes>
  );
}

export default App;