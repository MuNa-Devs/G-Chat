import styles from "./room_page.module.css"
import Rooms from "./Rooms"
import SideBar from "../../reusable_component/SideBar"

import { useState, useEffect } from "react"
import NewRoom from "./CreateRoom";
import axios from "axios";

export default function RoomPage(){
    const [is_empty, setEmpty] = useState(true);
    const [new_room_triggered, setNRTrigger] = useState(false);

    const [all_rooms, setAllRooms] = useState([]);

    // useEffect(() => {
    //     axios.get("https://localhost:5500/g-chat/rooms/get_all_rooms")
    //     .then((res) => {
    //         const data = res.data;
    //         console.log(data);
    //     });
    // }, []);

    return (
        <div className={styles.roomsPage}>
            <SideBar
                logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3kprXSmAqpSeDBVP9vmHZpvCbB_WNcxn8Eg&s"
                userName="H. Sohel"
                department="Computer Science"
                active_page="privaterooms"
            />

            <div className={styles.mainLayout}>
                <div className={styles.header}>
                    <div className={styles.heading}>
                        <h2>Private Rooms</h2>

                        <p>A list of all course-related chat rooms you can join.</p>
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

                            <input type="text" placeholder="Search by room name, room ID, professor..." />
                        </div>

                        <div className={styles.filter}>
                            <button className={`${styles.activeBtn} ${styles.filterBtn}`}>My Rooms</button>
                            <button className={styles.filterBtn}>All Rooms</button>
                        </div>
                    </div>

                    <div className={styles.rooms}>
                        {is_empty && <h4>No Rooms available</h4>}

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