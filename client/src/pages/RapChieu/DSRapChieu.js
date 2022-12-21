import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

import rapchieuApi from "../../api/rapchieuApi"

export default function DSRapChieu() {

  const [rapchieuData, setRapchieuData] = useState({});
  const [tinhData, setTinhData] = useState([]);

  const [loading, setLoading] = useState(false)

  const [rerender, setRerender] = useState(false)

  const [selectedRapChieu, setSelectedRapChieu] = useState({})
  const [addRapChieu, setAddRapChieu] = useState({
    tenRapChieu: "",
    thanhpho: "",
    diachi: "",
    dienthoai: ""
  })

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await rapchieuApi.getAll({});
        setLoading(false)
        console.log(res)
        setRapchieuData(res.data);
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetch(
        "https://raw.githubusercontent.com/ngonhan71/hanhchinhvn/master/province.json"
      );
      const data = await result.json();
      setTinhData(data);
      setAddRapChieu(prev => {
        return { ...prev, thanhpho: data[0]?.name}
      })
    };

    getData();
  }, []);

  const handleSubmitUpdate = async () => {
    try {
      const res = await rapchieuApi.update(selectedRapChieu.ma_rapchieu, {
        tenRapChieu: selectedRapChieu.ten_rapchieu,
        thanhpho: selectedRapChieu.thanhpho,
        diachi: selectedRapChieu.diachi,
        dienthoai: selectedRapChieu.dienthoai,
      })
      setShowUpdateModal(false)
      setRerender(!rerender)
      alert("Thành công!")
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitAdd = async () => {
    try {
      const res = await rapchieuApi.create(addRapChieu)
      setShowAddModal(false)
      setRerender(!rerender)
      console.log(res)
      alert("Thành công!")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật rạp chiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin rạp chiếu</h5>
                <Col xl={4}>
                    <label>Tên rạp chiếu</label>
                    <input type="text" value={selectedRapChieu?.ten_rapchieu} className="form-control" 
                      onChange={(e) => setSelectedRapChieu(prev => { return {...prev, ten_rapchieu: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>Thành phố</label>
                    <select className="form-select"
                      value={selectedRapChieu?.thanhpho}
                      onChange={(e) => setSelectedRapChieu(prev => { return {...prev, thanhpho: e.target.value}})}
                    >
                      {tinhData.length > 0 &&
                        tinhData.map((province, index) => (
                          <option key={province.id} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                    </select>
                </Col>
                <Col xl={4}>
                    <label>Điện thoại</label>
                    <input type="text" value={selectedRapChieu?.dienthoai} className="form-control" 
                    onChange={(e) => setSelectedRapChieu(prev => { return {...prev, dienthoai: e.target.value}})} />
                </Col>
                <Col xl={12}>
                    <label>Địa chỉ</label>
                    <input type="text" value={selectedRapChieu?.diachi} className="form-control" 
                    onChange={(e) => setSelectedRapChieu(prev => { return {...prev, diachi: e.target.value}})} />
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
          <Modal.Title>Thêm rạp chiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin rạp chiếu</h5>
                <Col xl={4}>
                    <label>Tên rạp chiếu</label>
                    <input type="text" value={addRapChieu?.tenRapChieu} className="form-control" 
                      onChange={(e) => setAddRapChieu(prev => { return {...prev, tenRapChieu: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>Thành phố</label>
                    <select className="form-select"
                      value={addRapChieu?.thanhpho}
                      onChange={(e) => setAddRapChieu(prev => { return {...prev, thanhpho: e.target.value}})}
                    >
                      {tinhData.length > 0 &&
                        tinhData.map((province, index) => (
                          <option key={province.id} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                    </select>
                </Col>
                <Col xl={4}>
                    <label>Điện thoại</label>
                    <input type="text" value={addRapChieu?.dienthoai} className="form-control" 
                    onChange={(e) => setAddRapChieu(prev => { return {...prev, dienthoai: e.target.value}})} />
                </Col>
                <Col xl={12}>
                    <label>Địa chỉ</label>
                    <input type="text" value={addRapChieu?.diachi} className="form-control" 
                    onChange={(e) => setAddRapChieu(prev => { return {...prev, diachi: e.target.value}})} />
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
          <Card.Header className="title">Danh sách rạp chiếu</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã rạp chiếu"
                  />
                  <button type="button" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </Col>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto" onClick={() => setShowAddModal(true)}>
                    Thêm rạp chiếu
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã rạp chiếu</th>
                  <th>Tên rạp chiếu</th>
                  <th>Thành phố</th>
                  <th>Địa chỉ</th>
                  <th>SĐT</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {rapchieuData && rapchieuData.length > 0
                  ? rapchieuData.map((item, index) => {
                      return (
                        <tr key={item.ma_rapchieu}>
                          <td style={{ textAlign: "center" }}>
                            {item.ma_rapchieu}
                          </td>
                          <td>{item.ten_rapchieu}</td>
                          <td>{item.thanhpho}</td>
                          <td>{item.diachi}</td>
                          <td>{item.dienthoai}</td>
                          <td>
                            <Button variant="warning" onClick={() => {
                              setSelectedRapChieu(item)
                              setShowUpdateModal(true)
                            }}><FaEdit /></Button>
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
