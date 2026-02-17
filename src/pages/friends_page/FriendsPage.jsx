import { useEffect, useState, useContext } from 'react';
import axios from "axios";

import SideBar from '../../reusable_component/SideBar';
import styles from './friendspage.module.css';
import { server_url } from '../../../creds/server_url';
import { AppContext } from '../../Contexts';

export default function FriendsPage() {

    const { user_details, setLogOut } = useContext(AppContext);

    const [friend, setFriend] = useState("");
    const [friends, setFriends] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [activeTab, setActiveTab] = useState("received");
    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showProfile, setShowProfile] = useState(false);



    const searchFriends = async (query) => {
        try {
            setLoading(true);
            setHasSearched(false);
            console.log(query);

            const res = await axios.get(
                `${server_url}/g-chat/users/search?user_id=${user_details?.id || localStorage.getItem("user_id")}&query=${query}`,
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            ); // server sends the following data:
            // res.data.users = array of {
            //  id -> user id,
            //  username -> their name,
            //  pfp -> their pfp (filename only not link). telusu kda, server_url tho...
            //  is_friend -> are they ur frnd (bool)
            // }

            console.log(res.data?.users);
            setResults(res.data?.users || []);
            setHasSearched(true);
        } catch (err) {
            console.error(err);

            if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                setLogOut();

            setHasSearched(true);
        }
        finally {
            setLoading(false);
        }
    };


    const sendRequest = async (receiverId) => {
        axios.post(`${server_url}/g-chat/users/requests?action=send&user_id=${user_details?.id || localStorage.getItem("user_id")}`,
            {
                senderId: user_details?.id || localStorage.getItem("user_id"),
                receiverId
            },
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            } // res.data.response = { request_id -> id of the request row in db }
        ).then(res => {
            setResults(prev => prev.filter(u => u.id !== receiverId));
        }).catch(err => {
            if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                setLogOut();
        });
    };


    const acceptRequest = async (requestId) => {
        try {
            await axios.post(
                `${server_url}/g-chat/users/requests?action=accept&user_id=${user_details?.id || localStorage.getItem("user_id")}`,
                {
                    requestId:requestId,
                    userId: user_details?.id || Number(localStorage.getItem("user_id"))
                },
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            ); // res.data.response = { friend_id -> the id of relationship row in db }

            // remove from received UI
            setReceived(prev => prev.filter(r => r.request_id !== requestId));


            // Server returns this (Idhi maracchu nvu expect chesina object kakunda):
            // sentRes.data.sent_reqs = array of {
            //  request_id -> the id of this request in DB,
            //  user_id -> the id of user who sent this request,
            //  receiver_id -> the one u sent this request to,
            //  receiver_name -> name of receiver,
            //  receiver_pfp -> pfp filename of receiver,
            //  sent_at -> the time at which this req was sent (UTC)
            // }
            // refresh sent requests (opposite request deleted in backend)
            const sentRes = await axios.get(
                `${server_url}/g-chat/users/requests/sent?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            console.log(sentRes.data.sent_reqs);
            setSent(sentRes.data?.sent_reqs);


            // refresh friends list
            const friendsRes = await axios.get(
                `${server_url}/g-chat/users/friends?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            ); // Server returns the following:
            // friendRes.data.friends = array of {
            //  friend_id -> id of the relationship in db
            //  id -> id of ur friedn
            //  username -> username of ur friend
            //  pfp -> pfp filename of ur frined
            // }

            setFriends(friendsRes.data.friends);

        } catch (err) {
            console.error("Accept request failed:", err);

            if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                setLogOut();
        }
    };


    const rejectRequest = async (requestId) => {
        axios.post(
            `${server_url}/g-chat/users/requests?action=reject&user_id=${user_details?.id || localStorage.getItem("user_id")}`,
            {
                requestId: requestId,
                userId: user_details?.id || localStorage.getItem("user_id")
            },
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        ) // Returns { request_id }
            .then(res => {
                setReceived(prev => prev.filter(r => r.request_id !== requestId));
            })
            .catch(err => {
                if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                    setLogOut();
            });

    };

    const openProfile = async (friendId) => {
        try {
            const res = await axios.get(
                `${server_url}/g-chat/users/get-user?user_id=${user_details?.id || localStorage.getItem("user_id")}&req_user_id=${friendId}`,
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            ); // Server sends this data:
            // res.data.user = array of {
            //  id -> friend's id
            //  username -> friend's name
            //  pfp -> friend's pfp filename
            //  department -> friend's department
            //  about -> friend's bio
            //  phone -> friend's phone num
            //  personal_email -> friend's personal email
            // }

            setSelectedFriend(res.data.user);
            setShowProfile(true);
        } catch (err) {
            if (err.response?.data?.code === "NOT_FOUND") {
                console.error("User profile not found");
            }

            if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                setLogOut();
        }
    };

    const removeFriend = async (friendId) => {
        // Here friendId is expected to be relationship id in db.
        try {
            await axios.post(
                `${server_url}/g-chat/users/friends/remove?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
                {
                    userId: user_details?.id || localStorage.getItem("user_id"),
                    friendId
                },
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setFriends(prev => prev.filter(f => f.friend_id !== friendId));
        } catch (err) {
            console.error(err);

            if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                setLogOut();
        }
    };

    const isFriend = (userId) =>
        friends.some(f => f.id === userId);

    const isPending = (userId) =>
        sent.some(s => s.receiver_id === userId) ||
        received.some(r => r.sender_id === userId);






    useEffect(() => {
        if (!user_details?.id) return;

        axios.get(
            `${server_url}/g-chat/users/friends?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        ) // Server returns the following:
            // friendRes.data.friends = array of {
            //  friend_id -> id of the relationship in db
            //  id -> id of ur friedn
            //  username -> username of ur friend
            //  pfp -> pfp filename of ur frined
            // }
            .then(res => setFriends(res.data.friends))
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
        
        axios.get(
            `${server_url}/g-chat/users/requests/received?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )   // Server returns this:
        // sentRes.data.sent_reqs = array of {
        //  request_id -> the id of this request in DB,
        //  user_id -> the id of user who received this request (you),
        //  sender_id -> the one who sent u this request,
        //  sender_name -> name of sender,
        //  sender_pfp -> pfp filename of sender,
        //  sent_at -> the time at which this req was sent (UTC)
        // }
            .then(res => setReceived(res.data?.rec_reqs))
            .catch(console.error);

        // Server returns this (Idhi maracchu nvu expect chesina object kakunda):
        // sentRes.data.sent_reqs = array of {
        //  request_id -> the id of this request in DB,
        //  user_id -> the id of user who sent this request (you),
        //  receiver_id -> the one u sent this request to,
        //  receiver_name -> name of receiver,
        //  receiver_pfp -> pfp filename of receiver,
        //  sent_at -> the time at which this req was sent (UTC)
        // }
        // refresh sent requests (opposite request deleted in backend)
        axios.get(
            `${server_url}/g-chat/users/requests/sent?user_id=${user_details?.id || localStorage.getItem("user_id")}`,
            {
                headers: {
                    auth_token: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then(res => setSent(res.data?.sent_reqs))
            .catch(console.error);

    }, [showRequests, user_details]);
    useEffect(() => {
        const closeMenu = () => setActiveMenu(null);
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);



    return (
        <div className={styles.friendsMain}>
            <SideBar className={styles.sidebar}
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
                            </div>

                            <div className={styles.action}>
                                {isFriend(u.id) ? (
                                    <span className={styles.connected}>Connected</span>
                                ) : isPending(u.id) ? (
                                    <span className={styles.pending}>Pending</span>
                                ) : (
                                    <button
                                        onClick={() => sendRequest(u.id)}
                                        className={styles.addBtn}
                                    >
                                        Add Friend
                                    </button>
                                )}
                            </div>
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

                            <div
                                className={styles.menuIcon}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(f.id);
                                }}
                            >
                                ⋮
                            </div>

                            {showProfile && selectedFriend && (
                                <div
                                    className={styles.profileOverlay}
                                    onClick={() => setShowProfile(false)}
                                >
                                    <div
                                        className={styles.profileModal}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            src={
                                                selectedFriend.pfp
                                                    ? `${server_url}/files/${selectedFriend.pfp}`
                                                    : "https://cdn-icons-png.flaticon.com/512/4847/4847985.png"
                                            }
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://cdn-icons-png.flaticon.com/512/4847/4847985.png";
                                            }}
                                            className={styles.profilePic}
                                            alt="profile"
                                        />

                                        <div className={styles.fname}>
                                            <h3>{selectedFriend.username}</h3>
                                        </div>
                                        <div className={styles.fdept}>
                                            <p className={styles.department}>
                                                {selectedFriend.department || "No department"}
                                            </p>
                                        </div>
                                        <div className={styles.fabout}>
                                            <p className={styles.about}>
                                                {selectedFriend.about || "No bio available"}
                                            </p>
                                        </div>

                                        <button
                                            className={styles.messageBtn}
                                            onClick={() => {
                                                setShowProfile(false);
                                                navigate(`/dm/${selectedFriend.id}`);
                                            }}
                                        >
                                            Message
                                        </button>
                                    </div>
                                </div>
                            )}


                            {activeMenu === f.id && (
                                <div className={styles.menu}>
                                    <div onClick={() => openChat(f.id)}>Message</div>
                                    <div onClick={() => openProfile(f.id)}>View Profile</div>
                                    <div
                                        className={styles.danger}
                                        onClick={() => removeFriend(f.friend_id)}
                                    >
                                        Remove Friend
                                    </div>
                                </div>
                            )}
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
                                        <div key={r.request_id} className={styles.requestItem}>
                                            <span>{r.sender_name}</span>

                                            <div>
                                                <button
                                                    onClick={() => acceptRequest(r.request_id)}
                                                    className={styles.accept}
                                                >
                                                    Accept
                                                    
                                                </button>
                                                <button
                                                    onClick={() => rejectRequest(r.request_id)}
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
                                        <div key={s.request_id} className={styles.requestItem}>
                                            <span>{s.receiver_name}</span>
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
