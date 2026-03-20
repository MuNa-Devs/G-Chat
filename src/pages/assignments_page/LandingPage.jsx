import SideBar from "../../reusable_component/SideBar";
import styles from "./landing_page.module.css";
import writer from "./../../assets/images/writer.png";
import history from "./../../assets/images/history.png";
import portfolio from "./../../assets/images/portfolio.png";

export default function AssignmentHome(props) {

    return (
        <div className={styles.homeDiv}>
            <SideBar
                logo="#"
                active_page="assignments"
            />

            <div className={styles.mainDiv}>
                <div className={styles.header}>
                    <h2>Assignments</h2>

                    <div>
                        <button><i className="fa-solid fa-cart-shopping"></i></button>

                        <button><i className="fa-solid fa-envelope"></i></button>
                    </div>
                </div>

                <div className={styles.hero}>
                    <div>
                        <h3>Turn Your Skills Into Income</h3>

                        <h5>Get paid to write assignments</h5>

                        <p>
                            Ready to share your expertise? Join our network as a writer, build a strong profile, and connect with students seeking high-quality assignments. Showcase your skills, set your pricing, and earn consistently by delivering well-crafted work while gaining experience, credibility, and long-term opportunities within a growing academic marketplace.
                        </p>
                    </div>

                    <button onClick={() => setShowWriterBox(true)}>Get Started</button>
                </div>

                {/* <hr className={styles.divider} /> */}

                <div className={styles.cta}>
                    <div className={`${styles.browseWriters} ${styles.ctaDiv}`}>
                        <div className={`${styles.writerLogo} ${styles.ctaLogo}`}>
                            <img src={writer} />
                        </div>

                        <h3>Browse Writers</h3>

                        <h5>Find the perfect writer as per your requirements</h5>
                    </div>

                    <div className={`${styles.history} ${styles.ctaDiv}`}>
                        <div className={`${styles.historyLogo} ${styles.ctaLogo}`}>
                            <img src={history} />
                        </div>

                        <h3>Browse History</h3>

                        <h5>Keep track of your past assignments, milestones, and payment disbursements</h5>
                    </div>

                    <div className={`${styles.portfolio} ${styles.ctaDiv}`}>
                        <div className={`${styles.portfolioLogo} ${styles.ctaLogo}`}>
                            <img src={portfolio} />
                        </div>

                        <h3>My Portfolio</h3>

                        <h5>Update your preferences, showcase your latest works, and refine your identity</h5>
                    </div>
                </div>

                <div className={styles.timeline}>
                    <div className={`${styles.step} ${styles.left}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-1"></i>

                            <h3>Writer Registration</h3>

                            <p>Create profile, upload samples, set pricing, and verify identity.</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.right}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-2"></i>

                            <h3>Browse Writers</h3>

                            <p>Students explore profiles, compare ratings, and select a writer.</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.left}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-3"></i>

                            <h3>Discussion</h3>

                            <p>Secure chat to finalize pages, subject, deadline, and pricing.</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.right}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-4"></i>

                            <h3>Order Creation</h3>

                            <p>Assignment details are locked and order is created.</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.left}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-5"></i>

                            <h3>Secure Payment</h3>

                            <p>Student pays → platform holds money safely (escrow).</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.right}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-6"></i>

                            <h3>Work in Progress</h3>

                            <p>Writer accepts and starts working.</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.left}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-7"></i>

                            <h3>Delivery</h3>

                            <p>Assignment is completed and delivered physically.</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.right}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-8"></i>

                            <h3>Confirmation</h3>

                            <p>Student verifies via OTP/QR and marks as received.</p>
                        </div>
                    </div>

                    <div className={`${styles.step} ${styles.left}`}>
                        <div className={styles.content}>
                            <i className="fa-solid fa-9"></i>

                            <h3>Payment Release</h3>

                            <p>Writer gets paid. Platform deducts 2.5% commission.</p>
                        </div>
                    </div>

                </div>

                <div className={styles.footer}>
                    <h3>Your Academic Support, Simplified</h3>

                    <h5>
                        A secure marketplace where students and writers collaborate efficiently, with transparency, protection, and reliability at every step.
                    </h5>
                </div>
            </div>
        </div>
    );
}