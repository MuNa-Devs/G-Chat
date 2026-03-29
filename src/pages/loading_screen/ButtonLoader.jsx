import styles from "./button_loader.module.css";

const ButtonLoader = ({ loader_style, dot_style }) => {
    return (
        <div
            className={styles.loader}
            style={loader_style}
        >
            <div
                className={styles.dot}
                style={dot_style}
            ></div>

            <div
                className={styles.dot}
                style={dot_style}
            ></div>

            <div
                className={styles.dot}
                style={dot_style}
            ></div>
        </div>
    );
};

export default ButtonLoader;