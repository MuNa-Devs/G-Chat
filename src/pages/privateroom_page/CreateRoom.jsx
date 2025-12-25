import styles from "./new_room.module.css";

export default function NewRoom(props) {

    return (
        <div className={styles.addNewDocSecBody}>
            <div className={styles.addNewDocSec}>
                <div className={styles.titlebar}>
                    <h3>Add New Doctor</h3>

                    <div className={styles.topButtons}>
                        <button className={styles.cancel}>Cancel</button>

                        <button className={styles.save}><i className="fa-regular fa-cloud"></i> Save</button>

                        <button
                            onClick={() => props.closeHook(false)}
                        ><i className="fa-solid fa-xmark"></i></button>
                    </div>
                </div>

                <div className={styles.sections}>
                    <div className={styles.sectionHeaders}>
                        <button className={`${styles.section} ${styles.activeSection}`}>Personal Information</button>
                        <button className={`${styles.section} ${styles.sectionIcon} ${styles.activeSection}`}><i className="fa-regular fa-user"></i></button>

                        <button className={styles.section}>Professional Details</button>
                        <button className={`${styles.section} ${styles.sectionIcon}`}><i className="fa-solid fa-user-tie"></i></button>
                    </div>

                    <div className={styles.sectionBodyContainer}>
                        <div className={styles.profilePic}>
                            <div className={styles.image}></div>

                            <div className={styles.uploadBtn}>
                                <button><i className="fa-regular fa-image"></i> Upload Photo</button>

                                <p>PNG or JPEG, max 2MB.</p>
                            </div>
                        </div>

                        <div className={styles.details}>
                            <div className={styles.firstName}>
                                <h5>First Name</h5>

                                <input type="text" placeholder="First Name" />
                            </div>

                            <div className={styles.lastName}>
                                <h5>Last Name</h5>

                                <input type="text" placeholder="Last Name" />
                            </div>

                            <div className={styles.email}>
                                <h5>Email Address</h5>

                                <input type="email" placeholder="Email" />
                            </div>

                            <div className={styles.phoneNumber}>
                                <h5>Phone Number</h5>

                                <input type="number" placeholder="Phone Number" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomButtons}>
                    <button className={styles.cancel}>Cancel</button>

                    <button className={styles.save}><i className="fa-regular fa-cloud"></i> Save</button>
                </div>
            </div>
        </div>
    );
}