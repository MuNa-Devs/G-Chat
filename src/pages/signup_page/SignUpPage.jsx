// Components
import styles from './signup_page.module.css';

// Package imports
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';

// Signup page component
export default function SignUpPage() {
    const navigate = useNavigate();
      const [form ,setform] = useState({
        username: "",
        email: "",
        password: "",
        conf_password: ""
    });
    
    const [err,seterr] = useState('');

    const handlechange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        if(form.password !== form.conf_password){
            seterr("Passwords do not match");
            return;
        }

        if(!form.username || !form.email || !form.password || !form.conf_password){
            seterr("All fields are required");
            return;
        }

        try {
            const response = await axios.post("http://172.20.129.49:5500/signup", form); //axios retuns an object
            
            if(response.data.success){
                localStorage.setItem("user", JSON.stringify(response.data.user));
                navigate("/dashboard");
            } else {
                seterr(response.data.message);
            }
            
        }
        
        catch (error) {
            seterr(error.message);
        }
    };

    return (
        <div className={styles.signupBody}>
            <div className={styles.headerTexts}>
                <div className="logo">
                    <h1 className={styles.title}>G-Chat</h1>
                </div>

                <h3>Create Your G-Chat Account</h3>
            </div>

            <div className={styles.signupCard}>
            <form onSubmit={handlesubmit}>
                <div className={styles.name}>
                    <h5>Full Name</h5>

                    <input className={styles.text}
                        name="username"
                        type="text"
                        placeholder='Enter your name'
                        onChange={handlechange}
                        value={form.username}
                    />
                </div>

                <div className={styles.email}>
                    <h5>Gitam Email</h5>

                    <input className={styles.text}
                        name='email'
                        type="email"
                        placeholder='Gitam email'
                        onChange={handlechange}
                        value={form.email}
                    />
                </div>

                <div className={styles.password}>
                    <h5>Create password</h5>

                    <input className={styles.text}
                        name='password'
                        type="password"
                        placeholder='Enter your password'
                        onChange={handlechange}
                        value={form.password}
                    />
                </div>

                <div className={styles.confPassword}>
                    <h5>Confirm password</h5>

                    <input className={styles.text}
                        name='conf_password'
                        type="password"
                        placeholder='Re-enter your password'
                        onChange={handlechange}
                        value={form.conf_password}
                    />
                </div>

                <button className={styles.signupBtn}  type="submit" >
                        Sign Up
                    </button>
                </form>
            </div>

            <div className={styles.signinOption}>
                <p>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
}