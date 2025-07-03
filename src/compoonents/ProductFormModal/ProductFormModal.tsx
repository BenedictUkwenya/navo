import React, { useState } from 'react';
import './ProductFormModal.css';

interface ModalProps {
  onClose: () => void;
  onSave: (formData: FormData) => void;
  loading: boolean;
}

const ProductFormModal: React.FC<ModalProps> = ({ onClose, onSave, loading }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  // === NEW: State for the product status, defaults to IN_STOCK ===
  const [productStatus, setProductStatus] = useState('IN_STOCK'); 
  const [images, setImages] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('description', description);
    // === THIS IS THE FIX: Add the status to the data being sent ===
    formData.append('productStatus', productStatus); 
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('image', images[i]);
      }
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-form-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Add New Product</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </header>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group"><label>Product Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="form-row">
            <div className="form-group"><label>Price</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} required /></div>
            <div className="form-group"><label>Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required /></div>
          </div>
          {/* === NEW: Status dropdown added to the form === */}
          <div className="form-group">
            <label>Status</label>
            <select value={productStatus} onChange={e => setProductStatus(e.target.value)} required>
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>
          <div className="form-group"><label>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required></textarea></div>
          <div className="form-group"><label>Product Images</label><input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} /></div>
          <footer className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;