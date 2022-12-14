import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import Phim from "../../components/Phim"

import phimApi from "../../api/phimApi";

export default function Search() {
    const [searchParams] = useSearchParams()

    const key = searchParams.get("key")

    const [phimData, setPhimData] = useState([])

    useEffect(() => {

        const search = async () => {
            try {
                const { data } = await phimApi.getAll({key: key})
                setPhimData(data)
            } catch (error) {
                console.log(error)
            }
        }
        search()

    }, [key])

    return (
        <Container>
            <Row>
                <h2>Từ khóa: {key}</h2>
                {phimData && phimData.length > 0 ? (
                 phimData.map(phim => 
                    <Col xl={3} key={phim.ma_phim}>
                        <Phim maPhim={phim.ma_phim} tenPhim={phim.ten_phim} poster={phim.poster} />
                    </Col>)
                ) : <p>Không tìm thấy kết quả phù hợp với từ khóa: "<span style={{margin: 0}}>{key}</span>"</p>}
            </Row>
        </Container>
    )
}