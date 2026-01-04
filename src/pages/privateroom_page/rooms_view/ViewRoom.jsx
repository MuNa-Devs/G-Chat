import styles from "./view_room.module.css";
import SideBar from "../../../reusable_component/SideBar";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { server_url } from "../../../../creds/server_url";

export default function ViewRoom() {
    const { room_id } = useParams();
    const location = useLocation();
    const is_member = location.state?.is_member;

    const navigate = useNavigate();

    const [room_data, setRoomData] = useState({});

    useEffect(() => {
        axios.get(
            server_url + `/g-chat/rooms/get-room?room_id=${room_id}`
        ).then(res => {
            const data = res.data;
            setRoomData(data.room_info);
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }, [room_id]);

    return (
        <div className={styles.viewRoom}>
            <SideBar
                location="/room"
                active_page="privaterooms"
            />

            <div className={styles.roomInfo}>
                <div className={styles.header}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate("/rooms")}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                        <span> Back</span>
                    </button>
                </div>

                <div className={styles.roomDisplay}>
                    <div className={styles.icon}>
                        <img
                            src={server_url + `/files/${room_data.icon_url}`}
                            onError={(e) => {
                                e.target.onError = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/8184/8184182.png";
                            }}
                        />
                    </div>

                    <h2>{room_data.r_name}</h2>

                    <div className={styles.otherInfo}>
                        <h5><i className="fa-solid fa-user-tie"></i> Admin:</h5>

                        <h5>{room_data.admin_name}</h5>
                    </div>
                </div>

                <div className={styles.roomDetails}>
                    <div className={styles.roomDesc}>
                        <h3><i className="fa-solid fa-circle-info"></i> About this room</h3>

                        <h5>{room_data.r_desc}</h5>
                    </div>

                    <div className={styles.buffer}></div>
                </div>
            </div>
        </div>
    );
}