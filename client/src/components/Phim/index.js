import { Link } from "react-router-dom"
import styles from "./Phim.module.css"

export default function Phim({maPhim, tenPhim, poster}) {
    return (
        <Link to={`/dat-ve/${maPhim}`} className={styles.phim}>
            <div>
                <div className={styles.poster}>
                    <img src={poster} alt="" />
                    <div className={styles.overlay}>
                        <button type="button">MUA VÉ</button>
                    </div>
                </div>
                <p>{tenPhim}</p>
            </div>
        </Link>
    )
}