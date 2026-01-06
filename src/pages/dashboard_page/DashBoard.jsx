import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import axios from "axios";

import SideBar from '../../reusable_component/SideBar';
import styles from './dashboard.module.css';
import { AppContext } from '../../Contexts';
import { server_url } from '../../../creds/server_url';
import { UiContext } from '../../utils/UiContext';

export default function DashBoard() {
    const { user_details, setLoading, socket } = useContext(AppContext);

    const {setOverride} = useContext(UiContext);

    useEffect(() => {
        if (socket === null){
            setOverride("loading");
        }
        else{
            setOverride(null);
        }
    }, [socket]);

    const bottomRef = useRef(null);
    const hasMounted = useRef(false);
    const prevMsgCount = useRef(0);

    // GET LOGGED-IN USER
    const currentUserId = Number(user_details.id);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showNewMsgBtn, setShowNewMsgBtn] = useState(false);

    useEffect(() => {
        if (autoScroll) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
            setShowNewMsgBtn(true);
        }
    }, [messages]);

    // RECEIVE MESSAGES
    useEffect(() => {
        if (!socket) return;

        socket.on("receive_message", (data) => {
            setMessages(prev => [
                ...prev,
                {
                    ...data,
                    created_at: data.created_at
                        ? new Date(data.created_at).toISOString()
                        : new Date().toISOString()
                }
            ]);
        });

        return () => socket.off("receive_message");
    }, [socket]);

    useEffect(() => {
        axios.get(`${server_url}/g-chat/messages`)
            .then(res => {
                const normalized = res.data.map(msg => ({
                    ...msg,
                    user_id: Number(msg.user_id),
                    created_at: msg.created_at
                        ? new Date(msg.created_at).toISOString()
                        : new Date().toISOString()
                }));
                setMessages(normalized);
            })
            .catch(err => console.error(err));
    }, []);

    // SEND MESSAGE
    const sendMessage = () => {
        if (! socket) return;

        if (!message.trim()) return;

        socket.emit("send_message", {
            user_id: user_details.id,
            message: message,
            created_at: new Date().toISOString()
        });

        setMessage('');
    };

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
            <SideBar
                active_page={'dashboard'}
                location="/dashboard"
            />

            <div className={styles.body}>
                <div className={styles.header}>


                    <div className={styles.pageNameContainer}>
                        <h2 className={styles.global}>Global Chat</h2>
                        <p className={styles.smallName}>College Wide Discussions</p>
                    </div>

                    <div className={styles.headerInputContainer}>
                        <input
                            className={styles.input}
                            placeholder='search...'
                            type='text'
                        />
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
                        padding: "12px",
                        backgroundColor: 'transparent'
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
                                        color: isMe ? "#ffffff" : "#000000",
                                        position: "relative"
                                    }}
                                >
                                    {!isMe && (
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                marginBottom: "4px",
                                                opacity: 0.8
                                            }}
                                        >
                                            {msg.username}
                                        </div>
                                    )}

                                    <div style={{ fontSize: "14px", paddingRight: "45px" }}>
                                        {msg.message}
                                    </div>
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "4px",
                                            right: "8px",
                                            fontSize: "11px",
                                            opacity: 0.7,
                                            color: isMe ? "#e0e7ff" : "#374151"
                                        }}
                                    >
                                        {formatTime(msg.created_at)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
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
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            zIndex: 1000
                        }}
                    >
                        ⬇ New messages
                    </button>
                )}


                <div className={styles.footer}>
                    <div className={styles.footerBox}>
                        <div className={styles.messageContainer}>
                            <input
                                className={styles.messageInput}
                                placeholder='Type a message...'
                                type='text'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                        </div>

                        <div className={styles.footerButtons}>
                            <div className={styles.smiley}>
                                <i className={`fa-regular fa-face-smile ${styles.smile}`}></i>
                            </div>

                            <div className={styles.attach}>
                                <i className={`fa-solid fa-paperclip ${styles.smile}`}></i>
                            </div>

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
        </div>
    );
}
