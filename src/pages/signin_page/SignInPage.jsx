// Need to complete it (add backend communication)

// import Logo from '../reusable_elements/Logo'
import styles from './signin_page.module.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignInPage() {
    const navigate = useNavigate();
    const [warning_div_action, setWarningDivAction] = useState({
        action: false,
        message: ''
    })

    // --------------------------------
    // Input handlings
    // --------------------------------
    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    })

    const [input_err_status, seterr] = useState("");

    const handleInput = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputs.email || !inputs.password) {
            seterr("you should enter all fields");
            return;
        }

        try {
            const response = await axios.post("http://172.20.138.7:5500/signin", inputs);
            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(response.data.user));

                navigate("/dashboard");
            } else {
                seterr(response.data.message);
                console.log("Signin failed:", response.data.message);
            }
        } catch (err) {
            console.error("Error during signin:", err);
            seterr(err.message);

        }
    }

    return (
        <div className={styles.signinBody}>
            <div className={styles.headerTexts}>
                <div className="logo">
                    <h1 className={styles.title}>G-Chat</h1>
                </div>

                <h2 className={styles.greetings}>Welcome Back!</h2>

                <p>Login to your G-Chat account</p>
            </div>

            <div className={styles.signinCard}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.email}>
                        <h5>Gitam Email</h5>

                        <input className={styles.text}
                            type="email"
                            placeholder='Enter your Gitam email address'
                            name='email'
                            value={inputs.email}
                            onChange={handleInput}

                            style={{ outline: input_err_status.email ? '1px solid red' : 'none' }}
                        />
                    </div>

                    <div className={styles.pswd}>
                        <h5>Password</h5>

                        <input className={styles.text}
                            type="password"
                            placeholder='Enter your password'
                            name='password'
                            value={inputs.password}
                            onChange={handleInput}
                        />
                    </div>

                    <div className={styles.utils}>
                        <div className={styles.rememberMeDude}>
                            <label>
                                <input type="checkbox" />
                                <h5>Remember me</h5>
                            </label>
                        </div>

                        <a href="#" className={styles.forgotpswd}><p>Forgot Password?</p></a>
                    </div>

                    <button
                        className={styles.loginBtn}
                        type="submit"
                    >Login</button>
                </form>
            </div>
            <div className={styles.signupoption}>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
}

export default SignInPage;