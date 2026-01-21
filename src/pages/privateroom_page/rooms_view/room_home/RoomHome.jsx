import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";

import SideBar from "../../../../reusable_component/SideBar";
import styles from "./room_home.module.css";
import { server_url } from "../../../../../creds/server_url";
import { AppContext } from "../../../../Contexts";
import { File, Message } from "../../../../reusable_component/message_dev/Message";
import EmojiBox from "../../../../reusable_component/emoji_box/EmojiBox";
import FileObject from "../../../../reusable_component/file_object/FileObject";

export default function RoomHome() {
    // Ref to auto scroll to bottom of the messages
    const bottom_ref = useRef(null);

    // Ref to control the message input
    const input_ref = useRef(null);

    const { socket, user_details } = useContext(AppContext);
    const { room_id } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [room_data, setRoomData] = useState({});

    // Controls opening sidebar at lower sreen width
    const [sidebar_view, setSidebarView] = useState(true);

    // File Picker:
    const [show_file_object, setShowFileObject] = useState(false);
    const [files, setFiles] = useState([]);

    // File input handler:
    const handleFiles = (e) => {
        setFiles(Array.from(e.target.files));
        setShowFileObject(true);
        input_ref?.current?.focus();
    }

    // Emoji Picker:
    const [show_picker, setShowPicker] = useState(false);

    // Emoji picker call-back:
    const setEmoji = (emoji_data) => {
        setMessage(prev => prev + emoji_data.emoji);
        input_ref?.current?.focus();
    }

    // To control sidebar visibility, input focus, input height
    useEffect(() => {
        setSidebarView(window.innerWidth >= 560);
        input_ref?.current?.focus();
    }, []);

    // To fetch the room details
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

    // To send join room signal to server side socket
    useEffect(() => {
        if (!socket || !room_id) return;

        socket.emit("join-room", { room_id });

        return () => {
            socket.emit("leave-room", { room_id });
        };
    }, [socket, room_id]);

    // To receive the messages sent when active
    useEffect(() => {
        if (!socket || !room_id) return;

        const handleMessage = (res) => {
            if (user_details?.id === Number(res.user_id)) return;

            setMessages(
                prev => [...prev, res]
            );
        };

        socket.on("get-room-message", handleMessage);

        return () => {
            socket.off("get-room-message", handleMessage);
        };
    }, [socket, room_id]);

    // To fetch all the messages of the room at startup
    useEffect(() => {
        if (!room_id) return;

        axios.get(
            server_url + `/g-chat/rooms/get-messages?room_id=${room_id}`
        )
            .then(res => setMessages(res.data.messages))
            .catch(err => console.log(err));
    }, [room_id]);

    // Get to the bottom of the messages everytime {messages} changes
    useEffect(() => {
        bottom_ref?.current?.scrollIntoView();
    }, [messages]);

    const autoReHeight = (e) => {
        const thing = e.target;
        thing.style.height = "auto";
        thing.style.height = Math.min(thing.scrollHeight - 24, 150) + "px";
    };

    // Send message to other room members + optimistic UI update
    const sendMessage = async () => {
        if (!message.trim() && files.length === 0) {
            setMessage("");
            setFiles([]);
            input_ref.current.style.height = "auto";
            input_ref.current?.focus();

            return;
        }

        const msg_id = generateUUID();

        const local_message = {
            msg_id,
            message: message.trim(),
            user_id: user_details?.id || localStorage.getItem("user_id"),
            username: user_details.username,
            pfp: user_details.pfp,
            sent_at: null,
            status: "pending",
            files: files
        }

        setMessages(prev => [...prev, local_message]);

        const form = new FormData();

        form.append("msg_id", msg_id);
        form.append("room_id", room_id);
        form.append("user_id", user_details?.id || localStorage.getItem("user_id"));
        form.append("sender_name", user_details?.username);
        form.append("pfp", user_details?.pfp);
        form.append("message", message.trim());
        files.forEach(file => form.append("files", file));

        axios.post(
            server_url + "/g-chat/rooms/room-message",
            form,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(res => {
            const data = res.data;

            setMessages(prev =>
                prev.map((message, index) => (
                    message.msg_id === data.msg_id
                        ?
                        prev[index] = {
                            ...message,
                            sent_at: data.sent_at,
                            status: "complete",
                            files: data.files
                        }
                        :
                        message
                ))
            );
        });

        setMessage("");
        setShowPicker(false);
        setFiles([]);
        setShowFileObject(false);

        document.getElementById("file").value = "";

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
                    <div
                        className={styles.roomControlBar}
                        onClick={() => {
                            if (window.innerWidth > 490) return;
                            
                            navigate(
                                `/room/dashboard/${room_id}`,
                                {
                                    state: {
                                        from: `/room/home/${room_id}`
                                    }
                                }
                            );
                        }}
                    >
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
                                    <div key={index}>
                                        {
                                            msg.files.map((file, index) => (
                                                <File
                                                    key={index}
                                                    sender_id={msg.user_id}
                                                    sender_pfp={msg.pfp}
                                                    filename={file.filename || file.name}
                                                    file_url={file.file_url}
                                                    timestamp={msg.sent_at}
                                                    status={msg.status || "complete"}
                                                />
                                            ))
                                        }

                                        {
                                            msg.message
                                            &&
                                            <Message
                                                key={index}
                                                conseq_msgs={messages[index - 1]?.user_id === msg.user_id}
                                                message={msg.message}
                                                sender_id={msg.user_id}
                                                sender_name={msg.sender_details?.username || msg.username}
                                                sender_pfp={msg.sender_details?.pfp || msg.pfp}
                                                timestamp={msg.timestamp || msg.sent_at}
                                                files={msg.files}
                                                status={msg.status || "complete"}
                                            />
                                        }
                                    </div>
                                )) :
                                <div className={styles.noMsgs}><h5>No Recent Messages</h5></div>
                        }

                        <div ref={bottom_ref}></div>
                    </div>

                    {
                        show_file_object
                        &&
                        <FileObject
                            files={files}
                        />
                    }

                    <div className={styles.textControls}>
                        <button
                            onClick={() => setShowPicker(prev => !prev)}
                            className={styles.emojis}
                        ><i className="fa-solid fa-face-laugh"></i></button>

                        <button
                            className={styles.files}
                            onClick={() => {
                                document.getElementById("file").click();
                            }}
                        ><i className="fa-solid fa-paperclip"></i></button>

                        <input
                            id="file"
                            type="file"
                            multiple
                            onChange={handleFiles}
                            style={{
                                display: "none"
                            }}
                        />

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
                                setEmoji={setEmoji}
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

const generateUUID = () => {
    if (crypto?.randomUUID) {
        return crypto.randomUUID();
    }

    // fallback
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
};