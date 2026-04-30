import React, { useState, useEffect } from "react";
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
    Modal,
    Avatar,
    Badge,
    Divider
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
    ToolOutlined,
    HomeOutlined,
    DollarOutlined,
    AppstoreOutlined,
    ExclamationCircleOutlined,
    LinkOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import RoomService from "../../services/RoomService";
import RoomServiceDetail from "../../services/RoomServiceDetail";
import ModalCreateRoomService from "./ModalCreateRoomService";
import ModalUpdateRoomService from "./ModalUpdateRoomService";

const { Title, Text } = Typography;
const { Option } = Select;

const GetAllRoomServiceDetail = () => {
    const [searchText, setSearchText] = useState("");
    const [dataService, setDataService] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [roomServiceData, setRoomServiceData] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roomFilter, setRoomFilter] = useState("ALL");
    const [serviceFilter, setServiceFilter] = useState("ALL");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData();
    }, [token]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [servicesResponse, roomsResponse, roomServiceResponse] = await Promise.all([
                Services.getAllService(token),
                RoomService.getAllRooms(token),
                RoomServiceDetail.getAllRoomServiceDetail(token)
            ]);

            setDataService(servicesResponse);
            setDataRoom(roomsResponse);
            setRoomServiceData(roomServiceResponse);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu!");
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Map data and group by room
    useEffect(() => {
        if (dataRoom.length > 0 && dataService.length > 0) {
            const assignments = roomServiceData.map((item) => {
                const room = dataRoom.find(r => r.id === item.room);
                const service = dataService.find(s => s.id === item.service);
                return {
                    ...item,
                    roomName: room ? room.name : "Không xác định",
                    serviceName: service ? service.name : "Không xác định",
                    servicePrice: service ? service.price : 0,
                    unitOfMeasure: service ? service.unitOfMeasure : "",
                };
            });

            // Grouping logic
            const grouped = dataRoom.map((room) => {
                const roomServices = assignments.filter(a => a.room === room.id);
                return {
                    key: room.id,
                    roomId: room.id,
                    roomName: room.name,
                    services: roomServices,
                    totalPrice: roomServices.reduce((sum, s) => sum + (s.servicePrice || 0), 0)
                };
            }).filter(group => group.services.length > 0);

            // Sort and add STT
            const finalData = grouped.sort((a, b) => a.roomName.localeCompare(b.roomName))
                .map((item, idx) => ({ ...item, stt: idx + 1 }));

            setOriginalData(finalData);
            setFilteredData(finalData);
        }
    }, [roomServiceData, dataRoom, dataService]);

    // Search and filter function
    const handleFilter = () => {
        let filtered = [...originalData];

        // Filter by keyword
        if (searchText.trim()) {
            filtered = filtered.filter((roomGroup) =>
                roomGroup.roomName.toLowerCase().includes(searchText.toLowerCase()) ||
                roomGroup.services.some(s => s.serviceName.toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        // Filter by room
        if (roomFilter !== "ALL") {
            filtered = filtered.filter(item => item.roomId === roomFilter);
        }

        // Filter by service
        if (serviceFilter !== "ALL") {
            filtered = filtered.filter(item => item.services.some(s => s.service === serviceFilter));
        }

        setFilteredData(filtered);
    };

    const resetFilters = () => {
        setSearchText("");
        setRoomFilter("ALL");
        setServiceFilter("ALL");
        setFilteredData(originalData);
    };

    // Delete room service
    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn xóa dịch vụ "${record.serviceName}" khỏi phòng "${record.roomName}" không?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await RoomServiceDetail.deleteRoomServiceDetail(token, record.id);
                    message.success("Xóa dịch vụ phòng thành công");
                    fetchAllData();
                } catch (error) {
                    message.error("Xóa dịch vụ phòng thất bại");
                }
            }
        });
    };

    // Modal handlers
    const handleEdit = (id) => {
        setSelectedServiceId(id);
        setIsModalUpdate(true);
    };

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    // Room badge component
    const RoomBadge = ({ roomName }) => {
        return (
            <Space>
                <Avatar
                    size="large"
                    style={{ backgroundColor: '#1890ff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    icon={<HomeOutlined />}
                />
                <div>
                    <Text strong style={{ fontSize: '16px' }}>{roomName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>Phòng trọ</Text>
                </div>
            </Space>
        );
    };

    // Calculate statistics
    const totalAssignments = filteredData.reduce((sum, item) => sum + item.services.length, 0);
    const uniqueRooms = filteredData.length;
    const uniqueServices = new Set(filteredData.flatMap(item => item.services.map(s => s.service))).size;
    const totalValue = filteredData.reduce((sum, item) => sum + item.totalPrice, 0);

    // Get room options for filter
    const roomOptions = dataRoom.map(room => ({
        value: room.id,
        label: room.name
    }));

    // Get service options for filter
    const serviceOptions = dataService.map(service => ({
        value: service.id,
        label: service.name
    }));

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: 'center',
        },
        {
            title: (
                <Space>
                    <HomeOutlined />
                    Phòng trọ
                </Space>
            ),
            dataIndex: "roomName",
            key: "roomName",
            width: 220,
            render: (roomName) => <RoomBadge roomName={roomName} />
        },
        {
            title: (
                <Space>
                    <ToolOutlined />
                    Dịch vụ đang sử dụng
                </Space>
            ),
            dataIndex: "services",
            key: "services",
            render: (services) => (
                <Space wrap size={[8, 12]}>
                    {services.map(s => (
                        <Tag
                            color="blue"
                            key={s.id}
                            // closable
                            onClose={(e) => {
                                e.preventDefault();
                                handleDelete(s);
                            }}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '14px',
                                border: '1px solid #91d5ff',
                                background: '#e6f7ff'
                            }}
                        >
                            <Space size={8}>
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                <Text strong>{s.serviceName}</Text>
                                <Divider type="vertical" />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {new Intl.NumberFormat("vi-VN").format(s.servicePrice)}đ
                                </Text>
                                <Tooltip title="Chỉnh sửa">
                                    <EditOutlined
                                        style={{ cursor: 'pointer', color: '#1890ff', marginLeft: 4 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(s.id);
                                        }}
                                    />
                                </Tooltip>
                            </Space>
                        </Tag>
                    ))}
                </Space>
            )
        },
        {
            title: (
                <Space>
                    <DollarOutlined />
                    Tổng cộng / Tháng
                </Space>
            ),
            dataIndex: "totalPrice",
            key: "totalPrice",
            width: 200,
            align: 'right',
            render: (totalPrice) => (
                <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ color: '#f5222d', fontSize: '18px' }}>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND"
                        }).format(totalPrice)}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '11px' }}>Tổng chi phí dịch vụ</Text>
                </div>
            )
        }
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Quản lý dịch vụ theo phòng
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Xem nhanh danh sách dịch vụ được gán cho từng phòng trọ
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Gán dịch vụ
                </Button>
            </div>

            {/* Statistics */}
            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Số lần gán dịch vụ"
                            value={totalAssignments}
                            prefix={<LinkOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Phòng đang dùng"
                            value={uniqueRooms}
                            prefix={<HomeOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Loại dịch vụ dùng"
                            value={uniqueServices}
                            prefix={<ToolOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng giá trị / Tháng"
                            value={totalValue}
                            prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
                            formatter={(value) =>
                                new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(value)
                            }
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filter Section */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleFilter}
                        style={{ width: 240 }}
                        allowClear
                    />
                    <Select
                        placeholder="Lọc theo phòng"
                        value={roomFilter}
                        onChange={setRoomFilter}
                        style={{ width: 180 }}
                        showSearch
                        optionFilterProp="label"
                    >
                        <Option value="ALL">Tất cả phòng</Option>
                        {roomOptions.map(option => (
                            <Option key={option.value} value={option.value} label={option.label}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Lọc theo dịch vụ"
                        value={serviceFilter}
                        onChange={setServiceFilter}
                        style={{ width: 180 }}
                        showSearch
                        optionFilterProp="label"
                    >
                        <Option value="ALL">Tất cả dịch vụ</Option>
                        {serviceOptions.map(option => (
                            <Option key={option.value} value={option.value} label={option.label}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                    <Button icon={<SearchOutlined />} onClick={handleFilter}>
                        Tìm
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                        Làm mới
                    </Button>
                </div>
            </Card>

            {/* Data Table */}
            <Card size="small">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="key"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} bản ghi`,
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                />
            </Card>

            {/* Modals */}
            <ModalCreateRoomService
                visible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                    fetchAllData();
                }}
            />

            <ModalUpdateRoomService
                visible={isModalUpdate}
                onClose={() => {
                    setIsModalUpdate(false);
                    fetchAllData();
                }}
                serviceId={selectedServiceId}
            />

            <style jsx>{`
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllRoomServiceDetail;