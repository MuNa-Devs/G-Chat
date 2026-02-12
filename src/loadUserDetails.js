import axios from "axios";
import { server_url } from "../creds/server_url";

export const loadUserDetails = async (setUserDetails, setLoading, setOverride, setLogOut) => {
    setLoading(true);
    setOverride("loading");

    try {
        const user_id = localStorage.getItem("user_id");

        if (!user_id) {
            setUserDetails(null);
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) setLogOut();

        const res = await axios.get(
            `${server_url}/g-chat/users/get-user?user_id=${user_id}`,
            {
                headers: {
                    auth_token: `Bearer ${token}`
                }
            }
        );

        if (res.data.code === "INVALID_JWT") setLogOut();

        setUserDetails(res.data.user);
    } catch (err) {
        console.log("User details not loaded:", err);
        setLogOut();
        setUserDetails({
            id: 0,
            username: "",
            email: "",
            is_verified: false,
            pfp: "#",
            department: "",
        });
    } finally {
        setOverride(null);
        setLoading(false);
    }
};
