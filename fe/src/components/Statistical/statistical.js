import React, { useEffect, useState } from "react";
import { 
  Card, 
  Form, 
  Select, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  message,
  Divider,
  Space,
  Typography,
  Badge,
  Spin
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  DollarCircleOutlined, 
  ThunderboltOutlined, 
  DropboxOutlined,
  HomeOutlined,
  CalendarOutlined,
  BarChartOutlined,
  RiseOutlined
} from "@ant-design/icons";
import StatisticalService from "../../services/StatisticalService";
import ModalSearchStatistical from "./ModalSearchStatistical";
import RoomService from "../../services/RoomService";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Colors for charts
const COLORS = ['#3f8600', '#faad14', '#1890ff', '#ff4d4f', '#722ed1'];

const columns = [
  { 
    title: "Tháng", 
    dataIndex: "month", 
    key: "month",
    align: 'center',
    render: (text) => <Text strong>{text}</Text>
  },
  { 
    title: "Năm", 
    dataIndex: "year", 
    key: "year",
    align: 'center',
    render: (text) => <Text strong>{text}</Text>
  },
  {
    title: "Tiền điện",
    dataIndex: "totalElectricity",
    key: "totalElectricity",
    align: 'right',
    render: (totalElectricity) => (
      <Text style={{ color: '#faad14', fontWeight: 'bold' }}>
        {totalElectricity.toLocaleString("vi-VN")} ₫
      </Text>
    ),
  },
  {
    title: "Tiền nước",
    dataIndex: "totalWater",
    key: "totalWater",
    align: 'right',
    render: (totalWater) => (
      <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
        {totalWater.toLocaleString("vi-VN")} ₫
      </Text>
    ),
  },
  {
    title: "Tiền dịch vụ",
    dataIndex: "totalService",
    key: "totalService",
    align: 'right',
    render: (totalService) => (
      <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
        {totalService.toLocaleString("vi-VN")} ₫
      </Text>
    ),
  },
  {
    title: "Tiền phòng",
    dataIndex: "totalRoom",
    key: "totalRoom",
    align: 'right',
    render: (totalRoom) => (
      <Text style={{ color: '#722ed1', fontWeight: 'bold' }}>
        {totalRoom.toLocaleString("vi-VN")} ₫
      </Text>
    ),
  },
  {
    title: "Tổng doanh thu",
    dataIndex: "totalMonth",
    key: "totalMonth",
    align: 'right',
    render: (totalMonth) => (
      <Text style={{ color: '#3f8600', fontWeight: 'bold', fontSize: '16px' }}>
        {totalMonth.toLocaleString("vi-VN")} ₫
      </Text>
    ),
  },
];

const Statistical = () => {
  const [form] = Form.useForm();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [range, setRange] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State variables
  const [totalPriceRoom, setTotalPriceRoom] = useState(0);
  const [totalPriceElectricity, setTotalPriceElectricity] = useState(0);
  const [totalPriceWater, setTotalPriceWater] = useState(0);
  const [totalPriceService, setTotalPriceService] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [roomEmpty, setRoomEmpty] = useState(0);
  const [roomRenting, setRoomRenting] = useState(0);
  const [totalPriceRoomMother, setTotalPriceRoomMother] = useState(0);
  const [totalPriceElectricityMother, setTotalPriceElectricityMother] = useState(0);
  const [totalPriceWaterMother, setTotalPriceWaterMother] = useState(0);
  const [totalPriceServiceMother, setTotalPriceServiceMother] = useState(0);
  const [totalPriceMother, setTotalPriceMother] = useState(0);
  const [listTotalPriceForMonth, setListTotalPriceForMonth] = useState([]);
  const [modalSearch, setModalSearch] = useState(false);
  const [listRoom, setListRoom] = useState([]);
  
  const token = localStorage.getItem("token");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Custom statistic card component
  const StatCard = ({ title, value, icon, color, suffix = "₫" }) => (
    <Card 
      hoverable 
      style={{ 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `2px solid ${color}20`
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <Statistic
        title={
          <Space>
            {icon}
            <Text style={{ fontSize: '14px', fontWeight: 500 }}>{title}</Text>
          </Space>
        }
        value={value}
        valueStyle={{ 
          color: color, 
          fontSize: '24px', 
          fontWeight: 'bold' 
        }}
        suffix={suffix}
        precision={0}
      />
    </Card>
  );

  // Section header component
  const SectionHeader = ({ title, subtitle }) => (
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <Title level={3} style={{ 
        color: '#1890ff', 
        marginBottom: '8px',
        fontWeight: 'bold'
      }}>
        {title}
      </Title>
      {subtitle && (
        <Text type="secondary" style={{ fontSize: '16px' }}>
          {subtitle}
        </Text>
      )}
    </div>
  );

  // Fetch functions
  useEffect(() => {
    const fetchAllPrice = async () => {
      setLoading(true);
      try {
        const response = await StatisticalService.getTotalPrice(token);
        setTotalPriceElectricity(response.totalElectricityPrice);
        setTotalPriceWater(response.totalWaterPrice);
        setTotalPriceRoom(response.totalRoomPrice);
        setTotalPriceService(response.totalServicePrice);
        setTotalPrice(response.totalElectricityPrice + response.totalWaterPrice + response.totalRoomPrice + response.totalServicePrice);
        setRoomEmpty(response.totalAvailable);
        setRoomRenting(response.totalRented);
      } catch (error) {
        console.error("Error fetching total price:", error);
        message.error("Không thể tải dữ liệu tổng quan");
      } finally {
        setLoading(false);
      }
    };
    fetchAllPrice();
  }, [token]);

  useEffect(() => {
    const fetchAllPriceMother = async () => {
      try {
        const response = await StatisticalService.getTotalPriceMother(token);
        setTotalPriceElectricityMother(response.totalElectricity);
        setTotalPriceWaterMother(response.totalWater);
        setTotalPriceRoomMother(response.totalRoomPrice);
        setTotalPriceServiceMother(response.totalService);
        setTotalPriceMother(response.totalElectricity + response.totalWater + response.totalRoomPrice + response.totalService);
      } catch (error) {
        console.error("Error fetching total price:", error);
        message.error("Không thể tải dữ liệu tháng hiện tại");
      }
    };
    fetchAllPriceMother();
  }, [token]);

  useEffect(() => {
    const getAllRooms = async () => {
      try {
        const response = await RoomService.getAllRooms(token);
        setListRoom(response);
      } catch (error) {
        console.error("Error fetching room data:", error);
        message.error("Không thể tải danh sách phòng");
      }
    };
    getAllRooms();
  }, [token]);

  useEffect(() => {
    const getListTotalPriceForMonther = async () => {
      try {
        const response = await StatisticalService.getListTotalPriceForMother(token);
        setListTotalPriceForMonth(response);
      } catch (error) {
        console.error("Error fetching list total price for mother:", error);
        message.error("Không thể tải dữ liệu biểu đồ");
      }
    };
    getListTotalPriceForMonther();
  }, [token]);

  const handleFinish = (values) => {
    setSelectedRoom(values.room);
    setModalSearch(true);
    setRange(values.range);
  };

  // Prepare pie chart data
  const pieData = [
    { name: 'Tiền phòng', value: totalPriceRoom, color: '#722ed1' },
    { name: 'Tiền điện', value: totalPriceElectricity, color: '#faad14' },
    { name: 'Tiền nước', value: totalPriceWater, color: '#1890ff' },
    { name: 'Tiền dịch vụ', value: totalPriceService, color: '#ff4d4f' }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title={
          <Space>
            <BarChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              Thống kê hệ thống phòng trọ
            </Title>
          </Space>
        }
        style={{ 
          maxWidth: 1600, 
          margin: "0 auto",
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* Search Form */}
        <Card 
          style={{ 
            marginBottom: 32, 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <Form
            form={form}
            layout="inline"
            onFinish={handleFinish}
            style={{ 
              justifyContent: "center", 
              display: "flex",
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <Form.Item
              name="room"
              label={<Text style={{ color: 'white', fontWeight: 'bold' }}>Chọn phòng trọ</Text>}
              rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}
            >
              <Select 
                placeholder="Chọn phòng" 
                style={{ width: 300 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listRoom.map((room) => (
                  <Option key={room.id} value={room.id}>
                    <Space>
                      <HomeOutlined />
                      {room.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                icon={<BarChartOutlined />}
                style={{
                  background: '#52c41a',
                  borderColor: '#52c41a',
                  fontWeight: 'bold'
                }}
              >
                Thống kê chi tiết
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <ModalSearchStatistical 
          visible={modalSearch} 
          onClose={() => setModalSearch(false)} 
          roomId={selectedRoom} 
        />

        {/* Annual Statistics */}
        <SectionHeader 
          title={`📊 Tổng quan hệ thống năm ${currentYear}`}
          subtitle="Thống kê tổng doanh thu và tình trạng phòng trọ"
        />
        
        <Spin spinning={loading}>
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Tổng doanh thu"
                value={totalPrice}
                icon={<RiseOutlined style={{ color: '#3f8600' }} />}
                color="#3f8600"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Tiền điện"
                value={totalPriceElectricity}
                icon={<ThunderboltOutlined style={{ color: '#faad14' }} />}
                color="#faad14"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Tiền nước"
                value={totalPriceWater}
                icon={<DropboxOutlined style={{ color: '#1890ff' }} />}
                color="#1890ff"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Phòng đang thuê"
                value={roomRenting}
                icon={<HomeOutlined style={{ color: '#52c41a' }} />}
                color="#52c41a"
                suffix="phòng"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Phòng trống"
                value={roomEmpty}
                icon={<HomeOutlined style={{ color: '#ff4d4f' }} />}
                color="#ff4d4f"
                suffix="phòng"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Tỷ lệ lấp đầy"
                value={roomRenting + roomEmpty > 0 ? ((roomRenting / (roomRenting + roomEmpty)) * 100).toFixed(1) : 0}
                icon={<BarChartOutlined style={{ color: '#722ed1' }} />}
                color="#722ed1"
                suffix="%"
              />
            </Col>
          </Row>
        </Spin>

        <Divider style={{ margin: '48px 0', borderColor: '#1890ff' }} />

        {/* Monthly Statistics */}
        <SectionHeader 
          title={`📈 Doanh thu tháng ${currentMonth}/${currentYear}`}
          subtitle="Thống kê chi tiết doanh thu tháng hiện tại"
        />
        
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Tổng doanh thu"
              value={totalPriceMother}
              icon={<DollarCircleOutlined style={{ color: '#3f8600' }} />}
              color="#3f8600"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Tiền điện"
              value={totalPriceElectricityMother}
              icon={<ThunderboltOutlined style={{ color: '#faad14' }} />}
              color="#faad14"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Tiền nước"
              value={totalPriceWaterMother}
              icon={<DropboxOutlined style={{ color: '#1890ff' }} />}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Tiền dịch vụ"
              value={totalPriceServiceMother}
              icon={<CalendarOutlined style={{ color: '#ff4d4f' }} />}
              color="#ff4d4f"
            />
          </Col>
        </Row>

        <Divider style={{ margin: '48px 0', borderColor: '#1890ff' }} />

        {/* Charts Section */}
        <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
          {/* Bar Chart */}
          <Col xs={24} lg={16}>
            <Card 
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#1890ff' }} />
                  <Text strong>Biểu đồ doanh thu theo tháng - {currentYear}</Text>
                </Space>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={listTotalPriceForMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d9d9d9' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d9d9d9' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value.toLocaleString("vi-VN") + " ₫", name]}
                    labelStyle={{ color: '#666' }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #d9d9d9',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="totalMonth" name="Tổng doanh thu" fill="#3f8600" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalElectricity" name="Tiền điện" fill="#faad14" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalWater" name="Tiền nước" fill="#1890ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalService" name="Tiền dịch vụ" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalRoom" name="Tiền phòng" fill="#722ed1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Pie Chart */}
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Space>
                  <PieChart style={{ color: '#1890ff' }} />
                  <Text strong>Cơ cấu doanh thu năm {currentYear}</Text>
                </Space>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => value.toLocaleString("vi-VN") + " ₫"}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #d9d9d9',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Data Table */}
        <Card 
          title={
            <Space>
              <CalendarOutlined style={{ color: '#1890ff' }} />
              <Text strong>Chi tiết doanh thu theo tháng</Text>
            </Space>
          }
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Table
            columns={columns}
            dataSource={listTotalPriceForMonth}
            rowKey="month"
            pagination={{
              pageSize: 12,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
            }}
            bordered
            size="middle"
            scroll={{ x: 800 }}
            style={{ 
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default Statistical;