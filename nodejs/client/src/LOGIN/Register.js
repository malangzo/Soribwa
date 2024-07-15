import React, { useState } from "react";
import "./Login.css";
import soribwa_yellow from '../images/soribwa_yellow.png';

const Register = () => {
    const [emailValue, setEmailValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
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

    async function register() {
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
            console.log("성공: ", result);
        } catch (error) {
            console.error("실패: ", error);
        }
    };

    return (
        <div className="fullscreen-container">
            <div className="login-main">
                <img src={soribwa_yellow} alt="Soribwa" className="soribwa-main-logo" />
                <p/>
                <div className="input_case">
                    <input id="email" type="text" placeholder="EMAIL" onChange={userEmail}/><p/>
                    <input id="name" type="text" placeholder="NAME" onChange={userName}/><p/>
                    <input id="password" type="text" placeholder="PASSWORD" onChange={userPassword}/><p/>
                </div>
                <div className="btn_case">
                    <button id="signup" onClick={register}>SIGN UP</button>
                </div>
            </div>
        </div>
    );
} 

export default Register;
