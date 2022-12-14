import { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import methodData from "./methods"
import { v4 as uuidv4 } from 'uuid';

import styles from "./DatVe.module.css"
import hoadonApi from "../../api/hoadonApi";

export default function Checkout() {

    const { tenNguoiDung, email, dienthoai, maNguoiDung } = useSelector((state) => state.user)
    const { suatChieu, dsVe, phim } = useSelector((state) => state.booking)

    const [loading, setLoading] = useState(false)
   
    const [selectedMethod, setSelectedMethod] = useState(0)

    const handleCheckout = async () => {
        const triGia = dsVe.reduce((result, current) => result + current.gia, 0)
        const { ma_suatchieu: maSuatChieu } = suatChieu
        const { ten_phim: tenPhim } = phim
        const maThanhToan = uuidv4()
        const dsGhe = dsVe.map(item => {
            return {
                maGhe: item.maGhe,
                gia: item.gia,
                tenGhe: item.hang + item.thutu
            }
        })
        if (selectedMethod === 0) {
            try {
                setLoading(true)
                const { error } = await hoadonApi.create({ maSuatChieu, dsGhe, maNguoiDung, tenPhim, triGia, maThanhToan })
                if (error) {
                    alert(error)
                    return
                }
                // //insert db
                const { payUrl } = await hoadonApi.getPayUrlMoMo({amount: triGia, maSuatChieu: suatChieu.ma_suatchieu, maThanhToan})
                setLoading(false)

                window.location.href = payUrl
                // redirect Momo
                // Success => back => response => server => MoMo => isOk => update status => client => Success
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        } else {
            alert("Tính năng đang phát triển!")
        }
    }

    return (
        <>
            <Row>
                <Col xl="4">
                    <label style={{padding: "6px 0"}}>Họ và tên</label>
                </Col>
                <Col xl="4">
                    <input required type="text" className="form-control" value={tenNguoiDung || ''} readOnly />
                </Col>
            </Row>
            <Row className="mt-4">
                 <Col xl="4">
                    <label style={{padding: "6px 0"}}>Email</label>
                </Col>
                <Col xl="4">
                    <input required type="text" className="form-control" value={email || ''} readOnly />
                </Col>
            </Row>
            <Row className="mt-4">
                 <Col xl="4">
                    <label style={{padding: "6px 0"}}>Điện thoại</label>
                </Col>
                <Col xl="4">
                    <input required type="text" className="form-control" value={dienthoai || ''} readOnly />
                </Col>
            </Row>
            <Row className="mt-4">
                 <Col xl="4">
                    <label style={{padding: "6px 0"}}>Hình thức thanh toán</label>
                </Col>
                <Col xl="4">
                {methodData && methodData.map(method => {
                    return (
                      <div key={method.value}>
                        <input type="radio" name="method" value={method.value} id={method.name} checked={+selectedMethod === method.value}
                         onChange={(e) => setSelectedMethod(+e.target.value)} /> 
                        <label htmlFor={method.name}>{method.name}</label>
                        {method.image && <label htmlFor={method.name}> <img className="icon-method" src={method.image} alt="" /></label>}
                        <br />
                      </div>
                    )
                  })}
                </Col>
            </Row>
            <Row>
                <Col xl={{ span: 4, offset: 4 }}>
                    <button onClick={handleCheckout} disabled={loading} className={styles.checkout}>{loading ? "THANH TOÁN..." : "THANH TOÁN"}</button>
                </Col>
            </Row>
        </>
    )
}