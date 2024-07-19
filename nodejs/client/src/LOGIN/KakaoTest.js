import React, { useState, useCallback, useEffect } from "react";
import Session from 'react-session-api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function KakaoTest() {
    const code = new URL(document.URL).searchParams.get("code");
    console.log("test code: ",code);
    const navigate = useNavigate();

    const headers = {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };

    console.log("0: ",process.env.REACT_APP_KAKAO_REST_API)
    console.log("1 ",process.env.REACT_APP_KAKAO_REDIRECT_URI)
    console.log("2: ",code)
    console.log("3: ",)

    const getToken = async () => {
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.REACT_APP_KAKAO_REST_API,
            redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
            code,
        };

        try {
            const res = await axios({method: 'POST', headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',}, 
                url:'https://kauth.kakao.com/oauth/token',
            data: payload});

            try {
                const res1 = await axios({
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${res.data.access_token}`
                    },
                    url: "https://kapi.kakao.com/v2/user/me",
                })
                if (res1.data.kakao_account.is_email_verified){
                    sessionStorage.setItem("id", res1.data.kakao_account.email)
                    sessionStorage.setItem("name", res1.data.kakao_account.profile.nickname)
                    sessionStorage.setItem("img", res1.data.kakao_account.profile.profile_image_url.replace("http", "https"))
                }
            } catch (err) {
                console.log(err);
            }
            navigate("/App");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getToken();
    }, []);


    return <div>{code}</div>
}