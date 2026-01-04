import styles from './room_page.module.css'
import { AppContext } from '../../Contexts';

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server_url } from '../../../creds/server_url';

export default function Rooms(props){
    const [is_member, setMembership] = useState(false);

    const r_id = props.room_id;
    const {user_details} = useContext(AppContext);
    const user_id = user_details.id;

    const navigate = useNavigate();

    const getMembership = () => axios.get(
        server_url + `/g-chat/rooms/is_member?room_id=${r_id}&user_id=${user_id}`
    ).then(res => {
        setMembership(res.data.is_member);
        console.log(r_id);
        console.log(user_id);
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });

    return (
        <div className={styles.roomDiv}>
            <div className={styles.roomInfo}>
                <div className={styles.logo}>
                    <img 
                        src={props.logo}
                        onError={e => {
                            e.target.onError = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/8184/8184182.png";
                        }}
                    />
                </div>

                <div className={styles.details}>
                    <h4>{props.room_title}</h4>

                    <div className={styles.info}>
                        <p>Admin:</p>
                        <p>{props.prof_name}</p>
                    </div>

                    <div className={styles.info}>
                        <p>Preference:</p>
                        <p>{props.join_pref}</p>
                    </div>
                </div>
            </div>

            <div className={styles.buttons}>
                <button
                    onClick={async () => {
                        await getMembership();
                        navigate(`/room/${r_id}`, {state: {is_member: is_member}});
                    }}
                >{props.room_btn}</button>
            </div>
        </div>
    )
}