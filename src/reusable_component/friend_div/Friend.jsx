import { server_url } from "../../../creds/server_url";
import styles from "./friend.module.css";

export default function Friend({ user_id, friend_id, url, username, props }){

    return (
        <div className={styles.friend}
            // onClick={}
        >
            <div className={styles.pfp}>
                <img src={server_url + "/files/" + url}
                    onError={e => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                    }}
                />
            </div>

            <div className={styles.name}>
                <h5>{username}</h5>
            </div>

            <div className={styles.utils}>
                {/*  */}
            </div>
        </div>
    );
}