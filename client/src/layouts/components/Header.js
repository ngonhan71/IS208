import { memo } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"

import { FaUserAlt } from "react-icons/fa";
import Search from './Search';
import NavBar from "./NavBar";
import { logout } from "../../redux/actions/user";
import styles from './Header.module.css';

function Header() {
  
  const user = useSelector((state) => state.user)
  const dispatch  = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      localStorage.removeItem('accessToken')
    }
    window.location.href = "/login"
  }

  return (
    <header className={styles.header}>
          <Container>
            <Row className="align-items-center">
                <Col xl={4}>
                    <Link to="/">
                        <div className={styles.logo}>
                            <img src="https://www.galaxycine.vn/website/images/galaxy-logo.png" alt="" />
                        </div>
                    </Link>
              </Col>
              <Col xl={8}>
                <div className="d-flex align-items-center">
                    <div>
                        <Search />
                    </div>
                    <div className={styles.auth}>
                        {user && user.email && user.tenNguoiDung ? 
                        (

                            <div className={styles.account}>
                                <p><FaUserAlt /><span>{user.tenNguoiDung}</span></p>
                                <div className={styles.accountPopup}>
                                    { user.role === 0 && <div className={styles.item}><Link className={styles.popupLink} to="/tai-khoan">Tài khoản của tôi</Link></div> }
                                    { user.role > 0 && <div className={styles.item}><Link className={styles.popupLink} to="/admin/thongke">Quản lý</Link></div> }
                                    <div className={styles.item}><p className={styles.popupLink} onClick={handleLogout} to="">Đăng xuất</p></div>
                                </div>
                             </div>
                        )
                        
                        : <Link to="/login"><FaUserAlt /><span>Đăng nhập</span></Link>
                        }
                    </div>
                </div>
              </Col>
             

              {/* <div className={`${styles.headerTopRight} d-flex`}>
                <div className={styles.headerIcon}>
                  {
                    currentUser.email && currentUser.fullName ? 
                    <div className={styles.account}>
                      <img className={styles.avatar} src={currentUser.avatar} alt="" />
                      <p>{currentUser.fullName}</p>
                      <div className={styles.accountPopup}>
                          <div className={styles.item}><Link className={styles.popupLink} to="/tai-khoan">Tài khoản của tôi</Link></div>
                          <div className={styles.item}><Link className={styles.popupLink} to="/don-hang">Đơn hàng</Link></div>
                          <div className={styles.item}><p className={styles.popupLink} onClick={handleLogout} to="">Đăng xuất</p></div>
                      </div>
                    </div>
                    : <Link to="/dang-nhap"><BsPerson /><p>Tài khoản</p></Link>
                  }
                </div>
               */}

            </Row>
          </Container>
            <div className={styles.navbar}>
               <Container>
                <Col xl={12}>
                    <NavBar />
                    </Col>
               </Container>
            </div>
    </header>
  );
}

export default memo(Header);
