import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "./Login.css";
import soribwa_yellow from '../images/soribwa_yellow.png';
import show from '../images/eyes.png';
import hidden from '../images/hidden.png';

const Register = () => {
    const [emailValue, setEmailValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [passwordcheckValue, setPasswordcheckValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const navigate = useNavigate()
    const REGISTER_URL = process.env.REACT_APP_REGISTER_URL;

    const userEmail = event => {
        setEmailValue(event.target.value);
    }

    const userName = event => {
        setNameValue(event.target.value);
    }

    const userPassword = event => {
        setPasswordValue(event.target.value);
    }

    const userPasswordcheck = event => {
        setPasswordcheckValue(event.target.value);
    }

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowPasswordCheck = () => setShowPasswordCheck(!showPasswordCheck);

    async function register(e) {
        e.preventDefault();
        if (passwordValue == passwordcheckValue) {
            try {
                var data = { "email": emailValue, "name": nameValue, "password": passwordValue }
                const response = await fetch(REGISTER_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                });
    
                const result = await response.json();
                if (result.status == 200) {
                    console.log("성공: ", result);
                    navigate("/")
                    alert("훼왢개엛 덺")
                } 
            } catch (error) {
                console.error("실패: ", error);
            }
        } else {
            alert("비밀번호가 일치하지 않습니다.");
        }  
    };

    return (
        <div className="fullscreen-container">
            <div className="main-logo"><img src={soribwa_yellow} alt="Soribwa" className="soribwa-main-logo" /></div>
            <div className="login-main">
                <div className="input_case">
                    <input id="email" type="text" placeholder="EMAIL" onChange={userEmail}/><p/>
                    <input id="name" type="text" placeholder="NAME" onChange={userName}/><p/>
                    <div style={{ position: "relative" }}>
                        <input id="password" type={showPassword ? "text" : "password"} placeholder="PASSWORD" onChange={userPassword} />
                        <img src={showPassword ? show : hidden} alt="show" style={{ position: "absolute", top: "40%", right: "10px", transform: "translateY(-50%)" }} onClick={toggleShowPassword} />
                    </div>
                    <p/>
                    <div style={{ position: "relative" }}>
                        <input id="passwordcheck" type={showPasswordCheck ? "text" : "password"} placeholder="PASSWORD CONFIRM" onChange={userPasswordcheck}/>
                        <img src={showPasswordCheck ? show : hidden} alt="show" style={{ position: "absolute", top: "40%", right: "10px", transform: "translateY(-50%)" }} onClick={toggleShowPasswordCheck} />
                    </div>
                    <p/>
                </div>
                <div className="btn_case">
                    <button id="signup" onClick={register}>SIGN UP</button>
                </div>
            </div>
        </div>
    );
} 

export default Register;
