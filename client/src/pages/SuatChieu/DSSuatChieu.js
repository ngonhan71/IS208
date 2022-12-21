import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import Select from "react-select";
import Pagination from "../../components/Pagination"
import { FaEdit } from "react-icons/fa";
import format from "../../helper/format";
import suatchieuApi from "../../api/suatchieuApi";
import loaisuatchieuApi from "../../api/loaisuatchieuApi";
import phongchieuApi from "../../api/phongchieuApi";
import phimApi from "../../api/phimApi";

export default function DSLoaiSuatChieu() {
  const [loading, setLoading] = useState(false)
  const [suatchieuData, setSuatChieuData] = useState([]);
  const [suatchieuDangCo, setSuatChieuDangCo] = useState([])
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1)

  const [phimData, setPhimData] = useState([]);
  const [phongchieuData, setPhongChieuData] = useState([]);
  const [lscData, setLscData] = useState([]);

  const [phongchieu, setPhongchieu] = useState("")
  const [ngaychieu, setNgaychieu] = useState("")
  const [reloadSCDangCo, setReloadSCDangCo] = useState(false)

  const [addSC, setAddSC] = useState({
    maPhim: "",
    maLoaiSuatChieu: "",
    maPhongChieu: "",
    ngayChieu: "",
    gioChieu: "",
  });
  const [selectedSC, setSelectedSC] = useState({});

  const [rerender, setRerender] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("GET ALL")
        setLoading(true)
        const { data, totalPage } = await suatchieuApi.getAll({limit: 10, page});
        setSuatChieuData(data);
        setTotalPage(totalPage)

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender, page]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log(phongchieu, ngaychieu)
        const { data } = await suatchieuApi.getByMaPhongChieuAndNgayChieu({maPhongChieu: phongchieu, ngayChieu: ngaychieu});
        setSuatChieuDangCo(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [phongchieu, ngaychieu, reloadSCDangCo]);
  useEffect(() => {
    const fetchPhim = async () => {
      try {
        const { data } = await phimApi.getAll({});
        const opts = data.map((item) => {
          return { value: item.ma_phim, label: item.ten_phim };
        });
        setPhimData(opts);
        setAddSC(prev => {
          return { ...prev, maPhim: data[0]?.ma_phim}
        })
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPhongChieu = async () => {
      try {
        const { data } = await phongchieuApi.getAll({});
        const opts = data.map((item) => {
          const { ma_phongchieu, ten_rapchieu, ten_phongchieu } = item;
          return {
            value: ma_phongchieu,
            ten_rapchieu,
            ten_phongchieu,
            label: `${ten_rapchieu} - ${ten_phongchieu}`,
          };
        });
        setPhongChieuData(opts);
        setAddSC(prev => {
          return { ...prev, maPhongChieu: data[0]?.ma_phongchieu}
        })
      } catch (error) {
        console.log(error);
      }
    };
    const fetchLSC = async () => {
      try {
        const { data } = await loaisuatchieuApi.getAllAddSc({});
        setLscData(data);
        setAddSC(prev => {
          return { ...prev, maLoaiSuatChieu: data[0]?.ma_loaisuatchieu}
        })
      } catch (error) {
        console.log(error);
      }
    };
    fetchLSC();
    fetchPhongChieu();
    fetchPhim();
  }, []);

    const handleSubmitAdd = async () => {
      // console.log(addSC, phongchieu)
      try {
        const { error } = await suatchieuApi.create(addSC);
        if (error) {
          alert(error)
          return
        }
        alert("Thành công!")
        setShowAddModal(false);
        setRerender(!rerender);
        setReloadSCDangCo(!reloadSCDangCo)
      } catch (error) {
        console.log(error);
      }
    };

    const handleSubmitUpdate = async () => {
      try {
        const { ma_suatchieu, ma_phim, ma_phongchieu, ma_loaisuatchieu, ngay_chieu, gio_chieu } = selectedSC
        const { error } = await suatchieuApi.update(ma_suatchieu, {
          maPhim: ma_phim, 
          maPhongChieu: ma_phongchieu, 
          maLoaiSuatChieu: ma_loaisuatchieu, 
          ngayChieu: ngay_chieu, 
          gioChieu: gio_chieu
        }) 
        if (error) {
          alert(error)
          return
        }
        alert("Thành công!")
        setShowUpdateModal(false);
        setRerender(!rerender);
        setReloadSCDangCo(!reloadSCDangCo)
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <Row>
      <Modal
        size="lg"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm suất chiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
              <h5>Thông tin suất chiếu</h5>
              <Col xl={6}>
                <label>Phim</label>
                <select
                  className="form-select"
                  value={addSC?.maPhim}
                  onChange={(e) =>
                    setAddSC((prev) => {
                      return { ...prev, maPhim: +e.target.value };
                    })
                  }
                >
                  {phimData.length > 0 &&
                    phimData.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                </select>
              </Col>
              <Col xl={6}>
                <label>Phòng chiếu</label>
                <select
                  className="form-select"
                  value={addSC?.maPhongChieu}
                  onChange={(e) =>
                   {
                    setAddSC((prev) => {
                      return { ...prev, maPhongChieu: +e.target.value };
                    })
                    setPhongchieu(+e.target.value)
                   }
                  }
                >
                  {phongchieuData.length > 0 &&
                    phongchieuData.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                </select>
              </Col>
              <Col xl={6}>
                <label>Loại suất chiếu</label>
                <select
                  className="form-select"
                  value={addSC?.maLoaiSuatChieu}
                  onChange={(e) =>
                    setAddSC((prev) => {
                      return { ...prev, maLoaiSuatChieu: +e.target.value };
                    })
                  }
                >
                  {lscData.length > 0 &&
                    lscData.map((item) => (
                      <option
                        key={item.ma_loaisuatchieu}
                        value={item.ma_loaisuatchieu}
                      >
                        {item.ten_loaisuatchieu} -{" "}
                        {format.convertToDay(item.thu)} - Giá {item.gia}- Từ{" "}
                        {item.gio_batdau} Đến {item.gio_ketthuc}
                      </option>
                    ))}
                </select>
              </Col>
              <Col xl={3}>
                <label>Ngày chiếu</label>
                <input
                  type="date"
                  value={addSC?.ngayChieu}
                  className="form-control"
                  onChange={(e) =>
                   {
                    setAddSC((prev) => {
                      return { ...prev, ngayChieu: e.target.value };
                    })
                    setNgaychieu(e.target.value)
                   }
                  }
                />
              </Col>
              <Col xl={3}>
                <label>Giờ chiếu</label>
                <input
                  type="time"
                  value={addSC?.gioChieu}
                  className="form-control"
                  onChange={(e) =>
                    setAddSC((prev) => {
                      return { ...prev, gioChieu: e.target.value };
                    })
                  }
                />
              </Col>
            </Row>
            { suatchieuDangCo && suatchieuDangCo.length > 0 && 
              (
                <Row>
                    <p>Danh sách suất chiếu hiện có</p>
                    {suatchieuDangCo.map(item => {
                      return (
                      <Col xl={4} key={item.ma_suatchieu}>
                        <div className="alert alert-block alert-danger">
                          <p>Giờ chiếu: {item.gio_chieu}</p>
                          <p>Phim: {item.ten_phim} - {item.thoiluong} phút</p>
                        </div>
                      </Col>

                      )
                    })}
                </Row>
              )
            }
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
      <Modal
        size="lg"
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật suất chiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
              <h5>Thông tin suất chiếu</h5>
              <Col xl={6}>
                <label>Phim</label>
                <Select
                  value={{
                    value: selectedSC?.ma_phim,
                    label: selectedSC?.ten_phim,
                  }}
                  onChange={(phim) =>
                    setSelectedSC((prev) => {
                      return {
                        ...prev,
                        ma_phim: phim.value,
                        ten_phim: phim.label,
                      };
                    })
                  }
                  options={phimData}
                />
              </Col>
              <Col xl={6}>
                <label>Phòng chiếu</label>
                <Select
                  value={{
                    value: selectedSC?.ma_phongchieu,
                    label: `${selectedSC?.ten_rapchieu} - ${selectedSC?.ten_phongchieu}`,
                  }}
                  onChange={(pc) =>
                    {
                      setSelectedSC((prev) => {
                        return {
                          ...prev,
                          ma_phongchieu: pc.value,
                          ten_phongchieu: pc.ten_phongchieu,
                          ten_rapchieu: pc.ten_rapchieu,
                        };
                      })
                      setPhongchieu(pc.value)
                    }
                  }
                  options={phongchieuData}
                />
              </Col>
              <Col xl={6}>
                <label>Loại suất chiếu</label>
                <select
                  className="form-select"
                  value={selectedSC?.ma_loaisuatchieu}
                  onChange={(e) =>
                    setSelectedSC((prev) => {
                      return { ...prev, ma_loaisuatchieu: +e.target.value };
                    })
                  }
                >
                  {lscData.length > 0 &&
                    lscData.map((item) => (
                      <option
                        key={item.ma_loaisuatchieu}
                        value={item.ma_loaisuatchieu}
                      >
                        {item.ten_loaisuatchieu} -{" "}
                        {format.convertToDay(item.thu)} - Giá {item.gia}- Từ{" "}
                        {item.gio_batdau} Đến {item.gio_ketthuc}
                      </option>
                    ))}
                </select>
              </Col>
              <Col xl={3}>
                <label>Ngày chiếu</label>
                <input
                  type="date"
                  value={selectedSC?.ngay_chieu}
                  className="form-control"
                  onChange={(e) =>
                    {
                      setSelectedSC((prev) => {
                        return { ...prev, ngay_chieu: e.target.value };
                      })
                      setNgaychieu(e.target.value)
                    }
                  }
                />
              </Col>
              <Col xl={3}>
                <label>Giờ chiếu</label>
                <input
                  type="time"
                  value={selectedSC?.gio_chieu}
                  className="form-control"
                  onChange={(e) =>
                    setSelectedSC((prev) => {
                      return { ...prev, gio_chieu: e.target.value };
                    })
                  }
                />
              </Col>
            </Row>
            {suatchieuDangCo && suatchieuDangCo.length > 0 && 
              (
                <Row>
                    <p>Danh sách suất chiếu hiện có: </p>
                    {suatchieuDangCo.map(item => {
                      return item.ma_suatchieu !== selectedSC.ma_suatchieu && (
                      <Col xl={4} key={item.ma_suatchieu}>
                        <div className="alert alert-block alert-danger">
                          <p>Giờ chiếu: {item.gio_chieu}</p>
                          <p>Phim: {item.ten_phim} - {item.thoiluong} phút</p>
                        </div>
                      </Col>

                      )
                    })}
                </Row>
              )
            }
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
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách suất chiếu</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button
                    type="button"
                    className="btn btn-success ms-auto"
                    onClick={() => {
                      setShowAddModal(true)
                      setNgaychieu(addSC?.ngayChieu)
                      setPhongchieu(addSC?.maPhongChieu)
                    }}
                  >
                    Thêm suất chiếu
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã suất chiếu</th>
                  <th>Phim</th>
                  <th>Loại suất chiếu</th>
                  <th>Ngày chiếu</th>
                  <th>Giờ chiếu</th>
                  <th>Phòng chiếu</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {!loading && suatchieuData && suatchieuData.length > 0
                  ? suatchieuData.map((item, index) => {
                      return (
                        <tr key={item.ma_suatchieu}>
                          <td>{item.ma_suatchieu}</td>
                          <td>
                            {item.ten_phim} - {item.thoiluong} phút
                          </td>
                          <td>
                            {item.ten_loaisuatchieu} -{" "}
                            {format.convertToDay(item.thu)} - Giá {item.gia}
                          </td>
                          <td>{format.formatDate(item.ngay_chieu)}</td>
                          <td>{item.gio_chieu}</td>
                          <td>
                            Rạp {item.ten_rapchieu} - {item.ten_phongchieu}
                          </td>
                          <td>
                            <Button
                              variant="warning"
                              onClick={() => {
                                const nc = new Date(item.ngay_chieu).toLocaleDateString("en-GB").split("/").reverse().join("-")
                                setPhongchieu(item.ma_phongchieu)
                                setNgaychieu(nc)
                                setSelectedSC({
                                  ...item,
                                  ngay_chieu: nc
                                });
                                setShowUpdateModal(true);
                              }}
                            >
                              <FaEdit />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
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
