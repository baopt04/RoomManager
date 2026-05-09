import React, { useState, useEffect } from "react";
import {
    Table,
    Input,
    Button,
    Space,
    Modal,
    Card,
    Typography,
    Tag,
    Row,
    Col,
    Statistic,
    Tooltip,
    Avatar,
    Divider,
    Badge,
    Pagination
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CarOutlined,
    HomeOutlined,
    UserOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { FaMotorcycle, FaBicycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CarService from "../../services/CarService";

const { Title, Text } = Typography;

const GetAllCar = () => {
    const token = localStorage.getItem('token');
    const [dataCar, setDataCar] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState("Tất cả");
    const navigate = useNavigate();
    const [keyWord, setKeyWord] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const fetchAllData = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        try {
            const response = await CarService.getAllCar(token, page, size);
            const content = response.content || [];
            setDataCar(content);
            setCurrentPage(response.number !== undefined ? response.number : 0);
            setTotalElements(response.totalElements !== undefined ? response.totalElements : content.length);
            setPageSize(response.size !== undefined ? response.size : 10);
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData(0, pageSize);
    }, [token]);

    const handlePageChange = (page, size) => {
        const zeroBasedPage = page - 1;
        setCurrentPage(zeroBasedPage);
        setPageSize(size);
        fetchAllData(zeroBasedPage, size);
    };

    useEffect(() => {
        if (dataCar.length > 0) {
            const mapped = dataCar.map(item => {
                return {
                    ...item,
                    roomName: item.room || "Chưa có dữ liệu",
                    customerName: item.customer || "Chưa có khách hàng"
                };
            });

            const sorted = mapped.sort((a, b) => {
                const houseA = a.houseForRent || "";
                const houseB = b.houseForRent || "";
                if (houseA !== houseB) return houseA.localeCompare(houseB);
                return (a.roomName || "").localeCompare(b.roomName || "");
            });

            setFilterData(sorted);
            setOriginalData(sorted);
        }
    }, [dataCar]);

    const houses = ["Tất cả", ...new Set(originalData.map(item => item.houseForRent).filter(Boolean))];

    const handleSearch = (value) => {
        setKeyWord(value);
        let dataToFilter = originalData;
        if (selectedHouse !== "Tất cả") {
            dataToFilter = originalData.filter(item => item.houseForRent === selectedHouse);
        }

        if (!value.trim()) {
            setFilterData(dataToFilter);
            return;
        }

        const filtered = dataToFilter.filter((item) =>
            Object.values(item).some((val) =>
                val &&
                val.toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilterData(filtered);
    };

    const handleHouseChange = (house) => {
        setSelectedHouse(house);
        let dataToFilter = originalData;
        if (house !== "Tất cả") {
            dataToFilter = originalData.filter(item => item.houseForRent === house);
        }

        if (!keyWord.trim()) {
            setFilterData(dataToFilter);
            return;
        }

        const filtered = dataToFilter.filter((item) =>
            Object.values(item).some((val) =>
                val &&
                val.toString().toLowerCase().includes(keyWord.toLowerCase())
            )
        );
        setFilterData(filtered);
    };

    const deleteCar = async (record) => {
        Modal.confirm({
            title: "Xóa xe phòng trọ",
            content: "Bạn có chắc chắn muốn xóa xe này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            onOk: async () => {
                try {
                    await CarService.deleteCar(token, record.id);
                    setDataCar((prev) => prev.filter(item => item.id !== record.id));
                    Modal.success({
                        content: "Xóa xe thành công!",
                    });
                } catch (error) {
                    console.error("Error deleting car:", error);
                    Modal.error({
                        content: "Không thể xóa xe, vui lòng thử lại sau!",
                    });
                }
            },
        });
    };

    const addCar = () => {
        navigate("/admin/cars/create");
    };

    const editCar = (record) => {
        navigate(`/admin/cars/${record.id}/edit`);
    };

    const CAR_TYPE_MAP = {
        'XE_MAY': { label: 'Xe máy', color: 'blue', icon: <FaMotorcycle /> },
        'XE_O_TO': { label: 'Ô tô', color: 'volcano', icon: <CarOutlined /> },
        'XE_DAP': { label: 'Xe đạp', color: 'green', icon: <FaBicycle /> },
        'XE_DAP_DIEN': { label: 'Xe điện', color: 'orange', icon: <FaMotorcycle /> }
    };

    const COLOR_HEX_MAP = {
        'Trắng': '#FFFFFF',
        'Đen': '#000000',
        'Xám': '#808080',
        'Bạc': '#C0C0C0',
        'Đỏ': '#FF0000',
        'Xanh dương': '#0000FF',
        'Xanh lá': '#008000',
        'Vàng': '#FFFF00',
        'Nâu': '#A52A2A',
    };

    const columns = [
        {
            title: "Nhà",
            dataIndex: "houseForRent",
            key: "houseForRent",
            width: 150,
            onCell: (record, index) => {
                let rowSpan = 0;
                if (index === 0 || filterData[index - 1]?.houseForRent !== record.houseForRent) {
                    for (let i = index; i < filterData.length; i++) {
                        if (filterData[i].houseForRent === record.houseForRent) {
                            rowSpan++;
                        } else {
                            break;
                        }
                    }
                }
                return { rowSpan };
            },
            render: (text) => <Text strong><HomeOutlined style={{ marginRight: 8 }} />{text || "Chưa xác định"}</Text>
        },
        {
            title: "Phòng trọ",
            dataIndex: "roomName",
            key: "roomName",
            width: 150,
            onCell: (record, index) => {
                let rowSpan = 0;
                // logic rowSpan for current page
                if (index === 0 || 
                    filterData[index - 1]?.roomName !== record.roomName || 
                    filterData[index - 1]?.houseForRent !== record.houseForRent) {
                    for (let i = index; i < filterData.length; i++) {
                        if (filterData[i].roomName === record.roomName && filterData[i].houseForRent === record.houseForRent) {
                            rowSpan++;
                        } else {
                            break;
                        }
                    }
                }
                return { rowSpan };
            },
            render: (roomName) => (
                <Space>
                    <HomeOutlined style={{ color: '#52c41a' }} />
                    <Text>{roomName || "Chưa có dữ liệu"}</Text>
                </Space>
            )
        },
        {
            title: "Thông tin xe",
            key: "carInfo",
            render: (_, record) => {
                const typeInfo = CAR_TYPE_MAP[record.type] || { icon: <CarOutlined />, color: '#1890ff' };
                return (
                    <Space direction="vertical" size={0}>
                        <Space>
                            <Avatar
                                size={32}
                                icon={typeInfo.icon}
                                style={{ backgroundColor: typeInfo.color === 'volcano' ? '#f5222d' : (typeInfo.color === 'blue' ? '#1890ff' : (typeInfo.color === 'green' ? '#52c41a' : '#faad14')) }}
                            />
                            <div>
                                <Text strong>{record.code}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {record.licensePlate}
                                </Text>
                            </div>
                        </Space>
                    </Space>
                );
            },
            width: 150,
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            render: (customer, record) => (
                <Space>
                    <UserOutlined style={{ color: '#faad14' }} />
                    <Text>{record.customer}</Text>
                </Space>
            ),
            sorter: (a, b) => a.customer.localeCompare(b.customer),
        },
        {
            title: "Loại xe",
            dataIndex: "type",
            key: "type",
            render: (carType) => {
                const typeInfo = CAR_TYPE_MAP[carType] || { label: carType, color: 'default' };
                return (
                    <Tag color={typeInfo.color}>
                        {typeInfo.label}
                    </Tag>
                );
            },
            sorter: (a, b) => (a.carType || '').localeCompare(b.carType || '')
        },
        {
            title: "Chi tiết",
            key: "details",
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <Text strong>Hãng: </Text>
                        <Text>{record.brandCar}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text strong>Màu: </Text>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: record.color?.startsWith('#') ? record.color : (COLOR_HEX_MAP[record.color] || '#d9d9d9'),
                            border: '1px solid #d9d9d9'
                        }} />
                        <Text>{record.color?.startsWith('#') ? 'Màu tùy chọn' : record.color}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => editCar(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa xe">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteCar(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const groupedData = filterData.reduce((acc, item) => {
        const house = item.houseForRent || "Chưa xác định";
        if (!acc[house]) acc[house] = [];
        acc[house].push(item);
        return acc;
    }, {});

    const carStats = {
        total: dataCar.length,
        motorcycle: dataCar.filter(car => car.carType === 'XE_MAY').length,
        bicycle: dataCar.filter(car => car.carType === 'XE_DAP').length,
        car: dataCar.filter(car => car.carType === 'XE_O_TO').length,
        electric: dataCar.filter(car => car.carType === 'XE_DAP_DIEN').length,
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Quản lý xe phòng trọ
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Danh sách và quản lý thông tin xe của khách thuê trọ
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addCar}
                >
                    Thêm xe mới
                </Button>
            </div>

            <Row gutter={16} className="stat-row">
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng số xe"
                            value={carStats.total}
                            prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Xe máy"
                            value={carStats.motorcycle}
                            prefix={<CarOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Xe đạp"
                            value={carStats.bicycle}
                            prefix={<CarOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Ô tô"
                            value={carStats.car}
                            prefix={<CarOutlined style={{ color: '#f5222d' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        allowClear
                        value={keyWord}
                        onChange={(e) => handleSearch(e.target.value)}
                        onPressEnter={() => handleSearch(keyWord)}
                        style={{ width: 240 }}
                    />
                    <Divider type="vertical" style={{ height: 32 }} />
                    <Text strong>Lọc theo nhà:</Text>
                    <div style={{ overflowX: 'auto', flex: 1 }}>
                        <Space>
                            {houses.map(house => (
                                <Tag.CheckableTag
                                    key={house}
                                    checked={selectedHouse === house}
                                    onChange={() => handleHouseChange(house)}
                                    style={{ border: '1px solid #d9d9d9', padding: '4px 12px', fontSize: '13px' }}
                                >
                                    {house}
                                </Tag.CheckableTag>
                            ))}
                        </Space>
                    </div>
                    <Button icon={<SearchOutlined />} onClick={() => handleSearch(keyWord)}>
                        Tìm
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setKeyWord('');
                            setSelectedHouse("Tất cả");
                            setCurrentPage(0);
                            fetchAllData(0, pageSize);
                        }}
                    >
                        Làm mới
                    </Button>
                </div>
            </Card>

            {/* Grouped Data Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {Object.entries(groupedData).map(([house, items]) => (
                    <Card 
                        key={house} 
                        title={
                            <Space>
                                <HomeOutlined style={{ color: '#1890ff' }} />
                                <Text strong style={{ fontSize: '16px' }}>{house}</Text>
                                <Badge count={items.length} style={{ backgroundColor: '#52c41a' }} />
                            </Space>
                        }
                        size="small"
                        className="house-card"
                    >
                        <Table
                            columns={columns.filter(col => col.key !== 'houseForRent')}
                            dataSource={items}
                            loading={loading}
                            pagination={false}
                            scroll={{ x: 1200 }}
                            size="middle"
                            rowKey="id"
                        />
                    </Card>
                ))}
            </div>

            {totalElements > 0 && (
                <div style={{ textAlign: 'right', marginTop: '16px', marginBottom: '24px' }}>
                    <Pagination
                        current={currentPage + 1}
                        pageSize={pageSize}
                        total={totalElements}
                        showSizeChanger
                        onChange={handlePageChange}
                        showTotal={(total) => `Tổng số ${total} bản ghi`}
                    />
                </div>
            )}

            <style jsx>{`
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllCar;

