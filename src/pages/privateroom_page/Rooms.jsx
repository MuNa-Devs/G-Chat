import styles from './room_page.module.css'

export default function Rooms(props){

    return (
        <div className={styles.roomDiv}>
            <div className={styles.roomInfo}>
                <div className={styles.logo}>
                    <img src={props.logo || "https://www.shutterstock.com/image-vector/blank-image-photo-placeholder-icon-600nw-2501054919.jpg"} alt="Logo" />
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
                <button>{props.room_btn}</button>
            </div>
        </div>
    )
}