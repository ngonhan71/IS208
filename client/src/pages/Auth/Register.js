import { useState } from "react"
import { Row, Col, Button } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import nguoidungApi from "../../api/nguoidungApi"

export default function Register() {

    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [dienthoai, setDienThoai] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async(e) => {
      e.preventDefault()
      if (password !== confirmPassword) {
        setError("Mật khẩu không khớp!")
        return
      }
      try {
        const { error } = await nguoidungApi.register({email, matkhau: password, dienthoai, tenNguoiDung: name})
        if (error) {
          setError(error)
          return
        }
        alert("Đăng ký tài khoản thành công! Vui lòng kiểm tra email để kích hoạt tài khoản!")
        navigate({ pathname: '/login' })
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <div className="auth-page">
        <Row>
          <Col xl={4}>
            <div className="auth-wrapper">
              <div className="title">
                <Link to="/login">ĐĂNG NHẬP</Link> / {" "}
                <Link to="/register" style={{color: "#f26b38"}}>ĐĂNG KÝ</Link>
                </div>
              {error && (
              <div className="alert alert-block alert-danger">
                <p>{error}</p>
              </div>
            )}
              <form onSubmit={handleLogin}>
                <Row>
                 <Col xl={12}>
                    <input required type="text" className="form-control" placeholder="Họ tên" 
                    value={name} onChange={(e) => setName(e.target.value)} />
                  </Col>
                  <Col xl={12} className="mt-4">
                    <input required type="text" className="form-control" placeholder="Số điện thoại" 
                    value={dienthoai} onChange={(e) => setDienThoai(e.target.value)} />
                  </Col>
                  <Col xl={12} className="mt-4">
                    <input required type="email" className="form-control" placeholder="Email" 
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Col>
                  <Col xl={6} className="mt-4">
                    <input required type="password" className="form-control" placeholder="Mật khẩu"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Col>
                  <Col xl={6} className="mt-4">
                    <input required type="password" className="form-control" placeholder="Xác nhận mật khẩu"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Col>
                  <Col xl={12} className="mt-4">
                    <Button type="submit" variant="danger">ĐĂNG KÝ</Button>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    )
}