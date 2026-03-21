import { useEffect, useState } from "react";
import styles from "./browse_writers.module.css";
import WriterCard from "../../reusable_component/writer_card/WriterCard";
import axios from "axios";

export default function BrowseWriters() {
    const [writers, setWriters] = useState([]);

    useEffect(() => {
axios.get(`${server_url}/g-chat/orders/writer/all`, {
    headers: {
        auth_token: `Bearer ${localStorage.getItem("token")}`
    }
})

    return (
        <div className={styles.page}>

            <div className={styles.searchBar}>
                <input
                    placeholder="Search writers..."
                />
            </div>

            <div className={styles.grid}>
                {writers.map((writer) => (
                    <WriterCard
                        key={writer.writer_id}
                        writer={writer}
                    />
                ))}
            </div>

        </div>
    );
}