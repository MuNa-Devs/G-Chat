import { server_url } from "../../../creds/server_url";
import createContact from "../../pages/direct-messages/CreateContact";
import styles from "./friend.module.css";

export default function Friend({ ruse, user_id, friend_id, url, username, props }) {

    switch (ruse) {
        case "add-contact":
            return (
                <div className={styles.friend}
                    onClick={async () => {
                        const c_det = await createContact(user_id, friend_id, props);
                        await props.setChatSelected(true);
                        props.setLoading(true);
                        await props.setSelectedCID(Number(c_det?.contact_id));
                        await props.setContactDetails({
                            username: c_det?.username,
                            pfp: c_det?.pfp
                        });
                        await props.setAddContact(false);
                    }}
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
                </div>
            );

        case "friends":
            return (
                <div className={styles.friend}>
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

                    <div className={styles.action}>
                        {props.isFriend(u.id) ? (
                            <span className={styles.connected}>Connected</span>
                        ) : isPending(u.id) ? (
                            <span className={styles.pending}>Pending</span>
                        ) : (
                            <button
                                onClick={() => sendRequest(u.id)}
                                className={styles.addBtn}
                            >
                                Add Friend
                            </button>
                        )}
                    </div>
                </div>
            );
    }
}