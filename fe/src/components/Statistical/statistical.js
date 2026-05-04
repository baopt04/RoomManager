import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Select,
  Button,
  Row,
  Col,
  Statistic,
  Table,
  message,
  Space,
  Typography,
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
  RiseOutlined,
  SearchOutlined,
  FileExcelOutlined
} from "@ant-design/icons";
// XLSX is loaded dynamically only when needed to reduce bundle size

import dayjs from "dayjs";
import StatisticalService from "../../services/StatisticalService";
import ModalSearchStatistical from "./ModalSearchStatistical";
import RoomService from "../../services/RoomService";

const { Option } = Select;
const { Title, Text } = Typography;

const COLORS = ['#722ed1', '#faad14', '#1677ff', '#ff4d4f'];

const columns = [
  {
    title: "Tháng",
    dataIndex: "month",
    key: "month",
    align: 'center',
    width: 80,
  },
  {
    title: "Năm",
    dataIndex: "year",
    key: "year",
    align: 'center',
    width: 80,
  },
  {
    title: "Tiền điện",
    dataIndex: "totalElectricity",
    key: "totalElectricity",
    align: 'right',
    render: (v) => <Text>{v.toLocaleString("vi-VN")} ₫</Text>,
  },
  {
    title: "Tiền nước",
    dataIndex: "totalWater",
    key: "totalWater",
    align: 'right',
    render: (v) => <Text>{v.toLocaleString("vi-VN")} ₫</Text>,
  },
  {
    title: "Tiền dịch vụ",
    dataIndex: "totalService",
    key: "totalService",
    align: 'right',
    render: (v) => <Text>{v.toLocaleString("vi-VN")} ₫</Text>,
  },
  {
    title: "Tiền phòng",
    dataIndex: "totalRoom",
    key: "totalRoom",
    align: 'right',
    render: (v) => <Text>{v.toLocaleString("vi-VN")} ₫</Text>,
  },
  {
    title: "Tổng doanh thu",
    dataIndex: "totalMonth",
    key: "totalMonth",
    align: 'right',
    render: (v) => <Text style={{ fontWeight: 600 }}>{v.toLocaleString("vi-VN")} ₫</Text>,
  },
];

const Statistical = () => {
  const [form] = Form.useForm();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const startTime = Date.now();
      try {
        const [totalPriceRes, totalPriceMotherRes, allRoomsRes, totalMonthRes] = await Promise.all([
          StatisticalService.getTotalPrice(token),
          StatisticalService.getTotalPriceMother(token),
          RoomService.getAllRooms(token),
          StatisticalService.getListTotalPriceForMother(token)
        ]);

        // Đảm bảo delay ít nhất 2 giây để phù hợp môi trường deploy
        /*
        const elapsedTime = Date.now() - startTime;
        if (false && elapsedTime < 2000) {
          await new Promise(resolve => setTimeout(resolve, 2000 - elapsedTime));
        }
        */

        // Set dữ liệu tổng quan
        setTotalPriceElectricity(totalPriceRes.totalElectricityPrice);
        setTotalPriceWater(totalPriceRes.totalWaterPrice);
        setTotalPriceRoom(totalPriceRes.totalRoomPrice);
        setTotalPriceService(totalPriceRes.totalServicePrice);
        setTotalPrice(totalPriceRes.totalElectricityPrice + totalPriceRes.totalWaterPrice + totalPriceRes.totalRoomPrice + totalPriceRes.totalServicePrice);
        setRoomEmpty(totalPriceRes.totalAvailable);
        setRoomRenting(totalPriceRes.totalRented);

        // Set dữ liệu tháng hiện tại
        setTotalPriceElectricityMother(totalPriceMotherRes.totalElectricity);
        setTotalPriceWaterMother(totalPriceMotherRes.totalWater);
        setTotalPriceRoomMother(totalPriceMotherRes.totalRoomPrice);
        setTotalPriceServiceMother(totalPriceMotherRes.totalService);
        setTotalPriceMother(totalPriceMotherRes.totalElectricity + totalPriceMotherRes.totalWater + totalPriceMotherRes.totalRoomPrice + totalPriceMotherRes.totalService);

        // Set danh sách phòng và dữ liệu tháng
        setListRoom(allRoomsRes);
        setListTotalPriceForMonth(totalMonthRes);

      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Lỗi khi tải dữ liệu thống kê!");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [token]);

  const handleFinish = (values) => {
    setSelectedRoom(values.room);
    setModalSearch(true);
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);

      // Dynamically load XLSX library to reduce initial bundle size
      const XLSX = await import('xlsx');


      const [rooms, customers, revenueByRoom] = await Promise.all([
        StatisticalService.getTotalRoom(token),
        StatisticalService.getTotalCustomer(token),
        StatisticalService.getTotalPriceForRoomMother(token)
      ]);

      const formatCurrency = (value) => {
        if (value === null || value === undefined) return "0 VNĐ";
        return new Intl.NumberFormat('vi-VN').format(value) + " VNĐ";
      };

      const formatDate = (date) => {
        if (!date) return "N/A";
        return dayjs(date).format("DD/MM/YYYY");
      };

      const formatStatus = (status) => {
        switch (status) {
          case "DANG_CHO_THUE": return "Đang cho thuê";
          case "TRONG": return "Trống";
          case "DA_COC": return "Đã cọc";
          default: return status;
        }
      };

      // 1. Prepare Room Data
      const roomData = (rooms || []).map((item, index) => ({
        "STT": index + 1,
        "Tên phòng": item.name,
        "Trạng thái": formatStatus(item.status),
        "Diện tích": item.acreage,
        "Mã phòng": item.code,
        "Giá phòng": formatCurrency(item.price),
        "Tên nhà": item.houseName
      }));

      // 2. Prepare Customer Data
      const customerData = (customers || []).map((item, index) => ({
        "STT": index + 1,
        "Tên khách hàng": item.name,
        "Số điện thoại": item.numberPhone,
        "Ngày bắt đầu": formatDate(item.dateStart),
        "CCCD": item.cccd,
        "Tên phòng": item.roomName
      }));

      // 3. Prepare Revenue Data
      const revenueData = (revenueByRoom || []).map((item, index) => ({
        "STT": index + 1,
        "Năm": item.year,
        "Tháng": item.month,
        "Tên phòng": item.roomName,
        "Tiền phòng": formatCurrency(item.roomPrice),
        "Tiền điện": formatCurrency(item.electricityPrice),
        "Tiền nước": formatCurrency(item.waterPrice),
        "Tiền dịch vụ": formatCurrency(item.servicePrice),
        "Tổng cộng": formatCurrency(item.totalAmount)
      }));

      // Helper to create sheet with header
      const createSheetWithHeader = (data, title, numCols) => {
        const header = [
          ["THỐNG KÊ HỆ THỐNG PHÒNG TRỌ TIẾN ĐỨC LAND"],
          [title.toUpperCase()],
          [`Người cung cấp phần mềm: baothanhdev`],
          [`Ngày xuất báo cáo: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`],
          []
        ];

        const ws = XLSX.utils.aoa_to_sheet(header);

        // Add table data starting from A6
        XLSX.utils.sheet_add_json(ws, data, { origin: "A6" });

        // Merge header rows across all columns
        ws["!merges"] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }, // Title
          { s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } }, // Sheet Title
          { s: { r: 2, c: 0 }, e: { r: 2, c: numCols - 1 } }, // Provider
          { s: { r: 3, c: 0 }, e: { r: 3, c: numCols - 1 } }  // Date
        ];

        // Basic column width adjustment
        const colWidths = Array(numCols).fill({ wch: 15 });
        colWidths[0] = { wch: 6 }; // STT
        ws["!cols"] = colWidths;

        return ws;
      };

      // Create Workbook and Sheets
      const wb = XLSX.utils.book_new();

      const wsRooms = createSheetWithHeader(roomData, "Danh sách phòng trọ", 7);
      const wsCustomers = createSheetWithHeader(customerData, "Danh sách khách hàng", 6);
      const wsRevenue = createSheetWithHeader(revenueData, "Chi tiết doanh thu theo từng phòng", 9);

      // Add sheets to workbook
      XLSX.utils.book_append_sheet(wb, wsRooms, "Danh sách phòng");
      XLSX.utils.book_append_sheet(wb, wsCustomers, "Danh sách khách hàng");
      XLSX.utils.book_append_sheet(wb, wsRevenue, "Doanh thu theo phòng");

      const fileName = `Bao_cao_thong_ke_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      message.success("Xuất file Excel thành công!");
    } catch (error) {
      console.error("Export error:", error);
      message.error("Lỗi khi xuất file Excel!");
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Tiền phòng', value: totalPriceRoom, color: '#722ed1' },
    { name: 'Tiền điện', value: totalPriceElectricity, color: '#faad14' },
    { name: 'Tiền nước', value: totalPriceWater, color: '#1677ff' },
    { name: 'Tiền dịch vụ', value: totalPriceService, color: '#ff4d4f' }
  ];

  const formatValue = (v) => v.toLocaleString("vi-VN") + " ₫";

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Thống kê</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Tổng quan hệ thống năm {currentYear}</Text>
        </div>
        <Button
          icon={<FileExcelOutlined />}
          onClick={handleExportExcel}
          style={{ borderRadius: 8 }}
        >
          Xuất báo cáo Excel
        </Button>
      </div>

      {/* Search Form */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleFinish}
          style={{ display: "flex", alignItems: 'center', gap: '12px' }}
        >
          <Form.Item
            name="room"
            rules={[{ required: true, message: "Chọn phòng" }]}
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="Chọn phòng trọ"
              style={{ width: 260 }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listRoom.map((room) => (
                <Option key={room.id} value={room.id}>
                  {room.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
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

      {/* Annual Overview */}
      <Spin spinning={loading}>
        <Row gutter={16} className="stat-row">
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="Tổng doanh thu"
                value={totalPrice}
                suffix="₫"
                prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="Tiền phòng"
                value={totalPriceRoom}
                suffix="₫"
                prefix={<HomeOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="Tiền điện"
                value={totalPriceElectricity}
                suffix="₫"
                prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="Tiền nước"
                value={totalPriceWater}
                suffix="₫"
                prefix={<DropboxOutlined style={{ color: '#1677ff' }} />}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="Đang thuê"
                value={roomRenting}
                suffix="phòng"
                prefix={<HomeOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="Phòng trống"
                value={roomEmpty}
                suffix="phòng"
                prefix={<HomeOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ fontSize: '18px' }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Monthly Stats */}
      <div style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>
          Doanh thu tháng {currentMonth}/{currentYear}
        </Text>
      </div>
      <Row gutter={16} className="stat-row">
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Tổng tháng" value={totalPriceMother} suffix="₫" prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ fontSize: '16px' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Tiền điện" value={totalPriceElectricityMother} suffix="₫" prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />} valueStyle={{ fontSize: '16px' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Tiền nước" value={totalPriceWaterMother} suffix="₫" prefix={<DropboxOutlined style={{ color: '#1677ff' }} />} valueStyle={{ fontSize: '16px' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Tiền dịch vụ" value={totalPriceServiceMother} suffix="₫" prefix={<CalendarOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ fontSize: '16px' }} />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={16}>
          <Card size="small" title={<Text style={{ fontWeight: 500 }}>Doanh thu theo tháng - {currentYear}</Text>}>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={listTotalPriceForMonth} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value, name) => [formatValue(value), name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '13px' }}
                  itemStyle={{ color: 'var(--color-text)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
                <Bar dataKey="totalMonth" name="Tổng" fill="#52c41a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="totalElectricity" name="Điện" fill="#faad14" radius={[3, 3, 0, 0]} />
                <Bar dataKey="totalWater" name="Nước" fill="#1677ff" radius={[3, 3, 0, 0]} />
                <Bar dataKey="totalService" name="Dịch vụ" fill="#ff4d4f" radius={[3, 3, 0, 0]} />
                <Bar dataKey="totalRoom" name="Phòng" fill="#722ed1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card size="small" title={<Text style={{ fontWeight: 500 }}>Cơ cấu doanh thu</Text>}>
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'var(--color-text-muted)' }}
                  style={{ fontSize: '12px' }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatValue(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '13px' }}
                  itemStyle={{ color: 'var(--color-text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Data Table */}
      <Card size="small" title={<Text style={{ fontWeight: 500 }}>Chi tiết doanh thu theo tháng</Text>}>
        <Table
          columns={columns}
          dataSource={listTotalPriceForMonth}
          rowKey="month"
          pagination={{ pageSize: 12 }}
          size="middle"
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default Statistical;
