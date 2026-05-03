import React, { useEffect, useState } from "react";
import {
    Descriptions,
    Card,
    Row,
    Col,
    Typography,
    Divider,
    Button,
    message,
    Tag,
    Space,
    Flex,
    Empty
} from "antd";
import RoomService from "../../services/RoomService";
import CustomerService from "../../services/CustomerService";
import ContractService from "../../services/ContractService";
import SaleService from "../../services/SaleService";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeftOutlined,
    HomeOutlined,
    UserOutlined,
    CalendarOutlined,
    FileTextOutlined,
    DollarCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DetailBill = () => {
    const { billId } = useParams();
    const navigate = useNavigate();
    const [billData, setBillData] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [listImageRoom, setListImageRoom] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await SaleService.detailBill(token, billId);
                setBillData(response);

                // Fetch related names
                const [customers, rooms] = await Promise.all([
                    CustomerService.getAllCustomers(token),
                    RoomService.getAllRooms(token)
                ]);

                const customer = customers.find(c => c.id === response.customer);
                const room = rooms.find(r => r.id === response.room);

                setCustomerName(customer?.name || "N/A");
                setRoomName(room?.name || "N/A");

                if (response.room) {
                    const images = await RoomService.detailImage(token, response.room);
                    setListImageRoom(images);
                }
            } catch (error) {
                message.error("Không lấy được dữ liệu hóa đơn");
            }
        };
        fetchDetails();
    }, [billId, token]);

    const formatVND = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
    };

    if (!billData) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>;

    const totalPay = (billData.totalRoom || 0) +
        (billData.totalPriceElectricity || 0) +
        (billData.totalPriceWater || 0) +
        (billData.totalRoomService || 0);

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: '24px' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
                <Space direction="vertical" size={0}>
                    <Space style={{ marginBottom: 8 }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            type="text"
                        >
                            Quay lại
                        </Button>
                        <Tag color="blue" style={{ borderRadius: 4 }}>Hóa đơn</Tag>
                    </Space>
                    <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                        Chi tiết hóa đơn {billData.code}
                    </Title>
                </Space>
                <Tag
                    color={billData.status !== "CHUA_THANH_TOAN" ? "green" : "red"}
                    style={{ padding: '4px 16px', borderRadius: 20, fontSize: 14 }}
                >
                    {billData.status !== "CHUA_THANH_TOAN" ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
            </Flex>

            <Row gutter={24}>
                <Col lg={16} md={24}>
                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: 24 }}>
                        <Descriptions title="Thông tin cơ bản" column={2} bordered size="middle">
                            <Descriptions.Item label={<Space><HomeOutlined /> Phòng trọ</Space>} span={2}>
                                <Text strong>{roomName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><UserOutlined /> Khách hàng</Space>} span={2}>
                                {customerName}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><CalendarOutlined /> Hạn thanh toán</Space>}>
                                {dayjs(billData.dueDate).format("DD/MM/YYYY")}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><FileTextOutlined /> Ghi chú</Space>}>
                                {billData.description || "—"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider style={{ margin: '24px 0' }} />

                        <Descriptions title="Chi tiết sử dụng" column={2} bordered size="middle">
                            <Descriptions.Item label="Số điện sử dụng">
                                {billData.electricityUsage} kWh
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiền điện">
                                {formatVND(billData.totalPriceElectricity)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số nước sử dụng">
                                {billData.waterUsage} m³
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiền nước">
                                {formatVND(billData.totalPriceWater)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiền phòng">
                                {formatVND(billData.totalRoom)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiền dịch vụ">
                                {formatVND(billData.totalRoomService)}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card bordered={false} title="Ảnh phòng trọ" style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        {listImageRoom && listImageRoom.length > 0 ? (
                            <Row gutter={[12, 12]}>
                                {listImageRoom.map((img, idx) => (
                                    <Col key={idx} xs={12} sm={8} md={6}>
                                        <img
                                            src={img.name || img}
                                            alt="room"
                                            style={{ width: '100%', height: 120, objectFit: "cover", borderRadius: 8, cursor: 'pointer' }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="Không có ảnh" />
                        )}
                    </Card>
                </Col>

                <Col lg={8} md={24}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            background: '#fafafa',
                            position: 'sticky',
                            top: 24
                        }}
                    >
                        <Title level={4} style={{ marginBottom: 24 }}>Tổng thanh toán</Title>

                        <Flex justify="space-between" style={{ marginBottom: 12 }}>
                            <Text type="secondary">Tiền phòng</Text>
                            <Text strong>{formatVND(billData.totalRoom)}</Text>
                        </Flex>
                        <Flex justify="space-between" style={{ marginBottom: 12 }}>
                            <Text type="secondary">Tiền điện</Text>
                            <Text strong>{formatVND(billData.totalPriceElectricity)}</Text>
                        </Flex>
                        <Flex justify="space-between" style={{ marginBottom: 12 }}>
                            <Text type="secondary">Tiền nước</Text>
                            <Text strong>{formatVND(billData.totalPriceWater)}</Text>
                        </Flex>
                        <Flex justify="space-between" style={{ marginBottom: 12 }}>
                            <Text type="secondary">Tiền dịch vụ</Text>
                            <Text strong>{formatVND(billData.totalRoomService)}</Text>
                        </Flex>

                        <Divider style={{ margin: '16px 0' }} />

                        <Flex justify="space-between" align="center">
                            <Text strong style={{ fontSize: 16 }}>Tổng cộng</Text>
                            <Title level={3} style={{ margin: 0, color: '#f5222d', fontWeight: 700 }}>
                                {formatVND(totalPay)}
                            </Title>
                        </Flex>

                        <Button
                            type="primary"
                            block
                            size="large"
                            style={{ marginTop: 24, borderRadius: 8, height: 48 }}
                            onClick={() => navigate(`/bill-management/update/${billId}`)}
                        >
                            Chỉnh sửa hóa đơn
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DetailBill;
