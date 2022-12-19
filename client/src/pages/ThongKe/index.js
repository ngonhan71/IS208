import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaGooglePlay, FaShoppingBag, FaChartBar } from "react-icons/fa"
import hoadonApi from "../../api/hoadonApi";

import phimApi from "../../api/phimApi";

import DashboardCard  from "../../components/DashboardCard"

import styles from  "./ThongKe.module.css"
import format from "../../helper/format";
import suatchieuApi from "../../api/suatchieuApi";
import rapchieuApi from "../../api/rapchieuApi";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function ThongKe() {

    const [cardData, setCardData] = useState({})
    const [revenueLifeTimeChartData, setRevenueLifeTimeChartData] = useState({})
    const [countSCLifeTimeChartData, setCountSCLifeTimeChartData] = useState({})
    const [phimBanChayChartData, setPhimBanChayChartData] = useState({})
    const [rapchieuBanChayChartData, setRapChieuBanChayChartData] = useState({})

    const [dsRapChieu, setDsRapChieu] = useState([])
    const [selectedRC, setSelectedRC] = useState()

    const [selectedRCRevenue, setSelectedRCRevenue] = useState({})
    const [selectedRCCountSC, setSelectedRCCountSC] = useState(0)

    const [revenueTime, setRevenueTime] = useState(1)
    const [showRangeDate, setShowRangeDate] = useState(false)
    const [rangeDate, setRangeDate] = useState({})
    const [totalRevenue, setTotalRevenue] = useState(0)

    const [phimBanChayOrderBy, setPhimBanChayOrderBy] = useState("so-luong")
    const [rapchieuBanChayOrderBy, setRapchieuBanChayOrderBy] = useState("gia")


    useEffect(() => {
        const getData = async () => {
            try {
                const [phim, hoadon, doanhthu] = await Promise.all([
                   phimApi.getCount(),
                   hoadonApi.getCount(),
                   hoadonApi.getRevenue()
                ])
                setCardData(pre => {
                    return {
                      ...pre, 
                      phim: phim.count,
                      hoadon: hoadon.count,
                      doanhthu: doanhthu.revenue
                    }
                  })
            } catch (error) {
                console.log(error)
            }
        }
        
        const getDSRapChieu = async () => {
            try {
              const { data } = await rapchieuApi.getAll({});
              const all = { ma_rapchieu: 0, ten_rapchieu: "Tất cả rạp" }
              setDsRapChieu([all, ...data])
              setSelectedRC(all.ma_rapchieu)
              setSelectedRCRevenue(all)
            } catch (error) {
              console.log(error);
            }
          };
          
        getDSRapChieu();
        getData()
    }, [])

    useEffect(() => {
        if (revenueTime === 2) {
            setShowRangeDate(true)
        } else {
            const now = new Date()
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            const start = firstDay.toLocaleString("en-GB").slice(0, 10).split('/').reverse().join('-')
            const end = lastDay.toLocaleString("en-GB").slice(0, 10).split('/').reverse().join('-')
            setShowRangeDate(false)
            setRangeDate({start, end})
        }
    }, [revenueTime])


    useEffect(() => {
        
        const getRevenueChartData = async () => {
            try {
                const { ma_rapchieu } = selectedRCRevenue
                const { data } = await hoadonApi.getRevenueChart({maRapChieu: ma_rapchieu === 0 ? "" : ma_rapchieu, ...rangeDate})
                const total = data.reduce((result, current) => result + (current.trigia * 1), 0)
                setTotalRevenue(total)
                setRevenueLifeTimeChartData({
                    labels: data.map((item) => format.formatDate(item.ngay_mua)),
                    datasets: [
                        {
                            label: "Doanh thu",
                            data: data.map((item) => item.trigia),
                            fill: true,
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132)",
                        },
                    ],
                  });
            } catch (error) {
                console.log(error)
            }
        }
      
        if ((showRangeDate && new Date(rangeDate.start) <= new Date(rangeDate.end)) || (!showRangeDate)) {
            getRevenueChartData()
        } else  {
            alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!")
        }
    }, [selectedRCRevenue, rangeDate, showRangeDate])

    useEffect(() => {
        const getPhimBanChay = async () => {
            try {
                const { data } = await hoadonApi.getPhimBanChay({by: phimBanChayOrderBy, maRapChieu: selectedRC === 0 ? "" : selectedRC})
                setPhimBanChayChartData({
                    labels: data.map((item) => item.ten_phim),
                    datasets: [
                      {
                        label: "Phim bán chạy",
                        data: data.map((item) => item.value),
                        backgroundColor: ["#36a2eb", "#ff6384", "#e8c3b9", "#ffce56", "#8e5ea2"],
                      },
                    ],
                  });
            } catch (error) {
                console.log(error)
            }
        }
        getPhimBanChay()

    }, [phimBanChayOrderBy, selectedRC])

    useEffect(() => {
        const getRapChieuBanChay = async () => {
            try {
                const { data } = await hoadonApi.getRapChieuBanChay({by: rapchieuBanChayOrderBy})
                setRapChieuBanChayChartData({
                    labels: data.map((item) => item.ten_rapchieu),
                    datasets: [
                      {
                        label: "Rạp chiếu bán chạy",
                        data: data.map((item) => item.value),
                        backgroundColor: ["#36a2eb", "#ff6384", "#e8c3b9", "#ffce56", "#8e5ea2"],
                      },
                    ],
                  });
            } catch (error) {
                console.log(error)
            }
        }
        getRapChieuBanChay()

    }, [rapchieuBanChayOrderBy])

    useEffect(() => {
        const getCountSCChartData = async () => {
            try {
                const { data } = await suatchieuApi.getCountLifeTime({maRapChieu: selectedRCCountSC === 0 ? "" : selectedRCCountSC})
                setCountSCLifeTimeChartData({
                labels: data.map((item) => format.formatDate(item.ngay_chieu)),
                    datasets: [
                        {
                            label: "Số lượng",
                            data: data.map((item) => item.count),
                            fill: true,
                            borderColor: "rgb(255, 206, 86)",
                            backgroundColor: "rgba(255, 206, 86)",
                        },
                    ],
                });
               
            } catch (error) {
                console.log(error)
            }
        }
        getCountSCChartData()
    }, [selectedRCCountSC])

    const handleChangeRapChieu = (e) => {
        const index = e.target.selectedIndex;
        setSelectedRCRevenue({
          ma_rapchieu: parseInt(e.target.value),
          ten_rapchieu: e.target[index].text,
        })
      }

   return (
    <Row>
        {cardData && cardData?.phim && (
           <Row>
             <Col xl="3">
                <DashboardCard 
                    name="Phim" 
                    quantity={cardData && cardData.phim} 
                    bgColor="bg-success" 
                    Icon={FaGooglePlay} />
            </Col>
            <Col xl={3}>
                <DashboardCard 
                    name="Hóa đơn" 
                    quantity={cardData && cardData.hoadon} 
                    bgColor="bg-info" 
                    Icon={FaShoppingBag} />
            </Col>
            <Col xl={3}>
                <DashboardCard 
                    name="Doanh thu (triệu)" 
                    quantity={cardData && ((cardData.doanhthu / 1000000).toFixed(2))} 
                    bgColor="bg-danger" 
                    Icon={FaChartBar} />
                </Col> 
           </Row>
        )}
        <Row className="mt-4">
            <Col xl={8}>
                <div className={styles.chart}>
                    <h2>DOANH THU</h2>
                    <Row>
                         <Col xl="3">
                            <label>Rạp chiếu</label>
                            <select className="form-select"
                                    value={selectedRCRevenue?.ma_rapchieu}
                                    onChange={handleChangeRapChieu}
                            >
                            {dsRapChieu.length > 0 &&
                                dsRapChieu.map(item => (
                                <option key={item.ma_rapchieu} value={item.ma_rapchieu}>
                                    {item.ten_rapchieu}
                                </option>
                                ))}
                            </select>
                        </Col>
                        <Col xl="3">
                            <label>Thời gian</label>
                            <select className="form-select"
                                    value={revenueTime}
                                    onChange={(e) => setRevenueTime(+e.target.value)}
                            >
                                <option value="1">Tháng này</option>
                                <option value="2">Tùy chỉnh</option>
                            </select>
                                
                        </Col>
                        {showRangeDate && (
                            <Col xl="6" className="d-flex">
                                <div>
                                    <label>Bắt đầu</label>
                                    <input type="date" className="form-control" value={rangeDate?.start} 
                                            onChange={(e) => setRangeDate(prev => { return {...prev, start: e.target.value}})} />
                                </div>
                                <div className="ms-4">
                                    <label>Kết thúc</label>
                                    <input type="date" className="form-control" value={rangeDate?.end} 
                                    onChange={(e) => setRangeDate(prev => { return {...prev, end: e.target.value}})} />
                                </div>
                            </Col>
                        )}
                    </Row>
                    {revenueLifeTimeChartData && revenueLifeTimeChartData.datasets && (
                        <Bar
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                    },
                                    title: {
                                        display: true,
                                        text: `Doanh thu ${selectedRCRevenue?.ten_rapchieu}: ${format.formatPrice(totalRevenue)}`,
                                    },
                                },
                            }}
                            data={revenueLifeTimeChartData}
                        />
                    )}
                </div>
            </Col>
            <Col xl={4}>
                <div className={styles.chart}>
                    <h2>PHIM BÁN CHẠY</h2>
                    <select 
                        className="form-select" 
                        value={phimBanChayOrderBy}
                        onChange={(e) => setPhimBanChayOrderBy(e.target.value)}
                    >
                        <option value="so-luong">Theo số lượng vé</option>
                        <option value="gia">Theo giá</option>
                        {/* <option value="3">Tuần trước</option> */}
                    </select>
                    <label className="mt-4">Rạp chiếu</label>
                    <select className="form-select"
                      value={selectedRC}
                      onChange={(e) => setSelectedRC(+e.target.value)}
                    >
                      {dsRapChieu.length > 0 &&
                        dsRapChieu.map(item => (
                          <option key={item.ma_rapchieu} value={item.ma_rapchieu}>
                            {item.ten_rapchieu}
                          </option>
                        ))}
                    </select>
                    {phimBanChayChartData && phimBanChayChartData.datasets && (
                        <Pie
                            options={{
                                responsive: true,
                                    plugins: {
                                    legend: {
                                        position: "top",
                                        align: "start",
                                    },
                                    title: {
                                        display: true,
                                        text: "Phim bán chạy",
                                    },
                                },
                            }}
                            data={phimBanChayChartData}
                      />
                    )}
                </div>
            </Col>
        </Row>
        <Row>
            <Col xl={8}>
                <div className={styles.chart}>
                    <h2>SỐ LƯỢNG SUẤT CHIẾU</h2>
                    <label className="mt-4">Rạp chiếu</label>
                    <select className="form-select"
                      value={selectedRCCountSC}
                      onChange={(e) => setSelectedRCCountSC(+e.target.value)}
                    >
                      {dsRapChieu.length > 0 &&
                        dsRapChieu.map(item => (
                          <option key={item.ma_rapchieu} value={item.ma_rapchieu}>
                            {item.ten_rapchieu}
                          </option>
                        ))}
                    </select>
                    {countSCLifeTimeChartData && countSCLifeTimeChartData.datasets && (
                        <Bar
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                    },
                                    title: {
                                        display: true,
                                        text: `Suất chiếu`,
                                    },
                                },
                            }}
                            data={countSCLifeTimeChartData}
                        />
                    )}
                </div>
            </Col>
            <Col xl={4}>
                <div className={styles.chart}>
                    <h2>RẠP CHIẾU BÁN CHẠY</h2>
                    <select 
                        className="form-select" 
                        value={rapchieuBanChayOrderBy}
                        onChange={(e) => setRapchieuBanChayOrderBy(e.target.value)}
                    >
                        <option value="so-luong">Theo số lượng vé</option>
                        <option value="gia">Theo giá</option>
                        {/* <option value="3">Tuần trước</option> */}
                    </select>
                    {rapchieuBanChayChartData && rapchieuBanChayChartData.datasets && (
                        <Pie
                            options={{
                                responsive: true,
                                    plugins: {
                                    legend: {
                                        position: "top",
                                        align: "start",
                                    },
                                    title: {
                                        display: true,
                                        text: "Rạp chiếu bán chạy",
                                    },
                                },
                            }}
                            data={rapchieuBanChayChartData}
                      />
                    )}
                </div>
            </Col>
        </Row>
    </Row>
   )
}