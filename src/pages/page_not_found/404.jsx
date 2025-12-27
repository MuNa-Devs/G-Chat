import styles from './404.module.css';
import SideBar from '../../reusable_component/SideBar';
import { Link } from 'react-router-dom';

export default function Dorakaled() {

    return (
        <div className={styles.notFoundPage}>
            <SideBar
                logo="#" 
            />

            <div className={styles.bodyDiv}>
                <div className={styles.display}>
                    <h1 className={styles.four}><i className="fa-solid fa-4"></i></h1>

                    <h1 className={styles.four}><i className="fa-solid fa-0"></i></h1>

                    <h1 className={styles.four}><i className="fa-solid fa-4"></i></h1>
                </div>

                <h1 className={styles.errmsg}>Error: Nalugu Vandhala Nalugu</h1>

                <h5>Ekkada em ledu, Pakkakelli aduko!</h5>

                <h6><Link to="/aprilfool">Contact Us</Link></h6>
            </div>
        </div>
    );
}