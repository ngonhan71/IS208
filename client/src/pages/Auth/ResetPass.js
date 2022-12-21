import { useState } from "react"
import { Row, Col, Button } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import nguoidungApi from "../../api/nguoidungApi"

export default function ResetPassword() {

    const params = useParams()
    const navigate = useNavigate()

    const { code } = params

    const [loading, setLoading] = useState(false)

    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async(e) => {
      e.preventDefault()
      if (password !== confirm) {
        return setError("Mật khẩu không khớp!")
      }
      try {
        setLoading(true)
        const { error } = await nguoidungApi.resetPassword({code, password})
        setLoading(false)
        if (error) {
            return setError(error)
        }
        alert("Thành công!")
        navigate({pathname: "/login"})
     
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    return (
      <div className="auth-page">
        <Row>
          <Col xl={4}>
            <div className="auth-wrapper">
                <div className="title">
                    <p>ĐẶT LẠI MẬT KHẨU</p>
                </div>
                {error && (
                    <div className="alert alert-block alert-danger">
                        <p>{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col xl={12}>
                            <input required type="password" className="form-control" placeholder="Mật khẩu" 
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Col>
                        <Col xl={12} className="mt-4">
                            <input required type="password" className="form-control" placeholder="Xác nhận mật khẩu" 
                            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                        </Col>
                        <Col xl={12} className="mt-4">
                            <Button type="submit" variant="danger" disabled={loading}>{loading ?  "XÁC NHẬN..." : "XÁC NHẬN"}</Button>
                        </Col>
                    </Row>
                </form>
            </div>
          </Col>
        </Row>
      </div>
    )
}