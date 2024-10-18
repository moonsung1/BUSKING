
import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css'; 

const Nav = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
      <Link to="/" className="navbar-logo">버스킹</Link>
        <ul className="navbar-menu">
          <li><Link to="/login">로그인</Link></li>
          <li><Link to="/signup">회원가입</Link></li>
          <li><Link to="/algorithm">알고리즘</Link></li>
        </ul>
      </div>
    </nav> 
  );
};

export default Nav;
