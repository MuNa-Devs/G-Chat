import { useState } from "react";
import styles from "./assignments_card.module.css";
import { useNavigate } from "react-router-dom";

export default function AssignmentsCard(props){
    const [pending_assignments, setPendingAssignments] = useState(0);
    const [created_assignments, setCreatedAssignments] = useState(0);

    const navigate = useNavigate();

    return (
        <div className={styles.assignmentsCard}>
            <header>
                <div>
                    <i
                        style={{
                            color: "var(--accent)",
                            padding: "8px",
                            border: "1px solid var(--border-light)",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            fontSize: "16px"
                        }}
                        className="fa-solid fa-file-pen"
                    ></i>

                    <h3>Assignments</h3>
                </div>

                <button
                    onClick={() => navigate("/assignments")}
                >
                    <span>Go to Assignments</span>
                    <i className="fa-solid fa-arrow-right-long"></i>
                </button>
            </header>

            <div className={styles.body}>
                <div className={styles.created}>
                    <i
                        style={{
                            color: "var(--success)",
                            backgroundColor: "var(--success-bg)",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-light)"
                        }}
                        className="fa-regular fa-folder-open"
                    ></i>

                    <h5>Assignments Created</h5>

                    <span>{created_assignments}</span>
                </div>

                <div className={styles.pending}>
                    <i
                        style={{
                            color: "var(--warning)",
                            backgroundColor: "var(--warning-bg)",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-light)"
                        }}
                        className="fa-regular fa-clock"
                    ></i>

                    <h5>Assignments Pending</h5>

                    <span>{pending_assignments}</span>
                </div>
            </div>
        </div>
    );
}