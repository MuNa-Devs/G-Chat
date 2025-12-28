import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from "axios";

import SideBar from '../../reusable_component/SideBar';
import styles from './dashboard.module.css';
import { AppContext } from '../../Contexts';
import { server_url } from '../../../creds/server_url';

// SOCKET CONNECTION
const socket = io(server_url);

export default function DashBoard() {
    const {user_details} = useContext(AppContext);

    // GET LOGGED-IN USER
    const currentUserId = Number(user_details.id);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // RECEIVE MESSAGES
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    useEffect(() => {
        axios.get(`${server_url}/g-chat/messages`)
            .then(res => {
                const normalized = res.data.map(msg => ({
                    ...msg,
                    user_id: Number(msg.user_id)
                }));
                setMessages(normalized);
            })
            .catch(err => console.error(err));
    }, []);


    // SEND MESSAGE
    const sendMessage = () => {
        if (!message.trim()) return;

        socket.emit("send_message", {
            user_id: user_details.id,
            message: message
        });

        setMessage('');
    };

    return (
        <div className={styles.dashboardMain}>
            <SideBar
                active_page={'dashboard'}
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
                                        color: isMe ? "#ffffff" : "#000000"
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

                                    <div style={{ fontSize: "14px" }}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


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
