import { GoogleLogin } from "@react-oauth/google";

const GoogleAuthLogin = () => {
    return (
        <>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    // console.log("Google Login check: ", jwtDecode(credentialResponse.credential));
                }}
                onError={() => {
                    console.log("Login 실패");
                }}
                shape="circle"
                type="icon"
                useOneTap
            />
        </>
    );
};

export default GoogleAuthLogin;