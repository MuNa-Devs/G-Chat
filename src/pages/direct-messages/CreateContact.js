import axios from "axios";

export default function createContact(user_id, friend_id, props){
    axios.post(
        server_url + `/g-chat/messages/create/contact?user_id=${user_id || sessionStorage.getItem("user_id")}&friend_id=${friend_id}`,
        {
            headers: {
                auth_token: `Bearer ${localStorage.getItem("token")}`
            }
        }
    ).then(res => {
        //
    }).catch(err => {
        //
    });
}