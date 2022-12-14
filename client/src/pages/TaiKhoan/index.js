import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Tabs, Tab, Table, Modal, Button, Badge } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

import { logout } from  "../../redux/actions/user"

import methodData from "../DatVe/methods"

import nguoidungApi from '../../api/nguoidungApi';
import hoadonApi from '../../api/hoadonApi';
import format from '../../helper/format';


export default function TaiKhoan() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [nguoidungData, setNguoiDungData] = useState({})
    const [dsGiaoDich, setDsGiaoDich] = useState([])

    const [cthd, setCthd] = useState({})

    const [selectedGD, setSelectedGD] = useState({})
    const [selectedMethod, setSelectedMethod] = useState(0)
    const [loading, setLoading] = useState(false)

    const [showModal, setShowModal] = useState(false)
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)

    const [changePassword, setChangePassword] = useState(false)

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirm: ""
    })

    const [error, setError] = useState(false)

    const { maNguoiDung } = useSelector((state) => state.user)


    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await nguoidungApi.getById(maNguoiDung)
                setNguoiDungData(data)
            } catch (error) {
                console.log(error)
            }
        }
        const getLSGiaoDich = async () => {
            try {
                const { data } = await hoadonApi.getByUserId(maNguoiDung)
                setDsGiaoDich(data)
                // setNguoiDungData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getLSGiaoDich()
        getUser()
    }, [maNguoiDung])

    const getOrderDetail = async (maHoaDon) => {
        try {
            const { data } = await hoadonApi.getById(maHoaDon);
            setCthd(data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheckout = async () => {
        if (selectedMethod === 0) {
            try {
                const { trigia, ma_suatchieu, ma_hoadon } = selectedGD
                const maThanhToan = uuidv4()
                setLoading(true)
                const { error } = await hoadonApi.updateMaThanhToan(ma_hoadon, {maThanhToan})
                if (error) {
                    setLoading(false)
                    alert(error)
                    return
                }
                const { payUrl } = await hoadonApi.getPayUrlMoMo({amount: trigia, maSuatChieu: ma_suatchieu, maThanhToan: maThanhToan})
                // console.log(payUrl)
                setLoading(false)
                window.location.href = payUrl
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        } else {
            alert("T??nh n??ng ??ang ph??t tri???n!")
        }
    }
    const handleChangePassword = async () => {
        try {
            const { currentPassword, newPassword, confirm } = password

            if (newPassword !== confirm) {
                return setError("M???t kh???u x??c nh???n kh??ng kh???p!")
            }

            const { error } = await nguoidungApi.changePassword(maNguoiDung, { currentPassword, newPassword })

            if (error) {
                return setError(error)
            }

            alert("Th??nh c??ng. Vui l??ng ????ng nh???p l???i!")
            const accessToken = localStorage.getItem('accessToken')
            if (accessToken) {
                localStorage.removeItem('accessToken')
                dispatch(logout())
                navigate({ pathname: "/login" })
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container>
            <Modal size="lg" show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Th??ng tin h??a ????n</Modal.Title>
                </Modal.Header>
                 <Modal.Body>
                    <div>
                        <Row>
                            <h5>Danh s??ch v??</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Gh???</th>
                                        <th>Gi??</th>
                                    </tr>
                                </thead>
                                <tbody style={{textAlign: "center"}}>
                                {
                                cthd && cthd.length > 0 ? (
                                    cthd.map((item, index) => {
                                    return (
                                        <tr key={item.ma_ve}>
                                            <td>{index + 1}</td>
                                            <td style={{textAlign: "left"}}>
                                                <p>M?? gh???: {item.ma_ghe}</p>
                                                <p>Gh???: {item.hang}{item.thutu}</p>
                                                <p>Lo???i gh???: {item?.ten_loaighe}</p>
                                            </td>
                                            <td style={{textAlign: "right"}}>{format.formatPrice(item?.trigia)}</td>
                                        </tr>
                                    );
                                    })
                                ) : (
                                    <tr>
                                    <td>Kh??ng c??</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                            <label>H??nh th???c thanh to??n</label>
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
                        </Row>
                        <Button onClick={handleCheckout} className="mt-4" disabled={loading}>{loading ? "THANH TO??N..." : "THANH TO??N"}</Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
                        H???y
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Th??ng tin h??a ????n</Modal.Title>
                </Modal.Header>
                 <Modal.Body>
                    <div>
                        <Row>
                            <h5>Danh s??ch v??</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>M?? v??</th>
                                        <th>Gh???</th>
                                        <th>Gi??</th>
                                        <th>QR Code</th>
                                    </tr>
                                </thead>
                                <tbody style={{textAlign: "center"}}>
                                {
                                cthd && cthd.length > 0 ? (
                                    cthd.map((item, index) => {
                                    return (
                                        <tr key={item.ma_ve}>
                                            <td>{index + 1}</td>
                                            <td>{item.ma_ve}</td>
                                            <td style={{textAlign: "left"}}>
                                                <p>M?? gh???: {item.ma_ghe}</p>
                                                <p>Gh???: {item.hang}{item.thutu}</p>
                                                <p>Lo???i gh???: {item?.ten_loaighe}</p>
                                            </td>
                                            <td style={{textAlign: "right"}}>{format.formatPrice(item?.trigia)}</td>
                                            <td>
                                                <img style={{width: '100px'}} src={item?.qrcode} alt="" />
                                            </td>
                                        </tr>
                                    );
                                    })
                                ) : (
                                    <tr>
                                    <td>Kh??ng c??</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        H???y
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <div className="tab">
                    <Tabs defaultActiveKey="thongtin" className="mb-3">
                        <Tab eventKey="thongtin" title="TH??NG TIN">
                            <Row>
                                <Col xl="6">
                                    <label>H??? & T??n</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.ten_nguoidung || ''} readOnly />
                                </Col>
                                <Col xl="6">
                                    <label>??i???m t??ch l??y</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.diem_tichluy || 0} readOnly />
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xl="6">
                                    <label>S??? ??i???n tho???i</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.dienthoai || ''} readOnly />
                                </Col>
                                <Col xl="6">
                                    <label>Email</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.email || ''} readOnly />
                                </Col>
                            </Row>
                           <div className="mt-4"> 
                                <input id="checkbox-changepw" type="checkbox" checked={changePassword} onChange={(e) => setChangePassword(!changePassword)} />
                                <label htmlFor='checkbox-changepw' className="ms-4">?????i m???t kh???u</label>
                           </div>
                            {changePassword && (
                                <Row className="mt-2">
                                     {error && (
                                       <Col xl="4">
                                            <div className="alert alert-block alert-danger">
                                                <p>{error}</p>
                                            </div>
                                        </Col>
                                    )}
                                    <Row className="mt-2">
                                        <Col xl="4">
                                            <label>M???t kh???u hi???n t???i</label>
                                            <input required type="password" className="form-control" placeholder="M???t kh???u hi???n t???i"
                                                value={password?.currentPassword} onChange={(e) => setPassword(prev => { return {...prev, currentPassword: e.target.value}})} />
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col xl="4">
                                            <label>M???t kh???u m???i</label>
                                            <input required type="password" className="form-control" placeholder="M???t kh???u m???i"
                                            value={password?.newPassword} onChange={(e) => setPassword(prev => { return {...prev, newPassword: e.target.value}})} />
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col xl="4">
                                            <label>X??c nh???n m???t kh???u</label>
                                            <input required type="password" className="form-control" placeholder="X??c nh???n m???t kh???u"
                                            value={password?.confirm} onChange={(e) => setPassword(prev => { return {...prev, confirm: e.target.value}})} />
                                            <Button className="mt-2" onClick={handleChangePassword}>L??u</Button>
                                        </Col>
                                    </Row>
                                </Row>
                            )}
                        </Tab>
                        <Tab eventKey="giaodich" title="GIAO D???CH C???A T??I">
                            <Row>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>M?? h??a ????n</th>
                                            <th>Phim</th>
                                            <th>Su???t chi???u</th>
                                            <th>Tr??? gi??</th>
                                            <th>H??nh th???c thanh to??n</th>
                                            <th>Ng??y mua</th>
                                            <th colSpan="2">H??nh ?????ng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {dsGiaoDich && dsGiaoDich.length > 0
                                        ? dsGiaoDich.map((item, index) => {
                                            return (
                                                <tr key={item.ma_hoadon}>
                                                    <td style={{ textAlign: "center" }}>
                                                        {item.ma_hoadon}
                                                    </td>
                                                    <td>
                                                       <div className="d-flex align-items-center">
                                                            <img style={{width: 80, marginRight: 10}} src={item.poster} alt="" />
                                                            <span>{item.ten_phim}</span>
                                                       </div>
                                                    </td>
                                                    <td>
                                                        <p>?????a ??i???m: {item.ten_rapchieu} - {item.ten_phongchieu}</p>
                                                        <p>Th???i gian: {format.formatDate(item.ngay_chieu)} - {item.gio_chieu}</p>
                                                    </td>
                                                    <td style={{textAlign: "right", fontWeight: "bold"}}>{format.formatPrice(item.trigia)}</td>
                                                    <td style={{textAlign: "center"}}>
                                                        {item.trang_thai === 1 && item.thanhtoan}
                                                        {item.trang_thai === 1 ? <Badge bg="success">???? thanh to??n</Badge> : <Badge bg="danger">Ch??a thanh to??n</Badge>}
                                                        <p>{item.trang_thai === 1 && `M?? giao d???ch ${item.thanhtoan} : ${item.transId}`}</p>
                                                    </td>
                                                    <td>{format.formatDateTime(item.ngay_mua)}</td>
                                                    <td>
                                                        {item.trang_thai === 1 ? 
                                                        <Button variant="warning" onClick={() => {
                                                            getOrderDetail(item.ma_hoadon)
                                                            setShowModal(true)
                                                        }}>
                                                            Chi ti???t
                                                        </Button>
                                                        : <Button variant="danger" onClick={() => {
                                                            setSelectedGD(item)
                                                            getOrderDetail(item.ma_hoadon)
                                                            setShowCheckoutModal(true)
                                                        }}>
                                                            Thanh to??n
                                                        </Button>}
                                                    </td>
                                                </tr>
                                            );
                                            })
                                        : null}
                                    </tbody>
                                </Table>
                            </Row>
                        </Tab>
                    </Tabs>
                </div>
            </Row>
        </Container>
    )
}