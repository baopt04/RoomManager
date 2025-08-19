import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import LoginService from "../../services/LoginService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    
    const registerRoom = async (values) => {
        setLoading(true);
        try {
            const response = await LoginService.registerRoom(values);
            console.log("Check response register", response);
            message.success("Đăng ký thành công! Vui lòng đăng nhập.");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            message.error("Đăng ký thất bại. Vui lòng thử lại!");
            console.error("Register error:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Background decorations */}
            <div
                style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "200px",
                    height: "200px",
                    background: "rgba(34, 197, 94, 0.1)",
                    borderRadius: "50%",
                    filter: "blur(40px)"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-100px",
                    left: "-100px",
                    width: "300px",
                    height: "300px",
                    background: "rgba(99, 179, 237, 0.1)",
                    borderRadius: "50%",
                    filter: "blur(60px)"
                }}
            />

            <Card
                style={{
                    width: 500,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    position: "relative",
                    zIndex: 1
                }}
                bodyStyle={{ padding: "40px 40px 30px 40px" }}
            >
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 30 }}>
                    {/* Logo/Icon */}
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px auto",
                            boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)"
                        }}
                    >
                        <UserAddOutlined style={{ fontSize: 35, color: "white" }} />
                    </div>

                    <Title 
                        level={2} 
                        style={{ 
                            margin: 0, 
                            color: "#2d3748",
                            fontWeight: "700",
                            fontSize: "28px"
                        }}
                    >
                        🏠 Đăng ký tài khoản
                    </Title>
                    <Text 
                        style={{ 
                            color: "#718096", 
                            fontSize: "16px",
                            marginTop: "8px",
                            display: "block"
                        }}
                    >
                        Tạo tài khoản quản lý phòng trọ mới
                    </Text>
                </div>

                {/* Register Form */}
                <Form
                    form={form}
                    name="register_form"
                    layout="vertical"
                    onFinish={registerRoom}
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
                            <Option value="admin">🔧 Quản trị viên</Option>
                            <Option value="manager">👨‍💼 Quản lý phòng trọ</Option>
                            <Option value="staff">👤 Nhân viên</Option>
                            <Option value="owner">🏠 Chủ phòng trọ</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={
                            <span style={{ 
                                color: "#2d3748", 
                                fontWeight: "600",
                                fontSize: "14px"
                            }}>
                                🔐 Mật khẩu
                            </span>
                        }
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                        ]}
                        style={{ marginBottom: "18px" }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
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
                                🔒 Xác nhận mật khẩu
                            </span>
                        }
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                        style={{ marginBottom: "25px" }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập lại mật khẩu"
                            style={{
                                borderRadius: "10px",
                                border: "2px solid #e2e8f0",
                                padding: "10px 14px",
                                fontSize: "15px",
                                transition: "all 0.3s ease"
                            }}
                        />
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
                            {loading ? "🔄 Đang đăng ký..." : "✨ Tạo tài khoản"}
                        </Button>
                    </Form.Item>

                    {/* Login Link */}
                    <div style={{ textAlign: "center" }}>
                        <Text style={{ color: "#718096", fontSize: "14px" }}>
                            Đã có tài khoản?{" "}
                        </Text>
                        <Button
                            type="link"
                            onClick={goToLogin}
                            style={{
                                color: "#3182ce",
                                fontWeight: "600",
                                fontSize: "14px",
                                padding: 0,
                                height: "auto"
                            }}
                        >
                            Đăng nhập ngay
                        </Button>
                    </div>
                </Form>

                {/* Footer */}
                <div style={{ 
                    textAlign: "center", 
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #e2e8f0"
                }}>
                    <Text style={{ 
                        color: "#a0aec0", 
                        fontSize: "12px"
                    }}>
                        © 2025 Hostel Management System
                    </Text>
                </div>
            </Card>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .ant-card {
                    animation: fadeInUp 0.6s ease-out;
                }
                
                .ant-input:focus,
                .ant-input-focused,
                .ant-select-focused .ant-select-selector {
                    border-color: #22c55e !important;
                    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1) !important;
                }
                
                .ant-select-selector {
                    border-radius: 10px !important;
                    border: 2px solid #e2e8f0 !important;
                    padding: 8px 12px !important;
                }
            `}</style>
        </div>
    );
};

export default Register;