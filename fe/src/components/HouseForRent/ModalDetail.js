import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, InputNumber, message } from "antd";
import HouseForRentService from "../../services/HouseForRentService";
import HostService from "../../services/HostService";

const { Option } = Select;

const ModalDetail = ({ visible, onClose, houseData, hostId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hostData, setHostData] = useState([]); 

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const data = await HostService.getAllHosts(localStorage.getItem("token"));
        setHostData(data);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        message.error("Không thể tải danh sách chủ nhà!");
      }
    };

    if (visible) {
      fetchHosts();
    }
  }, [visible]);

  useEffect(() => {
    const fetchHouseDetail = async () => {
      console.log("Check id house" , houseData);
      
      try {
        const data = await HouseForRentService.detailHouseForRent(
          localStorage.getItem("token"),
          houseData
        );
        form.setFieldsValue({
          name: data.name,
          address: data.address,
          price: data.price,
          status: data.status,
          host: data.host.id, 
          discription: data.discription,
        });
      } catch (error) {
        console.error("Error fetching house detail:", error);
        message.error("Không thể tải thông tin nhà thuê!");
      }
    };

    if (visible && houseData) {
      fetchHouseDetail();
    }
  }, [visible, houseData, form]);

 
  return (
    <Modal
      title="Chi tiết nhà cho thuê"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Tên nhà thuê"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên nhà thuê" }]}
        >
          <Input placeholder="Nhập tên nhà thuê" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá"
            formatter={(value) =>
              value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
            }
            parser={(value) => value?.replace(/\₫\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>
        <Form.Item
          label="Chọn chủ nhà"
          name="host"
          rules={[{ required: true, message: "Vui lòng chọn chủ nhà" }]}
        >
          <Select placeholder="Chọn chủ nhà" allowClear>
            {hostData.map((host) => (
              <Option key={host.id} value={host.id}>
                {host.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Ghi chú"
          name="discription"
          rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
        >
          <Input.TextArea placeholder="Nhập ghi chú" rows={4} />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option  value="DANG_THUE">Đang thuê</Option>
            <Option value="NGUNG_THUE">Dừng thuê</Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" onClick={onClose}>
           Quay lại
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetail;