import logo from './logo.svg';
import './App.css';

import React from 'react';  
import AddDevice from './components/AddDevice';
import DeviceList from './components/DeviceList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <AddDevice className="AddDevice" />
      <DeviceList className="DeviceList" />
      </header>
    </div>
  );
}

export default App;
