import styles from "./loading_screen.module.css";

export default function LoadingScreen() {

    return (
        <div className={styles.mainDiv}>
            <div className={styles.loaderCircle}>
                <div className={styles.loadingDiv}></div>
            </div>
        </div>
    );
}