import styles from './404.module.css';

import { Link } from 'react-router-dom';

export default function AprilFool(){

    return (
        <div className={styles.hahaha}>
            <h1>April Fool</h1>

            <Link to="*">Go Back</Link>
        </div>
    );
}