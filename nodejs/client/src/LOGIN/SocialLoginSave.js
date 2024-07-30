import React, { useState, useCallback, useEffect } from "react";
import Session from "react-session-api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

<link rel="manifest" href="/manifest.json" />

export default function SocialLoginSave() {
    const id = new URL(document.URL).searchParams.get("id");
    const nickname = new URL(document.URL).searchParams.get("nickname");
    const img = new URL(document.URL).searchParams.get("img");
    const role = new URL(document.URL).searchParams.get("role");
    const navigate = useNavigate();

    const getUserInfo = async () => {
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("name", nickname);
        sessionStorage.setItem("img", img);
        sessionStorage.setItem("role", role)
        console.log("session data saved...", id, nickname, img, role);
        navigate("/App");
    };

    useEffect(() => {
        getUserInfo();
    }, []);
    

    return <div></div>
}