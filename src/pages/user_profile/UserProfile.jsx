import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./user_profile.module.css";
import { server_url } from "../../../creds/server_url";

export default function UserProfile(props) {
    const user_id = props.user_id;
    const [user_data, setUserData] = useState({});

    useEffect(() => {
        axios.get(server_url + `/g-chat/users/get-user?user_id=${user_id}`)
            .then(res => {
                setUserData(res.data.user_details);
            }).catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.profileMainDiv}>
                <div className={styles.userProfileInfo}>
                    <div className={styles.pfp}>
                        <img
                            src={server_url + "/files/" + user_data?.pfp}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                            }}
                        />
                    </div>

                    <div className={styles.profileName}>
                        <h2>{user_data?.username || "User"}</h2>

                        <h5>{user_data?.department}</h5>
                    </div>
                </div>

                <hr />

                {
                    user_data?.about
                    &&
                    <>
                        <div className={styles.about}>
                            <h3>About</h3>

                            <h5>{user_data?.about}</h5>
                        </div>

                        <hr />
                    </>
                }

                <div className={styles.bottomBtns}>
                    <button><i className="fa-regular fa-message"></i> Message</button>
                </div>
            </div>
        </div>
    );
}