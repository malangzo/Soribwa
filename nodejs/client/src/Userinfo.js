import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import userAvatarDefault from './images/userAvatar.png';

const UserInfo = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const [userAvatar, setUserAvatar] = useState(sessionStorage.getItem("img") ? sessionStorage.getItem("img"):userAvatarDefault);
    const [userName, setUserName] = useState(sessionStorage.getItem("name") ? sessionStorage.getItem("name"):"Undefined");
    const [id, setId] = useState(sessionStorage.getItem("id") ? sessionStorage.getItem("id"):"Undefined");
    const [newUserName, setNewUserName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        sessionStorage.setItem("img", userAvatar);
        sessionStorage.setItem("name", userName);
        sessionStorage.setItem("id", id);
    }, [userAvatar, userName]);


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUserAvatar(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };

    const handleNameChange = () => {
        setUserName(newUserName);
        sessionStorage.setItem("name", newUserName);
        setIsEditingName(false);
    };
      

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            
            <main>
                <div className="user-info">
                    <img src={userAvatar} alt="UserAvatar" className='avatar' />
                    <div className="info-text">
                        <p><strong>NAME : </strong>{userName}</p>
                        <p><strong>ID : </strong> {id}</p>
                    </div>
                </div>
                <div className='modify-buttons'>
                    <label className="modify-button">
                        프로필 사진 변경
                        <input type="file" style={{ display: 'none' }} onChange={handleImageChange} />
                    </label>
                    <button className="modify-button" onClick={() => setIsEditingName(true)}>이름 변경</button>
                </div>
            </main>
            {isEditingName && (
                <div className="modal-overlay">
                    <div className="modal">
                        <input 
                            type="text" 
                            value={newUserName} 
                            onChange={(e) => setNewUserName(e.target.value)} 
                            placeholder="새 이름 입력" 
                        />
                        <div className="modal-buttons">
                            <button onClick={handleNameChange}>확인</button>
                            <button onClick={() => setIsEditingName(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default UserInfo;