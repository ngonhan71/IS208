import { Link, NavLink } from 'react-router-dom';

import styles from './Header.module.css';
export default function NavBar() {

    return (
        <div className="d-flex align-items-center">
            <div className={styles.navItem}>
                <NavLink to="/" className={({isActive}) => isActive ? `${styles.active}` : null}>Trang chủ</NavLink>
            </div>
            <div className={styles.navItem}>
                <p className="nav-link">Phim</p>
                <div className={styles.subNav}>
                    <ul>
                        <li><Link to="/phim-dang-chieu">PHIM ĐANG CHIẾU</Link></li>
                        <li><Link to="/phim-sap-chieu">PHIM SẮP CHIẾU</Link></li>
                    </ul>
                </div>
            </div>
            <div className={styles.navItem}>
                <NavLink to="/gia-ve" className={({isActive}) => isActive ? `${styles.active}` : null}>Giá vé</NavLink>
            </div>
        </div>
    )

}