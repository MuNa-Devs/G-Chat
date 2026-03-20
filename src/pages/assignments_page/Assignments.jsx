import SideBar from '../../reusable_component/SideBar';
import styles from './assignments.module.css';
import { server_url } from '../../../creds/server_url';
import { AppContext } from '../../Contexts';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

export default function Assignments() {
        const [showRequests, setShowRequests] = useState(false);
        const [friend, setFriend] = useState("");
        const { user_details, setLogOut } = useContext(AppContext);

            useEffect(() => {
        if (!showRequests || !user_details?.id) return;
        
        axios.get(
            `${server_url}/g-chat/users/requests/received?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )   // Server returns this:
        // sentRes.data.sent_reqs = array of {
        //  request_id -> the id of this request in DB,
        //  user_id -> the id of user who received this request (you),
        //  sender_id -> the one who sent u this request,
        //  sender_name -> name of sender,
        //  sender_pfp -> pfp filename of sender,
        //  sent_at -> the time at which this req was sent (UTC)
        // }
            .then(res => setReceived(res.data?.rec_reqs))
            .catch(console.error);

        // Server returns this (Idhi maracchu nvu expect chesina object kakunda):
        // sentRes.data.sent_reqs = array of {
        //  request_id -> the id of this request in DB,
        //  user_id -> the id of user who sent this request (you),
        //  receiver_id -> the one u sent this request to,
        //  receiver_name -> name of receiver,
        //  receiver_pfp -> pfp filename of receiver,
        //  sent_at -> the time at which this req was sent (UTC)
        // }
        // refresh sent requests (opposite request deleted in backend)
        axios.get(
            `${server_url}/g-chat/users/requests/sent?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then(res => setSent(res.data?.sent_reqs))
            .catch(console.error);

    }, [showRequests, user_details]);
    useEffect(() => {
        const closeMenu = () => setActiveMenu(null);
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);
    return (
        <div className={styles.AssignmentsMain}>
            <SideBar className={styles.sidebar}
                            logo="#"
                            active_page={'Assignments'}
                        />

        <div className={styles.body}>
<div className={styles.header}>

    <div className={styles.pageNameContainer}>
        <h2 className={styles.global}>Assignments</h2>
        <p className={styles.smallName}>
            Connect with writers and place assignment orders
        </p>
    </div>

    <div className={styles.headerInputContainer}>
        <input
            className={styles.input}
            placeholder="Search writers..."
            type="text"
            value={friend}
            onChange={(e) => setFriend(e.target.value)}
        />
    </div>

    <div className={styles.buttonContainer}>
        <button
            className={styles.requestsBtn}
            onClick={() => setShowRequests(true)}
        >
            Orders
        </button>
    </div>

</div>

<div className={styles.line}></div>
        </div>
        </div>
    );
}