import styles from "./get_started.module.css";
import { server_url } from "../../../../../creds/server_url";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../../../Contexts";
import { useState } from "react";
import DivLoader from "../../../loading_screen/DivLoader";

export default function WriterPopup({
    show,
    setShow
}) {
    const { user_details, setLogout } = useContext(AppContext);
    const [file, setFile] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);


    if (!show) return null;

    const submitWriter = async () => {
        try {
            if (!file || !price) return;

            setLoading(true);
            const formData = new FormData();

            formData.append("files", file);

            const uploadRes = await axios.post(
                `${server_url}/g-chat/files/upload?user_id=${user_details?.id}`,
                formData,
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const uploadedFile =
                uploadRes.data.files_list[0].file_url;

            await axios.post(
                `${server_url}/g-chat/orders/writers/create`,
                {
                    writer_id: user_details?.id,
                    sample_url: uploadedFile,
                    price_per_page: price
                },
                {
                    headers: {
                        auth_token: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setLoading(false);
            setShow(false);

        } catch (err) {
            console.error(err);

            if (["INVALID_JWT", "FORBIDDEN"].includes(err.response?.data?.code))
                setLogout();

            setLoading(false);
        }
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupBox}>

                <h3>Become a Writer</h3>

                <div className={styles.popupField}>
                    <label>Handwriting Sample</label>

                    <label className={styles.captureBtn}>
                        Take Sample Picture

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            hidden
                            onChange={(e) => {
                                const selected = e.target.files[0];
                                if (selected) setFile(selected);
                            }}
                        />
                    </label>

                    {file && (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="sample"
                            className={styles.previewImage}
                        />
                    )}
                </div>

                <div className={styles.popupField}>
                    <label>Price Per Page</label>

                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                    />
                </div>

                {
                    loading
                        ?
                        <DivLoader />
                        :
                        <div className={styles.popupActions}>
                            <button onClick={() => setShow(false)}>
                                Cancel
                            </button>

                            <button onClick={submitWriter}>
                                OK
                            </button>
                        </div>
                }
            </div>
        </div>
    );
}