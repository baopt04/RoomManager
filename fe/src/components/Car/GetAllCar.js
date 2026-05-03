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
    Divider
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CarOutlined,
    HomeOutlined,
    UserOutlined,
    ReloadOutlined,
    ExportOutlined,
    RocketOutlined,
} from "@ant-design/icons";
import { FaMotorcycle, FaBicycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RoomService from "../../services/RoomService";
import CarService from "../../services/CarService";
import CustomerService from "../../services/CustomerService";

const { Title, Text } = Typography;
const { Search } = Input;

const GetAllCar = () => {
    const token = localStorage.getItem('token');
    const [dataCar, setDataCar] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [keyWord, setKeyWord] = useState('');
    const [filterData, setFilterData] = useState([]);

    const mapCarData = (cars, rooms, customers) => (
        cars.map(item => {
            const room = rooms.find(r => r.id === item.room);
            const customer = customers.find(c => c.id === item.customer);
            return {
                ...item,
                roomName: room ? room.name : "Chưa có dữ liệu",
                customerName: customer ? customer.name : "Chưa có khách hàng"
            };
        })
    );

    const fetchAllData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const [carResponse, roomResponse, customerResponse] = await Promise.all([
                CarService.getAllCar(token),
                RoomService.getAllRooms(token),
                CustomerService.getAllCustomers(token)
            ]);

            const elapsedTime = Date.now() - startTime;
            if (false && elapsedTime < 2000) {
                await new Promise(resolve => setTimeout(resolve, 2000 - elapsedTime));
            }

            setDataCar(carResponse);
            setDataRoom(roomResponse);
            setDataCustomer(customerResponse);
        } catch (error) {
            console.log("Error khi gọi server!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [token]);

    // Map room names to car data
    useEffect(() => {
        if (dataCar.length > 0) {
            const mapped = dataCar.map(item => {
                const room = dataRoom.find(r => r.id === item.room);
                const customer = dataCustomer.find(c => c.id === item.customer);
                return {
                    ...item,
                    roomName: room ? room.name : "Chưa có dữ liệu",
                    customerName: customer ? customer.name : "Chưa có khách hàng"
                };
            });
            setFilterData(mapped);
        }
    }, [dataCar, dataRoom, dataCustomer]);

    const handleSearch = (value) => {
        setKeyWord(value);
        if (!value.trim()) {
            setFilterData(mapCarData(dataCar, dataRoom, dataCustomer));
            return;
        }

        const filtered = mapCarData(dataCar, dataRoom, dataCustomer).filter((item) =>
            Object.values(item).some((val) =>
                val &&
                val.toString().toLowerCase().includes(value.toLowerCase())
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
            title: 'STT',
            dataIndex: "stt",
            key: "stt",
            width: 80,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt
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
            title: "Phòng trọ",
            dataIndex: "room",
            key: "room",
            render: (room, record) => (
                <Space>
                    <HomeOutlined style={{ color: '#52c41a' }} />
                    <Text>{record.room}</Text>
                </Space>
            ),
            sorter: (a, b) => a.room.localeCompare(b.room),
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
                    <Button icon={<SearchOutlined />} onClick={() => handleSearch(keyWord)}>
                        Tìm
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setKeyWord('');
                            fetchAllData();
                        }}
                    >
                        Làm mới
                    </Button>
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
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} bản ghi`,
                    }}
                    scroll={{ x: 1200 }}
                    rowKey="id"
                    size="middle"
                />
            </Card>

            <style jsx>{`
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllCar;
