import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import GoogleAuthLogin from "./GoogleAuthLogin";
import KakaoOAuth from "./KakaoOAuth.js";
import Naver from "./Naver";
import soribwa_yellow from '../images/soribwa_yellow.png';
import show from '../images/eyes.png';
import hidden from '../images/hidden.png';

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
        console.log(event.target.value);
    };

    const userPassword = event => {
        setPasswordValue(event.target.value);
        console.log(event.target.value);
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);

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
            // console.log(result.data[0])
            // console.log("e: ", result.data[0].email, emailValue)
            // console.log("p: ", result.data[0].password, passwordValue)
            console.log(result)
            if (result.data) {
                if (result.data[0].email) {
                    if (result.data[0].email == emailValue && result.data[0].password == passwordValue) {
                        sessionStorage.setItem("id", result.data[0].email);
                        sessionStorage.setItem("name", result.data[0].name);
                        sessionStorage.setItem("img", result.data[0].user_avatar);
                        navigate("/App")
                    }
                    // else if (result.data[0].email != emailValue) {
                    //     alert("이메일 틀림 ㅎ")
                    // }
                    else if (result.data[0].email != emailValue || result.data[0].password != passwordValue) {
                        alert("아이디나 비번 틀림 ㅎ")
                    }
                }
            } else {
                alert("아이디나 비번 틀림 ㅎ")
            }
            // sessionStorage.setItem("id", result.data[0].email);
            // sessionStorage.setItem("name", result.data[0].name);
            // sessionStorage.setItem("img", result.data[0].user_avatar);
            // if (result.data) {
            //     // Handle success
            // }
        } catch (error) {
            console.error("실패: ", error);
        }
    };

    const SignUp = () => {
        navigate("/Register");
    }

    return (
        <div className="fullscreen-container">
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
