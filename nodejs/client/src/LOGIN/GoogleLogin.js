import google from '../images/google.png';
<link rel="manifest" href="/manifest.json" />

const REST_API_KEY = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID;
const REST_API_PASSWORD = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_PASSWORD
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI



const googleLogin = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email profile`;
    const handleGoogleLogin = () => {
    window.location.href = url;
    }
    return(
        <>
            <div>
                <div onClick={handleGoogleLogin} className="GoogleButton">
                    <img src={google} alt="Google Login" width="40" height="40" style={{ borderRadius: '50%' }} />
                </div>
            </div>
        </>
    )
};

export default googleLogin;