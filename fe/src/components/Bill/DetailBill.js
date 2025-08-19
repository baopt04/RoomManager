import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Typography, Divider, Select, DatePicker, Button, message } from "antd";
import RoomService from "../../services/RoomService";
import CustomerService from "../../services/CustomerService";
import ContractService from "../../services/ContractService";
import SaleService from "../../services/SaleService";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const { Title } = Typography;

const DetailBill = () => {
    const [form] = Form.useForm();
    const { billId } = useParams();
    const [listContract, setListContract] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const token = localStorage.getItem('token');
    const [totalRoom, setTotalRoom] = useState(0);
    const [totalElectricity, setTotalElectricity] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [totalService, setTotalService] = useState(0);
    const [totalPay, setTotalPay] = useState(0);
    const [listImageRoom, setListImageRoom] = useState([]);
    useEffect(() => {
        const detailContract = async () => {
            try {
                const response = await ContractService.getAllcontract(token);
                setListContract(response)
            } catch (error) {
                message.error("Lỗi không lấy được contract")
            }
        }
        detailContract();
    }, [token])

    useEffect(() => {
        const detailCustomer = async () => {
            try {
                const response = await CustomerService.getAllCustomers(token);
                setListCustomer(response);
            } catch (error) {
                message.error("Lỗi không lấy được customer")
            }
        }
        detailCustomer();

    }, [token])

    useEffect(() => {
        const detailRooom = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setListRoom(response)
            } catch (error) {
                message.error("Lỗi không lấy được room")
            }
        }
        detailRooom();
    }, [token])

   

    useEffect(() => {
        const detailBill = async () => {
            try {
                const response = await SaleService.detailBill(token, billId);
                form.setFieldsValue({
                    totalRoom: formatVND(response.totalRoom),
                    electricityUsage: formatVND(response.electricityUsage),
                    totalPriceElectricity: formatVND(response.totalPriceElectricity),
                    waterUsage: formatVND(response.waterUsage),
                    totalPriceWater: formatVND(response.totalPriceWater),
                    totalRoomService: formatVND(response.totalRoomService),
                    dueDate: dayjs(response.dueDate),
                    description: response.description,
                    customerId: response.customer,
                    roomId: response.room
                })

                setTotalRoom(response.totalRoom);
                setTotalElectricity(response.totalPriceElectricity);
                setTotalWater(response.totalPriceWater);
                setTotalService(response.totalRoomService);
                const totalPay =
                    Number(response.totalRoom) +
                    Number(response.totalPriceElectricity) +
                    Number(response.totalPriceWater) +
                    Number(response.totalRoomService);
                setTotalPay(totalPay);
                if (response.room) {
                    detailImageRoom(response.room);
                }else {
                    message.error("Lỗi không lấy được ảnh")
                }
            } catch (error) {
                message.error("Không lấy được dữ liệu")
            }
        }
         const detailImageRoom = async (id) => {
        try {
            const reponse = await RoomService.detailImage(token, id);
            setListImageRoom(reponse);
            console.log("Check list image" , reponse);
            
        } catch (error) {
            message.error("Lỗi không lấy được ảnh")
        }
    }
        detailBill();
    }, [billId , token , form])
    const formatVND = (value) => {
        if (isNaN(value)) return "0";
        return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    return (
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8 }}>
            <Title level={3} style={{ textAlign: "center" }}>Chi tiết hóa đơn</Title>
            
            <Form
                form={form}
                layout="vertical"
            // onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="roomId" label="Phòng trọ" rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}>
                            <Select placeholder="Chọn phòng trọ" disabled>
                                {listRoom.map(room => (
                                    <Select.Option key={room.id} value={room.id}>
                                        {room.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="totalRoom" label="Tiền phòng trọ">
                            <Input placeholder="Nhập tiền phòng" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="electricityUsage" label="Số điện sử dụng">
                            <Input placeholder="Nhập số điện" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="totalPriceElectricity" label="Tiền điện">
                            <Input placeholder="Nhập tiền điện"disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="waterUsage" label="Số nước sử dụng">
                            <Input placeholder="Nhập số nước"disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="totalPriceWater" label="Tiền nước">
                            <Input placeholder="Nhập tiền nước"disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="totalRoomService" label="Tiền dịch vụ">
                            <Input placeholder="Nhập tiền dịch vụ" disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="customerId" label="Khách hàng thanh toán">
                            <Select placeholder="Chọn khách hàng" disabled>
                                {listCustomer.map(customer => (
                                    <Select.Option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="dueDate" label="Hạn thanh toán">
                            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn hạn thanh toán" disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="description" label="Ghi chú">
                            <Input placeholder="Nhập ghi chú"disabled />
                        </Form.Item>
                    </Col>
               
                   
                </Row>
                <Divider />
                     <h2 style={{textAlign:"center" , marginBottom: "30px"}}>Ảnh phòng trọ</h2>
                       <div style={{ marginBottom: 24 , display :'flex' , justifyContent : 'center'}}>
                {listImageRoom && listImageRoom.length > 0 ? (
                    <Row gutter={16}>
                        {listImageRoom.map((img, idx) => (
                            <Col key={idx}>
                                <img src={img.name || img} alt="room" style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div>Không có ảnh phòng trọ</div>
                )}
            </div> 
                <div>
                    <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
                        Tổng tiền phòng: {formatVND(totalRoom)}  <span style={{ color: "red" }}>VND</span>
                    </div>
                    <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
                        Tổng tiền điện: {formatVND(totalElectricity)} <span style={{ color: "red" }}>VND</span>
                    </div>
                    <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
                        Tổng tiền nước:  {formatVND(totalWater)}  <span style={{ color: "red" }}>VND</span>
                    </div>
                    <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
                        Tổng tiền dịch vụ: {formatVND(totalService)} <span style={{ color: "red" }}>VND</span>
                    </div>
                    <div style={{ textAlign: "right", fontWeight: "bold", fontSize: 18 }}>
                        Tổng tiền cần thanh toán: {formatVND(totalPay)}  <span style={{ color: "red" }}>VND</span>
                    </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">Quay lại </Button>
                </div>
            </Form>
        </div>
    );
};

export default DetailBill;