import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import SideBar from "../../../../reusable_component/SideBar";
import styles from "./room_home.module.css";
import { server_url } from "../../../../../creds/server_url";
import { AppContext } from "../../../../Contexts";

export default function RoomHome() {
    const {room_id} = useParams();
    const navigate = useNavigate();
    const {socket} = useContext(AppContext);
    
    const [room_data, setRoomData] = useState({});

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
        
        if (!socket) return;

        // socket.on("")
    }, [socket]);

    return (
        <div className={styles.chatpage}>
            <SideBar
                location="/rooms"
                active_page="privaterooms"
            />

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

                        <button><i className="fa-solid fa-bars"></i></button>
                    </div>

                    <div className={styles.chatContainer}></div>

                    <div className={styles.textControls}>
                        <button className={styles.emojis}><i className="fa-regular fa-face-grin-wide"></i></button>

                        <button className={styles.files}><i className="fa-solid fa-paperclip"></i></button>

                        <input type="text" placeholder="Type your message here..." />

                        <button className={styles.send}><i className="fa-solid fa-paper-plane"></i></button>
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