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
    const uuid = new URL(document.URL).searchParams.get("uuid");
    const navigate = useNavigate();

    const getUserInfo = async () => {
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("name", nickname);
        sessionStorage.setItem("img", img);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("uuid", uuid);
        console.log("session data saved...", id, nickname, img, role);

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
        await insertToken(uuid, fcmToken);

        navigate("/App");
    };

    useEffect(() => {
        getUserInfo();
    }, []);
    

    return <div></div>
}