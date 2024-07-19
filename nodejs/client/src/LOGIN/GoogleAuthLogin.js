import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleAuthLogin = () => {
    return (
        <>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    const verified_data = jwtDecode(credentialResponse.credential)
                    if (verified_data.email_verified) {
                        sessionStorage.setItem("id", verified_data.email)
                        sessionStorage.setItem("name", verified_data.name)
                        sessionStorage.setItem("img", verified_data.picture)
                        }
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