import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";

import ThongTinDatVe from "../../components/ThongTinDatVe";
import ChonGhe from "./ChonGhe";
import Checkout from "./Checkout";
import CountDown from "../../components/CountDown.js";

import styles from "./DatVe.module.css"
import suatchieuApi from "../../api/suatchieuApi";

import { updateGiaSuatChieu } from "../../redux/actions/booking";
import { useNavigate } from "react-router-dom";


export default function MultipleStep() {

    const navigate = useNavigate()

    const { countDownRunning, startTime, suatChieu, phim } = useSelector((state) => state.booking)

    const { ma_suatchieu } = suatChieu

    const dispatch = useDispatch()

    const title = useRef(["Chọn ghế: ", "Vui lòng thanh toán"])

    const [page, setPage] = useState(1)

    const pageDisplay =  () => {
        if (page === 1) {
            return <ChonGhe />
        } else if (page === 2) {
            return <Checkout />
        }
    }

    useEffect(() => {
        if (!phim?.ma_phim || !suatChieu?.ma_suatchieu) {
          window.location.href = "/"
        }
      }, [suatChieu, phim])

    useEffect(() => {
        const getSuatChieu = async () => {
            try {
                const { isNgayLe, giaNgayLe, tenNgayLe, data } = await suatchieuApi.getById(ma_suatchieu)
                dispatch(updateGiaSuatChieu({
                    isNgayLe: isNgayLe,
                    gia: isNgayLe ? giaNgayLe : data?.gia,
                    tenNgayLe,
                }))
            } catch (error) {
                console.log(error)
            }
        }
        if (ma_suatchieu) {
            getSuatChieu()
        }
    }, [ma_suatchieu, dispatch])

    const handleTimeout = () => {
        alert("Hết thời gian đặt vé!")
        navigate({ pathname: "/" })
    }

    return (
        <Container>
            <Row>
                <Col xl="9">
                    <div className={styles.ticketWrapper}>
                        <div className="d-flex">
                            <h2>{title.current[page - 1]}</h2>
                            <div style={{marginLeft: "auto"}}>
                                {startTime && countDownRunning === true ? <CountDown seconds={500} onEnd={handleTimeout} /> : null}
                            </div>
                        </div>
                        <div className={styles.seatWrapper}>
                            {pageDisplay()}
                        </div>
                    </div>
                </Col>
                <Col xl="3">
                    <ThongTinDatVe page={page} onChangePage={(page) => setPage(page)} totalPage={2} />
                </Col>
            </Row>
        </Container>
    )
}