// Components
import styles from './signup_page.module.css';
import { checkValidity } from '../page_utils/AuthPageUtils';
import { AppContext } from '../../Contexts.jsx';
import { loadUserDetails } from '../../loadUserDetails.js';
import { UiContext } from '../../utils/UiContext';
import Alert from '../../reusable_component/alert_div/Alert.jsx';
import { server_url } from '../../../creds/server_url';
import { code_alert_mapper } from '../page_utils/code_alert_mapper.js';

// Package imports
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from "react";
import axios from 'axios';

// Signup page component
export default function SignUpPage() {
    const navigate = useNavigate();
    const { setLogin, setUserDetails, setLoading } = useContext(AppContext);
    const { setOverride } = useContext(UiContext);
    const [alert, setAlert] = useState(false);
    const [reg_status, setReg] = useState(false);

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        conf_password: ""
    });

    const [input_err_status, setInpErrStatus] = useState({
        username: false,
        email: false,
        password: false,
        conf_password: false
    });

    const handlechange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setInpErrStatus({
            username: false,
            email: false,
            password: false,
            conf_password: false
        });

        if (inputs.password !== "" && inputs.password !== inputs.conf_password) {
            setAlert("Passwords DO NOT match!");
            setInpErrStatus({
                ...input_err_status,
                password: true,
                conf_password: true
            });

            return;
        }

        if (!checkValidity({ form: inputs, setInpErrStatus: setInpErrStatus })) {
            setAlert("All the fields are required!");

            return;
        }

        setAlert(false);
        setReg(true);

        try {
            const response = await axios.post(`${server_url}/g-chat/auth/signup`, inputs);

            if (response.data.success) {
                localStorage.setItem("user_id", response.data.user.id);
                await loadUserDetails(setUserDetails, setLoading, setOverride);
                setLogin(true);
                navigate("/dashboard");
            }

            else
                setAlert(code_alert_mapper[response.data.code]);
        } catch (error) {
            setAlert(code_alert_mapper[error.response.data.code]);
        }

        setReg(false);
    };

    const [is_leaving, setIsLeaving] = useState(false);

    const handleTransition = (e) => {
        e.preventDefault();
        setIsLeaving(true);

        setTimeout(() => {
            navigate("/signin");
        }, 500);
    }

    return (
        <div className={styles.signupBody}>
            <div className={`${styles.headerTexts} ${is_leaving ? styles.evaporate : styles.condensate}`}>
                <div className="logo">
                    <h1 className={styles.title}>G-Connect</h1>
                </div>

                <p>Create Your G-Connect Account</p>
            </div>

            <div className={`${styles.signupCard} ${is_leaving ? styles.slideOutDiv : styles.slideInDiv}`}>
                <div className={styles.name}>
                    <h5>Full Name</h5>

                    <input className={styles.text}
                        name="username"
                        type="text"
                        placeholder='Enter your name'
                        onChange={handlechange}
                        value={inputs.username}
                        style={{ outline: input_err_status.username ? '1px solid red' : 'none' }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                    />
                </div>

                <div className={styles.email}>
                    <h5>GITAM Email</h5>

                    <input className={styles.text}
                        name='email'
                        type="email"
                        placeholder='GITAM email'
                        onChange={handlechange}
                        value={inputs.email}
                        style={{ outline: input_err_status.email ? '1px solid red' : 'none' }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                    />
                </div>

                <div className={styles.password}>
                    <h5>Create password</h5>

                    <input className={styles.text}
                        name='password'
                        type="password"
                        placeholder='Enter your password'
                        onChange={handlechange}
                        value={inputs.password}
                        style={{ outline: input_err_status.password ? '1px solid red' : 'none' }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                    />
                </div>

                <div className={styles.confPassword}>
                    <h5>Confirm password</h5>

                    <input className={styles.text}
                        name='conf_password'
                        type="password"
                        placeholder='Re-enter your password'
                        onChange={handlechange}
                        value={inputs.conf_password}
                        style={{ outline: input_err_status.conf_password ? '1px solid red' : 'none' }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                    />
                </div>

                <button className={styles.signupBtn}
                    onClick={handleSubmit}
                >
                    {
                        reg_status
                            ?
                            <div className={styles.registering}>
                                <i className="fa-solid fa-spinner"></i>
                            </div>
                            :
                            "Register"
                    }
                </button>
            </div>

            <div className={`${styles.signinOption} ${is_leaving ? styles.evaporate : styles.condensate}`}>
                <p>
                    Already have an account? <Link to="/signin" onClick={handleTransition}>Sign In</Link>
                </p>
            </div>
            

            {
                alert
                &&
                <Alert
                    text={alert}
                    closeHook={setAlert}
                />
            }
        </div>
    );
}