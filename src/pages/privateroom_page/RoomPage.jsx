import styles from "./room_page.module.css"
import Rooms from "./Rooms"
import SideBar from "../../reusable_component/SideBar"

export default function RoomPage(){

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

                    <button className={"utilBtn"}><i className="fa-solid fa-plus"></i> <span>Create</span> Room</button>
                </div>

                <div className={styles.body}>
                    <div className={styles.searchRooms}>
                        <div className={styles.searchBar}>
                            <div><i className="fa-solid fa-magnifying-glass"></i></div>

                            <input type="text" placeholder="Search by name, code, professor..." />
                        </div>

                        <div className={styles.filter}>
                            <button className={`${styles.activeBtn} ${styles.filterBtn}`}>My Rooms</button>
                            <button className={styles.filterBtn}>All Rooms</button>
                        </div>
                    </div>

                    <div className={styles.rooms}>
                        <Rooms
                            logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQosHO7VDBNYy2K4ir7M5cg0tklHgFBAGQnvw&s"
                            room_title="Designing & Analysis of Algorithms"
                            prof_name="Prof. B. Rajesh"
                            msg_count="4"
                            button_text="Enter Room"
                        />

                        <div className="bufferDiv"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}