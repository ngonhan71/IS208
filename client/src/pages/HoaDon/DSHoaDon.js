import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button, Badge } from "react-bootstrap";
import Pagination from "../../components/Pagination"
import { FaEye } from "react-icons/fa"

import format from "../../helper/format";
import hoadonApi from "../../api/hoadonApi";

export default function DSHoaDon() {
  const [hoadonData, setHoaDonData] = useState({});
  const [date, setDate] = useState("")
  const [search, setSearch] = useState("")

  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(false);

  const [cthd, setCthd] = useState({});

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, totalPage } = await hoadonApi.getAll({limit: 4, page, date: search});
        setLoading(false);
        setHoaDonData(data);
        setTotalPage(totalPage)

      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [page, search]);

  const getOrderDetail = async (maHoaDon) => {
    try {
        const { data } = await hoadonApi.getById(maHoaDon);
        setCthd(data)
        setShowModal(true)
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <Row>
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
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách hóa đơn</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
               <form onSubmit={(e) => { e.preventDefault(); setSearch(date) }}>
                <div className="d-flex mb-2">
                    <input type="date" className="form-control search" value={date} onChange={(e) => setDate(e.target.value)} />
                    <button type="submit" className="btn btn-primary">
                      Tìm kiếm
                    </button>
                  </div>
               </form>
              </Col>
              {/* <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto" onClick={() => setShowAddModal(true)}>
                    Thêm hóa đơn
                  </button>
                </div>
              </Col> */}
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã hóa đơn</th>
                  <th>Phim</th>
                  <th>Suất chiếu</th>
                  <th>Khách hàng</th>
                  <th>Trị giá</th>
                  <th>Hình thức thanh toán</th>
                  <th>Ngày mua</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td>Loading...</td>
                  </tr>
                )}
                {hoadonData && hoadonData.length > 0
                  ? hoadonData.map((item, index) => {
                      return (
                        <tr key={item.ma_hoadon}>
                          <td style={{ textAlign: "center" }}>
                            {item.ma_hoadon}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img style={{width: 100, marginRight: 20}} src={item.poster} alt="" />
                              <span>{item.ten_phim}</span>
                            </div>
                          </td>
                          <td>
                            <p>Địa điểm: {item.ten_rapchieu} - {item.ten_phongchieu}</p>
                            <p>Thời gian: {format.formatDate(item.ngay_chieu)} - {item.gio_chieu}</p>
                          </td>
                          <td>
                            <p>Mã người dùng: {item.ma_nguoidung}</p>
                            <p>Tên người dùng: {item.ten_nguoidung}</p>
                            <p>Email: {item.email}</p>
                            <p>Điện thoại: {item.dienthoai}</p>
                          </td>
                          <td style={{textAlign: "right", fontWeight: "bold"}}>{format.formatPrice(item.trigia)}</td>
                          <td style={{textAlign: "center"}}>
                              {item.ttthanhtoan === 1 && item.thanhtoan}
                              {item.ttthanhtoan === 1 ? <Badge bg="success">Đã thanh toán</Badge> : <Badge bg="danger">Chưa thanh toán</Badge>}
                              <p>{item.ttthanhtoan === 1 && `Mã giao dịch ${item.thanhtoan} : ${item.transId}`}</p>
                          </td>
                          <td>{format.formatDateTime(item.ngay_mua)}</td>
                          <td>
                            <Button onClick={() => getOrderDetail(item.ma_hoadon)}>
                              <FaEye />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  : <tr><td>Không có hóa đơn nào!</td></tr>}
              </tbody>
            </Table>
            <div className="pagination">
            <Row>
              <Col xl={12}>
                {totalPage && totalPage > 1 ? (
                  <Pagination
                    totalPage={totalPage}
                    currentPage={page}
                    onChangePage={(nPage) => setPage(nPage)}
                  />
                ) : null}
              </Col>
            </Row>
          </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
