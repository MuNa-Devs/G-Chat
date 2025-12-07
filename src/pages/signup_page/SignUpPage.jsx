// Components
import styles from './signup_page.module.css';

// Package imports
import { Link, useNavigate } from 'react-router-dom';

// Signup page component
export default function SignUpPage() {
    const navigate = useNavigate();

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
                    />
                </div>

                <div className={styles.email}>
                    <h5>Gitam Email</h5>

                    <input className={styles.text}
                        name='email'
                        type="email"
                        placeholder='Gitam email'
                    />
                </div>

                <div className={styles.password}>
                    <h5>Create password</h5>

                    <input className={styles.text}
                        name='password'
                        type="password"
                        placeholder='Enter your password'
                    />
                </div>

                <div className={styles.confPassword}>
                    <h5>Confirm password</h5>

                    <input className={styles.text}
                        name='conf_password'
                        type="password"
                        placeholder='Re-enter your password'
                    />
                </div>

                <button
                    className={styles.signupBtn}
                    onClick={() => navigate("/dashboard")}
                >Sign Up</button>
            </div>

            <div className={styles.signinOption}>
                <p>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    );
}