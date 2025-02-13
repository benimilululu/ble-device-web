import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import db from firebase.js
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import './AddDevice.css';

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceType, setPriceType] = useState('price');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceExists, setDeviceExists] = useState(false); // New state for checking device ID
  const [errorMessage, setErrorMessage] = useState('');

  // Function to check if the device ID exists
  useEffect(() => {
    const checkDeviceId = async () => {
      if (!deviceId) {
        setDeviceExists(false); // If device ID is empty, reset the error state
        return;
      }

      try {
        const q = query(collection(db, 'devices'), where('id', '==', deviceId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setDeviceExists(true);
          setErrorMessage('Device ID already exists');
        } else {
          setDeviceExists(false);
          setErrorMessage('');
        }
      } catch (error) {
        console.error('Error checking device ID:', error);
        setDeviceExists(false);
        setErrorMessage('');
      }
    };

    checkDeviceId();
  }, [deviceId, db]); // Check device ID whenever it changes

  const handleAddDevice = async () => {
    if (!deviceName || !deviceId || !category) {
      alert('Please fill in all required fields!');
      return;
    }

    if (deviceExists) {
      alert('Please choose a unique device ID.');
      return;
    }

    if (priceType === 'price' && (isNaN(price) || parseFloat(price) < 0)) {
      alert('Please enter a valid price.');
      return;
    }

    if (priceType === 'discount' && (isNaN(discount) || parseFloat(discount) < 0 || parseFloat(discount) > 100)) {
      alert('Please enter a valid discount percentage (0-100).');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'devices'), {
        name: deviceName,
        id: deviceId,
        category,
        description,
        priceType,
        price: priceType === 'price' ? parseFloat(price) : null,
        discount: priceType === 'discount' ? parseFloat(discount) : null,
        addedAt: new Date().toISOString(),
      });

      alert('Device added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding device:', error);
      alert('Failed to add device: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDeviceName('');
    setDeviceId('');
    setCategory('');
    setDescription('');
    setPrice('');
    setDiscount('');
  };

  return (
    <div className="add-device-container">
      <h2 className="add-device-heading">Add New Device</h2>
      <div className="form-layout">
        {/* Device Name */}
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

        {/* Device ID */}
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
          {deviceExists && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        </div>

        {/* Category */}
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

        {/* Price Type */}
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

        {/* Price/Discount Input */}
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

        {/* Submit Button */}
        <button onClick={handleAddDevice} className="add-device-button" disabled={loading}>
          {loading ? 'Adding Device...' : 'Add Device'}
        </button>
      </div>
    </div>
  );
};

export default AddDevice;
