import React, { useEffect, useState } from "react";
import {
    Table,
    Input,
    Button,
    Space,
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Tooltip,
    Select,
    Statistic,
    message,
    Flex,
    Divider
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    EyeOutlined,
    ReloadOutlined,
    FileTextOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import SaleService from "../../services/SaleService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const GetAllBill = () => {
    const [listBill, setListBill] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData();
    }, [token]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const billResponse = await SaleService.getAllBill(token);
            setListBill(billResponse);
            setFilteredBills(billResponse);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        let filtered = [...listBill];
        if (keyword.trim()) {
            filtered = filtered.filter((bill) => {
                return (
                    bill.code?.toLowerCase().includes(keyword.toLowerCase()) ||
                    (bill.room || "").toString().toLowerCase().includes(keyword.toLowerCase()) ||
                    (bill.customer || "").toString().toLowerCase().includes(keyword.toLowerCase())
                );
            });
        }
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(bill => bill.status === statusFilter);
        }
        setFilteredBills(filtered);
    };

    const resetFilters = () => {
        setKeyword("");
        setStatusFilter("ALL");
        fetchAllData();
    };

    const createBill = () => navigate("/admin/bills/create");
    const detailBill = (record) => navigate(`/admin/bills/${record.id}`);
    const updateBill = (record) => navigate(`/admin/bills/${record.id}/edit`);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    const totalBills = filteredBills.length;
    const paidBills = filteredBills.filter(bill => bill.status !== "CHUA_THANH_TOAN").length;
    const unpaidBills = totalBills - paidBills;
    const totalRevenue = filteredBills
        .filter(bill => bill.status !== "CHUA_THANH_TOAN")
        .reduce((sum, bill) => sum + (bill.totalRoom || 0) + (bill.totalPriceElectricity || 0) + (bill.totalPriceWater || 0) + (bill.totalRoomService || 0), 0);

    const columns = [
        {
            title: "STT",
            width: 60,
            align: 'center',
            render: (_, __, index) => <Text type="secondary">{index + 1}</Text>,
        },
        {
            title: "Mã hóa đơn",
            dataIndex: "code",
            key: "code",
            width: 130,
            render: (code) => <Text strong style={{ color: '#1890ff' }}>{code}</Text>,
        },
        {
            title: "Phòng trọ",
            dataIndex: "room",
            key: "room",
            width: 150,
            render: (room) => <Text strong>{room || '—'}</Text>
        },
        {
            title: "Khách hàng",
            dataIndex: 'customer',
            key: "customer",
            width: 180,
            render: (customer) => <Text>{customer || '—'}</Text>
        },
        {
            title: "Tổng tiền",
            key: "total",
            width: 140,
            align: 'right',
            render: (_, record) => {
                const total = (record.totalRoom || 0) +
                    (record.totalPriceElectricity || 0) +
                    (record.totalPriceWater || 0) +
                    (record.totalRoomService || 0);
                return <Text strong style={{ color: '#f5222d' }}>{formatCurrency(total)}</Text>;
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 140,
            align: 'center',
            render: (status) => {
                const isPaid = status !== "CHUA_THANH_TOAN";
                return (
                    <Tag
                        color={isPaid ? "success" : "error"}
                        icon={isPaid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        style={{ borderRadius: 12, padding: '0 12px' }}
                    >
                        {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Tag>
                );
            }
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Space size={0}>
                    <Tooltip title="Chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => detailBill(record)}
                            style={{ color: '#1890ff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => updateBill(record)}
                            style={{ color: '#faad14' }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <Flex justify="space-between" align="center">
                    <div>
                        <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Quản lý hóa đơn</Title>
                        <Text type="secondary">Theo dõi và quản lý các hóa đơn thuê phòng</Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={createBill}
                        size="large"
                        style={{ borderRadius: 8 }}
                    >
                        Tạo hóa đơn mới
                    </Button>
                </Flex>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Statistic
                            title="Tổng số hóa đơn"
                            value={totalBills}
                            prefix={<FileTextOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Statistic
                            title="Đã thanh toán"
                            value={paidBills}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Statistic
                            title="Chưa thanh toán"
                            value={unpaidBills}
                            valueStyle={{ color: '#ff4d4f' }}
                            prefix={<CloseCircleOutlined style={{ marginRight: 8 }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Statistic
                            title="Doanh thu thực tế"
                            value={totalRevenue}
                            valueStyle={{ color: '#722ed1' }}
                            prefix={<DollarOutlined style={{ marginRight: 8 }} />}
                            formatter={(value) => formatCurrency(value)}
                        />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} bodyStyle={{ padding: '16px' }}>
                <Flex gap={16} wrap="wrap">
                    <Input
                        placeholder="Mã hóa đơn, phòng, khách hàng..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleFilter}
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        style={{ width: 300, borderRadius: 6 }}
                        allowClear
                    />
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 180 }}
                    >
                        <Option value="ALL">Tất cả trạng thái</Option>
                        <Option value="CHUA_THANH_TOAN">Chưa thanh toán</Option>
                        <Option value="DA_THANH_TOAN">Đã thanh toán</Option>
                    </Select>
                    <Button type="primary" onClick={handleFilter} style={{ borderRadius: 6 }}>Tìm kiếm</Button>
                    <Button onClick={resetFilters} icon={<ReloadOutlined />} style={{ borderRadius: 6 }}>Đặt lại</Button>
                </Flex>
            </Card>

            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={filteredBills}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng cộng ${total} hóa đơn`,
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                />
            </Card>

            <style jsx>{`
                .stat-card .ant-statistic-title {
                    font-size: 13px;
                    color: #8c8c8c;
                    margin-bottom: 8px;
                }
                .stat-card .ant-statistic-content {
                    font-weight: 600;
                }
                .ant-table-thead > tr > th {
                    background: #fafafa !important;
                    font-weight: 600 !important;
                }
            `}</style>
        </div>
    );
};

export default GetAllBill;

