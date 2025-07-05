// src/App.tsx

import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';

// Layout and Route Guards - These are now essential
import Layout from './compoonents/Layout/Layout';
import ProtectedRoute from './compoonents/ProtectedRoute';
import PublicRoute from './compoonents/PublicRoute';

// Page Components
import LoginPage from './pages/LoginPage/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import CustomersPage from './pages/CustomersPage/CustomersPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage/CustomerDetailsPage';
import QuoteRequestPage from './pages/QuoteRequestPage/QuoteRequestPage';
import TrackingMgtPage from './pages/TrackingMgtPage/TrackingMgtPage';
import PurchaseOrdersPage from './pages/ProductsPage/ProductsPage';
import PurchaseOrderDetailsPage from './pages/PurchaseOrderDetailsPage/PurchaseOrderDetailsPage';
import TransactionPage from './pages/TransactionPage/TransactionPage';
import SupportTicketPage from './pages/SupportTicketPag/SupportTicketPage';
import AuditMgtPage from './pages/AuditMgtPage/AuditMgtPage';
import UserManagementPage from './pages/UserManagementPage/UserManagementPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ShipmentPage from './pages/ShipmentPage/ShipmentPage';
import FXPage from './pages/FXPage/FXPage';
import ShipmentDetailsPage from './pages/ShipmentDetailsPage/ShipmentDetailsPage';

// We no longer need AuthProvider for this login method.
// import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    // The BrowserRouter component should wrap your entire application's routing logic.
    // If you already have this in index.tsx, you can remove it from here.
    <BrowserRouter>
      <Routes>
        {/* --- GROUP 1: PUBLIC ROUTES --- */}
        {/* These routes are only accessible to users who are NOT logged in. */}
        {/* The <PublicRoute /> guard will redirect logged-in users to "/dashboard". */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* --- GROUP 2: PROTECTED ROUTES --- */}
        {/* These routes are only accessible to users who ARE logged in. */}
        {/* The <ProtectedRoute /> guard will redirect logged-out users to "/login". */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>} />
          <Route path="/dashboard" element={<Layout pageTitle="Dashboard"><Dashboard /></Layout>} />
          
          <Route path="/customers" element={<Layout pageTitle="Customers"><CustomersPage /></Layout>} />
          <Route path="/customers/:customerId" element={<Layout pageTitle="Customer Details"><CustomerDetailsPage /></Layout>} />
          
          <Route path="/quote-request" element={<Layout pageTitle="Quote Request"><QuoteRequestPage /></Layout>} />
          <Route path="/tracking" element={<Layout pageTitle="Tracking Management"><TrackingMgtPage /></Layout>} />
          
          <Route path="/purchase-orders" element={<Layout pageTitle="Order for Purchase"><PurchaseOrdersPage /></Layout>} />
          <Route path="/purchase-orders/:orderId" element={<Layout pageTitle="Purchase Order Details"><PurchaseOrderDetailsPage /></Layout>} />
          
          <Route path="/transactions" element={<Layout pageTitle="Transaction"><TransactionPage /></Layout>} />
          <Route path="/support" element={<Layout pageTitle="Support Ticket"><SupportTicketPage /></Layout>} />
          <Route path="/audit" element={<Layout pageTitle="Audit Management"><AuditMgtPage /></Layout>} />
          <Route path="/user-management" element={<Layout pageTitle="User Management"><UserManagementPage /></Layout>} />
          <Route path="/shipments" element={<Layout pageTitle="Shipment"><ShipmentPage /></Layout>} />
          <Route
            path="/shipments/:shipmentId"
            element={<Layout pageTitle="Shipment Details"><ShipmentDetailsPage /></Layout>}
          />
          <Route path="/fx" element={<Layout pageTitle="FX"><FXPage /></Layout>} />
          <Route path="/settings" element={<Layout pageTitle="Settings"><SettingsPage /></Layout>} />
        </Route>

        {/* It's good practice to have a fallback route for unmatched paths */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;