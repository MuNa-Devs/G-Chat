import styles from "./room_page.module.css"
import Rooms from "./Rooms"
import SideBar from "../../reusable_component/SideBar"

import { useState, useEffect, useContext } from "react"
import NewRoom from "./CreateRoom";
import axios from "axios";
import { AppContext } from "../../Contexts";
import LoadingScreen from "../loading_screen/LoadingScreen";
import { server_url } from "../../../creds/server_url";

export default function RoomPage() {
    const [is_empty, setEmpty] = useState(true);
    const [empty_placeholder, setPlaceHolder] = useState("No Roooms Available");

    const [new_room_triggered, setNRTrigger] = useState(false);

    const [all_rooms, setAllRooms] = useState([]);
    const [my_rooms, setMyRooms] = useState([]);

    const [all_rooms_count, setAllRoomsCount] = useState(0);
    const [my_rooms_count, setMyRoomsCount] = useState(0);

    const [room_filter, setFilter] = useState("my");

    const {is_loading, user_details} = useContext(AppContext);

    useEffect(() => {

        if (is_loading) return;

        setPlaceHolder("Loading available rooms...")
        loadMyRooms();
    }, [user_details?.id]);

    const loadMyRooms = async () => {

        if (is_loading || !user_details.id) return;

        setFilter("my");
        const rooms = await getMyRooms(user_details.id, my_rooms_count);

        if (!rooms.length && !my_rooms_count) {
            setEmpty(true);
            setPlaceHolder("No Rooms Available");
        }
        else {
            setEmpty(false);
            setMyRoomsCount(prev => prev + rooms.length);
        }

        setMyRooms(prev => [...prev, ...rooms]);
    }

    const loadAllRooms = async () => {
        setFilter("all");
        const rooms = await getAllRooms(all_rooms_count);

        if (!rooms.length && !all_rooms_count) {
            setEmpty(true);
            setPlaceHolder("No Rooms Available");
        }
        else {
            setEmpty(false);
            setAllRoomsCount(prev => prev + rooms.length);
        }

        setAllRooms(prev => [...prev, ...rooms]);
    }

    if (is_loading) return <LoadingScreen />

    return (
        <div className={styles.roomsPage}>
            <SideBar
                location="/rooms"
                active_page="privaterooms"
            />

            <div className={styles.mainLayout}>
                <div className={styles.header}>
                    <div className={styles.heading}>
                        <h2>Private Rooms</h2>

                        <p>A list of all GITAM chat rooms you can join.</p>
                    </div>

                    <button
                        className={"utilBtn"}
                        onClick={() => setNRTrigger(true)}
                    ><i className="fa-solid fa-plus"></i> <span>Create</span> Room</button>
                </div>

                <div className={styles.body}>
                    <div className={styles.searchRooms}>
                        <div className={styles.searchBar}>
                            <div><i className="fa-solid fa-magnifying-glass"></i></div>

                            <input type="text" placeholder="Search by room name, room ID, admin..." />
                        </div>

                        <div className={styles.filter}>
                            <button
                                className={`${room_filter === "my" && styles.activeBtn} ${styles.filterBtn}`}
                                onClick={loadMyRooms}
                            >My Rooms</button>
                            <button
                                className={`${room_filter === "all" && styles.activeBtn} ${styles.filterBtn}`}
                                onClick={loadAllRooms}
                            >All Rooms</button>
                        </div>
                    </div>

                    <div className={styles.rooms}>
                        {is_empty && <h4>{empty_placeholder}</h4>}

                        {
                            !is_empty &&
                            (
                                room_filter === "all" ?
                                all_rooms
                                .filter(room => room.r_type !== "private")
                                .map(room => (
                                    <Rooms
                                        key={room.r_id}
                                        logo={`${server_url}/files/${room.icon_url}`}
                                        room_title={capitalize(room.r_name)}
                                        prof_name={capitalize(room.username)}
                                        join={true}
                                        join_pref={capitalize(room.join_pref)}
                                        room_btn="View Room"
                                    />
                                ))

                                :
                                my_rooms
                                .map(room => (
                                    <Rooms
                                        key={room.r_id}
                                        logo={`${server_url}/files/${room.icon_url}`}
                                        room_title={capitalize(room.r_name)}
                                        prof_name={capitalize(room.username)}
                                        join={true}
                                        join_pref={capitalize(room.join_pref)}
                                        room_btn="Open Room"
                                    />
                                ))
                            )
                        }

                        <div className="bufferDiv"></div>
                    </div>
                </div>
            </div>

            {
                new_room_triggered &&
                <div className={styles.newRoomDiv}>
                    <NewRoom closeHook={setNRTrigger} />
                </div>
            }
        </div>
    )
}

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getMyRooms = async (uid, my_rooms_count) => {
    try {
        const res = await axios.get(
            `${server_url}/g-chat/rooms/get_my_rooms?uid=${uid}&rooms_count=${my_rooms_count}`
        );

        return res.data.rooms_info;
    }
    catch (err) {
        console.log(err);
        return [];
    }
};

const getAllRooms = async (all_rooms_count) => {
    try {
        const res = await axios.get(
            `${server_url}/g-chat/rooms/get_all_rooms?rooms_count=${all_rooms_count}`
        );

        return res.data.rooms_info;
    }
    catch (err) {
        console.log(err);
        return [];
    }
};