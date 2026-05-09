import React, { useState, useEffect } from "react";
import {
    Table,
    Input,
    Button,
    Space,
    Modal,
    message,
    Card,
    Row,
    Col,
    Tooltip,
    Typography,
    Tag,
    Divider,
    Select,
    DatePicker,
    Statistic,
    Badge,
    Pagination
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
    FileTextOutlined,
    HomeOutlined,
    CalendarOutlined,
    DollarOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import ModalCreateMain from "./ModalCreateMain";
import MaintencanceService from "../../services/MaintencanceService";
import ModalUpdateMain from "./ModalUpdateMain";

const { Title, Text } = Typography;
const { Option } = Select;

const GetAllMain = () => {
    const token = localStorage.getItem('token');
    const [dataMain, setDataMain] = useState([]);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [selectIdMain, setSelectIdMain] = useState(null);
    const [keyWord, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [originalData, setOriginalData] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState("Tất cả");

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const fetchAllData = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        try {
            const mainResponse = await MaintencanceService.getAllMainTen(token, page, size);
            const content = mainResponse.content || [];
            setDataMain(content);

            setCurrentPage(mainResponse.number !== undefined ? mainResponse.number : 0);
            setTotalElements(mainResponse.totalElements !== undefined ? mainResponse.totalElements : content.length);
            setPageSize(mainResponse.size !== undefined ? mainResponse.size : 10);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu bảo trì!");
            console.error("Failed to fetch maintenance data:", error);
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
        if (dataMain.length > 0) {
            const mapped = dataMain.map((item, index) => {
                return {
                    ...item,
                    stt: index + 1,
                    key: item.id,
                    roomName: item.room || "Không xác định"
                };
            });
            const sorted = mapped.sort((a, b) => {
                const houseA = a.houseForRent || "";
                const houseB = b.houseForRent || "";
                if (houseA !== houseB) return houseA.localeCompare(houseB);
                return (a.roomName || "").localeCompare(b.roomName || "");
            });

            setOriginalData(sorted);
            setFilterData(sorted);
        }
    }, [dataMain]);

    const houses = ["Tất cả", ...new Set(originalData.map(item => item.houseForRent).filter(Boolean))];

    const handleFilter = () => {
        let filtered = [...originalData];

        if (selectedHouse !== "Tất cả") {
            filtered = filtered.filter(item => item.houseForRent === selectedHouse);
        }

        if (keyWord.trim()) {
            filtered = filtered.filter((item) =>
                Object.values(item).some((value) =>
                    value &&
                    value.toString().toLowerCase().includes(keyWord.toLowerCase())
                )
            );
        }

        if (statusFilter !== "ALL") {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilterData(filtered);
    };

    const handleHouseChange = (house) => {
        setSelectedHouse(house);
        let filtered = [...originalData];

        if (house !== "Tất cả") {
            filtered = filtered.filter(item => item.houseForRent === house);
        }

        if (keyWord.trim()) {
            filtered = filtered.filter((item) =>
                Object.values(item).some((val) =>
                    val &&
                    val.toString().toLowerCase().includes(keyWord.toLowerCase())
                )
            );
        }

        if (statusFilter !== "ALL") {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilterData(filtered);
    };

    const resetFilters = () => {
        setKeyWord("");
        setStatusFilter("ALL");
        setSelectedHouse("Tất cả");
        setCurrentPage(0);
        fetchAllData(0, pageSize);
    };

    const deleteMainTen = async (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa phiếu bảo trì này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await MaintencanceService.deleteMainTen(token, id);
                    message.success("Xóa phiếu bảo trì thành công");
                    fetchAllData(currentPage, pageSize);
                } catch (error) {
                    message.error("Xóa phiếu bảo trì thất bại");
                }
            }
        });
    };

    const openModalCreate = () => {
        setIsModalCreate(true);
    };

    const editMain = (id) => {
        setSelectIdMain(id);
        setIsModalUpdate(true);
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'TAO_PHIEU': { color: 'orange', text: 'Tạo phiếu' },
            'DANG_XU_LY': { color: 'blue', text: 'Đang xử lý' },
            'HOAN_THANH': { color: 'green', text: 'Đã hoàn thành' }
        };

        const config = statusConfig[status] || { color: 'default', text: 'Không xác định' };

        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 80,
            align: 'center',
            sorter: (a, b) => a.stt - b.stt,
        },
        {
            title: (
                <Space>
                    <FileTextOutlined />
                    Mã phiếu
                </Space>
            ),
            dataIndex: "code",
            key: "code",
            width: 140,
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (code) => <Text strong>{code}</Text>
        },
        {
            title: (
                <Space>
                    <HomeOutlined />
                    Phòng trọ
                </Space>
            ),
            dataIndex: "room",
            key: "room",
            width: 150,
            sorter: (a, b) => a.room.localeCompare(b.room),
            render: (roomName) => (
                <Tooltip title={roomName}>
                    <Text>{roomName || "Chưa có dữ liệu"}</Text>
                </Tooltip>
            )
        },
        {
            title: "Dịch vụ",
            dataIndex: "name",
            key: "name",
            width: 200,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name) => (
                <Text>{name}</Text>
            )
        },
        {
            title: (
                <Space>
                    <CalendarOutlined />
                    Ngày tiếp nhận
                </Space>
            ),
            dataIndex: "dataRequest",
            key: "dataRequest",
            width: 170,
            sorter: (a, b) => new Date(a.dataRequest) - new Date(b.dataRequest),
            render: (dataRequest) => {
                if (!dataRequest) return <Text type="secondary">Đang xử lý</Text>;
                const date = new Date(dataRequest);
                return (
                    <Text>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        }).format(date)}
                    </Text>
                );
            },
        },
        {
            title: (
                <Space>
                    <CalendarOutlined />
                    Ngày hoàn thành
                </Space>
            ),
            dataIndex: "dataComplete",
            key: "dataComplete",
            width: 180,
            sorter: (a, b) => new Date(a.dataComplete) - new Date(b.dataComplete),
            render: (dataComplete) => {
                if (!dataComplete) return <Text type="secondary">Đang xử lý</Text>;
                const date = new Date(dataComplete);
                return (
                    <Text>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        }).format(date)}
                    </Text>
                );
            }
        },
        {
            title: (
                <Space>
                    <DollarOutlined />
                    Chi phí
                </Space>
            ),
            dataIndex: "expense",
            key: "expense",
            width: 120,
            align: 'right',
            sorter: (a, b) => a.expense - b.expense,
            render: (expense) => (
                <Text strong style={{ color: '#1890ff' }}>
                    {new Intl.NumberFormat("vi-VN", {
                        style: 'currency',
                        currency: 'VND'
                    }).format(expense)}
                </Text>
            )
        },
        {
            title: "Ghi chú",
            dataIndex: "description",
            key: "description",
            width: 150,
            render: (description) => (
                <Text>
                    {description || "Không có ghi chú"}
                </Text>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            align: 'center',
            render: (status) => <StatusBadge status={status} />
        },
        {
            title: "Thao tác",
            key: "action",
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => editMain(record.id)}
                        />
                    </Tooltip>
                    {record.status === 'TAO_PHIEU' && (
                        <Tooltip title="Xóa phiếu">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => deleteMainTen(record.id)}
                            />
                        </Tooltip>
                    )}
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
                        Quản lý bảo trì phòng trọ
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        Danh sách và quản lý các phiếu yêu cầu bảo trì, sửa chữa
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openModalCreate}
                >
                    Tạo phiếu bảo trì
                </Button>
            </div>

            {/* Statistics Section */}
            <Row gutter={16} className="stat-row">
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng phiếu"
                            value={filterData.length}
                            prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Tạo phiếu"
                            value={filterData.filter(item => item.status === 'TAO_PHIEU').length}
                            prefix={<PlusOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Đang xử lý"
                            value={filterData.filter(item => item.status === 'DANG_XU_LY').length}
                            prefix={<ReloadOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small">
                        <Statistic
                            title="Hoàn thành"
                            value={filterData.filter(item => item.status === 'HOAN_THANH').length}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filter Section */}
            <Card size="small" style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        onPressEnter={handleFilter}
                        style={{ width: 240 }}
                        allowClear
                    />
                    <Select
                        placeholder="Trạng thái"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 150 }}
                    >
                        <Option value="ALL">Tất cả</Option>
                        <Option value="TAO_PHIEU">Tạo phiếu</Option>
                        <Option value="DANG_XU_LY">Đang xử lý</Option>
                        <Option value="HOAN_THANH">Đã hoàn thành</Option>
                    </Select>
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
                    <Button icon={<SearchOutlined />} onClick={handleFilter}>
                        Tìm
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                        Làm mới
                    </Button>
                </div>
            </Card>

            {/* Grouped Data Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {Object.entries(filterData.reduce((acc, item) => {
                    const house = item.houseForRent || "Chưa xác định";
                    if (!acc[house]) acc[house] = [];
                    acc[house].push(item);
                    return acc;
                }, {})).map(([house, items]) => (
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
                        showSizeChanger={true}
                        onChange={handlePageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`}
                    />
                </div>
            )}

            {/* Modals */}
            <ModalCreateMain
                visible={isModalCreate}
                onClose={() => setIsModalCreate(false)}
                onSuccess={() => fetchAllData(currentPage, pageSize)}
            />

            <ModalUpdateMain
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                id={selectIdMain}
                onSuccess={() => fetchAllData(currentPage, pageSize)}
            />

            <style jsx>{`
                .ant-statistic-content-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default GetAllMain;

