import { useState } from "react"
import { Row, Col, Button } from "react-bootstrap"
import nguoidungApi from "../../api/nguoidungApi"

export default function ForgotPassword() {

    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")


    const handleSubmit = async(e) => {
      e.preventDefault()
      try {
        setLoading(true)
        const { error } = await nguoidungApi.forgotPassword({email})
        setLoading(false)
        if (error) {
            setSuccess("")
            return setError(error)
        }
        setError("")
        setSuccess(`Hãy kiểm tra email ${email} để tiếp tục!`)
     
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
                    <p>BẠN QUÊN MẬT KHẨU?</p>
                </div>
                <p style={{color: "#f26b38"}}>
                    Hãy nhập email tài khoản của bạn để thực hiện cấp lại mật khẩu! 
                </p>
                {error && (
                    <div className="alert alert-block alert-danger">
                        <p>{error}</p>
                    </div>
                )}
                {success && (
                    <div className="alert alert-block alert-success">
                        <p>{success}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col xl={12}>
                            <input required type="email" className="form-control" placeholder="Email" 
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Col>
                        <Col xl={12} className="mt-2">
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