import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import phimApi from '../../api/phimApi';
import Phim from '../../components/Phim';

export default function DangChieu() {

    const [phimData, setPhimData] = useState([])

    useEffect(() => {
        const getPhim = async () => {
            try {
                const { data } = await phimApi.getAllDangChieuAndSapChieu()
                setPhimData(data)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        getPhim()
    }, [])

    return (
        <Container>
            <Row>
                {phimData && phimData.length > 0 && phimData.map(phim => {
                    return new Date(phim.ngay_khoichieu) <= new Date() && (
                        <Col xl="3" key={phim.ma_phim}>
                            <Phim maPhim={phim.ma_phim} tenPhim={phim.ten_phim} poster={phim.poster} />
                        </Col>
                    )
                })}
        
            </Row>
        </Container>
    )
}