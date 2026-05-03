import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Radio } from "antd";
import HostService from "../../services/HostService";
import { message } from "antd";
const ModalUpdateHost = ({ visible, onClose, hostId, onSuccess }) => {
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
  const handleUpdate = async (values) => {
    Modal.confirm({
      title: 'Xác nhận cập nhật',
      content: 'Bạn có chắc chắn muốn cập nhật thông tin chủ nhà này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          await HostService.updateHost(token, hostId, values);
          message.success("Cập nhật thông tin chủ nhà thành công!");
          if (onSuccess) onSuccess();
          onClose();
        } catch (error) {
          if (error.response && error.response.data) {
            const messageFromServer = error.response.data.message;
            if (messageFromServer.includes("Số điện thoại")) {
              message.error("Số điện thoại đã tồn tại, vui lòng sử dụng số khác.");
            } else if (messageFromServer.includes("Email đã tồn tại")) {
              message.error("Email đã tồn tại, vui lòng sử dụng email khác.");
            } else {
              message.error(messageFromServer || "Dữ liệu không hợp lệ!");
            }
          } else {
            message.error("Không thể kết nối đến server, vui lòng kiểm tra lại.");
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Modal
      title="Cập nhật thông tin chủ nhà"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={hostData}
        onFinish={handleUpdate}
      >
        <Form.Item
          label="Họ tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" },
          { pattern: /^[\p{L}\s]+$/u, message: "Họ và tên chỉ chứa chữ cái và khoảng trắng" },
          { max: 50, message: "Họ và tên không được vượt quá 50 ký tự" },
          { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự" }
          ]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Vui lòng nhập đúng định dạng email!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="numberPhone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" },
          { pattern: /^0[0-9]{9}$/, message: "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số" }
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalUpdateHost;
