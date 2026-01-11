import styles from "./message.module.css";
import { server_url } from "../../../creds/server_url";

export default function Message(props) {

    const formatTime = (time) => {
        if (!time) return "";

        const date = new Date(time);
        if (isNaN(date.getTime())) return "";

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className={styles.messageDiv}>
            {
                Number(localStorage.getItem("user_id")) !== props.sender_id
                    ?
                    <div className={`${(
                        props.conseq_msgs && props.constraint !== "no-logo"
                        ) && styles.conseqMsg} ${styles.senderMsg}`}>
                        {
                            props.constraint !== "no-logo"
                            &&
                            <img
                                src={server_url + `/files/${props.sender_pfp}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                                }}
                            />
                        }

                        <div className={styles.message}>
                            <p>{props.message}</p>

                            <div className={styles.time}>
                                <p>{formatTime(props.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={`${(props.conseq_msgs && props.constraint !== "no-logo") && styles.conseqMsg} ${styles.myMsg}`}>
                        <div className={styles.message}>
                            <p>{props.message}</p>

                            <div className={styles.time}>
                                <p>{formatTime(props.timestamp)}</p>
                            </div>
                        </div>

                        {
                            props.constraint !== "no-logo"
                            &&
                            <img
                                src={server_url + `/files/${props.sender_pfp}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                                }}
                            />
                        }
                    </div>
            }
        </div>
    );
}