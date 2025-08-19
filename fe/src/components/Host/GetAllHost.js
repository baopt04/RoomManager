import React, { useState, useEffect } from "react";
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
    HomeOutlined,
    UserOutlined,
    ManOutlined,
    WomanOutlined,
    PhoneOutlined,
    MailOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import HostService from "../../services/HostService";
import ModalUpdateHost from "./ModalUpdateHost";
import ModalDetailHost from "./ModalDetailHost";

const { Title, Text } = Typography;
const { Search } = Input;

const GetAllHost = () => {
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [selectedHost, setSelectedHost] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchHosts = async () => {
            setLoading(true);
            try {
                const hosts = await HostService.getAllHosts(token);
                setData(hosts);
                setFilteredData(hosts);
            } catch (error) {
                console.error("Failed to fetch hosts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHosts();
    }, [token]);

    const handleEdit = (host) => {
        setSelectedHost(host.id);
        setIsModalVisible(true);
    };

    const detailHost = (host) => {
        setSelectedHost(host.id);
        setIsModalDetail(true);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value.trim()) {
            setFilteredData(data);
            return;
        }

        const filtered = data.filter((item) =>
            Object.values(item).some((val) =>
                val && val.toString().trim().toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    const handleAdd = () => {
        navigate("/createHost");
    };

    const getGenderInfo = (gender) => {
        if (gender) {
            return {
                text: "Nam",
                color: "blue",
                icon: <ManOutlined />
            };
        } else {
            return {
                text: "Nữ",
                color: "pink",
                icon: <WomanOutlined />
            };
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt,
        },
        {
            title: "Thông tin chủ nhà",
            key: "hostInfo",
            render: (_, record) => {
                const genderInfo = getGenderInfo(record.gender);
                return (
                    <Space>
                        <Avatar 
                            size={40} 
                            icon={genderInfo.icon}
                            style={{ 
                                backgroundColor: genderInfo.color === 'blue' ? '#1890ff' : '#eb2f96'
                            }}
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
                );
            },
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Liên hệ",
            key: "contact",
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    <Space>
                        <MailOutlined style={{ color: '#1890ff' }} />
                        <Text style={{ fontSize: '13px' }}>{record.email}</Text>
                    </Space>
                    <Space>
                        <PhoneOutlined style={{ color: '#52c41a' }} />
                        <Text style={{ fontSize: '13px' }}>{record.numberPhone}</Text>
                    </Space>
                </Space>
            ),
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            width: 120,
            align: 'center',
            render: (gender) => {
                const genderInfo = getGenderInfo(gender);
                return (
                    <Tag 
                        color={genderInfo.color} 
                        icon={genderInfo.icon}
                        style={{ fontWeight: 'bold' }}
                    >
                        {genderInfo.text}
                    </Tag>
                );
            },
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
                            onClick={() => detailHost(record)}
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

    const hostStats = {
        total: data.length,
        male: data.filter(host => host.gender === true).length,
        female: data.filter(host => host.gender === false).length,
        active: data.length, // Assuming all are active, adjust based on your data structure
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
                        Quản lý chủ nhà
                    </Title>
                    <Text type="secondary">
                        Quản lý thông tin các chủ nhà trong hệ thống
                    </Text>
                </div>

                <Divider />

                {/* Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #1890ff' }}>
                            <Statistic 
                                title="Tổng chủ nhà" 
                                value={hostStats.total}
                                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                                prefix={<HomeOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #52c41a' }}>
                            <Statistic 
                                title="Đang hoạt động" 
                                value={hostStats.active}
                                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #1890ff' }}>
                            <Statistic 
                                title="Nam" 
                                value={hostStats.male}
                                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                                prefix={<ManOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #eb2f96' }}>
                            <Statistic 
                                title="Nữ" 
                                value={hostStats.female}
                                valueStyle={{ color: '#eb2f96', fontSize: '20px' }}
                                prefix={<WomanOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Search and Actions */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={16}>
                        <Search
                            placeholder="Tìm kiếm theo tên, email, số điện thoại, mã chủ nhà..."
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
                                onClick={() => window.location.reload()}
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
                                Thêm chủ nhà
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} bản ghi`,
                    }}
                    scroll={{ x: 800 }}
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
            <ModalUpdateHost
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                hostId={selectedHost}
            />
            <ModalDetailHost
                hostId={selectedHost}
                onClose={() => setIsModalDetail(false)}
                visible={isModalDetail}
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

export default GetAllHost;  