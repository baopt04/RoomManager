import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Radio } from "antd";
import HostService from "../../services/HostService";
const ModalDetailHost = ({ visible, onClose, hostId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hostData, setHostData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const data = await HostService.detailHost(token, hostId);
        setHostData(data);
        form.setFieldsValue(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chủ nhà:", error);
      }
    };
    if (hostId) {
      fetchHostData();
    }
  }, [hostId, form, token]);


  return (
    <Modal
      title="Chi tiết thông tin chủ nhà"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={hostData}
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" disabled />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Vui lòng nhập đúng định dạng email!" },
          ]}
        >
          <Input placeholder="Nhập email" disabled />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="numberPhone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" disabled />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Radio.Group>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={onClose}
            disabled={loading}
            type="primary"
          >
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalDetailHost;

