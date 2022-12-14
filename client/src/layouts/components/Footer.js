import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { IoLogoFacebook, IoLogoYoutube, IoLogoInstagram } from "react-icons/io5";
import { FaAngleDoubleRight } from "react-icons/fa";

import styles from "./Footer.module.css";
function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
            <Col xl={3}>
                <div className={styles.footerGroup}>
                    <div className={styles.footerBoxLink}>
                        <p className={styles.title}>GIỚI THIỆU</p>
                        <Link to="/"><FaAngleDoubleRight /> VỀ CHÚNG TÔI</Link>
                        <Link to="/"><FaAngleDoubleRight /> THỎA THUẬN SỬ DỤNG</Link>
                        <Link to="/"><FaAngleDoubleRight /> QUY CHẾ HOẠT ĐỘNG</Link>
                        <Link to="/"><FaAngleDoubleRight /> CHÍNH SÁCH BẢO MẬT</Link>
                    </div>
                </div>
            </Col>
            <Col xl={3}>
               <div className={styles.footerGroup}>
                    <div className={styles.footerBoxLink}>
                        <p className={styles.title}>HỖ TRỢ</p>
                        <Link to="/"><FaAngleDoubleRight /> GÓP Ý</Link>
                        <Link to="/"><FaAngleDoubleRight /> GIÁ VÉ</Link>
                        <Link to="/"><FaAngleDoubleRight /> TUYỂN DỤNG</Link>
                    </div>
               </div>
            </Col>
          <Col xl={3}>
            <div className={styles.footerGroup}>
              <p className={styles.title}>KẾT NỐI VỚI CHÚNG TÔI</p>
              <div className={styles.boxSocial}>
                <button><IoLogoFacebook /></button>
                <button><IoLogoYoutube /></button>
                <button><IoLogoInstagram /></button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
