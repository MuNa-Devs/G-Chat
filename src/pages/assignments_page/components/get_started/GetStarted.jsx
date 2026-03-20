import { useState } from "react";

export default function GetStarted(props) {
    const [showWriterBox, setShowWriterBox] = useState(false);
    const [price, setPrice] = useState("");
    const [file, setFile] = useState(null);

    return (
        <>
            {
                showWriterBox
                &&
                (
                    <div className={styles.popupOverlay}>
                        <div className={styles.popupBox}>

                            <h3>Become a Writer</h3>

                            <div className={styles.popupField}>
                                <label>Upload Handwriting Sample</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>

                            <div className={styles.popupField}>
                                <label>Price Per Page</label>
                                <input
                                    type="number"
                                    placeholder="Enter price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className={styles.popupActions}>
                                <button onClick={() => setShowWriterBox(false)}>
                                    Cancel
                                </button>

                                <button>
                                    Submit
                                </button>
                            </div>

                        </div>
                    </div>
                )
            }
        </>
    );
}