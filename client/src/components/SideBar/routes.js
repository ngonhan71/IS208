// import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

export const roleEnum = {
    Customer: 0,
    Staff: 1,
    Admin: 2
}

export const routes = [
  {
    title: 'Tổng quan',
    path: '/admin/thongke',
    permissions: [roleEnum.Staff, roleEnum.Admin]

  },
  {
    title: 'Nhân viên',
    path: '/admin/nhanvien',
    permissions: [roleEnum.Admin]
  },
  {
    title: 'Phim',
    path: '/admin/phim',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Thể loại',
    path: '/admin/theloai',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Suất chiếu',
    path: '/admin/suatchieu',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Rạp chiếu',
    path: '/admin/rapchieu',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Phòng chiếu',
    path: '/admin/phongchieu',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Loại suất chiếu',
    path: '/admin/loaisuatchieu',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Loại ghế',
    path: '/admin/loaighe',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  }, 
  {
    title: 'Ngày lễ',
    path: '/admin/ngayle',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Hóa đơn',
    path: '/admin/hoadon',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
  {
    title: 'Khách hàng',
    path: '/admin/khachhang',
    permissions: [roleEnum.Staff, roleEnum.Admin]
  },
];