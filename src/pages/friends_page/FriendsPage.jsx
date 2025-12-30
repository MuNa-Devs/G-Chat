import { useEffect, useState, useContext } from 'react';
import axios from "axios";

import SideBar from '../../reusable_component/SideBar';
import styles from './friendspage.module.css';
import { server_url } from '../../../creds/server_url';
import { AppContext } from '../../Contexts';

export default function FriendsPage() {

    const { user_details } = useContext(AppContext);

    const [friend, setFriend] = useState("");
    const [friends, setFriends] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
const [received, setReceived] = useState([]);
const [sent, setSent] = useState([]);
const [activeTab, setActiveTab] = useState("received");


    const searchFriends = async (query) => {
        try {
            setLoading(true);
            setHasSearched(false);
            const res = await axios.get(
                `${server_url}/g-chat/search-users?query=${query}`
            );
            setResults(res.data);
            setHasSearched(true);
        } catch (err) {
            console.error(err);
            setHasSearched(true);
        }
        finally {
            setLoading(false);
        }
    };


const sendRequest = async (receiverId) => {
    await axios.post(`${server_url}/g-chat/send-request`, {
        senderId: user_details.id,
        receiverId
    });

    setResults(prev => prev.filter(u => u.id !== receiverId));
};


    const acceptRequest = async (requestId) => {
        await axios.post(`${server_url}/g-chat/accept-request`, { requestId : requestId, userId: user_details.id });

        setReceived(prev => prev.filter(r => r.id !== requestId));

        const res = await axios.get(
            `${server_url}/g-chat/friends/${user_details.id}`
        );
        setFriends(res.data);
    };

    const rejectRequest = async (requestId) => {
        await axios.post(`${server_url}/g-chat/reject-request`, { requestId: requestId , userId: user_details.id });
        setReceived(prev => prev.filter(r => r.id !== requestId));
    };



useEffect(() => {
    if (!user_details?.id) return;

    axios
        .get(`${server_url}/g-chat/friends/${user_details.id}`)
        .then(res => setFriends(res.data))
        .catch(console.error);
}, [user_details]);


    useEffect(() => {
        if (!friend.trim()) {
            setResults([]);
            setHasSearched(false);
            setLoading(false);
            return;
        }

        const delay = setTimeout(() => {
            searchFriends(friend);
        }, 400);

        return () => clearTimeout(delay);
    }, [friend]);

useEffect(() => {
    if (!showRequests || !user_details?.id) return;

    axios.get(`${server_url}/g-chat/requests/received/${user_details.id}`)
        .then(res => setReceived(res.data))
        .catch(console.error);

    axios.get(`${server_url}/g-chat/requests/sent/${user_details.id}`)
        .then(res => setSent(res.data))
        .catch(console.error);

}, [showRequests, user_details]);



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
                    <button
    className={styles.requestsBtn}
    onClick={() => setShowRequests(true)}
>
    Requests
</button>

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

                            <button
                                onClick={() => sendRequest(u.id)}
                                className={styles.addBtn}>Add</button>
                        </div>
                    ))}

                    {!loading && hasSearched && results.length === 0 && (
                        <div className={styles.emptyState}>
                            No users found
                        </div>
                    )}
                </div>

                {/* FRIENDS LIST */}
                <div className={styles.friendsList}>
                    {friends.length > 0 && (
                        <h3 className={styles.sectionTitle}>Your Friends</h3>
                    )}

                    {friends.length === 0 && !hasSearched && (
                        <div className={styles.emptyState}>
                            You have no friends yet
                        </div>
                    )}

                    {friends.map((f) => (
                        <div key={f.id} className={styles.friendItem}>
                            <div className={styles.avatar}>
                                {f.username.charAt(0).toUpperCase()}
                            </div>

                            <div className={styles.userInfo}>
                                <div className={styles.username}>{f.username}</div>
                                <div className={styles.subText}>Friend</div>
                            </div>
                        </div>
                    ))}
                </div>

             {showRequests && (
    <div className={styles.modalOverlay}
     onClick={() => setShowRequests(false)}>
        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>

            <div className={styles.modalHeader}>
                <h3>Friend Requests</h3>
                <span
                    className={styles.close}
                    onClick={() => setShowRequests(false)}
                >
                    
                </span>
            </div>

            <div className={styles.tabs}>
                <button
                    className={activeTab === "received" ? styles.activeTab : ""}
                    onClick={() => setActiveTab("received")}
                >
                    Received
                </button>

                <button
                    className={activeTab === "sent" ? styles.activeTab : ""}
                    onClick={() => setActiveTab("sent")}
                >
                    Sent
                </button>
            </div>

            <div className={styles.requestsList}>
                {activeTab === "received" &&
                    received.map(r => (
                        <div key={r.id} className={styles.requestItem}>
                            <span>{r.username}</span>

                            <div>
                                <button
                                    onClick={() => acceptRequest(r.id)}
                                    className={styles.accept}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => rejectRequest(r.id)}
                                    className={styles.reject}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                }

                {activeTab === "sent" &&
                    sent.map(s => (
                        <div key={s.id} className={styles.requestItem}>
                            <span>{s.username}</span>
                            <span className={styles.pending}>Pending</span>
                        </div>
                    ))
                }

                {activeTab === "received" && received.length === 0 && (
                    <div className={styles.emptyState}>No requests</div>
                )}

                {activeTab === "sent" && sent.length === 0 && (
                    <div className={styles.emptyState}>No sent requests</div>
                )}
            </div>

        </div>
    </div>
)}

            </div>
        </div>
    );
}
