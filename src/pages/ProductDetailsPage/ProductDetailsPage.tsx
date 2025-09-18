// ProductDetailsPage.tsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Package,
  Calendar,
  DollarSign,
  Hash,
  FileText,
} from "lucide-react";
import "./ProductDetailsPage.css";

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  productStatus: "IN_STOCK" | "OUT_OF_STOCK" | "N/A";
  image: string[];
  adminId: string | null;
}

const ProductDetailsPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Sample data based on your API response
  const product: Product = {
    id: "ckx1a0abc040",
    name: "fine-Pineapples",
    price: "5.99",
    quantity: 17,
    description: "Juicy tropical pineapples packed with flavor.",
    createdAt: "2025-06-03T10:04:03.604Z",
    updatedAt: "2025-08-18T16:52:15.506Z",
    productStatus: "IN_STOCK",
    image: [
      "https://cdn.pixabay.com/photo/2020/04/29/12/47/pineapple-5108775_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/05/19/18/05/pineapple-3413953_1280.jpg",
      "https://cdn.pixabay.com/photo/2018/11/11/15/42/pineapple-3808963_1280.jpg",
    ],
    adminId: null,
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Product["productStatus"]): string => {
    switch (status) {
      case "IN_STOCK":
        return "#10b981";
      case "OUT_OF_STOCK":
        return "#ef4444";
      case "N/A":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const nextImage = (): void => {
    setCurrentImageIndex((prev) => (prev + 1) % product.image.length);
  };

  const prevImage = (): void => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.image.length) % product.image.length
    );
  };

  return (
    <div className="product-details-container">
      {/* Header */}
      <div className="product-header">
        <div className="header-left">
          <button className="back-button">
            <ArrowLeft size={16} />
            Back to Products
          </button>
          <h1 className="header-title">Product Details</h1>
        </div>

        <div className="header-buttons">
          <button className="edit-button">
            <Edit3 size={16} />
            Edit Product
          </button>
          <button className="delete-button">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="product-content-con">
        {/* Left Column - Images */}
        <div className="images-container">
          <h3 className="images-title">Product Images</h3>

          {/* Main Image */}
          <div className="main-image-container">
            <img
              src={product.image[currentImageIndex]}
              alt={product.name}
              className="main-image"
            />

            {product.image.length > 1 && (
              <>
                <button onClick={prevImage} className="nav-button prev-button">
                  ‹
                </button>
                <button onClick={nextImage} className="nav-button next-button">
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.image.length > 1 && (
            <div className="thumbnails-container">
              {product.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`thumbnail ${
                    index === currentImageIndex
                      ? "thumbnail-active"
                      : "thumbnail-inactive"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="info-column">
          {/* Basic Info Card */}
          <div className="info-card">
            <h2 className="product-name">{product.name}</h2>

            <div className="info-items-container">
              <div className="info-item">
                <DollarSign size={20} className="info-icon" />
                <span className="info-text">Price:</span>
                <span className="price-text">₦{product.price}</span>
              </div>

              <div className="info-item">
                <Package size={20} className="info-icon" />
                <span className="info-text">Quantity:</span>
                <span className="quantity-text">{product.quantity}</span>
              </div>

              <div className="info-item">
                <div
                  className="status-indicator"
                  style={{
                    backgroundColor: getStatusColor(product.productStatus),
                  }}
                ></div>
                <span className="info-text">Status:</span>
                <span
                  className="status-text"
                  style={{
                    color: getStatusColor(product.productStatus),
                    backgroundColor: `${getStatusColor(
                      product.productStatus
                    )}20`,
                  }}
                >
                  {product.productStatus.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="info-card">
            <div className="description-header">
              <FileText size={20} className="info-icon" />
              <h3 className="description-title">Description</h3>
            </div>
            <p className="description-text">{product.description}</p>
          </div>

          {/* Metadata Card */}
          <div className="info-card">
            <h3 className="metadata-title">Product Information</h3>

            <div className="metadata-items-container">
              <div className="metadata-item">
                <Hash size={18} className="metadata-icon" />
                <span className="metadata-label">Product ID:</span>
                <span className="metadata-value product-id">{product.id}</span>
              </div>

              <div className="metadata-item">
                <Calendar size={18} className="metadata-icon" />
                <span className="metadata-label">Created:</span>
                <span className="metadata-value">
                  {formatDate(product.createdAt)}
                </span>
              </div>

              <div className="metadata-item">
                <Calendar size={18} className="metadata-icon" />
                <span className="metadata-label">Updated:</span>
                <span className="metadata-value">
                  {formatDate(product.updatedAt)}
                </span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Admin ID:</span>
                <span className="metadata-value">
                  {product.adminId || "Not assigned"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
