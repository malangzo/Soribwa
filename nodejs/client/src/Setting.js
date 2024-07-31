import React, { useState, useEffect } from 'react';
import './App.css';
import './Cycle.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Backspace from './components/Backspace';
import userAvatarDefault from './images/userAvatar.png';
import { Link } from 'react-router-dom';

<link rel="manifest" href="/manifest.json" />

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

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('img');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('uuid');
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      const userId = sessionStorage.getItem("id");
      const role = sessionStorage.getItem("role");
      if (!userId) {
        alert("사용자 ID를 찾을 수 없습니다.");
        return;
      }
  
      try {
        const response = await fetch(`${process.env.REACT_APP_FASTAPI}/userDelete?id=${encodeURIComponent(userId)}&role=${encodeURIComponent(role)}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert("회원 탈퇴가 완료되었습니다.");
          sessionStorage.clear();
          window.location.href = '/';
        } else {
          const errorData = await response.json();
          alert(`회원 탈퇴 실패: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
      <Backspace />
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
            <button className='button'>푸시 알림 설정</button>

            &nbsp;&nbsp;&nbsp;
            <p>User</p>
            <Link to="#" onClick={handleLogout}>
              <button className='button'>로그아웃</button>
            </Link>
            <Link to="#" onClick={handleDeleteAccount}>
              <button className='button'>회원 탈퇴</button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Setting;
