// Need to complete it (add backend communication)

// import Logo from '../reusable_elements/Logo'
import styles from './signin_page.module.css';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignInPage(){
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

    const [input_err_status, setInputErrStatus] = useState({
        email: false,
        password: false
    })

    const handleInput = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = (e) => {
        const temp_inp_error_status = {
            email: ! inputs.email,
            password: ! inputs.password
        }

        setInputErrStatus(temp_inp_error_status)

        if (Object.values(input_err_status).includes(true)){
            setWarningDivAction({
                action: true,
                message: "All fields are required!"
            })
        }

        else navigate("/dashboard")
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
                <div className={styles.email}>
                    <h5>Gitam Email</h5>

                    <input className={styles.text}
                        type="email" 
                        placeholder='Enter your Gitam email address'
                        name='email'
                        value={inputs.email}
                        onChange={handleInput}

                        style={{outline: input_err_status.email ? '1px solid red' : 'none'}}
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
                    onClick={() => navigate("/dashboard")}
                >Login</button>
            </div>

            <div className={styles.signupoption}>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
}

export default SignInPage;