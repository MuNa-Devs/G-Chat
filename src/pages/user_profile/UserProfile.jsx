import { useContext, useEffect, useState } from "react";
import axios from "axios";

import styles from "./user_profile.module.css";
import { server_url } from "../../../creds/server_url";
import { AppContext } from "../../Contexts";
import PageLoader from "../loading_screen/PageLoader";

export default function UserProfile(props) {
    const [loader, setLoader] = useState(true);

    const user_id = props.user_id;
    const { user_details } = useContext(AppContext);
    const [user_data, setUserData] = useState({});

    useEffect(() => {
        axios.get(
            server_url + `/g-chat/users/get-user?user_id=${user_details?.id || localStorage.getItem("user_id")}&req_user_id=${user_id}`,
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then(res => {
                setUserData(res.data.user);
            }).catch(err => {
                console.log(err);

                if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                    setLogOut();
            })
    }, []);

    useEffect(() => {
        if (!Object.keys(user_data).length)
            return;

        setLoader(false);
    }, [user_data]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.profileMainDiv}>
                {
                    loader
                        ?
                        <PageLoader />
                        :
                        <>
                            <div className={styles.userProfileInfo}
                            >
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
                                    <h2>{user_data?.username + (user_data.id === user_details?.id ? " (You)" : "") || "User"}</h2>

                                    {
                                        user_data.department
                                            ? <h5>{user_data?.department}</h5>
                                            : <p style={{
                                                fontStyle: "italic",
                                                color: "var(--text-secondary)",
                                                fontSize: ".7em"
                                            }}>Department info not shared</p>
                                    }
                                </div>
                            </div>

                            <hr />

                            <div className={styles.about}>
                                <h3>About</h3>

                                {
                                    user_data.about
                                        ?
                                        <h5>{user_data?.about}</h5>
                                        :
                                        <p style={{
                                            fontStyle: "italic",
                                            color: "var(--text-secondary)",
                                            fontSize: ".75em"
                                        }}>No bio added yet</p>
                                }
                            </div>

                            <hr />

                            {
                                user_data.id !== user_details?.id
                                &&
                                <div className={styles.bottomBtns}>
                                    {
                                        user_data.is_friend
                                            ?
                                            <>
                                                <button><i className="fa-regular fa-message"></i> Message</button>
                                                <button
                                                    style={{
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        outline: "none",
                                                        color: "var(--danger)",
                                                        fontWeight: "500",
                                                        letterSpacing: "1px"
                                                    }}
                                                ><i style={{ color: "var(--danger)" }} className="fa-solid fa-user-minus"></i> Remove Friend</button>
                                            </>
                                            :
                                            <>
                                                <button> <i className="fa-solid fa-user-plus"></i> Add Friend</button>
                                            </>
                                    }
                                </div>
                            }

                            <button
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    outline: "none",
                                    color: "var(--danger)",
                                    fontWeight: "500",
                                    letterSpacing: "1px",
                                    marginTop: "12px"
                                }}
                                onClick={() => props.closeHook(false)}
                            >Close</button>
                        </>
                }
            </div>
        </div >
    );
}