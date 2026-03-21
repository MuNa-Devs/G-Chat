import styles from "./writer_card.module.css";

export default function WriterCard({ writer }) {
    return (
        <div className={styles.card}>

            <div className={styles.imageSection}>
                <img
                    src={writer.sample_url}
                    alt="sample"
                />
            </div>

            <div className={styles.infoSection}>

                <div className={styles.topRow}>
                    <img
                        src={writer.pfp}
                        alt="pfp"
                        className={styles.pfp}
                    />

                    <div>
                        <h3>{writer.username}</h3>
                        <span>⭐ {writer.rating || "4.8"}</span>
                    </div>
                </div>

                <div className={styles.bottomRow}>
                    ₹ {writer.price_per_page}/page
                </div>

            </div>

        </div>
    );
}