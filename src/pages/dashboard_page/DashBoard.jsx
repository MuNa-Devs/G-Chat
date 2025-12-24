import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from "axios";


import SideBar from '../../reusable_component/SideBar';
import styles from './dashboard.module.css';

// SOCKET CONNECTION
 const socket = io("http://localhost:5500"); 

//http://172.20.138.7

export default function DashBoard() {

    // GET LOGGED-IN USER
    const user = JSON.parse(localStorage.getItem("user"));

    // If user not logged in, redirect
    if (!user) {
        window.location.href = "/signin";
    }

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
    axios.get("http://localhost:5500/g-chat/messages")
        .then(res => {
            setMessages(res.data);
        })
        .catch(err => console.error(err));
    }, []);


    // SEND MESSAGE
    const sendMessage = () => {
        if (!message.trim()) return;

        socket.emit("send_message", {
            user_id: user.id,
            message: message
        });

        setMessage('');
    };

    return (
        <div className={styles.dashboardMain}>
            <SideBar
                logo={'https://i.pravatar.cc/300'}
                userName={user.username}
                department={'Computer Science'}
                active_page={'dashboard'} 
            />

            <div className={styles.body}>
                <div className={styles.header}>
                    <div className={styles.sidebarButtonContainer}>
                        <button>
                            <i className={`fa-solid fa-bars ${styles.sidebarButton}`}></i>
                        </button>
                    </div>

                    <div className={styles.pageNameContainer}>
                        <p className={styles.global}>GLOBAL CHAT</p>
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

                {/* CHAT MESSAGES */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "10px"
                    }}
                >
                    {messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: "6px" }}>
                            <strong>{msg.username}:</strong> {msg.message}
                        </div>
                    ))}
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
