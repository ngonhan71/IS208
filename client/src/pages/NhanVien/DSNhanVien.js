import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Badge, Modal } from "react-bootstrap";

import nguoidungApi from "../../api/nguoidungApi"

export default function DSNhanVien() {

  const [nvData, setNvData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingAdd, setLoadingAdd] = useState(false)

  const [rerender, setRerender] = useState(false)

  const [addNhanVien, setAddNhanVien] = useState({
    email: "",
    tenNguoiDung: "",
    dienthoai: ""
  })

  const [showAddModal, setShowAddModal] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await nguoidungApi.getAllNV();
        setLoading(false)
        setNvData(data)
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    try {
      setLoadingAdd(true)
      const { error } = await nguoidungApi.createNV(addNhanVien)
      setLoadingAdd(false)
      if (error) return alert(error)
      alert("Thành công!")
      setShowAddModal(false)
      setRerender(!rerender)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateStatus = async (nhanvien) => {
    const { ma_nguoidung, trang_thai } = nhanvien
    const trangthai = trang_thai === "active" ? "inactive" : "active"
    try {
      const { error } = await nguoidungApi.updateStatus(ma_nguoidung, { trangthai: trangthai })
      if (error) return alert(error)
      alert("Thành công!")
      setRerender(!rerender)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showAddModal} onHide={() => setShowAddModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Thêm nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
              <h5>Thông tin nhân viên</h5>
              <form onSubmit={handleSubmitAdd}>
                <Row>
                  <Col xl={4}>
                    <label>Tên nhân viên</label>
                    <input required type="text" value={addNhanVien?.tenNguoiDung} className="form-control"
                      onChange={(e) => setAddNhanVien((prev) => { return { ...prev, tenNguoiDung: e.target.value } })}
                    />
                  </Col>
                  <Col xl={4}>
                    <label>Email</label>
                    <input required type="email" value={addNhanVien?.email} className="form-control"
                      onChange={(e) => setAddNhanVien((prev) => { return { ...prev, email: e.target.value } })}
                    />
                  </Col>
                  <Col xl={4}>
                    <label>Điện thoại</label>
                    <input required type="text" value={addNhanVien?.dienthoai} className="form-control"
                      onChange={(e) => setAddNhanVien((prev) => { return { ...prev, dienthoai: e.target.value } })}
                    />
                  </Col>
                </Row>
                <Button className="mt-4" type="submit" disabled={loadingAdd} variant="success">{loadingAdd ? "Lưu..." : "Lưu"}</Button>
              </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Hủy</Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách nhân viên</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã nhân viên"
                  />
                  <button type="button" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </Col>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto" onClick={() => setShowAddModal(true)}>
                    Thêm nhân viên
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã nhân viên</th>
                  <th>Tên nhân viên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {nvData && nvData.length > 0
                  ? nvData.map((item, index) => {
                      return (
                        <tr key={item.ma_nguoidung}>
                          <td style={{ textAlign: "center" }}>
                            {item.ma_nguoidung}
                          </td>
                          <td>{item.ten_nguoidung}</td>
                          <td>{item.email}</td>
                          <td>{item.dienthoai}</td>
                          <td style={{ textAlign: "center" }}>{<Badge bg={`${item.trang_thai === "active" ? "success" : "danger"}`}>{item.trang_thai}</Badge>}</td>
                          <td>
                            <Button variant={item.trang_thai === "active" ? "danger" : "success"} onClick={() => handleUpdateStatus(item)}>
                              {item.trang_thai === "active" ? "Khóa" : "Kích hoạt"}</Button>
                          </td>
                        </tr>
                      );
                    })
                  : <tr><td>Không có nhân viên!</td></tr>}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
