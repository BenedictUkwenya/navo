import React, { useState, useEffect, useMemo, useRef } from 'react'; // <-- useRef IS NOW IMPORTED
import { useNavigate } from 'react-router-dom';
import './ProductsPage.css';

// API Services and Types
import { getOrders } from '../../services/purchaseOrderService';
import { getAllProducts, createProduct, updateProductStatus, deleteProduct } from '../../services/productService';
import { Order } from '../../types/order';
import { Product } from '../../types/product';

// Component and Icon Imports
import ProductFormModal from '../../compoonents/ProductFormModal/ProductFormModal';
import viewDetailsIcon from '../../assets/images/eyeicon.png';
import deleteIcon from '../../assets/images/comments.png';
import chevronDownIcon from '../../assets/images/dropdownarrow.png';
import filterIcon from '../../assets/images/filterIcon.png';
import searchIcon from '../../assets/images/searchicon.png';
import prevIcon from '../../assets/images/previcon.png';
import nextIcon from '../../assets/images/nexticon.png';

type ProductTab = 'products' | 'orders';

const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProductTab>('products');
  const [showModal, setShowModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [forceRefetch, setForceRefetch] = useState(0); // State to trigger refetch

  const handleCreateProduct = async (formData: FormData) => {
    setLoadingAction(true);
    try {
      await createProduct(formData);
      alert('Product created successfully!');
      setShowModal(false);
      // Trigger a refetch of the product list
      setForceRefetch(count => count + 1);
    } catch (error) {
      alert('Failed to create product.');
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <AllProductsTab onAddProduct={() => setShowModal(true)} refetchKey={forceRefetch} />;
      case 'orders':
        return <OrdersTab />;
      default:
        return null;
    }
  };

  return (
    <div className="products-page">
      <header className="page-header">
        <h3>Products</h3>
        <div className="page-controls">
          <button className="filter-btn"><img src={filterIcon} alt="Filter" /></button>
          <div className="page-search-bar"><img src={searchIcon} alt="Search" /><input type="text" placeholder="Search..." /></div>
        </div>
      </header>
      
      <div className="page-content-wrapper">
        <div className="product-tabs">
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>All Products</button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        </div>
        <div className="product-content">
          {renderTabContent()}
        </div>
      </div>
      {showModal && <ProductFormModal onClose={() => setShowModal(false)} onSave={handleCreateProduct} loading={loadingAction} />}
    </div>
  );
};


// --- SUB-COMPONENT for "All Products" Tab ---
const AllProductsTab: React.FC<{ onAddProduct: () => void, refetchKey: number }> = ({ onAddProduct, refetchKey }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts();
        setProducts(response.data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refetchKey]); // Refetch whenever the key changes

  const handleStatusUpdate = async (productId: string, newStatus: string) => {
    try {
      await updateProductStatus(productId, newStatus);
      // Optimistically update the UI without a full refetch
      setProducts(current =>
        current.map(p => p.id === productId ? { ...p, productStatus: newStatus } : p)
      );
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Optimistically update the UI
        setProducts(current => current.filter(p => p.id !== productId));
      } catch {
        alert('Failed to delete product.');
      }
    }
  };
  if (loading) return <div className="page-loading">Loading products...</div>;

  return (
    <div className="all-products-tab">
      <div className="list-header"><div/><button className="action-button primary" onClick={onAddProduct}>+ Add New Product</button></div>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={product.image[0]} alt={product.name} className="product-image" /></td>
                <td>{product.name}</td><td>{`₦${product.price.toLocaleString()}`}</td><td>{product.quantity}</td>
                <td><StatusDropdown currentStatus={product.productStatus} onStatusChange={(newStatus) => handleStatusUpdate(product.id, newStatus)} /></td>
                <td className="action-cell"><img src={viewDetailsIcon} alt="View" className="action-icon" /><img src={deleteIcon} alt="Delete" className="action-icon" onClick={() => handleDelete(product.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Helper Component for Status Dropdown ---
const StatusDropdown: React.FC<{ currentStatus: string, onStatusChange: (status: string) => void }> = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['IN_STOCK', 'OUT_OF_STOCK', 'DISABLED'];
  const dropdownRef = useRef<HTMLDivElement>(null); // This line is now safe

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safety check for null or undefined status
  const displayStatus = currentStatus || 'N/A';

  return (
    <div className="status-dropdown-container" ref={dropdownRef}>
      <div className="status-badge-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <span className={`status-badge status-${displayStatus.toLowerCase().replace('_', '-')}`}>{displayStatus.replace('_', ' ')}</span>
        <img src={chevronDownIcon} alt="v" className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div className="status-dropdown-menu">
          {options.map(opt => (
            <div key={opt} className="dropdown-item" onClick={() => { onStatusChange(opt); setIsOpen(false); }}>
              {opt.replace('_', ' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT for "Orders" Tab ---
const OrdersTab: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders(currentPage);
        setOrders(response.data.allOrders || []);
        setTotalPages(response.data.pagination.totalPages || 1);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [currentPage]);

  if (loading) return <div className="page-loading">Loading orders...</div>;

  return (
    <>
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Order ID</th><th>Customer Name</th><th>Email</th><th>Date Created</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{`${order.user.firstName} ${order.user.lastName}`}</td>
                <td>{order.user.email}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td><img src={viewDetailsIcon} alt="View" className="action-icon" onClick={() => navigate(`/purchase-orders/${order.id}`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="page-footer">
        <div className="pagination-info">Page {currentPage} of {totalPages}</div>
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><img src={prevIcon} alt="Prev" /></button>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}><img src={nextIcon} alt="Next" /></button>
        </div>
      </footer>
    </>
  );
};

export default ProductsPage;