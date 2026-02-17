import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import axios from "axios";
import { Message } from "../../reusable_component/message_dev/Message";
import EmojiBox from "../../reusable_component/emoji_box/EmojiBox";
import MessageBar from '../../reusable_component/message_bar/MessageBar';
import SideBar from '../../reusable_component/SideBar';
import styles from './temp.module.css';
import { AppContext } from '../../Contexts';
import { server_url } from '../../../creds/server_url';
import { UiContext } from '../../utils/UiContext';

export default function DashBoard() {
    const { user_details, setLoading, socket, setLogOut } = useContext(AppContext);

    const { setOverride } = useContext(UiContext);

    useEffect(() => {
        if (socket === null) {
            setOverride("loading");
        }
        else {
            setOverride(null);
        }
    }, [socket]);

    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const emojiWrapperRef = useRef(null);
    const hasMounted = useRef(false);
    const prevMsgCount = useRef(0);
    const chatRef = useRef(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showNewMsgBtn, setShowNewMsgBtn] = useState(false);

    const [offset, setOffset] = useState(0);

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
            const messageWithTime = {
                ...data,
                created_at: data.created_at || new Date()
            };

            setMessages(prev =>
                [...prev, messageWithTime].sort((a, b) =>
                    new Date(a.created_at || a.time) -
                    new Date(b.created_at || b.time)
                )
            );
        });

        return () => socket.off("receive_message");
    }, [socket]);

    /* ---------------- FETCH OLD MESSAGES ---------------- */
    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get(`${server_url}/g-chat/messages/global?offset=${offset}`, {
            headers: {
                auth_token: `Bearer ${token}`
            }
        })
            .then(res => {
                const normalized = res.data.chats.map(msg => ({
                    ...msg,
                    user_id: Number(msg.user_id)
                }));
                setMessages(normalized);
                setOffset(prev => prev + res.data.chats.length);
            })
            .catch(err => {
                console.log(err);

                if (err.response.data.code === "INVALID_JWT")
                    setLogOut();
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiWrapperRef.current &&
                !emojiWrapperRef.current.contains(event.target)
            ) {
                setShowEmoji(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    /* ---------------- SEND MESSAGE ---------------- */
    const sendMessage = () => {
        // if (! socket) return;

        if (!message.trim()) return;

        socket.emit("send_message", {
            user_id: user_details.id,
            message
        });

        setMessage('');
        setShowEmoji(false);
        inputRef.current.focus();
    };

    const handleEmojiSelect = (emojiData, event) => {
        event.stopPropagation();

        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;

        const newMessage =
            message.substring(0, start) +
            emojiData.emoji +
            message.substring(end);

        setMessage(newMessage);

        setTimeout(() => {
            input.focus();
            input.selectionStart = input.selectionEnd =
                start + emojiData.emoji.length;
        }, 0);
    };

    return (
        <div className={styles.dashboardMain}>
            <SideBar active_page="dashboard" location="/dashboard" />

            <div className={styles.body}>
                <div className={styles.header}>
                    <h2 className={styles.global}>Global Chat</h2>
                    <h5 className={styles.smallName}>College Wide Discussions</h5>
                </div>

                <hr />

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
                    className={styles.chatspace}
                >
                    {messages.map((msg, index) => {
                        const prevMsg = messages[index - 1];

                        const isConsecutive =
                            prevMsg &&
                            Number(prevMsg.user_id) === Number(msg.user_id);

                        return (
                            <Message
                                key={index}
                                sender_id={Number(msg.user_id)}
                                sender_pfp={msg.pfp}
                                message={msg.message}
                                timestamp={msg.created_at || msg.time}
                                conseq_msgs={isConsecutive}
                                constraint={isConsecutive ? "no-logo" : ""}
                                status={msg.status}  // optional
                            />
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
                            backgroundColor: "var(--accent)",
                            color: "var(--text-primary)",
                            border: "none",
                            cursor: "pointer",
                            zIndex: 1000
                        }}
                    >
                        <i
                            className="fa-solid fa-chevron-down"
                            style={{
                                color: "var(--text-primary)"
                            }}
                        ></i> New messages
                    </button>
                )}

                <MessageBar
                    setShowPicker={setShowEmoji}
                    handleFiles={null}
                    input_ref={inputRef}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />

                {
                    showEmoji && (
                        <div ref={emojiRef} className={styles.emojiBox} >
                            <EmojiBox
                                setEmoji={handleEmojiSelect}
                            />
                        </div>
                    )
                }

            </div>
        </div>
    );
}
