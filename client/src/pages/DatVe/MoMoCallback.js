import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import hoadonApi from "../../api/hoadonApi"

export default function MoMoCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const orderId = searchParams.get("orderId")
    const resultCode = searchParams.get("resultCode")

    useEffect(() => {

        const verify = async () => {
            try {
                const { error } = await hoadonApi.verifyMoMo({maThanhToan: orderId})
                if (!error) {
                    navigate({ pathname: '/tai-khoan' })
                } else {
                    alert(error)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (+resultCode === 0) {
            verify()    
        } else {
            alert("Gặp lỗi trong quá trình thanh toán! Vui lòng thử lại!")
            navigate({ pathname: '/tai-khoan' })
        }
            

    }, [orderId, resultCode, navigate])

    return <h1>Đang xử lý...</h1>
}