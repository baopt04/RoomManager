import React, { useEffect, useState } from "react";
import { 
    Table, 
    Input, 
    Button, 
    Space, 
    Card, 
    Tag, 
    Tooltip,
    Row,
    Col,
    Typography,
    Divider,
    Badge,
    Statistic,
    Avatar
} from "antd";
import { 
    SearchOutlined, 
    PlusOutlined, 
    EditOutlined, 
    ReloadOutlined, 
    HomeOutlined,
    UserOutlined,
    PhoneOutlined,
    IdcardOutlined,
    CalendarOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    StopOutlined
} from "@ant-design/icons";
import CustomerService from "../../services/CustomerService";
import ModalCreateCustomer from "./ModalCreateCustomer";
import ModalUpdateCustomer from "./ModalUpdateCustomer";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const GetAllCustomer = () => {
    // States
    const [dataCustomer, setDataCustomer] = useState([]);
    const token = localStorage.getItem("token");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [selectId, setSelectId] = useState(null);
    const [keyWord, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch customers
    useEffect(() => {
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const response = await CustomerService.getAllCustomers(token);
                const mappedData = response.map((item, index) => ({
                    ...item,
                    key: item.id,
                    stt: index + 1
                }));
                setDataCustomer(mappedData);
                setFilterData(mappedData);
                setOriginalData(mappedData);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [token]);

    // Search functionality
    const searchCustomer = () => {
        if (!keyWord.trim()) {
            setFilterData(originalData);
            return;
        }
        
        const filter = originalData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().trim().toLowerCase().includes(keyWord.toLowerCase())
            )
        );
        setFilterData(filter);
    };

    // Reset search
    const resetSearch = () => {
        setKeyWord("");
        setFilterData(originalData);
    };

    // Modal handlers
    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleEdit = (id) => {
        setSelectId(id);
        setIsModalUpdate(true);
    };

    // Navigate to room management
    const changeSearchRoom = (customerId) => {
        navigate('/room-management');
        localStorage.setItem("search", true);
        localStorage.setItem("customerIdSearch", customerId);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Chưa có ngày sinh";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(date);
    };

    // Render status
    const renderStatus = (status) => {
        return status === 'DANG_HOAT_DONG' ? (
            <Tag color="success" icon={<CheckCircleOutlined />}>
                Đang hoạt động
            </Tag>
        ) : (
            <Tag color="error" icon={<StopOutlined />}>
                Ngừng hoạt động
            </Tag>
        );
    };

    // Render gender
    const renderGender = (gender) => {
        return gender === true ? (
            <Tag color="blue">Nam</Tag>
        ) : (
            <Tag color="pink">Nữ</Tag>
        );
    };

    // Calculate statistics
    const activeCustomers = filterData.filter(customer => customer.status === 'DANG_HOAT_DONG').length;
    const inactiveCustomers = filterData.length - activeCustomers;
    const maleCustomers = filterData.filter(customer => customer.gender === true).length;
    const femaleCustomers = filterData.length - maleCustomers;

    // Age calculation
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const averageAge = filterData.length > 0 ? 
        Math.round(filterData.reduce((sum, customer) => sum + calculateAge(customer.dateOfBirth), 0) / filterData.length) : 0;

    // Table columns
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center",
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: "Mã KH",
            dataIndex: "code",
            key: "code",
            width: 100,
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (code) => <Text strong>{code}</Text>
        },
        {
            title: "Thông tin cá nhân",
            key: "personalInfo",
            width: 200,
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <Avatar 
                            size="small" 
                            icon={<UserOutlined />} 
                            style={{ 
                                backgroundColor: record.gender ? '#1890ff' : '#eb2f96',
                                marginRight: 8 
                            }}
                        />
                        <Text strong>{record.name}</Text>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        <PhoneOutlined style={{ marginRight: 4 }} />
                        {record.numberPhone}
                    </div>
                </div>
            )
        },
        {
            title: "Ngày sinh",
            dataIndex: "dateOfBirth",
            key: "dateOfBirth",
            width: 120,
            align: "center",
            sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),
            render: (dateOfBirth) => (
                <div>
                    <div>{formatDate(dateOfBirth)}</div>
                    {dateOfBirth && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            ({calculateAge(dateOfBirth)} tuổi)
                        </Text>
                    )}
                </div>
            )
        },
        {
            title: "CCCD",
            dataIndex: "cccd",
            key: "cccd",
            width: 130,
            sorter: (a, b) => a.cccd.localeCompare(b.cccd),
            render: (cccd) => (
                <Text code>
                    <IdcardOutlined style={{ marginRight: 4 }} />
                    {cccd}
                </Text>
            )
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            width: 90,
            align: "center",
            filters: [
                { text: "Nam", value: true },
                { text: "Nữ", value: false }
            ],
            onFilter: (value, record) => record.gender === value,
            sorter: (a, b) => {
                const genderA = a.gender === true ? 'Nam' : 'Nữ';
                const genderB = b.gender === true ? 'Nam' : 'Nữ';
                return genderA.localeCompare(genderB);
            },
            render: renderGender
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            align: "center",
            filters: [
                { text: "Đang hoạt động", value: "DANG_HOAT_DONG" },
                { text: "Ngừng hoạt động", value: "NGUNG_HOAT_DONG" }
            ],
            onFilter: (value, record) => record.status === value,
            render: renderStatus
        },
        {
            title: "Thao tác",
            key: "action",
            width: 160,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record.id)}
                        />
                    </Tooltip>
                    {record.status === "DANG_HOAT_DONG" && (
                        <Tooltip title="Xem phòng thuê">
                            <Button
                                type="default"
                                icon={<HomeOutlined />}
                                size="small"
                                style={{ 
                                    backgroundColor: '#52c41a', 
                                    borderColor: '#52c41a', 
                                    color: 'white' 
                                }}
                                onClick={() => changeSearchRoom(record.id)}
                            >
                                Phòng
                            </Button>
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Header */}
            <Card style={{ marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <Title level={2} style={{ textAlign: "center", margin: 0, color: "#1890ff" }}>
                    <TeamOutlined style={{ marginRight: "8px" }} />
                    Danh sách khách hàng
                </Title>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng khách hàng"
                            value={filterData.length}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Đang hoạt động"
                            value={activeCustomers}
                            valueStyle={{ color: '#3f8600' }}
                            suffix={`/ ${filterData.length}`}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Tuổi trung bình"
                            value={averageAge}
                            valueStyle={{ color: '#722ed1' }}
                            suffix="tuổi"
                            prefix={<CalendarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Statistic
                                title="Nam/Nữ"
                                value={maleCustomers}
                                valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                                suffix={`/${femaleCustomers}`}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Search and Actions */}
            <Card style={{ marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12} lg={10}>
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                placeholder="Tìm kiếm khách hàng..."
                                value={keyWord}
                                onChange={(e) => setKeyWord(e.target.value)}
                                onPressEnter={searchCustomer}
                                prefix={<SearchOutlined />}
                            />
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                                onClick={searchCustomer}
                            >
                                Tìm
                            </Button>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={resetSearch}
                                title="Reset"
                            />
                        </Space.Compact>
                    </Col>
                    <Col xs={24} md={12} lg={14}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={handleAdd}
                                style={{ 
                                    background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)"
                                }}
                            >
                                Thêm khách hàng
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: "16px 0" }} />
                
                <Row gutter={[16, 16]}>
                    <Col>
                        <Text type="secondary">
                            Hiển thị: <Text strong>{filterData.length}</Text> khách hàng
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <Table
                    columns={columns}
                    dataSource={filterData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} khách hàng`,
                    }}
                    scroll={{ x: 1000 }}
                    bordered
                    size="middle"
                    rowKey="id"
                />
            </Card>

            {/* Modals */}
            <ModalCreateCustomer
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
            <ModalUpdateCustomer
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                id={selectId}
            />
        </div>
    );
};

export default GetAllCustomer;