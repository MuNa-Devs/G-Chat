import styles from './room_page.module.css'

export default function Rooms(props){

    return (
        <div className={styles.roomDiv}>
            <div className={styles.roomInfo}>
                <div className={styles.logo}>
                    <img src={props.logo || "#"} alt="Logo" />
                </div>

                <div className={styles.details}>
                    <h4>{props.room_title}</h4>

                    <p>{props.prof_name}</p>
                </div>
            </div>

            <div className={styles.buttons}>
                <button>View</button>

                {props.join && <button>Join</button>}
            </div>
        </div>
    )
}