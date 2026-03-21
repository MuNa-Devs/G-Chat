import { useState } from "react";
import { server_url } from "../../../../../creds/server_url";
import Toggle from "../../../../reusable_component/toggle_button/Toggle";
import styles from "./my_portfolio.module.css";
import NumToFA from "../../../../reusable_component/util_funcs/NumToFA";

export default function MyPortfolio(props) {
    const [money_earned, setMoneyEarned] = useState(0);
    const [rating, setRating] = useState(0);
    const [assignments_written, setAssignmentsWritten] = useState(0);
    const [assignments_created, setAssignmentsCreated] = useState(0);
    const [price_per_page, setPricePerPage] = useState(0);

    return (
        <div className={styles.mainDiv}>
            <div className={styles.header}>
                <h2>My Portfolio</h2>

                <div>
                    <button><i className="fa-solid fa-cart-shopping"></i></button>

                    <button><i className="fa-solid fa-envelope"></i></button>
                </div>
            </div>

            <div className={styles.profileInfo}>
                <div className={styles.pfp}>
                    <img
                        src={server_url + "/files/" + "#"}
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                        }}
                    />
                </div>

                <div className={styles.userData}>
                    <h3>Lorem, ipsum.</h3>

                    <p>Lorem ipsum dolor sit.</p>
                </div>

                <div className={styles.availability}>
                    <Toggle
                        defaultValue={true}
                        onChange={() => { }}
                    />
                </div>
            </div>

            <div className={styles.stats}>
                <div className={`${styles.statCard} ${styles.moneyEarned}`}>
                    <h5>MONEY EARNED</h5>

                    <div className={styles.value}>
                        <i className="fa-solid fa-indian-rupee-sign"></i>

                        <NumToFA
                            num={money_earned}
                        />
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.rating}`}>
                    <h5>AVERAGE RATING</h5>

                    <div className={styles.value}>
                        <NumToFA
                            num={rating}
                        />

                        <span>/</span>

                        <i className={`fa-solid fa-5`}></i>
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.assignmentsWritten}`}>
                    <h5>ASSIGNMENTS DELIVERED</h5>

                    <div className={styles.value}>
                        <NumToFA
                            num={assignments_written}
                        />
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.assignmentsCreated}`}>
                    <h5>ASSIGNMENTS CREATED</h5>

                    <div className={styles.value}>
                        <NumToFA
                            num={assignments_created}
                        />
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.pricePerPage}`}>
                    <h5>PRICE PER PAGE</h5>

                    <div className={styles.value}>
                        <i className="fa-solid fa-indian-rupee-sign"></i>

                        <NumToFA
                            num={price_per_page}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}