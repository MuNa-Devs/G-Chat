import styles from "./toggle.module.css";

import { useState } from "react";

// Documentation on how tyo use:
// This component takes 3 values - defaultValue & onChange (function)
// (1) defaultValue sets what initial position will be = true -> on; false -> off.
// (2) onChange function will let you run any function inside the module you imported this in.
// Happy birthday 👍

export default function Toggle({defaultValue = false, onChange = () => {}}){
    const [isOn, setIsOn] = useState(defaultValue);

    const handleToggle = () => {
        const newValue = !isOn;
        setIsOn(newValue);
        onChange(newValue);
    };

    return (
        <div
            className={`${styles.toggleSwitch} ${isOn ? styles.on : styles.off}`}
            onClick={handleToggle}
        >
            <div className={styles.toggleCircle}></div>
        </div>
    );
}