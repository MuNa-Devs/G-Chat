import EmojiPicker from "emoji-picker-react";

import styles from "./picker.module.css";

export default function EmojiBox(props) {

    return (
        <div className={styles.emojiPicker}>
            <EmojiPicker
                className={styles.emojiBox}
                onEmojiClicked={props.onEmojiClicked}
                autoFocusSearch={false}
                searchDisabled={true}
                emojiStyle="google"
                previewConfig={{
                    showPreview: false
                }}
                lazyLoadEmojis={true}
            />
        </div>
    );
}