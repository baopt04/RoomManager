import React, { useState } from "react";
import { Form, Input, Button, Radio, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./CreateHost.css";
import { useNavigate } from "react-router-dom"; 
import HostService from "../../services/HostService";
import { message } from "antd";
const CreateHost = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const token = localStorage.getItem("token");
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleSubmit = async (values) => {
    Modal.confirm({
      title: 'Xác nhận thêm chủ nhà',
      content: 'Bạn có chắc chắn muốn thêm chủ nhà mới này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          await HostService.createHost(token, values);
          message.success("Thêm chủ nhà thành công!");
          navigate("/host-management");
        } catch (error) {
          console.error("Lỗi từ catch:", error);
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
  
  
  
  
  
const navigate = useNavigate();
  const handleReturn = () => {
    navigate("/host-management"); 
  };
  return (
    <div className="create-host-container">
      <div style={{ marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleReturn}
          style={{ paddingLeft: 0, fontWeight: 500 }}
        >
          Quay lại
        </Button>
      </div>
      <h2 style={{ textAlign: 'center', fontSize: isMobile ? '28px' : '30px' , marginBottom: "20px", marginTop: 0 }}>Thêm chủ nhà mới</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: "auto", margin: "0 auto"  }}
      >
        {/* Row 1 */}
        <div className="form-row">
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" } ,
              { pattern: /^[\p{L}\s]+$/u, message: "Họ và tên chỉ chứa chữ cái và khoảng trắng" },
              { max: 50, message: "Họ và tên không được vượt quá 50 ký tự" },
              { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự" }

            ]}
            className="form-item"
          >
            <Input placeholder="Vui lòng nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Vui lòng nhập đúng định dạng email!" },
            ]}
            className="form-item"
          >
            <Input placeholder="Vui lòng nhập email " />
          </Form.Item>
        </div>

        {/* Row 2 */}
        <div className="form-row">
          <Form.Item
            label="Số điện thoại"
            name="numberPhone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" } ,
              { pattern: /^0[0-9]{9}$/, message: "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số" }
            ]}
            className="form-item"
          >
            <Input placeholder="Vui lòng nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            className="form-item"
          >
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="form-submit">
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm chủ nhà mới
          </Button>
        </div>


      </Form>
    </div>
  );
};

export default CreateHost;