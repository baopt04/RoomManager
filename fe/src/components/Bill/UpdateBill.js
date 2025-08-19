import React, { useEffect, useState } from "react";
import { Form, Input, Row, Col, Typography, Divider, Select, DatePicker, Button, message, InputNumber, Modal } from "antd";
import RoomService from "../../services/RoomService";
import CustomerService from "../../services/CustomerService";
import ContractService from "../../services/ContractService";
import SaleService from "../../services/SaleService";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

const UpdateBill = () => {
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
    const [roomId, setRoomId] = useState(null);
    const [isStatus , setIsStatus] = useState(null);
    const [isHistory , setIsHistory] = useState(false);
    const navigate = useNavigate();
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

    const updateTotalPriceRoomNew = async () => {
        try {
            const response = await RoomService.getTotalPriceRoom(token, roomId);
            form.setFieldsValue({
                totalRoom: response.roomPrice,
                electricityUsage: response.totalElectricUsage,
                totalPriceElectricity: response.totalElectricPrice,
                waterUsage: response.totalWaterUsage,
                totalPriceWater: response.totalWaterPrice,
                totalRoomService: response.totalServicePrice

            })
            console.log("Check data reponse", response);


            setTotalRoom(response.roomPrice);
            setTotalElectricity(response.totalElectricPrice);
            setTotalWater(response.totalWaterPrice);
            setTotalService(response.totalServicePrice);
            const totalPay =
                Number(response.roomPrice) +
                Number(response.totalElectricPrice) +
                Number(response.totalWaterPrice) +
                Number(response.totalServicePrice);
            setTotalPay(totalPay);
        } catch (error) {
            message.error("Không lấy được dữ liệu tiền!")
        }
    }

    useEffect(() => {
        const detailBill = async () => {
            try {
                const response = await SaleService.detailBill(token, billId);
                form.setFieldsValue({
                    totalRoom: response.totalRoom,
                    electricityUsage: response.electricityUsage,
                    totalPriceElectricity: response.totalPriceElectricity,
                    waterUsage: response.waterUsage,
                    totalPriceWater: response.totalPriceWater,
                    totalRoomService: response.totalRoomService,
                    dueDate: dayjs(response.dueDate),
                    description: response.description, 
                    meThod : response.meThod ,
                    status: response.status,
                    customerId: response.customer,
                    roomId: response.room , 
                    
                })
                setRoomId(response.room);

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
                } else {
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
                console.log("Check list image", reponse);

            } catch (error) {
                message.error("Lỗi không lấy được ảnh")
            }
        }
        detailBill();
    }, [billId, token, form])
    const formatVND = (value) => {
        if (isNaN(value)) return "0";
        return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    const updateBill = async () => {
        Modal.confirm({
            title: "Cập nhật hóa đơn",
            content: "Bạn có chắc muốn cập nhật hóa đơn không",
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                const values = form.getFieldsValue();
                    setIsHistory(true);
                   const totalAmount = 
                (Number(values.totalRoom) || 0) +
                (Number(values.totalRoomService) || 0) +
                (Number(values.totalPriceWater) || 0) +
                (Number(values.totalPriceElectricity) || 0);

                  const baseBillData = {
                totalRoom: Number(values.totalRoom) || 0,
                totalRoomService: Number(values.totalRoomService) || 0,
                totalPriceWater: Number(values.totalPriceWater) || 0,
                totalPriceElectricity: Number(values.totalPriceElectricity) || 0,
                totalAmonut: totalAmount,
                electricityUsage: Number(values.electricityUsage) || 0,
                waterUsage: Number(values.waterUsage) || 0,
                dueDate: values.dueDate?.format("DD/MM/YYYY") || null,
                description: values.description || "",
                roomId: values.roomId,
                customerId: values.customerId,
                isHistory : isHistory,

            };

              const billUpdatePayment = {
                ...baseBillData,
                amountPaid: totalAmount,
                method: values.meThod ,
                status: values.status || "CHUA_THANH_TOAN",
            };
            console.log("check payment", billUpdatePayment) ;
            
                
                 setIsStatus(values.status);
               
                try {
                   if (isStatus === 'CHUA_THANH_TOAN') {

                    console.log("Check bill udpate " , baseBillData);

                    await SaleService.saveBill(token, billId, baseBillData);
                } else {
                    console.log("Check bill udpate payment" , billUpdatePayment);
                    
                    await SaleService.update(token, billId, billUpdatePayment);
                }
                
                message.success("Cập nhật hóa đơn thành công");
                setTimeout(() => {
                    navigate("/bill-management");
                }, 2000);
                
                } catch (error) {
                    message.error("Lỗi khi update hóa đơn")
                }
            }
        })
    }

    return (
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8 }}>
            <Title level={3} style={{ textAlign: "center" }}>Cập nhật hóa đơn</Title>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
                <Button type="primary" style={{ marginBottom: 20, padding: 15 }} onClick={updateTotalPriceRoomNew}>Cập nhật thông tin mới </Button>
            </div>
            <Form
                form={form}
                layout="vertical"
                onFinish={updateBill}
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
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Nhập tiền phòng"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
                                }
                                parser={(value) => value.replace(/\D/g, '')} disabled
                            />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="electricityUsage" label="Số điện sử dụng">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Nhập tiền phòng"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
                                }
                                parser={(value) => value.replace(/\D/g, '')} disabled
                            />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="totalPriceElectricity" label="Tiền điện">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Nhập tiền phòng"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
                                }
                                parser={(value) => value.replace(/\D/g, '')} disabled
                            />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="waterUsage" label="Số nước sử dụng">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Nhập tiền phòng"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
                                }
                                parser={(value) => value.replace(/\D/g, '')} disabled
                            />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="totalPriceWater" label="Tiền nước">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Nhập tiền phòng"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
                                }
                                parser={(value) => value.replace(/\D/g, '')} disabled
                            />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="totalRoomService" label="Tiền dịch vụ">
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Nhập tiền phòng"
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
                                }
                                parser={(value) => value.replace(/\D/g, '')} disabled
                            />

                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="customerId" label="Khách hàng thanh toán">
                            <Select placeholder="Chọn khách hàng" >
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
                            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn hạn thanh toán" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select placeholder="Chọn trạng thái" >
                                <Select.Option value="CHUA_THANH_TOAN">
                                    Chưa thanh toán
                                </Select.Option>
                                <Select.Option value="DA_THANH_TOAN">
                                    Đã thanh toán
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="description" label="Ghi chú">
                            <Input placeholder="Nhập ghi chú" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            shouldUpdate={(prevValues, curValues) => prevValues.status !== curValues.status}
                        >
                            {({ getFieldValue }) =>
                                getFieldValue("status") === "DA_THANH_TOAN" && (
                                    <Form.Item name="meThod" label="Hình thức trả" rules={[{ required: true, message: "Vui lòng chọn hình thức trả" }]}>
                                        <Select placeholder="Chọn hình thức trả">
                                            <Select.Option value="TIEN_MAT">Tiền mặt</Select.Option>
                                            <Select.Option value="CHUYEN_KHOAN">Chuyển khoản</Select.Option>
                                        </Select>
                                    </Form.Item>
                                )
                            }
                        </Form.Item>
                    </Col>

                </Row>
                <Divider />

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
                    <Button type="primary" htmlType="submit">Cập nhật </Button>
                    <Button type="primary" htmlType="submit">Quay lại </Button>
                </div>
            </Form>
        </div>
    );
};

export default UpdateBill;