// Components
import styles from './signup_page.module.css';

// Package imports
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Signup page component
export default function SignUpPage() {

    // <--- State variables --->
    // Stores the updated values of input fields
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        conf_password: ""
    });

    // Stores the error status (empty or not); initially no errors
    const [input_err_status, setInputErrStatus] = useState({
        username: false,
        email: false,
        password: false,
        conf_password: false
    });

    const [is_signup_triggered, setSignupTriggerStatus] = useState(false);
    const [signup_status, setSignupStatus] = useState(true);
    

    // Updates the input field that is being changed
    const handleInputUpdates = (e) => {
        setInput({
            ...input, [e.target.name]: e.target.value
        });
    };

    // Performs these functions when signup button is triggered
    const signUpTriggered = () => {
        let temp_inp_err_status = {
            username: ! input.username,
            email: ! input.email,
            password: ! input.password,
            conf_password: ! input.conf_password
        };

        setInputErrStatus(temp_inp_err_status);

        if (Object.values(temp_inp_err_status).includes(true)) return;

        setSignupTriggerStatus(true);
    }

    return (
        <div className={styles.signupBody}>
            <div className={styles.headerTexts}>
                <div className="logo">
                    <h1 className={styles.title}>G-Chat</h1>
                </div>

                <h3>Create Your G-Chat Account</h3>
            </div>

            <div className={styles.signupCard}>

                <div className={styles.name}>
                    <h5>Full Name</h5>

                    <input className={styles.text}
                        name="username"
                        type="text"
                        placeholder='Enter your name'
                        value={input.username}
                        onChange={handleInputUpdates}
                        style={{ outline: input_err_status.username && "1px solid red" }}
                    />
                </div>

                <div className={styles.email}>
                    <h5>Email or Phone</h5>

                    <input className={styles.text}
                        name='email'
                        type="email"
                        placeholder='Email or Phone number'
                        value={input.email}
                        onChange={handleInputUpdates}
                        style={{ outline: input_err_status.email && "1px solid red" }}
                    />
                </div>

                <div className={styles.password}>
                    <h5>Create password</h5>

                    <input className={styles.text}
                        name='password'
                        type="password"
                        placeholder='Enter your password'
                        value={input.password}
                        onChange={handleInputUpdates}
                        style={{ outline: input_err_status.password && "1px solid red" }}
                    />
                </div>

                <div className={styles.confPassword}>
                    <h5>Confirm password</h5>

                    <input className={styles.text}
                        name='conf_password'
                        type="password"
                        placeholder='Re-enter your password'
                        value={input.conf_password}
                        onChange={handleInputUpdates}
                        style={{ outline: input_err_status.conf_password && "1px solid red" }}
                    />
                </div>

                {Object.values(input_err_status).includes(true) && <WarningDiv warning_text='All fields are required!' /> ||
                signup_status === "timeout" && <WarningDiv warning_text='Request timed out! try again later.' /> ||
                signup_status === "failed" && <WarningDiv warning_text='Request failed!' /> ||
                signup_status === "unknown" && <WarningDiv />}

                <button
                    className={styles.signupBtn}
                    onClick={signUpTriggered}
                    disabled={is_signup_triggered}
                >{is_signup_triggered ? "Processing..." : "Sign Up"}</button>
            </div>

            <div className={styles.signinOption}>
                <p>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
}