import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";

import format from "../../helper/format";
import ngayleApi from "../../api/ngayleApi";

export default function DSNgayLe() {

  const [ngayleData, setNgayLeData] = useState([]);

  const [addNgayLe, setAddNgayLe] = useState({
    tenNgayLe: "",
    loai: "codinh",
    ngay: "",
  });
  const [selectedNgayLe, setSelectedNgayLe] = useState({})


  const [rerender, setRerender] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ngayleApi.getAll({});
        console.log(res.data)
        setNgayLeData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmitAdd = async () => {
    try {
        const { tenNgayLe, loai, ngay } = addNgayLe
        const newNgay = loai === "codinh" ? ngay.split("-").splice(1, 2).join("-") : ngay
        const { error } = await ngayleApi.create({
          tenNgayLe, loai, ngay: newNgay
        })
        if (error) {
          alert("Thất bại " + error)
          return
        }
        alert("Thêm ngày lễ thành công!")
        setShowAddModal(false)
        setRerender(!rerender)
    } catch (error) {
        console.log(error)
    }
  }

  const handleSubmitUpdate = async () => {
    try {
        const { ma_ngayle, ten_ngayle: tenNgayLe, loai, ngay } = selectedNgayLe
        const newNgay = loai === "codinh" ? ngay.split("-").splice(1, 2).join("-") : ngay
        
        const { error } = await ngayleApi.update(ma_ngayle, {
            tenNgayLe, loai, ngay: newNgay
        })
        if (error) {
          alert("Thất bại " + error)
          return
        }
        alert("Cập nhật thành công!")
        setShowUpdateModal(false)
        setRerender(!rerender)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật ngày lễ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <Row>
              <h5>Thông tin ngày lễ</h5>
              <Col xl={4}>
                <label>Tên ngày lễ</label>
                <input type="text" value={selectedNgayLe?.ten_ngayle} className="form-control"
                  onChange={(e) => setSelectedNgayLe((prev) => { return { ...prev, ten_ngayle: e.target.value } })}
                />
              </Col>
              <Col xl={4}>
                <label>Thứ</label>
                <select className="form-select"
                      value={selectedNgayLe?.loai}
                      onChange={(e) => setSelectedNgayLe(prev => { return {...prev, loai: e.target.value}})}
                    >
                      <option value="codinh">
                        Cố định                        
                      </option>
                      <option value="linhdong">
                        Linh động             
                      </option>
                </select>
              </Col>
              <Col xl={4}>
                <label>Ngày</label>
                <input type="date" value={selectedNgayLe?.ngay} className="form-control"
                  onChange={(e) => setSelectedNgayLe((prev) => { return { ...prev, ngay: e.target.value } })}
                />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Hủy</Button>
          <Button variant="success" onClick={handleSubmitUpdate}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showAddModal} onHide={() => setShowAddModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Thêm ngày lễ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
              <h5>Thông tin ngày lễ</h5>
              <Col xl={4}>
                <label>Tên ngày lễ</label>
                <input type="text" value={addNgayLe?.tenNgayLe} className="form-control"
                  onChange={(e) => setAddNgayLe((prev) => { return { ...prev, tenNgayLe: e.target.value } })}
                />
              </Col>
              <Col xl={4}>
                <label>Thứ</label>
                <select className="form-select"
                      value={addNgayLe?.loai}
                      onChange={(e) => setAddNgayLe(prev => { return {...prev, loai: e.target.value}})}
                    >
                      <option value="codinh">
                        Cố định                        
                      </option>
                      <option value="linhdong">
                        Linh động             
                      </option>
                </select>
              </Col>
              <Col xl={4}>
                <label>Ngày</label>
                <input type="date" value={addNgayLe?.ngay} className="form-control"
                  onChange={(e) => setAddNgayLe((prev) => { return { ...prev, ngay: e.target.value } })}
                />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Hủy</Button>
          <Button variant="success" onClick={handleSubmitAdd}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách ngày lễ</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto" onClick={() => setShowAddModal(true)}>
                    Thêm ngày lễ
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã ngày lễ</th>
                  <th>Tên ngày lễ</th>
                  <th>Loại</th>
                  <th>Ngày</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {ngayleData && ngayleData.length > 0
                  ? ngayleData.map((item, index) => {
                      return (
                        <tr key={item.ma_ngayle}>
                          <td>{item.ma_ngayle}</td>
                          <td>{item.ten_ngayle}</td>
                          <td>{item.loai}</td>
                          <td>{item.loai === "linhdong" ? format.formatDate(item.ngay) : item.ngay.split("-").reverse().join("-")}</td>
                          <td>
                            <Button
                              variant="warning"
                                onClick={() => {
                                  setSelectedNgayLe(item);
                                  setShowUpdateModal(true);
                                }}
                            >
                              Sửa
                            </Button>
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
