import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import Firestore database
import { collection, getDocs } from 'firebase/firestore';
import './DeviceList.css'; // Add styles for the list

const DeviceList = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Fetch devices from Firestore
    const fetchDevices = async () => {
      const querySnapshot = await getDocs(collection(db, 'devices'));
      const devicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(devicesData);
    };

    fetchDevices();
  }, []);

  return (
    <div className="device-list-container">
      <h2 className="device-list-heading">Device List</h2>
      {devices.length > 0 ? (
        <ul className="device-list">
          {devices.map((device) => (
            <li key={device.id} className="device-item">
              <h3>{device.name}</h3>
              <p><strong>ID:</strong> {device.id}</p>
              <p><strong>Category:</strong> {device.category}</p>

              {/* Conditionally render description */}
              {device.description && (
                <p><strong>Description:</strong> {device.description}</p>
              )}

              {/* Conditionally render price or discount */}
              {device.priceType === 'price' && device.price && (
                <p><strong>Price:</strong> ${device.price}</p>
              )}
              {device.priceType === 'discount' && device.discount && (
                <p><strong>Discount:</strong> {device.discount}%</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No devices available</p>
      )}
    </div>
  );
};

export default DeviceList;
