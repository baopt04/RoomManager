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
    Badge
} from "antd";
import { 
    SearchOutlined, 
    PlusOutlined, 
    EditOutlined, 
    EyeOutlined, 
    HistoryOutlined,
    ReloadOutlined,
    FilterOutlined 
} from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import ContractService from "../../services/ContractService";
import { useNavigate } from "react-router-dom";
import ModalContractHistory from "./ModalContractHistory";

const { Title, Text } = Typography;

const GetAllContract = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // States
    const [dataContract, setDataContract] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [keyWord, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [modalHistory, setModalHistory] = useState(false);
    const [selectIdRoom, setSelectIdRoom] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch contracts
    useEffect(() => {
        const fetchAllContract = async () => {
            setLoading(true);
            try {
                const response = await ContractService.getAllcontract(token);
                setDataContract(response);
            } catch (error) {
                console.log("Error khi gọi server!", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllContract();
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

    // Map contract data with room info
    useEffect(() => {
        if (dataContract.length > 0 && dataRoom.length > 0) {
            const mapped = dataContract.map((item, index) => {
                const room = dataRoom.find(r => r.id === item.room);
                return {
                    ...item,
                    key: item.id,
                    stt: index + 1,
                    roomName: room ? room.name : "",
                    roomPrice: room ? room.price : 0
                };
            });
            setFilterData(mapped);
            setOriginalData(mapped);
        }
    }, [dataContract, dataRoom]);

    // Search functionality
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

    // Reset search
    const resetSearch = () => {
        setKeyWord("");
        setFilterData(originalData);
    };

    // Navigation functions
    const openModalCreate = () => {
        navigate("/contract-management/createContract");
    };

    const handleUpdateContract = (record) => {
        navigate(`/contract-management/updateContract/${record.id}`);
    };

    const detailContract = (record) => {
        navigate(`/contract-management/detailContract/${record.id}`);
    };

    const getHistoryContact = (id) => {
        setSelectIdRoom(id);
        setModalHistory(true);
    };

    // Status render function
    const renderStatus = (status) => {
        const statusConfig = {
            "KICH_HOAT": { color: "success", text: "Đang sử dụng" },
            "NGUNG_KICH_HOAT": { color: "warning", text: "Ngưng sử dụng" },
            "DUNG_KINH_DOANH": { color: "error", text: "Ngưng kinh doanh" }
        };
        
        const config = statusConfig[status] || { color: "default", text: "Không xác định" };
        
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // Currency formatter
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount);
    };

    // Date formatter
    const formatDate = (date) => {
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date(date));
    };

    // Table columns
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 70,
            align: "center",
            sorter: (a, b) => a.stt - b.stt
        },
        {
            title: "Mã hợp đồng",
            dataIndex: "code",
            key: "code",
            width: 120,
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (code) => <Text strong>{code}</Text>
        },
        {
            title: "Ngày ký",
            dataIndex: "dateStart",
            key: "dateStart",
            width: 110,
            sorter: (a, b) => new Date(a.dateStart) - new Date(b.dateStart),
            render: (date) => formatDate(date)
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "dateEnd",
            key: "dateEnd",
            width: 110,
            sorter: (a, b) => new Date(a.dateEnd) - new Date(b.dateEnd),
            render: (date) => formatDate(date)
        },
        {
            title: "Tiền đặt cọc",
            dataIndex: "contractDeponsit",
            key: "contractDeponsit",
            width: 130,
            sorter: (a, b) => a.contractDeponsit - b.contractDeponsit,
            render: (amount) => <Text type="success">{formatCurrency(amount)}</Text>
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "nextDueDate",
            key: "nextDueDate",
            width: 130,
            sorter: (a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate),
            render: (date) => formatDate(date)
        },
        {
            title: "Phòng",
            dataIndex: "roomName",
            key: "roomName",
            width: 100,
            render: (roomName, record) => {
                const roomData = dataRoom.find((item) => item.id === record.room);
                return roomData ? (
                    <Badge status="processing" text={roomName} />
                ) : (
                    <Text type="secondary">Không tìm thấy</Text>
                );
            }
        },
        {
            title: "Giá phòng",
            dataIndex: "roomPrice",
            key: "roomPrice",
            width: 120,
            sorter: (a, b) => a.roomPrice - b.roomPrice,
            render: (_, record) => {
                const roomData = dataRoom.find((item) => item.id === record.room);
                return roomData ? (
                    <Text strong>{formatCurrency(roomData.price)}</Text>
                ) : (
                    <Text type="secondary">--</Text>
                );
            }
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
            title: "Thao tác",
            key: "action",
            width: 200,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleUpdateContract(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => detailContract(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Lịch sử">
                        <Button
                            type="default"
                            icon={<HistoryOutlined />}
                            size="small"
                            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "white" }}
                            onClick={() => getHistoryContact(record.id)}
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
                    Quản lý hợp đồng phòng trọ
                </Title>
            </Card>

            {/* Search and Actions */}
            <Card style={{ marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12} lg={8}>
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                placeholder="Tìm kiếm hợp đồng..."
                                value={keyWord}
                                onChange={(e) => setKeyWord(e.target.value)}
                                onPressEnter={searchContract}
                                prefix={<SearchOutlined />}
                            />
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                                onClick={searchContract}
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
                                    background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)"
                                }}
                            >
                                Thêm hợp đồng mới
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: "16px 0" }} />
                
                <Row gutter={[16, 16]}>
                    <Col>
                        <Text type="secondary">
                            Tổng số hợp đồng: <Text strong>{filterData.length}</Text>
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
                            `${range[0]}-${range[1]} của ${total} hợp đồng`,
                    }}
                    scroll={{ x: 1200 }}
                    bordered
                    size="middle"
                    style={{
                        "& .ant-table-thead > tr > th": {
                            backgroundColor: "#fafafa",
                            fontWeight: "600"
                        }
                    }}
                />
            </Card>

            {/* Modal */}
            <ModalContractHistory
                visible={modalHistory}
                onClose={() => setModalHistory(false)}
                id={selectIdRoom}
            />
        </div>
    );
};

export default GetAllContract;