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
            alert("Tính năng đang phát triển!")
        }
    }
    const handleChangePassword = async () => {
        try {
            const { currentPassword, newPassword, confirm } = password

            if (newPassword !== confirm) {
                return setError("Mật khẩu xác nhận không khớp!")
            }

            const { error } = await nguoidungApi.changePassword(maNguoiDung, { currentPassword, newPassword })

            if (error) {
                return setError(error)
            }

            alert("Thành công. Vui lòng đăng nhập lại!")
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
                    <Modal.Title>Thông tin hóa đơn</Modal.Title>
                </Modal.Header>
                 <Modal.Body>
                    <div>
                        <Row>
                            <h5>Danh sách vé</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ghế</th>
                                        <th>Giá</th>
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
                                                <p>Mã ghế: {item.ma_ghe}</p>
                                                <p>Ghế: {item.hang}{item.thutu}</p>
                                                <p>Loại ghế: {item?.ten_loaighe}</p>
                                            </td>
                                            <td style={{textAlign: "right"}}>{format.formatPrice(item?.trigia)}</td>
                                        </tr>
                                    );
                                    })
                                ) : (
                                    <tr>
                                    <td>Không có</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                            <label>Hình thức thanh toán</label>
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
                        <Button onClick={handleCheckout} className="mt-4" disabled={loading}>{loading ? "THANH TOÁN..." : "THANH TOÁN"}</Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin hóa đơn</Modal.Title>
                </Modal.Header>
                 <Modal.Body>
                    <div>
                        <Row>
                            <h5>Danh sách vé</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Mã vé</th>
                                        <th>Ghế</th>
                                        <th>Giá</th>
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
                                                <p>Mã ghế: {item.ma_ghe}</p>
                                                <p>Ghế: {item.hang}{item.thutu}</p>
                                                <p>Loại ghế: {item?.ten_loaighe}</p>
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
                                    <td>Không có</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <div className="tab">
                    <Tabs defaultActiveKey="thongtin" className="mb-3">
                        <Tab eventKey="thongtin" title="THÔNG TIN">
                            <Row>
                                <Col xl="6">
                                    <label>Họ & Tên</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.ten_nguoidung || ''} readOnly />
                                </Col>
                                <Col xl="6">
                                    <label>Điểm tích lũy</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.diem_tichluy || 0} readOnly />
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xl="6">
                                    <label>Số điện thoại</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.dienthoai || ''} readOnly />
                                </Col>
                                <Col xl="6">
                                    <label>Email</label>
                                    <input required type="text" className="form-control" value={nguoidungData?.email || ''} readOnly />
                                </Col>
                            </Row>
                           <div className="mt-4"> 
                                <input id="checkbox-changepw" type="checkbox" checked={changePassword} onChange={(e) => setChangePassword(!changePassword)} />
                                <label htmlFor='checkbox-changepw' className="ms-4">Đổi mật khẩu</label>
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
                                            <label>Mật khẩu hiện tại</label>
                                            <input required type="password" className="form-control" placeholder="Mật khẩu hiện tại"
                                                value={password?.currentPassword} onChange={(e) => setPassword(prev => { return {...prev, currentPassword: e.target.value}})} />
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col xl="4">
                                            <label>Mật khẩu mới</label>
                                            <input required type="password" className="form-control" placeholder="Mật khẩu mới"
                                            value={password?.newPassword} onChange={(e) => setPassword(prev => { return {...prev, newPassword: e.target.value}})} />
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col xl="4">
                                            <label>Xác nhận mật khẩu</label>
                                            <input required type="password" className="form-control" placeholder="Xác nhận mật khẩu"
                                            value={password?.confirm} onChange={(e) => setPassword(prev => { return {...prev, confirm: e.target.value}})} />
                                            <Button className="mt-2" onClick={handleChangePassword}>Lưu</Button>
                                        </Col>
                                    </Row>
                                </Row>
                            )}
                        </Tab>
                        <Tab eventKey="giaodich" title="GIAO DỊCH CỦA TÔI">
                            <Row>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Mã hóa đơn</th>
                                            <th>Phim</th>
                                            <th>Suất chiếu</th>
                                            <th>Trị giá</th>
                                            <th>Hình thức thanh toán</th>
                                            <th>Ngày mua</th>
                                            <th colSpan="2">Hành động</th>
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
                                                        <p>Địa điểm: {item.ten_rapchieu} - {item.ten_phongchieu}</p>
                                                        <p>Thời gian: {format.formatDate(item.ngay_chieu)} - {item.gio_chieu}</p>
                                                    </td>
                                                    <td style={{textAlign: "right", fontWeight: "bold"}}>{format.formatPrice(item.trigia)}</td>
                                                    <td style={{textAlign: "center"}}>
                                                        {item.trang_thai === 1 && item.thanhtoan}
                                                        {item.trang_thai === 1 ? <Badge bg="success">Đã thanh toán</Badge> : <Badge bg="danger">Chưa thanh toán</Badge>}
                                                        <p>{item.trang_thai === 1 && `Mã giao dịch ${item.thanhtoan} : ${item.transId}`}</p>
                                                    </td>
                                                    <td>{format.formatDateTime(item.ngay_mua)}</td>
                                                    <td>
                                                        {item.trang_thai === 1 ? 
                                                        <Button variant="warning" onClick={() => {
                                                            getOrderDetail(item.ma_hoadon)
                                                            setShowModal(true)
                                                        }}>
                                                            Chi tiết
                                                        </Button>
                                                        : <Button variant="danger" onClick={() => {
                                                            setSelectedGD(item)
                                                            getOrderDetail(item.ma_hoadon)
                                                            setShowCheckoutModal(true)
                                                        }}>
                                                            Thanh toán
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