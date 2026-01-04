
// import Logo from '../reusable_elements/Logo'
import styles from './signin_page.module.css';
import { checkValidity } from '../page_utils/AuthPageUtils';
import { AppContext } from '../../Contexts.jsx';
import { loadUserDetails } from '../../loadUserDetails.js';
import { UiContext } from '../../utils/UiContext';

import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { server_url } from '../../../creds/server_url';

function SignInPage() {
    const navigate = useNavigate();
    const {setLogin, setUserDetails, setLoading} = useContext(AppContext);
    const {setOverride} = useContext(UiContext);

    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    })

    const [input_err_status, seterr] = useState({
        email: false,
        password: false
    });

    const handleInput = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (! checkValidity({ form: inputs, setInpErrStatus: seterr })) {
            alert("All the fields are required");

            return;
        }

        try {
            const response = await axios.post(`${server_url}/g-chat/signin`, inputs);

            if (response.data.success) {
                localStorage.setItem("user_id", response.data.user.id);
                await loadUserDetails(setUserDetails, setLoading, setOverride);
                setLogin();
                navigate("/dashboard");
            } else {
                console.log(response.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.signinBody}>
            <div className={styles.headerTexts}>
                <div className="logo">
                    <h1 className={styles.title}>Welcome Back!</h1>
                </div>

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
                        
                        style={{ outline: input_err_status.password ? '1px solid red' : 'none' }}
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
                    onClick={handleSubmit}
                >Login</button>
            </div>
            
            <div className={styles.signupoption}>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
}

export default SignInPage;