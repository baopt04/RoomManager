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

    useEffect(() => {
        fetchCustomer();
    }, [token]);

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

    const resetSearch = () => {
        setKeyWord("");
        fetchCustomer();
    };

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleEdit = (id) => {
        setSelectId(id);
        setIsModalUpdate(true);
    };

    const changeSearchRoom = (customerId) => {
        navigate('/admin/rooms');
        localStorage.setItem("search", true);
        localStorage.setItem("customerIdSearch", customerId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(date);
    };

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

    const activeCustomers = filterData.filter(customer => customer.status === 'DANG_HOAT_DONG').length;
    const inactiveCustomers = filterData.length - activeCustomers;

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 50,
            align: "center",
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: "Mã KH",
            dataIndex: "code",
            key: "code",
            width: 150,
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (code) => <Text style={{ fontSize: '13px' }}>{code}</Text>
        },
        {
            title: "Khách hàng",
            key: "personalInfo",
            width: 250,
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={28}
                        icon={<UserOutlined />}
                        style={{ background: record.gender ? '#1677ff' : '#eb2f96' }}
                    />
                    <div>
                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{record.name}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.numberPhone}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: "Ngày sinh",
            dataIndex: "dateOfBirth",
            key: "dateOfBirth",
            width: 110,
            sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),
            render: (dateOfBirth) => (
                <Text style={{ fontSize: '13px' }}>{formatDate(dateOfBirth)}</Text>
            )
        },
        {
            title: "CCCD",
            dataIndex: "cccd",
            key: "cccd",
            width: 130,
            render: (cccd) => <Text style={{ fontSize: '13px' }}>{cccd}</Text>
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            width: 85,
            align: "center",
            filters: [
                { text: "Nam", value: true },
                { text: "Nữ", value: false }
            ],
            onFilter: (value, record) => record.gender === value,
            render: (gender) => (
                <Tag color={gender ? "blue" : "pink"}>{gender ? "Nam" : "Nữ"}</Tag>
            )
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
            render: (status) => (
                <Tag color={status === 'DANG_HOAT_DONG' ? "green" : "default"}>
                    {status === 'DANG_HOAT_DONG' ? 'Hoạt động' : 'Ngừng HĐ'}
                </Tag>
            )
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Sửa">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
                    </Tooltip>
                    {record.status === "DANG_HOAT_DONG" && (
                        <Tooltip title="Xem phòng">
                            <Button type="text" size="small" icon={<HomeOutlined />} onClick={() => changeSearchRoom(record.id)} />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Quản lý khách hàng</Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Danh sách khách hàng trong hệ thống</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm khách hàng</Button>
            </div>

            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic title="Tổng khách hàng" value={filterData.length} prefix={<TeamOutlined style={{ color: '#1677ff' }} />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic title="Đang hoạt động" value={activeCustomers} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic title="Ngừng hoạt động" value={inactiveCustomers} prefix={<StopOutlined style={{ color: '#ff4d4f' }} />} />
                    </Card>
                </Col>
            </Row>

            {/* Filter */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm khách hàng..."
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        onPressEnter={searchCustomer}
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        style={{ width: 280 }}
                        allowClear
                    />
                    <Button icon={<SearchOutlined />} onClick={searchCustomer}>Tìm</Button>
                    <Button icon={<ReloadOutlined />} onClick={resetSearch}>Làm mới</Button>
                </div>
            </Card>

            <Card size="small">
                <Table
                    columns={columns}
                    dataSource={filterData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `${total} khách hàng`,
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                    rowKey="id"
                />
            </Card>

            {/* Modals */}
            <ModalCreateCustomer
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={fetchCustomer}
            />
            <ModalUpdateCustomer
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                id={selectId}
                onSuccess={fetchCustomer}
            />
        </div>
    );
};

export default GetAllCustomer;

