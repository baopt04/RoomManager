import React, { useEffect, useState } from "react";
import {
    Tabs, Form, Input, Row, Col, Button, Typography,
    Divider, Select, Modal, DatePicker, message,
    Flex, Card, Spin, Statistic, Space, Badge
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    HomeOutlined,
    UserOutlined,
    DollarCircleOutlined,
    ThunderboltOutlined,
    DashboardOutlined,
    ToolOutlined,
    SaveOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import CustomerService from "../../services/CustomerService";
import SaleService from "../../services/SaleService";
import dayjs from "dayjs";
const { TabPane } = Tabs;
const { Title, Text } = Typography;


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

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [selectRoomId, setSelectRoomId] = useState(null);
    const [selectCustomerId, setSelectCustomerId] = useState(null);
    const [selectBillId, setSelectBillId] = useState(null);
    const [isHistory, setIsHistory] = useState(false);

    const fetchAllBill = async () => {
        try {
            const response = await SaleService.getAllBillNoCreateBill(token)
            setListBill(response);
            if (response && response.length > 0) {
                const firstBillId = response[0].id.toString();
                setSelectBillId(firstBillId);
                form.setFieldsValue({ currentTab: firstBillId });
            }
        } catch (error) {
            message.error("Lỗi khi lấy bill")
        }
    };

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

    useEffect(() => {
        fetchAllBill();
    }, [token, form])

    const searchRoomNoPayMent = async () => {
        if (!selectDate) {
            return message.error("Vui lòng chọn ngày/năm cần tìm !")
        }

        setLoadingSearch(true);
        const mother = selectDate.month() + 1;
        const year = selectDate.year();

        setTimeout(async () => {
            try {
                const response = await RoomService.getRoomNoPayMent(token, mother, year);
                setListRoom(response);
                setModalVisible(false);
                message.success("Tìm phòng trọ thành công!")
            } catch (error) {
                message.error("Không lấy được dữ liệu")
            } finally {
                setLoadingSearch(false);
            }
        }, 1000);
    }

    const getTotalPriceRoom = async (roomid) => {
        try {
            const response = await RoomService.getTotalPriceRoom(token, roomid);
            const currentTab = form.getFieldValue("currentTab") || selectBillId;

            if (!currentTab) {
                message.error("Không xác định được hóa đơn hiện tại");
                return;
            }

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
        if (listBill.length >= 10) {
            message.warning("Không thể tạo quá 10 hóa đơn")
            return;
        }
        try {
            await SaleService.createBill(token, id)
            message.success("Tạo hóa đơn thành công");
            await fetchAllBill();
        } catch (error) {
            message.error("Lỗi khi tạo");
        }
    }

    const formatCurrency = (value) => {
        if (value === null || value === undefined || isNaN(value)) return "0 ₫";
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
                    await SaleService.saveBill(token, selectBillId, billData)
                    message.success("Tạo hóa đơn thành công")
                    await fetchAllBill();
                } catch (error) {
                    message.error("Vui lòng điền đầy đủ thông tin và chọn phòng trọ")
                }
            }
        })
    }

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 0" }}>
            <div style={{
                marginBottom: 32,
                padding: "0 24px",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Tạo hóa đơn thanh toán</Title>
                    <Text type="secondary">Lập hóa đơn và tính tiền phòng cho khách hàng</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={createBill}
                    size="large"
                >
                    Tạo hóa đơn mới
                </Button>
            </div>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
            >
                <Card size="small" style={{ margin: "0 24px 24px 24px", borderRadius: 12 }}>
                    <Flex align="center" gap={16}>
                        <div style={{ flex: 1 }}>
                            <Text strong style={{ display: 'block', marginBottom: 4 }}>Kỳ thanh toán</Text>
                            <DatePicker
                                picker="month"
                                placeholder="Chọn kỳ thanh toán"
                                style={{ width: '100%' }}
                                format="MM/YYYY"
                                onChange={(date) => setSelectDate(date)}
                                size="large"
                            />
                        </div>
                        <div style={{ marginTop: 24 }}>
                            <Button
                                type="primary"
                                icon={loadingSearch ? <Spin size="small" /> : <SearchOutlined />}
                                onClick={searchRoomNoPayMent}
                                size="large"
                                loading={loadingSearch}
                                style={{ minWidth: 140 }}
                            >
                                {loadingSearch ? "Đang tìm..." : "Tìm phòng trống"}
                            </Button>
                        </div>
                    </Flex>
                </Card>

                <Form.Item name="currentTab" hidden>
                    <Input />
                </Form.Item>

                <div style={{ padding: "0 24px" }}>
                    <Tabs
                        defaultActiveKey={listBill[0]?.id?.toString() || "1"}
                        type="card"
                        onChange={key => {
                            form.setFieldsValue({ currentTab: key });
                            setSelectBillId(key)
                        }}
                        style={{ marginBottom: 0 }}
                    >
                        {listBill.map(bill => (
                            <TabPane
                                tab={
                                    <Badge dot={!!form.getFieldValue([bill.id?.toString(), "input1"])} offset={[5, 0]} status="error">
                                        <Text strong>{bill.label || bill.name || `Hóa đơn ${bill.code}`}</Text>
                                    </Badge>
                                }
                                key={bill.id?.toString()}
                            >
                                <Row gutter={24}>
                                    <Col lg={16} md={24}>
                                        <Card title="Chi tiết hóa đơn" variant="outlined" style={{ borderRadius: 12, height: '100%' }}>
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <Form.Item name={[bill.id?.toString(), "input1"]} label={<Space><HomeOutlined />Phòng trọ</Space>}
                                                        rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}>
                                                        <Select
                                                            placeholder="Chọn phòng trọ"
                                                            size="large"
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
                                                    <Form.Item name={[bill.id?.toString(), "input8"]} label={<Space><UserOutlined />Khách hàng</Space>}
                                                        rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}>
                                                        <Select placeholder="Chọn khách hàng" size="large"
                                                            onChange={(value) => setSelectCustomerId(value)}
                                                        >
                                                            {listCustomer.map(customer => (
                                                                <Select.Option key={customer.id} value={customer.id}>
                                                                    {customer.name}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>

                                                <Col span={24}><Divider style={{ margin: '12px 0' }} /></Col>

                                                <Col span={8}>
                                                    <Form.Item name={[bill.id?.toString(), "input2"]} label="Tiền phòng">
                                                        <Input prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />} readOnly />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item name={[bill.id?.toString(), "input3"]} label="Điện tiêu thụ">
                                                        <Input prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />} readOnly />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item name={[bill.id?.toString(), "input4"]} label="Tiền điện">
                                                        <Input prefix={<DollarCircleOutlined style={{ color: '#1890ff' }} />} readOnly />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={8}>
                                                    <Form.Item name={[bill.id?.toString(), "input5"]} label="Nước tiêu thụ">
                                                        <Input prefix={<DashboardOutlined style={{ color: '#1890ff' }} />} readOnly />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item name={[bill.id?.toString(), "input6"]} label="Tiền nước">
                                                        <Input prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />} readOnly />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item name={[bill.id?.toString(), "input7"]} label="Tiền dịch vụ">
                                                        <Input prefix={<ToolOutlined style={{ color: '#722ed1' }} />} readOnly />
                                                    </Form.Item>
                                                </Col>

                                                <Col span={24}><Divider style={{ margin: '12px 0' }} /></Col>

                                                <Col span={12}>
                                                    <Form.Item name={[bill.id?.toString(), "input9"]} label={<Space><CalendarOutlined />Hạn thanh toán</Space>}>
                                                        <DatePicker
                                                            style={{ width: "100%" }}
                                                            format="DD/MM/YYYY"
                                                            placeholder="Chọn ngày hạn"
                                                            size="large"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item name={[bill.id?.toString(), "input10"]} label="Ghi chú">
                                                        <Input placeholder="Nhập ghi chú thêm..." size="large" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>

                                    <Col lg={8} md={24}>
                                        <Card
                                            title="Tổng kết thanh toán"
                                            variant="outlined"
                                            style={{ borderRadius: 12, background: '#fafafa' }}
                                            extra={<DollarCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
                                        >
                                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                                <Statistic
                                                    title="Tiền phòng"
                                                    value={totalRoomPrice || 0}
                                                    suffix="đ"
                                                    valueStyle={{ fontSize: 16 }}
                                                />
                                                <Row gutter={16}>
                                                    <Col span={12}>
                                                        <Statistic title="Tiền điện" value={totalPriceElectric || 0} suffix="đ" valueStyle={{ fontSize: 14 }} />
                                                    </Col>
                                                    <Col span={12}>
                                                        <Statistic title="Tiền nước" value={totalPriceWater || 0} suffix="đ" valueStyle={{ fontSize: 14 }} />
                                                    </Col>
                                                </Row>
                                                <Statistic title="Tiền dịch vụ" value={totalPriceSerivce || 0} suffix="đ" valueStyle={{ fontSize: 16 }} />

                                                <Divider style={{ margin: '8px 0' }} />

                                                <Statistic
                                                    title={<Text strong style={{ fontSize: 16 }}>TỔNG CẦN THANH TOÁN</Text>}
                                                    value={totalPricePayMent || 0}
                                                    suffix="đ"
                                                    valueStyle={{ color: '#f5222d', fontSize: 28, fontWeight: 'bold' }}
                                                />

                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    block
                                                    icon={<SaveOutlined />}
                                                    onClick={saveBill}
                                                    style={{ height: 50, borderRadius: 8, fontSize: 16, fontWeight: 600, marginTop: 12 }}
                                                >
                                                    XÁC NHẬN & LƯU
                                                </Button>
                                            </Space>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                        ))}
                    </Tabs>
                </div>
            </Form>

            <style jsx>{`
                .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
                    border-radius: 8px 8px 0 0 !important;
                    background: #f0f2f5;
                    border: 1px solid #d9d9d9 !important;
                    transition: all 0.3s;
                }
                .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
                    background: #fff !important;
                    border-bottom-color: #fff !important;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
                }
                .ant-tabs-tab-btn {
                    font-weight: 500;
                    color: #595959;
                }
                .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #1890ff !important;
                    font-weight: 700 !important;
                    font-size: 15px;
                }
            `}</style>
        </div>
    );
};

export default SaleBill;
