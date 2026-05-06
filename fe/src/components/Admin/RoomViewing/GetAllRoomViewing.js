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
    message,
    Select,
    Popconfirm,
    Badge
} from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PhoneFilled,
    EyeOutlined
} from "@ant-design/icons";
import { getAllRoomViewing, updateRoomViewingStatus } from "../../../services/customer/RoomViewing";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const GetAllRoomViewing = () => {
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getAllRoomViewing();
            // Sort by createdAt descending (newest first)
            const sortedData = [...response].sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
            setData(sortedData);
            setFilteredData(sortedData);
        } catch (error) {
            console.error("Failed to fetch room viewings:", error);
            message.error("Không thể tải danh sách người xem nhà!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value.trim()) {
            setFilteredData(data);
            return;
        }
        const lowerValue = value.toLowerCase();
        const filtered = data.filter((item) =>
            item.name?.toLowerCase().includes(lowerValue) ||
            item.phone?.toLowerCase().includes(lowerValue) ||
            item.roomName?.toLowerCase().includes(lowerValue) ||
            item.note?.toLowerCase().includes(lowerValue)
        );
        setFilteredData(filtered);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateRoomViewingStatus(id, newStatus);
            message.success("Cập nhật trạng thái thành công!");
            fetchData();
        } catch (error) {
            console.error("Failed to update status:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case "MOI_DANG_KY":
                return <Tag color="blue" icon={<CalendarOutlined />}>Mới đăng ký</Tag>;
            case "DA_GOI_XAC_NHAN":
                return <Tag color="orange" icon={<PhoneFilled />}>Đã gọi xác nhận</Tag>;
            case "DA_XEM_PHONG":
                return <Tag color="green" icon={<CheckCircleOutlined />}>Đã xem phòng</Tag>;
            case "HUY":
                return <Tag color="red" icon={<CloseCircleOutlined />}>Hủy</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const getGroupedData = (dataList) => {
        const groups = {};
        dataList.forEach((item) => {
            const key = item.roomId || item.roomName || "Unknown";
            if (!groups[key]) {
                groups[key] = {
                    roomId: item.roomId,
                    roomName: item.roomName,
                    viewers: [],
                    newCount: 0,
                    totalCount: 0,
                    key: key
                };
            }
            groups[key].viewers.push(item);
            groups[key].totalCount += 1;
            if (item.status === "MOI_DANG_KY") {
                groups[key].newCount += 1;
            }
        });
        return Object.values(groups);
    };

    const groupedData = getGroupedData(filteredData);

    const mainColumns = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: "Phòng trọ / Nhà",
            key: "roomInfo",
            render: (_, record) => (
                <Space>
                    <HomeOutlined style={{ color: '#1677ff', fontSize: '18px' }} />
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: '15px' }}>{record.roomName || "Không xác định"}</Text>

                    </Space>
                </Space>
            ),
        },
        {
            title: "Số người cần xem nhà",
            key: "totalCount",
            align: 'center',
            render: (_, record) => (
                <Tag color="blue" style={{ fontSize: '14px', padding: '2px 12px', borderRadius: '10px' }}>
                    {record.totalCount} người
                </Tag>
            ),
            sorter: (a, b) => a.totalCount - b.totalCount,
        },
        {
            title: "Yêu cầu mới",
            key: "newCount",
            align: 'center',
            render: (_, record) => (
                record.newCount > 0 ? (
                    <Badge count={record.newCount} offset={[10, 0]}>
                        <Tag color="error">Chờ xử lý</Tag>
                    </Badge>
                ) : (
                    <Tag color="default">Đã xử lý hết</Tag>
                )
            ),
            sorter: (a, b) => a.newCount - b.newCount,
        },
    ];

    const expandedRowRender = (record) => {
        const subColumns = [
            {
                title: "Họ và tên",
                dataIndex: "name",
                key: "name",
                render: (text) => <Text strong><UserOutlined /> {text}</Text>,
            },
            {
                title: "Số điện thoại",
                dataIndex: "phone",
                key: "phone",
                render: (text) => <Text><PhoneOutlined /> {text}</Text>,
            },
            {
                title: "Ngày đăng ký",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
            },
            {
                title: "Ngày xem dự kiến",
                dataIndex: "viewDate",
                key: "viewDate",
                render: (date) => (
                    <Text type={dayjs(date).isBefore(dayjs()) ? "secondary" : "danger"}>
                        {date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"}
                    </Text>
                ),
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (status) => getStatusTag(status),
            },
            {
                title: "Cập nhật",
                key: "action",
                render: (_, viewer) => (
                    <Select
                        defaultValue={viewer.status}
                        style={{ width: 160 }}
                        onChange={(value) => handleStatusChange(viewer.id, value)}
                        size="small"
                    >
                        <Option value="MOI_DANG_KY">Mới đăng ký</Option>
                        <Option value="DA_GOI_XAC_NHAN">Đã gọi xác nhận</Option>
                        <Option value="DA_XEM_PHONG">Đã xem phòng</Option>
                        <Option value="HUY">Hủy</Option>
                    </Select>
                ),
            },
        ];

        return (
            <div style={{ padding: '8px 16px', background: '#fafafa', borderRadius: '8px' }}>
                <Table
                    columns={subColumns}
                    dataSource={record.viewers}
                    pagination={false}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 1000 }}
                    title={() => <Text strong type="secondary">Danh sách người đăng ký xem phòng này</Text>}
                />
            </div>
        );
    };

    const stats = {
        total: data.length,
        new: data.filter(i => i.status === "MOI_DANG_KY").length,
        confirmed: data.filter(i => i.status === "DA_GOI_XAC_NHAN").length,
    };

    return (
        <div style={{ padding: isMobile ? '12px' : '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Quản lý thông tin người xem nhà</Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Theo dõi và cập nhật trạng thái các yêu cầu xem phòng từ khách hàng</Text>
                </div>
                <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
            </div>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card size="small" bordered={false} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <Statistic title="Tổng yêu cầu" value={stats.total} prefix={<EyeOutlined style={{ color: '#1677ff' }} />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" bordered={false} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <Statistic title="Mới đăng ký" value={stats.new} valueStyle={{ color: '#0071e3' }} prefix={<CalendarOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" bordered={false} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <Statistic title="Chờ xác nhận" value={stats.confirmed} valueStyle={{ color: '#fa8c16' }} prefix={<PhoneFilled />} />
                    </Card>
                </Col>
            </Row>

            <Card size="small" style={{ marginBottom: 16, borderRadius: '8px' }}>
                <Input
                    placeholder="Tìm theo tên, SĐT, tên phòng..."
                    prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: isMobile ? "100%" : 400 }}
                    allowClear
                />
            </Card>

            <Card size="small" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table
                    columns={mainColumns}
                    dataSource={groupedData}
                    loading={loading}
                    scroll={{ x: 950 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: !isMobile,
                        showTotal: (total) => `Tổng cộng ${total} phòng có người đăng ký`,
                    }}
                    rowKey="key"
                    size={isMobile ? "small" : "middle"}
                    expandable={{
                        expandedRowRender,
                        defaultExpandAllRows: false,
                    }}
                />
            </Card>
        </div>
    );
};

export default GetAllRoomViewing;

