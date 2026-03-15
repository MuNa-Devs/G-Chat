import styles from "./divloader.module.css";

export default function DivLoader(props) {

    return (
        <div className={styles.loader}>
            <div className={styles.beads}>
                <div className={`${styles.bead1} ${styles.bead}`}></div>
                <div className={`${styles.bead2} ${styles.bead}`}></div>
                <div className={`${styles.bead3} ${styles.bead}`}></div>
                <div className={`${styles.bead4} ${styles.bead}`}></div>
            </div>
        </div>
    );
}