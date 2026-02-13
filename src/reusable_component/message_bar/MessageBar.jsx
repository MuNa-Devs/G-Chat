import styles from "./message_bar.module.css";

export default function MessageBar(props) {

    const autoReHeight = (e) => {
        const thing = e.target;
        thing.style.height = "auto";
        thing.style.height = Math.min(thing.scrollHeight - 24, 150) + "px";
    };

    return (
        <div className={styles.textControls}>
            <button
                onClick={() => props.setShowPicker(prev => !prev)}
                className={styles.emojis}
            ><i className="fa-solid fa-face-laugh"></i></button>

            <button
                className={styles.files}
                onClick={() => {
                    document.getElementById("file").click();
                }}
            ><i className="fa-solid fa-paperclip"></i></button>

            <input
                id="file"
                type="file"
                multiple
                onChange={props.handleFiles}
                style={{
                    display: "none"
                }}
            />

            <textarea
                rows={1}
                ref={props.input_ref}
                value={props.message}
                type="text"
                placeholder="Type a message"
                onClick={() => {
                    props.setShowPicker(false);
                }}
                onChange={(e) => {
                    props.setMessage(e.target.value);
                    autoReHeight(e);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        props.sendMessage();
                        e.preventDefault();
                    }
                }}
            />

            <button
                className={styles.send}
                onClick={props.sendMessage}
            ><i className="fa-solid fa-paper-plane"></i></button>
        </div>
    );
}

// Required props list:
// setShowPicker()
// handleFiles()
// input_ref
// message
// setMessage()
// sendMessage()