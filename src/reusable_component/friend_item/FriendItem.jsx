import styles from "./friend_item.module.css";

export default function FriendItem({
    user,
    type = "friend", // friend | search
    isFriend,
    isPending,
    onAdd,
    onMessage,
    onViewProfile,
    onRemove,
    activeMenu,
    setActiveMenu
}) {

    return (
        <div className={styles.friendItem}>
            <div className={styles.avatar}>
                {user.username.charAt(0).toUpperCase()}
            </div>

            <div className={styles.userInfo}>
                <div className={styles.username}>{user.username}</div>

                {type === "friend" && (
                    <div className={styles.subText}>Friend</div>
                )}
            </div>


            {/* SEARCH MODE */}
            {type === "search" && (
                <div className={styles.action}>
                    {isFriend ? (
                        <span className={styles.connected}>Connected</span>
                    ) : isPending ? (
                        <span className={styles.pending}>Pending</span>
                    ) : (
                        <button
                            onClick={() => onAdd(user.id)}
                            className={styles.addBtn}
                        >
                            Add Friend
                        </button>
                    )}
                </div>
            )}


            {/* FRIEND MODE */}
            {type === "friend" && (
                <>
                    <div
                        className={styles.menuIcon}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(user.id);
                        }}
                    >
                        ⋮
                    </div>

                    {activeMenu === user.id && (
                        <div className={styles.menu}>
                            <div onClick={() => onMessage(user.id)}>Message</div>
                            <div onClick={() => onViewProfile(user.id)}>View Profile</div>
                            <div
                                className={styles.danger}
                                onClick={() => onRemove(user.friend_id)}
                            >
                                Remove Friend
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}