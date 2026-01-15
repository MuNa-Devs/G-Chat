import styles from "./fileobject.module.css";

export const getIcon = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();

    if (["png", "jpeg", "jpg", "webp", "svg", "ico"].includes(ext))
        return {
            element: <i className="fa-solid fa-file-image" />,
            classname: styles.image
        };

    if (["ppt", "pptx", "odp", "key"].includes(ext))
        return {
            element: <i className="fa-solid fa-file-powerpoint" />,
            classname: styles.presentation
        };

    if (["xls", "xlsx", "ods"].includes(ext))
        return {
            element: <i className="fa-solid fa-file-excel" />,
            classname: styles.spreadsheet
        };

    if (["doc", "docx", "odt"].includes(ext))
        return {
            element: <i className="fa-solid fa-file-word" />,
            classname: styles.word
        };

    if (["mp3", "wav", "aac", "flac", "m4a"].includes(ext))
        return {
            element: <i className="fa-solid fa-file-audio" />,
            classname: styles.audio
        };

    if (["mp4", "avi", "mov", "mkv", "wmv"].includes(ext))
        return {
            element: <i className="fa-solid fa-file-video" />,
            classname: styles.video
        };

    if (ext === "pdf") return {
        element: <i className="fa-solid fa-file-pdf" />,
        classname: styles.pdf
    };

    if (ext === "csv") return {
        element: <i className="fa-solid fa-file-csv" />,
        classname: styles.csv
    };

    if (ext === "txt") return {
        element: <i className="fa-solid fa-file-lines" />,
        classname: styles.text
    };

    return { element: <i className="fa-solid fa-file"></i> };
};

export default function FileObject(props) {

    return (
        <div className={styles.filesDiv}>
            {
                props.files.map((file, index) => (
                    <div key={index} className={styles.fileObject}>
                        <div className={`${styles.icon} ${getIcon(file).classname}`}>
                            {getIcon(file).element}
                        </div>

                        <h3>{file.name}</h3>
                    </div>
                ))
            }
        </div>
    );
}