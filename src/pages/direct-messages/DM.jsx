import styles from "./dm.module.css";
import SideBar from "../../reusable_component/SideBar";
import { server_url } from "../../../creds/server_url";
import { AppContext } from "../../Contexts";
import Message from "../../reusable_component/message_dev/Message";

import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DM() {
    const { user_details, socket } = useContext(AppContext);
    const navigate = useNavigate();
    const bottom_ref = useRef(null);
    const input_ref = useRef(null);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [chat_selected, setChatSelected] = useState(false);
    const [selected_contactID, setSelectedCID] = useState(null);
    const [contact_details, setContactDetails] = useState({});

    useEffect(() => {
        bottom_ref?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        axios.get(
            server_url + `/g-chat/dms/get-contacts?user_id=${user_details?.id || localStorage.getItem("user_id")}`
        ).then(res => {
            const data = res.data;
            setChats(data.contacts);
            console.log(data.contacts);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        if (! chat_selected || ! selected_contactID) return;

        input_ref?.current?.focus();

        axios.get(
            server_url + `/g-chat/dms/get-chats?contact_id=${selected_contactID}`
        ).then(res => {
            const data = res.data;
            setMessages(data.chats);
        }).catch(err => {
            console.log(err);
        });
    }, [selected_contactID]);

    useEffect(() => {
        if (! socket || ! selected_contactID) return;

        socket.emit("connect-dm", {selected_contactID});

        return () => {
            socket.emit("disconnect-dm", {selected_contactID});
        }
    }, [socket, selected_contactID]);

    useEffect(() => {
        if (! socket || ! selected_contactID) return;

        const handleMessage = (res) => {
            setMessages(
                prev => [...prev, res].sort(
                    (a, b) => new Date(a.timestamp || a.sent_at) - new Date(b.timestamp || a.sent_at)
                )
            );
        };

        socket.on("get-dm", handleMessage);

        return () => {
            socket.off("get-dm", handleMessage);
        }
    }, [socket, selected_contactID]);

    const autoReHeight = (e) => {
        const thing = e.target;
        thing.style.height = "auto";
        thing.style.height = Math.min(thing.scrollHeight - 24, 150) + "px";
    }

    const sendMessage = () => {
        if (message.trim() === ""){
            setMessage("");
            input_ref.current.style.height = "auto";
            input_ref.current?.focus();

            return;
        }

        const timestamp = new Date();

        const local_message = {
            contact_id: selected_contactID,
            message: message,
            sent_by: (user_details?.id || localStorage.getItem("user_id")),
            sent_at: timestamp,
            username: user_details?.username,
            pfp: user_details?.pfp
        }

        setMessages(
            prev => [...prev, local_message].sort(
                (a, b) => new Date(a.timestamp || a.sent_at) - new Date(b.timestamp || b.sent_at)
            )
        );

        socket.emit("send-dm", {
            contact_id: selected_contactID,
            message: message,
            sent_by: (user_details?.id || localStorage.getItem("user_id")),
            sent_at: timestamp,
            message_details: local_message
        });

        setMessage("");
        input_ref.current?.focus();
        input_ref.current.style.height = "auto";
    }

    return (
        <div className={styles.dmDashboard}>
            <SideBar
                active_page="dms"
                location="/direct-messages"
            />

            {
                chat_selected
                ?
                <div className={styles.chatPage}>
                    <div className={styles.personControlBar}>
                        <div className={styles.person_info}>
                            <img
                                src={server_url + `/files/${contact_details.pfp}`}
                                onError={(e) => {
                                    e.target.onError = null;
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                                }}
                            />

                            <h2>{contact_details.username}</h2>
                        </div>

                        <button
                            className={styles.roomOptions}
                        ><i className="fa-solid fa-bars"></i></button>
                    </div>

                    <div className={styles.chatContainer}>
                        {
                            messages.length
                            ? messages.map((msg, index) => (
                                    <Message
                                        key={index}
                                        conseq_msgs={messages[index - 1]?.sent_by === msg.sent_by}
                                        message={msg.message}
                                        sender_id={msg.sent_by}
                                        sender_name={msg.username}
                                        sender_pfp={msg.pfp}
                                        timestamp={msg.sent_at}
                                    />
                                ))
                            
                            : <div className={styles.noMsgs}><h5>No Recent Messages</h5></div>
                        }

                        <div ref={bottom_ref}></div>
                    </div>

                    <div className={styles.textControls}>
                        <button className={styles.emojis}><i className="fa-regular fa-face-grin-wide"></i></button>

                        <button className={styles.files}><i className="fa-solid fa-paperclip"></i></button>

                        <textarea
                            rows={1}
                            ref={input_ref}
                            value={message}
                            type="text"
                            placeholder="Type a message"
                            onChange={(e) => {
                                setMessage(e.target.value)
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
                </div>
                :
                <div className={styles.noConv}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2903/2903501.png" alt="" />

                    <h3>Select a conversation</h3>

                    <h5>Choose a contact to start messaging.</h5>
                </div>
            }

            <div className={styles.messages}>
                <h2>Chats</h2>

                <div className={styles.searchBar}>
                    <div><i className="fa-solid fa-magnifying-glass"></i></div>

                    <input type="text" placeholder="Search contacts..." />
                </div>

                <hr className={styles.divider} />

                <div className={styles.chatFilters}>
                    <button className={styles.activeFilter}>All</button>
                    <button>New</button>
                    <button>Frequent</button>
                </div>

                <div className={styles.contacts}>
                    {
                        chats.length
                            ?
                            chats.map((chat, index) => (
                                <Contact
                                    key={index}
                                    setChatSelected={setChatSelected}
                                    setSelectedCID={setSelectedCID}
                                    setContactDetails={setContactDetails}
                                    selected_CID={selected_contactID}
                                    contact_id={chat.contact_id}
                                    pfp={chat.pfp}
                                    username={chat.username}
                                    recent_message={chat.recent_message || ""}
                                    timestamp={chat.sent_at}
                                    transaction={
                                        chat.sent_by === (user_details?.id || localStorage.getItem("user_id")) ? 1 : 0
                                    }
                                    unread_msg={chat.unread_msgs}
                                />
                            ))
                            :
                            <div className={styles.noChats}>
                                <h5>No Chats Available</h5>
                                <h5>But that just means a fresh start! Start connecting with your friends today.</h5>
                            </div>
                    }

                    <div className={styles.buffer}></div>
                </div>

                <div className={styles.newContact}>
                    <i className="fa-solid fa-plus"></i>
                </div>
            </div>
        </div>
    );
}

function Contact(props) {

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
        <div
            className={`
                ${styles.contact}
                ${props.selected_CID === props.contact_id && styles.selectedContact}
            `}
            onClick={() => {
                props.setChatSelected(true);
                props.setSelectedCID(props.contact_id);
                props.setContactDetails({
                    username: props.username,
                    pfp: props.pfp
                });
            }}
        >
            <div className={styles.details}>
                <img
                    src={server_url + `/files/${props.pfp}`}
                    onError={(e) => {
                        e.target.onError = null;
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                    }}
                />

                <div>
                    <h4>{props.username}</h4>

                    <h5>
                        {
                            props.selected_CID !== props.contact_id &&
                            (
                                props.transaction
                                ? "You: " + props.recent_message
                                : props.recent_message
                            )
                        }
                    </h5>
                </div>
            </div>

            <div className={styles.meta}>
                <p>{formatTime(props.timestamp)}</p>

                {props.unread_msg && <div></div>}
            </div>
        </div>
    );
}