import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import axios from "axios";

import SideBar from '../../reusable_component/SideBar';
import styles from './dashboard.module.css';
import { AppContext } from '../../Contexts';
import { server_url } from '../../../creds/server_url';

export default function DashBoard() {
    const { user_details, socket } = useContext(AppContext);

    const chatRef = useRef(null);
    const bottomRef = useRef(null);
    const hasMounted = useRef(false);
    const prevMsgCount = useRef(0);

    const currentUserId = Number(user_details.id);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showNewMsgBtn, setShowNewMsgBtn] = useState(false);

    /* ---------------- INITIAL LOAD (jump to bottom instantly) ---------------- */
    useLayoutEffect(() => {
        if (!bottomRef.current || hasMounted.current || messages.length === 0) return;

        bottomRef.current.scrollIntoView({ behavior: "auto" });
        hasMounted.current = true;
        prevMsgCount.current = messages.length;
    }, [messages]);

    /* ---------------- HANDLE NEW MESSAGES ---------------- */
    useEffect(() => {
        if (!hasMounted.current) return;

        const newMessageArrived = messages.length > prevMsgCount.current;

        if (newMessageArrived) {
            if (autoScroll) {
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                setShowNewMsgBtn(false);
            } else {
                setShowNewMsgBtn(true);
            }
        }

        prevMsgCount.current = messages.length;
    }, [messages, autoScroll]);

    /* ---------------- SOCKET RECEIVE ---------------- */
    useEffect(() => {
        if (!socket) return;

        socket.on("receive_message", (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => socket.off("receive_message");
    }, [socket]);

    /* ---------------- FETCH OLD MESSAGES ---------------- */
    useEffect(() => {
        axios.get(`${server_url}/g-chat/messages`)
            .then(res => {
                const normalized = res.data.map(msg => ({
                    ...msg,
                    user_id: Number(msg.user_id)
                }));
                setMessages(normalized);
            })
            .catch(console.error);
    }, []);

    /* ---------------- SEND MESSAGE ---------------- */
    const sendMessage = () => {
        if (!message.trim()) return;

        socket.emit("send_message", {
            user_id: user_details.id,
            message
            // ⛔ DO NOT send created_at (server handles it)
        });

        setMessage('');
    };

    /* ---------------- FORMAT TIME ---------------- */
    const formatTime = (time) => {
        if (!time) return "";
        const date = new Date(time);
        if (isNaN(date.getTime())) return "";

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className={styles.dashboardMain}>
            <SideBar active_page="dashboard" location="/dashboard" />

            <div className={styles.body}>
                <div className={styles.header}>
                    <div className={styles.pageNameContainer}>
                        <h2 className={styles.global}>Global Chat</h2>
                        <p className={styles.smallName}>College Wide Discussions</p>
                    </div>

                    <div className={styles.headerInputContainer}>
                        <input className={styles.input} placeholder="search..." />
                    </div>
                </div>

                <div className={styles.line}></div>

                {/* CHAT MESSAGES */}
                <div
                    ref={chatRef}
                    onScroll={() => {
                        const el = chatRef.current;
                        const isNearBottom =
                            el.scrollHeight - el.scrollTop - el.clientHeight < 80;
                        setAutoScroll(isNearBottom);
                    }}
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "12px"
                    }}
                >
                    {messages.map((msg, index) => {
                        const isMe = Number(msg.user_id) === currentUserId;

                        return (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: isMe ? "flex-end" : "flex-start",
                                    marginBottom: "10px"
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "65%",
                                        padding: "10px 14px",
                                        borderRadius: "14px",
                                        backgroundColor: isMe ? "#4f46e5" : "#e5e7eb",
                                        color: isMe ? "#fff" : "#000",
                                        position: "relative"
                                    }}
                                >
                                    {!isMe && (
                                        <div style={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            marginBottom: "4px",
                                            opacity: 0.8
                                        }}>
                                            {msg.username}
                                        </div>
                                    )}

                                    <div style={{ paddingRight: "45px" }}>
                                        {msg.message}
                                    </div>

                                    <div style={{
                                        position: "absolute",
                                        bottom: "4px",
                                        right: "8px",
                                        fontSize: "11px",
                                        opacity: 0.7
                                    }}>
                                        {formatTime(msg.created_at)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* NEW MESSAGE BUTTON */}
                {showNewMsgBtn && (
                    <button
                        onClick={() => {
                            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                            setAutoScroll(true);
                            setShowNewMsgBtn(false);
                        }}
                        style={{
                            position: "fixed",
                            bottom: "90px",
                            right: "40px",
                            padding: "10px 14px",
                            borderRadius: "20px",
                            backgroundColor: "#4f46e5",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            zIndex: 1000
                        }}
                    >
                        ⬇ New messages
                    </button>
                )}

                {/* FOOTER */}
                <div className={styles.footer}>
                    <div className={styles.footerBox}>
                        <input
                            className={styles.messageInput}
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            className={styles.sendButton}
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
