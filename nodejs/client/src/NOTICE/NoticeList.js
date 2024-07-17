import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Notice.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const REACT_APP_YUJUNG_FASTAPI = process.env.REACT_APP_YUJUNG_FASTAPI;

const NoticeList = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch(`${REACT_APP_YUJUNG_FASTAPI}/noticeList`);
                const data = await response.json();
                const sortedData = data.reverse()
                setNotices(sortedData);
                setTotalPages(Math.ceil(sortedData.length / perPage));
            } catch (error) {
                console.error('Error fetching notices:', error);
            }
        };

        fetchNotices();
    }, [perPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentNotices = notices.slice(startIndex, endIndex);
    const latestNotice = notices[0];
    const megaphone = '../images/megaphone.png';

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main style={{  display: 'block', alignItems: 'initial' }}>
            <div className='notice-container'>
                <div className="notice-header">
                    <div className="header-title">Notice</div>
                    <Link to = "/NoticeWrite" as="div" className="add-icon"><div className="add-icon">{'+'}</div></Link>
                </div>
                <div className="list">
                    {latestNotice && (
                        <Link to={`/NoticeContent/${latestNotice.no}`} as="div" className='notice-top'>
                        <div className='latest-notice'>
                            <img src={megaphone} className='new-icon' alt="new"/>
                            <div className="notice-title">{latestNotice.title}</div>
                            <div className="notice-arrow">{'>'}</div>
                        </div>
                        </Link>
                )}
                {currentNotices.map((notice) => (
                    <Link to={`/NoticeContent/${notice.no}`} key={notice.no} className='notice'>
                        <div className="noticelist">
                            <div className="notice-title">{notice.title}</div>
                            <div className="notice-date">{new Date(notice.date).toISOString().split('T')[0]}</div>
                        </div>
                        <div className="notice-arrow">{'>'}</div>
                    </Link>
                ))}
            </div>
            <div className='pagination'>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={pageNumber === currentPage}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div>
    </main>
    <Footer />
    </div>
    );
};

export default NoticeList;