import React, { useState, useEffect } from "react";
import {
    Table,
    Input,
    Button,
    Space,
    Card,
    Typography,
    Tag,
    Row,
    Col,
    Statistic,
    Tooltip,
    Divider,
    Select
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    EyeFilled,
    ReloadOutlined,
    HomeOutlined,
    ApartmentOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import RoomService from "../../services/RoomService";
import HouseForRentService from "../../services/HouseForRentService";
import CustomerService from "../../services/CustomerService";
import ModalDetailRoomHistory from "./ModalDetailRoomHistory";

const { Title, Text } = Typography;
const { Option } = Select;

const GetAllRoom = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [dataRoom, setDataRoom] = useState([]);
    const [dataHouseForRent, setDataHouseForRent] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [selectedHouseId, setSelectedHouseId] = useState("all");
    const [selectedCustomerId, setSelectedCustomerId] = useState("all");
    const [roomEmpty, setRoomEmpty] = useState(0);
    const [roomRenting, setRoomRenting] = useState(0);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [selectIdRoom, setSelectIdRoom] = useState(null);

    useEffect(() => {
        fetchRoomData();
        fetchHouseForRent();
        fetchCustomer();
        fetchRoomStatus();
    }, [token]);

    const fetchRoomData = async () => {
        try {
            const response = await RoomService.getAllRooms(token);
            setDataRoom(response);
            setFilterData(response);
        } catch (error) {
            console.error("Failed to fetch room data:", error);
        }
    };

    const fetchHouseForRent = async () => {
        try {
            const response = await HouseForRentService.getAllHouseForRent(token);
            setDataHouseForRent(response);
        } catch (error) {
            console.error("Failed to fetch houses:", error);
        }
    };

    const fetchCustomer = async () => {
        try {
            const response = await CustomerService.getAllCustomers(token);
            setDataCustomer(response);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        }
    };

    const fetchRoomStatus = async () => {
        try {
            const response = await RoomService.getAllStatusRoom(token);
            setRoomEmpty(response[0].roomEmpty);
            setRoomRenting(response[0].roomRenting);
        } catch (error) {
            console.error("Failed to fetch room status:", error);
        }
    };

    const handleSearch = () => {
        const filter = dataRoom.filter((item) =>
            Object.values(item).some((val) =>
                val?.toString().trim().toLowerCase().includes(keyword.toLowerCase())
            )
        );
        setFilterData(filter);
    };

    const searchHouseForRent = async (idHouse, idCustomer) => {
        try {
            if (idHouse === "all" && idCustomer === "all") {
                setFilterData(dataRoom);
                return;
            }
            const response = await RoomService.findAllHouseForRentInRom(
                token,
                idHouse === "all" ? null : idHouse,
                idCustomer === "all" ? null : idCustomer
            );
            setFilterData(response);
        } catch (error) {
            console.error("Failed to filter rooms:", error);
        }
    };

    const handleAddRoom = () => {
        navigate("/room-management/createRoom");
    };

    const handleUpdate = (record) => {
        navigate(`/room-management/updateRoom/${record.id}`);
    };

    const detailRoom = (record) => {
        navigate(`/room-management/detailRoom/${record.id}`);
    };

    const detailRoomHistory = (id) => {
        setSelectIdRoom(id);
        setIsModalDetail(true);
    };

    const columns = [
        {
            title: "#",
            dataIndex: "stt",
            align: "center",
            width: 60,
            render: (_, __, index) => index + 1
        },
        {
            title: "Mã phòng",
            dataIndex: "code",
            sorter: (a, b) => a.code.localeCompare(b.code)
        },
        {
            title: "Tên phòng",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Giá",
            dataIndex: "price",
            sorter: (a, b) => a.price - b.price,
            render: (price) =>
                price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        },
        {
            title: "Diện tích",
            dataIndex: "acreage",
            render: (acreage) => `${acreage} m²`
        },
        {
            title: "Số người tối đa",
            dataIndex: "peopleMax"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) => (
                <Tag
                    color={status === "DANG_CHO_THUE" ? "green" : "red"}
                    style={{ fontWeight: "bold" }}
                >
                    {status === "DANG_CHO_THUE" ? "Đang cho thuê" : "Trống"}
                </Tag>
            )
        },
        {
            title: "Nhà thuê",
            dataIndex: "houseForRent",
            render: (id) => {
                const house = dataHouseForRent.find((h) => h.id === id)?.name;
                return house || "Chưa có nhà thuê";
            }
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa phòng">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdate(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            size="small"
                            style={{ backgroundColor: "#fa8c16", color: "white" }}
                            icon={<EyeFilled />}
                            onClick={() => detailRoom(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Lịch sử">
                        <Button
                            size="small"
                            style={{ backgroundColor: "#722ed1", color: "white" }}
                            icon={<EyeFilled />}
                            onClick={() => detailRoomHistory(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Card style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <Title level={2} style={{ color: "#1890ff" }}>
                        <ApartmentOutlined /> Quản lý phòng trọ
                    </Title>
                    <Text type="secondary">Danh sách và quản lý thông tin phòng trọ</Text>
                </div>

                <Divider />

                {/* Statistics */}
                <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ textAlign: "center", borderLeft: "4px solid #1890ff" }}>
                            <Statistic title="Tổng số phòng" value={roomEmpty + roomRenting} prefix={<HomeOutlined />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ textAlign: "center", borderLeft: "4px solid #ff4d4f" }}>
                            <Statistic title="Phòng trống" value={roomEmpty} prefix={<ExclamationCircleOutlined />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card size="small" style={{ textAlign: "center", borderLeft: "4px solid #52c41a" }}>
                            <Statistic title="Đang cho thuê" value={roomRenting} prefix={<CheckCircleOutlined />} />
                        </Card>
                    </Col>
                </Row>

                {/* Search & Filter */}
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                        Tìm kiếm
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={fetchRoomData}>
                        Làm mới
                    </Button>
                </Space>

                <Space style={{ marginBottom: 16 }}>
                    <Select
                        value={selectedHouseId}
                        style={{ width: 200 }}
                        onChange={(value) => {
                            setSelectedHouseId(value);
                            searchHouseForRent(value, selectedCustomerId);
                        }}
                    >
                        <Option value="all">Tất cả nhà thuê</Option>
                        {dataHouseForRent.map((house) => (
                            <Option key={house.id} value={house.id}>
                                {house.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        value={selectedCustomerId}
                        style={{ width: 200 }}
                        onChange={(value) => {
                            setSelectedCustomerId(value);
                            searchHouseForRent(selectedHouseId, value);
                        }}
                    >
                        <Option value="all">Tất cả khách hàng</Option>
                        {dataCustomer.map((cus) => (
                            <Option key={cus.id} value={cus.id}>
                                {cus.name}
                            </Option>
                        ))}
                    </Select>
                </Space>

                {/* Add Button */}
                <div style={{ textAlign: "right", marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoom}>
                        Thêm phòng mới
                    </Button>
                </div>

                {/* Table */}
                <Table columns={columns} dataSource={filterData} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <ModalDetailRoomHistory
                visible={isModalDetail}
                onClose={() => setIsModalDetail(false)}
                id={selectIdRoom}
            />
        </div>
    );
};

export default GetAllRoom;
