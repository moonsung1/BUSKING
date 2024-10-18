import React, { useState } from 'react';
import './AddressInput.css';

const AddressInput = ({ onAddAddress }) => {
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(null);

  // 직접 입력한 주소 추가
  const handleAddAddress = async (e) => {
    e.preventDefault();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, async (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const newAddress = { 
          lat: location.lat(), 
          lng: location.lng(), 
          value: address 
        };
        await onAddAddress(newAddress); // 주소 추가
        setAddress(''); // 입력 필드 초기화
      } else {
        console.error('Geocoding failed: ' + status);
      }
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 주소 한 개에 대해 지오코딩 처리
  const geocodeAddress = (geocoder, address) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            value: address
          });
        } else {
          reject('Geocoding failed for address: ' + address + ' - ' + status);
        }
      });
    });
  };

  // 파일 업로드 시 여러 주소 처리
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return; // 파일이 없는 경우 처리 중단

    const text = await file.text(); // 파일 내용을 텍스트로 읽기
    const addresses = text.split('\n').map(line => line.trim()).filter(line => line); // 각 줄을 주소로 분리

    const geocoder = new window.google.maps.Geocoder();
    const promises = addresses.map(address => geocodeAddress(geocoder, address));

    try {
      const geocodedAddresses = await Promise.all(promises); // 모든 주소에 대해 지오코딩 완료될 때까지 기다림
      geocodedAddresses.forEach(addr => onAddAddress(addr)); // 각 주소를 App.js로 전달
    } catch (error) {
      console.error(error);
    }

    setFile(null); // 파일 필드 초기화
  };

  return (
    <div className="address-input-container">
      <form onSubmit={handleAddAddress}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="주소 입력 (도로명주소)"
          required
          className="address-input" 
        />
        <button type="submit" className="address-button">주소 추가</button>
      </form>

      <form onSubmit={handleFileUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} required className="file-input" />
        <button type="submit" className="file-button">파일 업로드</button>
      </form>
    </div>
  );
};

export default AddressInput;
