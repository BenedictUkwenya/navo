import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PurchaseOrderDetailsPage.css';
import { getOrderById } from '../../services/purchaseOrderService';
import GeneratePriceModal from '../../compoonents/GeneratePriceModal/GeneratePriceModal';
import PaymentDetailsModal from '../../compoonents/PaymentDetailsModal/PaymentDetailsModal';
import ParcelCheckinModal from '../../compoonents/ParcelCheckinModal/ParcelCheckinModal';

// Using 'any' for now to match the complex existing logic. Can be typed later.
type PurchaseOrder = any;
type CartItem = any;
type CartSubItem = any;
type OrderStatus = any;

const PurchaseOrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<PurchaseOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modal, setModal] = useState<'pricing' | 'payment' | 'checkin' | null>(null);
    const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);

    // --- DATA FETCHING ---
    useEffect(() => {
        if (!orderId) {
            setError("No Order ID provided.");
            setLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getOrderById(orderId);
                setOrder(response.data.order);
            } catch (err) {
                setError('Failed to fetch order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // --- LOGIC HANDLERS ---
    const handleSavePrices = (cartItemId: string, updatedSubItems: CartSubItem[]) => {
        if (!order) return;
        const newTotalCost = updatedSubItems.reduce((acc, item) => acc + (item.price || 0), 0);
        const updatedOrder = {
            ...order,
            cartItems: order.cartItems.map((item: any) => 
                item.id === cartItemId ? { ...item, subItems: updatedSubItems, totalCost: newTotalCost } : item
            ),
        };
        setOrder(updatedOrder);
        setModal(null);
        console.log("Updated order state (would now send to API):", updatedOrder);
    };
    
    // These functions need to be filled in with the original logic from your mock data version
    const handleGenerateInvoice = () => { 
        if (!order) return;
        const updatedOrder = { ...order, status: 'Priced' as OrderStatus };
        setOrder(updatedOrder);
        // Here you would also make an API call to save the new status
        alert(`Invoice generated for ${order.user.first_name}!`);
    };
    const handleApprovePayment = () => { 
        if (!order) return;
        const updatedOrder = { ...order, status: 'Paid' as OrderStatus, /*...payment details...*/ };
        setOrder(updatedOrder);
        setModal(null);
        alert(`Payment approved for ${order.user.first_name}!`);
    };
    const handleConfirmCheckin = (trackingInfo: { trackingNumber: string; courier: string }) => { 
        if (!order) return;
        const updatedOrder = { ...order, status: 'Parcel Packed' as OrderStatus, trackingInfo };
        setOrder(updatedOrder);
        setModal(null);
        alert(`Parcel checked in for ${order.user.first_name}!`);
    };
    
    // --- RENDER LOGIC ---
    if (loading) return <div className="po-details-not-found"><h2>Loading Order...</h2></div>;
    if (error) return <div className="po-details-not-found"><h2>{error}</h2></div>;
    if (!order) return <div className="po-details-not-found"><h2>Order Not Found</h2></div>;

    // We can safely assume order exists beyond this point
    const canGenerateInvoice = order.status === 'Request' && order.cartItems?.every((item: any) => item.totalCost !== undefined);
    const totalCost = order.cartItems?.reduce((sum: number, item: any) => sum + (item.totalCost || 0), 0) || 0;
    const customerName = `${order.user?.first_name || ''} ${order.user?.last_name || ''}`.trim() || 'N/A';
    
    // === THE CORRECTED RENDER FUNCTION ===
    const renderMainActionButton = (): React.ReactNode => {
        switch (order.status) {
            case 'Request':
                return <button className="main-action-btn" disabled={!canGenerateInvoice} onClick={handleGenerateInvoice}>Generate Invoice</button>;
            case 'Priced':
                return <button className="main-action-btn" onClick={() => setModal('payment')}>Acknowledge & Await Payment</button>;
            case 'Paid':
                return <button className="main-action-btn main-action-btn--approve" onClick={() => setModal('checkin')}>Approve</button>;
            case 'Parcel Packed':
                return <div className="status-display">Status: Parcel Packed</div>;
            case 'Delivered':
                return <div className="status-display">Status: Delivered</div>;
            default:
                // This default case ensures the function always returns a valid ReactNode
                return null;
        }
    };
    
    return (
        <>
            <div className="po-details-page">
                <div className="po-details-header">
                    <div className="customer-info">
                        <h2><span onClick={() => navigate(-1)} className="back-link">Purchase Orders</span> / Cart Order</h2>
                        <h1>{customerName}</h1>
                    </div>
                    {/* The function call is now safe */}
                    {renderMainActionButton()}
                </div>

                <div className="cart-items-list">
                    {order.cartItems?.map((item: any) => (
                        <div key={item.id} className="cart-item-card">
                           {/* NOTE: You need to paste your full JSX for the card content back in here */}
                           <p>Item: {item.id}</p> 
                        </div>
                    ))}
                </div>

                 {order.paymentDetails && (
                    <div className="payment-summary-card">
                       {/* NOTE: You need to paste your full JSX for the payment summary back in here */}
                       <p>Payment details available.</p>
                    </div>
                )}
            </div>
            {/* --- MODAL RENDERING (Unchanged) --- */}
            {modal === 'pricing' && selectedCartItem && <GeneratePriceModal item={selectedCartItem} onClose={() => setModal(null)} onSave={handleSavePrices} />}
            {modal === 'payment' && <PaymentDetailsModal order={order} onClose={() => setModal(null)} onConfirm={handleApprovePayment} />}
            {modal === 'checkin' && <ParcelCheckinModal onClose={() => setModal(null)} onConfirm={handleConfirmCheckin} />}
        </>
    );
};

export default PurchaseOrderDetailsPage;