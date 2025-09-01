import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShipmentPage.css";

// API Services and Types
import {
  getShipments,
  getShipmentSettings,
  createShipmentSettings,
  updateShipmentRate,
  updateShipmentStatus,
} from "../../services/shipmentService";
import { ToastContainer, toast } from "react-toastify";
import { createShipmentRate } from "../../services/shipmentPricingService";
import {
  Shipment,
  ViewMode,
  ShipmentSetting,
  MockShipmentSetting,
  ShipmentSettingState,
  FormData,
} from "../../types/shipment";

// Icon Imports
import { IoEyeOutline, IoSearchOutline } from "react-icons/io5";
import { TfiFilter } from "react-icons/tfi";
import { FaChevronDown } from "react-icons/fa";
import noShipmentIcon from "../../assets/images/Group 1000003472.png";

// Component Imports
import ShipmentPricingModal from "../../compoonents/ShipmentPricingModal/ShipmentPricingModal";
import filtericon from "../../assets/images/filterIcon.png";
type ShipmentTab = "shipment-pricing" | "customer-shipments";

type ShipmentStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "SHIPPED"
  | "PACKED"
  | "CHECKED_OUT"
  | "NOT_CHECKED"
  | "ARRIVED_AT_LOCAL_HUB"
  | "ARRIVED_AT_NIGERIA_HUB"
  | "ARRIVED_AT_UK_HUB"
  | "COMPLETED"
  | "CANCELED"
  | "PROCESSING"
  | "DECLINED"
  | "ORDER_SUBMITTED"
  | "ORDER_PAID_SUCCESSFULLY"
  | "ORDER_PAYMENT_FAILED"
  | "ORDER_VERIFIED"
  | "AWAITING_SHIPMENT"
  | "FLIGHT_SEA_DEPARTURE"
  | "CUSTOM_CLEARANCE"
  | "ARRIVE_AT_THE_RECEIVING_HUB_CENTER";
type PricingOptions = {
  category: string;
  goodType: string;
  shipmentType: string;
  weight: string;
  deliveryType: string;
  pickup: string;
  delivery: string;
};

// ====================================================================================
// --- MAIN PAGE COMPONENT ---
// ====================================================================================
const ShipmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShipmentTab>("shipment-pricing");

  return (
    <div className="shipment-page">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="page-content-wrapper">
        <header className="content-header">
          <div className="shipment-tabs">
            <button
              className={activeTab === "shipment-pricing" ? "active" : ""}
              onClick={() => setActiveTab("shipment-pricing")}
            >
              Shipment Settings
            </button>
            <button
              className={activeTab === "customer-shipments" ? "active" : ""}
              onClick={() => setActiveTab("customer-shipments")}
            >
              Customer Shipments
            </button>
          </div>
          <div className="page-controls">
            <button className="filter-btn small">
              <img src={filtericon} />
            </button>
            <div className="input-with-icon search-bar">
              <IoSearchOutline />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </header>
        <div className="shipment-content">
          {activeTab === "shipment-pricing" && <ShipmentPricingTab />}
          {activeTab === "customer-shipments" && <CustomerShipmentsList />}
        </div>
      </div>
    </div>
  );
};

// ====================================================================================
// --- SUB-COMPONENT for Shipment Pricing Tab ---
// ====================================================================================
// Find the ShipmentPricingTab component in your file and replace it with this.
// The rest of the file (main component, other sub-components) can remain the same.

// --- SUB-COMPONENT FOR SHIPMENT PRICING TAB ---
const ShipmentPricingTab: React.FC = () => {
  const [view, setView] = useState<"create" | "edit">("edit");
  const [editingItem, setEditingItem] = useState<ShipmentSettingState | null>(
    null
  );

  const [settings, setSettings] = useState<ShipmentSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fromCountry: "",
    toCountry: "",
    pricePerKg: 0,
    clearanceFee: 0,
    deliveryDays: "0",
    currency: "USD",
    category: "",
    goodType: "",
    shipmentType: "",
    deliveryType: "",
    weight: 1,
  });

  useEffect(() => {
    fetchSettings();

    // Cleanup function
    return () => {
      setSettings([]);
      setLoading(true);
    };
  }, []);
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getShipmentSettings();
      setSettings(response.data.settings || []);
    } catch (error) {
      console.error("Failed to fetch shipment settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // This will hold the fully created rule object returned from the API
  const [activeRule, setActiveRule] = useState<any>(null);

  // This state holds the user's selections for creating a NEW rule
  // const [newRuleSelections, setNewRuleSelections] = useState({
  //   category: "",
  //   goodType: "",
  //   shipmentType: "",
  //   weight: "",
  //   deliveryType: "",
  //   pickup: "",
  //   delivery: "",
  // });

  // const settingsData = {
  //   category: ["Individual", "Business"],
  //   goodType: ["General goods", "Sensitive goods", "Travelling extra luggage"],
  //   shipmentType: ["Air", "Sea"],
  //   weight: ["0-2 kg", "3-5kg", "5-10kg", "11-20kg"],
  //   deliveryType: ["Pick up from hub", "Home delivery"],
  //   pickup: ["United Kingdom", "Nigeria"],
  //   delivery: ["Nigeria", "United Kingdom"],
  // };

  const handleInputChange = (
    field: keyof FormData,
    value: string | number
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        fromCountry: formData.fromCountry,
        toCountry: formData.toCountry,
        pricePerKg: Number(formData.pricePerKg),
        clearanceFee: Number(formData.clearanceFee),
        deliveryDays: formData.deliveryDays,
        currency: formData.currency,
        category: formData.category,
        goodType: formData.goodType,
        shipmentType: formData.shipmentType,
        deliveryType: formData.deliveryType,
        weight: Number(formData.weight),
      };

      if (editMode && editingItem) {
        await updateShipmentRate(editingItem.id, payload);
        toast.success("Shipment rate updated successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        await createShipmentSettings(payload);
        toast.success("New shipment rate created successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
      }

      resetForm();
      await fetchSettings();
    } catch (error: any) {
      if (error.response?.data) {
        const backendError = error.response.data;

        // Handle validation errors
        if (backendError.field && backendError.message) {
          toast.error(`${backendError.field}: ${backendError.message}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
        // Handle general backend error message
        else if (backendError.message) {
          toast.error(backendError.message, {
            position: "top-right",
            autoClose: 5000,
          });
        }
        // Handle array of validation errors
        else if (Array.isArray(backendError.errors)) {
          backendError.errors.forEach((err: any) => {
            toast.error(`${err.field}: ${err.message}`, {
              position: "top-right",
              autoClose: 5000,
            });
          });
        }
      } else if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error("An error occurred while saving the shipment rate", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fromCountry: "",
      toCountry: "",
      pricePerKg: 0,
      clearanceFee: 0,
      deliveryDays: "",
      currency: "USD",
      category: "",
      goodType: "",
      shipmentType: "",
      deliveryType: "",
      weight: 0,
    });
    setEditMode(false);
    setEditingItem(null);
    setViewMode("table");
  };

  const handleEdit = (setting: ShipmentSetting): void => {
    const mappedSetting: ShipmentSettingState = {
      id: setting.id,
      fromCountry: setting.fromCountry,
      toCountry: setting.toCountry,
      pricePerKg: setting.pricePerKg,
      clearanceFee: setting.clearanceFee,
      deliveryDays: setting.deliveryDays,
      currency: setting.currency,
      category: setting.category || "",
      goodType: setting.goodType || "",
      shipmentType: setting.shipmentType || "",
      deliveryType: setting.deliveryType || "",
      weight: setting.weight || "",
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    };
    setEditingItem(mappedSetting);
    setFormData({
      fromCountry: setting.fromCountry,
      toCountry: setting.toCountry,
      pricePerKg: setting.pricePerKg,
      clearanceFee: setting.clearanceFee,
      deliveryDays: setting.deliveryDays,
      currency: setting.currency,
      category: setting.category || "",
      goodType: setting.goodType || "",
      shipmentType: setting.shipmentType || "",
      deliveryType: setting.deliveryType || "",
      weight: setting.weight || 0,
    });
    setEditMode(true);
    setViewMode("form");
  };

  const handleBack = (): void => {
    setViewMode("table");
    setEditMode(false);
    setEditingItem(null);
    setFormData({
      fromCountry: "",
      toCountry: "",
      pricePerKg: 0,
      clearanceFee: 0,
      deliveryDays: "0",
      currency: "USD",
      category: "",
      goodType: "",
      shipmentType: "",
      deliveryType: "",
      weight: 1,
    });
  };

  // API Services and Types
  // console.log("Fetching settings data...", getShipments, getShipmentSettings);

  // const handleSelectOption = (
  //   key: keyof typeof newRuleSelections,
  //   value: string
  // ) => {
  //   setNewRuleSelections((prev) => ({ ...prev, [key]: value }));
  // };

  // === THIS IS THE MAIN FIX ===
  // const handleCreateAndSet = async () => {
  //   // Check if all options are selected
  //   const allOptionsSelected = Object.values(newRuleSelections).every(
  //     (option) => option !== ""
  //   );
  //   if (!allOptionsSelected) {
  //     alert("Please select one option from each of the first 7 columns.");
  //     return;
  //   }

  //   // In a real app, you would open a modal here to get price, fee, days
  //   // For now, we'll use placeholder values.
  //   const pricingDetails = {
  //     pricePerKg: 15, // Placeholder
  //     clearanceFee: 50, // Placeholder
  //     deliveryDays: 7, // Placeholder
  //   };

  //   // Construct the full payload for the API
  //   const payload = {
  //     fromCountry: newRuleSelections.pickup === "United Kingdom" ? "UK" : "NG",
  //     toCountry: newRuleSelections.delivery === "Nigeria" ? "NG" : "UK",
  //     currency: "GBP", // Assuming
  //     ...pricingDetails,
  //   };

  //   try {
  //     console.log("Creating rate with payload:", payload);
  //     const response = await createShipmentRate(payload);

  //     // IMPORTANT: The API returns the newly created rule. Save it to state.
  //     setActiveRule(response.data);

  //     // Now, switch to the edit view.
  //     setView("edit");
  //   } catch (error) {
  //     alert("Failed to create new pricing rule.");
  //     console.error(error);
  //   }
  // };

  // const handleSave = async () => {
  //   if (!activeRule) return;
  //   alert(`Updating rate for ID: ${activeRule.id}`);
  //   // Here you would call the updateShipmentRate service
  //   setView("create"); // Go back to the create view after saving
  //   setActiveRule(null);
  //   setNewRuleSelections({
  //     category: "",
  //     goodType: "",
  //     shipmentType: "",
  //     weight: "",
  //     deliveryType: "",
  //     pickup: "",
  //     delivery: "",
  //   });
  // };

  // if (view === "edit" && activeRule) {
  //   // This is the "Edit" view. It now displays data from the `activeRule` state.
  //   return (
  //     <div className="edit-settings-view">
  //       <div className="form-column">
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Category</h4>
  //             <button className="edit-btn">Edit</button>
  //           </div>
  //           <div className="input-container">
  //             <input readOnly value={newRuleSelections.category} />
  //             <FaChevronDown />
  //           </div>
  //         </div>
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Good type</h4>
  //             <button className="edit-btn">Edit</button>
  //           </div>
  //           <div className="input-container">
  //             <input readOnly value={newRuleSelections.goodType} />
  //             <FaChevronDown />
  //           </div>
  //         </div>
  //         <div className="form-group-row">
  //           <div className="form-group">
  //             <div className="form-group-header">
  //               <h4>Pick up from</h4>
  //             </div>
  //             <div className="input-container">
  //               <input readOnly value={newRuleSelections.pickup} />
  //               <FaChevronDown />
  //             </div>
  //           </div>
  //           <div className="form-group">
  //             <div className="form-group-header">
  //               <h4>Delivery to</h4>
  //             </div>
  //             <div className="input-container">
  //               <input readOnly value={newRuleSelections.delivery} />
  //               <FaChevronDown />
  //             </div>
  //           </div>
  //         </div>
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Price Per Kg</h4>
  //           </div>
  //           <div className="input-container">
  //             <input value={`₦${activeRule.pricePerKg}`} readOnly />
  //           </div>
  //         </div>
  //       </div>

  //       <div className="form-column">
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Shipment Type</h4>
  //             <button className="edit-btn">Edit</button>
  //           </div>
  //           <div className="input-container">
  //             <input readOnly value={newRuleSelections.shipmentType} />
  //             <FaChevronDown />
  //           </div>
  //         </div>
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Weight</h4>
  //             <button className="edit-btn">Edit</button>
  //           </div>
  //           <div className="input-container">
  //             <input readOnly value={newRuleSelections.weight} />
  //             <FaChevronDown />
  //           </div>
  //         </div>
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Delivery Type</h4>
  //           </div>
  //           <div className="radio-group">
  //             <label className="radio-label">
  //               <input
  //                 type="radio"
  //                 name="deliveryType"
  //                 checked={
  //                   newRuleSelections.deliveryType === "Pick up from hub"
  //                 }
  //                 readOnly
  //               />
  //               <span className="custom-radio"></span> Pick up from hub
  //             </label>
  //             <label className="radio-label">
  //               <input
  //                 type="radio"
  //                 name="deliveryType"
  //                 checked={newRuleSelections.deliveryType === "Home delivery"}
  //                 readOnly
  //               />
  //               <span className="custom-radio"></span> Home delivery
  //             </label>
  //           </div>
  //         </div>
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Clearance Fee</h4>
  //           </div>
  //           <div className="input-container">
  //             <input value={`₦${activeRule.clearanceFee}`} readOnly />
  //           </div>
  //         </div>
  //         <div className="form-group">
  //           <div className="form-group-header">
  //             <h4>Delivery Days</h4>
  //           </div>
  //           <div className="input-container">
  //             <input value={`${activeRule.deliveryDays} days`} readOnly />
  //           </div>
  //         </div>
  //       </div>

  //       <div className="form-actions-full-width">
  //         <button className="save-btn" onClick={handleSave}>
  //           Savedfdd
  //         </button>
  //       </div>
  //     </div>

  //   );
  // }

  // This is the default "Create" view
  // const isSetButtonEnabled = Object.values(newRuleSelections).every(
  //   (option) => option !== ""
  // );
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="page-loading">Loading Settings...</div>;

  return (
    // <div className="display-settings-grid">
    //   {Object.entries(settingsData).map(([key, options]) => (
    //     <div className="settings-display-column" key={key}>
    //       <h4>
    //         {key
    //           .replace(/([A-Z])/g, " $1")
    //           .replace(/^./, (str) => str.toUpperCase())}
    //       </h4>
    //       <div className="tags-container">
    //         {options.map((option) => (
    //           <button
    //             key={option}
    //             className={`tag ${
    //               newRuleSelections[key as keyof typeof newRuleSelections] ===
    //               option
    //                 ? "selected"
    //                 : ""
    //             }`}
    //             onClick={() =>
    //               handleSelectOption(
    //                 key as keyof typeof newRuleSelections,
    //                 option
    //               )
    //             }
    //           >
    //             {option}
    //           </button>
    //         ))}
    //         <button className="add-tag-btn">+ Add</button>
    //       </div>
    //     </div>
    //   ))}
    //   <div className="settings-display-column">
    //     <h4>Pricing</h4>
    //     <button
    //       className="set-price-btn"
    //       onClick={handleCreateAndSet}
    //       disabled={!isSetButtonEnabled}
    //     >
    //       Set
    //     </button>
    //   </div>
    // </div>
    <div>
      {viewMode === "table" ? (
        <div>
          <div className="card">
            <div className="card-header">
              <div className="search-container">
                {settings.length > 0 && (
                  <button
                    className="button button-primary"
                    onClick={() => setViewMode("form")}
                  >
                    + Create Setting
                  </button>
                )}
              </div>
            </div>
            <div className="card-content">
              {settings.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>From Country</th>
                        <th>To Country</th>
                        <th>Price Per Kg</th>
                        <th>Clearance Fee</th>
                        <th>Delivery Days</th>
                        <th>Currency</th>
                        <th>Date Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.map((setting) => (
                        <tr key={setting.id}>
                          <td>
                            <span className="badge badge-secondary">
                              {setting.fromCountry}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-outline">
                              {setting.toCountry}
                            </span>
                          </td>
                          <td className="currency">
                            {formatCurrency(setting.pricePerKg)}
                          </td>
                          <td className="currency">
                            {formatCurrency(setting.clearanceFee)}
                          </td>
                          <td>{setting.deliveryDays}</td>
                          <td>{setting.currency}</td>
                          <td>{formatDate(setting.createdAt)}</td>
                          <td>
                            <div className="actions">
                              <button
                                className="icon-button"
                                title="Edit"
                                onClick={() => handleEdit(setting as any)}
                              >
                                ✏️
                              </button>
                              <button className="icon-button" title="Delete">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-content">
                    <img src={noShipmentIcon} alt="No shipment settings" />
                    <h3>No shipment settings found</h3>
                    <p>Create your first shipment setting to get started</p>
                    <button
                      className="button button-primary"
                      onClick={() => setViewMode("form")}
                    >
                      + Create First Setting
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button className="button button-secondary" onClick={handleBack}>
                ← Back
              </button>
              <h2 className="card-title">
                {editMode
                  ? "Edit Shipment Setting"
                  : "Create New Shipment Setting"}
              </h2>
            </div>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit}>
              <div className="form-grid-custom">
                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">From Country</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.fromCountry}
                    onChange={(e) =>
                      handleInputChange("fromCountry", e.target.value)
                    }
                    placeholder="Enter origin country"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">To Country</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.toCountry}
                    onChange={(e) =>
                      handleInputChange("toCountry", e.target.value)
                    }
                    placeholder="Enter destination country"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">Price Per Kg</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.pricePerKg}
                    onChange={(e) =>
                      handleInputChange("pricePerKg", e.target.value)
                    }
                    placeholder="Enter price per kg"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">Clearance Fee</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.clearanceFee}
                    onChange={(e) =>
                      handleInputChange("clearanceFee", e.target.value)
                    }
                    placeholder="Enter clearance fee"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">Delivery Days</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="string"
                    className="form-input"
                    value={formData.deliveryDays}
                    onChange={(e) =>
                      handleInputChange("deliveryDays", e.target.value)
                    }
                    placeholder="Enter delivery days"
                    min="1"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">Category</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    placeholder="Enter category"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">Good Type</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.goodType}
                    onChange={(e) =>
                      handleInputChange("goodType", e.target.value)
                    }
                    placeholder="Enter good type"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">Shipment Type</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.shipmentType}
                    onChange={(e) =>
                      handleInputChange("shipmentType", e.target.value)
                    }
                    placeholder="Enter shipment type"
                  />
                </div>

                <div className="form-field-container">
                  <div className="form-field-header">
                    <label className="form-label">Weight (kg)</label>
                    {editMode && (
                      <button type="button" className="edit-button">
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="Enter weight in kg"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-field-container">
                <div className="form-field-header">
                  <label className="form-label">Delivery Type</label>
                  {editMode && (
                    <button type="button" className="edit-button">
                      Edit
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={formData.deliveryType}
                  onChange={(e) =>
                    handleInputChange("deliveryType", e.target.value)
                  }
                  placeholder="Enter delivery type"
                />
              </div>

              <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="button-content">
                      <span className="spinner"></span>
                      {editMode ? "Updating..." : "Creating..."}
                    </span>
                  ) : editMode ? (
                    "Update Setting"
                  ) : (
                    "Create Setting"
                  )}
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ====================================================================================
// --- SUB-COMPONENT for Customer Shipments Tab (Unchanged) ---
// ====================================================================================
const CustomerShipmentsList: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [loadingStatuses, setLoadingStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await getShipments();
      setShipments(response.data.shipments || []);
    } catch (err) {
      console.error("Failed to load shipments.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleStatusChange = async (
    shipmentId: string,
    newStatus: ShipmentStatus
  ) => {
    setLoadingStatuses((prev) => ({ ...prev, [shipmentId]: true }));

    try {
      await updateShipmentStatus({
        shipmentId,
        newStatus,
      });

      toast.success("Status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh the shipments list
      fetchShipments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      // Clear loading state for this shipment
      setLoadingStatuses((prev) => ({ ...prev, [shipmentId]: false }));
    }
  };

  if (loading) return <div className="page-loading">Loading Shipments...</div>;

  return (
    <div className="customer-shipments-list">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Shipment ID</th>
              <th>Tracking ID</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{`${shipment.user?.firstName || ""} ${
                  shipment.user?.lastName || "N/A"
                }`}</td>
                <td>{shipment.id}</td>
                <td>{shipment.trackingId || "N/A"}</td>
                <td>
                  <div className="status-wrapper">
                    {loadingStatuses[shipment.id] ? (
                      <div className="status-loading-select">
                        <span className="status-spinner-select"></span>
                        Updating...
                      </div>
                    ) : (
                      <select
                        className={`status-dropdown-select status-${shipment.shipmentStatus.toLowerCase()}`}
                        value={shipment.shipmentStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            shipment.id,
                            e.target.value as ShipmentStatus
                          )
                        }
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_TRANSIT">IN TRANSIT</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="CHECKED_OUT">CHECKED OUT</option>
                        <option value="NOT_CHECKED">NOT CHECKED</option>
                        <option value="ARRIVED_AT_LOCAL_HUB">
                          ARRIVED AT LOCAL HUB
                        </option>
                        <option value="ARRIVED_AT_NIGERIA_HUB">
                          ARRIVED AT NIGERIA HUB
                        </option>
                        <option value="ARRIVED_AT_UK_HUB">
                          ARRIVED AT UK HUB
                        </option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELED">CANCELED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="DECLINED">DECLINED</option>
                        <option value="ORDER_SUBMITTED">ORDER SUBMITTED</option>
                        <option value="ORDER_PAID_SUCCESSFULLY">
                          ORDER PAID SUCCESSFULLY
                        </option>
                        <option value="ORDER_PAYMENT_FAILED">
                          ORDER PAYMENT FAILED
                        </option>
                        <option value="ORDER_VERIFIED">ORDER VERIFIED</option>
                        <option value="AWAITING_SHIPMENT">
                          AWAITING SHIPMENT
                        </option>
                        <option value="FLIGHT_SEA_DEPARTURE">
                          FLIGHT/SEA DEPARTURE
                        </option>
                        <option value="CUSTOM_CLEARANCE">
                          CUSTOM CLEARANCE
                        </option>
                        <option value="ARRIVE_AT_THE_RECEIVING_HUB_CENTER">
                          ARRIVE AT THE RECEIVING HUB CENTER
                        </option>
                      </select>
                    )}
                  </div>
                </td>
                <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                <td className="action-cell">
                  <button
                    className="action-button"
                    onClick={() => navigate(`/shipments/${shipment.id}`)}
                  >
                    <IoEyeOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentPage;
