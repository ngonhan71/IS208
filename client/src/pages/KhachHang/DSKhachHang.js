import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Badge, Modal } from "react-bootstrap";

import nguoidungApi from "../../api/nguoidungApi"
import hoadonApi from "../../api/hoadonApi"
import format from "../../helper/format";

export default function DSKhachHang() {

  const [khData, setKhData] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [showModal, setShowModal] = useState(false)
  const [dsGiaoDich, setDsGiaoDich] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await nguoidungApi.getAllKH();
        setLoading(false)
        setKhData(data)
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const getLichSuGD = async (maNguoiDung) => {
    try {
      const { data } = await hoadonApi.getByUserId(maNguoiDung)
      setDsGiaoDich(data)
      setShowModal(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Lịch sử giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Table striped bordered hover>
              <thead>
                  <tr>
                    <th>Mã hóa đơn</th>
                    <th>Phim</th>
                    <th>Suất chiếu</th>
                    <th>Trị giá</th>
                    <th>Hình thức thanh toán</th>
                    <th>Ngày mua</th>
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
                          </tr>
                      )
                    }) : null}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách khách hàng</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã khách hàng"
                  />
                  <button type="button" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </Col>
              {/* <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto" onClick={() => setShowAddModal(true)}>
                    Thêm khách hàng
                  </button>
                </div>
              </Col> */}
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã khách hàng</th>
                  <th>Tên khách hàng</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Điểm tích lũy</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {khData && khData.length > 0
                  ? khData.map((item, index) => {
                      return (
                        <tr key={item.ma_nguoidung}>
                          <td style={{ textAlign: "center" }}>
                            {item.ma_nguoidung}
                          </td>
                          <td>{item.ten_nguoidung}</td>
                          <td>{item.email}</td>
                          <td>{item.dienthoai}</td>
                          <td style={{ textAlign: "right" }}>{item.diem_tichluy}</td>
                          <td style={{ textAlign: "center" }}>{<Badge bg={`${item.trang_thai === "active" ? "success" : "danger"}`}>{item.trang_thai}</Badge>}</td>
                          <td>
                            <Button variant="warning" onClick={() => getLichSuGD(item.ma_nguoidung)}>Lịch sử giao dịch</Button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
