import React, { useState } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import './AddDevice.css'; // Import CSS file for styling

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [category, setCategory] = useState('');

  const handleAddDevice = async () => {
    if (!deviceName || !deviceId || !category) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      // Add a new document to the "devices" collection in Firestore
      await addDoc(collection(db, 'devices'), {
        name: deviceName,
        id: deviceId,
        category: category,
        addedAt: new Date().toISOString(),
      });

      alert('Device added successfully!');
      
      // Clear the input fields
      setDeviceName('');
      setDeviceId('');
      setCategory('');
    } catch (error) {
      console.error('Error adding device:', error);
      alert('Failed to add device');
    }
  };

  return (
    <div className="add-device-container">
      <h2 className="add-device-heading">Add BLE Device</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Device Name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
          required
        >
          <option value="" disabled>Select Category</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Sports">Sports</option>
        </select>
      </div>
      <button onClick={handleAddDevice} className="add-device-button">
        Add Device
      </button>
    </div>
  );
};

export default AddDevice;