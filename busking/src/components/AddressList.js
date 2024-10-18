import React from 'react';
import './AddressList.css'; 

const AddressList = ({ addresses, onDeleteAddress }) => {
  return (
    <div className="address-list">
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {addresses.map((address) => (
          <li key={address.id} className="address-item">
            {address.value} {/* 주소만 표시 */}
            <button onClick={() => onDeleteAddress(address.id)} className="delete-button">삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressList;
