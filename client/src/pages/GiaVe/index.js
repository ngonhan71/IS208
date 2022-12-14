import { Container, Table } from "react-bootstrap";

export default function GiaVe() {
    return (
        <Container>
            <Table striped bordered style={{ textAlign: "center", fontWeight: "bold", marginBottom: 150 }}>
                <thead>
                    <tr>
                        <th colSpan={2}>CINEMA</th>
                        <th>2D</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td rowSpan={2}>Thứ 2, 4, 5</td>
                            <td>Từ 08:00 đến trước 17:00</td>
                            <td>55.000 VNĐ</td>
                        </tr>
                        <tr>
                            <td>Sau 17:00</td>
                            <td>60.000 VNĐ</td>
                        </tr>

                        <tr style={{backgroundColor: "orange", color: "white"}}>
                            <td>Thứ 3</td>
                            <td>CINEMA DAY</td>
                            <td>50.000 VNĐ</td>
                        </tr>
                      
                        <tr>
                            <td rowSpan={2}>Thứ 6, 7, Chủ nhật</td>
                            <td>Từ 08:00 đến trước 17:00</td>
                            <td>70.000 VNĐ</td>
                        </tr>
                        <tr>
                            <td>Sau 17:00</td>
                            <td>80.000 VNĐ</td>
                        </tr>

                        <tr style={{backgroundColor: "#024da4", color: "white"}}>
                            <td rowSpan={2}>Ngày lễ</td>
                            <td></td>
                            <td>85.000 VNĐ</td>
                        </tr>
                </tbody>
            </Table>
        </Container>
    )
}