import styles from "./view_room.module.css";
import SideBar from "../../../../reusable_component/SideBar";
import RoomMember from "./RoomMember";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { server_url } from "../../../../../creds/server_url";
import { AppContext } from "../../../../Contexts";

export default function ViewRoom() {
    const { room_id } = useParams();
    const location = useLocation();
    const is_member = location.state?.is_member;
    const from = location.state?.from || "/rooms";

    const [room_members, setRoomMembers] = useState([]);
    const { user_details, socket } = useContext(AppContext);

    const [c_user_id, setCurrentUserId] = useState(0);

    const [refreshData, setRefreshState] = useState(0);

    useEffect(() => {
        setCurrentUserId(user_details?.id || 0);
    }, [user_details?.id]);

    const navigate = useNavigate();

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

        axios.get(
            server_url + `/g-chat/rooms/get-members?room_id=${room_id}`
        ).then(res => {
            setRoomMembers(res.data.members);
        }).catch(err => {
            console.log(err);
        });
    }, [room_id, refreshData]);

    const handleJoin = async (e) => {
        const mode = e.target.textContent;

        switch (mode) {
            case "Join Room":
                axios.get(
                    server_url + `/g-chat/rooms/join?room_id=${room_data.r_id}&user_id=${user_details.id}`
                ).then(res => {
                    setRefreshState(prev => prev + 1);
                }).catch(err => {
                    console.log(err);
                });
        }
    };

    const handleLeave = async (e) => {
        await axios.get(
            server_url + `/g-chat/rooms/leave?room_id=${room_data.r_id}&user_id=${user_details.id}`
        ).catch(err => {
            console.log(err);
        });
    }

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
                        onClick={() => navigate(from)}
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

                    <div className={styles.wrappersWrapper}>
                        <div className={styles.displayWrapper}>
                            <h2>{room_data.r_name}</h2>

                            <div className={styles.otherInfo}>
                                <h5><i className="fa-solid fa-user-tie"></i> Admin:</h5>

                                <h5>
                                    {room_data.admin_name}
                                    <span
                                        onClick={() => console.log("Admin profile accessed")}
                                    >{"  "}<i className="fa-solid fa-link"></i></span>
                                </h5>
                            </div>

                            <div className={styles.otherInfo2}>
                                <h5>
                                    <i className="fa-solid fa-people-group"></i> Members {room_data.popl_size}/{room_data.r_size}
                                </h5>

                                <h5>
                                    <i className="fa-solid fa-shield-halved"></i> {room_data.r_type}
                                </h5>
                            </div>
                        </div>

                        <div className={styles.joinBtn}>
                            {
                                (
                                    from.startsWith("/rooms")
                                    && 
                                    is_member
                                )
                                &&
                                <button
                                    className="utilBtn"
                                    style={{marginRight: "16px"}}
                                    onClick={() => navigate(`/room/home/${room_id}`)}
                                >Open Room</button>
                            }
                            {
                                !room_members.some(
                                    member => member.id === c_user_id
                                )
                                ?
                                    (
                                        room_data.join_pref !== "Invite Only" &&
                                        <button className="utilBtn"
                                            onClick={handleJoin}
                                        >
                                            {
                                                room_data.join_pref === "Approve Join Requests"
                                                    ? "Request Join Access"
                                                    : room_data.join_pref === "Anyone Can Join"
                                                        ? "Join Room"
                                                        : "Join Room"
                                            }
                                        </button>
                                    )
                                :
                                    (
                                        user_details.id !== room_data.id
                                        &&
                                        <button
                                            className={styles.leaveBtn}
                                            onClick={async () => {
                                                await handleLeave();
                                                navigate("/rooms");
                                            }}
                                        >Leave Room</button>
                                    )
                            }
                        </div>
                    </div>
                </div>

                <div className={styles.roomDetails}>
                    <div className={styles.roomDesc}>
                        <h3><i className="fa-solid fa-circle-info"></i> About this room</h3>

                        <h5>{room_data.r_desc || "No Description Available"}</h5>
                    </div>
                </div>

                <div className={styles.members}>
                    <h3>Room Members</h3>

                    <RoomMember
                        key={room_data.id}
                        admin={true}
                        name={room_data.username}
                        pfp={room_data.pfp}
                    />

                    {
                        room_members?.length > 0 && room_members.map(member => (
                            member.id !== room_data.id 
                            && 
                            <RoomMember
                                key={member.id}
                                admin={false}
                                name={member.username}
                                pfp={member.pfp}
                            />
                        ))
                    }
                </div>

                <div className={styles.buffer}></div>
            </div>
        </div>
    );
}