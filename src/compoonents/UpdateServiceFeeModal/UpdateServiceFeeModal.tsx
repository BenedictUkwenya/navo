// src/compoonents/UpdateServiceFeeModal/UpdateServiceFeeModal.tsx

import React, { useState } from "react";
import { updateServiceFee, ServiceFee } from "../../services/serviceFeeService";
import "./UpdateServiceFeeModal.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UpdateServiceFeeModalProps {
  currentPercentage: number;
  onClose: () => void;
  onSuccess: (updatedFee: ServiceFee) => void;
}

const UpdateServiceFeeModal: React.FC<UpdateServiceFeeModalProps> = ({
  currentPercentage,
  onClose,
  onSuccess,
}) => {
  const [newPercentage, setNewPercentage] = useState(
    currentPercentage.toString()
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const percentageValue = parseFloat(newPercentage);
    if (isNaN(percentageValue) || percentageValue < 0) {
      toast.error(
        "Please enter a valid, non-negative number for the percentage.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    setLoading(true);
    try {
      const updatedFee = await updateServiceFee(percentageValue);
      toast.success("Service fee updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onSuccess(updatedFee);
    } catch (error) {
      toast.error("Failed to update service fee.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h3>Update Service Fee</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>
        <main className="modal-body">
          <div className="form-group">
            <label htmlFor="percentage">New Service Fee Percentage (%)</label>
            <input
              type="number"
              id="percentage"
              value={newPercentage}
              onChange={(e) => setNewPercentage(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
        </main>
        <footer className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateServiceFeeModal;
