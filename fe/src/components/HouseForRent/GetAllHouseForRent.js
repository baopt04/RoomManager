import React, { useEffect, useState } from "react";
import { 
    Table, 
    Input, 
    Button, 
    Space, 
    Card, 
    Typography, 
    Tag, 
    Row, 
    Col, 
    Statistic,
    Tooltip,
    Avatar,
    Divider
} from "antd";
import { 
    SearchOutlined, 
    PlusOutlined, 
    EditOutlined, 
    EyeFilled,
    ReloadOutlined,
    HomeOutlined,
    UserOutlined,
    EnvironmentOutlined,
    DollarCircleOutlined,
    CheckCircleOutlined,
    StopOutlined
} from "@ant-design/icons";
import HouseForRentService from "../../services/HouseForRentService";
import HostService from "../../services/HostService";
import ModalCreate from "./ModalCreate";
import ModalUpdate from "./ModalUpdate";
import ModalDetail from "./ModalDetail";

const { Title, Text } = Typography;
const { Search } = Input;

const GetAllHouseForRent = () => {
    const [dataHouseForRent, setDataHouseForRent] = useState([]);
    const [filteredHouseForRent, setFilteredHouseForRent] = useState([]);
    const [dataHost, setDataHost] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    
    // Modal states
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [selectedHost, setSelectedHost] = useState(null);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [search, setSearch] = useState("");

    // Fetch houses for rent
    useEffect(() => {
        const fetchHouseForRent = async () => {
            setLoading(true);
            try {
                const response = await HouseForRentService.getAllHouseForRent(token);
                setDataHouseForRent(response);
                setFilteredHouseForRent(response);
            } catch (error) {
                console.error("Failed to fetch houses for rent:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHouseForRent();
    }, [token]);

    // Fetch hosts data
    useEffect(() => {
        const fetchHostData = async () => {
            try {
                const data = await HostService.getAllHosts(token);
                setDataHost(data);
            } catch (error) {
                console.error("Error fetching host data:", error);
            }
        };
        fetchHostData();
    }, [token]);

    const handleSearch = (value) => {
        setSearch(value);
        if (!value.trim()) {
            setFilteredHouseForRent(dataHouseForRent);
            return;
        }

        const filter = dataHouseForRent.filter((item) =>
            Object.values(item).some((val) =>
                val?.toString().trim().toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredHouseForRent(filter);
    };

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleEdit = (house) => {
        setSelectedHouse(house.id);
        setIsModalUpdate(true);
    };

    const detailHouseForrent = (house) => {
        setSelectedHouse(house.id);
        setIsModalDetail(true);
    };

    const reloadPage = () => {
        window.location.reload();
    };

    const getStatusTag = (status) => {
        if (status === "DANG_THUE") {
            return (
                <Tag 
                    color="success" 
                    icon={<CheckCircleOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Đang thuê
                </Tag>
            );
        } else {
            return (
                <Tag 
                    color="error" 
                    icon={<StopOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Dừng thuê
                </Tag>
            );
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

    const columns = [
        {
            title: "#",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: "Thông tin nhà",
            key: "houseInfo",
            render: (_, record) => (
                <Space>
                    <Avatar 
                        size={40} 
                        icon={<HomeOutlined />}
                        style={{ backgroundColor: '#52c41a' }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
                            {record.name}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.code}
                        </Text>
                    </div>
                </Space>
            ),
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Địa chỉ & Giá",
            key: "addressPrice",
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Space>
                        <EnvironmentOutlined style={{ color: '#fa8c16' }} />
                        <Text style={{ fontSize: '13px' }} ellipsis>
                            {record.address}
                        </Text>
                    </Space>
                    <Space>
                        <DollarCircleOutlined style={{ color: '#52c41a' }} />
                        <Text strong style={{ fontSize: '13px', color: '#52c41a' }}>
                            {formatPrice(record.price)}
                        </Text>
                    </Space>
                </Space>
            ),
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            align: 'center',
            filters: [
                { text: "Đang thuê", value: "DANG_THUE" },
                { text: "Dừng thuê", value: "DUNG_THUE" },
            ],
            onFilter: (value, record) => record.status === value,
            render: getStatusTag,
        },
        {
            title: "Chủ nhà",
            dataIndex: "id_host",
            key: "id_host",
            render: (id_host) => {
                const hostName = dataHost.find((host) => host.id === id_host)?.name;
                return (
                    <Space>
                        <UserOutlined style={{ color: '#1890ff' }} />
                        <Text>{hostName || "Chưa có chủ nhà"}</Text>
                    </Space>
                );
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "discription",
            key: "discription",
            ellipsis: {
                showTitle: false,
            },
            render: (description) => (
                <Tooltip placement="topLeft" title={description}>
                    {description || '-'}
                </Tooltip>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            fixed: 'right',
            width: 160,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa thông tin">
                        <Button 
                            type="primary" 
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            ghost
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button 
                            type="default" 
                            size="small"
                            icon={<EyeFilled />}
                            onClick={() => detailHouseForrent(record)}
                            style={{ 
                                backgroundColor: '#fa8c16',
                                borderColor: '#fa8c16',
                                color: 'white'
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const houseStats = {
        total: dataHouseForRent.length,
        rented: dataHouseForRent.filter(house => house.status === "DANG_THUE").length,
        available: dataHouseForRent.filter(house => house.status !== "DANG_THUE").length,
        totalRevenue: dataHouseForRent
            .filter(house => house.status === "DANG_THUE")
            .reduce((sum, house) => sum + (house.price || 0), 0),
    };

    return (
        <div style={{ 
            padding: '24px', 
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <Card 
                style={{ 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                {/* Header */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '32px',
                    padding: '20px 0'
                }}>
                    <Title level={2} style={{ 
                        margin: 0, 
                        color: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <HomeOutlined />
                        Quản lý nhà thuê
                    </Title>
                    <Text type="secondary">
                        Quản lý thông tin các nhà cho thuê trong hệ thống
                    </Text>
                </div>

                <Divider />

                {/* Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #1890ff' }}>
                            <Statistic 
                                title="Tổng nhà thuê" 
                                value={houseStats.total}
                                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                                prefix={<HomeOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #52c41a' }}>
                            <Statistic 
                                title="Đang cho thuê" 
                                value={houseStats.rented}
                                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #faad14' }}>
                            <Statistic 
                                title="Có sẵn" 
                                value={houseStats.available}
                                valueStyle={{ color: '#faad14', fontSize: '20px' }}
                                prefix={<StopOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #52c41a' }}>
                            <Statistic 
                                title="Doanh thu/tháng" 
                                value={houseStats.totalRevenue}
                                valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                                prefix={<DollarCircleOutlined />}
                                formatter={(value) => formatPrice(value)}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Search and Actions */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={16}>
                        <Search
                            placeholder="Tìm kiếm theo tên nhà, địa chỉ, mã nhà, chủ nhà..."
                            allowClear
                            enterButton={
                                <Button type="primary" icon={<SearchOutlined />}>
                                    Tìm kiếm
                                </Button>
                            }
                            size="large"
                            onSearch={handleSearch}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Space style={{ width: '100%' }}>
                            <Button 
                                icon={<ReloadOutlined />}
                                size="large"
                                onClick={reloadPage}
                                style={{ borderRadius: '8px' }}
                            >
                                Làm mới
                            </Button>
                            <Button 
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                style={{
                                    borderRadius: '8px',
                                    fontWeight: 'bold'
                                }}
                            >
                                Thêm nhà mới
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredHouseForRent}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} bản ghi`,
                    }}
                    scroll={{ x: 1200 }}
                    rowKey="stt"
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px'
                    }}
                    rowClassName={(record, index) => 
                        index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                    }
                />
            </Card>

            {/* Modals */}
            <ModalCreate
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                houseData={selectedHouse} 
            />
            <ModalUpdate
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                houseData={selectedHouse}
                hostId={selectedHost} 
            />
            <ModalDetail
                visible={isModalDetail}
                onClose={() => setIsModalDetail(false)}
                houseData={selectedHouse}
                hostId={selectedHost} 
            />

            {/* Custom CSS */}
            <style jsx>{`
                .table-row-light {
                    background-color: #fafafa;
                }
                .table-row-dark {
                    background-color: white;
                }
                .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f0f0f0;
                }
                .ant-table-tbody > tr:hover > td {
                    background: #e6f7ff !important;
                }
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllHouseForRent;