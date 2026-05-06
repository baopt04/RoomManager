import React, { useEffect, useState } from "react";
import AdminService from "../../services/AdminService";
import {
    Input,
    Space,
    Table,
    Button,
    Card,
    Typography,
    Tag,
    Tooltip,
    Row,
    Col,
    Avatar,
    Divider,
    message ,
    Modal
} from "antd";
import {
    EditOutlined,
    LockOutlined,
    PlusOutlined,
    SearchOutlined,
    UserOutlined,
    CrownOutlined,
    TeamOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import ModalCreateAdmin from "./ModalCreateAdmin";
import ModalUpdateAdmin from "./ModalUpdateAdmin";
import ModalLockerAdmin from "./ModalLockerAdmin";

const { Title, Text } = Typography;
const { Search } = Input;

const GetAllAdmin = () => {
    const [dataAdmin, setDataAdmin] = useState([]);
    const [filteredAdmin, setFilteredAdmin] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const token = localStorage.getItem('token');
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [modalLocker, setModalLocker] = useState(false);

    const [idAdmin, setIdAdmin] = useState("");
    const fetchAllAdmin = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllAdmin(token);
            setDataAdmin(response);
            setFilteredAdmin(response);
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAdmin();
    }, [token]);

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value.trim()) {
            setFilteredAdmin(dataAdmin);
            return;
        }
        const searchValue = value.toLowerCase();
        const filtered = dataAdmin.filter((item) =>
            [item.name, item.email, item.code, item.numberPhone]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(searchValue))
        );
        setFilteredAdmin(filtered);
    };

    const getRoleTag = (role) => {
        if (role === "ROLE_ADMIN") {
            return (
                <Tag
                    icon={<CrownOutlined />}
                    color="gold"
                    style={{ fontWeight: 'bold' }}
                >
                    Admin
                </Tag>
            );
        }
        return (
            <Tag
                icon={<UserOutlined />}
                color="blue"
            >
                Nhân viên
            </Tag>
        );
    };

    const getStatusTag = (status) => {
        let color, text, icon;

        switch (status) {
            case 'HOAT_DONG':
                color = 'success';
                text = 'Hoạt động';
                break;
            case 'NGUNG_HOAT_DONG':
                color = 'warning';
                text = 'Ngưng hoạt động';
                break;
            default:
                color = 'error';
                text = 'Khóa';
        }

        return <Tag color={color}>{text}</Tag>;
    };


    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: "stt",
            width: 60,
            align: 'center',
        },
        {
            title: "Thông tin",
            key: 'info',
            render: (_, record) => (
                <Space>
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: '#1890ff' }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{record.name}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.code}
                        </Text>
                    </div>
                </Space>
            ),
            width: 200,
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <Text>{record.email}</Text>
                    </div>
                    <Text type="secondary">{record.numberPhone}</Text>
                </div>
            ),
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'role',
            key: 'role',
            render: getRoleTag,
            width: 120,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: getStatusTag,
            width: 130,
        },
        {
            title: "Ghi chú",
            dataIndex: 'description',
            key: 'description',
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
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    {record.status === 'BI_KHOA' ? (
                        <Tooltip title="Mở tài khoản">
                            <Button
                                type="primary"
                                size="small"
                                green
                                icon={<UnlockOutlined />}
                                onClick={() => unlockAdmin(record.id)}
                                ghost
                            />
                        </Tooltip>
                    ) : (
                        <>
                            <Tooltip title="Chỉnh sửa">
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => opeanUpdateModalAdmin(record.id)}
                                    ghost
                                />
                            </Tooltip>

                            <Tooltip title="Khóa tài khoản">
                                <Button
                                    type="primary"
                                    size="small"
                                    danger
                                    icon={<LockOutlined />}
                                    onClick={() => openLockerAdminModal(record.id)}
                                    ghost
                                />
                            </Tooltip>
                        </>
                    )}

                </Space>
            )
        }
    ];
    const openCreateModalAdmin = () => {
        setModalCreate(true);

    }
    const opeanUpdateModalAdmin = (id) => {
        setModalUpdate(true);
        setIdAdmin(id)
    }
    const openLockerAdminModal = (id) => {
        setModalLocker(true);
        setIdAdmin(id);
    }
    const unlockAdmin = async (id) => {
        Modal.confirm({
            title: 'Mở khóa thành viên quản trị',
            content: 'Bạn có chắc chắn muốn mở khóa không?',
            okText: "Mở",
            cancelText: 'Hủy',
            okType: "danger",
            onOk: async () => {
                try {
                    const unlockerAdmin = {
                        unlocker: "unlocker"
                    }
                    await AdminService.lockerAdmin(token, id, unlockerAdmin);
                    message.success("Mở khóa thành viên quản trị thành công!")
                    await fetchAllAdmin();
                } catch (error) {
                    message.error("Lỗi từ server.Vui lòng thử lại sau!")
                }
            }
        })
    }
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
                        <TeamOutlined />
                        Quản lý Admin
                    </Title>
                    <Text type="secondary">
                        Quản lý tài khoản quản trị viên và nhân viên hệ thống
                    </Text>
                </div>

                <Divider />

                {/* Search and Actions */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={16}>
                        <Search
                            placeholder="Tìm kiếm theo tên, email, mã nhân viên..."
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
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={openCreateModalAdmin}
                            block
                            style={{
                                borderRadius: '10px',
                                height: '40px',
                                fontWeight: 'bold'
                            }}
                        >
                            Thêm Admin Mới
                        </Button>
                    </Col>
                </Row>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <div style={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}>
                                {filteredAdmin.length}
                            </div>
                            <div style={{ color: '#666' }}>Tổng số tài khoản</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <div style={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}>
                                {filteredAdmin.filter(admin => admin.status === 'HOAT_DONG').length}
                            </div>
                            <div style={{ color: '#666' }}>Đang hoạt động</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                            <div style={{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }}>
                                {filteredAdmin.filter(admin => admin.role === 'ROLE_ADMIN').length}
                            </div>
                            <div style={{ color: '#666' }}>Quản trị viên</div>
                        </Card>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredAdmin}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} bản ghi`,
                    }}
                    scroll={{ x: 1200 }}
                    rowKey="code"
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px'
                    }}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                    }
                />
            </Card>

            <ModalCreateAdmin
                visible={modalCreate}
                onclose={() => setModalCreate(false)}
                onSuccess={fetchAllAdmin}
            />
            <ModalUpdateAdmin
                visible={modalUpdate}
                onclose={() => setModalUpdate(false)}
                id={idAdmin}
                onSuccess={fetchAllAdmin}
            />
            <ModalLockerAdmin
                visible={modalLocker}
                onclose={() => setModalLocker(false)}
                id={idAdmin}
                onSuccess={fetchAllAdmin}
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
            `}</style>
        </div>


    );
};

export default GetAllAdmin;

