import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import gheApi from "../../api/gheApi";
import loaigheApi from "../../api/loaigheApi";

import DanhSachGhe from "./DanhSachGhe";

export default function ChonGhe() {

    const { suatChieu } = useSelector((state) => state.booking)
    const [dsGheData, setDsGheData] = useState({})
    const [dsGheDaBan, setDsGheDaBan] = useState([])
    const [dsLoaiGhe, setDsLoaiGhe] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
              const { data, hang, thutu } = await gheApi.getAllByMaPhongChieu(suatChieu.ma_phongchieu)
              const { data: daban } = await gheApi.getAllDaBan(suatChieu.ma_suatchieu)

              setDsGheData({
                dsGhe: data,
                dsHang: hang,
                maxThutu: thutu?.thutu_toida
              })
              setDsGheDaBan(daban)
            } catch (error) {
              console.log(error)
            }
          }
          const getLoaiGhe = async () => {
            try {
              const { data } = await loaigheApi.getAll({});
              setDsLoaiGhe(data);
            } catch (error) {
              console.log(error)
            }
          }
          getLoaiGhe()
          getData()
    }, [suatChieu])
    return (
         <>
            {dsGheData && dsGheData?.dsGhe?.length > 0 && <DanhSachGhe {...dsGheData} dsGheDaBan={dsGheDaBan} dsLoaiGhe={dsLoaiGhe} />}
         </>
    )
}