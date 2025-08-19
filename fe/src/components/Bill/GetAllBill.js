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
    DatePicker,
    Statistic,
    message,
    Badge
} from "antd";
import { 
    SearchOutlined, 
    PlusOutlined, 
    EditOutlined, 
    EyeFilled,
    ReloadOutlined,
    FileTextOutlined,
    HomeOutlined,
    UserOutlined,
    DollarOutlined,
    CalendarOutlined,
    ThunderboltOutlined,
    DropboxOutlined,
    ToolOutlined
} from "@ant-design/icons";
import CustomerService from "../../services/CustomerService";
import RoomService from "../../services/RoomService";
import SaleService from "../../services/SaleService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const GetAllBill = () => {
    const [dataCustomer, setDataCustomer] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [listBill, setListBill] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch all data
    useEffect(() => {
        fetchAllData();
    }, [token]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [customerResponse, roomResponse, billResponse] = await Promise.all([
                CustomerService.getAllCustomers(token),
                RoomService.getAllRooms(token),
                SaleService.getAllBill(token)
            ]);
            
            setDataCustomer(customerResponse);
            setListRoom(roomResponse);
            setListBill(billResponse);
            setFilteredBills(billResponse);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu!");
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and search function
    const handleFilter = () => {
        let filtered = [...listBill];

        // Filter by keyword
        if (keyword.trim()) {
            filtered = filtered.filter((bill) => {
                const roomName = listRoom.find(room => room.id === bill.room)?.name || '';
                const customerName = dataCustomer.find(customer => customer.id === bill.customer)?.name || '';
                
                return (
                    bill.code?.toLowerCase().includes(keyword.toLowerCase()) ||
                    roomName.toLowerCase().includes(keyword.toLowerCase()) ||
                    customerName.toLowerCase().includes(keyword.toLowerCase())
                );
            });
        }

        // Filter by status
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(bill => bill.status === statusFilter);
        }

        setFilteredBills(filtered);
    };

    // Reset filters
    const resetFilters = () => {
        setKeyword("");
        setStatusFilter("ALL");
        setFilteredBills(listBill);
    };

    // Navigation functions
    const createBill = () => {
        navigate("/sale-counter");
    };

    const detailBill = (record) => {
        navigate(`/bill-management/detail/${record.id}`);
    };

    const updateBill = (record) => {
        navigate(`/bill-management/update/${record.id}`);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const isPaid = status !== "CHUA_THANH_TOAN";
        return (
            <Badge 
                status={isPaid ? "success" : "error"} 
                text={
                    <Tag color={isPaid ? "green" : "red"}>
                        {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Tag>
                }
            />
        );
    };

    // Calculate statistics
    const totalBills = filteredBills.length;
    const paidBills = filteredBills.filter(bill => bill.status !== "CHUA_THANH_TOAN").length;
    const unpaidBills = totalBills - paidBills;
    const totalRevenue = filteredBills
        .filter(bill => bill.status !== "CHUA_THANH_TOAN")
        .reduce((sum, bill) => sum + (bill.totalRoom || 0) + (bill.totalPriceElectricity || 0) + (bill.totalPriceWater || 0) + (bill.totalRoomService || 0), 0);

    // Table columns
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: (
                <Space>
                    <FileTextOutlined />
                    Mã hóa đơn
                </Space>
            ),
            dataIndex: "code",
            key: "code",
            width: 120,
            render: (code) => <Text strong>{code}</Text>,
        },
        {
            title: (
                <Space>
                    <HomeOutlined />
                    Phòng trọ
                </Space>
            ),
            dataIndex: "room",
            key: "room",
            width: 120,
            render: (room) => {
                const roomName = listRoom.find((roomItem) => roomItem.id === room)?.name;
                return (
                    <Tooltip title={roomName}>
                        <Text>{roomName || 'Chưa có dữ liệu'}</Text>
                    </Tooltip>
                );
            }
        },
        {
            title: (
                <Space>
                    <UserOutlined />
                    Khách hàng
                </Space>
            ),
            dataIndex: 'customer',
            key: "customer",
            width: 150,
            render: (customer) => {
                const customerName = dataCustomer.find((customerItem) => customerItem.id === customer)?.name;
                return (
                    <Tooltip title={customerName}>
                        <Text>{customerName || "Không có dữ liệu"}</Text>
                    </Tooltip>
                );
            }
        },
        {
            title: (
                <Space>
                    <HomeOutlined />
                    Tiền phòng
                </Space>
            ),
            dataIndex: "totalRoom",
            key: "totalRoom",
            width: 120,
            align: 'right',
            render: (totalRoom) => (
                <Text strong style={{ color: '#1890ff' }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: "currency",
                        currency: 'VND'
                    }).format(totalRoom || 0)}
                </Text>
            )
        },
        {
            title: (
                <Space>
                    <ThunderboltOutlined />
                    Tiền điện
                </Space>
            ),
            dataIndex: "totalPriceElectricity",
            key: "totalPriceElectricity",
            width: 120,
            align: 'right',
            render: (totalPriceElectricity) => (
                <Text style={{ color: '#faad14' }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: "currency",
                        currency: "VND"
                    }).format(totalPriceElectricity || 0)}
                </Text>
            )
        },
        {
            title: (
                <Space>
                    <DropboxOutlined />
                    Tiền nước
                </Space>
            ),
            dataIndex: "totalPriceWater",
            key: "totalPriceWater",
            width: 120,
            align: 'right',
            render: (totalPriceWater) => (
                <Text style={{ color: '#52c41a' }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: "currency",
                        currency: 'VND'
                    }).format(totalPriceWater || 0)}
                </Text>
            )
        },
        {
            title: (
                <Space>
                    <ToolOutlined />
                    Tiền dịch vụ
                </Space>
            ),
            dataIndex: "totalRoomService",
            key: "totalRoomService",
            width: 120,
            align: 'right',
            render: (totalRoomService) => (
                <Text style={{ color: '#f5222d' }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: "currency",
                        currency: "VND"
                    }).format(totalRoomService || 0)}
                </Text>
            )
        },
        {
            title: "Tổng tiền",
            key: "total",
            width: 130,
            align: 'right',
            render: (_, record) => {
                const total = (record.totalRoom || 0) + 
                            (record.totalPriceElectricity || 0) + 
                            (record.totalPriceWater || 0) + 
                            (record.totalRoomService || 0);
                return (
                    <Text strong style={{ color: '#722ed1', fontSize: '14px' }}>
                        {new Intl.NumberFormat('vi-VN', {
                            style: "currency",
                            currency: "VND"
                        }).format(total)}
                    </Text>
                );
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            align: 'center',
            render: (status) => <StatusBadge status={status} />
        },
        {
            title: "Thao tác",
            key: "action",
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="primary" 
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => updateBill(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button 
                            type="default" 
                            size="small"
                            icon={<EyeFilled />}
                            onClick={() => detailBill(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "24px", background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Header */}
            <Card style={{ marginBottom: 24 }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: 0, color: '#1890ff' }}>
                    <Space>
                        <FileTextOutlined />
                        Quản lý hóa đơn
                    </Space>
                </Title>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng hóa đơn"
                            value={totalBills}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Đã thanh toán"
                            value={paidBills}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Chưa thanh toán"
                            value={unpaidBills}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={totalRevenue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => 
                                new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(value)
                            }
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filter Section */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm kiếm theo mã hóa đơn, phòng, khách hàng..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="ALL">Tất cả trạng thái</Option>
                            <Option value="CHUA_THANH_TOAN">Chưa thanh toán</Option>
                            <Option value="DA_THANH_TOAN">Đã thanh toán</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Space>
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                                onClick={handleFilter}
                            >
                                Tìm kiếm
                            </Button>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={resetFilters}
                            >
                                Đặt lại
                            </Button>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={4} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={createBill}
                            style={{ 
                                background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                            }}
                        >
                            Tạo hóa đơn
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Data Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredBills}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} hóa đơn`,
                        pageSizeOptions: ['5', '10', '20', '50']
                    }}
                    scroll={{ x: 1400 }}
                    size="middle"
                    bordered
                    style={{ 
                        background: 'white',
                        borderRadius: '8px'
                    }}
                    rowClassName={(record) => 
                        record.status === "CHUA_THANH_TOAN" ? 'unpaid-row' : 'paid-row'
                    }
                />
            </Card>

            <style jsx>{`
                .unpaid-row {
                    background-color: #fff2f0 !important;
                }
                .paid-row {
                    background-color: #f6ffed !important;
                }
                .unpaid-row:hover,
                .paid-row:hover {
                    background-color: #e6f7ff !important;
                }
            `}</style>
        </div>
    );
};

export default GetAllBill;