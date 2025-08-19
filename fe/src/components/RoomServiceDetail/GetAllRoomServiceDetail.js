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
    Badge
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
    LinkOutlined
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

    // Fetch all data
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

    // Map data when all data is available
    useEffect(() => {
        if (roomServiceData.length > 0 && dataRoom.length > 0 && dataService.length > 0) {
            const mapped = roomServiceData.map((item, idx) => {
                const room = dataRoom.find(r => r.id === item.room);
                const service = dataService.find(s => s.id === item.service);
                return {
                    ...item,
                    stt: idx + 1,
                    key: item.id,
                    roomName: room ? room.name : "Không xác định",
                    serviceName: service ? service.name : "Không xác định",
                    servicePrice: service ? service.price : 0,
                    unitOfMeasure: service ? service.unitOfMeasure : "",
                };
            });
            setOriginalData(mapped);
            setFilteredData(mapped);
        }
    }, [roomServiceData, dataRoom, dataService]);

    // Search and filter function
    const handleFilter = () => {
        let filtered = [...originalData];

        // Filter by keyword
        if (searchText.trim()) {
            filtered = filtered.filter((item) =>
                Object.values(item).some((value) =>
                    value &&
                    value.toString().toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }

        // Filter by room
        if (roomFilter !== "ALL") {
            filtered = filtered.filter(item => item.room === roomFilter);
        }

        // Filter by service
        if (serviceFilter !== "ALL") {
            filtered = filtered.filter(item => item.service === serviceFilter);
        }

        setFilteredData(filtered);
    };

    // Reset filters
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
                    // await RoomServiceDetail.deleteRoomServiceDetail(record.id, token);
                    message.success("Xóa dịch vụ phòng thành công");
                    fetchAllData(); // Refresh data
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

    // Service badge component
    const ServiceBadge = ({ serviceName, unitOfMeasure }) => {
        const getColor = (unit) => {
            switch (unit) {
                case 'THÁNG': return 'green';
                case 'NGÀY': return 'blue';
                case 'LẦN': return 'orange';
                case 'NGƯỜI': return 'purple';
                default: return 'default';
            }
        };

        return (
            <Space>
                <Avatar 
                    size="small" 
                    style={{ backgroundColor: getColor(unitOfMeasure) }}
                    icon={<ToolOutlined />}
                />
                <div>
                    <Text strong>{serviceName}</Text>
                    <br />
                    <Tag color={getColor(unitOfMeasure)} size="small">
                        {unitOfMeasure}
                    </Tag>
                </div>
            </Space>
        );
    };

    // Room badge component
    const RoomBadge = ({ roomName }) => {
        return (
            <Space>
                <Avatar 
                    size="small" 
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<HomeOutlined />}
                />
                <Text strong>{roomName}</Text>
            </Space>
        );
    };

    // Calculate statistics
    const totalAssignments = filteredData.length;
    const uniqueRooms = new Set(filteredData.map(item => item.room)).size;
    const uniqueServices = new Set(filteredData.map(item => item.service)).size;
    const totalValue = filteredData.reduce((sum, item) => sum + (item.servicePrice || 0), 0);

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

    // Table columns
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: (
                <Space>
                    <ToolOutlined />
                    Dịch vụ
                </Space>
            ),
            dataIndex: "serviceName",
            key: "serviceName",
            width: 200,
            sorter: (a, b) => a.serviceName.localeCompare(b.serviceName),
            render: (serviceName, record) => (
                <ServiceBadge 
                    serviceName={serviceName} 
                    unitOfMeasure={record.unitOfMeasure}
                />
            )
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
            width: 150,
            sorter: (a, b) => a.roomName.localeCompare(b.roomName),
            render: (roomName) => <RoomBadge roomName={roomName} />
        },
        {
            title: (
                <Space>
                    <DollarOutlined />
                    Giá dịch vụ
                </Space>
            ),
            dataIndex: "servicePrice",
            key: "servicePrice",
            width: 130,
            align: 'right',
            sorter: (a, b) => (a.servicePrice || 0) - (b.servicePrice || 0),
            render: (servicePrice) => {
                const color = servicePrice === 0 ? '#52c41a' : 
                             servicePrice < 100000 ? '#1890ff' :
                             servicePrice < 500000 ? '#faad14' : '#f5222d';
                
                return (
                    <Text strong style={{ color }}>
                        {servicePrice === 0 ? 'Miễn phí' : 
                         new Intl.NumberFormat("vi-VN", {
                             style: "currency",
                             currency: "VND"
                         }).format(servicePrice)
                        }
                    </Text>
                );
            }
        },
        {
            title: "Trạng thái",
            key: "status",
            width: 100,
            align: 'center',
            render: () => (
                <Badge status="success" text={<Tag color="green">Đang sử dụng</Tag>} />
            )
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
                            onClick={() => handleEdit(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa dịch vụ">
                        <Button 
                            danger 
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
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
                        <LinkOutlined />
                        Quản lý dịch vụ phòng trọ
                    </Space>
                </Title>
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
                    Quản lý các dịch vụ được áp dụng cho từng phòng trọ
                </Text>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng gán dịch vụ"
                            value={totalAssignments}
                            prefix={<LinkOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Phòng có dịch vụ"
                            value={uniqueRooms}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Dịch vụ đang dùng"
                            value={uniqueServices}
                            prefix={<ToolOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng giá trị dịch vụ"
                            value={totalValue}
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
                    <Col xs={24} sm={8}>
                        <Input
                            placeholder="Tìm kiếm theo tên dịch vụ, phòng..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={5}>
                        <Select
                            placeholder="Lọc theo phòng"
                            value={roomFilter}
                            onChange={setRoomFilter}
                            style={{ width: '100%' }}
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
                    </Col>
                    <Col xs={24} sm={5}>
                        <Select
                            placeholder="Lọc theo dịch vụ"
                            value={serviceFilter}
                            onChange={setServiceFilter}
                            style={{ width: '100%' }}
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
                    </Col>
                    <Col xs={24} sm={4}>
                        <Space>
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                                onClick={handleFilter}
                            >
                                Lọc
                            </Button>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Col>
                    <Col xs={24} sm={2} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            style={{ 
                                background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                            }}
                        >
                            Gán dịch vụ
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Data Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} dịch vụ phòng`,
                        pageSizeOptions: ['5', '10', '20', '50']
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                    bordered
                    style={{ 
                        background: 'white',
                        borderRadius: '8px'
                    }}
                    rowClassName={(record) => {
                        const price = record.servicePrice || 0;
                        if (price === 0) return 'free-service';
                        if (price >= 500000) return 'premium-service';
                        if (price >= 100000) return 'standard-service';
                        return 'basic-service';
                    }}
                />
            </Card>

            {/* Modals */}
            <ModalCreateRoomService
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />

            <ModalUpdateRoomService
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                serviceId={selectedServiceId}
            />

            <style jsx>{`
                .free-service {
                    background-color: #f6ffed !important;
                }
                .basic-service {
                    background-color: #e6f7ff !important;
                }
                .standard-service {
                    background-color: #fffbe6 !important;
                }
                .premium-service {
                    background-color: #fff1f0 !important;
                }
                .free-service:hover,
                .basic-service:hover,
                .standard-service:hover,
                .premium-service:hover {
                    background-color: #bae7ff !important;
                }
            `}</style>
        </div>
    );
};

export default GetAllRoomServiceDetail;