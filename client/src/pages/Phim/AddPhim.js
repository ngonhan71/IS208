import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import theloaiApi from "../../api/theloaiApi"
import phimApi from "../../api/phimApi"

export default function AddPhim() {

  const navigate = useNavigate()

  const [theloaiData, setTheLoaiData] = useState([])

  const [selectedTheLoai, setSelectedTheLoai] = useState([])
  const [tenPhim, setTenPhim] = useState("")
  const [poster, setPoster] = useState("")
  const [trailer, setTrailer] = useState("")
  const [noidung, setNoidung] = useState("")
  const [thoiluong, setThoiluong] = useState(0)
  const [daodien, setDaodien] = useState("")
  const [namSX, setNamSX] = useState(0)
  const [ngayKC, setNgayKC] = useState("")
  const [dotuoiQD, setDotuoiQD] = useState(0)
  const [quocgia, setQuocgia] = useState("")


  useEffect(() => {
    const fetchTheLoai = async () => {
      try {
        const { data } = await theloaiApi.getAll({});
        const opts = data.map(item => { return {value: item.ma_theloai, label: item.ten_theloai} })
        setTheLoaiData(opts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTheLoai();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dsTheLoai = selectedTheLoai.map(item => {
        return {maTheLoai: item.value, tenTheLoai: item.label}
    })
    try {
        const res = await phimApi.create({
            dsTheLoai,
            tenPhim,
            poster,
            trailer,
            thoiluong,
            daodien,
            namSX,
            ngayKC,
            dotuoiQD,
            quocgia,
            noidung
        })
        console.log(res)
        alert("Thêm phim thành công!")
        navigate({ pathname: "/admin/phim" });
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Thêm phim</Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xl={6}>
                  <label>Tên phim</label>
                  <input required type="text" className="form-control" value={tenPhim} onChange={(e) => setTenPhim(e.target.value)} />
                </Col>
                <Col xl={6}>
                  <label>Thể loại</label>
                  <Select
                        isMulti={true}
                        onChange={(theloai) => setSelectedTheLoai(theloai)}
                        options={theloaiData}
                    />
                </Col>
                <Col xl={6}>
                  <label>Đường dẫn poster</label>
                  <input required type="text" className="form-control" value={poster} onChange={(e) => setPoster(e.target.value)} />
                </Col>
                <Col xl={6}>
                  <label>Đường dẫn trailer</label>
                  <input required type="text" className="form-control" value={trailer} onChange={(e) => setTrailer(e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Thời lượng (phút)</label>
                  <input required type="number" min="30" className="form-control" value={thoiluong} onChange={(e) => setThoiluong(+e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Đạo diễn</label>
                  <input required type="text" className="form-control" value={daodien} onChange={(e) => setDaodien(e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Năm sản xuất</label>
                  <input required type="number" className="form-control" value={namSX} onChange={(e) => setNamSX(+e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Quốc gia</label>
                  <input required type="text" className="form-control" value={quocgia} onChange={(e) => setQuocgia(e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Ngày khởi chiếu</label>
                  <input required type="date" className="form-control" value={ngayKC} onChange={(e) => setNgayKC(e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Độ tuổi quy định</label>
                  <input required type="number" min="0" className="form-control" value={dotuoiQD} onChange={(e) => setDotuoiQD(+e.target.value)}/>
                </Col>
              </Row>
              <Row>
                <Col xl={12}>
                    <label>Nội dung</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={noidung}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setNoidung(data)
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
                Thêm
              </Button>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
