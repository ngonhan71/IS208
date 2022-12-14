import { useEffect, useState, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";

import { addGhe, removeGhe, updateStartTime } from "../../redux/actions/booking"

import gheApi from "../../api/gheApi";

import styles from "./DatVe.module.css"

function DSGhe({ dsGhe, dsHang, maxThutu, dsGheDaBan = [], dsLoaiGhe = [] }) {
  const dispatch = useDispatch()
  const { dsVe, suatChieu, startTime } = useSelector((state) => state.booking)

  const [items, setItems] = useState()
  
  const handleClickGhe = useCallback(async (ghe) => {

      const index = dsVe.findIndex(v => v.ma_ghe === ghe.ma_ghe)
      if (index === -1) {
        try {
          let seconds = 0
          const now = new Date().getTime()
          if (dsVe.length === 0) seconds = 900
          else seconds = 900 - (Math.floor((now - startTime) / 1000))
          const { error } = await gheApi.giuGhe({
            maSuatChieu: suatChieu.ma_suatchieu,
            maGhe: ghe.ma_ghe, 
            seconds: seconds, 
            maNguoiDung: 1
          })
          if (error) { alert(error); return }
          if (dsVe.length === 0) dispatch(updateStartTime(now))
          const giaVe = (suatChieu?.gia + ghe.gia_congthem) * (ghe.socho);
          dispatch(addGhe({...ghe, maGhe: ghe.ma_ghe, gia: giaVe}))
        } catch (error) {
          console.log(error)
        }
      } else {
          try {
            const { error } = await gheApi.boChonGhe({
              maSuatChieu: suatChieu.ma_suatchieu,
              maGhe: ghe.ma_ghe, 
            })
            if (error) { alert(error); return }
            dispatch(removeGhe(ghe))
          } catch (error) {
            console.log(error)
          }
      }
  }, [dsVe, suatChieu, startTime, dispatch])
  useEffect(() => {

    const newItems = [];
    for (let i = 0; i <= dsHang.length; i++) {
      const t = [];
      for (let k = 0; k <= maxThutu; k++) {
        if (i === dsHang.length) {
          t.push(
            <td key={`cuoi-${k}`} style={{ padding: "0 1px" }}>
              <Button className={styles.noSeat} style={{ opacity: k > 0 ? 1 : 0, marginTop: 20 }}>
                {k}
              </Button>
            </td>
          );
          continue
        }
        if (k === 0) {
          t.push(
            <td key={`${dsHang[i]?.hang}-${k}`} style={{ padding: "0 1px", width: 80 }}>
              <Button className={styles.noSeat} style={{ width: 40 }}>
                {dsHang[i].hang}
              </Button>
            </td>
          );
          continue
        }
      
        const find = dsGhe.find((ghe) => ghe.hang === dsHang[i]?.hang && ghe.thutu === k)
        if (find) {
          let isDaBan = false
          if (dsGheDaBan.length > 0) {
            isDaBan = dsGheDaBan.findIndex(g => g.ma_ghe === find.ma_ghe) === -1 ? false : true
          }
          const isChon = dsVe.findIndex(ve => ve.ma_ghe === find.ma_ghe) === -1 ? false : true
          t.push(
            <td colSpan={find.socho} key={find.ma_ghe} style={{ padding: "0 1px" }}>
              <Button disabled={isDaBan} className="mb-2" 
                      style={{ fontSize: 12, width: "100%", backgroundColor: `${isDaBan ? "red" : (isChon ? "green" : find.color)}`, border: "none", padding: 5 }}
                      onClick={() => handleClickGhe(find)}>
                {find.hang}-{find.thutu}
              </Button>
            </td>
          );
          k = k + find?.socho - 1
        } else t.push(<td key={`${dsHang[i]?.hang}-${k}`} style={{ padding: "0 1px" }}>
                  <Button style={{ fontSize: 12, width: "100%", opacity: "0", padding: 5 }}>{dsHang[i].hang}-{k}</Button>
                </td>);
      }
      newItems.push(<tr key={dsHang[i]?.hang || "cuoi"}>{t}</tr>);
    }
    setItems(newItems);
  }, [dsGhe, dsHang, maxThutu, dsLoaiGhe, dsGheDaBan, handleClickGhe, dsVe]);


  return (
    <div>
        <h5 style={{textAlign: "center"}}>Màn hình</h5>
        <hr></hr>
        <table style={{width: "100%"}}>
            <tbody>{items}</tbody>
        </table>
        <div className="d-flex mt-4 justify-content-center">
          {dsLoaiGhe && dsLoaiGhe.length > 0 && dsLoaiGhe.map((item, index) => {
            return (
              <div key={item.ma_loaighe} className="me-4">
                  <span className="me-2">{item.ten_loaighe}</span>
                  <Button style={{ backgroundColor: `${item.color}`, border: "none" }}></Button>
              </div>
            )
          })}
        </div>
        <div className="d-flex mt-4 justify-content-center">
            <div className="me-4">
                <span className="me-2">Ghế đang chọn</span>
                <Button style={{ backgroundColor: "green", border: "none" }}></Button>
            </div>
            <div className="me-4">
                <span className="me-2">Ghế đã bán</span>
                <Button style={{ backgroundColor: "red", border: "none" }}></Button>
            </div>
        </div>
    </div>
  );
}

export default memo(DSGhe);
