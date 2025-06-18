import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PurchaseOrderDetailsPage.css';
 
import { mockPurchaseOrders } from '../../data/mockPurchaseOrders';
 
import { PurchaseOrder, OrderStatus, CartItem, CartSubItem } from '../../data/mockPurchaseOrders';
import GeneratePriceModal from '../../compoonents/GeneratePriceModal/GeneratePriceModal';
import PaymentDetailsModal from '../../compoonents/PaymentDetailsModal/PaymentDetailsModal';
import ParcelCheckinModal from '../../compoonents/ParcelCheckinModal/ParcelCheckinModal';

// --- Helper function to update mock data (simulates API call) ---
const updateMockOrder = (updatedOrder: PurchaseOrder) => {
    const orderIndex = mockPurchaseOrders.findIndex(o => o.id === updatedOrder.id);
    if (orderIndex !== -1) {
        mockPurchaseOrders[orderIndex] = updatedOrder;
    }
};

const PurchaseOrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<PurchaseOrder | null>(null);
    const [modal, setModal] = useState<'pricing' | 'payment' | 'checkin' | null>(null);
    const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);

    useEffect(() => {
        const foundOrder = mockPurchaseOrders.find(o => o.id === orderId);
        setOrder(foundOrder ? { ...foundOrder } : null); 
    }, [orderId]);

    const handleSavePrices = (cartItemId: string, updatedSubItems: CartSubItem[]) => {
        if (!order) return;
        const newTotalCost = updatedSubItems.reduce((acc, item) => acc + (item.price || 0), 0);
        const updatedOrder = {
            ...order,
            cartItems: order.cartItems.map(item => 
                item.id === cartItemId ? { ...item, subItems: updatedSubItems, totalCost: newTotalCost } : item
            ),
        };
        setOrder(updatedOrder);
        setModal(null);
        console.log(`Prices updated for ${order.customerName}.`);
    };

    const handleGenerateInvoice = () => {
        if (!order) return;
        const updatedOrder = { ...order, status: 'Priced' as OrderStatus };
        setOrder(updatedOrder);
        updateMockOrder(updatedOrder);
        // --- NOTIFICATION HOOK ---
        console.log(`Invoice generated for ${order.customerName}. Notifying via Email, SMS, In-App...`);
        alert(`Invoice generated! Notifications would be sent to ${order.customerName}.`);
    };

    const handleApprovePayment = () => {
        if (!order) return;
        const updatedOrder = {
          ...order,
          status: 'Paid' as OrderStatus,
          paymentDetails: {
            paymentDate: new Date().toISOString(),
            totalAmount: order.cartItems.reduce((sum, item) => sum + (item.totalCost || 0), 0)
          }
        };
        setOrder(updatedOrder);
        updateMockOrder(updatedOrder);
        // --- NOTIFICATION HOOK ---
        console.log(`Payment confirmed for ${order.customerName}. Notifying via Email, SMS, In-App...`);
        alert(`Payment confirmed! Notifications would be sent to ${order.customerName}.`);
        setModal(null);
    }
    
    const handleConfirmCheckin = (trackingInfo: { trackingNumber: string; courier: string }) => {
        if (!order) return;
        const updatedOrder = {
            ...order,
            status: 'Parcel Packed' as OrderStatus,
            trackingInfo: { ...trackingInfo, checkinDate: new Date().toISOString() },
        };
        setOrder(updatedOrder);
        updateMockOrder(updatedOrder);
        // --- NOTIFICATION HOOK ---
        console.log(`Parcel checked in for ${order.customerName}. Notifying via Email, SMS, In-App...`);
        alert(`Parcel checked in! Notifications would be sent to ${order.customerName}.`);
        setModal(null);
    };

     

    if (!order) {
        return <div className="po-details-not-found"><h2>Order Not Found</h2></div>;
    }

    const canGenerateInvoice = order.status === 'Request' && order.cartItems.every(item => item.totalCost !== undefined);
    const totalCost = order.cartItems.reduce((sum, item) => sum + (item.totalCost || 0), 0);

    const renderMainActionButton = () => {
        switch (order.status) {
            case 'Request':
                return <button className="main-action-btn" disabled={!canGenerateInvoice} onClick={handleGenerateInvoice}>Generate Invoice</button>;
            case 'Priced':
                return <button className="main-action-btn" onClick={handleApprovePayment}>Acknowledge & Await Payment</button>;
            case 'Paid':
                return <button className="main-action-btn main-action-btn--approve" onClick={() => setModal('checkin')}>Approve</button>;
            case 'Parcel Packed':
                return <div className="status-display">Status: Parcel Packed</div>;
            case 'Delivered':
                return <div className="status-display">Status: Delivered</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="po-details-page">
                <div className="po-details-header">
                    <div className="customer-info">
                        <h2><span onClick={() => navigate(-1)} className="back-link">Purchase Orders</span> / Cart Order</h2>
                        <h1>{order.customerName}</h1>
                    </div>
                    {renderMainActionButton()}
                </div>

                <div className="cart-items-list">
                    {order.cartItems.map(item => (
                        <div key={item.id} className="cart-item-card">
                            {/* ... card content from before, no changes needed here ... */}
                            <div className="card-grid">
                                <div className="info-block"><label>Good Type</label><p>{item.goodType}</p></div>
                                <div className="info-block"><label>Item Category</label><p>{item.itemCategory}</p></div>
                                <div className="info-block info-block--link"><label>Store Link</label><p><a href={item.storeLink} target="_blank" rel="noopener noreferrer">{item.storeLink}</a></p></div>
                                <div className="info-block info-block--full"><label>Items</label><p className="item-names">{item.subItems.map(si => si.name).join(', ')}</p></div>
                                <div className="info-block info-block--full"><label>Details</label><p>{item.details}</p></div>

                                {item.totalCost !== undefined ? (
                                    <div className="info-block cost-block">
                                        <label>Cost of Order</label>
                                        <p className="cost-value">₦{item.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                ) : (
                                    <div className="info-block action-block">
                                        <button className="generate-price-btn" onClick={() => { setSelectedCartItem(item); setModal('pricing'); }}>Generate Price</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                 {order.paymentDetails && (
                    <div className="payment-summary-card">
                        <h3>Payment Details</h3>
                        <div className="payment-summary-grid">
                            <div className="info-block"><label>Total Paid</label><p className="cost-value">₦{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p></div>
                            <div className="info-block"><label>Payment Date</label><p>{new Date(order.paymentDetails.paymentDate).toLocaleDateString()}</p></div>
                            <button className="view-details-btn" onClick={() => setModal('payment')}>View Details</button>
                        </div>
                    </div>
                )}

            </div>

            {/* --- MODAL RENDERING --- */}
            {modal === 'pricing' && selectedCartItem && <GeneratePriceModal item={selectedCartItem} onClose={() => setModal(null)} onSave={handleSavePrices} />}
            {modal === 'payment' && <PaymentDetailsModal order={order} onClose={() => setModal(null)} onConfirm={handleApprovePayment} />}
            {modal === 'checkin' && <ParcelCheckinModal onClose={() => setModal(null)} onConfirm={handleConfirmCheckin} />}
        </>
    );
};

export default PurchaseOrderDetailsPage;