import Header from "../components/Header"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
export default function DefaultLayout() {
    return (
        <>
            <Header />
           <div style={{padding: 20}}>
            <Outlet />
           </div>
            <Footer />
        </>
    )
}

