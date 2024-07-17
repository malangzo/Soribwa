import React, { useState, useCallback, useEffect } from "react";
import Session from "react-session-api";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function NaverLogin() {
    const code = new URL(document.URL).searchParams.get("code");
    const state = new URL(document.URL).searchParams.get("state");
    console.log("test code0: ", code);
    console.log("test state: ", state);

    const navigate = useNavigate();

    
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const NAVER_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;
    const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI_LOGIN;
    const NAVER_REDIRECT_URIN = process.env.REACT_APP_NAVER_REDIRECT_URI_NLOGIN;
    const REDIRECT_URI = encodeURI(NAVER_REDIRECT_URIN);
    const NAVER_TOKEN_URL = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}&state=${state}`;
    const header = {'X-Naver-Client-Id': NAVER_CLIENT_ID, 'X-Naver-Client-Secret': NAVER_SECRET, 'content-type': 'application/json;charset=utf-8',};

    const getToken = async () => {
        try {
            const res = await axios({
                method: 'GET',
                headers: header, 
                    url:NAVER_TOKEN_URL,
                });
        } catch (err) {
            console.log(err);
        }
        navigate("/App");
    };

    useEffect(() => {
        getToken();
    }, []);


    return <div></div>
}