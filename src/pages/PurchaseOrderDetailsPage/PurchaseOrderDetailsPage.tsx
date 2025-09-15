import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PurchaseOrderDetailsPage.css";
import { getOrderById } from "../../services/purchaseOrderService";
import GeneratePriceModal from "../../compoonents/GeneratePriceModal/GeneratePriceModal";
import { getProductById } from "../../services/productService";
import PaymentDetailsModal from "../../compoonents/PaymentDetailsModal/PaymentDetailsModal";
import ParcelCheckinModal from "../../compoonents/ParcelCheckinModal/ParcelCheckinModal";
import UpdatePriceModal from "../../compoonents/UpdatePriceModel";

// Using 'any' for now to match the complex existing logic. Can be typed later.
type PurchaseOrder = any;
type CartItem = any;
type CartSubItem = any;
type OrderStatus = any;

export enum ShopformeStatusType {
  REQUEST = "REQUEST",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  PAYMENT_CANCALLED = "PAYMENT_CANCALLED",
  REFUND_PROCESSING = "REFUND_PROCESSING",
  REFUND_CONFIRMED = "REFUND_CONFIRMED",
  SHOPPING_ONGOING = "SHOPPING_ONGOING",
  PRODUCT_CHECKED_IN = "PRODUCT_CHECKED_IN",
  ARRIVED_AT_HUB = "ARRIVED_AT_HUB",
  DELIVERED = "DELIVERED",
  HANDLED_BY_USER = "HANDLED_BY_USER",
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case ShopformeStatusType.REQUEST:
        return "bg-blue-100 text-blue-800";
      case ShopformeStatusType.SUCCESSFUL:
        return "bg-green-100 text-green-800";
      case ShopformeStatusType.FAILED:
        return "bg-red-100 text-red-800";
      case ShopformeStatusType.PAYMENT_CONFIRMED:
        return "bg-green-100 text-green-800";
      case ShopformeStatusType.PAYMENT_CANCALLED:
        return "bg-red-100 text-red-800";
      case ShopformeStatusType.REFUND_PROCESSING:
        return "bg-yellow-100 text-yellow-800";
      case ShopformeStatusType.REFUND_CONFIRMED:
        return "bg-green-100 text-green-800";
      case ShopformeStatusType.SHOPPING_ONGOING:
        return "bg-purple-100 text-purple-800";
      case ShopformeStatusType.PRODUCT_CHECKED_IN:
        return "bg-blue-100 text-blue-800";
      case ShopformeStatusType.ARRIVED_AT_HUB:
        return "bg-indigo-100 text-indigo-800";
      case ShopformeStatusType.DELIVERED:
        return "bg-green-100 text-green-800";
      case ShopformeStatusType.HANDLED_BY_USER:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`status-badge ${getStatusColor(status)}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

const PurchaseOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<{ [key: string]: any }>({});

  const [modal, setModal] = useState<"pricing" | "payment" | "checkin" | null>(
    null
  );
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(
    null
  );
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);

  const handleUpdatePrice = (newPrice: number) => {
    if (!selectedCartItem) return;

    const updatedOrder = {
      ...order,
      items: order.items.map((item: any) =>
        item.id === selectedCartItem.id ? { ...item, amount: newPrice } : item
      ),
    };
    setOrder(updatedOrder);
    setShowUpdatePriceModal(false);
    setSelectedCartItem(null);
  };

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
        setOrder(response.data.shop);
        console.log("this is order", order);
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // --- LOGIC HANDLERS ---
  const handleSavePrices = (
    cartItemId: string,
    updatedSubItems: CartSubItem[]
  ) => {
    if (!order) return;
    const newTotalCost = updatedSubItems.reduce(
      (acc, item) => acc + (item.price || 0),
      0
    );
    const updatedOrder = {
      ...order,
      cartItems: order.cartItems.map((item: any) =>
        item.id === cartItemId
          ? { ...item, subItems: updatedSubItems, totalCost: newTotalCost }
          : item
      ),
    };
    setOrder(updatedOrder);
    setModal(null);
    console.log("Updated order state (would now send to API):", updatedOrder);
  };

  // These functions need to be filled in with the original logic from your mock data version
  const handleGenerateInvoice = () => {
    if (!order) return;
    const updatedOrder = { ...order, status: "Priced" as OrderStatus };
    setOrder(updatedOrder);
    // Here you would also make an API call to save the new status
    alert(`Invoice generated for ${order.user.first_name}!`);
  };
  const handleApprovePayment = () => {
    if (!order) return;
    const updatedOrder = {
      ...order,
      status: "Paid" as OrderStatus /*...payment details...*/,
    };
    setOrder(updatedOrder);
    setModal(null);
    alert(`Payment approved for ${order.user.first_name}!`);
  };
  const handleConfirmCheckin = (trackingInfo: {
    trackingNumber: string;
    courier: string;
  }) => {
    if (!order) return;
    const updatedOrder = {
      ...order,
      status: "Parcel Packed" as OrderStatus,
      trackingInfo,
    };
    setOrder(updatedOrder);
    setModal(null);
    alert(`Parcel checked in for ${order.user.first_name}!`);
  };

  // --- RENDER LOGIC ---
  if (loading)
    return (
      <div className="po-details-not-found">
        <h2>Loading Order...</h2>
      </div>
    );
  if (error)
    return (
      <div className="po-details-not-found">
        <h2>{error}</h2>
      </div>
    );
  if (!order)
    return (
      <div className="po-details-not-found">
        <h2>Order Not Found</h2>
      </div>
    );

  // We can safely assume order exists beyond this point
  const canGenerateInvoice =
    order.status === "Request" &&
    order.cartItems?.every((item: any) => item.totalCost !== undefined);
  const totalCost =
    order.cartItems?.reduce(
      (sum: number, item: any) => sum + (item.totalCost || 0),
      0
    ) || 0;
  const customerName =
    `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() ||
    "N/A";

  // === THE CORRECTED RENDER FUNCTION ===
  const renderMainActionButton = (): React.ReactNode => {
    console.log("Order status:", order.status);
    switch (order.status) {
      case "REQUEST":
        return (
          <button
            className="main-action-btn"
            disabled={!canGenerateInvoice}
            onClick={handleGenerateInvoice}
          >
            Generate Invoice
          </button>
        );
      case "Priced":
        return (
          <button
            className="main-action-btn"
            onClick={() => setModal("payment")}
          >
            Acknowledge & Await Payment
          </button>
        );
      case "PAID":
        return (
          <button
            className="main-action-btn main-action-btn--approve"
            onClick={() => setModal("checkin")}
          >
            Approve
          </button>
        );
      case "Parcel Packed":
        return <div className="status-display">Status: Parcel Packed</div>;
      case "Delivered":
        return <div className="status-display">Status: Delivered</div>;
      case "PENDING":
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
            <h2 className="ttiimm">
              <span onClick={() => navigate(-1)} className="back-link">
                Purchase Orders
              </span>{" "}
              / Cart Order
            </h2>
            <h1>
              {customerName}
              <StatusBadge status={order.status} />
            </h1>
          </div>
          {/* The function call is now safe */}
          {renderMainActionButton()}
        </div>
        <div className="cart-con">Cart Item</div>

        <div className="cart-items-list">
          {order?.items?.map((item: any, index: number) => (
            <div
              key={item.id}
              className="cart-item-card"
              style={{
                backgroundColor: index % 2 === 0 ? "#FFF5EE" : "#f9f9f9",
              }}
            >
              <div
                key={index}
                className="cart-item1"
                style={{
                  backgroundColor: index % 2 === 0 ? "#FFF5EE" : "#f9f9f9",
                }}
              >
                <div className="item-header">
                  <div className="header-row">
                    <div className="header-item">
                      <span className="label">Good Type</span>

                      <span className="value">{item.goodType || "Random"}</span>
                    </div>
                    <div className="header-item">
                      <span className="label">Item Category</span>
                      <span className="value">{item.goodType || "Random"}</span>
                    </div>
                    <div className="header-item">
                      <span className="label">Store Link</span>
                      <a href={item.storeLink} className="link">
                        {/* {item.storeLink} */}
                        https://www.dummylink/
                      </a>
                    </div>
                    <div className="header-item">
                      <span className="label">Marketplace Link</span>
                      <span className="value">
                        -{/* {item.marketplaceLink} */}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="item-content1">
                  <div className="content-section">
                    <div className="items-section">
                      <span className="section-label">Items</span>
                      <p className="items-text">{item.item}</p>
                    </div>

                    <div className="cost-section">
                      <span className="section-label">Cost of Order</span>
                      <div className="cost-row">
                        <span className="cost-amount">
                          {item?.currency === "GBP"
                            ? "£"
                            : item?.currency === "USD"
                            ? "$"
                            : item?.currency === "EUR"
                            ? "€"
                            : item?.currency === "NGN"
                            ? "₦"
                            : item?.currency}
                          {item.amount}
                        </span>
                        <button
                          className="update-btn1"
                          onClick={() => {
                            setSelectedCartItem(item);
                            setShowUpdatePriceModal(true);
                          }}
                        >
                          Update Price
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <span className="section-label">Details</span>
                    <p className="details-text">{item.details}</p>
                  </div>
                </div>
              </div>
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
      {modal === "pricing" && selectedCartItem && (
        <GeneratePriceModal
          item={selectedCartItem}
          onClose={() => setModal(null)}
          onSave={handleSavePrices}
        />
      )}
      {modal === "payment" && (
        <PaymentDetailsModal
          order={order}
          onClose={() => setModal(null)}
          onConfirm={handleApprovePayment}
        />
      )}
      {modal === "checkin" && (
        <ParcelCheckinModal
          onClose={() => setModal(null)}
          onConfirm={handleConfirmCheckin}
        />
      )}
      {showUpdatePriceModal && selectedCartItem && (
        <UpdatePriceModal
          item={selectedCartItem}
          onClose={() => {
            setShowUpdatePriceModal(false);
            setSelectedCartItem(null);
          }}
          onSave={handleUpdatePrice}
        />
      )}
    </>
  );
};

export default PurchaseOrderDetailsPage;
