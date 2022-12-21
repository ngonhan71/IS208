import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"

import theloaiApi from "../../api/theloaiApi"

export default function DSTheLoai() {

  const [theloaiData, setTheLoaiData] = useState({});
  const [loading, setLoading] = useState(false)

  const [rerender, setRerender] = useState(false)

  const [selectedTheLoai, setSelectedTheLoai] = useState({})
  const [addTheLoai, setAddTheLoai] = useState({
    tenTheLoai: "",
  })

  const [deleteTheLoai, setDeleteTheLoai] = useState({})

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await theloaiApi.getAll({});
        setLoading(false)
        setTheLoaiData(data);
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault()
    try {
      const { error } = await theloaiApi.update(selectedTheLoai.ma_theloai, {
        tenTheLoai: selectedTheLoai.ten_theloai,
      })
      if (error) return alert(error)
      alert("Thành công!")
      setShowUpdateModal(false)
      setRerender(!rerender)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    try {
      const { error } = await theloaiApi.create(addTheLoai)
      if (error) return alert(error)
      alert("Thành công!")
      setShowAddModal(false)
      setRerender(!rerender)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (e) => {
    try {
      const { error } = await theloaiApi.delete(deleteTheLoai.ma_theloai)
      if (error) return alert(error)
      alert("Thành công!")
      setShowDeleteModal(false)
      setRerender(!rerender)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Row>
      <Modal size="lg" show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Xóa thể loại</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc xóa thể loại <b>{deleteTheLoai && deleteTheLoai.ten_theloai}</b> này không?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
            <Button variant="danger" onClick={handleDelete}>Xóa</Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thể loại</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin thể loại</h5>
                <form  onSubmit={handleSubmitUpdate}>
                    <Col xl={4}>
                        <label>Mã thể loại</label>
                        <input type="text" readOnly name="id" value={selectedTheLoai?.ma_theloai} className="form-control" />
                    </Col>
                    <Col xl={4}>
                        <label>Tên thể loại</label>
                        <input required type="text" value={selectedTheLoai?.ten_theloai} className="form-control" 
                        onChange={(e) => setSelectedTheLoai(prev => { return {...prev, ten_theloai: e.target.value}})} 
                        />
                    </Col>
                    <Button type="submit" variant="success" className="mt-4">Lưu</Button>
                </form>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm thể loại</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin thể loại</h5>
                <form  onSubmit={handleSubmitAdd}>
                    <Col xl={4}>
                        <label>Tên thể loại</label>
                        <input required type="text" value={addTheLoai?.tenTheLoai} className="form-control" 
                        onChange={(e) => setAddTheLoai(prev => { return {...prev, tenTheLoai: e.target.value}})} 
                        />
                    </Col>
                    <Button type="submit" variant="success" className="mt-4">Lưu</Button>
                </form>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách thể loại</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã thể loại"
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
                    Thêm thể loại
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã thể loại</th>
                  <th>Tên thể loại</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {theloaiData && theloaiData.length > 0
                  ? theloaiData.map((item, index) => {
                      return (
                        <tr key={item.ma_theloai}>
                          <td> {item.ma_theloai}</td>
                          <td>{item.ten_theloai}</td>
                          <td>
                            <Button variant="warning" onClick={() => {
                              setSelectedTheLoai(item)
                              setShowUpdateModal(true)
                            }}><FaEdit /></Button>
                          </td>
                          <td>
                            <Button variant="danger" onClick={() => {
                              setDeleteTheLoai(item)
                              setShowDeleteModal(true)
                            }}><FaTrashAlt /></Button>
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
