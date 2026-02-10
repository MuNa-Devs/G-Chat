import styles from "./alert.module.css";

export default function Alert(props){

    return (
        <div className={styles.alert}>
            <p>{props.text}</p>

            <div>
                <button
                    onClick={() => props.closeHook(false)}
                >Close</button>
            </div>
        </div>
    );
}