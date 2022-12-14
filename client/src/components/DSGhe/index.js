import { useEffect, useState, memo } from "react";
import { Button } from "react-bootstrap";
import loaigheApi from  "../../api/loaigheApi"

function DSGhe({ dsGhe, dsHang, maxThutu }) {
  const [items, setItems] = useState()
  const [loaigheData, setLoaiGheData] = useState([])

  useEffect(() => {
    const fetchLoaiGhe = async () => {
      try {
        const res = await loaigheApi.getAll({});
        setLoaiGheData(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchLoaiGhe()
  }, [])

  useEffect(() => {

    const newItems = [];
    for (let i = 0; i < dsHang.length; i++) {
      const t = [];
      for (let k = 0; k <= maxThutu; k++) {

        if (k === 0) {
          t.push(
            <td key={`${dsHang[i]?.hang}-${k}`} style={{ padding: "0 1px" }}>
              <Button className="mb-2" style={{ fontSize: 12, width: "100%", border: "none", backgroundColor: "transparent", padding: 5, color: "black", fontWeight: "bold" }}>
                {dsHang[i].hang}
              </Button>
            </td>
          );
          continue
        }
        const find = dsGhe.find((ghe) => ghe.hang === dsHang[i]?.hang && ghe.thutu === k)
        if (find) {
          t.push(
            <td colSpan={find.socho} key={find.ma_ghe} style={{ padding: "0 1px" }}>
              <Button className="mb-2" style={{ fontSize: 12, width: "100%", backgroundColor: `${find.color}`, border: "none", padding: 5 }}>
                {find.hang}-{find.thutu}
              </Button>
            </td>
          );
          k = k + find?.socho - 1
        } else t.push(<td key={`${dsHang[i]?.hang}-${k}`} style={{ padding: "0 1px" }}>
                  <Button style={{ fontSize: 12, width: "100%", opacity: "0", padding: 5 }}>{dsHang[i].hang}-{k}</Button>
                </td>);
      }
      newItems.push(<tr key={dsHang[i]?.hang}>{t}</tr>);
    }
    setItems(newItems);
  }, [dsGhe, dsHang, maxThutu, loaigheData]);

  return (
    <div>
        <h5 style={{textAlign: "center"}}>Màn hình</h5>
        <hr></hr>
        <table style={{width: "100%"}}>
            <tbody>{items}</tbody>
        </table>
        <div className="d-flex">
          {loaigheData.map((item, index) => {
            return (
              <div key={item.ma_loaighe} className="me-4">
                  <span className="me-2">{item.ten_loaighe}</span>
                  <Button style={{ backgroundColor: `${item.color}`, border: "none" }}></Button>
              </div>
            )
          })}
        </div>
    </div>
  );
}

export default memo(DSGhe);
