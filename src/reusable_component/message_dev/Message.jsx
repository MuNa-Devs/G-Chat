import styles from "./message.module.css";
import { server_url } from "../../../creds/server_url";
import { getIcon } from "../file_object/FileObject";
import { useRef, useState } from "react";

const formatTime = (time) => {
    if (!time) return "";

    const date = new Date(time);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
};

const isSingleEmoji = (text) => {
    if (!text) return false;

    const trimmed = text.trim();
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const segments = [...segmenter.segment(trimmed)];

    if (segments.length !== 1) return false;

    return /\p{Extended_Pictographic}/u.test(trimmed);
};

export function Message(props) {

    return (
        <div className={styles.messageDiv}>
            {
                Number(localStorage.getItem("user_id")) !== props.sender_id
                    ?
                    <div className={`${(
                        props.conseq_msgs
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
                            <p
                                className={`${isSingleEmoji(props.message) ? "emoji" : ""}`}
                            >{props.message}</p>

                            <div className={styles.time}>
                                <div className={styles.msgInfo}>
                                    <i className="fa-solid fa-angle-down"></i>
                                </div>

                                <p>{formatTime(props.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={`${(props.conseq_msgs) && styles.conseqMsg} ${styles.myMsg}`}>
                        <div className={styles.message}>
                            {
                                isSingleEmoji(props.message)
                                    ? <h1>{props.message}</h1>
                                    : <p>{props.message}</p>
                            }

                            <div className={styles.time}>
                                <div className={styles.msgInfo}>
                                    <i className="fa-solid fa-angle-down"></i>
                                </div>

                                {
                                    props.status === "pending"
                                        ?
                                        <i className={`${"fa-regular fa-clock"} ${styles.messageLoader}`}></i>
                                        :
                                        <p>{formatTime(props.timestamp)}</p>
                                }
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

export function File(props) {
    const [url, setURL] = useState("#");
    const download_ref = useRef(null);

    const handleDownload = () => {
        const link = download_ref.current;
        link.href = server_url + "/files/" + props.file_url;
        link.click();
    };

    return (
        <div className={styles.fileDiv}>
            <a
                href={url}
                ref={download_ref}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "none" }}
            ></a>

            {
                Number(localStorage.getItem("user_id")) !== props.sender_id
                    ?
                    <div
                        className={`${(
                            props.conseq_msgs
                        ) && styles.conseqFile} ${styles.senderFile}`}
                    >
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

                        <div className={styles.file}>
                            <div className={`${styles.fileInfo}`} onClick={handleDownload}>
                                <div className={`${styles.icon} ${getIcon(props.filename).classname}`}>
                                    {getIcon(props.filename).element}
                                </div>

                                <h3>{props.filename}</h3>
                            </div>

                            <div className={styles.time}>
                                <div className={styles.msgInfo}>
                                    <i className="fa-solid fa-angle-down"></i>
                                </div>

                                <p>{formatTime(props.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={`${(props.conseq_msgs) && styles.conseqFile} ${styles.myFile}`}>
                        <div className={styles.file}>
                            <div className={`${styles.fileInfo}`} onClick={handleDownload}>
                                <div className={`${styles.icon} ${getIcon(props.filename).classname}`}>
                                    {getIcon(props.filename).element}
                                </div>

                                <h3>{props.filename}</h3>
                            </div>

                            <div className={styles.time}>
                                <div className={styles.msgInfo}>
                                    <i className="fa-solid fa-angle-down"></i>
                                </div>

                                {
                                    props.status === "pending"
                                        ?
                                        <i className={`${"fa-regular fa-clock"} ${styles.messageLoader}`}></i>
                                        :
                                        <p>{formatTime(props.timestamp)}</p>
                                }
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