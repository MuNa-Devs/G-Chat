import { useContext } from 'react';
import styles from './sidebar.module.css'

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Contexts';

export default function SideBar(props) {
    const navigate = useNavigate();
    const {user_details} = useContext(AppContext);

    return (
        <>
            <div className={styles.sidebarAtLeft}>
                <div className={styles.userProfile}>
                    <div className={styles.logo}>
                        <img 
                            src={user_details.pfp}
                            onError={e => {
                                e.target.onError = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                            }}
                        />
                    </div>

                    <div className={styles.userDetails}>
                        <h4>{user_details.username || "User"}</h4>

                        <p>{user_details.department}</p>
                    </div>
                </div>

                <div className={styles.sidebarOptions}>
                    <button
                        className={`
                            ${props.active_page == "dashboard" && styles.activeBtn}
                        `}
                        onClick={() => navigate("/dashboard")}
                    ><i className="fa-solid fa-table-columns"></i> <span>Dashboard</span></button>

                    <button
                        className={`
                            ${props.active_page == "dms" && styles.activeBtn}
                        `}
                        onClick={() => navigate("/direct-messages")}
                    ><i className="fa-solid fa-message"></i> <span>Direct Messages</span></button>

                    <button
                        className={`
                            ${props.active_page == "privaterooms" && styles.activeBtn}
                        `}
                        onClick={() => navigate("/rooms")}
                    ><i className="fa-solid fa-people-roof"></i> <span>Rooms</span></button>

                    <button
                        className={`
                            ${props.active_page == "friends" && styles.activeBtn}
                        `}
                        onClick={() => navigate("/friends")}
                    ><i className="fa-solid fa-user-group"></i> <span>Friends</span></button>
                </div>

                <div className={styles.sidebarUtils}>
                    <button
                        className={styles.settings}
                        onClick={() => navigate("/settings")}
                    ><i className="fa-solid fa-gear"></i> <span>Settings</span></button>

                    <button
                        className={styles.logout}
                    ><i className="fa-solid fa-arrow-right-from-bracket"></i> <span>Log Out</span></button>
                </div>
            </div>

            <div className={styles.sidebarAtTop}>
                <div className={styles.userProfile}>
                    <div className={styles.logo}>
                        <img 
                            src={props.logo}
                            onError={e => {
                                e.target.onError = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                            }}
                        />
                    </div>

                    <div className={styles.userDetails}>
                        <h4>{props.userName || "User"}</h4>

                        <p>{props.department}</p>
                    </div>
                </div>

                <div className={styles.sidebarUtils}>
                    <button
                        className={styles.utilsBtn}
                    ><i className="fa-solid fa-bars"></i></button>

                    <button
                        className={styles.settings}
                        onClick={() => navigate("/settings")}
                    ><i className="fa-solid fa-gear"></i></button>

                    <button
                        className={styles.logout}
                    ><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                </div>
            </div>
        </>
    )
}