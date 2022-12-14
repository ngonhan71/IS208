import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import DefaultLayout from "./layouts/DefaultLayout"
import AdminLayout from "./layouts/AdminLayout"
import ProtectedRoute from "./layouts/components/ProtectedRoute"

import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"

import Home from "./pages/Home"
import DangChieu from "./pages/TrangPhim/DangChieu"
import SapChieu from "./pages/TrangPhim/SapChieu"
import Search from "./pages/Search"
import ChonSuatChieu from "./pages/DatVe/ChonSuatChieu"
import MultipleStep from "./pages/DatVe/MultipleStep"

import MoMoCallback from "./pages/DatVe/MoMoCallback" 

import GiaVe from "./pages/GiaVe"

import TaiKhoan from "./pages/TaiKhoan"

import ThongKe from "./pages/ThongKe"
import DSPhim from "./pages/Phim/DSPhim"
import AddPhim from "./pages/Phim/AddPhim"

import DSSuatChieu from "./pages/SuatChieu/DSSuatChieu"

import DSRapChieu from "./pages/RapChieu/DSRapChieu"

import DSLoaiGhe from "./pages/LoaiGhe/DSLoaiGhe"

import DSPhongChieu from "./pages/PhongChieu/DSPhongChieu"

import DSLoaiSuatChieu from "./pages/LoaiSuatChieu/DSLoaiSuatChieu"

import DSNgayLe from "./pages/NgayLe/DSNgayLe"

import DSHoaDon from "./pages/HoaDon/DSHoaDon"

import { login } from "./redux/actions/user"
import nguoidungApi from "./api/nguoidungApi"

function App() {

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const getMe = async () => {
      try {
        const { data } = await nguoidungApi.getMe()
        const { ten_nguoidung: tenNguoiDung, ma_nguoidung: maNguoiDung, role, dienthoai, email } = data
        dispatch(login({ email, tenNguoiDung, maNguoiDung, role, dienthoai }))
      } catch (error) {
        if (error.response.status === 403 || error.response.status === 401) {
          localStorage.removeItem('accessToken')
          // dispatch(logout())
        }
      }
    }
   
    const token = localStorage.getItem('accessToken')
    if (token && !user.maNguoiDung) {
      getMe()
    }
   
  },[dispatch, user])
  return (
    <div className="App">
      <Routes>
       
       <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/phim-dang-chieu" element={<DangChieu />}></Route>
          <Route path="/phim-sap-chieu" element={<SapChieu />}></Route>
          <Route path="/tim-kiem" element={<Search />} />
          <Route path="/dat-ve/:maPhim" element={<ChonSuatChieu />}></Route>
          <Route path="/book-ticket" element={<MultipleStep />}></Route>
          <Route path="/gia-ve" element={<GiaVe />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route path="/thanhtoan/momo/callback" element={<MoMoCallback />}></Route>
       </Route>


      <Route path="/" element={<ProtectedRoute isAllowed={user && user.maNguoiDung && user.role === 0} />}>
        <Route element={<DefaultLayout />}>
            <Route path="tai-khoan" element={<TaiKhoan />}></Route>
        </Route>
      </Route>


        <Route path="/admin" element={<ProtectedRoute isAllowed={user && user.maNguoiDung && user.role > 0} />}>
          <Route element={<AdminLayout />}>
            <Route path="thongke" element={<ThongKe />}></Route>

            <Route path="phim" element={<DSPhim />}></Route>
            <Route path="phim/them" element={<AddPhim />}></Route>

            <Route path="suatchieu" element={<DSSuatChieu />}></Route>

            <Route path="rapchieu" element={<DSRapChieu />}></Route>

            <Route path="phongchieu" element={<DSPhongChieu />}></Route>

            <Route path="loaisuatchieu" element={<DSLoaiSuatChieu />}></Route>

            <Route path="loaighe/" element={<DSLoaiGhe />}></Route>

            <Route path="ngayle/" element={<DSNgayLe />}></Route>

            <Route path="hoadon/" element={<DSHoaDon />}></Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
