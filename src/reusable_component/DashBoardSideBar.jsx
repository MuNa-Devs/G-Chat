import styles from './dashboardsidebar.module.css';

// For global values from context provider
import { useContext } from 'react';
import { AuthContext } from './../AuthContext';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ReceptionistSidebar(props){
    const navigate = useNavigate();

    // ---------------------
    // Handle Logout button
    // ---------------------
    // Variables to handle login status (from context provider)
    const {is_logged_in, setLogin, setLogOut} = useContext(AuthContext);

    const [is_open, setIsOpen] = useState(false)

    // ------------------------------
    // Access hosp_details variables
    // ------------------------------
    const {hosp_details} = useContext(AuthContext);

    return (
        <>
            <div className={`${is_open && styles.open} ${styles.blurDiv}`}></div>
            
            <div className={`${styles.sidebar} ${is_open ? styles.open : ""}`}>

                <div className={styles.ensureTogether}>
                    <div className={styles.hospitalBranding}>
                        <div className={styles.logo}>
                            <img
                                src={hosp_details.img_url || "https://www.shutterstock.com/image-vector/blank-image-photo-placeholder-icon-600nw-2501054919.jpg"}
                                alt=""
                            />
                        </div>

                        <div className={styles.hospitalName}>
                            <span><h4>{hosp_details.hosp_name}</h4></span>

                            <span><p>Reception desk</p></span>
                        </div>
                    </div>

                    <div className={styles.utilities}>
                        <button className={styles.utilOptions}
                        ><i className="fa-solid fa-list"></i></button>

                        <button className={`${is_open ? styles.open : ""} ${styles.collapseOpen}`}
                            onClick={() => setIsOpen(false)}
                        ><i className="fa-solid fa-compress"></i> Collapse</button>

                        <button className={props.page === "dashboard" ? styles.activePage : ""}
                            onClick={() => navigate("/dashboard")}
                        ><i className="fa-solid fa-table-columns"></i> <span>Dashboard</span></button>

                        <button className={props.page === "appointments" ? styles.activePage : ""}
                            onClick={() => navigate("/appointmentmanagment")}
                        ><i className="fa-solid fa-calendar-days"></i> <span>Appointments</span></button>

                        <button className={props.page === "patients" ? styles.activePage : ""}
                            onClick={() => navigate("/patients")}
                        ><i className="fa-solid fa-users"></i> <span>Patients</span></button>

                        <button className={props.page === "doctors" ? styles.activePage : ""}
                            onClick={() => navigate("/doctormanagement")}
                        ><i className="fa-solid fa-user-doctor"></i> <span>Manage Doctors</span></button>

                        <button className={props.page === "billing" ? styles.activePage : ""}
                            onClick={() => navigate("/billing")}
                        ><i className="fa-solid fa-receipt"></i> <span>Billing</span></button>

                        <button className={props.page === "hospitalsettings" ? styles.activePage : ""}
                            onClick={() => navigate("/hospitalsettings", { state: { from: props.location } })}
                        ><i className="fa-solid fa-screwdriver-wrench"></i> <span>Hospital Settings</span></button>

                        {props.page === '404' && <button className={styles.activePage}>Burra Poinda Bro</button>}
                    </div>
                </div>

                <div className={styles.sidebarOptions}>
                    <button className={styles.utilOptions}
                        onClick={() => setIsOpen(true)}
                    ><i className="fa-solid fa-list"></i></button>

                    <button className={styles.settings}
                        onClick={() => navigate("/settings", { state: { from: props.location } })}
                    ><i className="fa-solid fa-gear"></i> <span>Settings</span></button>

                    <button className={styles.logout}
                        onClick={() => setLogOut()}
                    ><i className="fa-solid fa-arrow-right-from-bracket"></i> <span>Log Out</span></button>
                </div>
            </div>
        </>
    );
}