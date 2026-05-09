import React, { useEffect, useState } from "react";
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
    Avatar
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    EyeFilled,
    ReloadOutlined,
    HomeOutlined,
    UserOutlined,
    EnvironmentOutlined,
    DollarCircleOutlined,
    CheckCircleOutlined,
    StopOutlined
} from "@ant-design/icons";
import HouseForRentService from "../../services/HouseForRentService";
import HostService from "../../services/HostService";
import ModalCreate from "./ModalCreate";
import ModalUpdate from "./ModalUpdate";
import ModalDetail from "./ModalDetail";

const { Title, Text } = Typography;

const GetAllHouseForRent = () => {
    const [dataHouseForRent, setDataHouseForRent] = useState([]);
    const [filteredHouseForRent, setFilteredHouseForRent] = useState([]);
    const [dataHost, setDataHost] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [isModalDetail, setIsModalDetail] = useState(false);
    const [selectedHost, setSelectedHost] = useState(null);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [search, setSearch] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchAllData(0, pageSize);
    }, [token]);

    const fetchAllData = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        try {
            const [houseResponse, hosts] = await Promise.all([
                HouseForRentService.getAllHouseForRent(token, page, size),
                HostService.getAllHosts(token)
            ]);

            const houses = houseResponse.content || [];

            setDataHouseForRent(houses);
            setFilteredHouseForRent(houses);
            setDataHost(hosts);

            setCurrentPage(houseResponse.number !== undefined ? houseResponse.number : 0);
            setTotalElements(houseResponse.totalElements !== undefined ? houseResponse.totalElements : houses.length);
            setPageSize(houseResponse.size !== undefined ? houseResponse.size : 10);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page, size) => {
        const zeroBasedPage = page - 1;
        setCurrentPage(zeroBasedPage);
        setPageSize(size);
        fetchAllData(zeroBasedPage, size);
    };

    const handleSearch = (value) => {
        setSearch(value);
        if (!value.trim()) {
            setFilteredHouseForRent(dataHouseForRent);
            return;
        }

        const filter = dataHouseForRent.filter((item) => {
            const searchStr = value.toLowerCase();
            const hostName = dataHost.find((h) => h.id === item.id_host)?.name?.toLowerCase() || "";
            return (
                (item.name && item.name.toLowerCase().includes(searchStr)) ||
                (item.address && item.address.toLowerCase().includes(searchStr)) ||
                (item.code && item.code.toLowerCase().includes(searchStr)) ||
                hostName.includes(searchStr)
            );
        });
        setFilteredHouseForRent(filter);
    };

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleEdit = (house) => {
        setSelectedHouse(house.id);
        setIsModalUpdate(true);
    };

    const detailHouseForrent = (house) => {
        setSelectedHouse(house.id);
        setIsModalDetail(true);
    };



    const getStatusTag = (status) => {
        if (status === "DANG_THUE") {
            return (
                <Tag
                    color="success"
                    icon={<CheckCircleOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Đang thuê
                </Tag>
            );
        } else {
            return (
                <Tag
                    color="error"
                    icon={<StopOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Dừng thuê
                </Tag>
            );
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1
        },
        {
            title: "Mã nhà",
            dataIndex: "code",
            key: "code",
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: "Tên nhà",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: "Giá thuê",
            dataIndex: "price",
            key: "price",
            sorter: (a, b) => a.price - b.price,
            render: (price) => formatPrice(price),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (status) => (
                <Tag color={status === "DANG_THUE" ? "green" : "default"}>
                    {status === "DANG_THUE" ? "Đang thuê" : "Dừng thuê"}
                </Tag>
            ),
        },
        {
            title: "Chủ nhà",
            dataIndex: "id_host",
            key: "id_host",
            render: (id_host) => {
                const hostName = dataHost.find((host) => host.id === id_host)?.name;
                return hostName || <Text type="secondary">—</Text>;
            },
        },
        {
            title: "Hành động",
            key: "actions",
            width: 100,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeFilled />}
                            onClick={() => detailHouseForrent(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const houseStats = {
        total: dataHouseForRent.length,
        rented: dataHouseForRent.filter(house => house.status === "DANG_THUE").length,
        available: dataHouseForRent.filter(house => house.status !== "DANG_THUE").length,
        totalRevenue: dataHouseForRent
            .filter(house => house.status === "DANG_THUE")
            .reduce((sum, house) => sum + (house.price || 0), 0),
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                        Quản lý nhà thuê
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Danh sách và quản lý thông tin nhà thuê
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm nhà mới
                </Button>
            </div>

            {/* Statistics */}
            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng nhà thuê"
                            value={houseStats.total}
                            prefix={<HomeOutlined style={{ color: '#1677ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Đang cho thuê"
                            value={houseStats.rented}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Có sẵn"
                            value={houseStats.available}
                            prefix={<StopOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Doanh thu/tháng"
                            value={houseStats.totalRevenue}
                            prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />}
                            formatter={(value) => formatPrice(value)}
                        />
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onPressEnter={() => handleSearch(search)}
                        style={{ width: isMobile ? "100%" : 240 }}
                        allowClear
                    />
                    <Button icon={<SearchOutlined />} onClick={() => handleSearch(search)}>
                        Tìm
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => { setSearch(""); setCurrentPage(0); fetchAllData(0, pageSize); }}>
                        Làm mới
                    </Button>
                </div>
            </Card>

            <Card size="small">
                <Table
                    columns={columns}
                    dataSource={filteredHouseForRent}
                    loading={loading}
                    pagination={{
                        current: currentPage + 1,
                        pageSize: pageSize,
                        total: totalElements,
                        showSizeChanger: !isMobile,
                        showQuickJumper: !isMobile,
                        onChange: handlePageChange,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} bản ghi`,
                    }}
                    scroll={{ x: 1200 }}
                    rowKey="id"
                    size={isMobile ? "small" : "middle"}
                />
            </Card>

            <ModalCreate
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={() => fetchAllData(currentPage, pageSize)}
            />
            <ModalUpdate
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                houseData={selectedHouse}
                onSuccess={() => fetchAllData(currentPage, pageSize)}
            />
            <ModalDetail
                visible={isModalDetail}
                onClose={() => setIsModalDetail(false)}
                houseData={selectedHouse}
                hostId={selectedHost}
            />

            <style jsx>{`
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllHouseForRent;

