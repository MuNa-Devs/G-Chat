import { useEffect, useState } from "react";
import styles from "./browse_writers.module.css";
import WriterCard from "../../../../reusable_component/writer_card/WriterCard";
import axios from "axios";
import { server_url } from "../../../../../creds/server_url";

export default function BrowseWriters() {
    const [writers, setWriters] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get(
            `${server_url}/g-chat/orders/writers/all`,
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
        .then((res) => {
            setWriters(res.data.writers);
        })
        .catch((err) => {
            console.error(err);
        });

    }, []);

    const filteredWriters = writers.filter((writer) =>
        writer.username
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className={styles.page}>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search writers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.grid}>
                {filteredWriters.map((writer) => (
                    <WriterCard
                        key={writer.writer_id}
                        writer={writer}
                    />
                ))}
            </div>

        </div>
    );
}