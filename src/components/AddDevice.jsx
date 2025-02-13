import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './AddDevice.css';

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const storage = getStorage();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddDevice = async () => {
    if (!deviceName || !deviceId || !category) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const storageRef = ref(storage, `deviceImages/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // Handle unsuccessful uploads
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
        }, 
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            addDoc(collection(db, 'devices'), {
              name: deviceName,
              id: deviceId,
              category: category,
              description: description,
              price: parseFloat(price) || 0,
              image: downloadURL,
              addedAt: new Date().toISOString(),
            }).then(() => {
              alert('Device added successfully!');
              setDeviceName('');
              setDeviceId('');
              setCategory('');
              setDescription('');
              setPrice('');
              setImage(null);
              setImagePreview('');
            }).catch((error) => {
              console.error('Error adding device:', error);
              alert('Failed to add device');
            });
          });
        }
      );


    } catch (error) {
      console.error('Error adding device:', error);
      alert('Failed to add device');
    }
  };

  return (
    <div className="add-device-container">
      <h2 className="add-device-heading">Add BLE Device</h2>
      <div className="form-group">
        <label htmlFor="deviceName">Device Name:</label>
        <input
          type="text"
          id="deviceName"
          placeholder="Device Name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="deviceId">Device ID:</label>
        <input
          type="text"
          id="deviceId"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
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
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="imageUpload">Image:</label>
        <input
          type="file"
          id="imageUpload"
          onChange={handleImageChange}
          className="form-input"
        />
        {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
      </div>
      <button onClick={handleAddDevice} className="add-device-button">
        Add Device
      </button>
    </div>
  );
};

export default AddDevice;