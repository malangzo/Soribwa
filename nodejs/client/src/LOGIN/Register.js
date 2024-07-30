import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "./Login.css";
import soribwa_yellow from '../images/soribwa_yellow.png';
import show from '../images/eyes.png';
import hidden from '../images/hidden.png';
import Swal from "sweetalert2";

<link rel="manifest" href="/manifest.json" />

const Register = () => {
    const [emailValue, setEmailValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [passwordcheckValue, setPasswordcheckValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const [ emailAuthCode, setEmailAuthCode ] = useState("");
    const [ inputAuthCode, setInputAuthCode ] = useState("");
    const [ emailsend, setEmailSend ] = useState(false);
    // + Email Auth Code Email Send Return Value
    // + Email Auth Code Input Tag Value 
    // + Email Auth Valid Check
    // + Each Function +3

    const navigate = useNavigate()
    const REGISTER_URL = process.env.REACT_APP_REGISTER_URL;
    const EMAILAUTH_URL = process.env.REACT_APP_REGISTER_EMAILAUTH_UR;

    const userEmail = event => {
        setEmailValue(event.target.value);
    }

    const userName = event => {
        setNameValue(event.target.value);
    }

    const userPassword = event => {
        setPasswordValue(event.target.value);
    }

    const userAuthCode = event => {
        setInputAuthCode(event.target.value);
        console.log(event.target.value);
    }

    const userPasswordcheck = event => {
        setPasswordcheckValue(event.target.value);
    }

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowPasswordCheck = () => setShowPasswordCheck(!showPasswordCheck);

    function noti(tags) {
        const email = document.getElementById("email")
        const name = document.getElementById("name")
        const password = document.getElementById("password")
        const passwordcheck = document.getElementById("passwordcheck")
        const code = document.getElementById("code")

        const keys = [email, name, password, passwordcheck, code]

        for (const name of keys) {
            if (tags.includes(name.id)) {
                name.style.borderColor = 'red'
            } else {
                name.style.borderColor = 'white'
            }
        }
}

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
                console.log('error: ', result.status)

                console.log("check register: ", result.status, emailAuthCode, inputAuthCode, emailsend)
                if (result.status == 200) {
                    if (emailAuthCode == inputAuthCode && emailsend == true) {
                        navigate("/")
                        Swal.fire({icon:'success', title:'', text:'회원가입이 완료되었습니다.', confirmButtonText:'확인'})
                    } else {
                        noti(['code'])
                        Swal.fire({icon:'error', title:'', text:'인증코드가 틀렸습니다.', confirmButtonText:'확인'})
                    }
                } else {
                    console.log('error: ', result.status)
                    Swal.fire({icon:'warning', title:'', text:result.message, confirmButtonText:'확인'})
                }
            } catch (error) {
                console.error("실패: ", error);
            }
        } else {
            // const password = document.getElementById("password")
            // const passwordcheck = document.getElementById("passwordcheck")
            // password.style.borderColor= 'red';
            // passwordcheck.style.borderColor= 'red';
            noti(['password', 'passwordcheck'])
            Swal.fire({icon:'error', title:'', text:'비밀번호가 일치하지 않습니다.', confirmButtonText:'확인'})
        }  
    };


    // + Email Auth button
    // + Email Auth Code input Tag ++ Email Auth Code Input Check button
    async function emailAuth() {
        //try{
            const response = await fetch("https://jnodejs.soribwa.com/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"email":emailValue})
            });

            const result = await response.json();
            console.log(result)
            if (result.status == 200) {
                setEmailAuthCode(result.code || result.data.code);
                setEmailSend(true);
            } else {
                noti(['email'])
                Swal.fire({icon: 'warning', title: '', text: result.message, confirmButtonText: '확인'})
            }
            //console.log("성공: ", results.code || results.data.code);
        //} catch (error) {
         //   return("메일 전송 에러: ", error);
        //}
    }


    return (
        <div className="fullscreen-container">
            <div className="main-logo"><img src={soribwa_yellow} alt="Soribwa" className="soribwa-main-logo" /></div>
            <div className="login-main">
                <div className="input_case">
                    <input id="email" type="text" placeholder="EMAIL" onChange={userEmail}/><button onClick={emailAuth}>인증번호 전송</button><p/>
                    <input id="code" type="text" placeholder="INPUT CODE" onChange={userAuthCode}/><p/>
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
