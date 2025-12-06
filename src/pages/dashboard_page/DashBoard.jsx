import react from "react";
import ReactDOM from "react-dom";
import styles from './dashboard.module.css';

export default function DashBoard(){    
    return(
        <div className={styles.dashboardMain}>
            <div className={styles.sidebar}></div>
            <div className={styles.body}>
                <div className={styles.header}>
                <div className={styles.sidebarButtonContainer}><button><i className={`fa-solid fa-bars ${styles.sidebarButton}`}></i></button></div>
                <div className={styles.pageNameContainer}><p className={styles.global}>GLOBAL CHAT</p>
                <p className={styles.smallName}>College Wide Discussions</p></div>
                <div className={styles.headerInputContainer}>
                                      
                        <input
                            className={styles.input}
                            placeholder='search...'
                            type='text'
                        />
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.footerBox}>
                        <div className={styles.messageContainer}><input
                            className={styles.messageInput}
                            placeholder='Type a message...'
                            type='text'
                        /></div>
                        <div className={styles.footerButtons}>
                        <div className={styles.smiley}><i className={`fa-regular fa-face-smile ${styles.smile}`}></i></div>
                        <div className={styles.attach}><i className={`fa-solid fa-paperclip ${styles.smile}`}></i></div>
                        <button className={styles.sendButton}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}