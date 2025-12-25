// Components
import styles from './signup_page.module.css';
import { checkValidity } from '../page_utils/AuthPageUtils';

// Package imports
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';

// Signup page component
export default function SignUpPage() {
    const navigate = useNavigate();

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

        if (inputs.password !== inputs.conf_password) {
            alert("Passwords do not match");

            return;
        }

        if (! checkValidity({ form: inputs, setInpErrStatus: setInpErrStatus })) {
            alert("All the fields are required");

            return;
        }

        try {
            const response = await axios.post("http://192.168.1.5:5500/g-chat/signup", inputs);

            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                navigate("/dashboard");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={styles.signupBody}>
            <div className={styles.headerTexts}>
                <div className="logo">
                    <h1 className={styles.title}>G-Chat</h1>
                </div>

                <p>Create Your G-Chat Account</p>
            </div>

            <div className={styles.signupCard}>
                <div className={styles.name}>
                    <h5>Full Name</h5>

                    <input className={styles.text}
                        name="username"
                        type="text"
                        placeholder='Enter your name'
                        onChange={handlechange}
                        value={inputs.username}
                        style={{ outline: input_err_status.username ? '1px solid red' : 'none' }}
                    />
                </div>

                <div className={styles.email}>
                    <h5>Gitam Email</h5>

                    <input className={styles.text}
                        name='email'
                        type="email"
                        placeholder='Gitam email'
                        onChange={handlechange}
                        value={inputs.email}
                        style={{ outline: input_err_status.email ? '1px solid red' : 'none' }}
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
                    />
                </div>

                <button className={styles.signupBtn}
                    onClick={handleSubmit}
                >
                    Sign Up
                </button>
            </div>

            <div className={styles.signinOption}>
                <p>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
}