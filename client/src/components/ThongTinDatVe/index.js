import { useSelector } from "react-redux"
import { useMemo, useState } from "react"
import { Badge } from "react-bootstrap"
import { FaArrowRight } from "react-icons/fa"

import styles from "./TTDatVe.module.css"
import format from "../../helper/format"

export default function ThongTinDatVe({onChangePage, page, totalPage}) {
    const { phim, suatChieu, dsVe } = useSelector((state) => state.booking)

    const { poster, ten_phim, dotuoi_quydinh } = phim
    const { ten_rapchieu, ten_phongchieu, ngay_chieu, gio_chieu, isNgayLe, tenNgayLe } = suatChieu

    const [dsVeByLoai, setDsVeByLoai] = useState([])

    const result = useMemo(() => {
        let tong = 0;
        const data = []
        for(let i = 0; i < dsVe.length; i++) {
            const index = data.findIndex(v => v.ma_loaighe === dsVe[i].ma_loaighe);
            if (index === -1) {
                const ds = [dsVe[i]]
                data.push({
                    ma_loaighe: dsVe[i].ma_loaighe,
                    ten_loaighe: dsVe[i].ten_loaighe,
                    tong: dsVe[i].gia,
                    dsVe: ds
                })
            } else {
                data[index].tong = data[index].tong + dsVe[i].gia
                data[index].dsVe.push(dsVe[i])
            }
            tong += dsVe[i].gia
        }
        setDsVeByLoai(data)
        return tong
    }, [dsVe])
    return (
        <div className={styles.wrapper}>
            <img src={poster} alt="" />
            <p style={{fontSize: 20}}>{ten_phim}</p>
            <button style={{padding: "4px 10px", width: 50}}>C{dotuoi_quydinh}</button>
            <p><span className={styles.key}>Rạp: </span><span>{ten_rapchieu} | {ten_phongchieu}</span></p>
            <p><span className={styles.key}>Suất chiếu: </span><span>{gio_chieu} | {format.convertToDay(new Date(ngay_chieu).getDay())}, {format.formatDate(ngay_chieu)}</span></p>
            <div>{isNgayLe && isNgayLe === true && <h4><Badge bg="danger">{tenNgayLe}</Badge></h4>}</div>
            <div>
                <p><span className={styles.key}>Ghế: </span></p>

                {dsVeByLoai && dsVeByLoai?.length > 0 && dsVeByLoai.map(loai => {
                    return (
                        <div key={loai.ma_loaighe} className="d-flex">
                           <p style={{marginRight: 5}}>{loai?.dsVe?.length}x ghế {loai.ten_loaighe}:</p> 
                           <p style={{fontWeight: "bold"}}>
                            {loai?.dsVe && loai?.dsVe?.length > 0 && loai?.dsVe.map((ve, index) => {
                                if (index === 0) return <span key={ve.ma_ghe}>{ve.hang}{ve.thutu}</span>
                                else return <span key={ve.ma_ghe}>, {ve.hang}{ve.thutu}</span>
                            })}
                           </p> 
                           <p style={{marginLeft: "auto", fontWeight: "bold"}}>{format.formatPrice(loai?.tong)}</p> 
                        </div>
                    )
                })}

           </div>
            <p><span className={styles.key}>Tổng tiền: </span> <span className={styles.total}>{format.formatPrice(result)}</span> </p>
            <div className={styles.action}>
                {page > 1 && <button onClick={() => onChangePage(page - 1)}>Quay về <FaArrowRight /></button>}
                {page < totalPage && dsVe?.length > 0 && <button onClick={() => onChangePage(page + 1)}>Tiếp tục <FaArrowRight /></button>}
            </div>
        </div>
        
    )
}