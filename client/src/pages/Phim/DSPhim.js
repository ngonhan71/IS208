import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FaPlayCircle } from "react-icons/fa";


import format from "../../helper/format";
import theloaiApi from "../../api/theloaiApi"
import phimApi from "../../api/phimApi";

export default function DSPhim() {
  const [phimData, setPhimData] = useState([]);
  const [theloaiData, setTheLoaiData] = useState([])

  const [selectedTheLoai, setSelectedTheLoai] = useState([])

  const [selectedPhim, setSelectedPhim] = useState({})

  const [rerender, setRerender] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    const fetchAllTheLoai = async () => {
      try {
        const { data } = await theloaiApi.getAll({});
        const opts = data.map(item => { return {value: item.ma_theloai, label: item.ten_theloai} })
        setTheLoaiData(opts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllTheLoai();
  }, []);

  useEffect(() => {
    const fetchTheLoai = async () => {
      try {
        const { data } = await phimApi.getTheLoai(selectedPhim.ma_phim);
        const opts = data.map(item => { return {value: item.ma_theloai, label: item.ten_theloai} })
        setSelectedTheLoai(opts)
      } catch (error) {
        console.log(error);
      }
    };
    fetchTheLoai();
  }, [selectedPhim.ma_phim]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await phimApi.getAll({});
        setPhimData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dsTheLoai = selectedTheLoai.map(item => {
        return {maTheLoai: item.value, tenTheLoai: item.label}
    })
    try {
        const res = await phimApi.update(selectedPhim.ma_phim, {
            dsTheLoai,
            tenPhim: selectedPhim.ten_phim,
            poster: selectedPhim.poster,
            trailer: selectedPhim.trailer,
            thoiluong: selectedPhim.thoiluong,
            daodien: selectedPhim.daodien,
            namSX: selectedPhim.nam_sx,
            ngayKC: selectedPhim.ngay_khoichieu,
            dotuoiQD: selectedPhim.dotuoi_quydinh,
            quocgia: selectedPhim.quocgia,
            noidung: selectedPhim.noidung
        })
        console.log(res)
        alert("Cập nhật phim thành công!")
        setShowUpdateModal(false)
        setRerender(!rerender)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showTrailerModal} onHide={() => setShowTrailerModal(false)} >
        <Modal.Header closeButton>
             <Modal.Title>{selectedPhim?.ten_phim} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <iframe src={selectedPhim?.trailer} width="770" height="420" title={selectedPhim?.ten_phim}
                frameBorder="0" allowFullScreen></iframe>
          </div>
        </Modal.Body>
      
      </Modal>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật phim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
              <h5>Thông tin phim</h5>
              <form onSubmit={handleSubmit}>
              <Row>
                <Col xl={6}>
                  <label>Tên phim</label>
                  <input required type="text" className="form-control" value={selectedPhim?.ten_phim} 
                        onChange={(e) => setSelectedPhim(prev => { return {...prev, ten_phim: e.target.value}})} />
                </Col>
                <Col xl={6}>
                  <label>Thể loại</label>
                  <Select
                        isMulti={true}
                        value={selectedTheLoai}
                        onChange={(theloai) => setSelectedTheLoai(theloai)}
                        options={theloaiData}
                    />
                </Col>
                <Col xl={6}>
                  <label>Đường dẫn poster</label>
                  <input required type="text" className="form-control" value={selectedPhim?.poster} 
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, poster: e.target.value}})} />
                </Col>
                <Col xl={6}>
                  <label>Đường dẫn trailer</label>
                  <input required type="text" className="form-control" value={selectedPhim?.trailer}
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, trailer: e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Thời lượng (phút)</label>
                  <input required type="number" min="30" className="form-control" value={selectedPhim?.thoiluong}
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, thoiluong: +e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Đạo diễn</label>
                  <input required type="text" className="form-control" value={selectedPhim?.daodien} 
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, daodien: e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Năm sản xuất</label>
                  <input required type="number" className="form-control" value={selectedPhim?.nam_sx}
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, nam_sx: +e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Quốc gia</label>
                  <input required type="text" className="form-control" value={selectedPhim?.quocgia}
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, quocgia: e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Ngày khởi chiếu</label>
                  <input required type="date" className="form-control" value={selectedPhim?.ngay_khoichieu}
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, ngay_khoichieu: e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Độ tuổi quy định</label>
                  <input required type="number" min="0" className="form-control" value={selectedPhim?.dotuoi_quydinh}
                  onChange={(e) => setSelectedPhim(prev => { return {...prev, dotuoi_quydinh: e.target.value}})} />
                </Col>
              </Row>
              <Row>
                <Col xl={12}>
                    <label>Nội dung</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={selectedPhim?.noidung}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setSelectedPhim(prev => { return {...prev, noidung: data}})
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                  </Col>
              </Row>
              <Button type="submit" className="mt-3">
                Lưu
              </Button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách phim</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto">
                    <Link style={{color: "white"}} to={"/admin/phim/them"}>Thêm phim</Link>
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã phim</th>
                  <th>Tên phim</th>
                  <th>Poster</th>
                  <th>Thời lượng</th>
                  <th>Đạo diễn</th>
                  <th>Năm sản xuất</th>
                  <th>Ngày khởi chiếu</th>
                  <th>Độ tuổi</th>
                  <th>Quốc gia</th>
                  <th colSpan="3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {/* {loading && <tr><td>Loading...</td></tr>} */}
                {phimData && phimData.length > 0 ? (
                  phimData.map((item, index) => {
                    return (
                      <tr key={item.ma_phim}>
                        <td>{item.ma_phim}</td>
                        <td>{item.ten_phim}</td>
                        <td>
                          <div className="container-poster">
                            <img className="poster" src={item.poster} alt="" />
                            <div className="icon" onClick={() => {
                                setSelectedPhim(item)
                                setShowTrailerModal(true)
                            }} ><FaPlayCircle /></div>
                          </div>
                        </td>
                        <td>{item.thoiluong}</td>
                        <td>{item.daodien}</td>
                        <td>{item.nam_sx}</td>
                        <td>{format.formatDate(item.ngay_khoichieu)}</td>
                        <td>{item.dotuoi_quydinh}</td>
                        <td>{item.quocgia}</td>
                        <td>
                          <Button variant="warning"
                            onClick={() => {
                              setSelectedPhim({
                                ...item,
                                ngay_khoichieu: new Date(item.ngay_khoichieu).toLocaleDateString('en-GB').split('/').reverse().join('-')
                              })
                              setShowUpdateModal(true);
                            }}
                          >
                            Sửa
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>Không có phim!</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
