import React, { useState, useEffect } from "react";
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
    Divider,
    Badge,
    Statistic
} from "antd";
import { 
    SearchOutlined, 
    PlusOutlined, 
    EditOutlined, 
    EyeOutlined,
    ReloadOutlined,
    DropboxOutlined,
    DollarOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import WaterService from "../../services/WaterService";
import ModalCreateWater from "./ModalCreateWater";
import ModalUpdateWater from "./ModalUpdateWater";
import ModalDetailWaterHistory from "./ModalDetailWaterHistory";

const { Title, Text } = Typography;

const GetAllWater = () => {
    const token = localStorage.getItem('token');
    
    // States
    const [dataWater, setDataWater] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [isModalCreate, setIsModaCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [selectIdRoom, setSelectIdRoom] = useState(null);
    const [keyword, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [selectIdWater, setSelectIdWater] = useState(null);
    const [isModalDetailHistory, setIsModalDetailHistory] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch water data
    useEffect(() => {
        const fetchAllWater = async () => {
            setLoading(true);
            try {
                const response = await WaterService.getAllWater(token);
                setDataWater(response);
            } catch (error) {
                console.log("Error khi gọi server!", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllWater();
    }, [token]);

    // Fetch rooms
    useEffect(() => {
        const fetchAllRoom = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setDataRoom(response);
            } catch (error) {
                console.log("Error khi gọi server!", error);
            }
        }
        fetchAllRoom();
    }, [token]);

    // Map water data with room info
    useEffect(() => {
        if (dataWater.length > 0 && dataRoom.length > 0) {
            const mapped = dataWater.map((item, index) => {
                const room = dataRoom.find(r => r.id === item.room);
                return {
                    ...item,
                    key: item.id,
                    stt: index + 1,
                    roomName: room ? room.name : "Không xác định"
                };
            });
            setFilterData(mapped);
            setOriginalData(mapped);
        }
    }, [dataWater, dataRoom]);

    // Search functionality
    const searchWater = () => {
        if (!keyword.trim()) {
            setFilterData(originalData);
            return;
        }
        
        const filtered = originalData.filter((item) =>
            Object.values(item).some((value) =>
                value &&
                value.toString().toLowerCase().includes(keyword.toLowerCase())
            )
        );
        setFilterData(filtered);
    };

    // Reset search
    const resetSearch = () => {
        setKeyWord("");
        setFilterData(originalData);
    };

    // Modal handlers
    const openModalCreate = () => {
        setIsModaCreate(true);
    };

    const editWater = (id) => {
        setSelectIdRoom(id);
        setIsModalUpdate(true);
    };

    const detailHistoryWater = (id) => {
        setSelectIdWater(id);
        setIsModalDetailHistory(true);
    };

    // Currency formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount || 0);
    };

    // Number formatter (for water readings)
    const formatNumber = (number) => {
        return new Intl.NumberFormat("vi-VN").format(number || 0);
    };

    // Status render
    const renderStatus = (status) => {
        return status === "DA_THANH_TOAN" ? (
            <Tag color="success" icon={<DollarOutlined />}>Đã thanh toán</Tag>
        ) : (
            <Tag color="error" icon={<CalendarOutlined />}>Chưa thanh toán</Tag>
        );
    };

    // Calculate statistics
    const totalAmount = filterData.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const paidCount = filterData.filter(item => item.status === "DA_THANH_TOAN").length;
    const unpaidCount = filterData.length - paidCount;

    // Table columns
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center",
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: "Mã số",
            dataIndex: "code",
            key: "code",
            width: 100,
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (code) => <Text strong>{code}</Text>
        },
        {
            title: "Phòng trọ",
            dataIndex: "roomName",
            key: "roomName",
            width: 110,
            sorter: (a, b) => a.roomName.localeCompare(b.roomName),
            render: (roomName) => (
                <Badge 
                    status="processing" 
                    text={roomName || "Chưa có dữ liệu"}
                />
            )
        },
        {
            title: "Tháng/Năm",
            key: "monthYear",
            width: 100,
            align: "center",
            sorter: (a, b) => {
                const aDate = new Date(a.year, a.mother - 1);
                const bDate = new Date(b.year, b.mother - 1);
                return aDate - bDate;
            },
            render: (_, record) => (
                <Tag color="blue">
                    {String(record.mother).padStart(2, '0')}/{record.year}
                </Tag>
            )
        },
        {
            title: "Chỉ số đầu",
            dataIndex: "numberFirst",
            key: "numberFirst",
            width: 100,
            align: "right",
            sorter: (a, b) => a.numberFirst - b.numberFirst,
            render: (number) => (
                <Text type="secondary">{formatNumber(number)} m³</Text>
            )
        },
        {
            title: "Chỉ số cuối",
            dataIndex: "numberLast", 
            key: "numberLast",
            width: 100,
            align: "right",
            sorter: (a, b) => a.numberLast - b.numberLast,
            render: (number) => (
                <Text strong>{formatNumber(number)} m³</Text>
            )
        },
        {
            title: "Đơn giá",
            dataIndex: "unitPrice",
            key: "unitPrice",
            width: 100,
            align: "right",
            sorter: (a, b) => a.unitPrice - b.unitPrice,
            render: (price) => (
                <Text type="warning">{formatCurrency(price)}</Text>
            )
        },
        {
            title: "Lượng tiêu thụ",
            dataIndex: "dataClose",
            key: "dataClose", 
            width: 110,
            align: "right",
            sorter: (a, b) => a.dataClose - b.dataClose,
            render: (usage, record) => {
                const consumption = (record.numberLast || 0) - (record.numberFirst || 0);
                return (
                    <Text strong style={{ color: "#1890ff" }}>
                        {formatNumber(consumption)} m³
                    </Text>
                );
            }
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            width: 120,
            align: "right",
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (total) => (
                <Text strong style={{ color: "#52c41a", fontSize: "14px" }}>
                    {formatCurrency(total)}
                </Text>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            align: "center",
            filters: [
                { text: "Đã thanh toán", value: "DA_THANH_TOAN" },
                { text: "Chưa thanh toán", value: "CHUA_THANH_TOAN" }
            ],
            onFilter: (value, record) => record.status === value,
            render: renderStatus
        },
        {
            title: "Thao tác",
            key: "action",
            width: 140,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => editWater(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            style={{ backgroundColor: "#ff9c6e", borderColor: "#ff9c6e", color: "white" }}
                            onClick={() => detailHistoryWater(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Header */}
            <Card style={{ marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <Title level={2} style={{ textAlign: "center", margin: 0, color: "#1890ff" }}>
                    <DropboxOutlined style={{ marginRight: "8px" }} />
                    Quản lý nước phòng trọ
                </Title>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={totalAmount}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8}>
                    <Card>
                        <Statistic
                            title="Đã thanh toán"
                            value={paidCount}
                            valueStyle={{ color: '#3f8600' }}
                            suffix={`/ ${filterData.length}`}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={8}>
                    <Card>
                        <Statistic
                            title="Chưa thanh toán"
                            value={unpaidCount}
                            valueStyle={{ color: '#cf1322' }}
                            suffix={`/ ${filterData.length}`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search and Actions */}
            <Card style={{ marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12} lg={8}>
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                placeholder="Tìm kiếm thông tin nước..."
                                value={keyword}
                                onChange={(e) => setKeyWord(e.target.value)}
                                onPressEnter={searchWater}
                                prefix={<SearchOutlined />}
                            />
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                                onClick={searchWater}
                            >
                                Tìm
                            </Button>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={resetSearch}
                                title="Reset"
                            />
                        </Space.Compact>
                    </Col>
                    <Col xs={24} md={12} lg={16}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={openModalCreate}
                                style={{ 
                                    background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)"
                                }}
                            >
                                Thêm thông tin nước
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: "16px 0" }} />
                
                <Row gutter={[16, 16]}>
                    <Col>
                        <Text type="secondary">
                            Tổng số bản ghi: <Text strong>{filterData.length}</Text>
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
                    scroll={{ x: 1400 }}
                    bordered
                    size="middle"
                    summary={(pageData) => {
                        let totalAmount = 0;
                        let totalConsumption = 0;
                        
                        pageData.forEach(({ totalPrice, numberFirst, numberLast }) => {
                            totalAmount += totalPrice || 0;
                            totalConsumption += (numberLast || 0) - (numberFirst || 0);
                        });

                        return (
                            <Table.Summary.Row style={{ backgroundColor: "#fafafa" }}>
                                <Table.Summary.Cell index={0} colSpan={7}>
                                    <Text strong>Tổng cộng trang này:</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                    <Text strong style={{ color: "#1890ff" }}>
                                        {formatNumber(totalConsumption)} m³
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <Text strong style={{ color: "#52c41a" }}>
                                        {formatCurrency(totalAmount)}
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} colSpan={2}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </Card>

            {/* Modals */}
            <ModalCreateWater
                visible={isModalCreate}
                onClose={() => setIsModaCreate(false)}
            />
            <ModalUpdateWater
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                id={selectIdRoom}
            />
            <ModalDetailWaterHistory
                visible={isModalDetailHistory}
                onClose={() => setIsModalDetailHistory(false)}
                id={selectIdWater}
            />
        </div>
    );
};

export default GetAllWater;