import { useParams } from "react-router-dom";
import styles from "./user_profile.module.css";
import { useEffect } from "react";

export default function UserProfile(props){
    const {user_id} = useParams();

    useEffect(() => {
        //
    })

    return (
        <div className={styles.profilePage}></div>
    );
}