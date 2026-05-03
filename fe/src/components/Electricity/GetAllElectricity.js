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
    ThunderboltOutlined,
    DollarOutlined,
    CalendarOutlined,
    BulbOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import ElectricityService from "../../services/ElectricityService";
import ModalCreateElectricity from "./ModalCreateElectricity";
import ModalUpdateElectricity from "./ModalUpdateElectricity";
import ModalDetailHistory from "./ModalDetailHistory";

const { Title, Text } = Typography;

const GetAllElectricity = () => {
    const token = localStorage.getItem('token');

    const [dataElectricity, setDataElectricity] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [isModalCreate, setIsModaCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [selectIdRoom, setSelectIdRoom] = useState(null);
    const [keyWord, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [selectIdElectricity, setSelectIdElectricity] = useState(null);
    const [isModalDetailHistory, setIsModalDetailHistory] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchAllData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const [electricityResponse, roomResponse] = await Promise.all([
                ElectricityService.getAllElectricity(token),
                RoomService.getAllRooms(token)
            ]);

            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 2000) {
                await new Promise(resolve => setTimeout(resolve, 2000 - elapsedTime));
            }

            setDataElectricity(electricityResponse);
            setDataRoom(roomResponse);
        } catch (error) {
            console.log("Error khi gọi server!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [token]);

    // Map electricity data with room info
    useEffect(() => {
        if (dataElectricity.length > 0 && dataRoom.length > 0) {
            const mapped = dataElectricity.map((item, index) => {
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
    }, [dataElectricity, dataRoom]);

    // Search functionality
    const searchElectricity = () => {
        if (!keyWord.trim()) {
            setFilterData(originalData);
            return;
        }

        const filtered = originalData.filter((item) =>
            Object.values(item).some((value) =>
                value &&
                value.toString().toLowerCase().includes(keyWord.toLowerCase())
            )
        );
        setFilterData(filtered);
    };

    const resetSearch = () => {
        setKeyWord("");
        fetchAllData();
    };

    // Modal handlers
    const openModalCreate = () => {
        setIsModaCreate(true);
    };

    const editRoomElectricity = (id) => {
        setSelectIdRoom(id);
        setIsModalUpdate(true);
    };

    const detailHistory = (id) => {
        setSelectIdElectricity(id);
        setIsModalDetailHistory(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount || 0);
    };

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
    const totalConsumption = filterData.reduce((sum, item) =>
        sum + ((item.numberLast || 0) - (item.numberFirst || 0)), 0
    );
    const paidCount = filterData.filter(item => item.status === "DA_THANH_TOAN").length;
    const unpaidCount = filterData.length - paidCount;
    const averagePrice = filterData.length > 0 ?
        filterData.reduce((sum, item) => sum + (item.unitPrice || 0), 0) / filterData.length : 0;

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
            dataIndex: "room",
            key: "room",
            width: 110,
            sorter: (a, b) => a.room.localeCompare(b.room),
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
                <Tag color="orange">
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
                <Text type="secondary">{formatNumber(number)} kWh</Text>
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
                <Text strong>{formatNumber(number)} kWh</Text>
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
            title: "Điện tiêu thụ",
            key: "consumption",
            width: 110,
            align: "right",
            sorter: (a, b) => {
                const aConsumption = (a.numberLast || 0) - (a.numberFirst || 0);
                const bConsumption = (b.numberLast || 0) - (b.numberFirst || 0);
                return aConsumption - bConsumption;
            },
            render: (_, record) => {
                const consumption = (record.numberLast || 0) - (record.numberFirst || 0);
                return (
                    <Text strong style={{ color: "#fa8c16" }}>
                        <ThunderboltOutlined style={{ marginRight: 4 }} />
                        {formatNumber(consumption)} kWh
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
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => editRoomElectricity(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => detailHistory(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Quản lý điện phòng trọ
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Danh sách và quản lý thông tin tiêu thụ điện
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openModalCreate}
                >
                    Thêm thông tin điện
                </Button>
            </div>

            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng doanh thu"
                            value={totalAmount}
                            formatter={(value) => formatCurrency(value)}
                            prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng điện tiêu thụ"
                            value={totalConsumption}
                            suffix="kWh"
                            prefix={<ThunderboltOutlined style={{ color: '#fa8c16' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6} lg={6}>
                    <Card size="small">
                        <Statistic
                            title="Đã thanh toán"
                            value={paidCount}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            suffix={`/ ${filterData.length}`}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6} lg={6}>
                    <Card size="small">
                        <Statistic
                            title="Giá TB/kWh"
                            value={averagePrice}
                            formatter={(value) => formatCurrency(value)}
                            prefix={<BulbOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm thông tin điện..."
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        onPressEnter={searchElectricity}
                        style={{ width: 240 }}
                        allowClear
                    />
                    <Button icon={<SearchOutlined />} onClick={searchElectricity}>
                        Tìm
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={resetSearch}>
                        Làm mới
                    </Button>
                </div>
            </Card>

            {/* Table */}
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
                    scroll={{ x: 1400 }}
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
                                    <Text strong style={{ color: "#fa8c16" }}>
                                        <ThunderboltOutlined style={{ marginRight: 4 }} />
                                        {formatNumber(totalConsumption)} kWh
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
            <ModalCreateElectricity
                visible={isModalCreate}
                onClose={() => setIsModaCreate(false)}
                onSuccess={fetchAllData}
            />
            <ModalUpdateElectricity
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                id={selectIdRoom}
                onSuccess={fetchAllData}
            />
            <ModalDetailHistory
                visible={isModalDetailHistory}
                onClose={() => setIsModalDetailHistory(false)}
                id={selectIdElectricity}
            />
            <style jsx>{`
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllElectricity;