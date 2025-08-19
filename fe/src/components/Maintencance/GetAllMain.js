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
    DatePicker
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
    DollarOutlined
} from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import ModalCreateMain from "./ModalCreateMain";
import MaintencanceService from "../../services/MaintencanceService";
import ModalUpdateMain from "./ModalUpdateMain";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const GetAllMain = () => {
    const token = localStorage.getItem('token');
    const [dataMain, setDataMain] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [selectIdMain, setSelectIdMain] = useState(null);
    const [keyWord, setKeyWord] = useState("");
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [originalData, setOriginalData] = useState([]);

    // Fetch maintenance data
    useEffect(() => {
        const fetchAllMainTen = async () => {
            setLoading(true);
            try {
                const response = await MaintencanceService.getAllMainTen(token);
                setDataMain(response);
            } catch (error) {
                message.error("Lỗi khi tải dữ liệu bảo trì!");
            } finally {
                setLoading(false);
            }
        };
        fetchAllMainTen();
    }, [token]);

    // Fetch room data
    useEffect(() => {
        const fetchAllRoom = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setDataRoom(response);
            } catch (error) {
                message.error("Lỗi khi tải dữ liệu phòng!");
            }
        };
        fetchAllRoom();
    }, [token]);

    // Map room data with maintenance data
    useEffect(() => {
        if (dataMain.length > 0 && dataRoom.length > 0) {
            const mapped = dataMain.map((item, index) => {
                const room = dataRoom.find(r => r.id === item.room);
                return {
                    ...item,
                    stt: index + 1,
                    key: item.id,
                    roomName: room ? room.name : "Không xác định"
                };
            });
            setOriginalData(mapped);
            setFilterData(mapped);
        } else if (dataMain.length > 0) {
            const mappedWithoutRoom = dataMain.map((item, index) => ({
                ...item,
                stt: index + 1,
                key: item.id,
                roomName: "Không xác định"
            }));
            setOriginalData(mappedWithoutRoom);
            setFilterData(mappedWithoutRoom);
        }
    }, [dataMain, dataRoom]);

    // Search and filter function
    const handleFilter = () => {
        let filtered = [...originalData];

        // Filter by keyword
        if (keyWord.trim()) {
            filtered = filtered.filter((item) =>
                Object.values(item).some((value) =>
                    value &&
                    value.toString().toLowerCase().includes(keyWord.toLowerCase())
                )
            );
        }

        // Filter by status
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilterData(filtered);
    };

    // Reset filters
    const resetFilters = () => {
        setKeyWord("");
        setStatusFilter("ALL");
        setFilterData(originalData);
    };

    // Delete maintenance record
    const deleteMainTen = async (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa phiếu bảo trì này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: async () => {
                try {
                    await MaintencanceService.deleteMainTen(id, token);
                    message.success("Xóa phiếu bảo trì thành công");
                    // Refresh data
                    const response = await MaintencanceService.getAllMainTen(token);
                    setDataMain(response);
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

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'TAO_PHIEU': { color: 'orange', text: 'Tạo phiếu' },
            'DANG_XU_LY': { color: 'blue', text: 'Đang xử lý' },
            'HOAN_THANH': { color: 'green', text: 'Đã hoàn thành' }
        };

        const config = statusConfig[status] || { color: 'default', text: 'Không xác định' };
        
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // Table columns configuration
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 60,
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
            width: 120,
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
            dataIndex: "roomName",
            key: "roomName",
            width: 150,
            sorter: (a, b) => a.roomName.localeCompare(b.roomName),
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
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name) => (
                <Tooltip title={name}>
                    <Text ellipsis style={{ maxWidth: 150 }}>{name}</Text>
                </Tooltip>
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
            width: 130,
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
            width: 130,
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
            render: (description) => (
                <Tooltip title={description}>
                    <Text ellipsis style={{ maxWidth: 150 }}>
                        {description || "Không có ghi chú"}
                    </Text>
                </Tooltip>
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
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="primary" 
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => editMain(record.id)}
                        />
                    </Tooltip>
                    {record.status === 'TAO_PHIEU' && (
                        <Tooltip title="Xóa phiếu">
                            <Button 
                                danger
                                size="small"
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
        <div style={{ padding: "24px", background: '#f0f2f5', minHeight: '100vh' }}>
            <Card style={{ marginBottom: 24 }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: 0, color: '#1890ff' }}>
                    <Space>
                        <HomeOutlined />
                        Quản lý bảo trì phòng trọ
                    </Space>
                </Title>
            </Card>

            {/* Filter Section */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm kiếm theo mã, tên dịch vụ, phòng..."
                            value={keyWord}
                            onChange={(e) => setKeyWord(e.target.value)}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                        >
                            <Option value="ALL">Tất cả trạng thái</Option>
                            <Option value="TAO_PHIEU">Tạo phiếu</Option>
                            <Option value="DANG_XU_LY">Đang xử lý</Option>
                            <Option value="HOAN_THANH">Đã hoàn thành</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Space>
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                                onClick={handleFilter}
                            >
                                Tìm kiếm
                            </Button>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={resetFilters}
                            >
                                Đặt lại
                            </Button>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={4} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={openModalCreate}
                            style={{ 
                                background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                            }}
                        >
                            Tạo phiếu bảo trì
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                                {filterData.length}
                            </Title>
                            <Text type="secondary">Tổng phiếu</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ color: '#faad14', margin: 0 }}>
                                {filterData.filter(item => item.status === 'TAO_PHIEU').length}
                            </Title>
                            <Text type="secondary">Tạo phiếu</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                                {filterData.filter(item => item.status === 'DANG_XU_LY').length}
                            </Title>
                            <Text type="secondary">Đang xử lý</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                                {filterData.filter(item => item.status === 'HOAN_THANH').length}
                            </Title>
                            <Text type="secondary">Hoàn thành</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Data Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filterData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} phiếu`,
                        pageSizeOptions: ['10', '20', '50', '100']
                    }}
                    scroll={{ x: 1200 }}
                    size="middle"
                    bordered
                    style={{ 
                        background: 'white',
                        borderRadius: '8px'
                    }}
                />
            </Card>

            {/* Modals */}
            <ModalCreateMain
                visible={isModalCreate}
                onClose={() => setIsModalCreate(false)}
            />

            <ModalUpdateMain
                visible={isModalUpdate}
                onClose={() => setIsModalUpdate(false)}
                id={selectIdMain}
            />
        </div>
    );
};

export default GetAllMain;