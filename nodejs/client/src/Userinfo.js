import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import userAvatarDefault from './images/userAvatar.png';

<link rel="manifest" href="/manifest.json" />

const REACT_APP_FASTAPI = process.env.REACT_APP_FASTAPI;

const UserInfo = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const [userAvatar, setUserAvatar] = useState(sessionStorage.getItem("img") ? sessionStorage.getItem("img"):userAvatarDefault);
    const [userName, setUserName] = useState(sessionStorage.getItem("name") ? sessionStorage.getItem("name"):"Undefined");
    const [newUserName, setNewUserName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [userRole, setUserRole] = useState(sessionStorage.getItem("role") ? sessionStorage.getItem("role"):"Undefined");

    const updateUserInfo = async (userName, userAvatar) => {
        try {
            const encodedId = encodeURIComponent(sessionStorage.getItem("id"));
            const encodedRole = encodeURIComponent(sessionStorage.getItem("role"));
            const response = await fetch(`${REACT_APP_FASTAPI}/userUpdate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: encodedId,
                    role: encodedRole,
                    name: userName,
                    img: userAvatar,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                alert("변경되었습니다.");
                return data;
            } else {
                const error = await response.json();
                console.error('Error:', error.detail);
            }
        } catch (error) {
            console.error('Error:', error.detail);
            alert("변경 중 오류가 발생했습니다.");
        }
    };

    const resizeAndCompressImage = async (base64Str, maxWidth = 300, maxHeight = 300) => {
        return new Promise((resolve) => {
            let img = new Image();
            img.src = base64Str;
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/png', 0.7)); 
            };
        });
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const base64str = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsDataURL(file);
                });
                
                const newUserAvatar = await resizeAndCompressImage(base64str);
                setUserAvatar(newUserAvatar);
                sessionStorage.setItem("img", newUserAvatar);
                await updateUserInfo(userName, newUserAvatar);
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }
    };

    const handleNameChange = async () => {
        try {
            setUserName(newUserName);
            sessionStorage.setItem("name", newUserName);
            setIsEditingName(false);
            await updateUserInfo(newUserName, userAvatar);
        } catch (error) {
            console.error('Error updating name:', error);
        }
    };

    useEffect(() => {
        sessionStorage.setItem("img", userAvatar);
        sessionStorage.setItem("name", userName);
    }, [userAvatar, userName]);
      

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            
            <main>
                <div className="user-info">
                    <img src={userAvatar} alt="UserAvatar" className='avatar' />
                    <div className="info-text">
                        <p><strong>NICKNAME : </strong>{userName}</p>
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