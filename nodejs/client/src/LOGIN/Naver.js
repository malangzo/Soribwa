import axios from "axios";
const Naver = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const NAVER_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI_CALLBACK;
    const STATE = "true";
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
    console.log(NAVER_AUTH_URL);
    sessionStorage.setItem('asd', NAVER_AUTH_URL)

    const handleNaverLogin = async () => {
        window.location.href = NAVER_AUTH_URL;
    }
    return(
        <>
            <div>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleNaverLogin}>
                    <circle cx="20" cy="20" r="20" fill="white"/>
                    <g clipPath="url(#clip0_434_22)">
                    <path d="M24.273 20.845L15.376 8H8V32H15.726V19.156L24.624 32H32V8H24.273V20.845Z" fill="#0FA958"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_434_22">
                    <rect width="24" height="24" fill="white" transform="translate(8 8)"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>
        </>
    )
}

export default Naver;