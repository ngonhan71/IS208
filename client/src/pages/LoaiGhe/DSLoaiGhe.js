import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import { SketchPicker } from 'react-color';

import loaigheApi from "../../api/loaigheApi"
import format from "../../helper/format"

export default function DSLoaiGhe() {

  const [loaigheData, setLoaiGheData] = useState({});
  const [loading, setLoading] = useState(false)

  const [rerender, setRerender] = useState(false)

  const [selectedLoaiGhe, setSelectedLoaiGhe] = useState({})
  const [addLoaiGhe, setAddLoaiGhe] = useState({
    tenLoaiGhe: "",
    soCho: 1,
    giaCongThem: 0,
    color: ""
  })

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await loaigheApi.getAll({});
        setLoading(false)
        console.log(res)
        setLoaiGheData(res.data);
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmitUpdate = async () => {
    try {
      // console.log(selectedLoaiGhe)
      const res = await loaigheApi.update(selectedLoaiGhe.ma_loaighe, {
        tenLoaiGhe: selectedLoaiGhe.ten_loaighe,
        soCho: selectedLoaiGhe.socho,
        giaCongThem: selectedLoaiGhe.gia_congthem,
       color: selectedLoaiGhe.color,
      })
      setShowUpdateModal(false)
      setRerender(!rerender)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitAdd = async () => {
    try {
      // console.log(addLoaiGhe)
      const res = await loaigheApi.create(addLoaiGhe)
      setShowAddModal(false)
      setRerender(!rerender)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật loại ghế</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin loại ghế</h5>
                <Col xl={4}>
                    <label>Mã loại ghế</label>
                    <input type="text" readOnly name="id" value={selectedLoaiGhe?.ma_loaighe} className="form-control" />
                </Col>
                <Col xl={4}>
                    <label>Tên loại ghế</label>
                    <input type="text" value={selectedLoaiGhe?.ten_loaighe} className="form-control" 
                      onChange={(e) => setSelectedLoaiGhe(prev => { return {...prev, ten_loaighe: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>Số chỗ ngồi</label>
                    <input type="number" min="1" value={selectedLoaiGhe?.socho} className="form-control"
                    onChange={(e) => setSelectedLoaiGhe(prev => { return {...prev, socho: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                    <label>Giá cộng thêm</label>
                    <input type="number" min="0" value={selectedLoaiGhe?.gia_congthem} className="form-control" 
                    onChange={(e) => setSelectedLoaiGhe(prev => { return {...prev, gia_congthem: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                  <label>Màu ghế</label>
                  <SketchPicker
                    color={selectedLoaiGhe?.color}
                    onChangeComplete={(color) => setSelectedLoaiGhe(prev => { return {...prev, color: color?.hex}})}
                  />
                </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleSubmitUpdate}>Lưu</Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm loại ghế</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin loại ghế</h5>
                <Col xl={4}>
                    <label>Tên loại ghế</label>
                    <input type="text" value={addLoaiGhe?.tenLoaiGhe} className="form-control" 
                      onChange={(e) => setAddLoaiGhe(prev => { return {...prev, tenLoaiGhe: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>Số chỗ ngồi</label>
                    <input type="number" min="1" value={addLoaiGhe?.soCho} className="form-control"
                    onChange={(e) => setAddLoaiGhe(prev => { return {...prev, soCho: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                    <label>Giá cộng thêm</label>
                    <input type="number" min="0" value={addLoaiGhe?.giaCongThem} className="form-control" 
                    onChange={(e) => setAddLoaiGhe(prev => { return {...prev, giaCongThem: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                  <label>Màu ghế</label>
                  <SketchPicker
                    color={addLoaiGhe?.color}
                    onChangeComplete={(color) => setAddLoaiGhe(prev => { return {...prev, color: color?.hex}})}
                  />
                </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleSubmitAdd}>Lưu</Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách loại ghế</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã loại ghế"
                  />
                  <button type="button" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </Col>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto"
                    onClick={() => setShowAddModal(true)}>
                    Thêm loại ghế
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã loại ghế</th>
                  <th>Tên loại ghế</th>
                  <th>Màu ghế</th>
                  <th>Số chỗ ngồi</th>
                  <th>Giá cộng thêm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {loaigheData && loaigheData.length > 0
                  ? loaigheData.map((item, index) => {
                      return (
                        <tr key={item.ma_loaighe}>
                          <td>
                            {item.ma_loaighe}
                          </td>
                          <td>{item.ten_loaighe}</td>
                          <td><div style={{ width: 40, height: 40, backgroundColor: item.color, margin: "0 auto" }}></div></td>
                          <td>{item.socho}</td>
                          <td>{format.formatPrice(item.gia_congthem)}</td>
                          <td>
                            <Button variant="warning" onClick={() => {
                              setSelectedLoaiGhe(item)
                              setShowUpdateModal(true)
                            }}>Sửa</Button>
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
