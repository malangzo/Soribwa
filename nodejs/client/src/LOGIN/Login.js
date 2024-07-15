import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import GoogleAuthLogin from "./GoogleAuthLogin";
import KakaoOAuth from "./KakaoOAuth.js";
import Naver from "./Naver";
import soribwa_yellow from '../images/soribwa_yellow.png';

const Login = () => {
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    const navigate = useNavigate();

    const userEmail = event => {
        setEmailValue(event.target.value);
        console.log(event.target.value);
    };

    const userPassword = event => {
        setPasswordValue(event.target.value);
        console.log(event.target.value);
    };

    async function login() {
        try {
            var data = { "email": emailValue, "password": passwordValue };
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            sessionStorage.setItem("name", result.data[0].name);
            if (result.data) {
                // Handle success
            }
        } catch (error) {
            console.error("실패: ", error);
        }
    };

    const SignUp = () => {
        navigate("/Register");
    }

    return (
        <div className="fullscreen-container">
            <div className="login-main">
                <img src={soribwa_yellow} alt="Soribwa" className="soribwa-main-logo" />
                <div className="input_case">
                    <input id="email" type="text" placeholder="EMAIL" value={emailValue} onChange={userEmail} /><p />
                    <input id="password" type="text" placeholder="PASSWORD" value={passwordValue} onChange={userPassword} /><p />
                </div>
                <div className="btn_case">
                    <button id="login" onClick={login}>LOGIN</button>&ensp;&ensp;&ensp;<button id="signup" onClick={SignUp}>SIGN UP</button><p />
                    <div id="social_login">
                        <GoogleAuthLogin />
                        <KakaoOAuth />
                        <Naver />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
