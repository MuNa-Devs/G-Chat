import EmojiPicker from "emoji-picker-react";

import styles from "./picker.module.css";

export default function EmojiBox(props) {

    return (
        <div className={styles.emojiPickerContainer}>
            <EmojiPicker
                className={styles.emojiBox}
                onEmojiClick={props.setEmoji}
                autoFocusSearch={false}
                searchDisabled={true}
                suggestedEmojisMode="recent"
                emojiStyle="google"
                previewConfig={{
                    showPreview: false
                }}
                lazyLoadEmojis={true}
            />
        </div>
    );
}