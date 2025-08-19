import React, { useEffect, useState } from "react";
import { Tabs, Form, Input, Row, Col, Button, Typography, Divider, Select, Modal, DatePicker, message, Flex } from "antd";
import RoomService from "../../services/RoomService";
import CustomerService from "../../services/CustomerService";
import ContractService from "../../services/ContractService";
import SaleService from "../../services/SaleService";
import { li } from "framer-motion/client";
import { list } from "postcss";
import { use } from "framer-motion/m";
import dayjs from "dayjs";
const { TabPane } = Tabs;
const { Title } = Typography;

const SaleBill = () => {
    const [form] = Form.useForm();
    const [total, setTotal] = useState(0);
    const [listRoom, setListRoom] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [listContract, setListContract] = useState([]);
    const [listBill, setListBill] = useState([]);
    const [mondalVisible, setModalVisible] = useState(false);
    const [selectDate, setSelectDate] = useState(null);
    const token = localStorage.getItem("token");
    const [totalRoomPrice, setTotalRoomPrice] = useState(0);
    const [totalPriceElectric, setTotalPriceElectric] = useState(0);
    const [totalPriceWater, setTotalPriceWater] = useState(0);
    const [totalPriceSerivce, setTotalPriceSerivce] = useState(0);
    const [totalPricePayMent, setTotalPricePayMent] = useState(0);
    const [totalPriceElectricUse, setTotalPriceElectricUse] = useState(0);
    const [totalPriceWaterUse, setTotalPriceWaterUse] = useState(0);

    const [selectRoomId, setSelectRoomId] = useState(null);
    const [selectCustomerId, setSelectCustomerId] = useState(null);
    const [selectBillId, setSelectBillId] = useState(null);
    const [isHistory, setIsHistory] = useState(false);

    //   useEffect(() => {
    //     const fetchAllRoom = async () => {
    //         try {
    //             const rooms = await RoomService.getAllRooms(token);
    //             setListRoom(rooms);
    //             console.log("Check data room", rooms);

    //         } catch (error) {
    //             console.error("Failed to fetch rooms:", error);
    //         }
    //     }
    //     fetchAllRoom();
    //   } , [token]);
    useEffect(() => {
        const fetchAllCustomer = async () => {
            try {
                const customers = await CustomerService.getAllCustomers(token);
                setListCustomer(customers);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            }
        }
        fetchAllCustomer();
    }, [token]);



    const handleSelectRoooms = async () => {
        setModalVisible(true);
    }


    useEffect(() => {
        const fetchAllBill = async () => {
            try {
                const response = await SaleService.getAllBillNoCreateBill(token)
                setListBill(response);
                console.log("Check list bill", response);


            } catch (error) {
                message.error("Lỗi khi lấy bil")
            }
        }
        fetchAllBill();

    }, [token])

    const searchRoomNoPayMent = async () => {
        console.log("Check chạy");
        if (!selectDate) {
            message.error("Vui lòng chọn ngày/năm cần tìm !")
        }
        const mother = selectDate.month() + 1;
        const year = selectDate.year();
        console.log("Check mother", mother);
        console.log("Check year", year);
        try {
            const response = await RoomService.getRoomNoPayMent(token, mother, year);
            setListRoom(response);
            console.log("Check list room lấy được", response);
            setModalVisible(false);
            message.success("Tìm phòng trọ thành công!")
        } catch (error) {
            message.error("Không lấy được dữ liệu")
        }



    }
    const getTotalPriceRoom = async (roomid) => {
        try {
            const response = await RoomService.getTotalPriceRoom(token, roomid);
            console.log("Check tổng tiền room", response);
            console.log("Check don gia tien diện ", response.electricUnitPrice);

            const currentTab = form.getFieldValue("currentTab");
            const tabKey = currentTab || (listBill[0]?.id?.toString() || "1");
            form.setFieldsValue({
                [currentTab]: {
                    ...form.getFieldValue(currentTab),
                    input2: formatCurrency(response.roomPrice),
                    input3: formatCurrency(response.totalElectricUsage),
                    input4: formatCurrency(response.totalElectricPrice),
                    input5: formatCurrency(response.totalWaterUsage),
                    input6: formatCurrency(response.totalWaterPrice),
                    input7: formatCurrency(response.totalServicePrice)
                }
            });
            setTotalPriceElectricUse(response.totalElectricUsage)
            setTotalPriceWaterUse(response.totalWaterUsage)
            setTotalRoomPrice(response.roomPrice);
            setTotalPriceElectric(response.totalElectricPrice);
            setTotalPriceWater(response.totalWaterPrice);
            setTotalPriceSerivce(response.totalServicePrice);
            const total =
                Number(response.roomPrice) +
                Number(response.totalElectricPrice) +
                Number(response.totalWaterPrice) +
                Number(response.totalServicePrice);

            setTotalPricePayMent(total);
        } catch (error) {
            message.error("Lỗi khi lấy tổng tiền room")
        }
    }

    const createBill = async () => {
        let id = '2b3ebae0-ea7d-40c7-b39e-9d15fd1d0159'
        if (!id) { return message.error("No id create bill ") }
        if (listBill.length >= 10) {
            message.warning("Không thể tạo quá 10 hóa đơn")
            return;

        }
        try {
            await SaleService.createBill(token, id)
            message.success("Tạo hóa đơn thành công");
            window.location.reload();

        } catch (error) {
            message.error("Lỗi khi tạo");
        }
    }
    const formatCurrency = (value) => {
        if (isNaN(value)) return "0";
        return Number(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    const handleValuesChange = (_, allValues) => {
        const currentTab = form.getFieldValue("currentTab") || "1";
        const inputs = allValues?.[currentTab] || {};
        const sum = Object.values(inputs)
            .map(Number)
            .filter(v => !isNaN(v))
            .reduce((acc, cur) => acc + cur, 0);
        setTotal(sum);
    };

    const saveBill = async () => {
        const currentTab = form.getFieldValue('currentTab');
        const values = form.getFieldsValue();
        const dueDate = values?.[currentTab]?.input9;
        let forMatDueDate = null;
        const note = values?.[currentTab]?.input10;
        if (dueDate) {
            forMatDueDate = dayjs(dueDate).format("DD/MM/YYYY");
            console.log("Ngày format: ", forMatDueDate);
        } else {
            console.log("Chưa chọn ngày!");
        }
        Modal.confirm({
            title: "Xác nhận lưu hóa đơn",
            content: "Bạn có chắc chắn muốn lưu hóa đơn không ?",
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                const billData = {
                    totalRoom: totalRoomPrice,
                    totalRoomService: totalPriceSerivce,
                    totalPriceWater: totalPriceWater,
                    totalPriceElectricity: totalPriceElectric,
                    totalAmonut: totalPricePayMent,
                    electricityUsage: totalPriceElectricUse,
                    waterUsage: totalPriceWaterUse,
                    dueDate: forMatDueDate,
                    description: note,
                    roomId: selectRoomId,
                    customerId: selectCustomerId,
                    isHistory: isHistory
                }
                try {
                    const response = await SaleService.saveBill(token, selectBillId, billData)
                    message.success("Tạo hóa đơn thành công")
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } catch (error) {
                    message.error("Lỗi khi gửi data")
                }
            }
        })

    }
    return (
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8 }}>
            <Title level={3} style={{ textAlign: "center" }}>Tạo hóa đơn thanh toán</Title>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                initialValues={{ currentTab: "1" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <Button type="primary" onClick={createBill}>Tạo hóa đơn</Button>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <span>Chọn tháng/năm :</span>
                        <DatePicker
                            picker="month"
                            placeholder="Chọn tháng"
                            style={{ marginLeft: 8, width: 200 }}
                            onChange={(date) => setSelectDate(date)}
                        ></DatePicker>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={searchRoomNoPayMent}>
                            Tìm Phòng
                        </Button>

                    </div>

                </div>
                <Form.Item name="currentTab" hidden>
                    <Input />
                </Form.Item>
                <Tabs
                    defaultActiveKey={listBill[0]?.id?.toString() || "1"}
                    onChange={key => {
                        form.setFieldsValue({ currentTab: key });
                        setSelectBillId(key)
                        console.log("Đã chuyển sang tab có key:", key);
                    }}
                >

                    {listBill.map(bill => (
                        <TabPane
                            tab={bill.label || bill.name || `Hóa đơn ${bill.code}`}
                            key={bill.id?.toString()}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input1"]} label="Phòng trọ"
                                        rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}>
                                        <Select
                                            placeholder="Chọn phòng trọ"
                                            style={{ width: "100%" }}
                                            onChange={(value) => {
                                                setSelectRoomId(value);
                                                getTotalPriceRoom(value);
                                            }}
                                        >
                                            {listRoom.map(room => (
                                                <Select.Option key={room.id} value={room.id}>
                                                    {room.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input2"]} label="Tiền phòng trọ">
                                        <Input placeholder="Nhập giá trị" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input3"]} label="Số điện sử dụng">
                                        <Input placeholder="Nhập giá trị" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input4"]} label="Thành tiền">
                                        <Input placeholder="Nhập giá trị" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input5"]} label="Số nước sử dụng">
                                        <Input placeholder="Nhập giá trị" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input6"]} label="Thành tiền">
                                        <Input placeholder="Nhập giá trị" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input7"]} label="Tiền dịch vụ">
                                        <Input placeholder="Nhập giá trị" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input8"]} label="Khách hàng thanh toán"
                                        rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}>
                                        <Select placeholder="Chọn khách hàng" style={{ width: "100%" }}
                                            onChange={(value) => {
                                                setSelectCustomerId(value)
                                                console.log("CHeck id customer", value);

                                            }}
                                        >
                                            {listCustomer.map(customer => (
                                                <Select.Option key={customer.id} value={customer.id}>
                                                    {customer.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input9"]} label="Hạn thanh toán">
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            format="DD/MM/YYYY"
                                            placeholder="Chọn hạn thanh toán tiền nhà"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name={[bill.id?.toString(), "input10"]} label="Ghi chú">
                                        <Input placeholder="Nhập ghi chú" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
                                Tổng tiền phòng: {formatCurrency(totalRoomPrice)} <span style={{ color: "red" }}>VND</span>
                            </div>
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
                                Tổng tiền điện: {formatCurrency(totalPriceElectric)} <span style={{ color: "red" }}>VND</span>
                            </div>
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
                                Tổng tiền nước: {formatCurrency(totalPriceWater)} <span style={{ color: "red" }}>VND</span>
                            </div>
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
                                Tổng tiền dịch vụ: {formatCurrency(totalPriceSerivce)} <span style={{ color: "red" }}>VND</span>
                            </div>
                            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
                                Tổng tiền cần thanh toán: {formatCurrency(totalPricePayMent)} <span style={{ color: "red" }}>VND</span>
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
                <div style={{ textAlign: "center", marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" onClick={saveBill}>Lưu hóa đơn</Button>
                </div>
            </Form>


        </div>
    );
};

export default SaleBill;