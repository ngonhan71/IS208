import { Outlet } from "react-router-dom"
import SideBar from "../../components/SideBar"
export default function AdminLayout() {
    return (
        <>
            <SideBar />
            <div className="wrapper">
                <Outlet />
            </div>
        </>
    )
}
