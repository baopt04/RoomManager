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
    CheckCircleOutlined,
    FileExcelOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const fetchAllData = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        try {
            const [roomsRes, houses, customers, status] = await Promise.all([
                RoomService.getAllRooms(token, page, size),
                HouseForRentService.getAllHouseForRent(token),
                CustomerService.getAllCustomers(token),
                RoomService.getAllStatusRoom(token)
            ]);

            const rooms = roomsRes.content || [];

            setDataRoom(rooms);
            setFilterData(rooms);
            setCurrentPage(roomsRes.number !== undefined ? roomsRes.number : 0);
            setTotalElements(roomsRes.totalElements !== undefined ? roomsRes.totalElements : rooms.length);
            setPageSize(roomsRes.size !== undefined ? roomsRes.size : 10);

            setDataHouseForRent(houses);
            setDataCustomer(customers);
            if (status && status.length > 0) {
                setRoomEmpty(status[0].roomEmpty);
                setRoomRenting(status[0].roomRenting);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
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
        navigate("/admin/rooms/create");
    };

    const handleUpdate = (record) => {
        navigate(`/admin/rooms/${record.id}/edit`);
    };

    const detailRoom = (record) => {
        navigate(`/admin/rooms/${record.id}`);
    };

    const detailRoomHistory = (id) => {
        setSelectIdRoom(id);
        setIsModalDetail(true);
    };

    const handleExportMonthlyBilling = async () => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        try {
            message.loading({ content: "Đang tạo file Excel...", key: "export_bill" });
            const response = await RoomService.exportMonthlyBilling(token, selectedHouseId, month, year);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            let fileName;
            if (selectedHouseId === "all") {
                fileName = `Bang_Ke_Tong_Hop_Thang_${month}_${year}.xlsx`;
            } else {
                const houseName = dataHouseForRent.find(h => h.id === selectedHouseId)?.name || "Nha";
                const safeHouseName = houseName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');
                fileName = `Bang_Ke_${safeHouseName}_Thang_${month}_${year}.xlsx`;
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            message.success({ content: "Xuất file Excel thành công!", key: "export_bill" });
        } catch (error) {
            console.error("Export error:", error);
            message.error({ content: "Lỗi khi xuất file Excel!", key: "export_bill" });
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            align: "center",
            width: 50,
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
                <Tag color={status === "DANG_CHO_THUE" ? "green" : "default"}>
                    {status === "DANG_CHO_THUE" ? "Đang cho thuê" : "Trống"}
                </Tag>
            )
        },
        {
            title: "Nhà thuê",
            dataIndex: "houseForRent",
            // render: (id) => {
            //     const house = dataHouseForRent.find((h) => h.id === id)?.name;
            //     return house || <Text type="secondary">—</Text>;
            // }
        },
        {
            title: "Hành động",
            key: "actions",
            width: 140,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdate(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeFilled />}
                            onClick={() => detailRoom(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Lịch sử">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeFilled style={{ color: '#8b5cf6' }} />}
                            onClick={() => detailRoomHistory(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Quản lý phòng trọ
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Danh sách và quản lý thông tin phòng trọ
                    </Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoom}>
                    Thêm phòng
                </Button>
            </div>

            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Tổng số phòng"
                            value={roomEmpty + roomRenting}
                            prefix={<HomeOutlined style={{ color: '#1677ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Phòng trống"
                            value={roomEmpty}
                            prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <Statistic
                            title="Đang cho thuê"
                            value={roomRenting}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: isMobile ? "100%" : 240 }}
                        allowClear
                    />
                    <Select
                        value={selectedHouseId}
                        style={{ width: isMobile ? "100%" : 180 }}
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
                        style={{ width: isMobile ? "100%" : 180 }}
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
                    <Button icon={<SearchOutlined />} onClick={handleSearch}>
                        Tìm
                    </Button>
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={handleExportMonthlyBilling}
                        style={{
                            backgroundColor: "#1d6f42",
                            color: "white",
                            borderRadius: 6
                        }}
                    >
                        Xuất bảng kê
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => {
                        setKeyword("");
                        setSelectedHouseId("all");
                        setSelectedCustomerId("all");
                        setCurrentPage(0);
                        fetchAllData(0, pageSize);
                    }}>
                        Làm mới
                    </Button>
                </div>
            </Card>

            <Card size="small">
                <Table
                    columns={columns}
                    dataSource={filterData}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: currentPage + 1,
                        pageSize: pageSize,
                        total: totalElements,
                        showSizeChanger: !isMobile,
                        onChange: handlePageChange,
                        showTotal: (total) => `Tổng số ${total} phòng`
                    }}
                    size={isMobile ? "small" : "middle"}
                />
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

