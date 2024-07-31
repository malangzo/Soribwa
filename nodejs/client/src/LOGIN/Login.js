import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
//import GoogleAuthLogin from "./GoogleAuthLogin";
import GoogleLogin from "./GoogleLogin";
import KakaoOAuth from "./KakaoOAuth.js";
import Naver from "./Naver";
import soribwa_yellow from '../images/soribwa_yellow.png';
import show from '../images/eyes.png';
import hidden from '../images/hidden.png';
import Swal from "sweetalert2";
import LoginInfo from "../LoginInfo.js";

<link rel="manifest" href="/manifest.json" />;

const Login = () => {
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    const navigate = useNavigate();

    const userEmail = event => {
        setEmailValue(event.target.value);
    };

    const userPassword = event => {
        setPasswordValue(event.target.value);
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);

    async function login() {
        if (emailValue == '' && passwordValue == ''){
            Swal.fire({icon:'error', title:'',text:'이메일과 비밀번호를 입력해주세요.',confirmButtonText:'확인'})
        } else{
        try {
            var data = { "email": emailValue, "password": passwordValue };
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status) {
                if (result.status == 200) {
                    sessionStorage.setItem("accessToken", result.data.accessToken);
                    sessionStorage.setItem("id", result.data.email);
                    sessionStorage.setItem("name", result.data.name);
                    sessionStorage.setItem("img", result.data.user_avatar);
                    sessionStorage.setItem("role", result.data.role);

                    const insertToken = async (uuid, fcmToken) => {
                        try {
                            const response = await fetch(`${process.env.REACT_APP_FASTAPI}/insertToken`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ uuid: uuid, fcmToken: fcmToken, permission: "yes" })
                            });
                    
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                    
                            const result = await response.json();
                            console.log("Token inserted successfully:", result);
                        } catch (error) {
                            console.error("Failed to insert token:", error);
                        }
                    };
                    console.log('App route check')

                    const fcmToken = sessionStorage.getItem('fcmToken');
                    await insertToken(result.data.uuid, fcmToken);

                    navigate("/App");
                }
                else{
                    Swal.fire({icon:'error', title:'',text:result.message,confirmButtonText:'확인'});
                }
                }
        } catch (error) {
            console.error(error)
        }
    }
    };

    const SignUp = () => {
        navigate("/Register");
    }

    return (
        <div className="fullscreen-container">
            <LoginInfo />
            <div className="main-logo"><img src={soribwa_yellow} alt="Soribwa" className="soribwa-main-logo" /></div>
                <div className="login-main">
                    <div className="input_case">
                        <input id="email" type="text" placeholder="EMAIL" value={emailValue} onChange={userEmail} /><p />
                        <div style={{ position: "relative" }}>
                            <input id="password" type={showPassword ? "text" : "password"} placeholder="PASSWORD" value={passwordValue} onChange={userPassword} />
                            <img src={showPassword ? show : hidden} alt="show" style={{ position: "absolute", right: "10px", top: "40%", transform: "translateY(-50%)" }} onClick={toggleShowPassword} />
                        </div>
                        <p />
                    </div>
                    <div className="btn_case">
                        <button id="login" onClick={login}>LOGIN</button>&ensp;&ensp;&ensp;<button id="signup" onClick={SignUp}>SIGN UP</button><p />
                        <div id="social_login">
                            <GoogleLogin/>
                            <KakaoOAuth />
                            <Naver />
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Login;
