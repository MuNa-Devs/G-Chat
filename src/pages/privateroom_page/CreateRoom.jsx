import styles from "./new_room.module.css";
import ScrollDownBox from "../../reusable_component/scroll_downs/ScrollDownBox";

import { useState } from "react";
import axios from "axios";
import { server_url } from "../../../creds/server_url";

export default function NewRoom(props) {
    const [room_icon, setRoomIcon] = useState("");
    const [room_name, setRoomName] = useState("");
    const [room_desc, setRoomDesc] = useState("");
    const [room_type, setRoomType] = useState("public");
    const [join_pref, setJoinPref] = useState("Anyone Can Join");
    const [room_size, setRoomSize] = useState(10);

    const [btn_text, setBtnText] = useState("Create");

    const upload = (e) => document.getElementById("logo").click();

    const handleDetails = (e) => {
        setRoomIcon(e.target.files[0]);
        const img_url = URL.createObjectURL(e.target.files[0]);
        document.getElementById("icon").src = img_url;
    }

    const createRoom = () => {
        setBtnText("Creating...");
        document.getElementById("save").disabled = true;
        const form = new FormData();

        form.append("room_icon", room_icon);
        form.append("room_name", room_name);
        form.append("room_desc", room_desc);
        form.append("room_type", room_type);
        form.append("join_pref", join_pref);
        form.append("room_size", room_size);
        form.append("room_aid", JSON.parse(localStorage.getItem("user")).id);

        axios.post(
            `${server_url}/g-chat/rooms/create`,
            form,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(res => {
            const data = res.data;
            setBtnText("Create");
            document.getElementById("save").disabled = false;
            props.closeHook(false);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className={styles.newRoom}>
            <div className={styles.titlebar}>
                <h3>Create New Room</h3>
            </div>

            <div className={styles.sections}>
                <div className={styles.sectionBodyContainer}>
                    <div className={styles.profilePic}>
                        <div className={styles.image}>
                            <img 
                                id="icon"
                                src="https://www.shutterstock.com/image-vector/blank-image-photo-placeholder-icon-600nw-2501054919.jpg"
                                alt=""
                            />
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            capture
                            id="logo"
                            style={{ display: "none" }}
                            name="logo"
                            onChange={handleDetails}
                        />

                        <div className={styles.uploadBtn}>
                            <button
                                onClick={upload}
                            ><i className="fa-regular fa-image"></i> Upload Photo</button>

                            <p>PNG or JPEG, max 2MB.</p>
                        </div>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.roomName}>
                            <h5>Room Name</h5>

                            <input
                                type="text"
                                placeholder="Enter the room name"
                                value={room_name}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        </div>

                        <div className={styles.roomDesc}>
                            <h5>Room Description</h5>

                            <textarea
                                placeholder="Tell us something about the room..."
                                value={room_desc}
                                onChange={(e) => setRoomDesc(e.target.value)}
                                rows={3}
                            ></textarea>
                        </div>

                        <div className={styles.roomType}>
                            <h5>Room Type</h5>

                            <div>
                                <label htmlFor="private">Private</label>
                                <input
                                    type="radio"
                                    name="roomtype"
                                    id="private"
                                    value={"private"}
                                    checked={room_type === "private"}
                                    onChange={(e) => setRoomType(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="public">Public</label>
                                <input
                                    type="radio"
                                    name="roomtype"
                                    id="public"
                                    value={"public"}
                                    checked={room_type === "public"}
                                    onChange={(e) => setRoomType(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.joinPref}>
                            <h5>Join Preference</h5>

                            <ScrollDownBox label={join_pref} options={[
                                "Anyone Can Join",
                                "Invite Only",
                                "Approve Join Requests"
                            ]} setLabel={setJoinPref} />
                        </div>

                        <div className={styles.maxMembs}>
                            <label htmlFor="maxMembers"><h5>Room Size: {room_size} members</h5></label>

                            <input
                                id="maxMembers"
                                type="range"
                                min={3}
                                max={75}
                                value={room_size}
                                onChange={(e) => setRoomSize(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bottomButtons}>
                <button className={styles.cancel}
                    onClick={() => props.closeHook(false)}
                >Cancel</button>

                <button className={styles.save} id="save"
                    onClick={createRoom}
                ><i className="fa-regular fa-cloud"></i> {btn_text}</button>
            </div>
        </div>
    );
}