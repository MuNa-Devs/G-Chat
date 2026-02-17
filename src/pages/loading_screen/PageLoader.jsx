import styles from "./pageloader.module.css";

export default function PageLoader(props){

    return (
        <div className={styles.loader}>
            <div className={`${styles.bead1} ${styles.beads}`}></div>
            <div className={`${styles.bead2} ${styles.beads}`}></div>
            <div className={`${styles.bead3} ${styles.beads}`}></div>
        </div>
    );
}