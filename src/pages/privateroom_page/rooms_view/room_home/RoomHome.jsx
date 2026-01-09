import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";

import SideBar from "../../../../reusable_component/SideBar";
import styles from "./room_home.module.css";
import { server_url } from "../../../../../creds/server_url";
import { AppContext } from "../../../../Contexts";
import Message from "../../../../reusable_component/message_dev/Message";

export default function RoomHome() {
    const chatPageRef = useRef(null);

    const { socket, user_details } = useContext(AppContext);
    const { room_id } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [room_data, setRoomData] = useState({});

    const [sidebar_view, setSidebarView] = useState(true);

    useEffect(() => {
        const resize = () => setSidebarView(window.innerWidth >= 560);

        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        const chatPageResize = () => {
            if (chatPageRef.current){
                chatPageRef.current.style.height = `${window.innerHeight}px`;
                console.log("window size:", window.innerHeight);
            }
        };

        chatPageResize();

        window.addEventListener("resize", chatPageResize);

        return () => window.removeEventListener("resize", chatPageResize);
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

        const handleMessage = (res) => {
            setMessages(prev => [...prev, res]);
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

    const sendMessage = async () => {
        if (message === "") return;

        const local_message = {
            message: message,
            user_id: user_details.id,
            sender_name: user_details.username,
            sender_pfp: user_details.pfp,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, local_message]);

        socket.emit("send-room-message", {
            user_id: user_details?.id,
            room_id: room_id,
            message: message
        });

        setMessage("");
    }

    return (
        <div ref={chatPageRef} className={styles.chatpage}>
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

                        <button className={styles.roomOptions}><i className="fa-solid fa-bars"></i></button>
                    </div>

                    <div className={styles.chatContainer}>
                        {
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
                            ))
                        }
                    </div>

                    <div className={styles.textControls}>
                        <button className={styles.emojis}><i className="fa-regular fa-face-grin-wide"></i></button>

                        <button className={styles.files}><i className="fa-solid fa-paperclip"></i></button>

                        <input
                            value={message}
                            type="text"
                            placeholder="Type your message here..."
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <button
                            className={styles.send}
                            onClick={sendMessage}
                        ><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
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