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
    Statistic,
    Pagination
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
    CheckCircleOutlined,
    HomeOutlined
} from "@ant-design/icons";
import ElectricityService from "../../services/ElectricityService";
import ModalCreateElectricity from "./ModalCreateElectricity";
import ModalUpdateElectricity from "./ModalUpdateElectricity";
import ModalDetailHistory from "./ModalDetailHistory";

const { Title, Text } = Typography;

const GetAllElectricity = () => {
    const token = localStorage.getItem('token');

    const [dataElectricity, setDataElectricity] = useState([]);
    const [isModalCreate, setIsModaCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [selectIdRoom, setSelectIdRoom] = useState(null);
    const [keyWord, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [selectIdElectricity, setSelectIdElectricity] = useState(null);
    const [isModalDetailHistory, setIsModalDetailHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState("Tất cả");

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const fetchAllData = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        try {
            const response = await ElectricityService.getAllElectricity(token, page, size);
            const content = response.content || [];
            setDataElectricity(content);
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
        if (dataElectricity.length > 0) {
            const mapped = dataElectricity.map((item, index) => {
                return {
                    ...item,
                    key: item.id,
                    roomName: item.room || "Không xác định"
                };
            });

            mapped.sort((a, b) => {
                const houseA = a.houseForRent || "";
                const houseB = b.houseForRent || "";
                if (houseA !== houseB) return houseA.localeCompare(houseB);
                return (a.roomName || "").localeCompare(b.roomName || "");
            });

            setFilterData(mapped);
            setOriginalData(mapped);
        }
    }, [dataElectricity]);

    const houses = ["Tất cả", ...new Set(originalData.map(item => item.houseForRent).filter(Boolean))];

    const searchElectricity = () => {
        let dataToFilter = originalData;
        if (selectedHouse !== "Tất cả") {
            dataToFilter = originalData.filter(item => item.houseForRent === selectedHouse);
        }

        if (!keyWord.trim()) {
            setFilterData(dataToFilter);
            return;
        }

        const filtered = dataToFilter.filter((item) =>
            Object.values(item).some((value) =>
                value &&
                value.toString().toLowerCase().includes(keyWord.toLowerCase())
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

    const resetSearch = () => {
        setKeyWord("");
        setSelectedHouse("Tất cả");
        setCurrentPage(0);
        fetchAllData(0, pageSize);
    };

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
            width: 130,
            onCell: (record, index) => {
                let rowSpan = 0;
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
            title: "Mã số",
            dataIndex: "code",
            key: "code",
            width: 100,
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (code) => <Text strong>{code}</Text>
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

    const groupedData = filterData.reduce((acc, item) => {
        const house = item.houseForRent || "Chưa xác định";
        if (!acc[house]) acc[house] = [];
        acc[house].push(item);
        return acc;
    }, {});

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
                    <Button icon={<SearchOutlined />} onClick={searchElectricity}>
                        Tìm
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={resetSearch}>
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

            {/* Modals */}
            <ModalCreateElectricity
                visible={isModalCreate}
                onClose={() => setIsModaCreate(false)}
                onSuccess={() => fetchAllData(currentPage, pageSize)}
            />
            <ModalUpdateElectricity
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                id={selectIdRoom}
                onSuccess={() => fetchAllData(currentPage, pageSize)}
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

