import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from "chart.js";
import { Line, Pie } from "react-chartjs-2";

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
    LineElement,
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
              setSelectedRCRevenue(all.ma_rapchieu)
            } catch (error) {
              console.log(error);
            }
          };
          const getCountSCChartData = async () => {
            try {
                const { data } = await suatchieuApi.getCountLifeTime()
                setCountSCLifeTimeChartData({
                labels: data.map((item) => format.formatDate(item.ngay_chieu)),
                    datasets: [
                        {
                            label: "Số lượng",
                            data: data.map((item) => item.count),
                            fill: true,
                            borderColor: "rgb(75, 192, 192)",
                            backgroundColor: "rgba(75, 192, 192, 0.3)",
                        },
                    ],
                });
               
            } catch (error) {
                console.log(error)
            }
        }
        getDSRapChieu();
        getData()
        getCountSCChartData()
    }, [])


    useEffect(() => {
        const getRevenueChartData = async () => {
            try {
                const { ma_rapchieu } = selectedRCRevenue
                const { data } = await hoadonApi.getRevenueLifeTime({maRapChieu: ma_rapchieu === 0 ? "" : ma_rapchieu})
                setRevenueLifeTimeChartData({
                    labels: data.map((item) => format.formatDate(item.ngay_mua)),
                    datasets: [
                        {
                            label: "Doanh thu",
                            data: data.map((item) => item.trigia),
                            fill: true,
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.3)",
                        },
                    ],
                  });
            } catch (error) {
                console.log(error)
            }
        }
        getRevenueChartData()
    }, [selectedRCRevenue])

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
                    {revenueLifeTimeChartData && revenueLifeTimeChartData.datasets && (
                        <Line
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                    },
                                    title: {
                                        display: true,
                                        text: `Doanh thu ${selectedRCRevenue?.ten_rapchieu}`,
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
                    {countSCLifeTimeChartData && countSCLifeTimeChartData.datasets && (
                        <Line
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