import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Button } from 'react-bootstrap';

import { logout } from  "../../redux/actions/user"


import nguoidungApi from '../../api/nguoidungApi';

export default function ChangePassword() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirm: ""
    })

    const [error, setError] = useState(false)

    const { maNguoiDung } = useSelector((state) => state.user)

    const handleChangePassword = async () => {
        try {
            const { currentPassword, newPassword, confirm } = password

            if (newPassword !== confirm) {
                return setError("Mật khẩu xác nhận không khớp!")
            }

            setLoading(true)
            const { error } = await nguoidungApi.changePassword(maNguoiDung, { currentPassword, newPassword })
            setLoading(false)

            if (error) {
                return setError(error)
            }
            alert("Thành công. Vui lòng đăng nhập lại!")
            const accessToken = localStorage.getItem('accessToken')
            if (accessToken) {
                localStorage.removeItem('accessToken')
                dispatch(logout())
                navigate({ pathname: "/login" })
            }

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <Container>
            <Row className="mt-2">
                {error && (
                    <Col xl="4">
                        <div className="alert alert-block alert-danger">
                            <p>{error}</p>
                        </div>
                    </Col>
                )}
                <Row className="mt-2">
                    <Col xl="4">
                        <label>Mật khẩu hiện tại</label>
                        <input required type="password" className="form-control" placeholder="Mật khẩu hiện tại"
                            value={password?.currentPassword} onChange={(e) => setPassword(prev => { return {...prev, currentPassword: e.target.value}})} />
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col xl="4">
                        <label>Mật khẩu mới</label>
                        <input required type="password" className="form-control" placeholder="Mật khẩu mới"
                        value={password?.newPassword} onChange={(e) => setPassword(prev => { return {...prev, newPassword: e.target.value}})} />
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col xl="4">
                        <label>Xác nhận mật khẩu</label>
                        <input required type="password" className="form-control" placeholder="Xác nhận mật khẩu"
                        value={password?.confirm} onChange={(e) => setPassword(prev => { return {...prev, confirm: e.target.value}})} />
                        <Button className="mt-2" disabled={loading} onClick={handleChangePassword}>{loading ? "Lưu..." : "Lưu"}</Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    )
}