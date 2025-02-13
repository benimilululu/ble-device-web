
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './AddDevice.css';

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceType, setPriceType] = useState('price');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { storage } = require('../firebase');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddDevice = async () => {
    try {
      if (!deviceName || !deviceId || !category) {
        alert('Please fill in all required fields!');
        return;
      }
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `deviceImages/${Date.now()}-${image.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, image);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, 'devices'), {
        name: deviceName,
        id: deviceId,
        category,
        description,
        priceType,
        price: priceType === 'price' ? parseFloat(price) || 0 : null,
        discount: priceType === 'discount' ? parseFloat(discount) || 0 : null,
        imageUrl,
        addedAt: new Date().toISOString(),
      });

      alert('Device added successfully!');
      setDeviceName('');
      setDeviceId('');
      setCategory('');
      setDescription('');
      setPrice('');
      setDiscount('');
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error adding device:', error);
      alert('Failed to add device: ' + error.message);
    }
  };

  return (
    <div className="add-device-container">
      <h2 className="add-device-heading">Add New Device</h2>
      <div className="form-layout">
        <div className="form-group">
          <label className="form-label" htmlFor="deviceName">Device Name</label>
          <input
            type="text"
            id="deviceName"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="form-input"
            placeholder="Enter device name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="deviceId">Device ID</label>
          <input
            type="text"
            id="deviceId"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="form-input"
            placeholder="Enter device ID"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="">Select category</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Price Type</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="price"
                checked={priceType === 'price'}
                onChange={(e) => setPriceType(e.target.value)}
              />
              Regular Price
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="discount"
                checked={priceType === 'discount'}
                onChange={(e) => setPriceType(e.target.value)}
              />
              Discount
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            {priceType === 'price' ? 'Price ($)' : 'Discount (%)'}
          </label>
          <input
            type="number"
            value={priceType === 'price' ? price : discount}
            onChange={(e) => priceType === 'price' ? setPrice(e.target.value) : setDiscount(e.target.value)}
            className="form-input"
            placeholder={priceType === 'price' ? 'Enter price' : 'Enter discount percentage'}
            min="0"
            max={priceType === 'discount' ? "100" : ""}
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            placeholder="Enter device description"
            rows="4"
          />
        </div>

        <div className="form-group full-width">
          <div className="image-upload-container">
            <label className="image-upload-label" htmlFor="image">
              {image ? 'Change Image' : 'Upload Image'}
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
          </div>
        </div>

        <button onClick={handleAddDevice} className="add-device-button">
          Add Device
        </button>
      </div>
    </div>
  );
};

export default AddDevice;
