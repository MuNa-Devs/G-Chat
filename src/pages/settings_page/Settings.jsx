import styles from "./settings.module.css";
import ScrollDownBox from "../../reusable_component/scroll_downs/ScrollDownBox";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Settings() {
    const navigate = useNavigate();
    const location = useLocation();
    const native = location.state?.from || "/dashboard";

    const {theme, setTheme} = getThemeSetter();

    const [theme_label, setThemeLabel] = useState(localStorage.getItem("theme") || "NightLight");
    const [lang_label, setLangLabel] = useState(localStorage.getItem("language") || "English");

    return (
        <div className={styles.settings}>
            <div className={styles.wrapper}>
                <div className={styles.headerWrapper}>
                    <div className={styles.header}>
                        <h1>Application Settings</h1>

                        <p>Manage your application settings and preferences.</p>
                    </div>

                    <button className={styles.backBtn}
                        onClick={() => navigate(native)}
                    ><i className="fa-solid fa-chevron-left"></i> <span>Back</span></button>
                </div>

                <div className={styles.appearance}>
                    <h3>Appearance</h3>

                    <div className={styles.themes}>
                        <div className={styles.icon}>
                            <i className="fa-brands fa-affiliatetheme"></i>
                        </div>

                        <div className={styles.text}>
                            <h5>Theme</h5>

                            <p>Change the theme.</p>
                        </div>

                        <ScrollDownBox
                            label={theme_label}
                            options={[
                                "WorkFriendly",
                                "AutumnWarm",
                                "NightLight",
                                "DesertSand",
                                "ForestGreen",
                                "GalaxyPurple",
                                "IceBlue",
                                "MaterialGrey",
                                "SunnyDay",
                                "NeonNight",
                                "OceanBlue",
                                "PastelSoft",
                                "SoftGrind",
                                "SunsetOrange",
                            ]}
                            setLabel={setThemeLabel}
                        />
                    </div>
                </div>

                <div className={styles.others}>
                    <h3>language</h3>

                    <div className={styles.language}>
                        <div className={styles.icon}>
                            <i className="fa-solid fa-globe"></i>
                        </div>

                        <div className={styles.text}>
                            <h5>Language</h5>

                            <p>Change the language.</p>
                        </div>

                        <ScrollDownBox
                            label={lang_label}
                            options={[
                                "English",
                                "Telugu",
                                "Hindi"
                            ]}
                            setLabel={setLangLabel}
                        />
                    </div>
                </div>

                <div className={styles.bottomBtns}>
                    <button className={styles.cancel}>Cancel</button>

                    <button className={styles.save}
                        onClick={() => setTheme(theme_label)}
                    >Save Changes</button>
                </div>
            </div>
        </div>
    );
}