import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import { SketchPicker } from 'react-color';
import { FaEdit } from "react-icons/fa";

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
          <Modal.Title>C???p nh???t lo???i gh???</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Th??ng tin lo???i gh???</h5>
                <Col xl={4}>
                    <label>M?? lo???i gh???</label>
                    <input type="text" readOnly name="id" value={selectedLoaiGhe?.ma_loaighe} className="form-control" />
                </Col>
                <Col xl={4}>
                    <label>T??n lo???i gh???</label>
                    <input type="text" value={selectedLoaiGhe?.ten_loaighe} className="form-control" 
                      onChange={(e) => setSelectedLoaiGhe(prev => { return {...prev, ten_loaighe: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>S??? ch??? ng???i</label>
                    <input type="number" min="1" value={selectedLoaiGhe?.socho} className="form-control"
                    onChange={(e) => setSelectedLoaiGhe(prev => { return {...prev, socho: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                    <label>Gi?? c???ng th??m</label>
                    <input type="number" min="0" value={selectedLoaiGhe?.gia_congthem} className="form-control" 
                    onChange={(e) => setSelectedLoaiGhe(prev => { return {...prev, gia_congthem: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                  <label>M??u gh???</label>
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
            H???y
          </Button>
          <Button variant="success" onClick={handleSubmitUpdate}>L??u</Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Th??m lo???i gh???</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Th??ng tin lo???i gh???</h5>
                <Col xl={4}>
                    <label>T??n lo???i gh???</label>
                    <input type="text" value={addLoaiGhe?.tenLoaiGhe} className="form-control" 
                      onChange={(e) => setAddLoaiGhe(prev => { return {...prev, tenLoaiGhe: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>S??? ch??? ng???i</label>
                    <input type="number" min="1" value={addLoaiGhe?.soCho} className="form-control"
                    onChange={(e) => setAddLoaiGhe(prev => { return {...prev, soCho: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                    <label>Gi?? c???ng th??m</label>
                    <input type="number" min="0" value={addLoaiGhe?.giaCongThem} className="form-control" 
                    onChange={(e) => setAddLoaiGhe(prev => { return {...prev, giaCongThem: +e.target.value}})} />
                </Col>
                <Col xl={4}>
                  <label>M??u gh???</label>
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
            H???y
          </Button>
          <Button variant="success" onClick={handleSubmitAdd}>L??u</Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh s??ch lo???i gh???</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nh???p t??n, m?? lo???i gh???"
                  />
                  <button type="button" className="btn btn-primary">
                    T??m ki???m
                  </button>
                </div>
              </Col>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto"
                    onClick={() => setShowAddModal(true)}>
                    Th??m lo???i gh???
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>M?? lo???i gh???</th>
                  <th>T??n lo???i gh???</th>
                  <th>M??u gh???</th>
                  <th>S??? ch??? ng???i</th>
                  <th>Gi?? c???ng th??m</th>
                  <th>H??nh ?????ng</th>
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
