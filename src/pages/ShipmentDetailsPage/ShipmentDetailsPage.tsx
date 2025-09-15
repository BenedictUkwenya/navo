// src/pages/ShipmentDetailsPage/ShipmentDetailsPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getShipmentById,
  updateShipmentStatus,
  declineShipment,
} from "../../services/shipmentService";
import { Shipment } from "../../types/shipment";
import "./ShipmentDetailsPage.css";
import defaultAvatar from "../../assets/images/avatar.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiChevronLeft, FiX } from "react-icons/fi"; // An icon for the back button

const ShipmentDetailsPage: React.FC = () => {
  const { shipmentId: shipmentIds } = useParams<{ shipmentId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    weight: "",
    shipmentId: "",
    amount: "",
  });
  const [declineForm, setDeclineForm] = useState({
    reason: "",
    selectedReason: "",
  });

  useEffect(() => {
    if (!shipmentIds) {
      setError("No shipment ID provided.");
      setLoading(false);
      return;
    }

    const fetchShipmentDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getShipmentById(shipmentIds);
        setShipment(data);
        console.log("single shipment", data);
      } catch (err) {
        setError(
          "Failed to fetch shipment details. The shipment may not exist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentDetails();
  }, [shipmentIds]);

  useEffect(() => {
    if (shipment) {
      setCheckInForm({
        weight: shipment.weight?.toString() || "",
        shipmentId: shipment.id || "",
        amount: shipment.amount?.toString() || "",
      });
    }
  }, [shipment]);

  const handleCheckInSubmit = async () => {
    setIsSubmitting(true);
    console.log("checkin form", shipment?.id);
    try {
      await updateShipmentStatus({
        shipmentId: shipment?.id || "",
        newStatus: "CHECKED_IN",
      });

      toast.success("Shipment checked in successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowCheckInModal(false);
      // Refresh shipment details
      if (shipmentIds) {
        const updatedShipment = await getShipmentById(shipmentIds);
        setShipment(updatedShipment);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to check in shipment";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Use declineShipment instead of updateShipmentStatus
      await declineShipment(
        shipment?.id || "",
        declineForm.selectedReason || declineForm.reason
      );

      await updateShipmentStatus({
        shipmentId: shipment?.id || "",
        newStatus: "DECLINED",
      });

      toast.success("Shipment declined successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowDeclineModal(false);

      // Refresh shipment details
      if (shipmentIds) {
        const updatedShipment = await getShipmentById(shipmentIds);
        setShipment(updatedShipment);
      }
      // Reset form
      setDeclineForm({ reason: "", selectedReason: "" });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to decline shipment";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReasonSelect = (reason: string) => {
    setDeclineForm((prev) => ({ ...prev, selectedReason: reason }));
  };

  if (loading) {
    return <div className="page-loading">Loading Shipment Details...</div>;
  }

  if (error || !shipment) {
    return <div className="page-error">{error || "Shipment not found."}</div>;
  }

  return (
    <div className="shipment-details-page">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft />
          Customer Shipments / {shipment.user?.firstName || "N/A"}{" "}
          {shipment.user?.lastName || ""}
        </button>
      </header>

      <div className="details-content-wrapper">
        <div className="img-button">
          <div className="avatar-container">
            <img
              src={shipment?.user?.avatar || defaultAvatar}
              alt="Customer Avatar"
              className="customer-avatar"
            />
          </div>

          {["PENDING", "PROCESSING"].includes(shipment.shipmentStatus) && (
            <button
              type="button"
              className="button button-primary"
              onClick={() => setShowCheckInModal(true)}
            >
              Check In
            </button>
          )}
        </div>
        <div className="customer-info-header">
          <h2>
            {shipment.user?.firstName} {shipment.user?.lastName}
          </h2>
          <span
            className={`status-pill status-${shipment.shipmentStatus.toLowerCase()}`}
          >
            {shipment.shipmentStatus}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Customer ID</span>
            <p className="detail-value">{shipment.user?.id || "N/A"}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Shipment ID</span>
            <p className="detail-value">{shipment.id}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Goods Type</span>
            <p className="detail-value">
              {shipment.goodsType || "General goods"}
            </p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Delivery Timeline</span>
            <p className="detail-value">
              {shipment.deliveryDays
                ? `${shipment.deliveryDays} Days`
                : "4 Weeks"}
            </p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <p className="detail-value">{shipment.toCountry || "Nigeria"}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Service type</span>
            <p className="detail-value">{shipment.shipmentType || "Send"}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Weight</span>
            <p className="detail-value">
              {shipment.weight ? `${shipment.weight}KG` : "N/A"}
            </p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Amount</span>
            <p className="detail-value">
              {shipment.amount
                ? `${
                    shipment.currency === "GBP"
                      ? "£"
                      : shipment.currency === "USD"
                      ? "$"
                      : "₦"
                  }${Number(shipment.amount).toLocaleString()}`
                : "N/A"}
            </p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Track ID</span>
            <p className="detail-value">{shipment.trackingId || "N/A"}</p>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span
              className={`status-pill status-${shipment.shipmentStatus.toLowerCase()}`}
            >
              {shipment.shipmentStatus}
            </span>
          </div>
        </div>

        {/* Check-In Modal */}
        {showCheckInModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Parcel Check-In</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowCheckInModal(false)}
                >
                  <FiX />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h4>Items</h4>
                  <p className="items-text">
                    {shipment?.goodsType || "No items listed"}
                    {/* Chips (5 packs), cookies (10 packs), crackers (20 pieces),
                    soda (2 packs) */}
                  </p>
                </div>

                <div className="form-group">
                  <label>Weight</label>
                  <input
                    type="text"
                    placeholder="Enter here"
                    value={checkInForm.weight}
                    onChange={(e) =>
                      setCheckInForm((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Shipment ID</label>
                  <input
                    type="text"
                    placeholder="Enter here"
                    value={checkInForm.shipmentId}
                    onChange={(e) =>
                      setCheckInForm((prev) => ({
                        ...prev,
                        orderId: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Amount ({shipment?.currency || "₦"})</label>
                  <input
                    type="text"
                    placeholder="Enter here"
                    value={checkInForm.amount}
                    onChange={(e) =>
                      setCheckInForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleCheckInSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : " Approve"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCheckInModal(false);
                    setShowDeclineModal(true);
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Decline Parcel Check-In</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowDeclineModal(false)}
                >
                  <FiX />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h4>Items</h4>
                  <p className="items-text">
                    Chips (5 packs), cookies (10 packs), crackers (20 pieces),
                    soda (2 packs)
                  </p>
                </div>

                <div className="form-group">
                  <label>Reason for decline</label>
                  <textarea
                    placeholder="Enter here"
                    value={declineForm.reason}
                    onChange={(e) =>
                      setDeclineForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </div>

                <div className="reasons-section">
                  <p>Or select from the suggested reasons below</p>
                  <div className="reason-pills">
                    {[
                      "Prohibited",
                      "Oversize",
                      "Overweight",
                      "Restricted",
                      "Suspicious",
                    ].map((reason) => (
                      <button
                        key={reason}
                        className={`reason-pill ${
                          declineForm.selectedReason === reason
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleReasonSelect(reason)}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-decline"
                  onClick={handleDeclineSubmit}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ShipmentDetailsPage;
