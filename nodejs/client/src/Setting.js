import React, { useState, useEffect } from 'react';
import './App.css';
import './Cycle.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import userAvatarDefault from './images/userAvatar.png';
import { Link } from 'react-router-dom';

const Setting = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [userAvatar, setUserAvatar] = useState(sessionStorage.getItem("img") ? sessionStorage.getItem("img") : userAvatarDefault);
  const [userName, setUserName] = useState(sessionStorage.getItem("name") ? sessionStorage.getItem("name") : "Undefined");

  useEffect(() => {
    sessionStorage.setItem("img", userAvatar);
    sessionStorage.setItem("name", userName);
  }, [userAvatar, userName]);


  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <main>
        <div className='setting'>
          <p>Setting</p>
          <div className='setting-buttons'>
            <p>Data</p>
            <Link to="/Userinfo">
              <button className='button'>회원 정보 수정</button>
            </Link>
            <button className='button'>마이크 볼륨 조절</button>
            <button className='button'>내 데이터</button>
            
            <p>User</p>
            <button className='button'>로그 아웃</button>
            <button className='button'>회원 탈퇴</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Setting;
