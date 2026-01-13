import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";

import SideBar from "../../../../reusable_component/SideBar";
import styles from "./room_home.module.css";
import { server_url } from "../../../../../creds/server_url";
import { AppContext } from "../../../../Contexts";
import Message from "../../../../reusable_component/message_dev/Message";
import EmojiBox from "../../../../reusable_component/emoji_box/EmojiBox";

export default function RoomHome() {
    const bottom_ref = useRef(null);
    const input_ref = useRef(null);

    const { socket, user_details } = useContext(AppContext);
    const { room_id } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [room_data, setRoomData] = useState({});
    const [input_height, setInputHeight] = useState(0);

    const [sidebar_view, setSidebarView] = useState(true);

    // Emoji Picker:
    const [show_picker, setShowPicker] = useState(false);

    // Emoji picker call-back:
    const setEmoji = (emoji_data) => {
        setMessage(prev => prev + emoji_data.emoji);
        input_ref?.current?.focus();
    }

    useEffect(() => {
        setSidebarView(window.innerWidth >= 560);
        input_ref?.current?.focus();
        setInputHeight(input_ref?.current?.scrollHeight);
    }, []);

    useEffect(() => {
        axios.get(
            server_url + `/g-chat/rooms/get-room?room_id=${room_id}`
        ).then(res => {
            const data = res.data;
            setRoomData(data.room_info);
        }).catch(err => {
            console.log(err);
        });
    }, [room_id]);

    useEffect(() => {
        if (!socket || !room_id) return;

        socket.emit("join-room", { room_id });

        return () => {
            socket.emit("leave-room", { room_id });
        };
    }, [socket, room_id]);

    useEffect(() => {
        if (!socket || !room_id) return;

        const handleMessage = (res) => {
            setMessages(
                prev => [...prev, res]
            );
        };

        socket.on("get-room-message", handleMessage);

        return () => {
            socket.off("get-room-message", handleMessage);
        };
    }, [socket, room_id]);

    useEffect(() => {
        if (!room_id) return;

        axios.get(
            server_url + `/g-chat/rooms/get-messages?room_id=${room_id}`
        )
            .then(res => setMessages(res.data.messages))
            .catch(err => console.log(err));
    }, [room_id]);

    useEffect(() => {
        bottom_ref?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const autoReHeight = (e) => {
        const thing = e.target;
        thing.style.height = "auto";
        thing.style.height = Math.min(thing.scrollHeight - 24, 150) + "px";
    };

    const sendMessage = async () => {
        if (message.trim() === "") {
            setMessage("");
            input_ref.current.style.height = "auto";
            input_ref.current?.focus();

            return;
        }

        const local_message = {
            message: message.trim(),
            user_id: user_details.id,
            sender_name: user_details.username,
            pfp: user_details.pfp,
            timestamp: new Date()
        };

        setMessages(
            prev => [...prev, local_message]
        );

        socket.emit("send-room-message", {
            user_id: user_details?.id,
            room_id: room_id,
            message: message.trim()
        });

        setMessage("");
        setShowPicker(false);
        input_ref.current?.focus();
        input_ref.current.style.height = "auto";
    }

    return (
        <div className={styles.chatpage}>
            {
                sidebar_view &&
                <SideBar
                    className={styles.sidebar}
                    location="/rooms"
                    active_page="privaterooms"
                />
            }

            <div className={styles.chatContext}>
                <div className={styles.chatWindow}>
                    <div className={styles.roomControlBar}>
                        <button
                            className={styles.backBtn}
                            onClick={() => navigate("/rooms")}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>

                        <div className={styles.room_info}>
                            <img
                                src={server_url + `/files/${room_data.icon_url}`}
                                onError={(e) => {
                                    e.target.onError = null;
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/8184/8184182.png";
                                }}
                            />

                            <h2>{room_data.r_name}</h2>
                        </div>

                        <button
                            className={styles.roomOptions}
                            onClick={() => navigate(
                                `/room/dashboard/${room_id}`,
                                {
                                    state: {
                                        from: `/room/home/${room_id}`
                                    }
                                }
                            )}
                        ><i className="fa-solid fa-bars"></i></button>
                    </div>

                    <div className={styles.chatContainer}>
                        {
                            messages.length ?
                                messages.map((msg, index) => (
                                    <Message
                                        key={index}
                                        conseq_msgs={messages[index - 1]?.user_id === msg.user_id}
                                        message={msg.message}
                                        sender_id={msg.user_id}
                                        sender_name={msg.sender_details?.username || msg.username}
                                        sender_pfp={msg.sender_details?.pfp || msg.pfp}
                                        timestamp={msg.timestamp || msg.sent_at}
                                    />
                                )) :
                                <div className={styles.noMsgs}><h5>No Recent Messages</h5></div>
                        }

                        <div ref={bottom_ref}></div>
                    </div>

                    <div className={styles.textControls}>
                        <button
                            onClick={() => setShowPicker(prev => !prev)}
                            className={styles.emojis}
                        ><i className="fa-solid fa-face-laugh"></i></button>

                        <button className={styles.files}><i className="fa-solid fa-paperclip"></i></button>

                        <textarea
                            rows={1}
                            ref={input_ref}
                            value={message}
                            type="text"
                            placeholder="Type a message"
                            onClick={() => {
                                setShowPicker(false);
                            }}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                autoReHeight(e);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    sendMessage();
                                    e.preventDefault();
                                }
                            }}
                        />

                        <button
                            className={styles.send}
                            onClick={sendMessage}
                        ><i className="fa-solid fa-paper-plane"></i></button>
                    </div>

                    {
                        show_picker
                        &&
                        <div className={styles.emojiPicker}>
                            <EmojiBox
                                className={styles.emojiBox}
                            />
                        </div>
                    }
                </div>

                <div className={styles.roomContents}>
                    <h3>Room Contents</h3>

                    <div className={styles.pinnedMsgs}>
                        <h4>Pinned Messages</h4>

                        <h5>No Pinned Messages</h5>
                    </div>

                    <div className={styles.materials}>
                        <h4>Materials</h4>

                        <h5>No Materials Uploaded</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}