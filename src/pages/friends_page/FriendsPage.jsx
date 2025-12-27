import { useEffect, useState } from 'react';
import axios from "axios";

import SideBar from '../../reusable_component/SideBar';
import styles from './friendspage.module.css';

export default function FriendsPage() {
    const [friend, setFriend] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchFriends = async (query) => {
        try {
            const res = await axios.get(
                `http://localhost:5500/g-chat/search-users?query=${query}`
            );
            setResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!friend.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(() => {
            searchFriends(friend);
        }, 400);

        return () => clearTimeout(delay);
    }, [friend]);

    return (
        <div className={styles.friendsMain}>
            <SideBar
                logo="#"
                active_page={'friends'}
            />

            <div className={styles.body}>
                <div className={styles.header}>
                    <div className={styles.pageNameContainer}>
                        <h2 className={styles.global}>Friends</h2>
                        <p className={styles.smallName}>
                            List of friends you connected with
                        </p>
                    </div>

                    <div className={styles.headerInputContainer}>
                        <input
                            className={styles.input}
                            placeholder="Search users..."
                            type="text"
                            value={friend}
                            onChange={(e) => setFriend(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.line}></div>

                {/* SEARCH RESULTS */}
                <div className={styles.resultsContainer}>
                    {loading && (
                        <div className={styles.loading}>Searching...</div>
                    )}

                    {!loading && results.map((u) => (
                        <div key={u.id} className={styles.friendItem}>
                            <div className={styles.avatar}>
                                {u.username.charAt(0).toUpperCase()}
                            </div>

                            <div className={styles.userInfo}>
                                <div className={styles.username}>{u.username}</div>
                                <div className={styles.subText}>Click to add friend</div>
                            </div>

                            <button className={styles.addBtn}>Add</button>
                        </div>
                    ))}

                    {!loading && results.length === 0 && friend && (
                        <div className={styles.emptyState}>
                            No users found
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
