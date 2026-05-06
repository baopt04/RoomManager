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
    Badge,
    Avatar
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    EyeFilled,
    ReloadOutlined,
    ToolOutlined,
    DollarOutlined,
    FileTextOutlined,
    CalendarOutlined,
    SettingOutlined,
    AppstoreOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Services from "../../services/Services";
import ModalCreateService from "./ModalCreateService";
import ModalUpdateService from "./ModalUpdateService";
import ModalDetailService from "./ModalDetailService";

const { Title, Text } = Typography;
const { Option } = Select;

const GetAllService = () => {
    const [searchText, setSearchText] = useState("");
    const [dataService, setDataService] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [unitFilter, setUnitFilter] = useState("ALL");
    const [priceFilter, setPriceFilter] = useState("ALL");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Fetch services data
    useEffect(() => {
        fetchServices();
    }, [token]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await Services.getAllService(token);

            

            const servicesWithIndex = response.map((service, index) => ({
                ...service,
                stt: index + 1,
                key: service.id
            }));
            setDataService(servicesWithIndex);
            setFilteredData(servicesWithIndex);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu dịch vụ!");
            console.error("Failed to fetch service:", error);
        } finally {
            setLoading(false);
        }
    };

    // Search and filter function
    const handleFilter = () => {
        let filtered = [...dataService];

        // Filter by keyword
        if (searchText.trim()) {
            filtered = filtered.filter((item) =>
                Object.values(item).some((value) =>
                    value !== null &&
                    value !== undefined &&
                    value.toString().trim().toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }

        // Filter by unit
        if (unitFilter !== "ALL") {
            filtered = filtered.filter(item => item.unitOfMeasure === unitFilter);
        }

        // Filter by price range
        if (priceFilter !== "ALL") {
            filtered = filtered.filter(item => {
                const price = item.price || 0;
                switch (priceFilter) {
                    case "LOW": return price < 100000;
                    case "MEDIUM": return price >= 100000 && price < 500000;
                    case "HIGH": return price >= 500000;
                    default: return true;
                }
            });
        }

        setFilteredData(filtered);
    };

    const resetFilters = () => {
        setSearchText("");
        setUnitFilter("ALL");
        setPriceFilter("ALL");
        fetchServices();
    };

    const handleEdit = (id) => {
        setSelectedServiceId(id);
        setIsModalUpdate(true);
    };

    const detailService = (id) => {
        setSelectedServiceId(id);
        setIsModalDetail(true);
    };

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const UnitBadge = ({ unit }) => {
        const unitConfig = {
            'THÁNG': { color: 'green', icon: <CalendarOutlined /> },
            'NGÀY': { color: 'blue', icon: <CalendarOutlined /> },
            'LẦN': { color: 'orange', icon: <SettingOutlined /> },
            'NGƯỜI': { color: 'purple', icon: <SettingOutlined /> },
            'default': { color: 'default', icon: <SettingOutlined /> }
        };

        const config = unitConfig[unit] || unitConfig['default'];

        return (
            <Tag color={config.color} icon={config.icon}>
                {unit}
            </Tag>
        );
    };

    // Price badge component
    const PriceBadge = ({ price }) => {
        let color = 'default';
        let text = 'Miễn phí';

        if (price > 0) {
            if (price < 100000) color = 'green';
            else if (price < 500000) color = 'orange';
            else color = 'red';

            text = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(price);
        }

        return (
            <Text strong style={{
                color: price === 0 ? '#52c41a' :
                    price < 100000 ? '#1890ff' :
                        price < 500000 ? '#faad14' : '#f5222d'
            }}>
                {text}
            </Text>
        );
    };

    // Calculate statistics
    const totalServices = filteredData.length;
    const monthlyServices = filteredData.filter(service => service.unitOfMeasure === 'THÁNG').length;
    const averagePrice = filteredData.reduce((sum, service) => sum + (service.price || 0), 0) / totalServices || 0;
    const highValueServices = filteredData.filter(service => (service.price || 0) >= 500000).length;

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 80,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: (
                <Space>
                    <FileTextOutlined />
                    Mã dịch vụ
                </Space>
            ),
            dataIndex: "code",
            key: "code",
            width: 150,
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (code) => <Text strong>{code}</Text>
        },
        {
            title: (
                <Space>
                    <ToolOutlined />
                    Tên dịch vụ
                </Space>
            ),
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name) => (
                <Tooltip title={name}>
                    <Space>
                        <Avatar
                            size="small"
                            style={{ backgroundColor: '#1890ff' }}
                            icon={<ToolOutlined />}
                        />
                        <Text strong>{name}</Text>
                    </Space>
                </Tooltip>
            )
        },
        {
            title: (
                <Space>
                    <DollarOutlined />
                    Giá dịch vụ
                </Space>
            ),
            dataIndex: "price",
            key: "price",
            width: 160,
            align: 'right',
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            render: (price) => <PriceBadge price={price} />
        },
        {
            title: (
                <Space>
                    <AppstoreOutlined />
                    Đơn vị tính
                </Space>
            ),
            dataIndex: "unitOfMeasure",
            key: "unitOfMeasure",
            width: 150,
            align: 'center',
            render: (unitOfMeasure) => <UnitBadge unit={unitOfMeasure} />
        },
        {
            title: "Mô tả",
            dataIndex: 'description',
            key: "description",
            width: 250,
            render: (description) => (
                <Text>
                    {description || "Không có mô tả"}
                </Text>
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
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeFilled />}
                            onClick={() => detailService(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Quản lý dịch vụ
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Danh sách và quản lý thông tin các dịch vụ tiện ích
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm dịch vụ
                </Button>
            </div>

            {/* Statistics */}
            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng dịch vụ"
                            value={totalServices}
                            prefix={<ToolOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Dịch vụ theo tháng"
                            value={monthlyServices}
                            prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Dịch vụ cao cấp"
                            value={highValueServices}
                            prefix={<DollarOutlined style={{ color: '#f5222d' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Giá trung bình"
                            value={averagePrice}
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

            {/* Filters Section */}
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
                        placeholder="Đơn vị tính"
                        value={unitFilter}
                        onChange={setUnitFilter}
                        style={{ width: 150 }}
                    >
                        <Option value="ALL">Tất cả đơn vị</Option>
                        <Option value="THÁNG">Theo tháng</Option>
                        <Option value="NGÀY">Theo ngày</Option>
                        <Option value="LẦN">Theo lần</Option>
                        <Option value="NGƯỜI">Theo người</Option>
                    </Select>
                    <Select
                        placeholder="Mức giá"
                        value={priceFilter}
                        onChange={setPriceFilter}
                        style={{ width: 150 }}
                    >
                        <Option value="ALL">Tất cả mức giá</Option>
                        <Option value="LOW">Dưới 100K</Option>
                        <Option value="MEDIUM">100K - 500K</Option>
                        <Option value="HIGH">Trên 500K</Option>
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
                    rowKey="id"
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
            <ModalCreateService
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={fetchServices}
            />

            <ModalUpdateService
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                serviceId={selectedServiceId}
                onSuccess={fetchServices}
            />

            <ModalDetailService
                visible={isModalDetail}
                onClose={() => setIsModalDetail(false)}
                serviceId={selectedServiceId}
            />

            <style jsx>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .stat-row {
                    margin-bottom: 16px;
                }
                .filter-bar {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllService;

