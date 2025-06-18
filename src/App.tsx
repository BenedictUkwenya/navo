import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
// Page and Layout Imports
import Layout from './compoonents/Layout/Layout';
import ProtectedRoute from './compoonents/ProtectedRoute';
import PublicRoute from './compoonents/PublicRoute'; // <-- Import PublicRoute
import LoginPage from './pages/LoginPage/LoginPage';

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
      {/* Public Routes: Wrapped in PublicRoute */}
      {/* This prevents logged-in users from seeing the login page */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes: All routes inside here require authentication */}
      {/* This part of your code was already perfect and needs no changes. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>} />
        
        <Route
          path="/customers"
          element={<Layout pageTitle="Customers"><CustomersPage /></Layout>}
        />
        {/* ... all your other protected routes ... */}
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