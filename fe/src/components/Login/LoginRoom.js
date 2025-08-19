import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import LoginService from "../../services/LoginService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginRoom = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await LoginService.loginRoom(values);
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('userName', response.name);
            localStorage.setItem('email', response.email);
            message.success("Đăng nhập thành công!");
            setTimeout(() => {
                navigate('/statistical')
            }, 1000);
            if (onLogin) onLogin(values);
        } catch (error) {
            if (error.response?.data?.message) {
                message.error(error.response.data.message)
            }
        } finally {
            setLoading(false);
        }
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
                    background: "rgba(99, 179, 237, 0.1)",
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
                    background: "rgba(56, 161, 105, 0.1)",
                    borderRadius: "50%",
                    filter: "blur(60px)"
                }}
            />

            <Card
                style={{
                    width: 450,
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
                <div style={{ textAlign: "center", marginBottom: 35 }}>
                    {/* Logo/Icon */}
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient(135deg, #3182ce 0%, #63b3ed 100%)",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px auto",
                            boxShadow: "0 10px 30px rgba(49, 130, 206, 0.4)"
                        }}
                    >
                        <HomeOutlined style={{ fontSize: 35, color: "white" }} />
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
                        🏠 Hostel Manager
                    </Title>
                    <Text 
                        style={{ 
                            color: "#718096", 
                            fontSize: "16px",
                            marginTop: "8px",
                            display: "block"
                        }}
                    >
                        Hệ thống quản lý phòng trọ chuyên nghiệp
                    </Text>
                </div>

                {/* Login Form */}
                <Form
                    name="login_form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        label={
                            <span style={{ 
                                color: "#2d3748", 
                                fontWeight: "600",
                                fontSize: "15px"
                            }}>
                                📧 Tên đăng nhập/Email
                            </span>
                        }
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                        style={{ marginBottom: "20px" }}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập email hoặc tên đăng nhập"
                            style={{
                                borderRadius: "12px",
                                border: "2px solid #e2e8f0",
                                padding: "12px 16px",
                                fontSize: "15px",
                                transition: "all 0.3s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#3182ce";
                                e.target.style.boxShadow = "0 0 0 3px rgba(49, 130, 206, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e2e8f0";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <span style={{ 
                                color: "#2d3748", 
                                fontWeight: "600",
                                fontSize: "15px"
                            }}>
                                🔐 Mật khẩu
                            </span>
                        }
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        style={{ marginBottom: "30px" }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#718096" }} />}
                            placeholder="Nhập mật khẩu của bạn"
                            style={{
                                borderRadius: "12px",
                                border: "2px solid #e2e8f0",
                                padding: "12px 16px",
                                fontSize: "15px",
                                transition: "all 0.3s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#3182ce";
                                e.target.style.boxShadow = "0 0 0 3px rgba(49, 130, 206, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e2e8f0";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: "50px",
                                background: loading 
                                    ? "#93c5fd" 
                                    : "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600",
                                boxShadow: "0 8px 20px rgba(49, 130, 206, 0.4)",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 12px 25px rgba(49, 130, 206, 0.5)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.background = "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)";
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 8px 20px rgba(49, 130, 206, 0.4)";
                                }
                            }}
                        >
                            {loading ? "🔄 Đang đăng nhập..." : "🚀 Đăng nhập hệ thống"}
                        </Button>
                    </Form.Item>
                </Form>

                {/* Footer */}
                <div style={{ 
                    textAlign: "center", 
                    marginTop: "25px",
                    paddingTop: "20px",
                    borderTop: "1px solid #e2e8f0"
                }}>
                    <Text style={{ 
                        color: "#a0aec0", 
                        fontSize: "13px"
                    }}>
                        © 2025 Hostel Management System
                    </Text>
                    <br />
                    <Text style={{ 
                        color: "#a0aec0", 
                        fontSize: "13px"
                    }}>
                        Phiên bản 1.0 - Bảo mật & Tin cậy
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
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .ant-card {
                    animation: fadeInUp 0.6s ease-out;
                }
                
                .ant-btn-primary:not(:disabled):hover {
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default LoginRoom;