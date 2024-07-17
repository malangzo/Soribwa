import React, { useState, useCallback, useEffect } from "react";
import Session from "react-session-api";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function NaverLoginSave() {
    const id = new URL(document.URL).searchParams.get("id");
    const nickname = new URL(document.URL).searchParams.get("nickname");
    const img = new URL(document.URL).searchParams.get("img");
    const navigate = useNavigate();


    const getUserInfo = async () => {
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("name", nickname);
        sessionStorage.setItem("img", img);
        console.log("session data saved...", id, nickname, img);
        navigate("/App");
    };

    useEffect(() => {
        getUserInfo();
    }, []);


    return <div></div>
}