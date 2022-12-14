import { useState } from "react"
import { Row, Col, Button } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import nguoidungApi from "../../api/nguoidungApi"
import { login } from "../../redux/actions/user"

export default function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const [resendEmail, setResendEMail] = useState(false)

    const [maND, setMaND] = useState("")

    const handleLogin = async(e) => {
      e.preventDefault()
      try {
        setLoading(true)
        const { data, accessToken, error } = await nguoidungApi.login({email, matkhau: password})
        setLoading(false)
        if (error) {
          if (error === "Tài khoản của bạn chưa được kích hoạt!") {
            const { ma_nguoidung } = data
            setMaND(ma_nguoidung)
            setResendEMail(true)
          }
          setError(error)
          return
        }
        const { ten_nguoidung: tenNguoiDung, ma_nguoidung: maNguoiDung, role, dienthoai } = data
        localStorage.setItem("accessToken", accessToken)
        dispatch(login({ accessToken, email, tenNguoiDung, maNguoiDung, role, dienthoai }))
        if (role === 0) {
          navigate({ pathname: '/' })
        } else {
          navigate({ pathname: '/admin/thongke' })
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    const handleSendMail = async () => {
      try {
        const { error } = await nguoidungApi.resendEmail(maND)
        if  (!error) {
          alert("Yêu cầu gửi lại email thành công! Vui lòng kiểm tra email để kích hoạt tài khoản!")
          setResendEMail(false)
        }
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
                <Link to="/login" style={{color: "#f26b38"}}>ĐĂNG NHẬP</Link> / {" "}
                <Link to="/register">ĐĂNG KÝ</Link>
                </div>
              {error && (
                <div className="alert alert-block alert-danger">
                  <p>{error}</p>
                  {resendEmail && <Button type="button" variant="success" onClick={handleSendMail}>Gửi lại email</Button>}
                </div>
             )}
              <form onSubmit={handleLogin}>
                <Row>
                  <Col xl={12}>
                    <input required type="email" className="form-control" placeholder="Tài khoản" 
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Col>
                  <Col xl={12} className="mt-4">
                    <input required type="password" className="form-control" placeholder="Mật khẩu"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Col>
                  <Col xl={12} className="mt-4">
                    <Button type="submit" variant="danger" disabled={loading}>{loading ?  "ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}</Button>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    )
}