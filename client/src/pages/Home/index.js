import { useEffect, useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import gheApi from '../../api/gheApi';

import phimApi from '../../api/phimApi';
import Phim from '../../components/Phim';
import { destroy } from '../../redux/actions/booking';

export default function Home() {

    const dispatch = useDispatch()
    const { suatChieu, dsVe } = useSelector((state) => state.booking)
    const [phimData, setPhimData] = useState([])

    useEffect(() => {
        const getPhim = async () => {
            try {
                const { data } = await phimApi.getAllDangChieuAndSapChieu()
                setPhimData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getPhim()
    }, [])

    useEffect(() => {
        const destroyF = async () => {
            if (dsVe.length > 0) {
                try {
                    await gheApi.boChonTatCaGhe({maSuatChieu: suatChieu.ma_suatchieu, dsGhe: dsVe})
                    dispatch(destroy())
                } catch (error) {
                    console.log()
                }
            }
        }
        destroyF()
    }, [dsVe, suatChieu, dispatch])

    return (
        <Container>
            <Row>
                <div className="tab-phim">
                <Tabs defaultActiveKey="dangchieu" className="mb-3">
                    <Tab eventKey="dangchieu" title="PHIM ĐANG CHIẾU">
                        <Row>
                            {phimData && phimData.length > 0 && phimData.map(phim => {
                                return new Date(phim.ngay_khoichieu) <= new Date() && (
                                    <Col xl="3" key={phim.ma_phim}>
                                        <Phim maPhim={phim.ma_phim} tenPhim={phim.ten_phim} poster={phim.poster} />
                                    </Col>
                                )
                            })}
                        </Row>
                    </Tab>
                    <Tab eventKey="sapchieu" title="PHIM SẮP CHIẾU">
                        <Row>
                            {phimData && phimData.length > 0 && phimData.map(phim => {
                                return new Date(phim.ngay_khoichieu) > new Date() && (
                                    <Col xl="3" key={phim.ma_phim}>
                                        <Phim maPhim={phim.ma_phim} tenPhim={phim.ten_phim} poster={phim.poster} />
                                    </Col>
                                )
                            })}
                        </Row>
                    </Tab>
                </Tabs>
                 
                </div>
            </Row>
        </Container>
    )
}