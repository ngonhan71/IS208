import { Link } from "react-router-dom";
import { routes } from "./routes";
import SubMenu from "./SubMenu.js"
import './SideBar.css';
import { useSelector } from "react-redux";

 
export default function AdminSideBar() {
  
  const { role, tenNguoiDung } = useSelector((state) => state.user)

  return (
   
    <div className="sidebar-container">
      <div className="logo">
        <Link to="/">
          <img
            src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png"
            alt=""
          />
          <span>{tenNguoiDung || "Admin"}</span>
        </Link>
      </div>
      <div className="sidebar-nav">
        <div className="nav-list">
        {routes.map((item, index) => {
            if (item.permissions.includes(role)) {
                return <SubMenu item={item} key={index} />
            } else return null;
        })}
        </div>
      </div>
    </div>
  );
}
