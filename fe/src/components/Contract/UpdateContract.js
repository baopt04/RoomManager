import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, DatePicker, Upload, Row, Col, message, Typography, Space, Modal } from "antd";
import { PlusOutlined, UploadOutlined, CalendarOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import RoomService from "../../services/RoomService";
import ContractService from "../../services/ContractService";
import HouseForRentService from "../../services/HouseForRentService";
import CustomerService from "../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const { Option } = Select;
const { Title } = Typography;

const { TextArea } = Input;
const UpdateContract = () => {
  const [form] = Form.useForm();
  const [roomList, setRoomList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [houseList, setHouseList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const token = localStorage.getItem("token");
  const { contractId } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
    const fetchHouse = async () => {
      try {
        const res = await HouseForRentService.getAllHouseForRent(token);
        setHouseList(res);
      }
      catch (error) {
        message.error("Không thể lấy danh sách nhà cho thuê!");
      }
    }
    fetchHouse();
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

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        if (contractId) {
          const response = await ContractService.detailContract(token, contractId);

          form.setFieldsValue({
            dateStart: dayjs(response.dateStart, 'DD/MM/YYYY'),
            dateEnd: dayjs(response.dateEnd, 'DD/MM/YYYY'),
            nextDueDate: dayjs(response.nextDueDate, 'DD/MM/YYYY'),
            contractDeponsit: response.contractDeponsit,
            roomId: response.roomId,
            houseForRentId: response.houseForRentId,
            customerId: response.customerId,
            description: response.description,
            status: response.status
          });


          if (response.imageUrls && Array.isArray(response.imageUrls)) {
            const formattedFileList = response.imageUrls.map((url, index) => ({
              uid: `-${index}`,
              name: `image-${index + 1}.jpg`,
              status: 'done',
              url: url,
            }));
            setFileList(formattedFileList);
          }
        }
      } catch (error) {
        message.error("Không thể lấy thông tin hợp đồng!");
      }
    }
    fetchContractDetails();
  }, [form, token, contractId]);
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handLeUpdateContract = (values) => {
    Modal.confirm({
      title: 'Xác nhận cập nhật hợp đồng',
      content: 'Bạn có chắc chắn muốn lưu các thay đổi cho hợp đồng này không?',
      okText: 'Cập nhật',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const formData = new FormData();

          // Append các field khác (trừ images)
          Object.keys(values).forEach((key) => {
            if (key !== "images") {
              formData.append(key, values[key]);
            }
          });
          formData.append("adminId", "e6c59463-fb23-4006-8380-82326ae7a878");

          const remainOldUrls = fileList
            .filter((file) => !file.originFileObj && file.url)
            .map((file) => file.url);

          const newFiles = fileList.filter((file) => !!file.originFileObj);

          // LOGIC CHÍNH: Chỉ gửi 1 trong 2 loại
          if (newFiles.length > 0) {
            newFiles.forEach((file) => {
              formData.append("images", file.originFileObj);
            });
            remainOldUrls.forEach((url) => {
              formData.append("imageUrls", url);
            });
          } else if (remainOldUrls.length > 0) {
            remainOldUrls.forEach((url) => {
              formData.append("imageUrls", url);
            });
          }

          await ContractService.updateContract(token, contractId, formData);
          message.success("Cập nhật hợp đồng thành công!");
          form.resetFields();
          setFileList([]);
          navigator("/admin/contracts");
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
          } else {
            message.error("Lỗi khi cập nhật hợp đồng, vui lòng thử lại sau!");
          }
        }
      }
    });
  };

  const handleDateStartChange = (date) => {
    if (date) {
      const nextDueDate = date.clone().add(1, 'month');
      form.setFieldsValue({ nextDueDate: nextDueDate });
    }
  };

  const handleRoomChange = (roomId) => {
    const selectedRoom = roomList.find(r => r.id === roomId);
    if (selectedRoom) {
      form.setFieldsValue({ contractDeponsit: selectedRoom.price });
    }
  };

  const returnBack = () => {
    navigator("/admin/contracts");
    form.resetFields();
    setFileList([]);
  }

  const handleDurationSelect = (months) => {
    const dateStart = form.getFieldValue("dateStart");
    if (!dateStart) {
      message.warning("Vui lòng chọn ngày ký hợp đồng trước!");
      return;
    }
    const dateEnd = dateStart.clone().add(months, 'month');
    form.setFieldsValue({ dateEnd: dateEnd });
  };


  return (
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: isMobile ? 16 : 32, background: "#fff", borderRadius: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={returnBack}
          style={{ paddingLeft: 0, fontWeight: 500 }}
        >
          Quay lại
        </Button>
      </div>
      <Title level={2} style={{ textAlign: "center", marginTop: 0 }}>Cập nhật hợp đồng</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handLeUpdateContract}
      >
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày ký hợp đồng"
              name="dateStart"
              rules={[{ required: true, message: "Vui lòng chọn ngày ký hợp đồng" }]}
            >
              <DatePicker
                style={{ width: "100%", minWidth: 250 }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày ký hợp đồng"
                onChange={handleDateStartChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <Space>
                  <span>Ngày hết hạn</span>
                  <Space size={4}>
                    <Button type="dashed" size="small" onClick={() => handleDurationSelect(3)}>3 tháng</Button>
                    <Button type="dashed" size="small" onClick={() => handleDurationSelect(6)}>6 tháng</Button>
                    <Button type="dashed" size="small" onClick={() => handleDurationSelect(12)}>1 năm</Button>
                  </Space>
                </Space>
              }
              name="dateEnd"
              rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
            >
              <DatePicker style={{ width: "100%", minWidth: 250 }} format="DD/MM/YYYY" placeholder="Chọn ngày hết hạn hợp đồng" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phòng trọ thuê"
              name="roomId"
              rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}
            >
              <Select
                placeholder="Chọn phòng trọ ký hợp đồng"
                style={{ width: "100%", minWidth: 250 }}
                onChange={handleRoomChange}
              >
                {roomList.map(room => (
                  <Option key={room.id} value={room.id}>{room.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày thanh toán"
              name="nextDueDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày thanh toán" }]}
            >
              <DatePicker style={{ width: "100%", minWidth: 250 }} format="DD/MM/YYYY" placeholder="Chọn ngày thanh toán tiếp theo" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tiền đặt cọc"
              name="contractDeponsit"
              rules={[{ required: true, message: "Vui lòng nhập tiền đặt cọc" }]}
            >
              <InputNumber
                placeholder="Nhập tiền đặt cọc"
                style={{ width: "100%", minWidth: 250 }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nhà cho thuê"
              name="houseForRentId"
              rules={[{ required: true, message: "Vui lòng chọn nhà cho thuê" }]}
            >
              <Select placeholder="Chọn nhà cho thuê" style={{ width: "100%", minWidth: 250 }}>
                {houseList.map(houseList => (
                  <Option key={houseList.id} value={houseList.id}>{houseList.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
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
          <Col xs={24} md={12}>
            <Form.Item
              label="Ghi chú"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
            >
              <Input.TextArea
                placeholder="Nhập ghi chú"
                style={{ width: "100%", minWidth: 250 }}
                rows={1}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái" style={{ width: "100%", minWidth: 250 }}>
                <Option value="KICH_HOAT">Đang sử dụng</Option>
                <Option value="NGUNG_KICH_HOAT">Ngừng sử dụng</Option>
                <Option value="DUNG_KINH_DOANH">Ngừng kinh doanh</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Ảnh hợp đồng"
          name="images"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            multiple
            style={{ display: "flex", gap: 16 }}
          >
            {fileList.length < 8 && (
              <Button icon={<UploadOutlined />} style={{ height: '100px' }}>Chọn ảnh</Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item style={{ textAlign: "left" }}>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Cập nhật hợp đồng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateContract;


