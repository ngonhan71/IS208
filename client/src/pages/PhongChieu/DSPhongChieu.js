import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import DSGhe from "../../components/DSGhe"
import phongchieuApi from "../../api/phongchieuApi"
import rapchieuApi from "../../api/rapchieuApi"
import gheApi from "../../api/gheApi"

export default function DSPhongChieu() {

  const [phongchieuData, setPhongChieuData] = useState([])
  const [rapchieuData, setRapChieuData] = useState([])
  const [dsGheData, setDsGheData] = useState({})

  const [rerender, setRerender] = useState(false)

  const [selectedPhongChieu, setSelectedPhongChieu] = useState({})
  const [addPhongChieu, setAddPhongChieu] = useState({
    tenPhongChieu: "",
    maRapChieu: "",
  })
  const [deletePhongChieu, setDeletePhongChieu] = useState({})

  const [fileExcel, setFileExcel] = useState("")
  const [importing, setImporting] = useState(false)


  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDSGheModal, setShowDSGheModal] = useState(false)
  const [showImportGheModal, setShowImportGheModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
          const res = await phongchieuApi.getAll({})
          setPhongChieuData(res.data)
      } catch (error) {
          console.log(error)
      }
    }
    fetchData()
  }, [rerender])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await rapchieuApi.getAll({});
        console.log(res)
        setRapChieuData(res.data);
        setAddPhongChieu(prev => {
          return { ...prev, maRapChieu: res.data[0]?.ma_rapchieu}
        })
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmitUpdate = async () => {
    try {
      const res = await phongchieuApi.update(selectedPhongChieu.ma_phongchieu, {
        tenPhongChieu: selectedPhongChieu.ten_phongchieu,
        maRapChieu: selectedPhongChieu.ma_rapchieu,
      })
      console.log(res)
      if (res.error) {
        alert(res.error)
        return
      }
      setShowUpdateModal(false)
      setRerender(!rerender)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeRapChieu = (e) => {
    const index = e.target.selectedIndex;
    setSelectedPhongChieu(prev => {
      return {
        ...prev,
        ma_rapchieu: parseInt(e.target.value),
        ten_rapchieu: e.target[index].text
      }
    })
  }

  const handleSubmitAdd = async () => {
    try {
      const res = await phongchieuApi.create(addPhongChieu)
      setShowAddModal(false)
      setRerender(!rerender)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const showDanhSachGhe = async (maPhongChieu) => {
    try {
      const res = await gheApi.getAllByMaPhongChieu(maPhongChieu)
      setShowDSGheModal(true)
      setDsGheData({
        dsGhe: res.data,
        dsHang: res.hang,
        maxThutu: res.thutu?.thutu_toida
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleSubmitImport = async() => {
    try {
      const formData = new FormData()
      formData.append("file", fileExcel)
      setImporting(true)
      const { message, importError } = await gheApi.importExcel(selectedPhongChieu.ma_phongchieu, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setImporting(false)
      let msg = message + "\n"
      if (importError.length > 0) {
        importError.forEach(err => msg += err + "\n")
      }
      alert(msg)
      setShowImportGheModal(false)
      setRerender(!rerender)
    } catch (error) {
      setImporting(false)
      console.log(error)
    }
  }

  
  const handleDelete = async (e) => {
    try {
      const { error } = await phongchieuApi.delete(deletePhongChieu.ma_phongchieu)
      if (error) return alert("Kh??ng th??? x??a!!")
      alert("Th??nh c??ng!")
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
            <Modal.Title>X??a ph??ng chi???u</Modal.Title>
        </Modal.Header>
        <Modal.Body>B???n c?? ch???c x??a ph??ng chi???u <b>{deletePhongChieu && deletePhongChieu.ten_phongchieu}</b> n??y kh??ng?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>H???y</Button>
            <Button variant="danger" onClick={handleDelete}>X??a</Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>C???p nh???t ph??ng chi???u</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Th??ng tin ph??ng chi???u</h5>
                <Col xl={4}>
                    <label>T??n ph??ng chi???u</label>
                    <input type="text" value={selectedPhongChieu?.ten_phongchieu} className="form-control" 
                      onChange={(e) => setSelectedPhongChieu(prev => { return {...prev, ten_phongchieu: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>R???p chi???u</label>
                    <select className="form-select"
                      value={selectedPhongChieu?.ma_rapchieu}
                      onChange={handleChangeRapChieu}
                    >
                      {rapchieuData.length > 0 &&
                        rapchieuData.map(item => (
                          <option key={item.ma_rapchieu} value={item.ma_rapchieu}>
                            {item.ten_rapchieu}
                          </option>
                        ))}
                    </select>
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
          <Modal.Title>Th??m ph??ng chi???u</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Th??ng tin ph??ng chi???u</h5>
                <Col xl={4}>
                    <label>T??n ph??ng chi???u</label>
                    <input type="text" value={addPhongChieu?.tenPhongChieu} className="form-control" 
                      onChange={(e) => setAddPhongChieu(prev => { return {...prev, tenPhongChieu: e.target.value}})} 
                    />
                </Col>
                <Col xl={4}>
                    <label>R???p chi???u</label>
                    <select className="form-select"
                      value={addPhongChieu?.maRapChieu}
                      onChange={(e) => setAddPhongChieu(prev => { return {...prev, maRapChieu: +e.target.value}})}
                    >
                      {rapchieuData.length > 0 &&
                        rapchieuData.map(item => (
                          <option key={item.ma_rapchieu} value={item.ma_rapchieu}>
                            {item.ten_rapchieu}
                          </option>
                        ))}
                    </select>
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
      <Modal size="lg" show={showDSGheModal} onHide={() => setShowDSGheModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                {dsGheData && dsGheData?.dsGhe?.length > 0 && <DSGhe {...dsGheData} />}
            </Row>
        </Modal.Body>
      </Modal>
      <Modal size="lg" show={showImportGheModal} onHide={() => setShowImportGheModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import danh s??ch gh???</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
              <Col xl={6}>
                <label>File excel</label>
                <input type="file" className="form-control" 
                onChange={(e) => setFileExcel(e.target.files[0])}
                />
              </Col>
            </Row>
        </Modal.Body>
         <Modal.Footer>
          <Button disabled={importing} variant="success" onClick={handleSubmitImport}>{importing ? "L??u..." : "L??u"}</Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh s??ch ph??ng chi???u</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto" onClick={() => setShowAddModal(true)}>
                    Th??m ph??ng chi???u
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>M?? ph??ng chi???u</th>
                  <th>T??n ph??ng chi???u</th>
                  <th>T??n r???p chi???u</th>
                  <th>S??? l?????ng gh???</th>
                  <th colSpan="4">H??nh ?????ng</th>
                </tr>
              </thead>
              <tbody>
                {/* {loading && <tr><td>Loading...</td></tr>} */}
                {phongchieuData && phongchieuData.length > 0
                  ? phongchieuData.map((item, index) => {
                      return (
                        <tr key={item.ma_phongchieu}>
                          <td>
                            {item.ma_phongchieu}
                          </td>
                          <td>{item.ten_phongchieu}</td>
                          <td>{item.ten_rapchieu}</td>
                          <td>{item.soluongghe_toida}</td>
                          <td>
                            <Button variant="warning" onClick={() => {
                              setSelectedPhongChieu(item)
                              setShowUpdateModal(true)
                            }}><FaEdit /></Button>
                          </td>
                          <td>
                            <Button variant="danger" onClick={() => {
                              setDeletePhongChieu(item)
                              setShowDeleteModal(true)
                            }}><FaTrashAlt /></Button>
                          </td>
                          <td>
                            <Button variant="info" onClick={() => showDanhSachGhe(item.ma_phongchieu)}>Xem danh s??ch Gh???</Button>
                          </td>
                           <td>
                            <Button variant="secondary" onClick={() => {
                              setSelectedPhongChieu(item)
                              setShowImportGheModal(true)
                            }}>Import gh???</Button>
                          </td>
                        </tr>
                      );
                    })
                  : <tr><td>Kh??ng c?? ph??ng chi???u!</td></tr>}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

