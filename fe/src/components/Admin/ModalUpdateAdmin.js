import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message, Select, Modal } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import AdminService from "../../services/AdminService";
const { Title, Text } = Typography;
const { Option } = Select;

const ModalUpdateAdmin = ({ visible, onclose, id, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const token = localStorage.getItem('token')
    const close = () => {

        onclose();
        form.resetFields();
    }
    const validatePhone = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng nhập số điện thoại!'));
        }
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(value)) {
            return Promise.reject(new Error('Số điện thoại không hợp lệ!'));
        }
        return Promise.resolve();
    };
    useEffect(() => {
        const detailAdmin = async () => {
            try {
                const response = await AdminService.detailAdmin(token, id);
                form.setFieldsValue({
                    name: response.name,
                    email: response.email,
                    numberPhone: response.numberPhone,
                    role: response.role
                })

            } catch (error) {
                

            }
        }
        detailAdmin();
    }, [token, id, form])
    const updateAdmin = async (values) => {
        try {
            const response = await AdminService.updateAdmin(token, values, id);
            
            message.success("Cập nhật thành công!")
            if (onSuccess) {
                await onSuccess();
            }
            onclose();
        } catch (error) {
            if (error.response) {
                const messageError = error.response.data?.message;
                if (messageError) {
                    message.error(messageError);
                    setLoading(false);
                } else {
                    message.error("Đã có lỗi xảy ra với server");
                }
            }
        }
    }
    return (
        <Modal
            visible={visible}
            onCancel={close}
            footer={null}
        >

            <div style={{ textAlign: "center" }}>
                <Title
                    level={2}
                    style={{
                        margin: 0,
                        color: "#2d3748",
                        fontWeight: "700",
                        fontSize: "28px"
                    }}
                >
                    🏠 Cập nhật tài khoản
                </Title>

            </div>
            <Form
                form={form}
                name="register_form"
                layout="vertical"
                onFinish={updateAdmin}
                autoComplete="off"
                size="large"
            >
                <Form.Item
                    label={
                        <span style={{
                            color: "#2d3748",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}>
                            👤 Họ và tên
                        </span>
                    }
                    name="name"
                    rules={[
                        { required: true, message: "Vui lòng nhập họ tên!" },
                        { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" }
                    ]}
                    style={{ marginBottom: "18px" }}
                >
                    <Input
                        prefix={<UserOutlined style={{ color: "#718096" }} />}
                        placeholder="Nhập họ và tên đầy đủ"
                        style={{
                            borderRadius: "10px",
                            border: "2px solid #e2e8f0",
                            padding: "10px 14px",
                            fontSize: "15px",
                            transition: "all 0.3s ease"
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span style={{
                            color: "#2d3748",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}>
                            📧 Email
                        </span>
                    }
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" }
                    ]}
                    style={{ marginBottom: "18px" }}
                >
                    <Input
                        prefix={<MailOutlined style={{ color: "#718096" }} />}
                        placeholder="Nhập địa chỉ email"
                        style={{
                            borderRadius: "10px",
                            border: "2px solid #e2e8f0",
                            padding: "10px 14px",
                            fontSize: "15px",
                            transition: "all 0.3s ease"
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span style={{
                            color: "#2d3748",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}>
                            📱 Số điện thoại
                        </span>
                    }
                    name="numberPhone"
                    rules={[{ validator: validatePhone }]}
                    style={{ marginBottom: "18px" }}
                >
                    <Input
                        prefix={<PhoneOutlined style={{ color: "#718096" }} />}
                        placeholder="Nhập số điện thoại (VD: 0912345678)"
                        style={{
                            borderRadius: "10px",
                            border: "2px solid #e2e8f0",
                            padding: "10px 14px",
                            fontSize: "15px",
                            transition: "all 0.3s ease"
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span style={{
                            color: "#2d3748",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}>
                            👥 Vai trò
                        </span>
                    }
                    name="role"
                    rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                    style={{ marginBottom: "18px" }}
                >
                    <Select
                        placeholder="Chọn vai trò của bạn"
                        style={{
                            borderRadius: "10px"
                        }}
                        suffixIcon={<TeamOutlined style={{ color: "#718096" }} />}
                    >
                        <Option value="ROLE_ADMIN">🔧 Quản trị viên</Option>
                        <Option value="ROLE_STAFF">👨‍💼 Quản lý phòng trọ</Option>
                    </Select>
                </Form.Item>





                <Form.Item style={{ marginBottom: "20px" }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{
                            height: "48px",
                            background: loading
                                ? "#86efac"
                                : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "600",
                            boxShadow: "0 8px 20px rgba(34, 197, 94, 0.4)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.background = "linear-gradient(135deg, #16a34a 0%, #15803d 100%)";
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 12px 25px rgba(34, 197, 94, 0.5)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.background = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 8px 20px rgba(34, 197, 94, 0.4)";
                            }
                        }}
                    >
                        {loading ? "🔄 Đang cập nhật..." : "✨ Cập nhật tài khoản"}
                    </Button>
                </Form.Item>


            </Form>
        </Modal>


    )
}
export default ModalUpdateAdmin;

