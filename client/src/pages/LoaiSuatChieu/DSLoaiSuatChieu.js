import { useEffect, useRef, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";

import format from "../../helper/format";
import loaisuatchieuApi from "../../api/loaisuatchieuApi";

export default function DSLoaiSuatChieu() {
  const day = useRef([
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Ngày lễ",
  ]);

  const [loaisuatchieuData, setLoaiSuatChieuData] = useState([]);

  const [addLSC, setAddLSC] = useState({
    tenLoaiSuatChieu: "",
    gioBatDau: "",
    gioKetThuc: "",
    thu: 0,
    gia: "",
  });
  const [selectedLSC, setSelectedLSC] = useState({});

  const [rerender, setRerender] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await loaisuatchieuApi.getAll({});
        setLoaiSuatChieuData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmitAdd = async () => {
    try {
      const res = await loaisuatchieuApi.create(addLSC);
      console.log(res);
      alert("Thêm loại suất chiếu thành công!");
      setShowAddModal(false);
      setRerender(!rerender);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      const res = await loaisuatchieuApi.update(selectedLSC.ma_loaisuatchieu, {
        tenLoaiSuatChieu: selectedLSC.ten_loaisuatchieu,
        gioBatDau: selectedLSC.gio_batdau,
        gioKetThuc: selectedLSC.gio_ketthuc,
        thu: selectedLSC.thu,
        gia: selectedLSC.gia,
      });
      console.log(res);
      alert("Cập nhật loại suất chiếu thành công!");
      setShowUpdateModal(false);
      setRerender(!rerender);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row>
      <Modal
        size="lg"
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật loại suất chiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
              <h5>Thông tin loại suất chiếu</h5>
              <Col xl={4}>
                <label>Tên loại suất chiếu</label>
                <input
                  type="text"
                  value={selectedLSC?.ten_loaisuatchieu}
                  className="form-control"
                  onChange={(e) =>
                    setSelectedLSC((prev) => {
                      return { ...prev, ten_loaisuatchieu: e.target.value };
                    })
                  }
                />
              </Col>
              <Col xl={4}>
                <label>Thứ</label>
                <select
                  className="form-select"
                  value={selectedLSC?.thu}
                  onChange={(e) =>
                    setSelectedLSC((prev) => {
                      return { ...prev, thu: +e.target.value };
                    })
                  }
                >
                  {day.current.length > 0 &&
                    day.current.map((item, index) => (
                      <option key={index} value={index}>
                        {item}
                      </option>
                    ))}
                </select>
              </Col>
              <Col xl={4}>
                <label>Giờ bắt đầu</label>
                <input
                  type="time"
                  value={selectedLSC?.gio_batdau}
                  className="form-control"
                  onChange={(e) =>
                    setSelectedLSC((prev) => {
                      return { ...prev, gio_batdau: e.target.value };
                    })
                  }
                />
              </Col>
              <Col xl={4}>
                <label>Giờ kết thúc</label>
                <input
                  type="time"
                  value={selectedLSC?.gio_ketthuc}
                  className="form-control"
                  onChange={(e) =>
                    setSelectedLSC((prev) => {
                      return { ...prev, gio_ketthuc: e.target.value };
                    })
                  }
                />
              </Col>
              <Col xl={4}>
                <label>Giá</label>
                <input
                  type="number"
                  min="0"
                  value={selectedLSC?.gia}
                  className="form-control"
                  onChange={(e) =>
                    setSelectedLSC((prev) => {
                      return { ...prev, gia: +e.target.value };
                    })
                  }
                />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleSubmitUpdate}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm loại suất chiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
              <h5>Thông tin loại suất chiếu</h5>
              <Col xl={4}>
                <label>Tên loại suất chiếu</label>
                <input
                  type="text"
                  value={addLSC?.tenLoaiSuatChieu}
                  className="form-control"
                  onChange={(e) =>
                    setAddLSC((prev) => {
                      return { ...prev, tenLoaiSuatChieu: e.target.value };
                    })
                  }
                />
              </Col>
              <Col xl={4}>
                <label>Thứ</label>
                <select
                  className="form-select"
                  value={addLSC?.thu}
                  onChange={(e) =>
                    setAddLSC((prev) => {
                      return { ...prev, thu: +e.target.value };
                    })
                  }
                >
                  {day.current.length > 0 &&
                    day.current.map((item, index) => (
                      <option key={index} value={index}>
                        {item}
                      </option>
                    ))}
                </select>
              </Col>
              <Col xl={4}>
                <label>Giờ bắt đầu</label>
                <input
                  type="time"
                  value={addLSC?.gioBatDau}
                  className="form-control"
                  onChange={(e) =>
                    setAddLSC((prev) => {
                      return { ...prev, gioBatDau: e.target.value };
                    })
                  }
                />
              </Col>
              <Col xl={4}>
                <label>Giờ kết thúc</label>
                <input
                  type="time"
                  value={addLSC?.gioKetThuc}
                  className="form-control"
                  onChange={(e) =>
                    setAddLSC((prev) => {
                      return { ...prev, gioKetThuc: e.target.value };
                    })
                  }
                />
              </Col>
              <Col xl={4}>
                <label>Giá</label>
                <input
                  type="number"
                  min="0"
                  value={addLSC?.gia}
                  className="form-control"
                  onChange={(e) =>
                    setAddLSC((prev) => {
                      return { ...prev, gia: +e.target.value };
                    })
                  }
                />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleSubmitAdd}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách loại suất chiếu</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button
                    type="button"
                    className="btn btn-success ms-auto"
                    onClick={() => setShowAddModal(true)}
                  >
                    Thêm loại suất chiếu
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã loại suất chiếu</th>
                  <th>Tên loại suất chiếu</th>
                  <th>Thứ</th>
                  <th>Giờ bắt đầu</th>
                  <th>Giờ kết thúc</th>
                  <th>Giá</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loaisuatchieuData && loaisuatchieuData.length > 0
                  ? loaisuatchieuData.map((item, index) => {
                      return (
                        <tr key={item.ma_loaisuatchieu}>
                          <td>{item.ma_loaisuatchieu}</td>
                          <td>{item.ten_loaisuatchieu}</td>
                          <td>{format.convertToDay(item.thu)}</td>
                          <td>{item.gio_batdau}</td>
                          <td>{item.gio_ketthuc}</td>
                          <td>{format.formatPrice(item.gia)}</td>
                          <td>
                            <Button
                              variant="warning"
                              onClick={() => {
                                setSelectedLSC(item);
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
