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
    ExportOutlined
} from "@ant-design/icons";
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

    // Fetch all cars
    useEffect(() => {
        const fetchAllCar = async () => {
            setLoading(true);
            try {
                const response = await CarService.getAllCar(token);
                setDataCar(response);
            } catch (error) {
                console.log("Error khi gọi server!");
            } finally {
                setLoading(false);
            }
        }
        fetchAllCar();
    }, [token]);

    // Fetch all rooms
    useEffect(() => {
        const fetchAllRoom = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setDataRoom(response);
            } catch (error) {
                console.log("Error khi gọi server !");
            }
        }
        fetchAllRoom();
    }, [token]);

    // Fetch all customers
    useEffect(() => {
        const fetchAllCustomer = async () => {
            try {
                const response = await CustomerService.getAllCustomers(token);
                setDataCustomer(response);
            } catch (error) {
                console.log("Error khi gọi server !");
            }
        }
        fetchAllCustomer();
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
            // Reset to original data if search is empty
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
            return;
        }

        const filtered = filterData.filter((item) =>
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
                    setDataCar(dataCar.filter(item => item.id !== record.id));
                    Modal.success({
                        content: "Xóa xe thành công!",
                    });
                    window.location.reload();
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
        navigate("/car-management/createCar");
    };

    const editCar = (record) => {
        navigate(`/car-management/updateCar/${record.id}`);
    };

    const getCarTypeColor = (type) => {
        const typeColors = {
            'Xe máy': 'blue',
            'Xe đạp': 'green',
            'Ô tô': 'red',
            'Xe điện': 'orange'
        };
        return typeColors[type] || 'default';
    };

    const columns = [
        {
            title: '#',
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: "Thông tin xe",
            key: "carInfo",
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Space>
                        <Avatar 
                            size={32} 
                            icon={<CarOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
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
            ),
            width: 150,
        },
        {
            title: "Phòng trọ",
            dataIndex: "room",
            key: "room",
            render: (room, record) => (
                <Space>
                    <HomeOutlined style={{ color: '#52c41a' }} />
                    <Text>{record.roomName}</Text>
                </Space>
            ),
            sorter: (a, b) => a.roomName.localeCompare(b.roomName),
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            render: (customer, record) => (
                <Space>
                    <UserOutlined style={{ color: '#faad14' }} />
                    <Text>{record.customerName}</Text>
                </Space>
            ),
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        },
        {
            title: "Loại xe",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={getCarTypeColor(type)}>
                    {type}
                </Tag>
            ),
            sorter: (a, b) => a.type.localeCompare(b.type)
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
                    <div>
                        <Text strong>Màu: </Text>
                        <Tag 
                            color={record.color.toLowerCase()} 
                            style={{ 
                                color: ['yellow', 'white', 'light'].some(c => 
                                    record.color.toLowerCase().includes(c)
                                ) ? '#000' : '#fff' 
                            }}
                        >
                            {record.color}
                        </Tag>
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
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="primary" 
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => editCar(record)}
                            ghost
                        />
                    </Tooltip>
                    <Tooltip title="Xóa xe">
                        <Button 
                            type="primary" 
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteCar(record)}
                            ghost
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const carStats = {
        total: dataCar.length,
        motorcycle: dataCar.filter(car => car.type === 'Xe máy').length,
        bicycle: dataCar.filter(car => car.type === 'Xe đạp').length,
        car: dataCar.filter(car => car.type === 'Ô tô').length,
        electric: dataCar.filter(car => car.type === 'Xe điện').length,
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
                        <CarOutlined />
                        Quản lý xe phòng trọ
                    </Title>
                    <Text type="secondary">
                        Quản lý thông tin xe của khách thuê trọ
                    </Text>
                </div>

                <Divider />

                {/* Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #1890ff' }}>
                            <Statistic 
                                title="Tổng số xe" 
                                value={carStats.total}
                                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #52c41a' }}>
                            <Statistic 
                                title="Xe máy" 
                                value={carStats.motorcycle}
                                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #faad14' }}>
                            <Statistic 
                                title="Xe đạp" 
                                value={carStats.bicycle}
                                valueStyle={{ color: '#faad14', fontSize: '20px' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" style={{ textAlign: 'center', borderLeft: '4px solid #f5222d' }}>
                            <Statistic 
                                title="Ô tô" 
                                value={carStats.car}
                                valueStyle={{ color: '#f5222d', fontSize: '20px' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Search and Actions */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} md={16}>
                        <Search
                            placeholder="Tìm kiếm theo mã xe, biển số, phòng, khách hàng..."
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
                                onClick={addCar}
                                style={{
                                    borderRadius: '8px',
                                    fontWeight: 'bold'
                                }}
                            >
                                Thêm xe mới
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Table */}
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
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px'
                    }}
                    rowClassName={(record, index) => 
                        index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                    }
                />
            </Card>

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

export default GetAllCar;