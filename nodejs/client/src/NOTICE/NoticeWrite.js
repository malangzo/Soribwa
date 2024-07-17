import React, { useState, useEffect } from "react";
import './Notice.css';
import Editor from '../components/Editor';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const REACT_APP_YUJUNG_FASTAPI = process.env.REACT_APP_YUJUNG_FASTAPI;

const NoticeWrite = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    function onTitleChange(e) {
        setTitle(e.target.value);
    }

    function stripHtmlAndExtractImage(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        
        const imgTag = tmp.querySelector('img');
        let imageData = null;
        if (imgTag) {
            const src = imgTag.getAttribute('src');
            imageData = src && src.startsWith('data:image') ? src : null;
            imgTag.replaceWith('');
        }
    
        const plainText = tmp.textContent || tmp.innerText || "";
        return { plainText, imageData };
    }

    function resizeAndCompressImage(base64Str, maxWidth = 800, maxHeight = 600) {
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

                resolve(canvas.toDataURL('image/jpeg', 0.7)); 
            };
        });
    }
    
    function onEditorChange(value) {
        setContent(value)
    }

    const saveNotice = async () => {
        try {
            const { plainText, imageData } = await stripHtmlAndExtractImage(content);
            
            let processedImageData = imageData;
            if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image')) {
                processedImageData = await resizeAndCompressImage(imageData);
            }

            const response = await fetch(`${REACT_APP_YUJUNG_FASTAPI}/noticeInsert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content: plainText,
                    file: processedImageData && typeof processedImageData === 'string' 
                    ? processedImageData.split(',')[1] 
                    : null 
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result.notice_no) {
                navigate(`/NoticeContent/${result.notice_no}`);
            } else {
                throw new Error('No notice number returned');
            }
        } catch (error) {
            console.error('Error saving notice:', error);
            alert('게시글 저장 중 오류가 발생했습니다.');
        }
    }

    useEffect(() => {
    }, []);
    
    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main style= {{ padding: '0px' }}>
            <div className="notice-container">

                <div className="notice-content">
                    <div className='notice-top'>
                        <Link to = "/NoticeList"><div className='arrow'>{'<'}</div></Link>
                        <div className='title'>글쓰기</div>
                    </div>
                    <div className='notice-body'>
                        <input type="text" placeholder="제목" className="input-title" onChange={onTitleChange}/>
                        <Editor value={content} onChange={onEditorChange} />
                    </div>
                    <div className='notice-bottom'>
                        <button className='button' onClick={saveNotice}>저장</button>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
        </div>
    );
};

export default NoticeWrite;