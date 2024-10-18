import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import axios from 'axios';
import Nav from './components/Nav';
import AddressInput from './components/AddressInput';
import Map from './components/Map';
import AddressList from './components/AddressList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Algorithm from './pages/Algorithm';
import './App.css';

const App = () => {

  const [addresses, setAddresses] = useState([]);

  const handleAddAddress = async (newAddresses) => {
    const addressesToAdd = Array.isArray(newAddresses) ? newAddresses : [newAddresses];
    const updatedAddresses = addressesToAdd.map((address) => ({
      lat: address.lat,
      lng: address.lng,
      value: address.value,
    }));
  
    try {
      // 서버로 주소 추가 요청
      const response = await axios.post('http://localhost:5000/api/addresses', updatedAddresses);
  
      // 서버에서 응답 받은 후 주소 업데이트
      setAddresses((prevAddresses) => [...prevAddresses, ...response.data]);
    } catch (error) {
      console.error('주소 추가 실패:', error);
    }
  };
  

  const handleDeleteAddress = async (id) => {
    try {
      // 서버로 주소 삭제 요청
      await axios.delete(`http://localhost:5000/api/addresses/${id}`);

      // 주소 삭제 후 상태 업데이트
      setAddresses(addresses.filter(address => address.id !== id));
    } catch (error) {
      console.error('주소 삭제 실패:', error);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/addresses');
        setAddresses(response.data);
      } catch (error) {
        console.error('주소 가져오기 실패:', error);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <LoadScript googleMapsApiKey="당신의 API 키 입력 ">
      <Router>
        <div>
          <Nav />
          <Routes>
            <Route path="/" element={
              <div>
                <AddressInput onAddAddress={handleAddAddress} />
                <Map addresses={addresses} />
                <AddressList addresses={addresses} onDeleteAddress={handleDeleteAddress} />
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/algorithm" element={<Algorithm />} />
          </Routes>
        </div>
      </Router>
    </LoadScript>
  );
};

export default App;
