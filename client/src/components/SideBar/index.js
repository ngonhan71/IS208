import { Link } from "react-router-dom";
import { routes } from "./routes";
import SubMenu from "./SubMenu.js"
import './SideBar.css';

 
export default function AdminSideBar() {
  
  return (
   
    <div className="sidebar-container">
      <div className="logo">
        <Link to="/">
          <img
            src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png"
            alt=""
          />
          <span>Admin</span>
        </Link>
      </div>
      <div className="sidebar-nav">
        <div className="nav-list">
        {routes.map((item, index) => {
            return <SubMenu item={item} key={index} />;
        })}
        </div>
      </div>
    </div>
  );
}
