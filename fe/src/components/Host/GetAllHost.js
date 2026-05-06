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

const GetAllHost = () => {
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [selectedHost, setSelectedHost] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchHosts = async () => {
        setLoading(true);
        try {
            const hosts = await HostService.getAllHosts(token);

            

            const hostsWithIndex = hosts.map((item, index) => ({
                ...item,
                stt: index + 1
            }));
            setData(hostsWithIndex);
            setFilteredData(hostsWithIndex);
        } catch (error) {
            console.error("Failed to fetch hosts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
        const filtered = data.filter((item) => {
            const searchStr = value.toLowerCase();
            return (
                (item.name && item.name.toLowerCase().includes(searchStr)) ||
                (item.email && item.email.toLowerCase().includes(searchStr)) ||
                (item.numberPhone && item.numberPhone.toLowerCase().includes(searchStr)) ||
                (item.code && item.code.toLowerCase().includes(searchStr))
            );
        });
        setFilteredData(filtered);
    };

    const handleAdd = () => {
        navigate("/createHost");
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 50,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt,
        },
        {
            title: "Chủ nhà",
            key: "hostInfo",
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={32}
                        icon={record.gender ? <ManOutlined /> : <WomanOutlined />}
                        style={{ background: record.gender ? '#1677ff' : '#eb2f96' }}
                    />
                    <div>
                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{record.name}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.code}</Text>
                    </div>
                </Space>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => <Text style={{ fontSize: '13px' }}>{email}</Text>,
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Số điện thoại",
            dataIndex: "numberPhone",
            key: "numberPhone",
            render: (phone) => <Text style={{ fontSize: '13px' }}>{phone}</Text>,
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            width: 100,
            align: 'center',
            render: (gender) => (
                <Tag color={gender ? "blue" : "pink"}>
                    {gender ? "Nam" : "Nữ"}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            width: 100,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Sửa">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Chi tiết">
                        <Button type="text" size="small" icon={<EyeFilled />} onClick={() => detailHost(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const hostStats = {
        total: data.length,
        male: data.filter(host => host.gender === true).length,
        female: data.filter(host => host.gender === false).length,
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Quản lý chủ nhà</Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Quản lý thông tin các chủ nhà trong hệ thống</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm chủ nhà</Button>
            </div>

            {/* Statistics */}
            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic title="Tổng chủ nhà" value={hostStats.total} prefix={<UserOutlined style={{ color: '#1677ff' }} />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic title="Nam" value={hostStats.male} prefix={<ManOutlined style={{ color: '#1677ff' }} />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic title="Nữ" value={hostStats.female} prefix={<WomanOutlined style={{ color: '#eb2f96' }} />} />
                    </Card>
                </Col>
            </Row>

            {/* Filter */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm theo tên, email, SĐT..."
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: isMobile ? "100%" : 300 }}
                        allowClear
                    />
                    <Button icon={<ReloadOutlined />} onClick={() => { setSearchText(""); fetchHosts(); }}>
                        Làm mới
                    </Button>
                </div>
            </Card>

            {/* Table */}
            <Card size="small">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: !isMobile,
                        showTotal: (total) => `${total} chủ nhà`,
                    }}
                    rowKey="id"
                    scroll={{ x: 900 }}
                    size={isMobile ? "small" : "middle"}
                />
            </Card>

            {/* Modals */}
            <ModalUpdateHost
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                hostId={selectedHost}
                onSuccess={fetchHosts}
            />
            <ModalDetailHost
                hostId={selectedHost}
                onClose={() => setIsModalDetail(false)}
                visible={isModalDetail}
            />
        </div>
    );
};

export default GetAllHost;

