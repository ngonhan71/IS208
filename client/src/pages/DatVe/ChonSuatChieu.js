import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Modal, Badge } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { AiOutlineFieldTime, AiOutlinePlayCircle } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"

import phimApi from '../../api/phimApi';
import suatchieuApi from '../../api/suatchieuApi';
import rapchieuApi from '../../api/rapchieuApi';
import ngayleApi from '../../api/ngayleApi';
import gheApi from "../../api/gheApi";

import { destroy } from "../../redux/actions/booking";
import { updatePhim, updateSuatChieu } from "../../redux/actions/booking"

import format from '../../helper/format';
import styles from "./DatVe.module.css"

export default function ChonSuatChieu() {

    const dispatch = useDispatch()
    const { suatChieu, dsVe } = useSelector((state) => state.booking)
    const { maNguoiDung } = useSelector((state) => state.user)

    const params = useParams()
    const { maPhim } = params

    const [phimData, setPhimData] = useState({})
    const [theloaiData, setTheLoaiData] = useState([])

    // Data Lay tu CSDL
    const [suatchieuData, setSuatChieuData] = useState([])
    const [thanhphoData, setThanhPhoData] = useState([])
    const [rapchieuData, setRapChieuData] = useState([])
    const [ngayleData, setNgayLeData] = useState([])

    // Khi chọn tỉnh => binding lại rapchieu
    const [rapchieuBinding, setRapChieuBinding] = useState([])
    const [suatchieuBinding, setSuatChieuBinding] = useState([])
    const [dsngaychieu, setDSNgayChieu] = useState([])

    const [suatchieuByRapChieu, setSuatChieuByRapChieu] = useState([])

    // Data Dat ve
    const [selectedTP, setSelectedTP] = useState("Cả nước")
    const [selectedRC, setSelectedRC] = useState(0)
    const [selectedNC, setSelectedNC] = useState("")

    const [showTrailerModal, setShowTrailerModal] = useState(false)

    useEffect(() => {
        const getPhim = async () => {
            try {
                const { data, theloai } = await phimApi.getById(maPhim)
                dispatch(updatePhim(data))
                setPhimData(data)
                setTheLoaiData(theloai)
            } catch (error) {
                console.log(error)
            }
        }
        getPhim()

    }, [maPhim, dispatch])

    useEffect(() => {
        const getThanhPho = async () => {
            try {
                const { data } = await rapchieuApi.getThanhPho()
                setThanhPhoData([{thanhpho: "Cả nước"}, ...data])
            } catch (error) {
                console.log(error)
            }
        }
        const getRapChieu = async () => {
            try {
                const { data } = await rapchieuApi.getAll()
                // const all = {ma_rapchieu: 0, ten_rapchieu: "Tất cả rạp"}
                // setRapChieuData([all, ...data])
                setRapChieuData(data)
            } catch (error) {
                console.log(error)
            }
        }
        const getDSSuatChieu = async () => {
            try {
                const { data } = await suatchieuApi.getByPhim(maPhim)
                setSuatChieuData(data)
            } catch (error) {
                console.log(error)
            }
        }
        const getDSNgayLe = async () => {
            try {
                const { data } = await ngayleApi.getAll({})
                setNgayLeData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getThanhPho()
        getRapChieu()
        getDSSuatChieu()
        getDSNgayLe()
    }, [maPhim])


    useEffect(() => {
        // Khi chọn tỉnh
        // All => push ALL
        // selected => so sanh => push
        const dsRC = [{ma_rapchieu: 0, ten_rapchieu: "Tất cả rạp"}]
        for(let i = 0; i < rapchieuData.length; i++) {
            const check = selectedTP === "Cả nước"
            if (check || rapchieuData[i].thanhpho === selectedTP) {
                dsRC.push(rapchieuData[i])
            }
        }
       setRapChieuBinding(dsRC)
       setSelectedRC(dsRC[0].ma_rapchieu)
    }, [selectedTP, rapchieuData])

    useEffect(() => {
        // Khi chọn tỉnh => rapchieuBinding => Run
        // Khi chọn rạp chiếu => Run
        //====> Lọc ra các ngày chiếu, DK: suất chiếu có RC thuộc RCBinding
        const dsNgayChieu = []
        const dsSC = []
        for(let i = 0; i < suatchieuData.length; i++) {
            // Lọc ra các suất chiếu, thuộc các rạp chiếu (sau khi chọn tỉnh)
            const is = rapchieuBinding.findIndex(rc => rc.ma_rapchieu === suatchieuData[i].ma_rapchieu)
            // nếu ma_rapchieu === 0 (Chọn ALL) => True
            const check = selectedRC === 0 && is !== -1
            // Check true <=> mã rạp chiếu là tất cả, và suất chiếu có mã rạp chiếu thuộc rapchieuBinding(lọc theo tỉnh)
            // Hoặc marapchieu = với ma rap chieu cửa từng suất chiếu
            if (check || +suatchieuData[i].ma_rapchieu === selectedRC) {
                dsSC.push(suatchieuData[i])
                const index = dsNgayChieu.findIndex(nc => nc.ngay === suatchieuData[i].ngay_chieu);
                if (index === -1) {
                    dsNgayChieu.push({
                        ngay: suatchieuData[i].ngay_chieu,
                        thu: format.convertToDay(new Date(suatchieuData[i].ngay_chieu).getDay())
                    })
                }
             
            }
        }
        dsNgayChieu.sort((a, b) => new Date(a.ngay).getTime() > new Date(b.ngay).getTime() ? 1 : -1)
        setDSNgayChieu(dsNgayChieu)
        setSelectedNC(dsNgayChieu[0]?.ngay)
        setSuatChieuBinding(dsSC)           // DS suat chieu: có marapchieu thuộc Rapchieubinding(chọn từ tỉnh)
    }, [selectedRC, suatchieuData, rapchieuBinding])

    useEffect(() => {
        const data = []
        for(let i = 0; i < suatchieuBinding.length; i++) {
            const checkRC = suatchieuBinding[i].ma_rapchieu === selectedRC || selectedRC === 0 
            if (checkRC && suatchieuBinding[i].ngay_chieu === selectedNC) {
                const index = data.findIndex(sc => sc.ma_rapchieu === suatchieuBinding[i].ma_rapchieu);
                if (index === -1) {
                    const ds = [suatchieuBinding[i]]
                    data.push({
                        ma_rapchieu: suatchieuBinding[i]?.ma_rapchieu,
                        ten_rapchieu: suatchieuBinding[i]?.ten_rapchieu,
                        dsSuatChieu: ds
                    })
                } else {
                    data[index]?.dsSuatChieu.push(suatchieuBinding[i])
                }
            }
        }

        setSuatChieuByRapChieu(data)

    }, [selectedRC, selectedNC, suatchieuBinding])

    const checkNgay = useMemo(() => {
        let isNgayLe = false
        let tenNgayLe = ""
        ngayleData.forEach(item => {
            const ngayConvert = new Date(item.ngay).toLocaleDateString("en-GB")
            if (item.loai === "linhdong" && new Date(selectedNC).toLocaleDateString("en-GB") === ngayConvert) {
                isNgayLe = true
                tenNgayLe = item.ten_ngayle
                return
            } 
            if (item.loai === "codinh") {
                const [thang, ngay] = item.ngay.split("-")
                if (+ngay === new Date(selectedNC).getDate() && +thang === new Date(selectedNC).getMonth()  + 1) {
                    isNgayLe = true
                    tenNgayLe = item.ten_ngayle
                    return
                }
            }
        })
        return { isNgayLe, tenNgayLe }
    }, [selectedNC, ngayleData])

    const handleClick = (e, suatchieu) => {
        if (maNguoiDung) {
            dispatch(updateSuatChieu(suatchieu))
        } else {
            e.preventDefault()
            alert("Vui lòng đăng nhập để tiếp tục!")
        }
    }

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
            <Modal size="lg" show={showTrailerModal} onHide={() => setShowTrailerModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>{phimData?.ten_phim} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <iframe src={phimData?.trailer} width="770" height="420" title={phimData?.ten_phim}
                            frameBorder="0" allowFullScreen></iframe>
                    </div>
                </Modal.Body>
            
            </Modal>
            <Row>
                <Col xl="8">
                    <section>
                        <Row>
                            <Col xl="4">
                                <div className="container-poster">
                                    <img src={phimData.poster} alt="" />
                                    <div className="icon" onClick={()=> setShowTrailerModal(true)} ><AiOutlinePlayCircle /></div>
                                </div>
                            </Col>
                            <Col xl="8">
                                <div className={styles.detail}>
                                    <h2>{phimData.ten_phim}</h2>
                                    <div className="d-flex align-items-center">
                                        <button style={{padding: "4px 10px"}}>C{phimData.dotuoi_quydinh}</button>
                                        <p className={styles.time}><AiOutlineFieldTime /> {phimData.thoiluong} phút</p>
                                    </div>
                                    <div className="mt-2">
                                        <p><span>Đạo diễn: </span><span className={styles.detailValue}>{phimData.daodien}</span></p>
                                        <p>
                                            <span>Thể loại: </span>
                                            <span className={styles.detailValue}>
                                                {theloaiData && theloaiData.length > 0 && theloaiData.map((item, index) => 
                                                   {
                                                    if (index === 0) return <span key={item.ma_theloai}>{item.ten_theloai}</span>
                                                    else return <span key={item.ma_theloai}>, {item.ten_theloai}</span>
                                                   }
                                                )}
                                            </span>
                                        </p>
                                        <p><span>Quốc gia: </span><span className={styles.detailValue}>{phimData.quocgia}</span></p>
                                        <p><span>Ngày khởi chiếu: </span><span className={styles.detailValue}>{format.formatDate(phimData.ngay_khoichieu)}</span></p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                           <div className={styles.description}>
                                <h3>NỘI DUNG PHIM</h3>
                                <div dangerouslySetInnerHTML={{__html: phimData?.noidung}} />
                           </div>
                        </Row>
                    </section>
                    <section style={{marginTop: 20}}>
                        <Row>
                            <h3>LỊCH CHIẾU</h3>
                            <Col xl={4}>
                                <select className="form-select" value={selectedTP?.thanhpho}
                                onChange={(e) => setSelectedTP(e.target.value)}
                                >
                                {thanhphoData.length > 0 &&
                                    thanhphoData.map((item) => (
                                    <option key={item.thanhpho} value={item.thanhpho}>
                                        {item.thanhpho}
                                    </option>
                                    ))}
                                </select>
                            </Col>
                            <Col xl={4}>
                                <select className="form-select" value={selectedRC?.ma_rapchieu}
                                onChange={(e) => setSelectedRC(+e.target.value)}
                                >
                                {rapchieuBinding.length > 0 &&
                                    rapchieuBinding.map((item) => (
                                    <option key={item.ma_rapchieu} value={item.ma_rapchieu}>
                                        {item.ten_rapchieu}
                                    </option>
                                    ))}
                                </select>
                            </Col>
                            <Col xl={4}>
                                <select className="form-select" value={selectedNC?.ngay}
                                onChange={(e) => setSelectedNC(e.target.value)}
                                >
                                {dsngaychieu.length > 0 &&
                                    dsngaychieu.map((item) => (
                                    <option key={item.ngay} value={item.ngay}>
                                        {format.formatDate(item.ngay)}
                                    </option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                        <Row>
                            <div className="mt-4">
                                {checkNgay && checkNgay.isNgayLe === true && <h4><Badge bg="danger">{checkNgay.tenNgayLe}</Badge></h4>}
                                {suatchieuByRapChieu && suatchieuByRapChieu.length > 0 ? suatchieuByRapChieu.map(rapchieu => {
                                    return (
                                        <div key={rapchieu.ma_rapchieu} className="mt-4">
                                            <div className={styles.titleCinema}>
                                                <h5>{rapchieu.ten_rapchieu}</h5>
                                            </div>
                                            <div className={styles.scList}>
                                                {rapchieu && rapchieu.dsSuatChieu.length > 0 && rapchieu.dsSuatChieu.map(suatchieu => {
                                                    return (
                                                        <Link key={suatchieu.ma_suatchieu} to="/book-ticket" onClick={(e) => handleClick(e, suatchieu)}>
                                                            <button className={styles.suatchieu}>
                                                                {suatchieu.ten_phongchieu}-{suatchieu.gio_chieu}
                                                            </button>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                }): null}
                            </div>
                        </Row>
                    </section>
                </Col>
            </Row>
        </Container>
    )
}