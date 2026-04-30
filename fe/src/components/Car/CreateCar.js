import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, DatePicker, Upload, Row, Col, message, Typography, Modal, ColorPicker } from "antd";
import { PlusOutlined, UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import CustomerService from "../../services/CustomerService";
import CarService from "../../services/CarService";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;
const CreateCar = () => {
  const [form] = Form.useForm();
  const [roomList, setRoomList] = useState([]);
  const [carList, setCarList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
const navigator = useNavigate();
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await RoomService.getAllRooms(token);
        setRoomList(res);
      } catch (error) {
        message.error("Không thể lấy danh sách phòng!");
      }
    };
    fetchRooms();
  }, [token]);
  
  useEffect(() => {
    const fetchCustomer = async () => {
      
      try {
        const res = await CustomerService.getAllCustomers(token);
        setCustomerList(res);
      } catch (error) {
        message.error("Không thể lấy danh sách khách hàng!");
      }
    };
    fetchCustomer();
  }, [token]);

 
const addCar = (values) => {
  Modal.confirm({
    title: 'Xác nhận thêm xe mới',
    content: 'Bạn có chắc chắn muốn thêm xe mới này vào hệ thống không?',
    okText: 'Thêm mới',
    cancelText: 'Hủy',
    onOk: async () => {
      setLoading(true);
      try {
        const payLoad = {
          ...values,
          color: typeof values.color === 'string' ? values.color : values.color?.toHexString(),
          room: { id: values.room },
          customer: { id: values.customerId }
        };
        await CarService.createCar(token, payLoad);

        message.success("Thêm xe thành công!");
        form.resetFields();
        navigator("/car-management");
      } catch (error) {
        const msg = error?.response?.data?.message || "Có lỗi xảy ra khi thêm xe!";
        message.error(msg);
      } finally {
        setLoading(false);
      }
    }
  });
};

  return (
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 8, position: 'relative' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigator("/car-management")}
        style={{ position: 'absolute', top: 32, left: 32, fontWeight: 500 }}
      >
        Quay lại
      </Button>
      <Title level={2} style={{ textAlign: "center" }}>Thêm xe mới</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={addCar}
      >
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Biển số xe"
              name="licensePlate"
              rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}
            >
            <Input placeholder="Nhập biển số xe" style={{ width: "100%", minWidth: 250 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Loại xe"
              name="carType"
              rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
            >
                <Select placeholder="Chọn loại xe" style={{ width: "100%", minWidth: 250 }}>
                  <Option value="XE_MAY">Xe máy</Option>
                    <Option value="XE_DAP">Xe đạp</Option>
                    <Option value="XE_DAP_DIEN">Xe đạp điện</Option>
                    <Option value="XE_O_TO">Xe ô tô</Option>
                </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Hãng xe"
              name="brandCar"
              rules={[{ required: true, message: "Vui lòng nhập hãng xe" }]}
            >
            <Input placeholder="Nhập hãng xe" style={{ width: "100%", minWidth: 250 }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Màu sắc"
              name="color"
              rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
            >
              <ColorPicker showText format="hex" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phòng trọ thuê"
              name="room"
              rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}
            >
              <Select placeholder="Chọn phòng trọ ký hợp đồng" style={{ width: "100%", minWidth: 250 }}>
                {roomList.map(room => (
                  <Option key={room.id} value={room.id}>{room.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Khách hàng thuê"
              name="customerId"
              rules={[{ required: true, message: "Vui lòng chọn khách hàng thuê" }]}
            >
              <Select placeholder="Chọn khách hàng" style={{ width: "100%", minWidth: 250 }}>
                {customerList.map(customerList => (
                  <Option key={customerList.id} value={customerList.id}>{customerList.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
          
 
        <Form.Item style={{ textAlign: "left" }}>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
            Thêm xe
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCar;

