import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Row,
    Col,
    Typography,
    Divider,
    Select,
    DatePicker,
    Button,
    message,
    InputNumber,
    Modal,
    Card,
    Flex,
    Space,
    Tag,
    Alert
} from "antd";
import RoomService from "../../services/RoomService";
import CustomerService from "../../services/CustomerService";
import SaleService from "../../services/SaleService";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeftOutlined,
    SaveOutlined,
    ReloadOutlined,
    HomeOutlined,
    UserOutlined,
    ThunderboltOutlined,
    DashboardOutlined,
    ToolOutlined,
    DollarCircleOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const UpdateBill = () => {
    const [form] = Form.useForm();
    const { billId } = useParams();
    const navigate = useNavigate();

    const [listCustomer, setListCustomer] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [listImageRoom, setListImageRoom] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const token = localStorage.getItem('token');

    // Stats for summary
    const [totalRoom, setTotalRoom] = useState(0);
    const [totalElectricity, setTotalElectricity] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [totalService, setTotalService] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customers, rooms] = await Promise.all([
                    CustomerService.getAllCustomers(token),
                    RoomService.getAllRooms(token)
                ]);
                setListCustomer(customers);
                setListRoom(rooms);
            } catch (error) {
                message.error("Lỗi khi tải danh sách danh mục");
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchBillDetail = async () => {
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
                    meThod: response.meThod,
                    status: response.status,
                    customerId: response.customer,
                    roomId: response.room,
                });

                setRoomId(response.room);
                setTotalRoom(response.totalRoom);
                setTotalElectricity(response.totalPriceElectricity);
                setTotalWater(response.totalPriceWater);
                setTotalService(response.totalRoomService);

                if (response.room) {
                    const images = await RoomService.detailImage(token, response.room);
                    setListImageRoom(images);
                }
            } catch (error) {
                message.error("Không lấy được dữ liệu hóa đơn");
            }
        };
        fetchBillDetail();
    }, [billId, token, form]);

    const updateTotalPriceRoomNew = async () => {
        if (!roomId) return;
        try {
            const response = await RoomService.getTotalPriceRoom(token, roomId);
            form.setFieldsValue({
                totalRoom: response.roomPrice,
                electricityUsage: response.totalElectricUsage,
                totalPriceElectricity: response.totalElectricPrice,
                waterUsage: response.totalWaterUsage,
                totalPriceWater: response.totalWaterPrice,
                totalRoomService: response.totalServicePrice
            });

            setTotalRoom(response.roomPrice);
            setTotalElectricity(response.totalElectricPrice);
            setTotalWater(response.totalWaterPrice);
            setTotalService(response.totalServicePrice);
            message.success("Đã cập nhật chỉ số mới nhất");
        } catch (error) {
            message.error("Không lấy được dữ liệu tiền mới");
        }
    };

    const handleValuesChange = (_, allValues) => {
        setTotalRoom(Number(allValues.totalRoom) || 0);
        setTotalElectricity(Number(allValues.totalPriceElectricity) || 0);
        setTotalWater(Number(allValues.totalPriceWater) || 0);
        setTotalService(Number(allValues.totalRoomService) || 0);
    };

    const onFinish = async (values) => {
        Modal.confirm({
            title: "Cập nhật hóa đơn",
            content: "Bạn có chắc chắn muốn lưu các thay đổi này?",
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                const totalAmount = totalRoom + totalElectricity + totalWater + totalService;

                const billUpdateData = {
                    totalRoom,
                    totalRoomService: totalService,
                    totalPriceWater: totalWater,
                    totalPriceElectricity: totalElectricity,
                    totalAmonut: totalAmount,
                    electricityUsage: Number(values.electricityUsage) || 0,
                    waterUsage: Number(values.waterUsage) || 0,
                    dueDate: values.dueDate?.format("DD/MM/YYYY") || null,
                    description: values.description || "",
                    roomId: values.roomId,
                    customerId: values.customerId,
                    status: values.status,
                    method: values.status === "DA_THANH_TOAN" ? values.meThod : null,
                    amountPaid: values.status === "DA_THANH_TOAN" ? totalAmount : 0,
                    isHistory: true
                };

                try {
                    if (values.status === 'CHUA_THANH_TOAN') {
                        await SaleService.saveBill(token, billId, billUpdateData);
                    } else {
                        await SaleService.update(token, billId, billUpdateData);
                    }
                    message.success("Cập nhật hóa đơn thành công");
                    setTimeout(() => navigate("/admin/bills"), 1500);
                } catch (error) {
                    message.error("Lỗi khi cập nhật hóa đơn");
                }
            }
        });
    };

    const formatVND = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
    };

    const totalPay = totalRoom + totalElectricity + totalWater + totalService;

    return (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: '24px' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 32 }}>
                <Space direction="vertical" size={0}>
                    <Space style={{ marginBottom: 8 }}>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} type="text">Quay lại</Button>
                        <Tag color="orange" style={{ borderRadius: 4 }}>Chỉnh sửa</Tag>
                    </Space>
                    <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Cập nhật hóa đơn</Title>
                </Space>
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={updateTotalPriceRoomNew}
                        style={{ borderRadius: 8 }}
                    >
                        Lấy chỉ số mới nhất
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        size="large"
                        style={{ borderRadius: 8, padding: '0 24px' }}
                    >
                        Lưu thay đổi
                    </Button>
                </Space>
            </Flex>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
            >
                <Row gutter={24}>
                    <Col lg={16} md={24}>
                        <Card bordered={false} title="Thông tin hóa đơn" style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="roomId" label={<Space><HomeOutlined /> Phòng trọ</Space>}>
                                        <Select placeholder="Chọn phòng trọ" disabled>
                                            {listRoom.map(r => (
                                                <Select.Option key={r.id} value={r.id}>
                                                    {r.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="customerId" label={<Space><UserOutlined /> Khách hàng</Space>}>
                                        <Select placeholder="Chọn khách hàng">
                                            {listCustomer.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="electricityUsage" label="Số điện sử dụng">
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="totalPriceElectricity" label="Tiền điện">
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            prefix={<DollarCircleOutlined style={{ color: '#1890ff' }} />}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={value => value.replace(/\./g, '')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="totalRoom" label="Tiền phòng">
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={value => value.replace(/\./g, '')}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item name="waterUsage" label="Số nước sử dụng">
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            prefix={<DashboardOutlined style={{ color: '#1890ff' }} />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="totalPriceWater" label="Tiền nước">
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            prefix={<DollarCircleOutlined style={{ color: '#1890ff' }} />}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={value => value.replace(/\./g, '')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="totalRoomService" label="Tiền dịch vụ">
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={value => value.replace(/\./g, '')}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item name="dueDate" label={<Space><CalendarOutlined /> Hạn thanh toán</Space>}>
                                        <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="description" label="Ghi chú">
                                        <Input placeholder="Nhập ghi chú thêm..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card bordered={false} title="Trạng thái thanh toán" style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="status" label="Trạng thái">
                                        <Select>
                                            <Select.Option value="CHUA_THANH_TOAN">Chưa thanh toán</Select.Option>
                                            <Select.Option value="DA_THANH_TOAN">Đã thanh toán</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        shouldUpdate={(prev, cur) => prev.status !== cur.status}
                                    >
                                        {({ getFieldValue }) =>
                                            getFieldValue("status") === "DA_THANH_TOAN" && (
                                                <Form.Item name="meThod" label="Hình thức thanh toán" rules={[{ required: true }]}>
                                                    <Select placeholder="Chọn hình thức">
                                                        <Select.Option value="TIEN_MAT">Tiền mặt</Select.Option>
                                                        <Select.Option value="CHUYEN_KHOAN">Chuyển khoản</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col lg={8} md={24}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                position: 'sticky',
                                top: 24
                            }}
                        >
                            <Title level={4} style={{ marginBottom: 24 }}>Tóm tắt hóa đơn</Title>

                            <Flex justify="space-between" style={{ marginBottom: 12 }}>
                                <Text type="secondary">Tiền phòng</Text>
                                <Text strong>{formatVND(totalRoom)}</Text>
                            </Flex>
                            <Flex justify="space-between" style={{ marginBottom: 12 }}>
                                <Text type="secondary">Tiền điện</Text>
                                <Text strong>{formatVND(totalElectricity)}</Text>
                            </Flex>
                            <Flex justify="space-between" style={{ marginBottom: 12 }}>
                                <Text type="secondary">Tiền nước</Text>
                                <Text strong>{formatVND(totalWater)}</Text>
                            </Flex>
                            <Flex justify="space-between" style={{ marginBottom: 12 }}>
                                <Text type="secondary">Tiền dịch vụ</Text>
                                <Text strong>{formatVND(totalService)}</Text>
                            </Flex>

                            <Divider style={{ margin: '16px 0' }} />

                            <Flex justify="space-between" align="center">
                                <Text strong style={{ fontSize: 16 }}>Tổng thanh toán</Text>
                                <Title level={3} style={{ margin: 0, color: '#f5222d', fontWeight: 700 }}>
                                    {formatVND(totalPay)}
                                </Title>
                            </Flex>

                            <Alert
                                message="Thông tin thanh toán sẽ được cập nhật ngay sau khi bạn nhấn Lưu."
                                type="info"
                                showIcon
                                style={{ marginTop: 24, borderRadius: 8 }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default UpdateBill;

