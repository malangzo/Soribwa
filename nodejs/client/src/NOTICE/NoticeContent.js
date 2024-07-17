import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Notice.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const REACT_APP_YUJUNG_FASTAPI = process.env.REACT_APP_YUJUNG_FASTAPI;

const NoticeContent = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { notice_no } = useParams();
    const [notice, setNotice] = useState({});
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchNotice();
    }, [notice_no]);


    const fetchNotice = async () => {
        try {
            const response = await fetch(`${REACT_APP_YUJUNG_FASTAPI}/noticeContent/${notice_no}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('게시글을 찾을 수 없습니다.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNotice(data);
        } catch (error) {
            console.error('Error fetching notice:', error);
            alert(error.message || '게시글을 불러오는 데 실패했습니다.');
        }
    };

    function stripHtml(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    function onClickUpdateNotice() {
        navigate(`/NoticeEdit/${notice_no}`, { state: { notice } });
    }

    async function onClickDeleteNotice() {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`${REACT_APP_YUJUNG_FASTAPI}/noticeDelete/${notice_no}`, {
                    method: 'DELETE',
                });

                const data = await response.json();
                alert('삭제되었습니다.');
                navigate('/NoticeList');
            } catch (error) {
                console.error('Error deleting notice:', error);
            }
        } else {
            alert('취소되었습니다.');
        }
    }

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main>
            <div className='notice-container'>
                <div className="notice-header">
                    <div className="header-title">NOTICE</div>
                    <Link to = "/NoticeWrite" as="div" className="add-icon"><div className="add-icon">{'+'}</div></Link>
                </div>
                <div className="notice-content">
                    <div className='notice-top'>
                        <Link to = "/NoticeList"><div className='arrow'>{'<'}</div></Link>
                        <div className='title'>{notice.title}</div>
                        <div className='date'>{notice.date && new Date(notice.date).toISOString().split('T')[0]}</div>
                    </div>
                    <div className='notice-body'>
                        {stripHtml(notice.content)}
                        {notice.file && (
                        <img src={`data:image/jpeg;base64,${notice.file}`} alt="게시글 이미지" style={{maxWidth: '100%', height: 'auto'}} />
                    )}
                    </div>
                    <div className='notice-bottom'>
                        <button className='button' onClick={onClickUpdateNotice}>수정</button>
                        <button className='button' onClick={onClickDeleteNotice}>삭제</button>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
    );
};

export default NoticeContent;