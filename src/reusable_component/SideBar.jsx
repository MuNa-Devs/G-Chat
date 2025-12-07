import styles from './sidebar.module.css'

export default function SideBar(props) {

    return (
        <>
            <div className={styles.sidebarAtLeft}>
                <div className={styles.userProfile}>
                    <div className={styles.logo}>
                        <img src={props.logo || '#'} alt="pfp" />
                    </div>

                    <div className={styles.userDetails}>
                        <h4>{props.userName || "User"}</h4>

                        <p>{props.department || "Department"}</p>
                    </div>
                </div>

                <div className={styles.sidebarOptions}>
                    <button
                        className={`
                        ${props.active_page == "dashboard" && styles.activeBtn}
                    `}
                    ><i className="fa-solid fa-table-columns"></i> <span>Dashboard</span></button>

                    <button
                        className={`
                        ${props.active_page == "dms" && styles.activeBtn}
                    `}
                    ><i className="fa-solid fa-message"></i> <span>Direct Messages</span></button>

                    <button
                        className={`
                        ${props.active_page == "privaterooms" && styles.activeBtn}
                    `}
                    ><i className="fa-solid fa-unlock-keyhole"></i> <span>Private Rooms</span></button>

                    <button
                        className={`
                        ${props.active_page == "friends" && styles.activeBtn}
                    `}
                    ><i className="fa-solid fa-user-group"></i> <span>Friends</span></button>
                </div>

                <div className={styles.sidebarUtils}>
                    <button
                        className={styles.settings}
                    ><i className="fa-solid fa-gear"></i> <span>Settings</span></button>

                    <button
                        className={styles.logout}
                    ><i className="fa-solid fa-arrow-right-from-bracket"></i> <span>Log Out</span></button>
                </div>
            </div>

            <div className={styles.sidebarAtTop}>
                <div className={styles.userProfile}>
                    <div className={styles.logo}>
                        <img src={props.logo || '#'} alt="pfp" />
                    </div>

                    <div className={styles.userDetails}>
                        <h4>{props.userName || "User"}</h4>

                        <p>{props.department || "Department"}</p>
                    </div>
                </div>

                <div className={styles.sidebarUtils}>
                    <button
                        className={styles.utilsBtn}
                    ><i className="fa-solid fa-bars"></i></button>

                    <button
                        className={styles.settings}
                    ><i className="fa-solid fa-gear"></i></button>

                    <button
                        className={styles.logout}
                    ><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                </div>
            </div>
        </>
    )
}