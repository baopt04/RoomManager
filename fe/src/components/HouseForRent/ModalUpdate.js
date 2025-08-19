import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, InputNumber, message } from "antd";
import HouseForRentService from "../../services/HouseForRentService";
import HostService from "../../services/HostService";

const { Option } = Select;

const ModalUpdate = ({ visible, onClose, houseData, hostId }) => {
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

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        host: { id: values.host },
      };
      await HouseForRentService.updateHouseForRent(
        localStorage.getItem("token"),
        houseData,
        payload
      );
      message.success("Cập nhật nhà cho thuê thành công!");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error updating house:", error);
      message.error("Không thể cập nhật nhà cho thuê!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật nhà cho thuê"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
      >
        <Form.Item
          label="Tên nhà thuê"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên nhà thuê" },
          { pattern: /^[\p{L}\d\s]+$/u, message: "Tên nhà thuê chỉ được chứa chữ cái, số và khoảng trắng" },
          { max: 200, message: "Tên nhà thuê không được vượt quá 50 ký tự" },
          { min: 2, message: "Tên nhà thuê phải có ít nhất 2 ký tự" }
          ]}
        >
          <Input placeholder="Nhập tên nhà thuê" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" },
          { pattern: /^[\p{L}\d\s,.-]+$/u, message: "Địa chỉ chỉ được chứa chữ cái, số, dấu phẩy, dấu chấm và dấu gạch ngang" },
          { max: 200, message: "Địa chỉ không được vượt quá 200 ký tự" },
          { min: 2, message: "Địa chỉ phải có ít nhất 2 ký tự" }
          ]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" },
          { type: 'number', min: 0, message: "Giá phải là một số dương" },
          {
            validator: (_, value) => {
              if (value > 1000000000) {
                return Promise.reject(new Error("Giá không được vượt quá 1 tỷ đồng"));
              }
            }
          }

          ]}
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
            <Option value="DANG_THUE">Đang thuê</Option>
            <Option value="NGUNG_THUE">Dừng thuê</Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdate;