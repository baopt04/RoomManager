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
    Badge,
    Statistic
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    EyeOutlined,
    HistoryOutlined,
    ReloadOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    StopOutlined,
    ExclamationCircleOutlined,
    DollarCircleOutlined
} from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import ContractService from "../../services/ContractService";
import HouseForRentService from "../../services/HouseForRentService";
import { useNavigate } from "react-router-dom";
import ModalContractHistory from "./ModalContractHistory";

const { Title, Text } = Typography;

const GetAllContract = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [dataContract, setDataContract] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [dataHouse, setDataHouse] = useState([]);
    const [keyWord, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [modalHistory, setModalHistory] = useState(false);
    const [selectIdRoom, setSelectIdRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const [contractResponse, roomsResponse, houseResponse] = await Promise.all([
                ContractService.getAllcontract(token),
                RoomService.getAllRooms(token),
                HouseForRentService.getAllHouseForRent(token)
            ]);

            // Đảm bảo loading ít nhất 2 giây để phù hợp với môi trường deploy
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 2000) {
                await new Promise(resolve => setTimeout(resolve, 2000 - elapsedTime));
            }

            setDataContract(contractResponse);
            setDataRoom(roomsResponse);
            setDataHouse(houseResponse);
        } catch (error) {
            console.log("Error khi gọi server!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [token]);

    useEffect(() => {
        if (dataContract && dataContract.length > 0) {
            const mapped = dataContract.map((item, index) => {
                const roomNameFromContract = item.room;
                const houseNameFromContract = item.houseForRent;
                const room = dataRoom.find(r => r.name === roomNameFromContract);
                const house = dataHouse.find(h => h.name === houseNameFromContract);
                const finalRoomName = roomNameFromContract || (room ? room.name : "N/A");
                const finalHouseName = houseNameFromContract || (house ? house.name : "Chưa xác định");

                return {
                    ...item,
                    key: item.id,
                    stt: index + 1,
                    roomName: finalRoomName,
                    roomPrice: room ? room.price : (item.roomPrice || 0),
                    houseName: finalHouseName,
                    houseId: finalHouseName !== "Chưa xác định" ? finalHouseName : "unknown"
                };
            });
            setFilterData(mapped);
            setOriginalData(mapped);
            console.log("Mapped contracts by name:", mapped);
        } else if (dataContract && dataContract.length === 0) {
            setFilterData([]);
            setOriginalData([]);
        }
    }, [dataContract, dataRoom, dataHouse]);

    const searchContract = () => {
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

    const openModalCreate = () => {
        navigate("/admin/contracts/create");
    };

    const handleUpdateContract = (record) => {
        navigate(`/admin/contracts/${record.id}/edit`);
    };

    const detailContract = (record) => {
        navigate(`/admin/contracts/${record.id}`);
    };

    const getHistoryContact = (id) => {
        setSelectIdRoom(id);
        setModalHistory(true);
    };

    const renderStatus = (status) => {
        const statusConfig = {
            "KICH_HOAT": { color: "green", text: "Đang sử dụng" },
            "NGUNG_KICH_HOAT": { color: "orange", text: "Ngưng sử dụng" },
            "DUNG_KINH_DOANH": { color: "default", text: "Ngưng KD" }
        };
        const config = statusConfig[status] || { color: "default", text: "Không xác định" };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date(date));
    };

    const getGroupedData = (dataList) => {
        const groups = {};
        dataList.forEach((item) => {
            const houseId = item.houseId || "unknown";
            if (!groups[houseId]) {
                groups[houseId] = {
                    houseId: houseId,
                    houseName: item.houseName,
                    contracts: [],
                    totalDeposit: 0,
                    activeCount: 0,
                    key: houseId
                };
            }
            groups[houseId].contracts.push(item);
            groups[houseId].totalDeposit += item.contractDeponsit || 0;
            if (item.status === "KICH_HOAT") {
                groups[houseId].activeCount += 1;
            }
        });
        return Object.values(groups);
    };

    const groupedData = getGroupedData(filterData);

    const stats = {
        total: filterData.length,
        active: filterData.filter(c => c.status === "KICH_HOAT").length,
        expired: filterData.filter(c => c.status === "NGUNG_KICH_HOAT").length,
        totalDeposit: filterData.reduce((sum, c) => sum + (c.contractDeponsit || 0), 0)
    };

    const mainColumns = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: "Nhà cho thuê",
            key: "houseName",
            render: (_, record) => (
                <Space>
                    <HomeOutlined style={{ color: '#1677ff', fontSize: '18px' }} />
                    <Text strong style={{ fontSize: '15px' }}>{record.houseName}</Text>
                </Space>
            ),
            sorter: (a, b) => a.houseName.localeCompare(b.houseName),
        },
        {
            title: "Số lượng hợp đồng",
            key: "contractCount",
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag color="blue">{record.contracts.length} HĐ</Tag>
                    {record.activeCount > 0 && <Tag color="green">{record.activeCount} Đang sử dụng</Tag>}
                </Space>
            ),
        },
        {
            title: "Tổng tiền cọc",
            key: "totalDeposit",
            align: 'right',
            render: (_, record) => <Text strong>{formatCurrency(record.totalDeposit)}</Text>,
            sorter: (a, b) => a.totalDeposit - b.totalDeposit,
        },
    ];

    const expandedRowRender = (record) => {
        const subColumns = [
            {
                title: "Mã HĐ",
                dataIndex: "code",
                key: "code",
                width: 100,
                render: (code) => <Text style={{ fontSize: '13px', fontWeight: 500 }}>{code}</Text>
            },
            {
                title: "Ngày ký",
                dataIndex: "dateStart",
                key: "dateStart",
                width: 100,
                render: (date) => <Text style={{ fontSize: '13px' }}>{formatDate(date)}</Text>
            },
            {
                title: "Ngày hết hạn",
                dataIndex: "dateEnd",
                key: "dateEnd",
                width: 100,
                render: (date) => <Text style={{ fontSize: '13px' }}>{formatDate(date)}</Text>
            },
            {
                title: "Tiền cọc",
                dataIndex: "contractDeponsit",
                key: "contractDeponsit",
                width: 120,
                align: 'right',
                render: (amount) => <Text style={{ fontSize: '13px' }}>{formatCurrency(amount)}</Text>
            },
            {
                title: "Phòng",
                dataIndex: "roomName",
                key: "roomName",
                width: 90,
                render: (roomName) => <Tag color="cyan">{roomName}</Tag>
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 120,
                align: "center",
                render: renderStatus
            },
            {
                title: "Hành động",
                key: "action",
                width: 120,
                render: (_, item) => (
                    <Space size={4}>
                        <Tooltip title="Sửa">
                            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleUpdateContract(item)} />
                        </Tooltip>
                        <Tooltip title="Chi tiết">
                            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => detailContract(item)} />
                        </Tooltip>
                        <Tooltip title="Lịch sử">
                            <Button type="text" size="small" icon={<HistoryOutlined />} onClick={() => getHistoryContact(item.id)} />
                        </Tooltip>
                    </Space>
                )
            }
        ];

        return (
            <div style={{ padding: '8px 16px', background: '#fafafa', borderRadius: '8px' }}>
                <Table
                    columns={subColumns}
                    dataSource={record.contracts}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 980 }}
                />
            </div>
        );
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Quản lý hợp đồng</Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        {filterData.length} hợp đồng
                    </Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={openModalCreate}>Thêm hợp đồng</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #1677ff' }}>
                        <Statistic
                            title="Tổng hợp đồng"
                            value={stats.total}
                            prefix={<HomeOutlined style={{ color: '#1677ff' }} />}
                            valueStyle={{ fontSize: '20px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #52c41a' }}>
                        <Statistic
                            title="Đang hoạt động"
                            value={stats.active}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a', fontSize: '20px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #ff4d4f' }}>
                        <Statistic
                            title="Hết hạn"
                            value={stats.expired}
                            prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f', fontSize: '20px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card size="small" style={{ borderLeft: '4px solid #faad14' }}>
                        <Statistic
                            title="Tổng tiền cọc"
                            value={stats.totalDeposit}
                            prefix={<DollarCircleOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm hợp đồng..."
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        onPressEnter={searchContract}
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        style={{ width: isMobile ? "100%" : 280 }}
                        allowClear
                    />
                    <Button icon={<SearchOutlined />} onClick={searchContract}>Tìm</Button>
                    <Button icon={<ReloadOutlined />} onClick={resetSearch}>Làm mới</Button>
                </div>
            </Card>

            <Card size="small">
                <Table
                    columns={mainColumns}
                    dataSource={groupedData}
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: !isMobile,
                        showTotal: (total) => `${total} nhà có hợp đồng`,
                    }}
                    size={isMobile ? "small" : "middle"}
                    rowKey="key"
                    expandable={{
                        expandedRowRender,
                        defaultExpandAllRows: false,
                    }}
                />
            </Card>

            <ModalContractHistory
                visible={modalHistory}
                onClose={() => setModalHistory(false)}
                id={selectIdRoom}
            />
        </div>
    );
};

export default GetAllContract;