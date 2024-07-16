import React, { useState, useEffect } from "react";
import './Notice.css';
import Editor from '../components/Editor';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';

const NoticeEdit = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { notice_no } = useParams();
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (location.state && location.state.notice) {
            setTitle(location.state.notice.title);
            setContent(location.state.notice.content + (location.state.notice.file ? `<img src="data:image/jpeg;base64,${location.state.notice.file}" />` : ''));
        } else {
            fetchNotice();
        }
    }, [notice_no, location]);

    const fetchNotice = async () => {
        try {
            const response = await fetch(`http://43.202.99.19:5200/noticeContent/${notice_no}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTitle(data.title);
            setContent(data.content + (data.file ? `<img src="data:image/jpeg;base64,${data.file}" />` : ''));
        } catch (error) {
            console.error('Error fetching notice:', error);
            alert('게시글을 불러오는 데 실패했습니다.');
        }
    };

    function onTitleChange(e) {
        setTitle(e.target.value);
    }

    function onEditorChange(value) {
        setContent(value)
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

    const updateNotice = async () => {
        try {
            const { plainText, imageData } = await stripHtmlAndExtractImage(content);
            
            let processedImageData = imageData;
            if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image')) {
                processedImageData = await resizeAndCompressImage(imageData);
            }

            const response = await fetch(`http://43.202.99.19:5200/noticeUpdate/${notice_no}`, {
                method: 'PUT',
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
            navigate(`/NoticeContent/${notice_no}`);
        } catch (error) {
            console.error('Error updating notice:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main>
        <div className="notice-container">
            <div className="notice-header">
                <div className="header-title">NOTICE</div>
                <div className="add-icon">{'+'}</div>
            </div>
            <div className="notice-content">
                <div className='notice-top'>
                    <Link to={`/NoticeContent/${notice_no}`}><div className='arrow'>{'<'}</div></Link>
                    <div className='title'>글 수정<p></p></div>
                </div>
                <div className='notice-body'>
                    <input type="text" placeholder="제목" className="input-title" value={title} onChange={onTitleChange}/>
                    <Editor value={content} onChange={onEditorChange} />
                </div>
                <div className='notice-bottom'>
                    <button className='button' onClick={updateNotice}>수정</button>
                </div>
            </div>
        </div>
        </main>
        <Footer />
        </div>
    );
};

export default NoticeEdit;